# VPS 部署方案

日常交接优先阅读 `docs/HANDOVER.md`。本文是 VPS 部署教程，适合重装服务器或迁移服务器时参考。

这份文档面向第一次接触云服务器的负责人。目标是把篮球队官网部署到一台普通 VPS / 云服务器上，让网站公开访问、后台可以登录、内容和上传文件能长期保存。

当前项目不是纯静态网站，而是 Node 服务网站：

- 前台页面和后台页面在 `public/`。
- 后台登录、内容保存、报名、上传文件都依赖 `server/server.mjs`。
- 后台保存会写入 `data/site-data.json`。
- 后台上传会写入 `public/assets/uploads/`。
- 大视频不进 Git，需要单独上传到服务器。

因此，不建议直接部署到 Vercel、Netlify、Cloudflare Pages 这类静态/Serverless 平台。当前版本最适合普通 VPS。

## 一、服务器配置建议

最低可用配置：

```text
CPU：1 核
内存：2GB
硬盘：40GB SSD
系统：Ubuntu Server 24.04 LTS 或 26.04 LTS
带宽：1Mbps 以上可用，建议 3Mbps 或更高
```

更推荐的配置：

```text
CPU：2 核
内存：2GB 或 4GB
硬盘：60GB - 100GB SSD
系统：Ubuntu Server 24.04 LTS
带宽：3Mbps - 5Mbps 起步
```

如果视频访问较多，优先升级带宽和硬盘。当前视频文件不进 Git，但上线后仍会占服务器空间。

## 二、系统选择

推荐选择：

```text
Ubuntu Server 24.04 LTS
```

原因：

- LTS 是长期支持版本，适合正式网站。
- 教程多，遇到问题更容易搜索。
- 没有桌面界面，适合服务器，资源占用低。
- Nginx、Node.js、pm2、Certbot 都很常见。

如果云厂商默认只提供 Ubuntu Server 26.04 LTS，也可以使用。不要选择 Windows Server，除非后续负责人熟悉 Windows 服务器运维。

## 三、服务器需要安装什么

需要安装：

```text
git      # 从 GitHub 拉取项目
Node.js  # 运行 server/server.mjs
npm      # 安装依赖
pm2      # 让网站后台常驻运行
nginx    # 对外提供 80/443 访问，并反向代理到 Node
certbot  # 申请 HTTPS 证书
```

首次登录服务器后，先更新系统：

```bash
sudo apt update
sudo apt upgrade -y
```

安装基础工具：

```bash
sudo apt install -y git curl nginx
```

安装 Node.js LTS。建议使用 Node.js 24 LTS：

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

检查版本：

```bash
node -v
npm -v
```

安装 pm2：

```bash
sudo npm install -g pm2
```

## 四、从 GitHub 拉取项目

当前仓库是私有仓库：

```text
https://github.com/boom7sss/basketball-team-website.git
```

推荐方式：在服务器生成 SSH key，然后把公钥添加到 GitHub 仓库的 Deploy keys。

### 1. 在服务器生成 SSH key

```bash
ssh-keygen -t ed25519 -C "basketball-vps-deploy"
```

一路回车即可。然后查看公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出内容。

### 2. 在 GitHub 添加 Deploy key

进入 GitHub 仓库：

```text
Settings -> Deploy keys -> Add deploy key
```

填写：

```text
Title：basketball-vps
Key：粘贴服务器上的公钥
Allow write access：不要勾选
```

保存后，服务器就可以只读拉取这个私有仓库。

### 3. 拉取代码

建议把项目放在：

```text
/var/www/basketball-team-website
```

执行：

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

如果这两步通过，说明项目在服务器上可以正常运行。

## 五、配置后台密码和 SESSION_SECRET

不要把真实密码写进代码、文档或 GitHub。推荐用一个放在仓库外的服务器环境变量文件。

创建环境变量文件：

```bash
sudo nano /etc/basketball-team-website.env
```

写入下面内容，把占位文字换成真实值：

