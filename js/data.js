/* ========================================
 * 星星之火 - 题库与课文数据
 * ======================================== */

// ===== 拼音词库 =====
const PINYIN_WORDS = [
    {w:"春天",p:"chuntian"},{w:"春风",p:"chunfeng"},{w:"春雨",p:"chunyu"},{w:"冬天",p:"dongtian"},{w:"雪花",p:"xuehua"},
    {w:"飞入",p:"feiru"},{w:"说话",p:"shuohua"},{w:"朋友",p:"pengyou"},{w:"你们",p:"nimen"},{w:"红花",p:"honghua"},
    {w:"绿草",p:"lvcao"},{w:"花草",p:"huacao"},{w:"爷爷",p:"yeye"},{w:"岁月",p:"suiyue"},{w:"飞行",p:"feixing"},
    {w:"亲手",p:"qinshou"},{w:"节日",p:"jieri"},{w:"古人",p:"guren"},{w:"忙人",p:"mangren"},{w:"洗手",p:"xishou"},
    {w:"认真",p:"renzhen"},{w:"扫地",p:"saodi"},{w:"父母",p:"fumu"},{w:"爸爸",p:"baba"},{w:"全家",p:"quanjia"},
    {w:"关门",p:"guanmen"},{w:"高兴",p:"gaoxing"},{w:"妈妈",p:"mama"},{w:"奶奶",p:"nainai"},{w:"中午",p:"zhongwu"},
    {w:"月亮",p:"yueliang"},{w:"语文",p:"yuwen"},{w:"听见",p:"tingjian"},{w:"方向",p:"fangxiang"},{w:"主意",p:"zhuyi"},
    {w:"一起",p:"yiqi"},{w:"明白",p:"mingbai"},{w:"先生",p:"xiansheng"},{w:"干净",p:"ganjing"},{w:"工人",p:"gongren"},
    {w:"专心",p:"zhuanxin"},{w:"人才",p:"rencai"},{w:"年级",p:"nianji"},{w:"队长",p:"duizhang"},{w:"蚂蚁",p:"mayi"},
    {w:"天空",p:"tiankong"},{w:"古诗",p:"gushi"},{w:"儿童",p:"ertong"},{w:"黄牛",p:"huangniu"},{w:"立正",p:"lizheng"},
    {w:"飞机",p:"feiji"},{w:"花朵",p:"huaduo"},{w:"绿叶",p:"lvye"},{w:"小时",p:"xiaoshi"},{w:"很多",p:"henduo"},
    {w:"虫子",p:"chongzi"},{w:"姐姐",p:"jiejie"},{w:"借来",p:"jielai"},{w:"哪里",p:"nail"},{w:"河边",p:"hebian"},
    {w:"最后",p:"zuihou"},{w:"力量",p:"liliang"},{w:"因为",p:"yinwei"},{w:"阳光",p:"yangguang"},{w:"可是",p:"keshi"},
    {w:"许多",p:"xuduo"},{w:"办法",p:"banfa"},{w:"别人",p:"bieren"},{w:"来到",p:"laidao"},{w:"那个",p:"neige"},
    {w:"都是",p:"doushi"},{w:"千万",p:"qianwan"},{w:"百花",p:"baihua"},{w:"长高",p:"changgao"},{w:"古文",p:"guwen"},
    {w:"雨声",p:"yusheng"},{w:"用处",p:"yongchu"},{w:"收回",p:"shouhui"},{w:"女生",p:"nvsheng"},{w:"回去",p:"huiqu"},
    {w:"太平",p:"taiping"},{w:"早上",p:"zaoshang"},{w:"高唱",p:"gaochang"},{w:"连忙",p:"lianmang"},{w:"高远",p:"gaoyuan"},
    {w:"一定",p:"yiding"},{w:"总是",p:"zongshi"},{w:"赶来",p:"ganlai"},{w:"一同",p:"yitong"},{w:"工厂",p:"gongchang"},
    {w:"房前",p:"fangqian"},{w:"结网",p:"jiewang"},{w:"闭口",p:"bikou"},{w:"雨林",p:"yulin"},{w:"不是",p:"bushi"},
    {w:"送走",p:"songzou"},{w:"飞过",p:"feiguo"},{w:"让开",p:"rangkai"},{w:"得意",p:"deyi"},{w:"向往",p:"xiangwang"},
    {w:"凉风",p:"liangfeng"},{w:"公园",p:"gongyuan"},{w:"石子",p:"shizi"},{w:"笑脸",p:"xiaolian"},{w:"找水",p:"zhaoshui"},
    {w:"作业",p:"zuoye"},{w:"写字",p:"xiezi"},{w:"美丽",p:"meili"},{w:"劳动",p:"laodong"},{w:"尤其",p:"youqi"},
    {w:"车站",p:"chezhan"},{w:"如果",p:"ruguo"},{w:"认识",p:"renshi"},{w:"安全",p:"anquan"},{w:"首先",p:"shouxian"},
    {w:"壮丽",p:"zhuangli"},{w:"枫叶",p:"fengye"},{w:"日记",p:"riji"},{w:"丰收",p:"fengshou"},{w:"金色",p:"jinse"},
    {w:"波浪",p:"bolang"},{w:"电灯",p:"diandeng"},{w:"华丽",p:"huali"},{w:"已经",p:"yijing"},{w:"其它",p:"qita"},
    {w:"巨石",p:"jushi"},{w:"它们",p:"tamen"},{w:"平安",p:"pingan"},{w:"纷纷",p:"fenfen"},{w:"经过",p:"jingguo"},
    {w:"娃娃",p:"wawa"},{w:"山洼",p:"shanwa"},{w:"于是",p:"yushi"},{w:"树枝",p:"shuzhi"},{w:"观看",p:"guankan"},
    {w:"下棋",p:"xiaqi"},{w:"弹琴",p:"tanqin"},{w:"唱戏",p:"changxi"},{w:"养鱼",p:"yangyu"},{w:"画画",p:"huahua"},
    {w:"休息",p:"xiuxi"},{w:"伸手",p:"shenshou"},{w:"唱歌",p:"changge"},{w:"小院",p:"xiaoyuan"},{w:"您好",p:"ninhao"},
    {w:"甜美",p:"tianmei"},{w:"牵挂",p:"qianggua"},{w:"老师",p:"laoshi"},{w:"枝叶",p:"zhiye"},{w:"学校",p:"xuexiao"},
    {w:"教室",p:"jiaoshi"},{w:"班级",p:"banji"},{w:"亲切",p:"qinqie"},{w:"响亮",p:"xiangliang"},{w:"闹钟",p:"naozhong"},
    {w:"叹气",p:"tanqi"},{w:"哈欠",p:"haqian"},{w:"迟到",p:"chidao"},{w:"座位",p:"zuowei"},{w:"非常",p:"feichang"},
    {w:"仔细",p:"zixi"},{w:"夕阳",p:"xiyang"},{w:"山川",p:"shanchuan"},{w:"民族",p:"minzu"},{w:"神州",p:"shenzhou"},
    {w:"争气",p:"zhengqi"},{w:"黄河",p:"huanghe"},{w:"长江",p:"changjiang"},{w:"台湾",p:"taiwan"},{w:"人民",p:"renmin"},
    {w:"洁白",p:"jiebai"},{w:"旗帜",p:"qizhi"},{w:"歌曲",p:"gequ"},{w:"欢乐",p:"huanle"},{w:"城市",p:"chengshi"},
    {w:"旁边",p:"pangbian"},{w:"优美",p:"youmei"},{w:"国家",p:"guojia"},{w:"图画",p:"tuhua"},{w:"中央",p:"zhongyang"},
    {w:"北京",p:"beijing"},{w:"泪水",p:"leishui"},{w:"拥抱",p:"yongbao"},{w:"海洋",p:"haiyang"},{w:"互相",p:"huxiang"},
    {w:"申请",p:"shenqing"},{w:"国旗",p:"guoqi"},{w:"故乡",p:"guxiang"},{w:"尺寸",p:"chicun"},{w:"拔草",p:"bacao"},
    {w:"立功",p:"ligong"},{w:"落叶",p:"luoye"},{w:"帮助",p:"bangzhu"},{w:"青蛙",p:"qingwa"},{w:"抬头",p:"taitou"},
    {w:"回答",p:"huida"},{w:"相信",p:"xiangxin"},{w:"看见",p:"kanjian"},{w:"挂上",p:"guashang"},{w:"奇怪",p:"qiguai"},
    {w:"可爱",p:"keai"},{w:"治病",p:"zhibing"},{w:"慢跑",p:"manpao"},{w:"怎样",p:"zenyang"},{w:"衣服",p:"yifu"},
    {w:"院子",p:"yuanzi"},{w:"漂亮",p:"piaoliang"},{w:"思想",p:"sixiang"},{w:"比方",p:"bifang"},{w:"飞快",p:"feikuai"},
    {w:"急忙",p:"jimang"},{w:"呼吸",p:"huxi"},{w:"汗水",p:"hanshui"},{w:"伤心",p:"shangxin"},{w:"时候",p:"shihou"},
    {w:"兔子",p:"tuzi"},{w:"狐狸",p:"huli"},{w:"猴子",p:"houzi"},{w:"告诉",p:"gaosu"},{w:"颗粒",p:"keli"},
    {w:"容易",p:"rongyi"},{w:"树根",p:"shugen"},{w:"独自",p:"duzi"},{w:"满意",p:"manyi"},{w:"采果",p:"caiguo"},
    {w:"称赞",p:"chengzan"},{w:"但是",p:"danshi"},{w:"傍晚",p:"bangwan"},{w:"清静",p:"qingjing"},{w:"消失",p:"xiaoshi"},
    {w:"消灭",p:"xiaomie"},{w:"心意",p:"xinyi"},{w:"自由",p:"ziyou"},{w:"铅笔",p:"qianbi"},{w:"桌子",p:"zhuozi"},
    {w:"风景",p:"fengjing"},{w:"拿手",p:"nashou"},{w:"坏人",p:"huairen"},{w:"放松",p:"fangsong"},{w:"抓住",p:"zhuazhu"},
    {w:"祝福",p:"zhufu"},{w:"幸福",p:"xingfu"},{w:"命令",p:"mingling"},{w:"公布",p:"gongbu"},{w:"直线",p:"zhixian"},
    {w:"当时",p:"dangshi"},{w:"现在",p:"xianzai"},{w:"出现",p:"chuxian"},{w:"轮流",p:"lunliu"},{w:"道路",p:"daolu"},
    {w:"永远",p:"yongyuan"},{w:"温暖",p:"wennuan"},{w:"富有",p:"fuyou"},{w:"窗户",p:"chuanghu"},{w:"生病",p:"shengbing"},
    {w:"开始",p:"kaishi"},{w:"张开",p:"zhangkai"},{w:"寻找",p:"xunzhao"},{w:"哭泣",p:"kuqi"},{w:"优良",p:"youliang"},
    {w:"食物",p:"shiwu"},{w:"体育",p:"tiyu"},{w:"操场",p:"caochang"},{w:"场地",p:"changdi"},{w:"粉笔",p:"fenbi"},
    {w:"晴天",p:"qingtian"},{w:"姑娘",p:"guniang"},{w:"读书",p:"dushu"},{w:"乘车",p:"chengche"},{w:"声音",p:"shengyin"},
    {w:"客人",p:"keren"},{w:"丛林",p:"conglin"},{w:"花丛",p:"huacong"},{w:"牢记",p:"laoji"},{w:"拍手",p:"paishou"},
    {w:"保护",p:"baohu"},{w:"爱护",p:"aihu"},{w:"保证",p:"baozheng"},{w:"动物",p:"dongwu"},{w:"小鸡",p:"xiaoji"},
    {w:"小猫",p:"xiaomao"},{w:"羽毛",p:"yumao"},{w:"领唱",p:"lingchang"},{w:"捉虫",p:"zhuochong"},{w:"理由",p:"liyou"},
    {w:"活跃",p:"huoyue"},{w:"飞跃",p:"feiyue"},{w:"机灵",p:"jiling"},{w:"早晨",p:"zaochen"},{w:"清晨",p:"qingchen"},
    {w:"眼睛",p:"yanjing"},{w:"纸张",p:"zhizhang"},{w:"船只",p:"chuanzhi"},{w:"更加",p:"gengjia"},{w:"知识",p:"zhishi"},
    {w:"皮毛",p:"pimao"},{w:"变法",p:"bianfa"},{w:"一片",p:"yipian"},{w:"作品",p:"zuopin"},{w:"送给",p:"songgei"},
    {w:"带领",p:"dailing"},{w:"方法",p:"fangfa"},{w:"花园",p:"huayuan"},{w:"小桥",p:"xiaoqiao"},{w:"队旗",p:"duiqi"},
    {w:"铜号",p:"tonghao"},{w:"杨树",p:"yangshu"},{w:"松柏",p:"songbai"},{w:"棉花",p:"mianhua"},{w:"桂花",p:"guihua"},
    {w:"深处",p:"shenchu"},{w:"熊猫",p:"xiongmao"},{w:"四季",p:"siji"},{w:"吹风",p:"chuifeng"},{w:"农事",p:"nongshi"},
    {w:"辛苦",p:"xinku"},{w:"过年",p:"guonian"},{w:"柱子",p:"zhuzi"},{w:"秤杆",p:"chengan"},{w:"站立",p:"zhanli"},
    {w:"上课",p:"shangke"},{w:"今天",p:"jintian"},{w:"台灯",p:"taideng"},{w:"起来",p:"qilai"},{w:"楼房",p:"loufang"},
    {w:"南部",p:"nanbu"},{w:"巨大",p:"juda"},{w:"每天",p:"meitian"},{w:"升起",p:"shengqi"},{w:"名字",p:"mingzi"},
    {w:"胜利",p:"shengli"},{w:"展现",p:"zhanxian"},{w:"山坡",p:"shanpo"},{w:"利用",p:"liyong"},{w:"井口",p:"jingkou"},
    {w:"口渴",p:"kouke"},{w:"喝水",p:"heshui"},{w:"国际",p:"guoji"},{w:"一阵",p:"yizhen"},{w:"晴朗",p:"qinglang"},
    {w:"做操",p:"zuocao"},{w:"将军",p:"jiangjun"},{w:"夜晚",p:"yewan"},{w:"喜欢",p:"xihuan"},{w:"游戏",p:"youxi"},
    {w:"浓密",p:"nongmi"},{w:"飞鸟",p:"feiniao"},{w:"大海",p:"dahai"},{w:"竹叶",p:"zhuye"},
    {w:"太阳",p:"taiyang"},{w:"星星",p:"xingxing"},{w:"白云",p:"baiyun"},{w:"蓝天",p:"lantian"},{w:"草地",p:"caodi"},
    {w:"果园",p:"guoyuan"},{w:"小河",p:"xiaohe"},{w:"流水",p:"liushui"},{w:"鱼儿",p:"yuer"},{w:"小鸟",p:"xiaoniao"},
    {w:"蝴蝶",p:"hudie"},{w:"蜜蜂",p:"mifeng"},{w:"大象",p:"daxiang"},{w:"老虎",p:"laohu"},{w:"长颈鹿",p:"changjinglu"},
    {w:"孔雀",p:"kongque"},{w:"乌鸦",p:"wuya"},{w:"喜鹊",p:"xique"},{w:"燕子",p:"yanzi"},{w:"蝌蚪",p:"kedou"},
    {w:"荷叶",p:"heye"},{w:"莲花",p:"lianhua"},{w:"杨柳",p:"yangliu"},{w:"桃树",p:"taoshu"},{w:"杏树",p:"xingshu"},
    {w:"苹果",p:"pingguo"},{w:"西瓜",p:"xigua"},{w:"香蕉",p:"xiangjiao"},{w:"草莓",p:"caomei"},{w:"葡萄",p:"putao"},
    {w:"米饭",p:"mifan"},{w:"面条",p:"miantiao"},{w:"包子",p:"baozi"},{w:"饺子",p:"jiaozi"},{w:"蛋糕",p:"dangao"},
    {w:"牛奶",p:"niunai"},{w:"鸡蛋",p:"jidan"},{w:"鱼肉",p:"yurou"},{w:"蔬菜",p:"shucai"},{w:"萝卜",p:"luobo"},
    {w:"白菜",p:"baicai"},{w:"土豆",p:"tudou"},{w:"西红柿",p:"xihongshi"},{w:"黄瓜",p:"huanggua"},{w:"书包",p:"shubao"},
    {w:"文具",p:"wenju"},{w:"橡皮",p:"xiangpi"},{w:"尺子",p:"chizi"},{w:"本子",p:"benzi"},{w:"课本",p:"keben"},
    {w:"练习",p:"lianxi"},{w:"跳舞",p:"tiaowu"},{w:"跑步",p:"paobu"},{w:"跳绳",p:"tiaosheng"},{w:"踢球",p:"tiqiu"},
    {w:"玩具",p:"wanju"},{w:"积木",p:"jimu"},{w:"拼图",p:"pintu"},{w:"电视",p:"dianshi"},{w:"电话",p:"dianhua"},
    {w:"电脑",p:"diannao"},{w:"手机",p:"shouji"},{w:"手表",p:"shoubiao"},{w:"帽子",p:"maozi"},{w:"鞋子",p:"xiezi"},
    {w:"裤子",p:"kuzi"},{w:"袜子",p:"wazi"},{w:"围巾",p:"weijin"},{w:"手套",p:"shoutao"},{w:"雨伞",p:"yusan"},
    {w:"雨衣",p:"yuyi"},{w:"椅子",p:"yizi"},{w:"沙发",p:"shafa"},{w:"床铺",p:"chuangpu"},{w:"枕头",p:"zhentou"},
    {w:"被子",p:"beizi"},{w:"大门",p:"damen"},{w:"电梯",p:"dianti"},{w:"楼梯",p:"louti"},{w:"马路",p:"malu"},
    {w:"汽车",p:"qiche"},{w:"火车",p:"huoche"},{w:"轮船",p:"lunchuan"},{w:"地铁",p:"ditie"},{w:"公交",p:"gongjiao"},
    {w:"图书馆",p:"tushuguan"},{w:"医院",p:"yiyuan"},{w:"银行",p:"yinhang"},{w:"超市",p:"chaoshi"},{w:"商场",p:"shangchang"},
    {w:"饭店",p:"fandian"},{w:"家里",p:"jiali"},{w:"哥哥",p:"gege"},{w:"弟弟",p:"didi"},{w:"妹妹",p:"meimei"},
    {w:"叔叔",p:"shushu"},{w:"阿姨",p:"ayi"},{w:"同学",p:"tongxue"},{w:"邻居",p:"linju"},{w:"快乐",p:"kuaile"},
    {w:"开心",p:"kaixin"},{w:"难过",p:"nanguo"},{w:"生气",p:"shengqi"},{w:"害怕",p:"haipa"},{w:"勇敢",p:"yonggan"},
    {w:"善良",p:"shanliang"},{w:"聪明",p:"congming"},{w:"努力",p:"nuli"}
];

