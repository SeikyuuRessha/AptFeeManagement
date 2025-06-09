# ElectronReactApp - Hệ Thống Quản Lý Chung Cư

Hệ thống quản lý phí chung cư/căn hộ được xây dựng với các công nghệ web hiện đại, cung cấp giao diện web và ứng dụng desktop cho giải pháp quản lý bất động sản hoàn chỉnh.

## 🏢 Tổng Quan

"Quản lý thu phí chung cư" là một ứng dụng full-stack được thiết kế để tối ưu hóa các hoạt động quản lý chung cư và căn hộ. Ứng dụng cung cấp các công cụ quản lý cư dân, tòa nhà, căn hộ, giao dịch tài chính, đăng ký dịch vụ và các tác vụ quản trị thông qua giao diện trực quan.

### Tính Năng Chính

-   **🏠 Quản Lý Bất Động Sản**: Quản lý căn hộ và tòa nhà hoàn chỉnh.
-   **👥 Quản Lý Cư Dân**: Hồ sơ cư dân với xác thực và phân quyền theo vai trò.
-   **💰 Quản Lý Tài Chính**: Tạo hóa đơn, theo dõi thanh toán và báo cáo tài chính.
-   **📋 Đăng Ký Dịch Vụ**: Quản lý các dịch vụ và đăng ký của tòa nhà.
-   **🔔 Hệ Thống Thông Báo**: Thông báo tự động cho các sự kiện và cập nhật quan trọng.
-   **📊 Phân Tích & Báo Cáo**: Báo cáo chi tiết và phân tích thông tin quản lý.
-   **🌐 Đa Nền Tảng**: Giao diện web và ứng dụng desktop để truy cập linh hoạt.

## 🚀 Công Nghệ Sử Dụng

### Backend

-   **Framework**: NestJS
-   **Cơ Sở Dữ Liệu**: SQL Server với Prisma ORM
-   **Xác Thực**: JWT với kiểm soát truy cập theo vai trò
-   **API**: RESTful APIs với xác thực toàn diện
-   **Testing**: Jest với coverage test rộng rãi

### Frontend

-   **Framework**: Next.js với TypeScript
-   **Thư Viện UI**: Material-UI (MUI)
-   **Quản Lý State**: TanStack Query (React Query)
-   **Styling**: Material-UI theming với các component tùy chỉnh
-   **Data Fetching**: Axios với optimistic updates

### Ứng Dụng Desktop

-   **Framework**: ElectronJS
-   **Tích Hợp**: Wrapper web-to-desktop liền mạch
-   **Đa Nền Tảng**: Hỗ trợ Windows, macOS và Linux

### Công Cụ Phát Triển

-   **Ngôn Ngữ**: TypeScript
-   **Package Manager**: npm
-   **Database Migration**: Prisma
-   **Testing**: Jest.
-   **Chất Lượng Code**: ESLint, Prettier

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

-   Node.js
-   npm hoặc yarn
-   SQL Server

### Clone Repository

```bash
git clone https://github.com/SeikyuuRessha/AptFeeManagement
```

### Cài Đặt Dependencies

```bash
# Cài đặt dependencies gốc
npm install

# Cài đặt dependencies backend
cd backend
npm install

# Cài đặt dependencies frontend
cd ../frontend
npm install

# Quay về thư mục gốc
cd ..
```

### Cấu Hình Môi Trường

1. **Backend Environment** - Tạo file `backend/.env`:

```env
DATABASE_URL="sqlserver://localhost:1444;database=apartment_management;user=sa;password=your_password;encrypt=true;trustServerCertificate=true"
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="24h"
PORT=8080
```

2. **Frontend Environment** - Tạo file `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Hệ Thống Quản Lý Chung Cư"
```

### Thiết Lập Cơ Sở Dữ Liệu

```bash
# Di chuyển đến thư mục backend
cd backend

# Tạo Prisma client
npx prisma generate

# Chạy database migrations
npx prisma db push

# Seed database (tùy chọn)
npx prisma db seed
```

## 🔧 Phát Triển

### Chạy Ứng Dụng

#### Backend Server

```bash
cd backend
npm run start:dev
```

Backend API sẽ có sẵn tại `http://localhost:8080`

#### Frontend Application

```bash
cd frontend
npm run dev
```

Frontend sẽ có sẵn tại `http://localhost:3000`

#### Desktop Application

```bash
# Từ thư mục gốc
npm run electron:dev
```

### Build cho Production

#### Backend

```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend

```bash
cd frontend
npm run build
npm start
```

#### Desktop Application

```bash
# Build cho nền tảng hiện tại
npm run electron:build

# Build cho nền tảng cụ thể
npm run electron:build:win
npm run electron:build:mac
npm run electron:build:linux
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Chạy tất cả tests
npm test

