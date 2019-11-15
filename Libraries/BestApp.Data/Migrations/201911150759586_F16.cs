namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F16 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ReminderNotes", "Serial", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ReminderNotes", "Serial");
        }
    }
}
