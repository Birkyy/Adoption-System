using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Services
{
    public class EventService
    {
        private readonly IMongoCollection<Event> _eventsCollection;

        public EventService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(
                petStoreDatabaseSettings.Value.DatabaseName
            );

            _eventsCollection = mongoDatabase.GetCollection<Event>(
                petStoreDatabaseSettings.Value.EventCollectionName
            );
        }

        public async Task CreateAsync(Event newEvent)
        {
            if (newEvent.ParticipantIds == null)
            {
                newEvent.ParticipantIds = new List<string>();
            }
            // Default to empty list if documents are null
            if (newEvent.ProposalDocuments == null)
            {
                newEvent.ProposalDocuments = new List<string>();
            }

            await _eventsCollection.InsertOneAsync(newEvent);
        }

        public async Task<List<Event>> GetByNgoIdAsync(string ngoId) =>
            await _eventsCollection.Find(x => x.NgoId == ngoId).ToListAsync();

        public async Task<List<Event>> GetAllAsync() =>
            await _eventsCollection.Find(_ => true).ToListAsync();

        public async Task<(List<Event> Events, long TotalCount)> GetApprovedAsync(
            string? search = null,
            string? location = null,
            string? date = null,
            int pageNumber = 1,
            int pageSize = 6
        ) // Events are bigger cards, so 6 per page is good
        {
            // 1. Auto-complete past events (Maintenance)
            var maintenanceFilter = Builders<Event>.Filter.And(
                Builders<Event>.Filter.Eq(e => e.Status, "Approved"),
                Builders<Event>.Filter.Lt(e => e.EventDate, DateTime.UtcNow)
            );
            var update = Builders<Event>.Update.Set(e => e.Status, "Completed");
            await _eventsCollection.UpdateManyAsync(maintenanceFilter, update);

            // 2. Build Query
            var builder = Builders<Event>.Filter;
            var filter = builder.Eq(e => e.Status, "Approved");

            // Filter: Search (Title or Description)
            if (!string.IsNullOrEmpty(search))
            {
                var regex = new BsonRegularExpression(search, "i");
                var searchFilter = builder.Or(
                    builder.Regex(e => e.Title, regex),
                    builder.Regex(e => e.Description, regex)
                );
                filter &= searchFilter;
            }

            // Filter: Location
            if (!string.IsNullOrEmpty(location))
            {
                filter &= builder.Regex(e => e.Location, new BsonRegularExpression(location, "i"));
            }

            // Filter: Date (Exact Day Match)
            if (!string.IsNullOrEmpty(date) && DateTime.TryParse(date, out DateTime parsedDate))
            {
                // Create a range for the whole day (00:00 to 23:59)
                var startOfDay = parsedDate.Date; // 00:00:00
                var endOfDay = startOfDay.AddDays(1); // Next day 00:00:00

                filter &=
                    builder.Gte(e => e.EventDate, startOfDay)
                    & builder.Lt(e => e.EventDate, endOfDay);
            }

            // 3. Get Total Count (for Pagination)
            var totalRecords = await _eventsCollection.CountDocumentsAsync(filter);

            // 4. Get Data (Sorted by Soonest Date)
            var events = await _eventsCollection
                .Find(filter)
                .SortBy(e => e.EventDate)
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return (events, totalRecords);
        }

        public async Task<List<Event>> GetPendingByNgoIdAsync(string ngoId) =>
            await _eventsCollection
                .Find(x => x.NgoId == ngoId && x.Status == "Pending")
                .ToListAsync();

        public async Task<List<Event>> GetByCreatorIdAsync(string userId) =>
            await _eventsCollection.Find(x => x.CreatedById == userId).ToListAsync();

        public async Task<Event?> GetByIdAsync(string id) =>
            await _eventsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task UpdateStatusAsync(string id, string newStatus)
        {
            var updateDef = Builders<Event>.Update.Set(e => e.Status, newStatus);
            await _eventsCollection.UpdateOneAsync(x => x.Id == id, updateDef);
        }

        public async Task JoinEventAsync(string eventId, string userId)
        {
            var update = Builders<Event>.Update.AddToSet(e => e.ParticipantIds, userId);
            await _eventsCollection.UpdateOneAsync(e => e.Id == eventId, update);
        }

        public async Task UpdateDetailsAsync(string id, Event updatedEvent)
        {
            var update = Builders<Event>
                .Update.Set(e => e.Title, updatedEvent.Title)
                .Set(e => e.Description, updatedEvent.Description)
                .Set(e => e.EventDate, updatedEvent.EventDate)
                .Set(e => e.Location, updatedEvent.Location)
                .Set(e => e.ImageUrl, updatedEvent.ImageUrl);

            await _eventsCollection.UpdateOneAsync(e => e.Id == id, update);
        }

        public async Task LeaveEventAsync(string eventId, string userId)
        {
            var updateDef = Builders<Event>.Update.Pull(e => e.ParticipantIds, userId);
            await _eventsCollection.UpdateOneAsync(x => x.Id == eventId, updateDef);
        }

        public async Task RemoveAsync(string id) =>
            await _eventsCollection.DeleteOneAsync(x => x.Id == id);

        public async Task ApproveProposalAsync(string id)
        {
            var ev = await GetByIdAsync(id);
            if (ev == null)
                return;

            var update = Builders<Event>
                .Update.Set(e => e.Status, "Approved")
                .AddToSet(e => e.ParticipantIds, ev.CreatedById);

            await _eventsCollection.UpdateOneAsync(e => e.Id == id, update);
        }
    }
}
