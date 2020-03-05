namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F29 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ProductAttributes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        ProductType_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ProductTypes", t => t.ProductType_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.ProductType_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.OrderDetails",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        ProductId = c.Guid(nullable: false),
                        ProductName = c.String(),
                        Quantity = c.Int(nullable: false),
                        Price = c.Double(nullable: false),
                        IsGift = c.Boolean(nullable: false),
                        Serial = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        Order_Id = c.Guid(),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Orders", t => t.Order_Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.Order_Id)
                .Index(t => t.UserAccount_Id);
            
            CreateTable(
                "dbo.Orders",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Code = c.String(),
                        Total = c.Double(nullable: false),
                        Note = c.String(),
                        IsGift = c.Boolean(nullable: false),
                        SaleEmployeeID = c.Guid(),
                        SaleEmployeeName = c.String(),
                        Appointment = c.DateTime(),
                        Source = c.String(),
                        TypeOrder = c.String(),
                        StatusOrder = c.Int(nullable: false),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
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
                "dbo.OrderStatistics",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        OrderId = c.Guid(),
                        OrderDetailId = c.Guid(),
                        ProductId = c.Guid(),
                        ProductAttributeId = c.Guid(),
                        ProductAttributeName = c.String(),
                        ProductAttributeNote = c.String(),
                        Serial = c.String(),
                        CreatDate = c.DateTime(nullable: false),
                        LastModifiedDate = c.DateTime(nullable: false),
                        Delete = c.Boolean(nullable: false),
                        UserAccount_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserAccount_Id)
                .Index(t => t.UserAccount_Id);
            
            AddColumn("dbo.ProductTypes", "Price", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.OrderStatistics", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.OrderDetails", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.Orders", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.OrderDetails", "Order_Id", "dbo.Orders");
            DropForeignKey("dbo.Orders", "Customer_Id", "dbo.Customers");
            DropForeignKey("dbo.ProductAttributes", "UserAccount_Id", "dbo.AspNetUsers");
            DropForeignKey("dbo.ProductAttributes", "ProductType_Id", "dbo.ProductTypes");
            DropIndex("dbo.OrderStatistics", new[] { "UserAccount_Id" });
            DropIndex("dbo.Orders", new[] { "UserAccount_Id" });
            DropIndex("dbo.Orders", new[] { "Customer_Id" });
            DropIndex("dbo.OrderDetails", new[] { "UserAccount_Id" });
            DropIndex("dbo.OrderDetails", new[] { "Order_Id" });
            DropIndex("dbo.ProductAttributes", new[] { "UserAccount_Id" });
            DropIndex("dbo.ProductAttributes", new[] { "ProductType_Id" });
            DropColumn("dbo.ProductTypes", "Price");
            DropTable("dbo.OrderStatistics");
            DropTable("dbo.Orders");
            DropTable("dbo.OrderDetails");
            DropTable("dbo.ProductAttributes");
        }
    }
}
