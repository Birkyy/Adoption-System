namespace backend.Models.DTO
{
    public class UpdateUserDto
    {
        // These properties match the JSON sent from your React Profile page
        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? ContactInfo { get; set; }

        public string? Bio { get; set; }

        public string? Avatar { get; set; }
    }
}
