using DatingApp.Api.DTOs;
using DatingApp.Api.Entities;
using DatingApp.Api.Helpers;

namespace DatingApp.Api.Repositories.Interfaces
{
    public interface IMessageRepository
    {
        Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams);
        Task<Message?> GetMessage(string messageId);
        Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId);
        Task AddMessage(Message message);
        Task DeleteMeesage(Message message);
    }
}
