using System.Security.Cryptography;
using System.Text;
using DatingApp.Api.Data;
using DatingApp.Api.Entities;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register([FromBody]string email, [FromBody] string displayName, [FromBody]string password)
        {
            using (var hmac = new HMACSHA512())
            {
                var user = new AppUser { 
                    Email = email, 
                    DisplayName = displayName, 
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
                    PasswordSalt = hmac.Key
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return user;
            };
        }
    }
}
