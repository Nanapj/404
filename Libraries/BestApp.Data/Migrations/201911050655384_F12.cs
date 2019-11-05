namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F12 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Cities",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        slug = c.String(),
                        type = c.String(),
                        name_with_type = c.String(),
                        code = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Districts",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        slug = c.String(),
                        type = c.String(),
                        name_with_type = c.String(),
                        code = c.String(),
                        path = c.String(),
                        path_with_type = c.String(),
                        parent_code = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Wards",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        name = c.String(),
                        slug = c.String(),
                        name_with_type = c.String(),
                        path = c.String(),
                        path_with_type = c.String(),
                        code = c.String(),
                        parent_code = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Wards");
            DropTable("dbo.Districts");
            DropTable("dbo.Cities");
        }
    }
}
