namespace backend.Models.DTO
{
    public class AdoptionReportDTO
    {
        public string ApplicationId { get; set; } = null!;
        public string PetName { get; set; } = null!;
        public string ApplicantName { get; set; } = null!;
        public string ApplicantEmail { get; set; } = null!;
        public string ApplicantPhone { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}
