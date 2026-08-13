/* ========================================
 * 星星之火 - 汉语拼音数据
 * 声母 / 韵母 / 整体认读音节
 * read   : 用于语音朗读的呼读音/完整音节
 * parts  : 用于四线三格书写示范的基础字母拆分
 * ======================================== */

// 基础字母书写信息：read=呼读音(语音朗读用)，stroke=笔顺要点
const PINYIN_LETTERS = {
    'a': { read: 'a',  stroke: '先写左半圆，再写竖', grid: '中格', steps: ['① 左半圆', '② 竖'], note: '两笔写成，占满中格' },
    'o': { read: 'o',  stroke: '从左上起笔，一笔画成圆', grid: '中格', steps: ['① 左上起笔，一笔画圆'], note: '一笔写成，上下紧挨二三线' },
    'e': { read: 'e',  stroke: '中格正中起笔横，再向左画半圆', grid: '中格', steps: ['① 横后向左画半圆'], note: '一笔写成，横要短，半圆饱满' },
    'i': { read: 'i',  stroke: '先写竖，再写上面一点', grid: '上中格', steps: ['① 中格竖', '② 上格圆点'], note: '点和竖上下对齐' },
    'u': { read: 'u',  stroke: '先写竖右弯，再写竖', grid: '中格', steps: ['① 竖右弯', '② 竖'], note: '两笔写成，占满中格' },
    'ü': { read: 'ü',  stroke: '先写竖右弯，再写竖，最后写左右两点', grid: '上中格', steps: ['① 竖右弯', '② 竖', '③ 左点', '④ 右点'], note: '先写 u，再在上格写两点' },
    'b': { read: 'bo', stroke: '先写竖（出头），再写右下半圆', grid: '上中格', steps: ['① 上格出头竖', '② 右下半圆'], note: '竖要写直，半圆占满中格' },
    'p': { read: 'po', stroke: '先写竖（出头长），再写右下半圆', grid: '中下格', steps: ['① 中格出头竖（到下格）', '② 右上半圆'], note: '竖长要过第三线' },
    'm': { read: 'mo', stroke: '先写竖，再写左弯竖，最后写左弯竖', grid: '中格', steps: ['① 竖', '② 左弯竖', '③ 左弯竖'], note: '三笔写成，占满中格' },
    'f': { read: 'fo', stroke: '先写右弯竖，再写横', grid: '上中格', steps: ['① 右弯竖（上格出头）', '② 短横'], note: '横写在第二线稍下' },
    'd': { read: 'de', stroke: '先写左半圆，再写竖', grid: '上中格', steps: ['① 中格左半圆', '② 上格出头竖'], note: '竖要写直，占上中格' },
    't': { read: 'te', stroke: '先写竖右弯，再写横', grid: '上中格', steps: ['① 竖右弯（上格出头）', '② 短横'], note: '横写在第二线处' },
    'n': { read: 'ne', stroke: '先写竖，再写左弯竖', grid: '中格', steps: ['① 竖', '② 左弯竖'], note: '两笔写成，占满中格' },
    'l': { read: 'le', stroke: '一笔竖', grid: '上中格', steps: ['① 上格起笔，竖到下第三线'], note: '一笔写成，要写直' },
    'g': { read: 'ge', stroke: '先写左半圆，再写竖左弯', grid: '中下格', steps: ['① 中格左半圆', '② 竖左弯（下格出弯）'], note: '弯钩要圆润，出下格' },
    'k': { read: 'ke', stroke: '先写竖，再写左斜右斜', grid: '上中格', steps: ['① 上格出头竖', '② 左斜', '③ 右斜'], note: '两斜起笔在竖中部' },
    'h': { read: 'he', stroke: '先写竖，再写左弯竖', grid: '上中格', steps: ['① 上格出头竖', '② 左弯竖'], note: '占满上中格' },
    'j': { read: 'ji', stroke: '先写竖左弯（下端向左出），再写上面一点', grid: '上中下格', steps: ['① 竖左弯（上格小钩、下格出弯）', '② 上格圆点'], note: '点和弯钩上下对齐' },
    'q': { read: 'qi', stroke: '先写左半圆，再写竖', grid: '中下格', steps: ['① 中格左半圆', '② 竖左弯（下格出弯）'], note: '占满中下格' },
    'x': { read: 'xi', stroke: '先写右斜，再写左斜', grid: '中格', steps: ['① 右斜', '② 左斜'], note: '两笔交叉在中格中心' },
    'r': { read: 'ri', stroke: '先写竖，再写右上弯', grid: '中格', steps: ['① 竖', '② 右上弯'], note: '两笔写成，占满中格' },
    'y': { read: 'yi', stroke: '先写右斜，再写左斜', grid: '中下格', steps: ['① 右斜', '② 左斜（下格出尾）'], note: '第二笔要出下格' },
    'w': { read: 'wu', stroke: '先写斜下斜上，再写斜下斜上（两个 v）', grid: '中格', steps: ['① 第一个 V', '② 第二个 V'], note: '两笔写成，占满中格' },
    'z': { read: 'zi', stroke: '一笔横折横', grid: '中格', steps: ['① 横折横'], note: '一笔写成，上下平齐' },
    'c': { read: 'ci', stroke: '一笔左半圆', grid: '中格', steps: ['① 左半圆'], note: '一笔写成，开口向右' },
    's': { read: 'si', stroke: '一笔左弯竖右弯', grid: '中格', steps: ['① 左弯竖右弯'], note: '一笔写成，占满中格' },
    'zh': { read: 'zhi', stroke: '先写 z，再写 h', grid: '中/上中格', steps: ['① 横折横（z）', '② 上格出头竖', '③ 左弯竖（h）'], note: '组合音：z + h' },
    'ch': { read: 'chi', stroke: '先写 c，再写 h', grid: '中/上中格', steps: ['① 左半圆（c）', '② 上格出头竖', '③ 左弯竖（h）'], note: '组合音：c + h' },
    'sh': { read: 'shi', stroke: '先写 s，再写 h', grid: '中/上中格', steps: ['① 左弯竖右弯（s）', '② 上格出头竖', '③ 左弯竖（h）'], note: '组合音：s + h' }
};

