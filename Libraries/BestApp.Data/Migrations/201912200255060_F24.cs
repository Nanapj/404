namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F24 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EStatusLogs", "Event_Id", c => c.Guid());
            CreateIndex("dbo.EStatusLogs", "Event_Id");
            AddForeignKey("dbo.EStatusLogs", "Event_Id", "dbo.Events", "Id");
            DropColumn("dbo.EStatusLogs", "EventId");
            DropColumn("dbo.EStatusLogs", "EventCode");
        }
        
        public override void Down()
        {
            AddColumn("dbo.EStatusLogs", "EventCode", c => c.String());
            AddColumn("dbo.EStatusLogs", "EventId", c => c.Guid(nullable: false));
            DropForeignKey("dbo.EStatusLogs", "Event_Id", "dbo.Events");
            DropIndex("dbo.EStatusLogs", new[] { "Event_Id" });
            DropColumn("dbo.EStatusLogs", "Event_Id");
        }
    }
}
