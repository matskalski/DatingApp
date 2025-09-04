using DatingApp.Api.Entities;

namespace DatingApp.Api.Services.Interfaces
{
    public interface ITokensService
    {
        string CreateToken(AppUser user);
    }
}
