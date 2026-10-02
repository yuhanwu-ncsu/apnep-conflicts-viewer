System.register(["jimu-core/emotion","jimu-core","jimu-ui"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
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
				__WEBPACK_EXTERNAL_MODULE_jimu_ui__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./your-extensions/widgets/category-navigator/icon.svg"
/*!*************************************************************!*\
  !*** ./your-extensions/widgets/category-navigator/icon.svg ***!
  \*************************************************************/
(module) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><rect width=\"14\" height=\"3.5\" x=\"1\" y=\"1.5\" fill=\"currentColor\" rx=\"1.75\"></rect><rect width=\"12.5\" height=\"3\" x=\"2.5\" y=\"6.75\" fill=\"currentColor\" opacity=\".55\" rx=\"1.5\"></rect><rect width=\"12.5\" height=\"3\" x=\"2.5\" y=\"11.25\" fill=\"currentColor\" opacity=\".55\" rx=\"1.5\"></rect></svg>"

/***/ },

/***/ "./your-extensions/widgets/category-navigator/src/runtime/translations/default.ts"
/*!****************************************************************************************!*\
  !*** ./your-extensions/widgets/category-navigator/src/runtime/translations/default.ts ***!
  \****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    _widgetLabel: 'Category Navigator',
    categoryLevel: 'Categories',
    viewLevel: 'Views',
    selectSection: 'Select a section in the widget settings to start navigation.',
    addCategories: 'Add categories in the widget settings to start navigation.',
    emptyCategory: 'This category has no views.'
});


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
/*!***************************************************************************!*\
  !*** ./your-extensions/widgets/category-navigator/src/runtime/widget.tsx ***!
  \***************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./translations/default */ "./your-extensions/widgets/category-navigator/src/runtime/translations/default.ts");
/* harmony import */ var _icon_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../icon.svg */ "./your-extensions/widgets/category-navigator/icon.svg");
/* harmony import */ var _icon_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_icon_svg__WEBPACK_IMPORTED_MODULE_4__);





