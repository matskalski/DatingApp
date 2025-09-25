using DatingApp.Api.Data;
using DatingApp.Api.Middlewares;
using DatingApp.Api.Repositories;
using DatingApp.Api.Repositories.Interfaces;
using DatingApp.Api.Services;
using DatingApp.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddCors(setup =>
{
    setup.AddDefaultPolicy(pol =>
        pol.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyMethod()
            .WithHeaders(["Content-Type", "Authorization"])
            //.AllowAnyHeader()
        );
});

builder.Services.AddScoped<ITokensService, TokensService>();
builder.Services.AddScoped<IMembersRepository, MembersRepository>();

builder.Services.AddScoped<ExceptionMiddleware>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        var tokenKey = builder.Configuration["TokenKey"] ?? throw new Exception("Token key not found");

        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    });

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//to powinien byæ hosted service na starcie aplikacji
using(var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();

        await Seed.SeedData(context);
    }
    catch (Exception)
    {
        Console.Error.WriteLine("Error during migration");
    }
}

app.Run();
