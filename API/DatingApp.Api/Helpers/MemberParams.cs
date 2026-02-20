namespace DatingApp.Api.Helpers
{
    public class MemberParams : PagingParams
    {
        public string? Gender { get; set; }
        public string? CurrentMemberId { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        //public string OrderBy { get; set; } = "lastActive";
    }
}
