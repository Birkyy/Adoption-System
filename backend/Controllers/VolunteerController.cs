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

        public VolunteerController(VolunteerService volunteerService, UserService userService)
        {
            _volunteerService = volunteerService;
            _userService = userService;
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
