# 官网交接信息填写模板

本文用于实际交接时填写。已知的项目、服务器、部署和备份信息已经预填好；你只需要补充账号持有人、续费时间、负责人联系方式，以及通过可信渠道交接密码和密钥。

请不要在本文档中写入真实后台密码、`SESSION_SECRET`、服务器登录密码、SSH 私钥、云服务账号密码或域名账号密码。

密码、密钥和账号密码只通过可信渠道交接。

## 基本信息

```text
网站地址：http://43.129.197.63
后台登录地址：http://43.129.197.63/admin
GitHub 仓库地址：https://github.com/boom7sss/basketball-team-website.git
项目当前状态：已上线、已优化、已启用自动备份；当前通过公网 IP 访问，暂未绑定正式域名和 HTTPS
交接日期：待填写
```

## VPS 信息

```text
VPS 服务商：腾讯云轻量应用服务器
服务器地区：中国香港 / 香港二区
公网 IP：43.129.197.63
操作系统：Ubuntu 24.04 LTS
服务器配置：2 核 / 2GB / 40GB SSD / 20Mbps / 512GB 月流量
服务器账号持有人：待填写
服务器续费时间：待填写
服务器控制台地址：腾讯云轻量应用服务器控制台，具体账号通过可信渠道交接
```

服务器登录信息：

```text
SSH 登录用户：ubuntu
SSH 登录方式：密码 / SSH 私钥 / 其他，按实际情况填写
服务器登录密码：通过可信渠道交接，不写入本文档
SSH 私钥：如使用密钥登录，通过可信渠道交接，不写入本文档
```

## 项目部署

```text
部署目录：/var/www/basketball-team-website
Node 版本：v24.16.0
npm 版本：11.13.0
pm2 版本：7.0.1
pm2 服务名：basketball-team-website
Nginx 版本：1.24.0
Nginx 配置路径：/etc/nginx/sites-available/basketball-team-website
Nginx 启用配置路径：/etc/nginx/sites-enabled/basketball-team-website
环境变量文件路径：/etc/basketball-team-website.env
```

敏感环境变量交接：

```text
ADMIN_PASSWORD：通过可信渠道交接，不写入本文档
SESSION_SECRET：通过可信渠道交接，不写入本文档
PORT：3000
DATA_FILE：/var/www/basketball-team-website/data/site-data.json
```

## 后台管理

```text
后台登录地址：http://43.129.197.63/admin
后台管理员模式：单管理员密码模式，当前没有多账号系统
后台密码交接方式：通过可信渠道交接，不写入本文档
内容维护负责人：待填写
报名管理负责人：待填写
```

日常维护入口：

```text
队员阵容：维护队员、号码、位置、照片、状态
赛程战绩：维护比赛时间、地点、比分、结果
新闻动态：发布新闻、封面、轮播图、正文
影像中心：维护比赛照片、比赛视频、训练、生活类素材
招新信息：维护招新群、流程、要求、FAQ
报名管理：查看报名、修改状态、填写备注、删除无效报名
球队资料：维护联系人、电话、邮箱、训练地点
```

## 运行时数据和素材

```text
线上数据文件：/var/www/basketball-team-website/data/site-data.json
上线初始数据快照：/var/www/basketball-team-website/data/site-data.seed.json
后台上传目录：/var/www/basketball-team-website/public/assets/uploads
比赛视频目录：/var/www/basketball-team-website/public/assets/gallery/highlights/videos
训练视频目录：/var/www/basketball-team-website/public/assets/gallery/training
生活视频目录：/var/www/basketball-team-website/public/assets/gallery/life
原始素材归档位置：本地项目中的“球员照片”“影像素材”，以及后续负责人另行保存的位置
```

重要说明：

```text
data/site-data.json 是线上后台保存后的真实内容和报名数据。
public/assets/uploads 是后台上传文件目录。
视频文件不进入 GitHub，迁移服务器时必须单独迁移。
重新部署代码时，不要覆盖或删除线上 data/site-data.json。
不要删除原视频；重点大视频已切换到 -web.mp4 网页播放版，原视频保留。
```

## 备份信息

```text
备份目录：~/basketball-backups
自动备份脚本路径：/var/www/basketball-team-website/scripts/backup-runtime.sh
自动备份执行时间：每天凌晨 3:30
自动备份保留天数：14 天
最近一次手动备份文件：~/basketball-backups/basketball-site-2026-06-13.tar.gz
自动备份文件命名：~/basketball-backups/basketball-auto-runtime-*.tar.gz
自动备份校验文件：~/basketball-backups/basketball-auto-runtime-*.tar.gz.sha256
异地备份保存位置：待填写，建议保存到本地电脑、网盘或学院资料盘
异地备份负责人：待填写
```

