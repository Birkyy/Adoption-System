using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Bson; // Required for Regex
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

        // --- NEW: Public Feed with Pagination & Search ---
        public async Task<(List<Article> Articles, long TotalCount)> GetPublishedAsync(
            string? search = null,
            string? category = null,
            int pageNumber = 1,
            int pageSize = 6
        )
        {
            var builder = Builders<Article>.Filter;
            // 1. Base Filter: Must be Approved OR Published
            var filter = builder.Or(
                builder.Eq(a => a.Status, "Approved"),
                builder.Eq(a => a.Status, "Published")
            );

            // 2. Search (Title or Content)
            if (!string.IsNullOrEmpty(search))
            {
                var regex = new BsonRegularExpression(search, "i");
                var searchFilter = builder.Or(
                    builder.Regex(a => a.Title, regex),
                    builder.Regex(a => a.Content, regex)
                );
                filter = builder.And(filter, searchFilter);
            }

            // 3. Category Filter
            if (!string.IsNullOrEmpty(category) && category != "All")
            {
                filter = builder.And(filter, builder.AnyEq(a => a.Categories, category));
            }

            // 4. Execute Query
            var totalRecords = await _articlesCollection.CountDocumentsAsync(filter);

            var articles = await _articlesCollection
                .Find(filter)
                .SortByDescending(a => a.PublishDate) // Newest first
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return (articles, totalRecords);
        }

        // ... (Keep existing CreateAsync, GetByIdAsync, etc.) ...

        public async Task CreateAsync(Article newArticle)
        {
            newArticle.Status = "Pending";
            newArticle.PublishDate = DateTime.UtcNow;
            await _articlesCollection.InsertOneAsync(newArticle);
        }

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
                .Set(a => a.CoverImageUrl, updatedArticle.CoverImageUrl)
                .Set(a => a.Categories, updatedArticle.Categories)
                .Set(a => a.PublishDate, DateTime.UtcNow); // Refresh date on edit

            await _articlesCollection.UpdateOneAsync(x => x.ArticleId == articleId, updateDef);
        }

        public async Task RemoveAsync(string articleId) =>
            await _articlesCollection.DeleteOneAsync(x => x.ArticleId == articleId);
    }
}
