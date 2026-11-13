using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Peppish.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeAvatarSettingsNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SkinColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "#FFDBB4");

            migrationBuilder.AlterColumn<string>(
                name: "Hairstyle",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "short");

            migrationBuilder.AlterColumn<string>(
                name: "HairColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "#624A2F");

            migrationBuilder.AlterColumn<string>(
                name: "EyebrowColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "#433A30");

            migrationBuilder.AlterColumn<string>(
                name: "EyeColor",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "#5B3828");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SkinColor",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "#FFDBB4",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Hairstyle",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "short",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HairColor",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "#624A2F",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EyebrowColor",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "#433A30",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EyeColor",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "#5B3828",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
