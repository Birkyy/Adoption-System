using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    public class Volunteer
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string NgoId { get; set; } = null!;

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string? Location { get; set; }

        public string? SkillsRequired { get; set; } // e.g. "Dog Walking, Cleaning"

        public DateTime DatePosted { get; set; } = DateTime.UtcNow;

        // Stores the User IDs of people who clicked "Apply"
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> ApplicantIds { get; set; } = new List<string>();
    }
}
