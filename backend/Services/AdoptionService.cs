using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class AdoptionService
    {
        private readonly IMongoCollection<AdoptionApplication> _applicationsCollection;

        public AdoptionService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(
                petStoreDatabaseSettings.Value.DatabaseName
            );

            _applicationsCollection = mongoDatabase.GetCollection<AdoptionApplication>(
                petStoreDatabaseSettings.Value.AdoptionApplicationCollectionName
            );
        }

        // 1. CREATE: User submits an application
        public async Task CreateAsync(AdoptionApplication newApplication)
        {
            // Force status to Pending just in case
            newApplication.Status = "Pending";
            newApplication.SubmissionDate = DateTime.UtcNow;

            await _applicationsCollection.InsertOneAsync(newApplication);
        }

        // 2. READ (NGO Dashboard): Get applications for a specific NGO
        // This effectively says: "Show me requests for pets that *I* manage."
        public async Task<List<AdoptionApplication>> GetByNgoIdAsync(string ngoId)
        {
            return await _applicationsCollection.Find(x => x.NgoId == ngoId).ToListAsync();
        }

        // 3. READ (User History): Get applications submitted by a specific Public User
        public async Task<List<AdoptionApplication>> GetByApplicantIdAsync(string applicantId)
        {
            return await _applicationsCollection
                .Find(x => x.ApplicantId == applicantId)
                .ToListAsync();
        }

        // 4. UPDATE: NGO Approves or Rejects
        public async Task UpdateStatusAsync(string applicationId, string newStatus)
        {
            // Use UpdateOne for efficiency (instead of ReplaceOne)
            var updateDef = Builders<AdoptionApplication>.Update.Set(a => a.Status, newStatus);

            await _applicationsCollection.UpdateOneAsync(
                x => x.ApplicationId == applicationId,
                updateDef
            );
        }

        // Helper: Get one application (Useful for validation before updating)
        public async Task<AdoptionApplication?> GetByIdAsync(string id) =>
            await _applicationsCollection.Find(x => x.ApplicationId == id).FirstOrDefaultAsync();
    }
}
