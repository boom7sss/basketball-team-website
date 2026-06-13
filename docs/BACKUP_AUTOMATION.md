# 自动备份说明

更新时间：2026-06-14

本文说明如何在香港 VPS 上启用篮球队官网自动备份。本文不记录任何后台密码、服务器登录密码、`SESSION_SECRET` 或 SSH 私钥。

## 备份目标

自动备份脚本：

```text
scripts/backup-runtime.sh
```

默认备份：

```text
data/site-data.json
public/assets/uploads
public/assets/gallery/**/*-web.mp4
```

说明：

- `data/site-data.json` 是后台保存后的真实内容和报名数据。
- `public/assets/uploads` 是后台上传素材。
- `*-web.mp4` 是服务器压缩后正在使用或候选使用的网页播放版视频。
- 原始大视频默认不纳入每日自动备份，避免 40GB 服务器被重复备份占满。

默认备份目录：

```text
~/basketball-backups
```

默认保留：

```text
14 天
```

## 手动运行一次

进入项目目录：

```bash
cd /var/www/basketball-team-website
```

给脚本执行权限：

```bash
chmod +x scripts/backup-runtime.sh
```

手动运行：

```bash
scripts/backup-runtime.sh
```

检查结果：

```bash
ls -lh ~/basketball-backups | grep basketball-auto-runtime | tail
```

备份文件类似：

```text
basketball-auto-runtime-2026-06-14-033000.tar.gz
basketball-auto-runtime-2026-06-14-033000.tar.gz.sha256
```

## 配置每日自动备份

建议每天凌晨 3:30 执行：

```bash
cd /var/www/basketball-team-website
chmod +x scripts/backup-runtime.sh

( crontab -l 2>/dev/null | grep -v 'scripts/backup-runtime.sh' ; \
  echo '30 3 * * * cd /var/www/basketball-team-website && /bin/bash scripts/backup-runtime.sh >> /home/ubuntu/basketball-backups/backup-cron.log 2>&1' \
) | crontab -
```

查看当前定时任务：

```bash
crontab -l
```

查看备份日志：

```bash
tail -n 50 ~/basketball-backups/backup-cron.log
```

## 自定义保留天数

默认保留 14 天。若要保留 30 天，cron 可以改成：

```bash
30 3 * * * cd /var/www/basketball-team-website && RETENTION_DAYS=30 /bin/bash scripts/backup-runtime.sh >> /home/ubuntu/basketball-backups/backup-cron.log 2>&1
```

## 自定义备份目录

默认备份到：

```text
~/basketball-backups
```

如果要换目录：

```bash
BACKUP_DIR=/path/to/backups scripts/backup-runtime.sh
```

## 不备份 web 视频

如果只想备份数据和上传目录：

```bash
INCLUDE_WEB_VIDEOS=0 scripts/backup-runtime.sh
```

不建议长期这样做，因为 `*-web.mp4` 文件不在 GitHub 中，换服务器时仍要单独迁移。

## 恢复方式

先查看备份内容：

```bash
tar -tzf ~/basketball-backups/备份文件名.tar.gz | head
```

恢复到临时目录检查：

```bash
mkdir -p /tmp/basketball-restore-check
tar -xzf ~/basketball-backups/备份文件名.tar.gz -C /tmp/basketball-restore-check
find /tmp/basketball-restore-check -maxdepth 4 -type f | head
```

确认无误后再恢复到项目目录。不要在没有确认的情况下直接覆盖线上文件。

恢复 `site-data.json` 示例：

```bash
cp /tmp/basketball-restore-check/data/site-data.json \
  /var/www/basketball-team-website/data/site-data.json
pm2 restart basketball-team-website --update-env
```

恢复上传目录示例：

```bash
rsync -av /tmp/basketball-restore-check/public/assets/uploads/ \
  /var/www/basketball-team-website/public/assets/uploads/
```

## 每月建议

自动备份仍在同一台 VPS 上，不能替代异地备份。建议每月做一次：

```text
把最新的 basketball-auto-runtime-*.tar.gz 下载到本地电脑、网盘或学院资料盘。
```

如果服务器硬盘损坏、账号丢失或误删整个目录，同机备份也会一起丢失。异地备份是毕业交接时最重要的一层保险。

## 验证清单

启用后确认：

```text
[ ] scripts/backup-runtime.sh 可以手动运行成功
[ ] ~/basketball-backups 中出现 basketball-auto-runtime-*.tar.gz
[ ] crontab -l 中存在每日备份任务
[ ] backup-cron.log 没有报错
[ ] tar -tzf 可以正常列出备份内容
[ ] 后续负责人知道备份目录和恢复方法
```
