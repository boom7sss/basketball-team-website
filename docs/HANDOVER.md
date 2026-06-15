# 最终交接总入口

这份文档是篮球队官网交接时的第一入口。后续负责人日常维护网站，优先看本文；只有遇到具体运维、备份、域名或部署问题时，再打开其他专项文档。

本文不记录真实后台密码、服务器登录密码、`ADMIN_PASSWORD`、`SESSION_SECRET` 或 SSH 私钥。所有密码和密钥只通过可信渠道交接。

## 一句话状态

官网已经上线到香港 VPS，前台、后台、上传、视频播放、Nginx 缓存和自动备份均已完成验证。当前还没有绑定正式域名和 HTTPS，但不阻塞通过公网 IP 使用。

## 访问入口

```text
网站访问地址：http://43.129.197.63
后台登录地址：http://43.129.197.63/admin
GitHub 仓库：https://github.com/boom7sss/basketball-team-website.git
```

后台密码通过可信渠道交接。不要把后台密码发到公开群，也不要写进 GitHub、README、文档或网页内容。

## 当前线上信息

```text
VPS 服务商：腾讯云轻量应用服务器
服务器地区：中国香港 / 香港二区
公网 IP：43.129.197.63
操作系统：Ubuntu 24.04 LTS
部署目录：/var/www/basketball-team-website
pm2 服务名：basketball-team-website
Nginx 配置路径：/etc/nginx/sites-available/basketball-team-website
环境变量文件：/etc/basketball-team-website.env
备份目录：~/basketball-backups
```

服务器登录密码、SSH 私钥、后台密码、`SESSION_SECRET` 通过可信渠道交接。

## 日常怎么维护内容

日常维护不需要改代码，进入后台即可。

后台修改内容后，必须点击：

```text
保存全部
```

常用维护位置：

- 队员阵容：更新队员、照片、号码、位置、年级、状态。
- 赛程战绩：更新比赛时间、地点、比分和结果。
- 新闻动态：发布新闻、封面、轮播图和正文。
- 影像中心：维护比赛照片、比赛视频、训练、生活类素材。
- 招新信息：更新招新 QQ 群、流程、要求和 FAQ。
- 报名管理：查看报名，修改处理状态，写备注，删除无效报名。
- 球队资料：维护联系人、电话、邮箱、训练地点等信息。

更细的后台维护说明见：

```text
docs/CONTENT_MANAGEMENT.md
```

## 图片和视频怎么维护

图片：

- 后台有“上传”按钮时，直接上传图片。
- 图片会自动转成 WebP。
- 上传后仍要点击“保存全部”。
- 不要填写电脑本地路径，例如 `D:\...`。

视频：

- 后台支持上传视频，但大视频更建议先压缩成网页播放版。
- 现在后台上传视频不会自动压缩，也不会自动生成 `-web.mp4`；新增视频仍需人工判断大小、分辨率和码率。
- 视频文件不进 GitHub，换服务器时必须单独迁移。
- 重点大视频已切换到 `-web.mp4` 网页播放版，原视频保留。
- 新增视频小于 10MB 且播放不卡，可以先不压；10-30MB 看播放情况决定；超过 30MB，尤其是 4K、HEVC 或高码率，建议压成网页播放版；超过 100MB 基本应压缩，后续访问量大时再考虑 COS / OSS / CDN。
- 原视频先保留，方便回滚；压缩版画质确认可接受后，再把后台素材地址改成 `-web.mp4`。

常用视频目录：

```text
/var/www/basketball-team-website/public/assets/gallery/highlights/videos
/var/www/basketball-team-website/public/assets/gallery/training
/var/www/basketball-team-website/public/assets/gallery/life
```

后台填写时使用网站路径，例如：

```text
/assets/gallery/highlights/videos/highlight-video-12-web.mp4
```

视频压缩和已切换记录见：

