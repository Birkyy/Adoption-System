namespace backend.Models.DTO
{
    public class AdoptionReportDTO
    {
        public string ApplicationId { get; set; }
        public string PetName { get; set; }
        public string ApplicantName { get; set; }
        public string ApplicantEmail { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }
    }
}
