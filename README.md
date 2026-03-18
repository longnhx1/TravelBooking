# ✈️ TravelBooking

Ứng dụng web đặt tour du lịch xây dựng bằng **ASP.NET MVC** trên Visual Studio 2022, sử dụng Entity Framework Code First, ASP.NET Identity và SQL Server LocalDB.

---

## 📋 Yêu cầu hệ thống

Trước khi clone project, hãy đảm bảo máy đã cài đầy đủ:

| Công cụ | Phiên bản khuyến nghị |
|---|---|
| Visual Studio | 2022 (Community / Professional) |
| .NET Framework / .NET | Theo cấu hình project |
| SQL Server LocalDB | Đi kèm Visual Studio |
| Git | Bất kỳ |

> **Lưu ý:** SQL Server LocalDB thường được cài tự động cùng Visual Studio. Kiểm tra bằng cách chạy `sqllocaldb info` trong Command Prompt.

---

## 🚀 Hướng dẫn cài đặt

### Bước 1 — Clone repository

```bash
git clone https://github.com/longnhx1/TravelBooking.git
cd TravelBooking
```

### Bước 2 — Mở project trong Visual Studio

1. Mở file **`TravelBooking.sln`** bằng Visual Studio.
2. Chờ Visual Studio restore NuGet packages tự động.
3. Nếu không tự restore, vào **Tools → NuGet Package Manager → Package Manager Console** và chạy:

```powershell
Update-Package -reinstall
```

### Bước 3 — Kiểm tra Connection String

Mở file **`Web.config`** (hoặc `appsettings.json` nếu dùng .NET Core), tìm phần `connectionStrings`:

```xml
<connectionStrings>
  <add name="DefaultConnection"
       connectionString="Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\TravelBooking.mdf;Integrated Security=True"
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

> ⚠️ Thông thường không cần chỉnh sửa. Nếu gặp lỗi kết nối, kiểm tra tên instance LocalDB bằng lệnh `sqllocaldb info`.

### Bước 4 — Tạo Database bằng Migration

Mở **Package Manager Console** (Tools → NuGet Package Manager → Package Manager Console), đảm bảo **Default project** đang chọn đúng project chính, sau đó chạy:

```powershell
# Cập nhật database theo migrations hiện có
Update-Database
```

Nếu thấy thông báo `Running Seed method` hoặc `Done` là thành công ✅

> **Nếu gặp lỗi migration**, thử xóa database cũ rồi tạo lại:
> ```powershell
> Drop-Database
> Update-Database
> ```

### Bước 5 — Chạy ứng dụng

Nhấn **F5** hoặc **Ctrl + F5** để chạy project.

Ứng dụng sẽ mở trên trình duyệt tại địa chỉ dạng: `https://localhost:xxxx`

---

## 👤 Tài khoản mặc định (nếu có Seed data)

| Role | Email | Mật khẩu |
|---|---|---|
| Admin | admin@travelbooking.com | `Admin@123` |
| User | user@travelbooking.com | `User@123` |

> Kiểm tra file `Migrations/Configuration.cs` hoặc `DbInitializer.cs` để xem tài khoản seed chính xác.

---

## 🛠️ Công nghệ sử dụng

- **ASP.NET MVC 5** — Framework chính
- **Entity Framework 6** (Code First) — ORM, quản lý database
- **ASP.NET Identity** — Xác thực và phân quyền người dùng
- **LINQ** — Truy vấn dữ liệu
- **SQL Server LocalDB** — Database phát triển cục bộ
- **Bootstrap** — Giao diện người dùng

---

## 📁 Cấu trúc project

```
TravelBooking/
├── Controllers/        # Xử lý request, điều hướng
├── Models/             # Entity, ViewModel, DbContext
│   └── Migrations/     # EF Migration files
├── Views/              # Giao diện Razor (.cshtml)
├── App_Data/           # Chứa file .mdf (database LocalDB)
├── App_Start/          # Cấu hình Route, Identity, Bundle
├── Content/            # CSS, hình ảnh tĩnh
├── Scripts/            # JavaScript, jQuery
└── Web.config          # Cấu hình ứng dụng
```

---

## ❓ Xử lý lỗi thường gặp

**Lỗi: `Cannot attach the file ... .mdf`**
- Xóa file `.mdf` và `.ldf` trong thư mục `App_Data/` rồi chạy lại `Update-Database`.

**Lỗi: `The model backing the context has changed`**
- Chạy `Update-Database` trong Package Manager Console.

**Lỗi: NuGet packages missing**
- Chuột phải vào Solution → **Restore NuGet Packages**.

**Lỗi: Port bị chiếm**
- Vào **Project Properties → Web** và đổi sang port khác.

---


---

> 📌 Nếu gặp vấn đề trong quá trình setup, liên hệ nhóm trưởng hoặc tạo **Issue** trên GitHub.
