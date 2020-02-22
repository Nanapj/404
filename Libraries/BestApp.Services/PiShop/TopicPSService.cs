using BestApp.Core.Models;
using BestApp.Core.Models.PiShop;
using BestApp.Domain;
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
using System.Web;
using static BestApp.Services.PiShop.TopicPSService;

namespace BestApp.Services.PiShop
{
    public class TopicPSService : Service<TopicPS>, ITopicPSService
    {
        public interface ITopicPSService : IService<TopicPS>
        {
            TopicPS Insert(TopicPSViewModel model);
            Task<TopicPS> InsertAsync(TopicPSViewModel model);
            Task<IQueryable<TopicPSViewModel>> GetAllTopicPSsAsync();
            TopicPSViewModel GetTopicPSs(Guid ID);
            Task<TopicPSViewModel> GetTopicPSsAsync(Guid ID);
            IQueryable<TopicPS> GetAllTopicPSs();
            Task<TopicPSViewModel> UpdateAsync(TopicPSViewModel model);
            bool Delete(Guid Id);
        }
        private readonly BlogPSService _blogPSService;
        private readonly IRepositoryAsync<TopicPS> _repository;
        private readonly IRepository<ApplicationUser> _userRepository;
        protected readonly DataContext db;
        protected UserManager<ApplicationUser> userManager;
        public TopicPSService(IRepositoryAsync<TopicPS> repository,
            BlogPSService blogPSService) : base(repository)
        {
            _repository = repository;
            _blogPSService = blogPSService;
            db = new DataContext();
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }
        public IQueryable<TopicPS> GetAllTopicPSs()
        {
           
            return _repository.Queryable();
        }
        public Task<IQueryable<TopicPSViewModel>> GetAllTopicPSsAsync()
        {
            return Task.Run(() => GetAllTopicPSs().Where(x => x.Delete == false)
            .Select(x => new TopicPSViewModel()
            {
                ID = x.Id,
                Title = x.Title,
                Decription = x.Decription,
                Content =  x.Content,
                BlogPSID = x.BlogPS.Id,
                CreatDate = x.CreatDate,
                LastModifiedDate = x.LastModifiedDate,
                BlogCategory = x.BlogPS.Category,
                Delete = x.Delete
            }));
        }
        public TopicPSViewModel GetTopicPSs(Guid ID)
        {
            var result = GetAllTopicPSs().Where(x => x.Delete == false && x.Id == ID)
            .Select(x => new TopicPSViewModel()
            {
                ID = x.Id,
                Title = x.Title,
                Decription = x.Decription,
                Content = x.Content,
                BlogPSID = x.BlogPS.Id,
                CreatDate = x.CreatDate,
                LastModifiedDate = x.LastModifiedDate,
                BlogCategory = x.BlogPS.Category,
                Delete = x.Delete
            }).FirstOrDefault();
            return result;
        }

        public Task<TopicPSViewModel> GetTopicPSsAsync(Guid ID)
        {
            return Task.Run(() => GetTopicPSs(ID));
        }
        public TopicPS Insert(TopicPSViewModel model)
        {
            var data = new TopicPS();
            data.Content = model.Content;
            data.Title = model.Title;
            data.Decription = model.Decription;
            data.CreatDate = DateTime.Now;
            data.LastModifiedDate = DateTime.Now;
            data.Delete = false;
            data.BlogPS = _blogPSService.Find(model.BlogPSID);
            base.Insert(data);
            return data;
        }
        public async Task<TopicPS> InsertAsync(TopicPSViewModel model)
        {
            return await Task.Run(() => Insert(model));
        }
        public async Task<TopicPSViewModel> UpdateAsync(TopicPSViewModel model)
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
        public bool Update(TopicPSViewModel model)
        {
            var data = Find(model.ID);
            if (data != null)
            {
                data.Content = model.Content;
                data.Content = model.Content;
                data.Title = model.Title;
                data.Decription = model.Decription;
                data.LastModifiedDate = DateTime.Now;
                return true;
            }
            else
            {
                throw new Exception("Không tìm thấy bài viết");
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
                throw new Exception("Không tìm thấy phiếu");
            }
        }
    }
}
