# 官网交接信息模板

这份模板用于交接给下一任负责人。请不要在本文档中写入真实密码、`SESSION_SECRET`、服务器登录密码或 GitHub 私钥。密码和密钥只通过可信渠道交接。

## 基本信息

```text
网站访问地址：http://43.129.197.63
GitHub 仓库地址：https://github.com/boom7sss/basketball-team-website.git
VPS 服务商：腾讯云轻量应用服务器
服务器地域：中国香港 / 香港二区
公网 IP：43.129.197.63
续费时间：待填写
```

## 服务器登录

```text
服务器登录方式：SSH 登录，ubuntu 用户
服务器登录密码：通过可信渠道交接
SSH 私钥：如使用密钥登录，通过可信渠道交接
```

## 项目部署

```text
项目部署目录：/var/www/basketball-team-website
pm2 服务名：basketball-team-website
Nginx 配置路径：/etc/nginx/sites-available/basketball-team-website
Nginx 启用配置路径：/etc/nginx/sites-enabled/basketball-team-website
服务器环境变量文件：/etc/basketball-team-website.env
```

## 后台管理

```text
后台登录地址：http://43.129.197.63/admin
后台管理员账号说明：当前为单管理员密码模式，没有多账号系统
ADMIN_PASSWORD 交接方式：通过可信渠道交接
SESSION_SECRET 交接方式：通过可信渠道交接
```

注意：

- 不要把正式后台密码写进 GitHub、README、部署文档或公开群。
- 负责人更换时，建议及时更换 `ADMIN_PASSWORD`。
- 如果修改 `/etc/basketball-team-website.env`，需要重启 pm2 服务。

## 运行时数据

```text
数据文件位置：/var/www/basketball-team-website/data/site-data.json
上线初始数据快照：/var/www/basketball-team-website/data/site-data.seed.json
上传文件目录：/var/www/basketball-team-website/public/assets/uploads
比赛视频目录：/var/www/basketball-team-website/public/assets/gallery/highlights/videos
训练视频目录：/var/www/basketball-team-website/public/assets/gallery/training
生活视频目录：/var/www/basketball-team-website/public/assets/gallery/life
备份文件位置：~/basketball-backups
最近一次备份：~/basketball-backups/basketball-site-2026-06-13.tar.gz
```

重要提醒：

- `data/site-data.json` 是线上后台保存后的真实内容和报名数据。
- `public/assets/uploads` 是后台上传文件目录。
- 视频文件不在 Git 仓库里，换服务器时必须单独迁移视频目录。
- 重新部署代码时，不要覆盖或删除线上 `data/site-data.json`。

## 域名和 HTTPS

```text
当前域名：暂未绑定
域名注册商：待填写
域名解析记录：待填写
HTTPS 状态：暂未配置，当前使用 http://43.129.197.63
证书工具：计划使用 certbot + nginx
证书续期方式：待配置
```

域名配置后，需要把域名 A 记录指向：

```text
43.129.197.63
```

## 常见维护命令

进入项目目录：

```bash
cd /var/www/basketball-team-website
```

查看网站进程：

```bash
pm2 status
```

查看网站日志：

```bash
pm2 logs basketball-team-website --lines 50
```

重启网站：

```bash
set -a
. /etc/basketball-team-website.env
set +a
pm2 restart basketball-team-website --update-env
```

检查 Nginx 配置：

```bash
sudo nginx -t
```

重载 Nginx：

```bash
sudo systemctl reload nginx
```

更新代码：

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

手动备份线上数据和素材：

```bash
mkdir -p ~/basketball-backups
tar -czf ~/basketball-backups/basketball-site-$(date +%F).tar.gz \
  /var/www/basketball-team-website/data/site-data.json \
  /var/www/basketball-team-website/public/assets/uploads \
  /var/www/basketball-team-website/public/assets/gallery/highlights/videos \
  /var/www/basketball-team-website/public/assets/gallery/training/*.mp4 \
  /var/www/basketball-team-website/public/assets/gallery/life/*.mp4
```

检查视频文件：

```bash
find /var/www/basketball-team-website/public/assets/gallery -type f \( -name "*.mp4" -o -name "*.mov" -o -name "*.webm" \)
```

检查后台数据文件：

```bash
ls -lh /var/www/basketball-team-website/data/site-data.json
stat /var/www/basketball-team-website/data/site-data.json
```

## 常见问题

### 后台保存后前台没变化

先确认后台是否显示“已保存”。然后刷新前台页面。如果仍然不变，检查：

```bash
stat /var/www/basketball-team-website/data/site-data.json
pm2 logs basketball-team-website --lines 50
```

### 视频播放慢

当前视频直接放在香港 VPS 上，受服务器带宽影响。后续可压缩大视频，或迁移到对象存储 / CDN。

### 浏览器控制台出现 favicon.ico 404

这是网站小图标缺失，不影响访问和后台功能。后续可补一个 `favicon.ico`。

### 服务器重启后网站打不开

检查 pm2：

```bash
pm2 status
pm2 resurrect
pm2 save
```

检查 Nginx：

```bash
sudo systemctl status nginx
sudo nginx -t
```

## 紧急联系人

```text
技术负责人姓名：待填写
技术负责人联系方式：待填写
球队负责人姓名：待填写
球队负责人联系方式：待填写
服务器账号持有人：待填写
GitHub 仓库管理员：待填写
```

密码、密钥、后台密码、服务器登录密码请通过可信渠道交接，不要写在本文档中。

