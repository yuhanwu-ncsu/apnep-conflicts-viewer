System.register(["jimu-core/emotion","jimu-core","jimu-arcgis","jimu-ui","esri/core/reactiveUtils"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	var __WEBPACK_EXTERNAL_MODULE_esri_core_reactiveUtils__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_esri_core_reactiveUtils__, "__esModule", { value: true });
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
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_ui__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_esri_core_reactiveUtils__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_esri_core_reactiveUtils__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./your-extensions/widgets/conflict-legend/icon.svg"
/*!**********************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/icon.svg ***!
  \**********************************************************/
(module) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" data-auto-flip=\"true\" viewBox=\"0 0 20 20\"><path fill=\"#000\" fill-rule=\"evenodd\" d=\"M3 5 1.5 2 0 5zm16.318-2c.377 0 .682.224.682.5s-.305.5-.682.5H5.682C5.305 4 5 3.776 5 3.5s.305-.5.682-.5zM20 9.5c0-.276-.305-.5-.682-.5H5.682C5.305 9 5 9.224 5 9.5s.305.5.682.5h13.636c.377 0 .682-.224.682-.5m0 6c0-.276-.305-.5-.682-.5H5.682c-.377 0-.682.224-.682.5s.305.5.682.5h13.636c.377 0 .682-.224.682-.5m-17 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0M3 8v3H0V8z\" clip-rule=\"evenodd\"></path></svg>"

/***/ },

/***/ "./your-extensions/widgets/conflict-legend/src/config.ts"
/*!***************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/config.ts ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ELegendMode: () => (/* binding */ ELegendMode)
/* harmony export */ });
var ELegendMode;
(function (ELegendMode) {
    ELegendMode["ShowVisible"] = "show-visible";
    ELegendMode["ShowWithinExtent"] = "show-within-extent";
    ELegendMode["ShowAll"] = "show-all";
})(ELegendMode || (ELegendMode = {}));


/***/ },

/***/ "./your-extensions/widgets/conflict-legend/src/runtime/lib/style.ts"
/*!**************************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/runtime/lib/style.ts ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStyle: () => (/* binding */ getStyle)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");


function getStyle(theme, style) {
    var _a, _b, _c;
    const fillStyleCss = jimu_ui__WEBPACK_IMPORTED_MODULE_1__.styleUtils.toCSSStyle({ background: style.background });
    delete fillStyleCss.backgroundColor;
    const fontColor = style.fontColor || theme.sys.color.surface.paperText;
    const root = ((_a = style.background) === null || _a === void 0 ? void 0 : _a.color) || 'transparent';
    const cardRoot = ((_b = style.background) === null || _b === void 0 ? void 0 : _b.color) || theme.sys.color.surface.paper;
    return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.css) `
    ${((_c = style.background) === null || _c === void 0 ? void 0 : _c.color) ? 'background: transparent;' : ''}
    overflow: auto;
    .widget-legend {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 32px;
      min-width: 0;
      background-color: ${root};
      position: relative;
      ${fillStyleCss}
      --calcite-color-text-2: ${fontColor};

      .legend-container {
        flex: 1 1 auto;
        min-height: 0;
        height: 100%;
      }

      arcgis-legend {
        width: 100%;
        height: 100%;
        display: block;
        min-height: 0;
        color: ${fontColor};
        --calcite-color-text-1: ${fontColor};
        --calcite-color-text-2: ${fontColor};
        --calcite-color-foreground-1: ${cardRoot};
        --calcite-carousel-pagination-icon-color: var(--sys-color-surface-paper-text);
        --calcite-carousel-pagination-icon-color-selected: var(--sys-color-action-selected);
        // Use the paper's bg color, set the legend's bg color to transparent
        --calcite-color-foreground-1: transparent;
      }
    }
  `;
}


/***/ },

/***/ "./your-extensions/widgets/conflict-legend/src/runtime/translations/default.ts"
/*!*************************************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/runtime/translations/default.ts ***!
  \*************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    _widgetLabel: 'Conflict Legend'
});


/***/ },

/***/ "./your-extensions/widgets/conflict-legend/src/version-manager.ts"
/*!************************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/version-manager.ts ***!
  \************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   versionManager: () => (/* binding */ versionManager)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");

class VersionManager extends jimu_core__WEBPACK_IMPORTED_MODULE_0__.BaseVersionManager {
    constructor() {
        super(...arguments);
        this.versions = [
            {
                version: '1.17.0',
                description: 'Update respectLayerDefinitionExp option',
                upgrader: (oldConfig) => {
                    const newConfig = oldConfig.set('respectLayerDefinitionExp', false);
                    return newConfig;
                }
            }
        ];
    }
}
const versionManager = new VersionManager();


/***/ },

/***/ "esri/core/reactiveUtils"
/*!******************************************!*\
  !*** external "esri/core/reactiveUtils" ***!
  \******************************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_esri_core_reactiveUtils__;

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

/***/ },

/***/ "jimu-ui"
/*!**************************!*\
  !*** external "jimu-ui" ***!
  \**************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui__;

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
  !*** ./your-extensions/widgets/conflict-legend/src/runtime/widget.tsx ***!
  \************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoadStatus: () => (/* binding */ LoadStatus),
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_arcgis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-arcgis */ "jimu-arcgis");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config */ "./your-extensions/widgets/conflict-legend/src/config.ts");
/* harmony import */ var _lib_style__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/style */ "./your-extensions/widgets/conflict-legend/src/runtime/lib/style.ts");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./translations/default */ "./your-extensions/widgets/conflict-legend/src/runtime/translations/default.ts");
/* harmony import */ var _icon_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../icon.svg */ "./your-extensions/widgets/conflict-legend/icon.svg");
/* harmony import */ var _icon_svg__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_icon_svg__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _version_manager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../version-manager */ "./your-extensions/widgets/conflict-legend/src/version-manager.ts");
/* harmony import */ var esri_core_reactiveUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! esri/core/reactiveUtils */ "esri/core/reactiveUtils");
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









