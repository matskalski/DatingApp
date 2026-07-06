using DatingApp.Api.DTOs;
using DatingApp.Api.Entities;
using DatingApp.Api.Extensions;
using DatingApp.Api.Helpers;
using DatingApp.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    //zawarte w BaseApiController
    //[Route("api/[controller]")]
    //[ApiController]

    public class MessagesController : BaseApiController
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMembersRepository _membersRepository;

        public MessagesController(IMessageRepository messageRepository,
            IMembersRepository membersRepository)
        {
            _messageRepository = messageRepository;
            _membersRepository = membersRepository;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();

            return await _messageRepository.GetMessagesForMember(messageParams);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
        {
            return Ok(await _messageRepository.GetMessageThread(User.GetMemberId(), recipientId));
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
        {
            var sender = await _membersRepository.GetMemberById(User.GetMemberId());
            var recipient = await _membersRepository.GetMemberById(messageDto.RecipientId);

            if (recipient is null || sender is null || sender.Id == messageDto.RecipientId)
            {
                return BadRequest("Cannot send this message");
            }

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = messageDto.Content
            };

            await _messageRepository.AddMessage(message);

            return message.ToDto();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memberId = User.GetMemberId();

            var message = await _messageRepository.GetMessage(id);

            if(message is null)
            {
                return BadRequest("Cannot delete this message");
            }

            if(message.SenderId != memberId && message.RecipientId != memberId)
            {
                return BadRequest("You cannot delete this message");
            }

            if(message.SenderId == memberId)
            {
                message.DeteltedBySender = true;
            }

            if(message.RecipientId == memberId)
            {
                message.DeletedByRecipient = true;
            }

            if(message is { DeteltedBySender: true, DeletedByRecipient: true })
            {
                await _messageRepository.DeleteMeesage(message);               
            }

            return Ok();
        }

    }
}
