using backend.Models.Domain;
using backend.Services;
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

        [HttpGet]
        public async Task<ActionResult<List<Pet>>> Get(
            [FromQuery] string? name,
            [FromQuery] string? breed,
            [FromQuery] string? species,
            [FromQuery] int? age,
            [FromQuery] string? status
        )
        {
            string finalStatus = status ?? "Available";
            var pets = await _petService.GetAsync(name, breed, species, age, finalStatus);
            return Ok(pets);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Pet>> Get(string id)
        {
            var pet = await _petService.GetAsync(id);
            if (pet is null)
                return NotFound($"Pet with Id {id} not found.");
            return Ok(pet);
        }

        [HttpPost]
        public async Task<IActionResult> Post(Pet newPet)
        {
            if (string.IsNullOrEmpty(newPet.NgoId))
            {
                return BadRequest("You must provide an NgoId to create a pet.");
            }

            var user = await _userService.GetByIdAsync(newPet.NgoId);
            if (user == null || user.UserRole != "NGO")
            {
                return StatusCode(403, "Access Denied: Only NGOs can create pets.");
            }

            if (string.IsNullOrEmpty(newPet.Status))
                newPet.Status = "Available";

            await _petService.CreateAsync(newPet);
            return CreatedAtAction(nameof(Get), new { id = newPet.PetId }, newPet);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(
            string id,
            Pet updatedPet,
            [FromQuery] string currentUserId
        )
        {
            var existingPet = await _petService.GetAsync(id);
            if (existingPet is null)
                return NotFound($"Pet with Id {id} not found.");

            if (string.IsNullOrEmpty(currentUserId))
            {
                return BadRequest("currentUserId query parameter is required to verify identity.");
            }

            if (existingPet.NgoId != currentUserId)
            {
                return StatusCode(403, "Access Denied: You are not the NGO that manages this pet.");
            }

            updatedPet.PetId = existingPet.PetId;

            updatedPet.NgoId = existingPet.NgoId;

            await _petService.UpdateAsync(id, updatedPet);
            return Ok("Pet updated successfully.");
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, [FromQuery] string currentUserId)
        {
            var existingPet = await _petService.GetAsync(id);
            if (existingPet is null)
                return NotFound($"Pet with Id {id} not found.");

            if (string.IsNullOrEmpty(currentUserId) || existingPet.NgoId != currentUserId)
            {
                return StatusCode(403, "Access Denied: You are not the NGO that manages this pet.");
            }

            await _petService.RemoveAsync(id);
            return Ok($"Pet with Id {id} deleted.");
        }
    }
}
