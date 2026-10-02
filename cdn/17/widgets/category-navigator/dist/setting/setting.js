System.register(["jimu-core/emotion","jimu-core","jimu-ui/advanced/setting-components","jimu-ui"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__, "__esModule", { value: true });
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
				__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__[key] = module[key];
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

/***/ "./your-extensions/widgets/category-navigator/src/setting/translations/default.ts"
/*!****************************************************************************************!*\
  !*** ./your-extensions/widgets/category-navigator/src/setting/translations/default.ts ***!
  \****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    section: 'Section',
    none: 'None',
    categories: 'Categories',
    category: 'Category',
    categoryLabel: 'Category label',
    views: 'Views',
    addCategory: 'Add category',
    removeCategory: 'Remove category',
    remove: 'Remove',
    newCategory: 'New Category',
    selectSectionFirst: 'Select a section first to add categories.'
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

/***/ },

/***/ "jimu-ui/advanced/setting-components"
/*!******************************************************!*\
  !*** external "jimu-ui/advanced/setting-components" ***!
  \******************************************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__;

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
/*!****************************************************************************!*\
  !*** ./your-extensions/widgets/category-navigator/src/setting/setting.tsx ***!
  \****************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui/advanced/setting-components */ "jimu-ui/advanced/setting-components");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./translations/default */ "./your-extensions/widgets/category-navigator/src/setting/translations/default.ts");





