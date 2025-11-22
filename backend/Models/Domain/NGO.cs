using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    [BsonDiscriminator("NGO")]
    public class NGO : User
    {
        public string Address { get; set; } = null!;

        public string? WebsiteUrl { get; set; }

        public string? Description { get; set; }
    }
}
