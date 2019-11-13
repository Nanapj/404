namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F15 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.DetailEvents", "AgencySold", c => c.String());
            AddColumn("dbo.DetailEvents", "DateSold", c => c.DateTime(nullable: false));
            AddColumn("dbo.DetailEvents", "AssociateName", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.DetailEvents", "AssociateName");
            DropColumn("dbo.DetailEvents", "DateSold");
            DropColumn("dbo.DetailEvents", "AgencySold");
        }
    }
}