var LoadStatus;
(function (LoadStatus) {
    LoadStatus["Pending"] = "Pending";
    LoadStatus["Fulfilled"] = "Fulfilled";
    LoadStatus["Rejected"] = "Rejected";
})(LoadStatus || (LoadStatus = {}));
const CARD_ROOT_FILL_STYLE_ID = 'exb-legend-card-fill-style';
const CARD_VIEW_FILL_STYLE_ID = 'exb-legend-card-view-fill-style';
const CARD_ROOT_FILL_CSS = `
  .root {
    min-height: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  arcgis-legend-card-view {
    min-height: 0;
    flex: 1 1 auto;
    height: 100%;
  }
`;
const CARD_VIEW_FILL_CSS = `
  :host {
    min-height: 0;
    height: 100%;
  }

  calcite-carousel {
    min-height: 0;
    height: 100%;
  }

  calcite-carousel-item {
    min-height: 0;
    height: 100%;
  }
`;
class Widget extends jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.PureComponent {
    constructor(props) {
        super(props);
        this.legendShadowObservers = [];
        this.observedShadowRoots = new WeakSet();
        this.legendWrapperRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.createRef();
        this.legendContainerRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.createRef();
        this.destroyLegend = () => {
            var _a, _b, _c, _d;
            (_b = (_a = this.customizeActiveLayerInfosHandle) === null || _a === void 0 ? void 0 : _a.remove) === null || _b === void 0 ? void 0 : _b.call(_a);
            this.customizeActiveLayerInfosHandle = null;
            if (this.legendShadowSweepTimer) {
                window.clearInterval(this.legendShadowSweepTimer);
                this.legendShadowSweepTimer = null;
            }
            this.legendShadowObservers.forEach((observer) => observer.disconnect());
            this.legendShadowObservers = [];
            if (this.legend && this.legendReadyHandler) {
                this.legend.removeEventListener('arcgisReady', this.legendReadyHandler);
            }
            this.legendReadyHandler = null;
            if (this.legend) {
                const legend = this.legend;
                this.legend = null;
                (_c = legend.remove) === null || _c === void 0 ? void 0 : _c.call(legend);
                (_d = legend.destroy) === null || _d === void 0 ? void 0 : _d.call(legend);
            }
        };
        this.ensureMapComponentsLoaded = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.loadMapComponentsPromise) {
                this.loadMapComponentsPromise = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.loadArcGISMapComponents)();
            }
            try {
                yield this.loadMapComponentsPromise;
            }
            catch (error) {
                this.loadMapComponentsPromise = null;
                throw error;
            }
        });
        this.cacheLegendWrapperSize = () => {
            const wrapper = this.legendWrapperRef.current;
            if (!wrapper) {
                return;
            }
            if (wrapper.clientWidth > 0) {
                this.currentWidth = wrapper.clientWidth;
            }
        };
        this.syncLegendSize = () => {
            if (!this.legend) {
                return;
            }
            const style = this.legend.style;
            if (!style) {
                return;
            }
            style.width = '100%';
            style.display = 'block';
            style.height = '100%';
        };
        this.ensureCardViewFullHeight = () => {
            if (!this.legend || !this.props.config.cardStyle) {
                return;
            }
            const legendElement = this.legend;
            const legendShadowRoot = legendElement.shadowRoot;
            if (!legendShadowRoot) {
                return;
            }
            if (!legendShadowRoot.getElementById(CARD_ROOT_FILL_STYLE_ID)) {
                const style = document.createElement('style');
                style.id = CARD_ROOT_FILL_STYLE_ID;
                style.textContent = CARD_ROOT_FILL_CSS;
                legendShadowRoot.appendChild(style);
            }
            const cardView = legendShadowRoot.querySelector('arcgis-legend-card-view');
            const cardShadowRoot = cardView === null || cardView === void 0 ? void 0 : cardView.shadowRoot;
            if (!cardShadowRoot) {
                return;
            }
            if (!cardShadowRoot.getElementById(CARD_VIEW_FILL_STYLE_ID)) {
                const style = document.createElement('style');
                style.id = CARD_VIEW_FILL_STYLE_ID;
                style.textContent = CARD_VIEW_FILL_CSS;
                cardShadowRoot.appendChild(style);
            }
        };
        this.bindLegendReadyEvent = (jimuMapView = this.state.activeJmv) => {
            if (!this.legend) {
                return;
            }
            if (this.legendReadyHandler) {
                this.legend.removeEventListener('arcgisReady', this.legendReadyHandler);
            }
            this.legendReadyHandler = () => {
                this.syncLegendSize();
                this.ensureCardViewFullHeight();
                this.customizeLegends(jimuMapView);
                this.watchLegendShadow();
                if (typeof window.requestAnimationFrame === 'function') {
                    window.requestAnimationFrame(() => {
                        if (!this.legend)
                            return;
                        this.syncLegendSize();
                        this.ensureCardViewFullHeight();
                        this.stripRelationshipCaption();
                    });
                }
            };
            this.legend.addEventListener('arcgisReady', this.legendReadyHandler);
        };
        this.collectCaptions = (root, out = []) => {
            root.querySelectorAll('.esri-legend__layer-caption, .layer-caption').forEach((caption) => {
                out.push(caption);
            });
            // Legend DOM may live in nested shadow roots — querySelectorAll can't see into them.
            root.querySelectorAll('*').forEach((el) => {
                if (el.shadowRoot) {
                    this.collectCaptions(el.shadowRoot, out);
                }
            });
            return out;
        };
        this.observeShadowTree = (root) => {
            // Walk the root element itself too — querySelectorAll excludes it, and the legend's
            // own shadow root would otherwise stay unobserved until the first 500ms sweep.
            const candidates = root instanceof Element ? [root, ...root.querySelectorAll('*')] : root.querySelectorAll('*');
            candidates.forEach((el) => {
                const shadow = el.shadowRoot;
                if (shadow && !this.observedShadowRoots.has(shadow)) {
                    this.observedShadowRoots.add(shadow);
                    // Paint-level mute: captions are visibility:hidden by stylesheet the moment this root
                    // exists, so the text can never appear even if a re-render races the JS hide. The
                    // strip pass below un-hides any caption that isn't the one we're removing.
                    const muteStyle = document.createElement('style');
                    muteStyle.textContent = '.layer-caption { visibility: hidden }';
                    shadow.appendChild(muteStyle);
                    // Lit re-creates caption nodes on re-render — re-hide synchronously in the observer
                    // microtask (rAF would be one frame late and let lit's own rAF re-renders paint the caption).
                    const observer = new MutationObserver(() => {
                        this.observeShadowTree(shadow);
                        this.stripRelationshipCaption();
                    });
                    observer.observe(shadow, { childList: true, subtree: true, attributes: true, characterData: true });
                    this.legendShadowObservers.push(observer);
                    this.observeShadowTree(shadow);
                }
            });
        };
        this.collectRelationshipTextNodes = (root, out = []) => {
            root.querySelectorAll('*').forEach((el) => {
                var _a;
                if (!el.children.length && ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === 'Relationship') {
                    out.push(el);
                }
                if (el.shadowRoot) {
                    this.collectRelationshipTextNodes(el.shadowRoot, out);
                }
            });
            return out;
        };
        this.stripRelationshipCaption = () => {
            const legendElement = this.legend;
            if (!(legendElement === null || legendElement === void 0 ? void 0 : legendElement.shadowRoot)) {
                return false;
            }
            const allCaptions = this.collectCaptions(legendElement.shadowRoot);
            // The mute stylesheet hides all captions at paint; re-show any caption we keep,
            // and keep the stripped ones muted (belt) + removed from layout (suspenders).
            allCaptions.forEach((caption) => {
                var _a;
                caption.style.visibility = ((_a = caption.textContent) === null || _a === void 0 ? void 0 : _a.includes('Relationship')) ? 'hidden' : 'visible';
            });
            const captions = allCaptions.filter((caption) => { var _a; return (_a = caption.textContent) === null || _a === void 0 ? void 0 : _a.includes('Relationship'); });
            const textNodes = this.collectRelationshipTextNodes(legendElement.shadowRoot);
            const hits = captions.concat(textNodes);
            hits.forEach((el) => {
                el.style.display = 'none';
            });
            return hits.length > 0;
        };
        this.watchLegendShadow = () => {
            this.stripRelationshipCaption();
            if (this.legendShadowSweepTimer) {
                return;
            }
            const legendElement = this.legend;
            const legendShadowRoot = legendElement === null || legendElement === void 0 ? void 0 : legendElement.shadowRoot;
            if (!legendShadowRoot) {
                return;
            }
            // Sweep every 500ms while the widget lives — captions can render late and in nested shadow roots.
            this.legendShadowSweepTimer = window.setInterval(() => {
                this.observeShadowTree(legendShadowRoot);
                this.stripRelationshipCaption();
            }, 500);
        };
        this.createLegend = (view_1, ...args_1) => __awaiter(this, [view_1, ...args_1], void 0, function* (view, forceRecreate = false, jimuMapView = this.state.activeJmv) {
            yield this.ensureMapComponentsLoaded();
            yield view.when();
            const container = this.legendContainerRef.current;
            if (!container) {
                return;
            }
            const viewChanged = this.legend && this.legend.view !== view;
            if (!this.legend || this.legend.parentNode !== container || viewChanged || forceRecreate) {
                this.destroyLegend();
                this.legend = document.createElement('arcgis-legend');
                container.replaceChildren(this.legend);
                // Attach observers at insertion time (not arcgisReady) so the caption's very first
                // paint is already covered — observers propagate into nested shadow roots as they appear.
                this.observeShadowTree(this.legend);
                this.stripRelationshipCaption();
                [50, 150, 300, 600, 1000].forEach((ms) => {
                    window.setTimeout(() => {
                        if (this.legend) {
                            this.observeShadowTree(this.legend);
                            this.stripRelationshipCaption();
                        }
                    }, ms);
                });
            }
            this.cacheLegendWrapperSize();
            this.syncLegendSize();
            this.bindLegendReadyEvent(jimuMapView);
            this.configLegend();
            if (this.legend.view !== view) {
                this.legend.view = view;
            }
            this.customizeLegends(jimuMapView);
            this.ensureCardViewFullHeight();
        });
        this.filterActiveLayerInfos = (jimuMapView = this.state.activeJmv) => {
            var _a, _b, _c, _d;
            const activeLayerInfos = (_a = this.legend) === null || _a === void 0 ? void 0 : _a.activeLayerInfos;
            if (!this.legend || !jimuMapView || !activeLayerInfos) {
                return;
            }
            const customizeOptions = (_b = this.props.config.customizeLayerOptions) === null || _b === void 0 ? void 0 : _b[jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.id];
            if (!(customizeOptions === null || customizeOptions === void 0 ? void 0 : customizeOptions.isEnabled)) {
                return;
            }
            const showRuntimeAddedLayer = customizeOptions.showRuntimeAddedLayers;
            const showSet = new Set(customizeOptions.showJimuLayerViewIds || []);
            for (const item of [...activeLayerInfos]) {
                const layer = item.layer;
                const isRuntimeAdded = layer[jimu_core__WEBPACK_IMPORTED_MODULE_1__.ExBAddedJSAPIProperties.EXB_LAYER_FROM_RUNTIME];
                if (isRuntimeAdded) {
                    !showRuntimeAddedLayer && activeLayerInfos.remove(item);
                }
                else {
                    const jlvId = jimuMapView.getJimuLayerViewIdByAPILayer(layer);
                    const childInfos = this.getAllChildActiveInfos(item);
                    if (!showSet.has(jlvId)) {
                        activeLayerInfos.remove(item);
                    }
                    for (const childInfo of childInfos) {
                        const childJlvId = jimuMapView.getJimuLayerViewIdByAPILayer(childInfo.layer);
                        if (!showSet.has(childJlvId)) {
                            (_d = (_c = childInfo.parent) === null || _c === void 0 ? void 0 : _c.children) === null || _d === void 0 ? void 0 : _d.remove(childInfo);
                        }
                    }
                }
            }
        };
        this.customizeLegends = (jimuMapView = this.state.activeJmv) => {
            var _a, _b, _c, _d;
            (_b = (_a = this.customizeActiveLayerInfosHandle) === null || _a === void 0 ? void 0 : _a.remove) === null || _b === void 0 ? void 0 : _b.call(_a);
            this.customizeActiveLayerInfosHandle = null;
            if (!jimuMapView || !((_d = (_c = this.props.config.customizeLayerOptions) === null || _c === void 0 ? void 0 : _c[jimuMapView === null || jimuMapView === void 0 ? void 0 : jimuMapView.id]) === null || _d === void 0 ? void 0 : _d.isEnabled) || !this.legend) {
                return;
            }
            const legend = this.legend;
            this.customizeActiveLayerInfosHandle = esri_core_reactiveUtils__WEBPACK_IMPORTED_MODULE_9__.on(() => legend.activeLayerInfos, 'change', () => {
                if (legend === this.legend) {
                    this.filterActiveLayerInfos(jimuMapView);
                }
            });
            this.filterActiveLayerInfos(jimuMapView);
        };
        this.getAllChildActiveInfos = (activeInfo, result = []) => {
            if (activeInfo.children) {
                for (const childInfo of activeInfo.children) {
                    result.push(childInfo);
                    this.getAllChildActiveInfos(childInfo, result);
                }
            }
            return result;
        };
        this.isRuntimeLayer = (layer) => {
            var _a, _b, _c;
            const isRuntimeAdded = ((_c = (_a = this.props.config.customizeLayerOptions) === null || _a === void 0 ? void 0 : _a[(_b = this.state.activeJmv) === null || _b === void 0 ? void 0 : _b.id]) === null || _c === void 0 ? void 0 : _c.showRuntimeAddedLayers) && layer[jimu_core__WEBPACK_IMPORTED_MODULE_1__.ExBAddedJSAPIProperties.EXB_LAYER_FROM_RUNTIME];
            return isRuntimeAdded;
        };
        this.isSpecialLayer = (layer) => {
            let parentLayer = layer.parent;
            const layerTypes = [
                'esri.layers.WMTSLayer',
            ];
            while (parentLayer) {
                if (layerTypes.includes(parentLayer.declaredClass)) {
                    return true;
                }
                parentLayer = parentLayer.parent;
            }
            return false;
        };
        this.configLegend = () => {
            if (this.legend) {
                const basemapLegendVisible = this.props.config.showBaseMap;
                this.legend.basemapLegendVisible = basemapLegendVisible;
                this.legend.respectLayerDefinitionExpression = !!this.props.config.respectLayerDefinitionExp;
                this.applyLegendStyle(this.calculateStyle());
                const legendMode = this.props.config.legendMode;
                this.legend.ignoreLayerVisibility = legendMode === _config__WEBPACK_IMPORTED_MODULE_4__.ELegendMode.ShowAll;
                this.legend.hideLayersNotInCurrentView = legendMode === _config__WEBPACK_IMPORTED_MODULE_4__.ELegendMode.ShowWithinExtent;
                this.ensureCardViewFullHeight();
            }
        };
        this.applyLegendStyle = (style) => {
            if (!this.legend) {
                return;
            }
            if (style === 'classic') {
                this.legend.legendStyle = 'classic';
                this.legend.cardStyleLayout = undefined;
            }
            else {
                this.legend.legendStyle = style.type;
                this.legend.cardStyleLayout = style.layout;
            }
        };
        this.calculateStyle = () => {
            const currentWidth = this.currentWidth || 100000; // window.innerWidth;
            if (this.props.config.cardStyle) {
                let layout;
                if (!this.props.config.cardLayout || this.props.config.cardLayout === 'auto') {
                    if (currentWidth <= 600) {
                        layout = 'stack';
                    }
                    else {
                        layout = 'side-by-side';
                    }
                }
                else {
                    layout = this.props.config.cardLayout;
                }
                return {
                    type: 'card',
                    layout: layout
                };
            }
            return 'classic';
        };
        this.onActiveViewChange = (jimuMapView) => __awaiter(this, void 0, void 0, function* () {
            if (jimuMapView && jimuMapView.view) {
                try {
                    yield this.createLegend(jimuMapView.view, true, jimuMapView);
                    this.setState({
                        loadStatus: LoadStatus.Fulfilled,
                        activeJmv: jimuMapView
                    });
                }
                catch (error) {
                    this.destroyLegend();
                    this.setState({
                        loadStatus: LoadStatus.Rejected
                    });
                }
            }
            else {
                this.destroyLegend();
            }
        });
        this.onResize = ({ width }) => {
            this.currentWidth = width;
            if (this.legend && this.props.config.cardStyle && this.props.config.cardLayout === 'auto') {
                const style = this.calculateStyle();
                this.applyLegendStyle(style);
                this.ensureCardViewFullHeight();
            }
        };
        this.state = {
            loadStatus: LoadStatus.Pending,
            activeJmv: null
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.state.activeJmv && (((_a = prevState.activeJmv) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = this.state.activeJmv) === null || _b === void 0 ? void 0 : _b.id) || prevProps.config !== this.props.config)) {
            const activeJmvId = this.state.activeJmv.id;
            const customizeLayerOptionsChanged = ((_d = (_c = prevProps.config) === null || _c === void 0 ? void 0 : _c.customizeLayerOptions) === null || _d === void 0 ? void 0 : _d[activeJmvId]) !== ((_f = (_e = this.props.config) === null || _e === void 0 ? void 0 : _e.customizeLayerOptions) === null || _f === void 0 ? void 0 : _f[activeJmvId]);
            const activeJmvChanged = ((_g = prevState.activeJmv) === null || _g === void 0 ? void 0 : _g.id) !== ((_h = this.state.activeJmv) === null || _h === void 0 ? void 0 : _h.id);
            this.createLegend(this.state.activeJmv.view, activeJmvChanged || customizeLayerOptionsChanged, this.state.activeJmv).catch(() => {
                this.setState({
                    loadStatus: LoadStatus.Rejected
                });
            });
        }
    }
    componentWillUnmount() {
        this.destroyLegend();
    }
    isParentVisible(layer, showSet) {
        const allParentLayers = getParents(layer);
        // No parent
        if (allParentLayers.length === 0) {
            return true;
        }
        for (const parentLayer of allParentLayers) {
            const parentJlvId = this.state.activeJmv.getJimuLayerViewIdByAPILayer(parentLayer);
            if (!showSet.has(parentJlvId)) {
                return false;
            }
        }
        return true;
        function getParents(layer) {
            const ret = [];
            let currLayer = layer;
            // Skip ground
            while (currLayer.parent && currLayer.parent.parent) {
                ret.push(currLayer.parent);
                currLayer = currLayer.parent;
            }
            return ret;
        }
    }
    handleLayerWithSublayer(jimuLayerView, showSet, sublayersMap) {
        const supportedTypes = [jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.MapImageLayer, jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.SubtypeGroupLayer, jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.WMSLayer];
        const parentJlv = jimuLayerView.getParentJimuLayerView();
        if (!supportedTypes.includes(parentJlv.type)) {
            return;
        }
        // Only construct layerInfo when all the parents are selected
        if (!this.isParentVisible(jimuLayerView.layer, showSet)) {
            return;
        }
        const sublayerId = jimuLayerView.type === jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.SubtypeSublayer ? jimuLayerView.layer.subtypeCode : jimuLayerView.layer.id;
        if (sublayersMap.has(parentJlv.layer)) {
            sublayersMap.get(parentJlv.layer).push(sublayerId);
        }
        else {
            sublayersMap.set(parentJlv.layer, [sublayerId]);
        }
    }
    getDefaultStyleConfig() {
        return {
            useCustom: false,
            background: {
                color: '',
                fillType: jimu_ui__WEBPACK_IMPORTED_MODULE_3__.FillType.FILL
            },
            fontColor: ''
        };
    }
    getStyleConfig() {
        if (this.props.config.style && this.props.config.style.useCustom) {
            return this.props.config.style;
        }
        else {
            return this.getDefaultStyleConfig();
        }
    }
    render() {
        var _a;
        const useMapWidget = this.props.useMapWidgetIds && this.props.useMapWidgetIds[0];
        let content;
        if (!useMapWidget) {
            this.destroyLegend();
            content = ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'widget-legend', children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.WidgetPlaceholder, { icon: (_icon_svg__WEBPACK_IMPORTED_MODULE_7___default()), autoFlip: true, name: this.props.intl.formatMessage({ id: '_widgetLabel', defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_6__["default"]._widgetLabel }), widgetId: this.props.id }) }));
        }
        else {
            let loadingContent = null;
            const dataSourceContent = (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_arcgis__WEBPACK_IMPORTED_MODULE_2__.JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.onActiveViewChange });
            if (this.state.loadStatus === LoadStatus.Pending) {
                loadingContent = ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'jimu-secondary-loading' }));
            }
            if (window.jimuConfig.isInBuilder) {
                this.configLegend();
            }
            content = ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: 'widget-legend', ref: this.legendWrapperRef, children: [loadingContent, (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'legend-container', ref: this.legendContainerRef }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { position: 'absolute', display: 'none' }, children: dataSourceContent }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_1__.ReactResizeDetector, { targetRef: this.legendWrapperRef, handleHeight: true, handleWidth: true, onResize: this.onResize })] }));
        }
        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Paper, { variant: 'flat', css: (0,_lib_style__WEBPACK_IMPORTED_MODULE_5__.getStyle)(this.props.theme, this.getStyleConfig()), className: 'jimu-widget', shape: 'none', children: content }));
    }
}
Widget.versionManager = _version_manager__WEBPACK_IMPORTED_MODULE_8__.versionManager;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Widget);
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9jb25mbGljdC1sZWdlbmQvZGlzdC9ydW50aW1lL3dpZGdldC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc2pCOzs7Ozs7Ozs7Ozs7Ozs7QUNHQSxJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDckIsMkNBQTRCO0lBQzVCLHNEQUF1QztJQUN2QyxtQ0FBb0I7QUFDdEIsQ0FBQyxFQUpXLFdBQVcsS0FBWCxXQUFXLFFBSXRCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNQNEU7QUFDekM7QUFHN0IsU0FBUyxRQUFRLENBQUUsS0FBdUIsRUFBRSxLQUFZOztJQUM3RCxNQUFNLFlBQVksR0FBRywrQ0FBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQVE7SUFDbkYsT0FBTyxZQUFZLENBQUMsZUFBZTtJQUNuQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTO0lBQ3RFLE1BQU0sSUFBSSxHQUFHLFlBQUssQ0FBQyxVQUFVLDBDQUFFLEtBQUssS0FBSSxhQUFhO0lBQ3JELE1BQU0sUUFBUSxHQUFHLFlBQUssQ0FBQyxVQUFVLDBDQUFFLEtBQUssS0FBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSztJQUV6RSxPQUFPLDhDQUFHO01BQ04sWUFBSyxDQUFDLFVBQVUsMENBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsRUFBRzs7Ozs7Ozs7OzBCQVN0QyxJQUFJOztRQUV0QixZQUFZO2dDQUNZLFNBQVM7Ozs7Ozs7Ozs7Ozs7aUJBYXhCLFNBQVM7a0NBQ1EsU0FBUztrQ0FDVCxTQUFTO3dDQUNILFFBQVE7Ozs7Ozs7R0FPN0M7QUFDSCxDQUFDOzs7Ozs7Ozs7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QWMsR0FBRyw0REFBYztpRUFabkIsTUFBTTtBQW1pQm5CLFNBQVMsMkJBQTJCLENBQUMsR0FBRyxJQUFJLHFCQUF1QixHQUFHLEdBQUcsRUFBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL2NvbmZsaWN0LWxlZ2VuZC9pY29uLnN2ZyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY29uZmxpY3QtbGVnZW5kL3NyYy9jb25maWcudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL2NvbmZsaWN0LWxlZ2VuZC9zcmMvcnVudGltZS9saWIvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL2NvbmZsaWN0LWxlZ2VuZC9zcmMvcnVudGltZS90cmFuc2xhdGlvbnMvZGVmYXVsdC50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY29uZmxpY3QtbGVnZW5kL3NyYy92ZXJzaW9uLW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJlc3JpL2NvcmUvcmVhY3RpdmVVdGlsc1wiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1hcmNnaXNcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1jb3JlL2Vtb3Rpb25cIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtdWlcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi9qaW11LWNvcmUvbGliL3NldC1wdWJsaWMtcGF0aC50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY29uZmxpY3QtbGVnZW5kL3NyYy9ydW50aW1lL3dpZGdldC50c3giXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBmaWxsPVxcXCJub25lXFxcIiBkYXRhLWF1dG8tZmxpcD1cXFwidHJ1ZVxcXCIgdmlld0JveD1cXFwiMCAwIDIwIDIwXFxcIj48cGF0aCBmaWxsPVxcXCIjMDAwXFxcIiBmaWxsLXJ1bGU9XFxcImV2ZW5vZGRcXFwiIGQ9XFxcIk0zIDUgMS41IDIgMCA1em0xNi4zMTgtMmMuMzc3IDAgLjY4Mi4yMjQuNjgyLjVzLS4zMDUuNS0uNjgyLjVINS42ODJDNS4zMDUgNCA1IDMuNzc2IDUgMy41cy4zMDUtLjUuNjgyLS41ek0yMCA5LjVjMC0uMjc2LS4zMDUtLjUtLjY4Mi0uNUg1LjY4MkM1LjMwNSA5IDUgOS4yMjQgNSA5LjVzLjMwNS41LjY4Mi41aDEzLjYzNmMuMzc3IDAgLjY4Mi0uMjI0LjY4Mi0uNW0wIDZjMC0uMjc2LS4zMDUtLjUtLjY4Mi0uNUg1LjY4MmMtLjM3NyAwLS42ODIuMjI0LS42ODIuNXMuMzA1LjUuNjgyLjVoMTMuNjM2Yy4zNzcgMCAuNjgyLS4yMjQuNjgyLS41bS0xNyAwYTEuNSAxLjUgMCAxIDAtMyAwIDEuNSAxLjUgMCAwIDAgMyAwTTMgOHYzSDBWOHpcXFwiIGNsaXAtcnVsZT1cXFwiZXZlbm9kZFxcXCI+PC9wYXRoPjwvc3ZnPlwiIiwiaW1wb3J0IHR5cGUgeyBJbW11dGFibGVPYmplY3QgfSBmcm9tICdqaW11LWNvcmUnXHJcbmltcG9ydCB0eXBlIHsgQmFja2dyb3VuZFN0eWxlIH0gZnJvbSAnamltdS11aSdcclxuXHJcbmV4cG9ydCBlbnVtIEVMZWdlbmRNb2RlIHtcclxuICBTaG93VmlzaWJsZSA9ICdzaG93LXZpc2libGUnLFxyXG4gIFNob3dXaXRoaW5FeHRlbnQgPSAnc2hvdy13aXRoaW4tZXh0ZW50JyxcclxuICBTaG93QWxsID0gJ3Nob3ctYWxsJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0eWxlIHtcclxuICB1c2VDdXN0b206IGJvb2xlYW5cclxuICBiYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kU3R5bGVcclxuICBmb250Q29sb3I6IHN0cmluZ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XHJcbiAgc2hvd0Jhc2VNYXA/OiBib29sZWFuXHJcbiAgY2FyZFN0eWxlPzogYm9vbGVhblxyXG4gIGNhcmRMYXlvdXQ/OiAnYXV0bycgfCAnc2lkZS1ieS1zaWRlJyB8ICdzdGFjaydcclxuICBsZWdlbmRNb2RlPzogRUxlZ2VuZE1vZGVcclxuICByZXNwZWN0TGF5ZXJEZWZpbml0aW9uRXhwPzogYm9vbGVhblxyXG4gIHN0eWxlOiBTdHlsZVxyXG4gIGN1c3RvbWl6ZUxheWVyT3B0aW9ucz86IHtcclxuICAgIFtqaW11TWFwVmlld0lkOiBzdHJpbmddOiBDdXN0b21pemVMYXllck9wdGlvblxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDdXN0b21pemVMYXllck9wdGlvbiB7XHJcbiAgaXNFbmFibGVkOiBib29sZWFuXHJcbiAgc2hvd1J1bnRpbWVBZGRlZExheWVycz86IGJvb2xlYW5cclxuICBzaG93SmltdUxheWVyVmlld0lkcz86IHN0cmluZ1tdXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIElNQ29uZmlnID0gSW1tdXRhYmxlT2JqZWN0PENvbmZpZz5cclxuIiwiaW1wb3J0IHsgdHlwZSBJTVRoZW1lVmFyaWFibGVzLCBjc3MsIHR5cGUgU2VyaWFsaXplZFN0eWxlcyB9IGZyb20gJ2ppbXUtY29yZSdcclxuaW1wb3J0IHsgc3R5bGVVdGlscyB9IGZyb20gJ2ppbXUtdWknXHJcbmltcG9ydCB0eXBlIHsgU3R5bGUgfSBmcm9tICcuLi8uLi9jb25maWcnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3R5bGUgKHRoZW1lOiBJTVRoZW1lVmFyaWFibGVzLCBzdHlsZTogU3R5bGUpOiBTZXJpYWxpemVkU3R5bGVzIHtcclxuICBjb25zdCBmaWxsU3R5bGVDc3MgPSBzdHlsZVV0aWxzLnRvQ1NTU3R5bGUoeyBiYWNrZ3JvdW5kOiBzdHlsZS5iYWNrZ3JvdW5kIH0pIGFzIGFueVxyXG4gIGRlbGV0ZSBmaWxsU3R5bGVDc3MuYmFja2dyb3VuZENvbG9yXHJcbiAgY29uc3QgZm9udENvbG9yID0gc3R5bGUuZm9udENvbG9yIHx8IHRoZW1lLnN5cy5jb2xvci5zdXJmYWNlLnBhcGVyVGV4dFxyXG4gIGNvbnN0IHJvb3QgPSBzdHlsZS5iYWNrZ3JvdW5kPy5jb2xvciB8fCAndHJhbnNwYXJlbnQnXHJcbiAgY29uc3QgY2FyZFJvb3QgPSBzdHlsZS5iYWNrZ3JvdW5kPy5jb2xvciB8fCB0aGVtZS5zeXMuY29sb3Iuc3VyZmFjZS5wYXBlclxyXG5cclxuICByZXR1cm4gY3NzYFxyXG4gICAgJHtzdHlsZS5iYWNrZ3JvdW5kPy5jb2xvciA/ICdiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsnIDogJycgfVxyXG4gICAgb3ZlcmZsb3c6IGF1dG87XHJcbiAgICAud2lkZ2V0LWxlZ2VuZCB7XHJcbiAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgIG1pbi1oZWlnaHQ6IDMycHg7XHJcbiAgICAgIG1pbi13aWR0aDogMDtcclxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHtyb290fTtcclxuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgICAke2ZpbGxTdHlsZUNzc31cclxuICAgICAgLS1jYWxjaXRlLWNvbG9yLXRleHQtMjogJHtmb250Q29sb3J9O1xyXG5cclxuICAgICAgLmxlZ2VuZC1jb250YWluZXIge1xyXG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xyXG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XHJcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhcmNnaXMtbGVnZW5kIHtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgICAgbWluLWhlaWdodDogMDtcclxuICAgICAgICBjb2xvcjogJHtmb250Q29sb3J9O1xyXG4gICAgICAgIC0tY2FsY2l0ZS1jb2xvci10ZXh0LTE6ICR7Zm9udENvbG9yfTtcclxuICAgICAgICAtLWNhbGNpdGUtY29sb3ItdGV4dC0yOiAke2ZvbnRDb2xvcn07XHJcbiAgICAgICAgLS1jYWxjaXRlLWNvbG9yLWZvcmVncm91bmQtMTogJHtjYXJkUm9vdH07XHJcbiAgICAgICAgLS1jYWxjaXRlLWNhcm91c2VsLXBhZ2luYXRpb24taWNvbi1jb2xvcjogdmFyKC0tc3lzLWNvbG9yLXN1cmZhY2UtcGFwZXItdGV4dCk7XHJcbiAgICAgICAgLS1jYWxjaXRlLWNhcm91c2VsLXBhZ2luYXRpb24taWNvbi1jb2xvci1zZWxlY3RlZDogdmFyKC0tc3lzLWNvbG9yLWFjdGlvbi1zZWxlY3RlZCk7XHJcbiAgICAgICAgLy8gVXNlIHRoZSBwYXBlcidzIGJnIGNvbG9yLCBzZXQgdGhlIGxlZ2VuZCdzIGJnIGNvbG9yIHRvIHRyYW5zcGFyZW50XHJcbiAgICAgICAgLS1jYWxjaXRlLWNvbG9yLWZvcmVncm91bmQtMTogdHJhbnNwYXJlbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBgXHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIF93aWRnZXRMYWJlbDogJ0NvbmZsaWN0IExlZ2VuZCdcclxufVxyXG4iLCJpbXBvcnQge1xyXG4gIEJhc2VWZXJzaW9uTWFuYWdlclxyXG59IGZyb20gJ2ppbXUtY29yZSdcclxuaW1wb3J0IHR5cGUgeyBJTUNvbmZpZyB9IGZyb20gJy4vY29uZmlnJ1xyXG5cclxuY2xhc3MgVmVyc2lvbk1hbmFnZXIgZXh0ZW5kcyBCYXNlVmVyc2lvbk1hbmFnZXIge1xyXG4gIHZlcnNpb25zID0gW1xyXG4gICAge1xyXG4gICAgICB2ZXJzaW9uOiAnMS4xNy4wJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdVcGRhdGUgcmVzcGVjdExheWVyRGVmaW5pdGlvbkV4cCBvcHRpb24nLFxyXG4gICAgICB1cGdyYWRlcjogKG9sZENvbmZpZzogSU1Db25maWcpID0+IHtcclxuICAgICAgICBjb25zdCBuZXdDb25maWcgPSBvbGRDb25maWcuc2V0KCdyZXNwZWN0TGF5ZXJEZWZpbml0aW9uRXhwJywgZmFsc2UpXHJcbiAgICAgICAgcmV0dXJuIG5ld0NvbmZpZ1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdmVyc2lvbk1hbmFnZXI6IEJhc2VWZXJzaW9uTWFuYWdlciA9IG5ldyBWZXJzaW9uTWFuYWdlcigpXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9lc3JpX2NvcmVfcmVhY3RpdmVVdGlsc19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2FyY2dpc19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2NvcmVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfX2Vtb3Rpb25fcmVhY3RfanN4X3J1bnRpbWVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV91aV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7IiwiLyoqXHJcbiAqIFdlYnBhY2sgd2lsbCByZXBsYWNlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHdpdGggX193ZWJwYWNrX3JlcXVpcmVfXy5wIHRvIHNldCB0aGUgcHVibGljIHBhdGggZHluYW1pY2FsbHkuXHJcbiAqIFRoZSByZWFzb24gd2h5IHdlIGNhbid0IHNldCB0aGUgcHVibGljUGF0aCBpbiB3ZWJwYWNrIGNvbmZpZyBpczogd2UgY2hhbmdlIHRoZSBwdWJsaWNQYXRoIHdoZW4gZG93bmxvYWQuXHJcbiAqICovXHJcbl9fd2VicGFja19wdWJsaWNfcGF0aF9fID0gd2luZG93LmppbXVDb25maWcuYmFzZVVybFxyXG4iLCIvKiogQGpzeCBqc3ggKi9cclxuaW1wb3J0IHsgUmVhY3QsIGpzeCwgdHlwZSBBbGxXaWRnZXRQcm9wcywgUmVhY3RSZXNpemVEZXRlY3RvciwgRXhCQWRkZWRKU0FQSVByb3BlcnRpZXMsIFN1cHBvcnRlZEpTQVBJTGF5ZXJUeXBlcywgbG9hZEFyY0dJU01hcENvbXBvbmVudHMgfSBmcm9tICdqaW11LWNvcmUnXHJcbmltcG9ydCB7IEppbXVNYXBWaWV3Q29tcG9uZW50LCB0eXBlIEppbXVNYXBWaWV3LCB0eXBlIEppbXVMYXllclZpZXcgfSBmcm9tICdqaW11LWFyY2dpcydcclxuaW1wb3J0IHsgV2lkZ2V0UGxhY2Vob2xkZXIsIEZpbGxUeXBlLCBQYXBlciB9IGZyb20gJ2ppbXUtdWknXHJcbmltcG9ydCB7IEVMZWdlbmRNb2RlLCB0eXBlIElNQ29uZmlnLCB0eXBlIFN0eWxlIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG5pbXBvcnQgeyBnZXRTdHlsZSB9IGZyb20gJy4vbGliL3N0eWxlJ1xyXG5pbXBvcnQgZGVmYXVsdE1lc3NhZ2VzIGZyb20gJy4vdHJhbnNsYXRpb25zL2RlZmF1bHQnXHJcbmltcG9ydCBsZWdlbmRJY29uIGZyb20gJy4uLy4uL2ljb24uc3ZnJ1xyXG5pbXBvcnQgeyB2ZXJzaW9uTWFuYWdlciB9IGZyb20gJy4uL3ZlcnNpb24tbWFuYWdlcidcclxuaW1wb3J0ICogYXMgcmVhY3RpdmVVdGlscyBmcm9tICdlc3JpL2NvcmUvcmVhY3RpdmVVdGlscydcclxuXHJcbmV4cG9ydCBlbnVtIExvYWRTdGF0dXMge1xyXG4gIFBlbmRpbmcgPSAnUGVuZGluZycsXHJcbiAgRnVsZmlsbGVkID0gJ0Z1bGZpbGxlZCcsXHJcbiAgUmVqZWN0ZWQgPSAnUmVqZWN0ZWQnXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgV2lkZ2V0UHJvcHMgZXh0ZW5kcyBBbGxXaWRnZXRQcm9wczxJTUNvbmZpZz4ge1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdpZGdldFN0YXRlIHtcclxuICBsb2FkU3RhdHVzOiBMb2FkU3RhdHVzXHJcbiAgYWN0aXZlSm12OiBKaW11TWFwVmlld1xyXG59XHJcblxyXG50eXBlIEFyY2dpc0xlZ2VuZEVsZW1lbnQgPSBIVE1MQXJjZ2lzTGVnZW5kRWxlbWVudCAmIHtcclxuICB2aWV3OiBfX2VzcmkuTWFwVmlldyB8IF9fZXNyaS5TY2VuZVZpZXdcclxuICBhY3RpdmVMYXllckluZm9zPzogX19lc3JpLkNvbGxlY3Rpb248X19lc3JpLkFjdGl2ZUxheWVySW5mbz5cclxuICBiYXNlbWFwTGVnZW5kVmlzaWJsZTogYm9vbGVhblxyXG4gIGhpZGVMYXllcnNOb3RJbkN1cnJlbnRWaWV3OiBib29sZWFuXHJcbiAgaWdub3JlTGF5ZXJWaXNpYmlsaXR5OiBib29sZWFuXHJcbiAgcmVzcGVjdExheWVyRGVmaW5pdGlvbkV4cHJlc3Npb246IGJvb2xlYW5cclxuICBsZWdlbmRTdHlsZTogJ2NhcmQnIHwgJ2NsYXNzaWMnXHJcbiAgY2FyZFN0eWxlTGF5b3V0OiAnYXV0bycgfCAnc2lkZS1ieS1zaWRlJyB8ICdzdGFjaycgfCB1bmRlZmluZWRcclxuICBkZXN0cm95OiAoKSA9PiBQcm9taXNlPHZvaWQ+XHJcbn1cclxuXHJcbmNvbnN0IENBUkRfUk9PVF9GSUxMX1NUWUxFX0lEID0gJ2V4Yi1sZWdlbmQtY2FyZC1maWxsLXN0eWxlJ1xyXG5jb25zdCBDQVJEX1ZJRVdfRklMTF9TVFlMRV9JRCA9ICdleGItbGVnZW5kLWNhcmQtdmlldy1maWxsLXN0eWxlJ1xyXG5cclxuY29uc3QgQ0FSRF9ST09UX0ZJTExfQ1NTID0gYFxyXG4gIC5yb290IHtcclxuICAgIG1pbi1oZWlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICB9XHJcblxyXG4gIGFyY2dpcy1sZWdlbmQtY2FyZC12aWV3IHtcclxuICAgIG1pbi1oZWlnaHQ6IDA7XHJcbiAgICBmbGV4OiAxIDEgYXV0bztcclxuICAgIGhlaWdodDogMTAwJTtcclxuICB9XHJcbmBcclxuXHJcbmNvbnN0IENBUkRfVklFV19GSUxMX0NTUyA9IGBcclxuICA6aG9zdCB7XHJcbiAgICBtaW4taGVpZ2h0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIH1cclxuXHJcbiAgY2FsY2l0ZS1jYXJvdXNlbCB7XHJcbiAgICBtaW4taGVpZ2h0OiAwO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIH1cclxuXHJcbiAgY2FsY2l0ZS1jYXJvdXNlbC1pdGVtIHtcclxuICAgIG1pbi1oZWlnaHQ6IDA7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgfVxyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaWRnZXQgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50PFdpZGdldFByb3BzLCBXaWRnZXRTdGF0ZT4ge1xyXG4gIHByaXZhdGUgbGVnZW5kOiBBcmNnaXNMZWdlbmRFbGVtZW50XHJcbiAgcHJpdmF0ZSBjdXJyZW50V2lkdGg6IG51bWJlclxyXG4gIHByaXZhdGUgbG9hZE1hcENvbXBvbmVudHNQcm9taXNlOiBQcm9taXNlPHZvaWQ+XHJcbiAgcHJpdmF0ZSBjdXN0b21pemVBY3RpdmVMYXllckluZm9zSGFuZGxlOiB7IHJlbW92ZTogKCkgPT4gdm9pZCB9XHJcbiAgcHJpdmF0ZSBsZWdlbmRSZWFkeUhhbmRsZXI6ICgpID0+IHZvaWRcclxuICBwcml2YXRlIGxlZ2VuZFNoYWRvd1N3ZWVwVGltZXI6IG51bWJlclxyXG4gIHByaXZhdGUgbGVnZW5kU2hhZG93T2JzZXJ2ZXJzOiBNdXRhdGlvbk9ic2VydmVyW10gPSBbXVxyXG4gIHByaXZhdGUgb2JzZXJ2ZWRTaGFkb3dSb290cyA9IG5ldyBXZWFrU2V0PFNoYWRvd1Jvb3Q+KClcclxuICBsZWdlbmRXcmFwcGVyUmVmID0gUmVhY3QuY3JlYXRlUmVmPEhUTUxEaXZFbGVtZW50PigpXHJcbiAgbGVnZW5kQ29udGFpbmVyUmVmID0gUmVhY3QuY3JlYXRlUmVmPEhUTUxEaXZFbGVtZW50PigpXHJcblxyXG4gIHN0YXRpYyB2ZXJzaW9uTWFuYWdlciA9IHZlcnNpb25NYW5hZ2VyXHJcblxyXG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBsb2FkU3RhdHVzOiBMb2FkU3RhdHVzLlBlbmRpbmcsXHJcbiAgICAgIGFjdGl2ZUptdjogbnVsbFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkVXBkYXRlIChwcmV2UHJvcHM6IFJlYWRvbmx5PFdpZGdldFByb3BzPiwgcHJldlN0YXRlOiBSZWFkb25seTxXaWRnZXRTdGF0ZT4sIHNuYXBzaG90PzogYW55KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVKbXYgJiYgKHByZXZTdGF0ZS5hY3RpdmVKbXY/LmlkICE9PSB0aGlzLnN0YXRlLmFjdGl2ZUptdj8uaWQgfHwgcHJldlByb3BzLmNvbmZpZyAhPT0gdGhpcy5wcm9wcy5jb25maWcpKSB7XHJcbiAgICAgIGNvbnN0IGFjdGl2ZUptdklkID0gdGhpcy5zdGF0ZS5hY3RpdmVKbXYuaWRcclxuICAgICAgY29uc3QgY3VzdG9taXplTGF5ZXJPcHRpb25zQ2hhbmdlZCA9IHByZXZQcm9wcy5jb25maWc/LmN1c3RvbWl6ZUxheWVyT3B0aW9ucz8uW2FjdGl2ZUptdklkXSAhPT0gdGhpcy5wcm9wcy5jb25maWc/LmN1c3RvbWl6ZUxheWVyT3B0aW9ucz8uW2FjdGl2ZUptdklkXVxyXG4gICAgICBjb25zdCBhY3RpdmVKbXZDaGFuZ2VkID0gcHJldlN0YXRlLmFjdGl2ZUptdj8uaWQgIT09IHRoaXMuc3RhdGUuYWN0aXZlSm12Py5pZFxyXG4gICAgICB0aGlzLmNyZWF0ZUxlZ2VuZCh0aGlzLnN0YXRlLmFjdGl2ZUptdi52aWV3LCBhY3RpdmVKbXZDaGFuZ2VkIHx8IGN1c3RvbWl6ZUxheWVyT3B0aW9uc0NoYW5nZWQsIHRoaXMuc3RhdGUuYWN0aXZlSm12KS5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBsb2FkU3RhdHVzOiBMb2FkU3RhdHVzLlJlamVjdGVkXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpOiB2b2lkIHtcclxuICAgIHRoaXMuZGVzdHJveUxlZ2VuZCgpXHJcbiAgfVxyXG5cclxuICBkZXN0cm95TGVnZW5kID0gKCkgPT4ge1xyXG4gICAgdGhpcy5jdXN0b21pemVBY3RpdmVMYXllckluZm9zSGFuZGxlPy5yZW1vdmU/LigpXHJcbiAgICB0aGlzLmN1c3RvbWl6ZUFjdGl2ZUxheWVySW5mb3NIYW5kbGUgPSBudWxsXHJcbiAgICBpZiAodGhpcy5sZWdlbmRTaGFkb3dTd2VlcFRpbWVyKSB7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMubGVnZW5kU2hhZG93U3dlZXBUaW1lcilcclxuICAgICAgdGhpcy5sZWdlbmRTaGFkb3dTd2VlcFRpbWVyID0gbnVsbFxyXG4gICAgfVxyXG4gICAgdGhpcy5sZWdlbmRTaGFkb3dPYnNlcnZlcnMuZm9yRWFjaCgob2JzZXJ2ZXIpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKSlcclxuICAgIHRoaXMubGVnZW5kU2hhZG93T2JzZXJ2ZXJzID0gW11cclxuICAgIGlmICh0aGlzLmxlZ2VuZCAmJiB0aGlzLmxlZ2VuZFJlYWR5SGFuZGxlcikge1xyXG4gICAgICB0aGlzLmxlZ2VuZC5yZW1vdmVFdmVudExpc3RlbmVyKCdhcmNnaXNSZWFkeScsIHRoaXMubGVnZW5kUmVhZHlIYW5kbGVyIGFzIEV2ZW50TGlzdGVuZXIpXHJcbiAgICB9XHJcbiAgICB0aGlzLmxlZ2VuZFJlYWR5SGFuZGxlciA9IG51bGxcclxuICAgIGlmICh0aGlzLmxlZ2VuZCkge1xyXG4gICAgICBjb25zdCBsZWdlbmQgPSB0aGlzLmxlZ2VuZFxyXG4gICAgICB0aGlzLmxlZ2VuZCA9IG51bGxcclxuICAgICAgbGVnZW5kLnJlbW92ZT8uKClcclxuICAgICAgbGVnZW5kLmRlc3Ryb3k/LigpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbnN1cmVNYXBDb21wb25lbnRzTG9hZGVkID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgaWYgKCF0aGlzLmxvYWRNYXBDb21wb25lbnRzUHJvbWlzZSkge1xyXG4gICAgICB0aGlzLmxvYWRNYXBDb21wb25lbnRzUHJvbWlzZSA9IGxvYWRBcmNHSVNNYXBDb21wb25lbnRzKClcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9hZE1hcENvbXBvbmVudHNQcm9taXNlXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICB0aGlzLmxvYWRNYXBDb21wb25lbnRzUHJvbWlzZSA9IG51bGxcclxuICAgICAgdGhyb3cgZXJyb3JcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNhY2hlTGVnZW5kV3JhcHBlclNpemUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB3cmFwcGVyID0gdGhpcy5sZWdlbmRXcmFwcGVyUmVmLmN1cnJlbnRcclxuICAgIGlmICghd3JhcHBlcikge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGlmICh3cmFwcGVyLmNsaWVudFdpZHRoID4gMCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRXaWR0aCA9IHdyYXBwZXIuY2xpZW50V2lkdGhcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN5bmNMZWdlbmRTaXplID0gKCkgPT4ge1xyXG4gICAgaWYgKCF0aGlzLmxlZ2VuZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IHN0eWxlID0gKHRoaXMubGVnZW5kIGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnQpLnN0eWxlXHJcbiAgICBpZiAoIXN0eWxlKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIHN0eWxlLndpZHRoID0gJzEwMCUnXHJcbiAgICBzdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xyXG4gICAgc3R5bGUuaGVpZ2h0ID0gJzEwMCUnXHJcbiAgfVxyXG5cclxuICBlbnN1cmVDYXJkVmlld0Z1bGxIZWlnaHQgPSAoKSA9PiB7XHJcbiAgICBpZiAoIXRoaXMubGVnZW5kIHx8ICF0aGlzLnByb3BzLmNvbmZpZy5jYXJkU3R5bGUpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGVnZW5kRWxlbWVudCA9IHRoaXMubGVnZW5kIGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnRcclxuICAgIGNvbnN0IGxlZ2VuZFNoYWRvd1Jvb3QgPSBsZWdlbmRFbGVtZW50LnNoYWRvd1Jvb3RcclxuICAgIGlmICghbGVnZW5kU2hhZG93Um9vdCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWxlZ2VuZFNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoQ0FSRF9ST09UX0ZJTExfU1RZTEVfSUQpKSB7XHJcbiAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxyXG4gICAgICBzdHlsZS5pZCA9IENBUkRfUk9PVF9GSUxMX1NUWUxFX0lEXHJcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gQ0FSRF9ST09UX0ZJTExfQ1NTXHJcbiAgICAgIGxlZ2VuZFNoYWRvd1Jvb3QuYXBwZW5kQ2hpbGQoc3R5bGUpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FyZFZpZXcgPSBsZWdlbmRTaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdhcmNnaXMtbGVnZW5kLWNhcmQtdmlldycpXHJcbiAgICBjb25zdCBjYXJkU2hhZG93Um9vdCA9IGNhcmRWaWV3Py5zaGFkb3dSb290XHJcbiAgICBpZiAoIWNhcmRTaGFkb3dSb290KSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmICghY2FyZFNoYWRvd1Jvb3QuZ2V0RWxlbWVudEJ5SWQoQ0FSRF9WSUVXX0ZJTExfU1RZTEVfSUQpKSB7XHJcbiAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKVxyXG4gICAgICBzdHlsZS5pZCA9IENBUkRfVklFV19GSUxMX1NUWUxFX0lEXHJcbiAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gQ0FSRF9WSUVXX0ZJTExfQ1NTXHJcbiAgICAgIGNhcmRTaGFkb3dSb290LmFwcGVuZENoaWxkKHN0eWxlKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYmluZExlZ2VuZFJlYWR5RXZlbnQgPSAoamltdU1hcFZpZXc6IEppbXVNYXBWaWV3ID0gdGhpcy5zdGF0ZS5hY3RpdmVKbXYpID0+IHtcclxuICAgIGlmICghdGhpcy5sZWdlbmQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5sZWdlbmRSZWFkeUhhbmRsZXIpIHtcclxuICAgICAgdGhpcy5sZWdlbmQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYXJjZ2lzUmVhZHknLCB0aGlzLmxlZ2VuZFJlYWR5SGFuZGxlciBhcyBFdmVudExpc3RlbmVyKVxyXG4gICAgfVxyXG4gICAgdGhpcy5sZWdlbmRSZWFkeUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMuc3luY0xlZ2VuZFNpemUoKVxyXG4gICAgICB0aGlzLmVuc3VyZUNhcmRWaWV3RnVsbEhlaWdodCgpXHJcbiAgICAgIHRoaXMuY3VzdG9taXplTGVnZW5kcyhqaW11TWFwVmlldylcclxuICAgICAgdGhpcy53YXRjaExlZ2VuZFNoYWRvdygpXHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmxlZ2VuZCkgcmV0dXJuXHJcbiAgICAgICAgICB0aGlzLnN5bmNMZWdlbmRTaXplKClcclxuICAgICAgICAgIHRoaXMuZW5zdXJlQ2FyZFZpZXdGdWxsSGVpZ2h0KClcclxuICAgICAgICAgIHRoaXMuc3RyaXBSZWxhdGlvbnNoaXBDYXB0aW9uKClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLmxlZ2VuZC5hZGRFdmVudExpc3RlbmVyKCdhcmNnaXNSZWFkeScsIHRoaXMubGVnZW5kUmVhZHlIYW5kbGVyIGFzIEV2ZW50TGlzdGVuZXIpXHJcbiAgfVxyXG5cclxuICBjb2xsZWN0Q2FwdGlvbnMgPSAocm9vdDogUGFyZW50Tm9kZSwgb3V0OiBIVE1MRWxlbWVudFtdID0gW10pOiBIVE1MRWxlbWVudFtdID0+IHtcclxuICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy5lc3JpLWxlZ2VuZF9fbGF5ZXItY2FwdGlvbiwgLmxheWVyLWNhcHRpb24nKS5mb3JFYWNoKChjYXB0aW9uKSA9PiB7XHJcbiAgICAgIG91dC5wdXNoKGNhcHRpb24pXHJcbiAgICB9KVxyXG4gICAgLy8gTGVnZW5kIERPTSBtYXkgbGl2ZSBpbiBuZXN0ZWQgc2hhZG93IHJvb3RzIOKAlCBxdWVyeVNlbGVjdG9yQWxsIGNhbid0IHNlZSBpbnRvIHRoZW0uXHJcbiAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcqJykuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgaWYgKGVsLnNoYWRvd1Jvb3QpIHtcclxuICAgICAgICB0aGlzLmNvbGxlY3RDYXB0aW9ucyhlbC5zaGFkb3dSb290LCBvdXQpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gb3V0XHJcbiAgfVxyXG5cclxuICBvYnNlcnZlU2hhZG93VHJlZSA9IChyb290OiBQYXJlbnROb2RlKSA9PiB7XHJcbiAgICAvLyBXYWxrIHRoZSByb290IGVsZW1lbnQgaXRzZWxmIHRvbyDigJQgcXVlcnlTZWxlY3RvckFsbCBleGNsdWRlcyBpdCwgYW5kIHRoZSBsZWdlbmQnc1xyXG4gICAgLy8gb3duIHNoYWRvdyByb290IHdvdWxkIG90aGVyd2lzZSBzdGF5IHVub2JzZXJ2ZWQgdW50aWwgdGhlIGZpcnN0IDUwMG1zIHN3ZWVwLlxyXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IHJvb3QgaW5zdGFuY2VvZiBFbGVtZW50ID8gW3Jvb3QsIC4uLnJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJyonKV0gOiByb290LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcqJylcclxuICAgIGNhbmRpZGF0ZXMuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgY29uc3Qgc2hhZG93ID0gZWwuc2hhZG93Um9vdFxyXG4gICAgICBpZiAoc2hhZG93ICYmICF0aGlzLm9ic2VydmVkU2hhZG93Um9vdHMuaGFzKHNoYWRvdykpIHtcclxuICAgICAgICB0aGlzLm9ic2VydmVkU2hhZG93Um9vdHMuYWRkKHNoYWRvdylcclxuICAgICAgICAvLyBQYWludC1sZXZlbCBtdXRlOiBjYXB0aW9ucyBhcmUgdmlzaWJpbGl0eTpoaWRkZW4gYnkgc3R5bGVzaGVldCB0aGUgbW9tZW50IHRoaXMgcm9vdFxyXG4gICAgICAgIC8vIGV4aXN0cywgc28gdGhlIHRleHQgY2FuIG5ldmVyIGFwcGVhciBldmVuIGlmIGEgcmUtcmVuZGVyIHJhY2VzIHRoZSBKUyBoaWRlLiBUaGVcclxuICAgICAgICAvLyBzdHJpcCBwYXNzIGJlbG93IHVuLWhpZGVzIGFueSBjYXB0aW9uIHRoYXQgaXNuJ3QgdGhlIG9uZSB3ZSdyZSByZW1vdmluZy5cclxuICAgICAgICBjb25zdCBtdXRlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXHJcbiAgICAgICAgbXV0ZVN0eWxlLnRleHRDb250ZW50ID0gJy5sYXllci1jYXB0aW9uIHsgdmlzaWJpbGl0eTogaGlkZGVuIH0nXHJcbiAgICAgICAgc2hhZG93LmFwcGVuZENoaWxkKG11dGVTdHlsZSlcclxuICAgICAgICAvLyBMaXQgcmUtY3JlYXRlcyBjYXB0aW9uIG5vZGVzIG9uIHJlLXJlbmRlciDigJQgcmUtaGlkZSBzeW5jaHJvbm91c2x5IGluIHRoZSBvYnNlcnZlclxyXG4gICAgICAgIC8vIG1pY3JvdGFzayAockFGIHdvdWxkIGJlIG9uZSBmcmFtZSBsYXRlIGFuZCBsZXQgbGl0J3Mgb3duIHJBRiByZS1yZW5kZXJzIHBhaW50IHRoZSBjYXB0aW9uKS5cclxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMub2JzZXJ2ZVNoYWRvd1RyZWUoc2hhZG93KVxyXG4gICAgICAgICAgdGhpcy5zdHJpcFJlbGF0aW9uc2hpcENhcHRpb24oKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShzaGFkb3csIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLCBhdHRyaWJ1dGVzOiB0cnVlLCBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pXHJcbiAgICAgICAgdGhpcy5sZWdlbmRTaGFkb3dPYnNlcnZlcnMucHVzaChvYnNlcnZlcilcclxuICAgICAgICB0aGlzLm9ic2VydmVTaGFkb3dUcmVlKHNoYWRvdylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGNvbGxlY3RSZWxhdGlvbnNoaXBUZXh0Tm9kZXMgPSAocm9vdDogUGFyZW50Tm9kZSwgb3V0OiBIVE1MRWxlbWVudFtdID0gW10pOiBIVE1MRWxlbWVudFtdID0+IHtcclxuICAgIHJvb3QucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJyonKS5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICBpZiAoIWVsLmNoaWxkcmVuLmxlbmd0aCAmJiBlbC50ZXh0Q29udGVudD8udHJpbSgpID09PSAnUmVsYXRpb25zaGlwJykge1xyXG4gICAgICAgIG91dC5wdXNoKGVsKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChlbC5zaGFkb3dSb290KSB7XHJcbiAgICAgICAgdGhpcy5jb2xsZWN0UmVsYXRpb25zaGlwVGV4dE5vZGVzKGVsLnNoYWRvd1Jvb3QsIG91dClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBvdXRcclxuICB9XHJcblxyXG4gIHN0cmlwUmVsYXRpb25zaGlwQ2FwdGlvbiA9ICgpOiBib29sZWFuID0+IHtcclxuICAgIGNvbnN0IGxlZ2VuZEVsZW1lbnQgPSB0aGlzLmxlZ2VuZCBhcyB1bmtub3duIGFzIEhUTUxFbGVtZW50XHJcbiAgICBpZiAoIWxlZ2VuZEVsZW1lbnQ/LnNoYWRvd1Jvb3QpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBjb25zdCBhbGxDYXB0aW9ucyA9IHRoaXMuY29sbGVjdENhcHRpb25zKGxlZ2VuZEVsZW1lbnQuc2hhZG93Um9vdClcclxuICAgIC8vIFRoZSBtdXRlIHN0eWxlc2hlZXQgaGlkZXMgYWxsIGNhcHRpb25zIGF0IHBhaW50OyByZS1zaG93IGFueSBjYXB0aW9uIHdlIGtlZXAsXHJcbiAgICAvLyBhbmQga2VlcCB0aGUgc3RyaXBwZWQgb25lcyBtdXRlZCAoYmVsdCkgKyByZW1vdmVkIGZyb20gbGF5b3V0IChzdXNwZW5kZXJzKS5cclxuICAgIGFsbENhcHRpb25zLmZvckVhY2goKGNhcHRpb24pID0+IHtcclxuICAgICAgY2FwdGlvbi5zdHlsZS52aXNpYmlsaXR5ID0gY2FwdGlvbi50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ1JlbGF0aW9uc2hpcCcpID8gJ2hpZGRlbicgOiAndmlzaWJsZSdcclxuICAgIH0pXHJcbiAgICBjb25zdCBjYXB0aW9ucyA9IGFsbENhcHRpb25zLmZpbHRlcigoY2FwdGlvbikgPT4gY2FwdGlvbi50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ1JlbGF0aW9uc2hpcCcpKVxyXG4gICAgY29uc3QgdGV4dE5vZGVzID0gdGhpcy5jb2xsZWN0UmVsYXRpb25zaGlwVGV4dE5vZGVzKGxlZ2VuZEVsZW1lbnQuc2hhZG93Um9vdClcclxuICAgIGNvbnN0IGhpdHMgPSBjYXB0aW9ucy5jb25jYXQodGV4dE5vZGVzKVxyXG4gICAgaGl0cy5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGhpdHMubGVuZ3RoID4gMFxyXG4gIH1cclxuXHJcbiAgd2F0Y2hMZWdlbmRTaGFkb3cgPSAoKSA9PiB7XHJcbiAgICB0aGlzLnN0cmlwUmVsYXRpb25zaGlwQ2FwdGlvbigpXHJcbiAgICBpZiAodGhpcy5sZWdlbmRTaGFkb3dTd2VlcFRpbWVyKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3QgbGVnZW5kRWxlbWVudCA9IHRoaXMubGVnZW5kIGFzIHVua25vd24gYXMgSFRNTEVsZW1lbnRcclxuICAgIGNvbnN0IGxlZ2VuZFNoYWRvd1Jvb3QgPSBsZWdlbmRFbGVtZW50Py5zaGFkb3dSb290XHJcbiAgICBpZiAoIWxlZ2VuZFNoYWRvd1Jvb3QpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICAvLyBTd2VlcCBldmVyeSA1MDBtcyB3aGlsZSB0aGUgd2lkZ2V0IGxpdmVzIOKAlCBjYXB0aW9ucyBjYW4gcmVuZGVyIGxhdGUgYW5kIGluIG5lc3RlZCBzaGFkb3cgcm9vdHMuXHJcbiAgICB0aGlzLmxlZ2VuZFNoYWRvd1N3ZWVwVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB0aGlzLm9ic2VydmVTaGFkb3dUcmVlKGxlZ2VuZFNoYWRvd1Jvb3QpXHJcbiAgICAgIHRoaXMuc3RyaXBSZWxhdGlvbnNoaXBDYXB0aW9uKClcclxuICAgIH0sIDUwMClcclxuICB9XHJcblxyXG4gIGNyZWF0ZUxlZ2VuZCA9IGFzeW5jICh2aWV3OiBfX2VzcmkuTWFwVmlldyB8IF9fZXNyaS5TY2VuZVZpZXcsIGZvcmNlUmVjcmVhdGUgPSBmYWxzZSwgamltdU1hcFZpZXc6IEppbXVNYXBWaWV3ID0gdGhpcy5zdGF0ZS5hY3RpdmVKbXYpID0+IHtcclxuICAgIGF3YWl0IHRoaXMuZW5zdXJlTWFwQ29tcG9uZW50c0xvYWRlZCgpXHJcbiAgICBhd2FpdCB2aWV3LndoZW4oKVxyXG5cclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMubGVnZW5kQ29udGFpbmVyUmVmLmN1cnJlbnRcclxuICAgIGlmICghY29udGFpbmVyKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHZpZXdDaGFuZ2VkID0gdGhpcy5sZWdlbmQgJiYgdGhpcy5sZWdlbmQudmlldyAhPT0gdmlld1xyXG4gICAgaWYgKCF0aGlzLmxlZ2VuZCB8fCB0aGlzLmxlZ2VuZC5wYXJlbnROb2RlICE9PSBjb250YWluZXIgfHwgdmlld0NoYW5nZWQgfHwgZm9yY2VSZWNyZWF0ZSkge1xyXG4gICAgICB0aGlzLmRlc3Ryb3lMZWdlbmQoKVxyXG4gICAgICB0aGlzLmxlZ2VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2FyY2dpcy1sZWdlbmQnKSBhcyBBcmNnaXNMZWdlbmRFbGVtZW50XHJcbiAgICAgIGNvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4odGhpcy5sZWdlbmQpXHJcbiAgICAgIC8vIEF0dGFjaCBvYnNlcnZlcnMgYXQgaW5zZXJ0aW9uIHRpbWUgKG5vdCBhcmNnaXNSZWFkeSkgc28gdGhlIGNhcHRpb24ncyB2ZXJ5IGZpcnN0XHJcbiAgICAgIC8vIHBhaW50IGlzIGFscmVhZHkgY292ZXJlZCDigJQgb2JzZXJ2ZXJzIHByb3BhZ2F0ZSBpbnRvIG5lc3RlZCBzaGFkb3cgcm9vdHMgYXMgdGhleSBhcHBlYXIuXHJcbiAgICAgIHRoaXMub2JzZXJ2ZVNoYWRvd1RyZWUodGhpcy5sZWdlbmQgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudClcclxuICAgICAgdGhpcy5zdHJpcFJlbGF0aW9uc2hpcENhcHRpb24oKVxyXG4gICAgICAvLyBCdXJzdCBzd2VlcHMgZm9yIHRoZSBmaXJzdCBzZWNvbmQ6IGNhdGNoIGFueSBzaGFkb3cgcm9vdCB0aGF0IGFwcGVhcnMgYmVmb3JlIHRoZVxyXG4gICAgICAvLyBzdGVhZHkgNTAwbXMgc3dlZXAga2lja3MgaW4gKGUuZy4gbGF5ZXJzIGZpbmlzaGluZyB3aGlsZSB0aGUgbGF1bmNoIHNjcmVlbiBpcyB1cCkuXHJcbiAgICAgIDtbNTAsIDE1MCwgMzAwLCA2MDAsIDEwMDBdLmZvckVhY2goKG1zKSA9PiB7XHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMubGVnZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZVNoYWRvd1RyZWUodGhpcy5sZWdlbmQgYXMgdW5rbm93biBhcyBIVE1MRWxlbWVudClcclxuICAgICAgICAgICAgdGhpcy5zdHJpcFJlbGF0aW9uc2hpcENhcHRpb24oKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG1zKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2FjaGVMZWdlbmRXcmFwcGVyU2l6ZSgpXHJcbiAgICB0aGlzLnN5bmNMZWdlbmRTaXplKClcclxuICAgIHRoaXMuYmluZExlZ2VuZFJlYWR5RXZlbnQoamltdU1hcFZpZXcpXHJcblxyXG4gICAgdGhpcy5jb25maWdMZWdlbmQoKVxyXG4gICAgaWYgKHRoaXMubGVnZW5kLnZpZXcgIT09IHZpZXcpIHtcclxuICAgICAgdGhpcy5sZWdlbmQudmlldyA9IHZpZXdcclxuICAgIH1cclxuICAgIHRoaXMuY3VzdG9taXplTGVnZW5kcyhqaW11TWFwVmlldylcclxuICAgIHRoaXMuZW5zdXJlQ2FyZFZpZXdGdWxsSGVpZ2h0KClcclxuICB9XHJcblxyXG4gIGZpbHRlckFjdGl2ZUxheWVySW5mb3MgPSAoamltdU1hcFZpZXc6IEppbXVNYXBWaWV3ID0gdGhpcy5zdGF0ZS5hY3RpdmVKbXYpID0+IHtcclxuICAgIGNvbnN0IGFjdGl2ZUxheWVySW5mb3MgPSB0aGlzLmxlZ2VuZD8uYWN0aXZlTGF5ZXJJbmZvc1xyXG4gICAgaWYgKCF0aGlzLmxlZ2VuZCB8fCAhamltdU1hcFZpZXcgfHwgIWFjdGl2ZUxheWVySW5mb3MpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXN0b21pemVPcHRpb25zID0gdGhpcy5wcm9wcy5jb25maWcuY3VzdG9taXplTGF5ZXJPcHRpb25zPy5bamltdU1hcFZpZXc/LmlkXVxyXG4gICAgaWYgKCFjdXN0b21pemVPcHRpb25zPy5pc0VuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2hvd1J1bnRpbWVBZGRlZExheWVyID0gY3VzdG9taXplT3B0aW9ucy5zaG93UnVudGltZUFkZGVkTGF5ZXJzXHJcbiAgICBjb25zdCBzaG93U2V0ID0gbmV3IFNldChjdXN0b21pemVPcHRpb25zLnNob3dKaW11TGF5ZXJWaWV3SWRzIHx8IFtdKVxyXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIFsuLi5hY3RpdmVMYXllckluZm9zXSkge1xyXG4gICAgICBjb25zdCBsYXllciA9IGl0ZW0ubGF5ZXJcclxuICAgICAgY29uc3QgaXNSdW50aW1lQWRkZWQgPSBsYXllcltFeEJBZGRlZEpTQVBJUHJvcGVydGllcy5FWEJfTEFZRVJfRlJPTV9SVU5USU1FXVxyXG4gICAgICBpZiAoaXNSdW50aW1lQWRkZWQpIHtcclxuICAgICAgICAhc2hvd1J1bnRpbWVBZGRlZExheWVyICYmIGFjdGl2ZUxheWVySW5mb3MucmVtb3ZlKGl0ZW0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgamx2SWQgPSBqaW11TWFwVmlldy5nZXRKaW11TGF5ZXJWaWV3SWRCeUFQSUxheWVyKGxheWVyKVxyXG4gICAgICAgIGNvbnN0IGNoaWxkSW5mb3MgPSB0aGlzLmdldEFsbENoaWxkQWN0aXZlSW5mb3MoaXRlbSlcclxuICAgICAgICBpZiAoIXNob3dTZXQuaGFzKGpsdklkKSkge1xyXG4gICAgICAgICAgYWN0aXZlTGF5ZXJJbmZvcy5yZW1vdmUoaXRlbSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZEluZm8gb2YgY2hpbGRJbmZvcykge1xyXG4gICAgICAgICAgY29uc3QgY2hpbGRKbHZJZCA9IGppbXVNYXBWaWV3LmdldEppbXVMYXllclZpZXdJZEJ5QVBJTGF5ZXIoY2hpbGRJbmZvLmxheWVyKVxyXG4gICAgICAgICAgaWYgKCFzaG93U2V0LmhhcyhjaGlsZEpsdklkKSkge1xyXG4gICAgICAgICAgICBjaGlsZEluZm8ucGFyZW50Py5jaGlsZHJlbj8ucmVtb3ZlKGNoaWxkSW5mbylcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGN1c3RvbWl6ZUxlZ2VuZHMgPSAoamltdU1hcFZpZXc6IEppbXVNYXBWaWV3ID0gdGhpcy5zdGF0ZS5hY3RpdmVKbXYpID0+IHtcclxuICAgIHRoaXMuY3VzdG9taXplQWN0aXZlTGF5ZXJJbmZvc0hhbmRsZT8ucmVtb3ZlPy4oKVxyXG4gICAgdGhpcy5jdXN0b21pemVBY3RpdmVMYXllckluZm9zSGFuZGxlID0gbnVsbFxyXG4gICAgaWYgKCFqaW11TWFwVmlldyB8fCAhdGhpcy5wcm9wcy5jb25maWcuY3VzdG9taXplTGF5ZXJPcHRpb25zPy5bamltdU1hcFZpZXc/LmlkXT8uaXNFbmFibGVkIHx8ICF0aGlzLmxlZ2VuZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsZWdlbmQgPSB0aGlzLmxlZ2VuZFxyXG4gICAgdGhpcy5jdXN0b21pemVBY3RpdmVMYXllckluZm9zSGFuZGxlID0gcmVhY3RpdmVVdGlscy5vbigoKSA9PiBsZWdlbmQuYWN0aXZlTGF5ZXJJbmZvcywgJ2NoYW5nZScsICgpID0+IHtcclxuICAgICAgaWYgKGxlZ2VuZCA9PT0gdGhpcy5sZWdlbmQpIHtcclxuICAgICAgICB0aGlzLmZpbHRlckFjdGl2ZUxheWVySW5mb3MoamltdU1hcFZpZXcpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICB0aGlzLmZpbHRlckFjdGl2ZUxheWVySW5mb3MoamltdU1hcFZpZXcpXHJcbiAgfVxyXG5cclxuICBnZXRBbGxDaGlsZEFjdGl2ZUluZm9zID0gKGFjdGl2ZUluZm86IF9fZXNyaS5BY3RpdmVMYXllckluZm8sIHJlc3VsdDogX19lc3JpLkFjdGl2ZUxheWVySW5mb1tdID0gW10pID0+IHtcclxuICAgIGlmIChhY3RpdmVJbmZvLmNoaWxkcmVuKSB7XHJcbiAgICAgIGZvciAoY29uc3QgY2hpbGRJbmZvIG9mIGFjdGl2ZUluZm8uY2hpbGRyZW4pIHtcclxuICAgICAgICByZXN1bHQucHVzaChjaGlsZEluZm8pXHJcbiAgICAgICAgdGhpcy5nZXRBbGxDaGlsZEFjdGl2ZUluZm9zKGNoaWxkSW5mbywgcmVzdWx0KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbiAgfVxyXG5cclxuICBpc1J1bnRpbWVMYXllciA9IChsYXllcjogX19lc3JpLkxheWVyIHwgX19lc3JpLlN1YmxheWVyKTogYm9vbGVhbiA9PiB7XHJcbiAgICBjb25zdCBpc1J1bnRpbWVBZGRlZCA9IHRoaXMucHJvcHMuY29uZmlnLmN1c3RvbWl6ZUxheWVyT3B0aW9ucz8uW3RoaXMuc3RhdGUuYWN0aXZlSm12Py5pZF0/LnNob3dSdW50aW1lQWRkZWRMYXllcnMgJiYgbGF5ZXJbRXhCQWRkZWRKU0FQSVByb3BlcnRpZXMuRVhCX0xBWUVSX0ZST01fUlVOVElNRV1cclxuICAgIHJldHVybiBpc1J1bnRpbWVBZGRlZFxyXG4gIH1cclxuXHJcbiAgaXNTcGVjaWFsTGF5ZXIgPSAobGF5ZXI6IF9fZXNyaS5MYXllciB8IF9fZXNyaS5TdWJsYXllcik6IGJvb2xlYW4gPT4ge1xyXG4gICAgbGV0IHBhcmVudExheWVyID0gbGF5ZXIucGFyZW50XHJcbiAgICBjb25zdCBsYXllclR5cGVzOiBzdHJpbmdbXSA9IFtcclxuICAgICAgJ2VzcmkubGF5ZXJzLldNVFNMYXllcicsXHJcbiAgICBdXHJcblxyXG4gICAgd2hpbGUgKHBhcmVudExheWVyKSB7XHJcbiAgICAgIGlmIChsYXllclR5cGVzLmluY2x1ZGVzKHBhcmVudExheWVyLmRlY2xhcmVkQ2xhc3MpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgICBwYXJlbnRMYXllciA9IChwYXJlbnRMYXllciBhcyBhbnkpLnBhcmVudFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgaXNQYXJlbnRWaXNpYmxlIChsYXllcjogX19lc3JpLkxheWVyIHwgX19lc3JpLlN1YmxheWVyLCBzaG93U2V0OiBTZXQ8c3RyaW5nPikge1xyXG4gICAgY29uc3QgYWxsUGFyZW50TGF5ZXJzID0gZ2V0UGFyZW50cyhsYXllcilcclxuICAgIC8vIE5vIHBhcmVudFxyXG4gICAgaWYgKGFsbFBhcmVudExheWVycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgcGFyZW50TGF5ZXIgb2YgYWxsUGFyZW50TGF5ZXJzKSB7XHJcbiAgICAgIGNvbnN0IHBhcmVudEpsdklkID0gdGhpcy5zdGF0ZS5hY3RpdmVKbXYuZ2V0SmltdUxheWVyVmlld0lkQnlBUElMYXllcihwYXJlbnRMYXllcilcclxuICAgICAgaWYgKCFzaG93U2V0LmhhcyhwYXJlbnRKbHZJZCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRQYXJlbnRzIChsYXllcjogX19lc3JpLkxheWVyIHwgX19lc3JpLlN1YmxheWVyKSB7XHJcbiAgICAgIGNvbnN0IHJldCA9IFtdXHJcbiAgICAgIGxldCBjdXJyTGF5ZXI6IGFueSA9IGxheWVyXHJcbiAgICAgIC8vIFNraXAgZ3JvdW5kXHJcbiAgICAgIHdoaWxlIChjdXJyTGF5ZXIucGFyZW50ICYmIGN1cnJMYXllci5wYXJlbnQucGFyZW50KSB7XHJcbiAgICAgICAgcmV0LnB1c2goY3VyckxheWVyLnBhcmVudClcclxuICAgICAgICBjdXJyTGF5ZXIgPSBjdXJyTGF5ZXIucGFyZW50XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJldFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTGF5ZXJXaXRoU3VibGF5ZXIgKGppbXVMYXllclZpZXc6IEppbXVMYXllclZpZXcsIHNob3dTZXQ6IFNldDxzdHJpbmc+LCBzdWJsYXllcnNNYXA6IE1hcDxfX2VzcmkuTGF5ZXIsIHN0cmluZ1tdPikge1xyXG4gICAgY29uc3Qgc3VwcG9ydGVkVHlwZXM6IHN0cmluZ1tdID0gW1N1cHBvcnRlZEpTQVBJTGF5ZXJUeXBlcy5NYXBJbWFnZUxheWVyLCBTdXBwb3J0ZWRKU0FQSUxheWVyVHlwZXMuU3VidHlwZUdyb3VwTGF5ZXIsIFN1cHBvcnRlZEpTQVBJTGF5ZXJUeXBlcy5XTVNMYXllcl1cclxuICAgIGNvbnN0IHBhcmVudEpsdiA9IGppbXVMYXllclZpZXcuZ2V0UGFyZW50SmltdUxheWVyVmlldygpXHJcbiAgICBpZiAoIXN1cHBvcnRlZFR5cGVzLmluY2x1ZGVzKHBhcmVudEpsdi50eXBlKSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIC8vIE9ubHkgY29uc3RydWN0IGxheWVySW5mbyB3aGVuIGFsbCB0aGUgcGFyZW50cyBhcmUgc2VsZWN0ZWRcclxuICAgIGlmICghdGhpcy5pc1BhcmVudFZpc2libGUoamltdUxheWVyVmlldy5sYXllciwgc2hvd1NldCkpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3VibGF5ZXJJZCA9IGppbXVMYXllclZpZXcudHlwZSA9PT0gU3VwcG9ydGVkSlNBUElMYXllclR5cGVzLlN1YnR5cGVTdWJsYXllciA/IChqaW11TGF5ZXJWaWV3LmxheWVyIGFzIF9fZXNyaS5TdWJ0eXBlU3VibGF5ZXIpLnN1YnR5cGVDb2RlIDogamltdUxheWVyVmlldy5sYXllci5pZFxyXG5cclxuICAgIGlmIChzdWJsYXllcnNNYXAuaGFzKHBhcmVudEpsdi5sYXllcikpIHtcclxuICAgICAgc3VibGF5ZXJzTWFwLmdldChwYXJlbnRKbHYubGF5ZXIpLnB1c2goc3VibGF5ZXJJZClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN1YmxheWVyc01hcC5zZXQocGFyZW50Smx2LmxheWVyLCBbc3VibGF5ZXJJZF0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25maWdMZWdlbmQgPSAoKSA9PiB7XHJcbiAgICBpZiAodGhpcy5sZWdlbmQpIHtcclxuICAgICAgY29uc3QgYmFzZW1hcExlZ2VuZFZpc2libGUgPSB0aGlzLnByb3BzLmNvbmZpZy5zaG93QmFzZU1hcFxyXG4gICAgICB0aGlzLmxlZ2VuZC5iYXNlbWFwTGVnZW5kVmlzaWJsZSA9IGJhc2VtYXBMZWdlbmRWaXNpYmxlXHJcbiAgICAgIHRoaXMubGVnZW5kLnJlc3BlY3RMYXllckRlZmluaXRpb25FeHByZXNzaW9uID0gISF0aGlzLnByb3BzLmNvbmZpZy5yZXNwZWN0TGF5ZXJEZWZpbml0aW9uRXhwXHJcbiAgICAgIHRoaXMuYXBwbHlMZWdlbmRTdHlsZSh0aGlzLmNhbGN1bGF0ZVN0eWxlKCkpXHJcbiAgICAgIGNvbnN0IGxlZ2VuZE1vZGUgPSB0aGlzLnByb3BzLmNvbmZpZy5sZWdlbmRNb2RlXHJcblxyXG4gICAgICB0aGlzLmxlZ2VuZC5pZ25vcmVMYXllclZpc2liaWxpdHkgPSBsZWdlbmRNb2RlID09PSBFTGVnZW5kTW9kZS5TaG93QWxsXHJcbiAgICAgIHRoaXMubGVnZW5kLmhpZGVMYXllcnNOb3RJbkN1cnJlbnRWaWV3ID0gbGVnZW5kTW9kZSA9PT0gRUxlZ2VuZE1vZGUuU2hvd1dpdGhpbkV4dGVudFxyXG4gICAgICB0aGlzLmVuc3VyZUNhcmRWaWV3RnVsbEhlaWdodCgpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhcHBseUxlZ2VuZFN0eWxlID0gKHN0eWxlOiAnY2xhc3NpYycgfCB7IHR5cGU6ICdjYXJkJywgbGF5b3V0OiAnc2lkZS1ieS1zaWRlJyB8ICdzdGFjaycgfSkgPT4ge1xyXG4gICAgaWYgKCF0aGlzLmxlZ2VuZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGlmIChzdHlsZSA9PT0gJ2NsYXNzaWMnKSB7XHJcbiAgICAgIHRoaXMubGVnZW5kLmxlZ2VuZFN0eWxlID0gJ2NsYXNzaWMnXHJcbiAgICAgIHRoaXMubGVnZW5kLmNhcmRTdHlsZUxheW91dCA9IHVuZGVmaW5lZFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sZWdlbmQubGVnZW5kU3R5bGUgPSBzdHlsZS50eXBlXHJcbiAgICAgIHRoaXMubGVnZW5kLmNhcmRTdHlsZUxheW91dCA9IHN0eWxlLmxheW91dFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2FsY3VsYXRlU3R5bGUgPSAoKTogJ2NsYXNzaWMnIHwgeyB0eXBlOiAnY2FyZCcsIGxheW91dDogJ3NpZGUtYnktc2lkZScgfCAnc3RhY2snIH0gPT4ge1xyXG4gICAgY29uc3QgY3VycmVudFdpZHRoID0gdGhpcy5jdXJyZW50V2lkdGggfHwgMTAwMDAwLy8gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICBpZiAodGhpcy5wcm9wcy5jb25maWcuY2FyZFN0eWxlKSB7XHJcbiAgICAgIGxldCBsYXlvdXRcclxuICAgICAgaWYgKCF0aGlzLnByb3BzLmNvbmZpZy5jYXJkTGF5b3V0IHx8IHRoaXMucHJvcHMuY29uZmlnLmNhcmRMYXlvdXQgPT09ICdhdXRvJykge1xyXG4gICAgICAgIGlmIChjdXJyZW50V2lkdGggPD0gNjAwKSB7XHJcbiAgICAgICAgICBsYXlvdXQgPSAnc3RhY2snXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxheW91dCA9ICdzaWRlLWJ5LXNpZGUnXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxheW91dCA9IHRoaXMucHJvcHMuY29uZmlnLmNhcmRMYXlvdXRcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdjYXJkJyBhcyBjb25zdCxcclxuICAgICAgICBsYXlvdXQ6IGxheW91dFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ2NsYXNzaWMnXHJcbiAgfVxyXG5cclxuICBnZXREZWZhdWx0U3R5bGVDb25maWcgKCk6IFN0eWxlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHVzZUN1c3RvbTogZmFsc2UsXHJcbiAgICAgIGJhY2tncm91bmQ6IHtcclxuICAgICAgICBjb2xvcjogJycsXHJcbiAgICAgICAgZmlsbFR5cGU6IEZpbGxUeXBlLkZJTExcclxuICAgICAgfSxcclxuICAgICAgZm9udENvbG9yOiAnJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U3R5bGVDb25maWcgKCkge1xyXG4gICAgaWYgKHRoaXMucHJvcHMuY29uZmlnLnN0eWxlICYmIHRoaXMucHJvcHMuY29uZmlnLnN0eWxlLnVzZUN1c3RvbSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb25maWcuc3R5bGVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRTdHlsZUNvbmZpZygpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvbkFjdGl2ZVZpZXdDaGFuZ2UgPSBhc3luYyAoamltdU1hcFZpZXc6IEppbXVNYXBWaWV3KSA9PiB7XHJcbiAgICBpZiAoamltdU1hcFZpZXcgJiYgamltdU1hcFZpZXcudmlldykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuY3JlYXRlTGVnZW5kKGppbXVNYXBWaWV3LnZpZXcsIHRydWUsIGppbXVNYXBWaWV3KVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgbG9hZFN0YXR1czogTG9hZFN0YXR1cy5GdWxmaWxsZWQsXHJcbiAgICAgICAgICBhY3RpdmVKbXY6IGppbXVNYXBWaWV3XHJcbiAgICAgICAgfSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3lMZWdlbmQoKVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgbG9hZFN0YXR1czogTG9hZFN0YXR1cy5SZWplY3RlZFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGVzdHJveUxlZ2VuZCgpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblJlc2l6ZSA9ICh7IHdpZHRoIH0pID0+IHtcclxuICAgIHRoaXMuY3VycmVudFdpZHRoID0gd2lkdGhcclxuICAgIGlmICh0aGlzLmxlZ2VuZCAmJiB0aGlzLnByb3BzLmNvbmZpZy5jYXJkU3R5bGUgJiYgdGhpcy5wcm9wcy5jb25maWcuY2FyZExheW91dCA9PT0gJ2F1dG8nKSB7XHJcbiAgICAgIGNvbnN0IHN0eWxlID0gdGhpcy5jYWxjdWxhdGVTdHlsZSgpXHJcbiAgICAgIHRoaXMuYXBwbHlMZWdlbmRTdHlsZShzdHlsZSlcclxuICAgICAgdGhpcy5lbnN1cmVDYXJkVmlld0Z1bGxIZWlnaHQoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyICgpIHtcclxuICAgIGNvbnN0IHVzZU1hcFdpZGdldCA9IHRoaXMucHJvcHMudXNlTWFwV2lkZ2V0SWRzICYmIHRoaXMucHJvcHMudXNlTWFwV2lkZ2V0SWRzWzBdXHJcblxyXG4gICAgbGV0IGNvbnRlbnRcclxuXHJcbiAgICBpZiAoIXVzZU1hcFdpZGdldCkge1xyXG4gICAgICB0aGlzLmRlc3Ryb3lMZWdlbmQoKVxyXG4gICAgICBjb250ZW50ID0gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd3aWRnZXQtbGVnZW5kJz5cclxuICAgICAgICAgIDxXaWRnZXRQbGFjZWhvbGRlciBpY29uPXtsZWdlbmRJY29ufSBhdXRvRmxpcCBuYW1lPXt0aGlzLnByb3BzLmludGwuZm9ybWF0TWVzc2FnZSh7IGlkOiAnX3dpZGdldExhYmVsJywgZGVmYXVsdE1lc3NhZ2U6IGRlZmF1bHRNZXNzYWdlcy5fd2lkZ2V0TGFiZWwgfSl9IHdpZGdldElkPXt0aGlzLnByb3BzLmlkfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgbG9hZGluZ0NvbnRlbnQgPSBudWxsXHJcbiAgICAgIGNvbnN0IGRhdGFTb3VyY2VDb250ZW50ID0gPEppbXVNYXBWaWV3Q29tcG9uZW50IHVzZU1hcFdpZGdldElkPXt0aGlzLnByb3BzLnVzZU1hcFdpZGdldElkcz8uWzBdfSBvbkFjdGl2ZVZpZXdDaGFuZ2U9e3RoaXMub25BY3RpdmVWaWV3Q2hhbmdlfSAvPlxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5sb2FkU3RhdHVzID09PSBMb2FkU3RhdHVzLlBlbmRpbmcpIHtcclxuICAgICAgICBsb2FkaW5nQ29udGVudCA9IChcclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdqaW11LXNlY29uZGFyeS1sb2FkaW5nJyAvPlxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHdpbmRvdy5qaW11Q29uZmlnLmlzSW5CdWlsZGVyKSB7XHJcbiAgICAgICAgdGhpcy5jb25maWdMZWdlbmQoKVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnRlbnQgPSAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dpZGdldC1sZWdlbmQnIHJlZj17dGhpcy5sZWdlbmRXcmFwcGVyUmVmfT5cclxuICAgICAgICAgIHtsb2FkaW5nQ29udGVudH1cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsZWdlbmQtY29udGFpbmVyJyByZWY9e3RoaXMubGVnZW5kQ29udGFpbmVyUmVmfSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgZGlzcGxheTogJ25vbmUnIH19PlxyXG4gICAgICAgICAgICB7ZGF0YVNvdXJjZUNvbnRlbnR9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxSZWFjdFJlc2l6ZURldGVjdG9yIHRhcmdldFJlZj17dGhpcy5sZWdlbmRXcmFwcGVyUmVmfSBoYW5kbGVIZWlnaHQgaGFuZGxlV2lkdGggb25SZXNpemU9e3RoaXMub25SZXNpemV9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxQYXBlciB2YXJpYW50PSdmbGF0JyBjc3M9e2dldFN0eWxlKHRoaXMucHJvcHMudGhlbWUsIHRoaXMuZ2V0U3R5bGVDb25maWcoKSl9IGNsYXNzTmFtZT0namltdS13aWRnZXQnIHNoYXBlPSdub25lJz5cclxuICAgICAgICB7Y29udGVudH1cclxuICAgICAgPC9QYXBlcj5cclxuICAgIClcclxuICB9XHJcbn1cclxuXG4gZXhwb3J0IGZ1bmN0aW9uIF9fc2V0X3dlYnBhY2tfcHVibGljX3BhdGhfXyh1cmwpIHsgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB1cmwgfSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==