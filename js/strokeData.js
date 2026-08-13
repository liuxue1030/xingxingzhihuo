/* ============================================================
 * 汉字笔顺数据层（联网查询版）
 * ------------------------------------------------------------
 * loadHanziData(ch)：对接第三方笔顺接口
 *   - hanzi-writer-data：矢量笔画轮廓（strokes）+ 中线（medians）
 *   - cnchar：笔画名称 + 笔顺编码
 * 坐标系说明：hanzi-writer-data 以 1024x1024 画布、左下为原点、
 *   y 轴向上。渲染到 SVG（y 轴向下）需做垂直翻转，统一在
 *   SVG 组上通过 transform="scale(1,-1) translate(0,-1024)" 完成。
 * ============================================================ */

// 中线点集 -> SVG path d
function medianToPath(pts) {
    if (!pts || !pts.length) return '';
    let d = 'M ' + pts[0][0] + ' ' + pts[0][1];
    for (let i = 1; i < pts.length; i++) d += ' L ' + pts[i][0] + ' ' + pts[i][1];
    return d;
}

// 第三方接口：cnchar 笔画名称（按需懒加载）
let _cncharPromise = null;
function ensureCnchar() {
    if (window.cnchar && window.cnchar.stroke) return Promise.resolve();
    if (_cncharPromise) return _cncharPromise;
    _cncharPromise = new Promise((resolve) => {
        const load = (src, ok) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = ok;
            s.onerror = () => resolve();
            document.head.appendChild(s);
        };
        load('https://cdn.jsdelivr.net/npm/cnchar/cnchar.min.js', () => {
            load('https://cdn.jsdelivr.net/npm/cnchar.stroke/cnchar.stroke.min.js', () => resolve());
        });
    });
    return _cncharPromise;
}

// hanzi-writer-data 的轮廓 path 已经自带缩放，这里统一按 1024 画布处理
// 渲染层会统一做垂直翻转
async function loadHanziData(ch) {
    try {
        const url = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + encodeURIComponent(ch) + '.json';
        const res = await fetch(url);
        if (!res.ok) return null;
        const j = await res.json();
        const medians = j.medians || [];
        const outlines = j.strokes || [];
        const count = Math.max(medians.length, outlines.length);
        let names = [];
        let order = '';
        try {
            await ensureCnchar();
            if (window.cnchar && window.cnchar.stroke) {
                names = window.cnchar.stroke(ch, 'name', 'array') || [];
                order = window.cnchar.stroke(ch, 'order') || '';
            }
        } catch (e) { /* 联网但取名称失败，降级处理 */ }
        if (!names || !names.length) names = new Array(count).fill(0).map((_, i) => '第 ' + (i + 1) + ' 笔');
        return {
            char: ch,
            source: 'remote',
            medians: medians,
            outlines: outlines,
            names: names.slice(0, count),
            count: count,
            order: String(order || '')
        };
    } catch (e) {
        return null;
    }
}

window.medianToPath = medianToPath;
window.loadHanziData = loadHanziData;
window.ensureCnchar = ensureCnchar;
