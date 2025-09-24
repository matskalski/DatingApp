﻿using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using DatingApp.Api.DTOs;
using DatingApp.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Data
{
    public class Seed
    {
        public static async Task SeedData(AppDbContext context)
        {
            if (await context.Users.AnyAsync())
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
                using (var hmac = new HMACSHA512())
                {
                    var user = new AppUser
                    {
                        Id = member.Id,
                        Email = member.Email,
                        DisplayName = member.DisplayName,
                        ImageUrl = member.ImageUrl,
                        PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("test")),
                        PasswordSalt = hmac.Key,
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

                    await context.Users.AddAsync(user);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