```text
docs/VIDEO_OPTIMIZATION_LOG.md
```

## 备份机制

自动备份脚本已经启用：

```text
scripts/backup-runtime.sh
```

默认备份：

```text
data/site-data.json
public/assets/uploads
public/assets/gallery/**/*-web.mp4
```

备份目录：

```text
~/basketball-backups
```

自动备份说明：

```text
每天凌晨 3:30 通过 crontab 执行
默认保留 14 天
手动备份已验证通过
```

重要提醒：

- 自动备份仍在同一台 VPS 上，不能替代异地备份。
- 建议每月下载一份最新备份到本地电脑、网盘或学院资料盘。
- 换服务器时，必须迁移 `data/site-data.json`、`public/assets/uploads` 和视频文件。

详细说明见：

```text
docs/BACKUP_AUTOMATION.md
```

## 常见问题处理

后台保存后前台没变化：

1. 确认后台出现保存成功提示。
2. 刷新前台页面。
3. 如仍异常，让技术负责人查看 `data/site-data.json` 更新时间和 pm2 日志。

视频打不开或拖不动：

1. 确认视频文件在服务器同路径存在。
2. 确认后台填写的是 `/assets/...` 开头的网站路径。
3. 让技术负责人检查视频 Range 是否返回 `206 Partial Content`。

网站打不开：

1. 先访问 `http://43.129.197.63`。
2. 检查 pm2 是否 online。
3. 检查 Nginx 是否正常。
4. 查看 pm2 和 Nginx 日志。

后台登录不了：

1. 确认使用的是通过可信渠道交接的正式后台密码。
2. 确认网站服务在线。
3. 如果刚改过 `/etc/basketball-team-website.env`，需要重启 pm2 服务。

服务器重启后网站打不开：

1. 检查 pm2 状态。
2. 尝试 `pm2 resurrect`。
3. 检查 Nginx 状态。

常用命令见：

```text
docs/OPS_COMMANDS.md
```

## 后续 TODO

以下事项不阻塞当前使用。建议下一届技术负责人按优先级处理。

### P0：交接前必须确认

1. 补全交接信息模板
   打开 `docs/HANDOVER_INFO_TEMPLATE.md`，补充交接日期、服务器账号持有人、服务器续费时间、负责人联系方式、异地备份保存位置等。不要写真实密码或密钥。

2. 通过可信渠道交接敏感信息
   单独交接后台正式密码、服务器登录方式、SSH 私钥或登录密码、腾讯云账号归属、GitHub 仓库管理权限。不要把这些内容写进 GitHub 文档。

3. 下载一份异地备份
   当前自动备份在 VPS 本机的 `~/basketball-backups`，建议交接前下载一份最新备份到本地电脑、网盘或学院资料盘。具体命令和恢复方式见 `docs/BACKUP_AUTOMATION.md`。

### P1：下一届优先处理

1. 绑定正式域名并配置 HTTPS
   当前网站通过 `http://43.129.197.63` 访问，后台登录长期使用建议改成 HTTPS。优先申请学院或学校二级域名；如果不行，再购买由球队公共账号、学院老师账号或下一届长期负责人持有的商业域名。域名到位后，把 A 记录指向 `43.129.197.63`，再按 `docs/DOMAIN_HTTPS_TODO.md` 配置 `certbot + nginx`，并验证自动续期。

2. 负责人更换后及时更换后台密码
   修改服务器环境变量文件 `/etc/basketball-team-website.env` 中的 `ADMIN_PASSWORD`，然后按 `docs/OPS_COMMANDS.md` 的方式重启 pm2 服务。不要把新密码写进文档。

3. 确认服务器和域名续费责任人
   在 `docs/HANDOVER_INFO_TEMPLATE.md` 里写清服务器账号持有人、续费时间、续费提醒方式。以后如果有域名，也要写清域名账号持有人和续费时间。

### P2：中期安全和运维加固

