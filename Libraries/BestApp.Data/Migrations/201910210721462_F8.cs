namespace BestApp.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class F8 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.DepartmentTags", "Department_Id", "dbo.Departments");
            DropForeignKey("dbo.DepartmentTags", "Tag_Id", "dbo.Tags");
            DropIndex("dbo.DepartmentTags", new[] { "Department_Id" });
            DropIndex("dbo.DepartmentTags", new[] { "Tag_Id" });
            AddColumn("dbo.Tags", "Departments_Id", c => c.Guid());
            CreateIndex("dbo.Tags", "Departments_Id");
            AddForeignKey("dbo.Tags", "Departments_Id", "dbo.Departments", "Id");
            DropTable("dbo.DepartmentTags");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.DepartmentTags",
                c => new
                    {
                        Department_Id = c.Guid(nullable: false),
                        Tag_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.Department_Id, t.Tag_Id });
            
            DropForeignKey("dbo.Tags", "Departments_Id", "dbo.Departments");
            DropIndex("dbo.Tags", new[] { "Departments_Id" });
            DropColumn("dbo.Tags", "Departments_Id");
            CreateIndex("dbo.DepartmentTags", "Tag_Id");
            CreateIndex("dbo.DepartmentTags", "Department_Id");
            AddForeignKey("dbo.DepartmentTags", "Tag_Id", "dbo.Tags", "Id", cascadeDelete: true);
            AddForeignKey("dbo.DepartmentTags", "Department_Id", "dbo.Departments", "Id", cascadeDelete: true);
        }
    }
}
