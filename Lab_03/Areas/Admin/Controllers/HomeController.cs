using Lab_03.DataAccess; // Thay bằng namespace chứa ApplicationDbContext của bạn
using Lab_03.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lab_03.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = SD.Role_Admin)]

    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Tiêm DbContext vào để chọc xuống Database
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Đếm số lượng từ các bảng và truyền ra View bằng ViewBag
            ViewBag.TotalProducts = _context.Products.Count();
            ViewBag.TotalCategories = _context.Categories.Count();
            ViewBag.TotalUsers = _context.Users.Count();

            return View();
        }
    }
}