using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson; // Required for Regex
using MongoDB.Driver;

namespace backend.Services
{
    public class VolunteerService
    {
        private readonly IMongoCollection<Volunteer> _volunteerCollection;

        public VolunteerService(IOptions<PetStoreDatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _volunteerCollection = mongoDatabase.GetCollection<Volunteer>(
                settings.Value.VolunteerCollectionName
            );
        }

        // --- NEW: Public Feed with Pagination ---
        public async Task<(List<Volunteer> Listings, long TotalCount)> GetAvailableAsync(
            string? search = null,
            int pageNumber = 1,
            int pageSize = 6
        )
        {
            var builder = Builders<Volunteer>.Filter;
            // Only show listings that are NOT "Closed" (assuming you have a status, or just show all)
            var filter = builder.Empty;

            if (!string.IsNullOrEmpty(search))
            {
                var regex = new BsonRegularExpression(search, "i");
                filter &=
                    builder.Regex(v => v.Title, regex) | builder.Regex(v => v.Description, regex);
            }

            var totalRecords = await _volunteerCollection.CountDocumentsAsync(filter);

            var listings = await _volunteerCollection
                .Find(filter)
                .SortByDescending(v => v.DatePosted) // Newest first
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return (listings, totalRecords);
        }

        // ... Keep existing methods ...
        public async Task CreateAsync(Volunteer newListing)
        {
            newListing.DatePosted = DateTime.UtcNow;
            if (newListing.ApplicantIds == null)
                newListing.ApplicantIds = new List<string>();
            await _volunteerCollection.InsertOneAsync(newListing);
        }

        public async Task<List<Volunteer>> GetAllAsync() =>
            await _volunteerCollection.Find(_ => true).ToListAsync();

        public async Task<List<Volunteer>> GetByNgoIdAsync(string ngoId) =>
            await _volunteerCollection.Find(x => x.NgoId == ngoId).ToListAsync();

        public async Task<Volunteer?> GetByIdAsync(string id) =>
            await _volunteerCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task ApplyAsync(string id, string userId)
        {
            var update = Builders<Volunteer>.Update.AddToSet(v => v.ApplicantIds, userId);
            await _volunteerCollection.UpdateOneAsync(v => v.Id == id, update);
        }

        public async Task RemoveAsync(string id) =>
            await _volunteerCollection.DeleteOneAsync(x => x.Id == id);
    }
}
