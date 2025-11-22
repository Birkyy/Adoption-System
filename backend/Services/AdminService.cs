using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class AdminService
    {
        private readonly IMongoCollection<Article> _articlesCollection;
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Event> _eventsCollection;

        public AdminService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(
                petStoreDatabaseSettings.Value.DatabaseName
            );

            _articlesCollection = mongoDatabase.GetCollection<Article>(
                petStoreDatabaseSettings.Value.ArticleCollectionName
            );

            _usersCollection = mongoDatabase.GetCollection<User>(
                petStoreDatabaseSettings.Value.UserCollectionName
            );

            _eventsCollection = mongoDatabase.GetCollection<Event>(
                petStoreDatabaseSettings.Value.EventCollectionName
            );
        }

        // APPROVE ARTICLE
        public async Task ApproveArticleAsync(string articleId)
        {
            var updateDef = Builders<Article>.Update.Set(a => a.Status, "Approved");

            await _articlesCollection.UpdateOneAsync(a => a.Id == articleId, updateDef);
        }

        // REJECT ARTICLE
        public async Task RejectArticleAsync(string articleId)
        {
            var updateDef = Builders<Article>.Update.Set(a => a.Status, "Rejected");

            await _articlesCollection.UpdateOneAsync(a => a.Id == articleId, updateDef);
        }

        // DELETE USER (Ban/Remove account)
        public async Task DeleteUserAsync(string userId)
        {
            await _usersCollection.DeleteOneAsync(u => u.Id == userId);
        }

        // DELETE INAPPROPRIATE EVENT
        public async Task DeleteEventAsync(string eventId)
        {
            await _eventsCollection.DeleteOneAsync(e => e.Id == eventId);
        }

        // Get all pending articles for the Admin dashboard
        public async Task<List<Article>> GetPendingArticlesAsync() =>
            await _articlesCollection.Find(a => a.Status == "Pending").ToListAsync();
    }
}
