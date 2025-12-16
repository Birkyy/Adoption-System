using System.Security.Claims; // Required to read the Token
using backend.Models.Domain;
using backend.Services;
using Microsoft.AspNetCore.Authorization; // Required for [Authorize]
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PetsController : ControllerBase
    {
        private readonly PetService _petService;
        private readonly UserService _userService;

        public PetsController(PetService petService, UserService userService)
        {
            _petService = petService;
            _userService = userService;
        }

        // 1. GET ALL (Public - No Login Required)
        [HttpGet]
        public async Task<ActionResult<object>> Get(
            [FromQuery] string? name,
            [FromQuery] string? breed,
            [FromQuery] string? species,
            [FromQuery] string? age,
            [FromQuery] string? gender, // Added Gender
            [FromQuery] string? status,
            [FromQuery] int page = 1, // Added Page
            [FromQuery] int pageSize = 10 // Added PageSize
        )
        {
            // Default status to "Available" if not provided
            string finalStatus = status ?? "Available";

            // Call the service (which now returns a Tuple)
            var (pets, total) = await _petService.GetAsync(
                name,
                breed,
                species,
                age,
                gender,
                finalStatus,
                page,
                pageSize
            );

            // Return a "Paginated Response" object
            return Ok(
                new
                {
                    TotalCount = total,
                    TotalPages = (int)Math.Ceiling((double)total / pageSize),
                    Page = page,
                    PageSize = pageSize,
                    Data = pets,
                }
            );
        }

        // 2. GET BY ID (Public)
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Pet>> Get(string id)
        {
            var pet = await _petService.GetAsync(id);
            if (pet is null)
                return NotFound($"Pet with Id {id} not found.");
            return Ok(pet);
        }

        // 3. CREATE (Secured - Only NGOs)
        [HttpPost]
        [Authorize(Roles = "NGO")] // <--- The Guard is here!
        public async Task<IActionResult> Post(Pet newPet)
        {
            // SECURITY: Get the NGO ID from the Token, not the request body
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
                return Unauthorized();

            // Force the pet to belong to the logged-in NGO
            newPet.NgoId = currentUserId;

            if (string.IsNullOrEmpty(newPet.Status))
                newPet.Status = "Available";

            await _petService.CreateAsync(newPet);

            return CreatedAtAction(nameof(Get), new { id = newPet.PetId }, newPet);
        }

        // 4. UPDATE (Secured - Only Owner NGO)
        [HttpPut("{id:length(24)}")]
        [Authorize(Roles = "NGO")]
        public async Task<IActionResult> Update(string id, Pet updatedPet)
        {
            var existingPet = await _petService.GetAsync(id);
            if (existingPet is null)
                return NotFound($"Pet with Id {id} not found.");

            // SECURITY: Check if the logged-in user owns this pet
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (existingPet.NgoId != currentUserId)
            {
                return StatusCode(403, "Access Denied: You do not manage this pet.");
            }

            // Preserve critical fields
            updatedPet.PetId = existingPet.PetId;
            updatedPet.NgoId = existingPet.NgoId; // Cannot change ownership

            await _petService.UpdateAsync(id, updatedPet);
            return Ok("Pet updated successfully.");
        }

        // 5. DELETE (Secured - Only Owner NGO)
        [HttpDelete("{id:length(24)}")]
        [Authorize(Roles = "NGO")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingPet = await _petService.GetAsync(id);
            if (existingPet is null)
                return NotFound($"Pet with Id {id} not found.");

            // SECURITY: Check ownership
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (existingPet.NgoId != currentUserId)
            {
                return StatusCode(403, "Access Denied: You do not manage this pet.");
            }

            await _petService.RemoveAsync(id);
            return Ok($"Pet with Id {id} deleted.");
        }
    }
}
