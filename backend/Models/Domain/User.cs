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
        public string? Id { get; set; }

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string ContactInfo { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string UserRole { get; set; } = null!;
    }
}
