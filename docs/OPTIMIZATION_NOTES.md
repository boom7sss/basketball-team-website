# 线上优化记录

日常交接优先阅读 `docs/HANDOVER.md`。本文是线上优化阶段记录，不是日常维护入口。

更新时间：2026-06-14

本文记录香港 VPS 基础部署完成后的性能、交付和上线观感优化。本文不记录真实 `ADMIN_PASSWORD`、`SESSION_SECRET`、服务器登录密码或 SSH 私钥。

## 优化阶段收尾总结

本轮线上优化阶段已收尾。后续 Final Agent 只建议做文档归并、最终交接信息整理和必要的只读核对，不建议继续做功能开发、页面修改或后台逻辑调整。

已完成：

- favicon 修复：`public/favicon.ico` 已部署，线上 `/favicon.ico` 返回 200。
- 占位文案清理：影像页残留占位说明已替换为正式上线文案。
- Nginx 静态缓存验证：`/assets/` 图片和视频由 Nginx 直接托管并带缓存头。
- API 不缓存验证：`/api/site` 返回 `Cache-Control: no-store`。
- 视频 Range 验证：视频请求返回 `206 Partial Content`，支持分段加载。
- 大视频压缩并切换：`highlight-video-2`、`9`、`11`、`12`、`13`、`14` 已切换到 `-web.mp4` 网页播放版，原视频保留。
- 自动备份脚本启用：`scripts/backup-runtime.sh` 已部署，crontab 已配置每日凌晨 3:30 自动执行。
- 手动备份验证：已成功生成 `basketball-auto-runtime-*.tar.gz` 和 `.sha256` 校验文件。
- 后台登录、保存、上传验证：均已通过。
- pm2 在线：`basketball-team-website` 处于 online 状态。

当前未完成但不阻塞使用：

- 域名和 HTTPS：等待学院二级域名或后续长期负责人持有的商业域名，详见 `docs/DOMAIN_HTTPS_TODO.md`。
- 原视频归档/清理：暂不删除，建议稳定观察后下载到本地或网盘归档，再决定是否从服务器清理。
- 异地备份：当前自动备份仍在同一台 VPS，建议每月下载一份到本地、网盘或学院资料盘。
- 后台多账号：当前仍为单管理员密码模式，首版可用，长期运营可再做账号体系。
- 页面结构文案后台可编辑：如“具体素材”说明仍在 `public/app.js`，不常改，暂不迁移到后台。
- COS/OSS/CDN：视频压缩后播放体验已改善，暂不迁移。
- pending kernel upgrade：服务器提示过内核待升级，后续可选择低访问时段重启 VPS，并检查 pm2/Nginx 是否自动恢复。

当前线上状态：

```text
网站访问：http://43.129.197.63 可访问
后台：http://43.129.197.63/admin 可访问
后台登录：已验证正常
后台保存：已验证正常
后台上传：已验证正常
视频播放：已切换的 web 版视频可访问，Range 返回 206
备份：手动备份验证通过，自动备份 crontab 已启用
GitHub：最新优化代码和文档已推送
```

给 Final Agent 的交接摘要：

```text
当前优化 Agent 已完成上线观感、静态交付、视频播放、备份自动化和交接 TODO 整理。
已更新 docs/OPTIMIZATION_NOTES.md、docs/VIDEO_OPTIMIZATION_LOG.md、docs/BACKUP_AUTOMATION.md、docs/DOMAIN_HTTPS_TODO.md、docs/HANDOVER_INFO_TEMPLATE.md、docs/HK_VPS_DEPLOYMENT_CHECKLIST.md 等文档。
Final Agent 接下来只需要做文档归并、最终交接清单整理、敏感信息交接提醒和必要的只读状态核对。
不建议 Final Agent 继续新增功能、修改页面、重构后台逻辑或做新的线上优化。
```

## 本次本地优化

已完成：

- 清理前台影像页面残留占位文案，替换为正式上线说明。
- 同步更新 `data/site-data.seed.json` 和 `server/defaultData.mjs` 中部分影像说明，避免以后重新初始化时出现临时感文案。
- 新增 `public/favicon.ico`，用于修复浏览器请求 `/favicon.ico` 时的 404。
- 记录视频、图片、Nginx 缓存和 HTTPS 当前状态。

未直接改动：

- 没有修改后台登录、保存、上传逻辑。
- 没有修改真实 `ADMIN_PASSWORD` 或 `SESSION_SECRET`。
- 没有删除或覆盖任何素材。
- 没有直接压缩或迁移线上视频。
- 没有直接修改线上 Nginx 配置。

## 占位文案检查

本地已检查：

```text
public/app.js
data/site-data.seed.json
server/defaultData.mjs
docs
data/site-data.json
```

结果：

- `public/app.js` 中曾有前台可见的影像页占位说明，已替换为正式上线说明。
- `data/site-data.seed.json` 和 `server/defaultData.mjs` 没有同样的占位句，但已同步把几条影像说明改得更正式。
- 本地 `data/site-data.json` 未发现目标占位文案。
- docs 中的“占位文字”仅出现在部署说明语境，不是前台展示内容。

如果线上 `data/site-data.json` 仍有残留，安全更新方案：

