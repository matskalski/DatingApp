using DatingApp.Api.Entities;
using DatingApp.Api.Enums;

namespace DatingApp.Api.Repositories.Interfaces
{
    public interface ILikesRepository
    {
        ValueTask<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
        Task<IReadOnlyList<Member>> GetMemberLikes(string memberId, Predicates? predicate);
        Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
        Task DeleteLike(MemberLike like);
        Task AddLike(MemberLike like);
    }
}