const PINYIN_DATA = {
    // 声母 23 个
    shengmu: [
        { c: 'b',  read: 'bo', parts: ['b'] },
        { c: 'p',  read: 'po', parts: ['p'] },
        { c: 'm',  read: 'mo', parts: ['m'] },
        { c: 'f',  read: 'fo', parts: ['f'] },
        { c: 'd',  read: 'de', parts: ['d'] },
        { c: 't',  read: 'te', parts: ['t'] },
        { c: 'n',  read: 'ne', parts: ['n'] },
        { c: 'l',  read: 'le', parts: ['l'] },
        { c: 'g',  read: 'ge', parts: ['g'] },
        { c: 'k',  read: 'ke', parts: ['k'] },
        { c: 'h',  read: 'he', parts: ['h'] },
        { c: 'j',  read: 'ji', parts: ['j'] },
        { c: 'q',  read: 'qi', parts: ['q'] },
        { c: 'x',  read: 'xi', parts: ['x'] },
        { c: 'zh', read: 'zhi', parts: ['z', 'h'] },
        { c: 'ch', read: 'chi', parts: ['c', 'h'] },
        { c: 'sh', read: 'shi', parts: ['s', 'h'] },
        { c: 'r',  read: 'ri', parts: ['r'] },
        { c: 'z',  read: 'zi', parts: ['z'] },
        { c: 'c',  read: 'ci', parts: ['c'] },
        { c: 's',  read: 'si', parts: ['s'] },
        { c: 'y',  read: 'yi', parts: ['y'] },
        { c: 'w',  read: 'wu', parts: ['w'] }
    ],
    // 韵母 24 个
    yunmu: {
        dan: [ // 单韵母 6
            { c: 'a', read: 'a', parts: ['a'] },
            { c: 'o', read: 'o', parts: ['o'] },
            { c: 'e', read: 'e', parts: ['e'] },
            { c: 'i', read: 'i', parts: ['i'] },
            { c: 'u', read: 'u', parts: ['u'] },
            { c: 'ü', read: 'ü', parts: ['ü'] }
        ],
        fu: [ // 复韵母 8
            { c: 'ai', read: 'ai', parts: ['a', 'i'] },
            { c: 'ei', read: 'ei', parts: ['e', 'i'] },
            { c: 'ui', read: 'ui', parts: ['u', 'i'] },
            { c: 'ao', read: 'ao', parts: ['a', 'o'] },
            { c: 'ou', read: 'ou', parts: ['o', 'u'] },
            { c: 'iu', read: 'iu', parts: ['i', 'u'] },
            { c: 'ie', read: 'ie', parts: ['i', 'e'] },
            { c: 'üe', read: 'üe', parts: ['ü', 'e'] }
        ],
        te: [ // 特殊韵母 1
            { c: 'er', read: 'er', parts: ['e', 'r'] }
        ],
        qian: [ // 前鼻韵母 5
            { c: 'an', read: 'an', parts: ['a', 'n'] },
            { c: 'en', read: 'en', parts: ['e', 'n'] },
            { c: 'in', read: 'in', parts: ['i', 'n'] },
            { c: 'un', read: 'un', parts: ['u', 'n'] },
            { c: 'ün', read: 'ün', parts: ['ü', 'n'] }
        ],
        hou: [ // 后鼻韵母 4
            { c: 'ang', read: 'ang', parts: ['a', 'n', 'g'] },
            { c: 'eng', read: 'eng', parts: ['e', 'n', 'g'] },
            { c: 'ing', read: 'ing', parts: ['i', 'n', 'g'] },
            { c: 'ong', read: 'ong', parts: ['o', 'n', 'g'] }
        ]
    },
    // 整体认读音节 16 个
    zhengti: [
        { c: 'zhi', read: 'zhi', parts: ['z', 'h', 'i'] },
        { c: 'chi', read: 'chi', parts: ['c', 'h', 'i'] },
        { c: 'shi', read: 'shi', parts: ['s', 'h', 'i'] },
        { c: 'ri',  read: 'ri',  parts: ['r', 'i'] },
        { c: 'zi',  read: 'zi',  parts: ['z', 'i'] },
        { c: 'ci',  read: 'ci',  parts: ['c', 'i'] },
        { c: 'si',  read: 'si',  parts: ['s', 'i'] },
        { c: 'yi',  read: 'yi',  parts: ['y', 'i'] },
        { c: 'wu',  read: 'wu',  parts: ['w', 'u'] },
        { c: 'yu',  read: 'yu',  parts: ['y', 'u'] },
        { c: 'ye',  read: 'ye',  parts: ['y', 'e'] },
        { c: 'yue', read: 'yue', parts: ['y', 'ü', 'e'] },
        { c: 'yuan', read: 'yuan', parts: ['y', 'u', 'a', 'n'] },
        { c: 'yin', read: 'yin', parts: ['y', 'i', 'n'] },
        { c: 'yun', read: 'yun', parts: ['y', 'ü', 'n'] },
        { c: 'ying', read: 'ying', parts: ['y', 'i', 'n', 'g'] }
    ]
};

