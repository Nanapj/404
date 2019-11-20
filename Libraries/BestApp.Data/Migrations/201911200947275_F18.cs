namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F18 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "EventTypeId", c => c.Guid(nullable: false));
            AddColumn("dbo.Events", "EventPurposeId", c => c.Guid(nullable: false));
            DropColumn("dbo.Events", "TypeEvent");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Events", "TypeEvent", c => c.String());
            DropColumn("dbo.Events", "EventPurposeId");
            DropColumn("dbo.Events", "EventTypeId");
        }
    }
}
