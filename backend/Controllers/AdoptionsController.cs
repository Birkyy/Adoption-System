using backend.Models.Domain;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        [HttpPost]
        public async Task<IActionResult> Apply(AdoptionApplication application)
        {
            var pet = await _petService.GetAsync(application.PetId);
            if (pet is null)
                return NotFound("Pet not found.");

            if (pet.Status != "Available")
            {
                return BadRequest($"This pet is currently {pet.Status} and cannot be applied for.");
            }

            var user = await _userService.GetByIdAsync(application.ApplicantId);
            if (user is null)
                return BadRequest("Applicant user not found.");

            if (string.IsNullOrEmpty(pet.NgoId))
            {
                return StatusCode(500, "Data Error: This pet is not assigned to an NGO.");
            }

            application.NgoId = pet.NgoId;
            application.Status = "Pending";

            await _adoptionService.CreateAsync(application);

            return CreatedAtAction(
                nameof(GetById),
                new { id = application.ApplicationId },
                application
            );
        }

        [HttpGet("my-applications")]
        public async Task<ActionResult<List<AdoptionApplication>>> GetMyApplications(
            [FromQuery] string userId
        )
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId is required.");

            var applications = await _adoptionService.GetByApplicantIdAsync(userId);
            return Ok(applications);
        }

        [HttpGet("ngo-applications")]
        public async Task<ActionResult<List<AdoptionApplication>>> GetNgoApplications(
            [FromQuery] string ngoId
        )
        {
            if (string.IsNullOrEmpty(ngoId))
                return BadRequest("NgoId is required.");

            var applications = await _adoptionService.GetByNgoIdAsync(ngoId);
            return Ok(applications);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<AdoptionApplication>> GetById(string id)
        {
            var application = await _adoptionService.GetByIdAsync(id);
            if (application is null)
                return NotFound();
            return Ok(application);
        }

        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateStatus(
            string id,
            [FromQuery] string status,
            [FromQuery] string ngoId
        )
        {
            var application = await _adoptionService.GetByIdAsync(id);
            if (application is null)
                return NotFound();

            if (application.NgoId != ngoId)
            {
                return StatusCode(
                    403,
                    "Access Denied: You are not the NGO managing this application."
                );
            }

            if (status != "Approved" && status != "Rejected")
            {
                return BadRequest("Status must be 'Approved' or 'Rejected'.");
            }

            await _adoptionService.UpdateStatusAsync(id, status);

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
    }
}
