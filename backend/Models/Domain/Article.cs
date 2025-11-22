using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    public class Article
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Title { get; set; } = null!;

        public string Content { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string AuthorId { get; set; } = null!;

        public DateTime PublishDate { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Pending";

        public string? CoverImageUrl { get; set; }
    }
}
