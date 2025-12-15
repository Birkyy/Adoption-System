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

        public async Task<List<User>> GetUsersByIdsAsync(List<string> userIds)
        {
            var filter = Builders<User>.Filter.In(u => u.Id, userIds);
            return await _usersCollection.Find(filter).ToListAsync();
        }

        private string HashPassword(string plainPassword)
        {
            return BCrypt.Net.BCrypt.HashPassword(plainPassword);
        }

        public async Task<List<NGO>> GetAllNgosAsync()
        {
            var users = await _usersCollection.Find(u => u.UserRole == "NGO").ToListAsync();

            return users.OfType<NGO>().ToList();
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task CreateNgoAsync(NGO newNgo)
        {
            newNgo.UserRole = "NGO";
            newNgo.Password = HashPassword(newNgo.Password);
            // Ensure Status is set if not already (though controller sets it usually)
            if (string.IsNullOrEmpty(newNgo.Status))
                newNgo.Status = "Pending";
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

        public async Task UpdateAsync(string id, User updatedUser)
        {
            // This replaces the document with the new data
            await _usersCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);
        }

        public async Task<bool> IsEmailTakenAsync(string email, string excludeUserId)
        {
            return await _usersCollection
                .Find(u => u.Email == email && u.Id != excludeUserId)
                .AnyAsync();
        }

        public async Task<List<User>> GetPendingNgosAsync()
        {
            return await _usersCollection
                .Find(u => u.UserRole == "NGO" && u.Status == "Pending")
                .ToListAsync();
        }

        public async Task RemoveAsync(string userId)
        {
            await _usersCollection.DeleteOneAsync(u => u.Id == userId);
        }
    }
}