// 拼音映射(仅示例常用词的拼音，运行时用TTS)
const PINYIN_MAP = {};

// ===== 英语单词库 (一上) =====
const ENGLISH_WORDS = [
    { en: "noodles", zh: "面条" },
    { en: "baozi", zh: "包子" },
    { en: "rice", zh: "米饭" },
    { en: "carrot", zh: "胡萝卜" },
    { en: "tomato", zh: "西红柿" },
    { en: "bread", zh: "面包" },
    { en: "egg", zh: "鸡蛋" },
    { en: "milk", zh: "牛奶" },
    { en: "window", zh: "窗户" },
    { en: "blackboard", zh: "黑板" },
    { en: "door", zh: "门" },
    { en: "desk", zh: "课桌" },
    { en: "chair", zh: "椅子" },
    { en: "schoolbag", zh: "书包" },
    { en: "ride a bike", zh: "骑自行车" },
    { en: "ride a scooter", zh: "骑滑板车" },
    { en: "rollerblade", zh: "滑轮滑" },
    { en: "play football", zh: "踢足球" },
    { en: "skateboard", zh: "滑板" },
    { en: "spring", zh: "春天" },
    { en: "warm", zh: "温暖的" },
    { en: "summer", zh: "夏天" },
    { en: "hot", zh: "热的" },
    { en: "autumn", zh: "秋天" },
    { en: "cool", zh: "凉爽的" },
    { en: "winter", zh: "冬天" },
    { en: "cold", zh: "冷的" },
    { en: "season", zh: "季节" },
    { en: "fruit", zh: "水果" },
    { en: "lemon", zh: "柠檬" },
    { en: "banana", zh: "香蕉" },
    { en: "apple", zh: "苹果" },
    { en: "watermelon", zh: "西瓜" },
    { en: "pear", zh: "梨" },
    { en: "pineapple", zh: "菠萝" },
    { en: "peach", zh: "桃子" },
    { en: "orange", zh: "橙子" },
    { en: "animal", zh: "动物" },
    { en: "tadpole", zh: "蝌蚪" },
    { en: "frog", zh: "青蛙" },
    { en: "butterfly", zh: "蝴蝶" },
    { en: "goldfish", zh: "金鱼" },
    { en: "duck", zh: "鸭子" },
    { en: "tortoise", zh: "乌龟" },
    { en: "grandma", zh: "奶奶" },
    { en: "dad", zh: "爸爸" },
    { en: "grandpa", zh: "爷爷" },
    { en: "mum", zh: "妈妈" },
    { en: "brother", zh: "兄弟" },
    { en: "sister", zh: "姐妹" },
    { en: "magic", zh: "魔术" },
    { en: "pot", zh: "锅" },
    { en: "cook", zh: "做饭" },
    { en: "help", zh: "帮助" },
    { en: "stop", zh: "停止" },
    { en: "thirsty", zh: "口渴的" },
    { en: "hungry", zh: "饥饿的" },
    { en: "farm", zh: "农场" },
    { en: "juice", zh: "果汁" },
    { en: "fan", zh: "风扇" },
    { en: "trousers", zh: "裤子" },
    { en: "rabbit", zh: "兔子" },
    { en: "robot", zh: "机器人" },
    { en: "welcome", zh: "欢迎" },
    { en: "one", zh: "一" },
    { en: "two", zh: "二" },
    { en: "three", zh: "三" },
    { en: "four", zh: "四" },
    { en: "pencil", zh: "铅笔" },
    { en: "ruler", zh: "尺子" },
    { en: "eraser", zh: "橡皮" },
    { en: "pencil case", zh: "铅笔盒" },
    { en: "school", zh: "学校" },
    { en: "bag", zh: "包" },
    { en: "see", zh: "看见" },
    { en: "draw", zh: "画画" },
    { en: "where", zh: "哪里" },
    { en: "have", zh: "有" },
    { en: "sorry", zh: "对不起" },
    { en: "use", zh: "使用" },
    { en: "them", zh: "它们" },
    { en: "pen", zh: "钢笔" },
    { en: "crayon", zh: "蜡笔" },
    { en: "write", zh: "写" },
    { en: "read", zh: "读" },
    { en: "sing", zh: "唱歌" },
    { en: "dance", zh: "跳舞" },
    { en: "swim", zh: "游泳" },
    { en: "fly", zh: "飞" },
    { en: "run", zh: "跑" },
    { en: "ride", zh: "骑" },
    { en: "bike", zh: "自行车" },
    { en: "violin", zh: "小提琴" },
    { en: "play", zh: "玩" },
    { en: "bird", zh: "鸟" },
    { en: "fish", zh: "鱼" },
    { en: "jump", zh: "跳" },
    { en: "work", zh: "工作" },
    { en: "sleep", zh: "睡觉" },
    { en: "dog", zh: "狗" },
    { en: "cat", zh: "猫" },
    { en: "hamster", zh: "仓鼠" },
    { en: "nest", zh: "巢" },
    { en: "garden", zh: "花园" },
    { en: "baby", zh: "婴儿" },
    { en: "lovely", zh: "可爱的" },
    { en: "careful", zh: "小心的" },
    { en: "little", zh: "小的" },
    { en: "red", zh: "红色" },
    { en: "white", zh: "白色" },
    { en: "yellow", zh: "黄色" },
    { en: "green", zh: "绿色" },
    { en: "blue", zh: "蓝色" },
    { en: "black", zh: "黑色" },
    { en: "park", zh: "公园" },
    { en: "tree", zh: "树" },
    { en: "flower", zh: "花" },
    { en: "kite", zh: "风筝" },
    { en: "game", zh: "游戏" },
    { en: "chameleon", zh: "变色龙" },
    { en: "colourful", zh: "色彩缤纷的" },
    { en: "plant", zh: "植物" },
    { en: "zoo", zh: "动物园" }
];

