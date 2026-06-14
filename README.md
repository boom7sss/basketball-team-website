# 人工智能篮球队官网

这是人工智能篮球队官网项目，包含前台展示、后台内容管理、报名管理和媒体上传能力。

当前状态：

- 网站已部署到香港 VPS，可通过公网 IP 访问。
- GitHub 仓库已作为代码同步来源。
- 线上服务由 pm2 托管，Nginx 对外提供访问。
- Nginx 静态缓存、API 不缓存、视频 Range 分段加载已验证。
- 重点大视频已压缩并切换为网页播放版，原视频保留。
- favicon、占位文案、备份自动化已完成收尾。
- 后台登录、保存、上传均已验证通过。

## 交接阅读顺序

后续负责人建议按下面顺序阅读：

1. `docs/DOCUMENTS_GUIDE.md`：文档导航，先看它来判断哪些文档必读、哪些按需读。
2. `docs/HANDOVER.md`：最终交接总入口，非技术负责人优先看这里。
3. `docs/HANDOVER_INFO_TEMPLATE.md`：实际交接时填写服务器、仓库、域名、负责人等信息。
4. `docs/OPS_COMMANDS.md`：网站异常、重启、日志、备份等常用运维命令。
5. `docs/CONTENT_MANAGEMENT.md`：日常后台内容维护说明。
6. `docs/BACKUP_AUTOMATION.md`：自动备份和恢复方式。
7. `docs/DOMAIN_HTTPS_TODO.md`：后续绑定域名和配置 HTTPS。

专项记录可按需查阅：

- `docs/HK_VPS_DEPLOYMENT_CHECKLIST.md`：香港 VPS 正式上线过程记录。
- `docs/OPTIMIZATION_NOTES.md`：线上优化阶段记录。
- `docs/VIDEO_OPTIMIZATION_LOG.md`：视频压缩和切换记录。
- `docs/DEPLOYMENT.md`、`docs/VPS_DEPLOYMENT.md`：通用部署说明。
- `docs/PROJECT_CONTEXT.md`、`docs/CHANGELOG.md`：项目背景和历史变更。

## 线上关键信息

```text
网站访问地址：http://43.129.197.63
后台地址：http://43.129.197.63/admin
GitHub 仓库：https://github.com/boom7sss/basketball-team-website.git
部署目录：/var/www/basketball-team-website
pm2 服务名：basketball-team-website
Nginx 配置：/etc/nginx/sites-available/basketball-team-website
备份目录：~/basketball-backups
```

正式后台密码、服务器登录密码、`ADMIN_PASSWORD`、`SESSION_SECRET` 只通过可信渠道交接，不写入仓库和文档。

## 本地运行

本地调试可以双击：

```text
启动官网.bat
```

或在项目根目录运行：

```powershell
.\start.ps1
```

本地访问地址：

- 官网：http://localhost:3000
- 后台：http://localhost:3000/admin

停止本地服务：

```text
停止官网.bat
```

## 技术栈

- 前端：原生 HTML、CSS、JavaScript
- 后端：Node.js
- 数据：JSON 文件
- 图片处理：sharp
- 测试：Node.js 内置 test runner
- 进程管理：pm2
- Web 入口：Nginx

## 关键目录

```text
public/                  # 前台、后台和网站公开素材
server/                  # Node 服务端和数据逻辑
data/site-data.seed.json # 上线初始内容快照
scripts/backup-runtime.sh # 线上运行时数据自动备份脚本
scripts/build-check.mjs  # 数据和脚本检查
tests/                   # 自动检查
球员照片                  # 本地原始球员照片素材库，不直接部署
影像素材                  # 本地原始影像素材库，不直接部署
```

线上真实运行时数据在服务器：

```text
/var/www/basketball-team-website/data/site-data.json
/var/www/basketball-team-website/public/assets/uploads
```

重新部署或迁移服务器时，不要用本地 seed 覆盖线上 `data/site-data.json`。

## 不能提交到 GitHub

下面内容不能提交到 GitHub，也不要写进公开文档：

```text
.env
/etc/basketball-team-website.env
真实 ADMIN_PASSWORD
真实 SESSION_SECRET
服务器登录密码
SSH 私钥
腾讯云、域名、邮箱等账号密码
data/site-data.json 线上运行时数据
public/assets/uploads/ 后台上传目录
public/assets/**/*.mp4 大视频
public/assets/**/*.mov
public/assets/**/*.webm
node_modules/
*.log
本地运行产生的临时数据
```

## 检查命令

上线前或代码更新后可运行：

```powershell
npm run build
npm test
```

当前项目没有前端打包步骤，`npm run build` 是数据结构和脚本检查。

## 后续重点

- 域名和 HTTPS 尚未配置，不影响当前 IP 访问，后续按 `docs/DOMAIN_HTTPS_TODO.md` 处理。
- 自动备份已经启用，但仍在同一台 VPS 上，建议每月下载一份到本地、网盘或学院资料盘。
- 当前后台是单管理员密码模式，长期运营可再升级为多账号权限。
