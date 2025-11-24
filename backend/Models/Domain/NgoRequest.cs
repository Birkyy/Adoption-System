using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    public class NgoRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string OrganizationName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string ContactInfo { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string? WebsiteUrl { get; set; }

        public string Status { get; set; } = "Pending";

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    }
}
