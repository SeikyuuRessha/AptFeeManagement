# Hướng dẫn sử dụng

## Chạy project

- Tải xuống thư viện cần thiết: `npm i`
- Đồng bộ schema với db: `npx prisma migrate dev`
- Generate prisma client: `npx prisma generate`
- Khởi chạy server trong chế độ watch mode: `npm run start:dev`
- Kiểm thử chương trình: `npm run test`

## Prisma

```
datasource db {
    provider = "sqlserver"
    url      = env("DATABASE_URL")
}
```

- Provider: Loại DB như `postgresql` hay `mysql`
- `env("DATABASE_URL")` tên biến trong file môi trường, tùy loại DB sẽ có cái liên kết khác nhau, [https://www.prisma.io/docs/orm/reference/connection-urls]("https://www.prisma.io/docs/orm/reference/connection-urls")

- Mỗi model như một table trong db, [https://www.prisma.io/docs/orm/prisma-schema/data-model/models]("https://www.prisma.io/docs/orm/prisma-schema/data-model/models")

- Nếu lần đầu tải thì có thể sử dụng lại migrate lúc trc: `npx prisma migrate dev`
- Làm xong cần migrate để đồng bộ với db: `npx prisma migrate dev --name {NAME}`

## NestJS

- `npm i -g @nestjs/cli` để tải công cụ quản lý bằng dòng lệnh, thay vì tạo tay từng controller, service, module chỉ cần dùng `nest g res {NAME} --no-spec`, `--no-spec` ở đây là test file nếu cần thì xóa nó đi

- Cơ bản gồm `module`, `provider`, `controller`, **module** là đại diện cho từng chức năng của ứng dụng khai báo `provider` và `controller` và các thư viện khác, **controller** là nơi khai báo các tuyến đg và xử lý các yêu cầu nhẹ như lấy `path` hay `params`, **service** là nơi xử lý logic nghiệp vụ
- Có `decorators`, `guards` chính như **AccessTokenGuard, RefreshTokenGuard, RolesGuard và Roles** để chỉ định một role cụ thể như là `resident` hay là `admin`

## Kiểm thử

- Sử dụng kiểm thử cho mỗi modules, bao gồm kiểm thử đơn vị (Unit Test), kiểm thử tích hợp (Integration test) và kiểm thử e2e.
- Lưu ý khi kiểm thử: Thay đổi toàn bộ đường dẫn trong các file services và controllers thành đường dẫn tương đối, vì /test không được cấu hình, do đó nó không thể hiểu được /src nằm ở đâu.
