const app = document.querySelector("#app");

const fallbackNavigation = [
  { path: "/", label: "首页" },
  { path: "/team", label: "球队" },
  { path: "/matches", label: "赛程战绩" },
  { path: "/news", label: "新闻" },
  { path: "/roster", label: "队员" },
  { path: "/gallery", label: "影像" },
  { path: "/recruit", label: "加入我们" },
  { path: "/sponsors", label: "赞助合作" },
  { path: "/contact", label: "联系" }
];

const fallbackGallerySections = [
  {
    slug: "highlights",
    path: "/gallery/highlights",
    title: "比赛集锦",
    intro: "关键回合、进攻片段和比赛高光。",
    accent: "HIGHLIGHTS",
    cover: "/assets/gallery/highlights/photos/highlight-photo-1.webp"
  },
  {
    slug: "team-photos",
    path: "/gallery/team-photos",
    title: "赛后合照",
    intro: "每一场结束后的队伍合影和纪念瞬间。",
    accent: "TEAM PHOTO",
    cover: "/assets/gallery/team-photos/team-photo-1.webp"
  },
  {
    slug: "training",
    path: "/gallery/training",
    title: "日常训练",
    intro: "投篮、对抗、体能和战术训练记录。",
    accent: "TRAINING",
    cover: "/assets/gallery/training/training-photo-1.webp"
  },
  {
    slug: "life",
    path: "/gallery/life",
    title: "球队生活",
    intro: "场下日常、团建、出行和队伍故事。",
    accent: "LIFE",
    cover: "/assets/gallery/life/life-photo-6.webp"
  }
];

const fallbackGallerySubsections = [
  {
    parent: "比赛集锦",
    parentSlug: "highlights",
    kind: "photo",
    path: "/gallery/highlights/photos",
    title: "比赛照片",
    intro: "比赛现场照片、关键瞬间和场边记录。",
    accent: "PHOTOS",
    cover: "/assets/gallery/highlights/photos/highlight-photo-1.webp"
  },
  {
    parent: "比赛集锦",
    parentSlug: "highlights",
    kind: "video",
    path: "/gallery/highlights/videos",
    title: "比赛视频",
    intro: "比赛片段、进攻回合和短视频素材。",
    accent: "VIDEOS",
    cover: "/assets/gallery/highlights/videos/highlight-video-1.mp4"
  }
];

const adminTabs = [
  ["home", "首页模块"],
  ["team", "球队资料"],
  ["pages", "页面文案"],
  ["matches", "赛程战绩"],
  ["players", "队员阵容"],
  ["news", "新闻动态"],
  ["gallery", "影像中心"],
  ["sponsors", "赞助商"],
  ["recruitment", "招新信息"],
  ["applications", "报名管理"]
];

const pageDefinitionDefaults = [
  ["team", "球队页面", "球队档案", "用团队回应每一次哨声", ""],
  ["matches", "赛程战绩", "赛程与战绩", "未来赛程、历史比分和比赛摘要，让每一次上场都有记录。", ""],
  ["news", "新闻页面", "新闻动态", "比赛战报、训练日常、招新公告和团队故事。", ""],
  ["roster", "队员页面", "队员阵容", "号码、位置、专业和特点共同构成深紫阵容。", ""],
  ["gallery", "影像页面", "影像中心", "比赛、合照、训练和生活分区整理，后续真实照片或视频可以直接归档到对应板块。", ""],
  ["sponsors", "赞助页面", "赞助合作", "把球队影响力、校园曝光和品牌合作放在清晰位置。", ""],
  ["contact", "联系页面", "联系我们", "招新、赛事交流、影像合作和赞助合作都可以从这里开始。", ""]
];

const homeDefaults = {
  quick: {
    nextMatchLabel: "下一场比赛",
    nextMatchValue: "2026.06.08 vs 信息学院",
    lastMatchLabel: "最近赛果",
    lastMatchValue: "78 : 64 机械学院",
    trainingLabel: "训练时间",
    trainingValue: "周二 19:00-21:00 综合体育馆"
  },
  stats: {
    title: "球队数据",
    intro: "用可读的数据让师生和合作伙伴快速理解球队。",
    actionLabel: "了解球队"
  },
  news: {
    title: "近期动态",
    intro: "比赛报道、训练安排和招新通知集中展示。",
    actionLabel: "全部新闻"
  },
  players: {
    title: "队员风采",
    intro: "深紫阵容来自不同年级与专业，因同一个目标站上球场。",
    actionLabel: "查看阵容",
    selectedIds: ["player-24-kang-zeyu", "player-71-tang-qisheng", "player-10-zhang-kexin"]
  }
};

const state = {
  data: null,
  token: localStorage.getItem("teamAdminToken") || "",
  adminDraft: null,
  adminTab: "team",
  applicationType: "player",
  applicationSubmitted: false,
  applications: null,
  applicationsLoading: false,
  message: "",
  error: ""
};

const schemas = {
  matches: [
    ["date", "日期"],
    ["time", "时间"],
    ["opponent", "对手"],
    ["venue", "地点"],
    ["type", "赛事"],
    ["status", "状态 upcoming/finished"],
    ["result", "结果"],
    ["scoreFor", "我方得分"],
    ["scoreAgainst", "对方得分"],
    ["summary", "摘要", "textarea"]
  ],
  players: [
    ["name", "姓名"],
    ["number", "号码"],
    ["status", "队员状态", "select:现役|退役"],
    ["position", "位置"],
    ["grade", "年级"],
    ["major", "专业"],
    ["height", "身高"],
    ["tags", "标签，逗号分隔", "list"],
    ["bio", "简介", "textarea"],
    ["detailTitle", "详情标题"],
    ["detail", "详细介绍", "textarea"],
    ["courtRole", "赛场角色"],
    ["quote", "个人语录"],
    ["shooting", "投篮 0-100"],
    ["breakthrough", "突破 0-100"],
    ["defense", "防守 0-100"],
    ["rebound", "篮板 0-100"],
    ["playmaking", "组织 0-100"],
    ["stamina", "体能 0-100"],
    ["photo", "照片地址"]
  ],
  news: [
    ["title", "标题"],
    ["category", "分类"],
    ["date", "日期"],
    ["cover", "封面地址"],
    ["photos", "轮播照片地址，逗号分隔", "list"],
    ["wechatUrl", "公众号原文链接"],
    ["excerpt", "摘要", "textarea"],
    ["body", "正文", "textarea"]
  ],
  gallery: [
    ["title", "标题"],
    ["category", "分类"],
    ["kind", "类型 photo/video"],
    ["date", "日期"],
    ["source", "素材地址"],
    ["image", "图片地址"],
    ["caption", "说明", "textarea"]
  ],
  sponsors: [
    ["name", "名称"],
    ["level", "级别"],
    ["logo", "Logo 文本或缩写"],
    ["cover", "封面照片地址"],
    ["description", "简介", "textarea"],
    ["detailTitle", "详情标题"],
    ["detail", "详细介绍", "textarea"],
    ["cooperation", "合作内容", "textarea"],
    ["contact", "联系方式"],
    ["website", "官网或外部链接"],
    ["benefits", "权益，逗号分隔", "list"]
  ]
};