// Global chrome styling for native widgets placed on the maps (legend cards
// and filter toggles), so they match the navigator's pill design language.
const globalStyles = `
  .widget-legend {
    border-radius: 14px !important;
    overflow: hidden !important;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .widget-filter .filter-item-pill .jimu-btn {
    border-radius: 50rem !important;
    padding: 4px 14px !important;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.8) !important;
    border-color: transparent !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .widget-filter .filter-item-pill .jimu-btn:hover {
    background: rgba(255, 255, 255, 0.95) !important;
  }
  .widget-filter .filter-item-pill .jimu-btn.frame-active {
    background-color: var(--sys-color-primary-light) !important;
    color: var(--sys-color-primary-text) !important;
    font-weight: bold;
  }
  .widget-filter [class*="filter-item-pill"] {
    border-radius: 50rem !important;
    padding: 4px 14px !important;
    background: rgba(255, 255, 255, 0.8) !important;
    border: none !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .widget-filter [class*="toggle-name"],
  .widget-filter [class*="filter-item-name"] {
    font-weight: 600;
    color: var(--ref-palette-neutral-1300);
    margin-inline-end: 8px;
  }
  .widget-filter .filter-item[aria-label*="High Pressure"] { --axis: #c57ade; }
  .widget-filter .filter-item[aria-label*="High Resources"] { --axis: #a9bf39; }
  .widget-filter .filter-item[aria-label*="High Conflict Zones"] { --axis: #5064a1; }
  .widget-filter .filter-item-toggle-pill svg { fill: var(--axis, #5a5a5a); }
  .widget-filter .filter-item-toggle-pill:has(input:checked) {
    background-color: var(--axis) !important;
  }
  .widget-filter .filter-item-toggle-pill:has(input:checked) .toggle-name {
    color: #ffffff;
    font-weight: bold;
  }
  .widget-filter .filter-item-toggle-pill:has(input:checked) svg {
    fill: #ffffff;
  }
`;
const style = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.css) `
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  .category-level,
  .view-level {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .category-level button,
  .view-level button {
    border-radius: 50rem !important;
  }
  .level-caption {
    flex: 0 0 82px;
    align-self: center;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--ref-palette-neutral-1300);
    opacity: 0.75;
    margin-inline-end: 4px;
    white-space: nowrap;
  }
  .category-level button {
    font-weight: 500;
  }
  .category-level button.active {
    font-weight: bold;
  }
  .category-level button:not(.active),
  .view-level button:not(.active) {
    background-color: #cad4e7 !important;
    color: var(--ref-palette-neutral-1300) !important;
    border-color: transparent !important;
  }
  .category-level button:not(.active):hover,
  .view-level button:not(.active):hover {
    background-color: #b6c5e0 !important;
    color: var(--sys-color-primary-text) !important;
  }
  .view-level button.active {
    border-color: transparent !important;
    font-weight: bold;
  }
`;
const Widget = (props) => {
    var _a, _b, _c, _d, _e;
    const translate = jimu_core__WEBPACK_IMPORTED_MODULE_1__.hooks.useTranslation(_translations_default__WEBPACK_IMPORTED_MODULE_3__["default"]);
    const sectionId = (_a = props.config) === null || _a === void 0 ? void 0 : _a.sectionId;
    const categories = (_c = (_b = props.config) === null || _b === void 0 ? void 0 : _b.categories) !== null && _c !== void 0 ? _c : [];
    const [activeCategoryIndex, setActiveCategoryIndex] = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useState(0);
    const sectionViews = jimu_core__WEBPACK_IMPORTED_MODULE_1__.ReactRedux.useSelector((state) => { var _a, _b, _c, _d; return sectionId ? ((_d = (_c = (_b = (_a = state.appConfig) === null || _a === void 0 ? void 0 : _a.sections) === null || _b === void 0 ? void 0 : _b[sectionId]) === null || _c === void 0 ? void 0 : _c.views) !== null && _d !== void 0 ? _d : []) : []; });
    const viewLabels = jimu_core__WEBPACK_IMPORTED_MODULE_1__.ReactRedux.useSelector((state) => {
        var _a;
        const views = (_a = state.appConfig) === null || _a === void 0 ? void 0 : _a.views;
        if (!views) {
            return {};
        }
        return Object.keys(views).reduce((labels, viewId) => {
            var _a, _b;
            labels[viewId] = (_b = (_a = views[viewId]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : viewId;
            return labels;
        }, {});
    });
    const currentViewId = jimu_core__WEBPACK_IMPORTED_MODULE_1__.ReactRedux.useSelector((state) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!sectionId) {
            return null;
        }
        const section = (_b = (_a = state.appConfig) === null || _a === void 0 ? void 0 : _a.sections) === null || _b === void 0 ? void 0 : _b[sectionId];
        return (_j = (_g = (_f = (_e = (_d = (_c = state.appRuntimeInfo) === null || _c === void 0 ? void 0 : _c.sectionNavInfos) === null || _d === void 0 ? void 0 : _d[sectionId]) === null || _e === void 0 ? void 0 : _e.currentViewId) !== null && _f !== void 0 ? _f : section === null || section === void 0 ? void 0 : section.defaultView) !== null && _g !== void 0 ? _g : (_h = section === null || section === void 0 ? void 0 : section.views) === null || _h === void 0 ? void 0 : _h[0]) !== null && _j !== void 0 ? _j : null;
    });
    const safeIndex = Math.min(activeCategoryIndex, Math.max(categories.length - 1, 0));
    const activeCategory = categories[safeIndex];
    // Keep the active category in sync when the current view changes from outside
    // (e.g. section arrows/dots nav, or another widget switching views).
    jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useEffect(() => {
        if (!currentViewId || categories.length === 0) {
            return;
        }
        const index = categories.findIndex((category) => { var _a; return (_a = category.viewIds) === null || _a === void 0 ? void 0 : _a.includes(currentViewId); });
        if (index >= 0 && index !== activeCategoryIndex) {
            setActiveCategoryIndex(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentViewId]);
    if (!sectionId) {
        return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.WidgetPlaceholder, { icon: (_icon_svg__WEBPACK_IMPORTED_MODULE_4___default()), message: translate('selectSection'), widgetId: props.id });
    }
    if (categories.length === 0) {
        return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.WidgetPlaceholder, { icon: (_icon_svg__WEBPACK_IMPORTED_MODULE_4___default()), message: translate('addCategories'), widgetId: props.id });
    }
    const navigateToView = (viewId) => {
        var _a, _b, _c;
        if (!sectionId || viewId === currentViewId) {
            return;
        }
        const state = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().getState();
        const navInfo = (_b = (_a = state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.sectionNavInfos) === null || _b === void 0 ? void 0 : _b[sectionId];
        const previousViewId = (_c = navInfo === null || navInfo === void 0 ? void 0 : navInfo.currentViewId) !== null && _c !== void 0 ? _c : sectionViews[0];
        const newNavInfo = {
            previousViewId,
            currentViewId: viewId
        };
        (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().dispatch(jimu_core__WEBPACK_IMPORTED_MODULE_1__.appActions.sectionNavInfoChanged(sectionId, newNavInfo));
        jimu_core__WEBPACK_IMPORTED_MODULE_1__.jimuHistory.changeViewBySectionNavInfo(sectionId, newNavInfo);
        jimu_core__WEBPACK_IMPORTED_MODULE_1__.MessageManager.getInstance().publishMessage(new jimu_core__WEBPACK_IMPORTED_MODULE_1__.ViewChangeMessage(sectionId, viewId, previousViewId));
    };
    const handleCategoryClick = (index) => {
        var _a;
        setActiveCategoryIndex(index);
        const category = categories[index];
        if (!category || ((_a = category.viewIds) === null || _a === void 0 ? void 0 : _a.includes(currentViewId))) {
            return;
        }
        const firstViewId = category.viewIds.find((viewId) => sectionViews.includes(viewId));
        if (firstViewId) {
            navigateToView(firstViewId);
        }
    };
    const validViewIds = (_e = (_d = activeCategory === null || activeCategory === void 0 ? void 0 : activeCategory.viewIds) === null || _d === void 0 ? void 0 : _d.filter((viewId) => sectionViews.includes(viewId))) !== null && _e !== void 0 ? _e : [];
    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "widget-category-navigator jimu-widget", css: style, children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("style", { children: globalStyles }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "category-level", role: "group", "aria-label": translate('categoryLevel'), children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "level-caption", children: translate('categoryLevel') }), categories.map((category, index) => ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Button, { size: "default", type: index === safeIndex ? 'primary' : 'secondary', active: index === safeIndex, "aria-pressed": index === safeIndex, onClick: () => handleCategoryClick(index), children: category.label }, index)))] }), validViewIds.length > 0 && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "view-level", role: "group", "aria-label": translate('viewLevel'), children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "level-caption", children: translate('viewLevel') }), validViewIds.map((viewId) => {
                        var _a;
                        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Button, { size: "sm", type: viewId === currentViewId ? 'primary' : 'default', active: viewId === currentViewId, "aria-pressed": viewId === currentViewId, onClick: () => navigateToView(viewId), children: (_a = viewLabels[viewId]) !== null && _a !== void 0 ? _a : viewId }, viewId));
                    })] })), validViewIds.length === 0 && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "view-level", "aria-label": translate('viewLevel'), children: translate('emptyCategory') }))] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Widget);
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9jYXRlZ29yeS1uYXZpZ2F0b3IvZGlzdC9ydW50aW1lL3dpZGdldC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxWjs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUVBQWU7SUFDYixZQUFZLEVBQUUsb0JBQW9CO0lBQ2xDLGFBQWEsRUFBRSxZQUFZO0lBQzNCLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLGFBQWEsRUFBRSw4REFBOEQ7SUFDN0UsYUFBYSxFQUFFLDREQUE0RDtJQUMzRSxhQUFhLEVBQUUsNkJBQTZCO0NBQzdDOzs7Ozs7Ozs7Ozs7QUNQRCx1RDs7Ozs7Ozs7Ozs7QUNBQSx3RTs7Ozs7Ozs7Ozs7QUNBQSxxRDs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1dDTkEsMkI7Ozs7Ozs7Ozs7QUNBQTs7O0tBR0s7QUFDTCxxQkFBdUIsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKdUk7QUFDdkk7QUFFQztBQUNuQjtBQUVqQyw0RUFBNEU7QUFDNUUsMkVBQTJFO0FBQzNFLE1BQU0sWUFBWSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q0FBQyxHQUN2QixDQUNQLElBQ0csQ0FDUDtBQUNILENBQUM7QUFFRCxpRUFBZSxNQUFNO0FBRWIsU0FBUywyQkFBMkIsQ0FBQyxHQUFHLElBQUkscUJBQXVCLEdBQUcsR0FBRyxFQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY2F0ZWdvcnktbmF2aWdhdG9yL2ljb24uc3ZnIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9jYXRlZ29yeS1uYXZpZ2F0b3Ivc3JjL3J1bnRpbWUvdHJhbnNsYXRpb25zL2RlZmF1bHQudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LWNvcmVcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZS9lbW90aW9uXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LXVpXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4vamltdS1jb3JlL2xpYi9zZXQtcHVibGljLXBhdGgudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL2NhdGVnb3J5LW5hdmlnYXRvci9zcmMvcnVudGltZS93aWRnZXQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDE2IDE2XFxcIj48cmVjdCB3aWR0aD1cXFwiMTRcXFwiIGhlaWdodD1cXFwiMy41XFxcIiB4PVxcXCIxXFxcIiB5PVxcXCIxLjVcXFwiIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgcng9XFxcIjEuNzVcXFwiPjwvcmVjdD48cmVjdCB3aWR0aD1cXFwiMTIuNVxcXCIgaGVpZ2h0PVxcXCIzXFxcIiB4PVxcXCIyLjVcXFwiIHk9XFxcIjYuNzVcXFwiIGZpbGw9XFxcImN1cnJlbnRDb2xvclxcXCIgb3BhY2l0eT1cXFwiLjU1XFxcIiByeD1cXFwiMS41XFxcIj48L3JlY3Q+PHJlY3Qgd2lkdGg9XFxcIjEyLjVcXFwiIGhlaWdodD1cXFwiM1xcXCIgeD1cXFwiMi41XFxcIiB5PVxcXCIxMS4yNVxcXCIgZmlsbD1cXFwiY3VycmVudENvbG9yXFxcIiBvcGFjaXR5PVxcXCIuNTVcXFwiIHJ4PVxcXCIxLjVcXFwiPjwvcmVjdD48L3N2Zz5cIiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgX3dpZGdldExhYmVsOiAnQ2F0ZWdvcnkgTmF2aWdhdG9yJyxcbiAgY2F0ZWdvcnlMZXZlbDogJ0NhdGVnb3JpZXMnLFxuICB2aWV3TGV2ZWw6ICdWaWV3cycsXG4gIHNlbGVjdFNlY3Rpb246ICdTZWxlY3QgYSBzZWN0aW9uIGluIHRoZSB3aWRnZXQgc2V0dGluZ3MgdG8gc3RhcnQgbmF2aWdhdGlvbi4nLFxuICBhZGRDYXRlZ29yaWVzOiAnQWRkIGNhdGVnb3JpZXMgaW4gdGhlIHdpZGdldCBzZXR0aW5ncyB0byBzdGFydCBuYXZpZ2F0aW9uLicsXG4gIGVtcHR5Q2F0ZWdvcnk6ICdUaGlzIGNhdGVnb3J5IGhhcyBubyB2aWV3cy4nXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV9jb3JlX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX19lbW90aW9uX3JlYWN0X2pzeF9ydW50aW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfdWlfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIi8qKlxyXG4gKiBXZWJwYWNrIHdpbGwgcmVwbGFjZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB3aXRoIF9fd2VicGFja19yZXF1aXJlX18ucCB0byBzZXQgdGhlIHB1YmxpYyBwYXRoIGR5bmFtaWNhbGx5LlxyXG4gKiBUaGUgcmVhc29uIHdoeSB3ZSBjYW4ndCBzZXQgdGhlIHB1YmxpY1BhdGggaW4gd2VicGFjayBjb25maWcgaXM6IHdlIGNoYW5nZSB0aGUgcHVibGljUGF0aCB3aGVuIGRvd25sb2FkLlxyXG4gKiAqL1xyXG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHdpbmRvdy5qaW11Q29uZmlnLmJhc2VVcmxcclxuIiwiaW1wb3J0IHsgUmVhY3QsIHR5cGUgQWxsV2lkZ2V0UHJvcHMsIHR5cGUgSU1TdGF0ZSwgdHlwZSBTZWN0aW9uTmF2SW5mbywgZ2V0QXBwU3RvcmUsIGFwcEFjdGlvbnMsIFJlYWN0UmVkdXgsIE1lc3NhZ2VNYW5hZ2VyLCBWaWV3Q2hhbmdlTWVzc2FnZSwgaG9va3MsIGppbXVIaXN0b3J5LCBjc3MgfSBmcm9tICdqaW11LWNvcmUnXG5pbXBvcnQgeyBCdXR0b24sIFdpZGdldFBsYWNlaG9sZGVyIH0gZnJvbSAnamltdS11aSdcbmltcG9ydCB0eXBlIHsgSU1Db25maWcgfSBmcm9tICcuLi9jb25maWcnXG5pbXBvcnQgZGVmYXVsdE1lc3NhZ2VzIGZyb20gJy4vdHJhbnNsYXRpb25zL2RlZmF1bHQnXG5pbXBvcnQgaWNvbiBmcm9tICcuLi8uLi9pY29uLnN2ZydcblxuLy8gR2xvYmFsIGNocm9tZSBzdHlsaW5nIGZvciBuYXRpdmUgd2lkZ2V0cyBwbGFjZWQgb24gdGhlIG1hcHMgKGxlZ2VuZCBjYXJkc1xuLy8gYW5kIGZpbHRlciB0b2dnbGVzKSwgc28gdGhleSBtYXRjaCB0aGUgbmF2aWdhdG9yJ3MgcGlsbCBkZXNpZ24gbGFuZ3VhZ2UuXG5jb25zdCBnbG9iYWxTdHlsZXMgPSBgXG4gIC53aWRnZXQtbGVnZW5kIHtcbiAgICBib3JkZXItcmFkaXVzOiAxNHB4ICFpbXBvcnRhbnQ7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbiAhaW1wb3J0YW50O1xuICAgIGJveC1zaGFkb3c6IDAgNHB4IDE4cHggcmdiYSgwLCAwLCAwLCAwLjE4KSAhaW1wb3J0YW50O1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig4cHgpO1xuICAgIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOiBibHVyKDhweCk7XG4gIH1cbiAgLndpZGdldC1maWx0ZXIgLmZpbHRlci1pdGVtLXBpbGwgLmppbXUtYnRuIHtcbiAgICBib3JkZXItcmFkaXVzOiA1MHJlbSAhaW1wb3J0YW50O1xuICAgIHBhZGRpbmc6IDRweCAxNHB4ICFpbXBvcnRhbnQ7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCkgIWltcG9ydGFudDtcbiAgICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgYm94LXNoYWRvdzogMCAycHggMTBweCByZ2JhKDAsIDAsIDAsIDAuMTQpO1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig4cHgpO1xuICAgIC13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOiBibHVyKDhweCk7XG4gIH1cbiAgLndpZGdldC1maWx0ZXIgLmZpbHRlci1pdGVtLXBpbGwgLmppbXUtYnRuOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOTUpICFpbXBvcnRhbnQ7XG4gIH1cbiAgLndpZGdldC1maWx0ZXIgLmZpbHRlci1pdGVtLXBpbGwgLmppbXUtYnRuLmZyYW1lLWFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3lzLWNvbG9yLXByaW1hcnktbGlnaHQpICFpbXBvcnRhbnQ7XG4gICAgY29sb3I6IHZhcigtLXN5cy1jb2xvci1wcmltYXJ5LXRleHQpICFpbXBvcnRhbnQ7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cbiAgLndpZGdldC1maWx0ZXIgW2NsYXNzKj1cImZpbHRlci1pdGVtLXBpbGxcIl0ge1xuICAgIGJvcmRlci1yYWRpdXM6IDUwcmVtICFpbXBvcnRhbnQ7XG4gICAgcGFkZGluZzogNHB4IDE0cHggIWltcG9ydGFudDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCkgIWltcG9ydGFudDtcbiAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICBib3gtc2hhZG93OiAwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgMC4xNCk7XG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDhweCk7XG4gICAgLXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6IGJsdXIoOHB4KTtcbiAgfVxuICAud2lkZ2V0LWZpbHRlciBbY2xhc3MqPVwidG9nZ2xlLW5hbWVcIl0sXG4gIC53aWRnZXQtZmlsdGVyIFtjbGFzcyo9XCJmaWx0ZXItaXRlbS1uYW1lXCJdIHtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGNvbG9yOiB2YXIoLS1yZWYtcGFsZXR0ZS1uZXV0cmFsLTEzMDApO1xuICAgIG1hcmdpbi1pbmxpbmUtZW5kOiA4cHg7XG4gIH1cbiAgLndpZGdldC1maWx0ZXIgLmZpbHRlci1pdGVtW2FyaWEtbGFiZWwqPVwiSGlnaCBQcmVzc3VyZVwiXSB7IC0tYXhpczogI2M1N2FkZTsgfVxuICAud2lkZ2V0LWZpbHRlciAuZmlsdGVyLWl0ZW1bYXJpYS1sYWJlbCo9XCJIaWdoIFJlc291cmNlc1wiXSB7IC0tYXhpczogI2E5YmYzOTsgfVxuICAud2lkZ2V0LWZpbHRlciAuZmlsdGVyLWl0ZW1bYXJpYS1sYWJlbCo9XCJIaWdoIENvbmZsaWN0IFpvbmVzXCJdIHsgLS1heGlzOiAjNTA2NGExOyB9XG4gIC53aWRnZXQtZmlsdGVyIC5maWx0ZXItaXRlbS10b2dnbGUtcGlsbCBzdmcgeyBmaWxsOiB2YXIoLS1heGlzLCAjNWE1YTVhKTsgfVxuICAud2lkZ2V0LWZpbHRlciAuZmlsdGVyLWl0ZW0tdG9nZ2xlLXBpbGw6aGFzKGlucHV0OmNoZWNrZWQpIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1heGlzKSAhaW1wb3J0YW50O1xuICB9XG4gIC53aWRnZXQtZmlsdGVyIC5maWx0ZXItaXRlbS10b2dnbGUtcGlsbDpoYXMoaW5wdXQ6Y2hlY2tlZCkgLnRvZ2dsZS1uYW1lIHtcbiAgICBjb2xvcjogI2ZmZmZmZjtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgfVxuICAud2lkZ2V0LWZpbHRlciAuZmlsdGVyLWl0ZW0tdG9nZ2xlLXBpbGw6aGFzKGlucHV0OmNoZWNrZWQpIHN2ZyB7XG4gICAgZmlsbDogI2ZmZmZmZjtcbiAgfVxuYFxuXG5jb25zdCBzdHlsZSA9IGNzc2BcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiA2cHg7XG4gIHBhZGRpbmc6IDZweDtcbiAgLmNhdGVnb3J5LWxldmVsLFxuICAudmlldy1sZXZlbCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgZ2FwOiA2cHg7XG4gIH1cbiAgLmNhdGVnb3J5LWxldmVsIGJ1dHRvbixcbiAgLnZpZXctbGV2ZWwgYnV0dG9uIHtcbiAgICBib3JkZXItcmFkaXVzOiA1MHJlbSAhaW1wb3J0YW50O1xuICB9XG4gIC5sZXZlbC1jYXB0aW9uIHtcbiAgICBmbGV4OiAwIDAgODJweDtcbiAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XG4gICAgZm9udC1zaXplOiAxMXB4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBsZXR0ZXItc3BhY2luZzogMC40cHg7XG4gICAgY29sb3I6IHZhcigtLXJlZi1wYWxldHRlLW5ldXRyYWwtMTMwMCk7XG4gICAgb3BhY2l0eTogMC43NTtcbiAgICBtYXJnaW4taW5saW5lLWVuZDogNHB4O1xuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIH1cbiAgLmNhdGVnb3J5LWxldmVsIGJ1dHRvbiB7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuICAuY2F0ZWdvcnktbGV2ZWwgYnV0dG9uLmFjdGl2ZSB7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cbiAgLmNhdGVnb3J5LWxldmVsIGJ1dHRvbjpub3QoLmFjdGl2ZSksXG4gIC52aWV3LWxldmVsIGJ1dHRvbjpub3QoLmFjdGl2ZSkge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNjYWQ0ZTcgIWltcG9ydGFudDtcbiAgICBjb2xvcjogdmFyKC0tcmVmLXBhbGV0dGUtbmV1dHJhbC0xMzAwKSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgfVxuICAuY2F0ZWdvcnktbGV2ZWwgYnV0dG9uOm5vdCguYWN0aXZlKTpob3ZlcixcbiAgLnZpZXctbGV2ZWwgYnV0dG9uOm5vdCguYWN0aXZlKTpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2I2YzVlMCAhaW1wb3J0YW50O1xuICAgIGNvbG9yOiB2YXIoLS1zeXMtY29sb3ItcHJpbWFyeS10ZXh0KSAhaW1wb3J0YW50O1xuICB9XG4gIC52aWV3LWxldmVsIGJ1dHRvbi5hY3RpdmUge1xuICAgIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgfVxuYFxuXG5jb25zdCBXaWRnZXQgPSAocHJvcHM6IEFsbFdpZGdldFByb3BzPElNQ29uZmlnPikgPT4ge1xuICBjb25zdCB0cmFuc2xhdGUgPSBob29rcy51c2VUcmFuc2xhdGlvbihkZWZhdWx0TWVzc2FnZXMpXG4gIGNvbnN0IHNlY3Rpb25JZCA9IHByb3BzLmNvbmZpZz8uc2VjdGlvbklkXG4gIGNvbnN0IGNhdGVnb3JpZXMgPSBwcm9wcy5jb25maWc/LmNhdGVnb3JpZXMgPz8gW11cblxuICBjb25zdCBbYWN0aXZlQ2F0ZWdvcnlJbmRleCwgc2V0QWN0aXZlQ2F0ZWdvcnlJbmRleF0gPSBSZWFjdC51c2VTdGF0ZSgwKVxuXG4gIGNvbnN0IHNlY3Rpb25WaWV3cyA9IFJlYWN0UmVkdXgudXNlU2VsZWN0b3IoKHN0YXRlOiBJTVN0YXRlKSA9PlxuICAgIHNlY3Rpb25JZCA/IChzdGF0ZS5hcHBDb25maWc/LnNlY3Rpb25zPy5bc2VjdGlvbklkXT8udmlld3MgPz8gW10pIDogW11cbiAgKVxuICBjb25zdCB2aWV3TGFiZWxzID0gUmVhY3RSZWR1eC51c2VTZWxlY3Rvcigoc3RhdGU6IElNU3RhdGUpID0+IHtcbiAgICBjb25zdCB2aWV3cyA9IHN0YXRlLmFwcENvbmZpZz8udmlld3NcbiAgICBpZiAoIXZpZXdzKSB7XG4gICAgICByZXR1cm4ge31cbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZpZXdzKS5yZWR1Y2UoKGxhYmVscywgdmlld0lkKSA9PiB7XG4gICAgICBsYWJlbHNbdmlld0lkXSA9IHZpZXdzW3ZpZXdJZF0/LmxhYmVsID8/IHZpZXdJZFxuICAgICAgcmV0dXJuIGxhYmVsc1xuICAgIH0sIHt9KVxuICB9KVxuICBjb25zdCBjdXJyZW50Vmlld0lkID0gUmVhY3RSZWR1eC51c2VTZWxlY3Rvcigoc3RhdGU6IElNU3RhdGUpID0+IHtcbiAgICBpZiAoIXNlY3Rpb25JZCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgY29uc3Qgc2VjdGlvbiA9IHN0YXRlLmFwcENvbmZpZz8uc2VjdGlvbnM/LltzZWN0aW9uSWRdXG4gICAgcmV0dXJuIHN0YXRlLmFwcFJ1bnRpbWVJbmZvPy5zZWN0aW9uTmF2SW5mb3M/LltzZWN0aW9uSWRdPy5jdXJyZW50Vmlld0lkID8/XG4gICAgICBzZWN0aW9uPy5kZWZhdWx0VmlldyA/P1xuICAgICAgc2VjdGlvbj8udmlld3M/LlswXSA/P1xuICAgICAgbnVsbFxuICB9KVxuXG4gIGNvbnN0IHNhZmVJbmRleCA9IE1hdGgubWluKGFjdGl2ZUNhdGVnb3J5SW5kZXgsIE1hdGgubWF4KGNhdGVnb3JpZXMubGVuZ3RoIC0gMSwgMCkpXG4gIGNvbnN0IGFjdGl2ZUNhdGVnb3J5ID0gY2F0ZWdvcmllc1tzYWZlSW5kZXhdXG5cbiAgLy8gS2VlcCB0aGUgYWN0aXZlIGNhdGVnb3J5IGluIHN5bmMgd2hlbiB0aGUgY3VycmVudCB2aWV3IGNoYW5nZXMgZnJvbSBvdXRzaWRlXG4gIC8vIChlLmcuIHNlY3Rpb24gYXJyb3dzL2RvdHMgbmF2LCBvciBhbm90aGVyIHdpZGdldCBzd2l0Y2hpbmcgdmlld3MpLlxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghY3VycmVudFZpZXdJZCB8fCBjYXRlZ29yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGluZGV4ID0gY2F0ZWdvcmllcy5maW5kSW5kZXgoKGNhdGVnb3J5KSA9PiBjYXRlZ29yeS52aWV3SWRzPy5pbmNsdWRlcyhjdXJyZW50Vmlld0lkKSlcbiAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCAhPT0gYWN0aXZlQ2F0ZWdvcnlJbmRleCkge1xuICAgICAgc2V0QWN0aXZlQ2F0ZWdvcnlJbmRleChpbmRleClcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xuICB9LCBbY3VycmVudFZpZXdJZF0pXG5cbiAgaWYgKCFzZWN0aW9uSWQpIHtcbiAgICByZXR1cm4gPFdpZGdldFBsYWNlaG9sZGVyIGljb249e2ljb259IG1lc3NhZ2U9e3RyYW5zbGF0ZSgnc2VsZWN0U2VjdGlvbicpfSB3aWRnZXRJZD17cHJvcHMuaWR9IC8+XG4gIH1cblxuICBpZiAoY2F0ZWdvcmllcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gPFdpZGdldFBsYWNlaG9sZGVyIGljb249e2ljb259IG1lc3NhZ2U9e3RyYW5zbGF0ZSgnYWRkQ2F0ZWdvcmllcycpfSB3aWRnZXRJZD17cHJvcHMuaWR9IC8+XG4gIH1cblxuICBjb25zdCBuYXZpZ2F0ZVRvVmlldyA9ICh2aWV3SWQ6IHN0cmluZykgPT4ge1xuICAgIGlmICghc2VjdGlvbklkIHx8IHZpZXdJZCA9PT0gY3VycmVudFZpZXdJZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHN0YXRlID0gZ2V0QXBwU3RvcmUoKS5nZXRTdGF0ZSgpXG4gICAgY29uc3QgbmF2SW5mbyA9IHN0YXRlLmFwcFJ1bnRpbWVJbmZvPy5zZWN0aW9uTmF2SW5mb3M/LltzZWN0aW9uSWRdXG4gICAgY29uc3QgcHJldmlvdXNWaWV3SWQgPSBuYXZJbmZvPy5jdXJyZW50Vmlld0lkID8/IHNlY3Rpb25WaWV3c1swXVxuICAgIGNvbnN0IG5ld05hdkluZm86IFNlY3Rpb25OYXZJbmZvID0ge1xuICAgICAgcHJldmlvdXNWaWV3SWQsXG4gICAgICBjdXJyZW50Vmlld0lkOiB2aWV3SWRcbiAgICB9XG4gICAgZ2V0QXBwU3RvcmUoKS5kaXNwYXRjaChhcHBBY3Rpb25zLnNlY3Rpb25OYXZJbmZvQ2hhbmdlZChzZWN0aW9uSWQsIG5ld05hdkluZm8pKVxuICAgIGppbXVIaXN0b3J5LmNoYW5nZVZpZXdCeVNlY3Rpb25OYXZJbmZvKHNlY3Rpb25JZCwgbmV3TmF2SW5mbylcbiAgICBNZXNzYWdlTWFuYWdlci5nZXRJbnN0YW5jZSgpLnB1Ymxpc2hNZXNzYWdlKG5ldyBWaWV3Q2hhbmdlTWVzc2FnZShzZWN0aW9uSWQsIHZpZXdJZCwgcHJldmlvdXNWaWV3SWQpKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ2F0ZWdvcnlDbGljayA9IChpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgc2V0QWN0aXZlQ2F0ZWdvcnlJbmRleChpbmRleClcbiAgICBjb25zdCBjYXRlZ29yeSA9IGNhdGVnb3JpZXNbaW5kZXhdXG4gICAgaWYgKCFjYXRlZ29yeSB8fCBjYXRlZ29yeS52aWV3SWRzPy5pbmNsdWRlcyhjdXJyZW50Vmlld0lkKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGZpcnN0Vmlld0lkID0gY2F0ZWdvcnkudmlld0lkcy5maW5kKCh2aWV3SWQpID0+IHNlY3Rpb25WaWV3cy5pbmNsdWRlcyh2aWV3SWQpKVxuICAgIGlmIChmaXJzdFZpZXdJZCkge1xuICAgICAgbmF2aWdhdGVUb1ZpZXcoZmlyc3RWaWV3SWQpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgdmFsaWRWaWV3SWRzID0gYWN0aXZlQ2F0ZWdvcnk/LnZpZXdJZHM/LmZpbHRlcigodmlld0lkKSA9PiBzZWN0aW9uVmlld3MuaW5jbHVkZXModmlld0lkKSkgPz8gW11cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LWNhdGVnb3J5LW5hdmlnYXRvciBqaW11LXdpZGdldFwiIGNzcz17c3R5bGV9PlxuICAgICAgPHN0eWxlPntnbG9iYWxTdHlsZXN9PC9zdHlsZT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2F0ZWdvcnktbGV2ZWxcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPXt0cmFuc2xhdGUoJ2NhdGVnb3J5TGV2ZWwnKX0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImxldmVsLWNhcHRpb25cIj57dHJhbnNsYXRlKCdjYXRlZ29yeUxldmVsJyl9PC9zcGFuPlxuICAgICAgICB7Y2F0ZWdvcmllcy5tYXAoKGNhdGVnb3J5LCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICBzaXplPVwiZGVmYXVsdFwiXG4gICAgICAgICAgICB0eXBlPXtpbmRleCA9PT0gc2FmZUluZGV4ID8gJ3ByaW1hcnknIDogJ3NlY29uZGFyeSd9XG4gICAgICAgICAgICBhY3RpdmU9e2luZGV4ID09PSBzYWZlSW5kZXh9XG4gICAgICAgICAgICBhcmlhLXByZXNzZWQ9e2luZGV4ID09PSBzYWZlSW5kZXh9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVDYXRlZ29yeUNsaWNrKGluZGV4KX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7Y2F0ZWdvcnkubGFiZWx9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgICB7dmFsaWRWaWV3SWRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInZpZXctbGV2ZWxcIiByb2xlPVwiZ3JvdXBcIiBhcmlhLWxhYmVsPXt0cmFuc2xhdGUoJ3ZpZXdMZXZlbCcpfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsZXZlbC1jYXB0aW9uXCI+e3RyYW5zbGF0ZSgndmlld0xldmVsJyl9PC9zcGFuPlxuICAgICAgICAgIHt2YWxpZFZpZXdJZHMubWFwKCh2aWV3SWQpID0+IChcbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAga2V5PXt2aWV3SWR9XG4gICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgIHR5cGU9e3ZpZXdJZCA9PT0gY3VycmVudFZpZXdJZCA/ICdwcmltYXJ5JyA6ICdkZWZhdWx0J31cbiAgICAgICAgICAgICAgYWN0aXZlPXt2aWV3SWQgPT09IGN1cnJlbnRWaWV3SWR9XG4gICAgICAgICAgICAgIGFyaWEtcHJlc3NlZD17dmlld0lkID09PSBjdXJyZW50Vmlld0lkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBuYXZpZ2F0ZVRvVmlldyh2aWV3SWQpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dmlld0xhYmVsc1t2aWV3SWRdID8/IHZpZXdJZH1cbiAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7dmFsaWRWaWV3SWRzLmxlbmd0aCA9PT0gMCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidmlldy1sZXZlbFwiIGFyaWEtbGFiZWw9e3RyYW5zbGF0ZSgndmlld0xldmVsJyl9PlxuICAgICAgICAgIHt0cmFuc2xhdGUoJ2VtcHR5Q2F0ZWdvcnknKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFdpZGdldFxuXG4gZXhwb3J0IGZ1bmN0aW9uIF9fc2V0X3dlYnBhY2tfcHVibGljX3BhdGhfXyh1cmwpIHsgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB1cmwgfSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==