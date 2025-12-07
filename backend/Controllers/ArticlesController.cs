using backend.Models.Domain;
using backend.Services;
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

        // ... (Keep GetPublicArticles, GetMyArticles, GetById, Create, Update, Delete) ...
        [HttpGet]
        public async Task<ActionResult<List<Article>>> GetPublicArticles()
        {
            var articles = await _articleService.GetPublishedAsync();
            return Ok(articles);
        }

        [HttpGet("my-articles")]
        public async Task<ActionResult<List<Article>>> GetMyArticles([FromQuery] string authorId)
        {
            if (string.IsNullOrEmpty(authorId))
                return BadRequest("AuthorId is required.");
            var articles = await _articleService.GetByAuthorIdAsync(authorId);
            return Ok(articles);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Article>> GetById(string id)
        {
            var article = await _articleService.GetByIdAsync(id);
            if (article is null)
                return NotFound($"Article with Id {id} not found.");
            return Ok(article);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Article newArticle)
        {
            if (string.IsNullOrEmpty(newArticle.AuthorId))
                return BadRequest("AuthorId is required.");
            var author = await _userService.GetByIdAsync(newArticle.AuthorId);
            if (author == null)
                return BadRequest("User not found.");

            newArticle.Status = "Pending";
            newArticle.PublishDate = DateTime.UtcNow;

            await _articleService.CreateAsync(newArticle);
            return CreatedAtAction(nameof(GetById), new { id = newArticle.ArticleId }, newArticle);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(
            string id,
            Article updatedArticle,
            [FromQuery] string currentUserId
        )
        {
            var existingArticle = await _articleService.GetByIdAsync(id);
            if (existingArticle is null)
                return NotFound($"Article not found.");

            if (string.IsNullOrEmpty(currentUserId) || existingArticle.AuthorId != currentUserId)
                return StatusCode(403, "Access Denied: You are not the author.");

            updatedArticle.ArticleId = existingArticle.ArticleId;
            updatedArticle.AuthorId = existingArticle.AuthorId;
            updatedArticle.Status = existingArticle.Status;

            await _articleService.UpdateArticleAsync(id, updatedArticle);
            return Ok("Article updated successfully.");
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, [FromQuery] string currentUserId)
        {
            var existingArticle = await _articleService.GetByIdAsync(id);
            if (existingArticle is null)
                return NotFound($"Article not found.");

            if (string.IsNullOrEmpty(currentUserId) || existingArticle.AuthorId != currentUserId)
                return StatusCode(403, "Access Denied.");

            await _articleService.RemoveAsync(id);
            return Ok($"Article deleted.");
        }

        [HttpGet("admin/pending")]
        public async Task<ActionResult<List<Article>>> GetPendingArticles()
        {
            var articles = await _articleService.GetByStatusAsync("Pending");
            return Ok(articles);
        }

        [HttpGet("admin/all")]
        public async Task<ActionResult<List<Article>>> GetAllArticles()
        {
            var articles = await _articleService.GetAllAsync();
            return Ok(articles);
        }

        // --- FIXED ENDPOINT ---
        [HttpPut("admin/status/{id}")]
        public async Task<IActionResult> UpdateStatus(string id, [FromQuery] string status)
        {
            var article = await _articleService.GetByIdAsync(id);
            if (article == null)
                return NotFound();

            // FIX: Use UpdateStatusAsync instead of UpdateArticleAsync
            // UpdateArticleAsync strictly updates Title/Content and ignores Status changes.
            await _articleService.UpdateStatusAsync(id, status);

            return Ok($"Article status updated to {status}");
        }
    }
}
