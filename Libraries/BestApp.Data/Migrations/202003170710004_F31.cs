namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F31 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "StatusSeen", c => c.Int(nullable: false));
            AddColumn("dbo.Orders", "StatusSeen", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Orders", "StatusSeen");
            DropColumn("dbo.Events", "StatusSeen");
        }
    }
}
