using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
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

            await _eventsCollection.InsertOneAsync(newEvent);
        }

        public async Task<List<Event>> GetApprovedAsync() =>
            await _eventsCollection.Find(x => x.Status == "Approved").ToListAsync();

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

        public async Task UpdateDetailsAsync(string id, Event updatedEvent)
        {
            var updateDef = Builders<Event>
                .Update.Set(e => e.Title, updatedEvent.Title)
                .Set(e => e.Description, updatedEvent.Description)
                .Set(e => e.EventDate, updatedEvent.EventDate)
                .Set(e => e.Location, updatedEvent.Location);

            await _eventsCollection.UpdateOneAsync(x => x.Id == id, updateDef);
        }

        public async Task JoinEventAsync(string eventId, string userId)
        {
            var updateDef = Builders<Event>.Update.AddToSet(e => e.ParticipantIds, userId);

            await _eventsCollection.UpdateOneAsync(x => x.Id == eventId, updateDef);
        }

        public async Task LeaveEventAsync(string eventId, string userId)
        {
            var updateDef = Builders<Event>.Update.Pull(e => e.ParticipantIds, userId);

            await _eventsCollection.UpdateOneAsync(x => x.Id == eventId, updateDef);
        }

        public async Task RemoveAsync(string id) =>
            await _eventsCollection.DeleteOneAsync(x => x.Id == id);
    }
}
