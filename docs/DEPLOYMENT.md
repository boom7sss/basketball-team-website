# 运行与部署说明

日常交接优先阅读 `docs/HANDOVER.md`。本文是通用运行与部署说明，当前线上状态以 `docs/HANDOVER.md` 和 `docs/HK_VPS_DEPLOYMENT_CHECKLIST.md` 为准。

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

本地开发环境如果没有设置 `ADMIN_PASSWORD`，会使用本地兜底密码。正式线上密码以服务器环境变量为准，并通过可信渠道交接。

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

## 免备案部署方案评估

如果不想做 ICP 备案，同时希望国内用户可以直接访问，建议优先选择中国大陆以外的服务器或平台。注意：免备案不等于一定很快，只是不用走大陆服务器或大陆 CDN 的备案流程。

当前项目是 Node 服务网站，不是纯静态网站：

- `npm start` 会运行 `node server/server.mjs`。
- 后台登录、保存、报名、上传都依赖 Node API。
- 后台保存会写入 `data/site-data.json`。
- 后台上传会写入 `public/assets/uploads/`。

因此，部署平台必须支持长期运行 Node 服务，并且最好有持久磁盘。

### 方案对比

| 方案 | 是否需要备案 | 国内访问体验 | 当前 Node 后台 | 数据持久保存 | 图片/视频上传 | 维护难度 | 费用 | 主要风险 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 香港 VPS | 不需要大陆 ICP 备案 | 通常最好，延迟低于欧美和多数海外平台 | 支持 | 支持，本机磁盘保存 | 支持，视频可单独上传 | 中等，需要会基本服务器操作 | 中等 | 需要自己维护服务器、安全和备份 |
| 新加坡 VPS | 不需要大陆 ICP 备案 | 一般可用，通常慢于香港 | 支持 | 支持，本机磁盘保存 | 支持 | 中等 | 中等 | 国内不同运营商访问波动可能更明显 |
| Render / Railway | 不需要大陆 ICP 备案 | 可用但不稳定，国内访问可能受跨境线路影响 | 支持 | 需要付费持久磁盘或 Volume | 支持但需绑定持久存储路径 | 较低到中等 | 低到中等，持久存储通常付费 | 默认文件系统可能是临时的，配置错会丢数据 |
| Vercel / Cloudflare Pages 静态改造 | 不需要大陆 ICP 备案 | 静态访问体验可能不错 | 当前版本不支持，需要改造 | 当前版本不支持，需要外部数据库或对象存储 | 当前版本不支持，需要外部对象存储 | 改造后较低 | 低 | 需要重构后台和数据存储，不适合快速上线 |
| 学校已有服务器或学院二级域名 | 通常由学校统一备案或管理，需问学院信息化负责人 | 通常最好 | 取决于学校服务器是否允许 Node | 取决于学校是否给写入目录 | 取决于学校权限和空间 | 对接流程中等，后续可能最低 | 可能免费 | 审批、权限、端口、运维边界不确定 |

### 推荐结论

毕业前上线、毕业后交给学弟维护，最推荐：

```text
香港 VPS + Ubuntu Server + Node.js + pm2 + Nginx + HTTPS
```

原因：

- 不需要大陆 ICP 备案。
- 国内访问体验通常比新加坡、欧美平台更稳。
- 不需要重构当前 Node 后台。
- `data/site-data.json` 和 `public/assets/uploads/` 可以直接持久保存在服务器磁盘。
- 大视频可以继续不进 Git，单独上传到服务器目录。
- 后续学弟只需要会后台维护内容；技术负责人只需掌握少量服务器命令和备份。

备选顺序：

1. 如果学院愿意提供已备案服务器或二级域名，并允许运行 Node 服务，这是长期最正规、访问体验最好的方案。
2. 如果不想碰服务器，可以考虑 Railway 或 Render，但必须确认持久磁盘/Volume 已配置好。
3. 新加坡 VPS 可作为香港 VPS 买不到或线路不合适时的备选。
4. Vercel / Cloudflare Pages 只有在后续愿意把后台改成外部数据库和对象存储后才推荐。

### 免备案注意事项

- 使用中国大陆服务器或大陆 CDN，通常需要 ICP 备案。
- 香港、新加坡等境外服务器通常不需要大陆 ICP 备案，但访问质量取决于跨境线路。
- 如果使用学校二级域名，必须先问学院或学校信息化部门：是否允许部署这个站点、是否允许 Node 服务、是否需要走校内备案或审批。
- 不建议为了免备案使用来源不明的免费主机或代备案服务，后续维护和数据安全风险较高。

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

## 上线后优化记录

详细记录见：

```text
docs/OPTIMIZATION_NOTES.md
```

当前优化结论：

- 前台影像页残留占位文案已在本地清理。
- `data/site-data.seed.json` 和 `server/defaultData.mjs` 已同步正式影像说明，避免重新初始化后出现临时感文案。
- 本地已新增 `public/favicon.ico`，部署到 VPS 后可修复 `/favicon.ico` 404。
- 本地图片均为 WebP，最大图片约 589KB，本轮不批量重压图片。
- 本地最大视频为 `highlight-video-12.mp4`，约 213MB；建议后续先生成网页播放版，不直接删除原视频。
- 线上 `/assets/` 已可缓存，`/api/site` 返回 `Cache-Control: no-store`，视频 Range 请求返回 `206 Partial Content`。
- 当前仍使用 IP 访问，HTTPS 等域名或学院二级域名到位后再配置。

如果要直接修改线上 `data/site-data.json`，必须先备份；优先通过后台改文案并点击“保存全部”，不要用本地 seed 覆盖线上运行时数据。

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
