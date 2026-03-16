using DatingApp.Api.Data;
using DatingApp.Api.Entities;
using DatingApp.Api.Enums;
using DatingApp.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Repositories
{
    public sealed class LikesRepository : ILikesRepository
    {
        private readonly AppDbContext _dbContext;

        public LikesRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddLike(MemberLike like)
        {
            await _dbContext.AddAsync(like);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteLike(MemberLike like)
        {
            _dbContext.Likes.Remove(like);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
        {
            return await _dbContext.Likes
                .Where(x => x.SourceMemberId == memberId)
                .Select(x => x.TargetMemberId)
                .ToListAsync();
        }

        public async Task<IReadOnlyList<Member>> GetMemberLikes(string memberId, Predicates? predicate)
        {
            var query = _dbContext.Likes.AsQueryable();

            if (predicate is not null)
            {
                switch (predicate)
                {
                    case Predicates.liked:
                        return await query
                            .Where(x => x.SourceMemberId == memberId)
                            .Select(x => x.TargetMember)
                            .ToListAsync();
                    case Predicates.likedBy:
                        return await query
                            .Where(x => x.TargetMemberId == memberId)
                            .Select(x => x.SourceMember)
                            .ToListAsync();

                }
            }

            var likeIds = await GetCurrentMemberLikeIds(memberId);

            return await query
                .Where(x => x.TargetMemberId == memberId && likeIds.Contains(x.SourceMemberId))
                .Select(x => x.SourceMember)
                .ToListAsync();

        }

        public ValueTask<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
        {
            return _dbContext.Likes.FindAsync(sourceMemberId, targetMemberId);
        }
    }
}
