using DatingApp.Api.Data;
using DatingApp.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MembersController(AppDbContext context)
        {
           _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<AppUser>>> GetMembers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpGet("id")]
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if(member is null)
            {
                return NotFound();
            }

            return Ok(member);
        }


    }
}
