using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    [BsonDiscriminator(RootClass = true)]
    [BsonKnownTypes(typeof(NGO), typeof(Public), typeof(Admin))]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? ContactInfo { get; set; }

        public string? Name { get; set; }

        public string? Bio { get; set; }

        public string? Avatar { get; set; }

        public string? UserRole { get; set; }

        public string Status { get; set; } = "Active";
    }
}
