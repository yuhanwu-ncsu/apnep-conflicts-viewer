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

/***/ "./your-extensions/widgets/sidebar-peek/icon.svg"
/*!*******************************************************!*\
  !*** ./your-extensions/widgets/sidebar-peek/icon.svg ***!
  \*******************************************************/
(module) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\"><circle cx=\"8\" cy=\"8\" r=\"6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"></circle><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"1.6\" d=\"M8 4.5V8l2.5 1.5\"></path></svg>"

/***/ },

/***/ "./your-extensions/widgets/sidebar-peek/src/runtime/translations/default.ts"
/*!**********************************************************************************!*\
  !*** ./your-extensions/widgets/sidebar-peek/src/runtime/translations/default.ts ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    _widgetLabel: 'Sidebar Peek',
    selectSection: 'Select a section in the widget settings to enable the peek behavior.'
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
/*!*********************************************************************!*\
  !*** ./your-extensions/widgets/sidebar-peek/src/runtime/widget.tsx ***!
  \*********************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./translations/default */ "./your-extensions/widgets/sidebar-peek/src/runtime/translations/default.ts");
/* harmony import */ var _icon_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../icon.svg */ "./your-extensions/widgets/sidebar-peek/icon.svg");
/* harmony import */ var _icon_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_icon_svg__WEBPACK_IMPORTED_MODULE_4__);