1. 给后台登录增加基础防护
   当前后台是单管理员密码模式，没有登录失败次数限制。配置 HTTPS 后，可在 Nginx 层给 `/api/login` 加 `limit_req`，或者在 Node 登录接口中增加同一 IP 多次失败后的短时间延迟/拒绝。这样可以降低被反复试密码的风险。

2. 建立每月异地备份习惯
   自动备份仍在同一台 VPS 上，不能替代异地备份。建议每月固定下载一次 `basketball-auto-runtime-*.tar.gz` 和 `.sha256` 到本地、网盘或学院资料盘，并偶尔按 `docs/BACKUP_AUTOMATION.md` 做一次临时目录恢复检查。

3. 根据访问量决定是否迁移视频
   目前重点大视频已切到 `-web.mp4` 网页播放版，香港 VPS 可以支撑首版使用。如果后续多人同时观看视频明显变慢，再考虑腾讯云 COS / 阿里云 OSS / CDN。迁移前要保留原视频，并记录新视频地址和回滚方式。

4. 长期运营时考虑后台多账号
   当前是单管理员密码，多人共用无法区分是谁改了内容。长期运营可增加多账号、角色权限和修改记录。首版不需要立即做。

### P3：低优先级技术优化

1. 支持 `HEAD` 请求
   浏览器访问当前正常，但部分监控工具会用 `HEAD /` 检查网站，可能看到 404。后续可让服务器对 `HEAD /`、`HEAD /admin` 和静态资源返回与 GET 相同的状态但不返回正文，或者把监控工具设置为 GET 检查。

2. 加固静态文件路径判断
   当前静态文件访问可用，线上 `/assets/` 主要由 Nginx 托管。后续可把 Node 里的 `startsWith(publicRoot)` 判断改成更严谨的 `path.relative()` 目录边界判断，避免未来目录结构变化时出现边界问题。

3. 本地仓库交接方式
   不要把整个本地目录连 `.git` 一起压缩交给下一届。本地 `.git` 里可能有不可达的大对象残留。下一届应从 GitHub clone 仓库，再按交接文档迁移线上运行时数据、上传目录和视频文件。

域名和 HTTPS 操作见：

```text
docs/DOMAIN_HTTPS_TODO.md
```

## 交接时必须确认

实际交接时，请按下面模板填写：

```text
docs/HANDOVER_INFO_TEMPLATE.md
```

需要当面或通过可信渠道交接：

- 后台正式密码。
- 服务器登录方式。
- SSH 私钥或登录密码。
- GitHub 仓库管理权限。
- 腾讯云账号归属和续费信息。
- 未来域名账号、DNS 权限和续费信息。

不要把这些密码、密钥、账号密码写进本文档或提交到 GitHub。

## 文档地图

优先阅读：

- `docs/DOCUMENTS_GUIDE.md`：下一届负责人文档导航，先看它判断每份文档什么时候读。
- `docs/HANDOVER.md`：最终交接总入口。
- `docs/HANDOVER_INFO_TEMPLATE.md`：实际交接填写模板。
- `docs/OPS_COMMANDS.md`：常用运维命令。
- `docs/CONTENT_MANAGEMENT.md`：后台内容维护。
- `docs/BACKUP_AUTOMATION.md`：自动备份和恢复。
- `docs/DOMAIN_HTTPS_TODO.md`：域名和 HTTPS 后续事项。

专项记录：

- `docs/HK_VPS_DEPLOYMENT_CHECKLIST.md`：上线过程清单。
- `docs/OPTIMIZATION_NOTES.md`：上线优化记录。
- `docs/VIDEO_OPTIMIZATION_LOG.md`：视频压缩记录。
- `docs/DEPLOYMENT.md`、`docs/VPS_DEPLOYMENT.md`：部署说明。
- `docs/PROJECT_CONTEXT.md`、`docs/CHANGELOG.md`：项目背景和历史记录。
