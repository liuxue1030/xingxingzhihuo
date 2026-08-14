/* ========================================
 * 星星之火 - 数据存储管理 (localStorage)
 * 多孩子账号隔离 / 星星账本 / 各模块数据
 * ======================================== */

// 模块映射：starLedger 的 type <-> 左侧任务栏中文模块名
const MODULE_MAP = {
    checkin: '今日打卡',
    assessment: '知识测评',
    exam: '考试积星',
    exchange: '星星兑换商城'
};

const Storage = {
    DB_KEY: 'starfire_db',
    LOGIN_KEY: 'starfire_login',

    // 初始化数据库
    init() {
        let db = this.getDB();
        if (!db) {
            db = {
                initialized: true,
                parentId: 1,
                parentPassword: '123456',
                currentChildId: 1,
                children: [
                    { id: 1, nickname: '小朋友', avatar: '🧒', hidden: false }
                ],
                // 每个孩子的独立数据按 childId 存储
                childrenData: {},
                globalConfig: {
                    rewardRules: JSON.parse(JSON.stringify(DEFAULT_REWARD_RULES)),
                    products: JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)),
                    productVersion: 2
                },
                // 中华历史科普：仅浏览，不存储任何自定义数据
            };
            db.childrenData[1] = this.createChildData();
            this.saveDB(db);
        } else {
            // 迁移：旧版奖品（v1）替换为新版默认奖品（v2）
            if (!db.globalConfig.productVersion || db.globalConfig.productVersion < 2) {
                db.globalConfig.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
                db.globalConfig.productVersion = 2;
                this.saveDB(db);
            }
            // 迁移：统一所有日期为 YYYY-MM-DD（修复 Excel 导入的 2026/8/3 等格式）
            if (this.normalizeAllDates(db)) {
                this.saveDB(db);
            }
            // 迁移：补齐新增的兑换奖品，并同步默认星星数/每日上限（保留用户已有的上下架设置）
            if (Array.isArray(db.globalConfig.products)) {
                let changed = false;
                DEFAULT_PRODUCTS.forEach(dp => {
                    const existing = db.globalConfig.products.find(p => p.name === dp.name);
                    if (!existing) {
                        db.globalConfig.products.push(JSON.parse(JSON.stringify(dp)));
                        changed = true;
                    } else {
                        if (existing.cost !== dp.cost || existing.dailyLimit !== dp.dailyLimit || existing.intervalDays !== (dp.intervalDays || 0)) {
                            existing.cost = dp.cost;
                            existing.dailyLimit = dp.dailyLimit;
                            existing.intervalDays = dp.intervalDays || 0;
                            changed = true;
                        }
                    }
                });
                if (changed) this.saveDB(db);
            }

            // 迁移：考试积星规则整体同步为最新默认规则
            if (db.globalConfig.rewardRules && Array.isArray(db.globalConfig.rewardRules.exam)) {
                const def = DEFAULT_REWARD_RULES.exam;
                const cur = db.globalConfig.rewardRules.exam;
                const same = def.length === cur.length && def.every((d, i) => {
                    const r = cur[i];
                    return r && r.min === d.min && r.max === d.max && r.stars === d.stars;
                });
                if (!same) {
                    db.globalConfig.rewardRules.exam = JSON.parse(JSON.stringify(def));
                    this.saveDB(db);
                }
            }

            // 迁移：为每个孩子的打卡分类补齐默认任务（按 分类名+任务名 去重，保留已有任务的星星数设置）
            if (db.childrenData) {
                let checkinChanged = false;
                Object.keys(db.childrenData).forEach(cid => {
                    const cats = db.childrenData[cid].checkinCategories;
                    if (!Array.isArray(cats)) return;
                    DEFAULT_CHECKIN_CATEGORIES.forEach(dc => {
                        const cat = cats.find(c => c.name === dc.name);
                        if (!cat || !Array.isArray(cat.items)) return;
                        dc.items.forEach(di => {
                            if (!cat.items.find(it => it.name === di.name)) {
                                cat.items.push(JSON.parse(JSON.stringify(di)));
                                checkinChanged = true;
                            }
                        });
                    });
                });
                if (checkinChanged) this.saveDB(db);
            }
        }
        return db;
    },

    // ===== 登录状态管理 =====
    isLoggedIn() {
        const loginChildId = localStorage.getItem(this.LOGIN_KEY);
        return loginChildId !== null && loginChildId !== '';
    },

    getLoggedInChildId() {
        return localStorage.getItem(this.LOGIN_KEY);
    },

    login(childId) {
        localStorage.setItem(this.LOGIN_KEY, String(childId));
        this.switchChild(childId);
    },

    logout() {
        localStorage.removeItem(this.LOGIN_KEY);
    },

    createChildData() {
        return {
            stars: 0,
            starLedger: [],          // 星星收支明细 { date, type, label, taskName, amount, balance }
            checkinCategories: JSON.parse(JSON.stringify(DEFAULT_CHECKIN_CATEGORIES)),
            checkinRecords: {},       // { '2026-07-31': { '语文-课外阅读': true } }
            checkinStreak: {},        // { '语文-课外阅读': { count, lastDate } }
            assessmentRecords: {},    // { 'pinyin': { date, score, stars, details, wrongQuestions } }
            examRecords: [],          // [{ date, subject, examType, score, stars, photo }]
            examHistory: [],
            errorBook: [],           // [{ id, subject, question, wrongAnswer, correctAnswer, analysis, knowledgePoint, reason, difficulty, tags, createdAt, mastered }]
            exchangeRecords: [],      // [{ date, productName, cost }]
            todayExchangeCount: {},   // { '2026-07-31': { productName: count } }
            errorTags: ['校内作业', '家庭练习', '单元试卷']
        };
    },

    getDB() {
        try {
            return JSON.parse(localStorage.getItem(this.DB_KEY));
        } catch(e) {
            return null;
        }
    },

    saveDB(db) {
        try {
            localStorage.setItem(this.DB_KEY, JSON.stringify(db));
            return true;
        } catch (e) {
            // 通常是 localStorage 配额超限（QuotaExceededError）
            console.error('保存失败：', e);
            return false;
        }
    },

    // 获取当前孩子ID
    getCurrentChildId() {
        const db = this.getDB();
        return db ? db.currentChildId : 1;
    },

    // 获取当前孩子数据
    getChildData(childId) {
        const db = this.getDB();
        childId = childId || db.currentChildId;
        return db.childrenData[childId] || this.createChildData();
    },

    // 保存孩子数据
    saveChildData(childId, data) {
        const db = this.getDB();
        if (!childId) childId = db.currentChildId;
        db.childrenData[childId] = data;
        return this.saveDB(db);
    },

    // 获取当前孩子信息
    getCurrentChild() {
        const db = this.getDB();
        return db.children.find(c => c.id === db.currentChildId) || db.children[0];
    },

    // 获取所有孩子
    getAllChildren() {
        const db = this.getDB();
        return db.children.filter(c => !c.hidden);
    },

    // 切换孩子
    switchChild(childId) {
        const db = this.getDB();
        db.currentChildId = childId;
        this.saveDB(db);
    },

    // 添加孩子
    addChild(nickname, avatar) {
        const db = this.getDB();
        const newId = Math.max(...db.children.map(c => c.id), 0) + 1;
        db.children.push({ id: newId, nickname, avatar: avatar || '🧒', hidden: false });
        db.childrenData[newId] = this.createChildData();
        this.saveDB(db);
        return newId;
    },

    // 隐藏/显示孩子
    toggleChildHidden(childId) {
        const db = this.getDB();
        const child = db.children.find(c => c.id === childId);
        if (child) {
            child.hidden = !child.hidden;
            this.saveDB(db);
        }
    },

    // 更新孩子信息
    updateChild(childId, nickname, avatar) {
        const db = this.getDB();
        const child = db.children.find(c => c.id === childId);
        if (child) {
            if (nickname) child.nickname = nickname;
            if (avatar) child.avatar = avatar;
            this.saveDB(db);
        }
    },

    // 获取星星余额
    getStarBalance(childId) {
        const data = this.getChildData(childId);
        return data.stars || 0;
    },

    // 星星变动(增加/扣除)
    addStar(childId, amount, type, label, taskName) {
        const db = this.getDB();
        if (!childId) childId = db.currentChildId;
        const data = db.childrenData[childId];
        data.stars += amount;
        const today = this.todayStr();
        data.starLedger.push({
            date: today,
            timestamp: Date.now(),
            type: type,          // 'checkin' / 'assessment' / 'exam' / 'exchange'
            label: label,        // 日常打卡 / 知识测评 / 学科单元考试 / 商城兑换
            taskName: taskName,
            amount: amount,      // 正=获得, 负=扣除
            balance: data.stars
        });
        this.saveDB(db);
        return data.stars;
    },

    // 获取当月星星明细
    getMonthlyStars(childId, year, month) {
        const data = this.getChildData(childId);
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        const monthly = data.starLedger.filter(r => r.date.startsWith(prefix));
        const result = {};
        monthly.forEach(r => {
            if (!result[r.date]) result[r.date] = { gained: 0, spent: 0, details: [] };
            if (r.amount > 0) result[r.date].gained += r.amount;
            else result[r.date].spent += Math.abs(r.amount);
            result[r.date].details.push(r);
        });
        return result;
    },

    // 获取本周统计
    getWeeklyStats(childId) {
        const data = this.getChildData(childId);
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekStartStr = this.dateStr(weekStart);
        const weekly = data.starLedger.filter(r => r.date >= weekStartStr);
        let gained = 0, spent = 0;
        weekly.forEach(r => {
            if (r.amount > 0) gained += r.amount;
            else spent += Math.abs(r.amount);
        });
        return { gained, spent };
    },

    // 获取某日明细
    getDailyDetails(childId, dateStr) {
        const data = this.getChildData(childId);
        return data.starLedger.filter(r => r.date === dateStr);
    },

    // 全量星星总账
    getFullLedger(childId) {
        const data = this.getChildData(childId);
        return data.starLedger || [];
    },

    // ===== 打卡 =====
    getCheckinCategories(childId) {
        const data = this.getChildData(childId);
        return data.checkinCategories;
    },

    saveCheckinCategories(childId, categories) {
        const data = this.getChildData(childId);
        data.checkinCategories = categories;
        this.saveChildData(childId, data);
    },

    doCheckin(childId, categoryIdx, itemIdx) {
        const data = this.getChildData(childId);
        const today = this.todayStr();
        const cat = data.checkinCategories[categoryIdx];
        const item = cat.items[itemIdx];
        const key = `${cat.name}-${item.name}`;

        if (!data.checkinRecords[today]) data.checkinRecords[today] = {};
        if (data.checkinRecords[today][key]) return false; // 已打卡

        data.checkinRecords[today][key] = true;

        // 更新连续天数
        if (!data.checkinStreak[key]) data.checkinStreak[key] = { count: 0, lastDate: null };
        const streak = data.checkinStreak[key];
        const yesterday = this.dateStr(new Date(Date.now() - 86400000));
        if (streak.lastDate === yesterday) {
            streak.count++;
        } else if (streak.lastDate === today) {
            // 同一天重复不处理
        } else {
            streak.count = 1;
        }
        streak.lastDate = today;

        // 发放星星
        data.stars += item.stars;
        data.starLedger.push({
            date: today,
            timestamp: Date.now(),
            type: 'checkin',
            label: '日常打卡',
            taskName: `${cat.name}-${item.name}`,
            amount: item.stars,
            balance: data.stars
        });

        this.saveChildData(childId, data);
        return true;
    },

    undoCheckin(childId, categoryIdx, itemIdx) {
        const data = this.getChildData(childId);
        const today = this.todayStr();
        const cat = data.checkinCategories[categoryIdx];
        const item = cat.items[itemIdx];
        const key = `${cat.name}-${item.name}`;

        if (!data.checkinRecords[today] || !data.checkinRecords[today][key]) return false;

        // 删除今日打卡记录
        delete data.checkinRecords[today][key];
        if (Object.keys(data.checkinRecords[today]).length === 0) {
            delete data.checkinRecords[today];
        }

        // 回退连续天数
        if (data.checkinStreak[key]) {
            if (data.checkinStreak[key].lastDate === today) {
                data.checkinStreak[key].count = Math.max(0, data.checkinStreak[key].count - 1);
                // 回退到昨天的日期（如果还有连续记录的话）
                const yesterday = this.dateStr(new Date(Date.now() - 86400000));
                if (data.checkinRecords[yesterday] && data.checkinRecords[yesterday][key]) {
                    data.checkinStreak[key].lastDate = yesterday;
                } else {
                    data.checkinStreak[key].lastDate = null;
                }
            }
        }

        // 扣回星星 - 直接删除原始打卡记录，当日明细不体现这笔
        data.stars -= item.stars;
        const taskKey = `${cat.name}-${item.name}`;
        for (let i = data.starLedger.length - 1; i >= 0; i--) {
            if (data.starLedger[i].date === today &&
                data.starLedger[i].type === 'checkin' &&
                data.starLedger[i].taskName === taskKey) {
                data.starLedger.splice(i, 1);
                break;
            }
        }
        // 重新计算所有记录的余额
        let bal = 0;
        data.starLedger.forEach(entry => {
            bal += entry.amount;
            entry.balance = bal;
        });

        this.saveChildData(childId, data);
        return true;
    },

    getTodayCheckins(childId) {
        const data = this.getChildData(childId);
        const today = this.todayStr();
        return data.checkinRecords[today] || {};
    },

    getCheckinStreak(childId, key) {
        const data = this.getChildData(childId);
        return data.checkinStreak[key] || { count: 0, lastDate: null };
    },

    getCheckinHistory(childId, categoryIdx, itemIdx) {
        const data = this.getChildData(childId);
        const cat = data.checkinCategories[categoryIdx];
        const item = cat.items[itemIdx];
        const key = `${cat.name}-${item.name}`;
        const records = [];
        for (const [date, checkins] of Object.entries(data.checkinRecords)) {
            if (checkins[key]) {
                records.push({ date, stars: item.stars });
            }
        }
        return records.sort((a, b) => b.date.localeCompare(a.date));
    },

    // ===== 测评 =====
    getAssessmentRecord(childId, assessType) {
        const data = this.getChildData(childId);
        if (!data.assessmentRecords[assessType]) return null;
        return data.assessmentRecords[assessType];
    },

    hasAssessedToday(childId, assessType) {
        const data = this.getChildData(childId);
        const today = this.todayStr();
        return data.assessmentRecords[assessType] && data.assessmentRecords[assessType].date === today;
    },

    saveAssessmentResult(childId, assessType, result, taskName) {
        const data = this.getChildData(childId);
        const today = this.todayStr();
        result.date = today;
        data.assessmentRecords[assessType] = result;

        // 发放星星
        data.stars += result.stars;
        data.starLedger.push({
            date: today,
            timestamp: Date.now(),
            type: 'assessment',
            label: '知识测评',
            taskName: taskName || assessType,
            amount: result.stars,
            balance: data.stars
        });

        this.saveChildData(childId, data);
    },

    // ===== 学科考试 =====
    saveExamRecord(childId, record) {
        const data = this.getChildData(childId);
        const today = this.todayStr();
        record.date = today;
        record.timestamp = Date.now();
        data.examRecords.push(record);

        // 发放星星
        if (record.stars > 0) {
            data.stars += record.stars;
            data.starLedger.push({
                date: today,
                timestamp: Date.now(),
                type: 'exam',
                label: `学科${record.examType}`,
                taskName: `${record.subject}-${record.examType}`,
                amount: record.stars,
                balance: data.stars,
                score: (typeof record.score === 'number') ? record.score : ''  // 仅考试记录带分数，供 Excel 导出
            });
        }

        this.saveChildData(childId, data);
        return true;
    },

    getExamRecords(childId) {
        const data = this.getChildData(childId);
        return data.examRecords || [];
    },

    // ===== 错题本 =====
    getErrorBook(childId) {
        const data = this.getChildData(childId);
        return data.errorBook || [];
    },

    addError(childId, error) {
        const data = this.getChildData(childId);
        error.id = Date.now();
        error.createdAt = this.todayStr();
        data.errorBook.push(error);
        return this.saveChildData(childId, data);
    },

    updateError(childId, errorId, updates) {
        const data = this.getChildData(childId);
        const error = data.errorBook.find(e => e.id === errorId);
        if (error) {
            Object.assign(error, updates);
            this.saveChildData(childId, data);
        }
    },

    deleteError(childId, errorId) {
        const data = this.getChildData(childId);
        data.errorBook = data.errorBook.filter(e => e.id !== errorId);
        this.saveChildData(childId, data);
    },

    getErrorTags(childId) {
        const data = this.getChildData(childId);
        return data.errorTags || ['校内作业', '家庭练习', '单元试卷'];
    },

    addErrorTag(childId, tag) {
        const data = this.getChildData(childId);
        if (!data.errorTags) data.errorTags = ['校内作业', '家庭练习', '单元试卷'];
        if (!data.errorTags.includes(tag)) {
            data.errorTags.push(tag);
            this.saveChildData(childId, data);
        }
    },

    // ===== 商城 =====
    getProducts() {
        const db = this.getDB();
        return db.globalConfig.products || [];
    },

    saveProducts(products) {
        const db = this.getDB();
        db.globalConfig.products = products;
        this.saveDB(db);
    },

    doExchange(childId, productIdx) {
        const db = this.getDB();
        const data = db.childrenData[childId || db.currentChildId];
        const products = db.globalConfig.products;
        const product = products[productIdx];
        const today = this.todayStr();

        // 兑换间隔天数检查
        const exStatus = this.getProductExchangeStatus(childId, product);
        if (!exStatus.available) return { success: false, reason: 'interval', nextDate: exStatus.nextDate };

        if (!data.todayExchangeCount[today]) data.todayExchangeCount[today] = {};
        const todayCount = data.todayExchangeCount[today][product.name] || 0;

        if (todayCount >= product.dailyLimit) return { success: false, reason: 'limit' };
        if (data.stars < product.cost) return { success: false, reason: 'insufficient' };

        data.stars -= product.cost;
        data.todayExchangeCount[today][product.name] = todayCount + 1;
        data.exchangeRecords.push({
            date: today,
            timestamp: Date.now(),
            productName: product.name,
            cost: product.cost
        });
        data.starLedger.push({
            date: today,
            timestamp: Date.now(),
            type: 'exchange',
            label: '商城兑换',
            taskName: product.name,
            amount: -product.cost,
            balance: data.stars
        });

        this.saveDB(db);
        return { success: true, newBalance: data.stars };
    },

    // 计算某奖品（针对指定孩子）的兑换间隔状态
    getProductExchangeStatus(childId, product) {
        const interval = Number(product.intervalDays) || 0;
        if (interval <= 0) return { available: true, nextDate: null, daysLeft: 0 };
        const db = this.getDB();
        const data = db.childrenData[childId || db.currentChildId];
        const records = data.exchangeRecords || [];
        let lastDate = null;
        for (const r of records) {
            if (r.productName === product.name && (!lastDate || r.date > lastDate)) lastDate = r.date;
        }
        if (!lastDate) return { available: true, nextDate: null, daysLeft: 0 };
        const nextDate = this.addDays(lastDate, interval + 1);
        const today = this.todayStr();
        if (today < nextDate) {
            return { available: false, nextDate: nextDate, daysLeft: this.diffDays(today, nextDate) };
        }
        return { available: true, nextDate: nextDate, daysLeft: 0 };
    },

    addDays(dateStr, n) {
        const d = new Date(dateStr + 'T00:00:00');
        d.setDate(d.getDate() + n);
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return d.getFullYear() + '-' + m + '-' + day;
    },

    diffDays(fromStr, toStr) {
        const a = new Date(fromStr + 'T00:00:00');
        const b = new Date(toStr + 'T00:00:00');
        return Math.round((b - a) / 86400000);
    },

    getExchangeRecords(childId) {
        const data = this.getChildData(childId);
        return data.exchangeRecords || [];
    },

    // 撤销兑换（退还星星）
    undoExchange(childId, recordIdx) {
        const db = this.getDB();
        if (!childId) childId = db.currentChildId;
        const data = db.childrenData[childId];
        const records = data.exchangeRecords || [];
        if (recordIdx < 0 || recordIdx >= records.length) return { success: false, reason: 'not_found' };

        const record = records[recordIdx];

        // 1. 从兑换记录中删除
        records.splice(recordIdx, 1);

        // 2. 回退当日兑换次数
        if (data.todayExchangeCount[record.date]) {
            const cnt = data.todayExchangeCount[record.date][record.productName] || 0;
            if (cnt > 0) {
                data.todayExchangeCount[record.date][record.productName] = cnt - 1;
                if (data.todayExchangeCount[record.date][record.productName] === 0) {
                    delete data.todayExchangeCount[record.date][record.productName];
                }
                if (Object.keys(data.todayExchangeCount[record.date]).length === 0) {
                    delete data.todayExchangeCount[record.date];
                }
            }
        }

        // 3. 退还星星
        data.stars += record.cost;

        // 4. 删除对应的星星账本记录（按日期+类型+名称+金额匹配，从后往前找）
        for (let i = data.starLedger.length - 1; i >= 0; i--) {
            const entry = data.starLedger[i];
            if (entry.date === record.date &&
                entry.type === 'exchange' &&
                entry.taskName === record.productName &&
                entry.amount === -record.cost) {
                data.starLedger.splice(i, 1);
                break;
            }
        }

        // 5. 重新计算所有记录的余额
        let bal = 0;
        data.starLedger.forEach(entry => {
            bal += entry.amount;
            entry.balance = bal;
        });

        const saved = this.saveDB(db);
        if (!saved) return { success: false, reason: 'storage_error' };
        return { success: true, newBalance: data.stars };
    },

    getTodayExchangeCount(childId, productName) {
        const data = this.getChildData(childId);
        const today = this.todayStr();
        if (!data.todayExchangeCount[today]) return 0;
        return data.todayExchangeCount[today][productName] || 0;
    },

    // ===== 奖励规则 =====
    getRewardRules() {
        const db = this.getDB();
        return db.globalConfig.rewardRules;
    },

    saveRewardRules(rules) {
        const db = this.getDB();
        db.globalConfig.rewardRules = rules;
        this.saveDB(db);
    },

    // 计算考试星星
    calcExamStars(score) {
        const rules = this.getRewardRules();
        for (const rule of rules.exam) {
            if (score >= rule.min && score <= rule.max) {
                return rule.stars;
            }
        }
        return 0;
    },

    // ===== 家长设置 =====
    getParentPassword() {
        const db = this.getDB();
        return db.parentPassword;
    },

    setParentPassword(newPassword) {
        const db = this.getDB();
        db.parentPassword = newPassword;
        this.saveDB(db);
    },

    verifyParentPassword(password) {
        const db = this.getDB();
        return db.parentPassword === password;
    },

    // ===== 工具方法 =====
    todayStr() {
        return this.dateStr(new Date());
    },

    dateStr(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    },

    // 把各种日期格式统一转成 YYYY-MM-DD（导入 Excel / 修复旧数据用）
    normalizeDateStr(input) {
        if (!input && input !== 0) return '';
        if (input instanceof Date) return this.dateStr(input);
        if (typeof input === 'number') {
            // 大数字视为 Unix 时间戳（毫秒）
            if (input > 1e10) return this.dateStr(new Date(input));
            // 小数字视为 Excel 序列号（2026-08-03 约 46292）
            if (input > 30000 && input < 50000) {
                return this.dateStr(new Date(Math.round((input - 25569) * 86400 * 1000)));
            }
            return '';
        }
        let s = String(input).trim();
        if (!s) return '';
        // 纯数字且在 Excel 序列号范围内（如 "46238"）
        if (/^\d+(\.\d+)?$/.test(s)) {
            const num = Number(s);
            if (num > 30000 && num < 50000) return this.normalizeDateStr(num);
        }
        // 已经是标准格式
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        // YYYY/M/D、YYYY.MM.DD、YYYY年M月D日 等
        const m1 = s.match(/^(\d{4})[-\/.年](\d{1,2})[-\/.月](\d{1,2})/);
        if (m1) {
            const y = m1[1], mo = String(m1[2]).padStart(2, '0'), d = String(m1[3]).padStart(2, '0');
            if (parseInt(mo, 10) <= 12 && parseInt(d, 10) <= 31) return `${y}-${mo}-${d}`;
        }
        // M/D/YYYY、MM-DD-YYYY 等
        const m2 = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/);
        if (m2) {
            const mo = String(m2[1]).padStart(2, '0'), d = String(m2[2]).padStart(2, '0'), y = m2[3];
            if (parseInt(mo, 10) <= 12 && parseInt(d, 10) <= 31) return `${y}-${mo}-${d}`;
        }
        // 兜底：尝试浏览器原生解析
        const d = new Date(s);
        if (!isNaN(d.getTime())) return this.dateStr(d);
        return s; // 无法解析则原样返回，避免丢数据
    },

    // 批量规范化所有孩子数据中的日期字段（兼容旧导入 / Excel 格式不一致）
    normalizeAllDates(db) {
        let changed = false;
        const norm = (v) => {
            const vs = String(v || '');
            // 修复旧版 bug 产生的“46238-01-01”这类日期：把年份当成 Excel 序列号还原
            const corrupt = vs.match(/^(\d{5,})-01-01$/);
            if (corrupt) {
                const serial = Number(corrupt[1]);
                if (serial > 30000 && serial < 50000) {
                    const recovered = this.dateStr(new Date(Math.round((serial - 25569) * 86400 * 1000)));
                    if (recovered) { changed = true; return recovered; }
                }
            }
            const n = this.normalizeDateStr(v);
            if (n && n !== v) { changed = true; return n; }
            return v;
        };
        Object.values(db.childrenData || {}).forEach(data => {
            (data.starLedger || []).forEach(r => { if (r.date) r.date = norm(r.date); });
            (data.exchangeRecords || []).forEach(r => { if (r.date) r.date = norm(r.date); });
            (data.examRecords || []).forEach(r => { if (r.date) r.date = norm(r.date); });
            // checkinRecords: { date: { task: true } }
            if (data.checkinRecords) {
                Object.keys(data.checkinRecords).forEach(k => {
                    const nk = norm(k);
                    if (nk && nk !== k) {
                        data.checkinRecords[nk] = data.checkinRecords[k];
                        delete data.checkinRecords[k];
                    }
                });
            }
            // todayExchangeCount: { date: { product: count } }
            if (data.todayExchangeCount) {
                Object.keys(data.todayExchangeCount).forEach(k => {
                    const nk = norm(k);
                    if (nk && nk !== k) {
                        data.todayExchangeCount[nk] = data.todayExchangeCount[k];
                        delete data.todayExchangeCount[k];
                    }
                });
            }
            // assessmentRecords: { key: { date, ... } }
            Object.values(data.assessmentRecords || {}).forEach(r => {
                if (r.date) r.date = norm(r.date);
            });
            // errorBook: [{ createdAt }]
            (data.errorBook || []).forEach(r => {
                if (r.createdAt) r.createdAt = norm(r.createdAt);
            });
            // checkinStreak: { task: { lastDate } }
            Object.values(data.checkinStreak || {}).forEach(r => {
                if (r.lastDate) r.lastDate = norm(r.lastDate);
            });
        });
        return changed;
    },

    // type -> 中文模块名（左侧任务栏）
    moduleNameFromType(type) {
        return MODULE_MAP[type] || '其它';
    },

    // 根据模块名/子类/说明推断 type（Excel 导入时路由到对应模块）
    typeFromModule(module, sub, taskName) {
        const m = (module || '') + ' ' + (sub || '') + ' ' + (taskName || '');
        if (m.indexOf('兑换') >= 0) return 'exchange';
        if (m.indexOf('考试') >= 0 || m.indexOf('学科') >= 0) return 'exam';
        if (m.indexOf('测评') >= 0) return 'assessment';
        if (m.indexOf('打卡') >= 0) return 'checkin';
        if (module === '今日打卡') return 'checkin';
        if (module === '知识测评') return 'assessment';
        if (module === '考试积星') return 'exam';
        if (module === '星星兑换商城') return 'exchange';
        return 'checkin';
    },

    // 时间戳 -> 可读 "YYYY-MM-DD HH:mm"
    formatTimestamp(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        if (isNaN(d.getTime())) return '';
        const p = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    },

    // 可读时间 -> 时间戳（解析失败则用当前时间）
    parseTimestamp(str) {
        if (!str) return Date.now();
        const s = String(str).trim();
        const m = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{1,2})/);
        if (m) {
            const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
            if (!isNaN(d.getTime())) return d.getTime();
        }
        const n = Number(s);
        if (!isNaN(n) && n > 0) return n;
        return Date.now();
    },

    // 导出 Excel 用的单 Sheet 明细行（已自动分类，撤销/取消的记录因已从账本删除而不在此列）
    // 含「分数」列：仅考试记录有值，其余为空
    getExcelLedgerRows(childId) {
        const data = this.getChildData(childId);
        const ledger = data.starLedger || [];
        // 为历史考试记录（账本未存分数）做兜底匹配
        const examByKey = {};
        (data.examRecords || []).forEach(ex => {
            examByKey[`${ex.date}|${ex.subject}-${ex.examType}`] = ex;
        });
        return ledger.map(r => {
            let score = '';
            if (r.type === 'exam') {
                if (r.score !== undefined && r.score !== null && r.score !== '') {
                    score = r.score;
                } else {
                    const hit = examByKey[`${r.date}|${r.taskName}`];
                    if (hit && hit.score !== undefined && hit.score !== '') score = hit.score;
                }
            }
            return {
                date: r.date || '',
                module: this.moduleNameFromType(r.type),
                sub: r.label || '',
                taskName: r.taskName || '',
                amount: r.amount || 0,
                score: score,
                timestamp: r.timestamp || Date.now()
            };
        });
    },

    // 数据导出
    // v2：附带完整数据库（db 字段），可整库恢复；旧字段保留以兼容旧版导入
    exportData(childId) {
        const db = this.getDB();
        const data = this.getChildData(childId);
        const child = db.children.find(c => c.id === (childId || db.currentChildId));
        return {
            exportVersion: 2,
            exportedAt: new Date().toISOString(),
            app: '星星之火',
            db: db,
            child: child,
            stars: data.stars,
            starLedger: data.starLedger,
            checkinRecords: data.checkinRecords,
            checkinCategories: data.checkinCategories,
            assessmentRecords: data.assessmentRecords,
            examRecords: data.examRecords,
            errorBook: data.errorBook,
            exchangeRecords: data.exchangeRecords
        };
    },

    // 数据导入（JSON 恢复）
    // 支持两种备份：
    //  v2+：exportVersion>=2 且含 db 字段 → 整库恢复（所有孩子+全局配置+家长密码）
    //  旧版：单孩子备份（child+stars+各记录）→ 按 id/昵称匹配恢复该孩子
    importData(jsonText) {
        let obj;
        try {
            obj = JSON.parse(jsonText);
        } catch (e) {
            return { success: false, reason: 'parse', msg: '文件不是有效的 JSON' };
        }
        if (!obj || typeof obj !== 'object') {
            return { success: false, reason: 'invalid', msg: '备份文件内容无效' };
        }

        // ===== v2+：完整数据库备份 =====
        if (obj.exportVersion >= 2 && obj.db && obj.db.childrenData && Array.isArray(obj.db.children)) {
            const d = obj.db;
            // 补全关键字段，避免结构缺失导致页面报错
            if (!d.initialized) d.initialized = true;
            if (typeof d.parentId !== 'number') d.parentId = 1;
            if (!d.parentPassword) d.parentPassword = '123456';
            if (!d.globalConfig) d.globalConfig = {};
            if (!d.globalConfig.rewardRules) {
                d.globalConfig.rewardRules = JSON.parse(JSON.stringify(DEFAULT_REWARD_RULES));
            }
            if (!Array.isArray(d.globalConfig.products)) {
                d.globalConfig.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
            }
            // 补齐每个孩子的默认结构
            Object.keys(d.childrenData || {}).forEach(cid => {
                const cd = d.childrenData[cid];
                if (!cd) { delete d.childrenData[cid]; return; }
                if (typeof cd.stars !== 'number') cd.stars = 0;
                if (!Array.isArray(cd.starLedger)) cd.starLedger = [];
                if (!cd.checkinCategories) cd.checkinCategories = JSON.parse(JSON.stringify(DEFAULT_CHECKIN_CATEGORIES));
                if (!cd.checkinRecords) cd.checkinRecords = {};
                if (!cd.checkinStreak) cd.checkinStreak = {};
                if (!cd.assessmentRecords) cd.assessmentRecords = {};
                if (!Array.isArray(cd.examRecords)) cd.examRecords = [];
                if (!Array.isArray(cd.examHistory)) cd.examHistory = [];
                if (!Array.isArray(cd.errorBook)) cd.errorBook = [];
                if (!Array.isArray(cd.exchangeRecords)) cd.exchangeRecords = [];
                if (!cd.todayExchangeCount) cd.todayExchangeCount = {};
                if (!Array.isArray(cd.errorTags)) cd.errorTags = ['校内作业', '家庭练习', '单元试卷'];
            });
            // 归一化日期格式（兼容旧数据）
            this.normalizeAllDates(d);
            if (this.saveDB(d)) {
                return { success: true, version: 2, childId: d.currentChildId };
            }
            return { success: false, reason: 'storage', msg: '保存失败（可能是浏览器存储空间不足）' };
        }

        // ===== 旧版：单孩子备份 =====
        if (obj.child && obj.child.id !== undefined && typeof obj.stars === 'number') {
            const db = this.getDB();
            let child = db.children.find(c => c.id === obj.child.id);
            if (!child) child = db.children.find(c => c.nickname === obj.child.nickname);
            if (!child) {
                return { success: false, reason: 'no_child', msg: '找不到匹配的孩子，请先在「设置-孩子管理」中添加同名孩子再导入' };
            }
            const data = db.childrenData[child.id] || this.createChildData();
            if (typeof obj.stars === 'number') data.stars = obj.stars;
            if (Array.isArray(obj.starLedger)) data.starLedger = obj.starLedger;
            if (obj.checkinRecords) data.checkinRecords = obj.checkinRecords;
            if (Array.isArray(obj.checkinCategories)) data.checkinCategories = obj.checkinCategories;
            if (obj.assessmentRecords) data.assessmentRecords = obj.assessmentRecords;
            if (Array.isArray(obj.examRecords)) data.examRecords = obj.examRecords;
            if (Array.isArray(obj.errorBook)) data.errorBook = obj.errorBook;
            if (Array.isArray(obj.exchangeRecords)) data.exchangeRecords = obj.exchangeRecords;
            if (obj.child.nickname) child.nickname = obj.child.nickname;
            if (obj.child.avatar) child.avatar = obj.child.avatar;
            db.childrenData[child.id] = data;
            this.normalizeAllDates(db);
            if (this.saveDB(db)) {
                return { success: true, version: 1, childId: child.id };
            }
            return { success: false, reason: 'storage', msg: '保存失败（可能是浏览器存储空间不足）' };
        }

        return { success: false, reason: 'invalid', msg: '不是星星之火的备份文件' };
    },

    // 从 Excel 单 Sheet 解析结果覆盖当前孩子的所有记录
    // parsed.rows: [{ date, module, sub, taskName, amount, timestamp }]
    // 自动按 module 路由到对应模块，重建 starLedger + 各模块记录
    importExcelData(childId, parsed) {
        const db = this.getDB();
        if (!childId) childId = db.currentChildId;
        const data = db.childrenData[childId];
        if (!data) return { success: false, reason: 'no_child' };

        const ledger = [];
        const exchangeRecords = [];
        const checkinRecords = {};
        const examRecords = [];
        const assessmentRecords = {};

        (parsed.rows || []).forEach(row => {
            const date = this.normalizeDateStr(row.date || '');
            if (!date) return; // 跳过空行
            const module = String(row.module || '');
            const sub = String(row.sub || '');
            const taskName = String(row.taskName || '');
            const amount = Number(row.amount) || 0;
            const timestamp = this.parseTimestamp(row.timestamp);
            const type = this.typeFromModule(module, sub, taskName);
            const label = sub || module || '其它';

            ledger.push({ date: date, timestamp: timestamp, type: type, label: label, taskName: taskName, amount: amount, balance: 0, score: (type === 'exam') ? (Number(row.score) || 0) : '' });

            if (type === 'exchange') {
                exchangeRecords.push({ date: date, timestamp: timestamp, productName: taskName || '奖品', cost: Math.abs(amount) });
            } else if (type === 'checkin') {
                if (!checkinRecords[date]) checkinRecords[date] = {};
                checkinRecords[date][taskName || label] = true;
            } else if (type === 'exam') {
                const parts = taskName.split('-');
                const subject = parts[0] || '';
                const examType = parts.slice(1).join('-') || (sub.replace('学科', '') || '单元测试');
                examRecords.push({ date: date, timestamp: timestamp, subject: subject, examType: examType, score: Number(row.score) || 0, stars: amount, photo: '' });
            } else if (type === 'assessment') {
                assessmentRecords[taskName || label] = { date: date, score: 0, stars: amount, details: [], wrongQuestions: [] };
            }
        });

        // 重算余额（按导入顺序累加）
        let bal = 0;
        ledger.forEach(e => { bal += e.amount; e.balance = bal; });
        data.stars = bal;

        // 重建今日兑换次数统计
        const todayExchangeCount = {};
        exchangeRecords.forEach(r => {
            if (!todayExchangeCount[r.date]) todayExchangeCount[r.date] = {};
            todayExchangeCount[r.date][r.productName] = (todayExchangeCount[r.date][r.productName] || 0) + 1;
        });

        data.starLedger = ledger;
        data.exchangeRecords = exchangeRecords;
        data.checkinRecords = checkinRecords;
        data.examRecords = examRecords;
        data.assessmentRecords = assessmentRecords;
        data.todayExchangeCount = todayExchangeCount;

        const saved = this.saveDB(db);
        return { success: saved };
    }
};

// 初始化
Storage.init();
