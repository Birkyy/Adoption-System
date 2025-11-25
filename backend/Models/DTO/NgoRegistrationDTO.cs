using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTO
{
    public class NgoRegistrationDto
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Username { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        public string ContactInfo { get; set; } = null!;

        [Required]
        public string Address { get; set; } = null!;

        public string? Bio { get; set; }
    }
}
