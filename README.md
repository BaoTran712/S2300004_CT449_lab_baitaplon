# Ứng dụng Mượn Sách Trực Tuyến

## Mô tả dự án

Ứng dụng Mượn Sách Trực Tuyến là một nền tảng giúp người dùng dễ dàng tìm kiếm, mượn và quản lý sách trực tuyến một cách nhanh chóng và tiện lợi.

Ứng dụng hướng tới việc tạo ra một thư viện số giúp kết nối người đọc với nguồn sách phong phú mọi lúc mọi nơi, đồng thời hỗ trợ thủ tục mượn và trả sách hoàn toàn online.

## Tính năng chính

-   **Tìm kiếm sách:** Tìm kiếm sách theo tên, tác giả, năm xuất bản...

-   **Đăng ký và đăng nhập:** Người dùng có thể tạo tài khoản và đăng nhập để mượn sách.

-   **Mượn sách:** Tạo đơn mượn sách trực tuyến với thời gian mượn tùy chọn.

-   **Quản lý sách:** Xem danh mục sách, cập nhật, chỉnh sửa, xóa thông tin sách.

-   **Quản lý đơn mượn:** Theo dõi đơn mượn sách, cập nhật thông tin đơn mượn sách, xử lý yêu cầu đơn mượn của người dùng.

-   **Quản lý nhà xuất bản:** Xem danh sách nhà xuất bản, thực hiện thêm, sửa, xóa nhà xuất bản.

-   **Quản lý người dùng:** Xem danh sách người dùng, thực hiện thêm, sửa, xóa người dùng.

-   **Quản lý nhân viên:** Xem danh sách nhân viên, thực hiện thêm, sửa, xóa nhân viên.

## Công nghệ sử dụng

-   Frontend: VueJS, TailwindCSS, DaisyUI

-   Backend: Node.js với Express

-   Cơ sở dữ liệu: MongoDB

-   Xác thực: JSON Web Token (JWT)

## Cấu trúc thư mục

```
/frontend      # mã nguồn giao diện người dùng
/backend       # mã nguồn server và API
```

## Cài đặt và chạy ứng dụng

1. Clone repository về máy:

```
git clone https://github.com/nghiaxh/ebookshelf.git
```

2. Cài đặt phụ thuộc vào thư mục `backend` và `frontend`:

```
cd backend
npm install     # hoặc yarn install

cd frontend
npm install     # hoặc yarn install
```

3. Thiết lập biến môi trường:

-   Tạo file `.env` thư mục `ebookshelf/backend/` và cấu hình các biến như database, secret key,...

```env
JWT_SECRET= "secret key"
MONGODB_URL = "mongodb://localhost:27017/ebookshelf"
```

4. Chạy ứng dụng ở hai thư mục `backend` và `frontend`:

```
cd backend
npm run start   # hoặc yarn start

cd frontend
npm run dev     # hoặc yarn dev
```

5. Truy cập ứng dụng tại: `http://localhost:3001`
