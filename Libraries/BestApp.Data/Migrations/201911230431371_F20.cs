namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F20 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.DetailEvents", "DateSold", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.DetailEvents", "DateSold", c => c.DateTime(nullable: false));
        }
    }
}
