using DatingApp.Api.Entities;
using DatingApp.Api.Enums;
using DatingApp.Api.Extensions;
using DatingApp.Api.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Api.Controllers
{
    //zawarte w BaseApiController
    //[Route("api/[controller]")]
    //[ApiController]
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;

        public LikesController(ILikesRepository likesRepository)
        {
            _likesRepository = likesRepository;
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<string>>> GetCurrentMemberLikeIds()
        {
            return Ok(await _likesRepository.GetCurrentMemberLikeIds(User.GetMemberId()));
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes(Predicates? predicate)
        {
            return Ok(await _likesRepository.GetMemberLikes(User.GetMemberId(), predicate));            
        }


        [HttpPost("{targetMemberId}")]
        public async Task<ActionResult> ToogleLike(string targetMemberId)
        {
            var sourceMemberId = User.GetMemberId();

            if (sourceMemberId == targetMemberId)
            {
                return BadRequest("You cannot like yourself");
            }

            var existingLike = await _likesRepository
                .GetMemberLike(sourceMemberId, targetMemberId);

            if (existingLike is null)
            {
                var like = new MemberLike
                {
                    SourceMemberId = sourceMemberId,
                    TargetMemberId = targetMemberId
                };

                await _likesRepository.AddLike(like);
            }
            else 
            {
                await _likesRepository.DeleteLike(existingLike);
            }

            return Ok();
        }
    }
}
