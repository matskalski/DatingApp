using DatingApp.Api.Data;
using DatingApp.Api.DTOs;
using DatingApp.Api.Entities;
using DatingApp.Api.Extensions;
using DatingApp.Api.Helpers;
using DatingApp.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _dbContext;

        public MessageRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddMessage(Message message)
        {
            await _dbContext.AddAsync(message);
            await _dbContext.SaveChangesAsync();
        }

        public Task DeleteMeesage(Message message)
        {
            _dbContext.Remove(message);
            return _dbContext.SaveChangesAsync();
        }

        public Task<Message?> GetMessage(string messageId)
        {
            return _dbContext.Messages.FirstOrDefaultAsync(m => m.Id == messageId);
        }

        public Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
        {
            var query = _dbContext.Messages
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Outbox" => query.Where(x => x.SenderId == messageParams.MemberId && x.DeteltedBySender == false),
                _ => query.Where(x => x.RecipientId == messageParams.MemberId && x.DeletedByRecipient == false)
            };

            var messageQuery = query.Select(MessageExtensions.ToDtoProjection());

            return PaginationHelper.CreateAsync(messageQuery, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
        {
            await _dbContext.Messages.Where(x => x.RecipientId == currentMemberId && x.SenderId == recipientId && x.DateRead == null)
                .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead, DateTime.UtcNow));

            return await _dbContext.Messages
                .Where(x => (x.RecipientId == currentMemberId && x.DeletedByRecipient == false && x.SenderId == recipientId) || (x.SenderId == currentMemberId && x.DeteltedBySender == false && x.RecipientId == recipientId))
                .OrderBy(x => x.MessageSent)
                .Select(MessageExtensions.ToDtoProjection())
                .ToListAsync();
        }
    }
}