自动备份说明文档：

```text
docs/BACKUP_AUTOMATION.md
```

备份范围：

```text
data/site-data.json
public/assets/uploads
public/assets/gallery/**/*-web.mp4
```

## 域名和 HTTPS

```text
当前域名：暂未绑定
域名注册商：待填写；如果暂未购买域名，填“暂无”
域名账号持有人：待填写；建议使用球队公共账号、学院老师账号或下一任长期负责人账号
域名续费时间：待填写；如果暂未购买域名，填“暂无”
DNS 控制台地址：待填写；如果暂未购买域名，填“暂无”
域名解析记录：暂未配置；后续 A 记录指向 43.129.197.63
HTTPS 状态：暂未配置，当前使用 http://43.129.197.63
HTTPS 证书工具：计划使用 certbot + nginx
证书续期方式：待域名和 HTTPS 配置后确认
最近一次证书续期测试结果：暂未配置 HTTPS，暂无
后续处理文档：docs/DOMAIN_HTTPS_TODO.md
```

说明：

```text
当前服务器位于中国香港，使用公网 IP 访问不影响网站和后台功能。
后台登录长期使用时建议后续配置 HTTPS。
优先申请学院或学校二级域名；如果购买商业域名，建议不要长期绑定在即将毕业同学的个人账号下。
```

## GitHub 信息

```text
GitHub 仓库地址：https://github.com/boom7sss/basketball-team-website.git
当前分支：master
最近交接整理提交：final project handover consolidation
仓库管理员：待填写
服务器拉取方式：GitHub Deploy key
Deploy key 权限：只读拉取；不要勾选 Allow write access
```

不能提交到 GitHub 的内容：

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

## 负责人联系方式

```text
技术负责人姓名：待填写
技术负责人联系方式：待填写
球队负责人姓名：待填写
球队负责人联系方式：待填写
内容维护负责人姓名：待填写
内容维护负责人联系方式：待填写
报名管理负责人姓名：待填写
报名管理负责人联系方式：待填写
服务器账号持有人：待填写
GitHub 仓库管理员：待填写
域名账号持有人：待填写；如暂无域名，填“暂无”
```

## 交接确认

```text
[ ] 网站首页可以访问：http://43.129.197.63
[ ] 后台页面可以访问：http://43.129.197.63/admin
[ ] 后台密码已通过可信渠道交接
[ ] 服务器登录方式已通过可信渠道交接
[ ] 腾讯云账号归属和续费时间已说明
[ ] GitHub 仓库权限已交接
[ ] 后台保存方式已演示
[ ] 后台上传方式已演示
[ ] 报名管理位置已说明
[ ] 备份目录已说明：~/basketball-backups
[ ] 手动备份方式已说明：docs/BACKUP_AUTOMATION.md
[ ] 自动备份任务已说明：每天凌晨 3:30
[ ] 异地备份保存位置已确认
[ ] 域名/HTTPS 当前状态已说明：暂未绑定域名，暂未配置 HTTPS
[ ] 后续域名/HTTPS 文档已说明：docs/DOMAIN_HTTPS_TODO.md
[ ] 不应提交到 GitHub 的内容已说明
```

## 后续不阻塞使用的 TODO

```text
P0 交接前确认：
1. 补全本文档中的待填写项。
2. 通过可信渠道交接后台密码、服务器登录方式、SSH 私钥或登录密码、腾讯云账号、GitHub 权限。
3. 下载一份最新异地备份到本地电脑、网盘或学院资料盘。

P1 下一届优先处理：
1. 申请学院二级域名或购买正式域名，将 A 记录指向 43.129.197.63。
2. 按 docs/DOMAIN_HTTPS_TODO.md 配置 certbot + nginx + HTTPS 自动续期。
3. 负责人更换后，修改 /etc/basketball-team-website.env 中的 ADMIN_PASSWORD，并重启 pm2。
4. 写清服务器和域名的账号持有人、续费时间、续费提醒方式。

P2 中期安全和运维加固：
1. 给 /api/login 增加基础限速或失败延迟，降低反复试密码风险。
2. 每月下载一次 basketball-auto-runtime-*.tar.gz 和 .sha256 到异地位置。
3. 视频访问量增加后，再考虑迁移到 COS / OSS / CDN，并保留原视频和回滚方式。
4. 长期运营时，可增加后台多账号、权限分级、报名通知和修改记录。

P3 低优先级技术优化：
1. 支持 HEAD 请求，避免部分监控工具误报 404。
2. 用 path.relative() 加固 Node 静态文件目录边界判断。
3. 下一届从 GitHub clone 仓库，不要直接接收包含 .git 的本地压缩包。
```

## 备注

```text
其他需要交接的事项：待填写
```
