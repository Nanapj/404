namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F7 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Cats", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Customers", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.CustomerTags", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Events", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.DetailEvents", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.InteractionHistories", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.ReminderNotes", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Tags", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Departments", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.ProductTypes", "LastModifiedDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Staffs", "LastModifiedDate", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Staffs", "LastModifiedDate");
            DropColumn("dbo.ProductTypes", "LastModifiedDate");
            DropColumn("dbo.Departments", "LastModifiedDate");
            DropColumn("dbo.Tags", "LastModifiedDate");
            DropColumn("dbo.ReminderNotes", "LastModifiedDate");
            DropColumn("dbo.InteractionHistories", "LastModifiedDate");
            DropColumn("dbo.DetailEvents", "LastModifiedDate");
            DropColumn("dbo.Events", "LastModifiedDate");
            DropColumn("dbo.CustomerTags", "LastModifiedDate");
            DropColumn("dbo.Customers", "LastModifiedDate");
            DropColumn("dbo.Cats", "LastModifiedDate");
        }
    }
}
