namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F9 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ReminderNotes", "Note", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ReminderNotes", "Note");
        }
    }
}