// ===== 英语短句库 (270条) =====
const ENGLISH_SENTENCES = [
    // Part 1: Morning & School (1-50)
    { en: "Good morning!", zh: "早上好！" },
    { en: "Time to wake up!", zh: "该起床啦！" },
    { en: "I am awake.", zh: "我醒了。" },
    { en: "I open my eyes.", zh: "我睁开眼睛。" },
    { en: "I stretch my arms.", zh: "我伸懒腰。" },
    { en: "I get out of bed.", zh: "我起床了。" },
    { en: "I go to the bathroom.", zh: "我去洗手间。" },
    { en: "I brush my teeth.", zh: "我刷牙。" },
    { en: "I wash my face.", zh: "我洗脸。" },
    { en: "I comb my hair.", zh: "我梳头。" },
    { en: "I get dressed.", zh: "我穿衣服。" },
    { en: "I put on my socks.", zh: "我穿上袜子。" },
    { en: "I put on my shoes.", zh: "我穿上鞋子。" },
    { en: "I eat breakfast.", zh: "我吃早饭。" },
    { en: "I drink some milk.", zh: "我喝牛奶。" },
    { en: "I have an egg.", zh: "我吃一个鸡蛋。" },
    { en: "I eat bread.", zh: "我吃面包。" },
    { en: "I am full.", zh: "我吃饱了。" },
    { en: "I pack my schoolbag.", zh: "我整理书包。" },
    { en: "I put my books in my bag.", zh: "我把书放进书包。" },
    { en: "I take my lunch box.", zh: "我带上午餐盒。" },
    { en: "I put on my hat.", zh: "我戴上帽子。" },
    { en: "I carry my schoolbag.", zh: "我背起书包。" },
    { en: "I go to school.", zh: "我去上学。" },
    { en: "I walk to school.", zh: "我走路去学校。" },
    { en: "I get in the car.", zh: "我上车。" },
    { en: "I see my friend.", zh: "我看到了我的朋友。" },
    { en: "We say hello.", zh: "我们打招呼。" },
    { en: "We walk together.", zh: "我们一起走。" },
    { en: "We hold hands.", zh: "我们手牵手。" },
    { en: "I am at school.", zh: "我到学校了。" },
    { en: "I go to my classroom.", zh: "我去教室。" },
    { en: "I see my teacher.", zh: "我看到了我的老师。" },
    { en: "I say, 'Good morning, teacher!'", zh: "我说：老师，早上好！" },
    { en: "I put my bag down.", zh: "我放下书包。" },
    { en: "I sit at my desk.", zh: "我坐在座位上。" },
    { en: "I take out my pencil.", zh: "我拿出铅笔。" },
    { en: "I take out my book.", zh: "我拿出书本。" },
    { en: "I listen to the teacher.", zh: "我听老师讲课。" },
    { en: "I read a book.", zh: "我读书。" },
    { en: "I write my name.", zh: "我写我的名字。" },
    { en: "I raise my hand.", zh: "我举手。" },
    { en: "I ask a question.", zh: "我问问题。" },
    { en: "I am a good student.", zh: "我是个好学生。" },
    { en: "I have a pencil case.", zh: "我有一个铅笔盒。" },
    { en: "My friend has a new bag.", zh: "我的朋友有一个新书包。" },
    { en: "I can see the board.", zh: "我能看到黑板。" },
    { en: "I write on the board.", zh: "我在黑板上写字。" },
    { en: "I clean the board.", zh: "我擦黑板。" },
    { en: "School is fun.", zh: "上学很有趣。" },
    // Part 2: School & Classroom (51-75)
    { en: "I like my school.", zh: "我喜欢我的学校。" },
    { en: "My classroom is big.", zh: "我的教室很大。" },
    { en: "There are many desks.", zh: "有很多课桌。" },
    { en: "There are many chairs.", zh: "有很多椅子。" },
    { en: "The window is open.", zh: "窗户是开着的。" },
    { en: "The door is closed.", zh: "门是关着的。" },
    { en: "I have a new book.", zh: "我有一本新书。" },
    { en: "I have a red pencil.", zh: "我有一支红铅笔。" },
    { en: "I have a blue pen.", zh: "我有一支蓝色钢笔。" },
    { en: "I have an eraser.", zh: "我有一块橡皮。" },
    { en: "I have a ruler.", zh: "我有一把尺子。" },
    { en: "My bag is heavy.", zh: "我的书包很重。" },
    { en: "I open my book.", zh: "我打开书。" },
    { en: "I close my book.", zh: "我合上书。" },
    { en: "I turn the page.", zh: "我翻页。" },
    { en: "I draw a picture.", zh: "我画一幅画。" },
    { en: "I colour the picture.", zh: "我给画涂色。" },
    { en: "I cut the paper.", zh: "我剪纸。" },
    { en: "I glue the paper.", zh: "我粘纸。" },
    { en: "I fold the paper.", zh: "我折纸。" },
    { en: "My teacher is kind.", zh: "我的老师很和蔼。" },
    { en: "My teacher is nice.", zh: "我的老师很好。" },
    { en: "We learn English.", zh: "我们学英语。" },
    { en: "We learn Chinese.", zh: "我们学语文。" },
    { en: "We learn math.", zh: "我们学数学。" },
    // Part 3: Daily Life & Home (76-130)
    { en: "I go home.", zh: "我回家。" },
    { en: "I am at home.", zh: "我在家。" },
    { en: "I take off my shoes.", zh: "我脱鞋。" },
    { en: "I wash my hands.", zh: "我洗手。" },
    { en: "I change my clothes.", zh: "我换衣服。" },
    { en: "I have a snack.", zh: "我吃点心。" },
    { en: "I drink some juice.", zh: "我喝果汁。" },
    { en: "I do my homework.", zh: "我做作业。" },
    { en: "I write my homework.", zh: "我写作业。" },
    { en: "I read a story.", zh: "我读故事。" },
    { en: "I play with my toys.", zh: "我玩玩具。" },
    { en: "I play a game.", zh: "我玩游戏。" },
    { en: "I build with blocks.", zh: "我搭积木。" },
    { en: "I play with my car.", zh: "我玩玩具车。" },
    { en: "I draw a picture.", zh: "我画画。" },
    { en: "I watch a cartoon.", zh: "我看动画片。" },
    { en: "My mom is home.", zh: "我妈妈在家。" },
    { en: "My dad is home.", zh: "我爸爸在家。" },
    { en: "We sit together.", zh: "我们坐在一起。" },
    { en: "We talk together.", zh: "我们一起聊天。" },
    { en: "We eat dinner.", zh: "我们吃晚饭。" },
    { en: "I eat rice.", zh: "我吃米饭。" },
    { en: "I eat vegetables.", zh: "我吃蔬菜。" },
    { en: "I eat meat.", zh: "我吃肉。" },
    { en: "I eat soup.", zh: "我喝汤。" },
    { en: "I drink water.", zh: "我喝水。" },
    { en: "I take a bath.", zh: "我洗澡。" },
    { en: "The water is warm.", zh: "水很暖和。" },
    { en: "I play with bubbles.", zh: "我玩泡泡。" },
    { en: "I dry myself.", zh: "我擦干身体。" },
    { en: "I put on my pajamas.", zh: "我穿上睡衣。" },
    { en: "I brush my teeth again.", zh: "我再次刷牙。" },
    { en: "I read a bedtime story.", zh: "我读睡前故事。" },
    { en: "It is time for bed.", zh: "该睡觉了。" },
    { en: "I get into my bed.", zh: "我上床。" },
    { en: "I give a hug.", zh: "我拥抱。" },
    { en: "I say goodnight.", zh: "我说晚安。" },
    { en: "I am sleepy.", zh: "我困了。" },
    { en: "I close my eyes.", zh: "我闭上眼睛。" },
    { en: "I have a dream.", zh: "我做了一个梦。" },
    { en: "I love my family.", zh: "我爱我的家人。" },
    { en: "My mom is nice.", zh: "我妈妈很好。" },
    { en: "My dog is cute.", zh: "我的狗很可爱。" },
    { en: "I walk my dog.", zh: "我遛狗。" },
    { en: "I feed my fish.", zh: "我喂我的鱼。" },
    { en: "The fish is orange.", zh: "这条鱼是橙色的。" },
    { en: "I watch TV.", zh: "我看电视。" },
    { en: "It is a cartoon.", zh: "它是动画片。" },
    { en: "I like cartoons.", zh: "我喜欢动画片。" },
    { en: "I use a spoon.", zh: "我用勺子。" },
    // Part 4: Outdoor & Play (131-170)
    { en: "Let's go outside!", zh: "我们出去玩吧！" },
    { en: "It is sunny today.", zh: "今天天气晴朗。" },
    { en: "The sky is blue.", zh: "天空是蓝色的。" },
    { en: "I can see a cloud.", zh: "我看到一朵云。" },
    { en: "The cloud is white.", zh: "云是白色的。" },
    { en: "I see the moon.", zh: "我看到了月亮。" },
    { en: "I see the stars.", zh: "我看到了星星。" },
    { en: "I look at the flowers.", zh: "我看着花朵。" },
    { en: "The flower is red.", zh: "这朵花是红色的。" },
    { en: "I see a butterfly.", zh: "我看到一只蝴蝶。" },
    { en: "The butterfly is pretty.", zh: "蝴蝶很漂亮。" },
    { en: "I see a bird.", zh: "我看到一只鸟。" },
    { en: "The bird can fly.", zh: "鸟会飞。" },
    { en: "I see a cat.", zh: "我看到一只猫。" },
    { en: "The cat says 'meow'.", zh: "猫喵喵叫。" },
    { en: "I see a dog.", zh: "我看到一只狗。" },
    { en: "The dog is big.", zh: "这只狗很大。" },
    { en: "I go to the park.", zh: "我去公园。" },
    { en: "I play on the swings.", zh: "我荡秋千。" },
    { en: "I go down the slide.", zh: "我滑滑梯。" },
    { en: "I play in the sandbox.", zh: "我在沙坑里玩。" },
    { en: "I dig in the sand.", zh: "我在沙子里挖。" },
    { en: "I make a sandcastle.", zh: "我堆沙堡。" },
    { en: "I ride my bike.", zh: "我骑自行车。" },
    { en: "I wear my helmet.", zh: "我戴头盔。" },
    { en: "I run fast.", zh: "我跑得很快。" },
    { en: "I jump over the puddle.", zh: "我跳过水坑。" },
    { en: "I play catch.", zh: "我玩接球游戏。" },
    { en: "I throw the ball.", zh: "我扔球。" },
    { en: "I catch the ball.", zh: "我接球。" },
    { en: "I kick the ball.", zh: "我踢球。" },
    { en: "We have a picnic.", zh: "我们野餐。" },
    { en: "I eat a sandwich.", zh: "我吃三明治。" },
    { en: "I drink juice.", zh: "我喝果汁。" },
    { en: "I see a rainbow.", zh: "我看到一道彩虹。" },
    { en: "The rainbow has many colors.", zh: "彩虹有很多颜色。" },
    { en: "I feel the wind.", zh: "我感觉到风。" },
    { en: "It is a nice day.", zh: "今天天气真好。" },
    { en: "I have fun.", zh: "我玩得很开心。" },
    { en: "Let's go home now.", zh: "我们现在回家吧。" },
    // Part 5: Feelings & Social (171-200)
    { en: "How are you?", zh: "你好吗？" },
    { en: "I am fine, thank you.", zh: "我很好，谢谢。" },
    { en: "I am happy.", zh: "我很快乐。" },
    { en: "I am sad.", zh: "我很难过。" },
    { en: "I am angry.", zh: "我很生气。" },
    { en: "I am scared.", zh: "我很害怕。" },
    { en: "I am surprised.", zh: "我很惊讶。" },
    { en: "I am excited!", zh: "我很兴奋！" },
    { en: "I am tired.", zh: "我累了。" },
    { en: "Are you okay?", zh: "你还好吗？" },
    { en: "Yes, I am okay.", zh: "是的，我很好。" },
    { en: "Please help me.", zh: "请帮助我。" },
    { en: "Thank you.", zh: "谢谢你。" },
    { en: "You are welcome.", zh: "不客气。" },
    { en: "I am sorry.", zh: "对不起。" },
    { en: "That is okay.", zh: "没关系。" },
    { en: "I love you.", zh: "我爱你。" },
    { en: "I miss you.", zh: "我想你。" },
    { en: "Can I help?", zh: "我能帮忙吗？" },
    { en: "I want to be your friend.", zh: "我想做你的朋友。" },
    { en: "Let's play together.", zh: "我们一起玩吧。" },
    { en: "What is your name?", zh: "你叫什么名字？" },
    { en: "My name is...", zh: "我的名字是……" },
    { en: "How old are you?", zh: "你几岁了？" },
    { en: "I am six years old.", zh: "我六岁了。" },
    { en: "Where are you going?", zh: "你要去哪里？" },
    { en: "I am going to school.", zh: "我要去学校。" },
    { en: "Look at that!", zh: "看那个！" },
    { en: "It's so beautiful!", zh: "太漂亮了！" },
    { en: "Let's be happy!", zh: "让我们快乐起来吧！" },
    // Part 6-10: Question sentences (201-270)
    { en: "Can I get up now?", zh: "我现在可以起床吗？" },
    { en: "Where are my shoes?", zh: "我的鞋子在哪里？" },
    { en: "Is it time for breakfast?", zh: "该吃早饭了吗？" },
    { en: "Can I have some milk, please?", zh: "请问我可以喝点牛奶吗？" },
    { en: "Do I need my hat today?", zh: "今天我需要戴帽子吗？" },
    { en: "Are we walking to school?", zh: "我们是走路去学校吗？" },
    { en: "Is my schoolbag ready?", zh: "我的书包准备好了吗？" },
    { en: "Can I bring my toy to school?", zh: "我可以带我的玩具去学校吗？" },
    { en: "Where is my pencil?", zh: "我的铅笔在哪里？" },
    { en: "Is this your book?", zh: "这是你的书吗？" },
    { en: "Can I borrow your pen, please?", zh: "请问我可以借你的笔吗？" },
    { en: "Can I borrow your crayon?", zh: "我可以借你的蜡笔吗？" },
    { en: "May I go to the bathroom?", zh: "我可以去洗手间吗？" },
    { en: "May I have some water?", zh: "我可以喝点水吗？" },
    { en: "Can you help me, please?", zh: "请问你能帮我吗？" },
    { en: "How do you spell this?", zh: "这个怎么拼写？" },
    { en: "What does this word mean?", zh: "这个词是什么意思？" },
    { en: "Can you say it again?", zh: "你能再说一遍吗？" },
    { en: "Is this right?", zh: "这样对吗？" },
    { en: "Can I share with you?", zh: "我可以和你一起分享吗？" },
    { en: "Can I sit next to you?", zh: "我可以坐在你旁边吗？" },
    { en: "What time is it?", zh: "现在几点了？" },
    { en: "Are we having P.E. today?", zh: "今天我们上体育课吗？" },
    { en: "Do we have homework?", zh: "我们有作业吗？" },
    { en: "Can I go to the library?", zh: "我可以去图书馆吗？" },
    { en: "What's for breakfast?", zh: "早饭吃什么？" },
    { en: "Can I have more rice, please?", zh: "请问我可以再吃点米饭吗？" },
    { en: "Where is my cup?", zh: "我的杯子在哪里？" },
    { en: "Can I watch TV now?", zh: "我现在可以看电视吗？" },
    { en: "Can I play with my toys?", zh: "我可以玩我的玩具吗？" },
    { en: "Is Daddy home?", zh: "爸爸在家吗？" },
    { en: "Where is my sister?", zh: "我姐姐/妹妹在哪里？" },
    { en: "Can I have a hug?", zh: "我可以抱抱你吗？" },
    { en: "What are we having for dinner?", zh: "我们晚饭吃什么？" },
    { en: "Can I take a bath now?", zh: "我现在可以洗澡吗？" },
    { en: "Can you read me a story?", zh: "你能给我读个故事吗？" },
    { en: "Is it time to sleep?", zh: "该睡觉了吗？" },
    { en: "Can I turn on the light?", zh: "我可以开灯吗？" },
    { en: "Where is my blanket?", zh: "我的毯子在哪里？" },
    { en: "Are you proud of me?", zh: "你为我骄傲吗？" },
    { en: "Can we go to the park?", zh: "我们可以去公园吗？" },
    { en: "Can I ride my bike?", zh: "我可以骑我的自行车吗？" },
    { en: "Can you push me on the swing?", zh: "你能推我荡秋千吗？" },
    { en: "Can I play with you?", zh: "我可以和你一起玩吗？" },
    { en: "Can I join the game?", zh: "我可以加入这个游戏吗？" },
    { en: "Whose ball is this?", zh: "这是谁的球？" },
    { en: "Is it going to rain?", zh: "要下雨了吗？" },
    { en: "Can I take off my jacket?", zh: "我可以脱掉我的外套吗？" },
    { en: "Can you take a picture of me?", zh: "你能给我拍张照吗？" },
    { en: "What is that flower called?", zh: "那朵花叫什么名字？" },
    { en: "Where is my kite?", zh: "我的风筝在哪里？" },
    { en: "Can I pet your dog?", zh: "我可以摸摸你的狗吗？" },
    { en: "Is your dog friendly?", zh: "你的狗友好吗？" },
    { en: "Can we have a picnic?", zh: "我们可以野餐吗？" },
    { en: "Are we there yet?", zh: "我们到了吗？" },
    { en: "How are you today?", zh: "你今天好吗？" },
    { en: "Why are you sad?", zh: "你为什么难过？" },
    { en: "Can I help you?", zh: "我能帮你吗？" },
    { en: "Do you want to play with me?", zh: "你想和我一起玩吗？" },
    { en: "Are you my friend?", zh: "你是我的朋友吗？" },
    { en: "Can we be friends?", zh: "我们可以做朋友吗？" },
    { en: "What's your name?", zh: "你叫什么名字？" },
    { en: "Where are you from?", zh: "你从哪里来？" },
    { en: "What's your favorite color?", zh: "你最喜欢什么颜色？" },
    { en: "Do you like ice cream?", zh: "你喜欢冰淇淋吗？" },
    { en: "Can I sit here?", zh: "我可以坐这里吗？" },
    { en: "Can we share this?", zh: "我们可以分享这个吗？" },
    { en: "Are you having fun?", zh: "你玩得开心吗？" }
];

