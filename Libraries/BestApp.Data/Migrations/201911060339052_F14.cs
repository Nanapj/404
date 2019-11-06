namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F14 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Wards", "type", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Wards", "type");
        }
    }
}
