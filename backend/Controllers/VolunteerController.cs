using System.Security.Claims; // Required for User.FindFirst
using backend.Models.Domain;
using backend.Services;
using Microsoft.AspNetCore.Authorization; // Required for [Authorize]
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerController : ControllerBase
    {
        private readonly VolunteerService _volunteerService;
        private readonly UserService _userService;
        private readonly EventService _eventService;

        public VolunteerController(
            VolunteerService volunteerService,
            UserService userService,
            EventService eventService
        )
        {
            _volunteerService = volunteerService;
            _userService = userService;
            _eventService = eventService;
        }

        // 1. GET PUBLIC LISTINGS (Paginated)
        [HttpGet]
        public async Task<ActionResult<object>> GetAll(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6
        )
        {
            var (listings, total) = await _volunteerService.GetAvailableAsync(
                search,
                page,
                pageSize
            );

            return Ok(
                new
                {
                    TotalCount = total,
                    TotalPages = (int)Math.Ceiling((double)total / pageSize),
                    Page = page,
                    PageSize = pageSize,
                    Data = listings,
                }
            );
        }

        // 2. CREATE (NGO Only)
        [HttpPost]
        [Authorize(Roles = "NGO")]
        public async Task<IActionResult> Create(Volunteer newListing)
        {
            // SECURITY: Get NGO ID from Token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            newListing.NgoId = currentUserId; // Force ownership
            newListing.ApplicantIds = new List<string>();

            await _volunteerService.CreateAsync(newListing);
            return Ok(newListing);
        }

        // 3. APPLY (Public User)
        [HttpPost("apply/{id}")]
        [Authorize] // Must be logged in
        public async Task<IActionResult> Apply(string id)
        {
            // SECURITY: Get Applicant ID from Token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var listing = await _volunteerService.GetByIdAsync(id);
            if (listing == null)
                return NotFound();

            // Prevent NGO from applying to own listing
            if (listing.NgoId == userId)
                return BadRequest("You cannot apply to your own listing.");

            await _volunteerService.ApplyAsync(id, userId);
            return Ok("Application successful. The NGO will contact you.");
        }

        // 4. GET MY LISTINGS (NGO Only)
        [HttpGet("my-listings")]
        [Authorize(Roles = "NGO")]
        public async Task<ActionResult<List<Volunteer>>> GetMyListings()
        {
            // SECURITY FIX: Get ID from the Token, NOT the URL
            var ngoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(ngoId))
                return Unauthorized();

            var listings = await _volunteerService.GetByNgoIdAsync(ngoId);
            return Ok(listings);
        }

        // 5. DELETE (Owner Only)
        [HttpDelete("{id:length(24)}")]
        [Authorize(Roles = "NGO")]
        public async Task<IActionResult> Delete(string id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var listing = await _volunteerService.GetByIdAsync(id);
            if (listing == null)
                return NotFound();

            // SECURITY: Check ownership
            if (listing.NgoId != currentUserId)
                return StatusCode(403, "Access Denied.");

            await _volunteerService.RemoveAsync(id);
            return Ok("Listing removed.");
        }

        // 6. GET APPLICANTS (Owner Only)
        [HttpGet("applicants/{id}")]
        [Authorize(Roles = "NGO")]
        public async Task<ActionResult<List<object>>> GetApplicants(string id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var listing = await _volunteerService.GetByIdAsync(id);
            if (listing == null)
                return NotFound();

            if (listing.NgoId != currentUserId)
                return StatusCode(403, "Access Denied.");

            var applicants = new List<object>();
            foreach (var userId in listing.ApplicantIds)
            {
                var user = await _userService.GetByIdAsync(userId);
                if (user != null)
                {
                    // Return Safe DTO (No Password)
                    applicants.Add(
                        new
                        {
                            user.Id,
                            user.Name,
                            user.Email,
                            user.ContactInfo,
                            user.Username,
                        }
                    );
                }
            }
            return Ok(applicants);
        }

        // 7. STAR TALENT (Secure - NGO Only)
        // This calculates which volunteers are most active for THIS specific NGO
        [HttpGet("star-talent")]
        [Authorize(Roles = "NGO")]
        public async Task<IActionResult> GetStarTalent()
        {
            var ngoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(ngoId))
                return Unauthorized();

            // 1. Fetch Data
            var events = await _eventService.GetByNgoIdAsync(ngoId);
            var listings = await _volunteerService.GetByNgoIdAsync(ngoId);

            // 2. Calculate Scores
            var scores = new Dictionary<string, int>();

            void AddScore(IEnumerable<string>? ids)
            {
                if (ids == null)
                    return;
                foreach (var uid in ids)
                {
                    if (uid == ngoId)
                        continue; // Skip self
                    if (!scores.ContainsKey(uid))
                        scores[uid] = 0;
                    scores[uid]++;
                }
            }

            foreach (var ev in events)
                AddScore(ev.ParticipantIds);
            foreach (var vol in listings)
                AddScore(vol.ApplicantIds);

            // 3. Get Top 5
            var topUserIds = scores
                .OrderByDescending(x => x.Value)
                .Take(5)
                .Select(x => x.Key)
                .ToList();
            if (!topUserIds.Any())
                return Ok(new List<object>());

            // 4. Return Details
            var topUsers = await _userService.GetUsersByIdsAsync(topUserIds);
            var result = topUsers
                .Select(u => new
                {
                    u.Id,
                    Name = u.Name ?? u.Username ?? "Unknown",
                    u.Email,
                    u.ContactInfo,
                    Score = scores[u.Id],
                })
                .OrderByDescending(x => x.Score);

            return Ok(result);
        }
    }
}