// ===== 成语题库 =====
const IDIOM_DATA = [
    { idiom: "守株待兔", pinyin: "shǒu zhū dài tù", correct: "不主动努力，存侥幸心理", wrong: ["做事很认真", "跑得很快", "说话很直白"] },
    { idiom: "狐假虎威", pinyin: "hú jiǎ hǔ wēi", correct: "借别人的势力吓唬人", wrong: ["狐狸怕老虎", "老虎很威风", "狐狸很聪明"] },
    { idiom: "画蛇添足", pinyin: "huà shé tiān zú", correct: "多此一举，弄巧成拙", wrong: ["画了一条蛇", "蛇有脚", "画得很像"] },
    { idiom: "对牛弹琴", pinyin: "duì niú tán qín", correct: "对不懂道理的人讲道理", wrong: ["给牛听音乐", "弹琴很好听", "牛很喜欢音乐"] },
    { idiom: "井底之蛙", pinyin: "jǐng dǐ zhī wā", correct: "比喻见识短浅的人", wrong: ["井里有只青蛙", "青蛙跳得高", "井水很清"] },
    { idiom: "亡羊补牢", pinyin: "wáng yáng bǔ láo", correct: "出问题后及时补救", wrong: ["羊丢了不管", "把羊关起来", "补好羊圈"] },
    { idiom: "掩耳盗铃", pinyin: "yǎn ěr dào líng", correct: "自己欺骗自己", wrong: ["偷铃铛", "把耳朵捂住", "铃铛很响"] },
    { idiom: "刻舟求剑", pinyin: "kè zhōu qiú jiàn", correct: "不懂变通，死守老办法", wrong: ["在船上刻字", "剑掉水里", "划船很快"] },
    { idiom: "叶公好龙", pinyin: "yè gōng hào lóng", correct: "口头上喜欢，实际害怕", wrong: ["喜欢龙", "龙很可怕", "叶子很好看"] },
    { idiom: "杯弓蛇影", pinyin: "bēi gōng shé yǐng", correct: "疑神疑鬼，自惊自扰", wrong: ["杯子里有蛇", "弓影像蛇", "喝酒很害怕"] },
    { idiom: "盲人摸象", pinyin: "máng rén mō xiàng", correct: "片面看问题", wrong: ["盲人摸大象", "大象很大", "摸得很准"] },
    { idiom: "鹤立鸡群", pinyin: "hè lì jī qún", correct: "特别突出，与众不同", wrong: ["鸡群里有一只鹤", "鹤比鸡大", "鸡飞走了"] },
    { idiom: "鸦雀无声", pinyin: "yā què wú shēng", correct: "非常安静", wrong: ["乌鸦和麻雀", "鸟儿在唱歌", "一点声音也没有"] },
    { idiom: "惊弓之鸟", pinyin: "jīng gōng zhī niǎo", correct: "受过惊吓的人很害怕", wrong: ["被弓箭吓到的鸟", "鸟飞走了", "弓箭很可怕"] },
    { idiom: "鱼目混珠", pinyin: "yú mù hùn zhū", correct: "以假乱真", wrong: ["鱼的眼睛像珍珠", "珍珠很漂亮", "鱼在水里游"] },
    { idiom: "一鸣惊人", pinyin: "yī míng jīng rén", correct: "平时不声不响，一出手让人吃惊", wrong: ["一只鸟叫得很响", "突然飞走了", "声音很好听"] },
    { idiom: "三心二意", pinyin: "sān xīn èr yì", correct: "心思不专一", wrong: ["三个心和两个意", "做事很认真", "很用心"] },
    { idiom: "四面八方", pinyin: "sì miàn bā fāng", correct: "指各个地方", wrong: ["四个方向", "八个方向", "一个方向"] },
    { idiom: "五光十色", pinyin: "wǔ guāng shí sè", correct: "色彩鲜艳，式样繁多", wrong: ["五种光十种色", "颜色很暗", "只有一种颜色"] },
    { idiom: "七上八下", pinyin: "qī shàng bā xià", correct: "心神不定，很紧张", wrong: ["七在上面八在下面", "非常开心", "很平静"] },
    { idiom: "九牛一毛", pinyin: "jiǔ niú yī máo", correct: "非常渺小，微不足道", wrong: ["九头牛一根毛", "很多很多", "非常重"] },
    { idiom: "十全十美", pinyin: "shí quán shí měi", correct: "完美无缺", wrong: ["十个全十个美", "有缺点", "很不错"] },
    { idiom: "百发百中", pinyin: "bǎi fā bǎi zhòng", correct: "每次都能命中目标", wrong: ["一百发一百中", "偶尔能中", "从来没中过"] },
    { idiom: "万众一心", pinyin: "wàn zhòng yī xīn", correct: "团结一致", wrong: ["一万个人一条心", "各想各的", "人很多"] },
    { idiom: "八仙过海", pinyin: "bā xiān guò hǎi", correct: "各显本领", wrong: ["八个神仙过海", "神仙会飞", "海里有很多鱼"] },
    { idiom: "画龙点睛", pinyin: "huà lóng diǎn jīng", correct: "关键处加上精彩内容", wrong: ["画一只龙的眼睛", "做事很粗心", "形容很漂亮"] },
    { idiom: "揠苗助长", pinyin: "yà miáo zhù zhǎng", correct: "违反规律，急于求成", wrong: ["把苗拔高", "禾苗长很快", "农民很辛苦"] },
    { idiom: "坐井观天", pinyin: "zuò jǐng guān tiān", correct: "眼光狭小，见识少", wrong: ["坐在井里看天", "天很大", "井很深"] },
    { idiom: "自相矛盾", pinyin: "zì xiāng máo dùn", correct: "言行前后不一致", wrong: ["矛和盾都很尖", "打仗很厉害", "卖矛和盾"] },
    { idiom: "愚公移山", pinyin: "yú gōng yí shān", correct: "有毅力，不怕困难", wrong: ["一个老人", "山很大", "移山很快"] },
    { idiom: "胸有成竹", pinyin: "xiōng yǒu chéng zhú", correct: "做事前已有把握", wrong: ["心里有一根竹子", "画竹子很好", "不知道怎么做"] },
    { idiom: "熟能生巧", pinyin: "shú néng shēng qiǎo", correct: "熟练了就能掌握技巧", wrong: ["熟了就能生巧", "要学很久", "很难学会"] },
    { idiom: "一心一意", pinyin: "yī xīn yī yì", correct: "专心致志", wrong: ["一个心一个意", "三心二意", "不用心"] },
    { idiom: "聚精会神", pinyin: "jù jīng huì shén", correct: "精神集中", wrong: ["把精神聚在一起", "东张西望", "很放松"] },
    { idiom: "脚踏实地", pinyin: "jiǎo tà shí dì", correct: "做事踏实", wrong: ["脚踩在地上", "一步登天", "很着急"] },
    { idiom: "笨鸟先飞", pinyin: "bèn niǎo xiān fēi", correct: "勤能补拙", wrong: ["笨的鸟先飞", "聪明的鸟先飞", "鸟不飞"] },
    { idiom: "日积月累", pinyin: "rì jī yuè lěi", correct: "长时间慢慢积累", wrong: ["一天一天积累", "一下子就完成", "不用积累"] },
    { idiom: "温故知新", pinyin: "wēn gù zhī xīn", correct: "复习旧知识得到新理解", wrong: ["温暖的故事", "学习新知识", "不看旧书"] },
    { idiom: "不耻下问", pinyin: "bù chǐ xià wèn", correct: "虚心向人请教", wrong: ["不问问题", "很害羞", "很骄傲"] },
    { idiom: "助人为乐", pinyin: "zhù rén wéi lè", correct: "以帮助别人为快乐", wrong: ["别人帮自己", "自己玩", "不帮别人"] },
    { idiom: "春暖花开", pinyin: "chūn nuǎn huā kāi", correct: "春天气候温暖，百花盛开", wrong: ["冬天很冷", "花都谢了", "秋天来了"] },
    { idiom: "鸟语花香", pinyin: "niǎo yǔ huā xiāng", correct: "春天景色优美", wrong: ["鸟儿在唱歌", "花很香", "鸟会说话"] },
    { idiom: "山清水秀", pinyin: "shān qīng shuǐ xiù", correct: "风景优美", wrong: ["山很清水很秀", "山上没有树", "水很脏"] },
    { idiom: "秋高气爽", pinyin: "qiū gāo qì shuǎng", correct: "秋天天气晴朗凉爽", wrong: ["秋天很高", "天气很热", "天上下雨"] },
    { idiom: "冰天雪地", pinyin: "bīng tiān xuě dì", correct: "非常寒冷", wrong: ["冰和雪在地上", "天气很热", "下大雨"] },
    { idiom: "风吹草动", pinyin: "fēng chuī cǎo dòng", correct: "细微的变化", wrong: ["风吹草动了一下", "风很大", "草不动"] },
    { idiom: "电闪雷鸣", pinyin: "diàn shǎn léi míng", correct: "阵势很大，雷雨交加", wrong: ["闪电和雷声", "天气很好", "下雨了"] },
    { idiom: "雨过天晴", pinyin: "yǔ guò tiān qíng", correct: "风雨过后天气转晴", wrong: ["下雨后出太阳", "一直下雨", "天黑了"] },
    { idiom: "花红柳绿", pinyin: "huā hóng liǔ lǜ", correct: "春天花木茂盛", wrong: ["花是红的柳是绿的", "花都谢了", "叶子掉了"] },
    { idiom: "专心致志", pinyin: "zhuān xīn zhì zhì", correct: "用心专一，注意力集中", wrong: ["三心二意", "东张西望", "很马虎"] },
    { idiom: "哄堂大笑", pinyin: "hōng táng dà xiào", correct: "满屋子人同时大笑", wrong: ["一个人在笑", "小声偷笑", "哭得很伤心"] },
    { idiom: "栩栩如生", pinyin: "xǔ xǔ rú shēng", correct: "形象逼真，像活的一样", wrong: ["生龙活虎", "很死板", "很漂亮"] },
    { idiom: "水滴石穿", pinyin: "shuǐ dī shí chuān", correct: "力量虽小，坚持就能成功", wrong: ["水把石头滴穿了", "石头很硬", "水很大"] },
    { idiom: "事半功倍", pinyin: "shì bàn gōng bèi", correct: "费力小，收效大", wrong: ["费力大收效小", "做一半就停", "很努力"] },
    { idiom: "千载难逢", pinyin: "qiān zǎi nán féng", correct: "机会难得", wrong: ["一千年也难遇到", "经常遇到", "很容易"] },
    { idiom: "半途而废", pinyin: "bàn tú ér fèi", correct: "做事中途放弃", wrong: ["做到一半不做了", "坚持做完", "还没开始"] },
    { idiom: "得意忘形", pinyin: "dé yì wàng xíng", correct: "高兴得忘乎所以", wrong: ["得意得忘了形", "很谦虚", "很伤心"] },
    { idiom: "一石二鸟", pinyin: "yī shí èr niǎo", correct: "做一件事达到两个目的", wrong: ["一块石头打中两只鸟", "用两块石头打鸟", "鸟被打跑了"] },
    { idiom: "一日千里", pinyin: "yī rì qiān lǐ", correct: "进步发展很快", wrong: ["一天走一千里", "走得很慢", "原地不动"] },
    { idiom: "对症下药", pinyin: "duì zhèng xià yào", correct: "针对问题采取有效措施", wrong: ["对着症状用药", "随便用药", "不吃药"] },
    { idiom: "风雨同舟", pinyin: "fēng yǔ tóng zhōu", correct: "共同经历患难", wrong: ["在风雨中同坐一条船", "各自逃命", "天气很好"] },
    { idiom: "负荆请罪", pinyin: "fù jīng qǐng zuì", correct: "向人认错赔罪", wrong: ["背着荆条请罪", "不认错", "逃跑"] },
    { idiom: "甘拜下风", pinyin: "gān bài xià fēng", correct: "承认不如人", wrong: ["甘愿拜在下风", "不服气", "很骄傲"] },
    { idiom: "以貌取人", pinyin: "yǐ mào qǔ rén", correct: "只凭外貌判断人", wrong: ["根据相貌判断人", "看内在", "不看人"] },
    { idiom: "打草惊蛇", pinyin: "dǎ cǎo jīng shé", correct: "做事不周密，让对方警觉", wrong: ["打草惊动了蛇", "蛇被打了", "草不动"] },
    { idiom: "无能为力", pinyin: "wú néng wéi lì", correct: "没有办法，使不上劲", wrong: ["没有能力帮忙", "很有办法", "很轻松"] },
    { idiom: "如鱼得水", pinyin: "rú yú dé shuǐ", correct: "得到适合的环境", wrong: ["像鱼到了水里", "鱼离开水", "鱼在岸上"] },
    { idiom: "天衣无缝", pinyin: "tiān yī wú fèng", correct: "事物完美自然", wrong: ["天上的衣服没缝", "有破绽", "很粗糙"] },
    { idiom: "刮目相看", pinyin: "guā mù xiāng kàn", correct: "用新的眼光看待", wrong: ["擦亮眼睛看人", "还是老样子", "不看"] },
    { idiom: "不谋而合", pinyin: "bù móu ér hé", correct: "想法不约而同", wrong: ["没商量却想法一样", "商量好了", "想法不同"] },
    { idiom: "异曲同工", pinyin: "yì qǔ tóng gōng", correct: "方法不同，效果一样好", wrong: ["曲子不同但一样好听", "一个好听一个不好听", "没法比"] },
    { idiom: "滥竽充数", pinyin: "làn yú chōng shù", correct: "没有真本事混在里面", wrong: ["不会吹竽也来凑数", "吹得很好", "很认真"] },
    { idiom: "未雨绸缪", pinyin: "wèi yǔ chóu móu", correct: "提前做好准备", wrong: ["下雨前修好门窗", "下雨了才准备", "不管"] },
    { idiom: "乐不思蜀", pinyin: "lè bù sī shǔ", correct: "快乐得忘了家乡", wrong: ["快乐得不想回家", "想家想哭", "很痛苦"] },
    { idiom: "名落孙山", pinyin: "míng luò sūn shān", correct: "考试没有被录取", wrong: ["名字落在孙山后面", "考了第一名", "没参加考试"] },
    { idiom: "首屈一指", pinyin: "shǒu qū yī zhǐ", correct: "排名第一", wrong: ["第一名", "第二名", "最后一名"] },
    { idiom: "车水马龙", pinyin: "chē shuǐ mǎ lóng", correct: "车马很多，很热闹", wrong: ["车像水马像龙", "很冷清", "没有车"] },
    { idiom: "千钧一发", pinyin: "qiān jūn yī fà", correct: "情况万分危急", wrong: ["千钧重物吊在一根头发上", "很安全", "很轻"] },
    { idiom: "如临大敌", pinyin: "rú lín dà dí", correct: "好像面对强大的敌人", wrong: ["像面对大敌人一样紧张", "很放松", "很开心"] },
    { idiom: "光阴似箭", pinyin: "guāng yīn sì jiàn", correct: "时间过得很快", wrong: ["时间像箭一样快", "时间过得很慢", "时间停止了"] },
    { idiom: "人山人海", pinyin: "rén shān rén hǎi", correct: "人非常多", wrong: ["人像山和海一样多", "没有几个人", "人很少"] },
    { idiom: "琳琅满目", pinyin: "lín láng mǎn mù", correct: "美好事物很多", wrong: ["眼前全是好东西", "没有好东西", "很少"] },
    { idiom: "门庭若市", pinyin: "mén tíng ruò shì", correct: "来的人很多", wrong: ["门口像市场一样热闹", "没人来", "很安静"] },
    { idiom: "迫在眉睫", pinyin: "pò zài méi jié", correct: "事情很紧迫", wrong: ["迫近到眉毛睫毛", "还早着呢", "不用急"] },
    { idiom: "危在旦夕", pinyin: "wēi zài dàn xī", correct: "危险就在眼前", wrong: ["早晚之间就会出事", "很安全", "很远"] },
    { idiom: "铁杵成针", pinyin: "tiě chǔ chéng zhēn", correct: "坚持就能成功", wrong: ["铁棒磨成针", "很容易", "不用磨"] },
    { idiom: "闻鸡起舞", pinyin: "wén jī qǐ wǔ", correct: "发奋有为", wrong: ["听到鸡叫就起床练武", "睡懒觉", "很懒惰"] },
    { idiom: "卧薪尝胆", pinyin: "wò xīn cháng dǎn", correct: "刻苦自励，发奋图强", wrong: ["睡柴草尝苦胆", "过得很舒服", "不努力"] },
    { idiom: "指鹿为马", pinyin: "zhǐ lù wéi mǎ", correct: "故意颠倒黑白", wrong: ["指着鹿说是马", "鹿就是鹿", "分不清"] },
    { idiom: "完璧归赵", pinyin: "wán bì guī zhào", correct: "原物完好归还", wrong: ["把玉完整地还给赵国", "玉碎了", "不还了"] },
    { idiom: "三顾茅庐", pinyin: "sān gù máo lú", correct: "诚心诚意邀请", wrong: ["三次到茅屋去请", "一次也不去", "随便请"] },
    { idiom: "四面楚歌", pinyin: "sì miàn chǔ gē", correct: "陷入孤立境地", wrong: ["四面都是楚歌", "很受欢迎", "很热闹"] },
    { idiom: "草木皆兵", pinyin: "cǎo mù jiē bīng", correct: "惊慌时疑神疑鬼", wrong: ["看到草木都像是兵", "很淡定", "很勇敢"] },
    { idiom: "风声鹤唳", pinyin: "fēng shēng hè lì", correct: "惊慌失措", wrong: ["风声鹤叫都让人害怕", "很安心", "很开心"] },
    { idiom: "悬梁刺股", pinyin: "xuán liáng cì gǔ", correct: "刻苦学习", wrong: ["用绳子吊头发用锥子刺大腿", "偷懒不学", "很轻松"] },
    { idiom: "手不释卷", pinyin: "shǒu bù shì juàn", correct: "勤奋好学", wrong: ["手里不放下书卷", "不爱看书", "偶尔看看"] },
    { idiom: "程门立雪", pinyin: "chéng mén lì xuě", correct: "尊师重教", wrong: ["在程老师门口雪中站立等候", "不尊重老师", "迟到早退"] },
    { idiom: "塞翁失马", pinyin: "sài wēng shī mǎ", correct: "坏事可能变好事", wrong: ["老人丢了马", "马跑不回来", "很伤心"] },
    { idiom: "纸上谈兵", pinyin: "zhǐ shàng tán bīng", correct: "空谈理论，不解决实际问题", wrong: ["在纸上谈论打仗", "真刀真枪", "打了胜仗"] }
];

