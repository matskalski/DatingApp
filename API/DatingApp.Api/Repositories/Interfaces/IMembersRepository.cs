using DatingApp.Api.Entities;
using DatingApp.Api.Helpers;

namespace DatingApp.Api.Repositories.Interfaces
{
    public interface IMembersRepository
    {
        Task Add(Member member);
        Task Update(Member member);
        Task<PaginatedResult<Member>> GetMembers(PagingParams pagingParams);
        Task<IReadOnlyList<Member>> GetAllMembers();
        Task<Member?> GetMemberById(string id);
        Task<IReadOnlyList<Photo>> GetPhotosForMember(string memberId);
    }
}
