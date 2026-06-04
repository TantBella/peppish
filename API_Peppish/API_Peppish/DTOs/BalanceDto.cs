namespace API_Peppish.DTOs;

public class BalanceDto
{
    public string UserId { get; set; } = string.Empty;

    public decimal MoneyBalance { get; set; }

    public int TotalXp { get; set; }

    public int Level { get; set; }
}
