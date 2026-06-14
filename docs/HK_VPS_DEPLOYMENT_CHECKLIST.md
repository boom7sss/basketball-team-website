# 香港 VPS 正式上线执行清单

日常交接优先阅读 `docs/HANDOVER.md`。本文是香港 VPS 上线过程和验证记录，不是日常维护入口。

本清单用于把篮球队官网部署到：

```text
香港 VPS + Ubuntu Server + Node.js + pm2 + Nginx + HTTPS
```

执行原则：

- 不把真实 `ADMIN_PASSWORD` 写进代码、Git、README 或聊天记录。
- 不把真实 `SESSION_SECRET` 写进代码、Git、README 或聊天记录。
- 大视频不进 Git，单独上传到服务器。
- 先完成公网 IP 访问，再绑定域名和 HTTPS。
- 每一步执行前先确认目的，执行后做检查。

## 当前进度

更新时间：2026-06-13

已完成：

```text
[x] 已购买腾讯云轻量应用服务器，中国香港
[x] 已确认公网 IP：43.129.197.63
[x] 已确认系统：Ubuntu 24.04 LTS
[x] 已确认配置：2核 / 2GB / 40GB SSD / 20Mbps / 512GB月流量
[x] 已通过 SSH 使用 ubuntu 用户登录服务器
[x] 已完成 apt update 和 apt upgrade
[x] 已安装 git、curl、ufw
[x] 腾讯云防火墙已放行 22、80、443
[x] 已安装 Nginx
[x] 已安装 Node.js v24.16.0 和 npm 11.13.0
[x] 已安装 pm2 7.0.1
[x] 已生成服务器 SSH 公钥并添加到 GitHub Deploy key
[x] 已从 GitHub 拉取项目到 /var/www/basketball-team-website
[x] 已执行 npm install，依赖安装成功
[x] 已从 data/site-data.seed.json 生成服务器 data/site-data.json
[x] 已配置 /etc/basketball-team-website.env
[x] 已用 pm2 启动网站
[x] 已确认本机访问 http://127.0.0.1:3000/ 返回 200
[x] 已配置 Nginx 反向代理
[x] 已确认公网首页 http://43.129.197.63 可访问
[x] 已确认公网后台 http://43.129.197.63/admin 可访问
[x] 已设置 pm2 开机自启并保存进程
[x] 已确认后台登录成功
[x] 已确认后台保存后前台内容更新
[x] 已确认 data/site-data.json 在服务器上更新
[x] 已确认后台上传文件写入 public/assets/uploads
[x] 已上传大视频文件到服务器
[x] 已重新运行 npm test，34/34 全部通过
[x] 已优化 Nginx：/assets/ 由 Nginx 直接托管并开启缓存
[x] 已验证视频 Range 请求返回 206 Partial Content
[x] 已完成重启后持久化检查
[x] 已生成首次服务器备份：~/basketball-backups/basketball-site-2026-06-13.tar.gz
[x] 已清理影像页占位文案并部署 favicon.ico
[x] 已新增优化记录：docs/OPTIMIZATION_NOTES.md
[x] 已压缩并切换重点大视频：highlight-video-2、9、11、12、13、14
[x] 已新增视频优化记录：docs/VIDEO_OPTIMIZATION_LOG.md
[x] 已新增并启用自动备份脚本：scripts/backup-runtime.sh
[x] 已新增自动备份说明：docs/BACKUP_AUTOMATION.md
```

待继续：

```text
[ ] 后续绑定域名和 HTTPS
[x] 交接信息模板已创建：docs/HANDOVER_INFO_TEMPLATE.md
[x] 域名与 HTTPS 后续 TODO 已创建：docs/DOMAIN_HTTPS_TODO.md
[ ] 将交接信息通过可信渠道交给下一任负责人
[ ] 后续维护：域名到位后配置 HTTPS、定期下载异地备份、稳定观察后决定是否归档/清理原视频
```

当前结论：

```text
基础部署完成。当前网站可通过 http://43.129.197.63 线上访问。
HTTPS 需要购买域名或申请学院二级域名后再配置，不阻塞当前 IP 上线。
```

## 最终部署总结

### 当前线上访问状态

```text
网站访问地址：http://43.129.197.63
后台登录地址：http://43.129.197.63/admin
当前状态：可线上访问，后台可登录、可保存、可上传
```

