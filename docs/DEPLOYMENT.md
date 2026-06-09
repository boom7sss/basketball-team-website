# 运行与部署说明

## 本地运行

最简单方式：

```text
双击 启动官网.bat
```

或在项目根目录运行：

```powershell
.\start.ps1
```

打开地址：

- 官网：http://localhost:3000
- 后台：http://localhost:3000/admin

默认后台密码：

```text
team-admin-2026
```

停止本地官网：

```text
双击 停止官网.bat
```

## Node 命令运行

项目使用 Node.js 直接启动服务器：

```powershell
npm install
npm start
```

如果当前机器没有全局 npm，也可以继续使用项目里的启动脚本。

## 构建说明

当前项目没有独立的前端打包步骤，没有 Vite、Webpack 或 Next.js。`npm run build` 是上线前数据和脚本检查，不会生成新的打包目录。部署时需要的核心内容就是：

```text
public/
server/
data/site-data.seed.json
package.json
package-lock.json
```

运行时会生成或读取：

```text
data/site-data.json
```

## 测试

运行上线前构建检查：

```powershell
npm run build
```

运行全部检查：

```powershell
npm test
```

如果本机没有全局 npm，可以使用当前 Codex 环境中的 Node 运行：

```powershell
& 'C:\Users\13326\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\*.test.mjs
```

当前已通过的测试覆盖：

- 数据初始化和保存
- 上线初始数据快照
- 前台页面结构
- 后台登录和保存
- 文件上传和图片优化
- 报名提交和后台管理
- 页面视觉关键契约

## 部署前准备

1. 确认 `data/site-data.seed.json` 是当前想上线的首版内容。
2. 确认 `public/assets` 内素材已经是部署版素材。
3. 不建议部署 `球员照片` 和 `影像素材` 原始素材库。
4. 设置正式后台密码和会话密钥。
5. 确认 `package-lock.json` 已随代码提交，用于锁定 npm 依赖版本。

上线必须配置的环境变量：

```text
ADMIN_PASSWORD=换成正式后台密码
SESSION_SECRET=换成一串较长随机字符串
```

可选环境变量：

```text
PORT=3000
DATA_FILE=./data/site-data.json
```

不要把真实 `ADMIN_PASSWORD` 或真实 `SESSION_SECRET` 写进 Git 仓库、代码、README、部署文档或公开聊天记录。它们应该只存在于服务器环境变量、服务器面板或进程管理工具配置里。

## 普通云服务器部署思路

以常见 Linux 云服务器为例：

1. 安装 Node.js。
2. 上传项目文件到服务器，例如 `/var/www/ai-basketball`。
3. 进入项目目录，执行：

```bash
npm install
npm run build
npm test
npm start
```

4. 使用进程管理工具保持服务常驻，例如 pm2、systemd 或宝塔面板的 Node 项目管理。
5. 使用 Nginx 反向代理到 Node 服务端口。

Nginx 方向示例：

```nginx
server {
  server_name your-domain.example;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## 数据上线策略

当前 `.gitignore` 忽略：

```text
data/site-data.json
```

这是合理的，因为它是运行时真实数据。上线首版内容由：

```text
data/site-data.seed.json
```

提供。首次启动服务器时，如果没有 `site-data.json`，会从 seed 文件生成。之后后台保存会持续写入 `site-data.json`。

如果线上已经运营过，不要随便删除线上 `data/site-data.json`，否则会回到 seed 快照。

## 素材部署注意

当前 `public/assets` 中视频约 845MB，是部署包的大头。图片已经压缩成 WebP，约 22.66MB。

建议：

- 图片继续通过后台上传，上传后会自动转 WebP。
- 视频可以先保持 mp4。
- 视频文件没有被 Git 跟踪，需要单独上传到服务器对应路径。
- 比赛视频上传到 `public/assets/gallery/highlights/videos`。
- 日常训练视频上传到 `public/assets/gallery/training`。
- 球队生活视频上传到 `public/assets/gallery/life`。
- 如果服务器空间或访问速度压力较大，再考虑视频压缩或使用对象存储/CDN。
- 不要把原始素材库一起部署，除非服务器也承担素材归档任务。

如果服务器上缺少视频文件，页面仍会打开，但对应视频无法播放。

## 常见问题

### 刷新后页面仍然旧

本地服务器对静态文件设置了 `no-cache`，通常刷新即可。如果仍然没变化，检查服务是否已经重启。

### 后台登录不了

确认：

- 官网服务已启动。
- 使用正确密码。
- 如果设置了 `ADMIN_PASSWORD`，默认密码会失效。

### 部署后内容不是本地最终版

确认服务器上是否存在旧的 `data/site-data.json`。如果存在，服务器会优先读取它，而不是 `site-data.seed.json`。

### 上传图片失败

确认服务器已安装依赖：

```bash
npm install
```

图片优化依赖 `sharp`。
