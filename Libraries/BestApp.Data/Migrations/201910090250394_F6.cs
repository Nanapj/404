namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F6 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Customers",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Address = c.String(),
                        PhoneNumber = c.String(),
                        Birthday = c.DateTime(nullable: false),
                        Type = c.String(),
                        Note = c.String(),
                        District = c.String(),
                        Ward = c.String(),
                        City = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        Customer_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.Customer_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.Customer_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.CustomerTags",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        CodeTag = c.String(),
                        NameTag = c.String(),
                        Status = c.Int(nullable: false),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        Customer_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.Customer_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.Customer_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.Events",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Code = c.String(),
                        TypeEvent = c.String(),
                        Status = c.Int(nullable: false),
                        EmployeeID = c.Guid(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        Customer_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.Customer_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.Customer_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.DetailEvents",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Serial = c.String(),
                        Note = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        Event_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                        ProductType_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Events", t => t.Event_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .ForeignKey("dbo.ProductTypes", t => t.ProductType_Id)
                .Index(t => t.Event_Id)
                .Index(t => t.UserAccount_Id)
                .Index(t => t.ProductType_Id);
            
            CreateTable(
                "dbo.InteractionHistories",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Type = c.String(),
                        Note = c.String(),
                        EmployeeCall = c.Guid(),
                        EmployeeID = c.Guid(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        Event_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Events", t => t.Event_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.Event_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.ReminderNotes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        ReminderDate = c.DateTime(nullable: false),
                        EmployeeCreated = c.Guid(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        Event_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Events", t => t.Event_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.Event_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.Tags",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        NameTag = c.String(),
                        Status = c.Int(nullable: false),
                        CodeTag = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.Departments",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.ProductTypes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Code = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.DepartmentTags",
                c => new
                    {
                        Department_Id = c.Guid(nullable: false),
                        Tag_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Department_Id, t.Tag_Id })
                .ForeignKey("dbo.Departments", t => t.Department_Id, cascadeDelete: true)
                .ForeignKey("dbo.Tags", t => t.Tag_Id, cascadeDelete: true)
                .Index(t => t.Department_Id)
                .Index(t => t.Tag_Id);
            
            CreateTable(
                "dbo.TagEvents",
                c => new
                    {
                        Tag_Id = c.Guid(nullable: false),
                        Event_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Tag_Id, t.Event_Id })
                .ForeignKey("dbo.Tags", t => t.Tag_Id, cascadeDelete: true)
                .ForeignKey("dbo.Events", t => t.Event_Id, cascadeDelete: true)
                .Index(t => t.Tag_Id)
                .Index(t => t.Event_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ProductTypes", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.DetailEvents", "ProductType_Id", "dbo.ProductTypes");
            DropForeignKey("dbo.Customers", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Events", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Tags", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.TagEvents", "Event_Id", "dbo.Events");
            DropForeignKey("dbo.TagEvents", "Tag_Id", "dbo.Tags");
            DropForeignKey("dbo.Departments", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.DepartmentTags", "Tag_Id", "dbo.Tags");
            DropForeignKey("dbo.DepartmentTags", "Department_Id", "dbo.Departments");
            DropForeignKey("dbo.ReminderNotes", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ReminderNotes", "Event_Id", "dbo.Events");
            DropForeignKey("dbo.InteractionHistories", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.InteractionHistories", "Event_Id", "dbo.Events");
            DropForeignKey("dbo.DetailEvents", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.DetailEvents", "Event_Id", "dbo.Events");
            DropForeignKey("dbo.Events", "Customer_Id", "dbo.Customers");
            DropForeignKey("dbo.CustomerTags", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.CustomerTags", "Customer_Id", "dbo.Customers");
            DropForeignKey("dbo.Customers", "Customer_Id", "dbo.Customers");
            DropIndex("dbo.TagEvents", new[] { "Event_Id" });
            DropIndex("dbo.TagEvents", new[] { "Tag_Id" });
            DropIndex("dbo.DepartmentTags", new[] { "Tag_Id" });
            DropIndex("dbo.DepartmentTags", new[] { "Department_Id" });
            DropIndex("dbo.ProductTypes", new[] { "UserAccount_Id" });
            DropIndex("dbo.Departments", new[] { "UserAccount_Id" });
            DropIndex("dbo.Tags", new[] { "UserAccount_Id" });
            DropIndex("dbo.ReminderNotes", new[] { "UserAccount_Id" });
            DropIndex("dbo.ReminderNotes", new[] { "Event_Id" });
            DropIndex("dbo.InteractionHistories", new[] { "UserAccount_Id" });
            DropIndex("dbo.InteractionHistories", new[] { "Event_Id" });
            DropIndex("dbo.DetailEvents", new[] { "ProductType_Id" });
            DropIndex("dbo.DetailEvents", new[] { "UserAccount_Id" });
            DropIndex("dbo.DetailEvents", new[] { "Event_Id" });
            DropIndex("dbo.Events", new[] { "UserAccount_Id" });
            DropIndex("dbo.Events", new[] { "Customer_Id" });
            DropIndex("dbo.CustomerTags", new[] { "UserAccount_Id" });
            DropIndex("dbo.CustomerTags", new[] { "Customer_Id" });
            DropIndex("dbo.Customers", new[] { "UserAccount_Id" });
            DropIndex("dbo.Customers", new[] { "Customer_Id" });
            DropTable("dbo.TagEvents");
            DropTable("dbo.DepartmentTags");
            DropTable("dbo.ProductTypes");
            DropTable("dbo.Departments");
            DropTable("dbo.Tags");
            DropTable("dbo.ReminderNotes");
            DropTable("dbo.InteractionHistories");
            DropTable("dbo.DetailEvents");
            DropTable("dbo.Events");
            DropTable("dbo.CustomerTags");
            DropTable("dbo.Customers");
        }
    }
}
