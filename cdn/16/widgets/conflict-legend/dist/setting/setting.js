System.register(["jimu-core/emotion","jimu-core","jimu-ui","jimu-ui/advanced/setting-components","jimu-ui/basic/color-picker","jimu-layouts/layout-runtime","jimu-arcgis"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui_basic_color_picker__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_layouts_layout_runtime__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE__emotion_react_jsx_runtime__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui_basic_color_picker__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_layouts_layout_runtime__, "__esModule", { value: true });
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
				__WEBPACK_EXTERNAL_MODULE_jimu_ui__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui_advanced_setting_components__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_ui_basic_color_picker__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui_basic_color_picker__[key] = module[key];
				});
			},
			function(module) {
				__WEBPACK_EXTERNAL_MODULE_jimu_layouts_layout_runtime__["default"] = module["default"] || module;
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_layouts_layout_runtime__[key] = module[key];
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

/***/ "./jimu-ui/lib/icons/uppercase.svg"
/*!*****************************************!*\
  !*** ./jimu-ui/lib/icons/uppercase.svg ***!
  \*****************************************/
(module) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 12 12\"><path fill=\"#000\" fill-rule=\"nonzero\" d=\"m6.828.535 4.966 11.01A.323.323 0 0 1 11.5 12a.78.78 0 0 1-.707-.455L9.182 8H2.818l-1.611 3.545A.78.78 0 0 1 .5 12a.323.323 0 0 1-.294-.456L5.172.535a.909.909 0 0 1 1.656 0M6 1 3.272 7h5.456z\"></path></svg>"

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

/***/ "./your-extensions/widgets/conflict-legend/src/setting/components/group-radios.tsx"
/*!*****************************************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/setting/components/group-radios.tsx ***!
  \*****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../translations/default */ "./your-extensions/widgets/conflict-legend/src/setting/translations/default.ts");
/* harmony import */ var jimu_layouts_layout_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jimu-layouts/layout-runtime */ "jimu-layouts/layout-runtime");

/** @jsx jsx */




const RadioItem = (props) => {
    const { onRadioChange, checked, itemId, name } = props;
    const translate = jimu_core__WEBPACK_IMPORTED_MODULE_1__.hooks.useTranslation(_translations_default__WEBPACK_IMPORTED_MODULE_3__["default"], jimu_layouts_layout_runtime__WEBPACK_IMPORTED_MODULE_4__.defaultMessages);
    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-100 legend-tools", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "legend-tools-item card-style-radio", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Label, { className: 'd-flex align-items-center', style: { cursor: 'pointer', fontWeight: 'normal' }, children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Radio, { id: itemId, name: name, className: 'mr-1', onChange: (e) => {
                            onRadioChange(e);
                        }, checked: checked }), translate(itemId)] }) }) }));
};
const GroupRadios = (props) => {
    const { itemsIds, itemsOptions, value, onChange, name } = props;
    const radiosContent = itemsIds.map((radioItemProps, index) => {
        const itemProps = {
            itemId: itemsIds[index],
            checked: value === itemsOptions[index],
            onRadioChange: () => { onChange(itemsOptions[index]); },
            name: name
        };
        return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(RadioItem, Object.assign({}, itemProps), index);
    });
    return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "card-layout-content pl-2", role: "radiogroup", css: groupRadioStyles, "aria-label": name, children: radiosContent }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GroupRadios);
const groupRadioStyles = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.css) `
  .legend-tools:last-child {
    .legend-tools-item {
      margin-bottom: -0.5rem;
    }
  }
`;


/***/ },

/***/ "./your-extensions/widgets/conflict-legend/src/setting/lib/style.ts"
/*!**************************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/setting/lib/style.ts ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getStyle: () => (/* binding */ getStyle)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");

function getStyle(theme) {
    return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.css) `
    .widget-setting-legend{
      font-weight: lighter;
      font-size: 13px;

      .source-descript {
        color: ${theme.ref.palette.neutral[1000]};
      }

      .webmap-thumbnail{
        cursor: auto;
        width: 100%;
        height: 120px;
        overflow: hidden;
        padding: 1px;
        border: ${jimu_core__WEBPACK_IMPORTED_MODULE_0__.polished.rem(2)} solid initial;
        img, div{
          width: 100%;
          height: 100%;
        }
      }

      .card-layout-content{
        width: 100%;
      }

      .legend-tools{
        .legend-tools-item{
          display: flex;
          margin-bottom: 8px;
        }
      }

      .advanced-setting-row .jimu-widget-setting--row-label {
        color: #c5c5c5;
        font-size: 0.875rem;
      }

      .map-selector-section .component-map-selector .form-control{
        width: 100%;
      }

      .jimu-builder--background-setting .background-image {
        display: none;
      }

      .jimu-builder--background-setting .background-image-fill-type {
        display: none;
      }
    }
  `;
}


/***/ },

/***/ "./your-extensions/widgets/conflict-legend/src/setting/translations/default.ts"
/*!*************************************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/setting/translations/default.ts ***!
  \*************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    sourceDescript: 'A web map or web scene, or any combination of the two.',
    showBaseMap: 'Show basemap legends',
    cardStyle: 'Use card style',
    showAllLegends: 'Show all layers',
    showWithinExtent: 'Show visible layers within current map extent',
    showVisible: 'Show visible layers',
    legendMode: 'Legend mode',
    respectLayerDefinitionExp: 'Respect layer filter settings',
    customizeDescription: 'Specify which layers will be displayed in the legend for each map'
});


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

/***/ "jimu-layouts/layout-runtime"
/*!**********************************************!*\
  !*** external "jimu-layouts/layout-runtime" ***!
  \**********************************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_layouts_layout_runtime__;

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

/***/ },

/***/ "jimu-ui/basic/color-picker"
/*!*********************************************!*\
  !*** external "jimu-ui/basic/color-picker" ***!
  \*********************************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui_basic_color_picker__;

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
/*!*************************************************************************!*\
  !*** ./your-extensions/widgets/conflict-legend/src/setting/setting.tsx ***!
  \*************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CardLayout: () => (/* binding */ CardLayout),
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "@emotion/react/jsx-runtime");
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/* harmony import */ var jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jimu-ui/advanced/setting-components */ "jimu-ui/advanced/setting-components");
/* harmony import */ var jimu_ui_basic_color_picker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jimu-ui/basic/color-picker */ "jimu-ui/basic/color-picker");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../config */ "./your-extensions/widgets/conflict-legend/src/config.ts");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./translations/default */ "./your-extensions/widgets/conflict-legend/src/setting/translations/default.ts");
/* harmony import */ var _lib_style__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/style */ "./your-extensions/widgets/conflict-legend/src/setting/lib/style.ts");
/* harmony import */ var _components_group_radios__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/group-radios */ "./your-extensions/widgets/conflict-legend/src/setting/components/group-radios.tsx");
/* harmony import */ var jimu_arcgis__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! jimu-arcgis */ "jimu-arcgis");

/** @jsx jsx */









