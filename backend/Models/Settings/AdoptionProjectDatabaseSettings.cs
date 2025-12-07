namespace backend.Models.Settings
{
    public class PetStoreDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string PetCollectionName { get; set; } = null!;
        public string UserCollectionName { get; set; } = null!;
        public string AdoptionApplicationCollectionName { get; set; } = null!;
        public string ArticleCollectionName { get; set; } = null!;
        public string EventCollectionName { get; set; } = null!;
        public string NgoRequestCollectionName { get; set; } = null!;
        public string VolunteerCollectionName { get; set; } = null!;
    }
}
