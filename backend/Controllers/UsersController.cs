using backend.Models.Domain;
using backend.Models.DTO;
using backend.Services;
using Microsoft.AspNetCore.Authorization; // Needed for [Authorize]
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService; // 1. Add this field

        // 2. Inject TokenService in the constructor
        public UsersController(UserService userService, TokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
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
            // 1. Basic Validation
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Email and Password are required.");

            // 2. Check User & Password
            var user = await _userService.LoginAsync(request.Email, request.Password);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            // 3. Check Status
            if (user.Status == "Pending")
                return Unauthorized("Your account is still pending approval.");

            if (user.Status == "Suspended")
                return Unauthorized("Your account has been suspended.");

            // 4. Generate REAL Token
            var token = _tokenService.CreateToken(user);

            // 5. Hide password before returning
            user.Password = "";

            // 6. Return both User and Token
            return Ok(new { User = user, Token = token });
        }

        [HttpPost("register/public")]
        public async Task<IActionResult> RegisterPublic(PublicRegistrationDTO request)
        {
            // Map DTO to Domain Model
            var newPublicUser = new Public
            {
                Username = request.Username,
                Name = request.Name,
                Email = request.Email,
                Password = request.Password,
                ContactInfo = request.ContactInfo,
                UserRole = "Public",
                Status = "Active",
            };

            await _userService.CreatePublicAsync(newPublicUser);

            // Auto-login after register? Or just return success.
            // Usually we return 201 Created.
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
                Status = "Pending", // NGO is always Pending first
                Address = request.Address,
            };

            await _userService.CreateNgoAsync(newNgo);
            return CreatedAtAction(nameof(GetById), new { id = newNgo.Id }, newNgo);
        }

        [HttpGet("{id:length(24)}")]
        [Authorize] // Protect user details
        public async Task<ActionResult<User>> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null)
                return NotFound();
            user.Password = "";
            return Ok(user);
        }

        [HttpGet("admin/pending-ngos")]
        [Authorize(Roles = "Admin")] // Only Admin
        public async Task<ActionResult<List<User>>> GetPendingNgos()
        {
            var pendingNgos = await _userService.GetPendingNgosAsync();
            return Ok(pendingNgos);
        }

        [HttpPut("admin/status/{id}")]
        [Authorize(Roles = "Admin")] // Only Admin
        public async Task<IActionResult> UpdateUserStatus(string id, [FromQuery] string status)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            user.Status = status;
            await _userService.UpdateAsync(id, user);
            return Ok($"User status updated to {status}");
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
