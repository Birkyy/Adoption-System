using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    public class Event
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string CreatedById { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string? NgoId { get; set; }

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string? Location { get; set; }

        public DateTime EventDate { get; set; }

        public string Status { get; set; } = "Pending";

        public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> ParticipantIds { get; set; } = new List<string>();
    }
}
