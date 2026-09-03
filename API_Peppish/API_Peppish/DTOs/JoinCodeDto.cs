namespace API_Peppish.DTOs
{
    public class JoinCodeDto
    {
        public string Code { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}