// ===== 英语课文数据 (二上 6单元) =====
const ENGLISH_TEXTBOOK = [
    {
        unit: "Unit 1: What can you do with your five senses?",
        sections: [
            {
                title: "A. Listen, then point and say",
                lines: [
                    { en: "I can feel the rabbit.", zh: "我能摸到兔子。" },
                    { en: "I can see an ant.", zh: "我能看见一只蚂蚁。" },
                    { en: "I can smell the flowers.", zh: "我能闻到花香。" },
                    { en: "I can hear the birds.", zh: "我能听到鸟叫。" },
                    { en: "I can taste the lollipop.", zh: "我能尝到棒棒糖的味道。" }
                ]
            },
            {
                title: "B. Listen and chant",
                lines: [
                    { en: "I can touch. I can feel. I can touch and feel with my hands and fingers.", zh: "我能触摸。我能感觉。我能用手和手指触摸和感觉。" },
                    { en: "I can see. I can hear. I can see and hear with my eyes and ears.", zh: "我能看见。我能听到。我能用眼睛和耳朵看到和听到。" },
                    { en: "I can smell. I can taste. I can smell and taste with my nose and tongue.", zh: "我能闻到。我能尝到。我能用鼻子和舌头闻到和尝到。" }
                ]
            },
            {
                title: "C. Look, point and say",
                lines: [
                    { en: "I can see a cat.", zh: "我能看见一只猫。" },
                    { en: "I can hear a cat.", zh: "我能听到一只猫叫。" },
                    { en: "I can feel the wind.", zh: "我能感受到风。" },
                    { en: "I can smell the flowers.", zh: "我能闻到花香。" },
                    { en: "I can see some plants.", zh: "我能看到一些植物。" },
                    { en: "I can smell the apples.", zh: "我能闻到苹果的味道。" },
                    { en: "I can taste the apples.", zh: "我能尝到苹果的味道。" }
                ]
            },
            {
                title: "Story: Daisy's Magic Show",
                video: "P4_Story.mp4",
                lines: [
                    { en: "What can you see?", zh: "你能看到什么？" },
                    { en: "Listen! I can hear a kitten. — Miaow! — You're right.", zh: "听！我能听到一只小猫。——喵！——你说对了。" },
                    { en: "I can smell flowers. — Here!", zh: "我能闻到花香。——给你！" },
                    { en: "Now feel this. It's hard.", zh: "现在摸摸这个。它很硬。" },
                    { en: "Is it a ball? — No.", zh: "它是一个球吗？——不是。" },
                    { en: "Is it an egg? — Right!", zh: "它是一个鸡蛋吗？——对了！" },
                    { en: "Feel this. Oh, it's soft.", zh: "摸摸这个。哦，它很软。" },
                    { en: "Wow! It's a big bird!", zh: "哇！是一只大鸟！" }
                ]
            },
            {
                title: "Extend: The Blind Men and the Elephant",
                video: "P8_Extend.mp4",
                lines: [
                    { en: "Four blind men sit under a tree.", zh: "四个盲人坐在一棵树下。" },
                    { en: "Come and feel my elephant.", zh: "过来摸摸我的大象。" },
                    { en: "The elephant is hard.", zh: "大象是硬的。" },
                    { en: "No. It's soft.", zh: "不是。它是软的。" },
                    { en: "It's thin.", zh: "它是瘦的/薄的。" },
                    { en: "No. It's thick.", zh: "不是。它是厚的。" }
                ]
            },
            {
                title: "Sounds",
                videos: ["P9_Sounds_01.mp4", "P9_Sounds_02.mp4"],
                lines: [
                    { en: "I have a little cat. It's cute and fat.", zh: "我有一只小猫。它可爱又胖乎乎。" },
                    { en: "Where is my cat? Oh! It's under my hat.", zh: "我的猫在哪里？哦！它在我的帽子下面。" },
                    { en: "A man wears a cap. He has a map. He takes a nap.", zh: "一个男人戴着一顶帽子。他有一张地图。他小睡了一会儿。" },
                    { en: "Where is his map?", zh: "他的地图在哪里？" }
                ]
            }
        ]
    },
    {
        unit: "Unit 2: What do you like about your family?",
        sections: [
            {
                title: "A. Listen, then point and say",
                lines: [
                    { en: "My grandfather is old.", zh: "我的祖父年纪大了。" },
                    { en: "My mom is young.", zh: "我的妈妈很年轻。" },
                    { en: "My brother is cute.", zh: "我的弟弟很可爱。" },
                    { en: "My uncle is tall.", zh: "我的叔叔很高。" },
                    { en: "My cousins are short.", zh: "我的堂/表兄弟个子不高。" },
                    { en: "My aunt has black hair.", zh: "我的阿姨有黑色的头发。" }
                ]
            },
            {
                title: "B. Listen and chant",
                lines: [
                    { en: "Here's my aunt Kitty. She's young. She's pretty.", zh: "这是我的阿姨凯蒂。她很年轻，她很漂亮。" },
                    { en: "Here's my uncle Paul. He's handsome. He's tall.", zh: "这是我的叔叔保罗。他很帅，他很高。" },
                    { en: "Here's my cousin Robert. He's small. He's cute.", zh: "这是我的表弟罗伯特。他个子小，他很可爱。" },
                    { en: "Here's my grandma Martina. She's old. She's short.", zh: "这是我的奶奶玛蒂娜。她年纪大，个子矮。" }
                ]
            },
            {
                title: "C. Look, point and say — Mary's family",
                lines: [
                    { en: "I am Mary. This is my family.", zh: "我是玛丽。这是我的家人。" },
                    { en: "This is my grandfather. He's old.", zh: "这是我的爷爷。他年纪大了。" },
                    { en: "This is my grandmother. She's old.", zh: "这是我的奶奶。她年纪大了。" },
                    { en: "This is my uncle. He's tall.", zh: "这是我的叔叔。他很高。" },
                    { en: "This is my aunt. She's pretty.", zh: "这是我的阿姨。她很漂亮。" },
                    { en: "This is my sister, Lily. She's short.", zh: "这是我的妹妹莉莉。她个子不高。" },
                    { en: "This is my cousin, John. He's cute.", zh: "这是我的表弟约翰。他很可爱。" }
                ]
            },
            {
                title: "Story: Dan's Story — At Uncle Bob's Party",
                video: "P12_Story.mp4",
                lines: [
                    { en: "Who is he? He's my cousin, Henry.", zh: "他是谁？他是我的堂兄弟，Henry。" },
                    { en: "Is she your sister? No. She's Henry's sister, Ann.", zh: "她是你的妹妹吗？不是。她是Henry的妹妹，Ann。" },
                    { en: "Look here! Say 'Cheese!' Cheese!", zh: "看这里！说'Cheese!' Cheese!" },
                    { en: "Is that your uncle? No.", zh: "那是你的叔叔吗？不是。" },
                    { en: "Hi, children! Mum! Aunt Susan! You look great.", zh: "嗨，孩子们！妈妈！Susan阿姨！你看起来很棒。" },
                    { en: "Where's Uncle Bob, Henry? Let's look for him!", zh: "Bob叔叔在哪里，Henry？我们去找他吧！" },
                    { en: "Hello, Uncle Bob. This party is great! Let's have fun.", zh: "你好，Bob叔叔。这个派对太棒了！我们玩得开心吧。" }
                ]
            },
            {
                title: "Extend: Grandma's Bag",
                video: "P16_Extend.mp4",
                lines: [
                    { en: "Ken is naughty.", zh: "Ken很淘气。" },
                    { en: "Grandma's bag is in Ken's mouth!", zh: "奶奶的包在Ken的嘴里！" },
                    { en: "Mum throws a ball to Ken.", zh: "妈妈朝Ken扔了一个球。" },
                    { en: "Dad runs after Ken.", zh: "爸爸追赶Ken。" },
                    { en: "Tom throws a bone to Ken.", zh: "Tom朝Ken扔了一根骨头。" },
                    { en: "They get the bag back. Everyone is happy.", zh: "他们拿回了包。大家都很开心。" }
                ]
            },
            {
                title: "Sounds",
                videos: ["P17_Sounds_01.mp4", "P17_Sounds_02.mp4"],
                lines: [
                    { en: "Sam likes jam. Sam likes ham.", zh: "Sam喜欢果酱。Sam喜欢火腿。" },
                    { en: "Sam eats bread with jam and ham.", zh: "Sam吃面包配果酱和火腿。" },
                    { en: "Dan turns on the fan. He opens a can of ham.", zh: "Dan打开风扇。他打开一罐火腿。" },
                    { en: "He puts the ham in the pan.", zh: "他把火腿放进平底锅里。" }
                ]
            }
        ]
    },
    {
        unit: "Unit 3: What is your favourite toy?",
        sections: [
            {
                title: "A. Listen, then point and say",
                lines: [
                    { en: "It's a doll.", zh: "这是一个玩偶。" },
                    { en: "Look, it's a toy plane.", zh: "看，这是一架玩具飞机。" },
                    { en: "Look at the toy bear.", zh: "看这个玩具熊。" },
                    { en: "I like the ball.", zh: "我喜欢这个球。" },
                    { en: "The robot is fun.", zh: "这个机器人很有趣。" },
                    { en: "I like the jigsaw puzzle.", zh: "我喜欢这个拼图。" }
                ]
            },
            {
                title: "B. Listen and chant",
                lines: [
                    { en: "A robot? A doll? A toy car?", zh: "一个机器人？一个玩偶？一辆玩具车？" },
                    { en: "Can you see a toy bear?", zh: "你能看见一个玩具熊吗？" },
                    { en: "Can you see a toy plane?", zh: "你能看见一架玩具飞机吗？" },
                    { en: "A teddy? A ball? Jigsaw puzzles.", zh: "一个泰迪熊？一个球？拼图。" },
                    { en: "Can you see the toys? Let's play a game.", zh: "你能看见这些玩具吗？我们来玩个游戏吧。" }
                ]
            },
            {
                title: "C. Listen, number and say",
                lines: [
                    { en: "Look at the balls.", zh: "看这些球。" },
                    { en: "I want a doll.", zh: "我想要一个玩偶。" },
                    { en: "Oh, so many toy cars.", zh: "哦，这么多玩具车。" },
                    { en: "Look at the robots.", zh: "看这些机器人。" },
                    { en: "These are toy bears. They're soft.", zh: "这些是玩具熊，它们很柔软。" }
                ]
            },
            {
                title: "Story: Bill's Story — The Lost Toy",
                video: "P20_Story_The_Lost_Toy.mp4",
                lines: [
                    { en: "I can't find my toy. It's blue. It has no ears. It has two eyes.", zh: "我找不到我的玩具了。它是蓝色的。它没有耳朵。它有两只眼睛。" },
                    { en: "Don't worry. We can help.", zh: "别担心。我们可以帮忙。" },
                    { en: "What colour is Bill's toy? It's blue.", zh: "Bill的玩具是什么颜色的？是蓝色的。" },
                    { en: "That toy is blue!", zh: "那个玩具是蓝色的！" },
                    { en: "It has two ears! Not that toy.", zh: "它有两只耳朵！不是那个玩具。" },
                    { en: "Look! A blue toy.", zh: "看！一个蓝色的玩具。" },
                    { en: "It has three eyes! Not that toy.", zh: "它有三只眼睛！不是那个玩具。" },
                    { en: "Look! This is Bill's toy! Oh! It's a spider!", zh: "看！这是Bill的玩具！哦！是一只蜘蛛！" }
                ]
            },
            {
                title: "Extend: Different toys",
                video: "P24_Extend_Different_Toy.mp4",
                lines: [
                    { en: "Children like toys.", zh: "孩子们喜欢玩具。" },
                    { en: "I like kites. This is my kite.", zh: "我喜欢风筝。这是我的风筝。" },
                    { en: "I can fly my kite in the park.", zh: "我可以在公园里放风筝。" },
                    { en: "I like toy bears. This is my favourite toy bear.", zh: "我喜欢玩具熊。这是我最喜欢的玩具熊。" }
                ]
            },
            {
                title: "Sounds",
                videos: ["P25_Sounds_01.mp4", "P25_Sounds_02.mp4"],
                lines: [
                    { en: "The sun is high and red. Ted sleeps in his bed.", zh: "太阳高高的，红红的。Ted在他的床上睡觉。" },
                    { en: "Time for school, Ted! Mum pats his bed.", zh: "Ted，该上学啦！妈妈拍了拍他的床。" },
                    { en: "Lucy is with her pet. She has a butterfly net.", zh: "Lucy和她的宠物在一起。她有一个捕蝴蝶的网。" },
                    { en: "It's raining! It's raining! Lucy and her pet get wet.", zh: "下雨了！下雨了！Lucy和她的宠物都淋湿了。" }
                ]
            }
        ]
    },
    {
        unit: "Unit 4: What is around your home?",
        sections: [
            {
                title: "A. Listen, then point and say",
                lines: [
                    { en: "This is a pet shop.", zh: "这是一家宠物店。" },
                    { en: "This is a fruit shop.", zh: "这是一家水果店。" },
                    { en: "This is a cinema.", zh: "这是一个电影院。" },
                    { en: "This is a zoo.", zh: "这是一个动物园。" },
                    { en: "This is a park.", zh: "这是一个公园。" },
                    { en: "This is a toy shop.", zh: "这是一家玩具店。" }
                ]
            },
            {
                title: "B. Listen and chant",
                lines: [
                    { en: "What's around your home?", zh: "你家周围有什么？" },
                    { en: "A fruit shop and a park, a toy shop and a cinema.", zh: "一家水果店和一个公园，一家玩具店和一个电影院。" },
                    { en: "Places around my home.", zh: "我家周围的地方。" }
                ]
            },
            {
                title: "C. Look, choose and say",
                lines: [
                    { en: "Look! This is a toy shop. We can buy toy bears in it.", zh: "看！这是一家玩具店。我们可以在里面买玩具熊。" },
                    { en: "Look! This is a zoo. We can see giraffes in it.", zh: "看！这是一个动物园。我们可以在里面看到长颈鹿。" },
                    { en: "Look! This is a fruit shop. We can buy apples in it.", zh: "看！这是一家水果店。我们可以在里面买苹果。" },
                    { en: "Look! This is a cinema. We can see films in it.", zh: "看！这是一个电影院。我们可以在里面看电影。" }
                ]
            },
            {
                title: "Story: Nana's Story — Around My New Home",
                video: "P28_Story_Around_My_New_Home.mp4",
                lines: [
                    { en: "We're near our new home.", zh: "我们在我们的新家附近。" },
                    { en: "Mum, listen!", zh: "妈妈，你听！" },
                    { en: "Look! A zoo!", zh: "看！一个动物园！" },
                    { en: "That's a fruit shop! Let's buy some apples.", zh: "那是一家水果店！我们去买些苹果吧。" },
                    { en: "That's a cinema.", zh: "那是一家电影院。" },
                    { en: "That's a big shopping centre!", zh: "那是一个大的购物中心！" },
                    { en: "Here's a toy shop! I want a new doll.", zh: "这里有一家玩具店！我想要一个新玩偶。" }
                ]
            },
            {
                title: "Extend: My favourite shopping centre",
                video: "P32_Extend_My_Favorite_Shopping_Center.mp4",
                lines: [
                    { en: "This is Happy Shopping Centre.", zh: "这是快乐购物中心。" },
                    { en: "There are many shops in it.", zh: "里面有许多店铺。" },
                    { en: "I like this flower shop. The flowers are beautiful.", zh: "我喜欢这家花店。花很漂亮。" },
                    { en: "I like this restaurant. The food there is very nice.", zh: "我喜欢这家餐厅。那里的食物非常美味。" },
                    { en: "I like this toy shop too. The dolls are soft and the robots can walk.", zh: "我也喜欢这家玩具店。玩偶很柔软，而且机器人会走路。" }
                ]
            },
            {
                title: "Sounds",
                videos: ["P33_Sounds_01.mp4", "P33_Sounds_02.mp4"],
                lines: [
                    { en: "Ben, look at the hen. It writes with a pen!", zh: "Ben，看看那只母鸡。它用一支钢笔写字！" },
                    { en: "Look! Look! The hen can write 'ten'.", zh: "看！看！这只母鸡会写'ten'。" },
                    { en: "I can see a pig. The pig is very big.", zh: "我能看到一头猪。这头猪非常大。" },
                    { en: "I can see a hole! The pig digs a big hole.", zh: "我能看到一个洞！这头猪挖了一个大洞。" }
                ]
            }
        ]
    },
    {
        unit: "Unit 5: What do you like about farms?",
        sections: [
            {
                title: "A. Listen, then point and say",
                lines: [
                    { en: "Those are cows.", zh: "那些是奶牛。" },
                    { en: "These are sheep.", zh: "这些是绵羊。" },
                    { en: "Here are some ducks.", zh: "这里有一些鸭子。" },
                    { en: "These are chicks.", zh: "这些是小鸡。" },
                    { en: "These are chickens.", zh: "这些是鸡。" },
                    { en: "Oh, these are pigs.", zh: "哦，这些是猪。" }
                ]
            },
            {
                title: "B. Listen and chant",
                lines: [
                    { en: "I love the animals, the sheep and the pigs, the cows and the ducks, the chickens and the chicks.", zh: "我喜欢动物，绵羊和猪，奶牛和鸭子，鸡和小鸡。" },
                    { en: "They all live on the farm.", zh: "它们都住在农场里。" }
                ]
            },
            {
                title: "C. Follow and say",
                lines: [
                    { en: "I like chickens. They are yellow.", zh: "我喜欢鸡。它们是黄色的。" },
                    { en: "I like sheep. They're white.", zh: "我喜欢绵羊。它们是白色的。" },
                    { en: "I like pigs. They are pink.", zh: "我喜欢猪。它们是粉红色的。" },
                    { en: "I like cows. They're black and white.", zh: "我喜欢奶牛。它们是黑白相间的。" }
                ]
            },
            {
                title: "Story: Penny's story — On the farm",
                video: "P36_Story_On_The_Farm.mp4",
                lines: [
                    { en: "Let's find black and white animals.", zh: "我们来找黑白相间的动物吧。" },
                    { en: "Look at the butterfly. Don't touch it.", zh: "看这只蝴蝶。不要碰它。" },
                    { en: "Here are some chickens. They're red and brown.", zh: "这里有一些鸡。它们是红棕色的。" },
                    { en: "Look! Here's a puppy. It's brown. It's cute.", zh: "看！这里有一只小狗。它是棕色的。它很可爱。" },
                    { en: "Let's give it some water.", zh: "我们给它一些水吧。" },
                    { en: "These are white goats. I don't like goats.", zh: "这些是白色的山羊。我不喜欢山羊。" },
                    { en: "Look! Cows! They're black and white!", zh: "看！奶牛！它们是黑白相间的！" }
                ]
            },
            {
                title: "Extend: Old MacDonald has a farm",
                video: "P40_Extend_Old_MacDonalds.mp4",
                lines: [
                    { en: "Old MacDonald has a farm, E-i-e-i-o.", zh: "老麦克唐纳有个农场，咿呀咿呀哟。" },
                    { en: "On his farm he has five ducks, E-i-e-i-o.", zh: "他的农场里有五只鸭子，咿呀咿呀哟。" },
                    { en: "A quack-quack here! A quack-quack there!", zh: "这里嘎嘎叫！那里嘎嘎叫！" },
                    { en: "Here a quack! There a quack! Everywhere a quack-quack!", zh: "这里一声嘎！那里一声嘎！到处都嘎嘎叫！" }
                ]
            },
            {
                title: "Sounds",
                videos: ["P41_Sounds_01.mp4", "P41_Sounds_02.mp4"],
                lines: [
                    { en: "Martin sees a tin. Martin sees a bin.", zh: "Martin看到一个罐头。Martin看到一个垃圾桶。" },
                    { en: "He puts the tin in the bin.", zh: "他把罐头放进垃圾桶里。" },
                    { en: "We are on a ship, a big, big ship.", zh: "我们在船上，一艘大大的船。" },
                    { en: "We eat fish and chips. We have a good trip.", zh: "我们吃鱼和薯条。我们旅途愉快。" }
                ]
            }
        ]
    },
    {
        unit: "Unit 6: How do people celebrate the Mid-Autumn Festival?",
        sections: [
            {
                title: "A. Listen, then point and say",
                lines: [
                    { en: "It's the Mid-Autumn Festival. My cousin and I play with lanterns.", zh: "今天是中秋节。我和我的表妹在玩灯笼。" },
                    { en: "People eat moon cakes.", zh: "人们吃月饼。" },
                    { en: "My sister does riddles with my grandfather.", zh: "我的姐姐和我爷爷猜谜语。" },
                    { en: "At night, my family look at the moon together.", zh: "晚上我们一家人一起赏月。" }
                ]
            },
            {
                title: "B. Listen and chant",
                lines: [
                    { en: "Look at all the lanterns. So many lanterns to see.", zh: "看所有的灯笼。有这么多灯笼可以看。" },
                    { en: "I can count the lanterns. One, two, three.", zh: "我可以数灯笼。一，二，三。" },
                    { en: "Look at the moon cakes. Such sweet moon cakes to eat.", zh: "看这些月饼。有这么多甜月饼可以吃。" },
                    { en: "Look at the full moon. It's so bright.", zh: "看满月，它如此明亮。" },
                    { en: "We enjoy the time together on Mid-Autumn night.", zh: "我们享受中秋之夜的相聚时光。" }
                ]
            },
            {
                title: "C. Read and guess",
                lines: [
                    { en: "Sometimes it's a 'C'. Sometimes it's an 'O'.", zh: "有时是'C'。有时是'O'。" },
                    { en: "Sometimes you can see it. But sometimes you can't.", zh: "有时你能看到它。但有时你又看不到。" },
                    { en: "What is it?", zh: "它是什么？" }
                ]
            },
            {
                title: "Story: The Mid-Autumn Festival",
                video: "P44_Story_The_Mid_Autumn_Festival.mp4",
                lines: [
                    { en: "The Mid-Autumn Festival is a traditional Chinese festival.", zh: "中秋节是一个中国传统节日。" },
                    { en: "Families have a big dinner together.", zh: "家人们一起吃丰盛的晚餐。" },
                    { en: "We play with lanterns.", zh: "我们玩灯笼。" },
                    { en: "We eat mooncakes too. They taste good.", zh: "我们也吃月饼。它们味道很好。" },
                    { en: "At night, we look at the moon. It is big and bright.", zh: "到了晚上，我们赏月。它又大又亮。" }
                ]
            },
            {
                title: "Extend: The story of Chang'e",
                video: "P48_Extend_The_Story_Of_Chang_E.mp4",
                lines: [
                    { en: "Yi shoots down nine of the suns.", zh: "后羿射下了九个太阳。" },
                    { en: "It's a pill to live forever.", zh: "这是一颗长生不老的仙丹。" },
                    { en: "There's only one pill. You can't have it!", zh: "只有一颗仙丹。你不能拿走它！" },
                    { en: "Chang'e takes the pill. She flies to the moon.", zh: "嫦娥吃下仙丹。她飞向了月亮。" },
                    { en: "Now we look at the moon at the Mid-Autumn Festival.", zh: "现在我们在中秋节赏月。" },
                    { en: "Can you see Chang'e?", zh: "你能看到嫦娥吗？" }
                ]
            }
        ]
    }
];