const Setting = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const translate = jimu_core__WEBPACK_IMPORTED_MODULE_1__.hooks.useTranslation(_translations_default__WEBPACK_IMPORTED_MODULE_4__["default"]);
    const { id, config, onSettingChange } = props;
    const appConfig = (_b = (_a = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().getState()) === null || _a === void 0 ? void 0 : _a.appStateInBuilder) === null || _b === void 0 ? void 0 : _b.appConfig;
    const sections = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.sections) !== null && _c !== void 0 ? _c : {};
    const views = (_d = appConfig === null || appConfig === void 0 ? void 0 : appConfig.views) !== null && _d !== void 0 ? _d : {};
    const sectionId = (_e = config === null || config === void 0 ? void 0 : config.sectionId) !== null && _e !== void 0 ? _e : '';
    const categories = (_f = config === null || config === void 0 ? void 0 : config.categories) !== null && _f !== void 0 ? _f : [];
    const sectionViews = sectionId ? ((_h = (_g = sections[sectionId]) === null || _g === void 0 ? void 0 : _g.views) !== null && _h !== void 0 ? _h : []) : [];
    const handleSectionChange = (value) => {
        onSettingChange({
            id,
            config: config.set('sectionId', value)
        });
    };
    const handleAddCategory = () => {
        const newCategory = { label: translate('newCategory'), viewIds: [] };
        onSettingChange({
            id,
            config: config.set('categories', categories.concat([newCategory]))
        });
    };
    const handleRemoveCategory = (index) => {
        onSettingChange({
            id,
            config: config.set('categories', categories.filter((category, i) => i !== index))
        });
    };
    const handleLabelChange = (index, value) => {
        onSettingChange({
            id,
            config: config.setIn(['categories', index, 'label'], value)
        });
    };
    const handleViewsChange = (index, values) => {
        onSettingChange({
            id,
            config: config.setIn(['categories', index, 'viewIds'], values)
        });
    };
    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "widget-setting-category-navigator", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingSection, { title: translate('section'), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, { flow: "wrap", label: translate('section'), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Select, { value: sectionId, onChange: (e) => handleSectionChange(e.target.value), size: "sm", "aria-label": translate('section'), children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Option, { value: "", children: translate('none') }), Object.keys(sections).map((id) => {
                                var _a, _b;
                                return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Option, { value: id, children: (_b = (_a = sections[id]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : id }, id));
                            })] }) }) }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingSection, { title: translate('categories'), children: [categories.map((category, index) => {
                        var _a;
                        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-2", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, { flow: "wrap", label: `${translate('category')} ${index + 1}`, children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.TextInput, { className: "w-100", size: "sm", value: category.label, "aria-label": translate('categoryLabel'), onChange: (e) => handleLabelChange(index, e.target.value) }) }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, { flow: "wrap", label: translate('views'), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-100 d-flex align-items-center", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.MultiSelect, { className: "flex-grow-1", size: "sm", values: (_a = category.viewIds) !== null && _a !== void 0 ? _a : [], onChange: (value, values) => handleViewsChange(index, values), "aria-label": translate('views'), children: sectionViews.map((viewId) => {
                                                    var _a, _b, _c, _d;
                                                    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.MultiSelectItem, { value: viewId, label: (_b = (_a = views[viewId]) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : viewId, children: (_d = (_c = views[viewId]) === null || _c === void 0 ? void 0 : _c.label) !== null && _d !== void 0 ? _d : viewId }, viewId));
                                                }) }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Button, { className: "ml-2", size: "sm", type: "tertiary", title: translate('removeCategory'), "aria-label": translate('removeCategory'), onClick: () => handleRemoveCategory(index), children: translate('remove') })] }) })] }, index));
                    }), sectionId && ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_2__.SettingRow, { children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Button, { size: "sm", type: "secondary", onClick: handleAddCategory, children: translate('addCategory') }) })), !sectionId && (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_3__.Label, { className: "d-block mt-2", children: translate('selectSectionFirst') })] })] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Setting);
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9jYXRlZ29yeS1uYXZpZ2F0b3IvZGlzdC9zZXR0aW5nL3NldHRpbmcuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlFQUFlO0lBQ2IsT0FBTyxFQUFFLFNBQVM7SUFDbEIsSUFBSSxFQUFFLE1BQU07SUFDWixVQUFVLEVBQUUsWUFBWTtJQUN4QixRQUFRLEVBQUUsVUFBVTtJQUNwQixhQUFhLEVBQUUsZ0JBQWdCO0lBQy9CLEtBQUssRUFBRSxPQUFPO0lBQ2QsV0FBVyxFQUFFLGNBQWM7SUFDM0IsY0FBYyxFQUFFLGlCQUFpQjtJQUNqQyxNQUFNLEVBQUUsUUFBUTtJQUNoQixXQUFXLEVBQUUsY0FBYztJQUMzQixrQkFBa0IsRUFBRSwyQ0FBMkM7Q0FDaEU7Ozs7Ozs7Ozs7OztBQ1pELHVEOzs7Ozs7Ozs7OztBQ0FBLHdFOzs7Ozs7Ozs7OztBQ0FBLHFEOzs7Ozs7Ozs7OztBQ0FBLGlGOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQzVCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7O1dDTkEsMkI7Ozs7Ozs7Ozs7QUNBQTs7O0tBR0s7QUFDTCxxQkFBdUIsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pFO0FBRTJCO0FBQ2dCO0FBRTVDO0FBRXBELE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBc0MsRUFBRSxF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Q0FBQyxTQUFTLElBQUksZ0VBQUMsMENBQUssSUFBQyxTQUFTLEVBQUMsY0FBYyxZQUFFLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFTLElBQ3pFLElBQ2IsQ0FDUDtBQUNILENBQUM7QUFFRCxpRUFBZSxPQUFPO0FBRWQsU0FBUywyQkFBMkIsQ0FBQyxHQUFHLElBQUkscUJBQXVCLEdBQUcsR0FBRyxFQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY2F0ZWdvcnktbmF2aWdhdG9yL3NyYy9zZXR0aW5nL3RyYW5zbGF0aW9ucy9kZWZhdWx0LnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1jb3JlXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LWNvcmUvZW1vdGlvblwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS11aVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS11aS9hZHZhbmNlZC9zZXR0aW5nLWNvbXBvbmVudHNcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4vamltdS1jb3JlL2xpYi9zZXQtcHVibGljLXBhdGgudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL2NhdGVnb3J5LW5hdmlnYXRvci9zcmMvc2V0dGluZy9zZXR0aW5nLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIHNlY3Rpb246ICdTZWN0aW9uJyxcbiAgbm9uZTogJ05vbmUnLFxuICBjYXRlZ29yaWVzOiAnQ2F0ZWdvcmllcycsXG4gIGNhdGVnb3J5OiAnQ2F0ZWdvcnknLFxuICBjYXRlZ29yeUxhYmVsOiAnQ2F0ZWdvcnkgbGFiZWwnLFxuICB2aWV3czogJ1ZpZXdzJyxcbiAgYWRkQ2F0ZWdvcnk6ICdBZGQgY2F0ZWdvcnknLFxuICByZW1vdmVDYXRlZ29yeTogJ1JlbW92ZSBjYXRlZ29yeScsXG4gIHJlbW92ZTogJ1JlbW92ZScsXG4gIG5ld0NhdGVnb3J5OiAnTmV3IENhdGVnb3J5JyxcbiAgc2VsZWN0U2VjdGlvbkZpcnN0OiAnU2VsZWN0IGEgc2VjdGlvbiBmaXJzdCB0byBhZGQgY2F0ZWdvcmllcy4nXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV9jb3JlX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX19lbW90aW9uX3JlYWN0X2pzeF9ydW50aW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfdWlfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV91aV9hZHZhbmNlZF9zZXR0aW5nX2NvbXBvbmVudHNfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCIvKipcclxuICogV2VicGFjayB3aWxsIHJlcGxhY2UgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gd2l0aCBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgdG8gc2V0IHRoZSBwdWJsaWMgcGF0aCBkeW5hbWljYWxseS5cclxuICogVGhlIHJlYXNvbiB3aHkgd2UgY2FuJ3Qgc2V0IHRoZSBwdWJsaWNQYXRoIGluIHdlYnBhY2sgY29uZmlnIGlzOiB3ZSBjaGFuZ2UgdGhlIHB1YmxpY1BhdGggd2hlbiBkb3dubG9hZC5cclxuICogKi9cclxuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB3aW5kb3cuamltdUNvbmZpZy5iYXNlVXJsXHJcbiIsImltcG9ydCB7IFJlYWN0LCBob29rcywgZ2V0QXBwU3RvcmUgfSBmcm9tICdqaW11LWNvcmUnXG5pbXBvcnQgdHlwZSB7IEFsbFdpZGdldFNldHRpbmdQcm9wcyB9IGZyb20gJ2ppbXUtZm9yLWJ1aWxkZXInXG5pbXBvcnQgeyBTZXR0aW5nU2VjdGlvbiwgU2V0dGluZ1JvdyB9IGZyb20gJ2ppbXUtdWkvYWR2YW5jZWQvc2V0dGluZy1jb21wb25lbnRzJ1xuaW1wb3J0IHsgU2VsZWN0LCBPcHRpb24sIEJ1dHRvbiwgTGFiZWwsIFRleHRJbnB1dCwgTXVsdGlTZWxlY3QsIE11bHRpU2VsZWN0SXRlbSB9IGZyb20gJ2ppbXUtdWknXG5pbXBvcnQgdHlwZSB7IElNQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJ1xuaW1wb3J0IGRlZmF1bHRNZXNzYWdlcyBmcm9tICcuL3RyYW5zbGF0aW9ucy9kZWZhdWx0J1xuXG5jb25zdCBTZXR0aW5nID0gKHByb3BzOiBBbGxXaWRnZXRTZXR0aW5nUHJvcHM8SU1Db25maWc+KSA9PiB7XG4gIGNvbnN0IHRyYW5zbGF0ZSA9IGhvb2tzLnVzZVRyYW5zbGF0aW9uKGRlZmF1bHRNZXNzYWdlcylcbiAgY29uc3QgeyBpZCwgY29uZmlnLCBvblNldHRpbmdDaGFuZ2UgfSA9IHByb3BzXG5cbiAgY29uc3QgYXBwQ29uZmlnID0gZ2V0QXBwU3RvcmUoKS5nZXRTdGF0ZSgpPy5hcHBTdGF0ZUluQnVpbGRlcj8uYXBwQ29uZmlnXG4gIGNvbnN0IHNlY3Rpb25zID0gYXBwQ29uZmlnPy5zZWN0aW9ucyA/PyB7fVxuICBjb25zdCB2aWV3cyA9IGFwcENvbmZpZz8udmlld3MgPz8ge31cblxuICBjb25zdCBzZWN0aW9uSWQgPSBjb25maWc/LnNlY3Rpb25JZCA/PyAnJ1xuICBjb25zdCBjYXRlZ29yaWVzID0gY29uZmlnPy5jYXRlZ29yaWVzID8/IFtdXG5cbiAgY29uc3Qgc2VjdGlvblZpZXdzID0gc2VjdGlvbklkID8gKHNlY3Rpb25zW3NlY3Rpb25JZF0/LnZpZXdzID8/IFtdKSA6IFtdXG5cbiAgY29uc3QgaGFuZGxlU2VjdGlvbkNoYW5nZSA9ICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgb25TZXR0aW5nQ2hhbmdlKHtcbiAgICAgIGlkLFxuICAgICAgY29uZmlnOiBjb25maWcuc2V0KCdzZWN0aW9uSWQnLCB2YWx1ZSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQWRkQ2F0ZWdvcnkgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV3Q2F0ZWdvcnkgPSB7IGxhYmVsOiB0cmFuc2xhdGUoJ25ld0NhdGVnb3J5JyksIHZpZXdJZHM6IFtdIH1cbiAgICBvblNldHRpbmdDaGFuZ2Uoe1xuICAgICAgaWQsXG4gICAgICBjb25maWc6IGNvbmZpZy5zZXQoJ2NhdGVnb3JpZXMnLCBjYXRlZ29yaWVzLmNvbmNhdChbbmV3Q2F0ZWdvcnldKSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgaGFuZGxlUmVtb3ZlQ2F0ZWdvcnkgPSAoaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIG9uU2V0dGluZ0NoYW5nZSh7XG4gICAgICBpZCxcbiAgICAgIGNvbmZpZzogY29uZmlnLnNldCgnY2F0ZWdvcmllcycsIGNhdGVnb3JpZXMuZmlsdGVyKChjYXRlZ29yeSwgaSkgPT4gaSAhPT0gaW5kZXgpKVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBoYW5kbGVMYWJlbENoYW5nZSA9IChpbmRleDogbnVtYmVyLCB2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgb25TZXR0aW5nQ2hhbmdlKHtcbiAgICAgIGlkLFxuICAgICAgY29uZmlnOiBjb25maWcuc2V0SW4oWydjYXRlZ29yaWVzJywgaW5kZXgsICdsYWJlbCddLCB2YWx1ZSlcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVmlld3NDaGFuZ2UgPSAoaW5kZXg6IG51bWJlciwgdmFsdWVzOiBzdHJpbmdbXSkgPT4ge1xuICAgIG9uU2V0dGluZ0NoYW5nZSh7XG4gICAgICBpZCxcbiAgICAgIGNvbmZpZzogY29uZmlnLnNldEluKFsnY2F0ZWdvcmllcycsIGluZGV4LCAndmlld0lkcyddLCB2YWx1ZXMpXG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ3aWRnZXQtc2V0dGluZy1jYXRlZ29yeS1uYXZpZ2F0b3JcIj5cbiAgICAgIDxTZXR0aW5nU2VjdGlvbiB0aXRsZT17dHJhbnNsYXRlKCdzZWN0aW9uJyl9PlxuICAgICAgICA8U2V0dGluZ1JvdyBmbG93PVwid3JhcFwiIGxhYmVsPXt0cmFuc2xhdGUoJ3NlY3Rpb24nKX0+XG4gICAgICAgICAgPFNlbGVjdCB2YWx1ZT17c2VjdGlvbklkfSBvbkNoYW5nZT17KGUpID0+IGhhbmRsZVNlY3Rpb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfSBzaXplPVwic21cIiBhcmlhLWxhYmVsPXt0cmFuc2xhdGUoJ3NlY3Rpb24nKX0+XG4gICAgICAgICAgICA8T3B0aW9uIHZhbHVlPVwiXCI+e3RyYW5zbGF0ZSgnbm9uZScpfTwvT3B0aW9uPlxuICAgICAgICAgICAge09iamVjdC5rZXlzKHNlY3Rpb25zKS5tYXAoKGlkKSA9PiAoXG4gICAgICAgICAgICAgIDxPcHRpb24ga2V5PXtpZH0gdmFsdWU9e2lkfT5cbiAgICAgICAgICAgICAgICB7c2VjdGlvbnNbaWRdPy5sYWJlbCA/PyBpZH1cbiAgICAgICAgICAgICAgPC9PcHRpb24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L1NlbGVjdD5cbiAgICAgICAgPC9TZXR0aW5nUm93PlxuICAgICAgPC9TZXR0aW5nU2VjdGlvbj5cblxuICAgICAgPFNldHRpbmdTZWN0aW9uIHRpdGxlPXt0cmFuc2xhdGUoJ2NhdGVnb3JpZXMnKX0+XG4gICAgICAgIHtjYXRlZ29yaWVzLm1hcCgoY2F0ZWdvcnksIGluZGV4KSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e2luZGV4fSBjbGFzc05hbWU9XCJtYi0yXCI+XG4gICAgICAgICAgICA8U2V0dGluZ1JvdyBmbG93PVwid3JhcFwiIGxhYmVsPXtgJHt0cmFuc2xhdGUoJ2NhdGVnb3J5Jyl9ICR7aW5kZXggKyAxfWB9PlxuICAgICAgICAgICAgICA8VGV4dElucHV0XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy0xMDBcIlxuICAgICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2NhdGVnb3J5LmxhYmVsfVxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3RyYW5zbGF0ZSgnY2F0ZWdvcnlMYWJlbCcpfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gaGFuZGxlTGFiZWxDaGFuZ2UoaW5kZXgsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvU2V0dGluZ1Jvdz5cbiAgICAgICAgICAgIDxTZXR0aW5nUm93IGZsb3c9XCJ3cmFwXCIgbGFiZWw9e3RyYW5zbGF0ZSgndmlld3MnKX0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMDAgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxuICAgICAgICAgICAgICAgIDxNdWx0aVNlbGVjdFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC1ncm93LTFcIlxuICAgICAgICAgICAgICAgICAgc2l6ZT1cInNtXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlcz17Y2F0ZWdvcnkudmlld0lkcyA/PyBbXX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodmFsdWUsIHZhbHVlcykgPT4gaGFuZGxlVmlld3NDaGFuZ2UoaW5kZXgsIHZhbHVlcyBhcyBzdHJpbmdbXSl9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0cmFuc2xhdGUoJ3ZpZXdzJyl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3NlY3Rpb25WaWV3cy5tYXAoKHZpZXdJZCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8TXVsdGlTZWxlY3RJdGVtIGtleT17dmlld0lkfSB2YWx1ZT17dmlld0lkfSBsYWJlbD17dmlld3Nbdmlld0lkXT8ubGFiZWwgPz8gdmlld0lkfT5cbiAgICAgICAgICAgICAgICAgICAgICB7dmlld3Nbdmlld0lkXT8ubGFiZWwgPz8gdmlld0lkfVxuICAgICAgICAgICAgICAgICAgICA8L011bHRpU2VsZWN0SXRlbT5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvTXVsdGlTZWxlY3Q+XG4gICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWwtMlwiXG4gICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgdHlwZT1cInRlcnRpYXJ5XCJcbiAgICAgICAgICAgICAgICAgIHRpdGxlPXt0cmFuc2xhdGUoJ3JlbW92ZUNhdGVnb3J5Jyl9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0cmFuc2xhdGUoJ3JlbW92ZUNhdGVnb3J5Jyl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVSZW1vdmVDYXRlZ29yeShpbmRleCl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3RyYW5zbGF0ZSgncmVtb3ZlJyl9XG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TZXR0aW5nUm93PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgICAge3NlY3Rpb25JZCAmJiAoXG4gICAgICAgICAgPFNldHRpbmdSb3c+XG4gICAgICAgICAgICA8QnV0dG9uIHNpemU9XCJzbVwiIHR5cGU9XCJzZWNvbmRhcnlcIiBvbkNsaWNrPXtoYW5kbGVBZGRDYXRlZ29yeX0+XG4gICAgICAgICAgICAgIHt0cmFuc2xhdGUoJ2FkZENhdGVnb3J5Jyl9XG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L1NldHRpbmdSb3c+XG4gICAgICAgICl9XG4gICAgICAgIHshc2VjdGlvbklkICYmIDxMYWJlbCBjbGFzc05hbWU9XCJkLWJsb2NrIG10LTJcIj57dHJhbnNsYXRlKCdzZWxlY3RTZWN0aW9uRmlyc3QnKX08L0xhYmVsPn1cbiAgICAgIDwvU2V0dGluZ1NlY3Rpb24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ1xuXG4gZXhwb3J0IGZ1bmN0aW9uIF9fc2V0X3dlYnBhY2tfcHVibGljX3BhdGhfXyh1cmwpIHsgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB1cmwgfSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==