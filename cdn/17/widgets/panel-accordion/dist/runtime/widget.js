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
    const hitSeqRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(0);
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
        if (!q) {
            return null; // transient failure — don't cache it, next click retries
        }
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
    // Transient service hiccups make a fetch fail outright; retry before degrading,
    // because the last-ditch raw attribute table is a bad popup for a pair cell.
    const withRetry = (fn_1, ...args_1) => __awaiter(this, [fn_1, ...args_1], void 0, function* (fn, tries = 5) {
        for (let i = 0; i < tries; i++) {
            const r = yield fn().catch(() => null);
            if (r != null) {
                return r;
            }
            if (i < tries - 1) {
                yield new Promise(res => window.setTimeout(res, 200 * (i + 1)));
            }
        }
        return null;
    });
    const doHitTest = (view, e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        // Only the newest click may apply its results — a slow earlier request resolving
        // late would otherwise overwrite the newer popup.
        const seq = ++hitSeqRef.current;
        const res = yield view.hitTest(e).catch(() => null);
        if (!res || hitSeqRef.current !== seq) {
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
                const q = yield withRetry(() => layer.queryFeatures({
                    objectIds: oid != null ? [oid] : undefined,
                    geometry: e.mapPoint,
                    outFields: ['*'],
                    returnGeometry: false
                }));
                const f = (_g = q === null || q === void 0 ? void 0 : q.features) === null || _g === void 0 ? void 0 : _g[0];
                if (f === null || f === void 0 ? void 0 : f.attributes) {
                    attrs = f.attributes;
                }
            }
            if (!attrs) {
                continue;
            }
            // Pair cell whose full record still won't load after retries: offer a retry
            // click instead of dumping a raw attribute table.
            if (isPairLayer(r) && attrs.pair == null && attrs.biv_class == null) {
                out.push({
                    layerTitle: String(r.layer.title),
                    description: 'Feature details temporarily unavailable — click the cell again.'
                });
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
                const q = yield withRetry(() => pairLayer.queryFeatures({ geometry: e.mapPoint, outFields: ['*'], returnGeometry: false }));
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
        if (hitSeqRef.current === seq) {
            setHits(out);
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9wYW5lbC1hY2NvcmRpb24vZGlzdC9ydW50aW1lL3dpZGdldC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSU8sTUFBTSxVQUFVLEdBQTJCO0lBQ2hELEdBQUcsRUFBRSxTQUFTLEVBQUUsZUFBZTtJQUMvQixHQUFHLEVBQUUsU0FBUyxFQUFFLGVBQWU7SUFDL0IsR0FBRyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0I7SUFDaEMsR0FBRyxFQUFFLFNBQVMsRUFBRSxlQUFlO0lBQy9CLEdBQUcsRUFBRSxTQUFTLEVBQUUsZUFBZTtJQUMvQixHQUFHLEVBQUUsU0FBUyxFQUFFLGdCQUFnQjtJQUNoQyxHQUFHLEVBQUUsU0FBUyxFQUFFLGdCQUFnQjtJQUNoQyxHQUFHLEVBQUUsU0FBUyxFQUFFLGdCQUFnQjtJQUNoQyxHQUFHLEVBQUUsU0FBUyxDQUFFLGlCQUFpQjtDQUNsQztBQUNNLE1BQU0sWUFBWSxHQUEyQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQy9GLE1BQU0sWUFBWSxHQUEyQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFO0FBQy9GLE1BQU0sVUFBVSxHQUEyQixFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO0FBSXpGLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBVSxFQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUscUJBQXFCLEVBQUUsQ0FB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RyxDQUFDLEdBQU0sRUFDNUcsd0VBQUksS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFlBQUcsQ0FBQyxHQUFNLEtBRjNELENBQUMsQ0FHTCxDQUNOLENBQUMsR0FDSSxHQUNGLElBQ1AsQ0FDSixJQWxCSyxHQUFHLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFLENBbUIxQixDQUNQO3FCQUFBLENBQUMsSUFDRSxDQUNQLEVBQ0EsY0FBYyxJQUFJLENBQ2pCLHlFQUFLLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUNuRCxnRUFBQyw2REFBb0IsSUFBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixHQUFJLEdBQzVGLENBQ1AsSUFDRyxDQUNQO0FBQ0gsQ0FBQztBQUVPLFNBQVMsMkJBQTJCLENBQUMsR0FBRyxJQUFJLHFCQUF1QixHQUFHLEdBQUcsRUFBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL3BhbmVsLWFjY29yZGlvbi9zcmMvcnVudGltZS9wb3B1cC1jYXJkLnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1hcmNnaXNcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1jb3JlL2Vtb3Rpb25cIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4vamltdS1jb3JlL2xpYi9zZXQtcHVibGljLXBhdGgudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL3BhbmVsLWFjY29yZGlvbi9zcmMvcnVudGltZS93aWRnZXQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIFB1cmUgcG9wdXAtY2FyZCBidWlsZGVycyDigJQgbm8gSlNYLCBubyBqaW11IGltcG9ydHMsIHNvIHRoZXkgY2FuIGJlIGV4ZXJjaXNlZCBieVxuLy8gY2hlY2stcG9wdXAtY2FyZC5tanMgKG5vZGUgLS1leHBlcmltZW50YWwtc3RyaXAtdHlwZXMpIGFuZCBieSB0aGUgd2lkZ2V0LlxuaW1wb3J0IHR5cGUgeyBGZWF0dXJlSW5mb0NvbmZpZyB9IGZyb20gJy4uL2NvbmZpZydcblxuZXhwb3J0IGNvbnN0IGJpdlBhbGV0dGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICcxJzogJyNmMmYyZjInLCAvLyBMb3cgUCwgTG93IFJcbiAgJzInOiAnI2NlZDk5NScsIC8vIExvdyBQLCBNZWQgUlxuICAnMyc6ICcjYThiZTM4JywgLy8gTG93IFAsIEhpZ2ggUlxuICAnNCc6ICcjZGFiNmU5JywgLy8gTWVkIFAsIExvdyBSXG4gICc1JzogJyNhZDljOGYnLCAvLyBNZWQgUCwgTWVkIFJcbiAgJzYnOiAnIzdkOTI2ZCcsIC8vIE1lZCBQLCBIaWdoIFJcbiAgJzcnOiAnI2M1NzlkYicsIC8vIEhpZ2ggUCwgTG93IFJcbiAgJzgnOiAnIzdiNzBhYScsIC8vIEhpZ2ggUCwgTWVkIFJcbiAgJzknOiAnIzRlNjQ5ZScgIC8vIEhpZ2ggUCwgSGlnaCBSXG59XG5leHBvcnQgY29uc3QgcHJlc3N1cmVSYW1wOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geyAnMSc6ICcjZjJmMmYyJywgJzInOiAnI2RhYjZlOScsICczJzogJyNjNTc5ZGInIH1cbmV4cG9ydCBjb25zdCByZXNvdXJjZVJhbXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7ICcxJzogJyNmMmYyZjInLCAnMic6ICcjY2VkOTk1JywgJzMnOiAnI2E4YmUzOCcgfVxuZXhwb3J0IGNvbnN0IGNsYXNzTmFtZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7ICcxJzogJ0xvdycsICcyJzogJ01lZCcsICczJzogJ0hpZ2gnIH1cblxuZXhwb3J0IHR5cGUgQXhpc01heCA9IHsgcHJlc3N1cmU6IG51bWJlciB8IG51bGw7IHJlc291cmNlOiBudW1iZXIgfCBudWxsIH1cblxuY29uc3QgZm10ID0gKHY6IHVua25vd24pOiBzdHJpbmcgPT4gKHYgPT0gbnVsbCB8fCB2ID09PSAnJykgPyAn4oCUJyA6IE51bWJlcih2KS50b0xvY2FsZVN0cmluZygnZW4tVVMnLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KVxuXG4vLyBPbmUgcGFpcidzIHNlcnZpY2UgbmFtZSBwdXRzIHRoZSByZXNvdXJjZSBmaXJzdCAoaXRzIHByZXNzdXJlIGlzIHRoZSBzYWx0d2F0ZXIgZnJvbnQpO1xuLy8gZGlzcGxheSBpdCBwcmVzc3VyZS1maXJzdCBsaWtlIGV2ZXJ5IG90aGVyIHBhaXIuIFRoZSBzZXJ2aWNlIHZhbHVlIHN0YXlzIGZvciBxdWVyaWVzLlxuY29uc3QgcGFpckRpc3BsYXkgPSAocGFpcjogdW5rbm93bik6IHN0cmluZyA9PiBTdHJpbmcocGFpciA/PyAnJykgPT09ICdBZ3JpY3VsdHVyZSB4IFNhbGluaXR5JyA/ICdTYWxpbml0eSB4IEFncmljdWx0dXJlJyA6IFN0cmluZyhwYWlyID8/ICcnKVxuXG4vLyBQb3J0IG9mIHRoZSBzaGFyZWQgYml2YXJpYXRlIEFyY2FkZSBwb3B1cDsgbnVsbCB3aGVuIGF0dHJzIGFyZSBub3QgYSBjb25mbGljdC1wYWlyIGZlYXR1cmUuXG5leHBvcnQgY29uc3Qgdm1zQ2FyZEh0bWwgPSAoYXR0cnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gIGlmIChhdHRycy5wYWlyID09IG51bGwgJiYgYXR0cnMuYml2X2NsYXNzID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGNvbnN0IGNscyA9IFN0cmluZyhhdHRycy5iaXZfY2xhc3MgPz8gJycpXG4gIGNvbnN0IGNoaXAgPSBiaXZQYWxldHRlW2Nsc10gPz8gJyNjYmQ1ZTEnXG4gIGNvbnN0IGJpdlRleHQgPSAoYXR0cnMuYml2X2xhYmVsID09IG51bGwgfHwgYXR0cnMuYml2X2xhYmVsID09PSAnTm8gZGF0YScpID8gJ05vIGRhdGEgb24gZWl0aGVyIGF4aXMnIDogU3RyaW5nKGF0dHJzLmJpdl9sYWJlbClcblxuICBjb25zdCByb3cgPSAobmFtZTogc3RyaW5nLCB2YWw6IHVua25vd24sIGNsYXp6OiB1bmtub3duLCBoaWdoQnJlYWs6IHVua25vd24sIHJhbXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBzdHJpbmcgPT4ge1xuICAgIGxldCBwY3QgPSAwXG4gICAgaWYgKHZhbCAhPSBudWxsICYmIHZhbCAhPT0gJycgJiYgaGlnaEJyZWFrICE9IG51bGwgJiYgTnVtYmVyKGhpZ2hCcmVhaykgPiAwKSB7XG4gICAgICBwY3QgPSBNYXRoLnJvdW5kKE1hdGgubWluKDEwMCwgTWF0aC5tYXgoMCwgKE51bWJlcih2YWwpIC8gTnVtYmVyKGhpZ2hCcmVhaykpICogMTAwKSkpXG4gICAgfVxuICAgIGNvbnN0IGRpc3AgPSAodmFsID09IG51bGwgfHwgdmFsID09PSAnJykgPyAnTi9BJyA6IFN0cmluZyhNYXRoLnJvdW5kKE51bWJlcih2YWwpICogMTAwKSAvIDEwMClcbiAgICBjb25zdCBjbHNTdHIgPSBTdHJpbmcoY2xhenogPz8gJycpXG4gICAgY29uc3QgY2xhc3NOYW1lID0gY2xhc3NOYW1lc1tjbHNTdHJdID8/ICdObyBkYXRhJ1xuICAgIGxldCBiYXJDb2xvciA9IHJhbXBbY2xzU3RyXSA/PyAnIzk0YTNiOCdcbiAgICBpZiAodmFsID09IG51bGwgfHwgdmFsID09PSAnJyB8fCBOdW1iZXIodmFsKSA8PSAwKSB7XG4gICAgICBiYXJDb2xvciA9ICcjOTRhM2I4J1xuICAgIH1cbiAgICByZXR1cm4gYFxuICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi1ib3R0b206MTJweDsgcGFkZGluZzoxMnB4OyBiYWNrZ3JvdW5kOnRyYW5zcGFyZW50OyBib3JkZXI6MXB4IHNvbGlkICNlMmU4ZjA7IGJvcmRlci1sZWZ0OjRweCBzb2xpZCAke2JhckNvbG9yfTsgYm9yZGVyLXJhZGl1czoxMHB4O1wiPlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjsgYWxpZ24taXRlbXM6YmFzZWxpbmU7XCI+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZToxMXB4OyBjb2xvcjojNjQ3NDhiOyBmb250LXdlaWdodDo3MDA7IHRleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTsgbGV0dGVyLXNwYWNpbmc6MC42cHg7XCI+JHtuYW1lfTwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOnJpZ2h0O1wiPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJmb250LXNpemU6MjBweDsgZm9udC13ZWlnaHQ6OTAwOyBjb2xvcjojMWUyOTNiO1wiPiR7ZGlzcH08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjEwcHg7IGNvbG9yOiM5NGEzYjg7IG1hcmdpbi10b3A6MnB4O1wiPkNsYXNzOiAke2NsYXNzTmFtZX08L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOjEwMCU7IGhlaWdodDo4cHg7IGJvcmRlci1yYWRpdXM6NHB4OyBiYWNrZ3JvdW5kOiNmMWY1Zjk7IG1hcmdpbi10b3A6OHB4OyBvdmVyZmxvdzpoaWRkZW47XCI+XG4gICAgICAgICAgPGRpdiBzdHlsZT1cIndpZHRoOiR7cGN0fSU7IGhlaWdodDoxMDAlOyBiYWNrZ3JvdW5kOiR7YmFyQ29sb3J9O1wiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PmBcbiAgfVxuXG4gIHJldHVybiBgXG4gICAgPGRpdiBzdHlsZT1cImZvbnQtZmFtaWx5OidTZWdvZSBVSScsc3lzdGVtLXVpLHNhbnMtc2VyaWY7IHBhZGRpbmc6MnB4OyBiYWNrZ3JvdW5kOnRyYW5zcGFyZW50OyBib3JkZXItcmFkaXVzOjEycHg7XCI+XG4gICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLWJvdHRvbToxMnB4OyBwYWRkaW5nOjEycHggMTRweDsgYmFja2dyb3VuZDp0cmFuc3BhcmVudDsgYm9yZGVyOjFweCBzb2xpZCAjZTJlOGYwOyBib3JkZXItYm90dG9tOjNweCBzb2xpZCAke2NoaXB9OyBib3JkZXItcmFkaXVzOjEycHg7XCI+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7IGp1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuOyBhbGlnbi1pdGVtczpmbGV4LXN0YXJ0O1wiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjE7XCI+XG4gICAgICAgICAgICA8aDIgc3R5bGU9XCJtYXJnaW46MDsgZm9udC1zaXplOjE1cHg7IGZvbnQtd2VpZ2h0OjkwMDsgY29sb3I6IzBmMTcyYTtcIj4ke3BhaXJEaXNwbGF5KGF0dHJzLnBhaXIpfTwvaDI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDo0cHg7IGZvbnQtc2l6ZToxMXB4OyBjb2xvcjojNDc1NTY5O1wiPiR7Yml2VGV4dH08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT1cImJhY2tncm91bmQ6JHtjaGlwfTsgd2lkdGg6MThweDsgaGVpZ2h0OjE4cHg7IGJvcmRlci1yYWRpdXM6NHB4OyBkaXNwbGF5OmlubGluZS1ibG9jazsgbWFyZ2luLWxlZnQ6MTBweDsgZmxleC1zaHJpbms6MDtcIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICAke3JvdygnUHJlc3N1cmUgLSAnICsgYXR0cnMucHJlc3N1cmVfbmFtZSwgYXR0cnMucHJlc3N1cmUsIGF0dHJzLlByZXNzdXJlX0xldmVsLCBhdHRycy5wcmVzc3VyZV9icmVha19oaWdoLCBwcmVzc3VyZVJhbXApfVxuICAgICAgJHtyb3coJ1Jlc291cmNlIC0gJyArIGF0dHJzLnJlc291cmNlX25hbWUsIGF0dHJzLnJlc291cmNlLCBhdHRycy5SZXNvdXJjZV9MZXZlbCwgYXR0cnMucmVzb3VyY2VfYnJlYWtfaGlnaCwgcmVzb3VyY2VSYW1wKX1cbiAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7IHBhZGRpbmc6MTJweDsgYmFja2dyb3VuZDp0cmFuc3BhcmVudDsgYm9yZGVyOjFweCBzb2xpZCAjZTJlOGYwOyBib3JkZXItcmFkaXVzOjhweDsgZm9udC1zaXplOjEwcHg7IGNvbG9yOiM0NzU1Njk7IGxpbmUtaGVpZ2h0OjEuNTtcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDsgZmxleC13cmFwOndyYXA7IGdhcDo0cHg7IG1hcmdpbi1ib3R0b206OHB4O1wiPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPVwiYmFja2dyb3VuZDojZTJlOGYwOyBjb2xvcjojMzM0MTU1OyBwYWRkaW5nOjJweCA2cHg7IGJvcmRlci1yYWRpdXM6NHB4OyBmb250LXNpemU6OXB4OyBmb250LXdlaWdodDo2MDA7XCI+UmVzb3VyY2U6ICR7YXR0cnMucmVzb3VyY2VfbmFtZX08L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJiYWNrZ3JvdW5kOiNlMmU4ZjA7IGNvbG9yOiMzMzQxNTU7IHBhZGRpbmc6MnB4IDZweDsgYm9yZGVyLXJhZGl1czo0cHg7IGZvbnQtc2l6ZTo5cHg7IGZvbnQtd2VpZ2h0OjYwMDtcIj5QcmVzc3VyZTogJHthdHRycy5wcmVzc3VyZV9uYW1lfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+QmFycyByZWZsZWN0IHZhbHVlIHJlbGF0aXZlIHRvIHRoZSB1cHBlciBjbGFzcyBicmVhay4gPHN0cm9uZyBzdHlsZT1cImNvbG9yOiM0ZTY0OWU7XCI+RGFyayBpbmRpZ288L3N0cm9uZz4gY2VsbHMgbWFyayBoaWdoIGNvbmZsaWN0IG92ZXJsYXAuPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5gXG59XG5cbi8vIENoYXJ0LWRhdHVtIHZhcmlhbnQ6IG9uZSBjZWxsJ3MgcmVhZGluZyBhcyBhIG1lYXN1cmVtZW50IHJlY29yZCDigJQgc2VyaWYgbnVtZXJhbHMsXG4vLyB0aGUgM8OXMyBiaXZhcmlhdGUgbWF0cml4IHdpdGggdGhlIGN1cnJlbnQgY2VsbCByaW5nZWQsIGhhaXJsaW5lcyBpbnN0ZWFkIG9mIGNhcmRzLlxuZXhwb3J0IGNvbnN0IG1vZGVybkNhcmRIdG1sID0gKGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaW5mbz86IEZlYXR1cmVJbmZvQ29uZmlnLCBtYXg/OiBBeGlzTWF4IHwgbnVsbCk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IGNscyA9IFN0cmluZyhhdHRycy5iaXZfY2xhc3MgPz8gJycpXG4gIGNvbnN0IGFjdGl2ZSA9IC9eWzEtOV0kLy50ZXN0KGNscykgPyBOdW1iZXIoY2xzKSA6IC0xXG4gIGNvbnN0IGNoaXAgPSAvXlsxLTldJC8udGVzdChjbHMpID8gYml2UGFsZXR0ZVtjbHNdIDogbnVsbFxuICBjb25zdCBiaXZUZXh0ID0gKGF0dHJzLmJpdl9sYWJlbCA9PSBudWxsIHx8IGF0dHJzLmJpdl9sYWJlbCA9PT0gJ05vIGRhdGEnKSA/ICdObyBkYXRhIG9uIGVpdGhlciBheGlzJyA6IFN0cmluZyhhdHRycy5iaXZfbGFiZWwpXG5cbiAgLy8gRXNyaS1zdHlsZSByb3RhdGVkIGJpdmFyaWF0ZSBsZWdlbmQsIGRyYXduIGFzIGRpYW1vbmRzIG9uIGEgNDXCsCBsYXR0aWNlIHNvIGNlbGxzXG4gIC8vIG5ldmVyIG92ZXJsYXAgKGEgcm90YXRlZCBncmlkIG9mIHNxdWFyZXMgd291bGQgbGV0IGxhdGVyIGNlbGxzIHBhaW50IG92ZXIgdGhlIHJpbmcpLlxuICAvLyBSb3dzID0gcHJlc3N1cmUgSGlnaOKGkkxvdywgY29scyA9IHJlc291cmNlIExvd+KGkkhpZ2g6IExvdy1Mb3cgc2l0cyBhdCB0aGUgYm90dG9tIGNvcm5lcixcbiAgLy8gSGlnaC1IaWdoIGF0IHRoZSB0b3AsIHJlc291cmNlIChncmVlbikgdG93YXJkIHRoZSB1cHBlci1yaWdodCwgcHJlc3N1cmUgKHB1cnBsZSkgdXBwZXItbGVmdC5cbiAgY29uc3QgY2VsbE5hbWVzID0gWydMb3cnLCAnTWVkJywgJ0hpZ2gnXVxuICBjb25zdCB1ID0gMTIuNSAvLyBsYXR0aWNlIHN0ZXAgaW4gcHhcbiAgY29uc3QgY2VsbHM6IHN0cmluZ1tdID0gW11cbiAgZm9yIChsZXQgcCA9IDI7IHAgPj0gMDsgcC0tKSB7XG4gICAgZm9yIChsZXQgciA9IDA7IHIgPCAzOyByKyspIHtcbiAgICAgIGNvbnN0IGlkeCA9IHAgKiAzICsgciArIDFcbiAgICAgIGNvbnN0IHggPSAociAtIHApICogdVxuICAgICAgY29uc3QgeSA9ICgyIC0gciAtIHApICogdVxuICAgICAgLy8gQW1iaWVudCBoaWdobGlnaHQ6IGRpbSB0aGUgaW5hY3RpdmUgY2VsbHMgYW5kIGxldCB0aGUgYWN0aXZlIG9uZSBnbG93IGluIGl0cyBvd25cbiAgICAgIC8vIGNoaXAgY29sb3IgaW5zdGVhZCBvZiBib3hpbmcgaXQgaW4gaW5rLiBObyBkaW1taW5nIHdoZW4gdGhlcmUgaXMgbm8gYWN0aXZlIGNlbGwuXG4gICAgICBjb25zdCByaW5nID0gaWR4ID09PSBhY3RpdmVcbiAgICAgICAgPyBgYm94LXNoYWRvdzowIDAgMCAxLjVweCAjZmZmZmZmLDAgMCA2cHggMnB4ICR7Y2hpcCA/PyAnIzRlNjQ5ZSd9NjY7ei1pbmRleDoxO2BcbiAgICAgICAgOiAoYWN0aXZlICE9PSAtMSA/ICdvcGFjaXR5OjAuNDU7JyA6ICcnKVxuICAgICAgY2VsbHMucHVzaChgPGRpdiB0aXRsZT1cIlByZXNzdXJlICR7Y2VsbE5hbWVzW3BdfSwgcmVzb3VyY2UgJHtjZWxsTmFtZXNbcl19XCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OiR7eCArIDI4fXB4O3RvcDoke3kgKyAyOH1weDt3aWR0aDoxMnB4O2hlaWdodDoxMnB4O2JvcmRlcjoxcHggc29saWQgI2Q1ZGRlNjtiYWNrZ3JvdW5kOiR7Yml2UGFsZXR0ZVtpZHhdID8/ICcjY2JkNWUxJ307dHJhbnNmb3JtOnJvdGF0ZSg0NWRlZyk7JHtyaW5nfVwiPjwvZGl2PmApXG4gICAgfVxuICB9XG4gIGNvbnN0IG1hdHJpeCA9IGBcbiAgICA8ZGl2IHRpdGxlPVwiQml2YXJpYXRlIGNvbmZsaWN0IG1hdHJpeFwiIHN0eWxlPVwicG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NjhweDtoZWlnaHQ6NjhweDttYXJnaW46MTBweCBhdXRvIDA7XCI+XG4gICAgICAke2NlbGxzLmpvaW4oJycpfVxuICAgIDwvZGl2PmBcblxuICBjb25zdCBheGlzUm93ID0gKG5hbWU6IHN0cmluZywgdmFsOiB1bmtub3duLCBjbGF6ejogdW5rbm93biwgbG93QnJlYWs6IHVua25vd24sIGhpZ2hCcmVhazogdW5rbm93biwgYWNjZW50OiBzdHJpbmcsIHJhbXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sIHVuaXQ/OiBzdHJpbmcsIG1heFZhbD86IG51bWJlciB8IG51bGwpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IGxvTnVtID0gKGxvd0JyZWFrICE9IG51bGwgJiYgTnVtYmVyKGxvd0JyZWFrKSA+IDApID8gTnVtYmVyKGxvd0JyZWFrKSA6IDBcbiAgICBjb25zdCBicmVha051bSA9IChoaWdoQnJlYWsgIT0gbnVsbCAmJiBOdW1iZXIoaGlnaEJyZWFrKSA+IDApID8gTnVtYmVyKGhpZ2hCcmVhaykgOiBOYU5cbiAgICBjb25zdCBudW1WYWwgPSAodmFsICE9IG51bGwgJiYgdmFsICE9PSAnJyAmJiAhTnVtYmVyLmlzTmFOKE51bWJlcih2YWwpKSkgPyBOdW1iZXIodmFsKSA6IE5hTlxuICAgIGNvbnN0IGRpc3AgPSBmbXQodmFsKVxuICAgIGNvbnN0IG1pc3NpbmcgPSBkaXNwID09PSAn4oCUJ1xuICAgIGNvbnN0IGNsc1N0ciA9IFN0cmluZyhjbGF6eiA/PyAnJylcbiAgICBjb25zdCBoYXNDbGFzcyA9IGNsYXNzTmFtZXNbY2xzU3RyXSAhPSBudWxsXG4gICAgY29uc3QgY2xhc3NOYW1lID0gaGFzQ2xhc3MgPyBjbGFzc05hbWVzW2Nsc1N0cl0gOiAnbm8gZGF0YSdcbiAgICAvLyBEb3QgdXNlcyB0aGUgYXhpcyByYW1wIGNvbG9yIChMb3cvTWVkL0hpZ2ggbGVnZW5kIGNvbG9ycyksIG5vdCB0aGUgcGlsbCBhY2NlbnQuXG4gICAgY29uc3QgZG90Q29sb3IgPSBoYXNDbGFzcyA/IChyYW1wW2Nsc1N0cl0gPz8gYWNjZW50KSA6ICcjOTRhM2I4J1xuICAgIC8vIFNpbmdsZS1jbGFzcyBwcm9ncmVzcyBiYXI6IHRoZSBmaWxsIHJ1bnMgZnJvbSB0aGUgbGVmdCBlZGdlIHRvIHRoZSB2YWx1ZSdzIHBvc2l0aW9uXG4gICAgLy8gaW5zaWRlIHRoZSBjdXJyZW50IGNsYXNzLCB0aGUgcmVzdCBzdGF5cyBhIGxpZ2h0IHRyYWNrLiBRdWFudGlsZSBjbGFzc2VzIGFyZVxuICAgIC8vIGVxdWFsLWNvdW50LCBub3QgZXF1YWwtc3Bhbiwgc28gd2l0aGluLWNsYXNzIHBvc2l0aW9uIGlzIHRoZSBsZWdpYmxlIHJlYWRpbmc7XG4gICAgLy8gdGhlIGFic29sdXRlIHNjYWxlIGxpdmVzIGluIHRoZSBwYWlyIHByb2ZpbGUuXG4gICAgY29uc3QgaGFzQmFyID0gKGNsc1N0ciA9PT0gJzEnICYmIGxvTnVtID4gMCkgfHwgKChjbHNTdHIgPT09ICcyJyB8fCBjbHNTdHIgPT09ICczJykgJiYgIU51bWJlci5pc05hTihicmVha051bSkpXG4gICAgY29uc3QgYmFyVGl0bGUgPSBjbHNTdHIgPT09ICcxJyA/IGBMb3cg4omkICR7Zm10KGxvTnVtKX1gXG4gICAgICA6IGNsc1N0ciA9PT0gJzInID8gYE1lZCAke2ZtdChsb051bSl94oCTJHtmbXQoYnJlYWtOdW0pfWBcbiAgICAgIDogY2xzU3RyID09PSAnMycgPyAobWF4VmFsICE9IG51bGwgJiYgbWF4VmFsID4gYnJlYWtOdW0gPyBgSGlnaCAke2ZtdChicmVha051bSl94oCTJHtmbXQobWF4VmFsKX0gKG1heClgIDogYEhpZ2ggPiAke2ZtdChicmVha051bSl9YClcbiAgICAgIDogJydcbiAgICBjb25zdCBjbGFtcFBjdCA9ICh4OiBudW1iZXIpOiBudW1iZXIgPT4gTWF0aC5yb3VuZChNYXRoLm1pbigxMDAsIE1hdGgubWF4KDAsIHggKiAxMDApKSlcbiAgICBsZXQgdGlja1BjdDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgICBpZiAoIW1pc3NpbmcgJiYgIU51bWJlci5pc05hTihudW1WYWwpKSB7XG4gICAgICBpZiAoY2xzU3RyID09PSAnMScgJiYgbG9OdW0gPiAwKSB0aWNrUGN0ID0gY2xhbXBQY3QobnVtVmFsIC8gbG9OdW0pXG4gICAgICBlbHNlIGlmIChjbHNTdHIgPT09ICcyJyAmJiAhTnVtYmVyLmlzTmFOKGJyZWFrTnVtKSAmJiBicmVha051bSA+IGxvTnVtKSB0aWNrUGN0ID0gY2xhbXBQY3QoKG51bVZhbCAtIGxvTnVtKSAvIChicmVha051bSAtIGxvTnVtKSlcbiAgICAgIC8vIEhpZ2ggbmVlZHMgdGhlIGxheWVyIG1heCB0byBib3VuZCBpdHMgYnJhY2tldDsgd2l0aG91dCBpdCB0aGVyZSBpcyBubyBzY2FsZSB0byB0aWNrIG9uLlxuICAgICAgZWxzZSBpZiAoY2xzU3RyID09PSAnMycgJiYgbWF4VmFsICE9IG51bGwgJiYgbWF4VmFsID4gYnJlYWtOdW0pIHRpY2tQY3QgPSBjbGFtcFBjdCgobnVtVmFsIC0gYnJlYWtOdW0pIC8gKG1heFZhbCAtIGJyZWFrTnVtKSlcbiAgICB9XG4gICAgLy8gRWRnZSBsYWJlbHMgbmFtZSB0aGUgYmFyJ3Mgb3duIHNjYWxlOiB0aGUgY2xhc3MgYnJhY2tldCdzIGxlZnQgYW5kIHJpZ2h0IGVuZHMuXG4gICAgbGV0IGxlZnRMYWJlbDogc3RyaW5nIHwgbnVsbCA9IG51bGxcbiAgICBsZXQgcmlnaHRMYWJlbDogc3RyaW5nIHwgbnVsbCA9IG51bGxcbiAgICBpZiAoY2xzU3RyID09PSAnMScgJiYgbG9OdW0gPiAwKSB7IGxlZnRMYWJlbCA9ICcwJzsgcmlnaHRMYWJlbCA9IGZtdChsb051bSkgfVxuICAgIGVsc2UgaWYgKGNsc1N0ciA9PT0gJzInICYmICFOdW1iZXIuaXNOYU4oYnJlYWtOdW0pKSB7IGxlZnRMYWJlbCA9IGZtdChsb051bSk7IHJpZ2h0TGFiZWwgPSBmbXQoYnJlYWtOdW0pIH1cbiAgICBlbHNlIGlmIChjbHNTdHIgPT09ICczJyAmJiAhTnVtYmVyLmlzTmFOKGJyZWFrTnVtKSkgeyBsZWZ0TGFiZWwgPSBmbXQoYnJlYWtOdW0pOyByaWdodExhYmVsID0gKG1heFZhbCAhPSBudWxsICYmIG1heFZhbCA+IGJyZWFrTnVtKSA/IGZtdChtYXhWYWwpIDogbnVsbCB9XG4gICAgLy8gRmlsbCB1c2VzIHRoZSBjbGFzcyByYW1wOyBMb3cncyBuZWFyLXdoaXRlIHJhbXAgd291bGQgdmFuaXNoIGFnYWluc3QgdGhlIGxpZ2h0IHRyYWNrLFxuICAgIC8vIHNvIGl0IHRha2VzIGEgc2xhdGUgZmlsbCBpbnN0ZWFkLiBUaGUgdGljayBpcyBhIHNvbGlkIGNhcCBpbiB0aGUgc2FtZSBjb2xvciB3aXRoIGFcbiAgICAvLyB0aGluIHdoaXRlIHJpbmcg4oCUIGl0IHB1bmNoZXMgb3V0IG9mIHRoZSBmaWxsIGFuZCByZWFkcyBvbiB0aGUgbGlnaHQgdHJhY2sg4oCUIGNsYW1wZWRcbiAgICAvLyBpbnNpZGUgdGhlIGJhciBzbyBpdCBuZXZlciBoYW5ncyBvZmYgdGhlIHJvdW5kZWQgZW5kICh2YWx1ZSAwIC8gdmFsdWUgbWF4KS5cbiAgICBjb25zdCBmaWxsQ29sb3IgPSBjbHNTdHIgPT09ICcxJyA/ICcjY2JkNWUxJyA6IHJhbXBbY2xzU3RyXVxuICAgIHJldHVybiBgXG4gICAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzowIDJweDtcIj5cbiAgICAgICAgPGRpdiBzdHlsZT1cImRpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtcIj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6JHthY2NlbnR9O2NvbG9yOiNmZmZmZmY7Ym9yZGVyLXJhZGl1czoxMnB4O3BhZGRpbmc6MnB4IDlweDtmb250LXNpemU6MTAuNXB4O2ZvbnQtd2VpZ2h0OjcwMDtcIj4ke25hbWV9PC9zcGFuPlxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6MTFweDtjb2xvcjoke2hhc0NsYXNzID8gJyMzMzQxNTUnIDogJyM5NGEzYjgnfTt3aGl0ZS1zcGFjZTpub3dyYXA7XCI+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjdweDtoZWlnaHQ6N3B4O2JvcmRlci1yYWRpdXM6NTAlO2JhY2tncm91bmQ6JHtkb3RDb2xvcn07Ym9yZGVyOiR7aGFzQ2xhc3MgPyAnMXB4IHNvbGlkICNiM2JlY2InIDogJ25vbmUnfTttYXJnaW4tcmlnaHQ6NXB4O3ZlcnRpY2FsLWFsaWduOjFweDtcIj48L3NwYW4+JHtjbGFzc05hbWV9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDo0cHg7Zm9udC1zaXplOjExcHg7Y29sb3I6IzY0NzQ4YjtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6YmFzZWxpbmU7XCI+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJmb250LXNpemU6MjZweDtmb250LXdlaWdodDo3MDA7Y29sb3I6JHttaXNzaW5nID8gJyM5NGEzYjgnIDogJyMxZjI5MzcnfTtsaW5lLWhlaWdodDoxLjE1O1wiPiR7ZGlzcH08L3NwYW4+XG4gICAgICAgICAgJHt1bml0ICYmICFtaXNzaW5nID8gYDxzcGFuIHN0eWxlPVwibWFyZ2luLWxlZnQ6NnB4O1wiPiR7dW5pdH08L3NwYW4+YCA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi10b3A6NnB4O2hlaWdodDo4cHg7XCI+XG4gICAgICAgICAgJHtoYXNCYXIgPyBgPGRpdiB0aXRsZT1cIiR7YmFyVGl0bGV9XCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTtiYWNrZ3JvdW5kOiNlZWYyZjY7Ym9yZGVyOjFweCBzb2xpZCAjZDVkZGU2O2JvcmRlci1yYWRpdXM6OTk5cHg7b3ZlcmZsb3c6aGlkZGVuO1wiPiR7dGlja1BjdCAhPSBudWxsID8gYDxkaXYgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3aWR0aDoke3RpY2tQY3R9JTtiYWNrZ3JvdW5kOiR7ZmlsbENvbG9yfTtib3JkZXItcmFkaXVzOjk5OXB4IDAgMCA5OTlweDtcIj48L2Rpdj5gIDogJyd9PC9kaXY+YCA6ICcnfVxuICAgICAgICAgICR7dGlja1BjdCAhPSBudWxsID8gYDxkaXYgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0Om1heCgwcHgsbWluKGNhbGMoJHt0aWNrUGN0fSUgLSA1cHgpLGNhbGMoMTAwJSAtIDEwcHgpKSk7dG9wOi0xcHg7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtib3JkZXItcmFkaXVzOjUwJTtiYWNrZ3JvdW5kOiR7ZmlsbENvbG9yfTtib3JkZXI6MS41cHggc29saWQgI2ZmZmZmZjtcIj48L2Rpdj5gIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICAke2xlZnRMYWJlbCAhPSBudWxsID8gYDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47bWFyZ2luLXRvcDo0cHg7Zm9udC1zaXplOjEwcHg7Y29sb3I6Izk0YTNiODtcIj48c3Bhbj4ke2xlZnRMYWJlbH08L3NwYW4+PHNwYW4+JHtyaWdodExhYmVsID8/ICcnfTwvc3Bhbj48L2Rpdj5gIDogJyd9XG4gICAgICA8L2Rpdj5gXG4gIH1cblxuICByZXR1cm4gYFxuICAgIDxkaXYgc3R5bGU9XCJmb250LWZhbWlseTonU2Vnb2UgVUknLHN5c3RlbS11aSxzYW5zLXNlcmlmO2NvbG9yOiMxZjI5Mzc7XCI+XG4gICAgICA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjE1cHg7Zm9udC13ZWlnaHQ6ODAwO2xpbmUtaGVpZ2h0OjEuMztcIj4ke3BhaXJEaXNwbGF5KGF0dHJzLnBhaXIpfTwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MnB4O2ZvbnQtc2l6ZToxMXB4O2NvbG9yOiM2NDc0OGI7bGluZS1oZWlnaHQ6MS40O1wiPiR7Yml2VGV4dH08L2Rpdj5cbiAgICAgICR7bWF0cml4fVxuICAgICAgPGRpdiBzdHlsZT1cImhlaWdodDoxcHg7YmFja2dyb3VuZDp2YXIoLS1zeXMtY29sb3ItZGl2aWRlci1wcmltYXJ5LCAjZTJlOGYwKTttYXJnaW46MTBweCAwO1wiPjwvZGl2PlxuICAgICAgJHtheGlzUm93KCdQcmVzc3VyZSDigJQgJyArIGF0dHJzLnByZXNzdXJlX25hbWUsIGF0dHJzLnByZXNzdXJlLCBhdHRycy5QcmVzc3VyZV9MZXZlbCwgYXR0cnMucHJlc3N1cmVfYnJlYWtfbG93LCBhdHRycy5wcmVzc3VyZV9icmVha19oaWdoLCAnI2M1N2FkZScsIHByZXNzdXJlUmFtcCwgaW5mbz8ucHJlc3N1cmVVbml0LCBtYXg/LnByZXNzdXJlKX1cbiAgICAgIDxkaXYgc3R5bGU9XCJoZWlnaHQ6MXB4O2JhY2tncm91bmQ6dmFyKC0tc3lzLWNvbG9yLWRpdmlkZXItcHJpbWFyeSwgI2UyZThmMCk7bWFyZ2luOjEwcHggMDtcIj48L2Rpdj5cbiAgICAgICR7YXhpc1JvdygnUmVzb3VyY2Ug4oCUICcgKyBhdHRycy5yZXNvdXJjZV9uYW1lLCBhdHRycy5yZXNvdXJjZSwgYXR0cnMuUmVzb3VyY2VfTGV2ZWwsIGF0dHJzLnJlc291cmNlX2JyZWFrX2xvdywgYXR0cnMucmVzb3VyY2VfYnJlYWtfaGlnaCwgJyNhOWJmMzknLCByZXNvdXJjZVJhbXAsIGluZm8/LnJlc291cmNlVW5pdCwgbWF4Py5yZXNvdXJjZSl9XG4gICAgICA8ZGl2IHN0eWxlPVwiaGVpZ2h0OjFweDtiYWNrZ3JvdW5kOnZhcigtLXN5cy1jb2xvci1kaXZpZGVyLXByaW1hcnksICNlMmU4ZjApO21hcmdpbjoxMHB4IDA7XCI+PC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjEwcHg7Y29sb3I6Izk0YTNiODtsaW5lLWhlaWdodDoxLjU7XCI+XG4gICAgICAgIEJhcnMgc2hvdyBwb3NpdGlvbiB3aXRoaW4gdGhlIGN1cnJlbnQgY2xhc3M7IHRoZSBWYWx1ZSBzY2FsZXMgc2VjdGlvbiAoSW5mbyB0YWIpIGhvbGRzIHRoZSBmdWxsIHJhbmdlLiA8c3BhbiBzdHlsZT1cImNvbG9yOiM0ZTY0OWU7Zm9udC13ZWlnaHQ6NjAwO1wiPkRhcmsgaW5kaWdvPC9zcGFuPiBtYXJrcyB0aGUgc3Ryb25nZXN0IGNvbmZsaWN0IG92ZXJsYXAuXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5gXG59XG5cbi8vIEFic29sdXRlLXNjYWxlIGJhcnMgdGhhdCBzbG90IGludG8gdGhlIFZhbHVlIHNjYWxlcyBhY2NvcmRpb24gKEluZm8gdGFiKTogc2VnbWVudGVkXG4vLyBieSByZWFsIGNsYXNzIHJhbmdlcywgZXZlcnkgYm91bmRhcnkgbGFiZWxlZC4gTm90IHBlci1jZWxsLCBzbyBubyB0aWNrIG9yIGNsaWNrIGxvZ2ljLlxuZXhwb3J0IGNvbnN0IHNjYWxlc0h0bWwgPSAoYXR0cnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBtYXg/OiBBeGlzTWF4IHwgbnVsbCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBjb25zdCBudW0gPSAodjogdW5rbm93bik6IG51bWJlciB8IG51bGwgPT4gKHYgIT0gbnVsbCAmJiB2ICE9PSAnJyAmJiAhTnVtYmVyLmlzTmFOKE51bWJlcih2KSkgJiYgTnVtYmVyKHYpID4gMCkgPyBOdW1iZXIodikgOiBudWxsXG4gIGNvbnN0IGxvUCA9IG51bShhdHRycy5wcmVzc3VyZV9icmVha19sb3cpXG4gIGNvbnN0IGhpUCA9IG51bShhdHRycy5wcmVzc3VyZV9icmVha19oaWdoKVxuICBjb25zdCBsb1IgPSBudW0oYXR0cnMucmVzb3VyY2VfYnJlYWtfbG93KVxuICBjb25zdCBoaVIgPSBudW0oYXR0cnMucmVzb3VyY2VfYnJlYWtfaGlnaClcbiAgaWYgKGhpUCA9PSBudWxsICYmIGhpUiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICAvLyBQbGFpbiBsYWJlbHMsIG5vIHBpbGxzIOKAlCB0aGUgYWNjb3JkaW9uIGFscmVhZHkgbmFtZXMgdGhlIGF4ZXMgd2l0aCBpdHMgb3duIHBpbGxzLlxuICAvLyBUZXh0IGlzIGdyYXllZCB0byBwb3B1cC1taWNyb2NvcHkgd2VpZ2h0IHNvIHRoZSBiYXJzIGRvIHRoZSB0YWxraW5nLlxuICBjb25zdCByb3cgPSAobGFiZWw6IHN0cmluZywgbG86IG51bWJlciB8IG51bGwsIGhpOiBudW1iZXIgfCBudWxsLCByYW1wOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBtYXhWYWw/OiBudW1iZXIgfCBudWxsKTogc3RyaW5nID0+IHtcbiAgICBjb25zdCBzZWcgPSAoZ3JvdzogbnVtYmVyLCBjb2xvcjogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgICBncm93ID4gMCA/IGA8ZGl2IHRpdGxlPVwiJHt0aXRsZX1cIiBzdHlsZT1cImZsZXg6JHtncm93fSAxIDA7YmFja2dyb3VuZDoke2NvbG9yfTtib3JkZXI6MXB4IHNvbGlkICNkNWRkZTY7Ym9yZGVyLXJhZGl1czoycHg7XCI+PC9kaXY+YCA6ICcnXG4gICAgY29uc3QgbG9Hcm93ID0gbG8gPz8gMFxuICAgIGNvbnN0IG1lZEdyb3cgPSBoaSAhPSBudWxsID8gaGkgLSAobG8gPz8gMCkgOiAwXG4gICAgY29uc3QgaGlHcm93ID0gaGkgIT0gbnVsbCAmJiBtYXhWYWwgIT0gbnVsbCAmJiBtYXhWYWwgPiBoaSA/IG1heFZhbCAtIGhpIDogMFxuICAgIGNvbnN0IGNhcHRpb24gPSBbXG4gICAgICBsbyAhPSBudWxsID8gYExvdyDiiaQgJHtmbXQobG8pfWAgOiBudWxsLFxuICAgICAgaGkgIT0gbnVsbCA/IGBNZWQgJHtmbXQobG8gPz8gMCl94oCTJHtmbXQoaGkpfWAgOiBudWxsLFxuICAgICAgaGkgIT0gbnVsbCA/IGBIaWdoID4gJHtmbXQoaGkpfWAgOiBudWxsLFxuICAgICAgbWF4VmFsICE9IG51bGwgJiYgbWF4VmFsID4gMCA/IGBtYXggJHtmbXQobWF4VmFsKX1gIDogbnVsbFxuICAgIF0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyDCtyAnKVxuICAgIHJldHVybiBgXG4gICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4O1wiPlxuICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOjEwcHg7Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiM5NGEzYjg7XCI+JHtsYWJlbH08L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6NHB4O2Rpc3BsYXk6ZmxleDtnYXA6MnB4O2hlaWdodDo4cHg7XCI+XG4gICAgICAgICAgJHtzZWcobG9Hcm93LCByYW1wWycxJ10sIGBMb3cg4omkICR7Zm10KGxvID8/IDApfWApfVxuICAgICAgICAgICR7c2VnKG1lZEdyb3csIHJhbXBbJzInXSwgYE1lZCAke2ZtdChsbyA/PyAwKX3igJMke2ZtdChoaSA/PyAwKX1gKX1cbiAgICAgICAgICAke3NlZyhoaUdyb3csIHJhbXBbJzMnXSwgYEhpZ2ggPiAke2ZtdChoaSA/PyAwKX1gKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjRweDtmb250LXNpemU6MTBweDtjb2xvcjojOTRhM2I4O1wiPiR7Y2FwdGlvbn08L2Rpdj5cbiAgICAgIDwvZGl2PmBcbiAgfVxuICByZXR1cm4gYFxuICAgICR7cm93KCdQcmVzc3VyZScsIGxvUCwgaGlQLCBwcmVzc3VyZVJhbXAsIG1heD8ucHJlc3N1cmUpfVxuICAgICR7cm93KCdSZXNvdXJjZScsIGxvUiwgaGlSLCByZXNvdXJjZVJhbXAsIG1heD8ucmVzb3VyY2UpfVxuICAgIDxkaXYgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHg7Zm9udC1zaXplOjEwcHg7Y29sb3I6Izk0YTNiODtsaW5lLWhlaWdodDoxLjU7XCI+VGhlIGZ1bGwgMC10by1tYXggdmFsdWUgc2NhbGUgYmVoaW5kIHRoZSBjb25mbGljdCBtYXAsIGN1dCBhdCB0aGUgY2xhc3MgYnJlYWtzLiBVbmV2ZW4gc2VnbWVudHMgcmVmbGVjdCBhIHNrZXdlZCBkaXN0cmlidXRpb246IGNlbGxzIGJ1bmNoIGF0IG9uZSBlbmQgb2YgdGhlIHNjYWxlIHdoaWxlIGEgdGhpbiB0YWlsIG9mIGV4dHJlbWUgY2VsbHMgc3RyZXRjaGVzIHRoZSBvdGhlcjsgdGhlIHBvcHVwIGJhciB6b29tcyBpbnRvIGEgc2luZ2xlIGNsYXNzIHNlZ21lbnQuPC9kaXY+YFxufVxuXG4vLyBPbmUgQVBORVAgYm91bmRhcnkgc2lsaG91ZXR0ZSB3aG9zZSBmaWxsIHRvZ2dsZXMgYW1vbmcgdGhlIHBhaXIgc2VjdGlvbidzIGZvdXIgc3RhdHMuXG4vLyBQYXRoOiBBUE5FUF9Cb3VuZGFyeV8wNDEwIGZlYXR1cmUgc2VydmljZSwgbmF0aXZlIE5DIHN0YXRlLXBsYW5lICgzMjExOSkgbWV0ZXJzIOKAlFxuLy8gY29uZm9ybWFsLCBzbyB0aGUgc2lsaG91ZXR0ZSBrZWVwcyBpdHMgdHJ1ZSBwcm9wb3J0aW9uczsgc2ltcGxpZmllZCB0byAxODcgcG9pbnRzIGFuZFxuLy8gdW5pZm9ybWx5IHNjYWxlZCBpbnRvIGEgMjA0eDExOCBib3guIFNoYXJlcyBhcnJpdmUgZnJvbSB0aGUgcGFpciBzZWN0aW9uJ3Mgc3RhdHMgdGV4dFxuLy8gKHdpZGdldC50c3ggcGFyc2VzIHRoZW0pLCBzbyBmaWd1cmUgYW5kIG51bWJlcnMgY2FuJ3QgZHJpZnQuIEluamVjdGVkIEhUTUwgbmV2ZXIgcnVuc1xuLy8gPHNjcmlwdD4sIGJ1dCBpbmxpbmUgaGFuZGxlciBhdHRyaWJ1dGVzIGRvIOKAlCB0aGV5IGNhbGwgdGhlIG9uZSBwcFNldCBnbG9iYWwgaW4gd2lkZ2V0LnRzeC5cbmNvbnN0IGFwbmVwUGF0aCA9ICdNIDEwNC4xIDAuMCBMIDEwNi4yIDEuOCBMIDEwNi44IDMuNiBMIDExMC4yIDQuMSBMIDExMS43IDUuMyBMIDExMy43IDMuNyBMIDExMy45IDEuOSBMIDExNC45IDMuMSBMIDExNS43IDIuNiBMIDExOC4xIDUuMSBMIDExOS41IDQuOCBMIDExOS4zIDUuNCBMIDEyMC41IDUuNSBMIDEyMS45IDcuNCBMIDEyMi44IDcuNiBMIDEyNC4wIDExLjUgTCAxMjIuNyAxNC4wIEwgMTIzLjMgMTYuNyBMIDEyMS45IDE4LjkgTCAxMjEuOSAyMC42IEwgMTIxLjEgMjEuMCBMIDEyMi42IDIzLjEgTCAxMjQuMiAyMy40IEwgMTI0LjYgMjUuMCBMIDEyNy40IDI1LjEgTCAxMjkuNCAyNC4wIEwgMTI5LjggMjIuMyBMIDEzMS4wIDIxLjggTCAxMzAuNiAyMC4xIEwgMTMxLjUgMTkuOCBMIDEzNC45IDIwLjYgTCAxMzYuOCAyMy4zIEwgMTQxLjUgMjQuOSBMIDE0Mi40IDIyLjcgTCAxNDEuOSAyMC40IEwgMTQzLjIgMTguNSBMIDE0My44IDE4LjAgTCAxNDQuNiAxOC43IEwgMTQ3LjIgMTguNyBMIDE0OC4xIDE3LjcgTCAxNDguOSAxOC4yIEwgMTUwLjAgMTYuNSBMIDE1My44IDI3LjcgTCAxNTcuOCA0My4xIEwgMTY5LjcgNjguNCBMIDE3MC40IDczLjAgTCAxNjguOCA4Ni45IEwgMTY4LjMgODguNiBMIDE2Ny42IDg3LjkgTCAxNjUuOSA4OC4wIEwgMTU5LjQgOTAuNSBMIDE1My45IDkzLjUgTCAxNTEuMyA5Ni40IEwgMTQ4LjggOTcuMyBMIDEzOC4wIDEwOC40IEwgMTMzLjkgMTE0LjQgTCAxMzIuNSAxMTguMCBMIDEzMS43IDExNi40IEwgMTMxLjkgMTE1LjggTCAxMzIuMCAxMTYuNiBMIDEzMi43IDExNi41IEwgMTMyLjEgMTE1LjMgTCAxMjcuMiAxMTMuMSBMIDEyMC40IDExMy41IEwgMTExLjIgMTE1LjkgTCAxMTEuNyAxMTQuNyBMIDExMS4xIDExNC40IEwgMTExLjQgMTEyLjcgTCAxMTAuNiAxMTAuNyBMIDEwOC44IDEwOS42IEwgMTA4LjAgMTA4LjQgTCAxMDguNSAxMDcuMiBMIDEwNy43IDEwNy4zIEwgMTA3LjAgMTA1LjAgTCAxMDUuMiAxMDMuMiBMIDEwMy4wIDEwMi43IEwgMTAxLjYgMTAzLjkgTCA5Ni42IDEwMS40IEwgOTEuNiAxMDAuOCBMIDkwLjIgMTAxLjQgTCA4Ny43IDk5LjIgTCA4OC4wIDk4LjIgTCA4Ny4zIDk3LjggTCA4Ny44IDk2LjEgTCA4Ni44IDkzLjUgTCA4MS43IDkwLjEgTCA3OC4xIDg5LjcgTCA3Ny43IDkwLjUgTCA3Ni4yIDkwLjYgTCA3NC45IDkyLjcgTCA3NC4xIDkxLjMgTCA3Mi4wIDkwLjUgTCA3MC4xIDkwLjkgTCA2Ni4xIDg3LjcgTCA2My45IDg5LjIgTCA2MC4xIDg4LjcgTCA1OC45IDg3LjIgTCA2MC41IDg1LjAgTCA1OC4zIDg0LjIgTCA1Ny42IDgxLjIgTCA1Ni4wIDgxLjEgTCA1NC4xIDc4LjQgTCA1MS4yIDc2LjggTCA0OS45IDc0LjIgTCA0Ny43IDczLjkgTCA0Ny4xIDcyLjUgTCA0Ny45IDcwLjYgTCA0Ny4xIDY4LjEgTCA0Ny41IDY2LjQgTCA0Ni40IDY0LjEgTCA0Ny41IDYzLjAgTCA0Ni43IDU5LjggTCA0Ny42IDU4LjIgTCA0My4xIDU0LjggTCAzOC45IDU1LjUgTCAzOC43IDU0LjYgTCAzNi44IDU1LjMgTCAzNS42IDU0LjQgTCAzNC41IDU0LjggTCAzMy41IDUyLjggTCAzNC41IDUxLjAgTCAzNC4zIDQ2LjMgTCAzNy4xIDQ2LjAgTCAzNy4zIDQzLjUgTCAzOS45IDQxLjQgTCA0MS41IDM4LjMgTCA0Mi40IDM5LjMgTCA0NC4wIDM4LjUgTCA0NC41IDM5LjQgTCA0NS43IDM5LjYgTCA0Ny44IDM3LjAgTCA1MC4yIDM3LjcgTCA1MC44IDM3LjMgTCA1MS42IDM4LjQgTCA1NS4xIDM5LjYgTCA1Ni45IDM4LjkgTCA1OC4yIDM5LjEgTCA1OS4yIDQwLjMgTCA2MS41IDQwLjIgTCA2Mi44IDQxLjYgTCA2NS41IDM5LjkgTCA2NS40IDM4LjggTCA2Ny4zIDM3LjEgTCA3MS4xIDM1LjkgTCA3My4xIDM2LjUgTCA3NS40IDM1LjkgTCA3OC4wIDM3LjEgTCA3OS43IDM2LjEgTCA4NS4yIDM4LjIgTCA4Ny4zIDM1LjEgTCA4OS41IDM0LjcgTCA4OS4yIDMyLjkgTCA4Ni44IDMyLjEgTCA4Ni4wIDMyLjYgTCA4NC4wIDMxLjUgTCA4NC4xIDMwLjIgTCA4Mi42IDI4LjggTCA3OS40IDI4LjQgTCA3OC4wIDI2LjIgTCA3NC4zIDI1LjUgTCA3MC44IDIxLjQgTCA2Ny45IDIxLjUgTCA2My4yIDE5LjQgTCA2MS45IDIwLjAgTCA2MS43IDE5LjQgTCA2MC40IDE5LjUgTCA1OC41IDE1LjQgTCA1OS44IDE0LjYgTCA2MC4yIDcuNyBMIDYyLjYgNy44IEwgNjQuNiA2LjcgTCA2NS45IDYuOCBMIDY2LjIgNS4yIEwgNjcuOSA0LjQgTCA2OS4wIDIuNiBMIDcyLjMgMi44IEwgNzcuMyA3LjggTCA4MC40IDUuNCBMIDg2LjMgNC44IEwgOTAuOCAzLjEgTCA5Mi4xIDEuNyBMIDk0LjggMy4yIEwgOTcuOCAzLjIgTCAxMDEuOCAwLjYgTCAxMDIuNSAxLjAgTCAxMDMuMSAwLjAgTCAxMDQuMSAwLjAgWidcbmNvbnN0IGFwbmVwQm94ID0geyB4OiAzMy41LCB3OiAxMzcsIGg6IDExOCB9XG5cbi8vIE9yZGVyIG1hdGNoZXMgdGhlIHBhaXIgc2VjdGlvbidzIHN0YXRzIHRleHQ6IGNvdmVyYWdlLCBwcmVzc3VyZSwgcmVzb3VyY2UsIGNvbmZsaWN0LlxuY29uc3QgcHBTdGF0cyA9IFtcbiAgeyBsYWJlbDogJ0RhdGEgY292ZXJhZ2UnLCBjb2xvcjogJyM2NDc0OGInIH0sXG4gIHsgbGFiZWw6ICdIaWdoIHByZXNzdXJlJywgY29sb3I6ICcjYzU3YWRlJyB9LFxuICB7IGxhYmVsOiAnSGlnaCByZXNvdXJjZScsIGNvbG9yOiAnI2E4YmUzOCcgfSxcbiAgeyBsYWJlbDogJ0NvbmZsaWN0JywgY29sb3I6ICcjNGU2NDllJyB9XG5dXG5cbmV4cG9ydCBjb25zdCBwYWlyRmlsbEh0bWwgPSAoc2hhcmVzOiBudW1iZXJbXSwgdWlkID0gJ3BwJyk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoc2hhcmVzLmxlbmd0aCA8IHBwU3RhdHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICAvLyBVbmlxdWUgY2xpcCBpZDogc2V2ZXJhbCB2aWV3cyBjYW4gbW91bnQgdGhpcyBzYW1lIHN2ZyBhdCBvbmNlLCBhbmQgZHVwbGljYXRlXG4gIC8vIGlkcyBicmVhayB1cmwoIy4uLikgcmVzb2x1dGlvbiDigJQgYSBsb3N0IGNsaXAgc2hvd3MgdGhlIHJhdyByZWN0YW5nbGUuXG4gIC8vIENvdmVyYWdlIGlzIGEgcmVnaW9uIHNoYXJlIGFscmVhZHk7IHRoZSBvdGhlciBzdGF0cyBhcmUgc2hhcmVzIG9mIHRoZSBtYXBwZWQgY2VsbHMsXG4gIC8vIHNvIHRoZXkgc2NhbGUgYnkgY292ZXJhZ2Ug4oCUIHRoZSBmaWxsIGFsd2F5cyBtZWFucyBcInNoYXJlIG9mIHRoZSBBUE5FUCByZWdpb25cIi5cbiAgY29uc3QgcmVnaW9uUGN0ID0gKGk6IG51bWJlcik6IG51bWJlciA9PiAoaSA9PT0gMCA/IHNoYXJlc1swXSA6IHNoYXJlc1tpXSAqIHNoYXJlc1swXSAvIDEwMClcbiAgY29uc3Qgc3RhdFRleHQgPSAoaTogbnVtYmVyKTogc3RyaW5nID0+IHtcbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGAke3NoYXJlc1swXX0lIG9mIHJlZ2lvbiBjZWxsc2BcbiAgICB9XG4gICAgY29uc3QgcnAgPSByZWdpb25QY3QoaSlcbiAgICByZXR1cm4gYCR7c2hhcmVzW2ldfSUgb2YgbWFwcGVkIGNlbGxzIMK3ICR7KHJwID49IDAuMDUgPyBycC50b0ZpeGVkKDEpIDogJzwwLjEnKX0lIG9mIHJlZ2lvbmBcbiAgfVxuICBjb25zdCBjaGlwID0gKGk6IG51bWJlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgaCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgcmVnaW9uUGN0KGkpKSkgLyAxMDAgKiBhcG5lcEJveC5oXG4gICAgY29uc3QgcyA9IHBwU3RhdHNbaV1cbiAgICByZXR1cm4gYDxzcGFuIG9uY2xpY2s9XCJwcFNldCh0aGlzKVwiIGRhdGEteT1cIiR7KGFwbmVwQm94LmggLSBoKS50b0ZpeGVkKDEpfVwiIGRhdGEtaD1cIiR7aC50b0ZpeGVkKDEpfVwiIGRhdGEtYz1cIiR7cy5jb2xvcn1cIiBkYXRhLXQ9XCIke3N0YXRUZXh0KGkpfVwiIHN0eWxlPVwid2hpdGUtc3BhY2U6bm93cmFwO2N1cnNvcjpwb2ludGVyO2JvcmRlci1yYWRpdXM6OTk5cHg7cGFkZGluZzozcHggOXB4O2ZvbnQtc2l6ZToxMC41cHg7Zm9udC13ZWlnaHQ6NzAwO2JhY2tncm91bmQ6JHtpID09PSAwID8gcy5jb2xvciA6ICcjZWVmMmY2J307Y29sb3I6JHtpID09PSAwID8gJyNmZmZmZmYnIDogJyMzMzQxNTUnfTtcIj4ke3MubGFiZWx9PC9zcGFuPmBcbiAgfVxuICBjb25zdCBoMCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgcmVnaW9uUGN0KDApKSkgLyAxMDAgKiBhcG5lcEJveC5oXG4gIGNvbnN0IGNsaXBJZCA9IGBwcENsaXAtJHt1aWR9YFxuICByZXR1cm4gYFxuICAgIDxkaXYgZGF0YS1wcCBzdHlsZT1cIm1hcmdpbi10b3A6MTBweDtkaXNwbGF5OmZsZXg7Z2FwOjhweDthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O1wiPlxuICAgICAgPGRpdiBzdHlsZT1cImZsZXg6MTttaW4td2lkdGg6MDtcIj5cbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDIwNCAxMThcIiBzdHlsZT1cIndpZHRoOjEwMCU7ZGlzcGxheTpibG9jaztcIj5cbiAgICAgICAgICA8ZGVmcz48Y2xpcFBhdGggaWQ9XCIke2NsaXBJZH1cIj48cGF0aCBkPVwiJHthcG5lcFBhdGh9XCIvPjwvY2xpcFBhdGg+PC9kZWZzPlxuICAgICAgICAgIDxwYXRoIGQ9XCIke2FwbmVwUGF0aH1cIiBmaWxsPVwiI2YxZjVmOVwiIHN0cm9rZT1cIiM5NGEzYjhcIiBzdHJva2Utd2lkdGg9XCIwLjhcIi8+XG4gICAgICAgICAgJHtoMCA+IDAuMDUgPyBgPHJlY3QgZGF0YS1maWxsIHg9XCIke2FwbmVwQm94Lnh9XCIgeT1cIiR7KGFwbmVwQm94LmggLSBoMCkudG9GaXhlZCgxKX1cIiB3aWR0aD1cIiR7YXBuZXBCb3gud31cIiBoZWlnaHQ9XCIke2gwLnRvRml4ZWQoMSl9XCIgZmlsbD1cIiR7cHBTdGF0c1swXS5jb2xvcn1cIiBvcGFjaXR5PVwiMC45XCIgY2xpcC1wYXRoPVwidXJsKCMke2NsaXBJZH0pXCIvPmAgOiAnJ31cbiAgICAgICAgICA8cGF0aCBkPVwiJHthcG5lcFBhdGh9XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCIjOTRhM2I4XCIgc3Ryb2tlLXdpZHRoPVwiMC44XCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6NHB4O2ZvbnQtc2l6ZToxMXB4O2ZvbnQtd2VpZ2h0OjgwMDtcIj48c3BhbiBkYXRhLW51bSBzdHlsZT1cImNvbG9yOiR7cHBTdGF0c1swXS5jb2xvcn07XCI+JHtzdGF0VGV4dCgwKX08L3NwYW4+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo0cHg7ZmxleC1zaHJpbms6MDtcIj4ke3BwU3RhdHMubWFwKChfLCBpKSA9PiBjaGlwKGkpKS5qb2luKCcnKX08L2Rpdj5cbiAgICA8L2Rpdj5gXG59XG5cbmV4cG9ydCBjb25zdCBiaXZDYXJkSHRtbCA9IChhdHRyczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIHZhcmlhbnQ6ICd2bXMnIHwgJ21vZGVybicgPSAndm1zJywgaW5mbz86IEZlYXR1cmVJbmZvQ29uZmlnLCBtYXg/OiBBeGlzTWF4IHwgbnVsbCk6IHN0cmluZyB8IG51bGwgPT4ge1xuICBpZiAoYXR0cnMucGFpciA9PSBudWxsICYmIGF0dHJzLmJpdl9jbGFzcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gdmFyaWFudCA9PT0gJ21vZGVybicgPyBtb2Rlcm5DYXJkSHRtbChhdHRycywgaW5mbywgbWF4KSA6IHZtc0NhcmRIdG1sKGF0dHJzKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfYXJjZ2lzX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfY29yZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fZW1vdGlvbl9yZWFjdF9qc3hfcnVudGltZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIi8qKlxyXG4gKiBXZWJwYWNrIHdpbGwgcmVwbGFjZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB3aXRoIF9fd2VicGFja19yZXF1aXJlX18ucCB0byBzZXQgdGhlIHB1YmxpYyBwYXRoIGR5bmFtaWNhbGx5LlxyXG4gKiBUaGUgcmVhc29uIHdoeSB3ZSBjYW4ndCBzZXQgdGhlIHB1YmxpY1BhdGggaW4gd2VicGFjayBjb25maWcgaXM6IHdlIGNoYW5nZSB0aGUgcHVibGljUGF0aCB3aGVuIGRvd25sb2FkLlxyXG4gKiAqL1xyXG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHdpbmRvdy5qaW11Q29uZmlnLmJhc2VVcmxcclxuIiwiLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBSZWFjdCwganN4LCB0eXBlIEFsbFdpZGdldFByb3BzLCBnZXRBcHBTdG9yZSwgYXBwQWN0aW9ucyB9IGZyb20gJ2ppbXUtY29yZSdcbmltcG9ydCB7IEppbXVNYXBWaWV3Q29tcG9uZW50LCB0eXBlIEppbXVNYXBWaWV3IH0gZnJvbSAnamltdS1hcmNnaXMnXG5pbXBvcnQgeyB0eXBlIElNQ29uZmlnLCB0eXBlIEZlYXR1cmVJbmZvQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJ1xuaW1wb3J0IHsgYml2Q2FyZEh0bWwsIHNjYWxlc0h0bWwsIHBhaXJGaWxsSHRtbCwgdHlwZSBBeGlzTWF4IH0gZnJvbSAnLi9wb3B1cC1jYXJkJ1xuXG5jb25zdCBiYXNlUGlsbDogUmVhY3QuQ1NTUHJvcGVydGllcyA9IHtcbiAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gIGNvbG9yOiAnI2ZmZmZmZicsXG4gIGJvcmRlclJhZGl1czogJzEycHgnLFxuICBwYWRkaW5nOiAnMnB4IDEwcHgnLFxuICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gIGN1cnNvcjogJ3BvaW50ZXInLFxuICBsaXN0U3R5bGU6ICdub25lJ1xufVxuXG5pbnRlcmZhY2UgRmVhdHVyZUhpdCB7XG4gIGxheWVyVGl0bGU6IHN0cmluZ1xuICBkZXNjcmlwdGlvbj86IHN0cmluZ1xuICBmaWVsZHM/OiBBcnJheTxbc3RyaW5nLCBzdHJpbmddPlxuICBodG1sPzogc3RyaW5nXG59XG5cbmNvbnN0IGlnbm9yZWRBdHRyID0gL14oRklEfE9CSkVDVElEfEdsb2JhbElEfFNoYXBlKS9pXG5cbmxldCBwcFVpZENvdW50ZXIgPSAwXG5cbi8vIENoaXAgaGFuZGxlciBmb3IgdGhlIHBhaXItcHJvZmlsZSBib3VuZGFyeSBmaWxsIHRvZ2dsZS4gSW5qZWN0ZWQgSFRNTCBuZXZlciBydW5zXG4vLyA8c2NyaXB0PiB0YWdzLCBidXQgaW5saW5lIGhhbmRsZXIgYXR0cmlidXRlcyBkbyBmaXJlIOKAlCBhbGwgY2hpcHMgY2FsbCB0aGlzIG9uZSBnbG9iYWwuXG47KHdpbmRvdyBhcyBhbnkpLnBwU2V0ID0gKGNoaXA6IEhUTUxFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHJvb3QgPSBjaGlwLmNsb3Nlc3QoJ1tkYXRhLXBwXScpXG4gIGNvbnN0IGZpbGwgPSByb290Py5xdWVyeVNlbGVjdG9yKCdbZGF0YS1maWxsXScpXG4gIGNvbnN0IG51bSA9IHJvb3Q/LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW51bV0nKSBhcyBIVE1MRWxlbWVudCB8IG51bGxcbiAgaWYgKCFmaWxsKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgZmlsbC5zZXRBdHRyaWJ1dGUoJ3knLCBjaGlwLmRhdGFzZXQueSA/PyAnJylcbiAgZmlsbC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGNoaXAuZGF0YXNldC5oID8/ICcnKVxuICBmaWxsLnNldEF0dHJpYnV0ZSgnZmlsbCcsIGNoaXAuZGF0YXNldC5jID8/ICcnKVxuICBmb3IgKGNvbnN0IGVsIG9mIEFycmF5LmZyb20oY2hpcC5wYXJlbnRFbGVtZW50Py5jaGlsZHJlbiA/PyBbXSkpIHtcbiAgICBjb25zdCBjID0gZWwgYXMgSFRNTEVsZW1lbnRcbiAgICBjb25zdCBhY3RpdmUgPSBjID09PSBjaGlwXG4gICAgYy5zdHlsZS5iYWNrZ3JvdW5kID0gYWN0aXZlID8gKGNoaXAuZGF0YXNldC5jID8/ICcjZWVmMmY2JykgOiAnI2VlZjJmNidcbiAgICBjLnN0eWxlLmNvbG9yID0gYWN0aXZlID8gJyNmZmZmZmYnIDogJyMzMzQxNTUnXG4gIH1cbiAgaWYgKG51bSkge1xuICAgIG51bS50ZXh0Q29udGVudCA9IGNoaXAuZGF0YXNldC50ID8/ICcnXG4gICAgbnVtLnN0eWxlLmNvbG9yID0gY2hpcC5kYXRhc2V0LmMgPz8gJydcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXaWRnZXQocHJvcHM6IEFsbFdpZGdldFByb3BzPElNQ29uZmlnPikge1xuICBjb25zdCB7IHRpdGxlLCBzZWN0aW9ucywgcGFpciB9ID0gcHJvcHMuY29uZmlnID8/IHt9XG4gIGNvbnN0IHVzZU1hcFdpZGdldElkID0gcHJvcHMudXNlTWFwV2lkZ2V0SWRzPy5bMF1cbiAgY29uc3QgZmVhdHVyZUluZm8gPSB7IHRvb2w6ICdjbGljaycsIHNob3dUb3BPbmx5OiB0cnVlLCAuLi4ocHJvcHMuY29uZmlnPy5mZWF0dXJlSW5mbyA/PyB7fSkgfVxuICBjb25zdCB0YWJiZWQgPSAhIWZlYXR1cmVJbmZvLnRhYmJlZFxuICBjb25zdCBbdGFiLCBzZXRUYWJdID0gUmVhY3QudXNlU3RhdGU8J2luZm8nIHwgJ3BvcHVwJz4oJ2luZm8nKVxuICBjb25zdCBbaGl0cywgc2V0SGl0c10gPSBSZWFjdC51c2VTdGF0ZTxGZWF0dXJlSGl0W10+KFtdKVxuICBjb25zdCBbZW1wdHksIHNldEVtcHR5XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBjbGlja0hhbmRsZVJlZiA9IFJlYWN0LnVzZVJlZjxfX2VzcmkuSGFuZGxlPihudWxsKVxuICBjb25zdCBtb3ZlSGFuZGxlUmVmID0gUmVhY3QudXNlUmVmPF9fZXNyaS5IYW5kbGU+KG51bGwpXG4gIGNvbnN0IGhvdmVyVGltZXJSZWYgPSBSZWFjdC51c2VSZWY8bnVtYmVyPihudWxsKVxuICBjb25zdCBoaXRTZXFSZWYgPSBSZWFjdC51c2VSZWYoMClcbiAgY29uc3QgcG9wdXBWaWV3UmVmID0gUmVhY3QudXNlUmVmPF9fZXNyaS5NYXBWaWV3PihudWxsKVxuICBjb25zdCBwb3B1cFdhc0VuYWJsZWRSZWYgPSBSZWFjdC51c2VSZWY8Ym9vbGVhbj4obnVsbClcblxuICBjb25zdCByZXN0b3JlUG9wdXAgPSAoKSA9PiB7XG4gICAgaWYgKHBvcHVwVmlld1JlZi5jdXJyZW50ICYmIHBvcHVwV2FzRW5hYmxlZFJlZi5jdXJyZW50ICE9IG51bGwpIHtcbiAgICAgIHBvcHVwVmlld1JlZi5jdXJyZW50LnBvcHVwRW5hYmxlZCA9IHBvcHVwV2FzRW5hYmxlZFJlZi5jdXJyZW50XG4gICAgfVxuICAgIHBvcHVwVmlld1JlZi5jdXJyZW50ID0gbnVsbFxuICAgIHBvcHVwV2FzRW5hYmxlZFJlZi5jdXJyZW50ID0gbnVsbFxuICB9XG5cbiAgLy8gQmFyIHNjYWxlOiBxdWVyeVN0YXRpc3RpY3Mgc3VwcG9ydHMgYSBtYXggYWdncmVnYXRlLCBzbyBvbmUgY2hlYXAgc3RhdHMgY2FsbCBwZXJcbiAgLy8gcGFpciBsYXllciBnaXZlcyB0aGUgdHJ1ZSAw4oaSbWF4IHJhbmdlLiBDYWNoZWQgcGVyIHNlc3Npb24uIFRoZSB3aGVyZSBjbGF1c2UgcGluc1xuICAvLyB0aGUgcXVlcnkgdG8gb25lIHBhaXI6IHRoZSBydW50aW1lIGRvZXMgbm90IGFsd2F5cyBhcHBseSB0aGUgd2ViIG1hcCdzXG4gIC8vIGRlZmluaXRpb25FeHByZXNzaW9uLCBhbmQgYW4gdW5maWx0ZXJlZCBxdWVyeSB3b3VsZCBzcGFuIGFsbCBzZXZlbiBwYWlycy5cbiAgY29uc3QgbWF4Q2FjaGVSZWYgPSBSZWFjdC51c2VSZWY8TWFwPHN0cmluZywgQXhpc01heD4+KG5ldyBNYXAoKSlcblxuICBjb25zdCBwYWlyV2hlcmUgPSAocDogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nID0+IGBwYWlyID0gJyR7U3RyaW5nKHApLnJlcGxhY2UoLycvZywgXCInJ1wiKX0nYFxuXG4gIGNvbnN0IGxvYWRNYXggPSBhc3luYyAobGF5ZXI6IF9fZXNyaS5GZWF0dXJlTGF5ZXIsIHdoZXJlID0gJzE9MScpOiBQcm9taXNlPEF4aXNNYXggfCBudWxsPiA9PiB7XG4gICAgaWYgKCFsYXllci5xdWVyeUZlYXR1cmVzKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBjb25zdCBrZXkgPSBgJHtsYXllci50aXRsZSB8fCBsYXllci5pZH18JHt3aGVyZX1gXG4gICAgY29uc3QgY2FjaGVkID0gbWF4Q2FjaGVSZWYuY3VycmVudC5nZXQoa2V5KVxuICAgIGlmIChjYWNoZWQpIHtcbiAgICAgIHJldHVybiBjYWNoZWRcbiAgICB9XG4gICAgY29uc3QgcSA9IGF3YWl0IGxheWVyLnF1ZXJ5RmVhdHVyZXMoe1xuICAgICAgd2hlcmUsXG4gICAgICBvdXRTdGF0aXN0aWNzOiBbXG4gICAgICAgIHsgc3RhdGlzdGljVHlwZTogJ21heCcsIG9uU3RhdGlzdGljRmllbGQ6ICdwcmVzc3VyZScsIG91dFN0YXRpc3RpY0ZpZWxkTmFtZTogJ3BNYXgnIH0sXG4gICAgICAgIHsgc3RhdGlzdGljVHlwZTogJ21heCcsIG9uU3RhdGlzdGljRmllbGQ6ICdyZXNvdXJjZScsIG91dFN0YXRpc3RpY0ZpZWxkTmFtZTogJ3JNYXgnIH1cbiAgICAgIF0sXG4gICAgICByZXR1cm5HZW9tZXRyeTogZmFsc2VcbiAgICB9KS5jYXRjaCgoKSA9PiBudWxsKVxuICAgIGlmICghcSkge1xuICAgICAgcmV0dXJuIG51bGwgLy8gdHJhbnNpZW50IGZhaWx1cmUg4oCUIGRvbid0IGNhY2hlIGl0LCBuZXh0IGNsaWNrIHJldHJpZXNcbiAgICB9XG4gICAgY29uc3QgcyA9IHE/LmZlYXR1cmVzPy5bMF0/LmF0dHJpYnV0ZXMgPz8ge31cbiAgICBjb25zdCBtYXg6IEF4aXNNYXggPSB7IHByZXNzdXJlOiBOdW1iZXIocy5wTWF4KSB8fCBudWxsLCByZXNvdXJjZTogTnVtYmVyKHMuck1heCkgfHwgbnVsbCB9XG4gICAgbWF4Q2FjaGVSZWYuY3VycmVudC5zZXQoa2V5LCBtYXgpXG4gICAgcmV0dXJuIG1heFxuICB9XG5cbiAgLy8gU3RhdGljIHBhaXIgcHJvZmlsZSBmb3IgdGhlIEluZm8gdGFiIChtb2Rlcm4gcGFuZWxzIG9ubHkpOiBwcm9iZSB0aGUgbWFwJ3MgbGF5ZXJzIGZvclxuICAvLyBvbmUgdGhhdCByZXR1cm5zIHBhaXIgZmVhdHVyZXMg4oCUIGl0cyBicmVhayBmaWVsZHMgYXJyaXZlIHdpdGggdGhlIHNhbXBsZSwgYW5kIGxvYWRNYXhcbiAgLy8gYWRkcyB0aGUgdHJ1ZSBtYXhpbWEuIFJlbmRlcmVkIG9uY2UgcGVyIHZpZXc7IG5ldmVyIGludm9sdmVkIGluIGNsaWNrcy5cbiAgY29uc3QgW3Byb2ZpbGUsIHNldFByb2ZpbGVdID0gUmVhY3QudXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbClcblxuICBjb25zdCBsb2FkUHJvZmlsZSA9IGFzeW5jICh2aWV3OiBfX2VzcmkuTWFwVmlldykgPT4ge1xuICAgIGlmIChmZWF0dXJlSW5mby5wb3B1cFZhcmlhbnQgIT09ICdtb2Rlcm4nKSB7XG4gICAgICBzZXRQcm9maWxlKG51bGwpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgd2hlcmUgPSBwYWlyID8gcGFpcldoZXJlKHBhaXIpIDogJzE9MSdcbiAgICBjb25zdCBpdGVtcyA9ICh2aWV3Lm1hcD8ubGF5ZXJzPy5pdGVtcyA/PyBbXSkgYXMgX19lc3JpLkZlYXR1cmVMYXllcltdXG4gICAgZm9yIChjb25zdCBsYXllciBvZiBpdGVtcykge1xuICAgICAgaWYgKCFsYXllci5xdWVyeUZlYXR1cmVzKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCBxID0gYXdhaXQgbGF5ZXIucXVlcnlGZWF0dXJlcyh7IHdoZXJlLCBvdXRGaWVsZHM6IFsnKiddLCByZXR1cm5HZW9tZXRyeTogZmFsc2UsIG51bTogMSB9KS5jYXRjaCgoKSA9PiBudWxsKVxuICAgICAgY29uc3QgYXR0cnMgPSBxPy5mZWF0dXJlcz8uWzBdPy5hdHRyaWJ1dGVzIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkXG4gICAgICBpZiAoYXR0cnM/LnBhaXIgIT0gbnVsbCAmJiBhdHRycy5iaXZfY2xhc3MgIT0gbnVsbCkge1xuICAgICAgICBzZXRQcm9maWxlKHNjYWxlc0h0bWwoYXR0cnMsIGF3YWl0IGxvYWRNYXgobGF5ZXIsIHdoZXJlKSkpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgICBzZXRQcm9maWxlKG51bGwpXG4gIH1cblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjbGlja0hhbmRsZVJlZi5jdXJyZW50Py5yZW1vdmUoKVxuICAgICAgbW92ZUhhbmRsZVJlZi5jdXJyZW50Py5yZW1vdmUoKVxuICAgICAgd2luZG93LmNsZWFyVGltZW91dChob3ZlclRpbWVyUmVmLmN1cnJlbnQpXG4gICAgICByZXN0b3JlUG9wdXAoKVxuICAgIH1cbiAgfSwgW10pXG5cbiAgY29uc3QgcmF3RmllbGRzID0gKGF0dHJzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IEFycmF5PFtzdHJpbmcsIHN0cmluZ10+ID0+XG4gICAgT2JqZWN0LmVudHJpZXMoYXR0cnMpXG4gICAgICAuZmlsdGVyKChba10pID0+ICFpZ25vcmVkQXR0ci50ZXN0KGspKVxuICAgICAgLm1hcCgoW2ssIHZdKSA9PiBbaywgdiA9PSBudWxsID8gJycgOiBTdHJpbmcodildKVxuXG4gIC8vIE9wZW4gdGhlIHNpZGViYXIgbGF5b3V0IHdpZGdldCB0aGF0IGNvbnRhaW5zIHRoaXMgcGFuZWwgKHN0YXRlICdjb2xsYXBzZScgdHJ1ZSA9IHZpc2libGUpLlxuICBjb25zdCBvcGVuU2lkZWJhciA9ICgpID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IGdldEFwcFN0b3JlKCkuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IHdpZGdldHMgPSBzdGF0ZS5hcHBDb25maWc/LndpZGdldHMgPz8ge31cbiAgICBmb3IgKGNvbnN0IFtpZCwgd10gb2YgT2JqZWN0LmVudHJpZXMod2lkZ2V0cykpIHtcbiAgICAgIGlmICh3Py51cmkgIT09ICd3aWRnZXRzL2xheW91dC9zaWRlYmFyLycpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBzdGF0ZS5hcHBDb25maWc/LmxheW91dHM/LlsodyBhcyBhbnkpPy5sYXlvdXRzPy5GSVJTVD8uTEFSR0VdPy5jb250ZW50ID8/IHt9XG4gICAgICBpZiAoT2JqZWN0LnZhbHVlcyhjb250ZW50KS5zb21lKGMgPT4gYz8ud2lkZ2V0SWQgPT09IHByb3BzLmlkKSkge1xuICAgICAgICBnZXRBcHBTdG9yZSgpLmRpc3BhdGNoKGFwcEFjdGlvbnMud2lkZ2V0U3RhdGVQcm9wQ2hhbmdlKGlkLCAnY29sbGFwc2UnLCB0cnVlKSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gVHJhbnNpZW50IHNlcnZpY2UgaGljY3VwcyBtYWtlIGEgZmV0Y2ggZmFpbCBvdXRyaWdodDsgcmV0cnkgYmVmb3JlIGRlZ3JhZGluZyxcbiAgLy8gYmVjYXVzZSB0aGUgbGFzdC1kaXRjaCByYXcgYXR0cmlidXRlIHRhYmxlIGlzIGEgYmFkIHBvcHVwIGZvciBhIHBhaXIgY2VsbC5cbiAgY29uc3Qgd2l0aFJldHJ5ID0gYXN5bmMgPFQsPihmbjogKCkgPT4gUHJvbWlzZTxUIHwgbnVsbD4sIHRyaWVzID0gNSk6IFByb21pc2U8VCB8IG51bGw+ID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaWVzOyBpKyspIHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBmbigpLmNhdGNoKCgpID0+IG51bGwpXG4gICAgICBpZiAociAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiByXG4gICAgICB9XG4gICAgICBpZiAoaSA8IHRyaWVzIC0gMSkge1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4gd2luZG93LnNldFRpbWVvdXQocmVzLCAyMDAgKiAoaSArIDEpKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGNvbnN0IGRvSGl0VGVzdCA9IGFzeW5jICh2aWV3OiBfX2VzcmkuTWFwVmlldywgZSkgPT4ge1xuICAgIC8vIE9ubHkgdGhlIG5ld2VzdCBjbGljayBtYXkgYXBwbHkgaXRzIHJlc3VsdHMg4oCUIGEgc2xvdyBlYXJsaWVyIHJlcXVlc3QgcmVzb2x2aW5nXG4gICAgLy8gbGF0ZSB3b3VsZCBvdGhlcndpc2Ugb3ZlcndyaXRlIHRoZSBuZXdlciBwb3B1cC5cbiAgICBjb25zdCBzZXEgPSArK2hpdFNlcVJlZi5jdXJyZW50XG4gICAgY29uc3QgcmVzID0gYXdhaXQgdmlldy5oaXRUZXN0KGUpLmNhdGNoKCgpID0+IG51bGwpXG4gICAgaWYgKCFyZXMgfHwgaGl0U2VxUmVmLmN1cnJlbnQgIT09IHNlcSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGJtID0gdmlldy5tYXA/LmJhc2VtYXBcbiAgICBjb25zdCBpc0Jhc2VtYXBMYXllciA9IChsOiBfX2VzcmkuTGF5ZXIpID0+IChibT8uYmFzZUxheWVycz8uaW5jbHVkZXMobCBhcyBhbnkpIHx8IGJtPy5yZWZlcmVuY2VMYXllcnM/LmluY2x1ZGVzKGwgYXMgYW55KSlcbiAgICBsZXQgZmVhdHMgPSAocmVzLnJlc3VsdHMgPz8gW10pLmZpbHRlcihyID0+IHIudHlwZSA9PT0gJ2dyYXBoaWMnICYmIHIubGF5ZXI/LnRpdGxlICYmICFpc0Jhc2VtYXBMYXllcihyLmxheWVyKSlcbiAgICBpZiAoIWZlYXRzLmxlbmd0aCkge1xuICAgICAgc2V0SGl0cyhbXSlcbiAgICAgIHNldEVtcHR5KHRydWUpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgc2V0RW1wdHkoZmFsc2UpXG4gICAgaWYgKHRhYmJlZCAmJiBmZWF0dXJlSW5mby50b29sID09PSAnY2xpY2snKSB7XG4gICAgICBzZXRUYWIoJ3BvcHVwJylcbiAgICB9XG4gICAgY29uc3QgaXNQYWlyTGF5ZXIgPSAocikgPT4ge1xuICAgICAgY29uc3QgdCA9IChyLmxheWVyIGFzIF9fZXNyaS5GZWF0dXJlTGF5ZXIpPy5wb3B1cFRlbXBsYXRlXG4gICAgICBjb25zdCBhdHRycyA9IHIuZ3JhcGhpYz8uYXR0cmlidXRlc1xuICAgICAgcmV0dXJuIHQ/LnRpdGxlPy5pbmNsdWRlcygncGFpcicpIHx8IHIubGF5ZXI/LnRpdGxlPy5pbmNsdWRlcygnIHggJykgfHwgYXR0cnM/LnBhaXIgIT0gbnVsbCB8fCBhdHRycz8uYml2X2NsYXNzICE9IG51bGxcbiAgICB9XG4gICAgLy8gSGV4IHBhaXIgbGF5ZXJzIHRha2UgcHJpb3JpdHkgb3ZlciBvdGhlciBsYXllcnMgYXQgdGhlIHBvaW50LCByZWdhcmRsZXNzIG9mIGhpdCBvcmRlci5cbiAgICBjb25zdCBwYWlyRmVhdHMgPSBmZWF0cy5maWx0ZXIoaXNQYWlyTGF5ZXIpXG4gICAgY29uc3QgY2hvc2VuID0gcGFpckZlYXRzLmxlbmd0aCA/IHBhaXJGZWF0cy5zbGljZSgwLCAxKSA6IChmZWF0dXJlSW5mby5zaG93VG9wT25seSA/IGZlYXRzLnNsaWNlKDAsIDEpIDogZmVhdHMpXG4gICAgY29uc3Qgb3V0OiBGZWF0dXJlSGl0W10gPSBbXVxuICAgIGZvciAoY29uc3QgciBvZiBjaG9zZW4pIHtcbiAgICAgIGxldCBhdHRycyA9IChyLmdyYXBoaWM/LmF0dHJpYnV0ZXMgPz8gbnVsbCkgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsXG4gICAgICAvLyBoaXRUZXN0IGF0dHJpYnV0ZXMgY2FuIGJlIHRoaW4gZGVwZW5kaW5nIG9uIHRoZSBsYXllcidzIG91dEZpZWxkcyDigJQgZmV0Y2ggdGhlIGZ1bGwgcmVjb3JkLlxuICAgICAgaWYgKGlzUGFpckxheWVyKHIpICYmICghYXR0cnMgfHwgYXR0cnMuYml2X2NsYXNzID09IG51bGwgfHwgYXR0cnMucHJlc3N1cmUgPT0gbnVsbCkpIHtcbiAgICAgICAgY29uc3QgbGF5ZXIgPSByLmxheWVyIGFzIF9fZXNyaS5GZWF0dXJlTGF5ZXJcbiAgICAgICAgY29uc3Qgb2lkID0gci5ncmFwaGljPy5nZXRPYmplY3RJZD8uKClcbiAgICAgICAgY29uc3QgcSA9IGF3YWl0IHdpdGhSZXRyeSgoKSA9PiBsYXllci5xdWVyeUZlYXR1cmVzKHtcbiAgICAgICAgICBvYmplY3RJZHM6IG9pZCAhPSBudWxsID8gW29pZF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgZ2VvbWV0cnk6IGUubWFwUG9pbnQsXG4gICAgICAgICAgb3V0RmllbGRzOiBbJyonXSxcbiAgICAgICAgICByZXR1cm5HZW9tZXRyeTogZmFsc2VcbiAgICAgICAgfSkpXG4gICAgICAgIGNvbnN0IGYgPSBxPy5mZWF0dXJlcz8uWzBdXG4gICAgICAgIGlmIChmPy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgYXR0cnMgPSBmLmF0dHJpYnV0ZXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFhdHRycykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgLy8gUGFpciBjZWxsIHdob3NlIGZ1bGwgcmVjb3JkIHN0aWxsIHdvbid0IGxvYWQgYWZ0ZXIgcmV0cmllczogb2ZmZXIgYSByZXRyeVxuICAgICAgLy8gY2xpY2sgaW5zdGVhZCBvZiBkdW1waW5nIGEgcmF3IGF0dHJpYnV0ZSB0YWJsZS5cbiAgICAgIGlmIChpc1BhaXJMYXllcihyKSAmJiBhdHRycy5wYWlyID09IG51bGwgJiYgYXR0cnMuYml2X2NsYXNzID09IG51bGwpIHtcbiAgICAgICAgb3V0LnB1c2goe1xuICAgICAgICAgIGxheWVyVGl0bGU6IFN0cmluZyhyLmxheWVyLnRpdGxlKSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0ZlYXR1cmUgZGV0YWlscyB0ZW1wb3JhcmlseSB1bmF2YWlsYWJsZSDigJQgY2xpY2sgdGhlIGNlbGwgYWdhaW4uJ1xuICAgICAgICB9KVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgY2FyZCA9IGJpdkNhcmRIdG1sKGF0dHJzLCBmZWF0dXJlSW5mby5wb3B1cFZhcmlhbnQsIGZlYXR1cmVJbmZvLCBpc1BhaXJMYXllcihyKSA/IGF3YWl0IGxvYWRNYXgoci5sYXllciBhcyBfX2VzcmkuRmVhdHVyZUxheWVyLCBhdHRycy5wYWlyICE9IG51bGwgPyBwYWlyV2hlcmUoYXR0cnMucGFpcikgOiAnMT0xJykgOiBudWxsKVxuICAgICAgaWYgKGNhcmQpIHtcbiAgICAgICAgb3V0LnB1c2goeyBsYXllclRpdGxlOiBTdHJpbmcoYXR0cnMucGFpciA/PyByLmxheWVyLnRpdGxlKSwgaHRtbDogY2FyZCB9KVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgdGVtcGxhdGUgPSAoci5sYXllciBhcyBfX2VzcmkuRmVhdHVyZUxheWVyKT8ucG9wdXBUZW1wbGF0ZVxuICAgICAgbGV0IGVudHJ5OiBGZWF0dXJlSGl0ID0gbnVsbFxuICAgICAgaWYgKHRlbXBsYXRlPy5mZXRjaEZlYXR1cmVzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gYXdhaXQgdGVtcGxhdGUuZmV0Y2hGZWF0dXJlcyhbci5ncmFwaGljXSkuY2F0Y2goKCkgPT4gbnVsbClcbiAgICAgICAgY29uc3QgYyA9IGNvbnRlbnRzPy5bMF1cbiAgICAgICAgaWYgKGM/LmZpZWxkcz8ubGVuZ3RoKSB7XG4gICAgICAgICAgZW50cnkgPSB7XG4gICAgICAgICAgICBsYXllclRpdGxlOiBjLnRpdGxlIHx8IHIubGF5ZXIudGl0bGUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogdHlwZW9mIGMuZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnID8gYy5kZXNjcmlwdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZpZWxkczogYy5maWVsZHMubWFwKGYgPT4gW2YubGFiZWwgfHwgZi5maWVsZE5hbWUsIGYuZm9ybWF0dGVkVmFsdWUgPz8gZi52YWx1ZSA/PyAnJ10pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIGVudHJ5ID0geyBsYXllclRpdGxlOiByLmxheWVyLnRpdGxlLCBmaWVsZHM6IHJhd0ZpZWxkcyhhdHRycykgfVxuICAgICAgfVxuICAgICAgb3V0LnB1c2goZW50cnkpXG4gICAgfVxuICAgIC8vIEhleCBsYXllciBub3QgaW4gdGhlIGhpdCByZXN1bHRzIGF0IGFsbCDigJQgcXVlcnkgaXQgZGlyZWN0bHkgYnkgdGhlIGNsaWNrIHBvaW50LlxuICAgIGlmICghb3V0Lmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFpckxheWVyID0gKHZpZXcubWFwPy5sYXllcnM/Lml0ZW1zID8/IFtdKS5maW5kKGwgPT5cbiAgICAgICAgKGwgYXMgX19lc3JpLkZlYXR1cmVMYXllcik/LnBvcHVwVGVtcGxhdGU/LnRpdGxlPy5pbmNsdWRlcygncGFpcicpIHx8IGwudGl0bGU/LmluY2x1ZGVzKCcgeCAnKSkgYXMgX19lc3JpLkZlYXR1cmVMYXllclxuICAgICAgaWYgKHBhaXJMYXllcj8ucXVlcnlGZWF0dXJlcykge1xuICAgICAgICBjb25zdCBxID0gYXdhaXQgd2l0aFJldHJ5KCgpID0+IHBhaXJMYXllci5xdWVyeUZlYXR1cmVzKHsgZ2VvbWV0cnk6IGUubWFwUG9pbnQsIG91dEZpZWxkczogWycqJ10sIHJldHVybkdlb21ldHJ5OiBmYWxzZSB9KSlcbiAgICAgICAgY29uc3QgZiA9IHE/LmZlYXR1cmVzPy5bMF1cbiAgICAgICAgaWYgKGY/LmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBjb25zdCBhdHRycyA9IGYuYXR0cmlidXRlcyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICAgICAgIGNvbnN0IGNhcmQgPSBiaXZDYXJkSHRtbChhdHRycywgZmVhdHVyZUluZm8ucG9wdXBWYXJpYW50LCBmZWF0dXJlSW5mbywgYXdhaXQgbG9hZE1heChwYWlyTGF5ZXIsIGF0dHJzLnBhaXIgIT0gbnVsbCA/IHBhaXJXaGVyZShhdHRycy5wYWlyKSA6ICcxPTEnKSlcbiAgICAgICAgICBpZiAoY2FyZCkge1xuICAgICAgICAgICAgb3V0LnB1c2goeyBsYXllclRpdGxlOiBTdHJpbmcoYXR0cnMucGFpciA/PyBwYWlyTGF5ZXIudGl0bGUpLCBodG1sOiBjYXJkIH0pXG4gICAgICAgICAgICBpZiAodGFiYmVkICYmIGZlYXR1cmVJbmZvLnRvb2wgPT09ICdjbGljaycpIHtcbiAgICAgICAgICAgICAgc2V0VGFiKCdwb3B1cCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChoaXRTZXFSZWYuY3VycmVudCA9PT0gc2VxKSB7XG4gICAgICBzZXRIaXRzKG91dClcbiAgICB9XG4gIH1cblxuICBjb25zdCBvbkFjdGl2ZVZpZXdDaGFuZ2UgPSAoam12OiBKaW11TWFwVmlldykgPT4ge1xuICAgIGNsaWNrSGFuZGxlUmVmLmN1cnJlbnQ/LnJlbW92ZSgpXG4gICAgbW92ZUhhbmRsZVJlZi5jdXJyZW50Py5yZW1vdmUoKVxuICAgIGNsaWNrSGFuZGxlUmVmLmN1cnJlbnQgPSBudWxsXG4gICAgbW92ZUhhbmRsZVJlZi5jdXJyZW50ID0gbnVsbFxuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoaG92ZXJUaW1lclJlZi5jdXJyZW50KVxuICAgIHJlc3RvcmVQb3B1cCgpXG4gICAgc2V0SGl0cyhbXSlcbiAgICBzZXRFbXB0eShmYWxzZSlcbiAgICBpZiAoIWptdj8udmlldykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxvYWRQcm9maWxlKGptdi52aWV3KVxuICAgIGlmIChmZWF0dXJlSW5mby5wYW5lbE9ubHkpIHtcbiAgICAgIHBvcHVwV2FzRW5hYmxlZFJlZi5jdXJyZW50ID0gam12LnZpZXcucG9wdXBFbmFibGVkXG4gICAgICBwb3B1cFZpZXdSZWYuY3VycmVudCA9IGptdi52aWV3XG4gICAgICBqbXYudmlldy5wb3B1cEVuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgICBpZiAoZmVhdHVyZUluZm8udG9vbCA9PT0gJ2hvdmVyJykge1xuICAgICAgbW92ZUhhbmRsZVJlZi5jdXJyZW50ID0gam12LnZpZXcub24oJ3BvaW50ZXItbW92ZScsIChlKSA9PiB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoaG92ZXJUaW1lclJlZi5jdXJyZW50KVxuICAgICAgICBob3ZlclRpbWVyUmVmLmN1cnJlbnQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiBkb0hpdFRlc3Qoam12LnZpZXcsIGUpLCAxMjApXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBjbGlja0hhbmRsZVJlZi5jdXJyZW50ID0gam12LnZpZXcub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgaWYgKGZlYXR1cmVJbmZvLm9wZW5QYW5lbE9uQ2xpY2spIHtcbiAgICAgICAgICBvcGVuU2lkZWJhcigpXG4gICAgICAgIH1cbiAgICAgICAgZG9IaXRUZXN0KGptdi52aWV3LCBlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyBCb3VuZGFyeSBmaWxsIHRvZ2dsZTogdGhlIHBhaXIgc2VjdGlvbidzIHN0YXRzIGFycmF5IHN1cHBsaWVzIHRoZSBmb3VyIHNoYXJlcywgc29cbiAgLy8gZmlndXJlIGFuZCBudW1iZXJzIGNhbid0IGRyaWZ0IGFwYXJ0LiBNb2Rlcm4gcGFuZWxzIG9ubHk7IGVhY2ggaW5zdGFuY2UgZ2V0cyBhXG4gIC8vIHVuaXF1ZSBjbGlwIGlkIHNpbmNlIHNldmVyYWwgdmlld3MgY2FuIG1vdW50IHRoaXMgc3ZnIGF0IG9uY2UuXG4gIGNvbnN0IHBhaXJTdGF0cyA9IGZlYXR1cmVJbmZvLnBvcHVwVmFyaWFudCA9PT0gJ21vZGVybicgPyAoc2VjdGlvbnMgPz8gW10pLmZpbmQocyA9PiBzLmlkID09PSAncGFpcicpPy5zdGF0cyA6IHVuZGVmaW5lZFxuICBjb25zdCBmaWxsVWlkID0gUmVhY3QudXNlTWVtbygoKSA9PiBgcHAkeysrcHBVaWRDb3VudGVyfWAsIFtdKVxuICBjb25zdCBmaWxsSHRtbCA9IEFycmF5LmlzQXJyYXkocGFpclN0YXRzKSAmJiBwYWlyU3RhdHMubGVuZ3RoID49IDQgPyBwYWlyRmlsbEh0bWwocGFpclN0YXRzLCBmaWxsVWlkKSA6IG51bGxcblxuICBjb25zdCB0YWJCdG4gPSAoYWN0aXZlOiBib29sZWFuKTogUmVhY3QuQ1NTUHJvcGVydGllcyA9PiAoe1xuICAgIGZsZXg6IDEsXG4gICAgYmFja2dyb3VuZDogJ25vbmUnLFxuICAgIGJvcmRlcjogJ25vbmUnLFxuICAgIGJvcmRlckJvdHRvbTogYWN0aXZlID8gJzNweCBzb2xpZCAjNGI1NTYzJyA6ICczcHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgIHBhZGRpbmc6ICc4cHggMTBweCcsXG4gICAgZm9udFNpemU6IDE1LFxuICAgIGZvbnRXZWlnaHQ6IGFjdGl2ZSA/IDgwMCA6IDYwMCxcbiAgICBjb2xvcjogYWN0aXZlID8gJyMxZjI5MzcnIDogJyM2YjcyODAnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIG1hcmdpbkJvdHRvbTogLTJcbiAgfSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYWNjb3JkaW9uXCIgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIG92ZXJmbG93WTogJ2F1dG8nIH19PlxuICAgICAgPHN0eWxlPntgXG4gICAgICAgIC5wYW5lbC1hY2NvcmRpb24gZGV0YWlscyBzdW1tYXJ5Ojotd2Via2l0LWRldGFpbHMtbWFya2VyIHsgZGlzcGxheTogbm9uZSB9XG4gICAgICAgIC5wYW5lbC1hY2NvcmRpb24gZGV0YWlscyBzdW1tYXJ5IHsgbGlzdC1zdHlsZTogbm9uZSB9XG4gICAgICBgfTwvc3R5bGU+XG4gICAgICB7dGFiYmVkICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGJvcmRlckJvdHRvbTogJzJweCBzb2xpZCAjZTJlOGYwJywgbWFyZ2luQm90dG9tOiAxMCB9fT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRUYWIoJ2luZm8nKX0gc3R5bGU9e3RhYkJ0bih0YWIgPT09ICdpbmZvJyl9PkluZm8gJiBTb3VyY2VzPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0VGFiKCdwb3B1cCcpfSBzdHlsZT17dGFiQnRuKHRhYiA9PT0gJ3BvcHVwJyl9PlBvcHVwPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHsoIXRhYmJlZCB8fCB0YWIgPT09ICdpbmZvJykgJiYgKFxuICAgICAgICA8PlxuICAgICAgICAgIHt0aXRsZSAmJiA8aDQgc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDRweCAwJyB9fT48c3Ryb25nPnt0aXRsZX08L3N0cm9uZz48L2g0Pn1cbiAgICAgICAgICB7KHNlY3Rpb25zID8/IFtdKS5tYXAocyA9PiAoXG4gICAgICAgICAgICA8ZGV0YWlscyBrZXk9e3MuaWR9IG9wZW49eyEhcy5vcGVufSBzdHlsZT17eyBtYXJnaW5Ub3A6IDEwIH19PlxuICAgICAgICAgICAgICA8c3VtbWFyeSBzdHlsZT17eyAuLi5iYXNlUGlsbCwgYmFja2dyb3VuZENvbG9yOiBzLnBpbGxDb2xvciA/PyAnIzUwNjRhMScgfX0+XG4gICAgICAgICAgICAgICAge3MucGlsbH1cbiAgICAgICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmdMZWZ0OiAxMCwgbWFyZ2luVG9wOiA4IH19IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcy5ib2R5ICsgKHMuaWQgPT09ICdwYWlyJyAmJiBmaWxsSHRtbCA/IGZpbGxIdG1sIDogJycpICsgKHMuaWQgPT09ICdzY2FsZXMnICYmIHByb2ZpbGUgPyBwcm9maWxlIDogJycpIH19IC8+XG4gICAgICAgICAgICA8L2RldGFpbHM+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvPlxuICAgICAgKX1cbiAgICAgIHt1c2VNYXBXaWRnZXRJZCAmJiAoIXRhYmJlZCB8fCB0YWIgPT09ICdwb3B1cCcpICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IHRhYmJlZCA/IDAgOiAxNCwgYm9yZGVyVG9wOiB0YWJiZWQgPyAnbm9uZScgOiAnMXB4IHNvbGlkICNkOWQ5ZDknLCBwYWRkaW5nVG9wOiB0YWJiZWQgPyAwIDogOCB9fT5cbiAgICAgICAgICB7aGl0cy5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJyM4YThhOGEnLCBmb250U2l6ZTogMTIsIG1hcmdpblRvcDogNCB9fT5cbiAgICAgICAgICAgICAge2VtcHR5ID8gJ05vIGZlYXR1cmUgYXQgdGhhdCBsb2NhdGlvbi4nIDogJ0NsaWNrIGEgY2VsbCBvbiB0aGUgbWFwIHRvIHNlZSBpdHMgYXR0cmlidXRlcy4nfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7aGl0cy5tYXAoKGgsIGkpID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtgJHtoLmxheWVyVGl0bGV9LSR7aX1gfSBzdHlsZT17eyBtYXJnaW5Ub3A6IDggfX0+XG4gICAgICAgICAgICAgIHtoLmh0bWxcbiAgICAgICAgICAgICAgICA/IDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBoLmh0bWwgfX0gLz5cbiAgICAgICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnLCBmb250U2l6ZTogMTIgfX0+e2gubGF5ZXJUaXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge2guZGVzY3JpcHRpb24gJiYgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogMTEsIGZvbnRTdHlsZTogJ2l0YWxpYycsIGNvbG9yOiAnIzU1NScsIG1hcmdpblRvcDogMiB9fT57aC5kZXNjcmlwdGlvbn08L2Rpdj59XG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBzdHlsZT17eyBmb250U2l6ZTogMTEsIGJvcmRlckNvbGxhcHNlOiAnY29sbGFwc2UnLCB3aWR0aDogJzEwMCUnIH19PlxuICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHsoaC5maWVsZHMgPz8gW10pLm1hcCgoW2ssIHZdKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2t9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMnB4IDZweCAycHggMCcsIGNvbG9yOiAnIzU1NScsIHZlcnRpY2FsQWxpZ246ICd0b3AnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9fT57a308L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT17eyBwYWRkaW5nOiAnMnB4IDAnLCB3b3JkQnJlYWs6ICdicmVhay13b3JkJyB9fT57dn08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge3VzZU1hcFdpZGdldElkICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgZGlzcGxheTogJ25vbmUnIH19PlxuICAgICAgICAgIDxKaW11TWFwVmlld0NvbXBvbmVudCB1c2VNYXBXaWRnZXRJZD17dXNlTWFwV2lkZ2V0SWR9IG9uQWN0aXZlVmlld0NoYW5nZT17b25BY3RpdmVWaWV3Q2hhbmdlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuIGV4cG9ydCBmdW5jdGlvbiBfX3NldF93ZWJwYWNrX3B1YmxpY19wYXRoX18odXJsKSB7IF9fd2VicGFja19wdWJsaWNfcGF0aF9fID0gdXJsIH0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=