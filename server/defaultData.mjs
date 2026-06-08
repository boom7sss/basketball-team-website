export function createDefaultSiteData() {
  return {
    team: {
      name: "人工智能篮球队",
      college: "人工智能学院",
      slogan: "人工智能，无所不能",
      season: "2026 校园联赛赛季",
      primaryColor: "#3b146f",
      intro:
        "我们是代表人工智能学院出战的篮球队，连接热爱、训练、比赛和校园荣誉。球队重视纪律、团队和持续成长，也欢迎更多同学、老师和合作伙伴一起见证每一次进攻与防守。",
      heroNote: "用团队回应每一次哨声",
      training: ["周二 19:00-21:00 综合体育馆", "周四 19:00-21:00 综合体育馆", "周六 15:00-17:00 室外篮球场"],
      contact: {
        name: "球队管理组",
        phone: "138-0000-0000",
        email: "basketball@example.edu.cn",
        location: "学院综合体育馆篮球场"
      },
      stats: [
        { label: "现役队员", value: "14" },
        { label: "年度比赛", value: "24" },
        { label: "训练小时", value: "320+" },
        { label: "学院赛事荣誉", value: "9" }
      ],
      honors: [
        "2025 学院杯篮球赛冠军",
        "2025 校园联赛四强",
        "2024 最佳团队精神奖",
        "2024 新生篮球邀请赛亚军"
      ]
    },
    home: {
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
    },
    pages: {
      team: {
        title: "球队档案",
        intro: "用团队回应每一次哨声",
        eyebrow: ""
      },
      matches: {
        title: "赛程与战绩",
        intro: "未来赛程、历史比分和比赛摘要，让每一次上场都有记录。",
        eyebrow: ""
      },
      news: {
        title: "新闻动态",
        intro: "比赛战报、训练日常、招新公告和团队故事。",
        eyebrow: ""
      },
      roster: {
        title: "队员阵容",
        intro: "号码、位置、专业和特点共同构成深紫阵容。",
        eyebrow: ""
      },
      gallery: {
        title: "影像中心",
        intro: "比赛、合照、训练和生活分区整理，后续真实照片或视频可以直接归档到对应板块。",
        eyebrow: ""
      },
      sponsors: {
        title: "赞助合作",
        intro: "把球队影响力、校园曝光和品牌合作放在清晰位置。",
        eyebrow: "",
        partnerTitle: "合作伙伴",
        partnerIntro: "",
        partnerActionLabel: "联系合作"
      },
      contact: {
        title: "联系我们",
        intro: "招新、赛事交流、影像合作和赞助合作都可以从这里开始。",
        eyebrow: ""
      }
    },
    matches: [
      {
        id: "match-1",
        date: "2026-06-08",
        time: "19:30",
        opponent: "信息学院",
        venue: "综合体育馆 A 场",
        type: "校园联赛",
        status: "upcoming",
        result: "未开赛",
        scoreFor: "",
        scoreAgainst: "",
        summary: "小组赛关键战，欢迎师生到场助威。"
      },
      {
        id: "match-2",
        date: "2026-05-28",
        time: "20:00",
        opponent: "机械学院",
        venue: "综合体育馆",
        type: "学院杯",
        status: "finished",
        result: "胜",
        scoreFor: "78",
        scoreAgainst: "64",
        summary: "第三节打出连续反击，最终拿下淘汰赛首胜。"
      },
      {
        id: "match-3",
        date: "2026-05-16",
        time: "18:30",
        opponent: "外国语学院",
        venue: "室外篮球场",
        type: "热身赛",
        status: "finished",
        result: "胜",
        scoreFor: "66",
        scoreAgainst: "58",
        summary: "新队员轮换出场，球队在防守端保持稳定。"
      }
    ],
    players: [
      {
        id: "player-24-kang-zeyu",
        name: "康泽宇",
        number: "24",
        status: "现役",
        position: "后卫",
        grade: "大四",
        major: "生物医学工程",
        height: "177cm",
        tags: ["康师", "节拍器"],
        bio: "外线投射稳定，球队节拍器。",
        detailTitle: "赛场档案",
        detail:
          "康泽宇是球队外线节奏点之一，擅长在转换进攻中快速找到出手机会，也能在阵地战里通过传导和跑位帮球队拉开空间。比赛中他更像稳定器，负责把节奏带回球队熟悉的回合。",
        courtRole: "外线节拍器",
        quote: "把每一次空位投篮都当成训练里的下一球。",
        shooting: "88",
        breakthrough: "74",
        defense: "78",
        rebound: "62",
        playmaking: "86",
        stamina: "80",
        photo: "/assets/players/player-24.webp"
      },
      {
        id: "player-71-tang-qisheng",
        name: "唐麒盛",
        number: "71",
        status: "现役",
        position: "前锋",
        grade: "大四",
        major: "生物医学工程",
        height: "186cm",
        tags: ["iso", "防守大闸"],
        bio: "防守大闸，阵地战单挑硬解。",
        detailTitle: "锋线档案",
        detail:
          "唐麒盛是球队锋线上的硬解点，擅长在阵地战里用身体和节奏创造出手机会。防守端他承担外线换防和锋线对位任务，是球队在关键回合里稳定对抗强度的重要一环。",
        courtRole: "阵地硬解锋线",
        quote: "防守先把气势立住，进攻自然会来。",
        shooting: "76",
        breakthrough: "86",
        defense: "90",
        rebound: "78",
        playmaking: "70",
        stamina: "84",
        photo: "/assets/players/player-71.webp"
      },
      {
        id: "player-10-zhang-kexin",
        name: "张柯鑫",
        number: "10",
        status: "现役",
        position: "后卫",
        grade: "大三",
        major: "人工智能",
        height: "178cm",
        tags: ["科比", "攻防一体"],
        bio: "身体素质炸裂，攻防一体。",
        detailTitle: "攻防档案",
        detail:
          "张柯鑫具备很强的身体冲击力，能够在攻防两端持续给对手压力。进攻端敢于持球攻击和终结，防守端也能用对抗和移动速度影响对方外线节奏。",
        courtRole: "攻防转换后卫",
        quote: "每个回合都要打出侵略性。",
        shooting: "85",
        breakthrough: "88",
        defense: "82",
        rebound: "72",
        playmaking: "78",
        stamina: "90",
        photo: "/assets/players/player-10.webp",
        photoFocus: { position: "center 48%", scale: "1.15" }
      },
      {
        id: "player-2-zhao-jiangtao",
        name: "赵江涛",
        number: "2",
        status: "现役",
        position: "后卫",
        grade: "大三",
        major: "数据科学与大数据技术",
        height: "175cm",
        tags: ["🐱", "小快灵"],
        bio: "快攻发动机，小快灵。",
        detailTitle: "速度档案",
        detail:
          "赵江涛是球队提速时最活跃的后场之一，擅长利用速度和灵活性撕开防线。快攻、反击和弱侧切入是他的主要存在感，也能在轮转中给球队带来突然变化。",
        courtRole: "快攻发动机",
        quote: "只要有空间，就先把速度推起来。",
        shooting: "72",
        breakthrough: "88",
        defense: "76",
        rebound: "58",
        playmaking: "82",
        stamina: "86",
        photo: "/assets/players/player-2.webp",
        photoFocus: { position: "center 54%", scale: "1.16" }
      },
      {
        id: "player-3-hu-yixiang",
        name: "胡艺翔",
        number: "3",
        status: "现役",
        position: "中锋",
        grade: "大四",
        major: "生物医学工程",
        height: "180cm",
        tags: ["胡主席", "球队粘合剂"],
        bio: "专业篮下卡板，挡拆，球队粘合剂。",
        detailTitle: "内线档案",
        detail:
          "胡艺翔是球队内线协作中的粘合剂，擅长卡位、挡拆和篮下保护。相比单纯得分，他更重要的价值是帮队友创造空间、稳住篮板和完成每一次需要身体对抗的细节。",
        courtRole: "内线粘合剂",
        quote: "挡拆和卡位做好，队友就能打得更舒服。",
        shooting: "62",
        breakthrough: "58",
        defense: "82",
        rebound: "88",
        playmaking: "76",
        stamina: "78",
        photo: "/assets/players/player-3.webp"
      },
      {
        id: "player-16-liu-haoran",
        name: "刘浩然",
        number: "16",
        status: "现役",
        position: "前锋",
        grade: "大三",
        major: "人工智能",
        height: "180cm",
        tags: ["认真脸", "三分"],
        bio: "新晋三分好手，即插即用。",
        detailTitle: "投射档案",
        detail:
          "刘浩然是球队外线轮换里的投射点，适合在空位、转换和弱侧接应中完成终结。他的特点是进入比赛节奏快，能够用稳定的三分威胁为球队拉开进攻空间。",
        courtRole: "外线投射前锋",
        quote: "空位出现的时候，准备好就够了。",
        shooting: "87",
        breakthrough: "72",
        defense: "74",
        rebound: "70",
        playmaking: "68",
        stamina: "78",
        photo: "/assets/players/player-16.webp",
        photoFocus: { position: "center 50%", scale: "1.17" }
      },
      {
        id: "player-17-fang-xujie",
        name: "房续杰",
        number: "17",
        status: "现役",
        position: "后卫",
        grade: "大四",
        major: "生物医学工程",
        height: "180cm",
        tags: ["安东尼", "跳投"],
        bio: "乱战好手，优美跳投。",
        detailTitle: "得分档案",
        detail:
          "房续杰擅长在乱战和半转换中寻找投篮机会，跳投节奏自然，能够在进攻停滞时提供处理球选择。他的存在让球队在非固定战术回合中多了一种得分方式。",
        courtRole: "乱战得分手",
        quote: "机会不一定完美，但出手要坚决。",
        shooting: "84",
        breakthrough: "80",
        defense: "72",
        rebound: "66",
        playmaking: "74",
        stamina: "76",
        photo: "/assets/players/player-17.webp"
      },
      {
        id: "player-7-zhao-yongbin",
        name: "赵勇斌",
        number: "7",
        status: "现役",
        position: "后卫",
        grade: "大一",
        major: "生物医学工程",
        height: "183cm",
        tags: ["未来是我的", "传球"],
        bio: "有无球兼备，传球高手。",
        detailTitle: "组织档案",
        detail:
          "赵勇斌是球队后场里兼具无球跑动和传球视野的年轻球员。无论是推进中的分球，还是阵地战里的二次处理，他都能帮助球队把球运转到更好的位置。",
        courtRole: "传导型后卫",
        quote: "好机会不一定是自己出手，也可以是传出来的。",
        shooting: "76",
        breakthrough: "82",
        defense: "78",
        rebound: "70",
        playmaking: "88",
        stamina: "84",
        photo: "/assets/players/player-7.webp",
        photoFocus: { position: "center 52%", scale: "1.15" }
      },
      {
        id: "player-21-li-chenyu",
        name: "李宸宇",
        number: "21",
        status: "现役",
        position: "前锋",
        grade: "大三",
        major: "生物医学工程",
        height: "183cm",
        tags: ["地道", "空间型四号位"],
        bio: "可内可外，空间型四号位。",
        detailTitle: "空间档案",
        detail:
          "李宸宇是球队锋线空间点，能够在内外线之间切换角色。进攻端可以拉开空间，也能在篮下参与终结；防守端则负责锋线对位和篮板保护。",
        courtRole: "空间型前锋",
        quote: "站对位置，空间就会变成机会。",
        shooting: "82",
        breakthrough: "74",
        defense: "80",
        rebound: "84",
        playmaking: "72",
        stamina: "78",
        photo: "/assets/players/player-21.webp"
      },
      {
        id: "player-12-wang-zhiyuan",
        name: "王志远",
        number: "12",
        status: "现役",
        position: "后卫",
        grade: "大三",
        major: "生物医学工程",
        height: "175cm",
        tags: ["莫兰特", "替补骑兵"],
        bio: "替补骑兵。",
        detailTitle: "冲击档案",
        detail:
          "王志远是替补席上的速度变量，登场后能迅速提高比赛节奏。突破冲击、转换推进和防线撕扯是他的主要特点，适合在需要改变局面时提供活力。",
        courtRole: "替补冲击后卫",
        quote: "上场就把节奏带快一点。",
        shooting: "74",
        breakthrough: "90",
        defense: "70",
        rebound: "62",
        playmaking: "78",
        stamina: "88",
        photo: "/assets/players/player-12.webp"
      },
      {
        id: "player-9-liu-wenhui",
        name: "刘文辉",
        number: "9",
        status: "现役",
        position: "前锋",
        grade: "大二",
        major: "数据科学与大数据技术",
        height: "183cm",
        tags: ["未来也是我的", "稳定中投"],
        bio: "外线撕咬，稳定中投。",
        detailTitle: "锋卫档案",
        detail:
          "刘文辉在外线防守和中距离进攻上都有稳定贡献。防守端能持续撕咬持球人，进攻端则用稳定中投和弱侧接应帮助球队补足半场得分。",
        courtRole: "外线防守锋线",
        quote: "防守先咬住，对手就会慢下来。",
        shooting: "83",
        breakthrough: "76",
        defense: "84",
        rebound: "78",
        playmaking: "70",
        stamina: "82",
        photo: "/assets/players/player-9.webp",
        photoFocus: { detailPosition: "72% 52%", detailScale: "1.22" }
      },
      {
        id: "player-1-mi-yiyang",
        name: "米奕阳",
        number: "1",
        status: "现役",
        position: "中锋",
        grade: "大四",
        major: "数据科学与大数据技术",
        height: "186cm",
        tags: ["米哥", "篮板"],
        bio: "内线支点，篮板好手。",
        detailTitle: "支点档案",
        detail:
          "米奕阳是球队内线支点，主要价值在篮板保护、禁区对抗和二次进攻机会。场上他负责稳定内线站位，为外线队友提供更可靠的防守屏障。",
        courtRole: "篮板支点",
        quote: "篮板球，就是下一次进攻的开始。",
        shooting: "60",
        breakthrough: "62",
        defense: "84",
        rebound: "92",
        playmaking: "68",
        stamina: "80",
        photo: "/assets/players/player-1.webp",
        photoFocus: { detailPosition: "36% 50%", detailScale: "1.2" }
      },
      {
        id: "player-8-gao-tianqi",
        name: "高天麒",
        number: "8",
        status: "现役",
        position: "中锋",
        grade: "大三",
        major: "智能医学工程",
        height: "175cm",
        tags: ["高中锋", "训练师"],
        bio: "幽灵位篮板达人，球队训练师。",
        detailTitle: "训练档案",
        detail:
          "高天麒是球队训练氛围里的重要角色，擅长在不显眼的位置完成篮板和补位。作为训练师型球员，他既能参与对抗，也能帮助球队保持训练质量和基本节奏。",
        courtRole: "训练型内线",
        quote: "训练里的每个细节，比赛都会还回来。",
        shooting: "66",
        breakthrough: "68",
        defense: "80",
        rebound: "86",
        playmaking: "74",
        stamina: "82",
        photo: "/assets/players/player-8.webp",
        photoFocus: { position: "center 50%", scale: "1.16" }
      },
      {
        id: "player-35-zhang-shengke",
        name: "张圣柯",
        number: "35",
        status: "现役",
        position: "前锋",
        grade: "大一",
        major: "生物医学工程",
        height: "183cm",
        tags: ["格兰特", "中投"],
        bio: "罚球线策应，转身中投。",
        detailTitle: "策应档案",
        detail:
          "张圣柯是锋线位置上的中距离和策应点，能够在罚球线附近完成接球处理。转身中投、短顺下和二次传导是他的特点，适合衔接内外线进攻。",
        courtRole: "中距离策应前锋",
        quote: "接到球先观察，机会会自己出现。",
        shooting: "82",
        breakthrough: "74",
        defense: "78",
        rebound: "82",
        playmaking: "70",
        stamina: "80",
        photo: "/assets/players/player-35.webp"
      }
    ],
    news: [
      {
        id: "news-1",
        title: "人工智能篮球队公布新赛季训练安排",
        category: "训练",
        date: "2026-06-01",
        cover: "",
        photos: [],
        wechatUrl: "",
        excerpt: "球队将以每周三练节奏备战校园联赛，招新试训同步开放报名。",
        body:
          "新赛季训练将围绕体能恢复、半场攻防、转换进攻和定位投篮展开。欢迎有篮球基础、愿意稳定参加训练的同学报名试训。"
      },
      {
        id: "news-2",
        title: "学院杯淘汰赛首战告捷",
        category: "战报",
        date: "2026-05-29",
        cover: "",
        photos: [],
        wechatUrl: "",
        excerpt: "球队以 78:64 战胜机械学院，在第三节依靠连续防守反击拉开比分。",
        body:
          "本场比赛球队在上半场保持紧咬，第三节加强前场压迫并提升篮板保护。多名队员轮换登场，为后续赛程保留了体能。"
      },
      {
        id: "news-3",
        title: "新队员试训周开放预约",
        category: "招新",
        date: "2026-05-20",
        cover: "",
        photos: [],
        wechatUrl: "",
        excerpt: "面向全院学生开放，欢迎后卫、锋线、内线及球队运营志愿者报名。",
        body:
          "试训包括基础技术、对抗分组和沟通面谈。除场上队员外，球队也欢迎摄影、视频、运营和数据记录方向的同学加入。"
      }
    ],
    gallery: [
      {
        id: "gallery-1",
        title: "比赛照片 1",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-1.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-1.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-2",
        title: "比赛照片 2",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-2.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-2.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-3",
        title: "比赛照片 3",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-3.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-3.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-4",
        title: "比赛照片 4",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-4.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-4.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-5",
        title: "比赛照片 5",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-5.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-5.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-6",
        title: "比赛照片 6",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-6.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-6.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-7",
        title: "比赛照片 7",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-7.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-7.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-8",
        title: "比赛照片 8",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-8.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-8.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-9",
        title: "比赛照片 9",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-9.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-9.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-10",
        title: "比赛照片 10",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-10.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-10.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-11",
        title: "比赛照片 11",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-11.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-11.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-12",
        title: "比赛照片 12",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-12.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-12.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-13",
        title: "比赛照片 13",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-13.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-13.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-14",
        title: "比赛照片 14",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-14.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-14.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-15",
        title: "比赛照片 15",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-15.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-15.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-16",
        title: "比赛照片 16",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-16.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-16.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-17",
        title: "比赛照片 17",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-17.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-17.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-18",
        title: "比赛照片 18",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-18.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-18.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-19",
        title: "比赛照片 19",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-19.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-19.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-20",
        title: "比赛照片 20",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-20.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-20.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-21",
        title: "比赛照片 21",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-21.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-21.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-22",
        title: "比赛照片 22",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-22.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-22.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-23",
        title: "比赛照片 23",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-23.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-23.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-24",
        title: "比赛照片 24",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-24.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-24.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-25",
        title: "比赛照片 25",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-25.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-25.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-26",
        title: "比赛照片 26",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-26.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-26.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-27",
        title: "比赛照片 27",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-27.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-27.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-28",
        title: "比赛照片 28",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-28.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-28.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-29",
        title: "比赛照片 29",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-29.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-29.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-30",
        title: "比赛照片 30",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-30.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-30.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-31",
        title: "比赛照片 31",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-31.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-31.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-32",
        title: "比赛照片 32",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-32.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-32.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-33",
        title: "比赛照片 33",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-33.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-33.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-34",
        title: "比赛照片 34",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-34.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-34.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-35",
        title: "比赛照片 35",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-35.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-35.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-36",
        title: "比赛照片 36",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-36.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-36.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-37",
        title: "比赛照片 37",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-37.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-37.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-highlight-photo-38",
        title: "比赛照片 38",
        category: "比赛集锦",
        kind: "photo",
        date: "",
        source: "/assets/gallery/highlights/photos/highlight-photo-38.webp",
        image: "/assets/gallery/highlights/photos/highlight-photo-38.webp",
        caption: "比赛现场照片，记录比赛中的攻防瞬间。"
      },
      {
        id: "gallery-2",
        title: "比赛视频 1",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-1.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-2",
        title: "比赛视频 2",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-2.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-3",
        title: "比赛视频 3",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-3.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-4",
        title: "比赛视频 4",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-4.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-5",
        title: "比赛视频 5",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-5.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-6",
        title: "比赛视频 6",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-6.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-7",
        title: "比赛视频 7",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-7.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-8",
        title: "比赛视频 8",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-8.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-9",
        title: "比赛视频 9",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-9.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-10",
        title: "比赛视频 10",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-10.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-11",
        title: "比赛视频 11",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-11.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-12",
        title: "比赛视频 12",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-12.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-13",
        title: "比赛视频 13",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-13.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-highlight-video-14",
        title: "比赛视频 14",
        category: "比赛集锦",
        kind: "video",
        date: "",
        source: "/assets/gallery/highlights/videos/highlight-video-14.mp4",
        image: "",
        caption: "比赛视频片段，支持在网站中直接播放。"
      },
      {
        id: "gallery-3",
        title: "赛后合照 1",
        category: "赛后合照",
        kind: "photo",
        date: "2026-05-28",
        source: "/assets/gallery/team-photos/team-photo-1.webp",
        image: "/assets/gallery/team-photos/team-photo-1.webp",
        caption: "赛后队伍合影，记录比赛结束后的团队瞬间。"
      },
      {
        id: "gallery-4",
        title: "赛后合照 2",
        category: "赛后合照",
        kind: "photo",
        date: "2026-05-16",
        source: "/assets/gallery/team-photos/team-photo-2.webp",
        image: "/assets/gallery/team-photos/team-photo-2.webp",
        caption: "赛后队伍合影，留下每一场比赛后的共同记忆。"
      },
      {
        id: "gallery-9",
        title: "赛后合照 3",
        category: "赛后合照",
        kind: "photo",
        date: "2026-05-16",
        source: "/assets/gallery/team-photos/team-photo-3.webp",
        image: "/assets/gallery/team-photos/team-photo-3.webp",
        caption: "赛后队伍合影，记录并肩完成比赛的时刻。"
      },
      {
        id: "gallery-10",
        title: "赛后合照 4",
        category: "赛后合照",
        kind: "photo",
        date: "2026-05-16",
        source: "/assets/gallery/team-photos/team-photo-4.webp",
        image: "/assets/gallery/team-photos/team-photo-4.webp",
        caption: "赛后队伍合影，把场上的投入收进同一张画面。"
      },
      {
        id: "gallery-11",
        title: "赛后合照 5",
        category: "赛后合照",
        kind: "photo",
        date: "2026-05-16",
        source: "/assets/gallery/team-photos/team-photo-5.webp",
        image: "/assets/gallery/team-photos/team-photo-5.webp",
        caption: "赛后队伍合影，保留团队共同出战的证据。"
      },
      {
        id: "gallery-12",
        title: "赛后合照 6",
        category: "赛后合照",
        kind: "photo",
        date: "2026-05-16",
        source: "/assets/gallery/team-photos/team-photo-6.webp",
        image: "/assets/gallery/team-photos/team-photo-6.webp",
        caption: "赛后队伍合影，补全这一组比赛纪念素材。"
      },
      {
        id: "gallery-5",
        title: "日常训练 1",
        category: "日常训练",
        kind: "video",
        date: "2026-06-03",
        source: "/assets/gallery/training/training-video-1.mp4",
        image: "",
        caption: "日常训练视频素材，记录训练中的动作和节奏。"
      },
      {
        id: "gallery-6",
        title: "日常训练 2",
        category: "日常训练",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/training/training-photo-1.webp",
        image: "/assets/gallery/training/training-photo-1.webp",
        caption: "日常训练照片，记录训练现场。"
      },
      {
        id: "gallery-17",
        title: "日常训练 3",
        category: "日常训练",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/training/training-photo-2.webp",
        image: "/assets/gallery/training/training-photo-2.webp",
        caption: "日常训练照片，记录训练现场。"
      },
      {
        id: "gallery-18",
        title: "日常训练 4",
        category: "日常训练",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/training/training-photo-3.webp",
        image: "/assets/gallery/training/training-photo-3.webp",
        caption: "日常训练照片，记录训练现场。"
      },
      {
        id: "gallery-19",
        title: "日常训练 5",
        category: "日常训练",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/training/training-photo-4.webp",
        image: "/assets/gallery/training/training-photo-4.webp",
        caption: "日常训练照片，记录训练现场。"
      },
      {
        id: "gallery-20",
        title: "日常训练 6",
        category: "日常训练",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/training/training-photo-5.webp",
        image: "/assets/gallery/training/training-photo-5.webp",
        caption: "日常训练照片，记录训练现场。"
      },
      {
        id: "gallery-21",
        title: "日常训练 7",
        category: "日常训练",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/training/training-photo-6.webp",
        image: "/assets/gallery/training/training-photo-6.webp",
        caption: "日常训练照片，记录训练现场。"
      },
      {
        id: "gallery-22",
        title: "夜间聚餐",
        category: "球队生活",
        kind: "photo",
        date: "2026-06-05",
        source: "/assets/gallery/life/life-photo-6.webp",
        image: "/assets/gallery/life/life-photo-6.webp",
        caption: "训练和比赛之外的队伍聚餐，记录场下的团队氛围。"
      },
      {
        id: "gallery-7",
        title: "球队生活 1",
        category: "球队生活",
        kind: "video",
        date: "2026-06-03",
        source: "/assets/gallery/life/life-video-1.mp4",
        image: "",
        caption: "球队生活视频素材，记录场下日常和队伍氛围。"
      },
      {
        id: "gallery-8",
        title: "球队生活 2",
        category: "球队生活",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/life/life-photo-1.webp",
        image: "/assets/gallery/life/life-photo-1.webp",
        caption: "球队生活照片，保留训练和比赛之外的团队瞬间。"
      },
      {
        id: "gallery-13",
        title: "球队生活 3",
        category: "球队生活",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/life/life-photo-2.webp",
        image: "/assets/gallery/life/life-photo-2.webp",
        caption: "球队生活照片，记录队伍日常。"
      },
      {
        id: "gallery-14",
        title: "球队生活 4",
        category: "球队生活",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/life/life-photo-3.webp",
        image: "/assets/gallery/life/life-photo-3.webp",
        caption: "球队生活照片，记录队伍日常。"
      },
      {
        id: "gallery-15",
        title: "球队生活 5",
        category: "球队生活",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/life/life-photo-4.webp",
        image: "/assets/gallery/life/life-photo-4.webp",
        caption: "球队生活照片，记录队伍日常。"
      },
      {
        id: "gallery-16",
        title: "球队生活 6",
        category: "球队生活",
        kind: "photo",
        date: "2026-06-03",
        source: "/assets/gallery/life/life-photo-5.webp",
        image: "/assets/gallery/life/life-photo-5.webp",
        caption: "球队生活照片，记录队伍日常。"
      }
    ],
    sponsors: [
      {
        id: "sponsor-1",
        name: "校园运动空间",
        level: "合作伙伴",
        logo: "CSS",
        cover: "",
        description: "支持球队训练装备和校园赛事活动。",
        detailTitle: "校园赛事支持伙伴",
        detail: "校园运动空间长期关注学生体育活动，支持人工智能篮球队的训练装备、校园赛事组织和队伍展示。",
        cooperation: "合作内容包括官网展示、赛事海报露出、现场鸣谢和球队活动联合传播。",
        contact: "",
        website: "",
        benefits: ["官网展示", "赛事海报露出", "现场鸣谢"]
      },
      {
        id: "sponsor-2",
        name: "能量饮品合作方",
        level: "支持单位",
        logo: "EN",
        cover: "",
        description: "为比赛日和训练日提供补给支持。",
        detailTitle: "训练与比赛补给支持",
        detail: "能量饮品合作方为球队训练日和比赛日提供基础补给支持，帮助队员保持更好的训练状态。",
        cooperation: "合作内容包括比赛日报道、影像中心露出和球队训练活动鸣谢。",
        contact: "",
        website: "",
        benefits: ["比赛日报道", "影像中心露出"]
      },
      {
        id: "sponsor-3",
        name: "学院校友会",
        level: "特别鸣谢",
        logo: "AL",
        cover: "",
        description: "持续关注学生体育和团队成长。",
        detailTitle: "校友支持与球队成长",
        detail: "学院校友会持续关注人工智能学院学生体育、校园文化和团队成长，为球队建设提供长期支持。",
        cooperation: "合作内容包括荣誉墙展示、年度总结鸣谢和校友活动联动。",
        contact: "",
        website: "",
        benefits: ["荣誉墙展示", "年度总结鸣谢"]
      }
    ],
    recruitment: {
      headline: "加入深紫阵容",
      intro: "如果你愿意稳定训练、认真比赛、为学院荣誉上场，这里就是你的下一站。",
      steps: ["填写报名信息", "参加公开试训", "完成分组对抗", "进入试训观察期", "确认入队分工"],
      requirements: ["学院在读学生", "能稳定参加每周训练", "尊重团队纪律", "有比赛经验或专项能力优先"],
      faq: [
        { q: "没有校队经历可以报名吗？", a: "可以。我们会看基础、态度、出勤和成长空间。" },
        { q: "女生可以加入运营组吗？", a: "可以。摄影、视频、推文、数据和赛事执行都欢迎加入。" },
        { q: "训练会影响课程吗？", a: "训练安排在课余时间，考试周会根据实际情况调整。" }
      ],
      contactLabel: "招新咨询",
      contactValue: "请联系球队管理组或扫描后续发布的报名二维码"
    },
    applications: []
  };
}


