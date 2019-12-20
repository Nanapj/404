namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F23 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EStatusLogs",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Status = c.Int(nullable: false),
                        Note = c.String(),
                        EventId = c.Guid(nullable: false),
                        EventCode = c.String(),
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
            DropForeignKey("dbo.EStatusLogs", "UserAccount_Id", "dbo.AspNetUsers");
            DropIndex("dbo.EStatusLogs", new[] { "UserAccount_Id" });
            DropTable("dbo.EStatusLogs");
        }
    }
}
