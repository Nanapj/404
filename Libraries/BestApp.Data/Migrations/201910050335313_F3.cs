namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F3 : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.Cats");
            DropPrimaryKey("dbo.Staffs");
            DropColumn("dbo.Cats", "Id");
            AddColumn("dbo.Cats", "Id", c => c.Guid(nullable: false, identity: true));
            AddPrimaryKey("dbo.Cats", "Id");
            DropColumn("dbo.Staffs", "Id");
            AddColumn("dbo.Staffs", "Id", c => c.Guid(nullable: false, identity: true));
            AddPrimaryKey("dbo.Staffs", "Id");
        }
        
        public override void Down()
        {
            DropPrimaryKey("dbo.Staffs");
            DropPrimaryKey("dbo.Cats");

            DropColumn("dbo.Staffs", "Id");
            AddColumn("dbo.Staffs", "Id", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("dbo.Staffs", "Id");

            DropColumn("dbo.Cats", "Id");
            AddColumn("dbo.Cats", "Id", c => c.Int(nullable: false, identity: true));
            AddPrimaryKey("dbo.Cats", "Id");

        }
    }
}
