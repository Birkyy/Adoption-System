using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    public class AdoptionApplication
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? ApplicationId { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string ApplicantId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string AnimalId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string NgoId { get; set; } = null!;

        public string Status { get; set; } = "Pending";

        public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;
    }
}
