namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F19 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EventPurposes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        EventType_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.EventTypes", t => t.EventType_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.EventType_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.EventTypes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.UserAccount_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.EventPurposes", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.EventTypes", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.EventPurposes", "EventType_Id", "dbo.EventTypes");
            DropIndex("dbo.EventTypes", new[] { "UserAccount_Id" });
            DropIndex("dbo.EventPurposes", new[] { "UserAccount_Id" });
            DropIndex("dbo.EventPurposes", new[] { "EventType_Id" });
            DropTable("dbo.EventTypes");
            DropTable("dbo.EventPurposes");
        }
    }
}
