namespace backend.Models.DTO
{
    public class ApplicationViewDTO
    {
        public string ApplicationId { get; set; } = null!;
        public string PetName { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime SubmissionDate { get; set; }
        public string NgoId { get; set; } = null!;
        public string? Message { get; set; }
    }
}
