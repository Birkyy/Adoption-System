using System.Security.Claims; // Required for User.FindFirst
using backend.Models.Domain;
using backend.Models.DTO;
using backend.Services;
using Microsoft.AspNetCore.Authorization; // Required for [Authorize]
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 1. Lock the entire controller
    public class AdoptionsController : ControllerBase
    {
        private readonly AdoptionService _adoptionService;
        private readonly PetService _petService;
        private readonly UserService _userService;

        public AdoptionsController(
            AdoptionService adoptionService,
            PetService petService,
            UserService userService
        )
        {
            _adoptionService = adoptionService;
            _petService = petService;
            _userService = userService;
        }

        // 1. APPLY (Public Users)
        [HttpPost]
        public async Task<IActionResult> Apply(AdoptionApplication application)
        {
            // SECURITY: Get ID from Token
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var pet = await _petService.GetAsync(application.PetId);
            if (pet is null)
                return NotFound("Pet not found.");

            if (pet.Status != "Available")
                return BadRequest($"This pet is currently {pet.Status}.");

            if (string.IsNullOrEmpty(pet.NgoId))
                return StatusCode(500, "System Error: Pet has no assigned NGO.");

            // Force data from Server/Token (Ignore what user sent)
            application.ApplicantId = userId;
            application.NgoId = pet.NgoId;
            application.Status = "Pending";
            application.SubmissionDate = DateTime.UtcNow;

            await _adoptionService.CreateAsync(application);

            return CreatedAtAction(
                nameof(GetById),
                new { id = application.ApplicationId },
                application
            );
        }

        // 2. GET MY APPLICATIONS (Public Users)
        [HttpGet("my-applications")]
        public async Task<ActionResult<List<AdoptionApplication>>> GetMyApplications()
        {
            // SECURITY: No params needed. Token tells us who this is.
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var applications = await _adoptionService.GetByApplicantIdAsync(userId);
            return Ok(applications);
        }

        [HttpGet("enriched-list/{ngoId}")]
        public async Task<ActionResult<List<AdoptionReportDTO>>> GetEnrichedList(string ngoId)
        {
            var applications = await _adoptionService.GetByNgoIdAsync(ngoId);
            var enrichedList = new List<AdoptionReportDTO>();

            foreach (var app in applications)
            {
                var user = await _userService.GetByIdAsync(app.ApplicantId);
                var pet = await _petService.GetAsync(app.PetId);

                enrichedList.Add(
                    new AdoptionReportDTO
                    {
                        ApplicationId = app.ApplicationId!,
                        PetName = pet?.Name ?? "Unknown Pet",
                        ApplicantName = user?.Name ?? user?.Username ?? "Unknown User",
                        ApplicantEmail = user?.Email ?? "N/A",
                        ApplicantPhone = user?.ContactInfo ?? "N/A",
                        Message = app.Message,
                        Status = app.Status,
                    }
                );
            }

            return Ok(enrichedList);
        }

        // 3. GET NGO APPLICATIONS (NGO Only)
        [HttpGet("ngo-applications")]
        [Authorize(Roles = "NGO")] // Strict Role Check
        public async Task<ActionResult<List<AdoptionApplication>>> GetNgoApplications()
        {
            // SECURITY: Get NGO ID from Token
            var ngoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(ngoId))
                return Unauthorized();

            var applications = await _adoptionService.GetByNgoIdAsync(ngoId);
            return Ok(applications);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<AdoptionApplication>> GetById(string id)
        {
            var application = await _adoptionService.GetByIdAsync(id);
            if (application is null)
                return NotFound();

            // SECURITY: Only allow Applicant or Owner NGO to view
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (application.ApplicantId != currentUserId && application.NgoId != currentUserId)
            {
                return StatusCode(403, "Access Denied.");
            }

            return Ok(application);
        }

        // 4. UPDATE STATUS (NGO Only)
        [HttpPut("status/{id}")]
        [Authorize(Roles = "NGO")]
        public async Task<IActionResult> UpdateStatus(string id, [FromQuery] string status)
        {
            var ngoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var application = await _adoptionService.GetByIdAsync(id);
            if (application is null)
                return NotFound();

            // SECURITY: Ensure the logged-in NGO owns this application
            if (application.NgoId != ngoId)
            {
                return StatusCode(403, "Access Denied: You do not manage this application.");
            }

            if (status != "Approved" && status != "Rejected")
                return BadRequest("Invalid status.");

            await _adoptionService.UpdateStatusAsync(id, status);

            // Auto-update Pet Status if Approved
            if (status == "Approved")
            {
                var pet = await _petService.GetAsync(application.PetId);
                if (pet != null)
                {
                    pet.Status = "Adopted";
                    await _petService.UpdateAsync(pet.PetId!, pet);
                }
            }

            return Ok($"Application {status}.");
        }

        // 5. WITHDRAW (Applicant Only)
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Withdraw(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var app = await _adoptionService.GetByIdAsync(id);
            if (app is null)
                return NotFound();

            // SECURITY: Ensure the logged-in user is the applicant
            if (app.ApplicantId != userId)
                return StatusCode(403, "Access Denied.");

            if (app.Status != "Pending")
                return BadRequest("Cannot withdraw a processed application.");

            await _adoptionService.RemoveAsync(id);
            return Ok("Application withdrawn.");
        }
    }
}
