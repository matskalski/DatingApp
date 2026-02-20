using DatingApp.Api.Data;
using DatingApp.Api.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        private readonly AppDbContext _dbContext;

        public LogUserActivity(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (context.HttpContext.User.Identity?.IsAuthenticated != true) 
            { 
                return; 
            }

            var memberId = resultContext.HttpContext.User.GetMemberId();

            //var dbContext = resultContext.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

            await _dbContext.Members
                .Where(x => x.Id == memberId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.LastActive, DateTime.UtcNow));
        }
    }
}
