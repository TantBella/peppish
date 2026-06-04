namespace API_Peppish.DTOs;

public class RegisterRequest
{
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
  public string HouseholdName { get; set; } = string.Empty;
}

public class LoginRequest
{
  public string Email { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
}

public class RegisterResponse
{
  public string UserId { get; set; } = string.Empty;
  public string Token { get; set; } = string.Empty;
}

public class LoginResponse
{
  public string Token { get; set; } = string.Empty;
}
