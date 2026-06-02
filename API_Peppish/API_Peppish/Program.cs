using API_Peppish.Data;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using API_Peppish.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
  options.Password.RequiredLength = 8;
  options.Password.RequireDigit = true;
  options.Password.RequireNonAlphanumeric = false;
  options.Password.RequireUppercase = true;
  options.Password.RequireLowercase = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

if (string.IsNullOrWhiteSpace(jwtKey))
  throw new InvalidOperationException("Jwt:Key saknas");

if (string.IsNullOrWhiteSpace(jwtIssuer))
  throw new InvalidOperationException("Jwt:Issuer saknas");

if (string.IsNullOrWhiteSpace(jwtAudience))
  throw new InvalidOperationException("Jwt:Audience saknas");

var key = Encoding.ASCII.GetBytes(jwtKey!);
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(key),
    ValidateIssuer = true,
    ValidIssuer = jwtIssuer,
    ValidateAudience = true,
    ValidAudience = jwtAudience,
    ValidateLifetime = true,
    ClockSkew = TimeSpan.Zero
  };
});

// Register Repositories
builder.Services.AddScoped<IHouseholdRepository, HouseholdRepository>();
builder.Services.AddScoped<IChoreTemplateRepository, ChoreTemplateRepository>();
builder.Services.AddScoped<IChoreAssignmentRepository, ChoreAssignmentRepository>();
builder.Services.AddScoped<IChoreInstanceRepository, ChoreInstanceRepository>();
builder.Services.AddScoped<IRewardRepository, RewardRepository>();
builder.Services.AddScoped<IAvatarProgressRepository, AvatarProgressRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserContextService, UserContextService>();
builder.Services.AddScoped<IChoreTemplateService, ChoreTemplateService>();
builder.Services.AddScoped<IChoreAssignmentService, ChoreAssignmentService>();
builder.Services.AddScoped<IChoreInstanceService, ChoreInstanceService>();
builder.Services.AddScoped<IRewardService, RewardService>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Add HttpContextAccessor for UserContextService
builder.Services.AddHttpContextAccessor();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend", policy =>
  {
    policy
          .WithOrigins("https://peppish.vercel.app", "http://localhost:3000", "http://localhost:5000")
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});

var app = builder.Build();

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Urls.Add($"http://0.0.0.0:{port}");

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}
//ta bort nedan vid senare tillfälle
app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();
