using System.Net;

namespace DatingApp.Api.Exceptions
{
    public abstract class BaseException : Exception
    {
        public HttpStatusCode? StatusCode = null;

        protected BaseException(string message, HttpStatusCode? statusCode = null) : base(message)
        { 
            StatusCode = statusCode;
        }
    }
}
