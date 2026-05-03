namespace API_Peppish.DTOs;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid HouseholdId { get; set; }
}

public class HouseholdDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<UserDto> Users { get; set; } = new();
}

public class ChoreTemplateDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal RewardAmount { get; set; }
    public int RewardPoints { get; set; }
    public string Recurrence { get; set; } = string.Empty;
}

public class ChoreAssignmentDto
{
    public Guid Id { get; set; }
    public Guid ChoreTemplateId { get; set; }
    public string AssignedToUserId { get; set; } = string.Empty;
    public string AssignedToUserName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
}

public class ChoreInstanceDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string AssignedToUserId { get; set; } = string.Empty;
    public string AssignedToUserName { get; set; } = string.Empty;
    public decimal RewardAmount { get; set; }
}

public class BalanceDto
{
    public decimal Balance { get; set; }
}

public class ProgressDto
{
    public int CurrentLevel { get; set; }
    public int CurrentXp { get; set; }
    public int DailyProgressPercent { get; set; }
}

public class RewardDto
{
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

// Request DTOs
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

public class CreateChoreTemplateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal RewardAmount { get; set; }
    public int RewardPoints { get; set; }
    public string Recurrence { get; set; } = string.Empty;
}

public class AssignChoreRequest
{
    public Guid ChoreTemplateId { get; set; }
    public string AssignedToUserId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
}