### 当前部署架构

```text
VPS：腾讯云轻量应用服务器，中国香港
操作系统：Ubuntu 24.04 LTS
运行环境：Node.js v24.16.0 / npm 11.13.0
进程管理：pm2 7.0.1
Web 入口：Nginx 1.24.0
代码来源：GitHub 私有仓库，通过 Deploy key 拉取
项目目录：/var/www/basketball-team-website
```

### 已完成工作

```text
[x] 购买香港 VPS
[x] 初始化 Ubuntu 服务器
[x] 安装 git、curl、ufw、Nginx、Node.js、npm、pm2
[x] 腾讯云防火墙放行 22、80、443
[x] 配置 GitHub Deploy key
[x] 拉取 GitHub 项目
[x] 安装项目依赖
[x] 生成服务器运行时 data/site-data.json
[x] 配置服务器环境变量文件 /etc/basketball-team-website.env
[x] 用 pm2 启动 Node 服务并设置开机自启
[x] 配置 Nginx 反向代理
[x] 配置 /assets/ 由 Nginx 直接托管并开启缓存
[x] 验证视频 Range 请求返回 206 Partial Content
[x] 上传大视频文件
[x] 运行 npm test，34/34 全部通过
[x] 验证公网首页和后台可访问
[x] 验证后台保存数据可持久化
[x] 验证后台上传文件可持久化
[x] 完成首次备份
[x] 创建交接信息模板 docs/HANDOVER_INFO_TEMPLATE.md
```

### 未完成但不阻塞上线

```text
[ ] 绑定正式域名
[ ] 配置 HTTPS
[x] favicon.ico 已部署，消除浏览器控制台 favicon 404
[x] 较大的重点视频已压缩并切换网页播放版
[ ] 后续可将视频迁移到 COS / OSS / CDN
[ ] 将交接信息和密码通过可信渠道交给下一任负责人
```

### 服务器关键路径

```text
项目部署目录：/var/www/basketball-team-website
数据文件：/var/www/basketball-team-website/data/site-data.json
初始数据快照：/var/www/basketball-team-website/data/site-data.seed.json
后台上传目录：/var/www/basketball-team-website/public/assets/uploads
比赛视频目录：/var/www/basketball-team-website/public/assets/gallery/highlights/videos
训练视频目录：/var/www/basketball-team-website/public/assets/gallery/training
生活视频目录：/var/www/basketball-team-website/public/assets/gallery/life
服务器环境变量文件：/etc/basketball-team-website.env
Nginx 配置：/etc/nginx/sites-available/basketball-team-website
备份目录：~/basketball-backups
最近备份：~/basketball-backups/basketball-site-2026-06-13.tar.gz
自动备份：~/basketball-backups/basketball-auto-runtime-*.tar.gz
```

### pm2 常用命令

```bash
pm2 status
pm2 logs basketball-team-website --lines 50
set -a
. /etc/basketball-team-website.env
set +a
pm2 restart basketball-team-website --update-env
pm2 save
```

