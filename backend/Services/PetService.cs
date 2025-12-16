using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson; // <--- REQUIRED for Regex
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

        // GET PETS with Filters + Pagination
        // Returns a Tuple: (List of Pets, Total Count)
        public async Task<(List<Pet> Pets, long TotalCount)> GetAsync(
            string? name = null,
            string? breed = null,
            string? species = null,
            string? age = null,
            string? gender = null, // <--- 1. New Gender Filter
            string? status = null,
            int pageNumber = 1, // <--- 2. Pagination Params
            int pageSize = 10
        )
        {
            var builder = Builders<Pet>.Filter;
            var filter = builder.Empty;

            // 3. Usability: Case-Insensitive Fuzzy Search
            if (!string.IsNullOrEmpty(name))
            {
                filter &= builder.Regex(p => p.Name, new BsonRegularExpression(name, "i"));
            }

            if (!string.IsNullOrEmpty(breed))
            {
                filter &= builder.Regex(p => p.Breed, new BsonRegularExpression(breed, "i"));
            }

            if (!string.IsNullOrEmpty(species) && species != "All")
            {
                filter &= builder.Eq(p => p.Species, species);
            }

            if (!string.IsNullOrEmpty(age))
            {
                filter &= builder.Eq(p => p.Age, age);
            }

            // 4. Performance: Filter Gender at Database Level
            if (!string.IsNullOrEmpty(gender) && gender != "All")
            {
                filter &= builder.Eq(p => p.Gender, gender);
            }

            if (!string.IsNullOrEmpty(status))
            {
                filter &= builder.Eq(p => p.Status, status);
            }

            // 5. Scalability: Get Total Count (for "Page 1 of 50")
            var totalRecords = await _petsCollection.CountDocumentsAsync(filter);

            // 6. Scalability: Get only the requested slice of data
            var pets = await _petsCollection
                .Find(filter)
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return (pets, totalRecords);
        }
    }
}
