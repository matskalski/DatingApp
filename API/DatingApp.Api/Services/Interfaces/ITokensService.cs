using DatingApp.Api.Entities;

namespace DatingApp.Api.Services.Interfaces
{
    public interface ITokensService
    {
        Task<string> CreateToken(AppUser user);
        string GenerateRefreshToken();
    }
}
