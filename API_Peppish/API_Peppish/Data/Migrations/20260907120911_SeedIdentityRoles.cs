using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API_Peppish.Data.Migrations
{
  /// <inheritdoc />
  public partial class SeedIdentityRoles : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.InsertData(
          table: "AspNetRoles",
          columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
          values: new object[,]
          {
                    { "d7b3e1a1-8a41-4b7c-9e31-111111111111", null, "ADULT", "ADULT" },
                    { "e8c4f2b2-9b52-4c8d-af42-222222222222", null, "CHILD", "CHILD" }
          });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DeleteData(
          table: "AspNetRoles",
          keyColumn: "Id",
          keyValue: "d7b3e1a1-8a41-4b7c-9e31-111111111111");

      migrationBuilder.DeleteData(
          table: "AspNetRoles",
          keyColumn: "Id",
          keyValue: "e8c4f2b2-9b52-4c8d-af42-222222222222");
    }
  }
}
