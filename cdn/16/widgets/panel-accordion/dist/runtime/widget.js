System.register(["jimu-core/emotion","jimu-core","jimu-arcgis"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__, "__esModule", { value: true });
	return {
		setters: [
			function(module) {
				__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_core__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_core__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./your-extensions/widgets/panel-accordion/src/runtime/popup-card.ts"
/*!***************************************************************************!*\
  !*** ./your-extensions/widgets/panel-accordion/src/runtime/popup-card.ts ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bivCardHtml: () => (/* binding */ bivCardHtml),
/* harmony export */   bivPalette: () => (/* binding */ bivPalette),
/* harmony export */   classNames: () => (/* binding */ classNames),
/* harmony export */   modernCardHtml: () => (/* binding */ modernCardHtml),
/* harmony export */   pairFillHtml: () => (/* binding */ pairFillHtml),
/* harmony export */   pressureRamp: () => (/* binding */ pressureRamp),
/* harmony export */   resourceRamp: () => (/* binding */ resourceRamp),
/* harmony export */   scalesHtml: () => (/* binding */ scalesHtml),
/* harmony export */   vmsCardHtml: () => (/* binding */ vmsCardHtml)
/* harmony export */ });
const bivPalette = {
    '1': '#f2f2f2', // Low P, Low R
    '2': '#ced995', // Low P, Med R
    '3': '#a8be38', // Low P, High R
    '4': '#dab6e9', // Med P, Low R
    '5': '#ad9c8f', // Med P, Med R
    '6': '#7d926d', // Med P, High R
    '7': '#c579db', // High P, Low R
    '8': '#7b70aa', // High P, Med R
    '9': '#4e649e' // High P, High R
};
const pressureRamp = { '1': '#f2f2f2', '2': '#dab6e9', '3': '#c579db' };
const resourceRamp = { '1': '#f2f2f2', '2': '#ced995', '3': '#a8be38' };
const classNames = { '1': 'Low', '2': 'Med', '3': 'High' };
const fmt = (v) => (v == null || v === '') ? '—' : Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 });
// One pair's service name puts the resource first (its pressure is the saltwater front);
// display it pressure-first like every other pair. The service value stays for queries.
const pairDisplay = (pair) => String(pair !== null && pair !== void 0 ? pair : '') === 'Agriculture x Salinity' ? 'Salinity x Agriculture' : String(pair !== null && pair !== void 0 ? pair : '');
// Port of the shared bivariate Arcade popup; null when attrs are not a conflict-pair feature.
const vmsCardHtml = (attrs) => {
    var _a, _b;
    if (attrs.pair == null && attrs.biv_class == null) {
        return null;
    }
    const cls = String((_a = attrs.biv_class) !== null && _a !== void 0 ? _a : '');
    const chip = (_b = bivPalette[cls]) !== null && _b !== void 0 ? _b : '#cbd5e1';
    const bivText = (attrs.biv_label == null || attrs.biv_label === 'No data') ? 'No data on either axis' : String(attrs.biv_label);
    const row = (name, val, clazz, highBreak, ramp) => {
        var _a, _b;
        let pct = 0;
        if (val != null && val !== '' && highBreak != null && Number(highBreak) > 0) {
            pct = Math.round(Math.min(100, Math.max(0, (Number(val) / Number(highBreak)) * 100)));
        }
        const disp = (val == null || val === '') ? 'N/A' : String(Math.round(Number(val) * 100) / 100);
        const clsStr = String(clazz !== null && clazz !== void 0 ? clazz : '');
        const className = (_a = classNames[clsStr]) !== null && _a !== void 0 ? _a : 'No data';
        let barColor = (_b = ramp[clsStr]) !== null && _b !== void 0 ? _b : '#94a3b8';
        if (val == null || val === '' || Number(val) <= 0) {
            barColor = '#94a3b8';
        }
        return `
      <div style="margin-bottom:12px; padding:12px; background:transparent; border:1px solid #e2e8f0; border-left:4px solid ${barColor}; border-radius:10px;">
        <div style="display:flex; justify-content:space-between; align-items:baseline;">
          <div style="font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">${name}</div>
          <div style="text-align:right;">
            <span style="font-size:20px; font-weight:900; color:#1e293b;">${disp}</span>
          </div>
        </div>
        <div style="font-size:10px; color:#94a3b8; margin-top:2px;">Class: ${className}</div>
        <div style="width:100%; height:8px; border-radius:4px; background:#f1f5f9; margin-top:8px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:${barColor};"></div>
        </div>
      </div>`;
    };
    return `
    <div style="font-family:'Segoe UI',system-ui,sans-serif; padding:2px; background:transparent; border-radius:12px;">
      <div style="margin-bottom:12px; padding:12px 14px; background:transparent; border:1px solid #e2e8f0; border-bottom:3px solid ${chip}; border-radius:12px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="flex:1;">
            <h2 style="margin:0; font-size:15px; font-weight:900; color:#0f172a;">${pairDisplay(attrs.pair)}</h2>
            <div style="margin-top:4px; font-size:11px; color:#475569;">${bivText}</div>
          </div>
          <span style="background:${chip}; width:18px; height:18px; border-radius:4px; display:inline-block; margin-left:10px; flex-shrink:0;"></span>
        </div>
      </div>
      ${row('Pressure - ' + attrs.pressure_name, attrs.pressure, attrs.Pressure_Level, attrs.pressure_break_high, pressureRamp)}
      ${row('Resource - ' + attrs.resource_name, attrs.resource, attrs.Resource_Level, attrs.resource_break_high, resourceRamp)}
      <div style="margin-top:12px; padding:12px; background:transparent; border:1px solid #e2e8f0; border-radius:8px; font-size:10px; color:#475569; line-height:1.5;">
        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
          <span style="background:#e2e8f0; color:#334155; padding:2px 6px; border-radius:4px; font-size:9px; font-weight:600;">Resource: ${attrs.resource_name}</span>
          <span style="background:#e2e8f0; color:#334155; padding:2px 6px; border-radius:4px; font-size:9px; font-weight:600;">Pressure: ${attrs.pressure_name}</span>
        </div>
        <div>Bars reflect value relative to the upper class break. <strong style="color:#4e649e;">Dark indigo</strong> cells mark high conflict overlap.</div>
      </div>
    </div>`;
};
// Chart-datum variant: one cell's reading as a measurement record — serif numerals,
// the 3×3 bivariate matrix with the current cell ringed, hairlines instead of cards.
const modernCardHtml = (attrs, info, max) => {
    var _a, _b;
    const cls = String((_a = attrs.biv_class) !== null && _a !== void 0 ? _a : '');
    const active = /^[1-9]$/.test(cls) ? Number(cls) : -1;
    const chip = /^[1-9]$/.test(cls) ? bivPalette[cls] : null;
    const bivText = (attrs.biv_label == null || attrs.biv_label === 'No data') ? 'No data on either axis' : String(attrs.biv_label);
    // Esri-style rotated bivariate legend, drawn as diamonds on a 45° lattice so cells
    // never overlap (a rotated grid of squares would let later cells paint over the ring).
    // Rows = pressure High→Low, cols = resource Low→High: Low-Low sits at the bottom corner,
    // High-High at the top, resource (green) toward the upper-right, pressure (purple) upper-left.
    const cellNames = ['Low', 'Med', 'High'];
    const u = 12.5; // lattice step in px
    const cells = [];
    for (let p = 2; p >= 0; p--) {
        for (let r = 0; r < 3; r++) {
            const idx = p * 3 + r + 1;
            const x = (r - p) * u;
            const y = (2 - r - p) * u;
            // Ambient highlight: dim the inactive cells and let the active one glow in its own
            // chip color instead of boxing it in ink. No dimming when there is no active cell.
            const ring = idx === active
                ? `box-shadow:0 0 0 1.5px #ffffff,0 0 6px 2px ${chip !== null && chip !== void 0 ? chip : '#4e649e'}66;z-index:1;`
                : (active !== -1 ? 'opacity:0.45;' : '');
            cells.push(`<div title="Pressure ${cellNames[p]}, resource ${cellNames[r]}" style="position:absolute;left:${x + 28}px;top:${y + 28}px;width:12px;height:12px;border:1px solid #d5dde6;background:${(_b = bivPalette[idx]) !== null && _b !== void 0 ? _b : '#cbd5e1'};transform:rotate(45deg);${ring}"></div>`);
        }
    }
    const matrix = `
    <div title="Bivariate conflict matrix" style="position:relative;width:68px;height:68px;margin:10px auto 0;">
      ${cells.join('')}
    </div>`;
    const axisRow = (name, val, clazz, lowBreak, highBreak, accent, ramp, unit, maxVal) => {
        var _a;
        const loNum = (lowBreak != null && Number(lowBreak) > 0) ? Number(lowBreak) : 0;
        const breakNum = (highBreak != null && Number(highBreak) > 0) ? Number(highBreak) : NaN;
        const numVal = (val != null && val !== '' && !Number.isNaN(Number(val))) ? Number(val) : NaN;
        const disp = fmt(val);
        const missing = disp === '—';
        const clsStr = String(clazz !== null && clazz !== void 0 ? clazz : '');
        const hasClass = classNames[clsStr] != null;
        const className = hasClass ? classNames[clsStr] : 'no data';
        // Dot uses the axis ramp color (Low/Med/High legend colors), not the pill accent.
        const dotColor = hasClass ? ((_a = ramp[clsStr]) !== null && _a !== void 0 ? _a : accent) : '#94a3b8';
        // Single-class progress bar: the fill runs from the left edge to the value's position
        // inside the current class, the rest stays a light track. Quantile classes are
        // equal-count, not equal-span, so within-class position is the legible reading;
        // the absolute scale lives in the pair profile.
        const hasBar = (clsStr === '1' && loNum > 0) || ((clsStr === '2' || clsStr === '3') && !Number.isNaN(breakNum));
        const barTitle = clsStr === '1' ? `Low ≤ ${fmt(loNum)}`
            : clsStr === '2' ? `Med ${fmt(loNum)}–${fmt(breakNum)}`
                : clsStr === '3' ? (maxVal != null && maxVal > breakNum ? `High ${fmt(breakNum)}–${fmt(maxVal)} (max)` : `High > ${fmt(breakNum)}`)
                    : '';
        const clampPct = (x) => Math.round(Math.min(100, Math.max(0, x * 100)));
        let tickPct = null;
        if (!missing && !Number.isNaN(numVal)) {
            if (clsStr === '1' && loNum > 0)
                tickPct = clampPct(numVal / loNum);
            else if (clsStr === '2' && !Number.isNaN(breakNum) && breakNum > loNum)
                tickPct = clampPct((numVal - loNum) / (breakNum - loNum));
            // High needs the layer max to bound its bracket; without it there is no scale to tick on.
            else if (clsStr === '3' && maxVal != null && maxVal > breakNum)
                tickPct = clampPct((numVal - breakNum) / (maxVal - breakNum));
        }
        // Edge labels name the bar's own scale: the class bracket's left and right ends.
        let leftLabel = null;
        let rightLabel = null;
        if (clsStr === '1' && loNum > 0) {
            leftLabel = '0';
            rightLabel = fmt(loNum);
        }
        else if (clsStr === '2' && !Number.isNaN(breakNum)) {
            leftLabel = fmt(loNum);
            rightLabel = fmt(breakNum);
        }
        else if (clsStr === '3' && !Number.isNaN(breakNum)) {
            leftLabel = fmt(breakNum);
            rightLabel = (maxVal != null && maxVal > breakNum) ? fmt(maxVal) : null;
        }
        // Fill uses the class ramp; Low's near-white ramp would vanish against the light track,
        // so it takes a slate fill instead. The tick is a solid cap in the same color with a
        // thin white ring — it punches out of the fill and reads on the light track — clamped
        // inside the bar so it never hangs off the rounded end (value 0 / value max).
        const fillColor = clsStr === '1' ? '#cbd5e1' : ramp[clsStr];
        return `
      <div style="padding:0 2px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <span style="display:inline-block;background:${accent};color:#ffffff;border-radius:12px;padding:2px 9px;font-size:10.5px;font-weight:700;">${name}</span>
          <div style="font-size:11px;color:${hasClass ? '#334155' : '#94a3b8'};white-space:nowrap;">
            <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${dotColor};border:${hasClass ? '1px solid #b3becb' : 'none'};margin-right:5px;vertical-align:1px;"></span>${className}
          </div>
        </div>
        <div style="margin-top:4px;font-size:11px;color:#64748b;display:flex;align-items:baseline;">
          <span style="font-size:26px;font-weight:700;color:${missing ? '#94a3b8' : '#1f2937'};line-height:1.15;">${disp}</span>
          ${unit && !missing ? `<span style="margin-left:6px;">${unit}</span>` : ''}
        </div>
        <div style="position:relative;margin-top:6px;height:8px;">
          ${hasBar ? `<div title="${barTitle}" style="height:100%;background:#eef2f6;border:1px solid #d5dde6;border-radius:999px;overflow:hidden;">${tickPct != null ? `<div style="height:100%;width:${tickPct}%;background:${fillColor};border-radius:999px 0 0 999px;"></div>` : ''}</div>` : ''}
          ${tickPct != null ? `<div style="position:absolute;left:max(0px,min(calc(${tickPct}% - 5px),calc(100% - 10px)));top:-1px;width:10px;height:10px;border-radius:50%;background:${fillColor};border:1.5px solid #ffffff;"></div>` : ''}
        </div>
        ${leftLabel != null ? `<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:#94a3b8;"><span>${leftLabel}</span><span>${rightLabel !== null && rightLabel !== void 0 ? rightLabel : ''}</span></div>` : ''}
      </div>`;
    };
    return `
    <div style="font-family:'Segoe UI',system-ui,sans-serif;color:#1f2937;">
      <div style="font-size:15px;font-weight:800;line-height:1.3;">${pairDisplay(attrs.pair)}</div>
      <div style="margin-top:2px;font-size:11px;color:#64748b;line-height:1.4;">${bivText}</div>
      ${matrix}
      <div style="height:1px;background:var(--sys-color-divider-primary, #e2e8f0);margin:10px 0;"></div>
      ${axisRow('Pressure — ' + attrs.pressure_name, attrs.pressure, attrs.Pressure_Level, attrs.pressure_break_low, attrs.pressure_break_high, '#c57ade', pressureRamp, info === null || info === void 0 ? void 0 : info.pressureUnit, max === null || max === void 0 ? void 0 : max.pressure)}
      <div style="height:1px;background:var(--sys-color-divider-primary, #e2e8f0);margin:10px 0;"></div>
      ${axisRow('Resource — ' + attrs.resource_name, attrs.resource, attrs.Resource_Level, attrs.resource_break_low, attrs.resource_break_high, '#a9bf39', resourceRamp, info === null || info === void 0 ? void 0 : info.resourceUnit, max === null || max === void 0 ? void 0 : max.resource)}
      <div style="height:1px;background:var(--sys-color-divider-primary, #e2e8f0);margin:10px 0;"></div>
      <div style="font-size:10px;color:#94a3b8;line-height:1.5;">
        Bars show position within the current class; the Value scales section (Info tab) holds the full range. <span style="color:#4e649e;font-weight:600;">Dark indigo</span> marks the strongest conflict overlap.
      </div>
    </div>`;
};
// Absolute-scale bars that slot into the Value scales accordion (Info tab): segmented
// by real class ranges, every boundary labeled. Not per-cell, so no tick or click logic.
const scalesHtml = (attrs, max) => {
    const num = (v) => (v != null && v !== '' && !Number.isNaN(Number(v)) && Number(v) > 0) ? Number(v) : null;
    const loP = num(attrs.pressure_break_low);
    const hiP = num(attrs.pressure_break_high);
    const loR = num(attrs.resource_break_low);
    const hiR = num(attrs.resource_break_high);
    if (hiP == null && hiR == null) {
        return null;
    }
    // Plain labels, no pills — the accordion already names the axes with its own pills.
    // Text is grayed to popup-microcopy weight so the bars do the talking.
    const row = (label, lo, hi, ramp, maxVal) => {
        const seg = (grow, color, title) => grow > 0 ? `<div title="${title}" style="flex:${grow} 1 0;background:${color};border:1px solid #d5dde6;border-radius:2px;"></div>` : '';
        const loGrow = lo !== null && lo !== void 0 ? lo : 0;
        const medGrow = hi != null ? hi - (lo !== null && lo !== void 0 ? lo : 0) : 0;
        const hiGrow = hi != null && maxVal != null && maxVal > hi ? maxVal - hi : 0;
        const caption = [
            lo != null ? `Low ≤ ${fmt(lo)}` : null,
            hi != null ? `Med ${fmt(lo !== null && lo !== void 0 ? lo : 0)}–${fmt(hi)}` : null,
            hi != null ? `High > ${fmt(hi)}` : null,
            maxVal != null && maxVal > 0 ? `max ${fmt(maxVal)}` : null
        ].filter(Boolean).join(' · ');
        return `
      <div style="margin-top:10px;">
        <div style="font-size:10px;font-weight:600;color:#94a3b8;">${label}</div>
        <div style="margin-top:4px;display:flex;gap:2px;height:8px;">
          ${seg(loGrow, ramp['1'], `Low ≤ ${fmt(lo !== null && lo !== void 0 ? lo : 0)}`)}
          ${seg(medGrow, ramp['2'], `Med ${fmt(lo !== null && lo !== void 0 ? lo : 0)}–${fmt(hi !== null && hi !== void 0 ? hi : 0)}`)}
          ${seg(hiGrow, ramp['3'], `High > ${fmt(hi !== null && hi !== void 0 ? hi : 0)}`)}
        </div>
        <div style="margin-top:4px;font-size:10px;color:#94a3b8;">${caption}</div>
      </div>`;
    };
    return `
    ${row('Pressure', loP, hiP, pressureRamp, max === null || max === void 0 ? void 0 : max.pressure)}
    ${row('Resource', loR, hiR, resourceRamp, max === null || max === void 0 ? void 0 : max.resource)}
    <div style="margin-top:10px;font-size:10px;color:#94a3b8;line-height:1.5;">The full 0-to-max value scale behind the conflict map, cut at the class breaks. Uneven segments reflect a skewed distribution: cells bunch at one end of the scale while a thin tail of extreme cells stretches the other; the popup bar zooms into a single class segment.</div>`;
};
// One APNEP boundary silhouette whose fill toggles among the pair section's four stats.
// Path: APNEP_Boundary_0410 feature service, native NC state-plane (32119) meters —
// conformal, so the silhouette keeps its true proportions; simplified to 187 points and
// uniformly scaled into a 204x118 box. Shares arrive from the pair section's stats text
// (widget.tsx parses them), so figure and numbers can't drift. Injected HTML never runs
// <script>, but inline handler attributes do — they call the one ppSet global in widget.tsx.
const apnepPath = 'M 104.1 0.0 L 106.2 1.8 L 106.8 3.6 L 110.2 4.1 L 111.7 5.3 L 113.7 3.7 L 113.9 1.9 L 114.9 3.1 L 115.7 2.6 L 118.1 5.1 L 119.5 4.8 L 119.3 5.4 L 120.5 5.5 L 121.9 7.4 L 122.8 7.6 L 124.0 11.5 L 122.7 14.0 L 123.3 16.7 L 121.9 18.9 L 121.9 20.6 L 121.1 21.0 L 122.6 23.1 L 124.2 23.4 L 124.6 25.0 L 127.4 25.1 L 129.4 24.0 L 129.8 22.3 L 131.0 21.8 L 130.6 20.1 L 131.5 19.8 L 134.9 20.6 L 136.8 23.3 L 141.5 24.9 L 142.4 22.7 L 141.9 20.4 L 143.2 18.5 L 143.8 18.0 L 144.6 18.7 L 147.2 18.7 L 148.1 17.7 L 148.9 18.2 L 150.0 16.5 L 153.8 27.7 L 157.8 43.1 L 169.7 68.4 L 170.4 73.0 L 168.8 86.9 L 168.3 88.6 L 167.6 87.9 L 165.9 88.0 L 159.4 90.5 L 153.9 93.5 L 151.3 96.4 L 148.8 97.3 L 138.0 108.4 L 133.9 114.4 L 132.5 118.0 L 131.7 116.4 L 131.9 115.8 L 132.0 116.6 L 132.7 116.5 L 132.1 115.3 L 127.2 113.1 L 120.4 113.5 L 111.2 115.9 L 111.7 114.7 L 111.1 114.4 L 111.4 112.7 L 110.6 110.7 L 108.8 109.6 L 108.0 108.4 L 108.5 107.2 L 107.7 107.3 L 107.0 105.0 L 105.2 103.2 L 103.0 102.7 L 101.6 103.9 L 96.6 101.4 L 91.6 100.8 L 90.2 101.4 L 87.7 99.2 L 88.0 98.2 L 87.3 97.8 L 87.8 96.1 L 86.8 93.5 L 81.7 90.1 L 78.1 89.7 L 77.7 90.5 L 76.2 90.6 L 74.9 92.7 L 74.1 91.3 L 72.0 90.5 L 70.1 90.9 L 66.1 87.7 L 63.9 89.2 L 60.1 88.7 L 58.9 87.2 L 60.5 85.0 L 58.3 84.2 L 57.6 81.2 L 56.0 81.1 L 54.1 78.4 L 51.2 76.8 L 49.9 74.2 L 47.7 73.9 L 47.1 72.5 L 47.9 70.6 L 47.1 68.1 L 47.5 66.4 L 46.4 64.1 L 47.5 63.0 L 46.7 59.8 L 47.6 58.2 L 43.1 54.8 L 38.9 55.5 L 38.7 54.6 L 36.8 55.3 L 35.6 54.4 L 34.5 54.8 L 33.5 52.8 L 34.5 51.0 L 34.3 46.3 L 37.1 46.0 L 37.3 43.5 L 39.9 41.4 L 41.5 38.3 L 42.4 39.3 L 44.0 38.5 L 44.5 39.4 L 45.7 39.6 L 47.8 37.0 L 50.2 37.7 L 50.8 37.3 L 51.6 38.4 L 55.1 39.6 L 56.9 38.9 L 58.2 39.1 L 59.2 40.3 L 61.5 40.2 L 62.8 41.6 L 65.5 39.9 L 65.4 38.8 L 67.3 37.1 L 71.1 35.9 L 73.1 36.5 L 75.4 35.9 L 78.0 37.1 L 79.7 36.1 L 85.2 38.2 L 87.3 35.1 L 89.5 34.7 L 89.2 32.9 L 86.8 32.1 L 86.0 32.6 L 84.0 31.5 L 84.1 30.2 L 82.6 28.8 L 79.4 28.4 L 78.0 26.2 L 74.3 25.5 L 70.8 21.4 L 67.9 21.5 L 63.2 19.4 L 61.9 20.0 L 61.7 19.4 L 60.4 19.5 L 58.5 15.4 L 59.8 14.6 L 60.2 7.7 L 62.6 7.8 L 64.6 6.7 L 65.9 6.8 L 66.2 5.2 L 67.9 4.4 L 69.0 2.6 L 72.3 2.8 L 77.3 7.8 L 80.4 5.4 L 86.3 4.8 L 90.8 3.1 L 92.1 1.7 L 94.8 3.2 L 97.8 3.2 L 101.8 0.6 L 102.5 1.0 L 103.1 0.0 L 104.1 0.0 Z';
const apnepBox = { x: 33.5, w: 137, h: 118 };
// Order matches the pair section's stats text: coverage, pressure, resource, conflict.
const ppStats = [
    { label: 'Data coverage', color: '#64748b' },
    { label: 'High pressure', color: '#c57ade' },
    { label: 'High resource', color: '#a8be38' },
    { label: 'Conflict', color: '#4e649e' }
];
const pairFillHtml = (shares, uid = 'pp') => {
    if (shares.length < ppStats.length) {
        return null;
    }
    // Unique clip id: several views can mount this same svg at once, and duplicate
    // ids break url(#...) resolution — a lost clip shows the raw rectangle.
    // Coverage is a region share already; the other stats are shares of the mapped cells,
    // so they scale by coverage — the fill always means "share of the APNEP region".
    const regionPct = (i) => (i === 0 ? shares[0] : shares[i] * shares[0] / 100);
    const statText = (i) => {
        if (i === 0) {
            return `${shares[0]}% of region cells`;
        }
        const rp = regionPct(i);
        return `${shares[i]}% of mapped cells · ${(rp >= 0.05 ? rp.toFixed(1) : '<0.1')}% of region`;
    };
    const chip = (i) => {
        const h = Math.max(0, Math.min(100, regionPct(i))) / 100 * apnepBox.h;
        const s = ppStats[i];
        return `<span onclick="ppSet(this)" data-y="${(apnepBox.h - h).toFixed(1)}" data-h="${h.toFixed(1)}" data-c="${s.color}" data-t="${statText(i)}" style="white-space:nowrap;cursor:pointer;border-radius:999px;padding:3px 9px;font-size:10.5px;font-weight:700;background:${i === 0 ? s.color : '#eef2f6'};color:${i === 0 ? '#ffffff' : '#334155'};">${s.label}</span>`;
    };
    const h0 = Math.max(0, Math.min(100, regionPct(0))) / 100 * apnepBox.h;
    const clipId = `ppClip-${uid}`;
    return `
    <div data-pp style="margin-top:10px;display:flex;gap:8px;align-items:flex-start;">
      <div style="flex:1;min-width:0;">
        <svg viewBox="0 0 204 118" style="width:100%;display:block;">
          <defs><clipPath id="${clipId}"><path d="${apnepPath}"/></clipPath></defs>
          <path d="${apnepPath}" fill="#f1f5f9" stroke="#94a3b8" stroke-width="0.8"/>
          ${h0 > 0.05 ? `<rect data-fill x="${apnepBox.x}" y="${(apnepBox.h - h0).toFixed(1)}" width="${apnepBox.w}" height="${h0.toFixed(1)}" fill="${ppStats[0].color}" opacity="0.9" clip-path="url(#${clipId})"/>` : ''}
          <path d="${apnepPath}" fill="none" stroke="#94a3b8" stroke-width="0.8"/>
        </svg>
        <div style="margin-top:4px;font-size:11px;font-weight:800;"><span data-num style="color:${ppStats[0].color};">${statText(0)}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">${ppStats.map((_, i) => chip(i)).join('')}</div>
    </div>`;
};
const bivCardHtml = (attrs, variant = 'vms', info, max) => {
    if (attrs.pair == null && attrs.biv_class == null) {
        return null;
    }
    return variant === 'modern' ? modernCardHtml(attrs, info, max) : vmsCardHtml(attrs);
};


/***/ },

/***/ "jimu-arcgis"
/*!******************************!*\
  !*** external "jimu-arcgis" ***!
  \******************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__;

/***/ },

/***/ "jimu-core"
/*!****************************!*\
  !*** external "jimu-core" ***!
  \****************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;

/***/ },

/***/ "@emotion/react/jsx-runtime"
/*!************************************!*\
  !*** external "jimu-core/emotion" ***!
  \************************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./jimu-core/lib/set-public-path.ts ***!
  \******************************************/
/**
 * Webpack will replace __webpack_public_path__ with __webpack_require__.p to set the public path dynamically.
 * The reason why we can't set the publicPath in webpack config is: we change the publicPath when download.
 * */
__webpack_require__.p = window.jimuConfig.baseUrl;

})();

// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!************************************************************************!*\
  !*** ./your-extensions/widgets/panel-accordion/src/runtime/widget.tsx ***!
  \************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (/* binding */ Widget)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_arcgis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-arcgis */ "jimu-arcgis");
/* harmony import */ var _popup_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./popup-card */ "./your-extensions/widgets/panel-accordion/src/runtime/popup-card.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

/** @jsx jsx */



const basePill = {
    display: 'inline-block',
    color: '#ffffff',
    borderRadius: '12px',
    padding: '2px 10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    listStyle: 'none'
};
const ignoredAttr = /^(FID|OBJECTID|GlobalID|Shape)/i;
let ppUidCounter = 0;
window.ppSet = (chip) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const root = chip.closest('[data-pp]');
    const fill = root === null || root === void 0 ? void 0 : root.querySelector('[data-fill]');
    const num = root === null || root === void 0 ? void 0 : root.querySelector('[data-num]');
    if (!fill) {
        return;
    }
    fill.setAttribute('y', (_a = chip.dataset.y) !== null && _a !== void 0 ? _a : '');
    fill.setAttribute('height', (_b = chip.dataset.h) !== null && _b !== void 0 ? _b : '');
    fill.setAttribute('fill', (_c = chip.dataset.c) !== null && _c !== void 0 ? _c : '');
    for (const el of Array.from((_e = (_d = chip.parentElement) === null || _d === void 0 ? void 0 : _d.children) !== null && _e !== void 0 ? _e : [])) {
        const c = el;
        const active = c === chip;
        c.style.background = active ? ((_f = chip.dataset.c) !== null && _f !== void 0 ? _f : '#eef2f6') : '#eef2f6';
        c.style.color = active ? '#ffffff' : '#334155';
    }
    if (num) {
        num.textContent = (_g = chip.dataset.t) !== null && _g !== void 0 ? _g : '';
        num.style.color = (_h = chip.dataset.c) !== null && _h !== void 0 ? _h : '';
    }
};
function Widget(props) {
    var _a, _b, _c, _d, _e;
    const { title, sections, pair } = (_a = props.config) !== null && _a !== void 0 ? _a : {};
    const useMapWidgetId = (_b = props.useMapWidgetIds) === null || _b === void 0 ? void 0 : _b[0];
    const featureInfo = Object.assign({ tool: 'click', showTopOnly: true }, ((_d = (_c = props.config) === null || _c === void 0 ? void 0 : _c.featureInfo) !== null && _d !== void 0 ? _d : {}));
    const tabbed = !!featureInfo.tabbed;
    const [tab, setTab] = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useState('info');
    const [hits, setHits] = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useState([]);
    const [empty, setEmpty] = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useState(false);
    const clickHandleRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(null);
    const moveHandleRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(null);
    const hoverTimerRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(null);
    const popupViewRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(null);
    const popupWasEnabledRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(null);
    const restorePopup = () => {
        if (popupViewRef.current && popupWasEnabledRef.current != null) {
            popupViewRef.current.popupEnabled = popupWasEnabledRef.current;
        }
        popupViewRef.current = null;
        popupWasEnabledRef.current = null;
    };
    // Bar scale: queryStatistics supports a max aggregate, so one cheap stats call per
    // pair layer gives the true 0→max range. Cached per session. The where clause pins
    // the query to one pair: the runtime does not always apply the web map's
    // definitionExpression, and an unfiltered query would span all seven pairs.
    const maxCacheRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(new Map());
    const pairWhere = (p) => `pair = '${String(p).replace(/'/g, "''")}'`;
    const loadMax = (layer_1, ...args_1) => __awaiter(this, [layer_1, ...args_1], void 0, function* (layer, where = '1=1') {
        var _a, _b, _c;
        if (!layer.queryFeatures) {
            return null;
        }
        const key = `${layer.title || layer.id}|${where}`;
        const cached = maxCacheRef.current.get(key);
        if (cached) {
            return cached;
        }
        const q = yield layer.queryFeatures({
            where,
            outStatistics: [
                { statisticType: 'max', onStatisticField: 'pressure', outStatisticFieldName: 'pMax' },
                { statisticType: 'max', onStatisticField: 'resource', outStatisticFieldName: 'rMax' }
            ],
            returnGeometry: false
        }).catch(() => null);
        const s = (_c = (_b = (_a = q === null || q === void 0 ? void 0 : q.features) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.attributes) !== null && _c !== void 0 ? _c : {};
        const max = { pressure: Number(s.pMax) || null, resource: Number(s.rMax) || null };
        maxCacheRef.current.set(key, max);
        return max;
    });
    // Static pair profile for the Info tab (modern panels only): probe the map's layers for
    // one that returns pair features — its break fields arrive with the sample, and loadMax
    // adds the true maxima. Rendered once per view; never involved in clicks.
    const [profile, setProfile] = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useState(null);
    const loadProfile = (view) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        if (featureInfo.popupVariant !== 'modern') {
            setProfile(null);
            return;
        }
        const where = pair ? pairWhere(pair) : '1=1';
        const items = ((_c = (_b = (_a = view.map) === null || _a === void 0 ? void 0 : _a.layers) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : []);
        for (const layer of items) {
            if (!layer.queryFeatures) {
                continue;
            }
            const q = yield layer.queryFeatures({ where, outFields: ['*'], returnGeometry: false, num: 1 }).catch(() => null);
            const attrs = (_e = (_d = q === null || q === void 0 ? void 0 : q.features) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.attributes;
            if ((attrs === null || attrs === void 0 ? void 0 : attrs.pair) != null && attrs.biv_class != null) {
                setProfile((0,_popup_card__WEBPACK_IMPORTED_MODULE_3__.scalesHtml)(attrs, yield loadMax(layer, where)));
                return;
            }
        }
        setProfile(null);
    });
    jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useEffect(() => {
        return () => {
            var _a, _b;
            (_a = clickHandleRef.current) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = moveHandleRef.current) === null || _b === void 0 ? void 0 : _b.remove();
            window.clearTimeout(hoverTimerRef.current);
            restorePopup();
        };
    }, []);
    const rawFields = (attrs) => Object.entries(attrs)
        .filter(([k]) => !ignoredAttr.test(k))
        .map(([k, v]) => [k, v == null ? '' : String(v)]);
    // Open the sidebar layout widget that contains this panel (state 'collapse' true = visible).
    const openSidebar = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const state = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().getState();
        const widgets = (_b = (_a = state.appConfig) === null || _a === void 0 ? void 0 : _a.widgets) !== null && _b !== void 0 ? _b : {};
        for (const [id, w] of Object.entries(widgets)) {
            if ((w === null || w === void 0 ? void 0 : w.uri) !== 'widgets/layout/sidebar/') {
                continue;
            }
            const content = (_h = (_g = (_d = (_c = state.appConfig) === null || _c === void 0 ? void 0 : _c.layouts) === null || _d === void 0 ? void 0 : _d[(_f = (_e = w === null || w === void 0 ? void 0 : w.layouts) === null || _e === void 0 ? void 0 : _e.FIRST) === null || _f === void 0 ? void 0 : _f.LARGE]) === null || _g === void 0 ? void 0 : _g.content) !== null && _h !== void 0 ? _h : {};
            if (Object.values(content).some(c => (c === null || c === void 0 ? void 0 : c.widgetId) === props.id)) {
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().dispatch(jimu_core__WEBPACK_IMPORTED_MODULE_1__.appActions.widgetStatePropChange(id, 'collapse', true));
                return;
            }
        }
    };
    const doHitTest = (view, e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        const res = yield view.hitTest(e).catch(() => null);
        if (!res) {
            return;
        }
        const bm = (_a = view.map) === null || _a === void 0 ? void 0 : _a.basemap;
        const isBasemapLayer = (l) => { var _a, _b; return (((_a = bm === null || bm === void 0 ? void 0 : bm.baseLayers) === null || _a === void 0 ? void 0 : _a.includes(l)) || ((_b = bm === null || bm === void 0 ? void 0 : bm.referenceLayers) === null || _b === void 0 ? void 0 : _b.includes(l))); };
        let feats = ((_b = res.results) !== null && _b !== void 0 ? _b : []).filter(r => { var _a; return r.type === 'graphic' && ((_a = r.layer) === null || _a === void 0 ? void 0 : _a.title) && !isBasemapLayer(r.layer); });
        if (!feats.length) {
            setHits([]);
            setEmpty(true);
            return;
        }
        setEmpty(false);
        if (tabbed && featureInfo.tool === 'click') {
            setTab('popup');
        }
        const isPairLayer = (r) => {
            var _a, _b, _c, _d, _e;
            const t = (_a = r.layer) === null || _a === void 0 ? void 0 : _a.popupTemplate;
            const attrs = (_b = r.graphic) === null || _b === void 0 ? void 0 : _b.attributes;
            return ((_c = t === null || t === void 0 ? void 0 : t.title) === null || _c === void 0 ? void 0 : _c.includes('pair')) || ((_e = (_d = r.layer) === null || _d === void 0 ? void 0 : _d.title) === null || _e === void 0 ? void 0 : _e.includes(' x ')) || (attrs === null || attrs === void 0 ? void 0 : attrs.pair) != null || (attrs === null || attrs === void 0 ? void 0 : attrs.biv_class) != null;
        };
        // Hex pair layers take priority over other layers at the point, regardless of hit order.
        const pairFeats = feats.filter(isPairLayer);
        const chosen = pairFeats.length ? pairFeats.slice(0, 1) : (featureInfo.showTopOnly ? feats.slice(0, 1) : feats);
        const out = [];
        for (const r of chosen) {
            let attrs = ((_d = (_c = r.graphic) === null || _c === void 0 ? void 0 : _c.attributes) !== null && _d !== void 0 ? _d : null);
            // hitTest attributes can be thin depending on the layer's outFields — fetch the full record.
            if (isPairLayer(r) && (!attrs || attrs.biv_class == null || attrs.pressure == null)) {
                const layer = r.layer;
                const oid = (_f = (_e = r.graphic) === null || _e === void 0 ? void 0 : _e.getObjectId) === null || _f === void 0 ? void 0 : _f.call(_e);
                const q = yield layer.queryFeatures({
                    objectIds: oid != null ? [oid] : undefined,
                    geometry: e.mapPoint,
                    outFields: ['*'],
                    returnGeometry: false
                }).catch(() => null);
                const f = (_g = q === null || q === void 0 ? void 0 : q.features) === null || _g === void 0 ? void 0 : _g[0];
                if (f === null || f === void 0 ? void 0 : f.attributes) {
                    attrs = f.attributes;
                }
            }
            if (!attrs) {
                continue;
            }
            const card = (0,_popup_card__WEBPACK_IMPORTED_MODULE_3__.bivCardHtml)(attrs, featureInfo.popupVariant, featureInfo, isPairLayer(r) ? yield loadMax(r.layer, attrs.pair != null ? pairWhere(attrs.pair) : '1=1') : null);
            if (card) {
                out.push({ layerTitle: String((_h = attrs.pair) !== null && _h !== void 0 ? _h : r.layer.title), html: card });
                continue;
            }
            const template = (_j = r.layer) === null || _j === void 0 ? void 0 : _j.popupTemplate;
            let entry = null;
            if (template === null || template === void 0 ? void 0 : template.fetchFeatures) {
                const contents = yield template.fetchFeatures([r.graphic]).catch(() => null);
                const c = contents === null || contents === void 0 ? void 0 : contents[0];
                if ((_k = c === null || c === void 0 ? void 0 : c.fields) === null || _k === void 0 ? void 0 : _k.length) {
                    entry = {
                        layerTitle: c.title || r.layer.title,
                        description: typeof c.description === 'string' ? c.description : undefined,
                        fields: c.fields.map(f => { var _a, _b; return [f.label || f.fieldName, (_b = (_a = f.formattedValue) !== null && _a !== void 0 ? _a : f.value) !== null && _b !== void 0 ? _b : '']; })
                    };
                }
            }
            if (!entry) {
                entry = { layerTitle: r.layer.title, fields: rawFields(attrs) };
            }
            out.push(entry);
        }
        // Hex layer not in the hit results at all — query it directly by the click point.
        if (!out.length) {
            const pairLayer = ((_o = (_m = (_l = view.map) === null || _l === void 0 ? void 0 : _l.layers) === null || _m === void 0 ? void 0 : _m.items) !== null && _o !== void 0 ? _o : []).find(l => { var _a, _b, _c; return ((_b = (_a = l === null || l === void 0 ? void 0 : l.popupTemplate) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.includes('pair')) || ((_c = l.title) === null || _c === void 0 ? void 0 : _c.includes(' x ')); });
            if (pairLayer === null || pairLayer === void 0 ? void 0 : pairLayer.queryFeatures) {
                const q = yield pairLayer.queryFeatures({ geometry: e.mapPoint, outFields: ['*'], returnGeometry: false }).catch(() => null);
                const f = (_p = q === null || q === void 0 ? void 0 : q.features) === null || _p === void 0 ? void 0 : _p[0];
                if (f === null || f === void 0 ? void 0 : f.attributes) {
                    const attrs = f.attributes;
                    const card = (0,_popup_card__WEBPACK_IMPORTED_MODULE_3__.bivCardHtml)(attrs, featureInfo.popupVariant, featureInfo, yield loadMax(pairLayer, attrs.pair != null ? pairWhere(attrs.pair) : '1=1'));
                    if (card) {
                        out.push({ layerTitle: String((_q = attrs.pair) !== null && _q !== void 0 ? _q : pairLayer.title), html: card });
                        if (tabbed && featureInfo.tool === 'click') {
                            setTab('popup');
                        }
                    }
                }
            }
        }
        setHits(out);
    });
    const onActiveViewChange = (jmv) => {
        var _a, _b;
        (_a = clickHandleRef.current) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = moveHandleRef.current) === null || _b === void 0 ? void 0 : _b.remove();
        clickHandleRef.current = null;
        moveHandleRef.current = null;
        window.clearTimeout(hoverTimerRef.current);
        restorePopup();
        setHits([]);
        setEmpty(false);
        if (!(jmv === null || jmv === void 0 ? void 0 : jmv.view)) {
            return;
        }
        loadProfile(jmv.view);
        if (featureInfo.panelOnly) {
            popupWasEnabledRef.current = jmv.view.popupEnabled;
            popupViewRef.current = jmv.view;
            jmv.view.popupEnabled = false;
        }
        if (featureInfo.tool === 'hover') {
            moveHandleRef.current = jmv.view.on('pointer-move', (e) => {
                window.clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = window.setTimeout(() => doHitTest(jmv.view, e), 120);
            });
        }
        else {
            clickHandleRef.current = jmv.view.on('click', (e) => {
                if (featureInfo.openPanelOnClick) {
                    openSidebar();
                }
                doHitTest(jmv.view, e);
            });
        }
    };
    // Boundary fill toggle: the pair section's stats array supplies the four shares, so
    // figure and numbers can't drift apart. Modern panels only; each instance gets a
    // unique clip id since several views can mount this svg at once.
    const pairStats = featureInfo.popupVariant === 'modern' ? (_e = (sections !== null && sections !== void 0 ? sections : []).find(s => s.id === 'pair')) === null || _e === void 0 ? void 0 : _e.stats : undefined;
    const fillUid = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useMemo(() => `pp${++ppUidCounter}`, []);
    const fillHtml = Array.isArray(pairStats) && pairStats.length >= 4 ? (0,_popup_card__WEBPACK_IMPORTED_MODULE_3__.pairFillHtml)(pairStats, fillUid) : null;
    const tabBtn = (active) => ({
        flex: 1,
        background: 'none',
        border: 'none',
        borderBottom: active ? '3px solid #4b5563' : '3px solid transparent',
        padding: '8px 10px',
        fontSize: 15,
        fontWeight: active ? 800 : 600,
        color: active ? '#1f2937' : '#6b7280',
        cursor: 'pointer',
        marginBottom: -2
    });
    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "panel-accordion", style: { width: '100%', height: '100%', overflowY: 'auto' }, children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: `
        .panel-accordion details summary::-webkit-details-marker { display: none }
        .panel-accordion details summary { list-style: none }
      ` }), tabbed && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: 10 }, children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => setTab('info'), style: tabBtn(tab === 'info'), children: "Info & Sources" }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: () => setTab('popup'), style: tabBtn(tab === 'popup'), children: "Popup" })] })), (!tabbed || tab === 'info') && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [title && (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { style: { margin: '0 0 4px 0' }, children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: title }) }), (sections !== null && sections !== void 0 ? sections : []).map(s => {
                        var _a;
                        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("details", { open: !!s.open, style: { marginTop: 10 }, children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("summary", { style: Object.assign(Object.assign({}, basePill), { backgroundColor: (_a = s.pillColor) !== null && _a !== void 0 ? _a : '#5064a1' }), children: s.pill }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { paddingLeft: 10, marginTop: 8 }, dangerouslySetInnerHTML: { __html: s.body + (s.id === 'pair' && fillHtml ? fillHtml : '') + (s.id === 'scales' && profile ? profile : '') } })] }, s.id));
                    })] })), useMapWidgetId && (!tabbed || tab === 'popup') && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { marginTop: tabbed ? 0 : 14, borderTop: tabbed ? 'none' : '1px solid #d9d9d9', paddingTop: tabbed ? 0 : 8 }, children: [hits.length === 0 && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { color: '#8a8a8a', fontSize: 12, marginTop: 4 }, children: empty ? 'No feature at that location.' : 'Click a cell on the map to see its attributes.' })), hits.map((h, i) => {
                        var _a;
                        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { marginTop: 8 }, children: h.html
                                ? (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { dangerouslySetInnerHTML: { __html: h.html } })
                                : ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { fontWeight: 'bold', fontSize: 12 }, children: h.layerTitle }), h.description && (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { fontSize: 11, fontStyle: 'italic', color: '#555', marginTop: 2 }, children: h.description }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("table", { style: { fontSize: 11, borderCollapse: 'collapse', width: '100%' }, children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", { children: ((_a = h.fields) !== null && _a !== void 0 ? _a : []).map(([k, v]) => ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", { children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", { style: { padding: '2px 6px 2px 0', color: '#555', verticalAlign: 'top', whiteSpace: 'nowrap' }, children: k }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", { style: { padding: '2px 0', wordBreak: 'break-word' }, children: v })] }, k))) }) })] })) }, `${h.layerTitle}-${i}`));
                    })] })), useMapWidgetId && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { position: 'absolute', display: 'none' }, children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_arcgis__WEBPACK_IMPORTED_MODULE_2__.JimuMapViewComponent, { useMapWidgetId: useMapWidgetId, onActiveViewChange: onActiveViewChange }) }))] }));
}
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9wYW5lbC1hY2NvcmRpb24vZGlzdC9ydW50aW1lL3dpZGdldC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSU8sTUFBTSxVQUFVLEdBQTJCO0lBQ2hELEdBQUcsRUFBRSxTQUFTLEVBQUUsZUFBZTtJQUMvQixHQUFHLEVBQUUsU0FBUyxFQUFFLGVBQWU7SUFDL0IsR0FBRyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0I7SUFDaEMsR0FBRyxFQUFFLFNBQVMsRUFBRSxlQUFlO0lBQy9CLEdBQUcsRUFBRSxTQUFTLEVBQUUsZUFBZTtJQUMvQixHQUFHLEVBQUUsU0FBUyxFQUFFLGdCQUFnQjtJQUNoQyxHQUFHLEVBQUUsU0FBUyxFQUFFLGdCQUFnQjtJQUNoQyxHQUFHLEVBQUUsU0FBUyxFQUFFLGdCQUFnQjtJQUNoQyxHQUFHLEVBQUUsU0FBUyxDQUFFLGlCQUFpQjtDQUNsQztBQUNNLE1BQU0sWUFBWSxHQUEyQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQy9GLE1BQU0sWUFBWSxHQUEyQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQy9GLE1BQU0sVUFBVSxHQUEyQixFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBSXpGLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBVSxFQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUscUJBQXFCLEVBQUUsQ0FB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Q0osSUFsQkssR0FBRyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRSxDQW1CMUIsQ0FDUDtxQkFBQSxDQUFDLElBQ0UsQ0FDUCxFQUNBLGNBQWMsSUFBSSxDQUNqQix5RUFBSyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFDbkQsZ0VBQUMsNkRBQW9CLElBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsR0FBSSxHQUM1RixDQUNQLElBQ0csQ0FDUDtBQUNILENBQUM7QUFFTyxTQUFTLDJCQUEyQixDQUFDLEdBQUcsSUFBSSxxQkFBdUIsR0FBRyxHQUFHLEVBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9wYW5lbC1hY2NvcmRpb24vc3JjL3J1bnRpbWUvcG9wdXAtY2FyZC50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtYXJjZ2lzXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LWNvcmVcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZS9lbW90aW9uXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL2ppbXUtY29yZS9saWIvc2V0LXB1YmxpYy1wYXRoLnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9wYW5lbC1hY2NvcmRpb24vc3JjL3J1bnRpbWUvd2lkZ2V0LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQdXJlIHBvcHVwLWNhcmQgYnVpbGRlcnMg4oCUIG5vIEpTWCwgbm8gamltdSBpbXBvcnRzLCBzbyB0aGV5IGNhbiBiZSBleGVyY2lzZWQgYnlcbi8vIGNoZWNrLXBvcHVwLWNhcmQubWpzIChub2RlIC0tZXhwZXJpbWVudGFsLXN0cmlwLXR5cGVzKSBhbmQgYnkgdGhlIHdpZGdldC5cbmltcG9ydCB0eXBlIHsgRmVhdHVyZUluZm9Db25maWcgfSBmcm9tICcuLi9jb25maWcnXG5cbmV4cG9ydCBjb25zdCBiaXZQYWxldHRlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnMSc6ICcjZjJmMmYyJywgLy8gTG93IFAsIExvdyBSXG4gICcyJzogJyNjZWQ5OTUnLCAvLyBMb3cgUCwgTWVkIFJcbiAgJzMnOiAnI2E4YmUzOCcsIC8vIExvdyBQLCBIaWdoIFJcbiAgJzQnOiAnI2RhYjZlOScsIC8vIE1lZCBQLCBMb3cgUlxuICAnNSc6ICcjYWQ5YzhmJywgLy8gTWVkIFAsIE1lZCBSXG4gICc2JzogJyM3ZDkyNmQnLCAvLyBNZWQgUCwgSGlnaCBSXG4gICc3JzogJyNjNTc5ZGInLCAvLyBIaWdoIFAsIExvdyBSXG4gICc4JzogJyM3YjcwYWEnLCAvLyBIaWdoIFAsIE1lZCBSXG4gICc5JzogJyM0ZTY0OWUnICAvLyBIaWdoIFAsIEhpZ2ggUlxufVxuZXhwb3J0IGNvbnN0IHByZXNzdXJlUmFtcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHsgJzEnOiAnI2YyZjJmMicsICcyJzogJyNkYWI2ZTknLCAnMyc6ICcjYzU3OWRiJyB9XG5leHBvcnQgY29uc3QgcmVzb3VyY2VSYW1wOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geyAnMSc6ICcjZjJmMmYyJywgJzInOiAnI2NlZDk5NScsICczJzogJyNhOGJlMzgnIH1cbmV4cG9ydCBjb25zdCBjbGFzc05hbWVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geyAnMSc6ICdMb3cnLCAnMic6ICdNZWQnLCAnMyc6ICdIaWdoJyB9XG5cbmV4cG9ydCB0eXBlIEF4aXNNYXggPSB7IHByZXNzdXJlOiBudW1iZXIgfCBudWxsOyByZXNvdXJjZTogbnVtYmVyIHwgbnVsbCB9XG5cbmNvbnN0IGZtdCA9ICh2OiB1bmtub3duKTogc3RyaW5nID0+ICh2ID09IG51bGwgfHwgdiA9PT0gJycpID8gJ+KAlCcgOiBOdW1iZXIodikudG9Mb2NhbGVTdHJpbmcoJ2VuLVVTJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSlcblxuLy8gT25lIHBhaXIncyBzZXJ2aWNlIG5hbWUgcHV0cyB0aGUgcmVzb3VyY2UgZmlyc3QgKGl0cyBwcmVzc3VyZSBpcyB0aGUgc2FsdHdhdGVyIGZyb250KTtcbi8vIGRpc3BsYXkgaXQgcHJlc3N1cmUtZmlyc3QgbGlrZSBldmVyeSBvdGhlciBwYWlyLiBUaGUgc2VydmljZSB2YWx1ZSBzdGF5cyBmb3IgcXVlcmllcy5cbmNvbnN0IHBhaXJEaXNwbGF5ID0gKHBhaXI6IHVua25vd24pOiBzdHJpbmcgPT4gU3RyaW5nKHBhaXIgPz8gJycpID09PSAnQWdyaWN1bHR1cmUgeCBTYWxpbml0eScgPyAnU2FsaW5pdHkgeCBBZ3JpY3VsdHVyZScgOiBTdHJpbmcocGFpciA/PyAnJylcblxuLy8gUG9ydCBvZiB0aGUgc2hhcmVkIGJpdmFyaWF0ZSBBcmNhZGUgcG9wdXA7IG51bGwgd2hlbiBhdHRycyBhcmUgbm90IGEgY29uZmxpY3QtcGFpciBmZWF0dXJlLlxuZXhwb3J0IGNvbnN0IHZtc0NhcmRIdG1sID0gKGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoYXR0cnMucGFpciA9PSBudWxsICYmIGF0dHJzLmJpdl9jbGFzcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBjb25zdCBjbHMgPSBTdHJpbmcoYXR0cnMuYml2X2NsYXNzID8/ICcnKVxuICBjb25zdCBjaGlwID0gYml2UGFsZXR0ZVtjbHNdID8/ICcjY2JkNWUxJ1xuICBjb25zdCBiaXZUZXh0ID0gKGF0dHJzLmJpdl9sYWJlbCA9PSBudWxsIHx8IGF0dHJzLmJpdl9sYWJlbCA9PT0gJ05vIGRhdGEnKSA/ICdObyBkYXRhIG9uIGVpdGhlciBheGlzJyA6IFN0cmluZyhhdHRycy5iaXZfbGFiZWwpXG5cbiAgY29uc3Qgcm93ID0gKG5hbWU6IHN0cmluZywgdmFsOiB1bmtub3duLCBjbGF6ejogdW5rbm93biwgaGlnaEJyZWFrOiB1bmtub3duLCByYW1wOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogc3RyaW5nID0+IHtcbiAgICBsZXQgcGN0ID0gMFxuICAgIGlmICh2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnICYmIGhpZ2hCcmVhayAhPSBudWxsICYmIE51bWJlcihoaWdoQnJlYWspID4gMCkge1xuICAgICAgcGN0ID0gTWF0aC5yb3VuZChNYXRoLm1pbigxMDAsIE1hdGgubWF4KDAsIChOdW1iZXIodmFsKSAvIE51bWJlcihoaWdoQnJlYWspKSAqIDEwMCkpKVxuICAgIH1cbiAgICBjb25zdCBkaXNwID0gKHZhbCA9PSBudWxsIHx8IHZhbCA9PT0gJycpID8gJ04vQScgOiBTdHJpbmcoTWF0aC5yb3VuZChOdW1iZXIodmFsKSAqIDEwMCkgLyAxMDApXG4gICAgY29uc3QgY2xzU3RyID0gU3RyaW5nKGNsYXp6ID8/ICcnKVxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGNsYXNzTmFtZXNbY2xzU3RyXSA/PyAnTm8gZGF0YSdcbiAgICBsZXQgYmFyQ29sb3IgPSByYW1wW2Nsc1N0cl0gPz8gJyM5NGEzYjgnXG4gICAgaWYgKHZhbCA9PSBudWxsIHx8IHZhbCA9PT0gJycgfHwgTnVtYmVyKHZhbCkgPD0gMCkge1xuICAgICAgYmFyQ29sb3IgPSAnIzk0YTNiOCdcbiAgICB9XG4gICAgcmV0dXJuIGBcbiAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjEycHg7IHBhZGRpbmc6MTJweDsgYmFja2dyb3VuZDp0cmFuc3BhcmVudDsgYm9yZGVyOjFweCBzb2xpZCAjZTJlOGYwOyBib3JkZXItbGVmdDo0cHggc29saWQgJHtiYXJDb2xvcn07IGJvcmRlci1yYWRpdXM6MTBweDtcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDsganVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47IGFsaWduLWl0ZW1zOmJhc2VsaW5lO1wiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTFweDsgY29sb3I6IzY0NzQ4YjsgZm9udC13ZWlnaHQ6NzAwOyB0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7IGxldHRlci1zcGFjaW5nOjAuNnB4O1wiPiR7bmFtZX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjpyaWdodDtcIj5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZm9udC1zaXplOjIwcHg7IGZvbnQtd2VpZ2h0OjkwMDsgY29sb3I6IzFlMjkzYjtcIj4ke2Rpc3B9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxMHB4OyBjb2xvcjojOTRhM2I4OyBtYXJnaW4tdG9wOjJweDtcIj5DbGFzczogJHtjbGFzc05hbWV9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDoxMDAlOyBoZWlnaHQ6OHB4OyBib3JkZXItcmFkaXVzOjRweDsgYmFja2dyb3VuZDojZjFmNWY5OyBtYXJnaW4tdG9wOjhweDsgb3ZlcmZsb3c6aGlkZGVuO1wiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDoke3BjdH0lOyBoZWlnaHQ6MTAwJTsgYmFja2dyb3VuZDoke2JhckNvbG9yfTtcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5gXG4gIH1cblxuICByZXR1cm4gYFxuICAgIDxkaXYgc3R5bGU9XCJmb250LWZhbWlseTonU2Vnb2UgVUknLHN5c3RlbS11aSxzYW5zLXNlcmlmOyBwYWRkaW5nOjJweDsgYmFja2dyb3VuZDp0cmFuc3BhcmVudDsgYm9yZGVyLXJhZGl1czoxMnB4O1wiPlxuICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206MTJweDsgcGFkZGluZzoxMnB4IDE0cHg7IGJhY2tncm91bmQ6dHJhbnNwYXJlbnQ7IGJvcmRlcjoxcHggc29saWQgI2UyZThmMDsgYm9yZGVyLWJvdHRvbTozcHggc29saWQgJHtjaGlwfTsgYm9yZGVyLXJhZGl1czoxMnB4O1wiPlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjsgYWxpZ24taXRlbXM6ZmxleC1zdGFydDtcIj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxleDoxO1wiPlxuICAgICAgICAgICAgPGgyIHN0eWxlPVwibWFyZ2luOjA7IGZvbnQtc2l6ZToxNXB4OyBmb250LXdlaWdodDo5MDA7IGNvbG9yOiMwZjE3MmE7XCI+JHtwYWlyRGlzcGxheShhdHRycy5wYWlyKX08L2gyPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6NHB4OyBmb250LXNpemU6MTFweDsgY29sb3I6IzQ3NTU2OTtcIj4ke2JpdlRleHR9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kOiR7Y2hpcH07IHdpZHRoOjE4cHg7IGhlaWdodDoxOHB4OyBib3JkZXItcmFkaXVzOjRweDsgZGlzcGxheTppbmxpbmUtYmxvY2s7IG1hcmdpbi1sZWZ0OjEwcHg7IGZsZXgtc2hyaW5rOjA7XCI+PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgJHtyb3coJ1ByZXNzdXJlIC0gJyArIGF0dHJzLnByZXNzdXJlX25hbWUsIGF0dHJzLnByZXNzdXJlLCBhdHRycy5QcmVzc3VyZV9MZXZlbCwgYXR0cnMucHJlc3N1cmVfYnJlYWtfaGlnaCwgcHJlc3N1cmVSYW1wKX1cbiAgICAgICR7cm93KCdSZXNvdXJjZSAtICcgKyBhdHRycy5yZXNvdXJjZV9uYW1lLCBhdHRycy5yZXNvdXJjZSwgYXR0cnMuUmVzb3VyY2VfTGV2ZWwsIGF0dHJzLnJlc291cmNlX2JyZWFrX2hpZ2gsIHJlc291cmNlUmFtcCl9XG4gICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMnB4OyBwYWRkaW5nOjEycHg7IGJhY2tncm91bmQ6dHJhbnNwYXJlbnQ7IGJvcmRlcjoxcHggc29saWQgI2UyZThmMDsgYm9yZGVyLXJhZGl1czo4cHg7IGZvbnQtc2l6ZToxMHB4OyBjb2xvcjojNDc1NTY5OyBsaW5lLWhlaWdodDoxLjU7XCI+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7IGZsZXgtd3JhcDp3cmFwOyBnYXA6NHB4OyBtYXJnaW4tYm90dG9tOjhweDtcIj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT1cImJhY2tncm91bmQ6I2UyZThmMDsgY29sb3I6IzMzNDE1NTsgcGFkZGluZzoycHggNnB4OyBib3JkZXItcmFkaXVzOjRweDsgZm9udC1zaXplOjlweDsgZm9udC13ZWlnaHQ6NjAwO1wiPlJlc291cmNlOiAke2F0dHJzLnJlc291cmNlX25hbWV9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZDojZTJlOGYwOyBjb2xvcjojMzM0MTU1OyBwYWRkaW5nOjJweCA2cHg7IGJvcmRlci1yYWRpdXM6NHB4OyBmb250LXNpemU6OXB4OyBmb250LXdlaWdodDo2MDA7XCI+UHJlc3N1cmU6ICR7YXR0cnMucHJlc3N1cmVfbmFtZX08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PkJhcnMgcmVmbGVjdCB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgdXBwZXIgY2xhc3MgYnJlYWsuIDxzdHJvbmcgc3R5bGU9XCJjb2xvcjojNGU2NDllO1wiPkRhcmsgaW5kaWdvPC9zdHJvbmc+IGNlbGxzIG1hcmsgaGlnaCBjb25mbGljdCBvdmVybGFwLjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+YFxufVxuXG4vLyBDaGFydC1kYXR1bSB2YXJpYW50OiBvbmUgY2VsbCdzIHJlYWRpbmcgYXMgYSBtZWFzdXJlbWVudCByZWNvcmQg4oCUIHNlcmlmIG51bWVyYWxzLFxuLy8gdGhlIDPDlzMgYml2YXJpYXRlIG1hdHJpeCB3aXRoIHRoZSBjdXJyZW50IGNlbGwgcmluZ2VkLCBoYWlybGluZXMgaW5zdGVhZCBvZiBjYXJkcy5cbmV4cG9ydCBjb25zdCBtb2Rlcm5DYXJkSHRtbCA9IChhdHRyczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGluZm8/OiBGZWF0dXJlSW5mb0NvbmZpZywgbWF4PzogQXhpc01heCB8IG51bGwpOiBzdHJpbmcgPT4ge1xuICBjb25zdCBjbHMgPSBTdHJpbmcoYXR0cnMuYml2X2NsYXNzID8/ICcnKVxuICBjb25zdCBhY3RpdmUgPSAvXlsxLTldJC8udGVzdChjbHMpID8gTnVtYmVyKGNscykgOiAtMVxuICBjb25zdCBjaGlwID0gL15bMS05XSQvLnRlc3QoY2xzKSA/IGJpdlBhbGV0dGVbY2xzXSA6IG51bGxcbiAgY29uc3QgYml2VGV4dCA9IChhdHRycy5iaXZfbGFiZWwgPT0gbnVsbCB8fCBhdHRycy5iaXZfbGFiZWwgPT09ICdObyBkYXRhJykgPyAnTm8gZGF0YSBvbiBlaXRoZXIgYXhpcycgOiBTdHJpbmcoYXR0cnMuYml2X2xhYmVsKVxuXG4gIC8vIEVzcmktc3R5bGUgcm90YXRlZCBiaXZhcmlhdGUgbGVnZW5kLCBkcmF3biBhcyBkaWFtb25kcyBvbiBhIDQ1wrAgbGF0dGljZSBzbyBjZWxsc1xuICAvLyBuZXZlciBvdmVybGFwIChhIHJvdGF0ZWQgZ3JpZCBvZiBzcXVhcmVzIHdvdWxkIGxldCBsYXRlciBjZWxscyBwYWludCBvdmVyIHRoZSByaW5nKS5cbiAgLy8gUm93cyA9IHByZXNzdXJlIEhpZ2jihpJMb3csIGNvbHMgPSByZXNvdXJjZSBMb3fihpJIaWdoOiBMb3ctTG93IHNpdHMgYXQgdGhlIGJvdHRvbSBjb3JuZXIsXG4gIC8vIEhpZ2gtSGlnaCBhdCB0aGUgdG9wLCByZXNvdXJjZSAoZ3JlZW4pIHRvd2FyZCB0aGUgdXBwZXItcmlnaHQsIHByZXNzdXJlIChwdXJwbGUpIHVwcGVyLWxlZnQuXG4gIGNvbnN0IGNlbGxOYW1lcyA9IFsnTG93JywgJ01lZCcsICdIaWdoJ11cbiAgY29uc3QgdSA9IDEyLjUgLy8gbGF0dGljZSBzdGVwIGluIHB4XG4gIGNvbnN0IGNlbGxzOiBzdHJpbmdbXSA9IFtdXG4gIGZvciAobGV0IHAgPSAyOyBwID49IDA7IHAtLSkge1xuICAgIGZvciAobGV0IHIgPSAwOyByIDwgMzsgcisrKSB7XG4gICAgICBjb25zdCBpZHggPSBwICogMyArIHIgKyAxXG4gICAgICBjb25zdCB4ID0gKHIgLSBwKSAqIHVcbiAgICAgIGNvbnN0IHkgPSAoMiAtIHIgLSBwKSAqIHVcbiAgICAgIC8vIEFtYmllbnQgaGlnaGxpZ2h0OiBkaW0gdGhlIGluYWN0aXZlIGNlbGxzIGFuZCBsZXQgdGhlIGFjdGl2ZSBvbmUgZ2xvdyBpbiBpdHMgb3duXG4gICAgICAvLyBjaGlwIGNvbG9yIGluc3RlYWQgb2YgYm94aW5nIGl0IGluIGluay4gTm8gZGltbWluZyB3aGVuIHRoZXJlIGlzIG5vIGFjdGl2ZSBjZWxsLlxuICAgICAgY29uc3QgcmluZyA9IGlkeCA9PT0gYWN0aXZlXG4gICAgICAgID8gYGJveC1zaGFkb3c6MCAwIDAgMS41cHggI2ZmZmZmZiwwIDAgNnB4IDJweCAke2NoaXAgPz8gJyM0ZTY0OWUnfTY2O3otaW5kZXg6MTtgXG4gICAgICAgIDogKGFjdGl2ZSAhPT0gLTEgPyAnb3BhY2l0eTowLjQ1OycgOiAnJylcbiAgICAgIGNlbGxzLnB1c2goYDxkaXYgdGl0bGU9XCJQcmVzc3VyZSAke2NlbGxOYW1lc1twXX0sIHJlc291cmNlICR7Y2VsbE5hbWVzW3JdfVwiIHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7bGVmdDoke3ggKyAyOH1weDt0b3A6JHt5ICsgMjh9cHg7d2lkdGg6MTJweDtoZWlnaHQ6MTJweDtib3JkZXI6MXB4IHNvbGlkICNkNWRkZTY7YmFja2dyb3VuZDoke2JpdlBhbGV0dGVbaWR4XSA/PyAnI2NiZDVlMSd9O3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpOyR7cmluZ31cIj48L2Rpdj5gKVxuICAgIH1cbiAgfVxuICBjb25zdCBtYXRyaXggPSBgXG4gICAgPGRpdiB0aXRsZT1cIkJpdmFyaWF0ZSBjb25mbGljdCBtYXRyaXhcIiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjY4cHg7aGVpZ2h0OjY4cHg7bWFyZ2luOjEwcHggYXV0byAwO1wiPlxuICAgICAgJHtjZWxscy5qb2luKCcnKX1cbiAgICA8L2Rpdj5gXG5cbiAgY29uc3QgYXhpc1JvdyA9IChuYW1lOiBzdHJpbmcsIHZhbDogdW5rbm93biwgY2xheno6IHVua25vd24sIGxvd0JyZWFrOiB1bmtub3duLCBoaWdoQnJlYWs6IHVua25vd24sIGFjY2VudDogc3RyaW5nLCByYW1wOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCB1bml0Pzogc3RyaW5nLCBtYXhWYWw/OiBudW1iZXIgfCBudWxsKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBsb051bSA9IChsb3dCcmVhayAhPSBudWxsICYmIE51bWJlcihsb3dCcmVhaykgPiAwKSA/IE51bWJlcihsb3dCcmVhaykgOiAwXG4gICAgY29uc3QgYnJlYWtOdW0gPSAoaGlnaEJyZWFrICE9IG51bGwgJiYgTnVtYmVyKGhpZ2hCcmVhaykgPiAwKSA/IE51bWJlcihoaWdoQnJlYWspIDogTmFOXG4gICAgY29uc3QgbnVtVmFsID0gKHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJycgJiYgIU51bWJlci5pc05hTihOdW1iZXIodmFsKSkpID8gTnVtYmVyKHZhbCkgOiBOYU5cbiAgICBjb25zdCBkaXNwID0gZm10KHZhbClcbiAgICBjb25zdCBtaXNzaW5nID0gZGlzcCA9PT0gJ+KAlCdcbiAgICBjb25zdCBjbHNTdHIgPSBTdHJpbmcoY2xhenogPz8gJycpXG4gICAgY29uc3QgaGFzQ2xhc3MgPSBjbGFzc05hbWVzW2Nsc1N0cl0gIT0gbnVsbFxuICAgIGNvbnN0IGNsYXNzTmFtZSA9IGhhc0NsYXNzID8gY2xhc3NOYW1lc1tjbHNTdHJdIDogJ25vIGRhdGEnXG4gICAgLy8gRG90IHVzZXMgdGhlIGF4aXMgcmFtcCBjb2xvciAoTG93L01lZC9IaWdoIGxlZ2VuZCBjb2xvcnMpLCBub3QgdGhlIHBpbGwgYWNjZW50LlxuICAgIGNvbnN0IGRvdENvbG9yID0gaGFzQ2xhc3MgPyAocmFtcFtjbHNTdHJdID8/IGFjY2VudCkgOiAnIzk0YTNiOCdcbiAgICAvLyBTaW5nbGUtY2xhc3MgcHJvZ3Jlc3MgYmFyOiB0aGUgZmlsbCBydW5zIGZyb20gdGhlIGxlZnQgZWRnZSB0byB0aGUgdmFsdWUncyBwb3NpdGlvblxuICAgIC8vIGluc2lkZSB0aGUgY3VycmVudCBjbGFzcywgdGhlIHJlc3Qgc3RheXMgYSBsaWdodCB0cmFjay4gUXVhbnRpbGUgY2xhc3NlcyBhcmVcbiAgICAvLyBlcXVhbC1jb3VudCwgbm90IGVxdWFsLXNwYW4sIHNvIHdpdGhpbi1jbGFzcyBwb3NpdGlvbiBpcyB0aGUgbGVnaWJsZSByZWFkaW5nO1xuICAgIC8vIHRoZSBhYnNvbHV0ZSBzY2FsZSBsaXZlcyBpbiB0aGUgcGFpciBwcm9maWxlLlxuICAgIGNvbnN0IGhhc0JhciA9IChjbHNTdHIgPT09ICcxJyAmJiBsb051bSA+IDApIHx8ICgoY2xzU3RyID09PSAnMicgfHwgY2xzU3RyID09PSAnMycpICYmICFOdW1iZXIuaXNOYU4oYnJlYWtOdW0pKVxuICAgIGNvbnN0IGJhclRpdGxlID0gY2xzU3RyID09PSAnMScgPyBgTG93IOKJpCAke2ZtdChsb051bSl9YFxuICAgICAgOiBjbHNTdHIgPT09ICcyJyA/IGBNZWQgJHtmbXQobG9OdW0pfeKAkyR7Zm10KGJyZWFrTnVtKX1gXG4gICAgICA6IGNsc1N0ciA9PT0gJzMnID8gKG1heFZhbCAhPSBudWxsICYmIG1heFZhbCA+IGJyZWFrTnVtID8gYEhpZ2ggJHtmbXQoYnJlYWtOdW0pfeKAkyR7Zm10KG1heFZhbCl9IChtYXgpYCA6IGBIaWdoID4gJHtmbXQoYnJlYWtOdW0pfWApXG4gICAgICA6ICcnXG4gICAgY29uc3QgY2xhbXBQY3QgPSAoeDogbnVtYmVyKTogbnVtYmVyID0+IE1hdGgucm91bmQoTWF0aC5taW4oMTAwLCBNYXRoLm1heCgwLCB4ICogMTAwKSkpXG4gICAgbGV0IHRpY2tQY3Q6IG51bWJlciB8IG51bGwgPSBudWxsXG4gICAgaWYgKCFtaXNzaW5nICYmICFOdW1iZXIuaXNOYU4obnVtVmFsKSkge1xuICAgICAgaWYgKGNsc1N0ciA9PT0gJzEnICYmIGxvTnVtID4gMCkgdGlja1BjdCA9IGNsYW1wUGN0KG51bVZhbCAvIGxvTnVtKVxuICAgICAgZWxzZSBpZiAoY2xzU3RyID09PSAnMicgJiYgIU51bWJlci5pc05hTihicmVha051bSkgJiYgYnJlYWtOdW0gPiBsb051bSkgdGlja1BjdCA9IGNsYW1wUGN0KChudW1WYWwgLSBsb051bSkgLyAoYnJlYWtOdW0gLSBsb051bSkpXG4gICAgICAvLyBIaWdoIG5lZWRzIHRoZSBsYXllciBtYXggdG8gYm91bmQgaXRzIGJyYWNrZXQ7IHdpdGhvdXQgaXQgdGhlcmUgaXMgbm8gc2NhbGUgdG8gdGljayBvbi5cbiAgICAgIGVsc2UgaWYgKGNsc1N0ciA9PT0gJzMnICYmIG1heFZhbCAhPSBudWxsICYmIG1heFZhbCA+IGJyZWFrTnVtKSB0aWNrUGN0ID0gY2xhbXBQY3QoKG51bVZhbCAtIGJyZWFrTnVtKSAvIChtYXhWYWwgLSBicmVha051bSkpXG4gICAgfVxuICAgIC8vIEVkZ2UgbGFiZWxzIG5hbWUgdGhlIGJhcidzIG93biBzY2FsZTogdGhlIGNsYXNzIGJyYWNrZXQncyBsZWZ0IGFuZCByaWdodCBlbmRzLlxuICAgIGxldCBsZWZ0TGFiZWw6IHN0cmluZyB8IG51bGwgPSBudWxsXG4gICAgbGV0IHJpZ2h0TGFiZWw6IHN0cmluZyB8IG51bGwgPSBudWxsXG4gICAgaWYgKGNsc1N0ciA9PT0gJzEnICYmIGxvTnVtID4gMCkgeyBsZWZ0TGFiZWwgPSAnMCc7IHJpZ2h0TGFiZWwgPSBmbXQobG9OdW0pIH1cbiAgICBlbHNlIGlmIChjbHNTdHIgPT09ICcyJyAmJiAhTnVtYmVyLmlzTmFOKGJyZWFrTnVtKSkgeyBsZWZ0TGFiZWwgPSBmbXQobG9OdW0pOyByaWdodExhYmVsID0gZm10KGJyZWFrTnVtKSB9XG4gICAgZWxzZSBpZiAoY2xzU3RyID09PSAnMycgJiYgIU51bWJlci5pc05hTihicmVha051bSkpIHsgbGVmdExhYmVsID0gZm10KGJyZWFrTnVtKTsgcmlnaHRMYWJlbCA9IChtYXhWYWwgIT0gbnVsbCAmJiBtYXhWYWwgPiBicmVha051bSkgPyBmbXQobWF4VmFsKSA6IG51bGwgfVxuICAgIC8vIEZpbGwgdXNlcyB0aGUgY2xhc3MgcmFtcDsgTG93J3MgbmVhci13aGl0ZSByYW1wIHdvdWxkIHZhbmlzaCBhZ2FpbnN0IHRoZSBsaWdodCB0cmFjayxcbiAgICAvLyBzbyBpdCB0YWtlcyBhIHNsYXRlIGZpbGwgaW5zdGVhZC4gVGhlIHRpY2sgaXMgYSBzb2xpZCBjYXAgaW4gdGhlIHNhbWUgY29sb3Igd2l0aCBhXG4gICAgLy8gdGhpbiB3aGl0ZSByaW5nIOKAlCBpdCBwdW5jaGVzIG91dCBvZiB0aGUgZmlsbCBhbmQgcmVhZHMgb24gdGhlIGxpZ2h0IHRyYWNrIOKAlCBjbGFtcGVkXG4gICAgLy8gaW5zaWRlIHRoZSBiYXIgc28gaXQgbmV2ZXIgaGFuZ3Mgb2ZmIHRoZSByb3VuZGVkIGVuZCAodmFsdWUgMCAvIHZhbHVlIG1heCkuXG4gICAgY29uc3QgZmlsbENvbG9yID0gY2xzU3RyID09PSAnMScgPyAnI2NiZDVlMScgOiByYW1wW2Nsc1N0cl1cbiAgICByZXR1cm4gYFxuICAgICAgPGRpdiBzdHlsZT1cInBhZGRpbmc6MCAycHg7XCI+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7XCI+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOiR7YWNjZW50fTtjb2xvcjojZmZmZmZmO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjJweCA5cHg7Zm9udC1zaXplOjEwLjVweDtmb250LXdlaWdodDo3MDA7XCI+JHtuYW1lfTwvc3Bhbj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjExcHg7Y29sb3I6JHtoYXNDbGFzcyA/ICcjMzM0MTU1JyA6ICcjOTRhM2I4J307d2hpdGUtc3BhY2U6bm93cmFwO1wiPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDo3cHg7aGVpZ2h0OjdweDtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOiR7ZG90Q29sb3J9O2JvcmRlcjoke2hhc0NsYXNzID8gJzFweCBzb2xpZCAjYjNiZWNiJyA6ICdub25lJ307bWFyZ2luLXJpZ2h0OjVweDt2ZXJ0aWNhbC1hbGlnbjoxcHg7XCI+PC9zcGFuPiR7Y2xhc3NOYW1lfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6NHB4O2ZvbnQtc2l6ZToxMXB4O2NvbG9yOiM2NDc0OGI7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmJhc2VsaW5lO1wiPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPVwiZm9udC1zaXplOjI2cHg7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiR7bWlzc2luZyA/ICcjOTRhM2I4JyA6ICcjMWYyOTM3J307bGluZS1oZWlnaHQ6MS4xNTtcIj4ke2Rpc3B9PC9zcGFuPlxuICAgICAgICAgICR7dW5pdCAmJiAhbWlzc2luZyA/IGA8c3BhbiBzdHlsZT1cIm1hcmdpbi1sZWZ0OjZweDtcIj4ke3VuaXR9PC9zcGFuPmAgOiAnJ31cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW4tdG9wOjZweDtoZWlnaHQ6OHB4O1wiPlxuICAgICAgICAgICR7aGFzQmFyID8gYDxkaXYgdGl0bGU9XCIke2JhclRpdGxlfVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7YmFja2dyb3VuZDojZWVmMmY2O2JvcmRlcjoxcHggc29saWQgI2Q1ZGRlNjtib3JkZXItcmFkaXVzOjk5OXB4O292ZXJmbG93OmhpZGRlbjtcIj4ke3RpY2tQY3QgIT0gbnVsbCA/IGA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2lkdGg6JHt0aWNrUGN0fSU7YmFja2dyb3VuZDoke2ZpbGxDb2xvcn07Ym9yZGVyLXJhZGl1czo5OTlweCAwIDAgOTk5cHg7XCI+PC9kaXY+YCA6ICcnfTwvZGl2PmAgOiAnJ31cbiAgICAgICAgICAke3RpY2tQY3QgIT0gbnVsbCA/IGA8ZGl2IHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7bGVmdDptYXgoMHB4LG1pbihjYWxjKCR7dGlja1BjdH0lIC0gNXB4KSxjYWxjKDEwMCUgLSAxMHB4KSkpO3RvcDotMXB4O3dpZHRoOjEwcHg7aGVpZ2h0OjEwcHg7Ym9yZGVyLXJhZGl1czo1MCU7YmFja2dyb3VuZDoke2ZpbGxDb2xvcn07Ym9yZGVyOjEuNXB4IHNvbGlkICNmZmZmZmY7XCI+PC9kaXY+YCA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgJHtsZWZ0TGFiZWwgIT0gbnVsbCA/IGA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO21hcmdpbi10b3A6NHB4O2ZvbnQtc2l6ZToxMHB4O2NvbG9yOiM5NGEzYjg7XCI+PHNwYW4+JHtsZWZ0TGFiZWx9PC9zcGFuPjxzcGFuPiR7cmlnaHRMYWJlbCA/PyAnJ308L3NwYW4+PC9kaXY+YCA6ICcnfVxuICAgICAgPC9kaXY+YFxuICB9XG5cbiAgcmV0dXJuIGBcbiAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6J1NlZ29lIFVJJyxzeXN0ZW0tdWksc2Fucy1zZXJpZjtjb2xvcjojMWYyOTM3O1wiPlxuICAgICAgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxNXB4O2ZvbnQtd2VpZ2h0OjgwMDtsaW5lLWhlaWdodDoxLjM7XCI+JHtwYWlyRGlzcGxheShhdHRycy5wYWlyKX08L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjJweDtmb250LXNpemU6MTFweDtjb2xvcjojNjQ3NDhiO2xpbmUtaGVpZ2h0OjEuNDtcIj4ke2JpdlRleHR9PC9kaXY+XG4gICAgICAke21hdHJpeH1cbiAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6MXB4O2JhY2tncm91bmQ6dmFyKC0tc3lzLWNvbG9yLWRpdmlkZXItcHJpbWFyeSwgI2UyZThmMCk7bWFyZ2luOjEwcHggMDtcIj48L2Rpdj5cbiAgICAgICR7YXhpc1JvdygnUHJlc3N1cmUg4oCUICcgKyBhdHRycy5wcmVzc3VyZV9uYW1lLCBhdHRycy5wcmVzc3VyZSwgYXR0cnMuUHJlc3N1cmVfTGV2ZWwsIGF0dHJzLnByZXNzdXJlX2JyZWFrX2xvdywgYXR0cnMucHJlc3N1cmVfYnJlYWtfaGlnaCwgJyNjNTdhZGUnLCBwcmVzc3VyZVJhbXAsIGluZm8/LnByZXNzdXJlVW5pdCwgbWF4Py5wcmVzc3VyZSl9XG4gICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjFweDtiYWNrZ3JvdW5kOnZhcigtLXN5cy1jb2xvci1kaXZpZGVyLXByaW1hcnksICNlMmU4ZjApO21hcmdpbjoxMHB4IDA7XCI+PC9kaXY+XG4gICAgICAke2F4aXNSb3coJ1Jlc291cmNlIOKAlCAnICsgYXR0cnMucmVzb3VyY2VfbmFtZSwgYXR0cnMucmVzb3VyY2UsIGF0dHJzLlJlc291cmNlX0xldmVsLCBhdHRycy5yZXNvdXJjZV9icmVha19sb3csIGF0dHJzLnJlc291cmNlX2JyZWFrX2hpZ2gsICcjYTliZjM5JywgcmVzb3VyY2VSYW1wLCBpbmZvPy5yZXNvdXJjZVVuaXQsIG1heD8ucmVzb3VyY2UpfVxuICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDoxcHg7YmFja2dyb3VuZDp2YXIoLS1zeXMtY29sb3ItZGl2aWRlci1wcmltYXJ5LCAjZTJlOGYwKTttYXJnaW46MTBweCAwO1wiPjwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxMHB4O2NvbG9yOiM5NGEzYjg7bGluZS1oZWlnaHQ6MS41O1wiPlxuICAgICAgICBCYXJzIHNob3cgcG9zaXRpb24gd2l0aGluIHRoZSBjdXJyZW50IGNsYXNzOyB0aGUgVmFsdWUgc2NhbGVzIHNlY3Rpb24gKEluZm8gdGFiKSBob2xkcyB0aGUgZnVsbCByYW5nZS4gPHNwYW4gc3R5bGU9XCJjb2xvcjojNGU2NDllO2ZvbnQtd2VpZ2h0OjYwMDtcIj5EYXJrIGluZGlnbzwvc3Bhbj4gbWFya3MgdGhlIHN0cm9uZ2VzdCBjb25mbGljdCBvdmVybGFwLlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+YFxufVxuXG4vLyBBYnNvbHV0ZS1zY2FsZSBiYXJzIHRoYXQgc2xvdCBpbnRvIHRoZSBWYWx1ZSBzY2FsZXMgYWNjb3JkaW9uIChJbmZvIHRhYik6IHNlZ21lbnRlZFxuLy8gYnkgcmVhbCBjbGFzcyByYW5nZXMsIGV2ZXJ5IGJvdW5kYXJ5IGxhYmVsZWQuIE5vdCBwZXItY2VsbCwgc28gbm8gdGljayBvciBjbGljayBsb2dpYy5cbmV4cG9ydCBjb25zdCBzY2FsZXNIdG1sID0gKGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgbWF4PzogQXhpc01heCB8IG51bGwpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgY29uc3QgbnVtID0gKHY6IHVua25vd24pOiBudW1iZXIgfCBudWxsID0+ICh2ICE9IG51bGwgJiYgdiAhPT0gJycgJiYgIU51bWJlci5pc05hTihOdW1iZXIodikpICYmIE51bWJlcih2KSA+IDApID8gTnVtYmVyKHYpIDogbnVsbFxuICBjb25zdCBsb1AgPSBudW0oYXR0cnMucHJlc3N1cmVfYnJlYWtfbG93KVxuICBjb25zdCBoaVAgPSBudW0oYXR0cnMucHJlc3N1cmVfYnJlYWtfaGlnaClcbiAgY29uc3QgbG9SID0gbnVtKGF0dHJzLnJlc291cmNlX2JyZWFrX2xvdylcbiAgY29uc3QgaGlSID0gbnVtKGF0dHJzLnJlc291cmNlX2JyZWFrX2hpZ2gpXG4gIGlmIChoaVAgPT0gbnVsbCAmJiBoaVIgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgLy8gUGxhaW4gbGFiZWxzLCBubyBwaWxscyDigJQgdGhlIGFjY29yZGlvbiBhbHJlYWR5IG5hbWVzIHRoZSBheGVzIHdpdGggaXRzIG93biBwaWxscy5cbiAgLy8gVGV4dCBpcyBncmF5ZWQgdG8gcG9wdXAtbWljcm9jb3B5IHdlaWdodCBzbyB0aGUgYmFycyBkbyB0aGUgdGFsa2luZy5cbiAgY29uc3Qgcm93ID0gKGxhYmVsOiBzdHJpbmcsIGxvOiBudW1iZXIgfCBudWxsLCBoaTogbnVtYmVyIHwgbnVsbCwgcmFtcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgbWF4VmFsPzogbnVtYmVyIHwgbnVsbCk6IHN0cmluZyA9PiB7XG4gICAgY29uc3Qgc2VnID0gKGdyb3c6IG51bWJlciwgY29sb3I6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IHN0cmluZyA9PlxuICAgICAgZ3JvdyA+IDAgPyBgPGRpdiB0aXRsZT1cIiR7dGl0bGV9XCIgc3R5bGU9XCJmbGV4OiR7Z3Jvd30gMSAwO2JhY2tncm91bmQ6JHtjb2xvcn07Ym9yZGVyOjFweCBzb2xpZCAjZDVkZGU2O2JvcmRlci1yYWRpdXM6MnB4O1wiPjwvZGl2PmAgOiAnJ1xuICAgIGNvbnN0IGxvR3JvdyA9IGxvID8/IDBcbiAgICBjb25zdCBtZWRHcm93ID0gaGkgIT0gbnVsbCA/IGhpIC0gKGxvID8/IDApIDogMFxuICAgIGNvbnN0IGhpR3JvdyA9IGhpICE9IG51bGwgJiYgbWF4VmFsICE9IG51bGwgJiYgbWF4VmFsID4gaGkgPyBtYXhWYWwgLSBoaSA6IDBcbiAgICBjb25zdCBjYXB0aW9uID0gW1xuICAgICAgbG8gIT0gbnVsbCA/IGBMb3cg4omkICR7Zm10KGxvKX1gIDogbnVsbCxcbiAgICAgIGhpICE9IG51bGwgPyBgTWVkICR7Zm10KGxvID8/IDApfeKAkyR7Zm10KGhpKX1gIDogbnVsbCxcbiAgICAgIGhpICE9IG51bGwgPyBgSGlnaCA+ICR7Zm10KGhpKX1gIDogbnVsbCxcbiAgICAgIG1heFZhbCAhPSBudWxsICYmIG1heFZhbCA+IDAgPyBgbWF4ICR7Zm10KG1heFZhbCl9YCA6IG51bGxcbiAgICBdLmZpbHRlcihCb29sZWFuKS5qb2luKCcgwrcgJylcbiAgICByZXR1cm4gYFxuICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweDtcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxMHB4O2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjojOTRhM2I4O1wiPiR7bGFiZWx9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjRweDtkaXNwbGF5OmZsZXg7Z2FwOjJweDtoZWlnaHQ6OHB4O1wiPlxuICAgICAgICAgICR7c2VnKGxvR3JvdywgcmFtcFsnMSddLCBgTG93IOKJpCAke2ZtdChsbyA/PyAwKX1gKX1cbiAgICAgICAgICAke3NlZyhtZWRHcm93LCByYW1wWycyJ10sIGBNZWQgJHtmbXQobG8gPz8gMCl94oCTJHtmbXQoaGkgPz8gMCl9YCl9XG4gICAgICAgICAgJHtzZWcoaGlHcm93LCByYW1wWyczJ10sIGBIaWdoID4gJHtmbXQoaGkgPz8gMCl9YCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDo0cHg7Zm9udC1zaXplOjEwcHg7Y29sb3I6Izk0YTNiODtcIj4ke2NhcHRpb259PC9kaXY+XG4gICAgICA8L2Rpdj5gXG4gIH1cbiAgcmV0dXJuIGBcbiAgICAke3JvdygnUHJlc3N1cmUnLCBsb1AsIGhpUCwgcHJlc3N1cmVSYW1wLCBtYXg/LnByZXNzdXJlKX1cbiAgICAke3JvdygnUmVzb3VyY2UnLCBsb1IsIGhpUiwgcmVzb3VyY2VSYW1wLCBtYXg/LnJlc291cmNlKX1cbiAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4O2ZvbnQtc2l6ZToxMHB4O2NvbG9yOiM5NGEzYjg7bGluZS1oZWlnaHQ6MS41O1wiPlRoZSBmdWxsIDAtdG8tbWF4IHZhbHVlIHNjYWxlIGJlaGluZCB0aGUgY29uZmxpY3QgbWFwLCBjdXQgYXQgdGhlIGNsYXNzIGJyZWFrcy4gVW5ldmVuIHNlZ21lbnRzIHJlZmxlY3QgYSBza2V3ZWQgZGlzdHJpYnV0aW9uOiBjZWxscyBidW5jaCBhdCBvbmUgZW5kIG9mIHRoZSBzY2FsZSB3aGlsZSBhIHRoaW4gdGFpbCBvZiBleHRyZW1lIGNlbGxzIHN0cmV0Y2hlcyB0aGUgb3RoZXI7IHRoZSBwb3B1cCBiYXIgem9vbXMgaW50byBhIHNpbmdsZSBjbGFzcyBzZWdtZW50LjwvZGl2PmBcbn1cblxuLy8gT25lIEFQTkVQIGJvdW5kYXJ5IHNpbGhvdWV0dGUgd2hvc2UgZmlsbCB0b2dnbGVzIGFtb25nIHRoZSBwYWlyIHNlY3Rpb24ncyBmb3VyIHN0YXRzLlxuLy8gUGF0aDogQVBORVBfQm91bmRhcnlfMDQxMCBmZWF0dXJlIHNlcnZpY2UsIG5hdGl2ZSBOQyBzdGF0ZS1wbGFuZSAoMzIxMTkpIG1ldGVycyDigJRcbi8vIGNvbmZvcm1hbCwgc28gdGhlIHNpbGhvdWV0dGUga2VlcHMgaXRzIHRydWUgcHJvcG9ydGlvbnM7IHNpbXBsaWZpZWQgdG8gMTg3IHBvaW50cyBhbmRcbi8vIHVuaWZvcm1seSBzY2FsZWQgaW50byBhIDIwNHgxMTggYm94LiBTaGFyZXMgYXJyaXZlIGZyb20gdGhlIHBhaXIgc2VjdGlvbidzIHN0YXRzIHRleHRcbi8vICh3aWRnZXQudHN4IHBhcnNlcyB0aGVtKSwgc28gZmlndXJlIGFuZCBudW1iZXJzIGNhbid0IGRyaWZ0LiBJbmplY3RlZCBIVE1MIG5ldmVyIHJ1bnNcbi8vIDxzY3JpcHQ+LCBidXQgaW5saW5lIGhhbmRsZXIgYXR0cmlidXRlcyBkbyDigJQgdGhleSBjYWxsIHRoZSBvbmUgcHBTZXQgZ2xvYmFsIGluIHdpZGdldC50c3guXG5jb25zdCBhcG5lcFBhdGggPSAnTSAxMDQuMSAwLjAgTCAxMDYuMiAxLjggTCAxMDYuOCAzLjYgTCAxMTAuMiA0LjEgTCAxMTEuNyA1LjMgTCAxMTMuNyAzLjcgTCAxMTMuOSAxLjkgTCAxMTQuOSAzLjEgTCAxMTUuNyAyLjYgTCAxMTguMSA1LjEgTCAxMTkuNSA0LjggTCAxMTkuMyA1LjQgTCAxMjAuNSA1LjUgTCAxMjEuOSA3LjQgTCAxMjIuOCA3LjYgTCAxMjQuMCAxMS41IEwgMTIyLjcgMTQuMCBMIDEyMy4zIDE2LjcgTCAxMjEuOSAxOC45IEwgMTIxLjkgMjAuNiBMIDEyMS4xIDIxLjAgTCAxMjIuNiAyMy4xIEwgMTI0LjIgMjMuNCBMIDEyNC42IDI1LjAgTCAxMjcuNCAyNS4xIEwgMTI5LjQgMjQuMCBMIDEyOS44IDIyLjMgTCAxMzEuMCAyMS44IEwgMTMwLjYgMjAuMSBMIDEzMS41IDE5LjggTCAxMzQuOSAyMC42IEwgMTM2LjggMjMuMyBMIDE0MS41IDI0LjkgTCAxNDIuNCAyMi43IEwgMTQxLjkgMjAuNCBMIDE0My4yIDE4LjUgTCAxNDMuOCAxOC4wIEwgMTQ0LjYgMTguNyBMIDE0Ny4yIDE4LjcgTCAxNDguMSAxNy43IEwgMTQ4LjkgMTguMiBMIDE1MC4wIDE2LjUgTCAxNTMuOCAyNy43IEwgMTU3LjggNDMuMSBMIDE2OS43IDY4LjQgTCAxNzAuNCA3My4wIEwgMTY4LjggODYuOSBMIDE2OC4zIDg4LjYgTCAxNjcuNiA4Ny45IEwgMTY1LjkgODguMCBMIDE1OS40IDkwLjUgTCAxNTMuOSA5My41IEwgMTUxLjMgOTYuNCBMIDE0OC44IDk3LjMgTCAxMzguMCAxMDguNCBMIDEzMy45IDExNC40IEwgMTMyLjUgMTE4LjAgTCAxMzEuNyAxMTYuNCBMIDEzMS45IDExNS44IEwgMTMyLjAgMTE2LjYgTCAxMzIuNyAxMTYuNSBMIDEzMi4xIDExNS4zIEwgMTI3LjIgMTEzLjEgTCAxMjAuNCAxMTMuNSBMIDExMS4yIDExNS45IEwgMTExLjcgMTE0LjcgTCAxMTEuMSAxMTQuNCBMIDExMS40IDExMi43IEwgMTEwLjYgMTEwLjcgTCAxMDguOCAxMDkuNiBMIDEwOC4wIDEwOC40IEwgMTA4LjUgMTA3LjIgTCAxMDcuNyAxMDcuMyBMIDEwNy4wIDEwNS4wIEwgMTA1LjIgMTAzLjIgTCAxMDMuMCAxMDIuNyBMIDEwMS42IDEwMy45IEwgOTYuNiAxMDEuNCBMIDkxLjYgMTAwLjggTCA5MC4yIDEwMS40IEwgODcuNyA5OS4yIEwgODguMCA5OC4yIEwgODcuMyA5Ny44IEwgODcuOCA5Ni4xIEwgODYuOCA5My41IEwgODEuNyA5MC4xIEwgNzguMSA4OS43IEwgNzcuNyA5MC41IEwgNzYuMiA5MC42IEwgNzQuOSA5Mi43IEwgNzQuMSA5MS4zIEwgNzIuMCA5MC41IEwgNzAuMSA5MC45IEwgNjYuMSA4Ny43IEwgNjMuOSA4OS4yIEwgNjAuMSA4OC43IEwgNTguOSA4Ny4yIEwgNjAuNSA4NS4wIEwgNTguMyA4NC4yIEwgNTcuNiA4MS4yIEwgNTYuMCA4MS4xIEwgNTQuMSA3OC40IEwgNTEuMiA3Ni44IEwgNDkuOSA3NC4yIEwgNDcuNyA3My45IEwgNDcuMSA3Mi41IEwgNDcuOSA3MC42IEwgNDcuMSA2OC4xIEwgNDcuNSA2Ni40IEwgNDYuNCA2NC4xIEwgNDcuNSA2My4wIEwgNDYuNyA1OS44IEwgNDcuNiA1OC4yIEwgNDMuMSA1NC44IEwgMzguOSA1NS41IEwgMzguNyA1NC42IEwgMzYuOCA1NS4zIEwgMzUuNiA1NC40IEwgMzQuNSA1NC44IEwgMzMuNSA1Mi44IEwgMzQuNSA1MS4wIEwgMzQuMyA0Ni4zIEwgMzcuMSA0Ni4wIEwgMzcuMyA0My41IEwgMzkuOSA0MS40IEwgNDEuNSAzOC4zIEwgNDIuNCAzOS4zIEwgNDQuMCAzOC41IEwgNDQuNSAzOS40IEwgNDUuNyAzOS42IEwgNDcuOCAzNy4wIEwgNTAuMiAzNy43IEwgNTAuOCAzNy4zIEwgNTEuNiAzOC40IEwgNTUuMSAzOS42IEwgNTYuOSAzOC45IEwgNTguMiAzOS4xIEwgNTkuMiA0MC4zIEwgNjEuNSA0MC4yIEwgNjIuOCA0MS42IEwgNjUuNSAzOS45IEwgNjUuNCAzOC44IEwgNjcuMyAzNy4xIEwgNzEuMSAzNS45IEwgNzMuMSAzNi41IEwgNzUuNCAzNS45IEwgNzguMCAzNy4xIEwgNzkuNyAzNi4xIEwgODUuMiAzOC4yIEwgODcuMyAzNS4xIEwgODkuNSAzNC43IEwgODkuMiAzMi45IEwgODYuOCAzMi4xIEwgODYuMCAzMi42IEwgODQuMCAzMS41IEwgODQuMSAzMC4yIEwgODIuNiAyOC44IEwgNzkuNCAyOC40IEwgNzguMCAyNi4yIEwgNzQuMyAyNS41IEwgNzAuOCAyMS40IEwgNjcuOSAyMS41IEwgNjMuMiAxOS40IEwgNjEuOSAyMC4wIEwgNjEuNyAxOS40IEwgNjAuNCAxOS41IEwgNTguNSAxNS40IEwgNTkuOCAxNC42IEwgNjAuMiA3LjcgTCA2Mi42IDcuOCBMIDY0LjYgNi43IEwgNjUuOSA2LjggTCA2Ni4yIDUuMiBMIDY3LjkgNC40IEwgNjkuMCAyLjYgTCA3Mi4zIDIuOCBMIDc3LjMgNy44IEwgODAuNCA1LjQgTCA4Ni4zIDQuOCBMIDkwLjggMy4xIEwgOTIuMSAxLjcgTCA5NC44IDMuMiBMIDk3LjggMy4yIEwgMTAxLjggMC42IEwgMTAyLjUgMS4wIEwgMTAzLjEgMC4wIEwgMTA0LjEgMC4wIFonXG5jb25zdCBhcG5lcEJveCA9IHsgeDogMzMuNSwgdzogMTM3LCBoOiAxMTggfVxuXG4vLyBPcmRlciBtYXRjaGVzIHRoZSBwYWlyIHNlY3Rpb24ncyBzdGF0cyB0ZXh0OiBjb3ZlcmFnZSwgcHJlc3N1cmUsIHJlc291cmNlLCBjb25mbGljdC5cbmNvbnN0IHBwU3RhdHMgPSBbXG4gIHsgbGFiZWw6ICdEYXRhIGNvdmVyYWdlJywgY29sb3I6ICcjNjQ3NDhiJyB9LFxuICB7IGxhYmVsOiAnSGlnaCBwcmVzc3VyZScsIGNvbG9yOiAnI2M1N2FkZScgfSxcbiAgeyBsYWJlbDogJ0hpZ2ggcmVzb3VyY2UnLCBjb2xvcjogJyNhOGJlMzgnIH0sXG4gIHsgbGFiZWw6ICdDb25mbGljdCcsIGNvbG9yOiAnIzRlNjQ5ZScgfVxuXVxuXG5leHBvcnQgY29uc3QgcGFpckZpbGxIdG1sID0gKHNoYXJlczogbnVtYmVyW10sIHVpZCA9ICdwcCcpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgaWYgKHNoYXJlcy5sZW5ndGggPCBwcFN0YXRzLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgLy8gVW5pcXVlIGNsaXAgaWQ6IHNldmVyYWwgdmlld3MgY2FuIG1vdW50IHRoaXMgc2FtZSBzdmcgYXQgb25jZSwgYW5kIGR1cGxpY2F0ZVxuICAvLyBpZHMgYnJlYWsgdXJsKCMuLi4pIHJlc29sdXRpb24g4oCUIGEgbG9zdCBjbGlwIHNob3dzIHRoZSByYXcgcmVjdGFuZ2xlLlxuICAvLyBDb3ZlcmFnZSBpcyBhIHJlZ2lvbiBzaGFyZSBhbHJlYWR5OyB0aGUgb3RoZXIgc3RhdHMgYXJlIHNoYXJlcyBvZiB0aGUgbWFwcGVkIGNlbGxzLFxuICAvLyBzbyB0aGV5IHNjYWxlIGJ5IGNvdmVyYWdlIOKAlCB0aGUgZmlsbCBhbHdheXMgbWVhbnMgXCJzaGFyZSBvZiB0aGUgQVBORVAgcmVnaW9uXCIuXG4gIGNvbnN0IHJlZ2lvblBjdCA9IChpOiBudW1iZXIpOiBudW1iZXIgPT4gKGkgPT09IDAgPyBzaGFyZXNbMF0gOiBzaGFyZXNbaV0gKiBzaGFyZXNbMF0gLyAxMDApXG4gIGNvbnN0IHN0YXRUZXh0ID0gKGk6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIHJldHVybiBgJHtzaGFyZXNbMF19JSBvZiByZWdpb24gY2VsbHNgXG4gICAgfVxuICAgIGNvbnN0IHJwID0gcmVnaW9uUGN0KGkpXG4gICAgcmV0dXJuIGAke3NoYXJlc1tpXX0lIG9mIG1hcHBlZCBjZWxscyDCtyAkeyhycCA+PSAwLjA1ID8gcnAudG9GaXhlZCgxKSA6ICc8MC4xJyl9JSBvZiByZWdpb25gXG4gIH1cbiAgY29uc3QgY2hpcCA9IChpOiBudW1iZXIpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHJlZ2lvblBjdChpKSkpIC8gMTAwICogYXBuZXBCb3guaFxuICAgIGNvbnN0IHMgPSBwcFN0YXRzW2ldXG4gICAgcmV0dXJuIGA8c3BhbiBvbmNsaWNrPVwicHBTZXQodGhpcylcIiBkYXRhLXk9XCIkeyhhcG5lcEJveC5oIC0gaCkudG9GaXhlZCgxKX1cIiBkYXRhLWg9XCIke2gudG9GaXhlZCgxKX1cIiBkYXRhLWM9XCIke3MuY29sb3J9XCIgZGF0YS10PVwiJHtzdGF0VGV4dChpKX1cIiBzdHlsZT1cIndoaXRlLXNwYWNlOm5vd3JhcDtjdXJzb3I6cG9pbnRlcjtib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6M3B4IDlweDtmb250LXNpemU6MTAuNXB4O2ZvbnQtd2VpZ2h0OjcwMDtiYWNrZ3JvdW5kOiR7aSA9PT0gMCA/IHMuY29sb3IgOiAnI2VlZjJmNid9O2NvbG9yOiR7aSA9PT0gMCA/ICcjZmZmZmZmJyA6ICcjMzM0MTU1J307XCI+JHtzLmxhYmVsfTwvc3Bhbj5gXG4gIH1cbiAgY29uc3QgaDAgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHJlZ2lvblBjdCgwKSkpIC8gMTAwICogYXBuZXBCb3guaFxuICBjb25zdCBjbGlwSWQgPSBgcHBDbGlwLSR7dWlkfWBcbiAgcmV0dXJuIGBcbiAgICA8ZGl2IGRhdGEtcHAgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHg7ZGlzcGxheTpmbGV4O2dhcDo4cHg7YWxpZ24taXRlbXM6ZmxleC1zdGFydDtcIj5cbiAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7bWluLXdpZHRoOjA7XCI+XG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyMDQgMTE4XCIgc3R5bGU9XCJ3aWR0aDoxMDAlO2Rpc3BsYXk6YmxvY2s7XCI+XG4gICAgICAgICAgPGRlZnM+PGNsaXBQYXRoIGlkPVwiJHtjbGlwSWR9XCI+PHBhdGggZD1cIiR7YXBuZXBQYXRofVwiLz48L2NsaXBQYXRoPjwvZGVmcz5cbiAgICAgICAgICA8cGF0aCBkPVwiJHthcG5lcFBhdGh9XCIgZmlsbD1cIiNmMWY1ZjlcIiBzdHJva2U9XCIjOTRhM2I4XCIgc3Ryb2tlLXdpZHRoPVwiMC44XCIvPlxuICAgICAgICAgICR7aDAgPiAwLjA1ID8gYDxyZWN0IGRhdGEtZmlsbCB4PVwiJHthcG5lcEJveC54fVwiIHk9XCIkeyhhcG5lcEJveC5oIC0gaDApLnRvRml4ZWQoMSl9XCIgd2lkdGg9XCIke2FwbmVwQm94Lnd9XCIgaGVpZ2h0PVwiJHtoMC50b0ZpeGVkKDEpfVwiIGZpbGw9XCIke3BwU3RhdHNbMF0uY29sb3J9XCIgb3BhY2l0eT1cIjAuOVwiIGNsaXAtcGF0aD1cInVybCgjJHtjbGlwSWR9KVwiLz5gIDogJyd9XG4gICAgICAgICAgPHBhdGggZD1cIiR7YXBuZXBQYXRofVwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiIzk0YTNiOFwiIHN0cm9rZS13aWR0aD1cIjAuOFwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjRweDtmb250LXNpemU6MTFweDtmb250LXdlaWdodDo4MDA7XCI+PHNwYW4gZGF0YS1udW0gc3R5bGU9XCJjb2xvcjoke3BwU3RhdHNbMF0uY29sb3J9O1wiPiR7c3RhdFRleHQoMCl9PC9zcGFuPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NHB4O2ZsZXgtc2hyaW5rOjA7XCI+JHtwcFN0YXRzLm1hcCgoXywgaSkgPT4gY2hpcChpKSkuam9pbignJyl9PC9kaXY+XG4gICAgPC9kaXY+YFxufVxuXG5leHBvcnQgY29uc3QgYml2Q2FyZEh0bWwgPSAoYXR0cnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCB2YXJpYW50OiAndm1zJyB8ICdtb2Rlcm4nID0gJ3ZtcycsIGluZm8/OiBGZWF0dXJlSW5mb0NvbmZpZywgbWF4PzogQXhpc01heCB8IG51bGwpOiBzdHJpbmcgfCBudWxsID0+IHtcbiAgaWYgKGF0dHJzLnBhaXIgPT0gbnVsbCAmJiBhdHRycy5iaXZfY2xhc3MgPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuIHZhcmlhbnQgPT09ICdtb2Rlcm4nID8gbW9kZXJuQ2FyZEh0bWwoYXR0cnMsIGluZm8sIG1heCkgOiB2bXNDYXJkSHRtbChhdHRycylcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2FyY2dpc19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2NvcmVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfX2Vtb3Rpb25fcmVhY3RfanN4X3J1bnRpbWVfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCIvKipcclxuICogV2VicGFjayB3aWxsIHJlcGxhY2UgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gd2l0aCBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgdG8gc2V0IHRoZSBwdWJsaWMgcGF0aCBkeW5hbWljYWxseS5cclxuICogVGhlIHJlYXNvbiB3aHkgd2UgY2FuJ3Qgc2V0IHRoZSBwdWJsaWNQYXRoIGluIHdlYnBhY2sgY29uZmlnIGlzOiB3ZSBjaGFuZ2UgdGhlIHB1YmxpY1BhdGggd2hlbiBkb3dubG9hZC5cclxuICogKi9cclxuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB3aW5kb3cuamltdUNvbmZpZy5iYXNlVXJsXHJcbiIsIi8qKiBAanN4IGpzeCAqL1xuaW1wb3J0IHsgUmVhY3QsIGpzeCwgdHlwZSBBbGxXaWRnZXRQcm9wcywgZ2V0QXBwU3RvcmUsIGFwcEFjdGlvbnMgfSBmcm9tICdqaW11LWNvcmUnXG5pbXBvcnQgeyBKaW11TWFwVmlld0NvbXBvbmVudCwgdHlwZSBKaW11TWFwVmlldyB9IGZyb20gJ2ppbXUtYXJjZ2lzJ1xuaW1wb3J0IHsgdHlwZSBJTUNvbmZpZywgdHlwZSBGZWF0dXJlSW5mb0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZydcbmltcG9ydCB7IGJpdkNhcmRIdG1sLCBzY2FsZXNIdG1sLCBwYWlyRmlsbEh0bWwsIHR5cGUgQXhpc01heCB9IGZyb20gJy4vcG9wdXAtY2FyZCdcblxuY29uc3QgYmFzZVBpbGw6IFJlYWN0LkNTU1Byb3BlcnRpZXMgPSB7XG4gIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICBjb2xvcjogJyNmZmZmZmYnLFxuICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcbiAgcGFkZGluZzogJzJweCAxMHB4JyxcbiAgZm9udFdlaWdodDogJ2JvbGQnLFxuICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgbGlzdFN0eWxlOiAnbm9uZSdcbn1cblxuaW50ZXJmYWNlIEZlYXR1cmVIaXQge1xuICBsYXllclRpdGxlOiBzdHJpbmdcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmdcbiAgZmllbGRzPzogQXJyYXk8W3N0cmluZywgc3RyaW5nXT5cbiAgaHRtbD86IHN0cmluZ1xufVxuXG5jb25zdCBpZ25vcmVkQXR0ciA9IC9eKEZJRHxPQkpFQ1RJRHxHbG9iYWxJRHxTaGFwZSkvaVxuXG5sZXQgcHBVaWRDb3VudGVyID0gMFxuXG4vLyBDaGlwIGhhbmRsZXIgZm9yIHRoZSBwYWlyLXByb2ZpbGUgYm91bmRhcnkgZmlsbCB0b2dnbGUuIEluamVjdGVkIEhUTUwgbmV2ZXIgcnVuc1xuLy8gPHNjcmlwdD4gdGFncywgYnV0IGlubGluZSBoYW5kbGVyIGF0dHJpYnV0ZXMgZG8gZmlyZSDigJQgYWxsIGNoaXBzIGNhbGwgdGhpcyBvbmUgZ2xvYmFsLlxuOyh3aW5kb3cgYXMgYW55KS5wcFNldCA9IChjaGlwOiBIVE1MRWxlbWVudCkgPT4ge1xuICBjb25zdCByb290ID0gY2hpcC5jbG9zZXN0KCdbZGF0YS1wcF0nKVxuICBjb25zdCBmaWxsID0gcm9vdD8ucXVlcnlTZWxlY3RvcignW2RhdGEtZmlsbF0nKVxuICBjb25zdCBudW0gPSByb290Py5xdWVyeVNlbGVjdG9yKCdbZGF0YS1udW1dJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsXG4gIGlmICghZmlsbCkge1xuICAgIHJldHVyblxuICB9XG4gIGZpbGwuc2V0QXR0cmlidXRlKCd5JywgY2hpcC5kYXRhc2V0LnkgPz8gJycpXG4gIGZpbGwuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBjaGlwLmRhdGFzZXQuaCA/PyAnJylcbiAgZmlsbC5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBjaGlwLmRhdGFzZXQuYyA/PyAnJylcbiAgZm9yIChjb25zdCBlbCBvZiBBcnJheS5mcm9tKGNoaXAucGFyZW50RWxlbWVudD8uY2hpbGRyZW4gPz8gW10pKSB7XG4gICAgY29uc3QgYyA9IGVsIGFzIEhUTUxFbGVtZW50XG4gICAgY29uc3QgYWN0aXZlID0gYyA9PT0gY2hpcFxuICAgIGMuc3R5bGUuYmFja2dyb3VuZCA9IGFjdGl2ZSA/IChjaGlwLmRhdGFzZXQuYyA/PyAnI2VlZjJmNicpIDogJyNlZWYyZjYnXG4gICAgYy5zdHlsZS5jb2xvciA9IGFjdGl2ZSA/ICcjZmZmZmZmJyA6ICcjMzM0MTU1J1xuICB9XG4gIGlmIChudW0pIHtcbiAgICBudW0udGV4dENvbnRlbnQgPSBjaGlwLmRhdGFzZXQudCA/PyAnJ1xuICAgIG51bS5zdHlsZS5jb2xvciA9IGNoaXAuZGF0YXNldC5jID8/ICcnXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gV2lkZ2V0KHByb3BzOiBBbGxXaWRnZXRQcm9wczxJTUNvbmZpZz4pIHtcbiAgY29uc3QgeyB0aXRsZSwgc2VjdGlvbnMsIHBhaXIgfSA9IHByb3BzLmNvbmZpZyA/PyB7fVxuICBjb25zdCB1c2VNYXBXaWRnZXRJZCA9IHByb3BzLnVzZU1hcFdpZGdldElkcz8uWzBdXG4gIGNvbnN0IGZlYXR1cmVJbmZvID0geyB0b29sOiAnY2xpY2snLCBzaG93VG9wT25seTogdHJ1ZSwgLi4uKHByb3BzLmNvbmZpZz8uZmVhdHVyZUluZm8gPz8ge30pIH1cbiAgY29uc3QgdGFiYmVkID0gISFmZWF0dXJlSW5mby50YWJiZWRcbiAgY29uc3QgW3RhYiwgc2V0VGFiXSA9IFJlYWN0LnVzZVN0YXRlPCdpbmZvJyB8ICdwb3B1cCc+KCdpbmZvJylcbiAgY29uc3QgW2hpdHMsIHNldEhpdHNdID0gUmVhY3QudXNlU3RhdGU8RmVhdHVyZUhpdFtdPihbXSlcbiAgY29uc3QgW2VtcHR5LCBzZXRFbXB0eV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgY2xpY2tIYW5kbGVSZWYgPSBSZWFjdC51c2VSZWY8X19lc3JpLkhhbmRsZT4obnVsbClcbiAgY29uc3QgbW92ZUhhbmRsZVJlZiA9IFJlYWN0LnVzZVJlZjxfX2VzcmkuSGFuZGxlPihudWxsKVxuICBjb25zdCBob3ZlclRpbWVyUmVmID0gUmVhY3QudXNlUmVmPG51bWJlcj4obnVsbClcbiAgY29uc3QgcG9wdXBWaWV3UmVmID0gUmVhY3QudXNlUmVmPF9fZXNyaS5NYXBWaWV3PihudWxsKVxuICBjb25zdCBwb3B1cFdhc0VuYWJsZWRSZWYgPSBSZWFjdC51c2VSZWY8Ym9vbGVhbj4obnVsbClcblxuICBjb25zdCByZXN0b3JlUG9wdXAgPSAoKSA9PiB7XG4gICAgaWYgKHBvcHVwVmlld1JlZi5jdXJyZW50ICYmIHBvcHVwV2FzRW5hYmxlZFJlZi5jdXJyZW50ICE9IG51bGwpIHtcbiAgICAgIHBvcHVwVmlld1JlZi5jdXJyZW50LnBvcHVwRW5hYmxlZCA9IHBvcHVwV2FzRW5hYmxlZFJlZi5jdXJyZW50XG4gICAgfVxuICAgIHBvcHVwVmlld1JlZi5jdXJyZW50ID0gbnVsbFxuICAgIHBvcHVwV2FzRW5hYmxlZFJlZi5jdXJyZW50ID0gbnVsbFxuICB9XG5cbiAgLy8gQmFyIHNjYWxlOiBxdWVyeVN0YXRpc3RpY3Mgc3VwcG9ydHMgYSBtYXggYWdncmVnYXRlLCBzbyBvbmUgY2hlYXAgc3RhdHMgY2FsbCBwZXJcbiAgLy8gcGFpciBsYXllciBnaXZlcyB0aGUgdHJ1ZSAw4oaSbWF4IHJhbmdlLiBDYWNoZWQgcGVyIHNlc3Npb24uIFRoZSB3aGVyZSBjbGF1c2UgcGluc1xuICAvLyB0aGUgcXVlcnkgdG8gb25lIHBhaXI6IHRoZSBydW50aW1lIGRvZXMgbm90IGFsd2F5cyBhcHBseSB0aGUgd2ViIG1hcCdzXG4gIC8vIGRlZmluaXRpb25FeHByZXNzaW9uLCBhbmQgYW4gdW5maWx0ZXJlZCBxdWVyeSB3b3VsZCBzcGFuIGFsbCBzZXZlbiBwYWlycy5cbiAgY29uc3QgbWF4Q2FjaGVSZWYgPSBSZWFjdC51c2VSZWY8TWFwPHN0cmluZywgQXhpc01heD4+KG5ldyBNYXAoKSlcblxuICBjb25zdCBwYWlyV2hlcmUgPSAocDogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nID0+IGBwYWlyID0gJyR7U3RyaW5nKHApLnJlcGxhY2UoLycvZywgXCInJ1wiKX0nYFxuXG4gIGNvbnN0IGxvYWRNYXggPSBhc3luYyAobGF5ZXI6IF9fZXNyaS5GZWF0dXJlTGF5ZXIsIHdoZXJlID0gJzE9MScpOiBQcm9taXNlPEF4aXNNYXggfCBudWxsPiA9PiB7XG4gICAgaWYgKCFsYXllci5xdWVyeUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBjb25zdCBrZXkgPSBgJHtsYXllci50aXRsZSB8fCBsYXllci5pZH18JHt3aGVyZX1gXG4gICAgY29uc3QgY2FjaGVkID0gbWF4Q2FjaGVSZWYuY3VycmVudC5nZXQoa2V5KVxuICAgIGlmIChjYWNoZWQpIHtcbiAgICAgIHJldHVybiBjYWNoZWRcbiAgICB9XG4gICAgY29uc3QgcSA9IGF3YWl0IGxheWVyLnF1ZXJ5RmVhdHVyZXMoe1xuICAgICAgd2hlcmUsXG4gICAgICBvdXRTdGF0aXN0aWNzOiBbXG4gICAgICAgIHsgc3RhdGlzdGljVHlwZTogJ21heCcsIG9uU3RhdGlzdGljRmllbGQ6ICdwcmVzc3VyZScsIG91dFN0YXRpc3RpY0ZpZWxkTmFtZTogJ3BNYXgnIH0sXG4gICAgICAgIHsgc3RhdGlzdGljVHlwZTogJ21heCcsIG9uU3RhdGlzdGljRmllbGQ6ICdyZXNvdXJjZScsIG91dFN0YXRpc3RpY0ZpZWxkTmFtZTogJ3JNYXgnIH1cbiAgICAgIF0sXG4gICAgICByZXR1cm5HZW9tZXRyeTogZmFsc2VcbiAgICB9KS5jYXRjaCgoKSA9PiBudWxsKVxuICAgIGNvbnN0IHMgPSBxPy5mZWF0dXJlcz8uWzBdPy5hdHRyaWJ1dGVzID8/IHt9XG4gICAgY29uc3QgbWF4OiBBeGlzTWF4ID0geyBwcmVzc3VyZTogTnVtYmVyKHMucE1heCkgfHwgbnVsbCwgcmVzb3VyY2U6IE51bWJlcihzLnJNYXgpIHx8IG51bGwgfVxuICAgIG1heENhY2hlUmVmLmN1cnJlbnQuc2V0KGtleSwgbWF4KVxuICAgIHJldHVybiBtYXhcbiAgfVxuXG4gIC8vIFN0YXRpYyBwYWlyIHByb2ZpbGUgZm9yIHRoZSBJbmZvIHRhYiAobW9kZXJuIHBhbmVscyBvbmx5KTogcHJvYmUgdGhlIG1hcCdzIGxheWVycyBmb3JcbiAgLy8gb25lIHRoYXQgcmV0dXJucyBwYWlyIGZlYXR1cmVzIOKAlCBpdHMgYnJlYWsgZmllbGRzIGFycml2ZSB3aXRoIHRoZSBzYW1wbGUsIGFuZCBsb2FkTWF4XG4gIC8vIGFkZHMgdGhlIHRydWUgbWF4aW1hLiBSZW5kZXJlZCBvbmNlIHBlciB2aWV3OyBuZXZlciBpbnZvbHZlZCBpbiBjbGlja3MuXG4gIGNvbnN0IFtwcm9maWxlLCBzZXRQcm9maWxlXSA9IFJlYWN0LnVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpXG5cbiAgY29uc3QgbG9hZFByb2ZpbGUgPSBhc3luYyAodmlldzogX19lc3JpLk1hcFZpZXcpID0+IHtcbiAgICBpZiAoZmVhdHVyZUluZm8ucG9wdXBWYXJpYW50ICE9PSAnbW9kZXJuJykge1xuICAgICAgc2V0UHJvZmlsZShudWxsKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHdoZXJlID0gcGFpciA/IHBhaXJXaGVyZShwYWlyKSA6ICcxPTEnXG4gICAgY29uc3QgaXRlbXMgPSAodmlldy5tYXA/LmxheWVycz8uaXRlbXMgPz8gW10pIGFzIF9fZXNyaS5GZWF0dXJlTGF5ZXJbXVxuICAgIGZvciAoY29uc3QgbGF5ZXIgb2YgaXRlbXMpIHtcbiAgICAgIGlmICghbGF5ZXIucXVlcnlGZWF0dXJlcykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgcSA9IGF3YWl0IGxheWVyLnF1ZXJ5RmVhdHVyZXMoeyB3aGVyZSwgb3V0RmllbGRzOiBbJyonXSwgcmV0dXJuR2VvbWV0cnk6IGZhbHNlLCBudW06IDEgfSkuY2F0Y2goKCkgPT4gbnVsbClcbiAgICAgIGNvbnN0IGF0dHJzID0gcT8uZmVhdHVyZXM/LlswXT8uYXR0cmlidXRlcyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVuZGVmaW5lZFxuICAgICAgaWYgKGF0dHJzPy5wYWlyICE9IG51bGwgJiYgYXR0cnMuYml2X2NsYXNzICE9IG51bGwpIHtcbiAgICAgICAgc2V0UHJvZmlsZShzY2FsZXNIdG1sKGF0dHJzLCBhd2FpdCBsb2FkTWF4KGxheWVyLCB3aGVyZSkpKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgc2V0UHJvZmlsZShudWxsKVxuICB9XG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY2xpY2tIYW5kbGVSZWYuY3VycmVudD8ucmVtb3ZlKClcbiAgICAgIG1vdmVIYW5kbGVSZWYuY3VycmVudD8ucmVtb3ZlKClcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoaG92ZXJUaW1lclJlZi5jdXJyZW50KVxuICAgICAgcmVzdG9yZVBvcHVwKClcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IHJhd0ZpZWxkcyA9IChhdHRyczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPiA9PlxuICAgIE9iamVjdC5lbnRyaWVzKGF0dHJzKVxuICAgICAgLmZpbHRlcigoW2tdKSA9PiAhaWdub3JlZEF0dHIudGVzdChrKSlcbiAgICAgIC5tYXAoKFtrLCB2XSkgPT4gW2ssIHYgPT0gbnVsbCA/ICcnIDogU3RyaW5nKHYpXSlcblxuICAvLyBPcGVuIHRoZSBzaWRlYmFyIGxheW91dCB3aWRnZXQgdGhhdCBjb250YWlucyB0aGlzIHBhbmVsIChzdGF0ZSAnY29sbGFwc2UnIHRydWUgPSB2aXNpYmxlKS5cbiAgY29uc3Qgb3BlblNpZGViYXIgPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSBnZXRBcHBTdG9yZSgpLmdldFN0YXRlKClcbiAgICBjb25zdCB3aWRnZXRzID0gc3RhdGUuYXBwQ29uZmlnPy53aWRnZXRzID8/IHt9XG4gICAgZm9yIChjb25zdCBbaWQsIHddIG9mIE9iamVjdC5lbnRyaWVzKHdpZGdldHMpKSB7XG4gICAgICBpZiAodz8udXJpICE9PSAnd2lkZ2V0cy9sYXlvdXQvc2lkZWJhci8nKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCBjb250ZW50ID0gc3RhdGUuYXBwQ29uZmlnPy5sYXlvdXRzPy5bKHcgYXMgYW55KT8ubGF5b3V0cz8uRklSU1Q/LkxBUkdFXT8uY29udGVudCA/PyB7fVxuICAgICAgaWYgKE9iamVjdC52YWx1ZXMoY29udGVudCkuc29tZShjID0+IGM/LndpZGdldElkID09PSBwcm9wcy5pZCkpIHtcbiAgICAgICAgZ2V0QXBwU3RvcmUoKS5kaXNwYXRjaChhcHBBY3Rpb25zLndpZGdldFN0YXRlUHJvcENoYW5nZShpZCwgJ2NvbGxhcHNlJywgdHJ1ZSkpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGRvSGl0VGVzdCA9IGFzeW5jICh2aWV3OiBfX2VzcmkuTWFwVmlldywgZSkgPT4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHZpZXcuaGl0VGVzdChlKS5jYXRjaCgoKSA9PiBudWxsKVxuICAgIGlmICghcmVzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgYm0gPSB2aWV3Lm1hcD8uYmFzZW1hcFxuICAgIGNvbnN0IGlzQmFzZW1hcExheWVyID0gKGw6IF9fZXNyaS5MYXllcikgPT4gKGJtPy5iYXNlTGF5ZXJzPy5pbmNsdWRlcyhsIGFzIGFueSkgfHwgYm0/LnJlZmVyZW5jZUxheWVycz8uaW5jbHVkZXMobCBhcyBhbnkpKVxuICAgIGxldCBmZWF0cyA9IChyZXMucmVzdWx0cyA/PyBbXSkuZmlsdGVyKHIgPT4gci50eXBlID09PSAnZ3JhcGhpYycgJiYgci5sYXllcj8udGl0bGUgJiYgIWlzQmFzZW1hcExheWVyKHIubGF5ZXIpKVxuICAgIGlmICghZmVhdHMubGVuZ3RoKSB7XG4gICAgICBzZXRIaXRzKFtdKVxuICAgICAgc2V0RW1wdHkodHJ1ZSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzZXRFbXB0eShmYWxzZSlcbiAgICBpZiAodGFiYmVkICYmIGZlYXR1cmVJbmZvLnRvb2wgPT09ICdjbGljaycpIHtcbiAgICAgIHNldFRhYigncG9wdXAnKVxuICAgIH1cbiAgICBjb25zdCBpc1BhaXJMYXllciA9IChyKSA9PiB7XG4gICAgICBjb25zdCB0ID0gKHIubGF5ZXIgYXMgX19lc3JpLkZlYXR1cmVMYXllcik/LnBvcHVwVGVtcGxhdGVcbiAgICAgIGNvbnN0IGF0dHJzID0gci5ncmFwaGljPy5hdHRyaWJ1dGVzXG4gICAgICByZXR1cm4gdD8udGl0bGU/LmluY2x1ZGVzKCdwYWlyJykgfHwgci5sYXllcj8udGl0bGU/LmluY2x1ZGVzKCcgeCAnKSB8fCBhdHRycz8ucGFpciAhPSBudWxsIHx8IGF0dHJzPy5iaXZfY2xhc3MgIT0gbnVsbFxuICAgIH1cbiAgICAvLyBIZXggcGFpciBsYXllcnMgdGFrZSBwcmlvcml0eSBvdmVyIG90aGVyIGxheWVycyBhdCB0aGUgcG9pbnQsIHJlZ2FyZGxlc3Mgb2YgaGl0IG9yZGVyLlxuICAgIGNvbnN0IHBhaXJGZWF0cyA9IGZlYXRzLmZpbHRlcihpc1BhaXJMYXllcilcbiAgICBjb25zdCBjaG9zZW4gPSBwYWlyRmVhdHMubGVuZ3RoID8gcGFpckZlYXRzLnNsaWNlKDAsIDEpIDogKGZlYXR1cmVJbmZvLnNob3dUb3BPbmx5ID8gZmVhdHMuc2xpY2UoMCwgMSkgOiBmZWF0cylcbiAgICBjb25zdCBvdXQ6IEZlYXR1cmVIaXRbXSA9IFtdXG4gICAgZm9yIChjb25zdCByIG9mIGNob3Nlbikge1xuICAgICAgbGV0IGF0dHJzID0gKHIuZ3JhcGhpYz8uYXR0cmlidXRlcyA/PyBudWxsKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGxcbiAgICAgIC8vIGhpdFRlc3QgYXR0cmlidXRlcyBjYW4gYmUgdGhpbiBkZXBlbmRpbmcgb24gdGhlIGxheWVyJ3Mgb3V0RmllbGRzIOKAlCBmZXRjaCB0aGUgZnVsbCByZWNvcmQuXG4gICAgICBpZiAoaXNQYWlyTGF5ZXIocikgJiYgKCFhdHRycyB8fCBhdHRycy5iaXZfY2xhc3MgPT0gbnVsbCB8fCBhdHRycy5wcmVzc3VyZSA9PSBudWxsKSkge1xuICAgICAgICBjb25zdCBsYXllciA9IHIubGF5ZXIgYXMgX19lc3JpLkZlYXR1cmVMYXllclxuICAgICAgICBjb25zdCBvaWQgPSByLmdyYXBoaWM/LmdldE9iamVjdElkPy4oKVxuICAgICAgICBjb25zdCBxID0gYXdhaXQgbGF5ZXIucXVlcnlGZWF0dXJlcyh7XG4gICAgICAgICAgb2JqZWN0SWRzOiBvaWQgIT0gbnVsbCA/IFtvaWRdIDogdW5kZWZpbmVkLFxuICAgICAgICAgIGdlb21ldHJ5OiBlLm1hcFBvaW50LFxuICAgICAgICAgIG91dEZpZWxkczogWycqJ10sXG4gICAgICAgICAgcmV0dXJuR2VvbWV0cnk6IGZhbHNlXG4gICAgICAgIH0pLmNhdGNoKCgpID0+IG51bGwpXG4gICAgICAgIGNvbnN0IGYgPSBxPy5mZWF0dXJlcz8uWzBdXG4gICAgICAgIGlmIChmPy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgYXR0cnMgPSBmLmF0dHJpYnV0ZXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFhdHRycykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgY2FyZCA9IGJpdkNhcmRIdG1sKGF0dHJzLCBmZWF0dXJlSW5mby5wb3B1cFZhcmlhbnQsIGZlYXR1cmVJbmZvLCBpc1BhaXJMYXllcihyKSA/IGF3YWl0IGxvYWRNYXgoci5sYXllciBhcyBfX2VzcmkuRmVhdHVyZUxheWVyLCBhdHRycy5wYWlyICE9IG51bGwgPyBwYWlyV2hlcmUoYXR0cnMucGFpcikgOiAnMT0xJykgOiBudWxsKVxuICAgICAgaWYgKGNhcmQpIHtcbiAgICAgICAgb3V0LnB1c2goeyBsYXllclRpdGxlOiBTdHJpbmcoYXR0cnMucGFpciA/PyByLmxheWVyLnRpdGxlKSwgaHRtbDogY2FyZCB9KVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgdGVtcGxhdGUgPSAoci5sYXllciBhcyBfX2VzcmkuRmVhdHVyZUxheWVyKT8ucG9wdXBUZW1wbGF0ZVxuICAgICAgbGV0IGVudHJ5OiBGZWF0dXJlSGl0ID0gbnVsbFxuICAgICAgaWYgKHRlbXBsYXRlPy5mZXRjaEZlYXR1cmVzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgdGVtcGxhdGUuZmV0Y2hGZWF0dXJlcyhbci5ncmFwaGljXSkuY2F0Y2goKCkgPT4gbnVsbClcbiAgICAgICAgY29uc3QgYyA9IGNvbnRlbnRzPy5bMF1cbiAgICAgICAgaWYgKGM/LmZpZWxkcz8ubGVuZ3RoKSB7XG4gICAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgICBsYXllclRpdGxlOiBjLnRpdGxlIHx8IHIubGF5ZXIudGl0bGUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogdHlwZW9mIGMuZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnID8gYy5kZXNjcmlwdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZpZWxkczogYy5maWVsZHMubWFwKGYgPT4gW2YubGFiZWwgfHwgZi5maWVsZE5hbWUsIGYuZm9ybWF0dGVkVmFsdWUgPz8gZi52YWx1ZSA/PyAnJ10pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIGVudHJ5ID0geyBsYXllclRpdGxlOiByLmxheWVyLnRpdGxlLCBmaWVsZHM6IHJhd0ZpZWxkcyhhdHRycykgfVxuICAgICAgfVxuICAgICAgb3V0LnB1c2goZW50cnkpXG4gICAgfVxuICAgIC8vIEhleCBsYXllciBub3QgaW4gdGhlIGhpdCByZXN1bHRzIGF0IGFsbCDigJQgcXVlcnkgaXQgZGlyZWN0bHkgYnkgdGhlIGNsaWNrIHBvaW50LlxuICAgIGlmICghb3V0Lmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFpckxheWVyID0gKHZpZXcubWFwPy5sYXllcnM/Lml0ZW1zID8/IFtdKS5maW5kKGwgPT5cbiAgICAgICAgKGwgYXMgX19lc3JpLkZlYXR1cmVMYXllcik/LnBvcHVwVGVtcGxhdGU/LnRpdGxlPy5pbmNsdWRlcygncGFpcicpIHx8IGwudGl0bGU/LmluY2x1ZGVzKCcgeCAnKSkgYXMgX19lc3JpLkZlYXR1cmVMYXllclxuICAgICAgaWYgKHBhaXJMYXllcj8ucXVlcnlGZWF0dXJlcykge1xuICAgICAgICBjb25zdCBxID0gYXdhaXQgcGFpckxheWVyLnF1ZXJ5RmVhdHVyZXMoeyBnZW9tZXRyeTogZS5tYXBQb2ludCwgb3V0RmllbGRzOiBbJyonXSwgcmV0dXJuR2VvbWV0cnk6IGZhbHNlIH0pLmNhdGNoKCgpID0+IG51bGwpXG4gICAgICAgIGNvbnN0IGYgPSBxPy5mZWF0dXJlcz8uWzBdXG4gICAgICAgIGlmIChmPy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgY29uc3QgYXR0cnMgPSBmLmF0dHJpYnV0ZXMgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICAgICAgICBjb25zdCBjYXJkID0gYml2Q2FyZEh0bWwoYXR0cnMsIGZlYXR1cmVJbmZvLnBvcHVwVmFyaWFudCwgZmVhdHVyZUluZm8sIGF3YWl0IGxvYWRNYXgocGFpckxheWVyLCBhdHRycy5wYWlyICE9IG51bGwgPyBwYWlyV2hlcmUoYXR0cnMucGFpcikgOiAnMT0xJykpXG4gICAgICAgICAgaWYgKGNhcmQpIHtcbiAgICAgICAgICAgIG91dC5wdXNoKHsgbGF5ZXJUaXRsZTogU3RyaW5nKGF0dHJzLnBhaXIgPz8gcGFpckxheWVyLnRpdGxlKSwgaHRtbDogY2FyZCB9KVxuICAgICAgICAgICAgaWYgKHRhYmJlZCAmJiBmZWF0dXJlSW5mby50b29sID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgICAgIHNldFRhYigncG9wdXAnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBzZXRIaXRzKG91dClcbiAgfVxuXG4gIGNvbnN0IG9uQWN0aXZlVmlld0NoYW5nZSA9IChqbXY6IEppbXVNYXBWaWV3KSA9PiB7XG4gICAgY2xpY2tIYW5kbGVSZWYuY3VycmVudD8ucmVtb3ZlKClcbiAgICBtb3ZlSGFuZGxlUmVmLmN1cnJlbnQ/LnJlbW92ZSgpXG4gICAgY2xpY2tIYW5kbGVSZWYuY3VycmVudCA9IG51bGxcbiAgICBtb3ZlSGFuZGxlUmVmLmN1cnJlbnQgPSBudWxsXG4gICAgd2luZG93LmNsZWFyVGltZW91dChob3ZlclRpbWVyUmVmLmN1cnJlbnQpXG4gICAgcmVzdG9yZVBvcHVwKClcbiAgICBzZXRIaXRzKFtdKVxuICAgIHNldEVtcHR5KGZhbHNlKVxuICAgIGlmICgham12Py52aWV3KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbG9hZFByb2ZpbGUoam12LnZpZXcpXG4gICAgaWYgKGZlYXR1cmVJbmZvLnBhbmVsT25seSkge1xuICAgICAgcG9wdXBXYXNFbmFibGVkUmVmLmN1cnJlbnQgPSBqbXYudmlldy5wb3B1cEVuYWJsZWRcbiAgICAgIHBvcHVwVmlld1JlZi5jdXJyZW50ID0gam12LnZpZXdcbiAgICAgIGptdi52aWV3LnBvcHVwRW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICAgIGlmIChmZWF0dXJlSW5mby50b29sID09PSAnaG92ZXInKSB7XG4gICAgICBtb3ZlSGFuZGxlUmVmLmN1cnJlbnQgPSBqbXYudmlldy5vbigncG9pbnRlci1tb3ZlJywgKGUpID0+IHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChob3ZlclRpbWVyUmVmLmN1cnJlbnQpXG4gICAgICAgIGhvdmVyVGltZXJSZWYuY3VycmVudCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IGRvSGl0VGVzdChqbXYudmlldywgZSksIDEyMClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWNrSGFuZGxlUmVmLmN1cnJlbnQgPSBqbXYudmlldy5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBpZiAoZmVhdHVyZUluZm8ub3BlblBhbmVsT25DbGljaykge1xuICAgICAgICAgIG9wZW5TaWRlYmFyKClcbiAgICAgICAgfVxuICAgICAgICBkb0hpdFRlc3Qoam12LnZpZXcsIGUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIEJvdW5kYXJ5IGZpbGwgdG9nZ2xlOiB0aGUgcGFpciBzZWN0aW9uJ3Mgc3RhdHMgYXJyYXkgc3VwcGxpZXMgdGhlIGZvdXIgc2hhcmVzLCBzb1xuICAvLyBmaWd1cmUgYW5kIG51bWJlcnMgY2FuJ3QgZHJpZnQgYXBhcnQuIE1vZGVybiBwYW5lbHMgb25seTsgZWFjaCBpbnN0YW5jZSBnZXRzIGFcbiAgLy8gdW5pcXVlIGNsaXAgaWQgc2luY2Ugc2V2ZXJhbCB2aWV3cyBjYW4gbW91bnQgdGhpcyBzdmcgYXQgb25jZS5cbiAgY29uc3QgcGFpclN0YXRzID0gZmVhdHVyZUluZm8ucG9wdXBWYXJpYW50ID09PSAnbW9kZXJuJyA/IChzZWN0aW9ucyA/PyBbXSkuZmluZChzID0+IHMuaWQgPT09ICdwYWlyJyk/LnN0YXRzIDogdW5kZWZpbmVkXG4gIGNvbnN0IGZpbGxVaWQgPSBSZWFjdC51c2VNZW1vKCgpID0+IGBwcCR7KytwcFVpZENvdW50ZXJ9YCwgW10pXG4gIGNvbnN0IGZpbGxIdG1sID0gQXJyYXkuaXNBcnJheShwYWlyU3RhdHMpICYmIHBhaXJTdGF0cy5sZW5ndGggPj0gNCA/IHBhaXJGaWxsSHRtbChwYWlyU3RhdHMsIGZpbGxVaWQpIDogbnVsbFxuXG4gIGNvbnN0IHRhYkJ0biA9IChhY3RpdmU6IGJvb2xlYW4pOiBSZWFjdC5DU1NQcm9wZXJ0aWVzID0+ICh7XG4gICAgZmxleDogMSxcbiAgICBiYWNrZ3JvdW5kOiAnbm9uZScsXG4gICAgYm9yZGVyOiAnbm9uZScsXG4gICAgYm9yZGVyQm90dG9tOiBhY3RpdmUgPyAnM3B4IHNvbGlkICM0YjU1NjMnIDogJzNweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgcGFkZGluZzogJzhweCAxMHB4JyxcbiAgICBmb250U2l6ZTogMTUsXG4gICAgZm9udFdlaWdodDogYWN0aXZlID8gODAwIDogNjAwLFxuICAgIGNvbG9yOiBhY3RpdmUgPyAnIzFmMjkzNycgOiAnIzZiNzI4MCcsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgbWFyZ2luQm90dG9tOiAtMlxuICB9KVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1hY2NvcmRpb25cIiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgb3ZlcmZsb3dZOiAnYXV0bycgfX0+XG4gICAgICA8c3R5bGU+e2BcbiAgICAgICAgLnBhbmVsLWFjY29yZGlvbiBkZXRhaWxzIHN1bW1hcnk6Oi13ZWJraXQtZGV0YWlscy1tYXJrZXIgeyBkaXNwbGF5OiBub25lIH1cbiAgICAgICAgLnBhbmVsLWFjY29yZGlvbiBkZXRhaWxzIHN1bW1hcnkgeyBsaXN0LXN0eWxlOiBub25lIH1cbiAgICAgIGB9PC9zdHlsZT5cbiAgICAgIHt0YWJiZWQgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYm9yZGVyQm90dG9tOiAnMnB4IHNvbGlkICNlMmU4ZjAnLCBtYXJnaW5Cb3R0b206IDEwIH19PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHNldFRhYignaW5mbycpfSBzdHlsZT17dGFiQnRuKHRhYiA9PT0gJ2luZm8nKX0+SW5mbyAmIFNvdXJjZXM8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRUYWIoJ3BvcHVwJyl9IHN0eWxlPXt0YWJCdG4odGFiID09PSAncG9wdXAnKX0+UG9wdXA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgeyghdGFiYmVkIHx8IHRhYiA9PT0gJ2luZm8nKSAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAge3RpdGxlICYmIDxoNCBzdHlsZT17eyBtYXJnaW46ICcwIDAgNHB4IDAnIH19PjxzdHJvbmc+e3RpdGxlfTwvc3Ryb25nPjwvaDQ+fVxuICAgICAgICAgIHsoc2VjdGlvbnMgPz8gW10pLm1hcChzID0+IChcbiAgICAgICAgICAgIDxkZXRhaWxzIGtleT17cy5pZH0gb3Blbj17ISFzLm9wZW59IHN0eWxlPXt7IG1hcmdpblRvcDogMTAgfX0+XG4gICAgICAgICAgICAgIDxzdW1tYXJ5IHN0eWxlPXt7IC4uLmJhc2VQaWxsLCBiYWNrZ3JvdW5kQ29sb3I6IHMucGlsbENvbG9yID8/ICcjNTA2NGExJyB9fT5cbiAgICAgICAgICAgICAgICB7cy5waWxsfVxuICAgICAgICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZ0xlZnQ6IDEwLCBtYXJnaW5Ub3A6IDggfX0gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBzLmJvZHkgKyAocy5pZCA9PT0gJ3BhaXInICYmIGZpbGxIdG1sID8gZmlsbEh0bWwgOiAnJykgKyAocy5pZCA9PT0gJ3NjYWxlcycgJiYgcHJvZmlsZSA/IHByb2ZpbGUgOiAnJykgfX0gLz5cbiAgICAgICAgICAgIDwvZGV0YWlscz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC8+XG4gICAgICApfVxuICAgICAge3VzZU1hcFdpZGdldElkICYmICghdGFiYmVkIHx8IHRhYiA9PT0gJ3BvcHVwJykgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogdGFiYmVkID8gMCA6IDE0LCBib3JkZXJUb3A6IHRhYmJlZCA/ICdub25lJyA6ICcxcHggc29saWQgI2Q5ZDlkOScsIHBhZGRpbmdUb3A6IHRhYmJlZCA/IDAgOiA4IH19PlxuICAgICAgICAgIHtoaXRzLmxlbmd0aCA9PT0gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzhhOGE4YScsIGZvbnRTaXplOiAxMiwgbWFyZ2luVG9wOiA0IH19PlxuICAgICAgICAgICAgICB7ZW1wdHkgPyAnTm8gZmVhdHVyZSBhdCB0aGF0IGxvY2F0aW9uLicgOiAnQ2xpY2sgYSBjZWxsIG9uIHRoZSBtYXAgdG8gc2VlIGl0cyBhdHRyaWJ1dGVzLid9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtoaXRzLm1hcCgoaCwgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2Ake2gubGF5ZXJUaXRsZX0tJHtpfWB9IHN0eWxlPXt7IG1hcmdpblRvcDogOCB9fT5cbiAgICAgICAgICAgICAge2guaHRtbFxuICAgICAgICAgICAgICAgID8gPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IGguaHRtbCB9fSAvPlxuICAgICAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcsIGZvbnRTaXplOiAxMiB9fT57aC5sYXllclRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7aC5kZXNjcmlwdGlvbiAmJiA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgZm9udFN0eWxlOiAnaXRhbGljJywgY29sb3I6ICcjNTU1JywgbWFyZ2luVG9wOiAyIH19PntoLmRlc2NyaXB0aW9ufTwvZGl2Pn1cbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIHN0eWxlPXt7IGZvbnRTaXplOiAxMSwgYm9yZGVyQ29sbGFwc2U6ICdjb2xsYXBzZScsIHdpZHRoOiAnMTAwJScgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICAgICAgICAgICAgeyhoLmZpZWxkcyA/PyBbXSkubWFwKChbaywgdl0pID0+IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGtleT17a30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcycHggNnB4IDJweCAwJywgY29sb3I6ICcjNTU1JywgdmVydGljYWxBbGlnbjogJ3RvcCcsIHdoaXRlU3BhY2U6ICdub3dyYXAnIH19PntrfTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPXt7IHBhZGRpbmc6ICcycHggMCcsIHdvcmRCcmVhazogJ2JyZWFrLXdvcmQnIH19Pnt2fTwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7dXNlTWFwV2lkZ2V0SWQgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBkaXNwbGF5OiAnbm9uZScgfX0+XG4gICAgICAgICAgPEppbXVNYXBWaWV3Q29tcG9uZW50IHVzZU1hcFdpZGdldElkPXt1c2VNYXBXaWRnZXRJZH0gb25BY3RpdmVWaWV3Q2hhbmdlPXtvbkFjdGl2ZVZpZXdDaGFuZ2V9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG4gZXhwb3J0IGZ1bmN0aW9uIF9fc2V0X3dlYnBhY2tfcHVibGljX3BhdGhfXyh1cmwpIHsgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB1cmwgfSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==