const textIcon = __webpack_require__(/*! jimu-ui/lib/icons/uppercase.svg */ "./jimu-ui/lib/icons/uppercase.svg");
const allDefaultMessages = Object.assign({}, _translations_default__WEBPACK_IMPORTED_MODULE_6__["default"], jimu_ui__WEBPACK_IMPORTED_MODULE_2__.defaultMessages);
var CardLayout;
(function (CardLayout) {
    CardLayout["Auto"] = "auto";
    CardLayout["SideBySide"] = "side-by-side";
    CardLayout["Stack"] = "stack";
})(CardLayout || (CardLayout = {}));
class Setting extends jimu_core__WEBPACK_IMPORTED_MODULE_1__.React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.Immutable)([
            jimu_core__WEBPACK_IMPORTED_MODULE_1__.DataSourceTypes.WebMap,
            jimu_core__WEBPACK_IMPORTED_MODULE_1__.DataSourceTypes.WebScene
        ]);
        this.getPortUrl = () => {
            const portUrl = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.getAppStore)().getState().portalUrl;
            return portUrl;
        };
        this.onOptionsChanged = (checked, name) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, checked)
            });
            if (name === 'cardStyle') {
                this.setState({
                    cardStyle: checked
                });
            }
        };
        this.onCardLayoutChange = (cardLayout) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('cardLayout', cardLayout)
            });
            this.setState({
                cardLayoutValue: cardLayout
            });
        };
        this.onLegendModeChange = (legendMode) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('legendMode', legendMode)
            });
            this.setState({
                legendMode: legendMode
            });
        };
        this.onToggleUseDataEnabled = (useDataSourcesEnabled) => {
            this.props.onSettingChange({
                id: this.props.id,
                useDataSourcesEnabled
            });
        };
        this.onDataSourceChange = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: useDataSources
            });
        };
        this.onMapWidgetSelected = (useMapWidgetIds) => {
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.onUseCustomStyleChanged = (checked) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'useCustom'], checked)
            });
        };
        this.onFontStyleChanged = (color) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'fontColor'], color)
            });
        };
        this.onBackgroundStyleChange = (backgroundColor) => {
            var _a, _b, _c;
            const bg = {
                color: backgroundColor,
                fillType: jimu_ui__WEBPACK_IMPORTED_MODULE_2__.FillType.FILL
            };
            let background = (0,jimu_core__WEBPACK_IMPORTED_MODULE_1__.Immutable)((_c = (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b.background) !== null && _c !== void 0 ? _c : {});
            for (const key in bg) {
                switch (key) {
                    case 'fillType':
                        if (background.fillType !== bg[key]) {
                            background = background.set('fillType', bg[key]);
                        }
                        break;
                    case 'color':
                        background = background.set('color', bg[key]);
                        break;
                    case 'image':
                        background = background.set('image', bg[key]);
                        break;
                }
            }
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['style', 'background'], background)
            });
        };
        this.onListItemBodyClick = (dataSourceId) => {
            var _a;
            const jmvId = `${(_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0]}-${dataSourceId}`;
            this.setState({
                activeCustomizeJmvId: jmvId
            });
        };
        this.onCustomizeLayerChange = (enable, jlvIds) => {
            // No matter it's on/off, clean up the ids array
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['customizeLayerOptions', this.state.activeCustomizeJmvId], {
                    isEnabled: enable,
                    hiddenJimuLayerViewIds: [],
                    // Store all layer ids when enabling customization
                    showJimuLayerViewIds: enable ? [...jlvIds] : [],
                    showRuntimeAddedLayers: enable ? true : undefined
                })
            });
        };
        this.onShowRuntimeAddedLayersChange = (enable) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['customizeLayerOptions', this.state.activeCustomizeJmvId, 'showRuntimeAddedLayers'], enable)
            });
        };
        this.onLayerIdChange = (showJimuLayerViewIds) => {
            const newConfig = this.props.config.setIn(['customizeLayerOptions', this.state.activeCustomizeJmvId, 'showJimuLayerViewIds'], showJimuLayerViewIds);
            this.props.onSettingChange({
                id: this.props.id,
                config: newConfig
            });
        };
        this.hideLayers = (jimuLayerView) => {
            const parentJlv = jimuLayerView.getParentJimuLayerView();
            const hideParentTypes = [jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.MapImageLayer, jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.WMSLayer, jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.SubtypeGroupLayer];
            if (parentJlv && hideParentTypes.includes(parentJlv.type)) {
                return true;
            }
            // Hide layers that set legendEnabled to `false`
            if (jimuLayerView.layer.legendEnabled !== undefined && !jimuLayerView.layer.legendEnabled) {
                return true;
            }
            const hideLayerTypes = [jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.BuildingComponentSubLayer, jimu_core__WEBPACK_IMPORTED_MODULE_1__.SupportedJSAPILayerTypes.BuildingGroupSubLayer];
            return hideLayerTypes.includes(jimuLayerView.type);
        };
        this.getActiveCustomizeStatus = () => {
            var _a, _b, _c, _d;
            return (_d = (_c = (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.customizeLayerOptions) === null || _b === void 0 ? void 0 : _b[this.state.activeCustomizeJmvId]) === null || _c === void 0 ? void 0 : _c.isEnabled) !== null && _d !== void 0 ? _d : false;
        };
        this.getShowRuntimeAddedLayerStatus = () => {
            var _a, _b, _c, _d;
            return (_d = (_c = (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.customizeLayerOptions) === null || _b === void 0 ? void 0 : _b[this.state.activeCustomizeJmvId]) === null || _c === void 0 ? void 0 : _c.showRuntimeAddedLayers) !== null && _d !== void 0 ? _d : true;
        };
        this.getSelectedValues = () => {
            var _a, _b;
            // For the app that has `showJimuLayerViewIds`, uses it directly
            const ret = {};
            if ((_a = this.props.config) === null || _a === void 0 ? void 0 : _a.customizeLayerOptions) {
                for (const mapId of Object.keys((_b = this.props.config) === null || _b === void 0 ? void 0 : _b.customizeLayerOptions)) {
                    if (this.props.config.customizeLayerOptions[mapId].isEnabled) {
                        ret[mapId] = this.props.config.customizeLayerOptions[mapId].showJimuLayerViewIds;
                    }
                }
                return ret;
            }
            return (0,jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.getAllItemsInMapView)(this.state.activeCustomizeJmvId, false);
        };
        this.isMapWidgetEmpty = () => {
            var _a, _b, _c, _d;
            const mapViews = ((_b = jimu_arcgis__WEBPACK_IMPORTED_MODULE_9__.MapViewManager.getInstance().getJimuMapViewGroup((_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0])) === null || _b === void 0 ? void 0 : _b.jimuMapViews) || {};
            // The connected widget only have ONE map view & have no data source
            if (Object.keys(mapViews).length <= 1 && !((_d = (_c = Object.values(mapViews)) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.dataSourceId)) {
                return true;
            }
            else {
                return false;
            }
        };
        const { cardLayout = CardLayout.Auto, cardStyle = false, legendMode = _config__WEBPACK_IMPORTED_MODULE_5__.ELegendMode.ShowVisible } = this.props.config;
        this.state = {
            cardStyle: cardStyle,
            cardLayoutValue: cardLayout,
            legendMode: legendMode,
            activeCustomizeJmvId: null
        };
        // Save respectLayerDefinitionExp option in the config to 'true' if it's not defined
        // if (this.props.config.respectLayerDefinitionExp === undefined) {
        //   this.props.onSettingChange({
        //     id: this.props.id,
        //     config: this.props.config.set('respectLayerDefinitionExp', true)
        //   })
        // }
    }
    translate(stringId) {
        return this.props.intl.formatMessage({
            id: stringId,
            defaultMessage: allDefaultMessages[stringId]
        });
    }
    getFormattedMessage(stringId) {
        return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, { id: stringId, defaultMessage: allDefaultMessages[stringId] });
    }
    getDefaultStyleConfig() {
        return {
            useCustom: false,
            background: {
                color: '',
                fillType: jimu_ui__WEBPACK_IMPORTED_MODULE_2__.FillType.FILL
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
        var _a, _b, _c, _d;
        let cardLayoutContent = null;
        const label = (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Label, { id: 'multiple-jimu-map-desc', children: this.translate('customizeDescription') });
        if (this.state.cardStyle) {
            cardLayoutContent = ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { flow: "wrap", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_group_radios__WEBPACK_IMPORTED_MODULE_8__["default"], { value: this.state.cardLayoutValue, name: this.translate('cardStyle'), onChange: this.onCardLayoutChange, itemsIds: ['auto', 'sideBySide', 'stack'], itemsOptions: Object.values(CardLayout) }) }));
        }
        const legendModeContent = (
        // The itemsIds and itemsOptions should stay the same order
        (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { flow: "wrap", children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { marginLeft: '-0.5rem' }, children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_group_radios__WEBPACK_IMPORTED_MODULE_8__["default"], { name: this.translate('legendMode'), value: this.state.legendMode, onChange: this.onLegendModeChange, itemsIds: ['showVisible', 'showWithinExtent'], itemsOptions: Object.values(_config__WEBPACK_IMPORTED_MODULE_5__.ELegendMode) }) }) }));
        let displayStyleContent;
        if ((_a = this.props.config.style) === null || _a === void 0 ? void 0 : _a.useCustom) {
            displayStyleContent = 'block';
        }
        else {
            displayStyleContent = 'none';
        }
        return ((0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { css: (0,_lib_style__WEBPACK_IMPORTED_MODULE_7__.getStyle)(this.props.theme), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "widget-setting-legend", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingSection, { className: "map-selector-section", role: "group", children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { label: this.getFormattedMessage('selectMapWidget') }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.MapWidgetSelector, { onSelect: this.onMapWidgetSelected, useMapWidgetIds: this.props.useMapWidgetIds }) }), ((_b = this.props.useMapWidgetIds) === null || _b === void 0 ? void 0 : _b[0]) &&
                                (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { label: label, flow: 'wrap', "aria-label": this.translate('customizeDescription'), className: 'customize-layer-list', children: this.isMapWidgetEmpty() ?
                                        (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Alert, { tabIndex: 0, className: 'warningMsg', open: true, text: this.translate('customizeLayerWarnings'), type: 'warning' })
                                        :
                                            (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.LayerSetting, { mapWidgetId: (_c = this.props.useMapWidgetIds) === null || _c === void 0 ? void 0 : _c[0], onMapItemClick: this.onListItemBodyClick, mapViewId: this.state.activeCustomizeJmvId, isCustomizeEnabled: this.getActiveCustomizeStatus(), isShowRuntimeAddedLayerEnabled: this.getShowRuntimeAddedLayerStatus(), showTable: false, onToggleCustomize: this.onCustomizeLayerChange, onShowRuntimeAddedLayersChange: this.onShowRuntimeAddedLayersChange, onSelectedLayerIdChange: this.onLayerIdChange, selectedValues: this.getSelectedValues(), hideLayers: this.hideLayers }) })] }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingSection, { title: this.translate('legendMode'), role: "group", "aria-label": this.translate('legendMode'), children: legendModeContent }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingSection, { title: this.translate('options'), role: "group", "aria-label": this.translate('options'), children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { tag: 'label', label: this.getFormattedMessage('showBaseMap'), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Switch, { className: "can-x-switch", checked: (this.props.config && this.props.config.showBaseMap) || false, "data-key": "showBaseMap", onChange: (evt) => {
                                        this.onOptionsChanged(evt.target.checked, 'showBaseMap');
                                    } }) }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { tag: 'label', label: this.getFormattedMessage('cardStyle'), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Switch, { className: "can-x-switch", checked: (this.props.config && this.props.config.cardStyle) || false, "data-key": "cardStyle", onChange: (evt) => {
                                        this.onOptionsChanged(evt.target.checked, 'cardStyle');
                                    } }) }), cardLayoutContent] }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingSection, { children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { className: "advanced-setting-row", tag: 'label', label: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, { id: "advance", defaultMessage: "Advanced" }), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_2__.Switch, { className: "can-x-switch", checked: this.getStyleConfig().useCustom || false, "data-key": "showBaseMap", onChange: (evt) => {
                                        this.onUseCustomStyleChanged(evt.target.checked);
                                    } }) }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mt-4", style: { display: displayStyleContent }, children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { label: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, { id: "font", defaultMessage: "Font" }), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_basic_color_picker__WEBPACK_IMPORTED_MODULE_4__.ThemeColorPicker, { icon: textIcon, type: "with-icon", specificTheme: this.props.theme2, value: this.getStyleConfig().fontColor || '', onChange: this.onFontStyleChanged, "aria-label": this.translate('fontColor') }) }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_advanced_setting_components__WEBPACK_IMPORTED_MODULE_3__.SettingRow, { label: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_1__.FormattedMessage, { id: "background", defaultMessage: "Background" }), children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui_basic_color_picker__WEBPACK_IMPORTED_MODULE_4__.ThemeColorPicker, { specificTheme: this.props.theme2, value: ((_d = this.getStyleConfig().background) === null || _d === void 0 ? void 0 : _d.color) ||
                                                this.props.theme2.sys.color.surface.paper ||
                                                '', onChange: this.onBackgroundStyleChange, "aria-label": this.translate('backgroundColor') }) })] })] })] }) }));
    }
}
Setting.mapExtraStateProps = (state) => {
    return {
        dsJsons: state.appStateInBuilder.appConfig.dataSources
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9jb25mbGljdC1sZWdlbmQvZGlzdC9zZXR0aW5nL3NldHRpbmcuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnVjs7Ozs7Ozs7Ozs7Ozs7O0FDR0EsSUFBWSxXQUlYO0FBSkQsV0FBWSxXQUFXO0lBQ3JCLDJDQUE0QjtJQUM1QixzREFBdUM7SUFDdkMsbUNBQW9CO0FBQ3RCLENBQUMsRUFKVyxXQUFXLEtBQVgsV0FBVyxRQUl0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1BELGVBQWU7QUFDbUM7QUFDWjtBQUNlO0FBQzhCO0FBaUJuRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQXFCLEVBQUUsRUFBRTtJQUMxQyxNQUFNLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsS0FBSztJQUN0RCxNQUFNLFNBQVMsR0FBRyw0Q0FBSyxDQUFDLGNBQWMsQ0FBQyw2REFBZSxFQUFFLHdFQUFrQixDQUFDO0lBQzNFLE9BQU8sQ0FDTCx5RUFBSyxTQUFTLEVBQUMsb0JBQW9CLFlBQ2pDLHlFQUFLLFNBQVMsRUFBQyxvQ0FBb0MsWUFDakQsaUVBQUMsMENBQUssSUFBQyxTQUFTLEVBQUMsMkJBQTJCLEVBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGFBQzdGLGdFQUFDLDBDQUFLLElBQ0osRUFBRSxFQUFFLE1BQU0sRUFDVixJQUFJLEVBQUUsSUFBSSxFQUNWLFNBQVMsRUFBQyxNQUFNLEVBQ2hCLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUNkLGFBQWEsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLENBQUMsRUFDRCxPQUFPLEVBQUUsT0FBTyxHQUNoQixFQUNELFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFDWixHQUNKLEdBQ0YsQ0FDUDtBQUNILENBQUM7QUFFRCxNQUFNLFdBQVcsR0FBRyxDQUFDLEtBQXVCLEVBQUUsRUFBRTtJQUM5QyxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUs7SUFDL0QsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUMzRCxNQUFNLFNBQVMsR0FBbUI7WUFDaEMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDdkIsT0FBTyxFQUFFLEtBQUssS0FBSyxZQUFZLENBQUMsS0FBSyxDQUFDO1lBQ3RDLGFBQWEsRUFBRSxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQztZQUN0RCxJQUFJLEVBQUUsSUFBSTtTQUNYO1FBQ0QsT0FBTyxnRUFBQyxTQUFTLG9CQUFpQixTQUFTLEdBQXBCLEtBQUssQ0FBOEI7SUFDNUQsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxDQUNMLHlFQUFLLFNBQVMsRUFBQywwQkFBMEIsRUFBQyxJQUFJLEVBQUMsWUFBWSxFQUFDLEdBQUcsRUFBRSxnQkFBZ0IsZ0JBQWMsSUFBSSxZQUNoRyxhQUFhLEdBQ1YsQ0FDUDtBQUNILENBQUM7QUFFRCxpRUFBZSxXQUFXO0FBRTFCLE1BQU0sZ0JBQWdCLEdBQUcsOENBQUc7Ozs7OztDQU0zQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RXNGO0FBRWhGLFNBQVMsUUFBUSxDQUFFLEtBQXVCO0lBQy9DLE9BQU8sOENBQUc7Ozs7OztpQkFNSyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDOzs7Ozs7Ozs7a0JBUzlCLCtDQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQzlCO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RERCxpRUFBZTtJQUNiLGNBQWMsRUFBRSx3REFBd0Q7SUFDeEUsV0FBVyxFQUFFLHNCQUFzQjtJQUNuQyxTQUFTLEVBQUUsZ0JBQWdCO0lBQzNCLGNBQWMsRUFBRSxpQkFBaUI7SUFDakMsZ0JBQWdCLEVBQUUsK0NBQStDO0lBQ2pFLFdBQVcsRUFBRSxxQkFBcUI7SUFDbEMsVUFBVSxFQUFFLGFBQWE7SUFDekIseUJBQXlCLEVBQUUsK0JBQStCO0lBQzFELG9CQUFvQixFQUFFLG1FQUFtRTtDQUMxRjs7Ozs7Ozs7Ozs7O0FDVkQseUQ7Ozs7Ozs7Ozs7O0FDQUEsdUQ7Ozs7Ozs7Ozs7O0FDQUEsd0U7Ozs7Ozs7Ozs7O0FDQUEseUU7Ozs7Ozs7Ozs7O0FDQUEscUQ7Ozs7Ozs7Ozs7O0FDQUEsaUY7Ozs7Ozs7Ozs7O0FDQUEsd0U7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QsRTs7Ozs7V0NOQSwyQjs7Ozs7Ozs7OztBQ0FBOzs7S0FHSztBQUNMLHFCQUF1QixHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSm5ELGVBQWU7QUFhRztBQVFGO0FBUTRCO0FBRWlCO0FBQ0s7QUFDZDtBQUNkO0FBQ2E7QUFDYTtBQUNoRSxNQUFNLFFBQVEsR0FBRyxtQkFBTyxDQUFDLDBFQUFpQyxDQUFDO0FBQzNELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsNkRBQWUsRUFBRSxvREFBa0IsQ0FBQztBQUVqRixJQUFZLFVBSVg7QUFKRCxXQUFZLFVBQVU7SUFDcEIsMkJBQWE7SUFDYix5Q0FBMkI7SUFDM0IsNkJBQWU7QUFDakIsQ0FBQyxFQUpXLFVBQVUsS0FBVixVQUFVLFFBSXJCO0FBYUQsTUFBcUIsT0FBUSxTQUFRLDRDQUFLLENBQUMsYUFHMUM7SUFZQyxZQUFhLEtBQUs7UUFDaEIsS0FBSyxDQUFDLEtBQUssQ0FBQztRQVpkLHFCQUFnQixHQUFHLG9EQUFTLENBQUM7WUFDM0Isc0RBQWUsQ0FBQyxNQUFNO1lBQ3RCLHNEQUFlLENBQUMsUUFBUTtTQUN6QixDQUFDO1FBcUNGLGVBQVUsR0FBRyxHQUFXLEVBQUU7WUFDeEIsTUFBTSxPQUFPLEdBQUcsc0RBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVM7WUFDbEQsT0FBTyxPQUFPO1FBQ2hCLENBQUM7UUFxQkQscUJBQWdCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFRLEVBQUU7WUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7Z0JBQ3pCLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUM3QyxDQUFDO1lBQ0YsSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ1osU0FBUyxFQUFFLE9BQU87aUJBQ25CLENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQztRQUVELHVCQUFrQixHQUFHLENBQUMsVUFBc0IsRUFBRSxFQUFFO1lBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO2dCQUN6QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUM7YUFDeEQsQ0FBQztZQUVGLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ1osZUFBZSxFQUFFLFVBQVU7YUFDNUIsQ0FBQztRQUNKLENBQUM7UUFFRCx1QkFBa0IsR0FBRyxDQUFDLFVBQXVCLEVBQUUsRUFBRTtZQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztnQkFDekIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO2FBQ3hELENBQUM7WUFFRixJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxVQUFVO2FBQ3ZCLENBQUM7UUFDSixDQUFDO1FBRUQsMkJBQXNCLEdBQUcsQ0FBQyxxQkFBOEIsRUFBRSxFQUFFO1lBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO2dCQUN6QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixxQkFBcUI7YUFDdEIsQ0FBQztRQUNKLENBQUM7UUFFRCx1QkFBa0IsR0FBRyxDQUFDLGNBQStCLEVBQUUsRUFBRTtZQUN2RCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3BCLE9BQU07WUFDUixDQUFDO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7Z0JBQ3pCLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pCLGNBQWMsRUFBRSxjQUFjO2FBQy9CLENBQUM7UUFDSixDQUFDO1FBRUQsd0JBQW1CLEdBQUcsQ0FBQyxlQUF5QixFQUFFLEVBQUU7WUFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7Z0JBQ3pCLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2pCLGVBQWUsRUFBRSxlQUFlO2FBQ2pDLENBQUM7UUFDSixDQUFDO1FBRUQsNEJBQXVCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztnQkFDekIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFBRSxPQUFPLENBQUM7YUFDakUsQ0FBQztRQUNKLENBQUM7UUFFRCx1QkFBa0IsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO2dCQUN6QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEtBQUssQ0FBQzthQUMvRCxDQUFDO1FBQ0osQ0FBQztRQUVELDRCQUF1QixHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUU7O1lBQzVDLE1BQU0sRUFBRSxHQUFHO2dCQUNULEtBQUssRUFBRSxlQUFlO2dCQUN0QixRQUFRLEVBQUUsNkNBQVEsQ0FBQyxJQUFJO2FBQ3hCO1lBQ0QsSUFBSSxVQUFVLEdBQUcsb0RBQVMsQ0FDeEIsc0JBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSwwQ0FBRSxLQUFLLDBDQUFFLFVBQVUsbUNBQUssRUFBc0IsQ0FDaEU7WUFDRCxLQUFLLE1BQU0sR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDO2dCQUNyQixRQUFRLEdBQUcsRUFBRSxDQUFDO29CQUNaLEtBQUssVUFBVTt3QkFDYixJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7NEJBQ3BDLFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2xELENBQUM7d0JBQ0QsTUFBSztvQkFDUCxLQUFLLE9BQU87d0JBQ1YsVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDN0MsTUFBSztvQkFDUCxLQUFLLE9BQU87d0JBQ1YsVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDN0MsTUFBSztnQkFDVCxDQUFDO1lBQ0gsQ0FBQztZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO2dCQUN6QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxFQUFFLFVBQVUsQ0FBQzthQUNyRSxDQUFDO1FBQ0osQ0FBQztRQUdELHdCQUFtQixHQUFHLENBQUMsWUFBb0IsRUFBRSxFQUFFOztZQUM3QyxNQUFNLEtBQUssR0FBRyxHQUFHLFVBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSwwQ0FBRyxDQUFDLENBQUMsSUFBSSxZQUFZLEVBQUU7WUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDWixvQkFBb0IsRUFBRSxLQUFLO2FBQzVCLENBQUM7UUFDSixDQUFDO1FBRUQsMkJBQXNCLEdBQUcsQ0FBQyxNQUFlLEVBQUUsTUFBZ0IsRUFBRSxFQUFFO1lBQzdELGdEQUFnRDtZQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztnQkFDekIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsRUFBRTtvQkFDMUYsU0FBUyxFQUFFLE1BQU07b0JBQ2pCLHNCQUFzQixFQUFFLEVBQUU7b0JBQzFCLGtEQUFrRDtvQkFDbEQsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQy9DLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTO2lCQUNsRCxDQUFDO2FBQ0gsQ0FBQztRQUNKLENBQUM7UUFFRCxtQ0FBOEIsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO2dCQUN6QixFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSx3QkFBd0IsQ0FBQyxFQUFFLE1BQU0sQ0FBQzthQUM5SCxDQUFDO1FBQ0osQ0FBQztRQUVELG9CQUFlLEdBQUcsQ0FBQyxvQkFBOEIsRUFBRSxFQUFFO1lBQ25ELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsc0JBQXNCLENBQUMsRUFBRSxvQkFBb0IsQ0FBQztZQUVuSixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQztnQkFDekIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDakIsTUFBTSxFQUFFLFNBQVM7YUFDbEIsQ0FBQztRQUNKLENBQUM7UUFFRCxlQUFVLEdBQUcsQ0FBQyxhQUE0QixFQUFFLEVBQUU7WUFDNUMsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLHNCQUFzQixFQUFFO1lBQ3hELE1BQU0sZUFBZSxHQUFhLENBQUMsK0RBQXdCLENBQUMsYUFBYSxFQUFFLCtEQUF3QixDQUFDLFFBQVEsRUFBRSwrREFBd0IsQ0FBQyxpQkFBaUIsQ0FBQztZQUN6SixJQUFJLFNBQVMsSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUMxRCxPQUFPLElBQUk7WUFDYixDQUFDO1lBQ0QsZ0RBQWdEO1lBQ2hELElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDMUYsT0FBTyxJQUFJO1lBQ2IsQ0FBQztZQUNELE1BQU0sY0FBYyxHQUFhLENBQUMsK0RBQXdCLENBQUMseUJBQXlCLEVBQUUsK0RBQXdCLENBQUMscUJBQXFCLENBQUM7WUFDckksT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDcEQsQ0FBQztRQUVELDZCQUF3QixHQUFHLEdBQUcsRUFBRTs7WUFDOUIsT0FBTyw0QkFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLDBDQUFFLHFCQUFxQiwwQ0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLDBDQUFFLFNBQVMsbUNBQUksS0FBSztRQUN4RyxDQUFDO1FBRUQsbUNBQThCLEdBQUcsR0FBRyxFQUFFOztZQUNwQyxPQUFPLDRCQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sMENBQUUscUJBQXFCLDBDQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsMENBQUUsc0JBQXNCLG1DQUFJLElBQUk7UUFDcEgsQ0FBQztRQUVELHNCQUFpQixHQUFHLEdBQUcsRUFBRTs7WUFDdkIsZ0VBQWdFO1lBQ2hFLE1BQU0sR0FBRyxHQUFHLEVBQUU7WUFDZCxJQUFJLFVBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSwwQ0FBRSxxQkFBcUIsRUFBRSxDQUFDO2dCQUM3QyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLDBDQUFFLHFCQUFxQixDQUFDLEVBQUUsQ0FBQztvQkFDMUUsSUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDNUQsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLG9CQUFvQjtvQkFDbEYsQ0FBQztnQkFDSCxDQUFDO2dCQUNELE9BQU8sR0FBRztZQUNaLENBQUM7WUFDRCxPQUFPLHlGQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDO1FBQ3JFLENBQUM7UUFFRCxxQkFBZ0IsR0FBRyxHQUFZLEVBQUU7O1lBQy9CLE1BQU0sUUFBUSxHQUFHLDhEQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsbUJBQW1CLENBQUMsVUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLDBDQUFHLENBQUMsQ0FBQyxDQUFDLDBDQUFFLFlBQVksS0FBSSxFQUFFO1lBQ3RILG9FQUFvRTtZQUNwRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQywwQ0FBRyxDQUFDLENBQUMsMENBQUUsWUFBWSxHQUFFLENBQUM7Z0JBQ3JGLE9BQU8sSUFBSTtZQUNiLENBQUM7aUJBQU0sQ0FBQztnQkFDTixPQUFPLEtBQUs7WUFDZCxDQUFDO1FBQ0gsQ0FBQztRQTVPQyxNQUFNLEVBQUUsVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxVQUFVLEdBQUcsZ0RBQVcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07UUFDbkgsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNYLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFVBQVUsRUFBRSxVQUFVO1lBQ3RCLG9CQUFvQixFQUFFLElBQUk7U0FDM0I7UUFDRCxvRkFBb0Y7UUFDcEYsbUVBQW1FO1FBQ25FLGlDQUFpQztRQUNqQyx5QkFBeUI7UUFDekIsdUVBQXVFO1FBQ3ZFLE9BQU87UUFDUCxJQUFJO0lBQ04sQ0FBQztJQUVELFNBQVMsQ0FBRSxRQUFnQjtRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNuQyxFQUFFLEVBQUUsUUFBUTtZQUNaLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7U0FDN0MsQ0FBQztJQUNKLENBQUM7SUFFRCxtQkFBbUIsQ0FBRSxRQUFnQjtRQUNuQyxPQUFPLGdFQUFDLHVEQUFnQixJQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFJO0lBQ3pGLENBQUM7SUFPRCxxQkFBcUI7UUFDbkIsT0FBTztZQUNMLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsRUFBRTtnQkFDVCxRQUFRLEVBQUUsNkNBQVEsQ0FBQyxJQUFJO2FBQ3hCO1lBQ0QsU0FBUyxFQUFFLEVBQUU7U0FDZDtJQUNILENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztRQUNoQyxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixFQUFFO1FBQ3JDLENBQUM7SUFDSCxDQUFDO0lBNkxELE1BQU07O1FBQ0osSUFBSSxpQkFBaUIsR0FBRyxJQUFJO1FBQzVCLE1BQU0sS0FBSyxHQUFHLGdFQUFDLDBDQUFLLElBQUMsRUFBRSxFQUFDLHdCQUF3QixZQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsR0FBUztRQUVqRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDekIsaUJBQWlCLEdBQUcsQ0FDbEIsZ0VBQUMsMkVBQVUsSUFBQyxJQUFJLEVBQUMsTUFBTSxZQUNyQixnRUFBQyxnRUFBVyxJQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFDNUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQ2pDLFFBQVEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQ2pDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLEVBQ3pDLFlBQVksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUMzQixHQUNILENBQ2Q7UUFDSCxDQUFDO1FBRUQsTUFBTSxpQkFBaUIsR0FBRztRQUN4QiwyREFBMkQ7UUFDM0QsZ0VBQUMsMkVBQVUsSUFBQyxJQUFJLEVBQUMsTUFBTSxZQUNyQix5RUFBSyxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFlBQ25DLGdFQUFDLGdFQUFXLElBQ1YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEVBQ2xDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFDNUIsUUFBUSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFDakMsUUFBUSxFQUFFLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLEVBQzdDLFlBQVksRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLGdEQUFXLENBQUMsR0FDeEMsR0FDRSxHQUNLLENBQ2Q7UUFFRCxJQUFJLG1CQUFtQjtRQUN2QixJQUFJLFVBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssMENBQUUsU0FBUyxFQUFFLENBQUM7WUFDdkMsbUJBQW1CLEdBQUcsT0FBTztRQUMvQixDQUFDO2FBQU0sQ0FBQztZQUNOLG1CQUFtQixHQUFHLE1BQU07UUFDOUIsQ0FBQztRQUVELE9BQU8sQ0FDTCx5RUFBSyxHQUFHLEVBQUUsb0RBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUNsQywwRUFBSyxTQUFTLEVBQUMsdUJBQXVCLGFBQ3BDLGlFQUFDLCtFQUFjLElBQ2IsU0FBUyxFQUFDLHNCQUFzQixFQUNoQyxJQUFJLEVBQUMsT0FBTyxhQUVaLGdFQUFDLDJFQUFVLElBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFJLEVBQ2xFLGdFQUFDLDJFQUFVLGNBQ1QsZ0VBQUMsa0ZBQWlCLElBQ2hCLFFBQVEsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQ2xDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FDM0MsR0FDUyxFQUdYLFdBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSwwQ0FBRyxDQUFDLENBQUM7Z0NBQy9CLGdFQUFDLDJFQUFVLElBQ1QsS0FBSyxFQUFFLEtBQUssRUFDWixJQUFJLEVBQUMsTUFBTSxnQkFDQyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLEVBQ2xELFNBQVMsRUFBQyxzQkFBc0IsWUFHOUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQzt3Q0FDdkIsZ0VBQUMsMENBQUssSUFDSixRQUFRLEVBQUUsQ0FBQyxFQUNYLFNBQVMsRUFBRSxZQUFZLEVBQ3ZCLElBQUksUUFDSixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUM5QyxJQUFJLEVBQUUsU0FBUyxHQUNmO3dDQUNGLENBQUM7NENBQ0QsZ0VBQUMsNkVBQVksSUFDWCxXQUFXLEVBQUUsVUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLDBDQUFHLENBQUMsQ0FBQyxFQUM1QyxjQUFjLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUN4QyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFDMUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQ25ELDhCQUE4QixFQUFFLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxFQUNyRSxTQUFTLEVBQUUsS0FBSyxFQUNoQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsc0JBQXNCLEVBQzlDLDhCQUE4QixFQUFFLElBQUksQ0FBQyw4QkFBOEIsRUFDbkUsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFDN0MsY0FBYyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUN4QyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FDM0IsR0FFSyxJQUVBLEVBRWpCLGdFQUFDLCtFQUFjLElBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEVBQ25DLElBQUksRUFBQyxPQUFPLGdCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFlBRXZDLGlCQUFpQixHQUNILEVBRWpCLGlFQUFDLCtFQUFjLElBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQ2hDLElBQUksRUFBQyxPQUFPLGdCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLGFBRXJDLGdFQUFDLDJFQUFVLElBQUMsR0FBRyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxZQUNwRSxnRUFBQywyQ0FBTSxJQUNMLFNBQVMsRUFBQyxjQUFjLEVBQ3hCLE9BQU8sRUFDTCxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssY0FFdEQsYUFBYSxFQUN0QixRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTt3Q0FDaEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztvQ0FDMUQsQ0FBQyxHQUNELEdBQ1MsRUFlYixnRUFBQywyRUFBVSxJQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsWUFDbEUsZ0VBQUMsMkNBQU0sSUFDTCxTQUFTLEVBQUMsY0FBYyxFQUN4QixPQUFPLEVBQ0wsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLGNBRXBELFdBQVcsRUFDcEIsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7d0NBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUM7b0NBQ3hELENBQUMsR0FDRCxHQUNTLEVBQ1osaUJBQWlCLElBRUgsRUFFakIsaUVBQUMsK0VBQWMsZUFDYixnRUFBQywyRUFBVSxJQUNULFNBQVMsRUFBQyxzQkFBc0IsRUFDaEMsR0FBRyxFQUFDLE9BQU8sRUFDWCxLQUFLLEVBQ0gsZ0VBQUMsdURBQWdCLElBQUMsRUFBRSxFQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsVUFBVSxHQUFHLFlBRzdELGdFQUFDLDJDQUFNLElBQ0wsU0FBUyxFQUFDLGNBQWMsRUFDeEIsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLElBQUksS0FBSyxjQUN4QyxhQUFhLEVBQ3RCLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO3dDQUNoQixJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0NBQ2xELENBQUMsR0FDRCxHQUNTLEVBQ2IsMEVBQUssU0FBUyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsYUFDM0QsZ0VBQUMsMkVBQVUsSUFDVCxLQUFLLEVBQUUsZ0VBQUMsdURBQWdCLElBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxjQUFjLEVBQUMsTUFBTSxHQUFHLFlBRTNELGdFQUFDLHdFQUFnQixJQUNmLElBQUksRUFBRSxRQUFRLEVBQ2QsSUFBSSxFQUFDLFdBQVcsRUFDaEIsYUFBYSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUNoQyxLQUFLLEVBQ0gsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsSUFBSSxFQUFFLEVBRXZDLFFBQVEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLGdCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUN2QyxHQUNTLEVBQ2IsZ0VBQUMsMkVBQVUsSUFDVCxLQUFLLEVBQ0gsZ0VBQUMsdURBQWdCLElBQ2YsRUFBRSxFQUFDLFlBQVksRUFDZixjQUFjLEVBQUMsWUFBWSxHQUMzQixZQUdKLGdFQUFDLHdFQUFnQixJQUNmLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFDaEMsS0FBSyxFQUNILFdBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxVQUFVLDBDQUFFLEtBQUs7Z0RBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUs7Z0RBQ3pDLEVBQUUsRUFFSixRQUFRLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixnQkFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUM3QyxHQUNTLElBQ1QsSUFDUyxJQUNiLEdBQ0YsQ0FDUDtJQUNILENBQUM7O0FBL2JNLDBCQUFrQixHQUFHLENBQUMsS0FBYyxFQUFjLEVBQUU7SUFDekQsT0FBTztRQUNMLE9BQU8sRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFdBQVc7S0FDdkQ7QUFDSCxDQUFDO2lFQWJrQixPQUFPO0FBMmNwQixTQUFTLDJCQUEyQixDQUFDLEdBQUcsSUFBSSxxQkFBdUIsR0FBRyxHQUFHLEVBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2V4Yi1jbGllbnQvLi9qaW11LXVpL2xpYi9pY29ucy91cHBlcmNhc2Uuc3ZnIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9jb25mbGljdC1sZWdlbmQvc3JjL2NvbmZpZy50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY29uZmxpY3QtbGVnZW5kL3NyYy9zZXR0aW5nL2NvbXBvbmVudHMvZ3JvdXAtcmFkaW9zLnRzeCIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY29uZmxpY3QtbGVnZW5kL3NyYy9zZXR0aW5nL2xpYi9zdHlsZS50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvY29uZmxpY3QtbGVnZW5kL3NyYy9zZXR0aW5nL3RyYW5zbGF0aW9ucy9kZWZhdWx0LnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1hcmNnaXNcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1jb3JlL2Vtb3Rpb25cIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtbGF5b3V0cy9sYXlvdXQtcnVudGltZVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS11aVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS11aS9hZHZhbmNlZC9zZXR0aW5nLWNvbXBvbmVudHNcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtdWkvYmFzaWMvY29sb3ItcGlja2VyXCIiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL2ppbXUtY29yZS9saWIvc2V0LXB1YmxpYy1wYXRoLnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy9jb25mbGljdC1sZWdlbmQvc3JjL3NldHRpbmcvc2V0dGluZy50c3giXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMTIgMTJcXFwiPjxwYXRoIGZpbGw9XFxcIiMwMDBcXFwiIGZpbGwtcnVsZT1cXFwibm9uemVyb1xcXCIgZD1cXFwibTYuODI4LjUzNSA0Ljk2NiAxMS4wMUEuMzIzLjMyMyAwIDAgMSAxMS41IDEyYS43OC43OCAwIDAgMS0uNzA3LS40NTVMOS4xODIgOEgyLjgxOGwtMS42MTEgMy41NDVBLjc4Ljc4IDAgMCAxIC41IDEyYS4zMjMuMzIzIDAgMCAxLS4yOTQtLjQ1Nkw1LjE3Mi41MzVhLjkwOS45MDkgMCAwIDEgMS42NTYgME02IDEgMy4yNzIgN2g1LjQ1NnpcXFwiPjwvcGF0aD48L3N2Zz5cIiIsImltcG9ydCB0eXBlIHsgSW1tdXRhYmxlT2JqZWN0IH0gZnJvbSAnamltdS1jb3JlJ1xyXG5pbXBvcnQgdHlwZSB7IEJhY2tncm91bmRTdHlsZSB9IGZyb20gJ2ppbXUtdWknXHJcblxyXG5leHBvcnQgZW51bSBFTGVnZW5kTW9kZSB7XHJcbiAgU2hvd1Zpc2libGUgPSAnc2hvdy12aXNpYmxlJyxcclxuICBTaG93V2l0aGluRXh0ZW50ID0gJ3Nob3ctd2l0aGluLWV4dGVudCcsXHJcbiAgU2hvd0FsbCA9ICdzaG93LWFsbCdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTdHlsZSB7XHJcbiAgdXNlQ3VzdG9tOiBib29sZWFuXHJcbiAgYmFja2dyb3VuZDogQmFja2dyb3VuZFN0eWxlXHJcbiAgZm9udENvbG9yOiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xyXG4gIHNob3dCYXNlTWFwPzogYm9vbGVhblxyXG4gIGNhcmRTdHlsZT86IGJvb2xlYW5cclxuICBjYXJkTGF5b3V0PzogJ2F1dG8nIHwgJ3NpZGUtYnktc2lkZScgfCAnc3RhY2snXHJcbiAgbGVnZW5kTW9kZT86IEVMZWdlbmRNb2RlXHJcbiAgcmVzcGVjdExheWVyRGVmaW5pdGlvbkV4cD86IGJvb2xlYW5cclxuICBzdHlsZTogU3R5bGVcclxuICBjdXN0b21pemVMYXllck9wdGlvbnM/OiB7XHJcbiAgICBbamltdU1hcFZpZXdJZDogc3RyaW5nXTogQ3VzdG9taXplTGF5ZXJPcHRpb25cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9taXplTGF5ZXJPcHRpb24ge1xyXG4gIGlzRW5hYmxlZDogYm9vbGVhblxyXG4gIHNob3dSdW50aW1lQWRkZWRMYXllcnM/OiBib29sZWFuXHJcbiAgc2hvd0ppbXVMYXllclZpZXdJZHM/OiBzdHJpbmdbXVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBJTUNvbmZpZyA9IEltbXV0YWJsZU9iamVjdDxDb25maWc+XHJcbiIsIi8qKiBAanN4IGpzeCAqL1xyXG5pbXBvcnQgeyBSZWFjdCwgY3NzLCBob29rcywganN4IH0gZnJvbSAnamltdS1jb3JlJ1xyXG5pbXBvcnQgeyBMYWJlbCwgUmFkaW8gfSBmcm9tICdqaW11LXVpJ1xyXG5pbXBvcnQgZGVmYXVsdE1lc3NhZ2VzIGZyb20gJy4uL3RyYW5zbGF0aW9ucy9kZWZhdWx0J1xyXG5pbXBvcnQgeyBkZWZhdWx0TWVzc2FnZXMgYXMgamltdUxheW91dE1lc3NhZ2VzIH0gZnJvbSAnamltdS1sYXlvdXRzL2xheW91dC1ydW50aW1lJ1xyXG5cclxuaW50ZXJmYWNlIFJhZGlvSXRlbVByb3BzIHtcclxuICBvblJhZGlvQ2hhbmdlOiAoZXZ0OiBhbnkpID0+IGFueVxyXG4gIGNoZWNrZWQ6IGJvb2xlYW5cclxuICBpdGVtSWQ6IHN0cmluZ1xyXG4gIG5hbWU6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgR3JvdXBSYWRpb3NQcm9wcyB7XHJcbiAgaXRlbXNJZHM6IHN0cmluZ1tdXHJcbiAgaXRlbXNPcHRpb25zOiBzdHJpbmdbXVxyXG4gIHZhbHVlOiBzdHJpbmdcclxuICBvbkNoYW5nZTogKGV2dDogYW55KSA9PiBhbnlcclxuICBuYW1lOiBzdHJpbmdcclxufVxyXG5cclxuY29uc3QgUmFkaW9JdGVtID0gKHByb3BzOiBSYWRpb0l0ZW1Qcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgb25SYWRpb0NoYW5nZSwgY2hlY2tlZCwgaXRlbUlkLCBuYW1lIH0gPSBwcm9wc1xyXG4gIGNvbnN0IHRyYW5zbGF0ZSA9IGhvb2tzLnVzZVRyYW5zbGF0aW9uKGRlZmF1bHRNZXNzYWdlcywgamltdUxheW91dE1lc3NhZ2VzKVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTAwIGxlZ2VuZC10b29sc1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxlZ2VuZC10b29scy1pdGVtIGNhcmQtc3R5bGUtcmFkaW9cIj5cclxuICAgICAgICA8TGFiZWwgY2xhc3NOYW1lPSdkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyJyBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJywgZm9udFdlaWdodDogJ25vcm1hbCcgfX0+XHJcbiAgICAgICAgICA8UmFkaW9cclxuICAgICAgICAgICAgaWQ9e2l0ZW1JZH1cclxuICAgICAgICAgICAgbmFtZT17bmFtZX1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtci0xJ1xyXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcclxuICAgICAgICAgICAgICBvblJhZGlvQ2hhbmdlKGUpXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAge3RyYW5zbGF0ZShpdGVtSWQpfVxyXG4gICAgICAgIDwvTGFiZWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKVxyXG59XHJcblxyXG5jb25zdCBHcm91cFJhZGlvcyA9IChwcm9wczogR3JvdXBSYWRpb3NQcm9wcykgPT4ge1xyXG4gIGNvbnN0IHsgaXRlbXNJZHMsIGl0ZW1zT3B0aW9ucywgdmFsdWUsIG9uQ2hhbmdlLCBuYW1lIH0gPSBwcm9wc1xyXG4gIGNvbnN0IHJhZGlvc0NvbnRlbnQgPSBpdGVtc0lkcy5tYXAoKHJhZGlvSXRlbVByb3BzLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3QgaXRlbVByb3BzOiBSYWRpb0l0ZW1Qcm9wcyA9IHtcclxuICAgICAgaXRlbUlkOiBpdGVtc0lkc1tpbmRleF0sXHJcbiAgICAgIGNoZWNrZWQ6IHZhbHVlID09PSBpdGVtc09wdGlvbnNbaW5kZXhdLFxyXG4gICAgICBvblJhZGlvQ2hhbmdlOiAoKSA9PiB7IG9uQ2hhbmdlKGl0ZW1zT3B0aW9uc1tpbmRleF0pIH0sXHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgIH1cclxuICAgIHJldHVybiA8UmFkaW9JdGVtIGtleT17aW5kZXh9IHsuLi5pdGVtUHJvcHN9ID48L1JhZGlvSXRlbT5cclxuICB9KVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtbGF5b3V0LWNvbnRlbnQgcGwtMlwiIHJvbGU9XCJyYWRpb2dyb3VwXCIgY3NzPXtncm91cFJhZGlvU3R5bGVzfSBhcmlhLWxhYmVsPXtuYW1lfT5cclxuICAgICAge3JhZGlvc0NvbnRlbnR9XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdyb3VwUmFkaW9zXHJcblxyXG5jb25zdCBncm91cFJhZGlvU3R5bGVzID0gY3NzYFxyXG4gIC5sZWdlbmQtdG9vbHM6bGFzdC1jaGlsZCB7XHJcbiAgICAubGVnZW5kLXRvb2xzLWl0ZW0ge1xyXG4gICAgICBtYXJnaW4tYm90dG9tOiAtMC41cmVtO1xyXG4gICAgfVxyXG4gIH1cclxuYFxyXG4iLCJpbXBvcnQgeyB0eXBlIElNVGhlbWVWYXJpYWJsZXMsIGNzcywgdHlwZSBTZXJpYWxpemVkU3R5bGVzLCBwb2xpc2hlZCB9IGZyb20gJ2ppbXUtY29yZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTdHlsZSAodGhlbWU6IElNVGhlbWVWYXJpYWJsZXMpOiBTZXJpYWxpemVkU3R5bGVzIHtcclxuICByZXR1cm4gY3NzYFxyXG4gICAgLndpZGdldC1zZXR0aW5nLWxlZ2VuZHtcclxuICAgICAgZm9udC13ZWlnaHQ6IGxpZ2h0ZXI7XHJcbiAgICAgIGZvbnQtc2l6ZTogMTNweDtcclxuXHJcbiAgICAgIC5zb3VyY2UtZGVzY3JpcHQge1xyXG4gICAgICAgIGNvbG9yOiAke3RoZW1lLnJlZi5wYWxldHRlLm5ldXRyYWxbMTAwMF19O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAud2VibWFwLXRodW1ibmFpbHtcclxuICAgICAgICBjdXJzb3I6IGF1dG87XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgaGVpZ2h0OiAxMjBweDtcclxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgICAgIHBhZGRpbmc6IDFweDtcclxuICAgICAgICBib3JkZXI6ICR7cG9saXNoZWQucmVtKDIpfSBzb2xpZCBpbml0aWFsO1xyXG4gICAgICAgIGltZywgZGl2e1xyXG4gICAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAuY2FyZC1sYXlvdXQtY29udGVudHtcclxuICAgICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLmxlZ2VuZC10b29sc3tcclxuICAgICAgICAubGVnZW5kLXRvb2xzLWl0ZW17XHJcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgbWFyZ2luLWJvdHRvbTogOHB4O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLmFkdmFuY2VkLXNldHRpbmctcm93IC5qaW11LXdpZGdldC1zZXR0aW5nLS1yb3ctbGFiZWwge1xyXG4gICAgICAgIGNvbG9yOiAjYzVjNWM1O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5tYXAtc2VsZWN0b3Itc2VjdGlvbiAuY29tcG9uZW50LW1hcC1zZWxlY3RvciAuZm9ybS1jb250cm9se1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAuamltdS1idWlsZGVyLS1iYWNrZ3JvdW5kLXNldHRpbmcgLmJhY2tncm91bmQtaW1hZ2Uge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC5qaW11LWJ1aWxkZXItLWJhY2tncm91bmQtc2V0dGluZyAuYmFja2dyb3VuZC1pbWFnZS1maWxsLXR5cGUge1xyXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBgXHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIHNvdXJjZURlc2NyaXB0OiAnQSB3ZWIgbWFwIG9yIHdlYiBzY2VuZSwgb3IgYW55IGNvbWJpbmF0aW9uIG9mIHRoZSB0d28uJyxcclxuICBzaG93QmFzZU1hcDogJ1Nob3cgYmFzZW1hcCBsZWdlbmRzJyxcclxuICBjYXJkU3R5bGU6ICdVc2UgY2FyZCBzdHlsZScsXHJcbiAgc2hvd0FsbExlZ2VuZHM6ICdTaG93IGFsbCBsYXllcnMnLFxyXG4gIHNob3dXaXRoaW5FeHRlbnQ6ICdTaG93IHZpc2libGUgbGF5ZXJzIHdpdGhpbiBjdXJyZW50IG1hcCBleHRlbnQnLFxyXG4gIHNob3dWaXNpYmxlOiAnU2hvdyB2aXNpYmxlIGxheWVycycsXHJcbiAgbGVnZW5kTW9kZTogJ0xlZ2VuZCBtb2RlJyxcclxuICByZXNwZWN0TGF5ZXJEZWZpbml0aW9uRXhwOiAnUmVzcGVjdCBsYXllciBmaWx0ZXIgc2V0dGluZ3MnLFxyXG4gIGN1c3RvbWl6ZURlc2NyaXB0aW9uOiAnU3BlY2lmeSB3aGljaCBsYXllcnMgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gdGhlIGxlZ2VuZCBmb3IgZWFjaCBtYXAnXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfYXJjZ2lzX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfY29yZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fZW1vdGlvbl9yZWFjdF9qc3hfcnVudGltZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2xheW91dHNfbGF5b3V0X3J1bnRpbWVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV91aV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X3VpX2FkdmFuY2VkX3NldHRpbmdfY29tcG9uZW50c19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X3VpX2Jhc2ljX2NvbG9yX3BpY2tlcl9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIi8qKlxyXG4gKiBXZWJwYWNrIHdpbGwgcmVwbGFjZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB3aXRoIF9fd2VicGFja19yZXF1aXJlX18ucCB0byBzZXQgdGhlIHB1YmxpYyBwYXRoIGR5bmFtaWNhbGx5LlxyXG4gKiBUaGUgcmVhc29uIHdoeSB3ZSBjYW4ndCBzZXQgdGhlIHB1YmxpY1BhdGggaW4gd2VicGFjayBjb25maWcgaXM6IHdlIGNoYW5nZSB0aGUgcHVibGljUGF0aCB3aGVuIGRvd25sb2FkLlxyXG4gKiAqL1xyXG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHdpbmRvdy5qaW11Q29uZmlnLmJhc2VVcmxcclxuIiwiLyoqIEBqc3gganN4ICovXHJcbmltcG9ydCB7XHJcbiAgUmVhY3QsXHJcbiAgSW1tdXRhYmxlLFxyXG4gIHR5cGUgSW1tdXRhYmxlT2JqZWN0LFxyXG4gIHR5cGUgRGF0YVNvdXJjZUpzb24sXHJcbiAgdHlwZSBJTVN0YXRlLFxyXG4gIEZvcm1hdHRlZE1lc3NhZ2UsXHJcbiAganN4LFxyXG4gIGdldEFwcFN0b3JlLFxyXG4gIHR5cGUgVXNlRGF0YVNvdXJjZSxcclxuICBEYXRhU291cmNlVHlwZXMsXHJcbiAgU3VwcG9ydGVkSlNBUElMYXllclR5cGVzXHJcbn0gZnJvbSAnamltdS1jb3JlJ1xyXG5pbXBvcnQge1xyXG4gIFN3aXRjaCxcclxuICB0eXBlIEJhY2tncm91bmRTdHlsZSxcclxuICBGaWxsVHlwZSxcclxuICBkZWZhdWx0TWVzc2FnZXMgYXMgamltdURlZmF1bHRNZXNzYWdlLFxyXG4gIExhYmVsLFxyXG4gIEFsZXJ0XHJcbn0gZnJvbSAnamltdS11aSdcclxuaW1wb3J0IHtcclxuICBNYXBXaWRnZXRTZWxlY3RvcixcclxuICBTZXR0aW5nU2VjdGlvbixcclxuICBTZXR0aW5nUm93LFxyXG4gIC8vIFRPRE86IENoYW5nZSB0aGUgcGF0aFxyXG4gIGdldEFsbEl0ZW1zSW5NYXBWaWV3LFxyXG4gIExheWVyU2V0dGluZ1xyXG59IGZyb20gJ2ppbXUtdWkvYWR2YW5jZWQvc2V0dGluZy1jb21wb25lbnRzJ1xyXG5pbXBvcnQgdHlwZSB7IEFsbFdpZGdldFNldHRpbmdQcm9wcyB9IGZyb20gJ2ppbXUtZm9yLWJ1aWxkZXInXHJcbmltcG9ydCB7IFRoZW1lQ29sb3JQaWNrZXIgfSBmcm9tICdqaW11LXVpL2Jhc2ljL2NvbG9yLXBpY2tlcidcclxuaW1wb3J0IHsgRUxlZ2VuZE1vZGUsIHR5cGUgSU1Db25maWcsIHR5cGUgU3R5bGUgfSBmcm9tICcuLi9jb25maWcnXHJcbmltcG9ydCBkZWZhdWx0TWVzc2FnZXMgZnJvbSAnLi90cmFuc2xhdGlvbnMvZGVmYXVsdCdcclxuaW1wb3J0IHsgZ2V0U3R5bGUgfSBmcm9tICcuL2xpYi9zdHlsZSdcclxuaW1wb3J0IEdyb3VwUmFkaW9zIGZyb20gJy4vY29tcG9uZW50cy9ncm91cC1yYWRpb3MnXHJcbmltcG9ydCB7IHR5cGUgSmltdUxheWVyVmlldywgTWFwVmlld01hbmFnZXIgfSBmcm9tICdqaW11LWFyY2dpcydcclxuY29uc3QgdGV4dEljb24gPSByZXF1aXJlKCdqaW11LXVpL2xpYi9pY29ucy91cHBlcmNhc2Uuc3ZnJylcclxuY29uc3QgYWxsRGVmYXVsdE1lc3NhZ2VzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE1lc3NhZ2VzLCBqaW11RGVmYXVsdE1lc3NhZ2UpXHJcblxyXG5leHBvcnQgZW51bSBDYXJkTGF5b3V0IHtcclxuICBBdXRvID0gJ2F1dG8nLFxyXG4gIFNpZGVCeVNpZGUgPSAnc2lkZS1ieS1zaWRlJyxcclxuICBTdGFjayA9ICdzdGFjaycsXHJcbn1cclxuXHJcbmludGVyZmFjZSBFeHRyYVByb3BzIHtcclxuICBkc0pzb25zOiBJbW11dGFibGVPYmplY3Q8eyBbZHNJZDogc3RyaW5nXTogRGF0YVNvdXJjZUpzb24gfT5cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXaWRnZXRTZXR0aW5nU3RhdGUge1xyXG4gIGNhcmRTdHlsZTogYm9vbGVhblxyXG4gIGNhcmRMYXlvdXRWYWx1ZTogc3RyaW5nXHJcbiAgbGVnZW5kTW9kZTogRUxlZ2VuZE1vZGVcclxuICBhY3RpdmVDdXN0b21pemVKbXZJZDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHRpbmcgZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50PFxyXG5BbGxXaWRnZXRTZXR0aW5nUHJvcHM8SU1Db25maWc+ICYgRXh0cmFQcm9wcyxcclxuV2lkZ2V0U2V0dGluZ1N0YXRlXHJcbj4ge1xyXG4gIHN1cHBvcnRlZERzVHlwZXMgPSBJbW11dGFibGUoW1xyXG4gICAgRGF0YVNvdXJjZVR5cGVzLldlYk1hcCxcclxuICAgIERhdGFTb3VyY2VUeXBlcy5XZWJTY2VuZVxyXG4gIF0pXHJcblxyXG4gIHN0YXRpYyBtYXBFeHRyYVN0YXRlUHJvcHMgPSAoc3RhdGU6IElNU3RhdGUpOiBFeHRyYVByb3BzID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGRzSnNvbnM6IHN0YXRlLmFwcFN0YXRlSW5CdWlsZGVyLmFwcENvbmZpZy5kYXRhU291cmNlc1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcylcclxuICAgIGNvbnN0IHsgY2FyZExheW91dCA9IENhcmRMYXlvdXQuQXV0bywgY2FyZFN0eWxlID0gZmFsc2UsIGxlZ2VuZE1vZGUgPSBFTGVnZW5kTW9kZS5TaG93VmlzaWJsZSB9ID0gdGhpcy5wcm9wcy5jb25maWdcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIGNhcmRTdHlsZTogY2FyZFN0eWxlLFxyXG4gICAgICBjYXJkTGF5b3V0VmFsdWU6IGNhcmRMYXlvdXQsXHJcbiAgICAgIGxlZ2VuZE1vZGU6IGxlZ2VuZE1vZGUsXHJcbiAgICAgIGFjdGl2ZUN1c3RvbWl6ZUptdklkOiBudWxsXHJcbiAgICB9XHJcbiAgICAvLyBTYXZlIHJlc3BlY3RMYXllckRlZmluaXRpb25FeHAgb3B0aW9uIGluIHRoZSBjb25maWcgdG8gJ3RydWUnIGlmIGl0J3Mgbm90IGRlZmluZWRcclxuICAgIC8vIGlmICh0aGlzLnByb3BzLmNvbmZpZy5yZXNwZWN0TGF5ZXJEZWZpbml0aW9uRXhwID09PSB1bmRlZmluZWQpIHtcclxuICAgIC8vICAgdGhpcy5wcm9wcy5vblNldHRpbmdDaGFuZ2Uoe1xyXG4gICAgLy8gICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgLy8gICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0KCdyZXNwZWN0TGF5ZXJEZWZpbml0aW9uRXhwJywgdHJ1ZSlcclxuICAgIC8vICAgfSlcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIHRyYW5zbGF0ZSAoc3RyaW5nSWQ6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuaW50bC5mb3JtYXRNZXNzYWdlKHtcclxuICAgICAgaWQ6IHN0cmluZ0lkLFxyXG4gICAgICBkZWZhdWx0TWVzc2FnZTogYWxsRGVmYXVsdE1lc3NhZ2VzW3N0cmluZ0lkXVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGdldEZvcm1hdHRlZE1lc3NhZ2UgKHN0cmluZ0lkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiA8Rm9ybWF0dGVkTWVzc2FnZSBpZD17c3RyaW5nSWR9IGRlZmF1bHRNZXNzYWdlPXthbGxEZWZhdWx0TWVzc2FnZXNbc3RyaW5nSWRdfSAvPlxyXG4gIH1cclxuXHJcbiAgZ2V0UG9ydFVybCA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgY29uc3QgcG9ydFVybCA9IGdldEFwcFN0b3JlKCkuZ2V0U3RhdGUoKS5wb3J0YWxVcmxcclxuICAgIHJldHVybiBwb3J0VXJsXHJcbiAgfVxyXG5cclxuICBnZXREZWZhdWx0U3R5bGVDb25maWcgKCk6IFN0eWxlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHVzZUN1c3RvbTogZmFsc2UsXHJcbiAgICAgIGJhY2tncm91bmQ6IHtcclxuICAgICAgICBjb2xvcjogJycsXHJcbiAgICAgICAgZmlsbFR5cGU6IEZpbGxUeXBlLkZJTExcclxuICAgICAgfSxcclxuICAgICAgZm9udENvbG9yOiAnJ1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U3R5bGVDb25maWcgKCk6IFN0eWxlIHtcclxuICAgIGlmICh0aGlzLnByb3BzLmNvbmZpZy5zdHlsZSAmJiB0aGlzLnByb3BzLmNvbmZpZy5zdHlsZS51c2VDdXN0b20pIHtcclxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY29uZmlnLnN0eWxlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0U3R5bGVDb25maWcoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25PcHRpb25zQ2hhbmdlZCA9IChjaGVja2VkLCBuYW1lKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLnNldChuYW1lLCBjaGVja2VkKVxyXG4gICAgfSlcclxuICAgIGlmIChuYW1lID09PSAnY2FyZFN0eWxlJykge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBjYXJkU3R5bGU6IGNoZWNrZWRcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uQ2FyZExheW91dENoYW5nZSA9IChjYXJkTGF5b3V0OiBDYXJkTGF5b3V0KSA9PiB7XHJcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLnNldCgnY2FyZExheW91dCcsIGNhcmRMYXlvdXQpXHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjYXJkTGF5b3V0VmFsdWU6IGNhcmRMYXlvdXRcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvbkxlZ2VuZE1vZGVDaGFuZ2UgPSAobGVnZW5kTW9kZTogRUxlZ2VuZE1vZGUpID0+IHtcclxuICAgIHRoaXMucHJvcHMub25TZXR0aW5nQ2hhbmdlKHtcclxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXHJcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0KCdsZWdlbmRNb2RlJywgbGVnZW5kTW9kZSlcclxuICAgIH0pXHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGxlZ2VuZE1vZGU6IGxlZ2VuZE1vZGVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvblRvZ2dsZVVzZURhdGFFbmFibGVkID0gKHVzZURhdGFTb3VyY2VzRW5hYmxlZDogYm9vbGVhbikgPT4ge1xyXG4gICAgdGhpcy5wcm9wcy5vblNldHRpbmdDaGFuZ2Uoe1xyXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcclxuICAgICAgdXNlRGF0YVNvdXJjZXNFbmFibGVkXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgb25EYXRhU291cmNlQ2hhbmdlID0gKHVzZURhdGFTb3VyY2VzOiBVc2VEYXRhU291cmNlW10pID0+IHtcclxuICAgIGlmICghdXNlRGF0YVNvdXJjZXMpIHtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcm9wcy5vblNldHRpbmdDaGFuZ2Uoe1xyXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcclxuICAgICAgdXNlRGF0YVNvdXJjZXM6IHVzZURhdGFTb3VyY2VzXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgb25NYXBXaWRnZXRTZWxlY3RlZCA9ICh1c2VNYXBXaWRnZXRJZHM6IHN0cmluZ1tdKSA9PiB7XHJcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICB1c2VNYXBXaWRnZXRJZHM6IHVzZU1hcFdpZGdldElkc1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIG9uVXNlQ3VzdG9tU3R5bGVDaGFuZ2VkID0gKGNoZWNrZWQpID0+IHtcclxuICAgIHRoaXMucHJvcHMub25TZXR0aW5nQ2hhbmdlKHtcclxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXHJcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0SW4oWydzdHlsZScsICd1c2VDdXN0b20nXSwgY2hlY2tlZClcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvbkZvbnRTdHlsZUNoYW5nZWQgPSAoY29sb3IpID0+IHtcclxuICAgIHRoaXMucHJvcHMub25TZXR0aW5nQ2hhbmdlKHtcclxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXHJcbiAgICAgIGNvbmZpZzogdGhpcy5wcm9wcy5jb25maWcuc2V0SW4oWydzdHlsZScsICdmb250Q29sb3InXSwgY29sb3IpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgb25CYWNrZ3JvdW5kU3R5bGVDaGFuZ2UgPSAoYmFja2dyb3VuZENvbG9yKSA9PiB7XHJcbiAgICBjb25zdCBiZyA9IHtcclxuICAgICAgY29sb3I6IGJhY2tncm91bmRDb2xvcixcclxuICAgICAgZmlsbFR5cGU6IEZpbGxUeXBlLkZJTExcclxuICAgIH1cclxuICAgIGxldCBiYWNrZ3JvdW5kID0gSW1tdXRhYmxlKFxyXG4gICAgICB0aGlzLnByb3BzLmNvbmZpZz8uc3R5bGU/LmJhY2tncm91bmQgPz8gKHt9IGFzIEJhY2tncm91bmRTdHlsZSlcclxuICAgIClcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGJnKSB7XHJcbiAgICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgICAgY2FzZSAnZmlsbFR5cGUnOlxyXG4gICAgICAgICAgaWYgKGJhY2tncm91bmQuZmlsbFR5cGUgIT09IGJnW2tleV0pIHtcclxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IGJhY2tncm91bmQuc2V0KCdmaWxsVHlwZScsIGJnW2tleV0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2NvbG9yJzpcclxuICAgICAgICAgIGJhY2tncm91bmQgPSBiYWNrZ3JvdW5kLnNldCgnY29sb3InLCBiZ1trZXldKVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICdpbWFnZSc6XHJcbiAgICAgICAgICBiYWNrZ3JvdW5kID0gYmFja2dyb3VuZC5zZXQoJ2ltYWdlJywgYmdba2V5XSlcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLnNldEluKFsnc3R5bGUnLCAnYmFja2dyb3VuZCddLCBiYWNrZ3JvdW5kKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBvbkxpc3RJdGVtQm9keUNsaWNrID0gKGRhdGFTb3VyY2VJZDogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBqbXZJZCA9IGAke3RoaXMucHJvcHMudXNlTWFwV2lkZ2V0SWRzPy5bMF19LSR7ZGF0YVNvdXJjZUlkfWBcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBhY3RpdmVDdXN0b21pemVKbXZJZDogam12SWRcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvbkN1c3RvbWl6ZUxheWVyQ2hhbmdlID0gKGVuYWJsZTogYm9vbGVhbiwgamx2SWRzOiBzdHJpbmdbXSkgPT4ge1xyXG4gICAgLy8gTm8gbWF0dGVyIGl0J3Mgb24vb2ZmLCBjbGVhbiB1cCB0aGUgaWRzIGFycmF5XHJcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLnNldEluKFsnY3VzdG9taXplTGF5ZXJPcHRpb25zJywgdGhpcy5zdGF0ZS5hY3RpdmVDdXN0b21pemVKbXZJZF0sIHtcclxuICAgICAgICBpc0VuYWJsZWQ6IGVuYWJsZSxcclxuICAgICAgICBoaWRkZW5KaW11TGF5ZXJWaWV3SWRzOiBbXSxcclxuICAgICAgICAvLyBTdG9yZSBhbGwgbGF5ZXIgaWRzIHdoZW4gZW5hYmxpbmcgY3VzdG9taXphdGlvblxyXG4gICAgICAgIHNob3dKaW11TGF5ZXJWaWV3SWRzOiBlbmFibGUgPyBbLi4uamx2SWRzXSA6IFtdLFxyXG4gICAgICAgIHNob3dSdW50aW1lQWRkZWRMYXllcnM6IGVuYWJsZSA/IHRydWUgOiB1bmRlZmluZWRcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBvblNob3dSdW50aW1lQWRkZWRMYXllcnNDaGFuZ2UgPSAoZW5hYmxlKSA9PiB7XHJcbiAgICB0aGlzLnByb3BzLm9uU2V0dGluZ0NoYW5nZSh7XHJcbiAgICAgIGlkOiB0aGlzLnByb3BzLmlkLFxyXG4gICAgICBjb25maWc6IHRoaXMucHJvcHMuY29uZmlnLnNldEluKFsnY3VzdG9taXplTGF5ZXJPcHRpb25zJywgdGhpcy5zdGF0ZS5hY3RpdmVDdXN0b21pemVKbXZJZCwgJ3Nob3dSdW50aW1lQWRkZWRMYXllcnMnXSwgZW5hYmxlKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIG9uTGF5ZXJJZENoYW5nZSA9IChzaG93SmltdUxheWVyVmlld0lkczogc3RyaW5nW10pID0+IHtcclxuICAgIGNvbnN0IG5ld0NvbmZpZyA9IHRoaXMucHJvcHMuY29uZmlnLnNldEluKFsnY3VzdG9taXplTGF5ZXJPcHRpb25zJywgdGhpcy5zdGF0ZS5hY3RpdmVDdXN0b21pemVKbXZJZCwgJ3Nob3dKaW11TGF5ZXJWaWV3SWRzJ10sIHNob3dKaW11TGF5ZXJWaWV3SWRzKVxyXG5cclxuICAgIHRoaXMucHJvcHMub25TZXR0aW5nQ2hhbmdlKHtcclxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXHJcbiAgICAgIGNvbmZpZzogbmV3Q29uZmlnXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgaGlkZUxheWVycyA9IChqaW11TGF5ZXJWaWV3OiBKaW11TGF5ZXJWaWV3KSA9PiB7XHJcbiAgICBjb25zdCBwYXJlbnRKbHYgPSBqaW11TGF5ZXJWaWV3LmdldFBhcmVudEppbXVMYXllclZpZXcoKVxyXG4gICAgY29uc3QgaGlkZVBhcmVudFR5cGVzOiBzdHJpbmdbXSA9IFtTdXBwb3J0ZWRKU0FQSUxheWVyVHlwZXMuTWFwSW1hZ2VMYXllciwgU3VwcG9ydGVkSlNBUElMYXllclR5cGVzLldNU0xheWVyLCBTdXBwb3J0ZWRKU0FQSUxheWVyVHlwZXMuU3VidHlwZUdyb3VwTGF5ZXJdXHJcbiAgICBpZiAocGFyZW50Smx2ICYmIGhpZGVQYXJlbnRUeXBlcy5pbmNsdWRlcyhwYXJlbnRKbHYudHlwZSkpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIC8vIEhpZGUgbGF5ZXJzIHRoYXQgc2V0IGxlZ2VuZEVuYWJsZWQgdG8gYGZhbHNlYFxyXG4gICAgaWYgKGppbXVMYXllclZpZXcubGF5ZXIubGVnZW5kRW5hYmxlZCAhPT0gdW5kZWZpbmVkICYmICFqaW11TGF5ZXJWaWV3LmxheWVyLmxlZ2VuZEVuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIGNvbnN0IGhpZGVMYXllclR5cGVzOiBzdHJpbmdbXSA9IFtTdXBwb3J0ZWRKU0FQSUxheWVyVHlwZXMuQnVpbGRpbmdDb21wb25lbnRTdWJMYXllciwgU3VwcG9ydGVkSlNBUElMYXllclR5cGVzLkJ1aWxkaW5nR3JvdXBTdWJMYXllcl1cclxuICAgIHJldHVybiBoaWRlTGF5ZXJUeXBlcy5pbmNsdWRlcyhqaW11TGF5ZXJWaWV3LnR5cGUpXHJcbiAgfVxyXG5cclxuICBnZXRBY3RpdmVDdXN0b21pemVTdGF0dXMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jb25maWc/LmN1c3RvbWl6ZUxheWVyT3B0aW9ucz8uW3RoaXMuc3RhdGUuYWN0aXZlQ3VzdG9taXplSm12SWRdPy5pc0VuYWJsZWQgPz8gZmFsc2VcclxuICB9XHJcblxyXG4gIGdldFNob3dSdW50aW1lQWRkZWRMYXllclN0YXR1cyA9ICgpID0+IHtcclxuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbmZpZz8uY3VzdG9taXplTGF5ZXJPcHRpb25zPy5bdGhpcy5zdGF0ZS5hY3RpdmVDdXN0b21pemVKbXZJZF0/LnNob3dSdW50aW1lQWRkZWRMYXllcnMgPz8gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgZ2V0U2VsZWN0ZWRWYWx1ZXMgPSAoKSA9PiB7XHJcbiAgICAvLyBGb3IgdGhlIGFwcCB0aGF0IGhhcyBgc2hvd0ppbXVMYXllclZpZXdJZHNgLCB1c2VzIGl0IGRpcmVjdGx5XHJcbiAgICBjb25zdCByZXQgPSB7fVxyXG4gICAgaWYgKHRoaXMucHJvcHMuY29uZmlnPy5jdXN0b21pemVMYXllck9wdGlvbnMpIHtcclxuICAgICAgZm9yIChjb25zdCBtYXBJZCBvZiBPYmplY3Qua2V5cyh0aGlzLnByb3BzLmNvbmZpZz8uY3VzdG9taXplTGF5ZXJPcHRpb25zKSkge1xyXG4gICAgICAgIGlmKHRoaXMucHJvcHMuY29uZmlnLmN1c3RvbWl6ZUxheWVyT3B0aW9uc1ttYXBJZF0uaXNFbmFibGVkKSB7XHJcbiAgICAgICAgICByZXRbbWFwSWRdID0gdGhpcy5wcm9wcy5jb25maWcuY3VzdG9taXplTGF5ZXJPcHRpb25zW21hcElkXS5zaG93SmltdUxheWVyVmlld0lkc1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmV0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZ2V0QWxsSXRlbXNJbk1hcFZpZXcodGhpcy5zdGF0ZS5hY3RpdmVDdXN0b21pemVKbXZJZCwgZmFsc2UpXHJcbiAgfVxyXG5cclxuICBpc01hcFdpZGdldEVtcHR5ID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgY29uc3QgbWFwVmlld3MgPSBNYXBWaWV3TWFuYWdlci5nZXRJbnN0YW5jZSgpLmdldEppbXVNYXBWaWV3R3JvdXAodGhpcy5wcm9wcy51c2VNYXBXaWRnZXRJZHM/LlswXSk/LmppbXVNYXBWaWV3cyB8fCB7fVxyXG4gICAgLy8gVGhlIGNvbm5lY3RlZCB3aWRnZXQgb25seSBoYXZlIE9ORSBtYXAgdmlldyAmIGhhdmUgbm8gZGF0YSBzb3VyY2VcclxuICAgIGlmIChPYmplY3Qua2V5cyhtYXBWaWV3cykubGVuZ3RoIDw9IDEgJiYgIU9iamVjdC52YWx1ZXMobWFwVmlld3MpPy5bMF0/LmRhdGFTb3VyY2VJZCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgbGV0IGNhcmRMYXlvdXRDb250ZW50ID0gbnVsbFxyXG4gICAgY29uc3QgbGFiZWwgPSA8TGFiZWwgaWQ9J211bHRpcGxlLWppbXUtbWFwLWRlc2MnPnt0aGlzLnRyYW5zbGF0ZSgnY3VzdG9taXplRGVzY3JpcHRpb24nKX08L0xhYmVsPlxyXG5cclxuICAgIGlmICh0aGlzLnN0YXRlLmNhcmRTdHlsZSkge1xyXG4gICAgICBjYXJkTGF5b3V0Q29udGVudCA9IChcclxuICAgICAgICA8U2V0dGluZ1JvdyBmbG93PVwid3JhcFwiPlxyXG4gICAgICAgICAgPEdyb3VwUmFkaW9zIHZhbHVlPXt0aGlzLnN0YXRlLmNhcmRMYXlvdXRWYWx1ZX1cclxuICAgICAgICAgICAgbmFtZT17dGhpcy50cmFuc2xhdGUoJ2NhcmRTdHlsZScpfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNhcmRMYXlvdXRDaGFuZ2V9XHJcbiAgICAgICAgICAgIGl0ZW1zSWRzPXtbJ2F1dG8nLCAnc2lkZUJ5U2lkZScsICdzdGFjayddfVxyXG4gICAgICAgICAgICBpdGVtc09wdGlvbnM9e09iamVjdC52YWx1ZXMoQ2FyZExheW91dCl9ID5cclxuICAgICAgICAgIDwvR3JvdXBSYWRpb3M+XHJcbiAgICAgICAgPC9TZXR0aW5nUm93PlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGVnZW5kTW9kZUNvbnRlbnQgPSAoXHJcbiAgICAgIC8vIFRoZSBpdGVtc0lkcyBhbmQgaXRlbXNPcHRpb25zIHNob3VsZCBzdGF5IHRoZSBzYW1lIG9yZGVyXHJcbiAgICAgIDxTZXR0aW5nUm93IGZsb3c9XCJ3cmFwXCI+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5MZWZ0OiAnLTAuNXJlbScgfX0+XHJcbiAgICAgICAgICA8R3JvdXBSYWRpb3NcclxuICAgICAgICAgICAgbmFtZT17dGhpcy50cmFuc2xhdGUoJ2xlZ2VuZE1vZGUnKX1cclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubGVnZW5kTW9kZX1cclxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25MZWdlbmRNb2RlQ2hhbmdlfVxyXG4gICAgICAgICAgICBpdGVtc0lkcz17WydzaG93VmlzaWJsZScsICdzaG93V2l0aGluRXh0ZW50J119XHJcbiAgICAgICAgICAgIGl0ZW1zT3B0aW9ucz17T2JqZWN0LnZhbHVlcyhFTGVnZW5kTW9kZSl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L1NldHRpbmdSb3c+XHJcbiAgICApXHJcblxyXG4gICAgbGV0IGRpc3BsYXlTdHlsZUNvbnRlbnRcclxuICAgIGlmICh0aGlzLnByb3BzLmNvbmZpZy5zdHlsZT8udXNlQ3VzdG9tKSB7XHJcbiAgICAgIGRpc3BsYXlTdHlsZUNvbnRlbnQgPSAnYmxvY2snXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkaXNwbGF5U3R5bGVDb250ZW50ID0gJ25vbmUnXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjc3M9e2dldFN0eWxlKHRoaXMucHJvcHMudGhlbWUpfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpZGdldC1zZXR0aW5nLWxlZ2VuZFwiPlxyXG4gICAgICAgICAgPFNldHRpbmdTZWN0aW9uXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1hcC1zZWxlY3Rvci1zZWN0aW9uXCJcclxuICAgICAgICAgICAgcm9sZT1cImdyb3VwXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPFNldHRpbmdSb3cgbGFiZWw9e3RoaXMuZ2V0Rm9ybWF0dGVkTWVzc2FnZSgnc2VsZWN0TWFwV2lkZ2V0Jyl9IC8+XHJcbiAgICAgICAgICAgIDxTZXR0aW5nUm93PlxyXG4gICAgICAgICAgICAgIDxNYXBXaWRnZXRTZWxlY3RvclxyXG4gICAgICAgICAgICAgICAgb25TZWxlY3Q9e3RoaXMub25NYXBXaWRnZXRTZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgIHVzZU1hcFdpZGdldElkcz17dGhpcy5wcm9wcy51c2VNYXBXaWRnZXRJZHN9XHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPC9TZXR0aW5nUm93PlxyXG5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMudXNlTWFwV2lkZ2V0SWRzPy5bMF0gJiZcclxuICAgICAgICAgICAgICA8U2V0dGluZ1Jvd1xyXG4gICAgICAgICAgICAgICAgbGFiZWw9e2xhYmVsfVxyXG4gICAgICAgICAgICAgICAgZmxvdz0nd3JhcCdcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9e3RoaXMudHJhbnNsYXRlKCdjdXN0b21pemVEZXNjcmlwdGlvbicpfVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPSdjdXN0b21pemUtbGF5ZXItbGlzdCdcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuaXNNYXBXaWRnZXRFbXB0eSgpID9cclxuICAgICAgICAgICAgICAgICAgICA8QWxlcnRcclxuICAgICAgICAgICAgICAgICAgICAgIHRhYkluZGV4PXswfVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsnd2FybmluZ01zZyd9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvcGVuXHJcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXt0aGlzLnRyYW5zbGF0ZSgnY3VzdG9taXplTGF5ZXJXYXJuaW5ncycpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZT17J3dhcm5pbmcnfVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICAgICAgICAgIDxMYXllclNldHRpbmdcclxuICAgICAgICAgICAgICAgICAgICAgIG1hcFdpZGdldElkPXt0aGlzLnByb3BzLnVzZU1hcFdpZGdldElkcz8uWzBdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgb25NYXBJdGVtQ2xpY2s9e3RoaXMub25MaXN0SXRlbUJvZHlDbGlja31cclxuICAgICAgICAgICAgICAgICAgICAgIG1hcFZpZXdJZD17dGhpcy5zdGF0ZS5hY3RpdmVDdXN0b21pemVKbXZJZH1cclxuICAgICAgICAgICAgICAgICAgICAgIGlzQ3VzdG9taXplRW5hYmxlZD17dGhpcy5nZXRBY3RpdmVDdXN0b21pemVTdGF0dXMoKX1cclxuICAgICAgICAgICAgICAgICAgICAgIGlzU2hvd1J1bnRpbWVBZGRlZExheWVyRW5hYmxlZD17dGhpcy5nZXRTaG93UnVudGltZUFkZGVkTGF5ZXJTdGF0dXMoKX1cclxuICAgICAgICAgICAgICAgICAgICAgIHNob3dUYWJsZT17ZmFsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICBvblRvZ2dsZUN1c3RvbWl6ZT17dGhpcy5vbkN1c3RvbWl6ZUxheWVyQ2hhbmdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgb25TaG93UnVudGltZUFkZGVkTGF5ZXJzQ2hhbmdlPXt0aGlzLm9uU2hvd1J1bnRpbWVBZGRlZExheWVyc0NoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0ZWRMYXllcklkQ2hhbmdlPXt0aGlzLm9uTGF5ZXJJZENoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVzPXt0aGlzLmdldFNlbGVjdGVkVmFsdWVzKCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICBoaWRlTGF5ZXJzPXt0aGlzLmhpZGVMYXllcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICA8L1NldHRpbmdSb3c+XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIDwvU2V0dGluZ1NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgPFNldHRpbmdTZWN0aW9uXHJcbiAgICAgICAgICAgIHRpdGxlPXt0aGlzLnRyYW5zbGF0ZSgnbGVnZW5kTW9kZScpfVxyXG4gICAgICAgICAgICByb2xlPVwiZ3JvdXBcIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPXt0aGlzLnRyYW5zbGF0ZSgnbGVnZW5kTW9kZScpfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7bGVnZW5kTW9kZUNvbnRlbnR9XHJcbiAgICAgICAgICA8L1NldHRpbmdTZWN0aW9uPlxyXG5cclxuICAgICAgICAgIDxTZXR0aW5nU2VjdGlvblxyXG4gICAgICAgICAgICB0aXRsZT17dGhpcy50cmFuc2xhdGUoJ29wdGlvbnMnKX1cclxuICAgICAgICAgICAgcm9sZT1cImdyb3VwXCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD17dGhpcy50cmFuc2xhdGUoJ29wdGlvbnMnKX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPFNldHRpbmdSb3cgdGFnPSdsYWJlbCcgbGFiZWw9e3RoaXMuZ2V0Rm9ybWF0dGVkTWVzc2FnZSgnc2hvd0Jhc2VNYXAnKX0gPlxyXG4gICAgICAgICAgICAgIDxTd2l0Y2hcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhbi14LXN3aXRjaFwiXHJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtcclxuICAgICAgICAgICAgICAgICAgKHRoaXMucHJvcHMuY29uZmlnICYmIHRoaXMucHJvcHMuY29uZmlnLnNob3dCYXNlTWFwKSB8fCBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGF0YS1rZXk9XCJzaG93QmFzZU1hcFwiXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLm9uT3B0aW9uc0NoYW5nZWQoZXZ0LnRhcmdldC5jaGVja2VkLCAnc2hvd0Jhc2VNYXAnKVxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L1NldHRpbmdSb3c+XHJcblxyXG4gICAgICAgICAgICB7LyogPFNldHRpbmdSb3cgdGFnPSdsYWJlbCcgbGFiZWw9e3RoaXMuZ2V0Rm9ybWF0dGVkTWVzc2FnZSgncmVzcGVjdExheWVyRGVmaW5pdGlvbkV4cCcpfSA+XHJcbiAgICAgICAgICAgICAgPFN3aXRjaFxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FuLXgtc3dpdGNoXCJcclxuICAgICAgICAgICAgICAgIGNoZWNrZWQ9e1xyXG4gICAgICAgICAgICAgICAgICAodGhpcy5wcm9wcy5jb25maWcgJiYgdGhpcy5wcm9wcy5jb25maWcucmVzcGVjdExheWVyRGVmaW5pdGlvbkV4cCkgfHwgZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGEta2V5PVwicmVzcGVjdExheWVyRGVmaW5pdGlvbkV4cFwiXHJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLm9uT3B0aW9uc0NoYW5nZWQoZXZ0LnRhcmdldC5jaGVja2VkLCAncmVzcGVjdExheWVyRGVmaW5pdGlvbkV4cCcpXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvU2V0dGluZ1Jvdz4gKi99XHJcblxyXG4gICAgICAgICAgICA8U2V0dGluZ1JvdyB0YWc9J2xhYmVsJyBsYWJlbD17dGhpcy5nZXRGb3JtYXR0ZWRNZXNzYWdlKCdjYXJkU3R5bGUnKX0gPlxyXG4gICAgICAgICAgICAgIDxTd2l0Y2hcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhbi14LXN3aXRjaFwiXHJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtcclxuICAgICAgICAgICAgICAgICAgKHRoaXMucHJvcHMuY29uZmlnICYmIHRoaXMucHJvcHMuY29uZmlnLmNhcmRTdHlsZSkgfHwgZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGEta2V5PVwiY2FyZFN0eWxlXCJcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMub25PcHRpb25zQ2hhbmdlZChldnQudGFyZ2V0LmNoZWNrZWQsICdjYXJkU3R5bGUnKVxyXG4gICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L1NldHRpbmdSb3c+XHJcbiAgICAgICAgICAgIHtjYXJkTGF5b3V0Q29udGVudH1cclxuXHJcbiAgICAgICAgICA8L1NldHRpbmdTZWN0aW9uPlxyXG5cclxuICAgICAgICAgIDxTZXR0aW5nU2VjdGlvbj5cclxuICAgICAgICAgICAgPFNldHRpbmdSb3dcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhZHZhbmNlZC1zZXR0aW5nLXJvd1wiXHJcbiAgICAgICAgICAgICAgdGFnPSdsYWJlbCdcclxuICAgICAgICAgICAgICBsYWJlbD17XHJcbiAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZSBpZD1cImFkdmFuY2VcIiBkZWZhdWx0TWVzc2FnZT1cIkFkdmFuY2VkXCIgLz5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8U3dpdGNoXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjYW4teC1zd2l0Y2hcIlxyXG4gICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5nZXRTdHlsZUNvbmZpZygpLnVzZUN1c3RvbSB8fCBmYWxzZX1cclxuICAgICAgICAgICAgICAgIGRhdGEta2V5PVwic2hvd0Jhc2VNYXBcIlxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhldnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5vblVzZUN1c3RvbVN0eWxlQ2hhbmdlZChldnQudGFyZ2V0LmNoZWNrZWQpXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvU2V0dGluZ1Jvdz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00XCIgc3R5bGU9e3sgZGlzcGxheTogZGlzcGxheVN0eWxlQ29udGVudCB9fT5cclxuICAgICAgICAgICAgICA8U2V0dGluZ1Jvd1xyXG4gICAgICAgICAgICAgICAgbGFiZWw9ezxGb3JtYXR0ZWRNZXNzYWdlIGlkPVwiZm9udFwiIGRlZmF1bHRNZXNzYWdlPVwiRm9udFwiIC8+fVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxUaGVtZUNvbG9yUGlja2VyXHJcbiAgICAgICAgICAgICAgICAgIGljb249e3RleHRJY29ufVxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwid2l0aC1pY29uXCJcclxuICAgICAgICAgICAgICAgICAgc3BlY2lmaWNUaGVtZT17dGhpcy5wcm9wcy50aGVtZTJ9XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFN0eWxlQ29uZmlnKCkuZm9udENvbG9yIHx8ICcnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25Gb250U3R5bGVDaGFuZ2VkfVxyXG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXt0aGlzLnRyYW5zbGF0ZSgnZm9udENvbG9yJyl9XHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvU2V0dGluZ1Jvdz5cclxuICAgICAgICAgICAgICA8U2V0dGluZ1Jvd1xyXG4gICAgICAgICAgICAgICAgbGFiZWw9e1xyXG4gICAgICAgICAgICAgICAgICA8Rm9ybWF0dGVkTWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgIGlkPVwiYmFja2dyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdE1lc3NhZ2U9XCJCYWNrZ3JvdW5kXCJcclxuICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8VGhlbWVDb2xvclBpY2tlclxyXG4gICAgICAgICAgICAgICAgICBzcGVjaWZpY1RoZW1lPXt0aGlzLnByb3BzLnRoZW1lMn1cclxuICAgICAgICAgICAgICAgICAgdmFsdWU9e1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U3R5bGVDb25maWcoKS5iYWNrZ3JvdW5kPy5jb2xvciB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMudGhlbWUyLnN5cy5jb2xvci5zdXJmYWNlLnBhcGVyIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgJydcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkJhY2tncm91bmRTdHlsZUNoYW5nZX1cclxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD17dGhpcy50cmFuc2xhdGUoJ2JhY2tncm91bmRDb2xvcicpfVxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L1NldHRpbmdSb3c+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9TZXR0aW5nU2VjdGlvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxuIGV4cG9ydCBmdW5jdGlvbiBfX3NldF93ZWJwYWNrX3B1YmxpY19wYXRoX18odXJsKSB7IF9fd2VicGFja19wdWJsaWNfcGF0aF9fID0gdXJsIH0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=