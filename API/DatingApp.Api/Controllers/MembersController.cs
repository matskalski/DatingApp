using DatingApp.Api.Entities;
using DatingApp.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MembersController : ControllerBase
    {
        private readonly IMembersRepository _membersRepository;

        public MembersController(IMembersRepository membersRepository)
        {
            _membersRepository = membersRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await _membersRepository.GetMembers());
        }

        [HttpGet("id")]
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await _membersRepository.GetMemberById(id);

            if(member is null)
            {
                return NotFound();
            }

            return Ok(member);
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await _membersRepository.GetPhotosForMember(id));
        }

    }
}
