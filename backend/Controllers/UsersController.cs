using backend.Models.Domain;
using backend.Models.DTO;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Email and Password are required.");

            var user = await _userService.LoginAsync(request.Email, request.Password);
            if (user == null)
                return Unauthorized("Invalid email or password.");
            user.Password = "";
            return Ok(user);
        }

        [HttpPost("register/public")]
        public async Task<IActionResult> RegisterPublic(Public newPublicUser)
        {
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
