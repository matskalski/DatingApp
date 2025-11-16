using CloudinaryDotNet.Actions;

namespace DatingApp.Api.Services.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> UploadPhoto(IFormFile file);
        Task<DeletionResult> DeletePhoto(string publicId);
    }
}
