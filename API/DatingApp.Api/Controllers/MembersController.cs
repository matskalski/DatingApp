using DatingApp.Api.DTOs;
using DatingApp.Api.Entities;
using DatingApp.Api.Extensions;
using DatingApp.Api.Repositories.Interfaces;
using DatingApp.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class MembersController : ControllerBase
    {
        private readonly IMembersRepository _membersRepository;
        private readonly IPhotoService _photoService;

        public MembersController(IMembersRepository membersRepository, IPhotoService photoService)
        {
            _membersRepository = membersRepository;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await _membersRepository.GetMembers());
        }

        [HttpGet("{id}")]
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

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdate)
        {
            var memberId = User.GetMemberId();

            var member = await _membersRepository.GetMemberById(memberId);

            if (member is null) 
            {
                return BadRequest("Cound not get member");
            }

            member.Update(memberUpdate.DisplayName, memberUpdate.Description, memberUpdate.City, memberUpdate.Country);

            await _membersRepository.Update(member);

            return Ok(member);

        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto(IFormFile file)
        {
            var member = await _membersRepository.GetMemberById(User.GetMemberId());

            if (member is null)
            {
                return BadRequest("Cannot update member");
            }

            var result = await _photoService.UploadPhoto(file);

            if(result.Error is not null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo()
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId(),
            };

            if(member.ImageUrl is null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            await _membersRepository.Update(member);            

            return Ok(photo);
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await _membersRepository.GetMemberById(User.GetMemberId());

            if(member is null)
            {
                return BadRequest("Cannot get member from token");
            }

            var photo = member.Photos.SingleOrDefault(ph => ph.Id == photoId);

            if(member.ImageUrl == photo?.Url)
            {
                return NoContent();
            }

            if (photo == null)
            {
                return BadRequest("Cannot set this as main image");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            await _membersRepository.Update(member);
            return NoContent();
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await _membersRepository.GetMemberById(User.GetMemberId());

            if (member is null)
            {
                return BadRequest("Cannot get member from token");
            }

            var photo = member.Photos.SingleOrDefault(ph => ph.Id == photoId);

            if(photo is null || photo.Url == member.ImageUrl)
            {
                return BadRequest("This photo cannot be deleted");
            }

            if(photo.PublicId is not null)
            {
                var result = await _photoService.DeletePhoto(photo.PublicId);
                if(result.Error is not null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            member.Photos.Remove(photo);

            await _membersRepository.Update(member);
            return NoContent();
        }
    }
}
