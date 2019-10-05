namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Cats", "Delete", c => c.Boolean(nullable: false));
            AddColumn("dbo.Cats", "UserAccount_Id", c => c.String(maxLength: 128));
            AddColumn("dbo.Staffs", "Delete", c => c.Boolean(nullable: false));
            CreateIndex("dbo.Cats", "UserAccount_Id");
            AddForeignKey("dbo.Cats", "UserAccount_Id", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Cats", "UserAccount_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Cats", new[] { "UserAccount_Id" });
            DropColumn("dbo.Staffs", "Delete");
            DropColumn("dbo.Cats", "UserAccount_Id");
            DropColumn("dbo.Cats", "Delete");
        }
    }
}
