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

        public async Task CreateAsync(AdoptionApplication newApplication)
        {
            newApplication.Status = "Pending";
            newApplication.SubmissionDate = DateTime.UtcNow;

            await _applicationsCollection.InsertOneAsync(newApplication);
        }

        public async Task<List<AdoptionApplication>> GetByNgoIdAsync(string ngoId)
        {
            return await _applicationsCollection.Find(x => x.NgoId == ngoId).ToListAsync();
        }

        public async Task<List<AdoptionApplication>> GetByApplicantIdAsync(string applicantId)
        {
            return await _applicationsCollection
                .Find(x => x.ApplicantId == applicantId)
                .ToListAsync();
        }

        public async Task UpdateStatusAsync(string applicationId, string newStatus)
        {
            var updateDef = Builders<AdoptionApplication>.Update.Set(a => a.Status, newStatus);

            await _applicationsCollection.UpdateOneAsync(
                x => x.ApplicationId == applicationId,
                updateDef
            );
        }

        public async Task<AdoptionApplication?> GetByIdAsync(string id) =>
            await _applicationsCollection.Find(x => x.ApplicationId == id).FirstOrDefaultAsync();
    }
}
