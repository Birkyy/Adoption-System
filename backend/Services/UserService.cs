using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(
                petStoreDatabaseSettings.Value.DatabaseName
            );

            _usersCollection = mongoDatabase.GetCollection<User>(
                petStoreDatabaseSettings.Value.UserCollectionName
            );
        }

        private string HashPassword(string plainPassword)
        {
            return BCrypt.Net.BCrypt.HashPassword(plainPassword);
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateNgoAsync(NGO newNgo)
        {
            newNgo.UserRole = "NGO";
            newNgo.Password = HashPassword(newNgo.Password);
            await _usersCollection.InsertOneAsync(newNgo);
        }

        public async Task CreatePublicAsync(Public newPublic)
        {
            newPublic.UserRole = "Public";
            newPublic.Password = HashPassword(newPublic.Password);
            await _usersCollection.InsertOneAsync(newPublic);
        }

        public async Task CreateAdminAsync(Admin newAdmin)
        {
            newAdmin.UserRole = "Admin";
            newAdmin.Password = HashPassword(newAdmin.Password);
            await _usersCollection.InsertOneAsync(newAdmin);
        }

        public async Task<User?> LoginAsync(string email, string plainPassword)
        {
            var user = await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

            if (user == null)
                return null;

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(plainPassword, user.Password);

            if (!isPasswordValid)
                return null;

            return user;
        }

        public async Task RemoveAsync(string userId)
        {
            await _usersCollection.DeleteOneAsync(u => u.Id == userId);
        }
    }
}
