using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DatingApp.Api.Entities;
using DatingApp.Api.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Api.Services
{
    public class TokensService : ITokensService
    {
        private readonly IConfiguration configuration;

        public TokensService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string CreateToken(AppUser user)
        {
            var tokenKey = configuration["TokenKey"] ?? throw new Exception("Cannot get token key"); 

            if(tokenKey.Length < 64)
            {
                throw new Exception("Token key needs to have min. 64 characters");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),    
                new Claim(ClaimTypes.NameIdentifier, user.Id),
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
