using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    [BsonDiscriminator("Admin")]
    public class Admin : User { }
}
