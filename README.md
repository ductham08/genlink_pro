# GenLink Pro

GenLink Pro là một ứng dụng web cho phép người dùng tạo các trang landing để chuyển hướng đến các liên kết bất kỳ. Dưới đây là các thông tin cơ bản về dự án:

## Cài Đặt

1. **Frontend:**
   ```bash
   cd app
   npm install
   npm run dev
   ```

2. **Backend:**
   ```bash
   cd server
   npm install
   npm start
   ```

## Tính Năng Chính

- **Đăng nhập và Đăng ký:** Người dùng có thể đăng nhập và đăng ký tài khoản thông qua các form `LoginForm` và `RegisterForm`.
- **Tạo Trang Landing:** Người dùng có thể tạo các trang landing với tiêu đề, mô tả, URL chuyển hướng, và ảnh meta thông qua `CreateLink`.
- **Bảo vệ Route:** Các route như `/create-link` được bảo vệ bởi `ProtectedRoute`, yêu cầu người dùng phải đăng nhập và có token hợp lệ.
- **Xác thực JWT:** Sử dụng JWT để xác thực người dùng và kiểm tra quyền truy cập.
- **Lưu trữ Dữ liệu:** Sử dụng MongoDB để lưu trữ thông tin người dùng và các liên kết đã tạo.

## Cấu Hình Môi Trường

- **Frontend:**
  - `VITE_API_URL`: URL của API backend (ví dụ: `http://localhost:3000`).
  - `VITE_JWT_SECRET`: Secret key để xác thực JWT.

- **Backend:**
  - `PORT`: Cổng mà server sẽ lắng nghe (mặc định là 3000).
  - `DOMAIN`: Domain của ứng dụng (ví dụ: `http://localhost:3000`).
  - `JWT_SECRET`: Secret key để tạo và xác thực JWT.
  - `DATABASE_URL`: URL kết nối đến MongoDB.
  - `DATABASE_USER`: Tên người dùng MongoDB.
  - `DATABASE_PASSWORD`: Mật khẩu MongoDB.

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng fork repository này, thực hiện các thay đổi của bạn, và gửi pull request.

## Liên Hệ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc Telegram.

- Telegram: [@otis_cua](https://t.me/otis_cua)
