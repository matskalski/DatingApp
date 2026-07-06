using System.Text.Json;
using DatingApp.Api.DTOs;
using DatingApp.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Data
{
    public class Seed
    {
        public static async Task SeedData(UserManager<AppUser> userManager)
        {
            if (await userManager.Users.AnyAsync())
            {
                return;
            }

            var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

            if (members is null)
            {
                return;
            }

            foreach (var member in members)
            {
                var user = new AppUser
                {
                    Id = member.Id,
                    Email = member.Email,
                    NormalizedEmail = member.Email,
                    UserName = member.Email,
                    DisplayName = member.DisplayName,
                    ImageUrl = member.ImageUrl,
                    Member = new Member
                    {
                        Id = member.Id,
                        DisplayName = member.DisplayName,
                        Description = member.Description,
                        DateOfBirth = member.DateOfBirth,
                        ImageUrl = member.ImageUrl,
                        Gender = member.Gender,
                        City = member.City,
                        Country = member.Country,
                        LastActive = member.LastActive,
                        Created = member.Created,
                    }
                };

                user.Member.Photos.Add(new Photo
                {
                    Url = member.ImageUrl!,
                    MemberId = member.Id
                });


                var result = await userManager.CreateAsync(user, "test");

                if (!result.Succeeded)
                {
                    Console.WriteLine(result.Errors.First().Description);
                }

                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                UserName = "admin@test.com",
                Email = "admin@test.com",
                DisplayName = "Admin"
            };

            await userManager.CreateAsync(admin, "Password");
            await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
        }
    }
}