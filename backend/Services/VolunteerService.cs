using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class VolunteerService
    {
        private readonly IMongoCollection<Volunteer> _volunteerCollection;

        public VolunteerService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(
                petStoreDatabaseSettings.Value.DatabaseName
            );

            // Ideally add "VolunteerCollectionName" to your settings,
            // but for now we can hardcode or reuse a generic collection name if needed.
            _volunteerCollection = mongoDatabase.GetCollection<Volunteer>("Volunteers");
        }

        public async Task<List<Volunteer>> GetAllAsync() =>
            await _volunteerCollection
                .Find(_ => true)
                .SortByDescending(x => x.DatePosted)
                .ToListAsync();

        public async Task<List<Volunteer>> GetByNgoIdAsync(string ngoId) =>
            await _volunteerCollection.Find(x => x.NgoId == ngoId).ToListAsync();

        public async Task<Volunteer?> GetByIdAsync(string id) =>
            await _volunteerCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Volunteer newListing)
        {
            newListing.DatePosted = DateTime.UtcNow;
            await _volunteerCollection.InsertOneAsync(newListing);
        }

        public async Task ApplyAsync(string listingId, string userId)
        {
            var update = Builders<Volunteer>.Update.AddToSet(x => x.ApplicantIds, userId);
            await _volunteerCollection.UpdateOneAsync(x => x.Id == listingId, update);
        }

        public async Task RemoveAsync(string id) =>
            await _volunteerCollection.DeleteOneAsync(x => x.Id == id);
    }
}
