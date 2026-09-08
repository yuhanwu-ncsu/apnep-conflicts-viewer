System.register(["jimu-core/emotion","jimu-core","jimu-ui"],function(e,t){var r={},i={},o={};return{setters:[function(e){r.jsx=e.jsx,r.jsxs=e.jsxs},function(e){i.MessageManager=e.MessageManager,i.React=e.React,i.ReactRedux=e.ReactRedux,i.ViewChangeMessage=e.ViewChangeMessage,i.appActions=e.appActions,i.css=e.css,i.getAppStore=e.getAppStore,i.hooks=e.hooks,i.jimuHistory=e.jimuHistory},function(e){o.Button=e.Button,o.WidgetPlaceholder=e.WidgetPlaceholder}],execute:function(){e((()=>{var e={549(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="14" height="3.5" x="1" y="1.5" fill="currentColor" rx="1.75"></rect><rect width="12.5" height="3" x="2.5" y="6.75" fill="currentColor" opacity=".55" rx="1.5"></rect><rect width="12.5" height="3" x="2.5" y="11.25" fill="currentColor" opacity=".55" rx="1.5"></rect></svg>'},244(e){"use strict";e.exports=i},386(e){"use strict";e.exports=r},321(e){"use strict";e.exports=o}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.p="";var a={};return n.p=window.jimuConfig.baseUrl,(()=>{"use strict";n.r(a),n.d(a,{__set_webpack_public_path__:()=>d,default:()=>c});var e=n(386),t=n(244),r=n(321);const i={_widgetLabel:"Category Navigator",categoryLevel:"Categories",viewLevel:"Views",selectSection:"Select a section in the widget settings to start navigation.",addCategories:"Add categories in the widget settings to start navigation.",emptyCategory:"This category has no views."};var o=n(549),l=n.n(o);const s=t.css`
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
    background-color: var(--sys-color-primary-light) !important;
    color: var(--sys-color-primary-text) !important;
    border-color: transparent !important;
    font-weight: bold;
  }
`,c=o=>{var n,a,c,d,p;const u=t.hooks.useTranslation(i),v=null===(n=o.config)||void 0===n?void 0:n.sectionId,g=null!==(c=null===(a=o.config)||void 0===a?void 0:a.categories)&&void 0!==c?c:[],[m,f]=t.React.useState(0),x=t.ReactRedux.useSelector(e=>{var t,r,i,o;return v&&null!==(o=null===(i=null===(r=null===(t=e.appConfig)||void 0===t?void 0:t.sections)||void 0===r?void 0:r[v])||void 0===i?void 0:i.views)&&void 0!==o?o:[]}),b=t.ReactRedux.useSelector(e=>{var t;const r=null===(t=e.appConfig)||void 0===t?void 0:t.views;return r?Object.keys(r).reduce((e,t)=>{var i,o;return e[t]=null!==(o=null===(i=r[t])||void 0===i?void 0:i.label)&&void 0!==o?o:t,e},{}):{}}),w=t.ReactRedux.useSelector(e=>{var t,r,i;return v?null===(i=null===(r=null===(t=e.appRuntimeInfo)||void 0===t?void 0:t.sectionNavInfos)||void 0===r?void 0:r[v])||void 0===i?void 0:i.currentViewId:null}),h=Math.min(m,Math.max(g.length-1,0)),y=g[h];if(t.React.useEffect(()=>{if(!w||0===g.length)return;const e=g.findIndex(e=>{var t;return null===(t=e.viewIds)||void 0===t?void 0:t.includes(w)});e>=0&&e!==m&&f(e)},[w]),!v)return(0,e.jsx)(r.WidgetPlaceholder,{icon:l(),message:u("selectSection"),widgetId:o.id});if(0===g.length)return(0,e.jsx)(r.WidgetPlaceholder,{icon:l(),message:u("addCategories"),widgetId:o.id});const j=e=>{var r,i,o;if(!v||e===w)return;const n=null===(i=null===(r=(0,t.getAppStore)().getState().appRuntimeInfo)||void 0===r?void 0:r.sectionNavInfos)||void 0===i?void 0:i[v],a=null!==(o=null==n?void 0:n.currentViewId)&&void 0!==o?o:x[0],l={previousViewId:a,currentViewId:e};(0,t.getAppStore)().dispatch(t.appActions.sectionNavInfoChanged(v,l)),t.jimuHistory.changeViewBySectionNavInfo(v,l),t.MessageManager.getInstance().publishMessage(new t.ViewChangeMessage(v,e,a))},k=null!==(p=null===(d=null==y?void 0:y.viewIds)||void 0===d?void 0:d.filter(e=>x.includes(e)))&&void 0!==p?p:[];return(0,e.jsxs)("div",{className:"widget-category-navigator jimu-widget",css:s,children:[(0,e.jsx)("style",{children:'\n  .widget-legend {\n    border-radius: 14px !important;\n    overflow: hidden !important;\n    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18) !important;\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-pill .jimu-btn {\n    border-radius: 50rem !important;\n    padding: 4px 14px !important;\n    font-weight: 600;\n    background: rgba(255, 255, 255, 0.8) !important;\n    border-color: transparent !important;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-pill .jimu-btn:hover {\n    background: rgba(255, 255, 255, 0.95) !important;\n  }\n  .widget-filter .filter-item-pill .jimu-btn.frame-active {\n    background-color: var(--sys-color-primary-light) !important;\n    color: var(--sys-color-primary-text) !important;\n    font-weight: bold;\n  }\n  .widget-filter [class*="filter-item-pill"] {\n    border-radius: 50rem !important;\n    padding: 4px 14px !important;\n    background: rgba(255, 255, 255, 0.8) !important;\n    border: none !important;\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.14);\n    backdrop-filter: blur(8px);\n    -webkit-backdrop-filter: blur(8px);\n  }\n  .widget-filter .filter-item-toggle-pill:has(input:checked) {\n    background-color: var(--sys-color-primary-light) !important;\n  }\n  .widget-filter [class*="toggle-name"],\n  .widget-filter [class*="filter-item-name"] {\n    font-weight: 600;\n    color: var(--ref-palette-neutral-1300);\n    margin-inline-end: 8px;\n  }\n  .widget-filter .filter-item-toggle-pill:has(input:checked) .toggle-name {\n    color: var(--sys-color-primary-text);\n    font-weight: bold;\n  }\n'}),(0,e.jsxs)("div",{className:"category-level",role:"group","aria-label":u("categoryLevel"),children:[(0,e.jsx)("span",{className:"level-caption",children:u("categoryLevel")}),g.map((t,i)=>(0,e.jsx)(r.Button,{size:"default",type:i===h?"primary":"secondary",active:i===h,"aria-pressed":i===h,onClick:()=>(e=>{var t;f(e);const r=g[e];if(!r||(null===(t=r.viewIds)||void 0===t?void 0:t.includes(w)))return;const i=r.viewIds.find(e=>x.includes(e));i&&j(i)})(i),children:t.label},i))]}),k.length>0&&(0,e.jsxs)("div",{className:"view-level",role:"group","aria-label":u("viewLevel"),children:[(0,e.jsx)("span",{className:"level-caption",children:u("viewLevel")}),k.map(t=>{var i;return(0,e.jsx)(r.Button,{size:"sm",type:"default",active:t===w,"aria-pressed":t===w,onClick:()=>j(t),children:null!==(i=b[t])&&void 0!==i?i:t},t)})]}),0===k.length&&(0,e.jsx)("div",{className:"view-level","aria-label":u("viewLevel"),children:u("emptyCategory")})]})};function d(e){n.p=e}})(),a})())}}});