/* ========================================
 * 星星之火 - 云端同步模块 (WorkBuddy Cloud Service)
 * - 仅在应用注册发布域名启用以太账号登录 + 整库(JSONB)同步
 * - 其它域名（如 GitHub Pages）自动降级为本地模式，原有功能不受影响
 * - 数据模型：每个账号一行 app_data(data JSONB)，按 owner_id 隔离
 * ======================================== */
const Cloud = (function () {
    const CONFIG = window.STARFIRE_CLOUD_CONFIG;
    let cloud = null;
    let enabled = false;
    let registeredHost = '';
    let rowId = null;
    let loginResolve = null;
    let pushTimer = null;
    let pushPending = null;

    function toast(msg, ms) {
        if (window.App && App.showToast) App.showToast(msg, ms || 2500);
    }

    function initSdk() {
        if (!CONFIG) return false;
        if (typeof WorkBuddyCloud === 'undefined') {
            console.warn('云端 SDK 未加载，降级为本地模式');
            return false;
        }
        try { registeredHost = new URL(CONFIG.endpoint).hostname; } catch (e) { return false; }
        if (location.hostname !== registeredHost) {
            console.warn('非注册发布域名，云端同步不可用，当前为本地模式');
            return false;
        }
        cloud = WorkBuddyCloud.createWorkBuddyCloud({
            endpoint: CONFIG.endpoint,
            publishableKey: CONFIG.publishableKey
        });
        enabled = true;
        return true;
    }

    // 启动：确保已登录；未登录则展示登录界面并等待
    async function boot() {
        if (!initSdk()) {
            enabled = false;
            toast('当前链接不支持云端同步，数据仅保存在本机。多手机同步请使用应用发布域名。', 4000);
            return;
        }
        const { data: s, error } = await cloud.auth.getSession();
        if (s && !error) {
            await pullAndSeed();
            return;
        }
        await showLogin();
    }

    // 拉取云端数据覆盖本地（首次则上传本机数据）
    async function pullAndSeed() {
        try {
            const { data, error } = await cloud.database
                .from('app_data')
                .select('id, data, updated_at')
                .maybeSingle();
            if (error) { console.error('云端拉取失败', error); return; }
            if (data) {
                rowId = data.id;
                Storage.saveDB(data.data);
                console.log('已从云端同步数据');
            } else {
                await doPush(Storage.getDB());
                toast('已将本机数据上传到云端', 2500);
            }
        } catch (e) { console.error('pullAndSeed', e); }
    }

    // 保存后调用：把本地整库同步到云端（防抖，最后一份生效）
    async function push(db, force) {
        if (!enabled || !cloud) return;
        if (!db) db = Storage.getDB();
        if (!db) return;
        if (!force) {
            pushPending = db;
            if (pushTimer) return;
            pushTimer = setTimeout(() => {
                const d = pushPending; pushPending = null; pushTimer = null;
                doPush(d);
            }, 500);
            return;
        }
        await doPush(db);
    }

    async function doPush(db) {
        if (!enabled || !cloud || !db) return;
        try {
            if (rowId) {
                const { error } = await cloud.database
                    .from('app_data')
                    .update({ data: db, updated_at: new Date().toISOString() })
                    .eq('id', rowId);
                if (error) console.error('云端保存失败', error);
            } else {
                const { data, error } = await cloud.database
                    .from('app_data')
                    .insert({ data: db })
                    .select('id')
                    .single();
                if (error) { console.error('云端新建失败', error); return; }
                if (data) rowId = data.id;
            }
        } catch (e) { console.error('doPush', e); }
    }

    // ===== 登录界面 =====
    function showLogin() {
        return new Promise((resolve) => {
            loginResolve = resolve;
            renderLoginUI();
            const el = document.getElementById('cloudLogin');
            if (el) el.style.display = 'flex';
        });
    }

    function finishLogin() {
        const el = document.getElementById('cloudLogin');
        if (el) el.style.display = 'none';
        const r = loginResolve; loginResolve = null;
        pullAndSeed().then(() => { if (r) r(true); });
    }

    function setMsg(t) {
        const m = document.getElementById('cloudMsg');
        if (m) m.textContent = t;
    }

    function renderLoginUI() {
        const el = document.getElementById('cloudLogin');
        if (!el) return;
        el.innerHTML = `
            <div class="cloud-login-box">
                <div class="cloud-login-logo">⭐</div>
                <h2>星星之火 · 账号登录</h2>
                <p class="cloud-login-tip">登录同一账号，即可在多部手机同步星星与打卡记录</p>
                <div class="cloud-tabs">
                    <button class="cloud-tab active" data-tab="pwd">密码登录</button>
                    <button class="cloud-tab" data-tab="otp">验证码登录</button>
                    <button class="cloud-tab" data-tab="signup">注册</button>
                </div>
                <div id="cloudFormArea"></div>
                <div id="cloudMsg" class="cloud-msg"></div>
            </div>`;
        const tabs = el.querySelectorAll('.cloud-tab');
        tabs.forEach(t => t.onclick = () => {
            tabs.forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            renderForm(t.dataset.tab);
        });
        renderForm('pwd');
    }

    function renderForm(tab) {
        const area = document.getElementById('cloudFormArea');
        const msg = document.getElementById('cloudMsg');
        if (msg) msg.textContent = '';
        if (tab === 'pwd') {
            area.innerHTML = `
                <input class="cloud-input" id="clEmail" type="email" placeholder="邮箱" />
                <input class="cloud-input" id="clPwd" type="password" placeholder="密码" />
                <button class="cloud-btn" id="clSubmit">登录</button>
                <div class="cloud-link" id="clForgot">忘记密码？</div>`;
            document.getElementById('clSubmit').onclick = doPwdLogin;
            document.getElementById('clForgot').onclick = () => renderForm('forgot');
        } else if (tab === 'otp') {
            area.innerHTML = `
                <input class="cloud-input" id="clEmail" type="email" placeholder="邮箱" />
                <button class="cloud-btn" id="clSubmit">获取验证码并登录</button>`;
            document.getElementById('clSubmit').onclick = doOtpLogin;
        } else if (tab === 'signup') {
            area.innerHTML = `
                <input class="cloud-input" id="clEmail" type="email" placeholder="邮箱" />
                <input class="cloud-input" id="clPwd" type="password" placeholder="设置密码（6位以上）" />
                <button class="cloud-btn" id="clSubmit">发送验证码并注册</button>`;
            document.getElementById('clSubmit').onclick = doSignup;
        } else if (tab === 'forgot') {
            area.innerHTML = `
                <input class="cloud-input" id="clEmail" type="email" placeholder="邮箱" />
                <input class="cloud-input" id="clPwd" type="password" placeholder="新密码" />
                <button class="cloud-btn" id="clSubmit">发送验证码并重设密码</button>`;
            document.getElementById('clSubmit').onclick = doForgot;
        }
    }

    async function doPwdLogin() {
        const email = document.getElementById('clEmail').value.trim();
        const pwd = document.getElementById('clPwd').value;
        if (!email || !pwd) { setMsg('请输入邮箱和密码'); return; }
        setMsg('登录中...');
        const { data, error } = await cloud.auth.signInWithPassword({ email, password: pwd });
        if (error) { setMsg('账号或密码错误'); return; }
        finishLogin();
    }

    async function doOtpLogin() {
        const email = document.getElementById('clEmail').value.trim();
        if (!email) { setMsg('请输入邮箱'); return; }
        setMsg('发送验证码中...');
        const started = await cloud.auth.signInWithOtp({ email });
        if (started.error) { setMsg(started.error.message || '发送失败'); return; }
        const code = prompt('验证码已发送到 ' + email + '，请输入：');
        if (!code) { setMsg('已取消'); return; }
        setMsg('验证中...');
        const completed = await started.data.verify({ token: code });
        if (completed.error) { setMsg('验证码错误'); return; }
        finishLogin();
    }

    async function doSignup() {
        const email = document.getElementById('clEmail').value.trim();
        const pwd = document.getElementById('clPwd').value;
        if (!email) { setMsg('请输入邮箱'); return; }
        if (!pwd || pwd.length < 6) { setMsg('密码至少6位'); return; }
        setMsg('发送验证码中...');
        const sent = await cloud.auth.sendOtp({ email });
        if (sent.error) { setMsg(sent.error.message || '发送失败'); return; }
        const code = prompt('验证码已发送到 ' + email + '，请输入：');
        if (!code) { setMsg('已取消注册'); return; }
        setMsg('注册中...');
        const completed = await cloud.auth.verifyOtp({
            verificationId: sent.data.verificationId,
            token: code,
            email,
            isExistingUser: sent.data.isExistingUser,
            password: sent.data.isExistingUser ? undefined : pwd
        });
        if (completed.error) { setMsg(completed.error.message || '注册失败'); return; }
        finishLogin();
    }

    async function doForgot() {
        const email = document.getElementById('clEmail').value.trim();
        const pwd = document.getElementById('clPwd').value;
        if (!email) { setMsg('请输入邮箱'); return; }
        if (!pwd || pwd.length < 6) { setMsg('新密码至少6位'); return; }
        setMsg('发送验证码中...');
        const started = await cloud.auth.resetPasswordForEmail(email);
        if (started.error) { setMsg(started.error.message || '发送失败'); return; }
        const code = prompt('验证码已发送到 ' + email + '，请输入：');
        if (!code) { setMsg('已取消'); return; }
        setMsg('重设中...');
        const completed = await started.data.updateUser({ nonce: code, password: pwd });
        if (completed.error) { setMsg(completed.error.message || '重设失败'); return; }
        finishLogin();
    }

    async function signOut() {
        try { await cloud.auth.signOut(); } catch (e) {}
        location.reload();
    }

    return {
        get enabled() { return enabled; },
        boot,
        push,
        signOut
    };
})();