const style = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.css) `
  display: none;
`;
const Widget = (props) => {
    var _a, _b, _c;
    const translate = jimu_core__WEBPACK_IMPORTED_MODULE_1__.hooks.useTranslation(_translations_default__WEBPACK_IMPORTED_MODULE_3__["default"]);
    const sectionId = (_a = props.config) === null || _a === void 0 ? void 0 : _a.sectionId;
    const delay = (_c = (_b = props.config) === null || _b === void 0 ? void 0 : _b.delayMs) !== null && _c !== void 0 ? _c : 5000;
    const currentViewId = jimu_core__WEBPACK_IMPORTED_MODULE_1__.ReactRedux.useSelector((state) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!sectionId) {
            return null;
        }
        const section = (_b = (_a = state.appConfig) === null || _a === void 0 ? void 0 : _a.sections) === null || _b === void 0 ? void 0 : _b[sectionId];
        return (_j = (_g = (_f = (_e = (_d = (_c = state.appRuntimeInfo) === null || _c === void 0 ? void 0 : _c.sectionNavInfos) === null || _d === void 0 ? void 0 : _d[sectionId]) === null || _e === void 0 ? void 0 : _e.currentViewId) !== null && _f !== void 0 ? _f : section === null || section === void 0 ? void 0 : section.defaultView) !== null && _g !== void 0 ? _g : (_h = section === null || section === void 0 ? void 0 : section.views) === null || _h === void 0 ? void 0 : _h[0]) !== null && _j !== void 0 ? _j : null;
    });
    const timerRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(null);
    const lastSidebarRef = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useRef(null);
    // Find the sidebar layout widget on the current view.
    const findSidebarOfCurrentView = jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useCallback(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (!currentViewId) {
            return null;
        }
        const state = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().getState();
        const layoutId = (_d = (_c = (_b = (_a = state.appConfig) === null || _a === void 0 ? void 0 : _a.views) === null || _b === void 0 ? void 0 : _b[currentViewId]) === null || _c === void 0 ? void 0 : _c.layout) === null || _d === void 0 ? void 0 : _d.LARGE;
        const layout = layoutId ? (_f = (_e = state.appConfig) === null || _e === void 0 ? void 0 : _e.layouts) === null || _f === void 0 ? void 0 : _f[layoutId] : null;
        for (const key of Object.keys((_g = layout === null || layout === void 0 ? void 0 : layout.content) !== null && _g !== void 0 ? _g : {})) {
            const widgetId = (_h = layout.content[key]) === null || _h === void 0 ? void 0 : _h.widgetId;
            const widget = widgetId ? (_k = (_j = state.appConfig) === null || _j === void 0 ? void 0 : _j.widgets) === null || _k === void 0 ? void 0 : _k[widgetId] : null;
            if ((widget === null || widget === void 0 ? void 0 : widget.uri) === 'widgets/layout/sidebar/') {
                return widgetId;
            }
        }
        return null;
    }, [currentViewId]);
    // When the view changes (or on first load), expand that view's sidebar for
    // `delay` ms, then collapse it again.
    jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useEffect(() => {
        if (!sectionId || !currentViewId) {
            return;
        }
        const sidebarId = findSidebarOfCurrentView();
        if (!sidebarId) {
            return;
        }
        const store = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)();
        // Collapse the previous view's sidebar if it is still open.
        if (lastSidebarRef.current && lastSidebarRef.current !== sidebarId) {
            store.dispatch(jimu_core__WEBPACK_IMPORTED_MODULE_1__.appActions.widgetStatePropChange(lastSidebarRef.current, 'collapse', false));
        }
        lastSidebarRef.current = sidebarId;
        store.dispatch(jimu_core__WEBPACK_IMPORTED_MODULE_1__.appActions.widgetStatePropChange(sidebarId, 'collapse', true));
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
            store.dispatch(jimu_core__WEBPACK_IMPORTED_MODULE_1__.appActions.widgetStatePropChange(sidebarId, 'collapse', false));
            timerRef.current = null;
        }, delay);
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [currentViewId, sectionId, delay, findSidebarOfCurrentView]);
    jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.useEffect(() => {
        return () => {
            if (lastSidebarRef.current) {
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().dispatch(jimu_core__WEBPACK_IMPORTED_MODULE_1__.appActions.widgetStatePropChange(lastSidebarRef.current, 'collapse', false));
            }
        };
    }, []);
    if (!sectionId) {
        return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.WidgetPlaceholder, { icon: (_icon_svg__WEBPACK_IMPORTED_MODULE_4___default()), message: translate('selectSection'), widgetId: props.id });
    }
    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "widget-sidebar-peek", css: style });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9zaWRlYmFyLXBlZWsvZGlzdC9ydW50aW1lL3dpZGdldC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1VDs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsaUVBQWU7SUFDYixZQUFZLEVBQUUsY0FBYztJQUM1QixhQUFhLEVBQUUsc0VBQXNFO0NBQ3RGOzs7Ozs7Ozs7Ozs7QUNIRCx1RDs7Ozs7Ozs7Ozs7QUNBQSx3RTs7Ozs7Ozs7Ozs7QUNBQSxxRDs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0M1QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1dDTkEsMkI7Ozs7Ozs7Ozs7QUNBQTs7O0tBR0s7QUFDTCxxQkFBdUIsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKa0U7QUFDMUU7QUFFUztBQUNuQjtBQUVqQyxNQUFNLEtBQUssR0FBRyw4Q0FBRzs7Q0FFaEI7QUFFRCxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQStCLEVBQUUsRUFBRTs7SUFDakQsTUFBTSxTQUFTLEdBQUcsNENBQUssQ0FBQyxjQUFjLENBQUMsNkRBQWUsQ0FBQztJQUN2RCxNQUFNLFNBQVMsR0FBRyxXQUFLLENBQUMsTUFBTSwwQ0FBRSxTQUFTO0lBQ3pDLE1BQU0s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LEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUk7SUFDbkcsQ0FBQztJQUVELE9BQU8seUVBQUssU0FBUyxFQUFDLHFCQUFxQixFQUFDLEdBQUcsRUFBRSxLQUFLLEdBQUk7QUFDNUQsQ0FBQztBQUVELGlFQUFlLE1BQU07QUFFYixTQUFTLDJCQUEyQixDQUFDLEdBQUcsSUFBSSxxQkFBdUIsR0FBRyxHQUFHLEVBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9zaWRlYmFyLXBlZWsvaWNvbi5zdmciLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL3NpZGViYXItcGVlay9zcmMvcnVudGltZS90cmFuc2xhdGlvbnMvZGVmYXVsdC50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1jb3JlL2Vtb3Rpb25cIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtdWlcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi9qaW11LWNvcmUvbGliL3NldC1wdWJsaWMtcGF0aC50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvc2lkZWJhci1wZWVrL3NyYy9ydW50aW1lL3dpZGdldC50c3giXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTYgMTZcXFwiPjxjaXJjbGUgY3g9XFxcIjhcXFwiIGN5PVxcXCI4XFxcIiByPVxcXCI2XFxcIiBmaWxsPVxcXCJub25lXFxcIiBzdHJva2U9XFxcImN1cnJlbnRDb2xvclxcXCIgc3Ryb2tlLXdpZHRoPVxcXCIxLjZcXFwiPjwvY2lyY2xlPjxwYXRoIGZpbGw9XFxcIm5vbmVcXFwiIHN0cm9rZT1cXFwiY3VycmVudENvbG9yXFxcIiBzdHJva2UtbGluZWNhcD1cXFwicm91bmRcXFwiIHN0cm9rZS13aWR0aD1cXFwiMS42XFxcIiBkPVxcXCJNOCA0LjVWOGwyLjUgMS41XFxcIj48L3BhdGg+PC9zdmc+XCIiLCJleHBvcnQgZGVmYXVsdCB7XG4gIF93aWRnZXRMYWJlbDogJ1NpZGViYXIgUGVlaycsXG4gIHNlbGVjdFNlY3Rpb246ICdTZWxlY3QgYSBzZWN0aW9uIGluIHRoZSB3aWRnZXQgc2V0dGluZ3MgdG8gZW5hYmxlIHRoZSBwZWVrIGJlaGF2aW9yLidcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2NvcmVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfX2Vtb3Rpb25fcmVhY3RfanN4X3J1bnRpbWVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV91aV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7IiwiLyoqXHJcbiAqIFdlYnBhY2sgd2lsbCByZXBsYWNlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHdpdGggX193ZWJwYWNrX3JlcXVpcmVfXy5wIHRvIHNldCB0aGUgcHVibGljIHBhdGggZHluYW1pY2FsbHkuXHJcbiAqIFRoZSByZWFzb24gd2h5IHdlIGNhbid0IHNldCB0aGUgcHVibGljUGF0aCBpbiB3ZWJwYWNrIGNvbmZpZyBpczogd2UgY2hhbmdlIHRoZSBwdWJsaWNQYXRoIHdoZW4gZG93bmxvYWQuXHJcbiAqICovXHJcbl9fd2VicGFja19wdWJsaWNfcGF0aF9fID0gd2luZG93LmppbXVDb25maWcuYmFzZVVybFxyXG4iLCJpbXBvcnQgeyBSZWFjdCwgdHlwZSBBbGxXaWRnZXRQcm9wcywgdHlwZSBJTVN0YXRlLCBnZXRBcHBTdG9yZSwgYXBwQWN0aW9ucywgUmVhY3RSZWR1eCwgaG9va3MsIGNzcyB9IGZyb20gJ2ppbXUtY29yZSdcbmltcG9ydCB7IFdpZGdldFBsYWNlaG9sZGVyIH0gZnJvbSAnamltdS11aSdcbmltcG9ydCB0eXBlIHsgSU1Db25maWcgfSBmcm9tICcuLi9jb25maWcnXG5pbXBvcnQgZGVmYXVsdE1lc3NhZ2VzIGZyb20gJy4vdHJhbnNsYXRpb25zL2RlZmF1bHQnXG5pbXBvcnQgaWNvbiBmcm9tICcuLi8uLi9pY29uLnN2ZydcblxuY29uc3Qgc3R5bGUgPSBjc3NgXG4gIGRpc3BsYXk6IG5vbmU7XG5gXG5cbmNvbnN0IFdpZGdldCA9IChwcm9wczogQWxsV2lkZ2V0UHJvcHM8SU1Db25maWc+KSA9PiB7XG4gIGNvbnN0IHRyYW5zbGF0ZSA9IGhvb2tzLnVzZVRyYW5zbGF0aW9uKGRlZmF1bHRNZXNzYWdlcylcbiAgY29uc3Qgc2VjdGlvbklkID0gcHJvcHMuY29uZmlnPy5zZWN0aW9uSWRcbiAgY29uc3QgZGVsYXkgPSBwcm9wcy5jb25maWc/LmRlbGF5TXMgPz8gNTAwMFxuXG4gIGNvbnN0IGN1cnJlbnRWaWV3SWQgPSBSZWFjdFJlZHV4LnVzZVNlbGVjdG9yKChzdGF0ZTogSU1TdGF0ZSkgPT4ge1xuICAgIGlmICghc2VjdGlvbklkKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBjb25zdCBzZWN0aW9uID0gc3RhdGUuYXBwQ29uZmlnPy5zZWN0aW9ucz8uW3NlY3Rpb25JZF1cbiAgICByZXR1cm4gc3RhdGUuYXBwUnVudGltZUluZm8/LnNlY3Rpb25OYXZJbmZvcz8uW3NlY3Rpb25JZF0/LmN1cnJlbnRWaWV3SWQgPz9cbiAgICAgIHNlY3Rpb24/LmRlZmF1bHRWaWV3ID8/XG4gICAgICBzZWN0aW9uPy52aWV3cz8uWzBdID8/XG4gICAgICBudWxsXG4gIH0pXG5cbiAgY29uc3QgdGltZXJSZWYgPSBSZWFjdC51c2VSZWY8bnVtYmVyPihudWxsKVxuICBjb25zdCBsYXN0U2lkZWJhclJlZiA9IFJlYWN0LnVzZVJlZjxzdHJpbmc+KG51bGwpXG5cbiAgLy8gRmluZCB0aGUgc2lkZWJhciBsYXlvdXQgd2lkZ2V0IG9uIHRoZSBjdXJyZW50IHZpZXcuXG4gIGNvbnN0IGZpbmRTaWRlYmFyT2ZDdXJyZW50VmlldyA9IFJlYWN0LnVzZUNhbGxiYWNrKCgpOiBzdHJpbmcgPT4ge1xuICAgIGlmICghY3VycmVudFZpZXdJZCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gICAgY29uc3Qgc3RhdGUgPSBnZXRBcHBTdG9yZSgpLmdldFN0YXRlKClcbiAgICBjb25zdCBsYXlvdXRJZCA9IHN0YXRlLmFwcENvbmZpZz8udmlld3M/LltjdXJyZW50Vmlld0lkXT8ubGF5b3V0Py5MQVJHRVxuICAgIGNvbnN0IGxheW91dCA9IGxheW91dElkID8gc3RhdGUuYXBwQ29uZmlnPy5sYXlvdXRzPy5bbGF5b3V0SWRdIDogbnVsbFxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGxheW91dD8uY29udGVudCA/PyB7fSkpIHtcbiAgICAgIGNvbnN0IHdpZGdldElkID0gbGF5b3V0LmNvbnRlbnRba2V5XT8ud2lkZ2V0SWRcbiAgICAgIGNvbnN0IHdpZGdldCA9IHdpZGdldElkID8gc3RhdGUuYXBwQ29uZmlnPy53aWRnZXRzPy5bd2lkZ2V0SWRdIDogbnVsbFxuICAgICAgaWYgKHdpZGdldD8udXJpID09PSAnd2lkZ2V0cy9sYXlvdXQvc2lkZWJhci8nKSB7XG4gICAgICAgIHJldHVybiB3aWRnZXRJZFxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9LCBbY3VycmVudFZpZXdJZF0pXG5cbiAgLy8gV2hlbiB0aGUgdmlldyBjaGFuZ2VzIChvciBvbiBmaXJzdCBsb2FkKSwgZXhwYW5kIHRoYXQgdmlldydzIHNpZGViYXIgZm9yXG4gIC8vIGBkZWxheWAgbXMsIHRoZW4gY29sbGFwc2UgaXQgYWdhaW4uXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFzZWN0aW9uSWQgfHwgIWN1cnJlbnRWaWV3SWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzaWRlYmFySWQgPSBmaW5kU2lkZWJhck9mQ3VycmVudFZpZXcoKVxuICAgIGlmICghc2lkZWJhcklkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgc3RvcmUgPSBnZXRBcHBTdG9yZSgpXG4gICAgLy8gQ29sbGFwc2UgdGhlIHByZXZpb3VzIHZpZXcncyBzaWRlYmFyIGlmIGl0IGlzIHN0aWxsIG9wZW4uXG4gICAgaWYgKGxhc3RTaWRlYmFyUmVmLmN1cnJlbnQgJiYgbGFzdFNpZGViYXJSZWYuY3VycmVudCAhPT0gc2lkZWJhcklkKSB7XG4gICAgICBzdG9yZS5kaXNwYXRjaChhcHBBY3Rpb25zLndpZGdldFN0YXRlUHJvcENoYW5nZShsYXN0U2lkZWJhclJlZi5jdXJyZW50LCAnY29sbGFwc2UnLCBmYWxzZSkpXG4gICAgfVxuICAgIGxhc3RTaWRlYmFyUmVmLmN1cnJlbnQgPSBzaWRlYmFySWRcbiAgICBzdG9yZS5kaXNwYXRjaChhcHBBY3Rpb25zLndpZGdldFN0YXRlUHJvcENoYW5nZShzaWRlYmFySWQsICdjb2xsYXBzZScsIHRydWUpKVxuICAgIGlmICh0aW1lclJlZi5jdXJyZW50KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJSZWYuY3VycmVudClcbiAgICB9XG4gICAgdGltZXJSZWYuY3VycmVudCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHN0b3JlLmRpc3BhdGNoKGFwcEFjdGlvbnMud2lkZ2V0U3RhdGVQcm9wQ2hhbmdlKHNpZGViYXJJZCwgJ2NvbGxhcHNlJywgZmFsc2UpKVxuICAgICAgdGltZXJSZWYuY3VycmVudCA9IG51bGxcbiAgICB9LCBkZWxheSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHRpbWVyUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyUmVmLmN1cnJlbnQpXG4gICAgICAgIHRpbWVyUmVmLmN1cnJlbnQgPSBudWxsXG4gICAgICB9XG4gICAgfVxuICB9LCBbY3VycmVudFZpZXdJZCwgc2VjdGlvbklkLCBkZWxheSwgZmluZFNpZGViYXJPZkN1cnJlbnRWaWV3XSlcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAobGFzdFNpZGViYXJSZWYuY3VycmVudCkge1xuICAgICAgICBnZXRBcHBTdG9yZSgpLmRpc3BhdGNoKGFwcEFjdGlvbnMud2lkZ2V0U3RhdGVQcm9wQ2hhbmdlKGxhc3RTaWRlYmFyUmVmLmN1cnJlbnQsICdjb2xsYXBzZScsIGZhbHNlKSlcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtdKVxuXG4gIGlmICghc2VjdGlvbklkKSB7XG4gICAgcmV0dXJuIDxXaWRnZXRQbGFjZWhvbGRlciBpY29uPXtpY29ufSBtZXNzYWdlPXt0cmFuc2xhdGUoJ3NlbGVjdFNlY3Rpb24nKX0gd2lkZ2V0SWQ9e3Byb3BzLmlkfSAvPlxuICB9XG5cbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwid2lkZ2V0LXNpZGViYXItcGVla1wiIGNzcz17c3R5bGV9IC8+XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdpZGdldFxuXG4gZXhwb3J0IGZ1bmN0aW9uIF9fc2V0X3dlYnBhY2tfcHVibGljX3BhdGhfXyh1cmwpIHsgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB1cmwgfSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==