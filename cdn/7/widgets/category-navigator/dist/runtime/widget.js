System.register(["jimu-core/emotion","jimu-core","jimu-ui"],function(e,t){var i={},r={},o={};return{setters:[function(e){i.jsx=e.jsx,i.jsxs=e.jsxs},function(e){r.MessageManager=e.MessageManager,r.React=e.React,r.ReactRedux=e.ReactRedux,r.ViewChangeMessage=e.ViewChangeMessage,r.appActions=e.appActions,r.css=e.css,r.getAppStore=e.getAppStore,r.hooks=e.hooks,r.jimuHistory=e.jimuHistory},function(e){o.Button=e.Button,o.WidgetPlaceholder=e.WidgetPlaceholder}],execute:function(){e((()=>{var e={549(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="14" height="3.5" x="1" y="1.5" fill="currentColor" rx="1.75"></rect><rect width="12.5" height="3" x="2.5" y="6.75" fill="currentColor" opacity=".55" rx="1.5"></rect><rect width="12.5" height="3" x="2.5" y="11.25" fill="currentColor" opacity=".55" rx="1.5"></rect></svg>'},244(e){"use strict";e.exports=r},386(e){"use strict";e.exports=i},321(e){"use strict";e.exports=o}},t={};function n(i){var r=t[i];if(void 0!==r)return r.exports;var o=t[i]={exports:{}};return e[i](o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="";var l={};return n.p=window.jimuConfig.baseUrl,(()=>{"use strict";n.r(l),n.d(l,{__set_webpack_public_path__:()=>c,default:()=>d});var e=n(386),t=n(244),i=n(321);const r={_widgetLabel:"Category Navigator",categoryLevel:"Categories",viewLevel:"Views",selectSection:"Select a section in the widget settings to start navigation.",addCategories:"Add categories in the widget settings to start navigation.",emptyCategory:"This category has no views."};var o=n(549),a=n.n(o);const s=t.css`
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
`,d=o=>{var n,l,d,c,p;const u=t.hooks.useTranslation(r),v=null===(n=o.config)||void 0===n?void 0:n.sectionId,g=null!==(d=null===(l=o.config)||void 0===l?void 0:l.categories)&&void 0!==d?d:[],[f,m]=t.React.useState(0),w=t.ReactRedux.useSelector(e=>{var t,i,r,o;return v&&null!==(o=null===(r=null===(i=null===(t=e.appConfig)||void 0===t?void 0:t.sections)||void 0===i?void 0:i[v])||void 0===r?void 0:r.views)&&void 0!==o?o:[]}),x=t.ReactRedux.useSelector(e=>{var t;const i=null===(t=e.appConfig)||void 0===t?void 0:t.views;return i?Object.keys(i).reduce((e,t)=>{var r,o;return e[t]=null!==(o=null===(r=i[t])||void 0===r?void 0:r.label)&&void 0!==o?o:t,e},{}):{}}),b=t.ReactRedux.useSelector(e=>{var t,i,r,o,n,l,a,s,d;if(!v)return null;const c=null===(i=null===(t=e.appConfig)||void 0===t?void 0:t.sections)||void 0===i?void 0:i[v];return null!==(d=null!==(a=null!==(l=null===(n=null===(o=null===(r=e.appRuntimeInfo)||void 0===r?void 0:r.sectionNavInfos)||void 0===o?void 0:o[v])||void 0===n?void 0:n.currentViewId)&&void 0!==l?l:null==c?void 0:c.defaultView)&&void 0!==a?a:null===(s=null==c?void 0:c.views)||void 0===s?void 0:s[0])&&void 0!==d?d:null}),h=Math.min(f,Math.max(g.length-1,0)),y=g[h];if(t.React.useEffect(()=>{if(!b||0===g.length)return;const e=g.findIndex(e=>{var t;return null===(t=e.viewIds)||void 0===t?void 0:t.includes(b)});e>=0&&e!==f&&m(e)},[b]),!v)return(0,e.jsx)(i.WidgetPlaceholder,{icon:a(),message:u("selectSection"),widgetId:o.id});if(0===g.length)return(0,e.jsx)(i.WidgetPlaceholder,{icon:a(),message:u("addCategories"),widgetId:o.id});const j=e=>{var i,r,o;if(!v||e===b)return;const n=null===(r=null===(i=(0,t.getAppStore)().getState().appRuntimeInfo)||void 0===i?void 0:i.sectionNavInfos)||void 0===r?void 0:r[v],l=null!==(o=null==n?void 0:n.currentViewId)&&void 0!==o?o:w[0],a={previousViewId:l,currentViewId:e};(0,t.getAppStore)().dispatch(t.appActions.sectionNavInfoChanged(v,a)),t.jimuHistory.changeViewBySectionNavInfo(v,a),t.MessageManager.getInstance().publishMessage(new t.ViewChangeMessage(v,e,l))},k=null!==(p=null===(c=null==y?void 0:y.viewIds)||void 0===c?void 0:c.filter(e=>w.includes(e)))&&void 0!==p?p:[];return(0,e.jsxs)("div",{className:"widget-category-navigator jimu-widget",css:s,children:[(0,e.jsx)("style",{children:'\n  .widget-legend {\n    border-radius: 14px !important;\n    overflow: hidden !important;\n    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18) !important;\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-pill .jimu-btn {\n    border-radius: 50rem !important;\n    padding: 4px 14px !important;\n    font-weight: 600;\n    background: rgba(255, 255, 255, 0.8) !important;\n    border-color: transparent !important;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-pill .jimu-btn:hover {\n    background: rgba(255, 255, 255, 0.95) !important;\n  }\n  .widget-filter .filter-item-pill .jimu-btn.frame-active {\n    background-color: var(--sys-color-primary-light) !important;\n    color: var(--sys-color-primary-text) !important;\n    font-weight: bold;\n  }\n  .widget-filter [class*="filter-item-pill"] {\n    border-radius: 50rem !important;\n    padding: 4px 14px !important;\n    background: rgba(255, 255, 255, 0.8) !important;\n    border: none !important;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-toggle-pill:has(input:checked) {\n    background-color: var(--sys-color-primary-light) !important;\n  }\n  .widget-filter [class*="toggle-name"],\n  .widget-filter [class*="filter-item-name"] {\n    font-weight: 600;\n    color: var(--ref-palette-neutral-1300);\n    margin-inline-end: 8px;\n  }\n  .widget-filter .filter-item-toggle-pill:has(input:checked) .toggle-name {\n    color: var(--sys-color-primary-text);\n    font-weight: bold;\n  }\n'}),(0,e.jsxs)("div",{className:"category-level",role:"group","aria-label":u("categoryLevel"),children:[(0,e.jsx)("span",{className:"level-caption",children:u("categoryLevel")}),g.map((t,r)=>(0,e.jsx)(i.Button,{size:"default",type:r===h?"primary":"secondary",active:r===h,"aria-pressed":r===h,onClick:()=>(e=>{var t;m(e);const i=g[e];if(!i||(null===(t=i.viewIds)||void 0===t?void 0:t.includes(b)))return;const r=i.viewIds.find(e=>w.includes(e));r&&j(r)})(r),children:t.label},r))]}),k.length>0&&(0,e.jsxs)("div",{className:"view-level",role:"group","aria-label":u("viewLevel"),children:[(0,e.jsx)("span",{className:"level-caption",children:u("viewLevel")}),k.map(t=>{var r;return(0,e.jsx)(i.Button,{size:"sm",type:t===b?"primary":"default",active:t===b,"aria-pressed":t===b,onClick:()=>j(t),children:null!==(r=x[t])&&void 0!==r?r:t},t)})]}),0===k.length&&(0,e.jsx)("div",{className:"view-level","aria-label":u("viewLevel"),children:u("emptyCategory")})]})};function c(e){n.p=e}})(),l})())}}});