// 工具：根据拼音字符串查找对应条目（用于学习要点里的示例点击）
function findPinyin(str) {
    const D = PINYIN_DATA;
    const all = [].concat(
        D.shengmu,
        D.yunmu.dan, D.yunmu.fu, D.yunmu.te, D.yunmu.qian, D.yunmu.hou,
        D.zhengti
    );
    return all.find(e => e.c === str) || null;
}

/* ========================================
 * 笔画书写路径（四线三格坐标，viewBox 0 0 60 80）
 * 四条线：上 y=12 / 中 y=32 / 基线 y=54 / 下 y=74
 * 每个字母按「书写顺序」给出若干 path（一笔一个），用于逐笔描红动画
 * 坐标：中格字母顶 ~y34、底 ~y54；上伸字母顶 ~y14；下伸字母底 ~y72
 * ======================================== */
const PINYIN_STROKES = {
    // 第一组：a o e
    'a': [
        // 印刷体 a：第1笔左半圆（从右上起笔逆时针绕到右下）
        'M40,34 C24,34 20,38 20,44 C20,50 24,54 40,54',
        // 第2笔右竖
        'M40,34 L40,54'
    ],
    'o': ['M30,32 C20,32 16,38 16,43 C16,48 20,54 30,54 C40,54 44,48 44,43 C44,38 40,32 30,32 Z'],
    'e': ['M17,43 L43,43 C43,35 35,32 28,33 C20,34 14,38 14,43 C14,49 20,54 28,54 C36,54 43,49 43,43'],
    // 第二组：i u ü
    'i': ['M30,32 L30,54', 'M30,22 m-1.5,0 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0'],
    'u': [
        'M18,32 L18,46 C18,51 22,54 26,54 C30,54 34,51 34,46 L34,32',
        'M34,32 L34,54'
    ],
    'ü': [
        'M18,32 L18,46 C18,51 22,54 26,54 C30,54 34,51 34,46 L34,32',
        'M34,32 L34,54',
        'M23,24 m-1.5,0 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0',
        'M30,24 m-1.5,0 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0'
    ],
    // 第三组：b p m f d t
    'b': [
        'M18,14 L18,54',
        'M18,42 C25,42 32,46 32,50 C32,54 25,54 18,54'
    ],
    'p': [
        'M18,32 L18,72',
        'M18,46 C25,46 32,50 32,54 C32,58 25,58 18,58'
    ],
    'm': [
        'M14,54 L14,38',
        'M14,38 C14,34 20,34 22,38 L22,54',
        'M22,38 C22,34 28,34 30,38 L30,54'
    ],
    'f': [
        'M30,12 C26,12 22,18 22,32 L22,54',
        'M16,32 L44,32'
    ],
    'd': [
        'M42,40 C34,40 28,44 28,48 C28,52 34,54 42,54',
        'M42,14 L42,54'
    ],
    't': [
        'M30,12 L30,54 C30,58 34,60 38,60',
        'M18,32 L42,32'
    ],
    // 第四组：n l g k h j
    'n': [
        'M17,54 L17,38',
        'M17,38 C17,34 22,34 24,38 L24,54'
    ],
    'l': ['M28,14 L28,54'],
    'g': [
        'M18,44 C25,44 32,48 32,52 C32,56 25,56 18,56',
        'M18,56 L18,66 C18,71 14,72 10,70'
    ],
    'k': [
        'M17,14 L17,54',
        'M27,38 L17,47 L27,56'
    ],
    'h': [
        'M17,14 L17,54',
        'M17,44 C23,44 28,48 30,52 L30,54'
    ],
    'j': [
        'M30,32 L30,66 C30,71 26,72 22,70',
        'M30,22 m-1.5,0 a1.5,1.5 0 1,0 3,0 a1.5,1.5 0 1,0 -3,0'
    ],
    // 第五组：q x
    'q': [
        'M42,44 C34,44 28,48 28,52 C28,56 34,56 42,56',
        'M42,32 L42,72'
    ],
    'x': [
        'M17,33 L43,53',
        'M43,33 L17,53'
    ],
    // 第六组：r z c
    'r': [
        'M17,54 L17,38',
        'M17,40 C22,38 26,40 28,44'
    ],
    'z': ['M18,34 L42,34 L18,53 L42,53'],
    'c': ['M42,36 C36,32 26,32 20,37 C15,41 15,50 22,52 C29,54 38,52 42,48'],
    // 第七组：s y w
    's': ['M41,37 C35,33 25,33 21,38 C18,43 23,47 29,47 C35,47 39,50 34,53 C29,56 21,53 19,49'],
    'y': [
        'M15,32 L30,48',
        'M45,32 L30,48 L30,64'
    ],
    'w': [
        'M14,32 L23,54 L30,40',
        'M30,40 L37,54 L46,32'
    ]
};