# Chạy tests ở chế độ watch
npm run test:watch

# Chạy test coverage
npm run test:cov

# Chạy test suites cụ thể
npm run test apartment.controller.spec.ts
npm run test auth.service.spec.ts
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🔐 Xác Thực & Phân Quyền

Hệ thống triển khai xác thực dựa trên JWT với kiểm soát truy cập theo vai trò:

### Vai Trò Người Dùng

-   **Admin**: Toàn quyền truy cập và quản lý hệ thống
-   **Resident**: Truy cập hạn chế vào thông tin cá nhân và thanh toán

### Routes Được Bảo Vệ

Tất cả API endpoints đều được bảo vệ với các guards phù hợp:

-   JWT authentication để xác minh người dùng
-   Role-based guards để kiểm soát quyền hạn
-   Xác thực quyền sở hữu tài nguyên

## 💾 Schema Cơ Sở Dữ Liệu

Ứng dụng sử dụng Prisma ORM với các entities chính sau:

### Các Model Cốt Lõi

-   **User**: Người dùng hệ thống với xác thực
-   **Building**: Các tòa nhà bất động sản
-   **Apartment**: Các căn hộ riêng lẻ
-   **Resident**: Cư dân căn hộ
-   **Invoice**: Hóa đơn tài chính
-   **Payment**: Bản ghi thanh toán
-   **Subscription**: Đăng ký dịch vụ
-   **Notification**: Thông báo hệ thống

### Mối Quan Hệ

-   Tòa nhà có nhiều Căn hộ
-   Căn hộ có nhiều Cư dân
-   Cư dân có nhiều Hóa đơn và Thanh toán
-   Người dùng có thể có nhiều vai trò và quyền hạn

## 🌐 Tài Liệu API

### Authentication Endpoints

```
POST /auth/login          # Đăng nhập người dùng
POST /auth/register       # Đăng ký người dùng
POST /auth/refresh        # Làm mới token
GET  /auth/profile        # Lấy thông tin người dùng
```

### Quản Lý Căn Hộ

```
GET    /apartments        # Liệt kê tất cả căn hộ
GET    /apartments/:id    # Lấy căn hộ theo ID
POST   /apartments        # Tạo căn hộ mới
PUT    /apartments/:id    # Cập nhật căn hộ
DELETE /apartments/:id    # Xóa căn hộ
```

### Quản Lý Tòa Nhà

```
GET    /buildings         # Liệt kê tất cả tòa nhà
GET    /buildings/:id     # Lấy tòa nhà theo ID
POST   /buildings         # Tạo tòa nhà mới
PUT    /buildings/:id     # Cập nhật tòa nhà
DELETE /buildings/:id     # Xóa tòa nhà
```

### Hoạt Động Tài Chính

```
GET    /invoices          # Liệt kê hóa đơn
POST   /invoices          # Tạo hóa đơn
GET    /payments          # Liệt kê thanh toán
POST   /payments          # Ghi nhận thanh toán
GET    /reports/financial # Báo cáo tài chính
```

## 🎨 Tính Năng Frontend

### Bảng Điều Khiển Admin

-   Phân tích và metrics toàn diện
-   Giao diện quản lý bất động sản
-   Báo cáo tài chính và biểu đồ
-   Công cụ quản lý người dùng

### Portal Cư Dân

-   Quản lý thông tin cá nhân
-   Xem hóa đơn và lịch sử thanh toán
-   Quản lý đăng ký dịch vụ
-   Trung tâm thông báo

### Thiết Kế Responsive

-   Phương pháp mobile-first
-   Material-UI components
-   Hỗ trợ theme sáng/tối
-   Tuân thủ accessibility

## 🔧 Cấu Hình

### Cấu Hình Backend

Các file cấu hình chính:

-   `backend/src/main.ts`: Application bootstrap
-   `backend/prisma/schema.prisma`: Database schema
-   Biến môi trường cho database và JWT settings

### Cấu Hình Frontend

-   `frontend/next.config.js`: Cấu hình Next.js
-   Tùy chỉnh theme Material-UI
-   Cấu hình API client

### Cấu Hình Electron

-   `main.js`: Electron main process
-   Quản lý window và tích hợp hệ thống
-   Hỗ trợ auto-updater

### Biến Môi Trường

Đảm bảo tất cả biến môi trường cần thiết được thiết lập:

-   Database connection strings
-   JWT secrets
-   API endpoints
-   Third-party service keys

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/tinh-nang-moi`
3. Thực hiện thay đổi và thêm tests
4. Commit thay đổi: `git commit -m 'Thêm tính năng mới'`
5. Push lên branch: `git push origin feature/tinh-nang-moi`
6. Gửi pull request

---

**Được xây dựng với ❤️ cho quản lý bất động sản hiện đại**
