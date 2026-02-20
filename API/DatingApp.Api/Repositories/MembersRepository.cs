using DatingApp.Api.Data;
using DatingApp.Api.Entities;
using DatingApp.Api.Helpers;
using DatingApp.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Repositories
{
    public class MembersRepository : IMembersRepository
    {
        private readonly AppDbContext _context;

        public MembersRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(Member member)
        {
            await _context.AddAsync(member);
            await _context.SaveChangesAsync();
        }

    

        public Task<Member?> GetMemberById(string id)
        {
            return _context.Members
                .Include(i => i.User)
                .Include(i => i.Photos)
                .FirstOrDefaultAsync(m => m.Id.Equals(id));
        }

        public async Task<PaginatedResult<Member>> GetMembers(MemberParams memberParams)
        {
            var query = _context.Members.AsQueryable();

            query = query.Where(x => x.Id != memberParams.CurrentMemberId);

            if(memberParams.Gender is not null){
                query = query.Where(x => x.Gender == memberParams.Gender);
            }

            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge -1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

            query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

            return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);            
        }

        public Task<IReadOnlyList<Member>> GetAllMembers()
        {
            return _context.Members
                .Include(x => x.Photos)
                .ToListAsync()
                .ContinueWith(x => x.Result as IReadOnlyList<Member>);
        }

        public Task<IReadOnlyList<Photo>> GetPhotosForMember(string memberId)
        {
            return _context.Members
                .Where(m => m.Id.Equals(memberId))
                .SelectMany(m => m.Photos)
                .ToListAsync()
                .ContinueWith(x => x.Result as IReadOnlyList<Photo>);
        }

        public Task Update(Member member)
        {
            _context.Members.Update(member);
            return _context.SaveChangesAsync();
        }
    }
}
