import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("homepage visual contract includes full-screen hero and motion treatments", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");

  assert.match(css, /\.hero\s*{[^}]*min-height:\s*100svh/s);
  assert.match(css, /\.hero\s*{[^}]*margin-top:\s*-\d+px/s);
  assert.match(css, /\.player-card:hover/s);
  assert.match(css, /@keyframes\s+slideUpFade/s);
  assert.match(css, /\.motion-slide/s);
  assert.match(css, /\.motion-slide\.is-visible/s);
  assert.match(css, /font-family:\s*var\(--font-display\)/s);
  assert.match(css, /\.motto-watermark/s);
  assert.match(css, /@keyframes\s+mottoFloat/s);
  assert.match(css, /\.motto-watermark\s*{[^}]*right:\s*clamp\(18px,\s*3vw,\s*64px\)/s);
  assert.match(css, /\.motto-watermark\s*{[^}]*width:\s*min\(44vw,\s*640px\)/s);
  assert.match(css, /\.motto-watermark\s*{[^}]*opacity:\s*0\.82/s);
  assert.match(css, /\.motto-line\s*{[^}]*white-space:\s*nowrap/s);
  assert.match(css, /\.motto-line\s*{[^}]*font-size:\s*clamp\(42px,\s*5\.4vw,\s*104px\)/s);
  assert.match(css, /\.motto-line\s*{[^}]*color:\s*rgba\(255,\s*255,\s*255,\s*0\.24\)/s);
  assert.match(css, /\.motto-line:first-child\s*{[^}]*text-align:\s*left/s);
  assert.match(css, /\.motto-line:last-child\s*{[^}]*text-align:\s*right/s);
  assert.match(css, /-webkit-text-stroke:\s*2px\s*rgba\(218,\s*206,\s*255,\s*0\.72\)/);
  assert.match(css, /\.hero h1\s*{[^}]*font-size:\s*clamp\(42px,\s*6\.2vw,\s*92px\)/s);
  assert.match(css, /\.hero h1\s*{[^}]*max-width:\s*760px/s);
  assert.match(js, /class="motto-watermark"/);
  assert.match(js, /class="motto-line"/);
  assert.match(js, /无所不能！/);
  assert.match(js, /data\.team\.slogan/);
  assert.doesNotMatch(css, /\.slogan-chip/s);
  assert.doesNotMatch(js, /class="slogan-chip"/);
  assert.match(js, /motion-slide/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /style="--delay:/);
});

