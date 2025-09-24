using DatingApp.Api.Entities;

namespace DatingApp.Api.Repositories.Interfaces
{
    public interface IMembersRepository
    {
        Task Add(Member member);
        Task Update(Member member);
        Task<IReadOnlyList<Member>> GetMembers();
        Task<Member?> GetMemberById(string id);
        Task<IReadOnlyList<Photo>> GetPhotosForMember(string memberId);
    }
}
