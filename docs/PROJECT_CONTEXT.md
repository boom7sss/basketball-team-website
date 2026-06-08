# 项目上下文

## 项目定位

这是人工智能篮球队官网的本地首版项目。网站面向学院师生、新队员、球队负责人和潜在赞助方，包含前台展示和简易后台管理。

当前队名为：人工智能篮球队  
所属单位为：太原理工大学 · 人工智能学院

## 技术栈

- 前端：原生 HTML、CSS、JavaScript
- 后端：Node.js 内置 HTTP Server
- 数据：JSON 文件持久化
- 图片处理：sharp
- 测试：Node.js 内置 test runner
- 构建：当前没有前端打包构建步骤

## 目录结构

```text
D:\球队网站
├─ public
│  ├─ index.html          # 前台和后台共用 HTML 入口
│  ├─ app.js              # 前端路由、页面渲染、后台管理界面
│  ├─ styles.css          # 全站样式和响应式布局
│  └─ assets              # 网站实际访问的优化后素材
├─ server
│  ├─ server.mjs          # HTTP 服务、API、静态文件、上传接口
│  ├─ dataStore.mjs       # JSON 数据读写
│  ├─ defaultData.mjs     # 内置兜底默认数据
│  └─ seedData.mjs        # 上线初始数据快照加载
├─ data
│  ├─ site-data.json      # 本地运行时真实数据，后台保存会改这里
│  └─ site-data.seed.json # 上线首版初始内容快照
├─ scripts
│  └─ optimize-existing-assets.mjs # 批量优化 public/assets 图片
├─ tests                  # 自动检查
├─ 球员照片                # 本地原始球员照片素材库，不直接作为网站访问目录
├─ 影像素材                # 本地原始影像素材库，不直接作为网站访问目录
└─ 球队名单.xlsx           # 球队名单原始表格
```

## 前台页面结构

页面由 `public/app.js` 中的前端路由渲染。主要页面包括：

- `/` 首页
- `/team` 球队
- `/matches` 赛程战绩
- `/news` 新闻列表
- `/news/:id` 新闻详情
- `/roster` 队员阵容
- `/roster/:id` 队员详情
- `/gallery` 影像中心
- `/gallery/highlights` 比赛集锦
- `/gallery/highlights/photos` 比赛照片
- `/gallery/highlights/videos` 比赛视频
- `/gallery/team-photos` 赛后合照
- `/gallery/training` 日常训练
- `/gallery/life` 球队生活
- `/recruit` 加入我们
- `/sponsors` 赞助合作
- `/sponsors/:id` 赞助详情
- `/contact` 联系
- `/admin` 后台

## 关键前端位置

- 导航：`public/app.js` 的 `navItems`
- 影像四个大板块：`public/app.js` 的 `gallerySections`
- 比赛集锦下的照片/视频子板块：`public/app.js` 的 `gallerySubsections`
- 后台栏目：`public/app.js` 的 `adminTabs`
- 后台字段配置：`public/app.js` 的 `schemas`
- 首页默认文案兜底：`public/app.js` 的 `homeDefaults`
- 各页面顶部 Hero 文案兜底：`public/app.js` 的 `pageDefinitions`
- 页面渲染函数：`homePage`、`teamPage`、`matchesPage`、`newsPage`、`rosterPage`、`galleryPage`、`recruitPage`、`sponsorsPage`、`contactPage`
- 后台页面：`adminPage`、`renderAdminTab`、`renderCollectionEditor`

## 后端 API

主要接口位于 `server/server.mjs`：

- `GET /api/site`：读取公开网站数据，不包含报名记录
- `POST /api/login`：后台登录
- `GET /api/admin/site`：后台读取全部公开数据
- `PUT /api/admin/site`：后台保存全部公开数据
- `POST /api/admin/upload`：后台上传图片或视频
- `POST /api/applications`：公开提交报名
- `GET /api/admin/applications`：后台查看报名
- `PATCH /api/admin/applications/:id`：后台更新报名状态和备注
- `DELETE /api/admin/applications/:id`：后台删除报名

## 数据文件

当前真实内容保存在：

```text
data/site-data.json
```

上线首版内容快照保存在：

```text
data/site-data.seed.json
```

服务器启动时：

- 如果 `data/site-data.json` 已存在，就读取它。
- 如果不存在，就用 `data/site-data.seed.json` 生成。
- 如果快照也不存在，则回退到 `server/defaultData.mjs`。

这样可以保证上线首版有当前本地内容，同时不覆盖上线后后台继续修改的数据。

## 素材位置

网站实际访问素材在：

```text
public/assets
```

当前图片已经优化为 `.webp`，视频保持 `.mp4`。素材体积大致为：

- 图片：约 22.66MB
- 视频：约 845.35MB

原始素材库在：

```text
球员照片
影像素材
```

这些目录用于本地归档，不建议直接部署到服务器。

## 已知问题和改进建议

1. 视频体积较大  
   当前 `public/assets` 中视频约 845MB。页面使用 `preload="metadata"`，不是完整预加载，但比赛视频页仍会请求视频元信息。后续可改为“封面图 + 点击后加载播放器”，或者为大视频生成 720p/1080p 网页播放版。

2. 部分结构写死在 `public/app.js`  
   `navItems`、`gallerySections`、`gallerySubsections`、`adminTabs`、`pageDefinitions` 仍在组件代码中。普通内容维护不受影响，但如果负责人想调整栏目结构或新增影像分类，需要改代码。建议后续迁移到 `data/site-data.json` 或单独的 `data/navigation.json`、`data/gallery-sections.json`。

3. 后台保存粒度较粗  
   当前后台点击“保存全部”会整体保存公开数据。小团队使用没问题，但多人同时维护时可能覆盖彼此更改。后续可拆成按模块保存。

4. 后台媒体字段仍显示路径  
   已支持上传并自动填路径，但负责人仍能看到 `/assets/...` 地址。后续可改为“上传、预览、删除、排序”的媒体管理界面。

5. 报名通知没有自动推送  
   目前报名数据保存在后台“报名管理”，不会自动发邮件或微信通知。后续如果部署到服务器，可接邮件服务、企业微信机器人或飞书 webhook。

6. 后台登录是单管理员密码  
   当前没有多账号和权限分级。队内小范围维护可用，正式长期运营可增加账号体系。
