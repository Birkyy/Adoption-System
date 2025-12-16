using System.Text.RegularExpressions;
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Services;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService;

        public UsersController(UserService userService, TokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        private bool IsPasswordSecure(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length < 8)
                return false;

            // Check for number
            if (!Regex.IsMatch(password, @"[0-9]"))
                return false;

            // Check for symbol (non-alphanumeric)
            if (!Regex.IsMatch(password, @"[^a-zA-Z0-9]"))
                return false;

            return true;
        }

        [HttpGet("ngos")]
        public async Task<ActionResult<List<NGO>>> GetAllNgos()
        {
            var ngos = await _userService.GetAllNgosAsync();
            return Ok(ngos);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Email and Password are required.");

            var user = await _userService.LoginAsync(request.Email, request.Password);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            if (user.Status == "Pending")
                return Unauthorized("Your account is still pending approval.");

            // Generate JWT Token
            var token = _tokenService.CreateToken(user);

            user.Password = ""; // Clear password before returning

            // Return both the user info and the token
            return Ok(new { User = user, Token = token });
        }

        [HttpPost("register/public")]
        public async Task<IActionResult> RegisterPublic(Public newPublicUser)
        {
            // Add Security Check Here
            if (!IsPasswordSecure(newPublicUser.Password))
            {
                return BadRequest(
                    "Password must be at least 8 characters long and contain at least one number and one symbol."
                );
            }

            await _userService.CreatePublicAsync(newPublicUser);
            return CreatedAtAction(nameof(GetById), new { id = newPublicUser.Id }, newPublicUser);
        }

        [HttpPost("request/ngo")]
        public async Task<IActionResult> RequestNgo([FromBody] NgoRegistrationDto request)
        {
            var newNgo = new NGO
            {
                Name = request.Name,
                Username = request.Username,
                Email = request.Email,
                Password = request.Password,
                ContactInfo = request.ContactInfo,
                Bio = request.Bio,
                UserRole = "NGO",
                Status = "Pending",
                Address = request.Address,
            };

            await _userService.CreateNgoAsync(newNgo);

            return CreatedAtAction(nameof(GetById), new { id = newNgo.Id }, newNgo);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<User>> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null)
                return NotFound();
            user.Password = "";
            return Ok(user);
        }

        [HttpGet("admin/pending-ngos")]
        public async Task<ActionResult<List<User>>> GetPendingNgos()
        {
            var pendingNgos = await _userService.GetPendingNgosAsync();
            return Ok(pendingNgos);
        }

        // 3. Admin: Approve/Reject User
        [HttpPut("admin/status/{id}")]
        public async Task<IActionResult> UpdateUserStatus(string id, [FromQuery] string status)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            user.Status = status;
            await _userService.UpdateAsync(id, user);
            return Ok($"User status updated to {status}");
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto request)
        {
            var existingUser = await _userService.GetByIdAsync(id);

            if (existingUser is null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(request.Email) && existingUser.Email != request.Email)
            {
                bool isTaken = await _userService.IsEmailTakenAsync(request.Email, id);
                if (isTaken)
                {
                    return Conflict("Email is already in use by another account.");
                }
            }

            existingUser.Name = request.Name;
            existingUser.Email = request.Email ?? existingUser.Email;
            existingUser.ContactInfo = request.ContactInfo;
            existingUser.Bio = request.Bio;
            existingUser.Avatar = request.Avatar;

            await _userService.UpdateAsync(id, existingUser);

            return NoContent();
        }

        [HttpPost("seed-admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            var adminEmail = "admin@petstore.com";

            var admin = new Admin
            {
                Username = "SuperrAdmin",
                Email = adminEmail,
                Password = "Admin",
                Name = "System Administrator",
                ContactInfo = "N/A",
                Status = "Active",
            };

            await _userService.CreateAdminAsync(admin);
            return Ok(new { message = "Admin created successfully", email = adminEmail });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
