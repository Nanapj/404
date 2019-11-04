using BestApp.Core.Models;
using BestApp.Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Repository.Pattern;
using Repository.Repositories;
using Service;
using Service.Pattern;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BestApp.Services.TagService;

namespace BestApp.Services
{
    public class TagService : Service<Tag>, ITagService
    {
        public interface ITagService : IService<Tag>
        {
            Tag Insert(TagViewModel model);
            Task<Tag> InsertAsync(TagViewModel model);
            Task<TagViewModel> UpdateAsync(TagViewModel model);
            Task<IQueryable<TagViewModel>> GetAllTagsAsync();
            IQueryable<Tag> GetAllTags();
            bool Delete(Guid Id);
        }
        private readonly DepartmentService _departmentService;
        private readonly IRepositoryAsync<Tag> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public TagService(IRepositoryAsync<Tag> repository,
            DepartmentService departmentService) : base(repository)
        {
            _repository = repository;
            _departmentService = departmentService;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));

        }
        public IQueryable<Tag> GetAllTags()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<TagViewModel>> GetAllTagsAsync()
        {
            return Task.Run(() => GetAllTags()
            .Where(x => x.Delete == false)
            .Select(x => new TagViewModel()
            {
                ID = x.Id,
                NameTag = x.NameTag,
                CodeTag = x.CodeTag,
                Status = x.Status,
                DepartmentName = x.Departments.Name,
                DepartmentID = x.Departments.Id
                
            }));
        }
        public Tag Insert(TagViewModel model)
        {
            var find = Queryable().Where(x => x.NameTag == model.NameTag && x.Departments.Id == model.DepartmentID).FirstOrDefault();
            if (find != null)
            {
                throw new Exception("Tag đã tồn tại");
            }
            else
            {
                var data = new Tag();

                data.NameTag = model.NameTag;
                data.CodeTag = model.CodeTag;
                data.Status = Core.Enum.StatusTag.New;
                data.Departments = _departmentService.Find(model.DepartmentID);
                data.CreatDate = DateTime.Now;
                data.Delete = false;
                data.LastModifiedDate = DateTime.Now;
                //data.UserAccount = _userRepository.Find(HttpContext.Current.User.Identity.GetUserId());
                base.Insert(data);
                return data;
            }

        }
        public async Task<Tag> InsertAsync(TagViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public bool Update(TagViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.NameTag = model.NameTag;
                data.CodeTag = model.CodeTag;
                data.Status = model.Status;
                data.LastModifiedDate = DateTime.Now;
            }
            return true;

        }
        public async Task<TagViewModel> UpdateAsync(TagViewModel model)
        {
            try
            {
                await Task.Run(() => Update(model));
                return model;
            }
            catch (Exception e)
            {
                throw (e);
            }
        }
        public bool Delete(Guid Id)
        {
            var result = Find(Id);
            if (result != null)
            {
               result.Delete = true;
               result.LastModifiedDate = DateTime.Now;
               return true;

            }
            else
            {
                throw new Exception("Không tìm thấy phòng ban");
            }
        }
    }
}
