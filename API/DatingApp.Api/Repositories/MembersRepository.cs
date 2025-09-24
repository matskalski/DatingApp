using DatingApp.Api.Data;
using DatingApp.Api.Entities;
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
            return _context.Members.FirstOrDefaultAsync(m => m.Id.Equals(id));
        }

        public Task<IReadOnlyList<Member>> GetMembers()
        {
            return _context.Members
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
