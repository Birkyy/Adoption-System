using System.Security.Claims; // Required for reading Token
using backend.Models.Domain;
using backend.Services;
using Microsoft.AspNetCore.Authorization; // Required for security
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly ArticleService _articleService;
        private readonly UserService _userService;

        public ArticlesController(ArticleService articleService, UserService userService)
        {
            _articleService = articleService;
            _userService = userService;
        }

        // 1. GET PUBLIC ARTICLES (Paginated)
        [HttpGet]
        public async Task<ActionResult<object>> GetPublicArticles(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6
        )
        {
            var (articles, total) = await _articleService.GetPublishedAsync(
                search,
                category,
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
                    Data = articles,
                }
            );
        }

        // 2. GET MY ARTICLES (Secure)
        [HttpGet("my-articles")]
        [Authorize] // Requires Login
        public async Task<ActionResult<List<Article>>> GetMyArticles()
        {
            // Security: Get ID from Token, NOT query param
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var articles = await _articleService.GetByAuthorIdAsync(userId);
            return Ok(articles);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Article>> GetById(string id)
        {
            var article = await _articleService.GetByIdAsync(id);
            if (article is null)
                return NotFound($"Article not found.");
            return Ok(article);
        }

        // 3. CREATE (Secure)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(Article newArticle)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Force AuthorId to match the logged-in user
            newArticle.AuthorId = userId;
            newArticle.Status = "Pending";

            await _articleService.CreateAsync(newArticle);
            return CreatedAtAction(nameof(GetById), new { id = newArticle.ArticleId }, newArticle);
        }

        // 4. UPDATE (Secure - Owner Only)
        [HttpPut("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> Update(string id, Article updatedArticle)
        {
            var existingArticle = await _articleService.GetByIdAsync(id);
            if (existingArticle is null)
                return NotFound();

            // Security Check
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (existingArticle.AuthorId != userId)
            {
                return StatusCode(403, "Access Denied: You do not own this article.");
            }

            await _articleService.UpdateArticleAsync(id, updatedArticle);
            return Ok("Article updated successfully.");
        }

        // 5. DELETE (Secure - Owner Only)
        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public async Task<IActionResult> Delete(string id)
        {
            var existingArticle = await _articleService.GetByIdAsync(id);
            if (existingArticle is null)
                return NotFound();

            // Security Check
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // Allow Admin to delete ANY article, Author only their own
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (existingArticle.AuthorId != userId && userRole != "Admin")
            {
                return StatusCode(403, "Access Denied.");
            }

            await _articleService.RemoveAsync(id);
            return Ok($"Article deleted.");
        }

        // --- ADMIN ENDPOINTS (Protected) ---

        [HttpGet("admin/pending")]
        [Authorize(Roles = "Admin")] // <--- Guard
        public async Task<ActionResult<List<Article>>> GetPendingArticles()
        {
            var articles = await _articleService.GetByStatusAsync("Pending");
            return Ok(articles);
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")] // <--- Guard
        public async Task<ActionResult<List<Article>>> GetAllArticles()
        {
            var articles = await _articleService.GetAllAsync();
            return Ok(articles);
        }

        [HttpPut("admin/status/{id}")]
        [Authorize(Roles = "Admin")] // <--- Guard
        public async Task<IActionResult> UpdateStatus(string id, [FromQuery] string status)
        {
            var article = await _articleService.GetByIdAsync(id);
            if (article == null)
                return NotFound();

            await _articleService.UpdateStatusAsync(id, status);
            return Ok($"Article status updated to {status}");
        }
    }
}