1. 先备份线上数据文件：

```bash
cp /var/www/basketball-team-website/data/site-data.json \
  /var/www/basketball-team-website/data/site-data.json.$(date +%F-%H%M%S).bak
```

2. 只读检查是否仍有残留：

```bash
grep -nE '占位|placeholder' \
  /var/www/basketball-team-website/data/site-data.json
```

3. 优先在后台修改对应文案并点击“保存全部”。如果必须直接改 JSON，修改后先验证 JSON 格式，再刷新前台确认。

```bash
node -e "JSON.parse(require('fs').readFileSync('/var/www/basketball-team-website/data/site-data.json','utf8')); console.log('JSON OK')"
```

回滚方式：把备份文件复制回 `data/site-data.json`。

## 视频体积和播放速度

本地视频总量约 845MB，共 16 个视频。最大文件：

| 文件 | 体积 |
| --- | ---: |
| `public/assets/gallery/highlights/videos/highlight-video-12.mp4` | 约 213MB |
| `public/assets/gallery/highlights/videos/highlight-video-13.mp4` | 约 188MB |
| `public/assets/gallery/highlights/videos/highlight-video-14.mp4` | 约 145MB |
| `public/assets/gallery/highlights/videos/highlight-video-9.mp4` | 约 80MB |
| `public/assets/gallery/highlights/videos/highlight-video-2.mp4` | 约 54MB |

建议优先级：

1. 适合毕业后维护的方案：保留原视频，生成网页播放版 MP4，文件名加 `-web.mp4`，后台或数据里改为网页播放版路径。原视频留在服务器或本地素材库中备份。
2. 访问量明显增加后：迁移视频到腾讯云 COS / 阿里云 OSS，并按需接 CDN。优点是播放更稳，缺点是需要对象存储账号、费用和维护交接。
3. 当前短期可保留 VPS 直出：Nginx 已支持 Range 请求，能拖动播放，但 20Mbps 带宽遇到多人同时观看大视频会变慢。

压缩前必须先说明压缩参数、预估收益和回滚方式。建议参数：

```bash
ffmpeg -i input.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 128k output-web.mp4
```

预估收益：大多数手机拍摄或原始导出视频可降低 40% 到 80% 体积。实际以画质验收为准。

回滚方式：保留原视频不删除；如果网页播放版效果不好，把后台路径改回原文件即可。

线上已完成的视频压缩和切换记录见：

```text
docs/VIDEO_OPTIMIZATION_LOG.md
```

当前已切换到网页播放版的视频包括：

```text
highlight-video-2
highlight-video-9
highlight-video-11
highlight-video-12
highlight-video-13
highlight-video-14
```

## 图片加载速度

本地 `public/assets` 图片均为 WebP，未发现 JPG/PNG/GIF/SVG 混入部署图片目录。

图片总量约 22.66MB，共 81 张 WebP。最大图片约 589KB，属于可接受范围。本次不批量重压图片，避免引入画质变化和不必要的视觉风险。

后台上传图片仍会自动转为 WebP，并限制最大边到 1920px。

## Nginx 缓存现状

线上只读检查结果：

- `GET /` 返回 200。
- `GET /admin` 返回 200。
- `GET /api/site` 返回 200，并带 `Cache-Control: no-store`。
- `/assets/` 图片返回 200，并带约 30 天缓存。
- 视频 Range 请求返回 `206 Partial Content`，支持分段加载和拖动播放。
- `/favicon.ico` 已部署到线上，当前返回 200。

当前策略合理：

- `/assets/` 可缓存。
- `/api/` 不缓存。
- 页面和后台仍由 Node 处理，避免后台保存后前台拿到旧 API 数据。
- 视频支持 Range。

暂不建议为了清理重复响应头而立即改 Nginx。若后续要改，必须先备份配置、执行 `nginx -t`，通过后再 reload。

## favicon 状态

本地已新增：

```text
public/favicon.ico
```

当前 `public/favicon.ico` 已部署到 VPS，浏览器请求 `/favicon.ico` 返回 200。若后续迁移后再次出现 404，检查 Nginx 是否把根路径请求正确转发给 Node，或是否需要单独添加：

```nginx
location = /favicon.ico {
    root /var/www/basketball-team-website/public;
    access_log off;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
}
```

## HTTPS 和域名

截至本记录，项目仍通过 IP 访问：

```text
http://43.129.197.63
```

暂未绑定域名，因此不强行配置 HTTPS。等域名或学院二级域名到位后，再配置：

1. 域名 A 记录指向 `43.129.197.63`。
2. 修改 Nginx `server_name`。
3. 使用 `certbot --nginx` 申请 HTTPS。
4. 执行 `certbot renew --dry-run` 验证自动续期。

## 后续维护注意事项

- 线上 `data/site-data.json` 是真实运行时数据，不要用本地 seed 覆盖。
- 视频文件不进 Git，迁移服务器时必须单独迁移。
- 新增大视频前先压缩成网页播放版，避免香港 VPS 带宽被单个视频占满。
- 修改 Nginx 前必须备份原配置，并在 `nginx -t` 通过后 reload。
- 更换后台密码或 `SESSION_SECRET` 只改服务器环境变量，不写入 Git。
