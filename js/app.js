/* ========================================
 * 星星之火 - 主应用控制器
 * 路由 / 页面渲染 / 7大模块逻辑
 * ======================================== */

const App = {
    currentPage: 'home',
    pageStack: [],
    subPageStack: [], // 子页面栈，支持多层级返回
    calendarDate: new Date(),
    currentCheckinCat: 0, // 当前选中的打卡分类索引

    // 可选的趣味头像图案（仅图案，不可上传图片）
    CHILD_AVATARS: ['🧒', '👦', '👧', '👶', '🧑', '👱‍♂️', '👱‍♀️', '🧔', '👨', '👩', '👴', '👵', '🐱', '🐶', '🐰', '🐼', '🐯', '🦁', '🐻', '🐸', '🦊', '🐵', '🐥', '🦄'],

    // 生成头像选择 HTML（selected 为当前选中的头像）
    avatarPickerHtml(selected) {
        return this.CHILD_AVATARS.map(a =>
            `<label style="cursor:pointer;"><input type="radio" name="avatar" value="${a}" ${a === selected ? 'checked' : ''} style="display:none;"><span style="font-size:30px;display:inline-block;padding:6px;border-radius:8px;border:2px solid ${a === selected ? 'var(--primary)' : 'transparent'};" class="avatar-opt">${a}</span></label>`
        ).join('');
    },

    // 绑定头像选择的高亮交互
    bindAvatarPicker() {
        document.querySelectorAll('.avatar-opt').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.avatar-opt').forEach(e => e.style.borderColor = 'transparent');
                el.style.borderColor = 'var(--primary)';
                el.parentElement.querySelector('input').checked = true;
            });
        });
    },

    // ===== 初始化 =====
    init() {
        this.bindNav();
        this.bindGlobalEvents();
        if (Storage.isLoggedIn()) {
            this.showApp();
        } else {
            this.showLoginScreen();
        }
    },

    // ===== 登录界面 =====
    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
        this.renderLoginChildren();
    },

    showApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').style.display = '';
        this.navigate('home');
        this.updateSidebarInfo();
    },

    renderLoginChildren() {
        const children = Storage.getAllChildren();
        const container = document.getElementById('loginChildrenList');
        if (children.length === 0) {
            container.innerHTML = '<p style="color:#999;">还没有孩子账号，请通过家长入口创建</p>';
            return;
        }
        container.innerHTML = children.map(c => {
            const balance = Storage.getStarBalance(c.id);
            return `
                <div class="login-child-card" onclick="App.loginChild(${c.id})">
                    <span class="login-child-avatar">${c.avatar}</span>
                    <span class="login-child-name">${c.nickname}</span>
                    <span class="login-child-stars">⭐ ${balance}</span>
                </div>
            `;
        }).join('');
    },

    loginChild(childId) {
        Storage.login(childId);
        this.showApp();
    },

    logout() {
        Storage.logout();
        this.showLoginScreen();
    },

    // ===== 导航 =====
    bindNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                // 测评进行中，切换左侧栏分类前先确认，避免误触丢失进度
                if (this.currentQuiz) {
                    this.showConfirm('还未答完，是否退出？', () => {
                        this.currentQuiz = null;
                        if (page === 'settings') this.openParentSettings();
                        else this.navigate(page);
                    }, '是', '否');
                    return;
                }
                if (page === 'settings') {
                    this.openParentSettings();
                } else {
                    this.navigate(page);
                }
            });
        });
    },

    navigate(page, pushStack = true) {
        if (pushStack && this.currentPage !== page) {
            this.pageStack.push(this.currentPage);
        }
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        this.pageStack = [];
        this.subPageStack = []; // 清除子页面栈
        this._scrollStack = [];
        this._homeScroll = 0;
        this._stopAllAudio();
        document.getElementById('backBtn').style.display = 'none';
        const main = document.getElementById('main-content');
        main.innerHTML = '';
        switch(page) {
            case 'home': this.renderHome(); break;
            case 'checkin': this.renderCheckin(); break;
            case 'assessment': this.renderAssessmentList(); break;
            case 'tools': this.renderToolsList(); break;
            case 'exam': this.renderExam(); break;
            case 'mall': this.renderMall(); break;
        }
        window.scrollTo(0, 0);
    },

    // 子页面导航(有返回按钮) - 支持多层级压栈
    navigateSub(renderFn) {
        // 如果应用隐藏(从登录界面进入家长设置)，先显示app
        if (document.getElementById('app').style.display === 'none') {
            document.getElementById('app').style.display = '';
        }
        document.getElementById('backBtn').style.display = 'flex';
        // 记录当前页（即将离开的页面）滚动位置，返回时还原
        if (!this._scrollStack) this._scrollStack = [];
        if (this.subPageStack.length > 0) {
            this._scrollStack[this._scrollStack.length - 1] = window.scrollY || 0;
        } else {
            this._homeScroll = window.scrollY || 0;
        }
        // 将渲染函数压入子页面栈
        this.subPageStack.push(renderFn);
        this._scrollStack.push(0);
        document.getElementById('backBtn').onclick = () => {
            if (Storage.isLoggedIn()) {
                if (this.currentQuiz) {
                    // 测评进行中，弹出确认框
                    this.showConfirm('还未答完，是否退出？', () => {
                        const isSudoku = this.currentQuiz && this.currentQuiz.type === 'sudoku';
                        this.currentQuiz = null;
                        this.navigate(isSudoku ? 'tools' : 'assessment');
                    }, '是', '否');
                } else {
                    this.goBack();
                }
            } else {
                this.showLoginScreen();
            }
        };
        const main = document.getElementById('main-content');
        main.innerHTML = '';
        renderFn.call(this);
        window.scrollTo(0, 0);
    },

    // 逐级返回子页面
    goBack() {
        this._stopAllAudio();
        // 弹出当前页
        this.subPageStack.pop();
        if (this._scrollStack && this._scrollStack.length) this._scrollStack.pop();
        if (this.subPageStack.length > 0) {
            // 渲染上一级
            const prevFn = this.subPageStack[this.subPageStack.length - 1];
            const restoreY = this._scrollStack[this._scrollStack.length - 1] || 0;
            const main = document.getElementById('main-content');
            main.innerHTML = '';
            prevFn.call(this);
            this._restoreScroll(restoreY);
        } else {
            // 无更上层，返回顶层页面
            const homeY = this._homeScroll || 0;
            document.getElementById('backBtn').style.display = 'none';
            this.navigate(this.currentPage, false);
            this._restoreScroll(homeY);
        }
    },

    // 替换栈顶页面（层级不变），用于同层内的内容切换（如上一个/下一个字）
    navigateSubReplace(renderFn) {
        this._stopAllAudio();
        if (this.subPageStack.length > 0) this.subPageStack.pop();
        this.subPageStack.push(renderFn);
        if (!this._scrollStack) this._scrollStack = [];
        if (this._scrollStack.length > 0) this._scrollStack.pop();
        this._scrollStack.push(0);
        const main = document.getElementById('main-content');
        main.innerHTML = '';
        renderFn.call(this);
        window.scrollTo(0, 0);
    },

    // 返回上一级时还原滚动位置（定位到刚刚看的位置）
    _restoreScroll(y) {
        requestAnimationFrame(() => window.scrollTo(0, y || 0));
    },

    bindGlobalEvents() {
    },

    updateSidebarInfo() {
        const child = Storage.getCurrentChild();
        document.getElementById('currentChildName').textContent = child.nickname;
        const balance = Storage.getStarBalance();
        document.getElementById('sidebarStarBalance').textContent = `⭐ ${balance}`;
    },

    // ===== 通用UI工具 =====
    showToast(msg, duration = 2000) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, duration);
    },

    showModal(title, bodyHtml, footerHtml) {
        const container = document.getElementById('modalContainer');
        const content = document.getElementById('modalContent');
        content.innerHTML = `
            <div class="modal-close-btn" id="modalCloseBtn">✕</div>
            <h2 class="modal-title">${title}</h2>
            <div class="modal-body">${bodyHtml}</div>
            ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
        `;
        container.style.display = 'flex';
        // 点击遮罩层关闭弹窗
        container.onclick = (e) => {
            if (e.target === container || e.target.id === 'modalCloseBtn') {
                this.closeModal();
            }
        };
        document.getElementById('modalCloseBtn').onclick = () => this.closeModal();
    },

    closeModal() {
        const c = document.getElementById('modalContainer');
        c.classList.remove('modal-top');
        c.style.display = 'none';
    },

    showConfirm(message, onConfirm, confirmText = '确定', cancelText = '取消') {
        const container = document.getElementById('confirmContainer');
        const content = document.getElementById('confirmContent');
        content.innerHTML = `
            <h2 class="modal-title">确认</h2>
            <div class="modal-body" style="font-size:18px;">${message}</div>
            <div class="modal-footer" style="justify-content:center;">
                <button class="btn btn-outline" id="confirmCancel">${cancelText}</button>
                <button class="btn btn-danger" id="confirmOk">${confirmText}</button>
            </div>
        `;
        container.style.display = 'flex';
        container.onclick = (e) => {
            if (e.target === container) {
                container.style.display = 'none';
            }
        };
        document.getElementById('confirmCancel').onclick = () => {
            container.style.display = 'none';
        };
        document.getElementById('confirmOk').onclick = () => {
            container.style.display = 'none';
            if (onConfirm) onConfirm();
        };
    },

    showConfirmExit(message, onConfirm) {
        this.showConfirm(message, onConfirm, '确定退出', '继续答题');
    },

    // 元素闪红提示（答错时用）
    flashRed(el) {
        if (!el) return;
        el.classList.add('flash-red');
        setTimeout(() => el.classList.remove('flash-red'), 500);
    },

    showStarAnimation() {
        const star = document.createElement('div');
        star.className = 'star-animation';
        star.textContent = '⭐';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1500);
    },

    emptyState(icon, text) {
        return `<div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <div class="empty-state-text">${text}</div>
        </div>`;
    },

    // 压缩图片：用Canvas缩小到最大边maxSide，转JPEG quality，返回base64
    // 避免原图base64过大撑爆localStorage
    compressImage(file, maxSide = 800, quality = 0.7) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('非图片文件'));
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    let { width, height } = img;
                    // 按最长边等比缩小
                    if (width > height && width > maxSide) {
                        height = Math.round(height * maxSide / width);
                        width = maxSide;
                    } else if (height >= width && height > maxSide) {
                        width = Math.round(width * maxSide / height);
                        height = maxSide;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    try {
                        const dataUrl = canvas.toDataURL('image/jpeg', quality);
                        resolve(dataUrl);
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error('图片加载失败'));
                img.src = ev.target.result;
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    },

    // 任务名翻译（处理历史数据中可能存在的英文id）
    translateTaskName(label, taskName) {
        if (label === '系统小测评' || label === '知识测评') {
            const quizMap = {
                'pinyin': '拼音测试',
                'stroke': '汉字笔顺测试',
                'chineseIdiom': '成语小测验',
                'engVocab': '英语背单词',
                'engRead': '英语短句跟读',
                'mathMul': '数学乘法测试'
            };
            if (quizMap[taskName]) return quizMap[taskName];
        }
        return taskName;
    },

    // ========================================================
    // 模块一：首页（日历星星总览）
    // ========================================================
    renderHome() {
        const child = Storage.getCurrentChild();
        const balance = Storage.getStarBalance();
        const now = new Date();
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth() + 1;
        const monthlyStars = Storage.getMonthlyStars(null, year, month);
        const weekly = Storage.getWeeklyStats();

        const hasRecords = Object.keys(monthlyStars).length > 0;

        let html = `
            <h1 class="page-title">📅 星星总览</h1>
            <div class="home-header">
                <div class="child-info">
                    <div class="child-name-row">
                        <span class="child-nickname">${child.avatar} ${child.nickname}</span>
                        <span class="star-balance-large">⭐ ${balance}</span>
                    </div>
                    <span class="star-balance-hint">🟢 绿色=当日获得 🔴 红色=当日扣除</span>
                </div>
            </div>
        `;

        // 日历
        html += `<div class="calendar-container">
            <div class="calendar-header">
                <button class="calendar-nav-btn" id="calPrev">◀</button>
                <span class="calendar-month">${year}年${month}月</span>
                <button class="calendar-nav-btn" id="calNext">▶</button>
            </div>
            <div class="calendar-grid" id="calendarGrid"></div>
        </div>`;

        // 周统计
        html += `<div class="weekly-stats">
            <div class="stat-card gained">
                <div class="stat-value green">+${weekly.gained}</div>
                <div class="stat-label">本周获得星星</div>
            </div>
            <div class="stat-card spent">
                <div class="stat-value red">-${weekly.spent}</div>
                <div class="stat-label">本周扣除星星</div>
            </div>
        </div>`;

        document.getElementById('main-content').innerHTML = html;
        this.renderCalendar(year, month, monthlyStars);

        document.getElementById('calPrev').onclick = () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
            this.renderHome();
        };
        document.getElementById('calNext').onclick = () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
            this.renderHome();
        };
    },

    renderCalendar(year, month, monthlyStars) {
        const grid = document.getElementById('calendarGrid');
        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const todayStr = Storage.todayStr();
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === month;

        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        let html = '';
        weekdays.forEach(w => {
            html += `<div class="calendar-weekday">${w}</div>`;
        });

        for (let i = 0; i < firstDay; i++) {
            html += `<div class="calendar-day other-month"></div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayData = monthlyStars[dateStr];
            const isToday = isCurrentMonth && d === today.getDate();
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (dayData) classes += ' has-stars';

            let starsHtml = '';
            if (dayData) {
                if (dayData.gained > 0) starsHtml += `<span class="star-gained">+${dayData.gained}</span>`;
                if (dayData.spent > 0) starsHtml += `<span class="star-spent">-${dayData.spent}</span>`;
            }

            html += `<div class="${classes}" data-date="${dateStr}">
                <span class="day-num">${d}</span>
                <div class="day-star">${starsHtml}</div>
            </div>`;
        }

        grid.innerHTML = html;

        // 点击日期弹窗
        grid.querySelectorAll('.calendar-day[data-date]').forEach(el => {
            el.addEventListener('click', () => {
                const date = el.dataset.date;
                const details = Storage.getDailyDetails(null, date);
                if (details.length === 0) {
                    this.showToast('当日无星星记录');
                    return;
                }
                let detailHtml = '';
                details.forEach(d => {
                    const sign = d.amount > 0 ? '+' : '';
                    const color = d.amount > 0 ? 'green' : 'red';
                    const taskName = this.translateTaskName(d.label, d.taskName);
                    detailHtml += `<div class="result-detail-item">
                        <span>[${d.label}] ${taskName}</span>
                        <span class="text-${color}">${sign}${d.amount}</span>
                    </div>`;
                });
                this.showModal(`${date} 星星明细`, detailHtml);
            });
        });
    },

    // ========================================================
    // 模块二：好习惯打卡
    // ========================================================
    renderCheckin() {
        const categories = Storage.getCheckinCategories();
        const todayCheckins = Storage.getTodayCheckins();

        let html = `<h1 class="page-title">🔘 今日打卡</h1>`;

        // 打卡进度
        const todayCount = Object.keys(todayCheckins).length;
        const totalItems = categories.reduce((sum, cat) => sum + cat.items.filter(i => i !== null).length, 0);
        html += `<div class="streak-bar">
            <span class="streak-info">今日 ${todayCount}/${totalItems} 项</span>
            <div class="streak-dots">`;
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dStr = Storage.dateStr(d);
            const dayCheckins = Storage.getChildData().checkinRecords[dStr] || {};
            const checked = Object.keys(dayCheckins).length > 0;
            html += `<div class="streak-dot ${checked ? 'checked' : ''}">${d.getDate()}</div>`;
        }
        html += `</div></div>`;

        // 竖排分类 + 打卡列表
        const activeCat = this.currentCheckinCat || 0;
        html += `<div class="checkin-layout">
            <div class="checkin-side" id="catTabs">`;
        categories.forEach((cat, idx) => {
            html += `<div class="category-tab ${idx === activeCat ? 'active' : ''}" data-cat="${idx}">${cat.icon} ${cat.name}</div>`;
        });
        html += `</div>
            <div class="checkin-main">
                <div class="checkin-list" id="checkinList"></div>
            </div>
        </div>`;

        document.getElementById('main-content').innerHTML = html;

        this.renderCheckinItems(activeCat);

        // 分类切换
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCheckinCat = parseInt(tab.dataset.cat);
                this.renderCheckinItems(this.currentCheckinCat);
            });
        });
    },

    renderCheckinItems(catIdx) {
        const categories = Storage.getCheckinCategories();
        const cat = categories[catIdx];
        const todayCheckins = Storage.getTodayCheckins();
        const list = document.getElementById('checkinList');

        if (!cat || !cat.items.length) {
            list.innerHTML = this.emptyState('📋', '暂无任务');
            return;
        }

        let html = '';
        const today = Storage.todayStr();
        const yesterday = Storage.dateStr(new Date(Date.now() - 86400000));
        cat.items.forEach((item, itemIdx) => {
            const key = `${cat.name}-${item.name}`;
            const done = todayCheckins[key];
            const streak = Storage.getCheckinStreak(null, key);
            // 只显示仍然有效的连续打卡：昨天或今天打过才算
            const streakActive = streak.count > 0 && (streak.lastDate === today || streak.lastDate === yesterday);

            html += `<div class="checkin-item ${done ? 'done' : ''}">
                <div class="checkin-item-info">
                    <span class="checkin-item-name">${item.name}</span>
                    <span class="checkin-item-star">+${item.stars}⭐ ${streakActive ? `·连续${streak.count}天` : ''}</span>
                </div>
                ${done
                    ? `<button class="btn btn-outline" data-cancel-cat="${catIdx}" data-cancel-item="${itemIdx}">取消</button>`
                    : `<button class="btn btn-primary" data-cat="${catIdx}" data-item="${itemIdx}">打卡</button>`
                }
            </div>`;
        });
        list.innerHTML = html;

        // 绑定打卡
        list.querySelectorAll('.btn-primary[data-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cIdx = parseInt(btn.dataset.cat);
                const iIdx = parseInt(btn.dataset.item);
                this.doCheckin(cIdx, iIdx);
            });
        });

        // 绑定取消打卡
        list.querySelectorAll('.btn-outline[data-cancel-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cIdx = parseInt(btn.dataset.cancelCat);
                const iIdx = parseInt(btn.dataset.cancelItem);
                const cats = Storage.getCheckinCategories();
                const itemName = cats[cIdx].items[iIdx].name;
                this.showConfirm(`确定取消「${itemName}」的打卡？\n将扣回已发放的星星`, () => {
                    this.undoCheckin(cIdx, iIdx);
                }, '确认取消', '不取消');
            });
        });
    },

    undoCheckin(catIdx, itemIdx) {
        const categories = Storage.getCheckinCategories();
        const cat = categories[catIdx];
        const item = cat.items[itemIdx];
        const key = `${cat.name}-${item.name}`;
        const success = Storage.undoCheckin(null, catIdx, itemIdx);
        if (success) {
            this.showToast(`已取消打卡，扣回 ${item.stars} 颗星星`);
            this.updateSidebarInfo();
            this.renderCheckin();
        }
    },

    doCheckin(catIdx, itemIdx) {
        const success = Storage.doCheckin(null, catIdx, itemIdx);
        if (success) {
            TTS.playStar();
            this.showStarAnimation();
            this.showToast('打卡成功，已发放星星！');
            this.updateSidebarInfo();
            this.renderCheckin();
        }
    },

    // ========================================================
    // 模块三：知识测评
    // ========================================================
    renderAssessmentList() {
        const assessments = [
            { id: 'pinyin', icon: '🔤', name: '拼音测试', desc: '看词语写拼音' },
            { id: 'stroke', icon: '✍️', name: '汉字笔顺测试', desc: '看生字学笔顺' },
            { id: 'mathAdd', icon: '➕', name: '100以内加减法', desc: '加减法算式' },
            { id: 'engVocab', icon: '📚', name: '英语背单词', desc: '一年级单词' },
            { id: 'engRead', icon: '🗣️', name: '英语短句跟读', desc: '朗读评分' },
            { id: 'idiom', icon: '📖', name: '成语小测验', desc: '成语释义' },
            { id: 'sentenceMake', icon: '💬', name: '看词造句', desc: '每天5题，用词造句' },
            { id: 'mathMul', icon: '✖️', name: '数学乘法测试', desc: '个位数乘法' },
            { id: 'sudoku', icon: '🔢', name: '数独游戏', desc: '四宫/六宫/九宫·每日一战' }
        ];

        let html = `<h1 class="page-title">📝 知识测评</h1>
            <div style="margin-bottom:8px;font-size:12px;color:#666;line-height:1.6;">
                100分：3颗星 &nbsp;&nbsp; 90-99分：2颗星 &nbsp;&nbsp; 90分以下：1颗星
            </div>
            <div class="assessment-grid">`;

        assessments.forEach(a => {
            const done = Storage.hasAssessedToday(null, a.id);
            html += `<div class="assessment-card ${done ? 'disabled' : ''}" data-assess="${a.id}">
                <div class="assess-icon">${a.icon}</div>
                <div class="assess-name">${a.name}</div>
                <div class="assess-desc">${done ? '今日已完成' : a.desc}</div>
            </div>`;
        });

        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;

        document.querySelectorAll('.assessment-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.assess;
                if (id === 'sudoku') {
                    // 数独是独立流程；今日已完成也能点进去看成绩
                    this.navigateSub(() => this.renderSudokuHome());
                    return;
                }
                if (card.classList.contains('disabled')) {
                    this.showToast('今日测试次数已用完，明天再来练习。');
                    return;
                }
                this.startAssessment(id);
            });
        });
    },

    currentQuiz: null,

    startAssessment(type) {
        const quizConfig = {
            pinyin: { name: '拼音测试', icon: '🔤', gen: () => this.genPinyinQuiz() },
            stroke: { name: '汉字笔顺测试', icon: '✍️', gen: () => this.genStrokeQuiz() },
            mathAdd: { name: '100以内加减法', icon: '➕', gen: () => this.genMathAddQuiz() },
            engVocab: { name: '英语背单词', icon: '📚', gen: () => this.genEngVocabQuiz() },
            engRead: { name: '英语短句跟读', icon: '🗣️', gen: () => this.genEngReadQuiz() },
            idiom: { name: '成语小测验', icon: '📖', gen: () => this.genIdiomQuiz() },
            sentenceMake: { name: '看词造句', icon: '💬', gen: () => this.genSentenceMakeQuiz() },
            mathMul: { name: '数学乘法测试', icon: '✖️', gen: () => this.genMathMulQuiz() }
        };

        const config = quizConfig[type];
        if (!config) return;

        this.currentQuiz = {
            type: type,
            name: config.name,
            icon: config.icon,
            questions: config.gen(),
            currentIdx: 0,
            score: 0,
            retries: {},
            attempts: {},
            questionScores: {},
            wrongQuestions: [],
            answers: []
        };

        this.renderQuizQuestion();
    },

    genPinyinQuiz() {
        const shuffled = [...PINYIN_WORDS].sort(() => Math.random() - 0.5).slice(0, 10);
        return shuffled.map(item => ({
            type: 'pinyin',
            question: item.w,
            answer: item.p,
            inputType: 'text'
        }));
    },

    genStrokeQuiz() {
        const chars = ['春','风','花','草','树','叶','鸟','虫','鱼','水','火','土','木','金','人','口','手','目','耳','足',
                       '天','地','日','月','星','云','雨','雪','冰','山','河','海','林','石','光','明','暗','色','红','绿'];
        const shuffled = chars.sort(() => Math.random() - 0.5).slice(0, 10);
        return shuffled.map(ch => ({
            type: 'stroke',
            question: ch,
            answer: ch,
            inputType: 'display'
        }));
    },

    genMathAddQuiz() {
        const questions = [];
        for (let i = 0; i < 10; i++) {
            const isAdd = Math.random() > 0.5;
            let a, b, answer;
            if (isAdd) {
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * (100 - a)) + 1;
                answer = a + b;
            } else {
                a = Math.floor(Math.random() * 50) + 50;
                b = Math.floor(Math.random() * a) + 1;
                answer = a - b;
            }
            questions.push({
                type: 'mathAdd',
                question: `${a} ${isAdd ? '+' : '−'} ${b} = ?`,
                answer: String(answer),
                inputType: 'number'
            });
        }
        return questions;
    },

    genMathMulQuiz() {
        const questions = [];
        for (let i = 0; i < 10; i++) {
            const a = Math.floor(Math.random() * 9) + 1;
            const b = Math.floor(Math.random() * 9) + 1;
            questions.push({
                type: 'mathMul',
                question: `${a} × ${b} = ?`,
                answer: String(a * b),
                inputType: 'number'
            });
        }
        return questions;
    },

    genEngVocabQuiz() {
        const shuffled = [...ENGLISH_WORDS].sort(() => Math.random() - 0.5).slice(0, 10);
        return shuffled.map(word => {
            const mode = Math.random() > 0.5 ? 'A' : 'B';
            // 模式A：英文选中文（选项是中文）  模式B：中文选英文（选项是英文）
            const correctOpt = mode === 'A' ? word.zh : word.en;
            const pool = ENGLISH_WORDS.filter(w => w !== word);
            const wrongs = pool.sort(() => Math.random() - 0.5).slice(0, 3).map(w => mode === 'A' ? w.zh : w.en);
            const allOptions = [correctOpt, ...wrongs].sort(() => Math.random() - 0.5);
            return {
                type: 'engVocab',
                question: mode === 'A' ? word.en : word.zh,
                answer: mode === 'A' ? word.zh : word.en,
                mode: mode,
                wordObj: word,
                options: allOptions,
                inputType: 'choice'
            };
        });
    },

    genEngReadQuiz() {
        const shuffled = [...ENGLISH_SENTENCES].sort(() => Math.random() - 0.5).slice(0, 10);
        return shuffled.map(s => ({
            type: 'engRead',
            question: s,
            answer: s.en,
            inputType: 'reading'
        }));
    },

    genIdiomQuiz() {
        const shuffled = [...IDIOM_DATA].sort(() => Math.random() - 0.5).slice(0, 10);
        return shuffled.map(item => {
            const allOptions = [item.correct, ...item.wrong].sort(() => Math.random() - 0.5);
            return {
                type: 'idiom',
                question: item.idiom,
                pinyin: item.pinyin,
                answer: item.correct,
                options: allOptions,
                inputType: 'choice'
            };
        });
    },

    genSentenceMakeQuiz() {
        const shuffled = [...SENTENCE_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
        return shuffled.map(word => ({
            type: 'sentenceMake',
            question: word,
            answer: word,
            inputType: 'sentence'
        }));
    },

    renderQuizQuestion() {
        const q = this.currentQuiz;
        if (!q) return;
        const idx = q.currentIdx;
        const question = q.questions[idx];
        const total = q.questions.length;

        this.navigateSub(() => {
            let html = `<div class="quiz-container">
                <div class="quiz-header">
                    <span class="quiz-progress">第 ${idx + 1} / ${total} 题</span>
                    <span class="quiz-score">得分: ${q.score}</span>
                </div>
                <div class="quiz-question" id="quizQuestion"></div>
                <div class="quiz-feedback" id="quizFeedback"></div>
            </div>`;

            document.getElementById('main-content').innerHTML = html;

            this.renderQuizContent(question);
        });
    },

    renderQuizContent(question) {
        const container = document.getElementById('quizQuestion');
        const feedback = document.getElementById('quizFeedback');
        const q = this.currentQuiz;
        const qKey = q.currentIdx;

        if (q.retries[qKey] === undefined) q.retries[qKey] = 0;

        switch(question.type) {
            case 'pinyin':
                container.innerHTML = `
                    <div class="quiz-word">${question.question}</div>
                    <button class="audio-btn" id="qAudio">🔊</button>
                    <input type="text" class="quiz-input" id="quizInput" placeholder="输入拼音(小写字母)" autocomplete="off">
                    <button class="btn btn-primary btn-lg" id="quizSubmit">提交</button>
                `;
                document.getElementById('qAudio').onclick = () => TTS.speakChinese(question.question);
                document.getElementById('quizSubmit').onclick = () => this.checkPinyinAnswer(question);
                document.getElementById('quizInput').onkeydown = (e) => {
                    if (e.key === 'Enter') this.checkPinyinAnswer(question);
                };
                document.getElementById('quizInput').focus();
                break;

            case 'stroke':
                container.innerHTML = `
                    <div id="strokeGrid" style="width:260px;height:260px;margin:0 auto;"></div>
                    <button class="audio-btn" id="qAudio">🔊</button>
                    <div style="font-size:12px;color:#888;text-align:center;line-height:1.5;">
                        按笔顺依次点击笔画<br>
                        <span style="color:#bbb;">灰色</span>未选 ·
                        <span style="color:#1565C0;">深蓝色</span>当前 ·
                        <span style="color:#333;">黑色</span>已选
                    </div>
                `;
                document.getElementById('qAudio').onclick = () => TTS.speakChinese(question.question);
                this.renderStrokeQuiz(question.question, question);
                break;

            case 'mathAdd':
            case 'mathMul':
                container.innerHTML = `
                    <div class="quiz-word">${question.question}</div>
                    <input type="number" class="quiz-input" id="quizInput" placeholder="输入答案" autocomplete="off">
                    <button class="btn btn-primary btn-lg" id="quizSubmit">提交</button>
                `;
                document.getElementById('quizSubmit').onclick = () => this.checkTextAnswer(question);
                document.getElementById('quizInput').onkeydown = (e) => {
                    if (e.key === 'Enter') this.checkTextAnswer(question);
                };
                document.getElementById('quizInput').focus();
                break;

            case 'engVocab':
                const isModeA = question.mode === 'A';
                container.innerHTML = `
                    <div class="quiz-word">${question.question}</div>
                    ${isModeA ? `<button class="audio-btn" id="qAudio">🔊</button>` : ''}
                    <div class="quiz-options quiz-options-abcd" id="quizOptions"></div>
                `;
                if (isModeA) {
                    document.getElementById('qAudio').onclick = () => TTS.speakEnglish(question.wordObj.en);
                    // 自动播放
                    setTimeout(() => TTS.speakEnglish(question.wordObj.en), 300);
                }
                let optHtml = '';
                question.options.forEach((opt, i) => {
                    const label = String.fromCharCode(65 + i); // A/B/C/D
                    const audioBtn = !isModeA ? `<button class="audio-btn" style="width:30px;height:30px;font-size:13px;" data-pron="${opt}">🔊</button>` : '';
                    optHtml += `<div class="quiz-option quiz-option-abcd" data-opt="${opt}"><span class="option-tag">${label}</span><span class="option-text">${opt}</span>${audioBtn}</div>`;
                });
                document.getElementById('quizOptions').innerHTML = optHtml;
                document.querySelectorAll('.quiz-option').forEach(el => {
                    el.addEventListener('click', (e) => {
                        if (e.target.classList.contains('audio-btn')) {
                            e.stopPropagation();
                            TTS.speakEnglish(e.target.dataset.pron);
                            return;
                        }
                        this.checkChoiceAnswer(question, el.dataset.opt, el);
                    });
                });
                break;

            case 'idiom':
                container.innerHTML = `
                    <div class="quiz-word">${question.question}</div>
                    <div class="quiz-word-pinyin">${question.pinyin}</div>
                    <button class="audio-btn" id="qAudio">🔊</button>
                    <div class="quiz-options quiz-options-abcd" id="quizOptions"></div>
                `;
                document.getElementById('qAudio').onclick = () => TTS.speakChinese(question.question);
                let idiomHtml = '';
                question.options.forEach((opt, i) => {
                    const label = String.fromCharCode(65 + i); // A/B/C/D
                    idiomHtml += `<div class="quiz-option quiz-option-abcd" data-opt="${opt}"><span class="option-tag">${label}</span><span class="option-text">${opt}</span></div>`;
                });
                document.getElementById('quizOptions').innerHTML = idiomHtml;
                document.querySelectorAll('.quiz-option').forEach(el => {
                    el.addEventListener('click', () => {
                        this.checkChoiceAnswer(question, el.dataset.opt, el);
                    });
                });
                break;

            case 'sentenceMake':
                this.renderSentenceMakeQuestion(question);
                break;

            case 'engRead':
                container.innerHTML = `
                    <div class="quiz-word">${question.question.en}</div>
                    <div class="quiz-word-pinyin">${question.question.zh}</div>
                    <div class="eng-read-buttons">
                        <button class="audio-btn" id="qAudio">🔊</button>
                        <button class="record-btn" id="recordBtn">
                            <span>🎤</span>
                            <span>录音评分</span>
                        </button>
                    </div>
                    <div style="font-size:14px;color:#999;margin-top:8px;">点击录音后大声朗读英文</div>
                    <div id="readScore"></div>
                `;
                // 进入题目自动播放音频（语速很慢 0.5倍）
                setTimeout(() => {
                    TTS.speakEnglish(question.question.en, 0.5);
                }, 300);
                document.getElementById('qAudio').onclick = () => {
                    TTS.speakEnglish(question.question.en, 0.5);
                };
                document.getElementById('recordBtn').onclick = () => this.handleReading(question);
                break;
        }
    },

    // ===== 看词造句：渲染题目界面 =====
    renderSentenceMakeQuestion(question) {
        const container = document.getElementById('quizQuestion');
        const q = this.currentQuiz;
        const qKey = q.currentIdx;

        if (q.attempts[qKey] === undefined) q.attempts[qKey] = 0;
        if (q.questionScores[qKey] === undefined) q.questionScores[qKey] = 0;

        container.innerHTML = `
            <div class="sentence-make-prompt">请用下面的词语造句</div>
            <div class="sentence-keyword">${this.esc(question.question)}</div>
            <div class="sentence-input-wrap">
                <textarea class="sentence-input" id="sentenceInput" rows="3" placeholder="在这里输入一句话，或者点击麦克风语音输入" autocomplete="off" inputmode="text"></textarea>
                <button class="sentence-voice-btn" id="sentenceVoiceBtn" title="语音输入">🎤</button>
            </div>
            <div class="sentence-hint">可以语音输入，也可以打拼音/手写输入句子</div>
            <button class="btn btn-primary btn-lg" id="sentenceSubmit">提交</button>
            <div class="sentence-feedback" id="sentenceFeedback"></div>
        `;

        const input = document.getElementById('sentenceInput');
        document.getElementById('sentenceSubmit').onclick = () => this.submitSentence(question);
        input.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitSentence(question);
            }
        };
        document.getElementById('sentenceVoiceBtn').onclick = () => this.handleSentenceVoice(question);
        input.focus();
    },

    // 看词造句：前置校验（不消耗机会）
    validateSentence(sentence, keyword) {
        const s = sentence.trim();
        if (!s) {
            return { valid: false, msg: '先试着说一句话吧！' };
        }
        // 字数统计：按实际字符数，去除首尾空白
        if (s.length < 8) {
            return { valid: false, msg: '句子太短啦！' };
        }
        if (s.indexOf(keyword) === -1) {
            return { valid: false, msg: `句子中要有“${keyword}”这个词哦！` };
        }
        return { valid: true };
    },

    // 看词造句：评分（20/17/14 三档）
    scoreSentence(sentence, keyword) {
        const s = sentence.trim();
        const len = s.length;
        const hasEndPunct = /[。！？.!?]$/.test(s);
        // 常见谓语/动词词表，用于判断句子是否较完整
        const verbPattern = /(是|有|在|做|吃|看|玩|走|跑|跳|说|想|爱|喜欢|看见|听见|知道|会|能|要|去|来|回|到|给|写|画|读|唱|笑|哭|睡|穿|戴|拿|放|找|买|送|接|打|开|关|坐|站|飞|游|爬|喝|醒|怕|忙|累|热|冷|饿|饱|病|长|变|成|当|像|叫|让|把|被|从|向|往|对|跟|和|同|比|用|为|如果|虽然|但是|因为|所以|于是|终于|已经|正在|常常|非常|很多|一些|一起|一边|一直|马上|连忙|高兴|快乐|开心|难过|伤心|害怕|讨厌|认真|努力|专心|安静|干净|整齐|美丽|漂亮|可爱|聪明|勇敢|伟大|有名)/;
        const hasVerb = verbPattern.test(s);

        if (len >= 12 && hasEndPunct && hasVerb) {
            return { score: 20, stars: 3, label: '句子通顺，能让人看懂什么意思' };
        }
        if (len >= 10 || (len >= 8 && hasEndPunct)) {
            return { score: 17, stars: 2, label: '句子基本完整，意思能猜出来' };
        }
        return { score: 14, stars: 1, label: '勉强算个句子，但读起来不太明白' };
    },

    // 看词造句：提交答案
    submitSentence(question) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        const input = document.getElementById('sentenceInput');
        const sentence = input.value;
        const keyword = question.question;

        // 前置校验（不消耗机会）
        const check = this.validateSentence(sentence, keyword);
        if (!check.valid) {
            this.showToast(check.msg);
            input.focus();
            return;
        }

        // 通过校验，消耗一次机会
        q.attempts[qKey] = (q.attempts[qKey] || 0) + 1;
        const attempts = q.attempts[qKey];
        const result = this.scoreSentence(sentence, keyword);

        // 取较高分
        if (result.score > q.questionScores[qKey]) {
            q.questionScores[qKey] = result.score;
        }

        // 禁用输入
        input.disabled = true;
        const submitBtn = document.getElementById('sentenceSubmit');
        if (submitBtn) submitBtn.disabled = true;
        const voiceBtn = document.getElementById('sentenceVoiceBtn');
        if (voiceBtn) voiceBtn.disabled = true;

        // 展示评分结果
        const starsHtml = '⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars);
        const feedback = document.getElementById('sentenceFeedback');
        let buttonsHtml = '';
        if (attempts < 2) {
            buttonsHtml = `
                <button class="btn btn-outline btn-lg" id="sentenceRetry">再答一次</button>
                <button class="btn btn-primary btn-lg" id="sentenceNext">下一题</button>
            `;
        } else {
            buttonsHtml = `
                <button class="btn btn-primary btn-lg" id="sentenceNext">下一题</button>
            `;
        }
        feedback.innerHTML = `
            <div class="sentence-result">
                <div class="sentence-score">+${result.score}分</div>
                <div class="sentence-stars">${starsHtml}</div>
                <div class="sentence-label">${result.label}</div>
                <div class="sentence-attempts">第 ${attempts}/2 次作答（取较高分）</div>
                ${buttonsHtml}
            </div>
        `;

        // 绑定按钮
        const retryBtn = document.getElementById('sentenceRetry');
        const nextBtn = document.getElementById('sentenceNext');
        if (retryBtn) retryBtn.onclick = () => this.retrySentenceQuestion(question);
        if (nextBtn) nextBtn.onclick = () => this.finishSentenceQuestion(question, sentence);
    },

    // 看词造句：再答一次
    retrySentenceQuestion(question) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        this.renderSentenceMakeQuestion(question);
        // 保留已尝试次数和最佳分数
        const feedback = document.getElementById('sentenceFeedback');
        if (feedback) {
            feedback.innerHTML = `<div class="sentence-best-hint">当前最佳得分：${q.questionScores[qKey]}分，再试一次吧！</div>`;
        }
    },

    // 看词造句：完成本题，记录并进入下一题
    finishSentenceQuestion(question, sentence) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        const bestScore = q.questionScores[qKey] || 0;
        q.score += bestScore;

        const isCorrect = bestScore >= 17;
        if (!isCorrect) {
            q.wrongQuestions.push({
                question: question.question,
                yourAnswer: sentence,
                correctAnswer: `含“${question.question}”的通顺句子`
            });
        }
        q.answers.push({
            question: question.question,
            correct: isCorrect,
            retry: q.attempts[qKey] || 0,
            score: bestScore,
            answer: sentence
        });

        this.nextQuestion();
    },

    // 看词造句：语音输入（中文）
    handleSentenceVoice(question) {
        const btn = document.getElementById('sentenceVoiceBtn');
        const input = document.getElementById('sentenceInput');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.showToast('浏览器不支持语音识别，请使用 Chrome 浏览器');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        btn.classList.add('recording');
        btn.innerHTML = '⏹';
        btn.title = '停止录音';

        let gotResult = false;
        let fatalError = null;

        btn.onclick = () => {
            if (btn.classList.contains('recording')) {
                try { recognition.stop(); } catch(e) {}
            }
        };

        recognition.onresult = (event) => {
            gotResult = true;
            let text = '';
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript;
            }
            input.value = text.trim();
        };

        recognition.onerror = (event) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                fatalError = '请允许麦克风权限后重试';
            }
        };

        recognition.onend = () => {
            btn.classList.remove('recording');
            btn.innerHTML = '🎤';
            btn.title = '语音输入';
            btn.onclick = () => this.handleSentenceVoice(question);

            if (fatalError) {
                this.showToast(fatalError);
                return;
            }
            if (!gotResult || !input.value.trim()) {
                this.showToast('没有听到声音，请大声说句子');
                return;
            }
            input.focus();
        };

        try {
            recognition.start();
        } catch(e) {
            btn.classList.remove('recording');
            btn.innerHTML = '🎤';
            btn.onclick = () => this.handleSentenceVoice(question);
            this.showToast('录音启动失败，请重试');
        }
    },

    // ===== 笔顺测试：从CDN加载笔画数据并渲染可点击SVG =====
    renderStrokeQuiz(char, question) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        q.retries[qKey] = 0;

        fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + encodeURIComponent(char) + '.json')
            .then(r => {
                if (!r.ok) throw new Error('not found');
                return r.json();
            })
            .then(data => {
                this.renderStrokeSVG(char, data, question);
            })
            .catch(() => {
                this.renderStrokeFallback(char, question);
            });
    },

    renderStrokeSVG(char, data, question) {
        const grid = document.getElementById('strokeGrid');
        if (!grid) return;
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        const strokes = data.strokes;
        const total = strokes.length;
        let currentStroke = 0;
        let isResetting = false; // 重置期间禁止点击

        // 构建SVG（田字格 + 笔画）
        // hanzi-writer-data 使用 y-up 坐标系，需 y 轴翻转为 SVG 的 y-down
        let svgHtml = '<svg viewBox="0 0 1024 1024" width="100%" height="100%" style="display:block;" preserveAspectRatio="xMidYMid meet">';
        // 田字格背景
        svgHtml += '<rect x="0" y="0" width="1024" height="1024" fill="#FFF" stroke="#5D4037" stroke-width="8" rx="16"/>';
        svgHtml += '<line x1="512" y1="0" x2="512" y2="1024" stroke="#E0E0E0" stroke-dasharray="40,30" stroke-width="2"/>';
        svgHtml += '<line x1="0" y1="512" x2="1024" y2="512" stroke="#E0E0E0" stroke-dasharray="40,30" stroke-width="2"/>';
        // 笔画路径 — 全部灰色，不提示第一笔；y 轴翻转使字正向
        svgHtml += '<g id="strokePaths" transform="scale(1,-1) translate(0,-1024)">';
        strokes.forEach((path, i) => {
            svgHtml += '<path d="' + path + '" fill="#d0d0d0" class="stroke-clickable" data-idx="' + i + '"/>';
        });
        svgHtml += '</g>';
        svgHtml += '</svg>';
        grid.innerHTML = svgHtml;

        // 动态计算包围盒，添加偏移使字在田字格中正中间居中
        const strokePaths = grid.querySelector('#strokePaths');
        if (strokePaths) {
            try {
                const bbox = strokePaths.getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;
                // 翻转后中心点 = 1024 - centerY，偏移使其等于 512
                const offsetX = (512 - centerX).toFixed(1);
                const offsetY = (centerY - 512).toFixed(1);
                strokePaths.setAttribute('transform',
                    'translate(' + offsetX + ',' + offsetY + ') scale(1,-1) translate(0,-1024)');
            } catch(e) {
                // getBBox 失败时保持默认 transform
            }
        }

        // 绑定点击事件
        grid.querySelectorAll('.stroke-clickable').forEach(el => {
            el.addEventListener('click', () => {
                if (isResetting) return;
                const idx = parseInt(el.dataset.idx);
                if (q.retries[qKey] >= 2) return;
                if (idx < currentStroke) return; // 已选过，忽略

                if (idx === currentStroke) {
                    // 正确：之前蓝色的变黑色
                    if (currentStroke > 0) {
                        const prevEl = grid.querySelector('[data-idx="' + (currentStroke - 1) + '"]');
                        if (prevEl) prevEl.setAttribute('fill', '#333');
                    }
                    // 当前点击的变深蓝色
                    el.setAttribute('fill', '#1565C0');
                    el.style.cursor = 'default';
                    currentStroke++;

                    if (currentStroke === total) {
                        // 最后一笔也变黑色
                        el.setAttribute('fill', '#333');
                        this.answerCorrect(question);
                    }
                } else {
                    // 错误：点到了后面的笔画
                    q.retries[qKey]++;
                    // 闪红
                    const origFill = el.getAttribute('fill');
                    el.setAttribute('fill', '#f44336');
                    setTimeout(() => el.setAttribute('fill', origFill), 400);

                    if (q.retries[qKey] >= 2) {
                        // 两次错误：不播语音，直接重置后展示完整标准笔顺
                        isResetting = true;
                        setTimeout(() => {
                            grid.querySelectorAll('.stroke-clickable').forEach(s => {
                                s.setAttribute('fill', '#d0d0d0');
                            });
                            isResetting = false;
                            this.revealStrokeOrder(grid, strokes, 0, question);
                        }, 500);
                    } else {
                        // 第一次错误：播放语音提示再试，从头开始
                        TTS.speakWrong();
                        isResetting = true;
                        setTimeout(() => {
                            currentStroke = 0;
                            grid.querySelectorAll('.stroke-clickable').forEach(s => {
                                s.setAttribute('fill', '#d0d0d0');
                                s.style.cursor = 'pointer';
                            });
                            isResetting = false;
                        }, 500);
                    }
                }
            });
        });
    },

    revealStrokeOrder(grid, strokes, startIdx, question) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;

        // 禁用所有点击
        grid.querySelectorAll('.stroke-clickable').forEach(el => {
            el.style.pointerEvents = 'none';
        });

        // 依次展示笔画（速度慢50%：400ms → 600ms）
        let idx = startIdx;
        const revealNext = () => {
            if (idx >= strokes.length) {
                // 全部展示完毕
                const feedback = document.getElementById('quizFeedback');
                if (feedback) {
                    feedback.className = 'quiz-feedback wrong';
                    feedback.style.flexDirection = 'column';
                    feedback.style.justifyContent = 'center';
                    feedback.innerHTML = '<div style="font-size:18px;font-weight:bold;margin-bottom:16px;">标准笔顺已展示</div>' +
                        '<button class="btn btn-primary btn-lg" id="manualNext">下一题</button>';
                    document.getElementById('manualNext').onclick = () => this.nextQuestion();
                }
                q.wrongQuestions.push({
                    question: question.question,
                    yourAnswer: '笔顺错误',
                    correctAnswer: '正确笔顺'
                });
                q.answers.push({
                    question: question.question,
                    correct: false,
                    retry: 2,
                    answer: '正确笔顺'
                });
                return;
            }
            const el = grid.querySelector('[data-idx="' + idx + '"]');
            if (el) {
                el.setAttribute('fill', '#1565C0'); // 深蓝色
                setTimeout(() => {
                    el.setAttribute('fill', '#333'); // 黑色
                    idx++;
                    revealNext();
                }, 600); // 比原来慢50%
            }
        };
        revealNext();
    },

    renderStrokeFallback(char, question) {
        const grid = document.getElementById('strokeGrid');
        if (grid) {
            grid.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;' +
                'font-size:180px;font-family:\'STKaiti\',\'KaiTi\',\'楷体\',serif;color:#333;">' + char + '</div>';
        }
        const feedback = document.getElementById('quizFeedback');
        if (feedback) {
            feedback.className = 'quiz-feedback';
            feedback.style.flexDirection = 'column';
            feedback.style.justifyContent = 'center';
            feedback.innerHTML = '<div style="font-size:13px;color:#999;margin-bottom:12px;">笔画数据不可用</div>' +
                '<button class="btn btn-primary btn-lg" id="manualNext">下一题</button>';
            document.getElementById('manualNext').onclick = () => this.answerCorrect(question);
        }
    },

    checkPinyinAnswer(question) {
        const input = document.getElementById('quizInput');
        if (!input.value.trim()) {
            this.showToast('请输入答案');
            input.focus();
            return;
        }
        let val = input.value.trim().toLowerCase().replace(/[\s\W]/g, '');
        val = val.replace(/v/g, 'ü');
        const correctPinyin = question.answer;
        if (val === correctPinyin) {
            this.answerCorrect(question);
        } else {
            this.answerWrong(question, correctPinyin);
        }
    },

    // 简易拼音获取(实际应用中需要完整拼音库)
    getPinyin(word) {
        // 这里应该有完整的拼音库，简化处理
        const map = {
            '春天': 'chuntian', '春风': 'chunfeng', '春雨': 'chunyu', '冬天': 'dongtian', '雪花': 'xuehua',
            '朋友': 'pengyou', '红花': 'honghua', '绿草': 'lvcao', '花草': 'huacao', '爷爷': 'yeye',
            '妈妈': 'mama', '奶奶': 'nainai', '爸爸': 'baba', '学校': 'xuexiao', '老师': 'laoshi',
            '同学': 'tongxue', '教室': 'jiaoshi', '读书': 'dushu', '写字': 'xiezi', '认真': 'renzhen',
            '干净': 'ganjing', '工人': 'gongren', '专心': 'zhuanxin', '人才': 'rencai', '蚂蚁': 'mayi',
            '天空': 'tiankong', '古诗': 'gushi', '儿童': 'ertong', '飞机': 'feiji', '花朵': 'huaduo',
            '树叶': 'shuye', '小时': 'xiaoshi', '很多': 'henduo', '虫子': 'chongzi', '最后': 'zuihou',
            '力量': 'liliang', '因为': 'yinwei', '阳光': 'yangguang', '可是': 'keshi', '许多': 'xuduo',
            '办法': 'banfa', '别人': 'bieren', '来到': 'laidao', '都是': 'doushi', '千万': 'qianwan',
            '百花': 'baihua', '早上': 'zaoshang', '一定': 'yiding', '总是': 'zongshi', '工厂': 'gongchang'
        };
        return map[word] || word.toLowerCase().replace(/[^\w]/g, '');
    },

    checkTextAnswer(question) {
        const input = document.getElementById('quizInput');
        const val = input.value.trim();
        if (!val) {
            this.showToast('请输入答案');
            input.focus();
            return;
        }
        if (val === question.answer) {
            this.answerCorrect(question);
        } else {
            this.answerWrong(question, question.answer);
        }
    },

    checkChoiceAnswer(question, selected, el) {
        if (selected === question.answer) {
            el.classList.add('correct');
            document.querySelectorAll('.quiz-option').forEach(o => o.style.pointerEvents = 'none');
            this.answerCorrect(question);
        } else {
            // 闪红提示，不标记对错，不显示正确答案
            this.flashRed(el);
            this.answerWrong(question, question.answer);
        }
    },

    answerCorrect(question, isDisplay = false) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        const retryCount = q.retries[qKey] || 0;

        if (retryCount === 0) {
            q.score += 10;
            TTS.speakCorrect();
        } else {
            q.score += 5;
            TTS.speakRetryCorrect();
        }

        q.answers.push({
            question: question.question,
            correct: true,
            retry: retryCount,
            answer: question.answer
        });

        const feedback = document.getElementById('quizFeedback');
        if (feedback) {
            feedback.className = 'quiz-feedback correct';
            feedback.textContent = retryCount === 0 ? '+10分' : '+5分';
        }

        // 禁用输入
        const submitBtn = document.getElementById('quizSubmit');
        const nextBtn = document.getElementById('quizNext');
        if (submitBtn) submitBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        const input = document.getElementById('quizInput');
        if (input) input.disabled = true;

        setTimeout(() => this.nextQuestion(), 1200);
    },

    answerWrong(question, correctAnswer) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        const retryCount = q.retries[qKey] || 0;

        if (retryCount === 0) {
            // 第一次答错，有一次重试机会
            q.retries[qKey] = 1;
            TTS.speakWrong(); // 只播语音，不显示文字
            const feedback = document.getElementById('quizFeedback');
            if (feedback) {
                feedback.className = 'quiz-feedback';
                feedback.textContent = '';
            }
            // 输入框闪红，清空重试
            const input = document.getElementById('quizInput');
            if (input) {
                this.flashRed(input);
                input.value = '';
                input.focus();
                input.disabled = false;
            }
            // 选择题重新启用
            document.querySelectorAll('.quiz-option').forEach(o => {
                o.classList.remove('wrong', 'correct');
                o.style.pointerEvents = '';
            });
            const submitBtn = document.getElementById('quizSubmit');
            if (submitBtn) submitBtn.disabled = false;
        } else {
            // 两次答错，展示标准答案（拼音不读语音）
            if (question.type !== 'pinyin') {
                TTS.speakChinese('标准答案是 ' + correctAnswer);
            }
            const feedback = document.getElementById('quizFeedback');
            if (feedback) {
                feedback.className = 'quiz-feedback wrong';
                feedback.style.flexDirection = 'column';
                feedback.style.justifyContent = 'center';
                feedback.innerHTML = `
                    <div style="font-size:20px;font-weight:bold;margin-bottom:16px;">标准答案：${correctAnswer}</div>
                    <button class="btn btn-primary btn-lg" id="manualNext">下一题</button>
                `;
                document.getElementById('manualNext').onclick = () => this.nextQuestion();
            }
            q.wrongQuestions.push({
                question: question.question,
                yourAnswer: '错误',
                correctAnswer: correctAnswer
            });
            q.answers.push({
                question: question.question,
                correct: false,
                retry: retryCount,
                answer: correctAnswer
            });

            // 禁用输入
            const input = document.getElementById('quizInput');
            if (input) input.disabled = true;
            document.querySelectorAll('.quiz-option').forEach(o => o.style.pointerEvents = 'none');
            const submitBtn = document.getElementById('quizSubmit');
            if (submitBtn) submitBtn.disabled = true;
        }
    },

    handleReading(question) {
        const btn = document.getElementById('recordBtn');
        const scoreDiv = document.getElementById('readScore');
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        const maxAttempts = 3;

        if (q.retries[qKey] === undefined) q.retries[qKey] = 0;
        const attempts = q.retries[qKey];

        if (attempts >= maxAttempts) return;

        // 停止当前播放
        TTS.stop();

        // 检查浏览器是否支持语音识别
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            scoreDiv.innerHTML = `<div class="quiz-feedback wrong" style="justify-content:center;">浏览器不支持语音识别，请使用 Chrome 浏览器</div>`;
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;

        let recognizedText = '';
        let gotResult = false;
        let fatalError = null;

        // 进入录音状态，按钮变成"停止录音"
        btn.classList.add('recording');
        btn.disabled = false;
        btn.innerHTML = '<span>⏹</span><span>停止录音</span>';
        btn.onclick = () => {
            if (btn.classList.contains('recording')) {
                try { recognition.stop(); } catch(e) {}
            }
        };

        recognition.onresult = (event) => {
            gotResult = true;
            let text = '';
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript + ' ';
            }
            recognizedText = text.toLowerCase().trim();
        };

        recognition.onerror = (event) => {
            // 只有致命错误才在此处理，其他交给 onend
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                fatalError = '请允许麦克风权限后重试';
            }
        };

        recognition.onend = () => {
            btn.classList.remove('recording');

            // 致命错误（如权限）
            if (fatalError) {
                scoreDiv.innerHTML = `<div class="quiz-feedback wrong" style="justify-content:center;">${fatalError}</div>`;
                btn.disabled = false;
                btn.innerHTML = `<span>🎤</span><span>录音评分</span>`;
                btn.onclick = () => this.handleReading(question);
                return;
            }

            // 正常结束，计数 +1
            q.retries[qKey] = attempts + 1;
            const currentAttempts = q.retries[qKey];

            if (!gotResult || !recognizedText) {
                // 没有识别到内容
                scoreDiv.innerHTML = `<div class="quiz-feedback wrong" style="justify-content:center;">没有听到声音，请大声朗读英文</div>`;
            } else {
                // 计算评分（去除标点符号，避免句号/逗号等影响编辑距离）
                const targetRaw = question.question.en.toLowerCase().trim();
                const clean = s => s.replace(/[^a-z0-9\s]/g, '');
                const targetClean = clean(targetRaw);
                const recognizedClean = clean(recognizedText);
                const similarity = this.calcSimilarity(recognizedClean, targetClean);
                const score = Math.max(0, Math.min(10, Math.round(similarity * 10)));
                q.lastReadScore = score; // 以最后一次为准

                // 逐词比对，生成带颜色的文字（也去除标点）
                const comparisonHtml = this.compareReadingText(recognizedText, targetRaw);

                scoreDiv.innerHTML = `
                    <div style="margin-top:12px;text-align:center;">
                        <div style="font-size:14px;color:#999;margin-bottom:4px;">第 ${currentAttempts}/${maxAttempts} 次录音</div>
                        <div class="quiz-feedback ${score >= 8 ? 'correct' : 'wrong'}" style="justify-content:center;">
                            评分: ${score}/10
                        </div>
                        <div style="font-size:12px;margin-top:6px;line-height:1.5;word-break:break-word;">
                            ${comparisonHtml}
                        </div>
                    </div>
                `;
            }

            // 渲染后续按钮
            if (currentAttempts >= maxAttempts) {
                // 3次用完，只能下一题
                btn.disabled = true;
                btn.innerHTML = '<span>✓</span><span>已完成</span>';
                scoreDiv.innerHTML += `<button class="btn btn-primary btn-lg mt-16" id="manualNext">下一题</button>`;
                document.getElementById('manualNext').onclick = () => this.finishReading(question);
            } else {
                // 还可以再录，也允许直接下一题
                btn.disabled = false;
                btn.innerHTML = `<span>🎤</span><span>再录一次 (${currentAttempts}/${maxAttempts})</span>`;
                btn.onclick = () => this.handleReading(question);
                scoreDiv.innerHTML += `<button class="btn btn-primary btn-lg mt-16" id="manualNext">下一题</button>`;
                document.getElementById('manualNext').onclick = () => this.finishReading(question);
            }
        };

        try {
            recognition.start();
        } catch(e) {
            btn.classList.remove('recording');
            btn.disabled = false;
            btn.innerHTML = '<span>🎤</span><span>录音评分</span>';
            btn.onclick = () => this.handleReading(question);
            scoreDiv.innerHTML = `<div class="quiz-feedback wrong" style="justify-content:center;">录音启动失败，请重试</div>`;
        }
    },

    // 英语短句跟读结束，记录分数并跳到下一题
    finishReading(question) {
        const q = this.currentQuiz;
        const qKey = q.currentIdx;
        const score = q.lastReadScore || 0;
        q.score += score;
        q.answers.push({
            question: question.question.en,
            correct: score >= 10,
            score: score
        });
        this.nextQuestion();
    },

    // 计算两个字符串的相似度 (0-1)，基于编辑距离
    calcSimilarity(s1, s2) {
        if (!s1 || !s2) return 0;
        const len1 = s1.length, len2 = s2.length;
        if (len1 === 0 && len2 === 0) return 1;
        if (len1 === 0 || len2 === 0) return 0;

        const matrix = [];
        for (let i = 0; i <= len2; i++) matrix[i] = [i];
        for (let j = 0; j <= len1; j++) matrix[0][j] = j;

        for (let i = 1; i <= len2; i++) {
            for (let j = 1; j <= len1; j++) {
                if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        const distance = matrix[len2][len1];
        return 1 - distance / Math.max(len1, len2);
    },

    // 逐词比对录音文字和考题文字，返回带颜色标注的HTML
    // 匹配的词标绿色，不匹配的标红色
    // 自动去除标点符号（句号/逗号等），只比较字母数字
    compareReadingText(recognized, target) {
        if (!recognized) return '';
        const clean = s => s.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w);
        const recWords = clean(recognized);
        const tgtWords = clean(target);
        if (recWords.length === 0) return '';

        // 词级编辑距离DP
        const m = recWords.length, n = tgtWords.length;
        const dp = [];
        for (let i = 0; i <= m; i++) { dp[i] = []; dp[i][0] = i; }
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (recWords[i-1] === tgtWords[j-1]) {
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    dp[i][j] = Math.min(dp[i-1][j-1]+1, dp[i][j-1]+1, dp[i-1][j]+1);
                }
            }
        }

        // 回溯，标记每个recognized word是否匹配
        const matched = []; // true=绿, false=红
        let i = m, j = n;
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && recWords[i-1] === tgtWords[j-1]) {
                matched[i-1] = true;
                i--; j--;
            } else if (i > 0 && (j === 0 || dp[i-1][j] <= dp[i][j-1])) {
                matched[i-1] = false;
                i--;
            } else {
                j--;
            }
        }

        // 生成HTML
        let html = '';
        for (let k = 0; k < recWords.length; k++) {
            const color = matched[k] ? '#4CAF50' : '#F44336';
            html += `<span style="color:${color}">${recWords[k]}</span> `;
        }
        return html.trim();
    },

    nextQuestion() {
        const q = this.currentQuiz;
        q.currentIdx++;
        if (q.currentIdx >= q.questions.length) {
            this.showQuizResult();
        } else {
            this.renderQuizQuestion();
        }
    },

    showQuizResult() {
        const q = this.currentQuiz;
        this.currentQuiz = null; // 清除测评状态，结果页返回正常
        const score = q.score;
        const rules = Storage.getRewardRules();
        let stars = 0;
        if (score >= 100) stars = rules.assessment.threeStar;
        else if (score >= 90) stars = rules.assessment.twoStar;
        else stars = rules.assessment.oneStar;

        const correctCount = q.answers.filter(a => a.correct).length;
        const wrongCount = q.questions.length - correctCount;

        TTS.playStar();

        // 保存结果
        Storage.saveAssessmentResult(null, q.type, {
            score: score,
            stars: stars,
            correctCount: correctCount,
            wrongCount: wrongCount,
            wrongQuestions: q.wrongQuestions,
            answers: q.answers
        }, q.name);

        this.updateSidebarInfo();

        let starsStr = '';
        for (let i = 0; i < 3; i++) {
            starsStr += i < stars ? '⭐' : '☆';
        }

        let wrongDetail = '';
        if (q.wrongQuestions.length > 0) {
            wrongDetail = '<div class="result-detail"><h3>错题明细</h3>';
            q.wrongQuestions.forEach(w => {
                wrongDetail += `<div class="result-detail-item">
                    <span>${w.question}</span>
                    <span class="text-success">${w.correctAnswer}</span>
                </div>`;
            });
            wrongDetail += '</div>';
        } else {
            wrongDetail = '<div class="result-detail"><h3>🎉 全部答对，太棒了！</h3></div>';
        }

        // 清空子页面栈，使结果页返回时直接回到测评主界面
        this.subPageStack = [];
        this.navigateSub(() => {
            document.getElementById('main-content').innerHTML = `
                <div class="quiz-container">
                    <h1 class="page-title text-center">${q.icon} ${q.name} - 成绩单</h1>
                    <div class="quiz-result">
                        <div class="result-score">${score}分</div>
                        <div class="result-stars">${starsStr}</div>
                        <div style="font-size:18px;margin-bottom:16px;">
                            答对 ${correctCount} 题 | 答错 ${wrongCount} 题
                        </div>
                        ${wrongDetail}
                        <button class="btn btn-primary btn-lg btn-block mt-16" onclick="App.navigate('assessment')">返回</button>
                    </div>
                </div>
            `;
        });

        this.showStarAnimation();
        this.showToast(`获得 ${stars} 颗星！`);
    },

    // ========================================================
    // 数独游戏（知识测评子模块）
    // 每日仅可挑战一次：选规格(四/六/九宫) → 选难度 → 随机3题 → 按正确数给星
    // ========================================================
    SUDOKU_SIZES: [
        { n: 4, name: '四宫数独', desc: '4×4 · 入门' },
        { n: 6, name: '六宫数独', desc: '6×6 · 进阶' },
        { n: 9, name: '九宫数独', desc: '9×9 · 经典' }
    ],
    SUDOKU_DIFFS: [
        { key: 'easy', name: '简单', extra: 0 },
        { key: 'medium', name: '中等', extra: 1 },
        { key: 'hard', name: '困难', extra: 2 }
    ],
    // 四宫基准星；六宫每级+1，九宫每级+2（由 extra 控制）
    SUDOKU_BASE_STARS: { easy: 2, medium: 3, hard: 5 },

    sudokuStarValue(n, diffKey, correct) {
        if (correct <= 0) return 0;
        if (correct <= 2) return 1; // 答对 1-2 题鼓励 1 星
        const extra = ({ 4: 0, 6: 1, 9: 2 })[n] || 0;
        return (this.SUDOKU_BASE_STARS[diffKey] || 0) + extra; // 全部答对=满星
    },

    sudokuSizeName(n) { return ({ 4: '四宫数独', 6: '六宫数独', 9: '九宫数独' })[n] || (n + '宫数独'); },
    sudokuDiffName(k) { return ({ easy: '简单', medium: '中等', hard: '困难' })[k] || k; },

    renderSudokuHome() {
        const done = Storage.hasAssessedToday(null, 'sudoku');
        const rec = done ? Storage.getAssessmentRecord(null, 'sudoku') : null;
        if (done && rec) {
            // 今日已完成：展示成绩，不可再战
            const stars = rec.stars || 0;
            let starsStr = '';
            const maxStars = 7;
            for (let i = 0; i < maxStars; i++) starsStr += i < stars ? '⭐' : '☆';
            const html = `<h1 class="page-title">🔢 数独游戏</h1>
                <div class="sd-done-card">
                    <div class="sd-done-badge">今日已完成</div>
                    <div class="sd-done-mode">${this.esc(rec.sizeName || '')} · ${this.esc(rec.diffName || '')}</div>
                    <div class="sd-done-correct">答对 ${rec.correct || 0} / 3 题</div>
                    <div class="sd-done-stars">${starsStr}</div>
                    <div class="sd-done-tip">每天只能挑战一次，明天再来领取更多星星 🌟</div>
                </div>
                <button class="btn btn-primary btn-lg btn-block mt-16" onclick="App.navigate('assessment')">返回测评列表</button>`;
            document.getElementById('main-content').innerHTML = html;
            return;
        }
        // 未挑战：选择规格
        let cards = '';
        this.SUDOKU_SIZES.forEach(s => {
            cards += `<div class="sd-choice-card" data-n="${s.n}">
                <div class="sd-choice-icon">${s.n === 4 ? '🔲' : (s.n === 6 ? '🔳' : '🟰')}</div>
                <div class="sd-choice-name">${s.name}</div>
                <div class="sd-choice-desc">${s.desc}</div>
            </div>`;
        });
        const html = `<h1 class="page-title">🔢 数独游戏</h1>
            <p class="sd-lead">每天仅可挑战一次。先选择规格，再选难度，系统随机出 3 道题。</p>
            <div class="sd-choice-grid">${cards}</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.sd-choice-card').forEach(c => {
            c.onclick = () => this.navigateSub(() => this.renderSudokuDifficulty(+c.dataset.n));
        });
    },

    renderSudokuDifficulty(n) {
        const sizeName = this.sudokuSizeName(n);
        const extra = ({ 4: 0, 6: 1, 9: 2 })[n] || 0;
        let cards = '';
        this.SUDOKU_DIFFS.forEach(d => {
            const stars = this.SUDOKU_BASE_STARS[d.key] + extra;
            cards += `<div class="sd-choice-card" data-diff="${d.key}">
                <div class="sd-choice-name">${d.name}</div>
                <div class="sd-choice-desc">满星 ${stars} ⭐（全对）</div>
            </div>`;
        });
        const html = `<h1 class="page-title">🔢 ${sizeName}</h1>
            <p class="sd-lead">选择难度。答对 1-2 题得 1 ⭐，全部答对得满星，全错不得星。</p>
            <div class="sd-choice-grid">${cards}</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.sd-choice-card').forEach(c => {
            c.onclick = () => this.navigateSub(() => this.renderSudokuPlay(n, c.dataset.diff));
        });
    },

    renderSudokuPlay(n, diffKey) {
        const sizeName = this.sudokuSizeName(n);
        const diffName = this.sudokuDiffName(diffKey);
        // 标记测评进行中，返回/切换导航时弹出"还未答完，是否退出"
        this.currentQuiz = { type: 'sudoku', name: '数独游戏-' + sizeName + '-' + diffName };
        // 随机生成 3 道题
        const puzzles = [];
        for (let i = 0; i < 3; i++) puzzles.push(SudokuGen.generatePuzzle(n, diffKey));
        this._sudokuData = { n: n, diffKey: diffKey, sizeName: sizeName, diffName: diffName, puzzles: puzzles };

        let grids = '';
        puzzles.forEach((p, idx) => {
            grids += `<div class="sd-puzzle">
                <div class="sd-puzzle-head">第 ${idx + 1} 题</div>
                ${this.sudokuGridHtml(p.puzzle, idx, n)}
            </div>`;
        });

        const html = `<h1 class="page-title">🔢 ${sizeName} · ${diffName}</h1>
            <p class="sd-lead">填入空格，完成 3 题后提交。点击已填格可修改。</p>
            <div class="sd-puzzles">${grids}</div>
            <button class="btn btn-primary btn-lg btn-block mt-16" id="sdSubmit">提交测评</button>
            <p class="sd-hint">每天仅一次机会，提交后不可重来，请仔细检查哦～</p>`;
        document.getElementById('main-content').innerHTML = html;

        // 输入框限制：仅允许 1..n 的单个数字
        document.querySelectorAll('.sd-input').forEach(inp => {
            inp.addEventListener('input', () => {
                let v = inp.value.replace(/[^0-9]/g, '');
                if (v.length > 1) v = v.slice(-1);
                if (v && (+v < 1 || +v > n)) v = '';
                inp.value = v;
            });
        });

        document.getElementById('sdSubmit').onclick = () => this.submitSudoku();
    },

    sudokuGridHtml(puzzle, idx, n) {
        const { boxR, boxC } = SudokuGen.boxDims(n);
        let cells = '';
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const v = puzzle[r][c];
                const cls = ['sd-cell'];
                if (v !== 0) {
                    cls.push('sd-given');
                    cells += `<div class="${cls.join(' ')}">${v}</div>`;
                } else {
                    cls.push('sd-input');
                    if ((c + 1) % boxC === 0 && c !== n - 1) cls.push('sd-sep-r');
                    if ((r + 1) % boxR === 0 && r !== n - 1) cls.push('sd-sep-b');
                    cells += `<input class="${cls.join(' ')}" type="number" inputmode="numeric" min="1" max="${n}" data-p="${idx}" data-r="${r}" data-c="${c}" />`;
                }
            }
        }
        return `<div class="sd-grid" style="--n:${n}">${cells}</div>`;
    },

    submitSudoku() {
        const data = this._sudokuData;
        if (!data) return;
        const n = data.n;
        // 收集每题玩家答案：以原题线索为底，再填入玩家输入
        const userGrids = data.puzzles.map(puz => puz.puzzle.map(row => row.slice()));
        let unfilled = 0;
        document.querySelectorAll('.sd-input').forEach(inp => {
            const p = +inp.dataset.p, r = +inp.dataset.r, c = +inp.dataset.c;
            const val = inp.value ? +inp.value : 0;
            if (!val) unfilled++;
            userGrids[p][r][c] = val;
        });
        if (unfilled > 0) {
            this.showToast('还有空格没填，先完成所有题目吧～');
            return;
        }
        // 判题
        let correct = 0;
        data.puzzles.forEach((puz, i) => {
            if (SudokuGen.isPuzzleCorrect(puz.puzzle, userGrids[i], n)) correct++;
        });
        const stars = this.sudokuStarValue(n, data.diffKey, correct);

        // 保存（复用知识测评的星星账本）
        Storage.saveAssessmentResult(null, 'sudoku', {
            score: correct,
            stars: stars,
            correct: correct,
            sizeName: data.sizeName,
            diffName: data.diffName
        }, '数独游戏-' + data.sizeName + '-' + data.diffName);

        this.updateSidebarInfo();
        this.currentQuiz = null; // 测评已完成，清除进行中标记
        if (stars > 0) { TTS.playStar(); this.showStarAnimation(); }
        this.showToast(`答对 ${correct} 题，获得 ${stars} 颗星！`);

        // 展示结果（清栈，返回直接回测评列表）
        this.subPageStack = [];
        this.navigateSub(() => this.renderSudokuResult(data, correct, stars));
    },

    renderSudokuResult(data, correct, stars) {
        const n = data.n;
        let starsStr = '';
        for (let i = 0; i < stars; i++) starsStr += '⭐';
        if (stars === 0) starsStr = '<span class="sd-result-nostar">本次未获得星星</span>';
        const verdict = correct === 3 ? '🎉 全部答对，太厉害了！'
            : correct === 0 ? '再接再厉，明天继续加油！'
            : '不错哦，继续练习会更好！';
        let solutions = '';
        data.puzzles.forEach((puz, i) => {
            solutions += `<div class="sd-puzzle">
                <div class="sd-puzzle-head">第 ${i + 1} 题 · 解答</div>
                ${this.sudokuSolutionHtml(puz.solution, n)}
            </div>`;
        });
        const html = `<h1 class="page-title">🔢 数独成绩单</h1>
            <div class="quiz-result">
                <div class="result-score">${data.sizeName} · ${data.diffName}</div>
                <div class="sd-result-correct">答对 ${correct} / 3 题</div>
                <div class="result-stars">${starsStr}</div>
                <div class="sd-verdict">${verdict}</div>
                <div class="sd-solutions-title">完整解答</div>
                <div class="sd-puzzles">${solutions}</div>
                <button class="btn btn-primary btn-lg btn-block mt-16" onclick="App.navigate('assessment')">返回测评列表</button>
                <p class="sd-hint">每天仅可挑战一次，明日再来领取更多星星 🌟</p>
            </div>`;
        document.getElementById('main-content').innerHTML = html;
    },

    sudokuSolutionHtml(solution, n) {
        let cells = '';
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                cells += `<div class="sd-cell sd-given">${solution[r][c]}</div>`;
            }
        }
        return `<div class="sd-grid" style="--n:${n}">${cells}</div>`;
    },

    // ========================================================
    // 专注力训练（阅读理解小故事）
    // ========================================================
    renderFocusTrainingHome() {
        const items = window.FOCUS_TRAINING || [];
        let html = `<h1 class="page-title">🧘 专注力训练</h1>
            <div class="focus-total">共 <strong>${items.length}</strong> 篇</div>
            <div class="focus-search"><input type="search" id="focusSearch" class="focus-search-input" placeholder="🔍 搜索故事名称…" autocomplete="off"></div>
            <div class="focus-list" id="focusGrid"></div>`;

        document.getElementById('main-content').innerHTML = html;

        const inp = document.getElementById('focusSearch');
        if (inp) inp.addEventListener('input', e => this._renderFocusGrid(e.target.value));
        this._renderFocusGrid('');
    },

    // 根据关键词实时过滤专注力故事列表
    _renderFocusGrid(keyword) {
        const items = window.FOCUS_TRAINING || [];
        const grid = document.getElementById('focusGrid');
        if (!grid) return;
        const kw = (keyword || '').trim().toLowerCase();
        const filtered = kw
            ? items.filter(it => (it.title || '').toLowerCase().includes(kw))
            : items;
        if (!filtered.length) {
            grid.innerHTML = `<div class="focus-empty">🔍 没有找到与「${this.esc(keyword)}」相关的故事</div>`;
            return;
        }
        grid.innerHTML = filtered.map(it => {
            const origIdx = items.indexOf(it);
            return `<div class="focus-card" data-index="${origIdx}">
                <span class="focus-card-num">${origIdx + 1}</span>
                <span class="focus-card-title">${this.esc(it.title)}</span>
            </div>`;
        }).join('');
        grid.querySelectorAll('.focus-card').forEach(card => {
            card.addEventListener('click', () => {
                const idx = +card.dataset.index;
                const item = items[idx];
                if (item) this.navigateSub(() => this.renderFocusTrainingDetail(item, idx));
            });
        });
    },

    // ========================================================
    // 蜻蜓FM 有声历史（世界上下五千年 cid=152754 / 中华上下五千年 cid=48592）
    // 音频地址运行时动态生成（qtfm redirect + 签名），列表不存静态链接
    // ========================================================
    renderWorldHistoryHome() {
        this.renderQtfmHistory({
            title: '世界上下五千年',
            icon: '🌍',
            cid: 152754,
            listKey: 'WORLD_HISTORY',
            placeholder: '🔍 搜索集数/标题…'
        });
    },

    renderChinaHistoryHome() {
        this.renderQtfmHistory({
            title: '中华上下五千年',
            icon: '🏛️',
            cid: 48592,
            listKey: 'CHINA_HISTORY',
            placeholder: '🔍 搜索集数/标题…'
        });
    },

    renderScienceBoostHome() {
        this.renderQtfmHistory({
            title: '科学充电站',
            icon: '🔬',
            cid: 445535,
            listKey: 'SCIENCE_BOOST',
            placeholder: '🔍 搜索集数/标题…'
        });
    },

    renderQtfmHistory(opts) {
        const items = window[opts.listKey] || [];
        this._whState = { opts, items, cid: opts.cid };
        let html = `<h1 class="page-title">${opts.icon} ${opts.title}</h1>
            <p class="wh-sub">共 <b>${items.length}</b> 集 · 点击任意一集播放，播完自动连播下一集</p>
            <div class="wh-now" id="whNow" style="display:none;">
                <div class="wh-now-info">
                    <span class="wh-now-label">正在播放</span>
                    <span class="wh-now-title" id="whNowTitle"></span>
                </div>
                <button class="wh-now-stop" id="whStop">⏹ 停止</button>
            </div>
            <div class="wh-search"><input type="search" id="whSearch" class="wh-search-input" placeholder="${opts.placeholder}" autocomplete="off"></div>
            <div class="wh-list" id="whList"></div>`;

        document.getElementById('main-content').innerHTML = html;

        const inp = document.getElementById('whSearch');
        if (inp) inp.addEventListener('input', e => this._renderWhGrid(e.target.value));
        const stop = document.getElementById('whStop');
        if (stop) stop.addEventListener('click', () => this._whStop());

        this._renderWhGrid('');
        // 若已有正在播放的音频，恢复播放状态显示
        if (this._whAudio && !this._whAudio.paused && typeof this._whCurrentIdx === 'number') {
            this._whSyncNowBar();
            this._whHighlightCurrent();
        }
    },

    _renderWhGrid(keyword) {
        const state = this._whState || { items: [] };
        const items = state.items;
        const grid = document.getElementById('whList');
        if (!grid) return;
        const kw = (keyword || '').trim().toLowerCase();
        const filtered = kw
            ? items.filter(it => (it.title || '').toLowerCase().includes(kw))
            : items;
        if (!filtered.length) {
            grid.innerHTML = `<div class="wh-empty">🔍 没有找到与「${this.esc(keyword)}」相关的节目</div>`;
            return;
        }
        grid.innerHTML = filtered.map(it => {
            const idx = items.indexOf(it);
            const dur = this._whFmt(it.duration || 0);
            return `<div class="wh-item" data-index="${idx}">
                <span class="wh-item-num">${idx + 1}</span>
                <span class="wh-item-title">${this.esc(it.title)}</span>
                <span class="wh-item-dur">${dur}</span>
                <span class="wh-item-play">▶</span>
            </div>`;
        }).join('');
        grid.querySelectorAll('.wh-item').forEach(card => {
            card.addEventListener('click', () => this._whPlay(+card.dataset.index));
        });
        this._whHighlightCurrent();
    },

    _whFmt(sec) {
        sec = Math.max(0, Math.floor(sec || 0));
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    },

    _whPlay(idx) {
        const state = this._whState || { items: [], cid: 152754 };
        const items = state.items;
        if (!items[idx]) return;
        this._whCurrentIdx = idx;
        const item = items[idx];
        const au = this._whAudio || (this._whAudio = new Audio());
        try { au.src = this._qtfmAudioUrlC(state.cid, item.id); } catch (e) {}
        au.play().catch(() => {});
        au.onended = () => {
            this._whSyncNowBar();
            this._whHighlightCurrent();
            this._whPlay(idx + 1); // 自动连播下一集
        };
        this._whSyncNowBar();
        this._whHighlightCurrent();
    },

    _whStop() {
        if (this._whAudio) { try { this._whAudio.pause(); this._whAudio.onended = null; } catch (e) {} }
        this._whCurrentIdx = null;
        const bar = document.getElementById('whNow');
        if (bar) bar.style.display = 'none';
        this._whHighlightCurrent();
    },

    _whSyncNowBar() {
        const state = this._whState || { items: [] };
        const items = state.items;
        const idx = this._whCurrentIdx;
        const bar = document.getElementById('whNow');
        const titleEl = document.getElementById('whNowTitle');
        if (!bar) return;
        if (typeof idx === 'number' && items[idx]) {
            bar.style.display = 'flex';
            if (titleEl) titleEl.textContent = items[idx].title;
        } else {
            bar.style.display = 'none';
        }
    },

    _whHighlightCurrent() {
        const state = this._whState || { items: [] };
        const items = state.items;
        const cur = this._whCurrentIdx;
        document.querySelectorAll('.wh-item').forEach(card => {
            const idx = +card.dataset.index;
            const playing = (idx === cur && this._whAudio && !this._whAudio.paused);
            card.classList.toggle('playing', !!playing);
            const playIcon = card.querySelector('.wh-item-play');
            if (playIcon) playIcon.textContent = playing ? '⏸' : '▶';
        });
    },

    renderFocusTrainingDetail(item, idx) {
        const items = window.FOCUS_TRAINING || [];
        const total = items.length;
        if (typeof idx !== 'number' || idx < 0 || idx >= total) {
            idx = items.indexOf(item);
            if (idx < 0) idx = 0;
        }

        // 顶部固定翻页条：上一篇 / 篇数 / 下一篇（滚动时置顶不隐藏）
        const prevBtn = idx > 0
            ? `<button class="focus-pager-btn" id="focusPrev">⬅ 上一篇</button>`
            : `<button class="focus-pager-btn" id="focusPrev" disabled>⬅ 上一篇</button>`;
        const nextBtn = idx < total - 1
            ? `<button class="focus-pager-btn" id="focusNext">下一篇 ➡</button>`
            : `<button class="focus-pager-btn" id="focusNext" disabled>下一篇 ➡</button>`;

        // 渲染故事正文（按段落换行）
        const storyHtml = this.esc(item.story).replace(/\n/g, '</p><p class="focus-para">');

        // 渲染思考题
        let questionsHtml = '';
        item.questions.forEach((q, i) => {
            questionsHtml += `<div class="focus-question">
                <div class="focus-q-title">${this.esc(q.title || '问题 ' + (i + 1))}</div>
                <div class="focus-q-text">${this.esc(q.text || '')}</div>`;

            if (q.type === 'choice' && q.options) {
                q.options.forEach(opt => {
                    questionsHtml += `<div class="focus-option">${this.esc(opt)}</div>`;
                });
            } else if (q.type === 'fill' && q.items) {
                q.items.forEach(line => {
                    questionsHtml += `<div class="focus-fill-item">${this.esc(line)}</div>`;
                });
            } else if (q.type === 'tf' && q.items) {
                q.items.forEach(line => {
                    questionsHtml += `<div class="focus-tf-item">${this.esc(line)}</div>`;
                });
            }

            questionsHtml += `</div>`;
        });

        const html = `<div class="focus-pager">
                ${prevBtn}
                <span class="focus-pager-count">${idx + 1} / ${total}</span>
                ${nextBtn}
            </div>
            <h1 class="page-title">🧘 ${this.esc(item.title)}</h1>
            <div class="focus-detail">
                <div class="focus-section">
                    <div class="focus-section-title">📖 小故事</div>
                    <div class="focus-story"><p class="focus-para">${storyHtml}</p></div>
                </div>
                <div class="focus-section">
                    <div class="focus-section-title">🤔 思考题</div>
                    <div class="focus-questions">${questionsHtml}</div>
                </div>
                <div class="focus-section">
                    <div class="focus-section-title">💡 发散思维</div>
                    <div class="focus-divergent">${this.esc(item.divergent)}</div>
                </div>
            </div>`;
        document.getElementById('main-content').innerHTML = html;

        // 上一篇 / 下一篇：直接原地切换（不压栈，返回键仍回到列表）
        const goto = (i) => {
            if (i < 0 || i >= total) return;
            const it = items[i];
            if (!it) return;
            this.renderFocusTrainingDetail(it, i);
            window.scrollTo(0, 0);
        };
        const pv = document.getElementById('focusPrev');
        if (pv && !pv.disabled) pv.onclick = () => goto(idx - 1);
        const nx = document.getElementById('focusNext');
        if (nx && !nx.disabled) nx.onclick = () => goto(idx + 1);
    },

    // ========================================================
    // 模块四：学习工具
    // ========================================================
    renderToolsList() {
        const tools = [
            { id: 'engTextbook', icon: '📘', name: '英语课文二上' },
            { id: 'cnTextbook', icon: '📕', name: '语文课文二上' },
            { id: 'focus', icon: '🧘', name: '专注力训练' },
            { id: 'idioms', icon: '📚', name: '成语故事' },
            { id: 'poems', icon: '📜', name: '小学生古诗75首' },
            { id: 'mathTypes', icon: '🧮', name: '数学专项题型' },
            { id: 'pinyin', icon: '🔤', name: '汉语拼音' },
            { id: 'stroke', icon: '✍️', name: '汉字笔顺查询' },
            { id: 'shengzi', icon: '📚', name: '语文生字' },
            { id: 'kantu', icon: '🖼️', name: '看图写话扩句法' },
            { id: 'songs', icon: '🎵', name: '英文儿歌' },
            { id: 'phonetics', icon: '🗣️', name: '国际音标48个' },
            { id: 'qaBaike', icon: '💡', name: '问答百科' },
            { id: 'history', icon: '🏯', name: '中华历史科普' },
            { id: 'worldHistory', icon: '🌍', name: '世界上下五千年' },
            { id: 'chinaHistory', icon: '🏛️', name: '中华上下五千年' },
            { id: 'scienceBoost', icon: '🔬', name: '科学充电站' },
            { id: 'errorBook', icon: '📝', name: '错题本' }
        ];

        let html = `<h1 class="page-title">🧰 学习工具</h1>
            <div class="tool-grid">`;

        tools.forEach(t => {
            html += `<div class="tool-card" data-tool="${t.id}">
                <div class="tool-icon">${t.icon}</div>
                <div class="tool-name">${t.name}</div>
            </div>`;
        });

        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;

        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => {
                const tool = card.dataset.tool;
                switch(tool) {
                case 'mathTypes': this.renderMathHome(); break;
                case 'pinyin': this.renderPinyin(); break;
                case 'stroke': this.renderStrokeQuery(); break;
                case 'shengzi': this.navigateSub(() => this.renderShengzi()); break;
                    case 'kantu': this.navigateSub(() => this.renderKantu()); break;
                    case 'qaBaike': this.navigateSub(() => this.renderQaEncyclopedia()); break;
                    case 'phonetics': this.navigateSub(() => this.renderPhoneticsHome()); break;
                    case 'poems': this.navigateSub(() => this.renderPoemsHome()); break;
                    case 'idioms': this.navigateSub(() => this.renderIdiomsHome()); break;
                    case 'history': this.renderHistoryHome(); break;
                    case 'worldHistory': this.navigateSub(() => this.renderWorldHistoryHome()); break;
                    case 'chinaHistory': this.navigateSub(() => this.renderChinaHistoryHome()); break;
                    case 'scienceBoost': this.navigateSub(() => this.renderScienceBoostHome()); break;
                    case 'engTextbook': this.renderEngTextbook(); break;
                    case 'focus': this.navigateSub(() => this.renderFocusTrainingHome()); break;
                    case 'songs': this.navigateSub(() => this.renderSongsHome()); break;
                    case 'cnTextbook': this.renderCnTextbook(); break;
                    case 'errorBook': this.renderErrorBook(); break;
                }
            });
        });
    },

    // ========================================================
    // 汉语拼音（学习工具 · 第二项）
    // ========================================================
    pyChip(e, noWrite) {
        const cls = noWrite ? 'pinyin-chip pinyin-chip-readonly' : 'pinyin-chip';
        return `<div class="${cls}" data-py="${this.esc(e.c)}">
            <span class="pinyin-char">${this.esc(e.c)}</span></div>`;
    },

    // 学习要点里可点击的小拼音（示例），点击朗读
    pyInline(c) {
        const e = findPinyin(c);
        if (!e) return this.esc(c);
        return `<span class="pinyin-inline" data-py="${this.esc(e.c)}">${this.esc(e.c)}</span>`;
    },

    // 静态四线三格卡片（用于“小写字母标准笔顺”）—— 仅展示，不可点击
    pyStaticCard(ch) {
        const L = window.PINYIN_LETTERS && window.PINYIN_LETTERS[ch];
        const steps = (L && L.steps) ? L.steps.join('  ') : (L && L.stroke ? L.stroke : '');
        const grid = (L && L.grid) ? `占格：${L.grid}` : '';
        const note = (L && L.note) ? L.note : '';
        // 全部 26 个拼音小写字母（含 ü）均用提供的标准笔顺图片直接展示（含箭头与笔顺序号）
        const refImgMap = {
            'a': 'ref_a.png',
            'b': 'ref_b.png',
            'c': 'ref_c.png',
            'd': 'ref_d.png',
            'e': 'ref_e.png',
            'f': 'ref_f.png',
            'g': 'ref_g.png',
            'h': 'ref_h.png',
            'i': 'ref_i.png',
            'j': 'ref_j.png',
            'k': 'ref_k.png',
            'l': 'ref_l.png',
            'm': 'ref_m.png',
            'n': 'ref_n.png',
            'o': 'ref_o.png',
            'p': 'ref_p.png',
            'q': 'ref_q.png',
            'r': 'ref_r.png',
            's': 'ref_s.png',
            't': 'ref_t.png',
            'u': 'ref_u.png',
            'ü': 'ref_ü.png',
            'v': 'ref_v.png',
            'w': 'ref_w.png',
            'x': 'ref_x.png',
            'y': 'ref_y.png',
            'z': 'ref_z.png'
        };
        const refImg = refImgMap[ch];
        const four = refImg
            ? `<img class="py-static-img" src="images/${refImg}" alt="${this.esc(ch)} 笔顺">`
            : `<svg viewBox="0 0 60 80" aria-label="${this.esc(ch)}">
                    <line x1="3" y1="12" x2="57" y2="12" class="py-grid-line"/>
                    <line x1="3" y1="32" x2="57" y2="32" class="py-grid-line"/>
                    <line x1="3" y1="54" x2="57" y2="54" class="py-grid-line"/>
                    <line x1="3" y1="74" x2="57" y2="74" class="py-grid-line"/>
                    ${this.pyCardStrokes(ch)}
                </svg>`;
        return `<div class="py-static-card">
            <div class="py-static-four">
                ${four}
            </div>
            <div class="py-static-char">${this.esc(ch)}</div>
            <div class="py-static-grid">${this.esc(grid)}</div>
            <div class="py-static-steps">${this.esc(steps)}</div>
            <div class="py-static-note">${this.esc(note)}</div>
        </div>`;
    },

    // 渲染字母书写笔画（纯手写字形，无序号/箭头）
    pyCardStrokes(ch) {
        const strokes = (window.PINYIN_STROKES && window.PINYIN_STROKES[ch]) || [];
        if (!strokes.length) {
            return `<text x="30" y="52" class="py-four-letter">${this.esc(ch)}</text>`;
        }
        return strokes.map(d => `<path class="py-static-stroke" d="${d}"/>`).join('');
    },

    renderPinyin() {
        this.navigateSub(() => {
            const D = window.PINYIN_DATA;
            const L = window.PINYIN_LETTERS;
            const chip = e => this.pyChip(e);
            const sub = (title, arr) => `<div class="pinyin-sub">
                <div class="pinyin-sub-title">${title}</div>
                <div class="pinyin-grid">${arr.map(chip).join('')}</div></div>`;

            const letterGroups = [
                { title: 'a o e', chars: ['a', 'o', 'e'] },
                { title: 'i u ü', chars: ['i', 'u', 'ü'] },
                { title: 'b p m f d t', chars: ['b', 'p', 'm', 'f', 'd', 't'] },
                { title: 'n l g k h j', chars: ['n', 'l', 'g', 'k', 'h', 'j'] },
                { title: 'q x', chars: ['q', 'x'] },
                { title: 'r z c', chars: ['r', 'z', 'c'] },
                { title: 's y w', chars: ['s', 'y', 'w'] }
            ];
            const strokeSection = letterGroups.map(g => `
                <div class="py-static-group">
                    <div class="py-static-title">${this.esc(g.title)}</div>
                    <div class="py-static-row">${g.chars.map(c => this.pyStaticCard(c)).join('')}</div>
                </div>`).join('');

            let html = `<h1 class="page-title">🔤 汉语拼音</h1>
                <div class="card pinyin-card">
                    <p class="pinyin-lead">拼音由 <b>声母</b>、<b>韵母</b>、<b>整体认读音节</b> 三部分组成。点击任意拼音字符即可播放标准读音。</p>
                </div>

                <div class="pinyin-block">
                    <h3 class="pinyin-h3">一、拼音总分类</h3>

                    <h4 class="pinyin-h4">1. 声母（23 个，音节开头辅音）</h4>
                    <div class="pinyin-grid">${D.shengmu.map(chip).join('')}</div>

                    <h4 class="pinyin-h4">2. 韵母（24 个，音节后半部分）</h4>
                    ${sub('单韵母（6 个）', D.yunmu.dan)}
                    ${sub('复韵母（8 个）', D.yunmu.fu)}
                    ${sub('特殊韵母（1 个）', D.yunmu.te)}
                    ${sub('前鼻韵母（5 个）', D.yunmu.qian)}
                    ${sub('后鼻韵母（4 个）', D.yunmu.hou)}

                    <h4 class="pinyin-h4">3. 整体认读音节（16 个，不用拼读直接读）</h4>
                    <div class="pinyin-grid">${D.zhengti.map(chip).join('')}</div>
                </div>

                <div class="card pinyin-notes">
                    <h3 class="pinyin-h3">二、读音学习要点</h3>
                    <h4 class="pinyin-h4">1、拼读规则</h4>
                    <p><b>两拼音</b>：声母 + 韵母 → 例：${this.pyInline('b')} + ${this.pyInline('a')} = ${this.pyInline('ba')}</p>
                    <p><b>三拼音</b>：声母 + 介母 (i/u/ü) + 韵母 → 例：${this.pyInline('x')} + ${this.pyInline('i')} + ${this.pyInline('ang')} = ${this.pyInline('xiang')}</p>
                    <p><b>ü 拼读要点</b>：j / q / x 遇见 ü，去掉两点还读 ü；n / l 和 ü 相拼两点保留</p>
                    <h4 class="pinyin-h4">2、声调（4 声 + 轻声）</h4>
                    <p>一声平、二声扬、三声拐弯、四声降；轻声不标调，轻短读</p>
                    <h4 class="pinyin-h4">3、读音区分重点</h4>
                    <p>平舌音（${this.pyInline('z')} ${this.pyInline('c')} ${this.pyInline('s')}）、翘舌音（${this.pyInline('zh')} ${this.pyInline('ch')} ${this.pyInline('sh')} ${this.pyInline('r')}）；前鼻音、后鼻音</p>
                </div>

                <div class="card py-static-section">
                    <h3 class="pinyin-h3">三、小写字母标准笔顺</h3>
                    <p class="pinyin-lead">以下为小写字母标准笔顺参考图，展示每个字母的占格与书写顺序（仅供查看，不可点击）。</p>
                    ${strokeSection}
                </div>`;

            document.getElementById('main-content').innerHTML = html;

            document.querySelectorAll('.pinyin-chip, .pinyin-inline').forEach(el => {
                el.onclick = () => this.speakPinyin(el.dataset.py);
            });
        });
    },

    // 朗读单个拼音：优先播放标准发音音频（取自汉语拼音网 hanyupinyin.cn 的官方朗读，
    // 已下载到本地 audio/pinyin/），音频缺失或加载失败时回退到浏览器 TTS 朗读同音汉字
    speakPinyin(py) {
        if (!py) return;
        const file = (window.PINYIN_AUDIO && window.PINYIN_AUDIO[py]) || null;
        if (file) {
            const url = (window.PINYIN_AUDIO_BASE || 'audio/pinyin/') + file;
            if (!this._pyAudio) this._pyAudio = new Audio();
            const a = this._pyAudio;
            a.src = url;
            a.onerror = () => {
                const mapped = (window.PINYIN_READ_MAP && window.PINYIN_READ_MAP[py]) || py;
                if (window.TTS && TTS.synth) TTS.speak(mapped, 'zh-CN', 0.85);
                else this.showToast('当前设备不支持语音朗读');
            };
            const p = a.play();
            if (p && p.catch) p.catch(() => {
                const mapped = (window.PINYIN_READ_MAP && window.PINYIN_READ_MAP[py]) || py;
                if (window.TTS && TTS.synth) TTS.speak(mapped, 'zh-CN', 0.85);
            });
            return;
        }
        // 没有对应音频文件的拼音，直接用 TTS 朗读同音汉字
        const mapped = (window.PINYIN_READ_MAP && window.PINYIN_READ_MAP[py]) || py;
        if (window.TTS && TTS.synth) TTS.speak(mapped, 'zh-CN', 0.85);
        else this.showToast('当前设备不支持语音朗读');
    },

    // ========================================================
    // 汉字笔顺查询（学习工具）
    // ========================================================
    renderStrokeQuery() {
        this.navigateSub(() => {
            if (!this._sq) {
                this._sq = { grid: 'tian', speed: 5, drawn: 0, count: 0, strokes: [],
                    names: [], order: '', char: '', playing: false, animating: false,
                    pathEls: [], lengths: [] };
            }
            const sq = this._sq;
            let html = `<h1 class="page-title">✍️ 汉字笔顺查询</h1>
                <div class="card sq-box">
                    <div class="sq-input-row">
                        <input id="sqInput" class="sq-input" maxlength="1" placeholder="输入一个汉字，如：木" />
                        <button class="btn btn-primary" id="sqBtn">查询</button>
                    </div>
                    <p class="sq-tip">输入单个汉字，点击查询即可观看逐笔书写动画。配色：<b style="color:#c4c9d4">灰</b>=未写 · <b style="color:#e53935">红</b>=正在写 · <b style="color:#1f2330">黑</b>=已完成。</p>
                    <div class="sq-main">
                        <div class="sq-canvas">
                            <div class="sq-grid-toggle">
                                <span class="sq-gt ${sq.grid === 'tian' ? 'on' : ''}" data-g="tian">田字格</span>
                                <span class="sq-gt ${sq.grid === 'mi' ? 'on' : ''}" data-g="mi">米字格</span>
                            </div>
                            <div class="sq-svg-wrap"><svg id="sqSvg" viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet"></svg></div>
                            <div class="sq-controls">
                                <button class="btn btn-outline sq-ctrl" id="sqPrev">◀ 上一笔</button>
                                <button class="btn btn-outline sq-ctrl" id="sqNext">下一笔 ▶</button>
                                <button class="btn btn-primary sq-ctrl" id="sqPlay">▶ 自动播放</button>
                                <button class="btn btn-outline sq-ctrl" id="sqReset">↺ 重置</button>
                            </div>
                            <div class="sq-speed">
                                <span>速度</span>
                                <input type="range" id="sqSpeed" min="1" max="10" value="${sq.speed}">
                            </div>
                        </div>
                        <div class="sq-info" id="sqInfo">
                            <div class="sq-info-empty">请查询一个汉字查看笔顺详情</div>
                        </div>
                    </div>
                </div>`;
            document.getElementById('main-content').innerHTML = html;

            const input = document.getElementById('sqInput');
            input.addEventListener('keydown', e => { if (e.key === 'Enter') this.sqQuery(); });
            document.getElementById('sqBtn').onclick = () => this.sqQuery();
            document.querySelectorAll('.sq-gt').forEach(el => {
                el.onclick = () => {
                    if (this._sq.animating) return;
                    this._sq.grid = el.dataset.g;
                    document.querySelectorAll('.sq-gt').forEach(x => x.classList.toggle('on', x.dataset.g === this._sq.grid));
                    this.sqDraw();
                };
            });
            document.getElementById('sqPrev').onclick = () => this.sqPrev();
            document.getElementById('sqNext').onclick = () => this.sqNext();
            document.getElementById('sqPlay').onclick = () => this.sqPlay();
            document.getElementById('sqReset').onclick = () => this.sqReset();
            document.getElementById('sqSpeed').oninput = e => { this._sq.speed = +e.target.value; };
            if (this._sq.char) this.sqDraw();
        });
    },

    // 查询入口
    sqQuery() {
        const input = document.getElementById('sqInput');
        const ch = (input.value || '').trim().charAt(0);
        if (!ch) { this.showToast('请输入一个汉字'); return; }
        if (!/[一-鿿]/.test(ch)) { this.showToast('请输入单个汉字'); return; }
        this.showToast('查询中…', 800);
        loadHanziData(ch).then(data => {
            if (!data) { this.showToast('未找到「' + ch + '」的笔顺数据（请检查网络连接后重试）'); return; }
            const sq = this._sq;
            sq.char = data.char;
            sq.source = data.source || 'remote';
            sq.strokes = data.medians || [];
            sq.outlines = data.outlines || [];
            sq.names = data.names;
            sq.order = data.order || '';
            sq.count = data.count;
            sq.drawn = 0;
            sq.playing = false;
            sq.animating = false;
            this.sqDraw();
            this.sqPlay(); // 查询加载完成后自动播放笔顺
        }).catch(() => this.showToast('查询失败，请重试'));
    },

    sqGridSVG(grid) {
        const type = grid || this._sq.grid || 'tian';
        let g = `<g class="sq-grid">
            <rect x="40" y="40" width="944" height="944" class="sq-border"/>
            <line x1="40" y1="512" x2="984" y2="512" class="sq-line"/>
            <line x1="512" y1="40" x2="512" y2="984" class="sq-line"/>`;
        if (type === 'mi') {
            g += `<line x1="40" y1="40" x2="984" y2="984" class="sq-line sq-diag"/>` +
                 `<line x1="984" y1="40" x2="40" y2="984" class="sq-line sq-diag"/>`;
        }
        return g + `</g>`;
    },

    // 字形轮廓（底层填充，看起来像标准字体）
    sqOutlinesSVG() {
        const flip = ' transform="scale(1,-1) translate(0,-1024)"';
        return `<g id="sqOutlines"${flip}>` + this._sq.outlines.map((d, i) =>
            `<path class="sq-outline" data-i="${i}" d="${d}"/>`
        ).join('') + `</g>`;
    },

    // 描红书写层：与灰色轮廓完全相同的笔画外形，沿中线逐步揭开（红色），
    // 这样红色笔形和灰色底模完全一致，不再出现「描红与笔形不整体」的问题
    sqStrokesSVG() {
        const flip = ' transform="scale(1,-1) translate(0,-1024)"';
        const sq = this._sq;
        let defs = '<defs>';
        sq.outlines.forEach((d, i) => {
            const mp = window.medianToPath(sq.strokes[i] || []);
            // 遮罩：沿中线的一条足够宽的白线，随动画沿中线「生长」，仅揭示本笔画的红色轮廓
            defs += `<mask id="sqMask-${i}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="-200" y="-200" width="1424" height="1424">`
                + `<path class="sq-maskpath" data-i="${i}" d="${mp}" fill="none" stroke="#fff" stroke-width="240" stroke-linecap="round" stroke-linejoin="round"/>`
                + `</mask>`;
        });
        defs += '</defs>';
        const writes = sq.outlines.map((d, i) =>
            `<path class="sq-write" data-i="${i}" d="${d}" mask="url(#sqMask-${i})"/>`
        ).join('');
        return defs + `<g id="sqStrokes"${flip}>` + writes + `</g>`;
    },

    // 绘制画布 + 初始化笔画路径
    sqDraw() {
        const svg = document.getElementById('sqSvg');
        if (!svg) return;
        svg.innerHTML = this.sqGridSVG() + '<g id="sqChar">' + this.sqOutlinesSVG() + this.sqStrokesSVG() + '</g>';
        // 动态计算字形包围盒，把字整体居中到田字格（参考「知识测评·汉字笔顺测试」做法）
        const charG = svg.querySelector('#sqChar');
        const outlineG = svg.querySelector('#sqOutlines');
        if (charG && outlineG) {
            try {
                const bbox = outlineG.getBBox();
                const cx = bbox.x + bbox.width / 2;
                const cy = bbox.y + bbox.height / 2;
                const ox = (512 - cx).toFixed(1);
                const oy = (cy - 512).toFixed(1);
                charG.setAttribute('transform', 'translate(' + ox + ',' + oy + ')');
                this._sq._ox = ox;
                this._sq._oy = oy;
            } catch (e) {
                this._sq._ox = 0; this._sq._oy = 0;
            }
        }
        const maskEls = Array.from(svg.querySelectorAll('.sq-maskpath'));
        this._sq.maskEls = maskEls;
        this._sq.maskLengths = maskEls.map((el, i) => {
            const med = this._sq.strokes[i] || [];
            let L = 0;
            for (let k = 1; k < med.length; k++) {
                const dx = med[k][0] - med[k - 1][0];
                const dy = med[k][1] - med[k - 1][1];
                L += Math.sqrt(dx * dx + dy * dy);
            }
            el.style.strokeDasharray = L;
            el.style.strokeDashoffset = L; // 初始关闭：红色不显示，露出灰色底模
            return L;
        });
        this._sq.writeEls = Array.from(svg.querySelectorAll('.sq-write'));
        this.sqUpdateColors();
        this.sqRenderInfo();
        this.sqUpdateBtn();
    },

    // 根据已写进度刷新三色状态（轮廓填充 + 中线描红同步）
    sqUpdateColors() {
        const sq = this._sq;
        // 轮廓填充：已完成黑、未完成灰、当前正在写也先保持灰，等中线动画结束再变黑
        document.querySelectorAll('#sqOutlines .sq-outline').forEach((el, i) => {
            let color;
            if (i < sq.drawn) color = 'var(--sq-done)';
            else color = 'var(--sq-pend)';
            el.style.fill = color;
        });
        // 描红书写层：仅「当前正在写」的笔画显示红色（外形与灰色底模一致），其余隐藏露出灰/黑
        sq.writeEls.forEach((el, i) => {
            el.style.fill = 'var(--sq-cur)';
            el.style.opacity = (i === sq.drawn && sq.animating) ? '1' : '0';
        });
    },

    sqRenderInfo() {
        const sq = this._sq;
        const info = document.getElementById('sqInfo');
        if (!info) return;
        if (!sq.char) { info.innerHTML = '<div class="sq-info-empty">请查询一个汉字查看笔顺详情</div>'; return; }
        const flip = 'scale(1,-1) translate(0,-1024)';
        const ox = this._sq._ox || 0;
        const oy = this._sq._oy || 0;
        const stepSvg = (stepIdx) => {
            // 分步图用填充轮廓，当前笔画红色、已写黑色、未写灰色
            const paths = sq.outlines.map((d, i) => {
                const color = i < stepIdx ? 'var(--sq-done)' : (i === stepIdx ? 'var(--sq-cur)' : 'var(--sq-pend)');
                return `<path d="${d}" style="fill:${color};stroke:none;"/>`;
            }).join('');
            return `<svg class="sq-step-svg" viewBox="0 0 1024 1024"><g class="sq-step-grid">${this.sqGridSVG('mi')}</g><g transform="translate(${ox},${oy})"><g transform="${flip}">${paths}</g></g></svg>`;
        };
        const steps = sq.outlines.map((_, i) => `
            <div class="sq-step-item">
                ${stepSvg(i)}
                <div class="sq-step-label">第 ${i + 1} 笔</div>
            </div>`).join('');
        info.innerHTML = `
            <div class="sq-info-head">
                <div class="sq-big">${this.esc(sq.char)}</div>
                <div class="sq-meta">
                    <div>总笔画：<b>${sq.count}</b> 画</div>
                    <div>笔顺编码：<b>${this.esc(sq.order || '—')}</b></div>
                </div>
            </div>
            <div class="sq-steps-title">笔画分步写法</div>
            <div class="sq-steps">${steps}</div>`;
    },

    // 逐笔描红动画（红色书写，完成后转黑）
    _sqAnimate(k, cb) {
        const sq = this._sq;
        const maskEl = sq.maskEls[k];
        const writeEl = sq.writeEls[k];
        if (!maskEl) { if (cb) cb(); return; }
        const L = sq.maskLengths[k];
        const dur = Math.max(220, 1700 - sq.speed * 150);
        sq.animating = true;
        this.sqUpdateColors(); // 让当前笔画的红色书写层可见
        maskEl.style.transition = 'none';
        maskEl.style.strokeDasharray = L;
        maskEl.style.strokeDashoffset = L;
        maskEl.getBoundingClientRect(); // 强制回流
        maskEl.style.transition = 'stroke-dashoffset ' + dur + 'ms linear';
        maskEl.style.strokeDashoffset = 0; // 白色遮罩沿中线生长，逐步揭开红色笔形
        let done = false;
        const finish = () => {
            if (done) return; done = true;
            sq.animating = false;
            sq.drawn = k + 1;
            this.sqUpdateColors();
            this.sqUpdateBtn();
            if (cb) cb();
        };
        maskEl.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, dur + 150);
    },

    sqNext() {
        const sq = this._sq;
        if (!sq.char) { this.showToast('请先查询汉字'); return; }
        if (sq.animating || sq.playing) return;
        if (sq.drawn >= sq.count) { this.showToast('已全部写完'); return; }
        this._sqAnimate(sq.drawn);
    },

    sqPrev() {
        const sq = this._sq;
        if (!sq.char) return;
        if (sq.animating || sq.playing) return;
        if (sq.drawn <= 0) { this.showToast('已是第一笔'); return; }
        sq.drawn -= 1;
        this.sqUpdateColors();
    },

    sqReset() {
        const sq = this._sq;
        if (!sq.char) return;
        sq.playing = false;
        sq.drawn = 0;
        this.sqUpdateColors();
        this.sqUpdateBtn();
    },

    sqPlay() {
        const sq = this._sq;
        if (!sq.char) { this.showToast('请先查询汉字'); return; }
        if (sq.playing) { sq.playing = false; this.sqUpdateBtn(); return; }
        if (sq.drawn >= sq.count) { sq.drawn = 0; this.sqUpdateColors(); }
        sq.playing = true;
        this.sqUpdateBtn();
        const step = () => {
            if (!sq.playing) return;
            if (sq.drawn >= sq.count) { sq.playing = false; this.sqUpdateColors(); this.sqUpdateBtn(); return; }
            this._sqAnimate(sq.drawn, step);
        };
        step();
    },

    sqUpdateBtn() {
        const play = document.getElementById('sqPlay');
        if (play) play.textContent = this._sq.playing ? '⏸ 暂停' : '▶ 自动播放';
    },

    // ========================================================
    // 语文生字（学习工具 · 合并 一年级下 / 二年级上）
    // ========================================================
    getShengziGroups() {
        return [
            { key: '1x', name: '一年级下', data: window.YX_CHARS || [] },
            { key: '2s', name: '二年级上', data: window.SG1_CHARS || [] }
        ];
    },

    // 入口：选择年级分类
    renderShengzi() {
        if (!this._sz) this._sz = { grade: null };
        const groups = this.getShengziGroups();
        let html = `<h1 class="page-title">📚 语文生字</h1>
            <p class="sz-lead">选择年级，查看写字表中的生字。点击任意生字，即可学习它的<b>笔顺动画</b>、<b>拼音</b>与<b>组词</b>。</p>
            <div class="sz-grade-grid">`;
        groups.forEach(g => {
            html += `<div class="sz-grade-card" data-key="${g.key}">
                <div class="sz-grade-icon">📖</div>
                <div class="sz-grade-name">${this.esc(g.name)}</div>
                <div class="sz-grade-meta">${g.data.length} 个生字</div>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.sz-grade-card').forEach(c => {
            c.onclick = () => this.navigateSub(() => this.renderShengziGrade(c.dataset.key));
        });
    },

    // 某一年级生字的网格列表
    renderShengziGrade(key) {
        if (!this._sz) this._sz = { grade: null };
        const groups = this.getShengziGroups();
        const g = groups.find(x => x.key === key) || groups[0];
        this._sz.grade = g.key;
        const chars = g.data;
        let html = `<div class="sz-grade-head">
                <h1 class="page-title sz-grade-title">📖 生字 · ${this.esc(g.name)}</h1>
                <p class="sz-lead">共 ${chars.length} 个生字。点击任意一个，学习它的<b>笔顺动画</b>、<b>拼音</b>与<b>组词</b>。</p>
            </div>
            <div class="sz-grid">`;
        chars.forEach((e, i) => {
            html += `<div class="sz-tile" data-i="${i}">
                <div class="sz-tile-char">${this.esc(e.c)}</div>
                <div class="sz-tile-py">${this.esc(e.py)}</div>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.sz-tile').forEach(t => {
            t.onclick = () => {
                this._sz.idx = +t.dataset.i;
                this._sz.chars = chars;
                this.navigateSub(() => this.renderShengziDetail(chars[+t.dataset.i]));
            };
        });
    },

    // 生字详情：笔顺动画 + 拼音 + 组词（复用汉字笔顺查询的描红逻辑）
    renderShengziDetail(e) {
        const char = e.c;
        if (!this._sq) {
            this._sq = { grid: 'tian', speed: 5, drawn: 0, count: 0, strokes: [],
                names: [], order: '', char: '', playing: false, animating: false,
                pathEls: [], lengths: [] };
        }
        const sq = this._sq;
        const idx = (this._sz && typeof this._sz.idx === 'number') ? this._sz.idx : 0;
        const total = (this._sz && this._sz.chars) ? this._sz.chars.length : 1;
        const atFirst = idx <= 0;
        const atLast = idx >= total - 1;
        let html = `<div class="sz-detail">
            <div class="sz-detail-nav">
                <button class="btn btn-outline sq-ctrl" id="szPrevChar" ${atFirst ? 'disabled' : ''}>◀ 上一个字</button>
                <span class="sz-detail-pos">${idx + 1} / ${total}</span>
                <button class="btn btn-outline sq-ctrl" id="szNextChar" ${atLast ? 'disabled' : ''}>下一个字 ▶</button>
            </div>
            <div class="sz-detail-head">
                <div class="sz-detail-char">${this.esc(char)}</div>
                <div class="sz-detail-meta">
                    <div class="sz-py-row">
                        <span class="sz-py">${this.esc(e.py)}</span>
                        <button class="sz-audio-btn" id="szAudio" title="播放读音">🔊</button>
                    </div>
                    <div class="sz-meta-line">部首：<b>${this.esc(e.rad)}</b>　笔画：<b>${e.st}</b> 画　结构：<b>${this.esc(e.stc)}</b></div>
                    <div class="sz-words">组词：${e.w.map(w => `<span class="sz-word">${this.esc(w)}</span>`).join('')}</div>
                </div>
            </div>
            <div class="card sq-box">
                <p class="sq-tip">逐笔书写动画。配色：<b style="color:#c4c9d4">灰</b>=未写 · <b style="color:#e53935">红</b>=正在写 · <b style="color:#1f2330">黑</b>=已完成。</p>
                <div class="sq-main">
                    <div class="sq-canvas">
                        <div class="sq-grid-toggle">
                            <span class="sq-gt ${sq.grid === 'tian' ? 'on' : ''}" data-g="tian">田字格</span>
                            <span class="sq-gt ${sq.grid === 'mi' ? 'on' : ''}" data-g="mi">米字格</span>
                        </div>
                        <div class="sq-svg-wrap"><svg id="sqSvg" viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet"></svg></div>
                        <div class="sq-controls">
                            <button class="btn btn-outline sq-ctrl" id="sqPrev">◀ 上一笔</button>
                            <button class="btn btn-outline sq-ctrl" id="sqNext">下一笔 ▶</button>
                            <button class="btn btn-primary sq-ctrl" id="sqPlay">▶ 自动播放</button>
                            <button class="btn btn-outline sq-ctrl" id="sqReset">↺ 重置</button>
                        </div>
                        <div class="sq-speed">
                            <span>速度</span>
                            <input type="range" id="sqSpeed" min="1" max="10" value="${sq.speed}">
                        </div>
                    </div>
                    <div class="sq-info" id="sqInfo">
                        <div class="sq-info-empty">加载笔顺中…</div>
                    </div>
                </div>
            </div>
        </div>`;
        document.getElementById('main-content').innerHTML = html;

        document.getElementById('szPrevChar').onclick = () => {
            const i = (this._sz && this._sz.idx) || 0;
            const cs = (this._sz && this._sz.chars) || [];
            if (i > 0) { this._sz.idx = i - 1; this.navigateSubReplace(() => this.renderShengziDetail(cs[i - 1])); }
        };
        document.getElementById('szNextChar').onclick = () => {
            const i = (this._sz && this._sz.idx) || 0;
            const cs = (this._sz && this._sz.chars) || [];
            if (i < cs.length - 1) { this._sz.idx = i + 1; this.navigateSubReplace(() => this.renderShengziDetail(cs[i + 1])); }
        };
        document.getElementById('szAudio').onclick = () => {
            if (window.TTS && TTS.synth) { TTS.speak(char, 'zh-CN', 0.8); }
            else { this.showToast('当前设备不支持语音朗读'); }
        };
        document.querySelectorAll('.sq-gt').forEach(el => {
            el.onclick = () => {
                if (this._sq.animating) return;
                this._sq.grid = el.dataset.g;
                document.querySelectorAll('.sq-gt').forEach(x => x.classList.toggle('on', x.dataset.g === this._sq.grid));
                this.sqDraw();
            };
        });
        document.getElementById('sqPrev').onclick = () => this.sqPrev();
        document.getElementById('sqNext').onclick = () => this.sqNext();
        document.getElementById('sqPlay').onclick = () => this.sqPlay();
        document.getElementById('sqReset').onclick = () => this.sqReset();
        document.getElementById('sqSpeed').oninput = ev => { this._sq.speed = +ev.target.value; };

        this.showToast('查询笔顺中…', 800);
        loadHanziData(char).then(data => {
            if (!data) { document.getElementById('sqInfo').innerHTML = '<div class="sq-info-empty">未找到「' + char + '」的笔顺数据（请检查网络连接后重试）</div>'; return; }
            const s = this._sq;
            s.char = data.char;
            s.source = data.source || 'remote';
            s.strokes = data.medians || [];
            s.outlines = data.outlines || [];
            s.names = data.names;
            s.order = data.order || '';
            s.count = data.count;
            s.drawn = 0;
            s.playing = false;
            s.animating = false;
            this.sqDraw();
            this.sqPlay();
        }).catch(() => this.showToast('查询失败，请重试'));
    },

    // ========================================================
    // 看图写话扩句法（学习工具）
    // ========================================================
    renderKantu() {
        const data = window.KANTU_DATA || [];
        let html = `<h1 class="page-title">看图写话扩句法</h1>
            <div class="kt-cat-grid">`;
        data.forEach(cat => {
            html += `<div class="kt-cat-card" data-key="${this.esc(cat.key)}">
                <div class="kt-cat-name">${this.esc(cat.name)}</div>
                <div class="kt-cat-meta">${cat.themes.length} 个主题</div>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.kt-cat-card').forEach(c => {
            c.onclick = () => this.navigateSub(() => this.renderKantuCategory(c.dataset.key));
        });
    },

    renderKantuCategory(key) {
        const data = window.KANTU_DATA || [];
        const cat = data.find(c => c.key === key);
        if (!cat) return;
        this._kantuCat = key;
        let html = `<div class="kt-grade-head">
                <h1 class="page-title kt-grade-title">${this.esc(cat.name)}</h1>
            </div>
            <div class="kt-theme-grid">`;
        cat.themes.forEach((t, i) => {
            html += `<div class="kt-theme-tile" data-i="${i}">
                <div class="kt-theme-title">${this.esc(t.title)}</div>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.kt-theme-tile').forEach(t => {
            t.onclick = () => this.navigateSub(() => this.renderKantuTheme(cat.themes[+t.dataset.i]));
        });
    },

    renderKantuTheme(theme) {
        const steps = theme.steps || [];
        let html = `<div class="kt-detail">
            <h1 class="page-title kt-detail-title">${this.esc(theme.title)}</h1>
            <div class="kt-steps">
                ${steps.map((s, idx) => `
                    <div class="kt-step-row" data-step="${idx}">
                        <div class="kt-step-head">
                            <span class="kt-step-label">${this.esc(s.label)}${s.sub ? '（' + this.esc(s.sub) + '）' : ''}</span>
                            <button class="kt-reveal-btn" data-step="${idx}">👀 点击查看答案</button>
                        </div>
                        <div class="kt-step-text" id="ktText-${idx}" style="display:none;">${this.esc(s.text)}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
        document.getElementById('main-content').innerHTML = html;

        document.querySelectorAll('.kt-reveal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = document.getElementById('ktText-' + btn.dataset.step);
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    btn.textContent = '🙈 隐藏答案';
                    btn.classList.add('revealed');
                } else {
                    panel.style.display = 'none';
                    btn.textContent = '👀 点击查看答案';
                    btn.classList.remove('revealed');
                }
            });
        });
    },

    // ========================================================
    // 问答百科（学习工具）
    // ========================================================
    renderQaEncyclopedia() {
        const data = window.QA_ENCYCLOPEDIA || [];
        let html = `<h1 class="page-title">💡 问答百科</h1>
            <p class="qa-lead">点击分类，查看有趣的百科小问题。先想一想，再点「👀 点击查看答案」揭晓答案。</p>
            <div class="qa-cat-grid">`;
        data.forEach((cat, idx) => {
            html += `<div class="qa-cat-card" data-idx="${idx}">
                <div class="qa-cat-emoji">${this.esc(cat.emoji)}</div>
                <div class="qa-cat-name">${this.esc(cat.name)}</div>
                <div class="qa-cat-meta">${cat.items.length} 问</div>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.qa-cat-card').forEach(c => {
            c.onclick = () => this.navigateSub(() => this.renderQaEncyclopediaCategory(+c.dataset.idx));
        });
    },

    renderQaEncyclopediaCategory(idx) {
        const data = window.QA_ENCYCLOPEDIA || [];
        const cat = data[idx];
        if (!cat) return;
        this._qaCatIdx = idx;
        let html = `<div class="qa-cat-head">
                <h1 class="page-title qa-cat-title">${this.esc(cat.emoji)} ${this.esc(cat.name)}</h1>
                <div class="qa-cat-sub">共 ${cat.items.length} 问，点击问题揭晓答案</div>
            </div>
            <div class="qa-list">`;
        cat.items.forEach((item, i) => {
            html += `<div class="qa-item" data-i="${i}">
                <div class="qa-row">
                    <span class="qa-index">${i + 1}.</span>
                    <span class="qa-question">${this.esc(item.q)}</span>
                    <button class="qa-reveal-btn" data-i="${i}">👀 点击查看答案</button>
                </div>
                <div class="qa-answer" id="qaAns-${i}" style="display:none;">${this.esc(item.a)}</div>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;

        document.querySelectorAll('.qa-reveal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = document.getElementById('qaAns-' + btn.dataset.i);
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    btn.textContent = '🙈 隐藏答案';
                    btn.classList.add('revealed');
                } else {
                    panel.style.display = 'none';
                    btn.textContent = '👀 点击查看答案';
                    btn.classList.remove('revealed');
                }
            });
        });
    },

    // ========================================================
    // 小学生古诗 75 首（学习工具）
    // ========================================================
    renderPoemsHome() {
        const poems = window.POEMS_75 || [];
        let html = `<h1 class="page-title">📜 小学生古诗 75首</h1>
            <p class="poem-lead">点击标题，查看古诗全文与作者。</p>
            <div class="poem-grid">`;
        poems.forEach(p => {
            html += `<div class="poem-card" data-num="${p.num}">
                <span class="poem-num">${p.num}</span>
                <span class="poem-name">${this.esc(p.title)}</span>
                <span class="poem-go">›</span>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('main-content').innerHTML = html;
        document.querySelectorAll('.poem-card').forEach(c => {
            c.onclick = () => this.navigateSub(() => this.renderPoemDetail(+c.dataset.num));
        });
    },

    renderPoemDetail(num, autoplay) {
        const poems = window.POEMS_75 || [];
        const poem = poems.find(p => p.num === num);
        if (!poem) return;
        this._curPoem = poem;
        this._poemReadLabel = '🔊 朗读';
        // 顶部固定「上一首/下一首」：在 75 首古诗顺序翻页
        const poemIdx = poems.findIndex(p => p.num === num);
        const poemTotal = poems.length;
        const poemPrev = poemIdx > 0 ? poems[poemIdx - 1] : null;
        const poemNext = (poemIdx >= 0 && poemIdx < poemTotal - 1) ? poems[poemIdx + 1] : null;
        const lines = poem.content.split('\n').map(l => `<p class="poem-line">${this.esc(l)}</p>`).join('');
        const hasAudio = !!poem.audio;
        const isQtfm = hasAudio && typeof poem.audio === 'string' && poem.audio.indexOf('qtfm:') === 0;
        const audioTag = hasAudio ? `<audio id="poemAudio" preload="none"${isQtfm ? '' : ` src="${this.esc(poem.audio)}"`}></audio>` : '';
        const fmt = s => this.esc((s || '').trim()).replace(/\n/g, '<br>');
        const yiwen = fmt(poem.yiwen);
        const zhushi = fmt(poem.zhushi);
        const shangxi = fmt(poem.shangxi);
        const loopOn = !!this._poemLoop;
        const html = `<div class="pg-pager">
                <button class="pg-pager-btn" id="pgPrev"${poemPrev ? '' : ' disabled'}>⬅ 上一首</button>
                <span class="pg-pager-count">${Math.max(poemIdx + 1, 1)} / ${poemTotal}</span>
                <button class="pg-pager-btn" id="pgNext"${poemNext ? '' : ' disabled'}>下一首 ➡</button>
            </div>
            <div class="poem-detail">
            <h1 class="poem-detail-title">${this.esc(poem.title)}</h1>
            <div class="poem-detail-author">${this.esc(poem.author)}</div>
            <div class="poem-detail-body">${lines}</div>
            <div class="poem-detail-actions">
                <button class="poem-audio-btn" id="poemReadBtn">${this._poemReadLabel}</button>
                <button class="poem-loop-btn${loopOn ? ' active' : ''}" id="poemLoopBtn">🔁 循环${loopOn ? '中' : ''}</button>
            </div>
            ${audioTag}
            <div class="poem-fields">
                <div class="poem-field-tabs" role="tablist">
                    <button class="poem-field-tab active" data-field="yiwen" role="tab">译文</button>
                    <button class="poem-field-tab" data-field="zhushi" role="tab">注释</button>
                    <button class="poem-field-tab" data-field="shangxi" role="tab">赏析</button>
                </div>
                <div class="poem-field-panel active" data-field="yiwen"><p>${yiwen || '（暂无）'}</p></div>
                <div class="poem-field-panel" data-field="zhushi"><p>${zhushi || '（暂无）'}</p></div>
                <div class="poem-field-panel" data-field="shangxi"><p>${shangxi || '（暂无）'}</p></div>
            </div>
        </div>`;
        document.getElementById('main-content').innerHTML = html;
        const readBtn = document.getElementById('poemReadBtn');
        const loopBtn = document.getElementById('poemLoopBtn');
        if (readBtn) readBtn.onclick = () => this._togglePoemPlay(poem);
        if (loopBtn) loopBtn.onclick = () => {
            this._poemLoop = !this._poemLoop;
            loopBtn.textContent = '🔁 循环' + (this._poemLoop ? '中' : '');
            loopBtn.classList.toggle('active', this._poemLoop);
        };
        const tabBtns = document.querySelectorAll('.poem-field-tab');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const field = btn.dataset.field;
                tabBtns.forEach(b => b.classList.toggle('active', b === btn));
                document.querySelectorAll('.poem-field-panel').forEach(p => {
                    p.classList.toggle('active', p.dataset.field === field);
                });
            });
        });
        if (autoplay) this._startPoemPlay(poem);

        // 上一首 / 下一首（原地切换，不压栈；切换时停止朗读）
        const goPoem = (p) => { if (!p) return; this._stopPoemAudio(); this.renderPoemDetail(p.num); window.scrollTo(0, 0); };
        const pv = document.getElementById('pgPrev');
        if (pv && poemPrev) pv.onclick = () => goPoem(poemPrev);
        const nx = document.getElementById('pgNext');
        if (nx && poemNext) nx.onclick = () => goPoem(poemNext);
    },

    _togglePoemPlay(poem) {
        if (this._poemPlaying === poem.num) {
            this._stopPoemAudio();
        } else {
            this._startPoemPlay(poem);
        }
    },

    _startPoemPlay(poem) {
        this._poemPlaying = poem.num;
        const btn = document.getElementById('poemReadBtn');
        if (btn) { btn.textContent = '⏸ 停止'; btn.classList.add('playing'); }
        this._playPoemAudio(poem);
    },

    _playPoemAudio(poem) {
        const isQtfm = poem.audio && typeof poem.audio === 'string' && poem.audio.indexOf('qtfm:') === 0;
        const hasAudio = !!poem.audio;
        const au = document.getElementById('poemAudio');
        const done = () => this._afterPoemAudio(poem);
        if (au) {
            au.onended = done;
            if (isQtfm) {
                try { au.src = this._resolveQtfmAudio(poem.audio); au.currentTime = 0; } catch (e) {}
                au.play().catch(() => this._poemTTS(poem, done));
                return;
            }
            if (hasAudio) {
                try { au.currentTime = 0; } catch (e) {}
                au.play().catch(() => this._poemTTS(poem, done));
                return;
            }
        }
        this._poemTTS(poem, done);
    },

    _afterPoemAudio(poem) {
        this._poemPlaying = null;
        const btn = document.getElementById('poemReadBtn');
        if (btn) { btn.textContent = this._poemReadLabel || '🔊 朗读'; btn.classList.remove('playing'); }
        if (this._poemLoop) {
            this._startPoemPlay(poem);
            return;
        }
        const poems = window.POEMS_75 || [];
        const next = poems.find(p => p.num === poem.num + 1);
        if (next) {
            this.navigateSubReplace(() => this.renderPoemDetail(next.num, true));
        }
    },

    _stopPoemAudio() {
        this._poemPlaying = null;
        const au = document.getElementById('poemAudio');
        if (au) { try { au.pause(); } catch (e) {} }
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
        if (window.TTS) { try { TTS.stop(); } catch (e) {} }
        const btn = document.getElementById('poemReadBtn');
        if (btn) { btn.textContent = this._poemReadLabel || '🔊 朗读'; btn.classList.remove('playing'); }
    },
    _qtfmAudioUrl(pid) {
        const CHANNEL = 476913;
        const ts = Date.now();
        const q = 'access_token=&device_id=MOBILESITE&qingting_id=&t=' + ts;
        const s = '/audiostream/redirect/' + CHANNEL + '/' + pid + '?' + q;
        const sign = this._qtfmHmac(s);
        return 'https://audio.qtfm.cn' + s + '&sign=' + sign;
    },
    // 解析 qtfm 音频：支持 "qtfm:<pid>"（默认频道476913）与 "qtfm:<cid>/<pid>"（任意频道）
    _resolveQtfmAudio(audio) {
        const rest = audio.slice('qtfm:'.length);
        if (rest.indexOf('/') >= 0) {
            const parts = rest.split('/');
            return this._qtfmAudioUrlC(parts[0], parts[1]);
        }
        return this._qtfmAudioUrl(rest);
    },
    _qtfmHmac(s) {
        function safe_add(x,y){var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
        function rol(num,cnt){return (num<<cnt)|(num>>>(32-cnt));}
        function cmn(q,a,b,x,s,t){return safe_add(rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}
        function ff(a,b,c,d,x,s,t){return cmn((b&c)|((~b)&d),a,b,x,s,t);}
        function gg(a,b,c,d,x,s,t){return cmn((b&d)|(c&(~d)),a,b,x,s,t);}
        function hh(a,b,c,d,x,s,t){return cmn(b^c^d,a,b,x,s,t);}
        function ii(a,b,c,d,x,s,t){return cmn(c^(b|(~d)),a,b,x,s,t);}
        function md5(str){
          var x=[];for(var i=0;i<str.length;i++) x.push(str.charCodeAt(i));
          var len=x.length;
          var a=1732584193,b=-271733879,c=-1732584194,d=271733878;
          var nblk=((len+8)>>6)+1;
          var blks=new Array(nblk*16);for(var i=0;i<blks.length;i++) blks[i]=0;
          for(var i=0;i<len;i++) blks[i>>2]|=x[i]<<((i%4)*8);
          blks[len>>2]|=0x80<<((len%4)*8);
          blks[nblk*16-2]=len*8;
          for(var i=0;i<nblk*16;i+=16){
            var oa=a,ob=b,oc=c,od=d;
            a=ff(a,b,c,d,blks[i+0],7,-680876936);d=ff(d,a,b,c,blks[i+1],12,-389564586);c=ff(c,d,a,b,blks[i+2],17,606105819);b=ff(b,c,d,a,blks[i+3],22,-1044525330);
            a=ff(a,b,c,d,blks[i+4],7,-176418897);d=ff(d,a,b,c,blks[i+5],12,1200080426);c=ff(c,d,a,b,blks[i+6],17,-1473231341);b=ff(b,c,d,a,blks[i+7],22,-45705983);
            a=ff(a,b,c,d,blks[i+8],7,1770035416);d=ff(d,a,b,c,blks[i+9],12,-1958414417);c=ff(c,d,a,b,blks[i+10],17,-42063);b=ff(b,c,d,a,blks[i+11],22,-1990404162);
            a=ff(a,b,c,d,blks[i+12],7,1804603682);d=ff(d,a,b,c,blks[i+13],12,-40341101);c=ff(c,d,a,b,blks[i+14],17,-1502002290);b=ff(b,c,d,a,blks[i+15],22,1236535329);
            a=gg(a,b,c,d,blks[i+1],5,-165796510);d=gg(d,a,b,c,blks[i+6],9,-1069501632);c=gg(c,d,a,b,blks[i+11],14,643717713);b=gg(b,c,d,a,blks[i+0],20,-373897302);
            a=gg(a,b,c,d,blks[i+5],5,-701558691);d=gg(d,a,b,c,blks[i+10],9,38016083);c=gg(c,d,a,b,blks[i+15],14,-660478335);b=gg(b,c,d,a,blks[i+4],20,-405537848);
            a=gg(a,b,c,d,blks[i+9],5,568446438);d=gg(d,a,b,c,blks[i+14],9,-1019803690);c=gg(c,d,a,b,blks[i+3],14,-187363961);b=gg(b,c,d,a,blks[i+8],20,1163531501);
            a=gg(a,b,c,d,blks[i+13],5,-1444681467);d=gg(d,a,b,c,blks[i+2],9,-51403784);c=gg(c,d,a,b,blks[i+7],14,1735328473);b=gg(b,c,d,a,blks[i+12],20,-1926607734);
            a=hh(a,b,c,d,blks[i+5],4,-378558);d=hh(d,a,b,c,blks[i+8],11,-2022574463);c=hh(c,d,a,b,blks[i+11],16,1839030562);b=hh(b,c,d,a,blks[i+14],23,-35309556);
            a=hh(a,b,c,d,blks[i+1],4,-1530992060);d=hh(d,a,b,c,blks[i+4],11,1272893353);c=hh(c,d,a,b,blks[i+7],16,-155497632);b=hh(b,c,d,a,blks[i+10],23,-1094730640);
            a=hh(a,b,c,d,blks[i+13],4,681279174);d=hh(d,a,b,c,blks[i+0],11,-358537222);c=hh(c,d,a,b,blks[i+3],16,-722521979);b=hh(b,c,d,a,blks[i+6],23,76029189);
            a=hh(a,b,c,d,blks[i+9],4,-640364487);d=hh(d,a,b,c,blks[i+12],11,-421815835);c=hh(c,d,a,b,blks[i+15],16,530742520);b=hh(b,c,d,a,blks[i+2],23,-995338651);
            a=ii(a,b,c,d,blks[i+0],6,-198630844);d=ii(d,a,b,c,blks[i+7],10,1126891415);c=ii(c,d,a,b,blks[i+14],15,-1416354905);b=ii(b,c,d,a,blks[i+5],21,-57434055);
            a=ii(a,b,c,d,blks[i+12],6,1700485571);d=ii(d,a,b,c,blks[i+3],10,-1894986606);c=ii(c,d,a,b,blks[i+10],15,-1051523);b=ii(b,c,d,a,blks[i+1],21,-2054922799);
            a=ii(a,b,c,d,blks[i+8],6,1873313359);d=ii(d,a,b,c,blks[i+15],10,-30611744);c=ii(c,d,a,b,blks[i+6],15,-1560198380);b=ii(b,c,d,a,blks[i+13],21,1309151649);
            a=ii(a,b,c,d,blks[i+4],6,-145523070);d=ii(d,a,b,c,blks[i+11],10,-1120210379);c=ii(c,d,a,b,blks[i+2],15,718787259);b=ii(b,c,d,a,blks[i+9],21,-343485551);
            a=safe_add(a,oa);b=safe_add(b,ob);c=safe_add(c,oc);d=safe_add(d,od);
          }
          function toHex(n){var s='';for(var i=0;i<4;i++){var v=(n>>>(i*8))&0xFF;s+=('0'+v.toString(16)).slice(-2);}return s;}
          return toHex(a)+toHex(b)+toHex(c)+toHex(d);
        }
        function bytesOf(str){var b=[];for(var i=0;i<str.length;i++)b.push(str.charCodeAt(i)&0xff);return b;}
        function strOf(bytes){var s='';for(var i=0;i<bytes.length;i++)s+=String.fromCharCode(bytes[i]&0xff);return s;}
        function hexToBytes(h){var b=[];for(var i=0;i<h.length;i+=2)b.push(parseInt(h.substr(i,2),16));return b;}
        var k=bytesOf('7l8CZ)SgZgM_bkrw');
        if(k.length>64) k=hexToBytes(md5('7l8CZ)SgZgM_bkrw'));
        var kp=new Array(64); for(var i=0;i<64;i++) kp[i]=(i<k.length?k[i]:0);
        var ipad=new Array(64), opad=new Array(64);
        for(var i=0;i<64;i++){ipad[i]=kp[i]^0x36; opad[i]=kp[i]^0x5c;}
        var m=bytesOf(s);
        var innerHash=hexToBytes(md5(strOf(ipad.concat(m))));
        return md5(strOf(opad.concat(innerHash)));
    },
    _poemTTS(poem, done) {
        try {
            const content = (poem.content || '').replace(/\n/g, '。').trim();
            if (!content) { if (done) done(); return; }
            // 走统一情感化朗读通道：分句 + 语调起伏 + 自然停顿
            TTS.speak(content, 'zh-CN', 0.82, { onEnd: done });
        } catch (e) {
            this.toast('当前浏览器不支持朗读');
        }
    },

    // ========================================================

    // ========================================================
    // 成语故事（学习工具）
    //   蜻蜓FM 音频；点击播放 / 再点暂停；不自动播放；离开本页停止
    //   按网页顺序去重（重复成语仅保留首次）
    // ========================================================
    renderIdiomsHome() {
        this._stopIdiomAudio();
        const list = window.IDIOMS || [];
        const html = `<h1 class="page-title">📚 成语故事</h1>
            <p class="idiom-lead">点击任意成语查看详情（出处、释义、例句、典故），在详情页可播放音频。</p>
            <div class="idiom-search">
                <span class="idiom-search-icon">🔍</span>
                <input type="search" id="idiomSearch" class="idiom-search-input" placeholder="搜索成语，如：纸上谈兵" />
            </div>
            <p class="idiom-note" id="idiomNote"></p>
            <div class="idiom-grid" id="idiomGrid"></div>`;
        document.getElementById('main-content').innerHTML = html;
        const input = document.getElementById('idiomSearch');
        input.addEventListener('input', () => this.renderIdiomList(input.value.trim()));
        this.renderIdiomList('');
    },

    renderIdiomList(kw) {
        const list = window.IDIOMS || [];
        const norm = s => (s || '').replace(/[^\u4e00-\u9fff]/g, ''); // 仅保留汉字用于匹配（忽略标点/空格）
        const k = norm(kw);
        const grid = document.getElementById('idiomGrid');
        const note = document.getElementById('idiomNote');
        const matched = k ? list.filter(it => norm(it.name).includes(k)) : list;
        if (note) {
            note.textContent = k
                ? `找到 ${matched.length} 个匹配结果`
                : `共 ${list.length} 个成语（已按来源顺序去重）`;
        }
        if (!matched.length) {
            grid.innerHTML = `<div class="idiom-empty">没有找到「${this.esc(kw)}」相关的成语</div>`;
            return;
        }
        let html = '';
        matched.forEach(it => {
            html += `<div class="idiom-card" data-name="${this.esc(it.name)}">
                <span class="idiom-num">${it.num}</span>
                <span class="idiom-name">${this.esc(it.name)}</span>
                <span class="idiom-arrow">›</span>
            </div>`;
        });
        grid.innerHTML = html;
        grid.querySelectorAll('.idiom-card').forEach(c => {
            c.onclick = () => {
                const name = c.dataset.name;
                const item = list.find(x => x.name === name);
                if (item) this.navigateSub(() => this.renderIdiomDetail(item));
            };
        });
    },

    renderIdiomDetail(item, autoplay) {
        this._stopIdiomAudio();
        this._curIdiom = item;
        const clean = s => (s || '').toString().replace(/_x000D_|x000D_|\r/g, '');
        const safe = s => this.esc(clean(s).trim());
        const fmt = s => safe(s).replace(/\n/g, '<br>');
        const meaning = item.meaning || item.explanation || item.interpretation || '';
        const example = item.example || item.sentence || '';
        const story = item.story || item.anecdote || item.annotate || '';
        const hasAudio = item.cid && item.pid;
        const loopOn = !!this._idiomLoop;
        // 顶部固定「上一个/下一个」：在成语列表顺序翻页
        const idiomList = window.IDIOMS || [];
        const idiomIdx = idiomList.findIndex(x => x.name === item.name);
        const idiomTotal = idiomList.length;
        const idiomPrev = idiomIdx > 0 ? idiomList[idiomIdx - 1] : null;
        const idiomNext = (idiomIdx >= 0 && idiomIdx < idiomTotal - 1) ? idiomList[idiomIdx + 1] : null;
        const html = `<div class="pg-pager">
                <button class="pg-pager-btn" id="pgPrev"${idiomPrev ? '' : ' disabled'}>⬅ 上一个</button>
                <span class="pg-pager-count">${Math.max(idiomIdx + 1, 1)} / ${idiomTotal}</span>
                <button class="pg-pager-btn" id="pgNext"${idiomNext ? '' : ' disabled'}>下一个 ➡</button>
            </div>
            <div class="idiom-detail">
            <div class="idiom-detail-header">
                <div class="idiom-detail-title">${safe(item.name)}</div>
                ${hasAudio ? `<button class="idiom-detail-play" id="idiomDetailPlay" data-cid="${item.cid}" data-pid="${item.pid}">🔊 朗读</button>` : ''}
                ${hasAudio ? `<button class="idiom-detail-loop${loopOn ? ' active' : ''}" id="idiomLoopBtn">🔁 循环${loopOn ? '中' : ''}</button>` : ''}
            </div>
            <div class="idiom-detail-cards">
                <div class="idiom-detail-card">
                    <div class="idiom-detail-label">📖 释义</div>
                    <div class="idiom-detail-body">${meaning ? fmt(meaning) : '<span class="idiom-detail-empty">暂无释义</span>'}</div>
                </div>
                <div class="idiom-detail-card">
                    <div class="idiom-detail-label">✏️ 造句</div>
                    <div class="idiom-detail-body">${example ? fmt(example) : '<span class="idiom-detail-empty">暂无造句</span>'}</div>
                </div>
            </div>
            <div class="idiom-detail-story">
                <div class="idiom-detail-story-title">📜 典故</div>
                <div class="idiom-detail-story-body">${story ? fmt(story) : '<span class="idiom-detail-empty">暂无典故</span>'}</div>
            </div>
        </div>`;
        document.getElementById('main-content').innerHTML = html;
        const btn = document.getElementById('idiomDetailPlay');
        const loopBtn = document.getElementById('idiomLoopBtn');
        if (btn) btn.onclick = () => this._toggleIdiomPlay(btn);
        if (loopBtn) loopBtn.onclick = () => {
            this._idiomLoop = !this._idiomLoop;
            loopBtn.textContent = '🔁 循环' + (this._idiomLoop ? '中' : '');
            loopBtn.classList.toggle('active', this._idiomLoop);
        };
        window.scrollTo(0, 0);
        if (autoplay) this._startIdiomPlay(item);

        // 上一个 / 下一个（原地切换，不压栈）
        const pv = document.getElementById('pgPrev');
        if (pv && idiomPrev) pv.onclick = () => { this._stopIdiomAudio(); this.renderIdiomDetail(idiomPrev); };
        const nx = document.getElementById('pgNext');
        if (nx && idiomNext) nx.onclick = () => { this._stopIdiomAudio(); this.renderIdiomDetail(idiomNext); };
    },

    _toggleIdiomPlay(btn) {
        const cid = +btn.dataset.cid, pid = +btn.dataset.pid;
        const key = cid + '-' + pid;
        const au = this._idiomAudio || (this._idiomAudio = new Audio());
        if (this._idiomPlaying === key && !au.paused) {
            au.pause();
            btn.textContent = '🔊 朗读';
            btn.classList.remove('playing');
            this._idiomPlaying = null;
            return;
        }
        this._startIdiomPlay(this._curIdiom, btn);
    },

    _startIdiomPlay(item, btn) {
        const au = this._idiomAudio || (this._idiomAudio = new Audio());
        const b = btn || document.getElementById('idiomDetailPlay');
        const key = item.cid + '-' + item.pid;
        try { au.src = this._qtfmAudioUrlC(item.cid, item.pid); } catch (e) {}
        const playPromise = au.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {});
        if (b) { b.textContent = '⏸ 停止'; b.classList.add('playing'); }
        this._idiomPlaying = key;
        au.onended = () => this._afterIdiomAudio(item);
    },

    _afterIdiomAudio(item) {
        const b = document.getElementById('idiomDetailPlay');
        if (b) { b.textContent = '🔊 朗读'; b.classList.remove('playing'); }
        this._idiomPlaying = null;
        if (this._idiomLoop) {
            this._startIdiomPlay(item);
            return;
        }
        const list = window.IDIOMS || [];
        const idx = list.findIndex(x => x.name === item.name);
        const next = idx >= 0 ? list[idx + 1] : null;
        if (next) {
            this.navigateSubReplace(() => this.renderIdiomDetail(next, true));
        }
    },

    _qtfmAudioUrlC(cid, pid) {
        const ts = Date.now();
        const q = 'access_token=&device_id=MOBILESITE&qingting_id=&t=' + ts;
        const s = '/audiostream/redirect/' + cid + '/' + pid + '?' + q;
        const sign = this._qtfmHmac(s);
        return 'https://audio.qtfm.cn' + s + '&sign=' + sign;
    },

    _stopIdiomAudio() {
        if (this._idiomAudio) { try { this._idiomAudio.pause(); } catch (e) {} }
        this._idiomPlaying = null;
        document.querySelectorAll('.idiom-card.playing').forEach(el => {
            el.classList.remove('playing');
            const p = el.querySelector('.idiom-play'); if (p) p.textContent = '▶';
        });
        const dbtn = document.getElementById('idiomDetailPlay');
        if (dbtn) {
            dbtn.textContent = '🔊 朗读';
            dbtn.classList.remove('playing');
        }
    },

    // 统一停止所有音频（成语 HTML5 Audio / 古诗 audio 元素 / 语音合成 TTS）
    // 在每次导航、返回、切换顶层页面时调用，确保退出界面即停止播放
    _stopAllAudio() {
        // 世界上下五千年（蜻蜓FM 连播）
        if (this._whAudio) { try { this._whAudio.pause(); this._whAudio.onended = null; } catch (e) {} }
        this._whCurrentIdx = null;
        // 成语音频
        if (this._idiomAudio) { try { this._idiomAudio.pause(); } catch (e) {} }
        this._idiomPlaying = null;
        const dib = document.getElementById('idiomDetailPlay');
        if (dib) { dib.textContent = '🔊 朗读'; dib.classList.remove('playing'); }
        document.querySelectorAll('.idiom-card.playing').forEach(el => {
            el.classList.remove('playing');
            const p = el.querySelector('.idiom-play'); if (p) p.textContent = '▶';
        });
        // 古诗 audio 元素
        const pa = document.getElementById('poemAudio');
        if (pa) { try { pa.pause(); } catch (e) {} }
        this._poemPlaying = null;
        const prb = document.getElementById('poemReadBtn');
        if (prb) { prb.classList.remove('playing'); }
        // 语音合成（古诗 TTS 兜底 / 测评提示）：退出即停止（含分句朗读链）
        try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
        if (window.TTS) { try { TTS.stop(); } catch (e) {} }
        // 语文课文朗读
        this._stopCnTextAudio();
        // 英文儿歌 Blob 视频（iOS 用）释放
        if (this._songBlobUrl) { try { URL.revokeObjectURL(this._songBlobUrl); } catch (e) {} this._songBlobUrl = null; }
        // 课文内嵌视频 Blob（iOS 用）释放
        if (this._textReaderBlobUrl) { try { URL.revokeObjectURL(this._textReaderBlobUrl); } catch (e) {} this._textReaderBlobUrl = null; }
        // 英语课文音频：暂停所有原生 audio 并释放 Blob
        document.querySelectorAll('.eng-audio-el').forEach(a => { try { a.pause(); } catch (e) {} });
        if (this._engAudioBlobUrls && this._engAudioBlobUrls.length) {
            this._engAudioBlobUrls.forEach(b => { try { URL.revokeObjectURL(b); } catch (e) {} });
            this._engAudioBlobUrls = [];
        }
    },

    // ========================================================
    // 国际音标 48 个（学习工具）
    //   认识音标 → 听标准音 → 跟读练习 → 自我检测
    //   数据来源 https://www.yyybabc.com （发音为该站预置 .aac）
    // ========================================================
    getPhoneticsAll() {
        const groups = (window.PHONETICS && window.PHONETICS.groups) || [];
        const all = [];
        groups.forEach(g => g.items.forEach(it => all.push(Object.assign({ group: g.name, kind: g.kind }, it))));
        return all;
    },

    phShuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
    },

    // 播放音标/单词音频（预置 .aac），失败则回退到 TTS 朗读单词
    phPlay(url, fallback) {
        if (url) {
            const a = new Audio(url);
            a.play().catch(() => { if (fallback) TTS.speakEnglish(fallback); });
        } else if (fallback) {
            TTS.speakEnglish(fallback);
        }
    },

    renderPhoneticsHome() {
        const groups = (window.PHONETICS && window.PHONETICS.groups) || [];
        let html = `<h1 class="page-title">🗣️ 国际音标 48个</h1>
            <div class="ph-path">
                <span class="ph-step">① 认识音标</span><span class="ph-arrow">→</span>
                <span class="ph-step">② 听标准音</span><span class="ph-arrow">→</span>
                <span class="ph-step">③ 跟读练习</span><span class="ph-arrow">→</span>
                <span class="ph-step">④ 自我检测</span>
            </div>
            <div class="ph-actions">
                <button class="btn btn-primary" id="phQuizBtn">📝 开始练习自测（5题）</button>
            </div>`;
        groups.forEach(g => {
            html += `<div class="ph-group">
                <div class="ph-group-head">
                    <span class="ph-group-name">${this.esc(g.name)}</span>
                    <span class="ph-group-kind">${this.esc(g.kind)}</span>
                    <span class="ph-group-count">${g.items.length} 个</span>
                </div>
                <div class="ph-grid">`;
            g.items.forEach(it => {
                const fallback = (it.words && it.words[0]) ? it.words[0].w : '';
                const combos = (it.combos || []).map(c => `<span class="ph-combo">${this.esc(c)}</span>`).join('');
                html += `<div class="ph-card" data-sym="${this.esc(it.sym)}">
                    <div class="ph-card-top">
                        <span class="ph-sym">${this.esc(it.sym)}</span>
                        <button class="ph-play" data-audio="${this.esc(it.audio)}" data-fallback="${this.esc(fallback)}" title="听标准音">▶</button>
                    </div>
                    <div class="ph-combos">${combos}</div>
                    <div class="ph-card-foot">点击进入跟读练习 ›</div>
                </div>`;
            });
            html += `</div></div>`;
        });
        document.getElementById('main-content').innerHTML = html;

        document.querySelectorAll('.ph-play').forEach(b => {
            b.addEventListener('click', (e) => {
                e.stopPropagation();
                this.phPlay(b.dataset.audio, b.dataset.fallback);
            });
        });
        document.querySelectorAll('.ph-card').forEach(c => {
            c.addEventListener('click', () => this.navigateSub(() => this.renderPhoneticsDetail(c.dataset.sym)));
        });
        const qb = document.getElementById('phQuizBtn');
        if (qb) qb.addEventListener('click', () => this.navigateSub(() => this.renderPhoneticsQuiz()));
    },

    renderPhoneticsDetail(sym) {
        const all = this.getPhoneticsAll();
        const item = all.find(x => x.sym === sym);
        if (!item) return;
        const fallback = (item.words && item.words[0]) ? item.words[0].w : '';
        const combos = (item.combos || []).map(c => `<span class="ph-combo">${this.esc(c)}</span>`).join('');
        let html = `<div class="ph-detail">
            <div class="ph-detail-head">
                <button class="ph-back" onclick="App.navigateSub(()=>App.renderPhoneticsHome())">‹ 返回</button>
                <span class="ph-detail-kind">${this.esc(item.kind)} · ${this.esc(item.group)}</span>
            </div>
            <div class="ph-detail-sym-wrap">
                <span class="ph-detail-sym">${this.esc(item.sym)}</span>
                <button class="ph-big-play" id="phStdPlay" data-audio="${this.esc(item.audio)}" data-fallback="${this.esc(fallback)}">▶ 听标准音</button>
            </div>
            <div class="ph-tip"><span class="ph-tip-label">👄 口型 / 舌位</span>${this.esc(item.tip)}</div>
            <div class="ph-combos-row"><span class="ph-combos-label">常见字母组合：</span>${combos}</div>
            <div class="ph-sec-title">📚 例词</div>
            <div class="ph-words">`;
        (item.words || []).forEach(w => {
            html += `<div class="ph-word">
                <span class="ph-word-text">${this.esc(w.w)}</span>
                <span class="ph-word-ph">${this.esc(w.ph)}</span>
                <span class="ph-word-zh">${this.esc(w.zh)}</span>
                <button class="ph-word-play" data-audio="${this.esc(w.audio)}" data-fallback="${this.esc(w.w)}" title="听单词">🔊</button>
            </div>`;
        });
        html += `</div>
            <div class="ph-sec-title">🎤 跟读练习（对比）</div>
            <div class="ph-read">
                <div class="ph-read-btns">
                    <button class="btn btn-secondary" id="phRecBtn">🎤 开始跟读</button>
                    <button class="btn btn-outline" id="phRecPlayStd">🔊 再听标准音</button>
                </div>
                <div class="ph-read-status" id="phReadStatus">点击「开始跟读」，大声跟读这个音标，停止后即可对比标准音和你的发音。</div>
                <div class="ph-read-compare" id="phReadCompare" style="display:none;">
                    <div class="ph-read-col"><div class="ph-read-col-label">标准音</div><audio id="phStdAudio" controls preload="none" src="${this.esc(item.audio)}"></audio></div>
                    <div class="ph-read-col"><div class="ph-read-col-label">我的跟读</div><audio id="phMyAudio" controls></audio></div>
                </div>
            </div>
            <button class="btn btn-primary btn-block mt-16" id="phToQuiz">📝 去自我检测</button>
        </div>`;
        document.getElementById('main-content').innerHTML = html;

        document.getElementById('phStdPlay').addEventListener('click', () => this.phPlay(item.audio, fallback));
        document.getElementById('phRecPlayStd').addEventListener('click', () => this.phPlay(item.audio, fallback));
        document.querySelectorAll('.ph-word-play').forEach(b => b.addEventListener('click', () => this.phPlay(b.dataset.audio, b.dataset.fallback)));
        document.getElementById('phToQuiz').addEventListener('click', () => this.navigateSub(() => this.renderPhoneticsQuiz()));
        document.getElementById('phRecBtn').addEventListener('click', (e) => this.phToggleRecord(e.currentTarget, item));
    },

    phToggleRecord(btn, item) {
        if (this._phRecording) { this.phStopRecord(); return; }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showToast('当前浏览器不支持麦克风录音');
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this._phStream = stream;
            this._phChunks = [];
            let mr;
            try { mr = new MediaRecorder(stream); } catch (e) { this.showToast('录音初始化失败'); return; }
            this._phMr = mr;
            mr.ondataavailable = e => { if (e.data && e.data.size) this._phChunks.push(e.data); };
            mr.onstop = () => {
                const type = (this._phChunks[0] && this._phChunks[0].type) ? this._phChunks[0].type : 'audio/webm';
                const blob = new Blob(this._phChunks, { type });
                const url = URL.createObjectURL(blob);
                const myAudio = document.getElementById('phMyAudio');
                if (myAudio) myAudio.src = url;
                const cmp = document.getElementById('phReadCompare');
                if (cmp) cmp.style.display = 'flex';
                const st = document.getElementById('phReadStatus');
                if (st) st.textContent = '对比听一听：标准音 vs 你的跟读，哪里不一样就再练一次！';
                if (this._phStream) this._phStream.getTracks().forEach(t => t.stop());
                this._phRecording = false;
                btn.textContent = '🎤 开始跟读';
                btn.classList.remove('recording');
            };
            mr.start();
            this._phRecording = true;
            btn.textContent = '⏹ 停止跟读';
            btn.classList.add('recording');
            const st = document.getElementById('phReadStatus');
            if (st) st.textContent = '正在录音…大声跟读这个音标吧！';
        }).catch(err => {
            this.showToast('无法使用麦克风：' + (err && err.message ? err.message : err.name));
        });
    },

    phStopRecord() {
        if (this._phMr && this._phMr.state && this._phMr.state !== 'inactive') {
            try { this._phMr.stop(); } catch (e) {}
        }
    },

    renderPhoneticsQuiz() {
        const all = this.getPhoneticsAll();
        if (all.length < 4) { this.showToast('音标数据不足'); return; }
        const questions = [];
        for (let i = 0; i < 5; i++) {
            const target = all[Math.floor(Math.random() * all.length)];
            const fallback = (target.words && target.words[0]) ? target.words[0].w : '';
            if (Math.random() < 0.5) {
                const opts = [target];
                while (opts.length < 4) {
                    const c = all[Math.floor(Math.random() * all.length)];
                    if (!opts.find(o => o.sym === c.sym)) opts.push(c);
                }
                this.phShuffle(opts);
                questions.push({ type: 'listen', target, prompt: '听发音，选出正确的音标符号', options: opts.map(o => o.sym), answer: target.sym, audio: target.audio, fallback });
            } else {
                const correctWord = (target.words && target.words[0]) ? target.words[0] : null;
                if (!correctWord) {
                    const opts = [target];
                    while (opts.length < 4) { const c = all[Math.floor(Math.random() * all.length)]; if (!opts.find(o => o.sym === c.sym)) opts.push(c); }
                    this.                    this.phShuffle(opts);
                    questions.push({ type: 'listen', target, prompt: '听发音，选出正确的音标符号', options: opts.map(o => o.sym), answer: target.sym, audio: target.audio, fallback });
                    continue;
                }
                const opts = [{ label: correctWord.w, correct: true }];
                const others = [];
                all.forEach(x => (x.words || []).forEach(w => { if (w.w !== correctWord.w) others.push(w.w); }));
                this.phShuffle(others);
                for (let k = 0; k < 3 && k < others.length; k++) opts.push({ label: others[k], correct: false });
                this.phShuffle(opts);
                questions.push({ type: 'word', target, prompt: '下列哪个单词包含音标 ' + target.sym + ' ？', options: opts.map(o => o.label), answer: correctWord.w });
            }
        }
        this._phQuiz = { questions, idx: 0, correct: 0, wrong: [], answered: false };
        this.phRenderQuizQuestion();
    },

    phRenderQuizQuestion() {
        const q = this._phQuiz;
        if (!q || q.idx >= q.questions.length) { this.phRenderQuizResult(); return; }
        const item = q.questions[q.idx];
        const total = q.questions.length;
        let html = `<div class="ph-quiz">
            <div class="ph-quiz-head">
                <button class="ph-back" onclick="App.navigateSub(()=>App.renderPhoneticsHome())">‹ 退出</button>
                <span class="ph-quiz-prog">第 ${q.idx + 1} / ${total} 题</span>
            </div>`;
        if (item.type === 'listen') {
            html += `<div class="ph-quiz-prompt">${this.esc(item.prompt)}</div>
                <button class="ph-quiz-play" id="phQPlay">🔊 点击听发音</button>
                <div class="ph-quiz-opts ${item.type}">`;
            item.options.forEach(o => {
                html += `<button class="ph-quiz-opt" data-val="${this.esc(o)}">${this.esc(o)}</button>`;
            });
            html += `</div>`;
        } else {
            html += `<div class="ph-quiz-prompt">${this.esc(item.prompt)}</div>
                <div class="ph-quiz-opts ${item.type}">`;
            item.options.forEach(o => {
                html += `<button class="ph-quiz-opt" data-val="${this.esc(o)}">${this.esc(o)}</button>`;
            });
            html += `</div>`;
        }
        html += `<div class="ph-quiz-fb" id="phQfb"></div></div>`;
        document.getElementById('main-content').innerHTML = html;

        if (item.type === 'listen') {
            document.getElementById('phQPlay').addEventListener('click', () => this.phPlay(item.audio, item.fallback));
            this.phPlay(item.audio, item.fallback);
        }
        document.querySelectorAll('.ph-quiz-opt').forEach(btn => {
            btn.addEventListener('click', () => this.phAnswerQuiz(btn, item));
        });
    },

    phAnswerQuiz(btn, item) {
        const q = this._phQuiz;
        if (!q || q.answered) return;
        q.answered = true;
        const chosen = btn.dataset.val;
        const correct = (chosen === item.answer);
        document.querySelectorAll('.ph-quiz-opt').forEach(b => {
            if (b.dataset.val === item.answer) b.classList.add('correct');
            else if (b === btn) b.classList.add('wrong');
            b.disabled = true;
        });
        const fb = document.getElementById('phQfb');
        if (correct) {
            q.correct++;
            TTS.playSuccess();
            fb.innerHTML = `<span class="ph-fb-ok">✅ 答对啦！</span>`;
        } else {
            q.wrong.push(item);
            TTS.playFail();
            fb.innerHTML = `<span class="ph-fb-no">❌ 正确答案：${this.esc(item.answer)}</span>`;
        }
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary btn-block mt-16';
        nextBtn.textContent = (q.idx + 1 >= q.questions.length) ? '查看结果' : '下一题';
        nextBtn.addEventListener('click', () => { q.idx++; q.answered = false; this.phRenderQuizQuestion(); });
        fb.appendChild(nextBtn);
    },

    phRenderQuizResult() {
        const q = this._phQuiz;
        const total = q.questions.length;
        const rate = Math.round(q.correct / total * 100);
        let html = `<div class="ph-quiz-result">
            <h1 class="page-title">📊 练习结果</h1>
            <div class="ph-result-ring">${rate}<span>%</span></div>
            <div class="ph-result-score">答对 ${q.correct} / ${total} 题</div>`;
        if (q.wrong.length) {
            html += `<div class="ph-result-wrong-title">📝 错题回顾（${q.wrong.length} 题）</div><div class="ph-result-wrong">`;
            q.wrong.forEach(w => {
                if (w.type === 'listen') {
                    html += `<div class="ph-wrong-item">听音辨标 → 正确音标：<b>${this.esc(w.answer)}</b></div>`;
                } else {
                    html += `<div class="ph-wrong-item">${this.esc(w.prompt)} → 正确单词：<b>${this.esc(w.answer)}</b></div>`;
                }
            });
            html += `</div>`;
        } else {
            html += `<div class="ph-result-allok">🎉 全部答对，太棒了！</div>`;
        }
        html += `<div class="ph-result-btns">
            <button class="btn btn-primary btn-block" id="phRetry">🔁 再练一次</button>
            <button class="btn btn-secondary btn-block" onclick="App.navigateSub(()=>App.renderPhoneticsHome())">返回总览</button>
        </div></div>`;
        document.getElementById('main-content').innerHTML = html;
        document.getElementById('phRetry').addEventListener('click', () => this.renderPhoneticsQuiz());
    },

    // ========================================================
    // 数学专项题型（学习工具 · 第一项）
    // ========================================================
    esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
        }[c]));
    },

    formatKnowledge(text) {
        if (!text) return '';
        let s = String(text);
        // 1) 纯文本层面换行（仅插入换行符，不插入标签，避免被 esc 转义）
        // 高频易错点：单独成行（优先处理，避免被其它关键词拆分）
        s = s.replace(/高频易错点/g, '\n高频易错点');
        // 其余模块关键词：一次性按最长优先匹配，整词前插入换行（避免子串二次拆分）
        const KW = ['通用三大核心规则', '通用解题步骤', '三大核心规则', '核心解题思路', '解题步骤', '解题技巧', '题型特征', '专属口诀', '解题口诀', '核心规则', '通用规则', '解题方法', '解题思路', '例题'];
        const kwRe = new RegExp('(' + KW.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
        s = s.replace(kwRe, '\n$1');
        // 在带圈/带括号序号前换行：① ② ③ … ⑴ ⑵ ⑶ …
        s = s.replace(/([①②③④⑤⑥⑦⑧⑨⑩⑴⑵⑶⑷⑸])/g, '\n$1');
        // 在「阿拉伯数字. 」或「数字、」前换行（允许数字后跟空格，避免误拆 2.5、100分）
        s = s.replace(/(?:^|\s)(\d+[.\、])(?=\s*[\u4e00-\u9fffA-Za-z（(（])/g, '\n$1');
        // 在「中文数字、」前换行（一、二、三、…）
        s = s.replace(/(?:^|\s)([一二三四五六七八九十]+[、.])(?=[\u4e00-\u9fff])/g, '\n$1');
        // 在句末标点后换行
        s = s.replace(/([。！？；;])/g, '$1\n');
        // 在冒号后换行（让“核心关系：鸡：1头2脚”等描述更清晰）
        s = s.replace(/([：:])/g, '$1\n');
        let lines = s.split('\n').map(x => x.trim()).filter(x => x);
        // 若某行以冒号结尾且下一行很短（如“鸡：”+“1头2脚；”），合并为一行
        const merged = [];
        for (let i = 0; i < lines.length; i++) {
            const cur = lines[i];
            const next = lines[i + 1];
            if (/[：:]$/.test(cur) && next && next.length <= 20 && !/[：:]$/.test(next)) {
                merged.push(cur + next);
                i++;
            } else {
                merged.push(cur);
            }
        }
        lines = merged;
        // 2) 转义后再对关键词包裹高亮标签
        const kwRe2 = new RegExp('(' + KW.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
        return lines.map(l => {
            let html = this.esc(l);
            let cls = 'math-kline';
            if (html.indexOf('高频易错点') !== -1) {
                cls += ' math-kline-warn';
                html = html.replace(/高频易错点/g, '<span class="math-warn">高频易错点</span>');
            } else {
                html = html.replace(kwRe2, '<span class="math-kw">$1</span>');
            }
            return `<div class="${cls}">${html}</div>`;
        }).join('');
    },

    renderMathHome() {
        this.navigateSub(() => {
            const data = window.MATH_DATA || [];
            const palette = ['#FF7043','#42A5F5','#66BB6A','#AB47BC','#FFA726','#26C6DA',
                             '#EC407A','#789262','#5C6BC0','#FFCA28','#26A69A','#EF5350','#8D6E63'];
            let html = `<h1 class="page-title">🧮 数学专项题型</h1>
                <div class="math-cat-grid">`;
            data.forEach((cat, idx) => {
                const exCount = cat.types.reduce((s, t) => s + (t.exercises ? t.exercises.length : 0), 0);
                const color = palette[idx % palette.length];
                const shortTitle = cat.title.replace(/^[一二三四五六七八九十]+、/, '');
                html += `<div class="math-cat-grid-card" data-cat="${cat.id}" style="--accent:${color}">
                    <div class="math-cat-grid-badge" style="background:${color}">${idx + 1}</div>
                    <div class="math-cat-grid-title">${this.esc(shortTitle)}</div>
                    <div class="math-cat-grid-meta">${cat.types.length} 题型 · ${exCount} 题</div>
                </div>`;
            });
            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;
            document.querySelectorAll('.math-cat-grid-card').forEach(card => {
                card.addEventListener('click', () => this.renderMathCategory(card.dataset.cat));
            });
        });
    },

    renderMathCategory(catId) {
        this.navigateSub(() => {
            const cat = (window.MATH_DATA || []).find(c => c.id === catId);
            if (!cat) return;
            let html = `<h1 class="page-title">${this.esc(cat.title)}</h1>`;
            if (cat.intro) {
                html += `<div class="math-knowledge-card">
                    <div class="math-knowledge-label">📌 核心知识点</div>
                    <div>${this.formatKnowledge(cat.intro)}</div></div>`;
            }
            if (cat.tip) {
                html += `<div class="math-tip-card">
                    <div class="math-tip-label">✨ 解题口诀</div>
                    <div>${this.formatKnowledge(cat.tip)}</div></div>`;
            }
            if (cat.formula) {
                html += `<div class="math-formula-card">
                    <div class="math-tip-label">📐 万能公式</div>
                    <div>${this.formatKnowledge(cat.formula)}</div></div>`;
            }
            html += `<div class="math-section-title">题型专项</div><div class="math-type-list">`;
            cat.types.forEach(t => {
                const exCount = t.exercises ? t.exercises.length : 0;
                html += `<div class="math-type-card" data-type="${t.id}">
                    <span class="math-type-title">${this.esc(t.title)}</span>
                    <span class="math-type-meta">${exCount} 题 ▶</span>
                </div>`;
            });
            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;
            document.querySelectorAll('.math-type-card').forEach(card => {
                card.addEventListener('click', () => this.renderMathType(catId, card.dataset.type));
            });
        });
    },

    renderMathType(catId, typeId) {
        this.navigateSub(() => {
            const cat = (window.MATH_DATA || []).find(c => c.id === catId);
            if (!cat) return;
            const t = cat.types.find(x => x.id === typeId);
            if (!t) return;
            let html = `<h1 class="page-title">${this.esc(t.title)}</h1>`;
            if (t.knowledge) {
                html += `<div class="math-knowledge-card">
                    <div class="math-knowledge-label">💡 知识点 & 解题技巧</div>
                    <div>${this.formatKnowledge(t.knowledge)}</div></div>`;
            }
            if (t.knack) {
                html += `<div class="math-tip-card">
                    <div class="math-tip-label">🎯 专属口诀</div>
                    <div>${this.formatKnowledge(t.knack)}</div></div>`;
            }
            if (t.points && t.points.length) {
                html += `<div class="math-points-card">
                    <div class="math-knowledge-label">📋 要点</div>
                    <ul class="math-points-list">`;
                t.points.forEach(p => { html += `<li>${this.esc(p)}</li>`; });
                html += `</ul></div>`;
            }
            html += `<div class="math-section-title">专项练习题（点击题目查看答案）</div><div class="math-ex-list">`;
            (t.exercises || []).forEach((ex, i) => {
                const hasExplain = ex.e ? `<div class="math-explain"><span class="math-answer-label">解析</span><span>${this.esc(ex.e)}</span></div>` : '';
                const exImg = ex.img ? `<div class="math-ex-img"><img src="${this.esc(ex.img)}" alt="题目配图"></div>` : '';
                html += `<div class="math-ex-card">
                    <div class="math-ex-q"><span class="math-ex-num">${i + 1}</span><span>${this.esc(ex.q)}</span></div>
                    ${exImg}
                    <button class="math-reveal-btn" data-ex="${i}">👀 点击查看答案</button>
                    <div class="math-answer-panel" id="mathAns-${i}" style="display:none;">
                        <div class="math-answer"><span class="math-answer-label">答案</span><span>${this.esc(ex.a)}</span></div>
                        ${hasExplain}
                    </div>
                </div>`;
            });
            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;
            document.querySelectorAll('.math-reveal-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const panel = document.getElementById('mathAns-' + btn.dataset.ex);
                    if (panel.style.display === 'none') {
                        panel.style.display = 'block';
                        btn.textContent = '🙈 隐藏答案';
                        btn.classList.add('revealed');
                    } else {
                        panel.style.display = 'none';
                        btn.textContent = '👀 点击查看答案';
                        btn.classList.remove('revealed');
                    }
                });
            });
        });
    },

    // 英语课文
    // ========================================================
    // 英文儿歌（学习工具）—— 从 videos/ 目录读取本地视频播放
    // 视频清单见 js/englishSongs.js (window.ENGLISH_SONGS)
    // 每项：{ title, file, cover?, lyrics? }，file 为 videos/ 下文件名
    // ========================================================
    renderSongsHome() {
        const list = window.ENGLISH_SONGS || [];
        let html = `<h1 class="page-title">🎵 英文儿歌</h1>
            <p class="song-lead">共 <b>${list.length}</b> 首 · 点开任意一首，开始播放～</p>`;
        if (!list.length) {
            html += `<div class="song-empty">📭 还没有添加儿歌视频哦。把视频放进应用的 <b>videos</b> 目录、并在清单里登记即可显示在这里。</div>`;
        } else {
            html += `<div class="song-search"><input type="search" id="songSearch" class="song-search-input" placeholder="🔍 搜索儿歌名称…" autocomplete="off"></div>`;
            html += `<div class="song-list" id="songGrid"></div>`;
        }
        document.getElementById('main-content').innerHTML = html;
        const inp = document.getElementById('songSearch');
        if (inp) inp.addEventListener('input', e => this._renderSongGrid(e.target.value));
        this._renderSongGrid('');
    },

    // 根据关键词（歌曲名 / 文件名）实时过滤儿歌列表（文本列表，点进去才播放）
    _renderSongGrid(keyword) {
        const list = window.ENGLISH_SONGS || [];
        const grid = document.getElementById('songGrid');
        if (!grid) return;
        const kw = (keyword || '').trim().toLowerCase();
        const filtered = kw
            ? list.filter(s => (s.title || '').toLowerCase().includes(kw) || (s.file || '').toLowerCase().includes(kw))
            : list;
        if (!filtered.length) {
            grid.innerHTML = `<div class="song-empty">🔍 没有找到与「${this.esc(keyword)}」相关的儿歌</div>`;
            return;
        }
        grid.innerHTML = filtered.map(s => {
            const origIdx = list.indexOf(s);
            return `<div class="song-item" data-i="${origIdx}">
                <span class="song-item-icon">🎵</span>
                <span class="song-item-name">${this.esc(s.title)}</span>
                <span class="song-item-arrow">▶</span>
            </div>`;
        }).join('');
        grid.querySelectorAll('.song-item').forEach(c => {
            c.onclick = () => this.navigateSub(() => this.renderSongDetail(list[+c.dataset.i]));
        });
    },

    renderSongDetail(song) {
        if (!song) return;
        const src = 'videos/' + encodeURI(song.file);
        // 顶部固定「上一首/下一首」：在歌曲清单顺序翻页
        const songList = window.ENGLISH_SONGS || [];
        const songIdx = songList.findIndex(s => s.file === song.file);
        const songTotal = songList.length;
        const songPrev = songIdx > 0 ? songList[songIdx - 1] : null;
        const songNext = (songIdx >= 0 && songIdx < songTotal - 1) ? songList[songIdx + 1] : null;
        const html = `<div class="pg-pager">
                <button class="pg-pager-btn" id="pgPrev"${songPrev ? '' : ' disabled'}>⬅ 上一首</button>
                <span class="pg-pager-count">${Math.max(songIdx + 1, 1)} / ${songTotal}</span>
                <button class="pg-pager-btn" id="pgNext"${songNext ? '' : ' disabled'}>下一首 ➡</button>
            </div>
            <div class="song-detail">
            <button class="ph-back" onclick="App.navigateSub(()=>App.renderSongsHome())">‹ 返回</button>
            <h1 class="song-detail-title">${this.esc(song.title)}</h1>
            <div class="song-video-wrap">
                <video class="song-video" id="songVideo" controls playsinline webkit-playsinline="true" preload="metadata"></video>
                <div class="song-loading" id="songLoading" style="display:none">⏳ 视频加载中…</div>
            </div>
            ${song.lyrics ? `<div class="song-lyrics"><h3>歌词</h3><p>${this.esc(song.lyrics).replace(/\n/g, '<br>')}</p></div>` : ''}
        </div>`;
        document.getElementById('main-content').innerHTML = html;
        this._loadSongVideo(document.getElementById('songVideo'), src);

        // 上一首 / 下一首（原地切换，不压栈）
        const goSong = (s) => { if (!s) return; this.renderSongDetail(s); window.scrollTo(0, 0); };
        const pv = document.getElementById('pgPrev');
        if (pv && songPrev) pv.onclick = () => goSong(songPrev);
        const nx = document.getElementById('pgNext');
        if (nx && songNext) nx.onclick = () => goSong(songNext);
    },

    // iOS Safari 硬性要求服务器支持 HTTP Range 才能播放 video；
    // CloudStudio 静态服务器不支持 Range，所以 iOS 上改为整文件 fetch → Blob → objectURL 播放。
    // 安卓/桌面走原生直链（可流式、可拖动进度）。
    _loadSongVideo(video, url) {
        if (!video) return;
        const ua = navigator.userAgent || '';
        const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (!isIOS) {
            video.src = url;
            return;
        }
        const loading = document.getElementById('songLoading');
        if (loading) loading.style.display = 'flex';
        fetch(url)
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
            .then(blob => {
                if (this._songBlobUrl) { try { URL.revokeObjectURL(this._songBlobUrl); } catch (e) {} }
                this._songBlobUrl = URL.createObjectURL(blob);
                video.src = this._songBlobUrl;
                if (loading) loading.style.display = 'none';
            })
            .catch(err => {
                console.warn('iOS Blob 加载失败，回退直链：', err);
                video.src = url;
                if (loading) loading.style.display = 'none';
            });
    },

    renderEngTextbook() {
        this.navigateSub(() => {
            let html = `<h1 class="page-title">📘 英语课文二上</h1>
                <div class="eng-audio-banner" onclick="App.renderEngTextbookAudio()">
                    <span class="eng-audio-banner-icon">🎧</span>
                    <div class="eng-audio-banner-text">
                        <div class="eng-audio-banner-title">课文音频</div>
                    </div>
                    <span class="eng-audio-banner-arrow">▶</span>
                </div>
                <div class="unit-list">`;

            ENGLISH_TEXTBOOK.forEach((unit, idx) => {
                html += `<div class="unit-card" data-unit="${idx}">
                    <span class="unit-card-title">${unit.unit}</span>
                    <span>▶</span>
                </div>`;
            });

            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;

            document.querySelectorAll('.unit-card').forEach(card => {
                card.addEventListener('click', () => {
                    this.renderEngUnitSections(parseInt(card.dataset.unit));
                });
            });
        });
    },

    renderEngUnitSections(unitIdx) {
        this.navigateSub(() => {
            const unit = ENGLISH_TEXTBOOK[unitIdx];
            let html = `<h1 class="page-title">${unit.unit}</h1>
                <div class="subsection-list">`;

            unit.sections.forEach((section, idx) => {
                html += `<div class="subsection-item" data-sec="${idx}">
                    <span>${section.title}</span>
                    <span>▶</span>
                </div>`;
            });

            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;

            document.querySelectorAll('.subsection-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.renderTextReader(unit.sections[parseInt(item.dataset.sec)], 'en');
                });
            });
        });
    },

    // 英语课文音频（自定义播放器，全平台 fetch+Blob 以支持任意拖动）
    renderEngTextbookAudio() {
        this.navigateSub(() => {
            const groups = window.ENGLISH_TEXTBOOK_AUDIO || [];
            let html = `<button class="ph-back" onclick="App.renderEngTextbook()">‹ 返回</button>
                <h1 class="page-title">🎧 课文音频</h1>
                <p class="eng-audio-tip">点击任意一条即可播放，进度条可随意拖动</p>
                <div class="eng-audio-list">`;

            groups.forEach((g, gi) => {
                html += `<div class="eng-audio-group">
                    <div class="eng-audio-group-title">${this.esc(g.unit)}</div>`;
                g.items.forEach((it, ii) => {
                    const key = gi + '-' + ii;
                    html += `<div class="eng-audio-item" data-key="${key}" data-file="${this.esc(it.file)}">
                        <div class="eng-audio-icon">🎵</div>
                        <div class="eng-audio-body">
                            <div class="eng-audio-title">${this.esc(it.title)}</div>
                            <div class="eng-audio-status" data-key="${key}">点击播放</div>
                            <div class="eng-audio-player" data-key="${key}">
                                <button class="eng-audio-playbtn" data-key="${key}">▶</button>
                                <span class="eng-audio-time eng-audio-cur" data-key="${key}">00:00</span>
                                <input type="range" class="eng-audio-progress" data-key="${key}" min="0" max="0" step="0.1" value="0" disabled>
                                <span class="eng-audio-time eng-audio-total" data-key="${key}">--:--</span>
                            </div>
                            <audio class="eng-audio-el" data-key="${key}" preload="none" playsinline webkit-playsinline="true"></audio>
                        </div>
                    </div>`;
                });
                html += `</div>`;
            });

            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;

            // 绑定播放/暂停、进度条拖动、时间更新
            groups.forEach((g, gi) => {
                g.items.forEach((it, ii) => {
                    this._engAudioBind(gi + '-' + ii);
                });
            });
        });
    },

    _engAudioBind(key) {
        const item = document.querySelector(`.eng-audio-item[data-key="${key}"]`);
        const audio = document.querySelector(`.eng-audio-el[data-key="${key}"]`);
        const playBtn = document.querySelector(`.eng-audio-playbtn[data-key="${key}"]`);
        const progress = document.querySelector(`.eng-audio-progress[data-key="${key}"]`);
        const curEl = document.querySelector(`.eng-audio-cur[data-key="${key}"]`);
        const totalEl = document.querySelector(`.eng-audio-total[data-key="${key}"]`);
        const status = document.querySelector(`.eng-audio-status[data-key="${key}"]`);
        if (!item || !audio || !playBtn || !progress) return;

        const fmt = (s) => {
            if (!isFinite(s) || s < 0) return '00:00';
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return (m < 10 ? '0' + m : m) + ':' + (sec < 10 ? '0' + sec : sec);
        };
        const setIcon = (playing) => { playBtn.textContent = playing ? '⏸' : '▶'; };

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (item.dataset.loaded) {
                if (audio.paused) {
                    if (audio.ended) audio.currentTime = 0;
                    this._engAudioPauseOthers(key);
                    audio.play().catch(() => {});
                } else {
                    audio.pause();
                }
                return;
            }
            this._engAudioLoad(item);
        });

        item.addEventListener('click', (e) => {
            if (e.target.closest('.eng-audio-player')) return;
            playBtn.click();
        });

        progress.addEventListener('input', () => {
            if (!item.dataset.loaded || !audio.duration) return;
            audio.currentTime = parseFloat(progress.value);
        });

        audio.addEventListener('loadedmetadata', () => {
            if (audio.duration && isFinite(audio.duration)) {
                progress.max = audio.duration;
                totalEl.textContent = fmt(audio.duration);
            }
        });

        audio.addEventListener('durationchange', () => {
            if (audio.duration && isFinite(audio.duration)) {
                progress.max = audio.duration;
                totalEl.textContent = fmt(audio.duration);
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            progress.value = audio.currentTime;
            curEl.textContent = fmt(audio.currentTime);
        });

        audio.addEventListener('play', () => {
            setIcon(true);
            this._engAudioPauseOthers(key);
        });

        audio.addEventListener('pause', () => { setIcon(false); });

        audio.addEventListener('ended', () => {
            setIcon(false);
            audio.currentTime = 0;
            progress.value = 0;
            curEl.textContent = fmt(0);
        });

        audio.addEventListener('error', () => {
            setIcon(false);
            if (status) status.textContent = '加载失败，请重试';
            item.dataset.loaded = '';
            progress.disabled = true;
            console.warn('英语课文音频加载失败', audio.error);
        });
    },

    // 加载并播放单条课文音频。
    // CloudStudio 静态服务器不支持 HTTP Range，导致原生 <audio> 在 iOS/部分浏览器上无法拖动进度，
    // 因此采用「直链即时播放 + 后台整文件 fetch→Blob 无缝替换」策略：
    //   1) 立即用直链播放，满足移动端手势限制、即时出声；
    //   2) 后台把整文件拉成 Blob，加载完成后替换为 Blob 源，进度条即可任意拖动。
    _engAudioLoad(item) {
        if (!item || item.dataset.loaded) return;
        const key = item.dataset.key;
        const audio = document.querySelector(`.eng-audio-el[data-key="${key}"]`);
        const status = document.querySelector(`.eng-audio-status[data-key="${key}"]`);
        const progress = document.querySelector(`.eng-audio-progress[data-key="${key}"]`);
        if (!audio) return;

        item.dataset.loaded = '1';
        const file = item.dataset.file;
        const url = 'audio/english2/' + encodeURI(file);

        if (status) status.textContent = '⏳ 音频加载中…';
        this._engAudioPauseOthers(key);
        progress.disabled = false;

        // 1) 直链即时播放（满足 iOS 手势 + 即时出声）
        audio.src = url;
        audio.play()
            .then(() => { if (status) status.textContent = '缓冲中…'; })
            .catch(() => { if (status) status.textContent = '点击 ▶ 播放'; });

        // 2) 后台拉取整文件 → Blob，加载完成后无缝替换以支持任意拖动
        const swapToBlob = () => {
            fetch(url)
                .then(r => {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    const total = parseInt(r.headers.get('Content-Length') || '0', 10);
                    const reader = r.body.getReader();
                    const chunks = [];
                    let received = 0;
                    const pump = () => reader.read().then(({ done, value }) => {
                        if (done) {
                            const blob = new Blob(chunks, { type: 'audio/mpeg' });
                            const burl = URL.createObjectURL(blob);
                            if (!this._engAudioBlobUrls) this._engAudioBlobUrls = [];
                            this._engAudioBlobUrls.push(burl);
                            const at = audio.currentTime || 0;
                            const playing = !audio.paused;
                            audio.src = burl;
                            try { audio.currentTime = at; } catch (e) {}
                            if (playing) audio.play().catch(() => {});
                            if (status) status.textContent = '';
                            return;
                        }
                        chunks.push(value);
                        received += value.length;
                        if (total && status) status.textContent = '⏳ 缓冲中 ' + Math.floor(received / total * 100) + '%';
                        return pump();
                    });
                    return pump();
                })
                .catch(err => {
                    console.warn('课文音频 Blob 加载失败，回退直链：', err);
                    if (status) status.textContent = '已就绪（拖动可能受限）';
                });
        };
        if ('requestIdleCallback' in window) requestIdleCallback(swapToBlob, { timeout: 1500 });
        else setTimeout(swapToBlob, 300);
    },

    _engAudioPauseOthers(activeKey) {
        document.querySelectorAll('.eng-audio-el').forEach(a => {
            if (a.dataset.key !== activeKey) { try { a.pause(); } catch (e) {} }
        });
    },

    // 课文内嵌视频（Story 等）加载。iOS 同样走 fetch→Blob，其它走直链。
    _loadTextReaderVideo(video, url) {
        if (!video) return;
        const ua = navigator.userAgent || '';
        const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (!isIOS) {
            video.src = url;
            return;
        }
        const loading = document.getElementById('trVideoLoading');
        if (loading) loading.style.display = 'flex';
        fetch(url)
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
            .then(blob => {
                if (this._textReaderBlobUrl) { try { URL.revokeObjectURL(this._textReaderBlobUrl); } catch (e) {} }
                this._textReaderBlobUrl = URL.createObjectURL(blob);
                video.src = this._textReaderBlobUrl;
                if (loading) loading.style.display = 'none';
            })
            .catch(err => {
                console.warn('课文视频 Blob 加载失败，回退直链：', err);
                video.src = url;
                if (loading) loading.style.display = 'none';
            });
    },

    renderTextReader(section, lang) {
        this.navigateSub(() => this._renderTextReaderContent(section, lang));
    },

    _renderTextReaderContent(section, lang) {
        // 顶部固定「上一篇/下一篇」：跨所有 Unit 的章节顺序翻页
        const engFlat = [];
        ENGLISH_TEXTBOOK.forEach((u, ui) => u.sections.forEach((s, si) => engFlat.push({ ui, si, sec: s })));
        const cur = engFlat.findIndex(x => x.sec === section);
        const total = engFlat.length;
        const prev = cur > 0 ? engFlat[cur - 1] : null;
        const next = (cur >= 0 && cur < total - 1) ? engFlat[cur + 1] : null;

        let html = `<div class="pg-pager">
                <button class="pg-pager-btn" id="pgPrev"${prev ? '' : ' disabled'}>⬅ 上一篇</button>
                <span class="pg-pager-count">${Math.max(cur + 1, 1)} / ${total}</span>
                <button class="pg-pager-btn" id="pgNext"${next ? '' : ' disabled'}>下一篇 ➡</button>
            </div>
            <div class="text-reader">
                <div class="text-reader-header">
                    <h2>${section.title}</h2>
                </div>`;

            // 支持单视频 (section.video) 与多视频 (section.videos 数组)
            const videoList = Array.isArray(section.videos)
                ? section.videos
                : (section.video ? [section.video] : []);
            if (videoList.length) {
                videoList.forEach((v, idx) => {
                    html += `<div class="tr-video-wrap">
                        <video class="tr-video" id="trVideo-${idx}" controls playsinline webkit-playsinline="true" preload="metadata"></video>
                        <div class="tr-video-loading" id="trVideoLoading-${idx}" style="display:none">⏳ 视频加载中…</div>
                    </div>`;
                });
            }

            html += `<div class="text-content" style="font-size:18px;">`;

            section.lines.forEach((line, i) => {
                html += `<div class="text-line" data-idx="${i}">
                    <button class="audio-btn" style="width:36px;height:36px;font-size:14px;flex-shrink:0;" data-line="${i}">🔊</button>
                    <div style="flex:1;">
                        <div class="text-line-en">${line.en}</div>
                        <div class="text-line-zh">${line.zh}</div>
                    </div>
                </div>`;
            });

            html += `</div>
                <button class="btn btn-info btn-block mt-16" id="playAll">🔊 播放全文</button>
            </div>`;

            document.getElementById('main-content').innerHTML = html;

            // 同页多个视频时，任一视频播放自动暂停其它（互斥，避免叠加声音）
            const allVideos = document.querySelectorAll('#main-content video');
            if (allVideos.length > 1) {
                allVideos.forEach(v => {
                    v.addEventListener('play', () => {
                        allVideos.forEach(o => {
                            if (o !== v && !o.paused) { try { o.pause(); } catch (e) {} }
                        });
                    });
                });
            }

            videoList.forEach((v, idx) => {
                this._loadTextReaderVideo(document.getElementById(`trVideo-${idx}`), 'videos/' + encodeURI(v));
            });

            // 绑定音频按钮
            document.querySelectorAll('.audio-btn[data-line]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.line);
                    const line = section.lines[idx];
                    if (lang === 'en') TTS.speakEnglish(line.en, 0.7);
                    else TTS.speakChinese(line.en);
                });
            });

            // 播放全文
            document.getElementById('playAll').onclick = () => {
                this.playAllLines(section, lang);
            };

            // 上一篇 / 下一篇（原地切换，不压栈）
            const stopTts = () => { try { if (window.TTS) TTS.stop(); } catch (e) {} };
            const go = (sec) => { if (!sec) return; stopTts(); this._renderTextReaderContent(sec, lang); window.scrollTo(0, 0); };
            const pv = document.getElementById('pgPrev');
            if (pv && prev) pv.onclick = () => go(prev.sec);
            const nx = document.getElementById('pgNext');
            if (nx && next) nx.onclick = () => go(next.sec);
    },

    playAllLines(section, lang) {
        let idx = 0;
        const playNext = () => {
            if (idx >= section.lines.length) return;
            const line = section.lines[idx];
            const utter = lang === 'en' ? TTS.speakEnglish(line.en, 0.7) : TTS.speakChinese(line.en);
            if (utter) {
                utter.onend = () => { idx++; playNext(); };
                utter.onerror = () => { idx++; playNext(); };
            } else {
                idx++;
                setTimeout(playNext, 500);
            }
        };
        playNext();
    },

    // 语文课文
    renderCnTextbook() {
        this.navigateSub(() => {
            let html = `<h1 class="page-title">📕 语文课文二上</h1>
                <div class="unit-list">`;

            CHINESE_TEXTBOOK.forEach((unit, idx) => {
                const lessonTitles = unit.lessons.map(l => l.title).join('、');
                html += `<div class="unit-card" data-unit="${idx}">
                    <div>
                        <span class="unit-card-title">${unit.unit}</span>
                        <div style="font-size:13px;color:#999;margin-top:4px;">${lessonTitles}</div>
                    </div>
                    <span>▶</span>
                </div>`;
            });

            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;

            document.querySelectorAll('.unit-card').forEach(card => {
                card.addEventListener('click', () => {
                    const idx = parseInt(card.dataset.unit);
                    this.renderCnUnitLessons(idx);
                });
            });
        });
    },

    renderCnUnitLessons(unitIdx) {
        this.navigateSub(() => {
            const unit = CHINESE_TEXTBOOK[unitIdx];
            let html = `<h1 class="page-title">${unit.unit}</h1>
                <div class="subsection-list">`;

            unit.lessons.forEach((lesson, idx) => {
                html += `<div class="subsection-item" data-lesson="${idx}">
                    <span>${lesson.title}</span>
                    <span>📖</span>
                </div>`;
            });

            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;

            document.querySelectorAll('.subsection-item').forEach(item => {
                item.addEventListener('click', () => {
                    const lessonIdx = parseInt(item.dataset.lesson);
                    this.renderCnLessonReader(unitIdx, lessonIdx);
                });
            });
        });
    },

    renderCnLessonReader(unitIdx, lessonIdx, autoplay) {
        this.navigateSub(() => this._renderCnLessonReaderContent(unitIdx, lessonIdx, autoplay));
    },

    _renderCnLessonReaderContent(unitIdx, lessonIdx, autoplay) {
        this._stopCnTextAudio();
        const unit = CHINESE_TEXTBOOK[unitIdx];
        const lesson = unit.lessons[lessonIdx];
        const isGarden = lesson.isGarden;
        const hasAudio = !!lesson.audio;
        const loopOn = !!this._cnLoop;

        // 顶部固定「上一篇/下一篇」：跨所有 Unit 的课文顺序翻页
        const cnFlat = [];
        CHINESE_TEXTBOOK.forEach((u, ui) => u.lessons.forEach((l, li) => cnFlat.push({ ui, li, l })));
        const curCn = cnFlat.findIndex(x => x.ui === unitIdx && x.li === lessonIdx);
        const cnTotal = cnFlat.length;
        const cnPrev = curCn > 0 ? cnFlat[curCn - 1] : null;
        const cnNext = (curCn >= 0 && curCn < cnTotal - 1) ? cnFlat[curCn + 1] : null;

        let html = `<div class="pg-pager">
                <button class="pg-pager-btn" id="pgPrev"${cnPrev ? '' : ' disabled'}>⬅ 上一篇</button>
                <span class="pg-pager-count">${Math.max(curCn + 1, 1)} / ${cnTotal}</span>
                <button class="pg-pager-btn" id="pgNext"${cnNext ? '' : ' disabled'}>下一篇 ➡</button>
            </div>
            <div class="text-reader">
                <div class="text-reader-header">
                    <h2>${lesson.title}</h2>
                </div>`;

            if (hasAudio) {
                html += `<div class="cn-lesson-actions">
                    <button class="cn-lesson-play" id="cnLessonPlay" data-u="${unitIdx}" data-l="${lessonIdx}">🔊 朗读</button>
                    <button class="cn-lesson-loop${loopOn ? ' active' : ''}" id="cnLessonLoop">🔁 循环${loopOn ? '中' : ''}</button>
                </div>`;
            }

            html += `<div class="text-content" style="font-size:18px;line-height:2.2;">
                    ${lesson.content.split('\n').map(line => `<p style="margin:0 0 8px 0;">${line}</p>`).join('')}
                </div>`;

            if (!isGarden && lesson.recognize) {
                html += `
                <div style="margin-top:20px;padding:14px;background:#E8F5E9;border-radius:10px;">
                    <div style="font-size:14px;color:#2E7D32;font-weight:bold;margin-bottom:6px;">📌 认字表</div>
                    <div style="font-size:16px;line-height:2;">${lesson.recognize}</div>
                </div>`;
            }

            if (!isGarden && lesson.write) {
                html += `
                <div style="margin-top:12px;padding:14px;background:#FFF3E0;border-radius:10px;">
                    <div style="font-size:14px;color:#E65100;font-weight:bold;margin-bottom:6px;">✏️ 写字表</div>
                    <div style="font-size:16px;line-height:2;">${lesson.write}</div>
                </div>`;
            }

            if (!isGarden && lesson.keyWords) {
                html += `
                <div style="margin-top:12px;padding:14px;background:#F3E5F5;border-radius:10px;">
                    <div style="font-size:14px;color:#7B1FA2;font-weight:bold;margin-bottom:6px;">📚 词语表</div>
                    <div style="font-size:16px;line-height:2;">${lesson.keyWords}</div>
                </div>`;
            }

            html += `</div>`;
            document.getElementById('main-content').innerHTML = html;

            const btn = document.getElementById('cnLessonPlay');
            const loopBtn = document.getElementById('cnLessonLoop');
            if (btn) btn.onclick = () => this._toggleCnTextPlay(btn);
            if (loopBtn) loopBtn.onclick = () => {
                this._cnLoop = !this._cnLoop;
                loopBtn.textContent = '🔁 循环' + (this._cnLoop ? '中' : '');
                loopBtn.classList.toggle('active', this._cnLoop);
            };
            window.scrollTo(0, 0);
            if (autoplay) this._startCnTextPlay(unitIdx, lessonIdx);

            // 上一篇 / 下一篇（原地切换，不压栈）
            const goCn = (u, l) => { this._renderCnLessonReaderContent(u, l); window.scrollTo(0, 0); };
            const pv = document.getElementById('pgPrev');
            if (pv && cnPrev) pv.onclick = () => goCn(cnPrev.ui, cnPrev.li);
            const nx = document.getElementById('pgNext');
            if (nx && cnNext) nx.onclick = () => goCn(cnNext.ui, cnNext.li);
    },

    _toggleCnTextPlay(btn) {
        const u = +btn.dataset.u, l = +btn.dataset.l;
        const au = this._cnTextAudio || (this._cnTextAudio = new Audio());
        if (this._cnTextPlaying === u + '-' + l && !au.paused) {
            au.pause();
            btn.textContent = '🔊 朗读';
            btn.classList.remove('playing');
            this._cnTextPlaying = null;
            return;
        }
        this._startCnTextPlay(u, l, btn);
    },

    _startCnTextPlay(u, l, btn) {
        const au = this._cnTextAudio || (this._cnTextAudio = new Audio());
        const b = btn || document.getElementById('cnLessonPlay');
        const unit = CHINESE_TEXTBOOK[u];
        const lesson = unit && unit.lessons[l];
        if (!lesson || !lesson.audio) return;
        try { au.src = lesson.audio; } catch (e) {}
        const p = au.play();
        if (p && p.catch) p.catch(() => {});
        if (b) { b.textContent = '⏸ 停止'; b.classList.add('playing'); }
        this._cnTextPlaying = u + '-' + l;
        au.onended = () => this._afterCnTextAudio(u, l);
    },

    _afterCnTextAudio(u, l) {
        const b = document.getElementById('cnLessonPlay');
        if (b) { b.textContent = '🔊 朗读'; b.classList.remove('playing'); }
        this._cnTextPlaying = null;
        if (this._cnLoop) {
            this._startCnTextPlay(u, l);
            return;
        }
        const next = this._nextCnLessonWithAudio(u, l);
        if (next) {
            this.navigateSubReplace(() => this.renderCnLessonReader(next.u, next.l, true));
        }
    },

    _nextCnLessonWithAudio(u, l) {
        const units = window.CHINESE_TEXTBOOK || [];
        let started = false;
        for (let i = 0; i < units.length; i++) {
            const lessons = units[i].lessons || [];
            for (let j = 0; j < lessons.length; j++) {
                if (!started) {
                    if (i === u && j === l) started = true;
                    continue;
                }
                if (lessons[j].audio) return { u: i, l: j };
            }
        }
        return null;
    },

    _stopCnTextAudio() {
        if (this._cnTextAudio) { try { this._cnTextAudio.pause(); } catch (e) {} }
        this._cnTextPlaying = null;
        const b = document.getElementById('cnLessonPlay');
        if (b) { b.textContent = '🔊 朗读'; b.classList.remove('playing'); }
    },

    // 错题本
    renderErrorBook() {
        this.navigateSub(() => {
            const errors = Storage.getErrorBook();
            const subjects = ['语文', '数学', '英语'];

            let html = `<h1 class="page-title">📝 错题本</h1>
                <div class="flex gap-8 mb-16">
                    <button class="btn btn-info" id="addError">+ 添加错题</button>
                </div>
                <div class="error-book-tabs" id="subjectTabs">`;

            subjects.forEach((s, i) => {
                const count = errors.filter(e => e.subject === s).length;
                html += `<div class="error-tab ${i===0?'active':''}" data-subject="${s}">${s}${count > 0 ? `(${count})` : ''}</div>`;
            });

            html += `</div>
                <div id="errorList"></div>`;

            document.getElementById('main-content').innerHTML = html;

            this.renderErrorList('语文');

            document.querySelectorAll('.error-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.error-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.renderErrorList(tab.dataset.subject);
                });
            });

            document.getElementById('addError').onclick = () => this.showAddErrorForm();
        });
    },

    renderErrorList(subject) {
        const errors = Storage.getErrorBook().filter(e => e.subject === subject);
        const list = document.getElementById('errorList');
        if (errors.length === 0) {
            list.innerHTML = this.emptyState('📋', '当前分类暂无错题，点击"添加错题"录入');
            return;
        }
        let html = '';
        errors.forEach(e => {
            html += `<div class="error-item">
                <div class="error-item-header">
                    <span class="error-item-type">${e.subject}</span>
                    <span style="font-size:12px;color:#999;">${e.createdAt || ''}</span>
                </div>
                ${e.image ? `<img src="${e.image}" style="width:100%;max-width:280px;border-radius:8px;margin:8px 0;" />` : ''}
                ${e.question ? `<div class="error-item-question">${e.question}</div>` : (e.image ? '' : '<div class="error-item-question" style="color:#999;">无内容</div>')}
                <div class="flex gap-8 mt-8">
                    <button class="btn btn-danger" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.deleteError(${e.id})">删除</button>
                </div>
            </div>`;
        });
        list.innerHTML = html;
    },

    audioBtn(text) {
        if (text) TTS.speakChinese(text);
    },

    toggleMastered(errorId) {
        const error = Storage.getErrorBook().find(e => e.id === errorId);
        Storage.updateError(null, errorId, { mastered: !error.mastered });
        const activeTab = document.querySelector('.error-tab.active');
        if (activeTab) this.renderErrorList(activeTab.dataset.subject);
    },

    deleteError(errorId) {
        this.showConfirm('确定删除这道错题吗？', () => {
            Storage.deleteError(null, errorId);
            const activeTab = document.querySelector('.error-tab.active');
            if (activeTab) this.renderErrorList(activeTab.dataset.subject);
            // 更新tab上的数量
            this.refreshErrorTabCounts();
            this.showToast('已删除');
        }, '确定删除', '取消');
    },

    refreshErrorTabCounts() {
        const errors = Storage.getErrorBook();
        const subjects = ['语文', '数学', '英语'];
        document.querySelectorAll('.error-tab').forEach((tab, i) => {
            const count = errors.filter(e => e.subject === subjects[i]).length;
            tab.textContent = subjects[i] + (count > 0 ? `(${count})` : '');
        });
    },

    showAddErrorForm() {
        const bodyHtml = `
            <div class="form-group">
                <label class="form-label">科目</label>
                <select class="form-select" id="errSubject">
                    <option value="语文">语文</option>
                    <option value="数学">数学</option>
                    <option value="英语">英语</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">拍照录题</label>
                <input type="file" id="errImage" accept="image/*" capture="camera" style="font-size:14px;">
                <div id="imagePreview" style="margin-top:8px;"></div>
            </div>
            <div class="form-group">
                <label class="form-label">题目内容（选填）</label>
                <textarea class="form-input" id="errQuestion" rows="3" placeholder="可输入题目文字，也可以只拍照"></textarea>
            </div>
        `;
        this.showModal('添加错题', bodyHtml, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveError">保存</button>
        `);
        // 图片预览（用Canvas压缩，避免base64过大撑爆localStorage）
        document.getElementById('errImage').onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const previewEl = document.getElementById('imagePreview');
            previewEl.innerHTML = '<div style="font-size:13px;color:#999;">处理中…</div>';
            try {
                const compressed = await this.compressImage(file, 800, 0.7);
                previewEl.innerHTML =
                    `<img src="${compressed}" style="width:100%;max-width:240px;border-radius:8px;" />`;
            } catch (err) {
                previewEl.innerHTML = '<div style="font-size:13px;color:#F44336;">图片处理失败：' + (err.message || '') + '</div>';
            }
        };
        document.getElementById('saveError').onclick = () => {
            const subject = document.getElementById('errSubject').value;
            const question = document.getElementById('errQuestion').value.trim();
            const imgEl = document.getElementById('imagePreview').querySelector('img');
            const image = imgEl ? imgEl.src : '';
            if (!question && !image) {
                this.showToast('请输入题目或拍照');
                return;
            }
            const ok = Storage.addError(null, {
                subject: subject,
                question: question,
                image: image,
                mastered: false
            });
            if (ok === false) {
                this.showToast('存储空间不足，请删除旧错题后再试');
                return;
            }
            this.closeModal();
            this.showToast('错题已添加');
            this.refreshErrorTabCounts();
            const activeTab = document.querySelector('.error-tab.active');
            if (activeTab) this.renderErrorList(activeTab.dataset.subject);
        };
    },

    // ========================================================
    // 模块五：考试积星
    // ========================================================
    renderExam() {
        const records = Storage.getExamRecords();

        let html = `<h1 class="page-title">🏆 考试积星</h1>
            <div class="exam-form">
                <div class="form-group">
                    <label class="form-label">选择学科</label>
                    <div class="exam-chips" id="subjectBtns">`;

        ['语文', '数学', '英语', '科学'].forEach((s, i) => {
            html += `<button class="chip ${i===0?'chip-active':''}" data-subject="${s}">${s}</button>`;
        });

        html += `</div></div>
            <div class="form-group">
                <label class="form-label">考试类型</label>
                <div class="exam-chips" id="examTypeBtns">`;

        ['单元测试', '期中测试', '期末测试'].forEach((t, i) => {
            html += `<button class="chip ${i===0?'chip-active':''}" data-type="${t}">${t}</button>`;
        });

        html += `</div></div>
            <div class="form-group">
                <label class="form-label">分数</label>
                <input type="number" class="form-input" id="examScore" placeholder="输入考试分数" min="0" max="100" step="0.1">
            </div>
            <div class="form-group">
                <label class="form-label">上传试卷照片</label>
                <input type="file" accept="image/*" id="examPhoto" style="min-height:48px;font-size:16px;">
            </div>
            <button class="btn btn-primary btn-block" id="submitExam" style="min-height:40px;font-size:15px;padding:8px;">提交并领取星星</button>
        </div>`;

        // 奖励规则提示（点击弹出）
        const rules = Storage.getRewardRules();
        html += `<div class="exam-rules-hint" id="examRulesHint">💡 点击查看奖励规则</div>`;

        // 历史记录
        const reversedRecords = records.slice().reverse();
        html += `<div class="exam-history">
            <h3 class="section-title">考试记录</h3>`;
        if (records.length === 0) {
            html += this.emptyState('🏆', '暂无考试记录');
        } else {
            reversedRecords.forEach((r, i) => {
                html += `<div class="exam-history-item exam-record-clickable" id="examRecItem_${i}">
                    <div>
                        <div style="font-size:13px;font-weight:600;">${r.subject} · ${r.examType}</div>
                        <div style="font-size:11px;color:#999;">${r.date}</div>
                    </div>
                    <div class="flex items-center gap-12">
                        <span style="font-size:15px;font-weight:700;">${r.score}分</span>
                        <span class="exam-star-badge">${r.stars > 0 ? `+${r.stars}⭐` : '0⭐'}</span>
                        <span style="font-size:18px;color:#bbb;">›</span>
                    </div>
                </div>`;
            });
        }
        html += `</div>`;

        document.getElementById('main-content').innerHTML = html;

        // 状态
        let selectedSubject = '语文';
        let selectedType = '单元测试';
        let photoData = null;

        // 绑定考试记录点击查看详情
        reversedRecords.forEach((r, i) => {
            const el = document.getElementById(`examRecItem_${i}`);
            if (el) el.onclick = () => this.showExamDetail(r);
        });

        document.querySelectorAll('#subjectBtns button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#subjectBtns button').forEach(b => {
                    b.classList.remove('chip-active');
                });
                btn.classList.add('chip-active');
                selectedSubject = btn.dataset.subject;
            });
        });

        document.querySelectorAll('#examTypeBtns button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#examTypeBtns button').forEach(b => {
                    b.classList.remove('chip-active');
                });
                btn.classList.add('chip-active');
                selectedType = btn.dataset.type;
            });
        });

        // 上传照片（用Canvas压缩，避免base64过大撑爆localStorage）
        document.getElementById('examPhoto').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    photoData = await this.compressImage(file, 800, 0.7);
                } catch (err) {
                    this.showToast('图片处理失败：' + (err.message || ''));
                    photoData = null;
                }
            }
        });

        // 奖励规则弹窗
        document.getElementById('examRulesHint').addEventListener('click', () => {
            const rules = Storage.getRewardRules();
            let rulesHtml = '';
            rules.exam.forEach(r => {
                const color = r.stars > 0 ? 'color:#4CAF50;' : 'color:#F44336;';
                rulesHtml += `<div class="result-detail-item">
                    <span>${r.min}-${r.max}分</span>
                    <span style="${color}font-weight:600;">${r.stars > 0 ? `+${r.stars}⭐` : '无星星'}</span>
                </div>`;
            });
            this.showModal('💡 奖励规则', rulesHtml);
        });

        document.getElementById('submitExam').onclick = () => {
            const score = parseFloat(document.getElementById('examScore').value);
            if (isNaN(score) || score < 0 || score > 100) {
                this.showToast('请输入有效分数(0-100)');
                return;
            }
            if (!photoData) {
                this.showToast('请上传试卷照片');
                return;
            }

            const stars = Storage.calcExamStars(score);
            const ok = Storage.saveExamRecord(null, {
                subject: selectedSubject,
                examType: selectedType,
                score: score,
                stars: stars,
                photo: photoData
            });
            if (ok === false) {
                this.showToast('存储空间不足，请删除旧考试记录后再试');
                return;
            }

            this.showStarAnimation();
            this.updateSidebarInfo();
            this.showToast(`提交成功！获得 ${stars} 颗星！`);
            this.renderExam();
        };
    },

    // 点击考试记录项查看详情（含试卷照片）
    showExamDetail(r) {
        const photoBlock = r.photo
            ? `<img src="${r.photo}" style="width:100%;border-radius:8px;display:block;" />`
            : `<div style="padding:24px 12px;text-align:center;color:#999;font-size:13px;background:#f7f7f7;border-radius:8px;">该记录未保存试卷照片</div>`;
        const bodyHtml = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:13px;">
                <span><strong style="font-size:15px;">${r.subject}</strong> · ${r.examType}</span>
                <span style="color:#999;">${r.date}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #eee;">
                <span style="font-size:15px;font-weight:700;color:#5D4037;">分数：${r.score}分</span>
                <span class="exam-star-badge">${r.stars > 0 ? `+${r.stars}⭐` : '0⭐'}</span>
            </div>
            <div style="font-size:12px;color:#999;margin-bottom:6px;">试卷照片</div>
            ${photoBlock}
        `;
        this.showModal('📝 考试详情', bodyHtml);
    },

    // ========================================================
    // 模块六：兑换商城
    // ========================================================
    renderMall() {
        const products = Storage.getProducts().filter(p => p.active);
        const balance = Storage.getStarBalance();
        const exchangeRecords = Storage.getExchangeRecords();

        let html = `<h1 class="page-title">🎁 兑换商城</h1>
            <div class="mall-header">
                <div>
                    <span style="font-size:14px;color:#666;">可用星星</span>
                    <div class="mall-balance">⭐ ${balance}</div>
                </div>
            </div>`;

        if (products.length === 0) {
            html += this.emptyState('🎁', '家长暂未上架奖品');
        } else {
            html += `<div class="product-grid">`;
            products.forEach((p, idx) => {
                const todayCount = Storage.getTodayExchangeCount(null, p.name);
                const status = Storage.getProductExchangeStatus(null, p);
                const intervalBlocked = !status.available;
                const canExchange = balance >= p.cost && todayCount < p.dailyLimit && !intervalBlocked;
                let reason;
                if (intervalBlocked) reason = '未到兑换时间';
                else if (balance < p.cost) reason = '星星不足';
                else if (todayCount >= p.dailyLimit) reason = '今日已达上限';
                else reason = '';

                const blocked = !canExchange;
                const intervalHint = (intervalBlocked && status.nextDate)
                    ? `<div class="product-interval-hint">${status.nextDate.slice(5).replace('-', '月')}日可兑换</div>`
                    : '';

                html += `<div class="product-card ${blocked ? 'product-card-disabled' : ''}">
                    <div class="product-name">${p.name}</div>
                    <div class="product-cost">⭐ ${p.cost}</div>
                    <div style="font-size:11px;color:#999;">今日 ${todayCount}/${p.dailyLimit >= 999 ? '不限' : p.dailyLimit}${p.intervalDays > 0 ? ' · 间隔' + p.intervalDays + '天' : ''}</div>
                    ${intervalHint}
                    <button class="btn ${canExchange ? 'btn-primary' : ''} btn-block"
                        ${canExchange ? '' : 'disabled'} data-product-idx="${idx}">
                        ${canExchange ? '兑换' : reason}
                    </button>
                </div>`;
            });
            html += `</div>`;
        }

        // 兑换记录（仅当日可撤销，历史记录按钮置灰）
        if (exchangeRecords.length > 0) {
            const todayStr = Storage.todayStr();
            const recentRecords = exchangeRecords.slice().reverse();
            html += `<div class="exchange-history">
                <div class="exchange-history-title">📋 兑换记录（仅当日可撤销）</div>`;
            recentRecords.forEach(rec => {
                const realIdx = exchangeRecords.indexOf(rec);
                const isToday = rec.date === todayStr;
                const undoBtn = isToday
                    ? `<button class="btn btn-outline btn-sm" data-undo-idx="${realIdx}">撤销</button>`
                    : `<button class="btn btn-outline btn-sm" disabled style="opacity:.4;cursor:not-allowed;">不可撤销</button>`;
                html += `<div class="exchange-record-item">
                    <div class="exchange-record-info">
                        <span class="exchange-record-name">${rec.productName}</span>
                        <span class="exchange-record-meta">${rec.date} · ⭐${rec.cost}</span>
                    </div>
                    ${undoBtn}
                </div>`;
            });
            html += `</div>`;
        }

        document.getElementById('main-content').innerHTML = html;

        // 记录当前活跃奖品列表，用于兑换时查找原始索引
        this._activeProducts = products;
        document.querySelectorAll('button[data-product-idx]').forEach(btn => {
            if (btn.disabled) return;
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.productIdx);
                const product = this._activeProducts[idx];
                if (!product) return;
                // 在点击时就获取原始索引，避免回调中重新getProducts导致引用不一致
                const allProducts = Storage.getProducts();
                const originalIdx = allProducts.indexOf(allProducts.filter(p => p.active)[idx]);
                this.showConfirm(
                    `确定兑换「${product.name}」？消耗 ${product.cost} 颗星星`,
                    () => {
                        const result = Storage.doExchange(null, originalIdx);
                        if (result.success) {
                            this.showStarAnimation();
                            this.updateSidebarInfo();
                            this.showToast('兑换成功！');
                            this.renderMall();
                        } else {
                            this.showToast(result.reason === 'interval' ? '未到兑换时间' : (result.reason === 'limit' ? '今日已达兑换上限' : '星星不足'));
                        }
                    },
                    '确定兑换',
                    '取消'
                );
            });
        });

        // 撤销兑换按钮
        document.querySelectorAll('button[data-undo-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.undoIdx);
                const records = Storage.getExchangeRecords();
                const rec = records[idx];
                if (!rec) return;
                this.showConfirm(
                    `确定撤销兑换「${rec.productName}」？\n退还 ${rec.cost} 颗星星`,
                    () => {
                        const result = Storage.undoExchange(null, idx);
                        if (result.success) {
                            this.updateSidebarInfo();
                            this.showToast('已撤销，退还' + rec.cost + '颗星');
                            this.renderMall();
                        } else {
                            this.showToast(result.reason === 'storage_error' ? '存储空间不足，无法撤销' : '撤销失败');
                        }
                    },
                    '确定撤销',
                    '取消'
                );
            });
        });
    },

    // ========================================================
    // 模块七：家长设置
    // ========================================================
    openParentSettings() {
        this.showModal('🔐 家长验证', `
            <div class="password-screen">
                <div style="font-size:48px;margin-bottom:16px;">🔐</div>
                <p>请输入家长密码</p>
                <input type="password" class="password-input" id="parentPwd" maxlength="6" placeholder="请输入密码">
                <div id="pwdError" style="color:#F44336;font-size:14px;margin-top:8px;"></div>
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="verifyPwd">进入</button>
        `);

        // 密码框弹窗往上移，避免手机键盘遮挡
        document.getElementById('modalContainer').classList.add('modal-top');

        document.getElementById('parentPwd').focus();
        document.getElementById('parentPwd').onkeydown = (e) => {
            if (e.key === 'Enter') document.getElementById('verifyPwd').click();
        };
        document.getElementById('verifyPwd').onclick = () => {
            const pwd = document.getElementById('parentPwd').value;
            if (Storage.verifyParentPassword(pwd)) {
                this.closeModal();
                this.renderParentSettings();
            } else {
                document.getElementById('pwdError').textContent = '密码错误，请重试';
                document.getElementById('parentPwd').value = '';
            }
        };
    },

    renderParentSettings() {
        this.navigateSub(() => {
            const children = Storage.getDB().children;
            const products = Storage.getProducts();

            let html = `<h1 class="page-title">⚙️ 家长设置</h1>`;

            // 孩子管理
            html += `<div class="settings-section">
                <h3 class="settings-section-title">👶 孩子多账号管理</h3>`;
            children.forEach(c => {
                html += `<div class="settings-item" onclick="App.editChild(${c.id})">
                    <span style="font-size:24px;">${c.avatar}</span>
                    <span style="flex:1;">${c.nickname} ${c.hidden ? '(已隐藏)' : ''}</span>
                    <span>${c.id === Storage.getCurrentChildId() ? '当前' : '▶'}</span>
                </div>`;
            });
            html += `<button class="btn btn-primary btn-block mt-8" onclick="App.addChildForm()">+ 新增孩子</button>
            </div>`;

            // 打卡管理
            html += `<div class="settings-section">
                <h3 class="settings-section-title">🔘 今日打卡管理</h3>
                <div class="settings-item" onclick="App.renderCheckinManage()">
                    <span>📋 管理打卡分类与任务</span><span>▶</span>
                </div>
            </div>`;

            // 商城管理
            html += `<div class="settings-section">
                <h3 class="settings-section-title">🎁 商城奖品管理</h3>
                <div class="settings-item" onclick="App.renderProductManage()">
                    <span>🛍️ 管理奖品</span><span>▶</span>
                </div>
            </div>`;

            // 奖励规则
            html += `<div class="settings-section">
                <h3 class="settings-section-title">⭐ 奖励规则配置</h3>
                <div class="settings-item" onclick="App.renderRewardRules()">
                    <span>⚙️ 修改星级与分数线</span><span>▶</span>
                </div>
            </div>`;

            // 系统设置
            html += `<div class="settings-section">
                <h3 class="settings-section-title">🔧 基础系统设置</h3>
                <div class="settings-item" onclick="App.changePasswordForm()">
                    <span>🔑 修改家长密码</span><span>▶</span>
                </div>
                <div class="settings-item" onclick="App.showStarLedger()">
                    <span>📊 星星收支总账查询</span><span>▶</span>
                </div>
                <div class="settings-item" onclick="App.exportExcelForm()">
                    <span>📤 导出 Excel（积星/兑换记录）</span><span>▶</span>
                </div>
                <div class="settings-item" onclick="App.importExcelForm()">
                    <span>📥 导入 Excel（覆盖所有记录）</span><span>▶</span>
                </div>
                <div class="settings-item" onclick="App.exportDataForm()">
                    <span>📤 完整数据导出（JSON备份）</span><span>▶</span>
                </div>
                <div class="settings-item" onclick="App.importDataForm()">
                    <span>📥 完整数据导入（JSON恢复）</span><span>▶</span>
                </div>
                <div class="settings-item" onclick="App.showToast('全局离线缓存已启用：题库已本地缓存，无网络可完成测评、打卡')">
                    <span>💾 离线缓存状态</span><span style="color:#4CAF50;">已启用</span>
                </div>
            </div>`;

            document.getElementById('main-content').innerHTML = html;
        });
    },

    addChildForm() {
        this.showModal('新增孩子', `
            <div class="form-group">
                <label class="form-label">昵称</label>
                <input class="form-input" id="newChildName" placeholder="输入孩子昵称">
            </div>
            <div class="form-group">
                <label class="form-label">头像（仅可选图案，不可上传图片）</label>
                <div class="flex gap-8 flex-wrap" id="avatarPicker">${this.avatarPickerHtml(this.CHILD_AVATARS[0])}</div>
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveChild">添加</button>
        `);

        this.bindAvatarPicker();

        document.getElementById('saveChild').onclick = () => {
            const name = document.getElementById('newChildName').value.trim();
            if (!name) { this.showToast('请输入昵称'); return; }
            const avatar = document.querySelector('input[name="avatar"]:checked').value;
            const newId = Storage.addChild(name, avatar);
            this.closeModal();
            this.showToast('添加成功');
            this.renderParentSettings();
        };
    },

    editChild(childId) {
        const child = Storage.getDB().children.find(c => c.id === childId);
        this.showModal(`编辑 ${child.nickname}`, `
            <div class="form-group">
                <label class="form-label">昵称</label>
                <input class="form-input" id="editChildName" value="${child.nickname}">
            </div>
            <div class="form-group">
                <label class="form-label">头像（仅可选图案，不可上传图片）</label>
                <div class="flex gap-8 flex-wrap" id="avatarPicker">${this.avatarPickerHtml(child.avatar)}</div>
            </div>
            <div class="form-group">
                <label class="form-label">操作</label>
                <div class="flex gap-8">
                    <button class="btn btn-info" onclick="Storage.switchChild(${childId});App.closeModal();App.navigate('home');App.updateSidebarInfo();">切换为当前</button>
                    ${child.id !== 1 ? `<button class="btn btn-outline" onclick="Storage.toggleChildHidden(${childId});App.closeModal();App.renderParentSettings();">${child.hidden ? '显示' : '隐藏'}</button>` : ''}
                </div>
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveEditChild">保存</button>
        `);
        this.bindAvatarPicker();
        document.getElementById('saveEditChild').onclick = () => {
            const name = document.getElementById('editChildName').value.trim();
            if (!name) { this.showToast('请输入昵称'); return; }
            const avatar = document.querySelector('input[name="avatar"]:checked').value;
            Storage.updateChild(childId, name, avatar);
            this.closeModal();
            this.showToast('已保存');
            this.renderParentSettings();
            this.updateSidebarInfo();
        };
    },

    renderCheckinManage() {
        this.navigateSub(() => {
            const categories = Storage.getCheckinCategories();
            let html = `<h1 class="page-title">🔘 打卡任务管理</h1>
                <button class="btn btn-primary mb-16" onclick="App.addCategoryForm()">+ 新增分类</button>`;

            categories.forEach((cat, ci) => {
                html += `<div class="card">
                    <div class="card-row">
                        <h3>${cat.icon} ${cat.name}</h3>
                        <div class="flex gap-8">
                            <button class="btn btn-outline" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.addItemForm(${ci})">+ 任务</button>
                            <button class="btn btn-danger" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.deleteCategory(${ci})">删除分类</button>
                        </div>
                    </div>`;
                cat.items.forEach((item, ii) => {
                    html += `<div class="exam-history-item">
                        <span>${item.name} (⭐${item.stars})</span>
                        <div class="flex gap-8">
                            <button class="btn btn-outline" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.editItemForm(${ci},${ii})">编辑</button>
                            <button class="btn btn-danger" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.deleteItem(${ci},${ii})">删除</button>
                        </div>
                    </div>`;
                });
                html += `</div>`;
            });

            html += `<div style="margin-top:16px;padding:16px;background:#FFF8DC;border-radius:10px;font-size:14px;color:#666;">
                📌 新增/修改任务奖励星数仅对后续打卡生效，历史打卡所得星星不改动。删除任务仅隐藏后续入口，历史打卡记录、已发放星星永久保留。
            </div>`;

            document.getElementById('main-content').innerHTML = html;
        });
    },

    addCategoryForm() {
        this.showModal('新增打卡分类', `
            <div class="form-group">
                <label class="form-label">分类名称</label>
                <input class="form-input" id="newCatName" placeholder="如：兴趣班">
            </div>
            <div class="form-group">
                <label class="form-label">图标</label>
                <input class="form-input" id="newCatIcon" placeholder="输入emoji" value="📌">
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveCat">添加</button>
        `);
        document.getElementById('saveCat').onclick = () => {
            const name = document.getElementById('newCatName').value.trim();
            const icon = document.getElementById('newCatIcon').value.trim() || '📌';
            if (!name) { this.showToast('请输入分类名称'); return; }
            const cats = Storage.getCheckinCategories();
            cats.push({ name, icon, items: [] });
            Storage.saveCheckinCategories(null, cats);
            this.closeModal();
            this.renderCheckinManage();
        };
    },

    deleteCategory(ci) {
        this.showConfirm('确定删除此分类？历史打卡记录将永久保留。', () => {
            const cats = Storage.getCheckinCategories();
            cats.splice(ci, 1);
            Storage.saveCheckinCategories(null, cats);
            this.renderCheckinManage();
        }, '确定删除', '取消');
    },

    addItemForm(ci) {
        this.showModal('新增打卡任务', `
            <div class="form-group">
                <label class="form-label">任务名称</label>
                <input class="form-input" id="newItemName" placeholder="如：课外阅读">
            </div>
            <div class="form-group">
                <label class="form-label">奖励星数</label>
                <input type="number" class="form-input" id="newItemStars" value="2" min="1" max="20">
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveItem">添加</button>
        `);
        document.getElementById('saveItem').onclick = () => {
            const name = document.getElementById('newItemName').value.trim();
            const stars = parseInt(document.getElementById('newItemStars').value);
            if (!name) { this.showToast('请输入任务名称'); return; }
            const cats = Storage.getCheckinCategories();
            cats[ci].items.push({ name, stars });
            Storage.saveCheckinCategories(null, cats);
            this.closeModal();
            this.renderCheckinManage();
        };
    },

    editItemForm(ci, ii) {
        const cats = Storage.getCheckinCategories();
        const item = cats[ci].items[ii];
        this.showModal('编辑打卡任务', `
            <div class="form-group">
                <label class="form-label">任务名称</label>
                <input class="form-input" id="editItemName" value="${item.name}">
            </div>
            <div class="form-group">
                <label class="form-label">奖励星数</label>
                <input type="number" class="form-input" id="editItemStars" value="${item.stars}" min="1" max="20">
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveEditItem">保存</button>
        `);
        document.getElementById('saveEditItem').onclick = () => {
            const name = document.getElementById('editItemName').value.trim();
            const stars = parseInt(document.getElementById('editItemStars').value);
            cats[ci].items[ii] = { name, stars };
            Storage.saveCheckinCategories(null, cats);
            this.closeModal();
            this.renderCheckinManage();
        };
    },

    deleteItem(ci, ii) {
        this.showConfirm('确定删除此任务？历史打卡记录和星星将永久保留。', () => {
            const cats = Storage.getCheckinCategories();
            cats[ci].items.splice(ii, 1);
            Storage.saveCheckinCategories(null, cats);
            this.renderCheckinManage();
        }, '确定删除', '取消');
    },

    renderProductManage() {
        this.navigateSub(() => {
            const products = Storage.getProducts();
            let html = `<h1 class="page-title">🎁 奖品管理</h1>
                <button class="btn btn-primary mb-16" onclick="App.addProductForm()">+ 新增奖品</button>`;

            products.forEach((p, idx) => {
                html += `<div class="exam-history-item">
                    <div class="flex items-center gap-8">
                        <div>
                            <div style="font-size:16px;font-weight:600;">${p.name}</div>
                            <div style="font-size:14px;color:#999;">⭐${p.cost} | 每日上限${p.dailyLimit} | 间隔${p.intervalDays || 0}天 | ${p.active ? '上架' : '下架'}</div>
                        </div>
                    </div>
                    <div class="flex gap-8">
                        <button class="btn btn-outline" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.editProductForm(${idx})">编辑</button>
                        <button class="btn ${p.active ? 'btn-danger' : 'btn-success'}" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.toggleProduct(${idx})">${p.active ? '下架' : '上架'}</button>
                        <button class="btn btn-danger" style="min-height:36px;font-size:14px;padding:4px 12px;" onclick="App.deleteProduct(${idx})">删除</button>
                    </div>
                </div>`;
            });

            if (products.length === 0) {
                html += this.emptyState('🎁', '暂无奖品，点击上方按钮新增');
            }

            document.getElementById('main-content').innerHTML = html;
        });
    },

    addProductForm() {
        this.showModal('新增奖品', `
            <div class="form-group">
                <label class="form-label">奖品名称</label>
                <input class="form-input" id="newProductName" placeholder="如：看动画片30分钟">
            </div>
            <div class="form-group">
                <label class="form-label">消耗星数</label>
                <input type="number" class="form-input" id="newProductCost" value="5" min="1">
            </div>
            <div class="form-group">
                <label class="form-label">每日兑换上限</label>
                <input type="number" class="form-input" id="newProductLimit" value="1" min="1">
            </div>
            <div class="form-group">
                <label class="form-label">兑换间隔天数（0 = 每天可兑换）</label>
                <input type="number" class="form-input" id="newProductInterval" value="0" min="0">
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveProduct">添加</button>
        `);
        document.getElementById('saveProduct').onclick = () => {
            const products = Storage.getProducts();
            products.push({
                name: document.getElementById('newProductName').value.trim(),
                cost: parseInt(document.getElementById('newProductCost').value),
                icon: '',
                dailyLimit: parseInt(document.getElementById('newProductLimit').value),
                intervalDays: parseInt(document.getElementById('newProductInterval').value) || 0,
                active: true,
                userCustomized: true
            });
            Storage.saveProducts(products);
            this.closeModal();
            this.renderProductManage();
        };
    },

    editProductForm(idx) {
        const products = Storage.getProducts();
        const p = products[idx];
        this.showModal('编辑奖品', `
            <div class="form-group">
                <label class="form-label">奖品名称</label>
                <input class="form-input" id="editProductName" value="${p.name}">
            </div>
            <div class="form-group">
                <label class="form-label">消耗星数</label>
                <input type="number" class="form-input" id="editProductCost" value="${p.cost}" min="1">
            </div>
            <div class="form-group">
                <label class="form-label">每日兑换上限</label>
                <input type="number" class="form-input" id="editProductLimit" value="${p.dailyLimit}" min="1">
            </div>
            <div class="form-group">
                <label class="form-label">兑换间隔天数（0 = 每天可兑换）</label>
                <input type="number" class="form-input" id="editProductInterval" value="${p.intervalDays || 0}" min="0">
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="saveEditProduct">保存</button>
        `);
        document.getElementById('saveEditProduct').onclick = () => {
            products[idx] = {
                name: document.getElementById('editProductName').value.trim(),
                cost: parseInt(document.getElementById('editProductCost').value),
                icon: '',
                dailyLimit: parseInt(document.getElementById('editProductLimit').value),
                intervalDays: parseInt(document.getElementById('editProductInterval').value) || 0,
                active: p.active,
                userCustomized: true
            };
            Storage.saveProducts(products);
            this.closeModal();
            this.renderProductManage();
        };
    },

    toggleProduct(idx) {
        const products = Storage.getProducts();
        products[idx].active = !products[idx].active;
        Storage.saveProducts(products);
        this.renderProductManage();
    },

    deleteProduct(idx) {
        this.showConfirm('确定删除此奖品？', () => {
            const products = Storage.getProducts();
            products.splice(idx, 1);
            Storage.saveProducts(products);
            this.renderProductManage();
        }, '确定删除', '取消');
    },

    renderRewardRules() {
        this.navigateSub(() => {
            const rules = Storage.getRewardRules();
            let html = `<h1 class="page-title">⭐ 奖励规则配置</h1>

                <div class="card">
                    <h3>知识测评</h3>
                    <div class="form-group">
                        <label class="form-label">100分得 ${rules.assessment.threeStar} 颗星</label>
                        <input type="range" min="1" max="10" value="${rules.assessment.threeStar}" class="form-input" id="ruleThreeStar" oninput="document.getElementById('ruleThreeStarVal').textContent=this.value+'颗'">
                        <span id="ruleThreeStarVal" style="font-size:20px;font-weight:700;color:var(--primary-dark);">${rules.assessment.threeStar}颗</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">90-99分得 ${rules.assessment.twoStar} 颗星</label>
                        <input type="range" min="1" max="10" value="${rules.assessment.twoStar}" class="form-input" id="ruleTwoStar" oninput="document.getElementById('ruleTwoStarVal').textContent=this.value+'颗'">
                        <span id="ruleTwoStarVal" style="font-size:20px;font-weight:700;color:var(--primary-dark);">${rules.assessment.twoStar}颗</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">90分以下得 ${rules.assessment.oneStar} 颗星</label>
                        <input type="range" min="0" max="5" value="${rules.assessment.oneStar}" class="form-input" id="ruleOneStar" oninput="document.getElementById('ruleOneStarVal').textContent=this.value+'颗'">
                        <span id="ruleOneStarVal" style="font-size:20px;font-weight:700;color:var(--primary-dark);">${rules.assessment.oneStar}颗</span>
                    </div>
                </div>

                <div class="card">
                    <h3>学科卷面考试</h3>`;

            rules.exam.forEach((r, i) => {
                html += `<div class="form-group">
                    <label class="form-label">${r.min}-${r.max}分 得 ${r.stars} 颗星</label>
                    <input type="range" min="0" max="20" value="${r.stars}" class="form-input" id="examRule${i}" oninput="document.getElementById('examRuleVal${i}').textContent=this.value+'颗'">
                    <span id="examRuleVal${i}" style="font-size:20px;font-weight:700;color:var(--primary-dark);">${r.stars}颗</span>
                </div>`;
            });

            html += `</div>
                <button class="btn btn-primary btn-lg btn-block mt-16" id="saveRules">保存规则</button>`;

            document.getElementById('main-content').innerHTML = html;

            document.getElementById('saveRules').onclick = () => {
                rules.assessment.threeStar = parseInt(document.getElementById('ruleThreeStar').value);
                rules.assessment.twoStar = parseInt(document.getElementById('ruleTwoStar').value);
                rules.assessment.oneStar = parseInt(document.getElementById('ruleOneStar').value);
                rules.exam.forEach((r, i) => {
                    r.stars = parseInt(document.getElementById(`examRule${i}`).value);
                });
                Storage.saveRewardRules(rules);
                this.showToast('规则已保存');
                this.renderParentSettings();
            };
        });
    },

    changePasswordForm() {
        this.showModal('修改密码', `
            <div class="form-group">
                <label class="form-label">新密码</label>
                <input type="password" class="form-input" id="newPwd" maxlength="6" placeholder="输入新密码">
            </div>
            <div class="form-group">
                <label class="form-label">确认密码</label>
                <input type="password" class="form-input" id="confirmPwd" maxlength="6" placeholder="再次输入新密码">
            </div>
        `, `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="savePwd">修改</button>
        `);
        document.getElementById('savePwd').onclick = () => {
            const newPwd = document.getElementById('newPwd').value;
            const confirmPwd = document.getElementById('confirmPwd').value;
            if (!newPwd) { this.showToast('请输入新密码'); return; }
            if (newPwd !== confirmPwd) { this.showToast('两次密码不一致'); return; }
            Storage.setParentPassword(newPwd);
            this.closeModal();
            this.showToast('密码已修改');
        };
    },

    showStarLedger() {
        this.navigateSub(() => {
            const ledger = Storage.getFullLedger();
            let html = `<h1 class="page-title">📊 星星收支总账</h1>`;
            if (ledger.length === 0) {
                html += this.emptyState('📊', '暂无星星记录');
            } else {
                html += `<div class="card"><div class="result-detail">`;
                ledger.slice().reverse().forEach(r => {
                    const sign = r.amount > 0 ? '+' : '';
                    const color = r.amount > 0 ? 'green' : 'red';
                    const taskName = this.translateTaskName(r.label, r.taskName);
                    html += `<div class="result-detail-item">
                        <span>[${r.label}] ${taskName} (${r.date})</span>
                        <span class="text-${color}">${sign}${r.amount} (余额:${r.balance})</span>
                    </div>`;
                });
                html += `</div></div>`;
            }
            document.getElementById('main-content').innerHTML = html;
        });
    },

    exportDataForm() {
        const data = Storage.exportData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `星星之火_数据导出_${Storage.todayStr()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('数据已导出');
    },

    // 完整数据导入（JSON恢复）：选择备份文件 → 解析 → 覆盖写入 → 刷新
    importDataForm() {
        this.showConfirm(
            '导入将覆盖当前站点的数据（孩子信息、星星、打卡、测评、考试、错题本、兑换记录等）。确定继续吗？',
            () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json,application/json';
                input.onchange = (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = Storage.importData(String(reader.result || ''));
                        if (result && result.success) {
                            this.closeModal();
                            const tip = result.version === 2
                                ? '导入成功！已恢复全部孩子及设置'
                                : '导入成功！已恢复该孩子的记录';
                            this.showToast(tip);
                            setTimeout(() => { location.reload(); }, 1000);
                        } else {
                            this.showToast((result && result.msg) || '导入失败，请检查备份文件');
                        }
                    };
                    reader.onerror = () => this.showToast('读取文件失败');
                    reader.readAsText(file, 'utf-8');
                };
                input.click();
            }
        );
    },

    // 导出 Excel（积星记录 + 兑换记录）
    // 导出 Excel：先让家长选择孩子，再导出该孩子的单 Sheet 明细
    exportExcelForm() {
        if (typeof XLSX === 'undefined') {
            this.showToast('Excel 组件未加载，请刷新页面重试');
            return;
        }
        const children = Storage.getDB().children || [];
        if (children.length === 0) {
            this.showToast('暂无孩子数据');
            return;
        }
        const options = children.map(c => `<option value="${c.id}">${c.nickname}</option>`).join('');
        const body = `
            <div style="font-size:15px;margin-bottom:10px;">请选择要导出的孩子：</div>
            <select id="exportChildSelect" class="form-input" style="width:100%;padding:10px;font-size:16px;border-radius:8px;">${options}</select>
            <div style="font-size:12px;color:#999;margin-top:10px;line-height:1.5;">
                将导出该孩子全部的【星星明细】（按模块分类、单 Sheet），不含孩子信息与余额；撤销/取消的记录不会包含在内。
            </div>`;
        const footer = `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="doExportExcelBtn">导出</button>`;
        this.showModal('导出 Excel', body, footer);
        document.getElementById('doExportExcelBtn').onclick = () => {
            const cid = Number(document.getElementById('exportChildSelect').value);
            this.doExportExcel(cid);
            this.closeModal();
        };
    },

    // 真正执行导出（单 Sheet：星星明细）
    doExportExcel(childId) {
        const child = (Storage.getDB().children || []).find(c => c.id === childId);
        if (!child) { this.showToast('未找到该孩子'); return; }
        const rows = Storage.getExcelLedgerRows(childId);
        const sheet = [['日期', '模块', '子类', '任务名', '收入/支出', '分数', '时间戳']];
        rows.forEach(r => {
            sheet.push([
                Storage.normalizeDateStr(r.date),
                r.module,
                r.sub,
                r.taskName,
                r.amount,
                (r.score !== undefined && r.score !== null && r.score !== '') ? r.score : '',
                Storage.formatTimestamp(r.timestamp)
            ]);
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet), '星星明细');
        XLSX.writeFile(wb, `${child.nickname}-数据导出-${Storage.todayStr()}.xlsx`);
        this.showToast('Excel 已导出');
    },

    // 导入 Excel（单 Sheet：星星明细），先选孩子再上传，导入到选定孩子名下
    importExcelForm() {
        if (typeof XLSX === 'undefined') {
            this.showToast('Excel 组件未加载，请刷新页面重试');
            return;
        }
        const children = Storage.getDB().children || [];
        if (children.length === 0) {
            this.showToast('暂无孩子数据');
            return;
        }
        const options = children.map(c => `<option value="${c.id}">${c.nickname}</option>`).join('');
        const body = `
            <div style="font-size:15px;margin-bottom:10px;">请选择要导入到的孩子：</div>
            <select id="importChildSelect" class="form-input" style="width:100%;padding:10px;font-size:16px;border-radius:8px;">${options}</select>
            <div style="font-size:12px;color:#999;margin-top:10px;line-height:1.5;">
                导入将<b>覆盖</b>该孩子全部星星明细、考试记录、兑换记录等，请确认文件正确。<br>
                试卷照片不会被导入（留空），分数列若存在会被一并导入。
            </div>`;
        const footer = `
            <button class="btn btn-outline" onclick="App.closeModal()">取消</button>
            <button class="btn btn-primary" id="doImportExcelBtn">选择文件并导入</button>`;
        this.showModal('导入 Excel', body, footer);
        document.getElementById('doImportExcelBtn').onclick = () => {
            const cid = Number(document.getElementById('importChildSelect').value);
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xlsx,.xls';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const wb = XLSX.read(ev.target.result, { type: 'array' });
                        const parsed = this.parseExcelToData(wb);
                        if (parsed.rows.length === 0) {
                            this.showToast('未识别到星星明细，请检查文件');
                            return;
                        }
                        this.showConfirm(
                            `确定导入并覆盖所选孩子的所有记录吗？\n此操作不可撤销！\n（共 ${parsed.rows.length} 条明细）`,
                            () => {
                                const result = Storage.importExcelData(cid, parsed);
                                if (result.success) {
                                    this.updateSidebarInfo();
                                    this.showToast('导入成功，已覆盖该孩子所有记录');
                                    this.renderParentSettings();
                                } else {
                                    this.showToast('导入失败：存储空间不足');
                                }
                            },
                            '确定导入',
                            '取消'
                        );
                    } catch (err) {
                        console.error(err);
                        this.showToast('Excel 解析失败，请检查文件格式');
                    }
                };
                reader.readAsArrayBuffer(file);
            };
            input.click();
        };
    },

    // 解析单 Sheet Excel 为 { rows: [{ date, module, sub, taskName, amount, score, timestamp }] }
    parseExcelToData(wb) {
        const result = { rows: [] };
        // 优先读名为“星星明细”的 Sheet，否则取第一个有数据的 Sheet
        let ws = wb.Sheets['星星明细'];
        if (!ws) {
            const firstName = Object.keys(wb.Sheets || {})[0];
            ws = firstName ? wb.Sheets[firstName] : null;
        }
        if (!ws) return result;
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row == null || row.length === 0 || !row[0]) continue;
            result.rows.push({
                date: row[0] || '',           // 保持原始类型（Date/数字/字符串），交给 normalizeDateStr 处理
                module: String(row[1] || ''),
                sub: String(row[2] || ''),
                taskName: String(row[3] || ''),
                amount: Number(row[4]) || 0,
                score: (row[5] !== undefined && row[5] !== null && row[5] !== '') ? Number(row[5]) : '',
                timestamp: row[6] || ''       // 保持原始类型，交给 parseTimestamp 处理
            });
        }
        return result;
    },
    // ========================================================
    // 模块：中华历史科普（学习工具）
    // ========================================================
    renderHistoryHome() {
        this.navigateSub(() => {
            const data = window.HISTORY_DATA || [];
            // 时间轴固定按原始（远古→现代）顺序展示
            let tl = '';
            data.forEach((d, i) => {
                const parts = (d.period || '').split(' – ');
                const startY = (parts[0] || '').replace('约', '');
                const endY = (parts[1] || parts[0] || '').replace('约', '');
                tl += `<div class="hist-tl-node" data-dyn="${d.id}" style="--accent:${d.accent}">
                    ${i === 0 ? '' : '<div class="hist-tl-line"></div>'}
                    <div class="hist-tl-bar" style="background:${d.accent}"><div class="hist-tl-name">${this.esc(d.name)}</div></div>
                    <div class="hist-tl-dot" style="background:${d.accent}"></div>
                    <div class="hist-tl-year">${this.esc(startY)}<br>${this.esc(endY)}</div>
                </div>`;
            });

            let list = '';
            data.forEach((d, idx) => {
                list += `<div class="hist-dyn-row" data-dyn="${d.id}" style="--accent:${d.accent}">
                    <span class="hist-dyn-num">${idx + 1}</span>
                    <div class="hist-dyn-body">
                        <div class="hist-dyn-name">${this.esc(d.name)}</div>
                        <div class="hist-dyn-meta">${this.esc(d.period)}</div>
                    </div>
                    <span class="hist-dyn-arrow">▶</span>
                </div>`;
            });

            const html = `<h1 class="page-title">🏯 中华历史科普</h1>
                <div class="hist-search">
                    <div class="hist-search-box">
                        <span class="ico">🔍</span>
                        <input class="hist-search-input" id="histSearchInput" placeholder="搜朝代 / 人物 / 历史故事…" />
                        <button class="hist-search-clear" id="histSearchClear" style="display:none;">✕</button>
                    </div>
                    <div class="hist-search-results" id="histSearchResults" style="display:none;"></div>
                </div>
                <div class="hist-timeline-wrap">
                    <div class="hist-timeline-label">📜 朝代时间轴（远古 → 现代，点一点看看）</div>
                    <div class="hist-timeline"><div class="hist-tl-track">${tl}</div></div>
                </div>
                <div class="hist-list-head">
                    <span class="ttl">朝代总列表</span>
                </div>
                <div class="hist-dyn-list" id="histDynList">${list}</div>`;

            document.getElementById('main-content').innerHTML = html;

            document.querySelectorAll('.hist-tl-node').forEach(n =>
                n.addEventListener('click', () => this.renderHistoryDetail(n.dataset.dyn)));
            document.querySelectorAll('.hist-dyn-row').forEach(r =>
                r.addEventListener('click', () => this.renderHistoryDetail(r.dataset.dyn)));

            const input = document.getElementById('histSearchInput');
            input.addEventListener('input', () => this.onHistorySearch());
            document.getElementById('histSearchClear').addEventListener('click', () => {
                input.value = '';
                this.onHistorySearch();
            });
        });
    },

    onHistorySearch() {
        const input = document.getElementById('histSearchInput');
        const box = document.getElementById('histSearchResults');
        const clear = document.getElementById('histSearchClear');
        const q = (input.value || '').trim().toLowerCase();
        if (!q) {
            box.style.display = 'none';
            clear.style.display = 'none';
            box.innerHTML = '';
            return;
        }
        clear.style.display = 'block';
        const data = window.HISTORY_DATA || [];
        const results = [];
        data.forEach(d => {
            if (d.name.toLowerCase().includes(q) || (d.summary || '').toLowerCase().includes(q) ||
                (d.basic.duration || '').toLowerCase().includes(q) || (d.basic.landmark || '').toLowerCase().includes(q)) {
                results.push({ type: '朝代', title: d.name, sub: d.period, dynId: d.id, section: 'basic' });
            }
            (d.stories || []).forEach(s => {
                if (s.title.toLowerCase().includes(q) || (s.content || '').toLowerCase().includes(q))
                    results.push({ type: '历史故事', title: s.title, sub: d.name, dynId: d.id, section: 'stories' });
            });
            (d.people || []).forEach(p => {
                if (p.name.toLowerCase().includes(q) || (p.role || '').toLowerCase().includes(q) || (p.content || '').toLowerCase().includes(q))
                    results.push({ type: '人物', title: p.name, sub: (p.role || '') + ' · ' + d.name, dynId: d.id, section: 'people' });
            });
            (d.inventions || []).forEach(inv => {
                if (inv.title.toLowerCase().includes(q) || (inv.content || '').toLowerCase().includes(q))
                    results.push({ type: '发明文化', title: inv.title, sub: d.name, dynId: d.id, section: 'inventions' });
            });
        });
        if (results.length === 0) {
            box.style.display = 'block';
            box.innerHTML = `<div class="hist-empty">没有找到相关内容，换个词试试～</div>`;
            return;
        }
        box.style.display = 'block';
        box.innerHTML = results.slice(0, 30).map(r => `
            <div class="hist-search-result" data-dyn="${r.dynId}" data-section="${r.section}">
                <span class="hist-sr-tag">${r.type}</span>
                <div style="min-width:0;">
                    <div class="hist-sr-title">${this.esc(r.title)}</div>
                    <div class="hist-sr-sub">${this.esc(r.sub)}</div>
                </div>
            </div>`).join('');
        box.querySelectorAll('.hist-search-result').forEach(el => {
            el.addEventListener('click', () => {
                const dynId = el.dataset.dyn;
                const section = el.dataset.section;
                input.value = '';
                box.style.display = 'none';
                box.innerHTML = '';
                clear.style.display = 'none';
                this.renderHistoryDetail(dynId, section);
            });
        });
    },

    renderHistoryDetail(dynId, scrollTo) {
        this.navigateSub(() => {
            const data = window.HISTORY_DATA || [];
            const d = data.find(x => x.id === dynId);
            if (!d) {
                document.getElementById('main-content').innerHTML = this.emptyState('🏯', '未找到该朝代');
                return;
            }
            const SECTION_ORDER = ['basic', 'stories', 'people', 'inventions'];
            const META = {
                basic: '📌 基础信息',
                stories: '📖 重大历史故事',
                people: '👤 知名人物',
                inventions: '💡 发明与传统文化'
            };
            let hero = `<div class="hist-detail-hero" style="background:${d.accent}">
                <div class="nm">${this.esc(d.name)}</div>
                <div class="pe">🕰 ${this.esc(d.period)}</div>
                <div class="su">${this.esc(d.summary)}</div>
            </div>`;

            let sections = `<div class="hist-sections" id="histSections">`;

            SECTION_ORDER.forEach(key => {
                sections += `<div class="hist-section" data-section="${key}" style="--accent:${d.accent}">
                    <div class="hist-section-head">
                        <span class="h">${META[key]}</span>
                    </div>
                    <div class="hist-section-body">`;
                if (key === 'basic') {
                    sections += `<div class="hist-basic-grid">
                        <div class="hist-basic-cell"><div class="k">存续时间</div><div class="v">${this.esc(d.basic.duration)}</div></div>
                        <div class="hist-basic-cell"><div class="k">开国君主</div><div class="v">${this.esc(d.basic.founder)}</div></div>
                        <div class="hist-basic-cell"><div class="k">都城</div><div class="v">${this.esc(d.basic.capital)}</div></div>
                        <div class="hist-basic-cell"><div class="k">标志性大事</div><div class="v">${this.esc(d.basic.landmark)}</div></div>
                    </div>
                    <div class="hist-memory" style="margin:10px 0 0;">
                        <span class="badge">记忆</span><span>${this.esc(d.basic.memory)}</span>
                    </div>`;
                } else {
                    const items = d[key] || [];
                    if (items.length === 0) {
                        sections += `<div class="hist-empty">暂无内容</div>`;
                    } else {
                        items.forEach(it => {
                            sections += `<div class="hist-card-item">
                                <div class="hist-item-title">${this.esc(it.title || it.name || '')}</div>`;
                            if (it.role) sections += `<div class="hist-item-role">${this.esc(it.role)}</div>`;
                            sections += `<div class="hist-item-content">${this.esc(it.content)}</div>`;
                            sections += `</div>`;
                        });
                    }
                }
                sections += `</div></div>`;
            });
            sections += `</div>`;

            document.getElementById('main-content').innerHTML = hero + sections;

            if (scrollTo && scrollTo !== 'basic') {
                setTimeout(() => {
                    const el = document.querySelector(`.hist-section[data-section="${scrollTo}"]`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
            }
        });
    },

};

// 启动应用
document.addEventListener('DOMContentLoaded', () => App.init());
