namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F13 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Cities", "CreatDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Cities", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Cities", "Delete", c => c.Boolean(nullable: false));
            AddColumn("dbo.Cities", "UserAccount_Id", c => c.String(maxLength: 128));
            AddColumn("dbo.Districts", "CreatDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Districts", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Districts", "Delete", c => c.Boolean(nullable: false));
            AddColumn("dbo.Districts", "UserAccount_Id", c => c.String(maxLength: 128));
            AddColumn("dbo.Wards", "CreatDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Wards", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Wards", "Delete", c => c.Boolean(nullable: false));
            AddColumn("dbo.Wards", "UserAccount_Id", c => c.String(maxLength: 128));
            CreateIndex("dbo.Cities", "UserAccount_Id");
            CreateIndex("dbo.Districts", "UserAccount_Id");
            CreateIndex("dbo.Wards", "UserAccount_Id");
            AddForeignKey("dbo.Cities", "UserAccount_Id", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Districts", "UserAccount_Id", "dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.Wards", "UserAccount_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Wards", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Districts", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Cities", "UserAccount_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Wards", new[] { "UserAccount_Id" });
            DropIndex("dbo.Districts", new[] { "UserAccount_Id" });
            DropIndex("dbo.Cities", new[] { "UserAccount_Id" });
            DropColumn("dbo.Wards", "UserAccount_Id");
            DropColumn("dbo.Wards", "Delete");
            DropColumn("dbo.Wards", "LastModifiedDate");
            DropColumn("dbo.Wards", "CreatDate");
            DropColumn("dbo.Districts", "UserAccount_Id");
            DropColumn("dbo.Districts", "Delete");
            DropColumn("dbo.Districts", "LastModifiedDate");
            DropColumn("dbo.Districts", "CreatDate");
            DropColumn("dbo.Cities", "UserAccount_Id");
            DropColumn("dbo.Cities", "Delete");
            DropColumn("dbo.Cities", "LastModifiedDate");
            DropColumn("dbo.Cities", "CreatDate");
        }
    }
}
