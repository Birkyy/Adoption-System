using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class PetService
    {
        private readonly IMongoCollection<Pet> _petsCollection;

        public PetService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                petStoreDatabaseSettings.Value.DatabaseName
            );

            _petsCollection = mongoDatabase.GetCollection<Pet>(
                petStoreDatabaseSettings.Value.PetCollectionName
            );
        }

        // GET ONE PET BY ID
        public async Task<Pet?> GetAsync(string id) =>
            await _petsCollection.Find(x => x.PetId == id).FirstOrDefaultAsync();

        // CREATE NEW PET
        public async Task CreateAsync(Pet newPet) => await _petsCollection.InsertOneAsync(newPet);

        // UPDATE PET
        public async Task UpdateAsync(string id, Pet updatedPet) =>
            await _petsCollection.ReplaceOneAsync(x => x.PetId == id, updatedPet);

        // DELETE PET
        public async Task RemoveAsync(string id) =>
            await _petsCollection.DeleteOneAsync(x => x.PetId == id);

        // Get pets with optional filters
        public async Task<List<Pet>> GetAsync(
            string? name = null,
            string? breed = null,
            string? species = null,
            int? age = null,
            string? status = null
        )
        {
            var builder = Builders<Pet>.Filter;

            var filter = builder.Empty;

            if (!string.IsNullOrEmpty(name))
            {
                filter &= builder.Eq(p => p.Name, name);
            }

            if (!string.IsNullOrEmpty(breed))
            {
                filter &= builder.Eq(p => p.Breed, breed);
            }

            if (!string.IsNullOrEmpty(species))
            {
                filter &= builder.Eq(p => p.Species, species);
            }

            if (age.HasValue)
            {
                filter &= builder.Eq(p => p.Age, age.Value);
            }

            if (!string.IsNullOrEmpty(status))
            {
                filter &= builder.Eq(p => p.Status, status);
            }

            return await _petsCollection.Find(filter).ToListAsync();
        }
    }
}
