namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Staffs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FullName = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                        Address = c.String(),
                        HasAccount = c.Boolean(nullable: false),
                        CreatDate = c.DateTime(nullable: false),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.UserAccount_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Staffs", "UserAccount_Id", "dbo.AspNetUsers");
            DropIndex("dbo.Staffs", new[] { "UserAccount_Id" });
            DropTable("dbo.Staffs");
        }
    }
}