const factories = {
  matches: () => ({
    id: crypto.randomUUID(),
    date: "2026-06-01",
    time: "19:00",
    opponent: "新对手",
    venue: "综合体育馆",
    type: "校园联赛",
    status: "upcoming",
    result: "未开赛",
    scoreFor: "",
    scoreAgainst: "",
    summary: "填写比赛摘要。"
  }),
  players: () => ({
    id: crypto.randomUUID(),
    name: "新队员",
    number: "0",
    status: "现役",
    position: "后卫",
    grade: "大一",
    major: "专业",
    height: "180cm",
    tags: ["新队员"],
    bio: "填写队员简介。",
    detailTitle: "赛场档案",
    detail: "填写球员详细介绍。",
    courtRole: "轮换球员",
    quote: "",
    shooting: "70",
    breakthrough: "70",
    defense: "70",
    rebound: "70",
    playmaking: "70",
    stamina: "70",
    photo: ""
  }),
  news: () => ({
    id: crypto.randomUUID(),
    title: "新动态标题",
    category: "公告",
    date: new Date().toISOString().slice(0, 10),
    cover: "",
    photos: [],
    wechatUrl: "",
    excerpt: "填写新闻摘要。",
    body: "填写新闻正文。"
  }),
  gallery: () => ({
    id: crypto.randomUUID(),
    title: "新影像",
    category: "比赛集锦",
    kind: "photo",
    date: new Date().toISOString().slice(0, 10),
    source: "",
    image: "",
    caption: "填写图片说明。"
  }),
  sponsors: () => ({
    id: crypto.randomUUID(),
    name: "新合作伙伴",
    level: "支持单位",
    logo: "SP",
    cover: "",
    description: "填写合作伙伴简介。",
    detailTitle: "合作伙伴档案",
    detail: "填写品牌、校友会或支持单位介绍。",
    cooperation: "填写合作内容、支持项目或展示权益。",
    contact: "",
    website: "",
    benefits: ["官网展示"]
  })
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function pagePath() {
  return window.location.pathname;
}

function formatDate(value) {
  return value ? value.replaceAll("-", ".") : "";
}

function mediaPath(value) {
  return String(value || "").trim().replaceAll("\\", "/");
}

function lineBreakText(value) {
  return String(value || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function applicationSuccessMessage() {
  const contactValue = lineBreakText(state.data?.recruitment?.contactValue);
  const contactText = contactValue || "请加入招新QQ群：待填写，入群备注“姓名+年级+专业”。";
  return `报名已提交成功！\n\n${contactText}\n\n负责人会在后台查看你的报名信息，并在群里通知试训安排。`;
}

function configuredList(value, fallback) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function normalizeNavigationItem(item) {
  if (Array.isArray(item)) {
    return { path: item[0], label: item[1] };
  }
  return item || {};
}

function navigationItems() {
  return configuredList(state.data?.navigation, fallbackNavigation)
    .map(normalizeNavigationItem)
    .filter((item) => item.path && item.label);
}

function gallerySections() {
  return configuredList(state.data?.gallerySections, fallbackGallerySections).filter(
    (item) => item.slug && item.path && item.title
  );
}

function gallerySubsections() {
  return configuredList(state.data?.gallerySubsections, fallbackGallerySubsections).filter(
    (item) => item.path && item.title && item.kind
  );
}

function pageDefinitions() {
  return pageDefinitionDefaults;
}

function formatApplicationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function newsPath(item) {
  return `/news/${encodeURIComponent(item.id)}`;
}

function playerPath(player) {
  return `/roster/${encodeURIComponent(player.id)}`;
}

function sponsorPath(item) {
  return `/sponsors/${encodeURIComponent(item.id)}`;
}

function playerStatus(player) {
  return player.status === "退役" ? "退役" : "现役";
}

function selectedHomePlayers(data, home) {
  const selectedIds = Array.isArray(home.players.selectedIds) ? home.players.selectedIds : [];
  const byId = new Map(data.players.map((player) => [player.id, player]));
  const selected = selectedIds.map((id) => byId.get(id)).filter(Boolean);
  const picked = new Set(selected.map((player) => player.id));
  const fillers = data.players.filter((player) => playerStatus(player) === "现役" && !picked.has(player.id));
  return [...selected, ...fillers].slice(0, 3);
}

function rosterGroups(players) {
  return {
    active: players.filter((player) => playerStatus(player) !== "退役"),
    retired: players.filter((player) => playerStatus(player) === "退役")
  };
}

function getNextMatch(data) {
  return data.matches.find((match) => match.status === "upcoming") || data.matches[0];
}

function getLastMatch(data) {
  return data.matches.find((match) => match.status === "finished") || data.matches.at(-1);
}

function setByPath(target, path, value) {
  const parts = path.split(".");
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    cursor = cursor[parts[index]];
  }
  cursor[parts.at(-1)] = value;
}

function getByPath(target, path) {
  return path.split(".").reduce((cursor, part) => cursor?.[part], target);
}

function withMotion(markup, index = 0) {
  return `<div class="motion-slide" style="--delay: ${index * 90}ms">${markup}</div>`;
}

function layout(content) {
  const current = pagePath();
  return `
    <div class="site-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="/" data-link>
            <span class="brand-mark">AI</span>
            <span class="brand-text">
              <strong>${escapeHtml(state.data.team.name)}</strong>
              <span>太原理工大学 · 人工智能学院</span>
            </span>
          </a>
          <nav class="nav">
            ${navigationItems()
              .map(
                ({ path: href, label }) =>
                  `<a href="${escapeHtml(href)}" class="${current === href ? "active" : ""}" data-link>${escapeHtml(label)}</a>`
              )
              .join("")}
            <a href="/admin" class="admin-link ${current === "/admin" ? "active" : ""}" data-link>后台</a>
          </nav>
        </div>
      </header>
      <div class="route-view">
        ${content}
      </div>
      <footer class="footer">
        <div class="footer-inner">
          <div>
            <strong>${escapeHtml(state.data.team.name)}</strong>
            <p>${escapeHtml(state.data.team.slogan)}</p>
          </div>
          <div>
            ${escapeHtml(state.data.team.contact.email)}<br />
            ${escapeHtml(state.data.team.contact.location)}
          </div>
        </div>
      </footer>
    </div>
  `;
}

function homePage() {
  const { data } = state;
  const next = getNextMatch(data);
  const last = getLastMatch(data);
  const home = homeCopy();
  const nextMatchValue = home.quick.nextMatchValue || `${formatDate(next.date)} vs ${next.opponent}`;
  const lastMatchValue = home.quick.lastMatchValue || `${last.scoreFor || "-"} : ${last.scoreAgainst || "-"} ${last.opponent}`;
  const trainingValue = home.quick.trainingValue || data.team.training[0];
  const mottoLines = heroMottoLines(data.team.slogan);
  return layout(`
    <section class="hero">
      <div class="motto-watermark" aria-hidden="true">
        ${mottoLines}
      </div>
      <div class="hero-inner">
        <div>
          <span class="eyebrow">${escapeHtml(data.team.season)}</span>
          <h1>${escapeHtml(data.team.name)}</h1>
          <p>${escapeHtml(data.team.intro)}</p>
          <div class="hero-actions">
            <a class="btn primary" href="/matches" data-link>查看赛程</a>
            <a class="btn ghost" href="/recruit" data-link>加入我们</a>
          </div>
        </div>
      </div>
    </section>
    <section class="quick-strip">
      <div class="quick-inner">
        <div class="quick-grid">
          <div class="quick-card"><span>${escapeHtml(home.quick.nextMatchLabel)}</span><strong>${escapeHtml(nextMatchValue)}</strong></div>
          <div class="quick-card"><span>${escapeHtml(home.quick.lastMatchLabel)}</span><strong>${escapeHtml(lastMatchValue)}</strong></div>
          <div class="quick-card"><span>${escapeHtml(home.quick.trainingLabel)}</span><strong>${escapeHtml(trainingValue)}</strong></div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div><h2>${escapeHtml(home.stats.title)}</h2><p>${escapeHtml(home.stats.intro)}</p></div>
        <a class="btn soft" href="/team" data-link>${escapeHtml(home.stats.actionLabel)}</a>
      </div>
      <div class="grid four">
        ${data.team.stats.map((stat, index) => withMotion(`<div class="card stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`, index)).join("")}
      </div>
    </section>
    <section class="section compact">
      <div class="section-head"><div><h2>${escapeHtml(home.news.title)}</h2><p>${escapeHtml(home.news.intro)}</p></div><a class="btn dark" href="/news" data-link>${escapeHtml(home.news.actionLabel)}</a></div>
      <div class="grid three">${data.news.slice(0, 3).map((item, index) => newsCard(item, index)).join("")}</div>
    </section>
    <section class="section compact">
      <div class="section-head"><div><h2>${escapeHtml(home.players.title)}</h2><p>${escapeHtml(home.players.intro)}</p></div><a class="btn soft" href="/roster" data-link>${escapeHtml(home.players.actionLabel)}</a></div>
      <div class="grid three">${selectedHomePlayers(data, home).map((player, index) => playerCard(player, index)).join("")}</div>
    </section>
  `);
}

function heroMottoLines(slogan) {
  const fallback = ["人工智能", "无所不能！"];
  const parts = String(slogan || "")
    .split(/[，,]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const lines = parts.length >= 2 ? parts.slice(0, 2) : fallback;
  const lastIndex = lines.length - 1;

  return lines
    .map((line, index) => {
      const text = index === lastIndex && !/[!！]$/.test(line) ? `${line}！` : line;
      return `<span class="motto-line">${escapeHtml(text)}</span>`;
    })
    .join("");
}

function pageHero(title, intro, options = {}) {
  const eyebrow = options.eyebrow || "";
  return `
    <section class="page-hero">
      <div class="section">
        ${eyebrow ? `<span class="eyebrow">${escapeHtml(eyebrow)}</span>` : ""}
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(intro)}</p>
      </div>
    </section>
  `;
}

function homeCopy() {
  return {
    quick: { ...homeDefaults.quick, ...(state.data.home?.quick || {}) },
    stats: { ...homeDefaults.stats, ...(state.data.home?.stats || {}) },
    news: { ...homeDefaults.news, ...(state.data.home?.news || {}) },
    players: { ...homeDefaults.players, ...(state.data.home?.players || {}) }
  };
}

function pageCopy(key, fallbackTitle, fallbackIntro) {
  const copy = state.data.pages?.[key] || {};
  return {
    title: copy.title || fallbackTitle,
    intro: copy.intro || fallbackIntro,
    eyebrow: copy.eyebrow || "",
    partnerTitle: copy.partnerTitle || "合作伙伴",
    partnerIntro: copy.partnerIntro || "",
    partnerActionLabel: copy.partnerActionLabel || "联系合作"
  };
}

function teamPage() {
  const data = state.data;
  const copy = pageCopy("team", "球队档案", data.team.heroNote);
  return layout(`
    ${pageHero(copy.title, copy.intro, { eyebrow: copy.eyebrow })}
    <section class="section">
      <div class="grid two">
        <div class="card pad">
          <h2>关于球队</h2>
          <p class="muted">${escapeHtml(data.team.intro)}</p>
          <div class="tag-row">${data.team.training.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}</div>
        </div>
        <div class="card pad">
          <h2>荣誉墙</h2>
          <div class="timeline">${data.team.honors.map((honor, index) => `<div class="timeline-item card motion-slide" style="--delay: ${index * 90}ms"><div class="timeline-date">HONOR</div><div>${escapeHtml(honor)}</div></div>`).join("")}</div>
        </div>
      </div>
    </section>
  `);
}

function matchesPage() {
  const matches = [...state.data.matches].sort((a, b) => b.date.localeCompare(a.date));
  const copy = pageCopy("matches", "赛程与战绩", "未来赛程、历史比分和比赛摘要，让每一次上场都有记录。");
  return layout(`
    ${pageHero(copy.title, copy.intro, { eyebrow: copy.eyebrow })}
    <section class="section">
      <div class="grid two">${matches.map((match, index) => matchCard(match, index)).join("")}</div>
    </section>
  `);
}

function matchCard(match, index = 0) {
  const score = match.status === "finished" ? `${match.scoreFor} : ${match.scoreAgainst}` : "未开赛";
  return `
    <article class="card match-card motion-slide" style="--delay: ${index * 90}ms">
      <div class="match-top"><span class="pill">${escapeHtml(match.type)}</span><span class="label">${formatDate(match.date)} ${escapeHtml(match.time)}</span></div>
      <div class="score-line"><span>${escapeHtml(state.data.team.name)}</span><span class="score">${escapeHtml(score)}</span><span>${escapeHtml(match.opponent)}</span></div>
      <p class="muted">${escapeHtml(match.venue)} · ${escapeHtml(match.summary)}</p>
    </article>
  `;
}

function newsPage() {
  const copy = pageCopy("news", "新闻动态", "比赛战报、训练日常、招新公告和团队故事。");
  return layout(`
    ${pageHero(copy.title, copy.intro, { eyebrow: copy.eyebrow })}
    <section class="section"><div class="grid three">${state.data.news.map((item, index) => newsCard(item, index)).join("")}</div></section>
  `);
}

function newsCard(item, index = 0) {
  return withMotion(`
    <a class="card news-card" href="${newsPath(item)}" data-link>
      ${newsCardVisual(item)}
      <div class="news-body">
        <span class="label">${formatDate(item.date)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="muted">${escapeHtml(item.excerpt)}</p>
      </div>
    </a>
  `, index);
}

function newsCardVisual(item) {
  const cover = mediaPath(item.cover);
  return cover
    ? `<div class="visual news-cover-visual"><img src="${escapeHtml(cover)}" alt="${escapeHtml(item.title)}" loading="lazy" /><span>${escapeHtml(item.category)}</span></div>`
    : `<div class="visual"><span>${escapeHtml(item.category)}</span></div>`;
}

function newsImages(news) {
  const values = [news.cover, ...(Array.isArray(news.photos) ? news.photos : [])];
  const images = [];
  values.forEach((value) => {
    const path = mediaPath(value);
    if (path && !images.includes(path)) images.push(path);
  });
  return images;
}

function newsMediaCarousel(news) {
  const images = newsImages(news);
  if (!images.length) {
    return `<div class="visual tall"><span>${escapeHtml(news.category)}</span></div>`;
  }
  if (images.length === 1) {
    return `<img class="news-cover" src="${escapeHtml(images[0])}" alt="${escapeHtml(news.title)}">`;
  }
  return `
    <div class="news-carousel" aria-label="${escapeHtml(news.title)}图片轮播" data-news-carousel>
      <div class="news-carousel-track">
        ${images
          .map((src, index) => {
            const className = index === 0 ? `class="news-slide active"` : `class="news-slide"`;
            return `
              <figure ${className} data-news-slide>
                <img src="${escapeHtml(src)}" alt="${escapeHtml(news.title)}图片 ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}" />
              </figure>
            `;
          })
          .join("")}
      </div>
      <button class="news-carousel-button prev" type="button" aria-label="上一张图片" data-news-carousel-prev>‹</button>
      <button class="news-carousel-button next" type="button" aria-label="下一张图片" data-news-carousel-next>›</button>
      <div class="news-carousel-count"><span data-news-carousel-current>1</span> / ${images.length}</div>
    </div>
  `;
}

function moveNewsCarousel(direction) {
  const carousel = document.querySelector("[data-news-carousel]");
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll("[data-news-slide]")];
  if (slides.length <= 1) return;
  const currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("active")));
  const nextIndex = (currentIndex + direction + slides.length) % slides.length;
  slides[currentIndex].classList.remove("active");
  slides[nextIndex].classList.add("active");
  const current = carousel.querySelector("[data-news-carousel-current]");
  if (current) current.textContent = String(nextIndex + 1);
}

function newsDetailPage(news) {
  const paragraphs = String(news.body || news.excerpt || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return layout(`
    ${pageHero(news.title, news.excerpt)}
    <section class="section compact">
      <article class="card news-detail">
        ${newsMediaCarousel(news)}
        <div class="news-detail-body">
          <div class="news-detail-meta">
            <span class="pill">${escapeHtml(news.category)}</span>
            <span class="label">${formatDate(news.date)}</span>
          </div>
          <div class="news-article">
            ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </div>
          <div class="button-row">
            <a class="btn soft" href="/news" data-link>返回新闻列表</a>
            ${news.wechatUrl ? `<a class="btn dark" href="${escapeHtml(news.wechatUrl)}" target="_blank" rel="noopener noreferrer">查看公众号原文</a>` : ""}
          </div>
        </div>
      </article>
    </section>
  `);
}

function rosterPage() {
  const copy = pageCopy("roster", "队员阵容", "号码、位置、专业和特点共同构成深紫阵容。");
  const groups = rosterGroups(state.data.players);
  return layout(`
    ${pageHero(copy.title, copy.intro, { eyebrow: copy.eyebrow })}
    <section class="section roster-status-section">
      <div class="section-head"><div><h2>现役阵容</h2><p>正在参与训练和比赛的队员。</p></div></div>
      <div class="grid three">${groups.active.map((player, index) => playerCard(player, index)).join("")}</div>
    </section>
    ${
      groups.retired.length
        ? `<section class="section compact roster-status-section">
            <div class="section-head"><div><h2>退役队员</h2><p>保留球队历史成员档案。</p></div></div>
            <div class="grid three">${groups.retired.map((player, index) => playerCard(player, index)).join("")}</div>
          </section>`
        : ""
    }
  `);
}

const radarMetrics = [
  ["shooting", "投篮"],
  ["breakthrough", "突破"],
  ["defense", "防守"],
  ["rebound", "篮板"],
  ["playmaking", "组织"],
  ["stamina", "体能"]
];

function radarValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 70;
  return Math.max(0, Math.min(100, number));
}

function radarPoint(index, value, radius = 84, center = 110) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarMetrics.length;
  const distance = (radarValue(value) / 100) * radius;
  const x = center + Math.cos(angle) * distance;
  const y = center + Math.sin(angle) * distance;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

function radarGuidePoints(scale, radius = 84, center = 110) {
  return radarMetrics.map((_, index) => radarPoint(index, scale, radius, center)).join(" ");
}

function playerRadar(player) {
  const points = radarMetrics.map(([key], index) => radarPoint(index, player[key])).join(" ");
  const axis = radarMetrics
    .map(([key, label], index) => {
      const labelPoint = radarPoint(index, 116, 84, 110).split(",");
      return `
        <line x1="110" y1="110" x2="${radarPoint(index, 100).split(",")[0]}" y2="${radarPoint(index, 100).split(",")[1]}" />
        <text x="${labelPoint[0]}" y="${labelPoint[1]}">${escapeHtml(label)} ${radarValue(player[key])}</text>
      `;
    })
    .join("");
  return `
    <div class="player-radar">
      <div class="section-head compact-head">
        <div><h2>球员风格雷达</h2><p>展示特点倾向，不作为绝对能力排名。</p></div>
      </div>
      <svg viewBox="0 0 220 220" role="img" aria-label="${escapeHtml(player.name)}球员风格雷达">
        <polygon class="radar-guide" points="${radarGuidePoints(100)}"></polygon>
        <polygon class="radar-guide" points="${radarGuidePoints(66)}"></polygon>
        <polygon class="radar-guide" points="${radarGuidePoints(33)}"></polygon>
        ${axis}
        <polygon class="radar-shape" points="${points}"></polygon>
      </svg>
    </div>
  `;
}

function playerDetailPage(player) {
  const detail = player.detail || player.bio;
  const photoFocus = player.photoFocus || {};
  const photoStyle = player.photo
    ? ` style="--player-photo-position: ${escapeHtml(photoFocus.detailPosition || photoFocus.position || "center 52%")}; --player-photo-scale: ${escapeHtml(photoFocus.detailScale || photoFocus.scale || "1.18")};"`
    : "";
  return layout(`
    ${pageHero(`#${player.number} ${player.name}`, `${player.position} · ${player.height} · ${player.grade} · ${player.major}`)}
    <section class="section compact">
      <div class="player-detail-layout">
        <div class="card player-detail-photo">
          <div class="visual tall player-photo"${photoStyle}>
            ${player.photo ? `<img src="${escapeHtml(player.photo)}" alt="${escapeHtml(player.name)}" />` : ""}
            <span class="player-number">#${escapeHtml(player.number)}</span>
          </div>
        </div>
        <article class="card pad player-detail-panel">
          <span class="pill">${escapeHtml(player.courtRole || player.position)}</span>
          <h2>${escapeHtml(player.detailTitle || "赛场档案")}</h2>
          <p class="muted">${escapeHtml(player.position)} · ${escapeHtml(player.height)} · ${escapeHtml(player.grade)} · ${escapeHtml(player.major)}</p>
          <p>${escapeHtml(detail)}</p>
          ${player.quote ? `<blockquote>${escapeHtml(player.quote)}</blockquote>` : ""}
          <div class="tag-row">${player.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
          ${playerRadar(player)}
          <div class="button-row"><a class="btn soft" href="/roster" data-link>返回队员阵容</a></div>
        </article>
      </div>
    </section>
  `);
}

function playerCard(player, index = 0) {
  const photoFocus = player.photoFocus || {};
  const status = playerStatus(player);
  const photoStyle = player.photo
    ? ` style="--player-photo-position: ${escapeHtml(photoFocus.position || "center 34%")}; --player-photo-scale: ${escapeHtml(photoFocus.scale || "1.08")}"`
    : "";
  const photoMarkup = player.photo
    ? `<img src="${escapeHtml(player.photo)}" alt="${escapeHtml(player.name)}" loading="lazy" />`
    : "";
  const photoClass = player.photo ? " player-photo" : "";
  return withMotion(`
    <a class="card player-card player-card-link" href="${playerPath(player)}" data-link>
      ${status === "退役" ? `<span class="status-badge retired">退役</span>` : ""}
      <div class="visual tall${photoClass}"${photoStyle}>
        ${photoMarkup}
        <span class="player-number">#${escapeHtml(player.number)}</span>
      </div>
      <div class="player-body">
        <span class="label">${escapeHtml(player.position)} · ${escapeHtml(player.height)}</span>
        <h3>${escapeHtml(player.name)}</h3>
        <p class="muted">${escapeHtml(player.grade)} · ${escapeHtml(player.major)}</p>
        <p>${escapeHtml(player.bio)}</p>
        <div class="tag-row">${player.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}</div>
      </div>
    </a>
  `, index);
}

function galleryPage() {
  const copy = pageCopy("gallery", "影像中心", "比赛、合照、训练和生活分区整理，后续真实照片或视频可以直接归档到对应板块。");
  return layout(`
    ${pageHero(copy.title, copy.intro, { eyebrow: copy.eyebrow })}
    <section class="section">
      <div class="grid two gallery-section-grid">
        ${gallerySections().map((section, index) => gallerySectionCard(section, index)).join("")}
      </div>
    </section>
  `);
}

function gallerySectionPage(section) {
  if (section.slug === "highlights") {
    const subsections = gallerySubsections().filter((item) =>
      item.parentSlug ? item.parentSlug === section.slug : item.parent === section.title
    );
    return layout(`
      ${pageHero(section.title, section.intro)}
      <section class="section">
        <div class="section-head">
          <div><h2>素材类型</h2><p>先按照片和视频分开整理，后续新增比赛素材会归到对应小板块。</p></div>
          <a class="btn soft" href="/gallery" data-link>返回影像中心</a>
        </div>
        <div class="grid two gallery-section-grid">
          ${subsections.map((subsection, index) => gallerySubsectionCard(subsection, index)).join("")}
        </div>
      </section>
    `);
  }
  const items = state.data.gallery.filter((item) => item.category === section.title);
  return layout(`
    ${pageHero(section.title, section.intro)}
    <section class="section compact">
      <div class="section-head">
        <div><h2>具体素材</h2><p>当前已接入球队真实训练、比赛和生活影像，后续新增素材会继续归档在这里。</p></div>
        <a class="btn soft" href="/gallery" data-link>返回影像中心</a>
      </div>
      <div class="grid two">${items.map((item, index) => galleryCard(item, index)).join("")}</div>
    </section>
  `);
}

function gallerySectionCard(section, index = 0) {
  const count = state.data.gallery.filter((item) => item.category === section.title).length;
  return withMotion(`
    <a class="card gallery-section-card" href="${escapeHtml(section.path)}" data-link>
      <div class="gallery-section-visual">
        ${gallerySectionCover(section)}
        <span>${escapeHtml(section.accent)}</span>
      </div>
      <div class="gallery-body">
        <span class="label">${count} 组素材</span>
        <h3>${escapeHtml(section.title)}</h3>
        <p class="muted">${escapeHtml(section.intro)}</p>
      </div>
    </a>
  `, index);
}

function gallerySectionCover(section) {
  if (!section.cover) return "";
  if (/\.(mp4|mov|webm)$/i.test(section.cover)) {
    return `
      <video src="${escapeHtml(section.cover)}" autoplay muted loop playsinline preload="metadata"></video>
    `;
  }
  return `<img src="${escapeHtml(section.cover)}" alt="${escapeHtml(section.title)}" loading="lazy" />`;
}

function gallerySubsectionCard(subsection, index = 0) {
  const count = state.data.gallery.filter((item) => item.category === subsection.parent && item.kind === subsection.kind).length;
  return withMotion(`
    <a class="card gallery-section-card" href="${escapeHtml(subsection.path)}" data-link>
      <div class="gallery-section-visual">
        ${gallerySectionCover(subsection)}
        <span>${escapeHtml(subsection.accent)}</span>
      </div>
      <div class="gallery-body">
        <span class="label">${count} 组素材</span>
        <h3>${escapeHtml(subsection.title)}</h3>
        <p class="muted">${escapeHtml(subsection.intro)}</p>
      </div>
    </a>
  `, index);
}

function gallerySubsectionPage(subsection) {
  const items = state.data.gallery.filter((item) => item.category === subsection.parent && item.kind === subsection.kind);
  return layout(`
    ${pageHero(subsection.title, subsection.intro)}
    <section class="section compact">
      <div class="section-head">
        <div><h2>具体素材</h2><p>当前已接入你文件夹里的比赛${subsection.kind === "video" ? "视频" : "照片"}，后续新增素材会继续放在这里。</p></div>
        <a class="btn soft" href="/gallery/highlights" data-link>返回比赛集锦</a>
      </div>
      <div class="grid two">${items.map((item, index) => galleryCard(item, index)).join("")}</div>
    </section>
  `);
}

function galleryMedia(item) {
  const source = item.source || item.image;
  if (!source) {
    return `<div class="visual tall"><span>${escapeHtml(item.category)}</span></div>`;
  }
  if (item.kind === "video") {
    return `
      <div class="gallery-media video-media">
        <video src="${escapeHtml(source)}" controls preload="metadata"></video>
        <span>${escapeHtml(item.category)}</span>
      </div>
    `;
  }
  return `
    <div class="gallery-media photo-media">
      <img src="${escapeHtml(source)}" alt="${escapeHtml(item.title)}" loading="lazy" />
      <span>${escapeHtml(item.category)}</span>
    </div>
  `;
}

function galleryCard(item, index = 0) {
  return withMotion(`
    <article class="card gallery-card">
      ${galleryMedia(item)}
      <div class="gallery-body">
        <h3>${escapeHtml(item.title)}</h3>
        <p class="muted">${escapeHtml(item.caption)}</p>
      </div>
    </article>
  `, index);
}

function applicationTypeButton(type, label, description) {
  const active = state.applicationType === type;
  return `
    <button class="${active ? "active" : ""}" type="button" data-application-type="${type}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(description)}</span>
    </button>
  `;
}

function commonApplicationFields() {
  return `
    <div class="form-grid">
      <div class="field"><label>姓名</label><input name="name" autocomplete="name" required /></div>
      <div class="field"><label>学号</label><input name="studentId" inputmode="numeric" required /></div>
      <div class="field"><label>年级专业</label><input name="gradeMajor" placeholder="例如：大一 · 人工智能" required /></div>
      <div class="field"><label>联系方式</label><input name="contact" placeholder="手机号或微信号" required /></div>
    </div>
  `;
}

function playerApplicationFields() {
  return `
    <div class="form-grid">
      <div class="field"><label>身高</label><input name="height" placeholder="例如：180cm" required /></div>
      <div class="field"><label>体重（可选）</label><input name="weight" placeholder="例如：70kg" /></div>
      <div class="field">
        <label>场上位置</label>
        <select name="position" required>
          <option value="">请选择</option>
          <option>后卫</option>
          <option>前锋</option>
          <option>中锋</option>
          <option>多位置</option>
        </select>
      </div>
      <div class="field">
        <label>篮球经历</label>
        <select name="experience" required>
          <option value="">请选择</option>
          <option>院队</option>
          <option>班赛</option>
          <option>野球</option>
          <option>零基础</option>
        </select>
      </div>
    </div>
    <div class="field">
      <label>擅长方向</label>
      <div class="choice-grid">
        ${["投篮", "突破", "防守", "篮板", "组织", "体能"].map((item) => `<label><input type="checkbox" name="strengths" value="${item}" /> ${item}</label>`).join("")}
      </div>
    </div>
  `;
}

function operationApplicationFields() {
  return `
    <div class="form-grid">
      <div class="field">
        <label>想加入的方向</label>
        <select name="operationRole" required>
          <option value="">请选择</option>
          <option>摄影</option>
          <option>视频剪辑</option>
          <option>推文运营</option>
          <option>数据记录</option>
          <option>赛事执行</option>
          <option>赞助对接</option>
        </select>
      </div>
      <div class="field"><label>是否有相关经验</label><input name="operationExperience" placeholder="简单写一下经历" required /></div>
      <div class="field full"><label>作品链接（可选）</label><input name="portfolio" placeholder="相册、视频、推文或作品集链接" /></div>
    </div>
  `;
}

function recruitmentApplicationForm() {
  return `
    <form class="card pad application-form" data-recruitment-form>
      <div class="section-head compact-head">
      <div>
          <h2>在线报名</h2>
          <p>选择加入方向，填写后会直接进入后台报名管理。</p>
        </div>
      </div>
      ${state.message ? `<div class="status">${escapeHtml(state.message)}</div>` : ""}
      ${state.error ? `<div class="status error">${escapeHtml(state.error)}</div>` : ""}
      <div class="application-type-toggle">
        ${applicationTypeButton("player", "球员报名", "参加试训，争取进入场上阵容")}
        ${applicationTypeButton("operation", "运营报名", "参与影像、推文、数据和赛事执行")}
      </div>
      <input type="hidden" name="type" value="${escapeHtml(state.applicationType)}" />
      ${commonApplicationFields()}
      ${state.applicationType === "player" ? playerApplicationFields() : operationApplicationFields()}
      <div class="field full"><label>自我介绍 / 想加入的原因</label><textarea name="intro" required placeholder="可以写你的经历、特点、想承担的角色。"></textarea></div>
      <div class="button-row">
        <button class="btn primary" type="submit">提交报名</button>
        <span class="muted">提交后负责人会在后台看到你的信息。</span>
      </div>
    </form>
    ${state.applicationSubmitted ? applicationSuccessDialog() : ""}
  `;
}

function applicationSuccessDialog() {
  return `
    <div class="application-success-overlay" role="alertdialog" aria-modal="true" aria-labelledby="application-success-title">
      <div class="application-success-dialog">
        <span class="application-success-mark">OK</span>
        <h2 id="application-success-title">报名已提交成功</h2>
        <p>${escapeHtml(applicationSuccessMessage())}</p>
        <div class="button-row">
          <button class="btn primary" type="button" data-close-application-success>我知道了</button>
          <a class="btn soft" href="/contact" data-link>查看联系方式</a>
        </div>
      </div>
    </div>
  `;
}

function recruitPage() {
  const recruitment = state.data.recruitment;
  return layout(`
    ${pageHero(recruitment.headline, recruitment.intro)}
    <section class="section application-section">
      ${recruitmentApplicationForm()}
    </section>
    <section class="section">
      <div class="grid two">
        <div class="card pad">
          <h2>试训流程</h2>
          <div class="timeline">
            ${recruitment.steps.map((step, index) => `<div class="timeline-item card motion-slide" style="--delay: ${index * 90}ms"><div class="timeline-date">0${index + 1}</div><div>${escapeHtml(step)}</div></div>`).join("")}
          </div>
        </div>
        <div class="card pad">
          <h2>报名要求</h2>
          <div class="tag-row">${recruitment.requirements.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}</div>
          <div class="requirement-block">
            <h3>球员报名</h3>
            <p class="muted">适合想参加训练和比赛的同学，重点看篮球基础、态度、纪律和专项能力。</p>
          </div>
          <div class="requirement-block">
            <h3>运营报名</h3>
            <p class="muted">适合参与摄影、视频、推文、数据、赛事执行和赞助对接的同学。</p>
          </div>
          <h2>常见问题</h2>
          ${recruitment.faq.map((item) => `<p><strong>${escapeHtml(item.q)}</strong><br><span class="muted">${escapeHtml(item.a)}</span></p>`).join("")}
          <a class="btn dark" href="/contact" data-link>${escapeHtml(recruitment.contactLabel)}</a>
        </div>
      </div>
    </section>
  `);
}

function sponsorsPage() {
  const copy = pageCopy("sponsors", "赞助合作", "把球队影响力、校园曝光和品牌合作放在清晰位置。");
  return layout(`
    ${pageHero(copy.title, copy.intro, { eyebrow: copy.eyebrow })}
    <section class="section">
      <div class="section-head"><div><h2>${escapeHtml(copy.partnerTitle)}</h2>${copy.partnerIntro ? `<p>${escapeHtml(copy.partnerIntro)}</p>` : ""}</div><a class="btn dark" href="/contact" data-link>${escapeHtml(copy.partnerActionLabel)}</a></div>
      <div class="grid three">${state.data.sponsors.map((item, index) => sponsorCard(item, index)).join("")}</div>
    </section>
  `);
}

function sponsorCard(item, index = 0) {
  return withMotion(`
    <a class="card sponsor-card sponsor-card-link" href="${sponsorPath(item)}" data-link>
      ${sponsorVisual(item)}
      <div class="sponsor-body">
        <span class="pill">${escapeHtml(item.level)}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <p class="muted">${escapeHtml(item.description)}</p>
        <div class="tag-row">${item.benefits.map((benefit) => `<span class="pill">${escapeHtml(benefit)}</span>`).join("")}</div>
      </div>
    </a>
  `, index);
}

function sponsorVisual(item) {
  const cover = mediaPath(item.cover);
  return cover
    ? `<div class="visual sponsor-cover"><img src="${escapeHtml(cover)}" alt="${escapeHtml(item.name)}" loading="lazy" /><span>${escapeHtml(item.logo)}</span></div>`
    : `<div class="visual"><span>${escapeHtml(item.logo)}</span></div>`;
}

function sponsorDetailPage(sponsor) {
  const cover = mediaPath(sponsor.cover);
  const details = String(sponsor.detail || sponsor.description || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const cooperation = String(sponsor.cooperation || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return layout(`
    ${pageHero(sponsor.name, sponsor.description)}
    <section class="section compact">
      <article class="card sponsor-detail">
        ${cover ? `<img class="sponsor-detail-cover" src="${escapeHtml(cover)}" alt="${escapeHtml(sponsor.name)}">` : sponsorVisual(sponsor)}
        <div class="sponsor-detail-layout">
          <div class="sponsor-detail-main">
            <span class="pill">${escapeHtml(sponsor.level)}</span>
            <h2>${escapeHtml(sponsor.detailTitle || "合作伙伴档案")}</h2>
            <div class="news-article">
              ${details.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
            ${
              cooperation.length
                ? `<div class="sponsor-detail-section">
                    <h3>合作内容</h3>
                    ${cooperation.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                  </div>`
                : ""
            }
            <div class="tag-row">${sponsor.benefits.map((benefit) => `<span class="pill">${escapeHtml(benefit)}</span>`).join("")}</div>
            <div class="button-row">
              <a class="btn soft" href="/sponsors" data-link>返回赞助合作</a>
              ${sponsor.website ? `<a class="btn dark" href="${escapeHtml(sponsor.website)}" target="_blank" rel="noopener noreferrer">查看外部链接</a>` : ""}
            </div>
          </div>
          <aside class="sponsor-detail-side">
            <strong>${escapeHtml(sponsor.logo)}</strong>
            <h3>${escapeHtml(sponsor.name)}</h3>
            <p>${escapeHtml(sponsor.contact || state.data.team.contact.email)}</p>
          </aside>
        </div>
      </article>
    </section>
  `);
}

function contactPage() {
  const contact = state.data.team.contact;
  const copy = pageCopy("contact", "联系我们", "招新、赛事交流、影像合作和赞助合作都可以从这里开始。");
  return layout(`
    ${pageHero(copy.title, copy.intro, { eyebrow: copy.eyebrow })}
    <section class="section">
      <div class="grid two">
        <div class="card pad"><h2>球队联系</h2><p>联系人：${escapeHtml(contact.name)}</p><p>电话：${escapeHtml(contact.phone)}</p><p>邮箱：${escapeHtml(contact.email)}</p><p>地点：${escapeHtml(contact.location)}</p></div>
        <div class="card pad"><h2>招新咨询</h2><p class="muted">${escapeHtml(state.data.recruitment.contactValue)}</p><div class="button-row"><a class="btn dark" href="/recruit" data-link>查看招新</a><a class="btn soft" href="/sponsors" data-link>赞助合作</a></div></div>
      </div>
    </section>
  `);
}

function loginPage() {
  return `
    <main class="login-panel">
      <form class="login-card" data-login-form>
        <span class="brand-mark">AI</span>
        <h1>球队后台</h1>
        <p class="muted">队内管理员登录后可以维护赛程、新闻、队员、影像和赞助商内容。</p>
        ${state.error ? `<div class="status error">${escapeHtml(state.error)}</div>` : ""}
        <div class="field"><label>后台密码</label><input name="password" type="password" autocomplete="current-password" placeholder="请输入后台密码" /></div>
        <div class="button-row"><button class="btn dark" type="submit">登录后台</button><a class="btn soft" href="/" data-link>返回官网</a></div>
      </form>
    </main>
  `;
}

function adminPage() {
  if (!state.token) return loginPage();
  if (!state.adminDraft) state.adminDraft = clone(state.data);
  return `
    <main class="admin-shell">
      <aside class="admin-side">
        <a class="brand" href="/" data-link><span class="brand-mark">AI</span><span class="brand-text"><strong>球队后台</strong><span>内容管理</span></span></a>
        <nav class="admin-tabs">
          ${adminTabs.map(([key, label]) => `<button class="${state.adminTab === key ? "active" : ""}" data-admin-tab="${key}">${label}</button>`).join("")}
        </nav>
      </aside>
      <section class="admin-main">
        <div class="admin-actions">
          <div><h1>内容管理</h1><p class="muted">修改后点击保存，前台会读取最新内容。</p></div>
          <div class="button-row"><button class="btn primary" data-save-admin>保存全部</button><button class="btn soft" data-logout>退出</button></div>
        </div>
        ${state.message ? `<div class="status">${escapeHtml(state.message)}</div>` : ""}
        ${state.error ? `<div class="status error">${escapeHtml(state.error)}</div>` : ""}
        ${renderAdminTab()}
      </section>
    </main>
  `;
}

function renderAdminTab() {
  if (state.adminTab === "home") return renderHomeEditor();
  if (state.adminTab === "team") return renderTeamEditor();
  if (state.adminTab === "pages") return renderPagesEditor();
  if (state.adminTab === "recruitment") return renderRecruitmentEditor();
  if (state.adminTab === "applications") return renderApplicationsAdmin();
  return renderCollectionEditor(state.adminTab, schemas[state.adminTab]);
}

function ensureDraftHome() {
  if (!state.adminDraft.home) state.adminDraft.home = clone(homeDefaults);
  state.adminDraft.home.quick = { ...homeDefaults.quick, ...(state.adminDraft.home.quick || {}) };
  state.adminDraft.home.stats = { ...homeDefaults.stats, ...(state.adminDraft.home.stats || {}) };
  state.adminDraft.home.news = { ...homeDefaults.news, ...(state.adminDraft.home.news || {}) };
  state.adminDraft.home.players = { ...homeDefaults.players, ...(state.adminDraft.home.players || {}) };
  if (!Array.isArray(state.adminDraft.home.players.selectedIds)) {
    state.adminDraft.home.players.selectedIds = [...homeDefaults.players.selectedIds];
  }
  while (state.adminDraft.home.players.selectedIds.length < 3) {
    state.adminDraft.home.players.selectedIds.push("");
  }
  if (!Array.isArray(state.adminDraft.team.stats)) {
    state.adminDraft.team.stats = [];
  }
}

function renderHomeEditor() {
  ensureDraftHome();
  const { home, team } = state.adminDraft;
  return `
    <div class="admin-card">
      <h2>首页信息卡</h2>
      <p class="muted">这里可以直接修改首页三张黑色信息卡的标题和大字内容。</p>
      <div class="form-grid">
        ${inputField("下一场比赛标题", "home.quick.nextMatchLabel", home.quick.nextMatchLabel)}
        ${inputField("下一场比赛内容", "home.quick.nextMatchValue", home.quick.nextMatchValue)}
        ${inputField("最近赛果标题", "home.quick.lastMatchLabel", home.quick.lastMatchLabel)}
        ${inputField("最近赛果内容", "home.quick.lastMatchValue", home.quick.lastMatchValue)}
        ${inputField("训练时间标题", "home.quick.trainingLabel", home.quick.trainingLabel)}
        ${inputField("训练时间内容", "home.quick.trainingValue", home.quick.trainingValue)}
      </div>
    </div>
    <div class="admin-card">
      <h2>球队数据板块</h2>
      <div class="form-grid">
        ${inputField("板块标题", "home.stats.title", home.stats.title)}
        ${inputField("板块说明", "home.stats.intro", home.stats.intro, "textarea")}
        ${inputField("按钮文字", "home.stats.actionLabel", home.stats.actionLabel)}
      </div>
      <h3>数据卡片</h3>
      <div class="form-grid">
        ${team.stats
          .map(
            (stat, index) => `
              ${inputField(`数据 ${index + 1} 数值`, `team.stats.${index}.value`, stat.value)}
              ${inputField(`数据 ${index + 1} 标签`, `team.stats.${index}.label`, stat.label)}
            `
          )
          .join("")}
      </div>
    </div>
    <div class="admin-card">
      <h2>近期动态板块</h2>
      <div class="form-grid">
        ${inputField("板块标题", "home.news.title", home.news.title)}
        ${inputField("板块说明", "home.news.intro", home.news.intro, "textarea")}
        ${inputField("按钮文字", "home.news.actionLabel", home.news.actionLabel)}
      </div>
    </div>
    <div class="admin-card">
      <h2>队员风采板块</h2>
      <div class="form-grid">
        ${inputField("板块标题", "home.players.title", home.players.title)}
        ${inputField("板块说明", "home.players.intro", home.players.intro, "textarea")}
        ${inputField("按钮文字", "home.players.actionLabel", home.players.actionLabel)}
        ${playerSelectField("首页展示球员 1", "home.players.selectedIds.0", home.players.selectedIds[0] || "")}
        ${playerSelectField("首页展示球员 2", "home.players.selectedIds.1", home.players.selectedIds[1] || "")}
        ${playerSelectField("首页展示球员 3", "home.players.selectedIds.2", home.players.selectedIds[2] || "")}
      </div>
    </div>
  `;
}

function inputField(label, path, value, type = "text") {
  const full = type === "textarea";
  const list = type === "list";
  const selectOptions = type.startsWith("select:") ? type.slice(7).split("|") : null;
  const display = Array.isArray(value) ? value.join("，") : value || "";
  const attr = list ? "data-admin-list" : "data-admin-path";
  const baseControl =
    selectOptions
      ? `<select data-admin-path="${path}">${selectOptions.map((option) => `<option value="${escapeHtml(option)}" ${display === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`
      : type === "textarea"
      ? `<textarea ${attr}="${path}">${escapeHtml(display)}</textarea>`
      : `<input ${attr}="${path}" value="${escapeHtml(display)}" />`;
  const control = isMediaField(label, type)
    ? `<div class="upload-row">${baseControl}<label class="upload-button">上传<input type="file" ${list ? "multiple" : ""} data-upload-field="${path}" data-upload-context="${uploadContextForPath(path)}" ${list ? `data-upload-list="${path}"` : ""} accept="image/*,video/mp4,video/webm,video/quicktime" /></label></div>`
    : baseControl;
  return `<div class="field ${full ? "full" : ""}"><label>${escapeHtml(label)}</label>${control}</div>`;
}

function isMediaField(label, type) {
  return !type.startsWith("select:") && /(?:封面|照片|图片|素材|轮播照片).*地址/.test(label);
}

function uploadContextForPath(path) {
  if (path.startsWith("news.")) return "news";
  if (path.startsWith("players.")) return "players";
  if (path.startsWith("gallery.")) return "gallery";
  if (path.startsWith("sponsors.")) return "sponsors";
  return "general";
}

function playerSelectField(label, path, value) {
  const players = state.adminDraft.players || [];
  return `
    <div class="field">
      <label>${escapeHtml(label)}</label>
      <select data-admin-path="${path}">
        <option value="">自动补位</option>
        ${players
          .map(
            (player) =>
              `<option value="${escapeHtml(player.id)}" ${value === player.id ? "selected" : ""}>#${escapeHtml(player.number)} ${escapeHtml(player.name)}（${escapeHtml(playerStatus(player))}）</option>`
          )
          .join("")}
      </select>
    </div>
  `;
}

function renderTeamEditor() {
  const team = state.adminDraft.team;
  return `
    <div class="admin-card">
      <h2>球队资料</h2>
      <div class="form-grid">
        ${inputField("球队名称", "team.name", team.name)}
        ${inputField("学院名称", "team.college", team.college)}
        ${inputField("赛季", "team.season", team.season)}
        ${inputField("主色", "team.primaryColor", team.primaryColor)}
        ${inputField("口号", "team.slogan", team.slogan)}
        ${inputField("首屏短句", "team.heroNote", team.heroNote)}
        ${inputField("球队简介", "team.intro", team.intro, "textarea")}
        ${inputField("训练安排，逗号分隔", "team.training", team.training, "list")}
        ${inputField("荣誉，逗号分隔", "team.honors", team.honors, "list")}
        ${inputField("联系人", "team.contact.name", team.contact.name)}
        ${inputField("电话", "team.contact.phone", team.contact.phone)}
        ${inputField("邮箱", "team.contact.email", team.contact.email)}
        ${inputField("地点", "team.contact.location", team.contact.location)}
      </div>
    </div>
  `;
}

function ensureDraftPages() {
  if (!state.adminDraft.pages) state.adminDraft.pages = {};
  pageDefinitions().forEach(([key, , title, intro, eyebrow]) => {
    if (!state.adminDraft.pages[key]) {
      state.adminDraft.pages[key] = { title, intro, eyebrow };
    }
    if (typeof state.adminDraft.pages[key].eyebrow !== "string") state.adminDraft.pages[key].eyebrow = eyebrow;
  });
  state.adminDraft.pages.sponsors = {
    partnerTitle: "合作伙伴",
    partnerIntro: "",
    partnerActionLabel: "联系合作",
    ...state.adminDraft.pages.sponsors
  };
}

function renderPagesEditor() {
  ensureDraftPages();
  return `
    <div class="admin-actions"><h2>页面文案</h2><p class="muted">管理各页面顶部的大标题和说明文字。</p></div>
    ${pageDefinitions()
      .map(([key, label]) => {
        const item = state.adminDraft.pages[key];
        return `
          <div class="admin-card">
            <h3>${escapeHtml(label)}</h3>
            <div class="form-grid">
              ${inputField("顶部小字", `pages.${key}.eyebrow`, item.eyebrow)}
              ${inputField("页面标题", `pages.${key}.title`, item.title)}
              ${inputField("页面说明", `pages.${key}.intro`, item.intro, "textarea")}
              ${
                key === "sponsors"
                  ? `
                    ${inputField("合作板块标题", "pages.sponsors.partnerTitle", item.partnerTitle)}
                    ${inputField("合作板块说明", "pages.sponsors.partnerIntro", item.partnerIntro, "textarea")}
                    ${inputField("合作按钮文字", "pages.sponsors.partnerActionLabel", item.partnerActionLabel)}
                  `
                  : ""
              }
            </div>
          </div>
        `;
      })
      .join("")}
  `;
}

function renderRecruitmentEditor() {
  const item = state.adminDraft.recruitment;
  return `
    <div class="admin-card">
      <h2>招新信息</h2>
      <div class="form-grid">
        ${inputField("标题", "recruitment.headline", item.headline)}
        ${inputField("咨询按钮", "recruitment.contactLabel", item.contactLabel)}
        ${inputField("简介", "recruitment.intro", item.intro, "textarea")}
        ${inputField("咨询说明", "recruitment.contactValue", item.contactValue, "textarea")}
        ${inputField("流程，逗号分隔", "recruitment.steps", item.steps, "list")}
        ${inputField("要求，逗号分隔", "recruitment.requirements", item.requirements, "list")}
      </div>
    </div>
    ${item.faq
      .map(
        (faq, index) => `
          <div class="admin-card">
            <div class="admin-actions"><h3>FAQ ${index + 1}</h3><button class="btn soft" data-delete-faq="${index}">删除</button></div>
            <div class="form-grid">
              ${inputField("问题", `recruitment.faq.${index}.q`, faq.q)}
              ${inputField("回答", `recruitment.faq.${index}.a`, faq.a, "textarea")}
            </div>
          </div>
        `
      )
      .join("")}
    <button class="btn dark" data-add-faq>新增 FAQ</button>
  `;
}

const applicationStatuses = ["未联系", "已联系", "参加试训", "进入观察", "已入队", "未通过"];

function applicationTypeName(type) {
  return type === "operation" ? "运营报名" : "球员报名";
}

function applicationMainDetail(item) {
  if (item.type === "operation") {
    return [
      ["方向", item.operationRole],
      ["经验", item.operationExperience],
      ["作品", item.portfolio || "未填写"]
    ];
  }
  return [
    ["位置", item.position],
    ["身高", item.height],
    ["体重", item.weight || "未填写"],
    ["经历", item.experience],
    ["擅长", (item.strengths || []).join("、")]
  ];
}

function renderApplicationsAdmin() {
  if (!state.applications && !state.applicationsLoading) loadAdminApplications();
  const applications = state.applications || [];
  return `
    <div class="admin-actions">
      <div><h2>报名管理</h2><p class="muted">查看球员和运营报名，更新联系状态和负责人备注。</p></div>
      <button class="btn soft" data-refresh-applications>刷新报名</button>
    </div>
    ${state.applicationsLoading ? `<div class="admin-card"><p class="muted">正在读取报名信息...</p></div>` : ""}
    ${!state.applicationsLoading && !applications.length ? `<div class="admin-card"><p class="muted">暂时还没有报名信息。</p></div>` : ""}
    ${applications
      .map((item) => {
        const details = applicationMainDetail(item)
          .map(([label, value]) => `<span><strong>${escapeHtml(label)}：</strong>${escapeHtml(value)}</span>`)
          .join("");
        return `
          <article class="admin-card application-admin-card">
            <div class="application-admin-head">
              <div>
                <span class="pill">${escapeHtml(applicationTypeName(item.type))}</span>
                <h3>${escapeHtml(item.name)}</h3>
                <p class="muted">${escapeHtml(item.gradeMajor)} · ${escapeHtml(item.studentId)}</p>
              </div>
              <button class="btn soft" data-delete-application="${escapeHtml(item.id)}">删除</button>
            </div>
            <div class="application-admin-meta">
              <span><strong>联系方式：</strong>${escapeHtml(item.contact)}</span>
              <span><strong>提交时间：</strong>${escapeHtml(formatApplicationTime(item.createdAt))}</span>
              ${details}
            </div>
            <p>${escapeHtml(item.intro)}</p>
            <div class="form-grid">
              <div class="field">
                <label>处理状态</label>
                <select data-application-status="${escapeHtml(item.id)}">
                  ${applicationStatuses.map((status) => `<option ${item.status === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
                </select>
              </div>
              <div class="field">
                <label>负责人备注</label>
                <input data-application-note="${escapeHtml(item.id)}" value="${escapeHtml(item.note || "")}" placeholder="例如：已约周三试训" />
              </div>
            </div>
            <div class="button-row"><button class="btn dark" data-save-application="${escapeHtml(item.id)}">保存状态</button></div>
          </article>
        `;
      })
      .join("")}
  `;
}

function renderCollectionEditor(collection, schema) {
  const items = state.adminDraft[collection];
  return `
    <div class="admin-actions"><h2>${adminTabs.find(([key]) => key === collection)?.[1]}</h2><button class="btn dark" data-add-item="${collection}">新增</button></div>
    ${items
      .map(
        (item, index) => `
          <div class="admin-card">
            <div class="admin-actions"><strong>${escapeHtml(item.title || item.name || item.opponent || `条目 ${index + 1}`)}</strong><button class="btn soft" data-delete-item="${collection}" data-index="${index}">删除</button></div>
            <div class="form-grid">
              ${schema.map(([key, label, type]) => inputField(label, `${collection}.${index}.${key}`, item[key], type)).join("")}
            </div>
          </div>
        `
      )
      .join("")}
  `;
}

function render() {
  if (!state.data) {
    app.innerHTML = `<main class="loading-screen"><div class="mark">AI</div><p>正在加载球队内容...</p></main>`;
    return;
  }
  const path = pagePath();
  if (path === "/admin") {
    app.innerHTML = adminPage();
    return;
  }
  if (path.startsWith("/gallery/")) {
    const subsection = gallerySubsections().find((item) => item.path === path);
    if (subsection) {
      app.innerHTML = gallerySubsectionPage(subsection);
      prepareMotion();
      return;
    }
    const section = gallerySections().find((item) => item.path === path);
    app.innerHTML = section ? gallerySectionPage(section) : galleryPage();
    prepareMotion();
    return;
  }
  if (path.startsWith("/news/")) {
    const newsId = decodeURIComponent(path.replace("/news/", ""));
    const news = state.data.news.find((item) => item.id === newsId);
    app.innerHTML = news ? newsDetailPage(news) : newsPage();
    prepareMotion();
    return;
  }
  if (path.startsWith("/roster/")) {
    const playerId = decodeURIComponent(path.replace("/roster/", ""));
    const player = state.data.players.find((item) => item.id === playerId);
    app.innerHTML = player ? playerDetailPage(player) : rosterPage();
    prepareMotion();
    return;
  }
  if (path.startsWith("/sponsors/")) {
    const sponsorId = decodeURIComponent(path.replace("/sponsors/", ""));
    const sponsor = state.data.sponsors.find((item) => item.id === sponsorId);
    app.innerHTML = sponsor ? sponsorDetailPage(sponsor) : sponsorsPage();
    prepareMotion();
    return;
  }
  const pages = {
    "/": homePage,
    "/team": teamPage,
    "/matches": matchesPage,
    "/news": newsPage,
    "/roster": rosterPage,
    "/gallery": galleryPage,
    "/recruit": recruitPage,
    "/sponsors": sponsorsPage,
    "/contact": contactPage
  };
  app.innerHTML = (pages[path] || homePage)();
  prepareMotion();
}

function prepareMotion() {
  const items = [...document.querySelectorAll(".motion-slide")];
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((item) => observer.observe(item));
}

async function loadSiteData() {
  const response = await fetch("/api/site");
  state.data = await response.json();
  if (!state.adminDraft) state.adminDraft = clone(state.data);
  render();
}

async function saveAdminData() {
  state.error = "";
  state.message = "";
  const response = await fetch("/api/admin/site", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${state.token}`
    },
    body: JSON.stringify(state.adminDraft)
  });
  const payload = await response.json();
  if (!response.ok) {
    state.error = payload.error || "保存失败";
    render();
    return;
  }
  state.data = payload;
  state.adminDraft = clone(payload);
  state.message = "已保存，前台内容已更新。";
  render();
}

async function submitApplication(form) {
  state.error = "";
  state.message = "";
  state.applicationSubmitted = false;
  const formData = new FormData(form);
  const type = formData.get("type");
  const payload = {
    type,
    name: formData.get("name"),
    studentId: formData.get("studentId"),
    gradeMajor: formData.get("gradeMajor"),
    contact: formData.get("contact"),
    intro: formData.get("intro")
  };
  if (type === "player") {
    payload.height = formData.get("height");
    payload.weight = formData.get("weight");
    payload.position = formData.get("position");
    payload.experience = formData.get("experience");
    payload.strengths = formData.getAll("strengths");
  } else {
    payload.operationRole = formData.get("operationRole");
    payload.operationExperience = formData.get("operationExperience");
    payload.portfolio = formData.get("portfolio");
  }
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok) {
    state.error = result.error || "报名提交失败，请稍后再试。";
    render();
    return;
  }
  form.reset();
  state.message = applicationSuccessMessage();
  state.applicationSubmitted = true;
  state.applications = null;
  render();
}

async function loadAdminApplications() {
  if (!state.token) return;
  state.applicationsLoading = true;
  const response = await fetch("/api/admin/applications", {
    headers: { authorization: `Bearer ${state.token}` }
  });
  const payload = await response.json();
  state.applicationsLoading = false;
  if (!response.ok) {
    state.error = payload.error || "报名信息读取失败";
    state.applications = [];
    render();
    return;
  }
  state.applications = payload;
  render();
}

async function updateApplication(id) {
  const status = document.querySelector(`[data-application-status="${id}"]`)?.value || "";
  const note = document.querySelector(`[data-application-note="${id}"]`)?.value || "";
  const response = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${state.token}`
    },
    body: JSON.stringify({ status, note })
  });
  const payload = await response.json();
  if (!response.ok) {
    state.error = payload.error || "报名状态保存失败";
    render();
    return;
  }
  state.message = "报名状态已更新。";
  state.applications = null;
  render();
}

async function deleteApplication(id) {
  const response = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${state.token}` }
  });
  const payload = await response.json();
  if (!response.ok) {
    state.error = payload.error || "报名记录删除失败";
    render();
    return;
  }
  state.message = "报名记录已删除。";
  state.applications = null;
  render();
}

async function uploadAdminFile(input) {
  const path = input.dataset.uploadField;
  const listPath = input.dataset.uploadList;
  const context = input.dataset.uploadContext || "general";
  const files = [...(input.files || [])];
  if (!state.adminDraft || !path || !files.length) return;
  state.message = "正在上传素材...";
  state.error = "";
  render();
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/admin/upload?context=${encodeURIComponent(context)}`, {
        method: "POST",
        headers: { authorization: `Bearer ${state.token}` },
        body: formData
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "上传失败");
      if (listPath) {
        const current = getByPath(state.adminDraft, listPath);
        const nextList = Array.isArray(current) ? [...current, payload.path] : [payload.path];
        setByPath(state.adminDraft, listPath, nextList);
      } else {
        setByPath(state.adminDraft, path, payload.path);
      }
    }
    state.message = "素材已上传并填入地址，记得点击保存全部。";
  } catch (error) {
    state.error = error.message;
  }
  render();
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-news-carousel-prev]")) {
    moveNewsCarousel(-1);
    return;
  }
  if (event.target.closest("[data-news-carousel-next]")) {
    moveNewsCarousel(1);
    return;
  }
  const link = event.target.closest("a[data-link]");
  if (link) {
    event.preventDefault();
    history.pushState({}, "", link.getAttribute("href"));
    state.message = "";
    state.error = "";
    render();
    return;
  }
  const applicationType = event.target.closest("[data-application-type]");
  if (applicationType) {
    state.applicationType = applicationType.dataset.applicationType;
    state.message = "";
    state.error = "";
    state.applicationSubmitted = false;
    render();
    return;
  }
  if (event.target.closest("[data-close-application-success]")) {
    state.applicationSubmitted = false;
    render();
    return;
  }
  const tab = event.target.closest("[data-admin-tab]");
  if (tab) {
    state.adminTab = tab.dataset.adminTab;
    state.message = "";
    render();
    return;
  }
  const addItem = event.target.closest("[data-add-item]");
  if (addItem) {
    const key = addItem.dataset.addItem;
    state.adminDraft[key].unshift(factories[key]());
    render();
    return;
  }
  const deleteItem = event.target.closest("[data-delete-item]");
  if (deleteItem) {
    state.adminDraft[deleteItem.dataset.deleteItem].splice(Number(deleteItem.dataset.index), 1);
    render();
    return;
  }
  if (event.target.closest("[data-add-faq]")) {
    state.adminDraft.recruitment.faq.push({ q: "新问题", a: "填写回答。" });
    render();
    return;
  }
  const deleteFaq = event.target.closest("[data-delete-faq]");
  if (deleteFaq) {
    state.adminDraft.recruitment.faq.splice(Number(deleteFaq.dataset.deleteFaq), 1);
    render();
    return;
  }
  if (event.target.closest("[data-save-admin]")) {
    saveAdminData();
    return;
  }
  if (event.target.closest("[data-refresh-applications]")) {
    state.applications = null;
    loadAdminApplications();
    return;
  }
  const saveApplication = event.target.closest("[data-save-application]");
  if (saveApplication) {
    updateApplication(saveApplication.dataset.saveApplication);
    return;
  }
  const deleteApplicationButton = event.target.closest("[data-delete-application]");
  if (deleteApplicationButton) {
    deleteApplication(deleteApplicationButton.dataset.deleteApplication);
    return;
  }
  if (event.target.closest("[data-logout]")) {
    localStorage.removeItem("teamAdminToken");
    state.token = "";
    state.adminDraft = clone(state.data);
    state.applications = null;
    render();
  }
});

document.addEventListener("input", (event) => {
  if (!state.adminDraft) return;
  const path = event.target.dataset.adminPath;
  const listPath = event.target.dataset.adminList;
  if (path) setByPath(state.adminDraft, path, event.target.value);
  if (listPath) {
    const values = event.target.value
      .split(/[，,]/)
      .map((item) => item.trim())
      .filter(Boolean);
    setByPath(state.adminDraft, listPath, values);
  }
});

document.addEventListener("change", (event) => {
  const uploadInput = event.target.closest("[data-upload-field]");
  if (uploadInput) {
    uploadAdminFile(uploadInput);
    return;
  }
  if (!state.adminDraft) return;
  const path = event.target.dataset.adminPath;
  if (path) setByPath(state.adminDraft, path, event.target.value);
});

document.addEventListener("submit", async (event) => {
  const recruitmentForm = event.target.closest("[data-recruitment-form]");
  if (recruitmentForm) {
    event.preventDefault();
    submitApplication(recruitmentForm);
    return;
  }
  const form = event.target.closest("[data-login-form]");
  if (!form) return;
  event.preventDefault();
  state.error = "";
  const formData = new FormData(form);
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: formData.get("password") })
  });
  const payload = await response.json();
  if (!response.ok) {
    state.error = payload.error || "登录失败";
    render();
    return;
  }
  state.token = payload.token;
  localStorage.setItem("teamAdminToken", payload.token);
  state.adminDraft = clone(state.data);
  state.applications = null;
  state.message = "已登录。";
  render();
});

window.addEventListener("popstate", render);

loadSiteData().catch((error) => {
  app.innerHTML = `<main class="loading-screen"><div class="mark">AI</div><p>加载失败：${escapeHtml(error.message)}</p></main>`;
});

