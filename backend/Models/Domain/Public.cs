using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Domain
{
    [BsonDiscriminator("Public")]
    public class Public : User { }
}
