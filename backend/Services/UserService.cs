using backend.Models.Domain;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

public class UserService
{
    private readonly IMongoCollection<User> _usersCollection;

    public UserService(IOptions<PetStoreDatabaseSettings> petStoreDatabaseSettings)
    {
        var mongoClient = new MongoClient(petStoreDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(petStoreDatabaseSettings.Value.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(
            petStoreDatabaseSettings.Value.UserCollectionName
        );
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    public async Task CreateNgoAsync(NGO newNgo)
    {
        newNgo.UserRole = "NGO";
        await _usersCollection.InsertOneAsync(newNgo);
    }

    public async Task CreatePublicAsync(Public newPublic)
    {
        newPublic.UserRole = "Public";
        await _usersCollection.InsertOneAsync(newPublic);
    }

    public async Task<User?> LoginAsync(string email, string password)
    {
        return await _usersCollection
            .Find(x => x.Email == email && x.Password == password)
            .FirstOrDefaultAsync();
    }
}
