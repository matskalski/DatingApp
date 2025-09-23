using DatingApp.Api.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuggyController : ControllerBase
    {
        [HttpGet("auth")]
        public IActionResult GetAuth()
        {
            return Unauthorized();
        }

        [HttpGet("not-found")]
        public IActionResult GetNotFound()
        {
            return NotFound();
        }

        [HttpGet("server-error")]
        public IActionResult GetServerError()
        {
            throw new ServerErrorException();
        }

        [HttpGet("bad-request")]
        public IActionResult GetBadRequest()
        {
           return BadRequest("This was not a good request");
        }
    }
}
