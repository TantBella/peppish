namespace API_Peppish.DTOs;

public class ProgressDto
{
    public int CurrentLevel { get; set; }

    public int CurrentXp { get; set; }

    public int XpToNextLevel { get; set; }

    public int DailyProgressPercent { get; set; }
}
