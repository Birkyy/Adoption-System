using backend.Models.Domain;
using backend.Models.Settings;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NgoRequestsController : ControllerBase
    {
        private readonly IMongoCollection<NgoRequest> _requestCollection;
        private readonly UserService _userService;

        public NgoRequestsController(
            IOptions<PetStoreDatabaseSettings> settings,
            UserService userService
        )
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);

            _requestCollection = database.GetCollection<NgoRequest>(
                settings.Value.NgoRequestCollectionName
            );

            _userService = userService;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply(NgoRequest request)
        {
            request.Status = "Pending";
            request.RequestDate = DateTime.UtcNow;

            await _requestCollection.InsertOneAsync(request);

            return Ok("Application submitted successfully. Wait for Admin approval.");
        }

        [HttpGet("pending")]
        public async Task<ActionResult<List<NgoRequest>>> GetPending([FromQuery] string adminId)
        {
            var admin = await _userService.GetByIdAsync(adminId);
            if (admin == null || admin.UserRole != "Admin")
                return StatusCode(403);

            var requests = await _requestCollection.Find(r => r.Status == "Pending").ToListAsync();

            return Ok(requests);
        }

        [HttpPost("approve/{id}")]
        public async Task<IActionResult> Approve(string id, [FromQuery] string adminId)
        {
            var admin = await _userService.GetByIdAsync(adminId);
            if (admin == null || admin.UserRole != "Admin")
                return StatusCode(403);

            var request = await _requestCollection.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (request == null)
                return NotFound("Request not found.");

            if (request.Status == "Approved")
                return BadRequest("Already approved.");

            var newNgo = new NGO
            {
                Name = request.OrganizationName,
                Email = request.Email,
                Password = request.Password,
                Address = request.Address,
                ContactInfo = request.ContactInfo,
                WebsiteUrl = request.WebsiteUrl,
                Description = request.Description,
            };

            await _userService.CreateNgoAsync(newNgo);

            var update = Builders<NgoRequest>.Update.Set(r => r.Status, "Approved");
            await _requestCollection.UpdateOneAsync(r => r.Id == id, update);

            return Ok("NGO Account created successfully!");
        }

        [HttpPost("reject/{id}")]
        public async Task<IActionResult> Reject(string id, [FromQuery] string adminId)
        {
            var admin = await _userService.GetByIdAsync(adminId);
            if (admin == null || admin.UserRole != "Admin")
                return StatusCode(403);

            var update = Builders<NgoRequest>.Update.Set(r => r.Status, "Rejected");
            await _requestCollection.UpdateOneAsync(r => r.Id == id, update);

            return Ok("Application rejected.");
        }
    }
}