```text
ADMIN_PASSWORD=换成正式后台密码
SESSION_SECRET=换成一串至少32位的随机字符串
PORT=3000
DATA_FILE=/var/www/basketball-team-website/data/site-data.json
```

保存后，限制权限：

```bash
sudo chown $USER:$USER /etc/basketball-team-website.env
chmod 600 /etc/basketball-team-website.env
```

生成随机 `SESSION_SECRET` 的方式：

```bash
openssl rand -hex 32
```

注意：

- `ADMIN_PASSWORD` 是正式后台登录密码。
- `SESSION_SECRET` 用来签发后台登录令牌，要足够长。
- 不要使用本地默认密码。
- 不要把真实密码或 `SESSION_SECRET` 放进 Git 仓库。

## 六、启动网站并保持后台运行

项目默认启动命令是：

```bash
npm start
```

但正式服务器上建议用 pm2 启动。

进入项目目录：

```bash
cd /var/www/basketball-team-website
```

加载环境变量并启动：

```bash
set -a
. /etc/basketball-team-website.env
set +a
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
```

执行命令后，pm2 会输出一行需要复制执行的 `sudo ...` 命令。复制执行它。

然后保存当前进程列表：

```bash
pm2 save
```

以后重启网站：

```bash
pm2 restart basketball-team-website
```

停止网站：

```bash
pm2 stop basketball-team-website
```

## 七、用公网 IP 访问

Node 服务默认监听：

```text
http://服务器公网IP:3000
```

但正式访问不建议直接暴露 3000 端口。建议让 Nginx 监听 80 端口，再转发到本机 3000 端口。

创建 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/basketball-team-website
```

先用公网 IP 版本：

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

然后访问：

```text
http://服务器公网IP
http://服务器公网IP/admin
```

如果打不开，检查云服务器安全组是否放行了 80 端口。

## 八、上传视频文件

视频文件不在 Git 仓库里，需要单独上传到服务器对应目录。

服务器上的目标目录：

```text
/var/www/basketball-team-website/public/assets/gallery/highlights/videos
/var/www/basketball-team-website/public/assets/gallery/training
/var/www/basketball-team-website/public/assets/gallery/life
```

先在服务器创建目录：

```bash
mkdir -p /var/www/basketball-team-website/public/assets/gallery/highlights/videos
mkdir -p /var/www/basketball-team-website/public/assets/gallery/training
mkdir -p /var/www/basketball-team-website/public/assets/gallery/life
```

从 Windows 上传，可以用 WinSCP，连接服务器后把本地视频拖到对应目录。

也可以在本机 PowerShell 使用 `scp`，示例：

```powershell
scp "D:\球队网站\public\assets\gallery\training\training-video-1.mp4" root@服务器公网IP:/var/www/basketball-team-website/public/assets/gallery/training/
```

如果不是 root 用户，把 `root` 换成你的服务器用户名。

上传后确认文件存在：

```bash
ls -lh /var/www/basketball-team-website/public/assets/gallery/training
```

后台或数据里填写的视频地址应保持这种网站路径：

```text
/assets/gallery/training/training-video-1.mp4
```

不要填写服务器绝对路径。

## 九、绑定域名和 HTTPS

### 1. 域名解析

在域名服务商后台添加 DNS 记录：

```text
类型：A
主机记录：@
记录值：服务器公网IP
```

如果要使用 `www`：

```text
类型：A
主机记录：www
记录值：服务器公网IP
```

等待解析生效，通常几分钟到数小时。

### 2. 修改 Nginx server_name

编辑 Nginx 配置：

```bash
sudo nano /etc/nginx/sites-available/basketball-team-website
```

把：

```nginx
server_name _;
```

改成：

```nginx
server_name example.com www.example.com;
```

把 `example.com` 换成真实域名。

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 申请 HTTPS 证书

安装 Certbot：

```bash
sudo apt install -y certbot python3-certbot-nginx
```

申请证书并让 Certbot 自动改 Nginx：

```bash
sudo certbot --nginx
```

按提示选择域名，并开启 HTTP 自动跳转 HTTPS。

完成后访问：

```text
https://example.com
https://example.com/admin
```

测试证书续期：

```bash
sudo certbot renew --dry-run
```

## 十、数据持久化和备份

线上最重要的运行时数据：

```text
/var/www/basketball-team-website/data/site-data.json
/var/www/basketball-team-website/public/assets/uploads/
```

`site-data.json` 保存后台修改后的队员、赛程、新闻、招新信息和报名记录。

`public/assets/uploads/` 保存后台上传的新图片和视频。

建议每周备份一次：

```bash
mkdir -p ~/basketball-backups
tar -czf ~/basketball-backups/site-data-$(date +%F).tar.gz \
  /var/www/basketball-team-website/data/site-data.json \
  /var/www/basketball-team-website/public/assets/uploads
