namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F27 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BlogPS",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Category = c.String(),
                        Note = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.TopicPS",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Title = c.String(),
                        Decription = c.String(),
                        Content = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        BlogPS_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.BlogPS", t => t.BlogPS_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.BlogPS_Id)
                .Index(t => t.UserAccount_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.BlogPS", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.TopicPS", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.TopicPS", "BlogPS_Id", "dbo.BlogPS");
            DropIndex("dbo.TopicPS", new[] { "UserAccount_Id" });
            DropIndex("dbo.TopicPS", new[] { "BlogPS_Id" });
            DropIndex("dbo.BlogPS", new[] { "UserAccount_Id" });
            DropTable("dbo.TopicPS");
            DropTable("dbo.BlogPS");
        }
    }
}
