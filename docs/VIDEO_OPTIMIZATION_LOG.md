# 视频优化记录

更新时间：2026-06-13

本文记录线上 VPS 中视频压缩、路径切换和回滚方式。本文不记录服务器密码、后台密码或任何密钥。

## 原则

- 不删除原视频。
- 压缩后生成 `-web.mp4` 网页播放版。
- 先人工检查画质，再把 `data/site-data.json` 中对应素材路径切到网页播放版。
- 每次改 `data/site-data.json` 前先备份。
- 切换后验证首页、后台、公开 API 和视频 Range。

## 压缩参数

当前采用：

```bash
ffmpeg -y \
  -i input.mp4 \
  -vf "scale=-2:1080,fps=30" \
  -c:v libx264 \
  -preset medium \
  -crf 24 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac \
  -b:a 128k \
  output-web.mp4
```

含义：

- 输出 1080p。
- 帧率转为 30fps。
- 视频编码转为 H.264，提升网页兼容性。
- 音频转为 AAC 128k。
- `+faststart` 让浏览器更快开始播放。

## 已完成

### 汇总

已切换到网页播放版：

| 视频 | 原体积 | Web 版体积 | 状态 |
| --- | ---: | ---: | --- |
| `highlight-video-2` | 约 55MB | 约 5.1MB | 已切换 |
| `highlight-video-9` | 约 81MB | 约 7.6MB | 已切换 |
| `highlight-video-11` | 约 44MB | 约 3.6MB | 已切换 |
| `highlight-video-12` | 约 213MB | 约 19MB | 已切换 |
| `highlight-video-13` | 约 189MB | 约 18MB | 已切换 |
| `highlight-video-14` | 约 146MB | 约 16MB | 已切换 |

已生成但暂不切换：

```text
public/assets/gallery/highlights/videos/highlight-video-1-web.mp4
```

原因：人工查看后决定 `highlight-video-1.mp4` 继续使用原版。

暂不处理：

```text
highlight-video-3.mp4       约 3.4MB，720p，已较小
highlight-video-4.mp4       约 9.7MB，1080p，暂可接受
highlight-video-5.mp4       约 15MB，1080p，暂可接受
highlight-video-6.mp4       约 1.1MB，竖屏低码率，已较小
highlight-video-7.mp4       约 17MB，1080p H.264，暂可接受
highlight-video-8.mp4       约 17MB，1080p H.264，暂可接受
highlight-video-10.mp4      约 23MB，1080p H.264，暂可接受
life-video-1.mp4            约 14MB，1080p，暂可接受
training-video-1.mp4        约 1.3MB，低分辨率，已较小
```

### highlight-video-2

服务器路径：

```text
原视频：public/assets/gallery/highlights/videos/highlight-video-2.mp4
网页播放版：public/assets/gallery/highlights/videos/highlight-video-2-web.mp4
```

结果：

```text
原视频体积：约 55MB
网页播放版体积：约 5.1MB
公开 API：已切换到 highlight-video-2-web.mp4
原视频：仍保留
```

已验证：

```text
首页：200
后台：200
公开 API 中包含 highlight-video-2-web.mp4
公开 API 中 highlight-video-2.mp4 计数为 0
新视频 Range：206 Partial Content
用户人工查看画质：可接受
```

### highlight-video-9

服务器路径：

```text
原视频：public/assets/gallery/highlights/videos/highlight-video-9.mp4
网页播放版：public/assets/gallery/highlights/videos/highlight-video-9-web.mp4
```

结果：

```text
原视频体积：约 81MB
网页播放版体积：约 7.6MB
公开 API：已切换到 highlight-video-9-web.mp4
原视频：仍保留
```

已验证：

```text
首页：200
后台：200
公开 API 中包含 highlight-video-9-web.mp4
公开 API 中 highlight-video-9.mp4 计数为 0
新视频 Range：206 Partial Content
用户人工查看画质：可接受
```

### highlight-video-11

服务器路径：

