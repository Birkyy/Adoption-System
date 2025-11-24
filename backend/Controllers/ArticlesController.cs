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
            {
                return BadRequest("AuthorId is required.");
            }

            var articles = await _articleService.GetByAuthorIdAsync(authorId);
            return Ok(articles);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Article>> GetById(string id)
        {
            var article = await _articleService.GetByIdAsync(id);

            if (article is null)
            {
                return NotFound($"Article with Id {id} not found.");
            }

            return Ok(article);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Article newArticle)
        {
            if (string.IsNullOrEmpty(newArticle.AuthorId))
            {
                return BadRequest("AuthorId is required.");
            }

            var author = await _userService.GetByIdAsync(newArticle.AuthorId);
            if (author == null || author.UserRole != "NGO")
            {
                return StatusCode(403, "Access Denied: Only NGOs can post articles.");
            }

            if (string.IsNullOrEmpty(newArticle.Status))
            {
                newArticle.Status = "Pending";
            }

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
            {
                return NotFound($"Article with Id {id} not found.");
            }

            if (string.IsNullOrEmpty(currentUserId) || existingArticle.AuthorId != currentUserId)
            {
                return StatusCode(403, "Access Denied: You are not the author of this article.");
            }

            updatedArticle.ArticleId = existingArticle.ArticleId;
            updatedArticle.AuthorId = existingArticle.AuthorId;

            await _articleService.UpdateArticleAsync(id, updatedArticle);

            return Ok("Article updated successfully.");
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id, [FromQuery] string currentUserId)
        {
            var existingArticle = await _articleService.GetByIdAsync(id);

            if (existingArticle is null)
            {
                return NotFound($"Article with Id {id} not found.");
            }

            if (string.IsNullOrEmpty(currentUserId) || existingArticle.AuthorId != currentUserId)
            {
                return StatusCode(403, "Access Denied: You are not the author of this article.");
            }

            await _articleService.RemoveAsync(id);

            return Ok($"Article with Id {id} deleted.");
        }
    }
}