### Nginx 常用命令

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx
sudo nano /etc/nginx/sites-available/basketball-team-website
```

### 备份方式

```bash
mkdir -p ~/basketball-backups
tar -czf ~/basketball-backups/basketball-site-$(date +%F).tar.gz \
  /var/www/basketball-team-website/data/site-data.json \
  /var/www/basketball-team-website/public/assets/uploads \
  /var/www/basketball-team-website/public/assets/gallery/highlights/videos \
  /var/www/basketball-team-website/public/assets/gallery/training/*.mp4 \
  /var/www/basketball-team-website/public/assets/gallery/life/*.mp4
```

### 不能写进 GitHub 的内容

```text
真实 ADMIN_PASSWORD
真实 SESSION_SECRET
服务器登录密码
SSH 私钥
腾讯云账号密码
data/site-data.json 线上运行时数据
public/assets/uploads 后台上传文件
大视频文件
node_modules
日志文件
```

### 后续优化建议

```text
1. 购买域名或申请学院二级域名，然后配置 HTTPS。
2. 保留原视频一段时间，稳定后下载归档到本地或网盘，再决定是否从服务器清理。
3. 每月下载一次自动备份到异地位置。
4. 视访问量考虑将视频迁移到 COS / OSS / CDN。
5. 后续可为视频增加独立 poster 封面图。
6. 如需长期运营，再考虑后台多账号、页面结构文案后台可编辑等功能。
```

域名责任建议：

```text
优先申请学院或学校二级域名。
如果购买商业域名，建议由下一任长期负责人、球队公共账号或学院老师账号持有。
不建议把官网域名长期绑定在即将毕业同学的个人账号下。
详细步骤见 docs/DOMAIN_HTTPS_TODO.md。
```

### 收尾建议

```text
当前优化阶段可以到此收尾。
后续 Final Agent 建议只做文档归并和最终交接整理，不建议继续做功能开发。
```

## 阶段 0：提前准备

目的：避免部署中途缺账号、缺权限、缺文件。

需要提前准备：

```text
[x] 香港 VPS 一台
[x] 服务器公网 IP
[x] SSH 登录方式：密码或 SSH key
[x] GitHub 仓库访问权限
[x] 正式后台密码 ADMIN_PASSWORD
[x] 随机 SESSION_SECRET
[x] 本地大视频文件
[ ] 可选：正式域名
[ ] 可选：学院二级域名申请结果
```

当前 GitHub 仓库：

```text
https://github.com/boom7sss/basketball-team-website.git
```

## 阶段 1：确认 VPS 配置

目的：确保服务器够用，并且后续学弟能维护。

推荐配置：

```text
地区：香港
系统：Ubuntu Server 24.04 LTS
CPU：2 核推荐，1 核最低
内存：2GB 最低，4GB 更稳
硬盘：60GB 起步，视频多建议 100GB
带宽：3Mbps 起步，5Mbps 更舒服
```

最低可用配置：

```text
地区：香港
系统：Ubuntu Server 24.04 LTS
CPU：1 核
内存：2GB
硬盘：40GB SSD
带宽：3Mbps
```

检查项：

```text
[x] VPS 位于香港
[x] 系统是 Ubuntu Server
[x] 硬盘空间足够保存图片、上传文件和视频
[x] 云服务器安全组可以配置 22、80、443 端口
```

## 阶段 2：服务器初始化

目的：更新系统，安装基础工具，并准备安全访问规则。

计划命令：

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl ufw
```

云服务器安全组建议只开放：

```text
22   SSH 登录
80   HTTP 访问
443  HTTPS 访问
```

不建议开放：

```text
3000 Node 服务端口
```

原因：正式访问应由 Nginx 对外提供，Nginx 再转发到服务器本机的 Node 服务。

检查项：

```text
[x] 能通过 SSH 登录服务器
[x] 系统更新完成
[x] git 和 curl 安装完成
[x] 安全组开放 22、80、443
[x] 安全组没有对公网开放 3000
```

## 阶段 3：安装 Node.js、npm、pm2、Nginx

目的：让服务器具备运行当前 Node 项目的能力。

安装 Nginx：

```bash
sudo apt install -y nginx
```

安装 Node.js LTS：

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

安装 pm2：

```bash
sudo npm install -g pm2
```

检查版本：

```bash
node -v
npm -v
pm2 -v
nginx -v
```

检查项：

```text
[x] node 可用
[x] npm 可用
[x] pm2 可用
[x] nginx 可用
```

## 阶段 4：从 GitHub 拉取项目

目的：把 GitHub 私有仓库中的代码拉到服务器。

推荐方式：使用 GitHub Deploy key。

在服务器生成 SSH key：

```bash
ssh-keygen -t ed25519 -C "basketball-vps-deploy"
cat ~/.ssh/id_ed25519.pub
```

在 GitHub 仓库添加 Deploy key：

```text
Repository -> Settings -> Deploy keys -> Add deploy key
Title：basketball-vps
Key：粘贴服务器公钥
Allow write access：不要勾选
```

拉取项目：

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone git@github.com:boom7sss/basketball-team-website.git
cd basketball-team-website
```

安装依赖并检查：

```bash
npm install
npm run build
npm test
```

预期结果：

```text
npm run build 通过
npm test 通过，34/34 全部通过
```

检查项：

```text
[x] 项目已拉取到 /var/www/basketball-team-website
[x] npm install 成功
[x] npm run build 成功
[x] npm test 成功
```

当前说明：

```text
视频文件已经单独上传到服务器，npm test 已经 34/34 全部通过。
```

## 阶段 5：配置 ADMIN_PASSWORD 和 SESSION_SECRET

目的：让线上后台使用正式密码，并让登录令牌稳定。

需要配置的环境变量：

```text
ADMIN_PASSWORD=正式后台密码
SESSION_SECRET=较长随机字符串
PORT=3000
DATA_FILE=/var/www/basketball-team-website/data/site-data.json
```

生成 `SESSION_SECRET`：

```bash
openssl rand -hex 32
```

推荐把真实值保存在服务器受限环境配置中，不写进 Git 仓库。

如果使用服务器环境文件，建议路径：

```text
/etc/basketball-team-website.env
```

文件权限建议：

```bash
sudo chown $USER:$USER /etc/basketball-team-website.env
chmod 600 /etc/basketball-team-website.env
```

注意：

- 不要把真实 `ADMIN_PASSWORD` 发到公开群。
- 不要把真实 `SESSION_SECRET` 写进项目文档。
- 不要把环境变量文件提交到 GitHub。

检查项：

```text
[x] 正式 ADMIN_PASSWORD 已准备
[x] SESSION_SECRET 已生成
[x] 环境变量只存在于服务器配置中
[x] Git 仓库中没有真实密码和真实 SESSION_SECRET
```

## 阶段 6：上传大视频文件

目的：视频不进 Git，但网站上线后仍能播放。

服务器目标目录：

```text
/var/www/basketball-team-website/public/assets/gallery/highlights/videos
/var/www/basketball-team-website/public/assets/gallery/training
/var/www/basketball-team-website/public/assets/gallery/life
```

创建目录：

```bash
mkdir -p /var/www/basketball-team-website/public/assets/gallery/highlights/videos
mkdir -p /var/www/basketball-team-website/public/assets/gallery/training
mkdir -p /var/www/basketball-team-website/public/assets/gallery/life
```

上传方式：

```text
新手推荐：WinSCP 拖拽上传
命令方式：scp
```

PowerShell 示例：

```powershell
scp "D:\球队网站\public\assets\gallery\training\training-video-1.mp4" 用户名@服务器公网IP:/var/www/basketball-team-website/public/assets/gallery/training/
```

上传后检查：

```bash
ls -lh /var/www/basketball-team-website/public/assets/gallery/highlights/videos
ls -lh /var/www/basketball-team-website/public/assets/gallery/training
ls -lh /var/www/basketball-team-website/public/assets/gallery/life
```

后台或数据中的视频地址应保持网站路径：

```text
/assets/gallery/training/training-video-1.mp4
```

不要填写服务器绝对路径。

检查项：

```text
[x] 比赛视频已上传
[x] 训练视频已上传
[x] 球队生活视频已上传
[x] 文件名与后台数据中的路径一致
```

## 阶段 7：启动 Node 服务

目的：让官网和后台 API 在服务器上运行。

进入项目目录：

```bash
cd /var/www/basketball-team-website
```

加载环境变量：

```bash
set -a
. /etc/basketball-team-website.env
set +a
```

用 pm2 启动：

```bash
pm2 start server/server.mjs --name basketball-team-website --update-env
```

查看状态：

```bash
pm2 status
pm2 logs basketball-team-website
```

设置开机自启：

```bash
pm2 startup
pm2 save
```

注意：执行 `pm2 startup` 后，pm2 会输出一行 `sudo ...` 命令，需要复制执行。

检查项：

```text
[x] pm2 status 显示 basketball-team-website online
[x] pm2 logs 没有启动错误
[x] 服务器本机 Node 服务监听 3000
```

当前验证结果：

```text
curl http://127.0.0.1:3000/ 返回 200。
```

## 阶段 8：配置 Nginx 反向代理

目的：让用户通过 `http://服务器公网IP` 访问网站。

创建 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/basketball-team-website
```

配置内容：

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 300m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/basketball-team-website /etc/nginx/sites-enabled/basketball-team-website
sudo nginx -t
sudo systemctl reload nginx
```

检查项：

```text
[x] sudo nginx -t 通过
[x] Nginx reload 成功
[x] http://服务器公网IP 能打开首页
[x] http://服务器公网IP/admin 能打开后台
```

当前优化：

```text
/assets/ 已改为 Nginx 直接托管。
静态资源已配置 Cache-Control。
视频 Range 请求已验证返回 206 Partial Content。
页面、后台和 API 仍然转发给 Node。
```

## 阶段 9：配置 HTTPS

目的：让后台登录和用户访问走加密连接。

前提：

```text
[ ] 已有域名
[ ] 域名 A 记录指向服务器公网 IP
[ ] http://域名 可以访问网站
```

修改 Nginx `server_name`：

```nginx
server_name example.com www.example.com;
```

安装 Certbot：

```bash
sudo apt install -y certbot python3-certbot-nginx
```

申请 HTTPS 证书：

```bash
sudo certbot --nginx
```

测试自动续期：

```bash
sudo certbot renew --dry-run
```

检查项：

```text
[ ] https://域名 能打开首页
[ ] https://域名/admin 能打开后台
[ ] http 自动跳转 https
[ ] certbot renew --dry-run 通过
```

## 阶段 10：检查网站是否正常访问

目的：确认前台页面、静态资源、视频和 API 都可用。

浏览器检查：

```text
[x] 首页能打开
[x] 球队页能打开
[x] 新闻页能打开
[x] 队员阵容页能打开
[x] 影像中心能打开
[x] 视频能播放或至少能加载
[x] /admin 能打开
[x] 浏览器控制台没有明显 API 错误
```

当前说明：

```text
favicon.ico 已部署，浏览器请求 /favicon.ico 返回 200。
重点大视频已压缩并切换到网页播放版；视频仍受香港 VPS 20Mbps 带宽影响，后续访问量增大时再考虑 COS/OSS/CDN。
```

服务器检查：

```bash
pm2 status
pm2 logs basketball-team-website
sudo nginx -t
sudo systemctl status nginx
```

## 阶段 11：检查后台是否能保存数据

目的：确认线上后台是真的持久保存，而不是刷新后丢失。

后台保存测试：

```text
[x] 登录 /admin
[x] 修改一条不重要的测试内容
[x] 点击“保存全部”
[x] 刷新前台确认变化出现
[x] 重启 Node 服务
[x] 再次打开前台确认变化仍存在
```

服务器检查：

```bash
ls -lh /var/www/basketball-team-website/data/site-data.json
```

上传测试：

```text
[x] 后台上传一张小图片
[x] 点击“保存全部”
[x] 前台确认图片能访问
[x] public/assets/uploads/ 中出现新文件
```

服务器检查：

```bash
find /var/www/basketball-team-website/public/assets/uploads -type f | head
```

## 阶段 12：备份和交接

目的：毕业后学弟能继续维护，不会误删线上真实数据。

必须备份：

```text
/var/www/basketball-team-website/data/site-data.json
/var/www/basketball-team-website/public/assets/uploads/
```

建议备份命令：

```bash
mkdir -p ~/basketball-backups
tar -czf ~/basketball-backups/basketball-site-$(date +%F).tar.gz \
  /var/www/basketball-team-website/data/site-data.json \
  /var/www/basketball-team-website/public/assets/uploads
```

交接信息模板：

```text
服务器厂商：
服务器地区：香港
服务器公网 IP：
SSH 登录用户：
项目目录：/var/www/basketball-team-website
PM2 应用名：basketball-team-website
Nginx 配置文件：/etc/nginx/sites-available/basketball-team-website
域名：
后台地址：
GitHub 仓库：https://github.com/boom7sss/basketball-team-website.git
视频上传目录：
备份目录：
```

不要写入交接文档：

```text
真实 ADMIN_PASSWORD
真实 SESSION_SECRET
服务器登录密码
GitHub 私钥
```

检查项：

```text
[x] site-data.json 已备份
[x] public/assets/uploads 已备份
[x] 视频目录已备份
[x] 自动备份脚本已启用
[ ] 视频目录位置已交接
[ ] GitHub 仓库地址已交接
[ ] 后台地址已交接
[ ] 密码只通过可信渠道交接
```

当前备份：

```text
~/basketball-backups/basketball-site-2026-06-13.tar.gz
大小约 844MB。
```

## 最终总检查

```text
[x] GitHub 仓库已上传最新代码
[x] VPS 使用香港机房
[x] Node 服务由 pm2 托管
[x] Nginx 反向代理工作正常
[ ] HTTPS 工作正常
[x] 后台能登录
[x] 后台能保存内容
[x] 后台上传文件能持久保存
[x] 大视频已单独上传
[x] data/site-data.json 已纳入备份
[x] public/assets/uploads 已纳入备份
[x] 自动备份已启用
[x] 交接信息模板已整理
```
