using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    public class Pet
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? PetId { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; } = null!;

        public string Species { get; set; } = null!;

        public string Breed { get; set; } = null!;

        public int Age { get; set; }

        public string? Description { get; set; }

        public string Status { get; set; } = "Available";

        public List<string> Photos { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.ObjectId)]
        public string? NgoId { get; set; }
    }
}
