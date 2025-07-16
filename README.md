<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="NestJS Logo" />
  </a>
</p>

<h2 align="center">Dynamic Backend Framework using NestJS</h2>

<p align="center">
  🚀 An open-source, scalable backend platform built on <a href="https://nestjs.com">NestJS</a>, designed for dynamic schema management, auto API generation, and project-level backend customization.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="Build Status" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master" alt="Coverage" /></a>
  <a href="https://discord.gg/nestjs" target="_blank"><img src="https://img.shields.io/discord/520858243488309259?label=discord&logo=discord&color=7289DA" alt="Discord" /></a>
</p>

---

## 📘 Giới thiệu

Đây là một dự án mã nguồn mở cho phép tạo **hệ thống backend động** sử dụng NestJS. Hệ thống này hỗ trợ:

- ✅ Tạo schema động qua JSON Schema
- ✅ Tự động sinh Mongoose schema
- ✅ Tự động sinh API từ cấu trúc entity
- ✅ Xác thực dữ liệu đầu vào, kiểm tra trường unique
- ✅ Hỗ trợ `uiSchema` để kết nối với giao diện
- ✅ Có thể tích hợp xác thực (JWT, Role)
- 🔜 Hỗ trợ sinh mã backend riêng biệt cho từng project
- 🔜 Giao diện kéo-thả để quản lý schema (low-code CMS)

---

## 📦 Cài đặt

```bash
npm install
```

## 🚀 Khởi chạy

# Chạy development mode

npm run start:dev

# Chạy production mode

npm run start:prod

## 📤 Ví dụ tạo API động

{
"name": "Create Ecommerce User",
"url": "/api/ecommerce/users",
"method": "POST",
"entity": "entityId_from_metadata",
"requireAuth": true,
"headers": {
"Content-Type": "application/json"
},
"body": {
"username": "string",
"password": "string",
"email": "string"
}
}

## 🧱 Ví dụ JSON Schema

{
"title": "Ecommerce.Users",
"type": "object",
"properties": {
"username": { "type": "string", "unique": true },
"password": { "type": "string" },
"email": { "type": "string", "format": "email", "unique": true },
"role": { "type": "string" }
},
"required": ["username", "password", "email"]
}

## 📑 UI Schema tương ứng

{
"username": {
"ui:widget": "text",
"ui:placeholder": "Enter username"
},
"password": {
"ui:widget": "password",
"ui:placeholder": "Enter password"
},
"email": {
"ui:widget": "email",
"ui:placeholder": "Enter email address"
},
"role": {
"ui:widget": "select",
"ui:placeholder": "Select role",
"ui:options": {
"fetchResource": "Role"
}
}
}

## 🔍 Roadmap

| Tính năng                                    | Trạng thái  |
| -------------------------------------------- | ----------- |
| Dynamic JSON Schema to Mongoose              | ✅ Hoàn tất |
| UI Schema + Form Rendering                   | 🔜 Sắp tới  |
| Kiểm tra trường unique                       | 🔜 Sắp tới  |
| Auto CRUD từ Metadata                        | 🔜 Sắp tới  |
| Xác thực (JWT, Role, Permission)             | 🔜 Sắp tới  |
| Sinh mã NestJS module riêng cho từng project | 🔜 Sắp tới  |
| Giao diện kéo-thả UI builder                 | 🔜 Sắp tới  |
