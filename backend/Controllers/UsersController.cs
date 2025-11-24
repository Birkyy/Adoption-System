using backend.Models.Domain;
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
            {
                return BadRequest("Email and Password are required.");
            }

            var user = await _userService.LoginAsync(request.Email, request.Password);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            user.Password = "";
            return Ok(user);
        }

        [HttpPost("register/public")]
        public async Task<IActionResult> RegisterPublic(Public newPublicUser)
        {
            await _userService.CreatePublicAsync(newPublicUser);

            return CreatedAtAction(nameof(GetById), new { id = newPublicUser.Id }, newPublicUser);
        }

        [HttpPost("register/ngo")]
        public async Task<IActionResult> RegisterNgo(NGO newNgoUser, [FromQuery] string adminId)
        {
            if (string.IsNullOrEmpty(adminId))
            {
                return BadRequest("AdminId is required to verify permissions.");
            }

            var admin = await _userService.GetByIdAsync(adminId);
            if (admin == null || admin.UserRole != "Admin")
            {
                return StatusCode(
                    403,
                    "Access Denied: Only Admins can create NGO accounts directly."
                );
            }

            await _userService.CreateNgoAsync(newNgoUser);
            return CreatedAtAction(nameof(GetById), new { id = newNgoUser.Id }, newNgoUser);
        }

        [HttpPost("seed-admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            var admin = new Admin
            {
                Username = "SuperAdmin",
                Email = "SWE2209841@xmu.edu.my",
                Password = "@dminPass123",
                Name = "System Administrator",
                ContactInfo = "+60123456789",
            };

            await _userService.CreateAdminAsync(admin);
            return Ok("Admin created successfully.");
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<User>> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            user.Password = "";
            return Ok(user);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
