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
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(
            @"^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$",
            ErrorMessage = "Password must contain at least one number and one symbol."
        )]
        public string Password { get; set; } = null!;

        [Required]
        public string ContactInfo { get; set; } = null!;

        [Required]
        public string Address { get; set; } = null!;

        public string? Bio { get; set; }
    }
}
