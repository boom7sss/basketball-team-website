# 线上优化记录

更新时间：2026-06-13

本文记录香港 VPS 基础部署完成后的性能、交付和上线观感优化。本文不记录真实 `ADMIN_PASSWORD`、`SESSION_SECRET`、服务器登录密码或 SSH 私钥。

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
- `/favicon.ico` 当前线上仍为 404，待把本次新增文件部署到 VPS 后修复。

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

部署到 VPS 后，浏览器控制台的 `/favicon.ico` 404 应消失。若部署后仍是 404，检查 Nginx 是否把根路径请求正确转发给 Node，或是否需要单独添加：

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
