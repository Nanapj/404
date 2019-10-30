namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F10 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.ReminderNotes", "EmployeeCreated");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ReminderNotes", "EmployeeCreated", c => c.Guid());
        }
    }
}
