# 下一届负责人文档导航

这份文档只解决一个问题：文档很多，下一届负责人到底先看哪些、每个文档大概是干什么的。

如果时间很紧，先看“交接必读”。如果只是日常改队员、赛程、新闻、图片，不需要把所有技术文档都读完。

## 交接必读

### `docs/HANDOVER.md`

最终交接总入口。

这里写了网站当前状态、访问地址、后台地址、服务器基本信息、内容维护方式、图片和视频维护方式、备份机制、常见问题和后续 TODO。下一届负责人第一次接手时先看这个。

### `docs/HANDOVER_INFO_TEMPLATE.md`

实际交接时填写的表格。

里面已经预填了网站地址、GitHub 仓库、VPS 信息、部署目录、pm2 服务名、Nginx 配置路径、备份目录等。还需要上一任负责人补充账号持有人、续费时间、负责人联系方式等信息。

注意：不要把真实后台密码、服务器密码、SSH 私钥、`SESSION_SECRET` 写进这个文档，密码只通过可信渠道交接。

### `docs/DOCUMENTS_GUIDE.md`

就是当前这份文档。

用于快速判断每个 Markdown 文档该不该读、什么时候读。

## 日常维护常看

### `docs/CONTENT_MANAGEMENT.md`

后台内容维护说明。

如果你要改队员、赛程、新闻、招新信息、报名记录、图片或视频，主要看这个。它会告诉你后台里每个栏目大概负责什么，以及上传素材后为什么还要点“保存全部”。

### `docs/OPS_COMMANDS.md`

常用运维命令。

如果网站打不开、后台异常、视频不播放，或者需要查看 pm2、Nginx、磁盘、内存、备份文件，就看这个。普通内容负责人不一定要会全部命令，但技术负责人要知道这里有排查顺序。

### `docs/BACKUP_AUTOMATION.md`

自动备份和恢复说明。

如果你要确认自动备份是否正常、手动跑一次备份、查看备份日志、恢复 `site-data.json` 或上传目录，就看这个。交接前后尤其要看一次。

### `docs/DOMAIN_HTTPS_TODO.md`

域名和 HTTPS 后续事项。

当前网站还没有正式域名和 HTTPS。如果以后申请学院二级域名、购买商业域名、配置 HTTPS 证书，就按这个文档操作。

## 技术负责人按需看

### `docs/PROJECT_CONTEXT.md`

项目上下文和代码结构说明。

如果下一届技术负责人要理解前端页面、后端 API、数据文件、后台字段、测试覆盖范围，就看这个。普通内容负责人不用优先读。

### `docs/DEPLOYMENT.md`

通用运行与部署说明。

用于了解本地运行、测试、部署原则、数据上线策略和常见问题。当前服务器已经部署好，所以它更多是后续重新部署或排查时参考。

### `docs/VPS_DEPLOYMENT.md`

VPS 部署教程。

如果以后要重装服务器、换云服务器、从零部署一台新 VPS，就看这个。日常后台维护不用看。

### `docs/HK_VPS_DEPLOYMENT_CHECKLIST.md`

香港 VPS 上线执行清单和验证记录。

它记录了本次正式上线做过哪些事，包括服务器购买、环境安装、pm2、Nginx、视频上传、备份、上线验证等。主要用于追溯“当时是怎么上线的”。

## 专项记录

### `docs/OPTIMIZATION_NOTES.md`

线上优化记录。

记录 favicon 修复、占位文案清理、Nginx 缓存、API 不缓存、视频 Range、自动备份、后台验证等优化收尾情况。一般不用从头读，遇到性能、缓存、视频体验问题时再查。

### `docs/VIDEO_OPTIMIZATION_LOG.md`

视频压缩和切换记录。

记录哪些大视频已经生成 `-web.mp4` 网页播放版、哪些已经切换、原视频是否保留、如何回滚。后续新增或替换大视频时要看。

### `docs/CHANGELOG.md`

历史更新记录。

记录项目重要变更节点。它不是操作手册，只用于了解“以前改过什么”。

## 建议阅读顺序

第一次交接时：

1. `docs/DOCUMENTS_GUIDE.md`
2. `docs/HANDOVER.md`
3. `docs/HANDOVER_INFO_TEMPLATE.md`
4. `docs/CONTENT_MANAGEMENT.md`
5. `docs/BACKUP_AUTOMATION.md`
6. `docs/OPS_COMMANDS.md`

只做日常内容维护时：

1. `docs/HANDOVER.md`
2. `docs/CONTENT_MANAGEMENT.md`

网站出问题时：

1. `docs/OPS_COMMANDS.md`
2. `docs/BACKUP_AUTOMATION.md`
3. `docs/HK_VPS_DEPLOYMENT_CHECKLIST.md`

准备绑定域名或 HTTPS 时：

1. `docs/DOMAIN_HTTPS_TODO.md`
2. `docs/OPS_COMMANDS.md`

准备换服务器或重新部署时：

1. `docs/VPS_DEPLOYMENT.md`
2. `docs/DEPLOYMENT.md`
3. `docs/HK_VPS_DEPLOYMENT_CHECKLIST.md`
4. `docs/BACKUP_AUTOMATION.md`

## 最重要的提醒

不要把下面这些内容写进 GitHub、README 或任何公开文档：

```text
真实后台密码
服务器登录密码
SSH 私钥
SESSION_SECRET
腾讯云账号密码
域名账号密码
data/site-data.json 线上运行时数据
public/assets/uploads 后台上传目录
大视频文件
```

交接时，文档负责说明“在哪里、怎么做、谁负责”；密码和密钥只通过可信渠道单独交接。