test("homepage uses the team slogan as a hero declaration", async () => {
  const defaultData = await readFile("server/defaultData.mjs", "utf8");
  const seedData = await readFile("data/site-data.json", "utf8");
  const indexHtml = await readFile("public/index.html", "utf8");

  assert.match(defaultData, /人工智能，无所不能/);
  assert.match(seedData, /人工智能，无所不能/);
  assert.match(defaultData, /人工智能篮球队/);
  assert.match(seedData, /人工智能篮球队/);
  assert.doesNotMatch(defaultData, /name:\s*"学院篮球队"|college:\s*"某某学院"|title:\s*"学院篮球队公布/);
  assert.doesNotMatch(seedData, /"name":\s*"学院篮球队"|"college":\s*"某某学院"|"title":\s*"学院篮球队公布/);
  assert.match(indexHtml, /人工智能篮球队官网/);
});

test("all public content pages use the shared route and card motion system", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");
  const defaultData = await readFile("server/defaultData.mjs", "utf8");
  const seedData = await readFile("data/site-data.json", "utf8");

  assert.match(css, /\.route-view/s);
  assert.match(css, /@keyframes\s+pageEnter/s);
  assert.match(js, /function\s+withMotion/s);
  assert.match(js, /\["home",\s*"首页模块"\]/);
  assert.match(js, /function\s+homeCopy/);
  assert.match(js, /function\s+renderHomeEditor/);
  assert.match(js, /home\.quick\.nextMatchLabel/);
  assert.match(js, /home\.quick\.nextMatchValue/);
  assert.match(js, /home\.quick\.lastMatchValue/);
  assert.match(js, /home\.quick\.trainingValue/);
  assert.match(js, /inputField\("下一场比赛内容",\s*"home\.quick\.nextMatchValue"/);
  assert.match(js, /inputField\("最近赛果内容",\s*"home\.quick\.lastMatchValue"/);
  assert.match(js, /inputField\("训练时间内容",\s*"home\.quick\.trainingValue"/);
  assert.match(js, /home\.stats\.title/);
  assert.match(js, /team\.stats\.\$\{index\}\.value/);
  assert.match(defaultData, /home:\s*\{/);
  assert.match(seedData, /"home":\s*\{/);
  assert.match(js, /function\s+pageCopy/);
  assert.match(js, /pageHero\(copy\.title,\s*copy\.intro,\s*\{\s*eyebrow:\s*copy\.eyebrow\s*\}\)/);
  assert.match(js, /\["pages",\s*"页面文案"\]/);
  assert.match(js, /function\s+renderPagesEditor/);
  assert.doesNotMatch(js, /pageHero\("新闻动态",\s*"比赛战报/);
  assert.match(defaultData, /pages:\s*\{/);
  assert.match(seedData, /"pages":\s*\{/);
  assert.doesNotMatch(js, /<h2>球队数据<\/h2><p>用可读的数据/);
  assert.match(js, /newsCard\(item,\s*index/s);
  assert.match(js, /function\s+newsDetailPage/);
  assert.match(js, /path\.startsWith\("\/news\/"\)/);
  assert.match(js, /href="\$\{newsPath\(item\)\}"/);
  assert.match(js, /data-link>\s*[\s\S]*?<div class="visual"/);
  assert.match(js, /微信公众号原文|公众号原文|查看公众号原文/);
  assert.match(js, /\["wechatUrl",\s*"公众号原文链接"\]/);
  assert.match(js, /playerCard\(player,\s*index/s);
  assert.match(js, /galleryCard\(item,\s*index/s);
  assert.match(js, /sponsorCard\(item,\s*index/s);
});

test("page hero labels and sponsor section copy are editable instead of fixed placeholders", async () => {
  const js = await readFile("public/app.js", "utf8");
  const defaultData = await readFile("server/defaultData.mjs", "utf8");
  const seedData = await readFile("data/site-data.json", "utf8");

  assert.match(js, /eyebrow:\s*copy\.eyebrow/);
  assert.match(js, /inputField\("顶部小字",\s*`pages\.\$\{key\}\.eyebrow`/);
  assert.match(js, /partnerTitle/);
  assert.match(js, /partnerIntro/);
  assert.match(js, /inputField\("合作板块标题",\s*"pages\.sponsors\.partnerTitle"/);
  assert.match(js, /inputField\("合作板块说明",\s*"pages\.sponsors\.partnerIntro"/);
  assert.doesNotMatch(js, /<span class="eyebrow">College Basketball<\/span>/);
  assert.doesNotMatch(js, /首版先展示合作形式/);
  assert.match(defaultData, /eyebrow:\s*""/);
  assert.match(defaultData, /partnerIntro:/);
  assert.match(seedData, /"eyebrow":\s*""/);
  assert.match(seedData, /"partnerIntro":/);
});

test("sponsor cards support editable cover photos with placeholder fallback", async () => {
  const js = await readFile("public/app.js", "utf8");
  const css = await readFile("public/styles.css", "utf8");
  const defaultData = await readFile("server/defaultData.mjs", "utf8");
  const seedData = await readFile("data/site-data.json", "utf8");

  assert.match(js, /\["cover",\s*"封面照片地址"\]/);
  assert.match(js, /function\s+sponsorVisual\(item\)/);
  assert.match(js, /mediaPath\(item\.cover\)/);
  assert.match(js, /cover\s*\?/);
  assert.match(js, /class="visual sponsor-cover"/);
  assert.match(js, /alt="\$\{escapeHtml\(item\.name\)\}/);
  assert.match(js, /sponsorVisual\(item\)/);
  assert.match(css, /\.sponsor-cover/s);
  assert.match(defaultData, /cover:\s*""/);
  assert.match(seedData, /"cover":\s*""/);
});

test("sponsor cards link to editable partner detail pages", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");
  const defaultData = await readFile("server/defaultData.mjs", "utf8");
  const seedData = await readFile("data/site-data.json", "utf8");

  assert.match(js, /\["detailTitle",\s*"详情标题"\]/);
  assert.match(js, /\["detail",\s*"详细介绍",\s*"textarea"\]/);
  assert.match(js, /\["cooperation",\s*"合作内容",\s*"textarea"\]/);
  assert.match(js, /\["contact",\s*"联系方式"\]/);
  assert.match(js, /\["website",\s*"官网或外部链接"\]/);
  assert.match(js, /function\s+sponsorPath\(item\)/);
  assert.match(js, /function\s+sponsorDetailPage\(sponsor\)/);
  assert.match(js, /href="\$\{sponsorPath\(item\)\}"/);
  assert.match(js, /path\.startsWith\("\/sponsors\/"\)/);
  assert.match(js, /decodeURIComponent\(path\.replace\("\/sponsors\/",\s*""\)\)/);
  assert.match(css, /\.sponsor-detail/s);
  assert.match(css, /\.sponsor-detail-layout/s);
  assert.match(defaultData, /detailTitle:\s*"/);
  assert.match(defaultData, /cooperation:\s*"/);
  assert.match(seedData, /"detailTitle":\s*"/);
  assert.match(seedData, /"cooperation":\s*"/);
});

test("admin media fields can upload files and auto-fill asset paths", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");

  assert.match(js, /function\s+isMediaField\(label,\s*type\)/);
  assert.match(js, /data-upload-field="\$\{path\}"/);
  assert.match(js, /data-upload-context="\$\{uploadContextForPath\(path\)\}"/);
  assert.match(js, /function\s+uploadContextForPath\(path\)/);
  assert.match(js, /async\s+function\s+uploadAdminFile\(input\)/);
  assert.match(js, /\/api\/admin\/upload\?context=/);
  assert.match(js, /FormData/);
  assert.match(js, /setByPath\(state\.adminDraft,\s*path,\s*payload\.path\)/);
  assert.match(js, /setByPath\(state\.adminDraft,\s*listPath,/);
  assert.match(css, /\.upload-row/s);
  assert.match(css, /\.upload-button/s);
});

test("news detail pages render full article content inside the site", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");

  assert.match(js, /function\s+newsPath\(item\)/);
  assert.match(js, /decodeURIComponent/);
  assert.match(js, /news\.body/);
  assert.match(js, /class="news-article"/);
  assert.match(js, /class="news-detail-meta"/);
  assert.match(js, /target="_blank"/);
  assert.match(css, /\.news-detail/s);
  assert.match(css, /\.news-article/s);
  assert.match(css, /\.news-card:hover/s);
});

test("news cards show cover images and detail pages support button carousel photos", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");
  const defaultData = await readFile("server/defaultData.mjs", "utf8");
  const seedData = await readFile("data/site-data.json", "utf8");

  assert.match(js, /\["photos",\s*"轮播照片地址，逗号分隔",\s*"list"\]/);
  assert.match(js, /function\s+mediaPath\(value\)/);
  assert.match(js, /\.replaceAll\("\\\\",\s*"\/"\)/);
  assert.match(js, /function\s+newsCardVisual\(item\)/);
  assert.match(js, /class="visual news-cover-visual"/);
  assert.match(js, /newsCardVisual\(item\)/);
  assert.match(js, /function\s+newsImages\(news\)/);
  assert.match(js, /function\s+newsMediaCarousel\(news\)/);
  assert.match(js, /class="news-carousel"/);
  assert.match(js, /class="news-slide"/);
  assert.match(js, /class="news-slide active"/);
  assert.match(js, /data-news-carousel-prev/);
  assert.match(js, /data-news-carousel-next/);
  assert.match(js, /function\s+moveNewsCarousel\(direction\)/);
  assert.match(css, /\.news-cover-visual/s);
  assert.match(css, /\.news-carousel/s);
  assert.doesNotMatch(css, /scroll-snap-type:\s*x\s+mandatory/s);
  assert.match(css, /\.news-slide\.active/s);
  assert.match(css, /\.news-carousel-button/s);
  assert.match(defaultData, /photos:\s*\[\]/);
  assert.match(seedData, /"photos":\s*\[/);
});

test("news card grids keep cards equal height despite uneven text", async () => {
  const css = await readFile("public/styles.css", "utf8");

  assert.match(css, /\.grid\s*>\s*\.motion-slide\s*{[^}]*height:\s*100%/s);
  assert.match(css, /\.news-card\s*{[^}]*height:\s*100%/s);
  assert.match(css, /\.news-card\s*{[^}]*display:\s*flex/s);
  assert.match(css, /\.news-card\s*{[^}]*flex-direction:\s*column/s);
  assert.match(css, /\.news-body\s*{[^}]*flex:\s*1/s);
  assert.match(css, /\.news-body\s*{[^}]*display:\s*flex/s);
  assert.match(css, /\.news-body\s*{[^}]*flex-direction:\s*column/s);
});

test("gallery is organized into four clickable media sections with detail pages", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");
  const highlightPhotos = await Promise.all(
    Array.from({ length: 38 }, (_, index) => stat(`public/assets/gallery/highlights/photos/highlight-photo-${index + 1}.webp`))
  );
  const highlightVideos = await Promise.all(
    Array.from({ length: 14 }, (_, index) => stat(`public/assets/gallery/highlights/videos/highlight-video-${index + 1}.mp4`))
  );
  const teamPhotos = await Promise.all(
    [1, 2, 3, 4, 5, 6].map((index) => stat(`public/assets/gallery/team-photos/team-photo-${index}.webp`))
  );
  const trainingVideo = await stat("public/assets/gallery/training/training-video-1.mp4");
  const trainingPhotos = await Promise.all(
    [1, 2, 3, 4, 5, 6].map((index) => stat(`public/assets/gallery/training/training-photo-${index}.webp`))
  );
  const lifeVideo = await stat("public/assets/gallery/life/life-video-1.mp4");
  const lifePhotos = await Promise.all(
    [1, 2, 3, 4, 5, 6].map((index) => stat(`public/assets/gallery/life/life-photo-${index}.webp`))
  );

  assert.match(js, /const gallerySections = \[/);
  assert.match(js, /const gallerySubsections = /);
  assert.match(js, /cover:\s*"\/assets\/gallery\/highlights\/photos\/highlight-photo-1\.webp"/);
  assert.match(js, /cover:\s*"\/assets\/gallery\/team-photos\/team-photo-1\.webp"/);
  assert.match(js, /cover:\s*"\/assets\/gallery\/training\/training-photo-1\.webp"/);
  assert.match(js, /cover:\s*"\/assets\/gallery\/life\/life-photo-6\.webp"/);
  assert.match(js, /title:\s*"比赛照片"[\s\S]*?cover:\s*"\/assets\/gallery\/highlights\/photos\/highlight-photo-1\.webp"/);
  assert.match(js, /title:\s*"比赛视频"[\s\S]*?cover:\s*"\/assets\/gallery\/highlights\/videos\/highlight-video-1\.mp4"/);
  assert.match(js, /比赛集锦/);
  assert.match(js, /比赛照片/);
  assert.match(js, /比赛视频/);
  assert.match(js, /赛后合照/);
  assert.match(js, /日常训练/);
  assert.match(js, /球队生活/);
  assert.match(js, /function\s+gallerySubsectionPage/);
  assert.match(js, /function\s+gallerySectionPage/);
  assert.match(js, /\/gallery\/highlights/);
  assert.match(js, /\/gallery\/highlights\/photos/);
  assert.match(js, /\/gallery\/highlights\/videos/);
  assert.match(js, /\/gallery\/team-photos/);
  assert.match(js, /\/gallery\/training/);
  assert.match(js, /\/gallery\/life/);
  assert.match(js, /path\.startsWith\("\/gallery\/"\)/);
  assert.match(js, /<video/);
  assert.match(js, /gallerySectionCover/);
  const galleryCardBody = js.match(/function galleryCard\(item, index = 0\) \{[\s\S]*?\n\}/)?.[0] || "";
  assert.doesNotMatch(galleryCardBody, /formatDate\(item\.date\)/);
  assert.ok(highlightPhotos.every((item) => item.size > 10000));
  assert.ok(highlightVideos.every((item) => item.size > 100000));
  assert.ok(teamPhotos.every((item) => item.size > 10000));
  assert.ok(trainingVideo.size > 100000);
  assert.ok(trainingPhotos.every((item) => item.size > 10000));
  assert.ok(lifeVideo.size > 100000);
  assert.ok(lifePhotos.every((item) => item.size > 10000));
  assert.match(css, /\.gallery-section-card/s);
  assert.match(css, /\.gallery-section-visual/s);
  assert.match(css, /\.gallery-section-visual img/s);
  assert.match(css, /\.gallery-section-visual video/s);
  assert.match(css, /\.gallery-media/s);
});

test("player cards can render real player photos with number overlays", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");
  const playerNumbers = ["24", "71", "10", "2", "3", "16", "17", "7", "21", "12", "9", "1", "8", "35"];
  const photos = await Promise.all(playerNumbers.map((number) => stat(`public/assets/players/player-${number}.webp`)));

  assert.equal(photos.length, 14);
  assert.ok(photos.every((photo) => photo.size > 10000));
  assert.match(js, /player\.photo/);
  assert.match(js, /player\.photoFocus/);
  assert.match(js, /--player-photo-position/);
  assert.match(js, /--player-photo-scale/);
  assert.match(js, /player-photo/);
  assert.match(js, /loading="lazy"/);
  assert.match(css, /\.player-photo\s*{/s);
  assert.match(css, /\.player-photo img\s*{/s);
  assert.match(css, /\.player-photo img\s*{[^}]*object-position:\s*var\(--player-photo-position,\s*center 34%\)/s);
  assert.match(css, /\.player-photo img\s*{[^}]*transform:\s*scale\(var\(--player-photo-scale,\s*1\.08\)\)/s);
  assert.match(css, /\.player-photo::before\s*{/s);
  assert.match(css, /\.player-number/s);
});

test("homepage player spotlight uses the requested three players", async () => {
  const defaultData = await import("../server/defaultData.mjs");
  const data = defaultData.createDefaultSiteData();

  assert.deepEqual(
    data.players.slice(0, 3).map((player) => `${player.number}-${player.name}`),
    ["24-康泽宇", "71-唐麒盛", "10-张柯鑫"]
  );
});

test("player roster cards link to editable player detail pages with style radar", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");
  const defaultData = await import("../server/defaultData.mjs");
  const data = defaultData.createDefaultSiteData();
  const firstPlayer = data.players[0];

  assert.equal(firstPlayer.id, "player-24-kang-zeyu");
  assert.equal(firstPlayer.detailTitle, "赛场档案");
  assert.match(firstPlayer.detail, /康泽宇/);
  assert.equal(firstPlayer.shooting, "88");
  assert.equal(firstPlayer.playmaking, "86");
  assert.match(js, /function\s+playerPath\(player\)/);
  assert.match(js, /function\s+playerDetailPage\(player\)/);
  assert.match(js, /path\.startsWith\("\/roster\/"\)/);
  assert.match(js, /href="\$\{playerPath\(player\)\}"/);
  assert.match(js, /class="player-detail-layout"/);
  assert.match(js, /function\s+playerRadar/);
  assert.match(js, /class="player-radar"/);
  assert.match(js, /\["detailTitle",\s*"详情标题"\]/);
  assert.match(js, /\["detail",\s*"详细介绍",\s*"textarea"\]/);
  assert.match(js, /\["shooting",\s*"投篮 0-100"\]/);
  assert.match(js, /\["playmaking",\s*"组织 0-100"\]/);
  assert.match(css, /\.player-card-link/s);
  assert.match(css, /\.player-detail-layout/s);
  assert.match(css, /\.player-detail-photo/s);
  assert.match(css, /\.player-detail-photo\s*{[^}]*display:\s*grid/s);
  assert.match(css, /\.player-detail-photo \.visual\s*{[^}]*height:\s*100%/s);
  assert.match(css, /\.player-detail-photo \.visual\s*{[^}]*min-height:\s*clamp\(640px,\s*72vw,\s*920px\)/s);
  assert.match(js, /photoFocus\.detailPosition/);
  assert.match(js, /photoFocus\.detailScale/);
  assert.match(css, /\.player-radar/s);
});

test("specific player detail photos use corrected subject focus", async () => {
  const defaultData = await import("../server/defaultData.mjs");
  const seedData = JSON.parse(await readFile("data/site-data.json", "utf8"));

  for (const source of [defaultData.createDefaultSiteData(), seedData]) {
    const player9 = source.players.find((player) => player.number === "9");
    const player1 = source.players.find((player) => player.number === "1");

    assert.equal(player9.photoFocus.detailPosition, "72% 52%");
    assert.equal(player9.photoFocus.detailScale, "1.22");
    assert.equal(player1.photoFocus.detailPosition, "36% 50%");
    assert.equal(player1.photoFocus.detailScale, "1.2");
  }
});

test("every player has editable detail copy and radar values", async () => {
  const defaultData = await import("../server/defaultData.mjs");
  const seedData = JSON.parse(await readFile("data/site-data.json", "utf8"));
  const requiredFields = [
    "detailTitle",
    "detail",
    "courtRole",
    "quote",
    "shooting",
    "breakthrough",
    "defense",
    "rebound",
    "playmaking",
    "stamina"
  ];

  for (const source of [defaultData.createDefaultSiteData(), seedData]) {
    assert.equal(source.players.length, 14);
    for (const player of source.players) {
      for (const field of requiredFields) {
        assert.ok(String(player[field] || "").trim(), `${player.name} should have ${field}`);
      }
      for (const field of requiredFields.slice(4)) {
        const value = Number(player[field]);
        assert.ok(value >= 0 && value <= 100, `${player.name} ${field} should be 0-100`);
      }
    }
  }
});

test("player management supports retirement status and homepage spotlight selection", async () => {
  const js = await readFile("public/app.js", "utf8");
  const css = await readFile("public/styles.css", "utf8");
  const defaultData = await import("../server/defaultData.mjs");
  const seedData = JSON.parse(await readFile("data/site-data.json", "utf8"));

  for (const source of [defaultData.createDefaultSiteData(), seedData]) {
    assert.ok(source.players.every((player) => player.status === "现役"));
    assert.deepEqual(source.home.players.selectedIds, [
      "player-24-kang-zeyu",
      "player-71-tang-qisheng",
      "player-10-zhang-kexin"
    ]);
  }
  assert.match(js, /\["status",\s*"队员状态",\s*"select:现役\|退役"\]/);
  assert.match(js, /function\s+playerStatus\(player\)/);
  assert.match(js, /function\s+selectedHomePlayers\(data,\s*home\)/);
  assert.match(js, /function\s+rosterGroups\(players\)/);
  assert.match(js, /selectedHomePlayers\(data,\s*home\)/);
  assert.match(js, /home\.players\.selectedIds/);
  assert.match(js, /playerSelectField\("首页展示球员 1"/);
  assert.match(js, /现役阵容/);
  assert.match(js, /退役队员/);
  assert.match(js, /class="status-badge retired"/);
  assert.match(css, /\.status-badge\.retired/s);
  assert.match(css, /\.roster-status-section/s);
});

test("site keeps the manually chosen team name", async () => {
  const defaultData = await readFile("server/defaultData.mjs", "utf8");
  const seedData = await readFile("data/site-data.json", "utf8");
  const indexHtml = await readFile("public/index.html", "utf8");
  const js = await readFile("public/app.js", "utf8");

  assert.match(defaultData, /人工智能篮球队/);
  assert.match(seedData, /"name":\s*"人工智能篮球队"/);
  assert.match(indexHtml, /人工智能篮球队官网/);
  assert.match(indexHtml, /<div class="mark">AI<\/div>/);
  assert.match(js, /<span class="brand-mark">AI<\/span>/);
  assert.match(js, /太原理工大学 · 人工智能学院/);
  assert.doesNotMatch(js, />CB</);
  assert.doesNotMatch(js, /深紫主场/);
  assert.doesNotMatch(defaultData, /name:\s*"人工智能学院篮球队"/);
  assert.doesNotMatch(seedData, /"name":\s*"人工智能学院篮球队"/);
});

test("recruitment page has separate player and operation application flows", async () => {
  const js = await readFile("public/app.js", "utf8");
  const css = await readFile("public/styles.css", "utf8");

  assert.match(js, /data-recruitment-form/);
  assert.match(js, /球员报名/);
  assert.match(js, /运营报名/);
  assert.match(js, /applicationTypeButton\("player"/);
  assert.match(js, /applicationTypeButton\("operation"/);
  assert.match(js, /name="position"/);
  assert.match(js, /name="operationRole"/);
  assert.match(js, /\/api\/applications/);
  assert.match(js, /\["applications",\s*"报名管理"\]/);
  assert.match(js, /function\s+renderApplicationsAdmin/);
  assert.match(js, /\/api\/admin\/applications/);
  assert.doesNotMatch(js, /每周可参加训练时间/);
  assert.doesNotMatch(js, /是否能稳定训练/);
  assert.doesNotMatch(js, /每周可投入时间/);
  assert.match(css, /\.application-form/s);
  assert.match(css, /\.application-type-toggle/s);
  assert.match(css, /\.application-admin-card/s);
});

test("homepage hero does not render the right-side media or next-match panel", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const js = await readFile("public/app.js", "utf8");

  assert.match(css, /\.hero-inner\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*820px\)/s);
  assert.doesNotMatch(js, /function\s+heroMediaRail/s);
  assert.doesNotMatch(js, /media-rail/);
  assert.doesNotMatch(js, /score-tile/);
  assert.doesNotMatch(css, /\.media-rail/s);
  assert.doesNotMatch(css, /@keyframes\s+mediaDrift/s);
});

test("homepage hero blends the real team photo with the purple brand background", async () => {
  const css = await readFile("public/styles.css", "utf8");
  const photo = await stat("public/assets/team-huddle.webp");

  assert.ok(photo.size > 100000);
  assert.match(css, /url\("\/assets\/team-huddle\.webp"\)/);
  assert.match(css, /\.hero\s*{[^}]*background-blend-mode:/s);
  assert.match(css, /rgba\(7, 6, 12, 0\.88\)/);
  assert.match(css, /rgba\(30, 10, 55, 0\.64\)/);
  assert.match(css, /background-blend-mode:\s*normal,\s*screen,\s*screen,\s*soft-light,\s*normal/);
  assert.match(css, /\.hero\s*{[^}]*background-position:/s);
});
