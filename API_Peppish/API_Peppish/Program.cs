using API_Peppish.Data;
using API_Peppish.Entities;
using API_Peppish.Repositories;
using API_Peppish.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

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
builder.Services.AddScoped<IJoinCodeRepository, JoinCodeRepository>();
builder.Services.AddScoped<IChoreTemplateRepository, ChoreTemplateRepository>();
builder.Services.AddScoped<IChoreAssignmentRepository, ChoreAssignmentRepository>();
builder.Services.AddScoped<IChoreInstanceRepository, ChoreInstanceRepository>();
builder.Services.AddScoped<IRewardRepository, RewardRepository>();
builder.Services.AddScoped<IAvatarProgressRepository, AvatarProgressRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserContextService, UserContextService>();
builder.Services.AddScoped<IJoinCodeService, JoinCodeService>();
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
//builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ange JWT-token. Exempel: Bearer {token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

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

using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
  db.Database.Migrate();
}

app.Run();
