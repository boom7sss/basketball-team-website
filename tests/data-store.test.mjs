import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createDataStore } from "../server/dataStore.mjs";
import { createDefaultSiteData } from "../server/defaultData.mjs";

test("data store initializes with default basketball site content", async () => {
  const dir = await mkdtemp(join(tmpdir(), "team-site-"));
  try {
    const store = createDataStore({
      dataFile: join(dir, "site-data.json"),
      seedData: createDefaultSiteData()
    });

    const data = await store.read();

    assert.equal(data.team.name, "人工智能篮球队");
    assert.equal(data.team.college, "人工智能学院");
    assert.ok(data.matches.length >= 3);
    assert.equal(data.players.length, 14);
    assert.deepEqual(
      data.players.slice(0, 3).map((player) => player.number),
      ["24", "71", "10"]
    );
    assert.deepEqual(
      data.players.map((player) => player.name),
      [
        "康泽宇",
        "唐麒盛",
        "张柯鑫",
        "赵江涛",
        "胡艺翔",
        "刘浩然",
        "房续杰",
        "赵勇斌",
        "李宸宇",
        "王志远",
        "刘文辉",
        "米奕阳",
        "高天麒",
        "张圣柯"
      ]
    );
    assert.ok(data.players.every((player) => player.photo === `/assets/players/player-${player.number}.webp`));
    const focusedPlayers = new Map(data.players.map((player) => [player.number, player.photoFocus]));
    for (const number of ["8", "10", "2", "16", "7"]) {
      assert.ok(focusedPlayers.get(number), `player ${number} should have a custom photo focus`);
      assert.match(focusedPlayers.get(number).position, /^center \d+%$/);
      assert.match(focusedPlayers.get(number).scale, /^1\.\d+$/);
    }
    assert.ok(data.news.length >= 3);
    assert.ok(data.news.every((item) => "wechatUrl" in item));
    assert.equal(data.pages.news.title, "新闻动态");
    assert.equal(data.pages.news.intro, "比赛战报、训练日常、招新公告和团队故事。");
    assert.equal(data.home.quick.nextMatchLabel, "下一场比赛");
    assert.equal(data.home.quick.lastMatchLabel, "最近赛果");
    assert.equal(data.home.quick.trainingLabel, "训练时间");
    assert.equal(data.home.quick.nextMatchValue, "2026.06.08 vs 信息学院");
    assert.equal(data.home.quick.lastMatchValue, "78 : 64 机械学院");
    assert.equal(data.home.quick.trainingValue, "周二 19:00-21:00 综合体育馆");
    assert.equal(data.home.stats.title, "球队数据");
    assert.equal(data.home.stats.actionLabel, "了解球队");
    assert.equal(data.home.news.title, "近期动态");
    assert.equal(data.home.players.title, "队员风采");
    assert.deepEqual(
      Object.keys(data.pages),
      ["team", "matches", "news", "roster", "gallery", "sponsors", "contact"]
    );
    assert.deepEqual(
      [...new Set(data.gallery.map((item) => item.category))],
      ["比赛集锦", "赛后合照", "日常训练", "球队生活"]
    );
    assert.ok(data.gallery.length >= 8);
    const highlightPhotos = data.gallery.filter((item) => item.category === "比赛集锦" && item.kind === "photo");
    const highlightVideos = data.gallery.filter((item) => item.category === "比赛集锦" && item.kind === "video");
    assert.equal(highlightPhotos.length, 38);
    assert.equal(highlightVideos.length, 14);
    assert.ok(
      highlightPhotos.every((item, index) => item.source === `/assets/gallery/highlights/photos/highlight-photo-${index + 1}.webp`)
    );
    assert.ok(
      highlightVideos.every((item, index) => item.source === `/assets/gallery/highlights/videos/highlight-video-${index + 1}.mp4`)
    );
    const teamPhotos = data.gallery.filter((item) => item.category === "赛后合照");
    assert.equal(teamPhotos.length, 6);
    assert.deepEqual(
      teamPhotos.map((item) => item.title),
      ["赛后合照 1", "赛后合照 2", "赛后合照 3", "赛后合照 4", "赛后合照 5", "赛后合照 6"]
    );
    assert.ok(teamPhotos.every((item, index) => item.source === `/assets/gallery/team-photos/team-photo-${index + 1}.webp`));
    assert.ok(teamPhotos.every((item) => item.kind === "photo"));
    const trainingItems = data.gallery.filter((item) => item.category === "日常训练");
    assert.equal(trainingItems.length, 7);
    assert.deepEqual(
      trainingItems.map((item) => item.title),
      ["日常训练 1", "日常训练 2", "日常训练 3", "日常训练 4", "日常训练 5", "日常训练 6", "日常训练 7"]
    );
    assert.deepEqual(
      trainingItems.map((item) => item.kind),
      ["video", "photo", "photo", "photo", "photo", "photo", "photo"]
    );
    assert.equal(trainingItems[0].source, "/assets/gallery/training/training-video-1.mp4");
    assert.ok(
      trainingItems.slice(1).every((item, index) => item.source === `/assets/gallery/training/training-photo-${index + 1}.webp`)
    );
    const lifeItems = data.gallery.filter((item) => item.category === "球队生活");
    assert.equal(lifeItems.length, 7);
    assert.deepEqual(
      lifeItems.map((item) => item.title),
      ["夜间聚餐", "球队生活 1", "球队生活 2", "球队生活 3", "球队生活 4", "球队生活 5", "球队生活 6"]
    );
    assert.deepEqual(
      lifeItems.map((item) => item.kind),
      ["photo", "video", "photo", "photo", "photo", "photo", "photo"]
    );
    assert.equal(lifeItems[0].source, "/assets/gallery/life/life-photo-6.webp");
    assert.equal(lifeItems[1].source, "/assets/gallery/life/life-video-1.mp4");
    assert.ok(
      lifeItems.slice(2).every((item, index) => item.source === `/assets/gallery/life/life-photo-${index + 1}.webp`)
    );
    assert.ok(data.sponsors.length >= 3);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("data store persists admin updates and returns defensive copies", async () => {
  const dir = await mkdtemp(join(tmpdir(), "team-site-"));
  try {
    const store = createDataStore({
      dataFile: join(dir, "site-data.json"),
      seedData: createDefaultSiteData()
    });
    const original = await store.read();
    original.team.name = "测试篮球队";
    original.news.push({
      id: "news-test",
      title: "新赛季训练开启",
      category: "训练",
      date: "2026-06-01",
      cover: "",
      excerpt: "训练安排发布。",
      body: "每周二、四晚进行训练。"
    });

    await store.write(original);
    const updated = await store.read();
    updated.team.name = "被外部修改";

    const reread = await store.read();

    assert.equal(reread.team.name, "测试篮球队");
    assert.equal(reread.news.at(-1).title, "新赛季训练开启");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
