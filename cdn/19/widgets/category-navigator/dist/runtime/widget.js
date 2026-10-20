System.register(["jimu-core/emotion","jimu-core","jimu-ui"],function(e,t){var i={},n={},o={};return{setters:[function(e){i.jsx=e.jsx,i.jsxs=e.jsxs},function(e){n.MessageManager=e.MessageManager,n.React=e.React,n.ReactRedux=e.ReactRedux,n.ViewChangeMessage=e.ViewChangeMessage,n.appActions=e.appActions,n.css=e.css,n.getAppStore=e.getAppStore,n.hooks=e.hooks,n.jimuHistory=e.jimuHistory},function(e){o.Button=e.Button,o.WidgetPlaceholder=e.WidgetPlaceholder}],execute:function(){e((()=>{var e={549(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="14" height="3.5" x="1" y="1.5" fill="currentColor" rx="1.75"></rect><rect width="12.5" height="3" x="2.5" y="6.75" fill="currentColor" opacity=".55" rx="1.5"></rect><rect width="12.5" height="3" x="2.5" y="11.25" fill="currentColor" opacity=".55" rx="1.5"></rect></svg>'},244(e){"use strict";e.exports=n},386(e){"use strict";e.exports=i},321(e){"use strict";e.exports=o}},t={};function r(i){var n=t[i];if(void 0!==n)return n.exports;var o=t[i]={exports:{}};return e[i](o,o.exports,r),o.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var i in t)r.o(t,i)&&!r.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="";var a={};return r.p=window.jimuConfig.baseUrl,(()=>{"use strict";r.r(a),r.d(a,{__set_webpack_public_path__:()=>c,default:()=>s});var e=r(386),t=r(244),i=r(321);const n={_widgetLabel:"Category Navigator",categoryLevel:"Categories",viewLevel:"Views",selectSection:"Select a section in the widget settings to start navigation.",addCategories:"Add categories in the widget settings to start navigation.",emptyCategory:"This category has no views."};var o=r(549),l=r.n(o);const d=t.css`
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
  .category-level button.active,
  .view-level button.active {
    background-color: #0066b4 !important;
    color: #ffffff !important;
    border-color: transparent !important;
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
    background-color: #dce5f1 !important;
    color: var(--sys-color-primary-text) !important;
  }
  .category-level button:focus-visible,
  .view-level button:focus-visible {
    outline: 2px solid #0064b2;
    outline-offset: 2px;
  }
`,s=o=>{var r,a,s,c,g;const u=t.hooks.useTranslation(n),p=null===(r=o.config)||void 0===r?void 0:r.sectionId,v=null!==(s=null===(a=o.config)||void 0===a?void 0:a.categories)&&void 0!==s?s:[],[f,w]=t.React.useState(0),b=t.ReactRedux.useSelector(e=>{var t,i,n,o;return p&&null!==(o=null===(n=null===(i=null===(t=e.appConfig)||void 0===t?void 0:t.sections)||void 0===i?void 0:i[p])||void 0===n?void 0:n.views)&&void 0!==o?o:[]}),m=t.ReactRedux.useSelector(e=>{var t;const i=null===(t=e.appConfig)||void 0===t?void 0:t.views;return i?Object.keys(i).reduce((e,t)=>{var n,o;return e[t]=null!==(o=null===(n=i[t])||void 0===n?void 0:n.label)&&void 0!==o?o:t,e},{}):{}}),x=t.ReactRedux.useSelector(e=>{var t,i,n,o,r,a,l,d,s;if(!p)return null;const c=null===(i=null===(t=e.appConfig)||void 0===t?void 0:t.sections)||void 0===i?void 0:i[p];return null!==(s=null!==(l=null!==(a=null===(r=null===(o=null===(n=e.appRuntimeInfo)||void 0===n?void 0:n.sectionNavInfos)||void 0===o?void 0:o[p])||void 0===r?void 0:r.currentViewId)&&void 0!==a?a:null==c?void 0:c.defaultView)&&void 0!==l?l:null===(d=null==c?void 0:c.views)||void 0===d?void 0:d[0])&&void 0!==s?s:null}),h=Math.min(f,Math.max(v.length-1,0)),y=v[h];if(t.React.useEffect(()=>{if(!x||0===v.length)return;const e=v.findIndex(e=>{var t;return null===(t=e.viewIds)||void 0===t?void 0:t.includes(x)});e>=0&&e!==f&&w(e)},[x]),!p)return(0,e.jsx)(i.WidgetPlaceholder,{icon:l(),message:u("selectSection"),widgetId:o.id});if(0===v.length)return(0,e.jsx)(i.WidgetPlaceholder,{icon:l(),message:u("addCategories"),widgetId:o.id});const j=e=>{var i,n,o;if(!p||e===x)return;const r=null===(n=null===(i=(0,t.getAppStore)().getState().appRuntimeInfo)||void 0===i?void 0:i.sectionNavInfos)||void 0===n?void 0:n[p],a=null!==(o=null==r?void 0:r.currentViewId)&&void 0!==o?o:b[0],l={previousViewId:a,currentViewId:e};(0,t.getAppStore)().dispatch(t.appActions.sectionNavInfoChanged(p,l)),t.jimuHistory.changeViewBySectionNavInfo(p,l),t.MessageManager.getInstance().publishMessage(new t.ViewChangeMessage(p,e,a))},k=null!==(g=null===(c=null==y?void 0:y.viewIds)||void 0===c?void 0:c.filter(e=>b.includes(e)))&&void 0!==g?g:[];return(0,e.jsxs)("div",{className:"widget-category-navigator jimu-widget",css:d,children:[(0,e.jsx)("style",{children:'\n  .widget-legend {\n    border-radius: 17px !important;\n    overflow: hidden !important;\n    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18) !important;\n    background-color: #fafafaf2 !important;\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-pill .jimu-btn {\n    border-radius: 50rem !important;\n    padding: 4px 14px !important;\n    font-weight: 600;\n    background: rgba(255, 255, 255, 0.8) !important;\n    border-color: transparent !important;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-pill .jimu-btn:hover {\n    background: rgba(255, 255, 255, 0.95) !important;\n  }\n  .widget-filter .filter-item-pill .jimu-btn.frame-active {\n    background-color: var(--sys-color-primary-light) !important;\n    color: var(--sys-color-primary-text) !important;\n    font-weight: bold;\n  }\n  .widget-filter [class*="filter-item-pill"] {\n    border-radius: 50rem !important;\n    padding: 4px 14px !important;\n    background: rgba(255, 255, 255, 0.8) !important;\n    border: none !important;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter [class*="toggle-name"],\n  .widget-filter [class*="filter-item-name"] {\n    font-weight: 600;\n    color: var(--ref-palette-neutral-1300);\n    margin-inline-end: 8px;\n  }\n  .widget-filter .filter-item[aria-label*="High Pressure"] { --axis: #c57ade; }\n  .widget-filter .filter-item[aria-label*="High Resources"] { --axis: #a9bf39; }\n  .widget-filter .filter-item[aria-label*="High Conflict Zones"] { --axis: #5064a1; }\n  .widget-filter .filter-item-toggle-pill svg { fill: var(--axis, #5a5a5a); }\n  .widget-filter .filter-item-toggle-pill:has(input:checked) {\n    background-color: var(--axis) !important;\n  }\n  .widget-filter .filter-item-toggle-pill:has(input:checked) .toggle-name {\n    color: #ffffff;\n    font-weight: bold;\n  }\n  .widget-filter .filter-item-toggle-pill:has(input:checked) svg {\n    fill: #ffffff;\n  }\n  body { background-color: #f4f1f1; }\n  [data-layoutid="layout_4"] { background-color: #ffffff; }\n  /* Header buttons \u2014 both mirror the React landing "Guided tour" button (white secondary) */\n  [data-widgetid="widget_112"] .widget-text {\n    padding: 0 !important;\n  }\n  [data-widgetid="widget_112"] .widget-text a,\n  [data-widgetid="widget_111"] .jimu-btn,\n  [data-widgetid="widget_111"] .widget-button-link {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 8px;\n    width: 100%;\n    height: 40px !important;\n    padding: 0 12px !important;\n    border: 1px solid #9fb3c1 !important;\n    border-radius: 7px !important;\n    background: #fff !important;\n    color: #31536a !important;\n    font-size: 13px;\n    font-weight: 700;\n    text-decoration: none;\n  }\n  [data-widgetid="widget_112"] .widget-text a:hover,\n  [data-widgetid="widget_111"] .jimu-btn:hover,\n  [data-widgetid="widget_111"] .widget-button-link:hover {\n    border-color: #52789a !important;\n    background: #f2f6f8 !important;\n  }\n  [data-widgetid="widget_111"] .jimu-btn:focus-visible,\n  [data-widgetid="widget_111"] .widget-button-link:focus-visible {\n    outline: 2px solid #0066a5;\n    outline-offset: 2px;\n  }\n'}),(0,e.jsxs)("div",{className:"category-level",role:"group","aria-label":u("categoryLevel"),children:[(0,e.jsx)("span",{className:"level-caption",children:u("categoryLevel")}),v.map((t,n)=>(0,e.jsx)(i.Button,{size:"default",type:n===h?"primary":"secondary",active:n===h,"aria-pressed":n===h,onClick:()=>(e=>{var t;w(e);const i=v[e];if(!i||(null===(t=i.viewIds)||void 0===t?void 0:t.includes(x)))return;const n=i.viewIds.find(e=>b.includes(e));n&&j(n)})(n),children:t.label},n))]}),k.length>0&&(0,e.jsxs)("div",{className:"view-level",role:"group","aria-label":u("viewLevel"),children:[(0,e.jsx)("span",{className:"level-caption",children:u("viewLevel")}),k.map(t=>{var n;return(0,e.jsx)(i.Button,{size:"sm",type:t===x?"primary":"default",active:t===x,"aria-pressed":t===x,onClick:()=>j(t),children:null!==(n=m[t])&&void 0!==n?n:t},t)})]}),0===k.length&&(0,e.jsx)("div",{className:"view-level","aria-label":u("viewLevel"),children:u("emptyCategory")})]})};function c(e){r.p=e}})(),a})())}}});