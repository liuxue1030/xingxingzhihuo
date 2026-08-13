// ========================================================
// 中华历史科普 - 内容数据（仅浏览，不可编辑）
// 每个朝代含四板块：basic / stories / people / inventions
// 文字通俗故事化，适配小学生；img 字段留空，用于以后插入插图
// ========================================================
window.HISTORY_DATA = [
    {
        id: 'yuan_gu',
        name: '远古原始人类',
        period: '约170万年前 – 前2070年',
        weight: 10,
        accent: '#8D6E63',
        summary: '中国大地上最早的原始人，用石头做工具、学会了用火。',
        basic: {
            duration: '约170万年前 – 前2070年',
            founder: '没有国王，过着氏族部落生活',
            capital: '住在山洞和简陋窝棚，还没有城市',
            landmark: '元谋人、北京人、山顶洞人；打制石器、用火、群居',
            memory: '元谋北京山顶洞，打石取火群居生'
        },
        stories: [
            { title: '北京人会用火', content: '北京人学会了使用和保存天然的火。火能取暖、能驱赶野兽、还能把食物烤熟，吃起来更香更安全。这是人类的一大进步！', img: '' },
            { title: '山顶洞人爱美啦', content: '山顶洞人用磨尖的骨针把兽皮缝成衣服，还把小石头、贝壳磨成漂亮的小装饰品挂在身上，说明那时候的人已经懂得爱美了。', img: '' }
        ],
        people: [
            { name: '元谋人', role: '最早的古人类', content: '生活在距今约170万年前，是中国境内目前知道最早的古人类。', img: '' },
            { name: '北京人', role: '会用火的古人类', content: '住在北京周口店的山洞里，能直立行走，会用打制的石头做工具。', img: '' }
        ],
        inventions: [
            { title: '打制石器', content: '用石头互相敲打，做出斧头、小刀一样的工具，这段时期叫"旧石器时代"。', img: '' },
            { title: '学会用火', content: '火照亮了黑夜、赶走了野兽、煮熟了食物，让人类生活更安全、更温暖。', img: '' }
        ]
    },
    {
        id: 'san_huang',
        name: '三皇五帝',
        period: '传说时代（约前30世纪以前）',
        weight: 6,
        accent: '#A1887F',
        summary: '远古的部落首领，教人们种田、治水、尝百草。',
        basic: {
            duration: '传说时代，约前30世纪以前',
            founder: '三皇五帝（伏羲、神农、黄帝等）',
            capital: '部落聚居，没有固定都城',
            landmark: '黄帝统一部落、尧舜禅让、大禹治水',
            memory: '三皇五帝尧舜禹，教耕尝草治洪水'
        },
        stories: [
            { title: '黄帝战蚩尤', content: '黄帝在涿鹿一带打败了强大的对手蚩尤，被大家尊为中华民族的人文初祖，我们常自称"炎黄子孙"。', img: '' },
            { title: '大禹治水', content: '大禹用"疏导"的办法治理洪水，一边挖沟一边引水，三次经过家门口都没空进去，终于把水患治好。', img: '' }
        ],
        people: [
            { name: '黄帝', role: '部落联盟首领', content: '带领大家打仗、种田、造房屋，被尊为"人文初祖"。', img: '' },
            { name: '尧、舜、禹', role: '贤明的首领', content: '尧把位置让给贤能的舜，舜又让给治水有功的禹，这种传贤的办法叫"禅让"。', img: '' }
        ],
        inventions: [
            { title: '教民耕种', content: '神农氏（炎帝）教人们种庄稼，还亲口尝百草，认清哪些草能治病。', img: '' },
            { title: '禅让制', content: '部落首领不把位置传给儿子，而是让给最有本领、最贤德的人。', img: '' }
        ]
    },
    {
        id: 'xia',
        name: '夏',
        period: '约前2070 – 前1600',
        weight: 4,
        accent: '#C28E5C',
        summary: '中国第一个王朝，大禹的儿子启建立，进入"家天下"。',
        basic: {
            duration: '约前2070 – 前1600',
            founder: '禹（后来传位给儿子启）',
            capital: '阳城、二里头一带',
            landmark: '第一个世袭制王朝、二里头文化、早期青铜器',
            memory: '大禹建夏启家天下，二里头里出青铜'
        },
        stories: [
            { title: '家天下开始', content: '大禹本来想把首领位置让给贤人，可他的儿子启夺了权、自己称王。从此王位在一家人中代代相传，叫"家天下"。', img: '' },
            { title: '二里头遗址', content: '考古叔叔在二里头挖出了夏朝的宫殿地基和青铜器，证明夏朝不是传说，而是真实存在过的王朝。', img: '' }
        ],
        people: [
            { name: '禹', role: '夏朝建立者', content: '治水的大英雄，因为功劳大被推举为部落首领，建立夏朝。', img: '' },
            { name: '启', role: '夏朝第二代王', content: '禹的儿子，开创了王位父子相传的"世袭制"。', img: '' }
        ],
        inventions: [
            { title: '世袭制', content: '王位不再传给贤人，而是在国王的家族里一代代传下去。', img: '' },
            { title: '早期青铜器', content: '出现了小小的青铜工具和兵器，还筑起了城墙。', img: '' }
        ]
    },
    {
        id: 'shang',
        name: '商',
        period: '约前1600 – 前1046',
        weight: 4,
        accent: '#B07D3C',
        summary: '靠甲骨文和青铜器闻名的王朝，盘庚把都城迁到了殷。',
        basic: {
            duration: '约前1600 – 前1046',
            founder: '商汤',
            capital: '亳 → 多次迁都 → 殷（今河南安阳）',
            landmark: '甲骨文、司母戊鼎、盘庚迁殷',
            memory: '商汤灭夏盘庚迁，甲骨青铜写千年'
        },
        stories: [
            { title: '盘庚迁殷', content: '商朝老是搬家，盘庚把都城迁到"殷"以后才安定下来，所以商朝也叫"殷商"。', img: '' },
            { title: '刻在骨头上的字', content: '商王把占卜的结果刻在龟甲和牛骨上，这就是"甲骨文"，是我们现在能认出的最早的汉字。', img: '' }
        ],
        people: [
            { name: '商汤', role: '商朝开国王', content: '带领人马推翻了残暴的夏桀，建立商朝。', img: '' },
            { name: '妇好', role: '女将军', content: '商王武丁的王后，能带兵打仗、主持祭祀，是位了不起的女性。', img: '' }
        ],
        inventions: [
            { title: '甲骨文', content: '刻在龟甲兽骨上的文字，是汉字最早的祖先，让我们能读到三千多年前的故事。', img: '' },
            { title: '青铜器', content: '司母戊鼎又大又精美，是祭祀时用的青铜重器，工艺非常高超。', img: '' }
        ]
    },
    {
        id: 'zhou',
        name: '周',
        period: '前1046 – 前256',
        weight: 6,
        accent: '#9E7B4F',
        summary: '分西周和东周，东周又有春秋战国，那时候出了很多思想家。',
        basic: {
            duration: '前1046 – 前256（西周 + 东周春秋战国）',
            founder: '周武王（姬发）',
            capital: '镐京（西周）→ 洛邑（东周）',
            landmark: '分封制、礼乐制度、春秋五霸、战国七雄',
            memory: '武王分封周八百年，春秋战国出圣贤'
        },
        stories: [
            { title: '烽火戏诸侯', content: '周幽王为了逗妃子笑，点燃烽火骗诸侯来救，等真有敌人时再点烽火却没人信了。西周因此灭亡，成了"狼来了"的故事。', img: '' },
            { title: '百家争鸣', content: '春秋战国时，孔子、老子、孟子等思想家各说各的道理，像开了一场大讨论，特别热闹。', img: '' }
        ],
        people: [
            { name: '周武王', role: '周朝开国王', content: '打败商纣王，建立周朝，把土地分给亲戚和功臣。', img: '' },
            { name: '孔子', role: '大教育家、思想家', content: '春秋时的人，创办私学让平民也能读书，被尊为"至圣先师"。', img: '' }
        ],
        inventions: [
            { title: '分封制', content: '国王把土地分给亲属和功臣，让他们建立诸侯国，替王室看守四方。', img: '' },
            { title: '礼乐文明', content: '用音乐和礼仪来规范行为、安定社会，影响了中国几千年。', img: '' }
        ]
    },
    {
        id: 'qin',
        name: '秦',
        period: '前221 – 前207',
        weight: 2,
        accent: '#6D4C41',
        summary: '秦始皇统一六国，建立第一个中央集权的统一王朝。',
        basic: {
            duration: '前221 – 前207',
            founder: '秦始皇（嬴政）',
            capital: '咸阳',
            landmark: '统一文字货币、修长城、建兵马俑',
            memory: '秦王扫六合，一统度量衡'
        },
        stories: [
            { title: '统一六国', content: '嬴政用了十年时间，把六个国家一个个灭掉，自己称"始皇帝"，想让秦朝一代代传下去。', img: '' },
            { title: '兵马俑', content: '秦始皇给自己修了一支"地下军队"，几千个陶土做的兵俑和马俑，个个不一样、栩栩如生。', img: '' }
        ],
        people: [
            { name: '秦始皇', role: '千古一帝', content: '统一中国，让车同轨、书同文、钱同形，是第一位皇帝。', img: '' },
            { name: '蒙恬', role: '大将军', content: '北打匈奴、修筑万里长城，保卫北方边疆。', img: '' }
        ],
        inventions: [
            { title: '统一文字', content: '全国都用"小篆"写字，不同地区的人终于能顺畅交流了。', img: '' },
            { title: '万里长城', content: '把各国旧城墙连起来、加长，用来抵御北方游牧民族的侵扰。', img: '' }
        ]
    },
    {
        id: 'han',
        name: '汉',
        period: '前202 – 220',
        weight: 6,
        accent: '#D4A017',
        summary: '汉朝很强盛，开通了丝绸之路，我们"汉族"的名字就从这里来。',
        basic: {
            duration: '前202 – 220（西汉 + 东汉）',
            founder: '汉高祖刘邦',
            capital: '长安（西汉）→ 洛阳（东汉）',
            landmark: '文景之治、汉武帝、丝绸之路、造纸术',
            memory: '刘邦建汉通西域，造纸丝路扬美名'
        },
        stories: [
            { title: '张骞通西域', content: '张骞两次出使西域，历尽艰险打通了"丝绸之路"，中国的丝绸、瓷器被运到很远很远的西方。', img: '' },
            { title: '文景之治', content: '汉文帝和汉景帝减轻赋税、让百姓安心种地，国家越来越富，粮仓都装不下啦。', img: '' }
        ],
        people: [
            { name: '刘邦', role: '汉朝开国皇帝', content: '从平民做起，打败项羽建立汉朝。', img: '' },
            { name: '汉武帝', role: '雄才大略的皇帝', content: '打跑匈奴、开拓疆土，还"独尊儒术"统一思想。', img: '' }
        ],
        inventions: [
            { title: '造纸术', content: '东汉蔡伦改进了造纸法，纸又便宜又好用，被列入"四大发明"。', img: '' },
            { title: '丝绸之路', content: '一条连接中国和西方的商路，骆驼队运着丝绸、香料来回跑。', img: '' }
        ]
    },
    {
        id: 'wei_jin',
        name: '三国两晋南北朝',
        period: '220 – 589',
        weight: 6,
        accent: '#8E7CC3',
        summary: '天下三分又长期分裂，各民族大融合，乱世出英雄。',
        basic: {
            duration: '220 – 589',
            founder: '曹丕（魏）、刘备（蜀）、孙权（吴）',
            capital: '洛阳 / 成都 / 建业',
            landmark: '赤壁之战、三国鼎立、北方民族大融合',
            memory: '魏蜀吴分天下，融合南北成一大家'
        },
        stories: [
            { title: '赤壁之战', content: '孙权、刘备联军在赤壁用火烧大败曹操的大军，从此魏、蜀、吴三国各占一方。', img: '' },
            { title: '草木皆兵', content: '淝水之战前，前秦的苻坚远远看见八公山上的草木，以为全是敌军，形容人惊慌时疑神疑鬼。', img: '' }
        ],
        people: [
            { name: '曹操', role: '魏国奠基人', content: '能文能武，统一了北方，写下"老骥伏枥"这样的诗句。', img: '' },
            { name: '诸葛亮', role: '蜀汉丞相', content: '智慧与忠诚的化身，留下"鞠躬尽瘁"的佳话。', img: '' }
        ],
        inventions: [
            { title: '民族大融合', content: '北方游牧民族南下，和汉族通婚、学种田，慢慢变成一家人。', img: '' },
            { title: '书法绘画', content: '王羲之写的《兰亭序》被誉为"天下第一行书"，是书法珍宝。', img: '' }
        ]
    },
    {
        id: 'sui',
        name: '隋',
        period: '581 – 618',
        weight: 2,
        accent: '#5E8B7E',
        summary: '结束分裂、统一全国，开凿大运河，还首创了科举制。',
        basic: {
            duration: '581 – 618',
            founder: '隋文帝杨坚',
            capital: '大兴（长安）',
            landmark: '大运河、科举制、三省六部',
            memory: '隋文统一开运河，科举取士泽后世'
        },
        stories: [
            { title: '开凿大运河', content: '隋炀帝征调上百万民工挖运河，把南北连成一条水运大通道。虽然很辛苦，却方便了后代千百年。', img: '' },
            { title: '开创科举', content: '隋文帝用考试来选官员，不管出身穷富，有本事就能当官，这办法沿用了上千年。', img: '' }
        ],
        people: [
            { name: '隋文帝', role: '隋朝开国皇帝', content: '结束几百年分裂，重新统一中国。', img: '' },
            { name: '隋炀帝', role: '隋朝第二代皇帝', content: '修运河、建东都，但太会折腾百姓，隋朝很快灭亡。', img: '' }
        ],
        inventions: [
            { title: '科举制', content: '通过考试公平选人才，平民子弟也能靠读书做官。', img: '' },
            { title: '大运河', content: '世界上最长的人工河，南北物资从此能坐船直达。', img: '' }
        ]
    },
    {
        id: 'tang',
        name: '唐',
        period: '618 – 907',
        weight: 6,
        accent: '#E57373',
        summary: '最强盛的王朝之一，诗歌达到顶峰，各国使节都来长安。',
        basic: {
            duration: '618 – 907',
            founder: '唐高祖李渊（盛世在太宗、玄宗）',
            capital: '长安',
            landmark: '贞观之治、开元盛世、唐诗、玄奘西行',
            memory: '大唐盛世诗满楼，万国衣冠拜冕旒'
        },
        stories: [
            { title: '贞观之治', content: '唐太宗虚心听大臣劝告，把国家治理得又富又安定，成了后代皇帝学习的榜样。', img: '' },
            { title: '玄奘取经', content: '玄奘一人一马走过沙漠雪山，去天竺取佛经，回来写成《大唐西域记》，后来《西游记》就受此启发。', img: '' }
        ],
        people: [
            { name: '唐太宗', role: '开创盛世的明君', content: '知错就改、重用贤臣，成就"贞观之治"。', img: '' },
            { name: '李白', role: '诗仙', content: '写出很多豪放飘逸的诗，喝酒写诗、潇洒自在。', img: '' }
        ],
        inventions: [
            { title: '唐诗', content: '李白、杜甫、白居易……诗歌的黄金时代，很多诗我们到现在还会背。', img: '' },
            { title: '雕版印刷', content: '把字反着刻在木板上刷墨印书，比一笔笔手抄快多啦。', img: '' }
        ]
    },
    {
        id: 'wudai',
        name: '五代十国',
        period: '907 – 960',
        weight: 2,
        accent: '#A1887F',
        summary: '唐朝之后短暂分裂，五个朝代在中原轮流坐庄。',
        basic: {
            duration: '907 – 960',
            founder: '朱温等（后梁、后唐、后晋、后汉、后周）',
            capital: '开封等地',
            landmark: '政权更迭快、南方相对安定',
            memory: '五代十国乱纷纷，五十三年又归一'
        },
        stories: [
            { title: '谁兵强谁当皇帝', content: '五代时中原换了五个朝代，基本是"谁手里的兵强，谁就当皇帝"，老百姓都盼着早点统一。', img: '' },
            { title: '南方慢慢富起来', content: '十国大多在南方，兴修水利、种好庄稼，经济一点点发展起来。', img: '' }
        ],
        people: [
            { name: '朱温', role: '后梁开国皇帝', content: '灭掉唐朝，开启"五代"。', img: '' },
            { name: '李存勖', role: '后唐庄宗', content: '能征善战的将领，建立后唐。', img: '' }
        ],
        inventions: [
            { title: '词流行起来', content: '一种叫"词"的新文体在五代开始流行，句子长短不一，唱起来好听。', img: '' },
            { title: '江南印书', content: '南方印书业渐渐兴旺，书本比以前容易得到。', img: '' }
        ]
    },
    {
        id: 'song',
        name: '宋',
        period: '960 – 1279',
        weight: 6,
        accent: '#4DB6AC',
        summary: '经济文化极繁荣，活字印刷和指南针都出现在这个朝代。',
        basic: {
            duration: '960 – 1279（北宋 + 南宋）',
            founder: '宋太祖赵匡胤',
            capital: '东京汴梁（北宋）→ 临安（南宋）',
            landmark: '杯酒释兵权、清明上河图、活字印刷、指南针',
            memory: '赵匡胤杯酒收兵权，活字指南耀人间'
        },
        stories: [
            { title: '杯酒释兵权', content: '赵匡胤请大将们喝酒，委婉地收回他们的兵权，用和平办法避免了武将造反。', img: '' },
            { title: '清明上河图', content: '画家张择端把北宋汴京的热闹街市画成长长一卷，桥上行人、河边船只像照片一样真实。', img: '' }
        ],
        people: [
            { name: '赵匡胤', role: '宋朝开国皇帝', content: '陈桥兵变中被拥立为帝，建立宋朝。', img: '' },
            { name: '苏轼', role: '大文豪', content: '诗词书画样样精通，性格豁达，留下许多名篇。', img: '' }
        ],
        inventions: [
            { title: '活字印刷', content: '毕昇发明用一个个字模排版印刷，比整块雕刻快多了。', img: '' },
            { title: '指南针', content: '把指南针用在航海上，船队在茫茫大海上也能认准方向。', img: '' }
        ]
    },
    {
        id: 'yuan',
        name: '元',
        period: '1271 – 1368',
        weight: 4,
        accent: '#7986CB',
        summary: '蒙古族建立的大一统王朝，疆域空前辽阔。',
        basic: {
            duration: '1271 – 1368',
            founder: '元世祖忽必烈',
            capital: '大都（今北京）',
            landmark: '疆域最大、行省制、马可·波罗来华',
            memory: '忽必烈建大元，行省辽阔通欧亚'
        },
        stories: [
            { title: '蒙古铁骑统一', content: '成吉思汗的孙子忽必烈灭掉南宋，建立元朝，第一次由少数民族统一全中国。', img: '' },
            { title: '马可·波罗游中国', content: '意大利年轻人马可·波罗来到元朝，回去写了本游记，把东方的富庶讲给欧洲人听，惊呆了大家。', img: '' }
        ],
        people: [
            { name: '忽必烈', role: '元朝开国皇帝', content: '定都大都，把国家治理得疆域空前辽阔。', img: '' },
            { name: '关汉卿', role: '大戏剧家', content: '写下《窦娥冤》等名剧，是元曲的代表人物。', img: '' }
        ],
        inventions: [
            { title: '行省制', content: '把全国分成一个个"行省"来管理，这种办法一直沿用到今天。', img: '' },
            { title: '火药西传', content: '火药武器随着蒙古大军远征传到西方，改变了世界。', img: '' }
        ]
    },
    {
        id: 'ming',
        name: '明',
        period: '1368 – 1644',
        weight: 4,
        accent: '#EF9A9A',
        summary: '汉族重建大一统，郑和七下西洋，还修起了紫禁城。',
        basic: {
            duration: '1368 – 1644',
            founder: '明太祖朱元璋',
            capital: '南京 → 北京',
            landmark: '郑和下西洋、修长城、紫禁城、《永乐大典》',
            memory: '朱元璋放牛娃，郑和扬帆下西洋'
        },
        stories: [
            { title: '郑和下西洋', content: '郑和带着巨大的宝船七次下西洋，到过三十多个国家，带去礼物也带回来新奇见闻。', img: '' },
            { title: '紫禁城落成', content: '明朝建起宏伟的皇宫紫禁城，就是今天的故宫，红墙黄瓦，气派非凡。', img: '' }
        ],
        people: [
            { name: '朱元璋', role: '明朝开国皇帝', content: '从放牛娃、小和尚一路奋斗，最后当上皇帝。', img: '' },
            { name: '郑和', role: '航海家', content: '七下西洋，比西方大航海早了将近一百年。', img: '' }
        ],
        inventions: [
            { title: '紫禁城', content: '世界最大的木结构宫殿群，今天叫故宫，是建筑奇迹。', img: '' },
            { title: '《本草纲目》', content: '李时珍走遍山野写成药物学巨著，记载了上千种药材。', img: '' }
        ]
    },
    {
        id: 'qing',
        name: '清',
        period: '1636 – 1912',
        weight: 5,
        accent: '#9575CD',
        summary: '最后一个封建王朝，前期康乾盛世，后期闭关挨打。',
        basic: {
            duration: '1636 – 1912',
            founder: '清太祖努尔哈赤（入关后顺治、康熙）',
            capital: '盛京 → 北京',
            landmark: '康乾盛世、闭关锁国、鸦片战争、末代皇帝',
            memory: '满族入关康乾盛，闭关落后受欺凌'
        },
        stories: [
            { title: '康乾盛世', content: '康熙、雍正、乾隆把国家治得强盛又富庶，疆土辽阔，人口大增。', img: '' },
            { title: '闭关锁国', content: '清朝后期不愿和外国来往，关上大门，慢慢落后了，后来吃了大亏。', img: '' }
        ],
        people: [
            { name: '康熙', role: '在位最久的明君', content: '平三藩、收台湾、打准噶尔，把江山坐得稳稳的。', img: '' },
            { name: '林则徐', role: '民族英雄', content: '在虎门把鸦片统统销毁，坚决抵抗外来侵略。', img: '' }
        ],
        inventions: [
            { title: '《红楼梦》', content: '曹雪芹写的长篇小说，被誉为中国古典小说的巅峰之作。', img: '' },
            { title: '园林艺术', content: '圆明园、颐和园美得如诗如画，是古典园林的杰作。', img: '' }
        ]
    },
    {
        id: 'jindai',
        name: '近代史',
        period: '1840 – 1949',
        weight: 5,
        accent: '#4FC3F7',
        summary: '从鸦片战争到建国前，中华民族抗争求变的苦难与觉醒。',
        basic: {
            duration: '1840 – 1949',
            founder: '无王朝，走向共和',
            capital: '南京（民国）→ 重庆等',
            landmark: '鸦片战争、辛亥革命、五四运动、抗日战争',
            memory: '鸦片烽火醒神州，共和抗战写春秋'
        },
        stories: [
            { title: '辛亥革命', content: '孙中山领导革命推翻清朝，结束了两千多年的皇帝制度，建立了中华民国。', img: '' },
            { title: '抗日战争', content: '全国军民齐心抵抗日本侵略者，经过十四年艰苦奋战，终于取得伟大胜利。', img: '' }
        ],
        people: [
            { name: '孙中山', role: '革命先行者', content: '领导辛亥革命，被尊为"国父"。', img: '' },
            { name: '毛泽东', role: '革命领袖', content: '带领人民闹革命，后来建立了新中国。', img: '' }
        ],
        inventions: [
            { title: '新文化运动', content: '提倡"民主"与"科学"，解放思想，呼唤新的时代。', img: '' },
            { title: '近代工业', content: '铁路、工厂、电报慢慢发展，中国开始拥抱现代文明。', img: '' }
        ]
    },
    {
        id: 'xinzhongguo',
        name: '新中国',
        period: '1949 – 至今',
        weight: 4,
        accent: '#FF8A65',
        summary: '1949年中华人民共和国成立，走向繁荣富强的新时代。',
        basic: {
            duration: '1949 – 至今',
            founder: '毛泽东等老一辈革命家',
            capital: '北京',
            landmark: '开国大典、改革开放、航天高铁、全面小康',
            memory: '一九四九站起来，改革开放富起来'
        },
        stories: [
            { title: '开国大典', content: '1949年10月1日，毛泽东在天安门城楼宣布"中华人民共和国中央人民政府成立了"，五星红旗冉冉升起。', img: '' },
            { title: '改革开放', content: '从1978年起，国家大力发展经济，日子一天比一天好，高楼、汽车、超市越来越多。', img: '' }
        ],
        people: [
            { name: '毛泽东', role: '新中国缔造者', content: '带领人民建立新中国，让中国人真正站了起来。', img: '' },
            { name: '邓小平', role: '改革开放总设计师', content: '推动改革开放，让国家富强、生活变好。', img: '' }
        ],
        inventions: [
            { title: '两弹一星', content: '原子弹、氢弹、人造卫星相继成功，国家腰杆更硬了。', img: '' },
            { title: '高铁与航天', content: '高铁飞驰在祖国大地上，神舟飞船上天、嫦娥探测器登月，科技越来越强。', img: '' }
        ]
    }
];
