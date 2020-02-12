using BestApp.Core.Models;
using BestApp.Core.Models.PiShop;
using BestApp.Domain.PiShop;
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
using static BestApp.Services.PiShop.BlogPSService;

namespace BestApp.Services.PiShop
{
    public class BlogPSService : Service<BlogPS>, IBlogPSService
    {
        public interface IBlogPSService : IService<BlogPS>
        {
            BlogPS Insert(BlogPSViewModel model);
            Task<BlogPS> InsertAsync(BlogPSViewModel model);
            Task<IQueryable<BlogPSViewModel>> GetAllBlogPSsAsync();
            IQueryable<BlogPS> GetAllBlogPSs();
            Task<BlogPSViewModel> UpdateAsync(BlogPSViewModel model);
            bool Delete(Guid Id);
        }
        private readonly IRepositoryAsync<BlogPS> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public BlogPSService(IRepositoryAsync<BlogPS> repository) : base(repository)
        {
            _repository = repository;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        public IQueryable<BlogPS> GetAllBlogPSs()
        {
            return _repository.Queryable();
        }
        public Task<IQueryable<BlogPSViewModel>> GetAllBlogPSsAsync()
        {
            return Task.Run(() => GetAllBlogPSs().Where(x => x.Delete == false)
            .Select(x => new BlogPSViewModel()
            {
                ID = x.Id,
                Category = x.Category,
                TopicPSs = x.TopicPSs.Where(y => y.Delete == false).Select(y => new TopicPSViewModel
                {
                    ID = y.Id,
                    Title = y.Title,
                    Decription = y.Decription,
                    Content = y.Content,
                    CreatDate = y.CreatDate
                }).ToList(),
                Note = x.Note,
                CreatDate = x.CreatDate,
                LastModifiedDate = x.LastModifiedDate,
                Delete = x.Delete
            }));
        }
        public BlogPS Insert(BlogPSViewModel model)
        {
            var data = new BlogPS();
            data.Category = model.Category;
            data.Note = model.Note;
            data.CreatDate = DateTime.Now;
            data.LastModifiedDate = DateTime.Now;
            data.Delete = false;
            //data.BlogPS = _blogPSService.Queryable()
            base.Insert(data);
            return data;
        }
        public async Task<BlogPS> InsertAsync(BlogPSViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public async Task<BlogPSViewModel> UpdateAsync(BlogPSViewModel model)
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
        public bool Update(BlogPSViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Category = model.Category;
                data.Note = model.Note;
                data.LastModifiedDate = DateTime.Now;
                return true;
            }
            else
            {
                throw new Exception("Không tìm thấy chủ đề");
            }
        }
        public bool Delete(Guid Id)
        {
            var result = Find(Id);
            if (result != null)
            {   if(result.TopicPSs.Any() == false)
                {
                    result.Delete = true;
                    result.LastModifiedDate = DateTime.Now;
                    return true;
                }
                throw new Exception("Không xóa chủ đề khi có bài viết");
            }
            else
            {
                throw new Exception("Không tìm thấy phiếu");
            }
        }
    }
}