// 拼音 → 同音汉字：浏览器 TTS 读拉丁拼音时常读成英文/不准，
// 用对应汉字朗读可得到标准汉语拼音发音。
const PINYIN_READ_MAP = {
    // 单韵母
    'a': '啊', 'o': '喔', 'e': '鹅', 'i': '衣', 'u': '乌', 'ü': '鱼',
    // 复韵母
    'ai': '爱', 'ei': '诶', 'ui': '威', 'ao': '奥', 'ou': '欧',
    'iu': '优', 'ie': '耶', 'üe': '约',
    // 特殊
    'er': '儿',
    // 前鼻韵母
    'an': '安', 'en': '恩', 'in': '音', 'un': '温', 'ün': '晕',
    // 后鼻韵母
    'ang': '昂', 'eng': '鞥', 'ing': '英', 'ong': '翁',
    // 声母呼读音
    'b': '波', 'p': '坡', 'm': '摸', 'f': '佛',
    'd': '德', 't': '特', 'n': '呢', 'l': '勒',
    'g': '哥', 'k': '科', 'h': '喝',
    'j': '鸡', 'q': '七', 'x': '西',
    'zh': '知', 'ch': '吃', 'sh': '诗', 'r': '日',
    'z': '资', 'c': '刺', 's': '丝', 'y': '衣', 'w': '乌',
    // 整体认读音节
    'zhi': '知', 'chi': '吃', 'shi': '诗', 'ri': '日',
    'zi': '资', 'ci': '刺', 'si': '丝',
    'yi': '衣', 'wu': '乌', 'yu': '鱼',
    'ye': '耶', 'yue': '约', 'yuan': '元', 'yin': '音', 'yun': '晕', 'ying': '英',
    // 常见拼读示例
    'ba': '巴', 'xiang': '香'
};

