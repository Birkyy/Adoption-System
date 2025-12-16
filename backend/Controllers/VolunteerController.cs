using backend.Models.Domain;
using backend.Services;
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

        [HttpGet]
        public async Task<ActionResult<List<Volunteer>>> GetAll()
        {
            var listings = await _volunteerService.GetAllAsync();
            return Ok(listings);
        }

        [HttpGet("my-listings")]
        public async Task<ActionResult<List<Volunteer>>> GetMyListings([FromQuery] string ngoId)
        {
            if (string.IsNullOrEmpty(ngoId))
                return BadRequest("NgoId is required.");
            var listings = await _volunteerService.GetByNgoIdAsync(ngoId);
            return Ok(listings);
        }

        [HttpGet("star-talent/{ngoId}")]
        public async Task<IActionResult> GetStarTalent(string ngoId)
        {
            // 1. Fetch Data using Services
            var events = await _eventService.GetByNgoIdAsync(ngoId);
            var listings = await _volunteerService.GetByNgoIdAsync(ngoId);

            // 2. Calculate Scores
            var scores = new Dictionary<string, int>();

            // Score from Events
            foreach (var ev in events)
            {
                if (ev.ParticipantIds == null)
                    continue;
                foreach (var userId in ev.ParticipantIds)
                {
                    // 🟢 FIX: Skip if the participant is the NGO itself
                    if (userId == ngoId)
                        continue;

                    if (!scores.ContainsKey(userId))
                        scores[userId] = 0;
                    scores[userId]++;
                }
            }

            // Score from Volunteer Applications
            foreach (var vol in listings)
            {
                if (vol.ApplicantIds == null)
                    continue;
                foreach (var userId in vol.ApplicantIds)
                {
                    // 🟢 FIX: Skip if the applicant is the NGO itself (Just in case)
                    if (userId == ngoId)
                        continue;

                    if (!scores.ContainsKey(userId))
                        scores[userId] = 0;
                    scores[userId]++;
                }
            }

            // 3. Get Top 5 User IDs
            var topUserIds = scores
                .OrderByDescending(x => x.Value)
                .Take(5)
                .Select(x => x.Key)
                .ToList();

            if (!topUserIds.Any())
                return Ok(new List<object>());

            // 4. Fetch User Details
            var topUsers = await _userService.GetUsersByIdsAsync(topUserIds);

            // 5. Combine & Return
            var result = topUsers
                .Select(u => new
                {
                    u.Id,
                    Name = u.Name ?? u.Username ?? "Unknown",
                    u.Email,
                    u.ContactInfo,
                    Score = scores[u.Id],
                })
                .OrderByDescending(x => x.Score)
                .ToList();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Volunteer newListing)
        {
            if (string.IsNullOrEmpty(newListing.NgoId))
                return BadRequest("NgoId required.");

            // Verify NGO
            var user = await _userService.GetByIdAsync(newListing.NgoId);
            if (user == null || user.UserRole != "NGO")
                return StatusCode(403, "Only NGOs can recruit.");

            await _volunteerService.CreateAsync(newListing);
            return Ok(newListing);
        }

        [HttpPost("apply/{id}")]
        public async Task<IActionResult> Apply(string id, [FromQuery] string userId)
        {
            var listing = await _volunteerService.GetByIdAsync(id);
            if (listing == null)
                return NotFound();

            await _volunteerService.ApplyAsync(id, userId);
            return Ok("Application successful. The NGO will contact you.");
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, [FromQuery] string currentUserId)
        {
            var listing = await _volunteerService.GetByIdAsync(id);
            if (listing == null)
                return NotFound();

            if (listing.NgoId != currentUserId)
                return StatusCode(403, "Access Denied.");

            await _volunteerService.RemoveAsync(id);
            return Ok("Listing removed.");
        }

        // --- SPECIAL ENDPOINT: Get Applicant Details for NGO ---
        [HttpGet("applicants/{id}")]
        public async Task<ActionResult<List<User>>> GetApplicants(
            string id,
            [FromQuery] string currentUserId
        )
        {
            var listing = await _volunteerService.GetByIdAsync(id);
            if (listing == null)
                return NotFound();

            // Security Check: Only the owner NGO can see applicants
            if (listing.NgoId != currentUserId)
                return StatusCode(403, "Access Denied.");

            var applicants = new List<User>();
            foreach (var userId in listing.ApplicantIds)
            {
                var user = await _userService.GetByIdAsync(userId);
                if (user != null)
                {
                    // Clean sensitive data before sending
                    user.Password = "";
                    applicants.Add(user);
                }
            }
            return Ok(applicants);
        }
    }
}
