using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Peppish.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarSettingsToApplicationUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EyeColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EyebrowColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HairColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hairstyle",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SkinColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EyeColor",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "EyebrowColor",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "HairColor",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Hairstyle",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SkinColor",
                table: "AspNetUsers");
        }
    }
}
