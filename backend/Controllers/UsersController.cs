using System.Security.Claims;
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
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

        // 1. GET NGOS (Public for dropdowns)
        [HttpGet("ngos")]
        public async Task<ActionResult<List<NGO>>> GetAllNgos()
        {
            var ngos = await _userService.GetAllNgosAsync();
            return Ok(ngos);
        }

        // 2. PUBLIC PROFILE (Safe for everyone to see)
        [HttpGet("public-profile/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetPublicProfile(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null)
                return NotFound();

            // Return ONLY safe information (No Email/Phone unless you want to share it)
            return Ok(
                new
                {
                    Id = user.Id,
                    Name = user.Name,
                    Username = user.Username,
                    UserRole = user.UserRole,
                    Bio = user.Bio,
                    Avatar = user.Avatar, // <--- Important for UI
                }
            );
        }

        // 3. LOGIN
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
            if (user.Status == "Suspended")
                return Unauthorized("Your account has been suspended.");

            var token = _tokenService.CreateToken(user);
            user.Password = ""; // Hide password

            return Ok(new { User = user, Token = token });
        }

        // 4. REGISTER PUBLIC
        [HttpPost("register/public")]
        public async Task<IActionResult> RegisterPublic(PublicRegistrationDTO request)
        {
            var existingUser = await _userService.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return Conflict("Email already exists.");

            var newPublicUser = new Public
            {
                Username = request.Username,
                Name = request.Name,
                Email = request.Email,
                Password = request.Password,
                ContactInfo = request.ContactInfo,
                UserRole = "Public",
                Status = "Active",
                // Default Avatar
                Avatar =
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60",
            };

            await _userService.CreatePublicAsync(newPublicUser);
            return CreatedAtAction(nameof(GetById), new { id = newPublicUser.Id }, newPublicUser);
        }

        // 5. REGISTER NGO
        [HttpPost("request/ngo")]
        public async Task<IActionResult> RequestNgo([FromBody] NgoRegistrationDto request)
        {
            var existingUser = await _userService.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return Conflict("Email already exists.");

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
                Avatar = "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
            };

            await _userService.CreateNgoAsync(newNgo);
            return CreatedAtAction(nameof(GetById), new { id = newNgo.Id }, newNgo);
        }

        // 6. GET FULL USER (Secure - Self or Admin Only)
        [HttpGet("{id:length(24)}")]
        [Authorize]
        public async Task<ActionResult<User>> GetById(string id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Security: Only allow if it's ME or I am an ADMIN
            if (currentUserId != id && currentUserRole != "Admin")
            {
                // If they try to peek at someone else, just give them the public profile data
                // effectively redirecting them, or return 403.
                return StatusCode(403, "Access Denied: You cannot view this user's private data.");
            }

            var user = await _userService.GetByIdAsync(id);
            if (user is null)
                return NotFound();

            user.Password = "";
            return Ok(user);
        }

        // 7. UPDATE PROFILE (Secure - Self Only)
        [HttpPut("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto updatedData)
        {
            // SECURITY: Ensure user is updating THEIR OWN profile
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (id != currentUserId)
                return StatusCode(403, "You can only update your own profile.");

            var existingUser = await _userService.GetByIdAsync(id);
            if (existingUser == null)
                return NotFound();

            // Check if email is being changed to one that already exists
            if (existingUser.Email != updatedData.Email)
            {
                var emailCheck = await _userService.GetByEmailAsync(updatedData.Email);
                if (emailCheck != null)
                    return Conflict("Email already taken.");
            }

            // Update allowed fields
            existingUser.Name = updatedData.Name;
            existingUser.Email = updatedData.Email;
            existingUser.ContactInfo = updatedData.ContactInfo;
            existingUser.Bio = updatedData.Bio;

            // Only update Avatar if a new one is provided
            if (!string.IsNullOrEmpty(updatedData.Avatar))
            {
                existingUser.Avatar = updatedData.Avatar;
            }

            await _userService.UpdateAsync(id, existingUser);

            // Hide password before returning
            existingUser.Password = "";
            return Ok(existingUser);
        }

        // --- ADMIN ENDPOINTS ---

        [HttpGet("admin/pending-ngos")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<User>>> GetPendingNgos()
        {
            var pendingNgos = await _userService.GetPendingNgosAsync();
            return Ok(pendingNgos);
        }

        [HttpPut("admin/status/{id}")]
        [Authorize(Roles = "Admin")]
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
