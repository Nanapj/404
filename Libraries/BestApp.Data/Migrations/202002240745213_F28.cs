namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F28 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TopicPS", "Thumbnail", c => c.String());
            AddColumn("dbo.TopicPS", "LinkVid", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.TopicPS", "LinkVid");
            DropColumn("dbo.TopicPS", "Thumbnail");
        }
    }
}
