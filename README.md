# 博客后台管理系统

一个基于 React + TypeScript 开发的现代化博客后台管理系统，提供博客内容管理、项目展示、分类标签管理等功能。

## 功能特性

### 用户认证
- 登录/登出功能
- 基于 Token 的身份验证
- 路由权限控制
- 个人信息查看
- 密码修改

### 博客管理
- 博客文章列表展示
- 创建和编辑博客文章
- Markdown 编辑器支持
- 文章分类和标签管理
- 文章访问统计

### 项目管理
- 项目列表展示
- 项目创建和编辑
- 项目状态管理
- 技术栈标签
- 项目特性管理
- GitHub 仓库链接
- 在线演示链接

### 分类管理
- 分类列表
- 分类创建/编辑/删除
- 文章数量统计

### 标签管理
- 标签列表
- 标签创建/编辑/删除
- 文章数量统计

## 技术栈

- React 19
- TypeScript
- React Router 7
- Ant Design 5
- Emotion (CSS-in-JS)
- Axios
- React Markdown Editor Lite
- Day.js
- Vite

## 开始使用

### 环境要求

- Node.js 16+
- npm 或 yarn 或 pnpm

### 安装

```bash
# 克隆项目
git clone [repository-url]

# 进入项目目录
cd blog-fe-admin-p

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

### 构建

```bash
# 构建生产版本
npm run build
```

### 代码检查

```bash
# 运行 ESLint
npm run lint
```

## 项目结构

```
src/
├── components/        # 公共组件
├── constants/         # 常量定义
├── layouts/          # 布局组件
├── pages/            # 页面组件
├── services/         # API 服务
├── utils/            # 工具函数
├── App.tsx           # 应用入口
└── main.tsx          # 主入口文件
```

## 开发规范

- 使用 TypeScript 编写类型安全的代码
- 遵循 ESLint 规则进行代码格式化
- 组件使用函数式组件和 Hooks
- 使用 Emotion 进行样式管理
- 遵循 RESTful API 设计规范

## 浏览器支持

- 现代浏览器
- Chrome >= 64
- Firefox >= 67
- Safari >= 12
- Edge >= 79

## 许可证

[MIT License](LICENSE)
