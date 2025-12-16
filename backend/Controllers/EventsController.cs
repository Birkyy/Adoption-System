using backend.Models.Domain;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly EventService _eventService;
        private readonly UserService _userService;

        public EventsController(EventService eventService, UserService userService)
        {
            _eventService = eventService;
            _userService = userService;
        }

        // ... (Keep existing GetPublicEvents, GetById, Create, ApproveEvent, UpdateDetails, JoinEvent, Delete, GetPending, GetMy) ...

        [HttpGet]
        [HttpGet]
        public async Task<ActionResult<object>> GetPublicEvents(
            [FromQuery] string? search,
            [FromQuery] string? location,
            [FromQuery] string? date,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6
        )
        {
            var (events, total) = await _eventService.GetApprovedAsync(
                search,
                location,
                date,
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
                    Data = events,
                }
            );
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Event>> GetById(string id)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev is null)
                return NotFound();
            return Ok(ev);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Event newEvent)
        {
            if (string.IsNullOrEmpty(newEvent.CreatedById))
                return BadRequest("CreatedById is required.");
            if (newEvent.EventDate <= DateTime.UtcNow)
                return BadRequest("Event date must be in the future.");

            var creator = await _userService.GetByIdAsync(newEvent.CreatedById);
            if (creator == null)
                return BadRequest("User not found.");

            if (creator.UserRole == "NGO")
            {
                newEvent.Status = "Approved";
                newEvent.NgoId = creator.Id;
                newEvent.ParticipantIds.Add(creator.Id);
            }
            else
            {
                if (string.IsNullOrEmpty(newEvent.NgoId))
                    return BadRequest("Public users must specify an NgoId.");
                newEvent.Status = "Pending";
            }

            await _eventService.CreateAsync(newEvent);
            return CreatedAtAction(nameof(GetById), new { id = newEvent.Id }, newEvent);
        }

        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveEvent(
            string id,
            [FromQuery] string ngoId,
            [FromQuery] string status
        )
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev is null)
                return NotFound();
            if (ev.NgoId != ngoId)
                return StatusCode(403, "You are not the assigned NGO.");
            if (status != "Approved" && status != "Rejected")
                return BadRequest("Invalid status.");

            if (status == "Approved")
            {
                if (ev.EventDate < DateTime.UtcNow)
                    return BadRequest("Cannot approve past event.");
                await _eventService.ApproveProposalAsync(id);
            }
            else
            {
                await _eventService.UpdateStatusAsync(id, status);
            }
            return Ok($"Event {status}.");
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> UpdateDetails(
            string id,
            Event updatedEvent,
            [FromQuery] string currentUserId
        )
        {
            var existingEvent = await _eventService.GetByIdAsync(id);
            if (existingEvent is null)
                return NotFound();
            if (existingEvent.CreatedById != currentUserId)
                return StatusCode(403, "Only creator can edit.");
            if (updatedEvent.EventDate <= DateTime.UtcNow)
                return BadRequest("Date must be in future.");

            await _eventService.UpdateDetailsAsync(id, updatedEvent);
            return Ok("Event updated.");
        }

        [HttpPost("join/{id}")]
        public async Task<IActionResult> JoinEvent(string id, [FromQuery] string userId)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev is null)
                return NotFound();
            if (ev.Status != "Approved")
                return BadRequest("Cannot join pending event.");
            await _eventService.JoinEventAsync(id, userId);
            return Ok("Joined successfully.");
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, [FromQuery] string currentUserId)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev is null)
                return NotFound();
            if (ev.CreatedById != currentUserId && ev.NgoId != currentUserId)
                return StatusCode(403, "Access Denied.");
            await _eventService.RemoveAsync(id);
            return Ok("Event deleted.");
        }

        [HttpGet("pending")]
        public async Task<ActionResult<List<Event>>> GetPendingProposals([FromQuery] string ngoId)
        {
            if (string.IsNullOrEmpty(ngoId))
                return BadRequest("NgoId is required.");
            var events = await _eventService.GetPendingByNgoIdAsync(ngoId);
            return Ok(events);
        }

        [HttpGet("my-events")]
        public async Task<ActionResult<List<Event>>> GetMyEvents([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId is required.");
            var events = await _eventService.GetByCreatorIdAsync(userId);
            return Ok(events);
        }

        // --- NEW: ADMIN ENDPOINTS ---

        // 1. Get All Events (for moderation list)
        [HttpGet("admin/all")]
        public async Task<ActionResult<List<Event>>> GetAllEvents()
        {
            var events = await _eventService.GetAllAsync();
            return Ok(events);
        }

        // 2. Flag/Reject Event (Take Down)
        [HttpPut("admin/status/{id}")]
        public async Task<IActionResult> UpdateStatus(string id, [FromQuery] string status)
        {
            var ev = await _eventService.GetByIdAsync(id);
            if (ev == null)
                return NotFound();

            await _eventService.UpdateStatusAsync(id, status);
            return Ok($"Event status updated to {status}");
        }
    }
}
