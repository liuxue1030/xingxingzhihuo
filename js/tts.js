/* ========================================
 * 星星之火 - 语音播放 (Web Speech API)
 * 课文朗读 / 测评音效 / 对错语音提示
 * ----------------------------------------
 * 2026-08-11 升级：情感化朗读
 *  - 优选更自然 / 神经(Neural)嗓音
 *  - 按标点自动分句，疑问上扬、感叹强调、句末回落、奇偶抑扬
 *  - 句间加入自然停顿，语调不再平铺直叙、机械
 * ======================================== */

const TTS = {
    synth: window.speechSynthesis,
    voices: [],
    currentUtterance: null,
    audioContext: null,
    locked: false,            // 录音锁
    _stopFlag: false,         // 中断标记
    _gen: 0,                  // 代际令牌，防止并发分句链串音
    _pendingEnd: null,        // 兼容旧版 onEnd 回调
    _queue: [],               // 当前分句队列

    init() {
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    },

    loadVoices() {
        try { this.voices = this.synth.getVoices() || []; } catch (e) { this.voices = []; }
    },

    // 优选最自然、最有感情的中文嗓音（优先 神经 / 女声 / 大陆普通话）
    getChineseVoice() {
        if (!this.voices.length) this.loadVoices();
        if (!this.voices.length) return null;
        const zh = this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('zh'));
        if (!zh.length) return null;
        const score = (v) => {
            const s = (v.name || '').toLowerCase();
            let n = 1;
            if (s.includes('neural') || s.includes('natural')) n += 5;          // 神经嗓音最自然
            if (/(yun|云|xiaoxiao|小|晓|ya|雅|na|娜|ting|婷|hui|慧|mei|美|jia|佳|ru|茹|yan|燕|qing|晴|tingting)/.test(s)) n += 3;
            if (s.includes('female') || s.includes('女')) n += 2;
            if (v.lang && v.lang.toLowerCase().includes('cn')) n += 1;          // 偏好大陆普通话
            return n;
        };
        zh.sort((a, b) => score(b) - score(a));
        return zh[0];
    },

    getEnglishVoice() {
        if (!this.voices.length) this.loadVoices();
        if (!this.voices.length) return null;
        const en = this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
        if (!en.length) return null;
        const score = (v) => {
            const s = (v.name || '').toLowerCase();
            let n = 1;
            if (s.includes('neural') || s.includes('natural')) n += 5;
            if (/(samantha|aria|zira|google|female|女)/.test(s)) n += 3;
            return n;
        };
        en.sort((a, b) => score(b) - score(a));
        return en[0];
    },

    // 把文本切成带标点的短句片段，并记录是否为「大停顿」（句末 vs 句中）
    _splitClauses(text) {
        const segs = String(text).replace(/\r/g, '').replace(/\n+/g, '。').split(/([。！？!?；;，,、])/);
        const clauses = [];
        for (let i = 0; i < segs.length; i += 2) {
            const body = (segs[i] || '').trim();
            const punct = segs[i + 1] || '';
            if (!body) continue;
            clauses.push({ text: body + punct, major: /[。！？!?；;]/.test(punct) });
        }
        return clauses;
    },

    // 主朗读：分句 + 情感起伏 + 自然停顿
    // opts: { pitch, volume, onEnd }
    speak(text, lang = 'zh-CN', rate = 0.9, opts = {}) {
        if (this.locked) return null;
        if (!this.synth) return null;
        if (!text) return null;

        // 先中断上一段朗读（设置中断标记 + 代际令牌自增）
        this.stop();
        if (!this.voices.length) this.loadVoices();

        const isEn = lang.toLowerCase().startsWith('en');
        const voice = isEn ? this.getEnglishVoice() : this.getChineseVoice();
        const clauses = this._splitClauses(text);
        if (!clauses.length) return null;

        // 更温暖、更有亲和力的基准音高；中文略高一点点更显童趣与情绪
        const warm = (opts.pitch != null) ? opts.pitch : (isEn ? 1.0 : 1.08);
        const baseRate = rate || (isEn ? 0.8 : 0.9);

        const myGen = ++this._gen;       // 本次朗读的代际令牌
        this._stopFlag = false;
        this._queue = clauses.map((cl, i) => {
            const u = new SpeechSynthesisUtterance(cl.text);
            u.lang = lang;
            const last = cl.text.slice(-1);
            let p = warm, r = baseRate;
            if (last === '？' || last === '?') { p = warm + 0.22; r = baseRate * 0.95; }            // 疑问：语调上扬
            else if (last === '！' || last === '!') { p = warm + 0.15; r = baseRate * 0.97; }       // 感叹：加重强调
            else if (last === '。' || last === '.' || last === '；' || last === ';') { p = warm - 0.06; } // 句末：轻微回落
            else { p = warm + ((i % 2 === 0) ? 0.05 : -0.05); }                                       // 短句间：抑扬交替
            u.pitch = Math.max(0.5, Math.min(2, +p.toFixed(3)));
            u.rate = Math.max(0.5, Math.min(2, +r.toFixed(3)));
            u.volume = (opts.volume != null) ? opts.volume : 1;
            if (voice) u.voice = voice;
            u._major = cl.major;
            return u;
        });

        this.currentUtterance = this._queue[0] || null;

        const finish = () => {
            this.currentUtterance = null;
            const a = opts.onEnd, b = this._pendingEnd;
            this._pendingEnd = null;
            if (a) { try { a(); } catch (e) {} }
            if (b && b !== a) { try { b(); } catch (e) {} }
        };

        let idx = 0;
        const playNext = () => {
            if (this._stopFlag || this._gen !== myGen) return;
            if (idx >= this._queue.length) { finish(); return; }
            const u = this._queue[idx++];
            const pause = u._major ? 180 : 95;   // 句末停顿更长，句中更短，更自然
            u.onend = () => {
                if (this._stopFlag || this._gen !== myGen) return;
                if (idx < this._queue.length) setTimeout(playNext, pause);
                else finish();
            };
            u.onerror = () => {
                if (this._stopFlag || this._gen !== myGen) return;
                if (idx < this._queue.length) setTimeout(playNext, 60);
                else finish();
            };
            this.currentUtterance = u;
            try { this.synth.speak(u); }
            catch (e) {
                if (idx < this._queue.length && this._gen === myGen && !this._stopFlag) setTimeout(playNext, 60);
                else finish();
            }
        };

        const fire = () => { if (!this._stopFlag && this._gen === myGen) playNext(); };
        if (this.voices.length || !('onvoiceschanged' in this.synth)) {
            fire();
        } else {
            this.synth.onvoiceschanged = () => { this.loadVoices(); fire(); };
            setTimeout(() => { if (!this.voices.length) fire(); }, 600);   // 兜底：600ms 内未就绪则直接播
        }
        return this.currentUtterance;
    },

    // 朗读英文 (美式，默认0.8倍慢速)
    speakEnglish(text, rate = 0.8) {
        return this.speak(text, 'en-US', rate);
    },

    // 朗读中文 (标准普通话慢速，更温暖)
    speakChinese(text) {
        return this.speak(text, 'zh-CN', 0.9);
    },

    // 停止朗读（中断当前分句链）
    stop() {
        this._stopFlag = true;
        this._gen++;
        try { if (this.synth && this.synth.speaking) this.synth.cancel(); } catch (e) {}
        this.currentUtterance = null;
    },

    // 播放完毕回调（兼容旧用法）
    onEnd(callback) {
        this._pendingEnd = callback;
        return this;
    },

    // 简单音效(使用 AudioContext)
    playTone(frequency, duration, type = 'sine') {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = this.audioContext;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = frequency;
            osc.type = type;
            // 更柔和的起音与衰减，避免生硬「滴」声
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) { console.warn('Audio playback error:', e); }
    },

    // 成功音效(上行小三度 + 大三度，轻快悦耳)
    playSuccess() {
        this.playTone(523, 0.12);
        setTimeout(() => this.playTone(659, 0.12), 110);
        setTimeout(() => this.playTone(784, 0.22), 230);
    },

    // 失败音效(下行二度，柔和提醒而非刺耳)
    playFail() {
        this.playTone(392, 0.16, 'triangle');
        setTimeout(() => this.playTone(294, 0.26, 'triangle'), 150);
    },

    // 星星音效(明亮上行琶音)
    playStar() {
        this.playTone(880, 0.1);
        setTimeout(() => this.playTone(1100, 0.1), 100);
        setTimeout(() => this.playTone(1320, 0.3), 210);
    },

    // 答对语音（成功音效 + 一句鼓励的话，带情绪）
    speakCorrect() {
        this.playSuccess();
        this.speakChinese('答对啦，你真棒！');
    },

    // 重试后答对语音
    speakRetryCorrect() {
        this.playSuccess();
        this.speakChinese('太好了，终于答对啦！');
    },

    // 答错语音（简短鼓励，再试一次）
    speakWrong() {
        this.playFail();
        this.speakChinese('再试一次');
    },

    // 锁定(录音时禁止播放)
    lock() { this.locked = true; this.stop(); },
    unlock() { this.locked = false; },

    // 播放完毕后解锁
    speakThenUnlock(text, lang, rate) {
        const wasLocked = this.locked;
        this.locked = false;
        const utter = this.speak(text, lang, rate, { onEnd: () => { this.locked = wasLocked; } });
        if (!utter) this.locked = wasLocked;
        return utter;
    }
};

TTS.init();
// 显式挂到 window：顶层 const 不会自动成为 window 属性，
// app.js 的 speakPinyin 通过 window.TTS 检测支持情况，否则会误报“设备不支持”
window.TTS = TTS;
