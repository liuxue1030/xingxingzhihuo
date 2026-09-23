/* 国际象棋 · 人机对弈（应用内嵌引擎，无需登录）
 * 依赖：chess.js（规则/合法走法/将死判定）
 * 规则：强度2、随机先手、进入即自动开始人机对弈、lichess 风格棋盘
 */
(function (global) {
    'use strict';

    var PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
    var MATE = 1000000;

    // 棋子字形（黑底实心字形用于双方，靠 CSS 上色区分颜色）
    var GLYPH = {
        w: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
        b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };

    function ChessGame(container, app) {
        this.app = app || null;
        this.wrap = container;
        this.chess = null;
        this.playerColor = 'w';
        this.computerColor = 'b';
        this.selected = null;
        this.legalTargets = [];
        this.lastMove = null;
        this.log = [];
        this.gameEnded = false;
        this.aiDepth = 2;          // 强度 2
        this._seq = 0;             // 防止离开页面后定时器误触发
        this.boardEl = null;
        this.statusEl = null;
        this.logEl = null;
    }

    ChessGame.prototype.shellHtml = function () {
        return '' +
            '<div class="chess-layout">' +
            '  <div class="chess-main">' +
            '    <div class="chess-board" id="chessBoard"></div>' +
            '  </div>' +
            '  <div class="chess-side">' +
            '    <div class="chess-info">' +
            '      <div class="chess-mode">🤖 人机对弈 · 强度 2 · 随机先手</div>' +
            '      <div class="chess-status" id="chessStatus"></div>' +
            '    </div>' +
            '    <div class="chess-movelog" id="chessLog"></div>' +
            '    <button class="btn btn-primary btn-block" id="chessRestart">🔄 重新开始</button>' +
            '    <a class="chess-ext" href="https://lichess.org/" target="_blank" rel="noopener">在 lichess.org 上挑战真人或练习 →</a>' +
            '  </div>' +
            '</div>';
    };

    ChessGame.prototype.init = function () {
        this.wrap.innerHTML = this.shellHtml();
        this.boardEl = this.wrap.querySelector('#chessBoard');
        this.statusEl = this.wrap.querySelector('#chessStatus');
        this.logEl = this.wrap.querySelector('#chessLog');
        var self = this;
        this.wrap.querySelector('#chessRestart').addEventListener('click', function () { self.restart(); });
        this.wrap.addEventListener('click', function (e) { self.onBoardClick(e); });
        this.newGame();
    };

    ChessGame.prototype.newGame = function () {
        this._seq++;
        this.chess = new global.Chess();
        this.playerColor = Math.random() < 0.5 ? 'w' : 'b';
        this.computerColor = this.playerColor === 'w' ? 'b' : 'w';
        this.selected = null;
        this.legalTargets = [];
        this.lastMove = null;
        this.log = [];
        this.gameEnded = false;
        this.renderAll();
        this.updateStatus();
        // 进入即自动开始：若电脑先手，则立即走一步
        if (this.chess.turn() === this.computerColor) {
            this.scheduleAI();
        }
    };

    ChessGame.prototype.restart = function () {
        this.newGame();
        if (this.app && this.app.showToast) this.app.showToast('已重新开始一局（随机先手）');
    };

    // ---------- 渲染 ----------
    ChessGame.prototype.renderAll = function () {
        this.renderBoard();
        this.updateStatus();
        this.renderLog();
    };

    ChessGame.prototype.dispSquare = function (r, col) {
        if (this.playerColor === 'w') return String.fromCharCode(97 + col) + (8 - r);
        return String.fromCharCode(97 + (7 - col)) + (1 + r);
    };

    ChessGame.prototype.renderBoard = function () {
        if (!this.boardEl) return;
        var board = this.chess.board(); // [rank8..rank1][a..h]
        var disp = board.map(function (r) { return r.slice(); });
        if (this.playerColor === 'b') {
            disp = disp.reverse().map(function (r) { return r.slice().reverse(); });
        }
        var html = '';
        for (var r = 0; r < 8; r++) {
            for (var col = 0; col < 8; col++) {
                var cell = disp[r][col];
                var sq = this.dispSquare(r, col);
                var file = sq.charCodeAt(0) - 97;
                var rank = parseInt(sq[1], 10) - 1;
                var isLight = (file + rank) % 2 === 1;
                var cls = 'sq ' + (isLight ? 'sq-light' : 'sq-dark');
                if (this.selected === sq) cls += ' sq-selected';
                if (this.lastMove && (this.lastMove.from === sq || this.lastMove.to === sq)) cls += ' sq-last';
                var isTarget = this.legalTargets.some(function (t) { return t.to === sq; });
                if (isTarget) cls += ' sq-target';
                var inner = '';
                if (cell) {
                    inner += '<span class="pc pc-' + cell.color + '">' + GLYPH[cell.color][cell.type] + '</span>';
                } else if (isTarget) {
                    inner += '<span class="dot"></span>';
                }
                var label = '';
                if (col === 0) label += '<span class="co-rank">' + sq[1] + '</span>';
                if (r === 7) label += '<span class="co-file">' + sq[0] + '</span>';
                html += '<div class="' + cls + '" data-sq="' + sq + '">' + inner + label + '</div>';
            }
        }
        this.boardEl.innerHTML = html;
    };

    ChessGame.prototype.updateStatus = function () {
        if (!this.statusEl) return;
        if (this.gameEnded) return; // 结束状态由 endGame 设置
        var sideTxt = this.playerColor === 'w' ? '你执白 ♔' : '你执黑 ♚';
        var turnTxt = this.chess.turn() === this.playerColor ? '👦 轮到你走棋' : '🤖 电脑思考中…';
        if (this.chess.in_check()) turnTxt += '（被将军！）';
        this.statusEl.innerHTML = sideTxt + ' ｜ ' + turnTxt;
    };

    ChessGame.prototype.renderLog = function () {
        if (!this.logEl) return;
        if (!this.log.length) { this.logEl.innerHTML = '<div class="log-empty">走法记录将显示在这里</div>'; return; }
        var html = '';
        for (var i = 0; i < this.log.length; i++) {
            var e = this.log[i];
            html += '<div class="log-row"><span class="log-who">' + e.who + '</span>' + e.san + '</div>';
        }
        this.logEl.innerHTML = html;
        this.logEl.scrollTop = this.logEl.scrollHeight;
    };

    // ---------- 交互 ----------
    ChessGame.prototype.onBoardClick = function (e) {
        if (this.gameEnded) return;
        if (this.chess.turn() !== this.playerColor) return;
        var cell = e.target.closest ? e.target.closest('.sq') : null;
        if (!cell || !cell.dataset.sq) return;
        this.handleClick(cell.dataset.sq);
    };

    ChessGame.prototype.pieceAt = function (sq) {
        var file = sq.charCodeAt(0) - 97;
        var rank = parseInt(sq[1], 10);
        var r = 8 - rank;
        var b = this.chess.board();
        return b[r] ? b[r][file] : null;
    };

    ChessGame.prototype.handleClick = function (sq) {
        if (!this.selected) {
            var p = this.pieceAt(sq);
            if (p && p.color === this.playerColor) {
                this.selected = sq;
                this.legalTargets = this.chess.moves({ square: sq, verbose: true })
                    .map(function (m) { return { to: m.to, promotion: m.promotion }; });
                this.renderBoard();
            }
            return;
        }
        var tgt = null;
        for (var i = 0; i < this.legalTargets.length; i++) if (this.legalTargets[i].to === sq) tgt = this.legalTargets[i];
        if (tgt) {
            this.makePlayerMove(this.selected, sq, tgt.promotion);
            return;
        }
        var p2 = this.pieceAt(sq);
        if (p2 && p2.color === this.playerColor) {
            this.selected = sq;
            this.legalTargets = this.chess.moves({ square: sq, verbose: true })
                .map(function (m) { return { to: m.to, promotion: m.promotion }; });
            this.renderBoard();
            return;
        }
        this.selected = null;
        this.legalTargets = [];
        this.renderBoard();
    };

    ChessGame.prototype.makePlayerMove = function (from, to, promotion) {
        var mv = promotion ? { from: from, to: to, promotion: 'q' } : { from: from, to: to };
        var m = this.chess.move(mv);
        if (!m) return;
        this.lastMove = { from: from, to: to };
        this.log.push({ who: '你', san: m.san });
        this.selected = null;
        this.legalTargets = [];
        this.renderAll();
        this.afterMove();
    };

    ChessGame.prototype.afterMove = function () {
        if (this.chess.game_over()) { this.endGame(); return; }
        if (this.chess.turn() === this.computerColor) {
            this.updateStatus();
            this.scheduleAI();
        } else {
            this.updateStatus();
        }
    };

    ChessGame.prototype.scheduleAI = function () {
        var self = this;
        var seq = this._seq;
        setTimeout(function () {
            if (seq !== self._seq) return;
            if (self.gameEnded) return;
            if (!self.boardEl || !document.body.contains(self.boardEl)) return;
            if (self.chess.turn() !== self.computerColor) return;
            var mv = self.chooseAIMove();
            if (!mv) return;
            var m = self.chess.move(mv);
            if (!m) return;
            self.lastMove = { from: mv.from, to: mv.to };
            self.log.push({ who: '电脑', san: m.san });
            self.renderAll();
            self.afterMove();
        }, 480);
    };

    // ---------- 电脑走法（minimax + alpha-beta，强度2）----------
    ChessGame.prototype.evalSTM = function (chess) {
        var board = chess.board();
        var s = 0;
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                var cell = board[r][c];
                if (!cell) continue;
                var v = PIECE_VAL[cell.type];
                if (cell.type === 'p') {
                    var rankNum = 8 - r;
                    var adv = cell.color === 'w' ? (rankNum - 1) : (6 - (rankNum - 1));
                    v += adv * 8; // 兵向前推进略有价值
                }
                s += cell.color === 'w' ? v : -v;
            }
        }
        return chess.turn() === 'w' ? s : -s;
    };

    ChessGame.prototype.negamax = function (chess, depth, alpha, beta) {
        if (depth === 0) return this.evalSTM(chess);
        var moves = chess.moves();
        if (!moves.length) {
            if (chess.in_check()) return -MATE + (this.aiDepth - depth);
            return 0;
        }
        var best = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            chess.move(moves[i]);
            var val = -this.negamax(chess, depth - 1, -beta, -alpha);
            chess.undo();
            if (val > best) best = val;
            if (best > alpha) alpha = best;
            if (alpha >= beta) break;
        }
        return best;
    };

    ChessGame.prototype.chooseAIMove = function () {
        var moves = this.chess.moves({ verbose: true });
        if (moves.length === 1) return { from: moves[0].from, to: moves[0].to };
        // 强度2：偶尔走随机（像会犯错的弱对手）
        if (Math.random() < 0.12) {
            var r = moves[Math.floor(Math.random() * moves.length)];
            return { from: r.from, to: r.to, promotion: r.promotion };
        }
        var best = -Infinity;
        var bestMoves = [];
        for (var i = 0; i < moves.length; i++) {
            var m = moves[i];
            this.chess.move(m);
            var v = -this.negamax(this.chess, this.aiDepth - 1, -Infinity, Infinity);
            this.chess.undo();
            if (v > best + 0.001) { best = v; bestMoves = [m]; }
            else if (Math.abs(v - best) <= 60) { bestMoves.push(m); }
        }
        var pick = bestMoves[Math.floor(Math.random() * bestMoves.length)];
        return { from: pick.from, to: pick.to, promotion: pick.promotion };
    };

    // ---------- 结束 ----------
    ChessGame.prototype.endGame = function () {
        this.gameEnded = true;
        var txt;
        if (this.chess.in_checkmate()) {
            txt = this.chess.turn() === this.playerColor
                ? '😢 你将死了，电脑获胜！'
                : '🎉 你将死电脑，你赢了！';
        } else if (this.chess.in_stalemate()) {
            txt = '🤝 和棋（无子可动）';
        } else {
            txt = '🤝 和棋';
        }
        this.statusEl.innerHTML = '<b>' + txt + '</b> ｜ <span class="chess-replay">点「重新开始」再来一局</span>';
        if (this.app && this.app.showToast) this.app.showToast(txt);
    };

    global.ChessGame = ChessGame;
})(typeof window !== 'undefined' ? window : this);
