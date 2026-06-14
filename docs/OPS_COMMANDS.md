# 常用运维命令

日常交接优先阅读 `docs/HANDOVER.md`。本文只放后续负责人常用的服务器检查、重启、备份和排查命令。

以下命令默认在服务器上执行。

## 进入项目目录

```bash
cd /var/www/basketball-team-website
```

## 查看 pm2 状态

```bash
pm2 status
```

正常时应看到：

```text
basketball-team-website online
```

## 查看 pm2 日志

```bash
pm2 logs basketball-team-website --lines 80
```

只看最近日志：

```bash
pm2 logs basketball-team-website --lines 30 --nostream
```

## 重启网站服务

如果没有改环境变量：

```bash
pm2 restart basketball-team-website
```

如果刚修改过 `/etc/basketball-team-website.env`：

```bash
set -a
. /etc/basketball-team-website.env
set +a
pm2 restart basketball-team-website --update-env
```

保存 pm2 当前进程列表：

```bash
pm2 save
```

服务器重启后恢复 pm2 进程：

```bash
pm2 resurrect
```

## 检查 Nginx 配置

```bash
sudo nginx -t
```

看到 `syntax is ok` 和 `test is successful` 才能继续重载。

## 重载 Nginx

```bash
sudo systemctl reload nginx
```

查看 Nginx 状态：

```bash
sudo systemctl status nginx
```

## 查看磁盘空间

```bash
df -h
```

查看项目目录大小：

```bash
du -sh /var/www/basketball-team-website
```

查看备份目录大小：

```bash
du -sh ~/basketball-backups
```

## 查看内存

```bash
free -h
```

查看系统负载：

```bash
uptime
```

## 手动执行备份

```bash
cd /var/www/basketball-team-website
chmod +x scripts/backup-runtime.sh
scripts/backup-runtime.sh
```

## 查看备份文件

```bash
ls -lh ~/basketball-backups
```

只看最近备份：

```bash
ls -lh ~/basketball-backups | tail
```

查看备份日志：

```bash
tail -n 80 ~/basketball-backups/backup-cron.log
```

查看备份包里有什么：

```bash
tar -tzf ~/basketball-backups/备份文件名.tar.gz | head
```

## 检查网站访问

首页：

```bash
curl -I http://43.129.197.63/
```

后台页面：

```bash
curl -I http://43.129.197.63/admin
```

公开 API 不缓存：

```bash
curl -I http://43.129.197.63/api/site
```

图片缓存：

```bash
curl -I http://43.129.197.63/assets/team-huddle.webp
```

视频 Range：

```bash
curl -I -H "Range: bytes=0-1023" http://43.129.197.63/assets/gallery/highlights/videos/highlight-video-12-web.mp4
```

视频 Range 正常时应返回：

```text
206 Partial Content
Accept-Ranges: bytes
Content-Range: bytes ...
```

## 更新代码后的检查

只有技术负责人更新代码后才需要执行：

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

后台日常改内容不需要执行这些命令。

## 网站异常时排查顺序

1. 先打开 `http://43.129.197.63/`，确认是全站打不开，还是只有某个页面异常。
2. 打开 `http://43.129.197.63/admin`，确认后台页面是否可访问。
3. 执行 `pm2 status`，确认 `basketball-team-website` 是否 online。
4. 执行 `pm2 logs basketball-team-website --lines 80 --nostream`，看是否有启动或 API 报错。
5. 执行 `sudo nginx -t`，确认 Nginx 配置没有语法错误。
6. 执行 `sudo systemctl status nginx`，确认 Nginx 正常运行。
7. 执行 `df -h`，确认磁盘没有满。
8. 执行 `free -h`，确认内存没有耗尽。
9. 如果只是图片或视频异常，确认文件是否存在于 `/var/www/basketball-team-website/public/assets/...`。
10. 如果只是后台保存异常，检查 `data/site-data.json` 是否存在、权限是否正常、磁盘是否满。

## 不要做的事

```text
不要把真实 ADMIN_PASSWORD 写进 GitHub。
不要把真实 SESSION_SECRET 写进 GitHub。
不要删除 data/site-data.json。
不要删除 public/assets/uploads。
不要删除原视频。
不要把 3000 端口直接开放到公网。
不要在未备份时直接覆盖线上运行时数据。
```
