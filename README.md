# 人工智能篮球队官网

这是人工智能篮球队官网项目，包含前台展示和简易后台管理。当前内容已经整理为上线首版快照，适合继续做部署前收尾。

## 快速启动

最简单方式：

```text
双击 启动官网.bat
```

或在项目根目录运行：

```powershell
.\start.ps1
```

访问地址：

- 官网：http://localhost:3000
- 后台：http://localhost:3000/admin

默认后台密码：

```text
team-admin-2026
```

停止官网：

```text
双击 停止官网.bat
```

## 技术栈

- 前端：原生 HTML、CSS、JavaScript
- 后端：Node.js
- 数据：JSON 文件
- 图片处理：sharp
- 测试：Node.js 内置 test runner
- 构建：当前无独立打包构建步骤

## 项目文档

- [项目上下文](docs/PROJECT_CONTEXT.md)
- [运行与部署说明](docs/DEPLOYMENT.md)
- [内容维护说明](docs/CONTENT_MANAGEMENT.md)

## 关键目录

```text
public/                  # 前台、后台和网站公开素材
server/                  # Node 服务端和数据逻辑
data/site-data.json      # 本地运行时真实内容
data/site-data.seed.json # 上线首版初始内容快照
tests/                   # 自动检查
球员照片                  # 原始球员照片素材库
影像素材                  # 原始影像素材库
```

## 后台内容保存

后台修改后点击“保存全部”，内容会写入：

```text
data/site-data.json
```

上线首版内容快照为：

```text
data/site-data.seed.json
```

如果服务器第一次启动时没有 `site-data.json`，会用 `site-data.seed.json` 生成初始内容。之后线上后台修改会继续写入线上自己的 `site-data.json`。

## 素材说明

网站实际使用的素材在：

```text
public/assets
```

当前图片已优化为 WebP。后台上传新图片时也会自动压缩成 WebP；视频暂时不自动压缩。

当前部署素材大致体积：

- 图片：约 22.66MB
- 视频：约 845.35MB

## 检查

运行全部测试：

```powershell
npm test
```

如果本机没有全局 npm，可以使用 Codex 自带 Node：

```powershell
& 'C:\Users\13326\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

## 当前需注意

- 视频素材仍然较大，后续可做按需加载、压缩或对象存储。
- 导航和影像中心板块结构仍写在 `public/app.js`，不是后台字段。
- 当前后台是单管理员密码，没有多账号权限系统。
- 报名记录只能后台查看，不会自动发送通知。
