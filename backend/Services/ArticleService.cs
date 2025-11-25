using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class ArticleService
    {
        private readonly IMongoCollection<Article> _articlesCollection;

        public ArticleService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(
                petStoreDatabaseSettings.Value.DatabaseName
            );

            _articlesCollection = mongoDatabase.GetCollection<Article>(
                petStoreDatabaseSettings.Value.ArticleCollectionName
            );
        }

        public async Task CreateAsync(Article newArticle)
        {
            newArticle.Status = "Pending";
            newArticle.PublishDate = DateTime.UtcNow;
            await _articlesCollection.InsertOneAsync(newArticle);
        }

        public async Task<List<Article>> GetPublishedAsync() =>
            await _articlesCollection
                .Find(x => x.Status == "Approved" || x.Status == "Published")
                .ToListAsync();

        public async Task<List<Article>> GetAllAsync() =>
            await _articlesCollection.Find(_ => true).ToListAsync();

        public async Task<List<Article>> GetByStatusAsync(string status) =>
            await _articlesCollection.Find(x => x.Status == status).ToListAsync();

        public async Task<Article?> GetByIdAsync(string articleId) =>
            await _articlesCollection.Find(x => x.ArticleId == articleId).FirstOrDefaultAsync();

        public async Task<List<Article>> GetByAuthorIdAsync(string authorId) =>
            await _articlesCollection.Find(x => x.AuthorId == authorId).ToListAsync();

        public async Task UpdateStatusAsync(string articleId, string newStatus)
        {
            var updateDef = Builders<Article>.Update.Set(a => a.Status, newStatus);
            await _articlesCollection.UpdateOneAsync(x => x.ArticleId == articleId, updateDef);
        }

        public async Task UpdateArticleAsync(string articleId, Article updatedArticle)
        {
            var updateDef = Builders<Article>
                .Update.Set(a => a.Title, updatedArticle.Title)
                .Set(a => a.Content, updatedArticle.Content)
                .Set(a => a.PublishDate, DateTime.UtcNow);

            await _articlesCollection.UpdateOneAsync(x => x.ArticleId == articleId, updateDef);
        }

        public async Task RemoveAsync(string articleId) =>
            await _articlesCollection.DeleteOneAsync(x => x.ArticleId == articleId);
    }
}
