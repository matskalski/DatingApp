using System.Security.Cryptography;
using System.Text;
using DatingApp.Api.Data;
using DatingApp.Api.DTOs;
using DatingApp.Api.Entities;
using DatingApp.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokensService _tokensService;

        public AccountsController(AppDbContext context, ITokensService tokensService)
        {
            _context = context;
            _tokensService = tokensService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (await EmailExists(registerDto.Email)) 
            {
                return BadRequest("Email already exists");
            }

            using (var hmac = new HMACSHA512())
            {
                var user = new AppUser { 
                    Email = registerDto.Email, 
                    DisplayName = registerDto.DisplayName, 
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key
                };

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                var userDto = new UserDto
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Token = _tokensService.CreateToken(user)
                };

                return Ok(userDto);
            }
            ;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(usr => usr.Email.Equals(loginDto.Email));

            if(user is null)
            {
                return Unauthorized();
            }

            using(var hmac = new HMACSHA512(user.PasswordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

                for (var i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != user.PasswordHash[i])
                    {
                        return Unauthorized();
                    }
                }

                var userDto = new UserDto
                {
                    Id = user.Id,
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Token = _tokensService.CreateToken(user)
                };

                return Ok(userDto);
            }
        }

        private Task<bool> EmailExists(string email)
        {
            return _context.Users.AnyAsync(usr => usr.Email.Equals(email));
        }
    }
}