// 标准发音音频（取自汉语拼音网 hanyupinyin.cn 的官方朗读音频，已下载到本地 audio/pinyin/）
// 键为“显示用拼音”（与 PINYIN_DATA 的 c 字段一致），值为 audio/pinyin/ 下的文件名
const PINYIN_AUDIO_BASE = 'audio/pinyin/';
const PINYIN_AUDIO = {
    // 声母（按字母命名）
    'b':'b.mp3','p':'p.mp3','m':'m.mp3','f':'f.mp3','d':'d.mp3','t':'t.mp3','n':'n.mp3','l':'l.mp3',
    'g':'g.mp3','k':'k.mp3','h':'h.mp3','j':'j.mp3','q':'q.mp3','x':'x.mp3',
    'zh':'zh.mp3','ch':'ch.mp3','sh':'sh.mp3','r':'r.mp3','z':'z.mp3','c':'c.mp3','s':'s.mp3','y':'y.mp3','w':'w.mp3',
    // 韵母
    'a':'a.mp3','o':'o.mp3','e':'e.mp3','i':'i.mp3','u':'u.mp3','ü':'v.mp3',
    'ai':'ai.mp3','ei':'ei.mp3','ui':'ui.mp3','ao':'ao.mp3','ou':'ou.mp3','iu':'iu.mp3','ie':'ie.mp3','üe':'ve.mp3','er':'er.mp3',
    'an':'an.mp3','en':'en.mp3','in':'in.mp3','un':'un.mp3','ün':'vn.mp3','ang':'ang.mp3','eng':'eng.mp3','ing':'ing.mp3','ong':'ong.mp3',
    // 整体认读音节（文件名带 1 后缀）
    'zhi':'zhi1.mp3','chi':'chi1.mp3','shi':'shi1.mp3','ri':'ri1.mp3','zi':'zi1.mp3','ci':'ci1.mp3','si':'si1.mp3',
    'yi':'yi1.mp3','wu':'wu1.mp3','yu':'yu1.mp3','ye':'ye1.mp3','yue':'yue1.mp3','yuan':'yuan1.mp3','yin':'yin1.mp3','yun':'yun1.mp3','ying':'ying1.mp3'
};

// 挂到全局，供 app.js 使用（经典脚本顶层 const 不会自动成为 window 属性）
window.PINYIN_DATA = PINYIN_DATA;
window.PINYIN_LETTERS = PINYIN_LETTERS;
window.PINYIN_STROKES = PINYIN_STROKES;
window.PINYIN_READ_MAP = PINYIN_READ_MAP;
window.PINYIN_AUDIO_BASE = PINYIN_AUDIO_BASE;
window.PINYIN_AUDIO = PINYIN_AUDIO;
window.findPinyin = findPinyin;