```

可以定期把 `~/basketball-backups` 下载到本地电脑或网盘。

重要提醒：

- 重新部署代码时，不要删除 `data/site-data.json`。
- 不要删除 `public/assets/uploads/`。
- 如果线上已经运营过，不要用本地旧数据覆盖线上 `site-data.json`。

## 十一、后续更新代码

如果以后本地修改代码并推送到 GitHub，服务器更新方式：

```bash
cd /var/www/basketball-team-website
git pull
npm install
npm run build
npm test
set -a
. /etc/basketball-team-website.env
set +a
pm2 restart basketball-team-website --update-env
```

如果只是后台改内容，不需要执行这些命令。后台保存会直接更新服务器上的 `data/site-data.json`。

## 十二、服务器安全注意事项

至少做到这些：

1. 不要使用默认后台密码。
2. 不要把 `ADMIN_PASSWORD` 和 `SESSION_SECRET` 写进 GitHub。
3. 云服务器安全组只放行必要端口：

```text
22   SSH 登录
80   HTTP
443  HTTPS
```

4. 不要对外开放 3000 端口，Node 服务只给 Nginx 本机转发。
5. 使用强密码或 SSH key 登录服务器。
6. 如果用 root 登录，部署完成后建议创建普通用户维护网站。
7. 定期执行系统更新：

```bash
sudo apt update
sudo apt upgrade -y
```

8. 定期备份 `data/site-data.json` 和 `public/assets/uploads/`。
9. 负责人离队或毕业后，及时更换 `ADMIN_PASSWORD`。
10. 不要把后台地址和密码发到公开群。

## 十三、新手检查清单

部署完成后逐项确认：

```text
[ ] http://服务器公网IP 能打开首页
[ ] http://服务器公网IP/admin 能打开后台
[ ] 能用正式 ADMIN_PASSWORD 登录后台
[ ] 后台修改一条测试内容后，前台能看到变化
[ ] 服务器存在 data/site-data.json
[ ] 后台上传图片后，public/assets/uploads 里出现文件
[ ] 视频文件已经上传到对应目录
[ ] pm2 status 显示网站 online
[ ] 重启服务器后网站还能自动恢复
[ ] 域名解析已生效
[ ] HTTPS 可以访问
[ ] 已建立数据备份方法
```

## 十四、推荐执行顺序

第一次上线建议按这个顺序做：

1. 购买服务器，选择 Ubuntu Server。
2. 登录服务器，安装 git、Node.js、npm、pm2、nginx。
3. 给 GitHub 仓库添加 Deploy key。
4. 拉取项目代码。
5. 配置 `/etc/basketball-team-website.env`。
6. 安装依赖并运行 `npm run build`、`npm test`。
7. 用 pm2 启动 Node 服务。
8. 用公网 IP 测试 `http://IP:3000`。
9. 配置 Nginx，用 `http://IP` 访问。
10. 单独上传视频文件。
11. 后台登录并做一次保存测试。
12. 绑定域名。
13. 申请 HTTPS。
14. 设置并验证备份。
