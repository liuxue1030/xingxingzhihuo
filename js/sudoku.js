/* ============================================================
 * 数独生成器（纯前端，无依赖）
 * 支持 4x4（2x2 宫）、6x6（2x3 宫）、9x9（3x3 宫）
 * 每个难度挖掉不同数量的空格；正确性判定为「合法完整数独 + 与原题线索一致」，
 * 这样即使题目存在多个解，玩家的合法解答也算正确。
 * ============================================================ */
(function (global) {
    'use strict';

    function boxDims(n) {
        if (n === 4) return { boxR: 2, boxC: 2 };
        if (n === 6) return { boxR: 2, boxC: 3 };
        return { boxR: 3, boxC: 3 }; // 9
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
    }

    function isValid(grid, n, boxR, boxC, r, c, v) {
        for (let i = 0; i < n; i++) {
            if (grid[r][i] === v) return false;
            if (grid[i][c] === v) return false;
        }
        const br = Math.floor(r / boxR) * boxR;
        const bc = Math.floor(c / boxC) * boxC;
        for (let i = 0; i < boxR; i++) {
            for (let j = 0; j < boxC; j++) {
                if (grid[br + i][bc + j] === v) return false;
            }
        }
        return true;
    }

    function fillGrid(grid, n, boxR, boxC) {
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (grid[r][c] === 0) {
                    const candidates = shuffle(Array.from({ length: n }, (_, i) => i + 1));
                    for (const v of candidates) {
                        if (isValid(grid, n, boxR, boxC, r, c, v)) {
                            grid[r][c] = v;
                            if (fillGrid(grid, n, boxR, boxC)) return true;
                            grid[r][c] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function generateSolved(n) {
        const { boxR, boxC } = boxDims(n);
        const grid = Array.from({ length: n }, () => new Array(n).fill(0));
        fillGrid(grid, n, boxR, boxC);
        return grid;
    }

    // 各规格 × 难度的挖空数量
    function blankCount(n, difficulty) {
        const map = {
            4: { easy: 4, medium: 7, hard: 10 },
            6: { easy: 10, medium: 16, hard: 22 },
            9: { easy: 30, medium: 42, hard: 52 }
        };
        return (map[n] && map[n][difficulty]) || 0;
    }

    function generatePuzzle(n, difficulty) {
        const solution = generateSolved(n);
        const puzzle = solution.map(row => row.slice());
        const blanks = blankCount(n, difficulty);
        const positions = shuffle(Array.from({ length: n * n }, (_, i) => i)).slice(0, blanks);
        positions.forEach(p => {
            const r = Math.floor(p / n), c = p % n;
            puzzle[r][c] = 0;
        });
        return { solution, puzzle };
    }

    function isValidSudoku(grid, n, boxR, boxC) {
        for (let r = 0; r < n; r++) {
            const seen = new Set();
            for (let c = 0; c < n; c++) {
                const v = grid[r][c];
                if (!v || v < 1 || v > n) return false;
                if (seen.has(v)) return false;
                seen.add(v);
            }
        }
        for (let c = 0; c < n; c++) {
            const seen = new Set();
            for (let r = 0; r < n; r++) {
                const v = grid[r][c];
                if (seen.has(v)) return false;
                seen.add(v);
            }
        }
        for (let br = 0; br < n; br += boxR) {
            for (let bc = 0; bc < n; bc += boxC) {
                const seen = new Set();
                for (let i = 0; i < boxR; i++) {
                    for (let j = 0; j < boxC; j++) {
                        const v = grid[br + i][bc + j];
                        if (seen.has(v)) return false;
                        seen.add(v);
                    }
                }
            }
        }
        return true;
    }

    // 玩家解答是否算正确：所有原题线索必须一致，且整体是合法完整数独
    function isPuzzleCorrect(puzzle, userGrid, n) {
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (puzzle[r][c] !== 0 && userGrid[r][c] !== puzzle[r][c]) return false;
            }
        }
        const { boxR, boxC } = boxDims(n);
        return isValidSudoku(userGrid, n, boxR, boxC);
    }

    global.SudokuGen = {
        generatePuzzle: generatePuzzle,
        isPuzzleCorrect: isPuzzleCorrect,
        boxDims: boxDims,
        blankCount: blankCount
    };
})(window);
