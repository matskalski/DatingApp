using DatingApp.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Controllers
{
    //zawarte w BaseApiController
    //[Route("api/[controller]")]
    //[ApiController]
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users.ToListAsync();
            var userList = new List<object>();

            foreach (var user in users)
            {
                userList.Add(new
                {
                    user.Id,
                    user.Email,
                    Roles = (await _userManager.GetRolesAsync(user)).ToList()
                });
            }

            return Ok(userList);
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("edit-roles/{userId}")]
        public async Task<ActionResult> EditRoles(string userId, [FromBody] string[] roles) 
        {
            if (!roles.Any()) 
            {
                return BadRequest("You must select at least one role");
            }

            if (roles.Any(role => string.IsNullOrEmpty(role))) 
            {
                return BadRequest("Roles cannot be empty");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if(user is null)
            {
                return BadRequest("Could not retieve user");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, roles.Except(userRoles));

            if (!result.Succeeded)
            {
                return BadRequest("Failed to add to roles");
            }

            result =  await _userManager.RemoveFromRolesAsync(user, userRoles.Except(roles));

            if (!result.Succeeded)
            {
                return BadRequest("Failed to remove from roles");
            }

            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("admins or moderators can see this");
        }
    }
}