// ===== 语文课文数据 (二上 8单元，含完整课文内容) =====
const CHINESE_TEXTBOOK = [
    { unit: "第一单元", lessons: [
        { title: "1 小蝌蚪找妈妈", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132962.mp3", content: `池塘里有一群小蝌蚪，大大的脑袋，黑灰色的身子，甩着长长的尾巴，快活地游来游去。
小蝌蚪游哇游，过了几天，长出了两条后腿。他们看见鲤鱼妈妈在教小鲤鱼捕食，就迎上去，问："鲤鱼阿姨，我们的妈妈在哪里？" 鲤鱼妈妈说："你们的妈妈四条腿，宽嘴巴。你们到那边去找吧！"
小蝌蚪游哇游，过了几天，长出两条前腿。他们看见一只乌龟摆动四条腿在水里游，连忙追上去，叫着："妈妈，妈妈！" 乌龟笑着说："我不是你们的妈妈。你们的妈妈头顶上有两只大眼睛，披着绿衣裳。你们到那边去找吧！"
小蝌蚪游哇游，过了几天，尾巴变短了。他们游到荷花旁边，看见荷叶上蹲着一只大青蛙，披着碧绿的衣裳，露着雪白的肚皮，鼓着一对大眼睛。
小蝌蚪游过去，叫着："妈妈，妈妈！" 青蛙妈妈低头一看，笑着说："好孩子，你们已经长成青蛙了，快跳上来吧！" 他们后腿一蹬，向前一跳，蹦到了荷叶上。
不知什么时候，小青蛙的尾巴已经不见了。他们跟着妈妈，天天去捉害虫。`, recognize: "塘 脑 袋 灰 哇 教 捕 迎 阿 姨 龟 披 鼓", write: "两 哪 宽 顶 眼 睛 肚 皮 孩 跳", keyWords: "脑袋、灰色、快活、迎上去、披着、碧绿、雪白、肚皮、看见、哪里",
        knowledge: `<h3 style="font-size:16px;margin:12px 0 6px;">1. 多音字</h3>
<p><strong>教</strong></p>
<ul style="margin:0;padding-left:20px;">
  <li>jiāo（教书 教课）</li>
  <li>jiào（教育 教室）</li>
</ul>
<p>造句：老师正在教（jiào）室里教（jiāo）孩子们唱歌。</p>
<h3 style="font-size:16px;margin:12px 0 6px;">2. 会写字</h3>
<p>两 liǎng（两个 两边）　条 tiáo（木条 枝条）　哪 nǎ（哪里 哪边）</p>
<p>宽 kuān（宽大 宽阔）　那 nà（那里 那个）　短 duǎn（长短 短处）</p>
<p>孩 hái（孩子 小孩）　成 chéng（成长 成功）</p>
<h3 style="font-size:16px;margin:12px 0 6px;">3. 近义词</h3>
<p>快活——快乐　连忙——急忙</p>
<h3 style="font-size:16px;margin:12px 0 6px;">4. 反义词</h3>
<p>长——短　宽——窄　快活——难过　雪白——乌黑</p>
<h3 style="font-size:16px;margin:12px 0 6px;">5. 词语听写</h3>
<p>身子 他们 看见 哪里 那边 眼睛 雪白 孩子 什么</p>
<p>（补充：两条 宽大 短小 知道 成长）</p>
<h3 style="font-size:16px;margin:12px 0 6px;">6. 词语搭配</h3>
<p>（大大）的脑袋 （长长）的尾巴 （碧绿）的衣裳 （雪白）的肚皮</p>
<h3 style="font-size:16px;margin:12px 0 6px;">7. 词语解释</h3>
<p>【快活】愉快；快乐。</p>
<p>【捕食】（动物）捕取食物。</p>
<h3 style="font-size:16px;margin:12px 0 6px;">8. 中心思想</h3>
<p>本文是一篇科学童话故事，通过写小蝌蚪在找妈妈的过程中，经过“长出后腿—长出前腿—尾巴变短—尾巴消失”四个阶段，最后变成了小青蛙，说明青蛙生长过程中形体和生活习性的变化，蕴含着遇事要主动探索的道理。</p>` },
        { title: "2 我是什么", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132963.mp3", content: `我会变。太阳一晒，我就变成汽。升到天空，我又变成无数极小极小的点儿，连成一片，在空中飘浮。有时候我穿着白衣服，有时候我穿着黑衣服，早晨和傍晚我又把红袍披在身上。人们叫我"云"。
我在空中越升越高，体温越来越低，变成了无数小水滴。小水滴聚在一起落下来，人们叫我"雨"。有时候我变成小硬球打下来，人们就叫我"冰雹"。到了冬天，我变成小花朵飘下来，人们又叫我"雪"。
平常我在池子里睡觉，在小溪里散步，在江河里奔跑，在海洋里跳舞，唱歌，开大会。
有时候我很温和，有时候我很暴躁。我做过许多好事，灌溉田地，发动机器，帮助人们工作。我也做过许多坏事，淹没庄稼，冲毁房屋，给人们带来灾害。人们想出种种办法管住我，让我光做好事，不做坏事。
小朋友，你们猜猜，我是什么？`, recognize: "晒 越 滴 溪 奔 淹 没 冲 毁 屋 灾", write: "变 极 片 傍 海 洋 作 给 带", keyWords: "飘浮、傍晚、温和、暴躁、灌溉、发动、淹没、冲毁、灾害、办法" },
        { title: "3 植物妈妈有办法", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132964-1.mp3", content: `孩子如果已经长大，就得告别妈妈，四海为家。牛马有脚，鸟有翅膀，植物旅行又用什么办法？
蒲公英妈妈准备了降落伞，把它送给自己的娃娃。只要有风轻轻吹过，孩子们就乘着风纷纷出发。
苍耳妈妈有个好办法，她给孩子穿上带刺的铠甲。只要挂住动物的皮毛，孩子们就能去田野、山洼。
石榴妈妈的胆子挺大，她不怕小鸟吃掉娃娃。孩子们在鸟肚子里睡上一觉，就会钻出来落户安家。
豌豆妈妈更有办法，她让豆荚晒在太阳底下。啪的一声，豆荚炸开，孩子们就蹦着跳着离开妈妈。
植物妈妈的办法很多很多，不信你就仔细观察。那里有许许多多的知识，粗心的小朋友却得不到它。`, recognize: "植 如 旅 备 纷 刺 底 炸 离 察 粗", write: "法 如 脚 它 娃 她 毛 更 知 识", keyWords: "四海为家、准备、纷纷、铠甲、山洼、仔细、观察、许许多多、知识" },
        { title: "语文园地一", content: `日积月累：
梅花 【宋】 王安石
墙角数枝梅，
凌寒独自开。
遥知不是雪，
为有暗香来。`, isGarden: true },
    ]},
    { unit: "第二单元（识字）", lessons: [
        { title: "识字 1 场景歌", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132969.mp3", content: `一只海鸥，一条帆船。
一艘军舰，一处港湾。
一方鱼塘，一块稻田。
一行垂柳，一座花园。
一道小溪，一座石桥。
一丛翠竹，一群飞鸟。
一面队旗，一把铜号。
一队“红领巾”，一片欢笑。`, recognize: "滩 艘 舰 帆 稻 园 翠 丛 队 旗 铜 号", write: "园 孔 桥 群 队 旗 铜 号 领 巾", keyWords: "沙滩、军舰、帆船、稻田、垂柳、石桥、翠竹、队旗、铜号、红领巾" },
        { title: "识字 2 树之歌", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132970.mp3", content: `杨树高，榕树壮，梧桐树叶像手掌。
枫树秋天叶儿红，松柏四季披绿装。
木棉喜暖在南方，桦树耐寒守北疆。
银杏水杉活化石，金桂开花满院香。`, recognize: "梧 桐 枫 松 柏 装 桦 耐 守 疆 银 杉 桂", write: "杨 桐 松 柏 棉 杉 桂", keyWords: "手掌、枫树、四季、绿装、耐寒、北疆、活化石、满院飘香" },
        { title: "识字 3 拍手歌", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132971.mp3", content: `你拍一，我拍一，动物世界很新奇。你拍二，我拍二，孔雀锦鸡是伙伴。你拍三，我拍三，雄鹰飞翔云彩间。你拍四，我拍四，天空雁群会写字。你拍五，我拍五，丛林深处有猛虎。你拍六，我拍六，黄鹂百灵唱不休。你拍七，我拍七，竹林熊猫在嬉戏。你拍八，我拍八，大小动物都有家。你拍九，我拍九，人和动物是朋友。你拍十，我拍十，保护动物是大事。`, recognize: "雀 锦 雄 鹰 雁 丛 深 猛 灵 休 熊 猫", write: "处 六 熊 猫 九 朋 友", keyWords: "新奇、伙伴、雄鹰、雁群、丛林、猛虎、黄鹂、嬉戏、保护" },
        { title: "识字 4 田家四季歌", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/ar_audio/07be210da88c899df7926bd21d66f880.mp3", content: `春季里，春风吹，花开草长蝴蝶飞。麦苗儿多嫩，桑叶儿正肥。
夏季里，农事忙，采了蚕桑又插秧。早起勤耕作，归来戴月光。
秋季里，稻上场，谷像黄金粒粒香。身体虽辛苦，心里喜洋洋。
冬季里，雪初晴，新制棉衣暖又轻。一年农事了，大家笑盈盈。`, recognize: "季 蝴 蝶 麦 苗 桑 肥 农 戴 场 谷 粒 虽 辛 苦 了", write: "季 吹 肥 农 忙 归 戴 辛 苦 年", keyWords: "农事、插秧、耕作、上场、黄金、辛苦、喜洋洋、笑盈盈" },
        { title: "语文园地二", content: `日积月累：
己所不欲，勿施于人。——《论语》
与朋友交，言而有信。——《论语》
不以规矩，不能成方圆。——《孟子》`, isGarden: true },
    ]},
    { unit: "第三单元 儿童生活", lessons: [
        { title: "4 曹冲称象", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/ar_audio/b0e70edeb28787202ae13ca6ef5311d9.mp3", content: `古时候有个大官，叫曹操。别人送他一头大象，他很高兴，带着儿子和官员们一同去看。
大象又高又大，身子像一堵墙，腿像四根柱子。官员们一边看一边议论："这么大的象，到底有多重呢？"
曹操问："谁有办法把这头大象称一称？"有的说："得造一杆大秤，砍一棵大树做秤杆。"有的说："有了大秤也不行啊，谁有那么大的力气提得起这杆大秤呢？"曹操听了直摇头。
曹操的儿子曹冲才七岁，他站出来，说："我有个办法。把大象赶到一艘大船上，看船身下沉多少，就沿着水面，在船舷上画一条线。再把大象赶上岸，往船上装石头，装到船下沉到画线的地方为止。然后称一称船上的石头。石头有多重，大象就有多重。"
曹操微笑着点一点头。他叫人照曹冲说的办法去做，果然称出了大象的重量。`, recognize: "曹 称 员 根 议 论 重 杆 秤 砍 线 止 量", write: "称 柱 底 杆 秤 做 岁 站 船 然", keyWords: "官员、一同、柱子、议论、办法、船舷、下沉、画线、重量、果然" },
        { title: "5 玲玲的画", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/ar_audio/742e29819fff27eb55062b9b76e4c928.mp3", content: `玲玲得意地端详着自己画的《我家的一角》。这幅画明天就要参加评奖了。
"玲玲，时间不早了，快去睡吧！"爸爸又在催她了。
"好的，爸爸。"玲玲放下画笔，拿起橡皮，准备收拾东西。就在这时候，水彩笔啪的一声掉到了纸上，把画弄脏了。玲玲伤心地哭了起来。
"怎么了，玲玲？"爸爸放下报纸问。
"我的画弄脏了，另画一张也来不及了。"
爸爸拿起画，仔细地看了看，说："别哭，孩子。在这儿画点儿什么，不是很好吗？"
玲玲想了想，拿起笔，在弄脏的地方画了一只小花狗。小花狗眯着眼睛，懒洋洋地趴在楼梯上，整张画看上去更好了。玲玲满意地笑了。
爸爸看了，高兴地说："看到了吧，孩子。好多事情并不像我们想象的那么糟。只要肯动脑筋，坏事有时也能变成好事。"`, recognize: "玲 详 幅 评 催 脏 报 另 及 懒 趴", write: "画 幅 评 奖 候 报 另 及 拿 并", keyWords: "得意、端详、评奖、来不及、仔细、懒洋洋、满意、动脑筋、坏事、好事" },
        { title: "6 一封信", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132977.mp3", content: `爸爸出国了，要过半年才能回来。今天，露西想给爸爸写一封信。
妈妈还在厂里，露西早早回到家。她打开空调，又洗了一些土豆，削好后放在锅里。她朝窗外望了一眼。好了，她想，现在可以开始写信了。她拿出一沓纸，一支圆珠笔。
"亲爱的爸爸，"露西写道，"你不在，我们很不开心。以前每天早上你一边刮胡子，一边逗我玩。还有，家里的台灯坏了，我们修不好。从早到晚，家里总是很冷清。"
这时，妈妈回来了。她拍拍露西的肩膀，问："是在给爸爸写信吗？"
"是的。可是我写得不好。"露西伤心地说。
妈妈拿起笔，说："我们一起写好不好？"
露西边说边写："亲爱的爸爸，我们过得挺好。太阳闪闪发光。阳光下，我们的希比希又蹦又跳。请爸爸告诉我们，螺丝刀放在哪儿了。这样，我们就能自己修台灯了。"
"还有，下星期天我们去看电影。"妈妈说。
"啊，太好啦！"露西叫了起来。
"爸爸，我们天天想你。"露西在信的结尾，画了一大束鲜花。`, recognize: "封 削 锅 朝 沓 株 团 修 冷 刮", write: "封 信 今 写 支 圆 珠 笔 灯 电", keyWords: "出国、半年、一封信、冷清、闪闪发光、又蹦又跳、台灯、鲜花" },
        { title: "7 妈妈睡了", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132978.mp3", content: `妈妈睡了。妈妈哄我午睡的时候，自己先睡着了，睡得好熟，好香。
睡梦中的妈妈真美丽。明亮的眼睛闭上了，紧紧地闭着；弯弯的眉毛，也在睡觉，睡在妈妈红润的脸上。
睡梦中的妈妈好温柔。妈妈微微地笑着。是的，她在微微地笑着，嘴巴、眼角都笑弯了，好像在睡梦中，妈妈又想好了一个故事，等会儿讲给我听……
睡梦中的妈妈好累。妈妈的呼吸那么沉。她乌黑的头发粘在微微渗出汗珠的额头上。窗外，小鸟在唱着歌，风儿在树叶间散步，发出沙沙的响声，可是妈妈全听不到。她干了好多活，累了，乏了，她真该好好睡一觉。`, recognize: "哄 闭 紧 润 等 吸 发 粘 汗 额 沙", write: "哄 先 闭 脸 沉 发 窗", keyWords: "午睡、美丽、明亮、红润、温柔、呼吸、乌黑、汗珠、沙沙" },
        { title: "语文园地三", content: `日积月累：
小儿垂钓
【唐】胡令能
蓬头稚子学垂纶，
侧坐莓苔草映身。
路人借问遥招手，
怕得鱼惊不应人。`, isGarden: true },
    ]},
    { unit: "第四单元 家乡", lessons: [
        { title: "8 古诗二首", content: `登鹳雀楼
［唐］王之涣
白日依山尽，黄河入海流。
欲穷千里目，更上一层楼。

望庐山瀑布
［唐］李白
日照香炉生紫烟，遥看瀑布挂前川。
飞流直下三千尺，疑是银河落九天。`, recognize: "楼 依 尽 欲 穷 层 瀑 布 炉 烟 川", write: "楼 依 尽 黄 层 照 炉 烟 挂 川", keyWords: "依山尽、千里目、一层楼、香炉、紫烟、瀑布、飞流、银河" },
        { title: "9 黄山奇石", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132985.mp3", content: `闻名中外的黄山风景区，在我国安徽省南部。那里景色秀丽神奇，尤其是那些怪石，有趣极了。
就说"仙桃石"吧，它好像从天上飞下来的一个大桃子，落在山顶的石盘上。
在一座陡峭的山峰上，有一只"猴子"。它两只胳膊抱着腿，一动不动地蹲在山头，望着翻滚的云海。这就是有趣的"猴子观海"。
"仙人指路"就更有趣了！远远望去，那巨石真像一位仙人站在高高的山峰上，伸着手臂指向前方。
每当太阳升起，有座山峰上的几块巨石，就变成了一只金光闪闪的雄鸡。它伸着脖子，对着天都峰不住地啼叫。不用说，这就是著名的"金鸡叫天都"了。
黄山的奇石还有很多，如"天狗望月""狮子抢球""仙女弹琴"。那些叫不出名字的奇形怪状的岩石，正等你去给它们起名字呢！`, recognize: "闻 名 省 部 秀 尤 其 仙 陡 峭 膊 巨 位 啼", write: "南 部 些 巨 位 每 升 闪 狗", keyWords: "闻名中外、秀丽神奇、陡峭、一动不动、云海、金光闪闪、奇形怪状" },
        { title: "10 日月潭", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132986.mp3", content: `日月潭是我国台湾省最大的一个湖。它在台湾省中部的山区。那里群山环绕，树木茂盛，周围有许多名胜古迹。
日月潭很深，湖水碧绿。湖中央有个美丽的小岛，把湖水分成两半，北边像圆圆的太阳，叫日潭；南边像弯弯的月亮，叫月潭。
清晨，湖面上飘着薄薄的雾。天边的晨星和山上的点点灯光，隐隐约约地倒映在湖水中。
中午，太阳高照，整个日月潭的美景和周围的建筑，都清晰地展现在眼前。要是下起蒙蒙细雨，日月潭好像披上轻纱，周围的景物一片朦胧，就像童话中的仙境。
日月潭风光秀丽，吸引了许许多多的中外游客。`, recognize: "潭 湾 湖 绕 茂 盛 胜 迹 薄 雾 朦 胧", write: "名 胜 迹 央 丽 华 展 现 披 份", keyWords: "群山环绕、树木茂盛、名胜古迹、隐隐约约、清晰、蒙蒙细雨、朦胧、风光秀丽" },
        { title: "11 葡萄沟", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132987.mp3", content: `新疆吐鲁番有个地方叫葡萄沟。那里出产水果。五月有杏子，七八月有香梨、蜜桃、沙果，到了八九月份，人们最喜爱的葡萄成熟了。
葡萄种在山坡的梯田上。茂密的枝叶向四面展开，就像搭起了一个个绿色的凉棚。葡萄一大串一大串地挂在绿叶底下，有红的、白的、紫的、淡绿的，五光十色，美丽极了。要是这时候你到葡萄沟去，热情好客的维吾尔族老乡，准会摘下最甜的葡萄，让你吃个够。
收下来的葡萄有的运到城市去，有的运到阴房里制成葡萄干。阴房修在山坡上，样子很像碉堡，四周留着许多小孔，里面钉着许多木架子。成串的葡萄挂在架子上，利用流动的热空气，让水分蒸发掉，就成了葡萄干。这里生产的葡萄干颜色鲜，味道甜，非常有名。
葡萄沟真是个好地方。`, recognize: "沟 疆 鲁 番 萄 梯 坡 搭 堡 维 够 留", write: "坡 梯 起 客 老 收 城 市 利", keyWords: "出产、茂密、凉棚、五光十色、热情好客、阴房、水分、味道甜" },
        { title: "语文园地四", content: `日积月累：
有山皆图画，无水不文章。
白马西风塞上，杏花烟雨江南。
清风明月本无价，近水远山皆有情。
雾锁山头山锁雾，天连水尾水连天。`, isGarden: true },
    ]},
    { unit: "第五单元 思维方法", lessons: [
        { title: "12 坐井观天", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132990.mp3", content: `青蛙坐在井里。小鸟飞来，落在井沿上。
青蛙问小鸟："你从哪儿来呀？"小鸟回答说："我从天上来，飞了一百多里，口渴了，下来找点儿水喝。"
青蛙说："朋友，别说大话了！天不过井口那么大，还用飞那么远吗？"
小鸟说："你弄错了。天无边无际，大得很呐！"
青蛙笑了，说："朋友，我天天坐在井里，一抬头就能看见天。我不会弄错的。"
小鸟也笑了，说："朋友，你是弄错了。不信，你跳出井来看一看吧。"`, recognize: "沿 答 渴 喝 话 际", write: "井 观 沿 答 渴 喝 话 际", keyWords: "井沿、口渴、大话、无边无际、弄错、回答" },
        { title: "13 寒号鸟", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132991.mp3", content: `山脚下有一堵石崖，崖上有一道缝，寒号鸟就把这道缝当作自己的窝。石崖前面有一条河，河边有一棵大杨树，杨树上住着喜鹊。寒号鸟和喜鹊面对面住着，成了邻居。
几阵秋风，树叶落尽，冬天快要到了。
有一天，天气晴朗。喜鹊一早飞出去，东寻西找，衔回来一些枯草，就忙着做窝，准备过冬。寒号鸟却整天出去玩，累了就回来睡觉。喜鹊说："寒号鸟，别睡了，大好晴天，赶快做窝。"
寒号鸟不听劝告，躺在崖缝里对喜鹊说："傻喜鹊，不要吵。太阳高照，正好睡觉。"
冬天说到就到，寒风呼呼地刮着。喜鹊住在温暖的窝里。寒号鸟在崖缝里冻得直打哆嗦，不停地叫着："哆啰啰，哆啰啰，寒风冻死我，明天就做窝。"
第二天清早，风停了，太阳暖暖的，好像又是春天了。喜鹊来到崖缝前劝寒号鸟："趁天晴，快做窝。现在懒惰，将来难过。"
寒号鸟还是不听劝告，伸伸懒腰，答道："傻喜鹊，别啰嗦，天气暖和，得过且过。"
寒冬腊月，大雪纷飞。北风像狮子一样狂吼，崖缝里冷得像冰窖。寒号鸟重复着哀号："哆啰啰，哆啰啰，寒风冻死我，明天就做窝。"
天亮了，太阳出来了，喜鹊在枝头呼唤寒号鸟。可是，寒号鸟已经在夜里冻死了。`, recognize: "堵 缝 鹊 衔 枯 劝 趁 懒 惰 嗦 腊 狂 吼 复 哀", write: "面 阵 朗 枯 却 将 纷 夜", keyWords: "石崖、枯草、劝告、晴朗、哆嗦、懒惰、得过且过、大雪纷飞" },
        { title: "14 我要的是葫芦", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132992.mp3", content: `从前，有个人种了一棵葫芦。细长的葫芦藤上长满了绿叶，开出了几朵雪白的小花。花谢以后，藤上挂了几个小葫芦。多么可爱的小葫芦啊！那个人每天都要去看几次。
有一天，他看见叶子上爬着一些蚜虫，心里想，有几个虫子怕什么！他盯着小葫芦自言自语地说："我的小葫芦，快长啊，快长啊！长得赛过大南瓜才好呢！"
一个邻居看见了，对他说："你别光盯着葫芦了，叶子上生了蚜虫，快治一治吧！"那个人感到很奇怪，说："什么？叶子上的虫还用治？我要的是葫芦。"
没过几天，叶子上的蚜虫更多了。小葫芦慢慢地变黄了，一个一个都落了。`, recognize: "葫 芦 藤 蚜 赛 感 怪", write: "棵 谢 想 盯 言 治 怪", keyWords: "葫芦、细长、蚜虫、自言自语、奇怪、慢慢地" },
        { title: "语文园地五", content: `日积月累：
江雪
【唐】柳宗元
千山鸟飞绝，万径人踪灭。
孤舟蓑笠翁，独钓寒江雪。`, isGarden: true },
    ]},
    { unit: "第六单元 伟人、英雄", lessons: [
        { title: "15 八角楼上", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-4017093.mp3", content: `在井冈山艰苦斗争的年代，毛主席住在茅坪村的八角楼。每当夜幕降临的时候，八角楼上的灯就亮了。
这是个寒冬腊月的深夜，毛主席穿着单军衣，披着薄毯子，坐在竹椅上写文章。他右手握着笔，左手轻轻地拨了拨灯芯，灯光更加明亮了。凝视着这星星之火，毛主席在沉思，连毯子滑落下来也没有察觉到。
就在这盏清油灯下，毛主席写下了许多光辉著作，照亮了中国革命胜利的道路。`, recognize: "楼 争 代 茅 坪 幕 临 腊 握 拨 凝 察", write: "楼 年 夜 披 轻 利 觉 事", keyWords: "艰苦、夜幕降临、寒冬腊月、灯芯、凝视、察觉、光辉" },
        { title: "16 朱德的扁担", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132997.mp3", content: `1928年，朱德同志带领一支队伍到井冈山，跟毛主席会师。山上是红军，山下不远就是敌人。
井冈山上生产粮食不多，常常要抽出一些人到山下的茅坪去挑粮。从井冈山到茅坪，来回有五六十里，山高路陡，非常难走。可是每次挑粮，大家都争着去。
朱德同志也跟战士们一块儿去挑粮。他穿着草鞋，戴着斗笠，挑起粮食，跟大家一块儿爬山。白天挑粮爬山，晚上还常常整夜整夜地研究怎样跟敌人打仗。大家看了心疼，就把他那根扁担藏了起来。不料朱德同志又找来一根扁担，写上"朱德的扁担"五个字。
大家见了，越发敬爱朱德同志，不好意思再藏他的扁担了。`, recognize: "德 扁 担 志 伍 师 敌 陡 难 仗 料 敬", write: "扁 担 志 伍 师 军 战 士", keyWords: "会师、山高路陡、草鞋、斗笠、整夜、不料、敬爱" },
        { title: "17 难忘的泼水节", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-132998.mp3", content: `火红火红的凤凰花开了，傣族人民一年一度的泼水节又到了。
1961年的泼水节，傣族人民特别高兴，因为敬爱的周恩来总理和他们一起过泼水节。
那天早晨，人们敲起象脚鼓，从四面八方赶来了。为了欢迎周总理，人们在地上撒满了凤凰花的花瓣，好像铺上了鲜红的地毯。一条条龙船驶过江面，一串串花炮升上天空。人们欢呼着："周总理来了！"
周总理身穿对襟白褂，咖啡色长裤，头上包着一条水红色头巾，笑容满面地来到人群中。他接过一只象脚鼓，敲着欢乐的鼓点，踩着凤凰花铺成的"地毯"，同傣族人民一起跳舞。
开始泼水了。周总理一手端着盛满清水的银碗，一手拿着柏树枝蘸了水，向人们泼洒，为人们祝福。傣族人民一边欢呼，一边向周总理泼水，祝福他健康长寿。
清清的水，泼呀，洒呀！周总理和傣族人民笑哇，跳哇，是那么开心！
多么幸福哇，1961年的泼水节！多么令人难忘啊，1961年的泼水节！`, recognize: "忘 泼 度 龙 炮 穿 向 令 盛 碗 柏 健", write: "忘 泼 度 龙 炮 穿 向 令", keyWords: "一年一度、四面八方、鲜红、笑容满面、祝福、健康长寿、难忘" },
        { title: "18 刘胡兰", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/ar_audio/e0b85bf7faf8692cd0b7128803d28c57.mp3", content: `1947年1月12日，国民党反动派包围了云周西村。由于叛徒的出卖，年轻的共产党员刘胡兰被捕了，关在一座庙里。
敌人想收买刘胡兰，对她说："告诉我，村子里谁是共产党员，说出一个，给你一百块钱。"刘胡兰大声回答："我不知道！"
敌人又威胁她说："不说就枪毙你！"刘胡兰愤怒地回答："不知道，就是不知道！"
敌人把刘胡兰拉到庙门口的广场上，当着她和乡亲们的面，铡死了被捕的六个民兵。敌人指着血淋淋的铡刀说："不说，也铡死你！"
刘胡兰挺起胸膛说："要杀要砍由你们，怕死不是共产党员！"她迎着呼呼的北风，踏着烈士的鲜血，走到铡刀跟前。刘胡兰光荣地牺牲了，那年她才十五岁。
毛主席听到这个消息，亲笔为她题词："生的伟大，死的光荣。"`, recognize: "刘 兰 派 被 叛 捕 诱 毙 牲 牺 牲", write: "被 道 民 反 村 关 兵 伤", keyWords: "叛徒、收买、威胁、愤怒、胸膛、鲜血、牺牲、光荣" },
        { title: "语文园地六", content: `日积月累：
有志者事竟成。——《后汉书》
志当存高远。—— 诸葛亮
穷且益坚，不坠青云之志。—— 王勃`, isGarden: true },
    ]},
    { unit: "第七单元 想象", lessons: [
        { title: "19 古诗二首", content: `夜宿山寺
【唐】李白
危楼高百尺，手可摘星辰。
不敢高声语，恐惊天上人。

敕勒歌
北朝民歌
敕勒川，阴山下。
天似穹庐，笼盖四野。
天苍苍，野茫茫，风吹草低见牛羊。`, recognize: "宿 危 辰 敢 惊 敕 勒 川 穹 庐 笼 茫", write: "楼 依 尽 层 照 炉 烟 川", keyWords: "危楼、星辰、高声、敕勒川、穹庐、天苍苍、野茫茫" },
        { title: "20 雾在哪里", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-133003.mp3", content: `从前有一片雾，他是个淘气的孩子。
有一天，雾飞到海上。
"我要把大海藏起来。"于是，他把大海藏了起来。无论是海水、船只，还是蓝色的远方，都看不见了。
"现在我要把天空连同太阳一起藏起来。"于是，他把天空连同太阳一起藏了起来。霎时，四周变暗了，无论是天空，还是天空中的太阳，都看不见了。
雾来到岸边。
"现在我要把海岸藏起来。"雾把海岸藏了起来，同时也把城市藏了起来。房屋、街道、树木、桥梁，甚至行人和小黑猫，雾把一切都藏了起来，什么都看不见了。
他躲在城市的上空，说道："现在，我该把谁藏起来呢？"
雾想：我要把自己藏起来。
不久，大海连同船只和远方，天空连同太阳，海岸连同城市，街道连同房屋和桥梁，都露出来了。路上走着行人。小黑猫也出现了，它摇着黑尾巴，悠闲地散步。
雾呢？不知道消失到哪里去了。`, recognize: "雾 淘 藏 岸 于 甚 至 街 梁", write: "于 论 岸 屋 切 久 散 步", keyWords: "淘气、霎时、岸边、街道、桥梁、悠闲、消失" },
        { title: "21 雪孩子", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/ar_audio/5d8320d854e63f7111841eafd13c8cc8.MP3", content: `下了一夜大雪，地上白了，树上白了，房子上也白了。兔妈妈出门去找吃的，她堆了一个漂亮的雪孩子，让他陪着小白兔。
小白兔坐在雪孩子身边唱歌。后来小白兔觉得冷，回到屋里，往火里添了柴，上床睡着了。屋里的火越烧越旺，火把旁边的柴堆烧着了！小白兔睡得正香，一点儿也不知道。
雪孩子看见小白兔家着火了，飞快地跑过去。他冲进屋里，冒着呛人的烟、烫人的火，找到了小白兔。雪孩子抱起小白兔，跑到屋外。小白兔得救了，雪孩子却浑身水淋淋的。
这时候，天上飘来一朵白云。大家看见雪孩子不见了，地上只剩下一滩水。兔妈妈说："多可爱的雪孩子啊！他飞到天上，变成一朵白云啦！"`, recognize: "累 添 柴 烧 旺 渐 冒 烫 终 浑 淋", write: "唱 赶 旺 旁 浑 轻 汽", keyWords: "添柴、旺盛、烧着、冒着、浑身、水淋淋、水汽" },
        { title: "语文园地七", content: `日积月累：
数九歌
一九二九不出手，
三九四九冰上走，
五九六九，沿河看柳，
七九河开，八九雁来，
九九加一九，耕牛遍地走。`, isGarden: true },
    ]},
    { unit: "第八单元 相处道理", lessons: [
        { title: "22 狐假虎威", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/ar_audio/3970579d84c0009523cbd14b4b4ca674.mp3", content: `茂密的森林里，有只老虎正在寻找食物。一只狐狸从老虎身边窜过。老虎扑过去，把狐狸逮住了。
狐狸眼珠子骨碌碌一转，扯着嗓子问老虎："你敢吃我？"
"为什么不敢？"老虎一愣。
"老天爷派我来做你们百兽的首领，你吃了我，就是违抗老天爷的命令。我看你有多大的胆子！"
老虎被蒙住了，松开了爪子。
狐狸摇了摇尾巴，说："我带你到百兽面前走一趟，让你看看我的威风。"
狐狸跟着老虎朝森林深处走去。
森林里的野猪啦，小鹿啦，兔子啦，看见老虎来了，吓得四处逃跑。
老虎不知道野兽害怕的是自己，还以为它们害怕狐狸。`, recognize: "狐 假 威 转 扯 嗓 派 违 抗 趟 纳 兽", write: "食 物 爷 就 爪 神 活 猪", keyWords: "寻找、窜过、骨碌碌、扯着嗓子、违抗、威风、百兽" },
        { title: "23 纸船和风筝", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-135094.mp3", content: `松鼠和小熊住在一座山上。松鼠住在山顶，小熊住在山脚。山上的小溪往下流，正好从小熊家门口流过。
松鼠折了一只纸船，放在小溪里。纸船漂呀漂，漂到小熊家门口。小熊拿起纸船一看，乐坏了。纸船里放着一颗小松果，帆船上挂着一张纸条，上面写着："祝你快乐！"
小熊也想折一只风筝送给松鼠，他精心扎好一只风筝。风筝乘着风，飘呀飘，飘到了松鼠家门口。松鼠一把抓住风筝，开心极了！风筝上挂着一张纸条："祝你幸福！"
纸船和风筝让他们俩成了好朋友。
可是有一天，他们俩为了一点小事吵了一架。山顶上再也看不到飘荡的风筝，小溪里再也漂不来纸船了。松鼠很难过。他还是每天折纸船，但是不好意思送出去。小熊也很难过，每天扎风筝，却不敢放飞。
过了几天，松鼠在一只纸船上写下一句话："如果你愿意和好，就放一只风筝吧！"他把纸船放入小溪。小熊看见纸船，激动地放飞了风筝。松鼠看见空中飘来的风筝，高兴得哭了。`, recognize: "筝 鼠 漂 扎 抓 幸 愿 哭", write: "折 张 祝 扎 抓 但 哭 号", keyWords: "山脚、漂流、乐坏、幸福、吵架、难过、愿意、和好" },
        { title: "24 风娃娃", audio: "https://ywld-1315558954.51jiaoxi.com/yw-static/lesson/1/132948-135095.mp3", content: `风娃娃长大了，风妈妈对他说："到田野里去吧，去帮助人们做事。"
风娃娃来到田野，看见许多人正在用力抽水灌溉禾苗。他深深吸一口气，使劲一吹，水流得更快了。人们开心地向他道谢。风娃娃十分得意：帮助人们做事真容易，只要有力气就行！
风娃娃来到河边，看见船夫艰难地拉船。风娃娃用力朝着河面吹风，船飞快向前行驶。船夫们笑着感谢他。
风娃娃一路向前，来到一座广场。许多孩子正在放风筝。风娃娃使劲吹风，风筝线一下子被吹断，风筝全都飞走了。孩子们伤心地哭起来。
路边晾晒衣服的人们，衣服也被风吹落。人们纷纷责怪风娃娃。
风娃娃委屈地回家问妈妈。风妈妈告诉他："做事情光有好的愿望还不行，还要看是不是真的对别人有用。"`, recognize: "娃 田 抽 秧 劲 拉 船 责", write: "车 得 秧 苗 汗 场 伤 路", keyWords: "田野、抽水、使劲、得意、风筝、责怪、愿望" },
        { title: "语文园地八", content: `日积月累：
狼吞虎咽 惊弓之鸟 胆小如鼠
龙飞凤舞 漏网之鱼 如虎添翼
鸡鸣狗吠 害群之马 如鱼得水`, isGarden: true },
    ]},
];

// ===== 默认打卡分类 =====
const DEFAULT_CHECKIN_CATEGORIES = [
    {
        name: "语文", icon: "📖", items: [
            { name: "课外阅读", stars: 2 },
            { name: "课后作业", stars: 3 },
            { name: "做一套试卷", stars: 5 },
            { name: "汉字字帖", stars: 2 }
        ]
    },
    {
        name: "英语", icon: "🔤", items: [
            { name: "课后作业", stars: 3 },
            { name: "英语绘本5本", stars: 3 },
            { name: "做一套试卷", stars: 5 },
            { name: "英文字帖", stars: 2 }
        ]
    },
    {
        name: "数学", icon: "🔢", items: [
            { name: "课后作业", stars: 3 },
            { name: "做一套试卷", stars: 5 }
        ]
    },
    {
        name: "运动", icon: "⚽", items: [
            { name: "跳绳", stars: 2 },
            { name: "滑轮", stars: 2 },
            { name: "羽毛球", stars: 3 },
            { name: "跑步", stars: 2 },
            { name: "篮球", stars: 3 },
            { name: "游泳", stars: 2 }
        ]
    },
    {
        name: "家务", icon: "🏠", items: [
            { name: "扔垃圾", stars: 1 },
            { name: "扫地", stars: 2 },
            { name: "洗碗", stars: 2 }
        ]
    }
];

// ===== 默认奖励规则 =====
const DEFAULT_REWARD_RULES = {
    assessment: {
        threeStar: 3,   // 100分得3颗星
        twoStar: 2,     // 90分得2颗星
        oneStar: 1,     // 90分以下得1颗星
        passLine: 90    // 合格线
    },
    exam: [
        { min: 100, max: 100, stars: 10 },
        { min: 95, max: 99.9, stars: 5 },
        { min: 90, max: 94.9, stars: 2 },
        { min: 80, max: 89.9, stars: 1 },
        { min: 0, max: 79.9, stars: 0 }
    ]
};

// ===== 默认商城商品 =====
const DEFAULT_PRODUCTS = [
    { name: "看动画片30分钟", cost: 5, icon: "", dailyLimit: 2, intervalDays: 0, active: true },
    { name: "听故事30分钟", cost: 5, icon: "", dailyLimit: 4, intervalDays: 0, active: true },
    { name: "雪糕一个", cost: 5, icon: "", dailyLimit: 1, intervalDays: 2, active: true },
    { name: "玩具一个", cost: 80, icon: "", dailyLimit: 1, intervalDays: 0, active: true },
    { name: "买零食（20元以内）", cost: 30, icon: "", dailyLimit: 1, intervalDays: 0, active: true },
    { name: "买零食（50元以内）", cost: 60, icon: "", dailyLimit: 1, intervalDays: 0, active: true },
    { name: "在外面吃饭", cost: 80, icon: "", dailyLimit: 1, intervalDays: 0, active: true },
    { name: "外出住酒店", cost: 200, icon: "", dailyLimit: 1, intervalDays: 0, active: true },
    { name: "买饮料喝", cost: 10, icon: "", dailyLimit: 1, intervalDays: 0, active: true },
    { name: "奖励10元", cost: 100, icon: "", dailyLimit: 999, intervalDays: 0, active: true }
];

// 导出到全局
if (typeof window !== 'undefined') {
    window.PINYIN_WORDS = PINYIN_WORDS;
    window.ENGLISH_WORDS = ENGLISH_WORDS;
    window.ENGLISH_SENTENCES = ENGLISH_SENTENCES;
    window.IDIOM_DATA = IDIOM_DATA;
    window.ENGLISH_TEXTBOOK = ENGLISH_TEXTBOOK;
    window.CHINESE_TEXTBOOK = CHINESE_TEXTBOOK;
    window.DEFAULT_CHECKIN_CATEGORIES = DEFAULT_CHECKIN_CATEGORIES;
    window.DEFAULT_REWARD_RULES = DEFAULT_REWARD_RULES;
    window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
}
