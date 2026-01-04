namespace backend.Models.DTO
{
    public class EventProposalDTO
    {
        public string Id { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Location { get; set; } = null!;
        public DateTime EventDate { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string ProposerName { get; set; } = null!;
        public string ProposerEmail { get; set; } = null!;
        public string Status { get; set; } = "Pending";
        public List<string> ProposalDocuments { get; set; } = new List<string>();
    }
}
