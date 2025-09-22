namespace DatingApp.Api.DTOs
{
    public class ExceptionDto
    {
        public int StatusCode { get; set; }
        public required string Message { get; set; }
        public string? Details { get; set; }
    }
}
