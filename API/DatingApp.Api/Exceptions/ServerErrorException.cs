namespace DatingApp.Api.Exceptions
{
    public class ServerErrorException : BaseException
    {
        public ServerErrorException() : base("This is server error", System.Net.HttpStatusCode.InternalServerError)
        { }
    }
}
