using DatingApp.Api.DTOs;
using System.Text.Json;

namespace DatingApp.Api.Middlewares
{
    public class ExceptionMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception e)
            {
                var exception = new ExceptionDto
                {
                    StatusCode = context.Response.StatusCode,
                    Message = e.Message,
                    Details = e.StackTrace
                };

                context.Response.ContentType = "application/json";

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var json = JsonSerializer.Serialize(exception, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