```text
原视频：public/assets/gallery/highlights/videos/highlight-video-11.mp4
网页播放版：public/assets/gallery/highlights/videos/highlight-video-11-web.mp4
```

结果：

```text
原视频体积：约 44MB
网页播放版体积：约 3.6MB
分辨率：1920x1080
帧率：30fps
编码：H.264
公开 API：已切换到 highlight-video-11-web.mp4
原视频：仍保留
```

已验证：

```text
首页：200
后台：200
公开 API 中包含 highlight-video-11-web.mp4
公开 API 中 highlight-video-11.mp4 计数为 0
新视频 Range：206 Partial Content
用户人工查看画质：可接受
```

### highlight-video-12

服务器路径：

```text
原视频：public/assets/gallery/highlights/videos/highlight-video-12.mp4
网页播放版：public/assets/gallery/highlights/videos/highlight-video-12-web.mp4
```

结果：

```text
原视频体积：约 213MB
网页播放版体积：约 19MB
分辨率：1920x1080
帧率：30fps
编码：H.264
公开 API：已切换到 highlight-video-12-web.mp4
原视频：仍保留
```

已验证：

```text
首页：200
后台：200
公开 API 中包含 highlight-video-12-web.mp4
公开 API 中 highlight-video-12.mp4 计数为 0
新视频 Range：206 Partial Content
用户人工查看画质：可接受
```

回滚方式：

1. 备份当前 `data/site-data.json`。
2. 把 `/assets/gallery/highlights/videos/highlight-video-12-web.mp4` 改回 `/assets/gallery/highlights/videos/highlight-video-12.mp4`。
3. 校验 JSON。
4. 重启 pm2。
5. 验证公开 API 和视频播放。

### highlight-video-13

服务器路径：

```text
原视频：public/assets/gallery/highlights/videos/highlight-video-13.mp4
网页播放版：public/assets/gallery/highlights/videos/highlight-video-13-web.mp4
```

结果：

```text
原视频体积：约 189MB
网页播放版体积：约 18MB
分辨率：1920x1080
帧率：30fps
编码：H.264
公开 API：已切换到 highlight-video-13-web.mp4
原视频：仍保留
```

已验证：

```text
首页：200
后台：200
公开 API 中包含 highlight-video-13-web.mp4
公开 API 中 highlight-video-13.mp4 计数为 0
新视频 Range：206 Partial Content
用户人工查看画质：可接受
```

### highlight-video-14

服务器路径：

```text
原视频：public/assets/gallery/highlights/videos/highlight-video-14.mp4
网页播放版：public/assets/gallery/highlights/videos/highlight-video-14-web.mp4
```

结果：

```text
原视频体积：约 146MB
网页播放版体积：约 16MB
分辨率：1920x1080
帧率：30fps
编码：H.264
公开 API：已切换到 highlight-video-14-web.mp4
原视频：仍保留
```

已验证：

```text
首页：200
后台：200
公开 API 中包含 highlight-video-14-web.mp4
公开 API 中 highlight-video-14.mp4 计数为 0
新视频 Range：206 Partial Content
用户人工查看画质：可接受
```

## 回滚通用方式

1. 备份当前 `data/site-data.json`。
2. 把对应 `/assets/gallery/highlights/videos/highlight-video-N-web.mp4` 改回 `/assets/gallery/highlights/videos/highlight-video-N.mp4`。
3. 校验 JSON。
4. 重启 pm2。
5. 验证公开 API 和视频播放。

## 常用验证命令

检查视频可访问：

```bash
curl -s -o /dev/null -w "video:%{http_code} %{content_type}\n" \
  http://43.129.197.63/assets/gallery/highlights/videos/highlight-video-12-web.mp4
```

检查 Range：

```bash
curl -s -I -H "Range: bytes=0-1023" \
  http://43.129.197.63/assets/gallery/highlights/videos/highlight-video-12-web.mp4 \
  | grep -Ei "HTTP/|content-range|content-length|accept-ranges"
```

检查公开 API 是否切换：

```bash
curl -s http://43.129.197.63/api/site | grep -o "highlight-video-12-web.mp4" | head -n 1
```
