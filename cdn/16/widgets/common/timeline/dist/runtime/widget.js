System.register(["jimu-core/emotion","jimu-core","jimu-arcgis","jimu-ui","jimu-core/dnd","jimu-theme"],function(e,t){var n={},a={},i={},o={},r={},l={};return{setters:[function(e){n.jsx=e.jsx,n.jsxs=e.jsxs},function(e){a.AppMode=e.AppMode,a.BaseVersionManager=e.BaseVersionManager,a.DataSourceComponent=e.DataSourceComponent,a.DataSourceManager=e.DataSourceManager,a.DataSourceStatus=e.DataSourceStatus,a.DataSourceTypes=e.DataSourceTypes,a.Immutable=e.Immutable,a.React=e.React,a.ReactRedux=e.ReactRedux,a.ReactResizeDetector=e.ReactResizeDetector,a.TimezoneConfig=e.TimezoneConfig,a.classNames=e.classNames,a.css=e.css,a.dataSourceUtils=e.dataSourceUtils,a.dateUtils=e.dateUtils,a.defaultMessages=e.defaultMessages,a.focusElementInKeyboardMode=e.focusElementInKeyboardMode,a.getAppStore=e.getAppStore,a.hooks=e.hooks,a.lodash=e.lodash,a.polished=e.polished,a.useIntl=e.useIntl,a.utils=e.utils},function(e){i.JimuMapViewComponent=e.JimuMapViewComponent,i.MapViewManager=e.MapViewManager,i.loadArcGISJSAPIModules=e.loadArcGISJSAPIModules},function(e){o.Alert=e.Alert,o.Button=e.Button,o.Dropdown=e.Dropdown,o.DropdownButton=e.DropdownButton,o.DropdownItem=e.DropdownItem,o.DropdownMenu=e.DropdownMenu,o.Icon=e.Icon,o.Label=e.Label,o.Paper=e.Paper,o.Popper=e.Popper,o.Switch=e.Switch,o.Tooltip=e.Tooltip,o.Typography=e.Typography,o.WidgetPlaceholder=e.WidgetPlaceholder,o.defaultMessages=e.defaultMessages},function(e){r.interact=e.interact},function(e){l.colorUtils=e.colorUtils}],execute:function(){e((()=>{var e={66008(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="#000" d="m9 6.809 3.276 1.638.448-.894L10 6.19V3H9z"></path><path fill="#000" fill-rule="evenodd" d="M10.293 11.943A5.501 5.501 0 0 0 9.5 1a5.5 5.5 0 0 0-.792 10.943L9.5 13zM14 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0M12 16.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m-1 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" clip-rule="evenodd"></path><path fill="#000" d="M6 16H0v1h6zM13 16h6v1h-6z"></path></svg>'},30394(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 4 16"><path fill="#282828" fill-rule="evenodd" d="M.322.03A.504.504 0 0 1 .96.305L4 8 .96 15.695a.504.504 0 0 1-.638.275.464.464 0 0 1-.29-.606L2.94 8 .031.636A.464.464 0 0 1 .322.03" clip-rule="evenodd"></path></svg>'},25373(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M8 3c1.175 0 2.27.337 3.195.92l.9-.598A7 7 0 0 0 2.5 13.33h10.999A6.97 6.97 0 0 0 15 9a6.97 6.97 0 0 0-1.256-4.002l-.603.906C13.686 6.808 14 7.867 14 9a5.97 5.97 0 0 1-1.008 3.33H3.008A6 6 0 0 1 8 3m-.183 6.9a1.322 1.322 0 0 1-.43-2.158L13 4 9.258 9.612a1.32 1.32 0 0 1-1.441.287" clip-rule="evenodd"></path></svg>'},50024(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0m1 0A7 7 0 1 1 1 8a7 7 0 0 1 14 0M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" clip-rule="evenodd"></path></svg>'},9470(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2 2.22V1l1 .7 8.128 5.69L12 8l-.872.61L3 14.3 2 15V2.22M10.256 8 3 13.08V2.92zM14 1h-1v14h1z" clip-rule="evenodd"></path></svg>'},67489(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M5 1H4v14h1zm7 0h-1v14h1z" clip-rule="evenodd"></path></svg>'},2747(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="m2 1 12 7-12 7zm9.983 6.999L3 2.723v10.553z" clip-rule="evenodd"></path></svg>'},65962(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0m1 0A7 7 0 1 1 1 8a7 7 0 0 1 14 0M7.5 4.5a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3z" clip-rule="evenodd"></path></svg>'},69802(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M14 2.22V1l-1 .7-8.128 5.69L4 8l.872.61L13 14.3l1 .7V2.22M5.744 8 13 13.08V2.92zM2 1h1v14H2z" clip-rule="evenodd"></path></svg>'},36597(e){e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6.5 7.5A.5.5 0 0 1 7 7h1.5v4.5h1a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1h1V8H7a.5.5 0 0 1-.5-.5"></path><path fill="#000" fill-rule="evenodd" d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16m0-1A7 7 0 1 0 8 1a7 7 0 0 0 0 14" clip-rule="evenodd"></path></svg>'},62686(e){"use strict";e.exports=i},79244(e){"use strict";e.exports=a},26245(e){"use strict";e.exports=r},67386(e){"use strict";e.exports=n},1888(e){"use strict";e.exports=l},14321(e){"use strict";e.exports=o}},t={};function s(n){var a=t[n];if(void 0!==a)return a.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,s),i.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.p="";var c={};return s.p=window.jimuConfig.baseUrl,(()=>{"use strict";s.r(c),s.d(c,{__set_webpack_public_path__:()=>Ye,default:()=>He});var e,t,n,a,i=s(67386),o=s(79244),r=s(62686),l=s(14321);!function(e){e.Classic="CLASSIC",e.Modern="MODERN"}(e||(e={})),function(e){e.Slowest="SLOWEST",e.Slow="SLOW",e.Medium="MEDIUM",e.Fast="FAST",e.Fastest="FASTEST"}(t||(t={})),function(e){e.instant="INSTANT",e.current="CURRENT",e.cumulatively="CUMULATIVE"}(n||(n={})),function(e){e.Start="START",e.Saved="SAVED"}(a||(a={}));const u=["year","month","day"],d=["hour","minute","second"],m=[...u,...d];var p;!function(e){e[e.year=31536e3]="year",e[e.month=2592e3]="month",e[e.day=86400]="day",e[e.hour=3600]="hour",e[e.minute=60]="minute",e[e.second=1]="second"}(p||(p={}));const h={slowest:5e3,slow:4e3,medium:3e3,fast:2e3,fastest:1e3};function g(e){let n;const a=1e3*Math.ceil(e/1e3);return Object.keys(h).some(e=>h[e]===a&&(n=e.toUpperCase(),!0)),n||(a>h.slowest?n=t.Slowest:a<h.fastest&&(n=t.Fastest)),n}function f(e=2,t){if(t){const a=null!=t[0]?new Date(t[0]):null,i=null!=t[1]?new Date(t[1]):null;if(null!=a&&null!=i&&a.getTime()===i.getTime())return n.instant;if(2===e)return n.current;if(null==a||0===a.getTime())return n.cumulatively}return 2===e?n.current:n.cumulatively}function v(e,n,i=!1){var r,l,s;const{startTime:c={value:o.dateUtils.VirtualDateType.Min},endTime:u={value:o.dateUtils.VirtualDateType.Max},layerList:d,accuracy:m,stepLength:h}=e||{};let g;const{startTime:f,endTime:v}=function(e,t,n,a){const i=y(n,!0,e,t),o=y(a,!1,e,t);return S(i,o,!0)}(n,d,c,u);if(!f||!v)return null;const x=j(f,v),b=x[0],M=function(e,t,n){const a=(t-e)/1e3/p[n];return{val:a>15?10:a>10?5:1,unit:n}}(f,v,b);if(e){g=(0,o.Immutable)(e);const t=!x.includes(m);t&&(g=g.set("accuracy",b)),h&&(t||p[h.unit]>p[b]||1e3*p[h.unit]*h.val>v-f)&&(g=g.set("stepLength",M))}else g=(0,o.Immutable)(function(e,n){return{layerList:null,startTime:{value:o.dateUtils.VirtualDateType.Min},endTime:{value:o.dateUtils.VirtualDateType.Max},timeDisplayStrategy:"CURRENT",dividedCount:null,accuracy:e,stepLength:n,speed:t.Medium}}(b,M));if(!g.playPosition||g.playPosition===a.Saved){const e=n[Object.keys(n).find(e=>{var t;return w(null===(t=n[e])||void 0===t?void 0:t.type)})],t=null===(s=null===(l=null===(r=null==e?void 0:e.getItemData())||void 0===r?void 0:r.widgets)||void 0===l?void 0:l.timeSlider)||void 0===s?void 0:s.properties;if(t&&(g.playPosition||(g=g.set("playPosition",t.currentTimeExtent?a.Saved:a.Start)),i))if(g.playPosition===a.Saved&&t.currentTimeExtent){const e=S(t.currentTimeExtent[0],t.currentTimeExtent[1],!0);g=g.set("currentTimeExtent",[e.startTime,e.endTime])}else g=g.set("playPosition",a.Start)}return i?(g=g.set("startTime",{value:f}).set("endTime",{value:v}),g):(0,o.Immutable)({config:g,exactStartTime:f,exactEndTime:v,minAccuracy:b,accuracyList:x})}function y(e,t=!0,n,a){let i=null;if(e)if("number"==typeof e.value)i=e.value;else{const r=new Date;if(r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0),e.value===o.dateUtils.VirtualDateType.Today)r.setHours(0),i=r.getTime()+x(e),i=t?i:i+1e3*p.day;else if(e.value===o.dateUtils.VirtualDateType.Now)i=r.getTime()+x(e),i=t?i:i+1e3*p.hour;else if(e.value===o.dateUtils.VirtualDateType.Max||e.value===o.dateUtils.VirtualDateType.Min){const t=b(n,a);t&&(n=t);if(Object.keys(n).filter(e=>null===n[e]).length===Object.keys(n).length)return null;Object.keys(n).forEach(t=>{var a,r;const l=n[t];if(!l)return;const s=l.getTimeInfo();if(e.value===o.dateUtils.VirtualDateType.Max){const e=null===(a=null==s?void 0:s.timeExtent)||void 0===a?void 0:a[1];i=i?Math.max(i,e):e}else{const e=null===(r=null==s?void 0:s.timeExtent)||void 0===r?void 0:r[0];i=i?Math.min(i,e):e}})}}return i}function x(e){return e.offset?e.offset.val*p[e.offset.unit]*1e3:0}function w(e){return e===o.DataSourceTypes.WebMap||e===o.DataSourceTypes.WebScene}function b(e,t){let n=null;const a=Object.keys(e).map(t=>e[t])[0];if(w(null==a?void 0:a.type)){const e=[];a.getAllChildDataSources().forEach(t=>{(t.type===o.DataSourceTypes.MapService||t.type===o.DataSourceTypes.SubtypeGroupLayer||t.type===o.DataSourceTypes.ImageryLayer||t.type===o.DataSourceTypes.ImageryTileLayer||t.type===o.DataSourceTypes.FeatureLayer&&null===o.dataSourceUtils.findMapServiceDataSource(t)||t.type===o.DataSourceTypes.SceneLayer)&&t.supportTime()&&e.push(t)});const i=(null==t?void 0:t.map(e=>e.dataSourceId))||[];n={},e.forEach(e=>{(0===i.length||i.includes(e.id))&&(n[e.id]=e)})}return n}function S(e,t,n=!1){let a;if(a=window.jimuConfig.isBuilder?(0,o.getAppStore)().getState().appStateInBuilder.appConfig.attributes.timezone:(0,o.getAppStore)().getState().appConfig.attributes.timezone,(null==a?void 0:a.type)===o.TimezoneConfig.Specific){const i=o.dataSourceUtils.getTimeZoneOffsetByName(a.value),r=o.dataSourceUtils.getLocalTimeOffset();n?(e=e-r+i,t=t-r+i):(e=e+r-i,t=t+r-i)}return{startTime:e,endTime:t}}function j(e,t){const n=[...u,...d],a=[],i=t-e;return n.forEach(e=>{i>=1e3*p[e]&&a.push(e)}),a}function M(e){return e===o.DataSourceTypes.FeatureLayer||e===o.DataSourceTypes.ImageryLayer||e===o.DataSourceTypes.ImageryTileLayer||e===o.DataSourceTypes.SubtypeGroupLayer||e===o.DataSourceTypes.SceneLayer}var T;function D(e){const{width:t,startTime:n,endTime:a,accuracy:i="hour"}=e,o=T[i],r={year:null,month:null,day:null,hour:null,minute:null,second:null},l=function(e,t,n){const a=n/4;let i,o;const r=(t.getTime()-e.getTime())/31536e6,l=a/r;l>=1?(i=1,o=4*l):(l>=.2?i=5:l>=.1&&l<.2?i=10:l>=.02&&l<.1?i=50:l<.02&&(i=100),o=n/(r/i));return{value:i,tickWidth:o/n}}(new Date(n),new Date(a),t);if(r.year={value:l.value,tickWidth:l.tickWidth},T.month<=o&&1===l.value){const e=function(e,t){const n=e*t/4;let a=null;n>=12?a=1:n>=4?a=3:n>=2&&(a=6);return{value:a,tickWidth:e/(12/a)}}(l.tickWidth,t);if(null!==e.value&&(r.month={value:e.value,tickWidth:e.tickWidth},T.day<=o&&1===e.value)){const e=function(e,t,n){const a=n/4;let i;const o=(t-e)/864e5,r=a/o;i=r>=1?1:r>=.5&&r<1?2:r>=1/7&&r<.5?7:r>=.1&&r<1/7?10:r>=1/15&&r<.1?15:null;return{value:i,tickWidth:1/(o/i)}}(n,a,t);if(null!==e.value&&(r.day={value:e.value,tickWidth:e.tickWidth},T.hour<=o&&1===e.value)){const n=function(e,t){const n=e*t/4;let a;n>=24?a=1:n>=12&&n<24?a=2:n>=4&&n<12?a=6:n>=3&&n<4?a=8:n>=2&&n<3?a=12:n<2&&(a=null);return{value:a,tickWidth:e/(24/a)}}(e.tickWidth,t);if(null!==n.value&&(r.hour={value:n.value,tickWidth:n.tickWidth},T.minute<=o&&1===n.value)){const e=k(n.tickWidth,t);if(null!==e.value&&(r.minute={value:e.value,tickWidth:e.tickWidth},T.second<=o)){const n=k(e.tickWidth,t);null!==n.value&&(r.second={value:n.value,tickWidth:n.tickWidth})}}}}}return r}function k(e,t){const n=e*t/4;let a;n>=60?a=1:n>=12&&n<60?a=5:n>=6&&n<12?a=10:n>=4&&n<6?a=15:n>=2&&n<4?a=30:n<2&&(a=null);return{value:a,tickWidth:e/(60/a)}}function O(e){const{details:t,width:n,localStartTime:a,localEndTime:i,leftPosition:o,endPosition:r,scale:l,intl:s}=e,c=new Date(a),u=new Date(i),d=c.getFullYear(),m=u.getFullYear(),p=[],h=[],g={value:d,label:z(t,c,s,!0),position:0};J(o,r,0,l)&&(p.push(g),h.push(g));let f=function(e,t){let n=new Date(e).getFullYear(),a=null;for(;!a;)n%100%t==0&&(a=n),n++;return a}(a,t.year.value);f===d&&(f=d+t.year.value);for(let e=f;e<=m;e+=t.year.value){const c=new Date(e,0,1,0,0,0),u=(c.getTime()-a)/(i-a);if(!J(o,r,100*u,l))continue;let m=!1;const g=t.year.tickWidth*n/52;g>=1?m=!0:g<.03?m=e%50==0&&e-d>=49:g<.15?m=e%(10*t.year.value)==0&&e-d>=9:g<.3?m=e%(5*t.year.value)==0&&e-d>=4:g<1&&(m=e%2==0);const f=z(t,c,s);m=P(m,f,u,h,n);const v={value:e,label:m?f:null,position:100*u+"%"};m&&h.push(v),p.push(v)}return p}function R(e){const{details:t,width:n,localStartTime:a,localEndTime:i,leftPosition:o,endPosition:r,scale:l,intl:s}=e;if(!t.month||t.month.tickWidth>1&&new Date(i).getMonth()===new Date(a).getMonth())return[];const c=new Date(a),u=new Date(i),d=c.getMonth()+1,m=u.getMonth()+1,p=c.getFullYear(),h=12-d+12*(u.getFullYear()-p-1)+m+1,g=[],f=[];let v=function(e,t){const n=new Date(e);n.setDate(1),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n.setMilliseconds(0),e>n.getTime()&&n.setMonth(n.getMonth()+1);let a=n.getMonth(),i=null;for(;!i;)a%t!==0&&11!==a||(i=a),a++;return i+1}(a,t.month.value);v===d&&(v=d+t.month.value);let y=!1;for(let e=v-d;e<=h-1;e+=t.month.value){const c=new Date(p,d+e-1,1,0,0,0),u=(c.getTime()-a)/(i-a);if(!J(o,r,100*u,l))continue;if(!y||0===c.getMonth()){const e=new Date(c.getFullYear(),c.getMonth()-1,1,0,0,0),n=e.getTime()-a,o=Math.max(n,0)/(i-a);if(f.unshift({value:e.getFullYear(),label:z(t,e,s,!y),position:100*o+"%"}),y=!0,0===c.getMonth())continue}let m=!1;const h=t.month.tickWidth*n;t.year.tickWidth*n>58&&(m=h>=28||(h>=15?c.getMonth()%3==0:(c.getMonth()+1)%12==7));const v=V(t,c,s);m=P(m,v,u,f,n);const x={value:c.getMonth()+1,label:m?v:null,position:100*u+"%"};m&&f.push(x),g.push(x)}return g}function E(e,t,n){let a=!1;const i=n.day.value;if(1!==i){const n=e.getMonth()+1;2===i?(2===n&&28===t||30===t)&&(a=!0):7===i?(2===n&&21===t||28===t)&&(a=!0):10===i?20===t&&(a=!0):15===i&&15===t&&(a=!0)}return a}function C(e){const{details:t,width:n,localStartTime:a,localEndTime:i,leftPosition:o,endPosition:r,scale:l,intl:s}=e;if(!t.day)return[];const c=new Date(a),u=c.getDate(),d=c.getFullYear(),m=c.getMonth(),p=Math.ceil((i-a)/864e5)+1,h=[],g=[],f={value:u,label:V(t,c,s),position:0};g.push(f);let v=function(e,t){let n=new Date(e).getDate(),a=null;for(;!a;)(n-1)%t==0&&1!==n&&(a=n),n++;return a}(a,t.day.value);v===u&&(v=u+t.day.value);for(let e=v-u;e<=p-1;e+=t.day.value){const c=new Date(d,m,u+e,0,0,0),p=c.getDate();if(1===p)continue;const f=(c.getTime()-a)/(i-a);if(!J(o,r,100*f,l))continue;let v=!1;const y=t.day.tickWidth*n;t.month.tickWidth*n>100&&(y>=30?v=!0:y>=15?v=p%2==0:y>=8?v=(p-1)%7==0:y>=3&&(v=11===p||21===p));const x=U(c,t,s);v=P(v,x,f,g,n);const w={value:p,label:v?x:"",position:100*f+"%"};if(v&&g.push(w),h.push(w),E(c,p,t)){const t=new Date(c.getTime());t.setDate(1),t.setMonth(t.getMonth()+1);e+=(t.getTime()-c.getTime())/864e5-1}}return h}function N(e){const{details:t,width:n,localStartTime:a,localEndTime:i,leftPosition:o,endPosition:r,scale:l,intl:s}=e;if(!t.hour)return[];const c=new Date(a),u=c.getHours(),d=c.getFullYear(),m=c.getMonth(),p=c.getDate(),h=Math.ceil((i-a)/36e5)+1,g=[],f=[],v={value:u,label:U(c,t,s),position:0};f.push(v);let y=function(e,t){let n=new Date(e).getHours(),a=null;for(;!a;)n%t===0&&(a=n),n++;return a}(a,t.hour.value);y===u&&(y=u+t.hour.value);for(let e=y-u;e<=h-1;e+=t.hour.value){const s=new Date(d,m,p,u+e,0,0),c=s.getHours();if(0===c)continue;if(s.getTime()>i)break;const h=(s.getTime()-a)/(i-a);if(!J(o,r,100*h,l))continue;let v=!1;const y=t.day.tickWidth*n,x=t.hour.tickWidth*n;y<60?v=!1:y<100?v=c%12==0:x>=40?v=!0:x>=20?v=c%2==0:x>=6.67?v=c%6==0:x>=5?v=c%8==0:x>=3.3&&(v=c%12==0);const w=F(s,t);v=P(v,w,h,f,n);const b={value:c,label:v?w:"",position:100*h+"%"};v&&f.push(b),g.push(b)}return g}function I(e){const{details:t,width:n,localStartTime:a,localEndTime:i,leftPosition:o,endPosition:r,scale:l}=e;if(!t.minute)return[];const s=new Date(a),c=s.getMinutes(),u=s.getFullYear(),d=s.getMonth(),m=s.getDate(),p=s.getHours(),h=(i-a)/6e4+1,g=[],f=[],v={value:c,label:F(s,t),position:0};f.push(v);let y=function(e,t){let n=new Date(e).getMinutes(),a=null;for(;!a;)n%t===0&&(a=n),n++;return a}(a,t.minute.value);y===c&&(y=c+t.minute.value);for(let e=y-c;e<=h-1;e+=t.minute.value){const s=new Date(u,d,m,p,c+e,0),h=s.getMinutes();if(0===s.getMinutes())continue;const v=(s.getTime()-a)/(i-a);if(!J(o,r,100*v,l))continue;let y=!1;const x=t.hour.tickWidth*n,w=t.minute.tickWidth*n;x<60?y=!1:x<=160?y=h%30==0:x<300?y=h%15==0:w>28?y=!0:w>20?y=h%2==0:x>15?y=h%5==0:x>10&&(y=h%10==0);const b=W(s,t);y=P(y,b,v,f,n);const S={value:s.getMinutes(),label:y?b:"",position:100*v+"%"};y&&f.push(S),g.push(S)}return g}function L(e){const{details:t,width:n,localStartTime:a,localEndTime:i,leftPosition:o,endPosition:r,scale:l}=e;if(!t.second)return[];const s=new Date(a),c=s.getSeconds(),u=s.getFullYear(),d=s.getMonth(),m=s.getDate(),p=s.getHours(),h=s.getMinutes(),g=(i-a)/1e3+1,f=[],v=[],y={value:c,label:W(s,t),position:0};v.push(y);let x=function(e,t){let n=new Date(e).getSeconds(),a=null;for(;!a;)n%t===0&&(a=n),n++;return a}(a,t.second.value);x===c&&(x=c+t.second.value);for(let e=x-c;e<=g-1;e+=t.second.value){const s=new Date(u,d,m,p,h,c+e),g=s.getSeconds();if(0===s.getSeconds())continue;const y=(s.getTime()-a)/(i-a);if(!J(o,r,100*y,l))continue;let x=!1;const w=t.minute.tickWidth*n,b=t.second.tickWidth*n;w<60?x=!1:w<=160?x=g%30==0:w<300?x=g%15==0:b>28?x=!0:b>20?x=g%2==0:w>15?x=g%5==0:w>10&&(x=g%10==0);const S=A(s,t);x=P(x,S,y,v,n);const j={value:s.getSeconds(),label:x?S:"",position:100*y+"%"};x&&v.push(j),f.push(j)}return f}function P(e,t,n,a,i){if(e){const o=a[a.length-1];if(!o)return!0;const r=B(o.label),l=B(t);r/(1===a.length?1:2)+l/2>(n-parseFloat(o.position)/100)*i&&(e=!1)}return e}function z(e,t,n,a=!1){let i;return e.day?i=t.getFullYear():e.month?(i=t.getFullYear(),a&&(i=o.dateUtils.formatDateValueByIntlFormat(new Date(t.getFullYear(),t.getMonth()),n,{year:"numeric",month:"numeric"}))):i=t.getFullYear(),i}function V(e,t,n){const a=t.getMonth()+1;let i="";return!e.day||e.hour&&1===e.hour.value?1!==a&&(i=a):i=o.dateUtils.formatDateValueByIntlFormat(new Date(2e3,t.getMonth(),t.getDate()),n,{month:"numeric",day:"numeric"}),i}function U(e,t,n){let a=e.getDate();return t.hour&&(a=o.dateUtils.formatDateValueByIntlFormat(new Date(2e3,e.getMonth(),e.getDate()),n,{month:"numeric",day:"numeric"})),a}function F(e,t){return e.getHours()+":00"}function W(e,t){let n=e.getMinutes();return t.second&&(n=e.getHours()+":"+(n<10?"0":"")+n),n}function A(e,t){return e.getSeconds()}!function(e){e[e.year=1]="year",e[e.month=2]="month",e[e.day=3]="day",e[e.hour=4]="hour",e[e.minute=5]="minute",e[e.second=6]="second"}(T||(T={}));const $={};function B(e,t,n){const a=window;if(void 0===a.measureCanvasCTX){const e=document.createElement("canvas");a.measureCanvasCTX=e.getContext("2d")}if($[e])return $[e];const i=a.measureCanvasCTX.measureText(e).width+10;return $[e]=i,i}function H(e){const{interact:t,dragRef:n,getDragProps:a,resizeHandlerDragging:i,resizeHandlerDragend:o}=e;let r,l,s,c,u,d,m=null;return t(n).draggable({inertia:!1,modifiers:[],autoScroll:!0,onstart:e=>{e.stopPropagation(),e.preventDefault(),l=a(),s=l.startValue,c=l.endValue,u=l.startValue,d=l.endValue,r=0},onmove:e=>{e.stopPropagation(),e.preventDefault();const{extent:t,width:n}=l;r=e.clientX-e.clientX0;const a=function(e,t,n){return(e[1]-e[0])/t*n}(t,n,r),o=function(e){const{valueForDw:t,dragProps:n,initStartValue:a,initEndValue:i,startValue:o,endValue:r,newTempEnd:l}=e;let s=l;const{extent:c,stepLength:u,dividedCount:d}=n;let m=a,h=i;if(u){const e=Math.round(t/p[u.unit]/u.val/1e3);0!==e&&(m=_(u.unit,new Date(m),e*u.val),h=_(u.unit,new Date(h),e*u.val))}else{const e=(c[1]-c[0])/d,n=Math.round(t/e);0!==n&&(m+=n*e,h+=n*e)}t>0?h>c[1]?u?m>=c[1]?(m=o,h=r):s=c[1]:(m=c[1]-(i-a),h=c[1]):s=null:(s=null,m<c[0]&&(m=c[0],h=m+(i-a)));return{newStart:m,newEnd:h,updatedNewTempEnd:s}}({valueForDw:a,dragProps:l,initStartValue:s,initEndValue:c,startValue:u,endValue:d,newTempEnd:m});i(o.newStart,o.newEnd),u=o.newStart,d=o.newEnd,m=o.updatedNewTempEnd},onend:e=>{e.stopPropagation(),o(u,d,m)}})}function Y(e,t,n,a,i){let o,r;let l,s,c,u,d,m;return e(t).resizable({edges:{left:".resize-left",right:".resize-right"}}).on("resizestart",e=>{e.stopPropagation(),l=n(),c=l.startValue,u=l.endValue,d=l.startValue,m=l.endValue,s=u-c,o=0;const a=t.getBoundingClientRect();r=a.width,t.style.minWidth="0px"}).on("resizemove",e=>{const{extent:t}=l;e.stopPropagation();const n=e.deltaRect;o+=n.width;const i=s&&r+o,h=function(e,t,n,a,i,o){let r=e,l=t;const s=(n[1]-n[0])/a*i;o.edges.left?r=e-s:l=t+s;return{newStart:r,newEnd:l}}(d,m,t,i,o,e),g=function(e,t,n,a,i){const{width:o,extent:r,stepLength:l,accuracy:s,dividedCount:c}=n,{initStartValue:u,initEndValue:d}=a,{newStart:m,newEnd:h}=i;let g=u,f=d;if(l){const n=Math.round((r[1]-r[0])*t/o/p[s]/1e3);e.edges.left?g=_(s,new Date(h),-n):f=_(s,new Date(m),n)}else{const n=(r[1]-r[0])/c,a=Math.round((r[1]-r[0])*t/o/n);e.edges.left?g=h-a*n:f=m+a*n}e.edges.left?(g=Math.min(g,f),g=Math.max(r[0],g),g=Math.min(r[1],g)):(f=Math.max(g,f),f=Math.min(r[1],f),f=Math.max(r[0],f));return{newStart:g,newEnd:f}}(e,i||o,l,{initStartValue:c,initEndValue:u},h);a(g.newStart,g.newEnd),d=g.newStart,m=g.newEnd}).on("resizeend",e=>{e.stopPropagation(),i(d,m)})}function _(e,t,n){switch(e){case"year":t.setFullYear(t.getFullYear()+n);break;case"month":t.setMonth(t.getMonth()+n);break;case"day":t.setDate(t.getDate()+n);break;case"hour":t.setHours(t.getHours()+n);break;case"minute":t.setMinutes(t.getMinutes()+n);break;case"second":t.setSeconds(t.getSeconds()+n)}return t.getTime()}function G(e,t,n,a,i,o=!0){let r;const l=o?1:-1;if(i)r=n+1/i*(t-e)*l,r=Math.round(r),Math.abs(r-e)<1e4?r=e:Math.abs(r-t)<1e4&&(r=t);else{const e=new Date(n),t=a.val*l;switch(null==a?void 0:a.unit){case"year":e.setFullYear(e.getFullYear()+t);break;case"month":e.setMonth(e.getMonth()+t);break;case"day":e.setDate(e.getDate()+t);break;case"hour":e.setHours(e.getHours()+t);break;case"minute":e.setMinutes(e.getMinutes()+t);break;case"second":e.setSeconds(e.getSeconds()+t)}r=e.getTime()}return r}function J(e,t,n,a){let i=!1;const o=1/a/2*100;return n>=e-o&&n<=t+o&&(i=!0),i}function X(e,t,n){return(null==n?void 0:n.zoomLevel)===t&&0!==t?n.maxWidth/e:Math.pow(2,t)}function K(e,t,n){return e*X(e,t,n)}var q=s(26245);const Q={_widgetLabel:"Timeline",overallTimeExtent:"Overall time extent",filteringApplied:"Timeline filtering applied",noTlFromHonoredMapWarning:"Oops! Seems like something went wrong with this map and we cannot get any valid time settings.",noSupportedLayersInMapWidget:"The map does not contain any time-aware data.",invalidTimeSpanWarning:"Please check the widget configurations to make sure the time span is valid.",timezoneWarning:"The Timeline widget is not available to use under the data time zone."};var Z=s(65962),ee=s.n(Z),te=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const ne=e=>{const t=window.SVG,{className:n}=e,a=te(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:ee()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var ae=s(50024),ie=s.n(ae),oe=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const re=e=>{const t=window.SVG,{className:n}=e,a=oe(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:ie()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var le=s(36597),se=s.n(le),ce=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const ue=e=>{const t=window.SVG,{className:n}=e,a=ce(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:se()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var de=s(2747),me=s.n(de),pe=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const he=e=>{const t=window.SVG,{className:n}=e,a=pe(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:me()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var ge=s(67489),fe=s.n(ge),ve=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const ye=e=>{const t=window.SVG,{className:n}=e,a=ve(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:fe()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var xe=s(69802),we=s.n(xe),be=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const Se=e=>{const t=window.SVG,{className:n}=e,a=be(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:we()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var je=s(9470),Me=s.n(je),Te=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const De=e=>{const t=window.SVG,{className:n}=e,a=Te(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:Me()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var ke=s(25373),Oe=s.n(ke),Re=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(a=Object.getOwnPropertySymbols(e);i<a.length;i++)t.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(n[a[i]]=e[a[i]])}return n};const Ee=e=>{const t=window.SVG,{className:n}=e,a=Re(e,["className"]),r=(0,o.classNames)("jimu-icon jimu-icon-component",n);return t?(0,i.jsx)(t,Object.assign({className:r,src:Oe()},a)):(0,i.jsx)("svg",Object.assign({className:r},a))};var Ce=s(1888);const Ne=s(30394),Ie=Object.assign({},Q,o.defaultMessages,l.defaultMessages);const Le=()=>{const e=(0,o.useIntl)();return o.React.useCallback((t,n)=>e.formatMessage({id:t,defaultMessage:Ie[t]},n),[e])},Pe=function(a){const{width:r,height:s,applied:c,timeStyle:u=e.Classic,foregroundColor:d,backgroundColor:m,sliderColor:g,theme:f,startTime:v,endTime:y,currentTimeExtent:x,accuracy:w="year",stepLength:b,dividedCount:S,displayStrategy:j=n.current,enablePlayControl:M=!1,speed:T=t.Medium,autoPlay:k,dateTimePattern:E,updating:P=!1,onTimeChanged:z,onApplyStateChanged:V}=a,[U,F]=o.React.useState(r),[W,A]=o.React.useState(s);o.React.useEffect(()=>{F(r-(u===e.Classic?64:80)),A(u===e.Classic?52:80)},[r,s,u]);const[$,B]=o.React.useState(0),[J,Q]=o.React.useState(null),Z=(0,o.useIntl)(),ee=Le(),te=o.React.useMemo(()=>[{value:t.Slowest,label:ee("slowest")},{value:t.Slow,label:ee("slow")},{value:t.Medium,label:ee("medium")},{value:t.Fast,label:ee("fast")},{value:t.Fastest,label:ee("fastest")}],[]),[ae,ie]=o.React.useState(T);o.React.useEffect(()=>{ie(T)},[T]);const[oe,le]=o.React.useState(k||!1),se=o.React.useRef(null),ce=o.React.useRef(null),[de,me]=o.React.useState(null),[pe,ge]=o.React.useState(0),[fe,ve]=o.React.useState(v),[xe,we]=o.React.useState(null),[be,je]=o.React.useState(null),[Me,Te]=o.React.useState(null),[ke,Oe]=o.React.useState(null),[Re,Ie]=o.React.useState(null),[Pe,ze]=o.React.useState(null),Ve=o.React.useRef(null),Ue=o.React.useRef(null),Fe=o.React.useRef(null),We=o.React.useRef(null),Ae=o.React.useRef(null),$e=o.React.useRef(null),[Be,He]=o.React.useState(!1),Ye=o.React.useRef(!1),_e=e=>{window.jimuConfig.isInBuilder&&Ye.current&&e.key.includes("Arrow")&&e.preventDefault()};o.React.useEffect(()=>{function e(e){Ye.current=!0}function t(e){Ye.current=!1}function n(e){e.edges={left:!0},Ge(e)}function a(e){e.edges={right:!0},Ge(e)}return se.current.addEventListener("mousedown",et),Ue.current?(Ue.current.addEventListener("keyup",n,!0),Ue.current.addEventListener("focus",e,!0),Ue.current.addEventListener("blur",t,!0)):(Fe.current.addEventListener("keyup",n,!0),We.current.addEventListener("keyup",a,!0),Fe.current.addEventListener("focus",e,!0),Fe.current.addEventListener("blur",t,!0),We.current.addEventListener("focus",e,!0),We.current.addEventListener("blur",t,!0)),document.body.addEventListener("keydown",_e,{passive:!1}),()=>{var i;null===(i=se.current)||void 0===i||i.removeEventListener("mousedown",et),null==Re||Re.unset(),null==Pe||Pe.unset(),Ue.current?(Ue.current.removeEventListener("keyup",n,!0),Ue.current.removeEventListener("focus",e,!0),Ue.current.removeEventListener("blur",t,!0)):Fe.current&&We.current&&(Fe.current.removeEventListener("keyup",n,!0),We.current.removeEventListener("keyup",a,!0),Fe.current.removeEventListener("focus",e,!0),Fe.current.removeEventListener("blur",t,!0),We.current.removeEventListener("focus",e,!0),We.current.removeEventListener("blur",t,!0)),document.body.removeEventListener("keydown",_e)}},[]);const Ge=o.hooks.useEventCallback(e=>{if(e.key.includes("Arrow")){e.preventDefault();const t="ArrowLeft"===e.key||"ArrowTop"===e.key?-1:1,n=Ke();let a=n.startValue,i=n.endValue;if(b)e.edges.left?a=_(b.unit,new Date(n.startValue),t*b.val):i=_(b.unit,new Date(n.endValue),t*b.val);else{const o=(n.extent[1]-n.extent[0])/S;e.edges.left?a+=t*o:i+=t*o}e.edges.left?(a=Math.max(n.extent[0],a),a=Math.min(a,i)):(i=Math.min(n.extent[1],i),i=Math.max(a,i)),rt(a,i)}});o.React.useEffect(()=>{if(Ve.current){Ie(Y(q.interact,Ve.current,Ke,rt,lt));const e={interact:q.interact,dragRef:Ve.current,getDragProps:qe,resizeHandlerDragging:rt,resizeHandlerDragend:lt};ze(H(e))}},[u]),o.React.useEffect(()=>{if(ce.current={left:0,x:0},He(!1),ge(0),B(0),le(k),je(null),x)ve(x[0]),we(x[1]),z(x[0],x[1]);else{ve(v);const e=j===n.current?G(v,y,v,b,S):v;we(e),z(v,e)}},[k,M,v,j,y,w,b,S,x]),o.React.useEffect(()=>{const e=D({width:K(U,$,J),startTime:v,endTime:y,accuracy:w});me(e)},[U,v,y,w,$,J]),o.React.useEffect(()=>{const e=function(e,t,n,a){if(e<0)return;const i=(n-t)/p[a]/1e3,o=Math.max(e,32*i);let r=0;for(;K(e,r)<o||30===r;)r++;return{maxWidth:o,zoomLevel:r}}(U,v,y,w);Q(e)},[U,v,y,w]);const Je=o.ReactRedux.useSelector(e=>{var t,n;return oe?(null===(t=e.appRuntimeInfo)||void 0===t?void 0:t.appMode)===o.AppMode.Design||(null===(n=e.appRuntimeInfo)||void 0===n?void 0:n.isPrintPreview):null}),Xe=o.React.useRef(Je),Ke=o.hooks.useEventCallback(()=>({startValue:Me||fe,endValue:ke||be||xe,extent:[v,y],width:K(U,$,J),accuracy:w,stepLength:b,dividedCount:S})),qe=o.hooks.useEventCallback(()=>({startValue:Me||fe,endValue:ke||xe,extent:[v,y],width:K(U,$,J),accuracy:w,stepLength:b,dividedCount:S})),Qe=o.hooks.useEventCallback(e=>{o.lodash.debounce(()=>{if(Me)return;const t=X(U,$,J),n=e.clientX-ce.current.x;let a=ce.current.left-n/(t*U)*100;a=Math.min(a/100,(t-1)/t),a=a<0?0:a,ge(100*a)},50)()}),Ze=o.hooks.useEventCallback(()=>{se.current.style.cursor="grab",se.current.style.removeProperty("user-select"),document.removeEventListener("mousemove",Qe),document.removeEventListener("mouseup",Ze)}),et=o.hooks.useEventCallback(e=>{0!==$&&"BUTTON"!==e.target.tagName&&(se.current.style.cursor="grabbing",se.current.style.userSelect="none",ce.current={left:pe,x:e.clientX},document.addEventListener("mousemove",Qe),document.addEventListener("mouseup",Ze))}),tt=o.React.useCallback((e=fe,t=xe,n)=>{if(e<=v)return void ge(0);const a=y-v,i=a/X(U,$,J),o=v+pe/100*a,r=o+i;let l;if(n&&(t<=o||e>=r))l=Math.min(e,y-i);else{if(n||!(e>=r||t<=o))return;l=Math.max(v,t-i)}ge((l-v)/(y-v)*100)},[$,v,y,pe,fe,xe,U,J]),nt=o.React.useCallback(e=>{const t=$+(e?1:-1);if(0===t)return void ge(0);const n=y-v,a=X(U,$,J),i=X(U,t,J),o=n/a,r=v+pe/100*n,l=r+o;let s;const c=be||xe;if(c===y&&c===l)s=(i-1)/i*100;else if(fe<r&&c>r&&c<l)s=(c-(c-r)/(i/a)-v)/(y-v)*100;else{if(fe>=l||xe<=r&&fe!==xe||fe<r&&xe>l)s=(fe+(xe-fe)/2-o*a/i/2-v)/(y-v)*100;else{const t=(fe-v)/(y-v)*100-pe;s=e?pe+t/2:pe-t}}s=Math.max(0,s),s=Math.min(s,(i-1)/i*100),ge(s)},[$,v,y,pe,U,fe,xe,be,J]),at=o.React.useCallback(e=>{const t=G(v,y,xe,b,S,e);let a=v,i=y;if(j===n.instant)e&&t>y||!e&&t<v?(a=v,i=v):(a=t,i=t),ve(a);else if(j===n.cumulatively){const n=e&&xe>=y,a=!e&&v===xe;if(e&&t>y)(be||S)&&e?(i=v,je(null)):(i=t,je(y));else{if(a)return;i=n?v:t,je(null)}}else{const n=G(v,y,fe,b,S,e),o=!e&&v===fe,r=!e&&n<v,l=e&&n>=y;if(n<y&&t>y)(be||S)&&e?(a=v,i=v+xe-fe,je(null)):(a=n,i=t,je(y));else{if(o)return;r||l?(a=v,i=v+xe-fe):(a=n,i=t),je(null)}ve(a)}we(i),0!==$&&tt(a,i,e),z(a,i)},[S,y,xe,v,fe,b,j,z,tt]),it=o.React.useCallback(()=>{Ae.current&&(clearInterval(Ae.current),Ae.current=null)},[]),ot=o.React.useCallback(()=>{it(),Ae.current=setInterval(()=>{P||at(!0)},h[ae.toLowerCase()])},[ae,it,P,at]);o.React.useEffect(()=>{if(!Ae.current){if(Je||!oe||P)return void it();ot()}return()=>{it()}},[oe,P,Je,it,ot]),o.React.useEffect(()=>{if(Xe.current!==Je&&null!==Je){if(Xe.current=Je,Je)return void it();oe&&!P&&ot()}},[Je,ot,it,oe,P]);const rt=(e,t)=>{Te(e),Oe(t)},lt=(e,t,n)=>{rt(null,null),ve(e),we(t),je(n),z(e,n||t)},st=o.React.useMemo(()=>{if(!de)return null;const e=K(U,$,J),t={details:de,width:e,localStartTime:v,localEndTime:y,leftPosition:pe,endPosition:U/e*100+pe,scale:e/U,intl:Z},n=O(t),a=R(t),r=C(t),l=N(t),s=I(t),c=L(t),u=function(e){const{tsDetails:t,years:n,months:a,days:i,hours:o,minutes:r,seconds:l}=e,s={labels:{},ticks:{}},c=[];n.length>1&&c.push("year"),a.length>1&&c.push("month"),i.length>1&&c.push("day"),o.length>1&&c.push("hour"),r.length>1&&c.push("minute"),l.length>1&&c.push("second");const u=c[c.length-1],d=Object.keys(t).filter(e=>t[e]);if(1===c.length)d.forEach(e=>{s.ticks[e]="medium",s.labels[e]="short"});else{if(2===c.length)s.ticks[u]="medium",d.forEach(e=>{e!==u&&(s.ticks[e]="long")});else{const e=c[c.length-2];s.ticks[u]="short",s.ticks[e]="medium",d.forEach(t=>{t!==u&&t!==e&&(s.ticks[t]="long")})}s.labels=s.ticks}return s}({tsDetails:de,years:n,months:a,days:r,hours:l,minutes:s,seconds:c}),d=["year","month","day","hour","minute","second"];return(0,i.jsx)("div",{className:"timeline-ticks",children:[n,a,r,l,s,c].map((e,t)=>e.map((e,n)=>{const a=e.position,r=d[t];return(0,i.jsxs)("div",{className:"timeline-tick-container","data-unit":r,style:{left:a},children:[e.label&&(0,i.jsx)("div",{className:`timeline-tick_label ${u.labels[r]}-label ${"year"===r&&0===n&&0===pe?"timeline-first_label":""}`,children:e.label}),(0,i.jsx)("div",{className:(0,o.classNames)(`timeline-tick ${u.ticks[r]}-tick`,e.label?"has-label":"no-label")},n)]},`item-${t}-${n}`)}))})},[de,$,pe]),ct=o.React.useMemo(()=>function(e,t,n,a,i){const r=(0,o.getAppStore)().getState().appContext.isRTL;return n=Ce.colorUtils.parseThemeVariable(n||e.sys.color.surface.paperText,e),a=a||e.sys.color.surface.paper,i=Ce.colorUtils.parseThemeVariable(i||e.sys.color.primary.main,e),o.css`
    height: fit-content;
    color: ${n};

    // Common style
    .timeline-header, .timeline-footer {
      height: 16px;
      display: flex;
      flex-direction: ${r?"row-reverse":"row"};
      align-items: center;
      justify-content: space-between;
      .zoom-container {
        min-width: 36px;
        display: flex;
        flex-direction: ${r?"row-reverse":"row"};
      }
      .range-label {
        display: flex;
        align-items: center;
        font-size: ${o.polished.rem(12)};
        font-weight: 500;
        line-height: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .range-label-badge {
          width: 8px;
          height: 8px;
          min-width: 8px;
          border-radius: 4px;
          margin-right: 0.25rem;
        }
      }
    }
    .timeline-content {
      overflow-x: hidden;

      .timeline-whole {
        .timeline-ticks {
          position: relative;
          .timeline-tick-container {
            position: absolute;
            user-select: none;
            .timeline-tick {
              width: 1px;
              background: ${Ce.colorUtils.colorMixOpacity(n,.5)};
            }
            .timeline-tick_label {
              font-size: ${o.polished.rem(11)};
              font-weight: 400;
              line-height: 15px;
              width: max-content;
              transform: translate(${r?"50%":"-50%"});
              color: foregroundColor;
              &.long-label {
                font-weight: 600;
              }
              &.medium-label {
                font-weight: 500;
              }
              &.short-label {
                font-weight: 400;
              }
              &.timeline-first_label {
                /* transform: ${`translate(-${t}px)`}; */
                transform: translate(0);
              }
            }
          }
        }
      }

      .timeline-range-container {
        height: 8px;
        /* width: ${`calc(100% - ${2*t}px)`}; */
        width: 100%;
        border-radius: 4px;
        background-color: ${Ce.colorUtils.colorMixOpacity(n,.2)};
        .resize-handlers {
          height: 100%;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          background-color: ${i};

          .resize-handler {
            width: 8px;
            height: 8px;
            padding: 0;
            overflow: visible;
            border-radius: 8px;
            background: ${i};
            border: 2px solid ${i};
            &.resize-instant {
              background: ${a};
            }
          }

          &:hover {
            .resize-handler {
              background: ${a};
            }
          }
        }
      }
      .timeline-arrow {
        position: absolute;
        &.left-arrow{
          transform: scaleX(-1);
        }
      }
    }
    .jimu-btn {
        color: ${n};
        border-radius: 16px;
        &:hover:not(:disabled) {
          color: ${n};
          background-color: ${Ce.colorUtils.colorMixOpacity(n,.2)};
        }
        &.disabled {
          color: ${Ce.colorUtils.colorMixOpacity(n,.2)};
          &:hover {
            color: ${Ce.colorUtils.colorMixOpacity(n,.2)};
          }
        }
        .jimu-icon {
          margin: 0
        }

        .icon-btn-sizer {
          min-width: 0;
          min-height: 0;
        }
    }

    .jimu-dropdown-button {
      &:not(:disabled):not(.disabled):active,
      &[aria-expanded="true"]{
        border-color: transparent !important;
        color: unset !important;
      }
    }

    // Clasic style
    &.timeline-classic {
      padding: 1rem 1.5rem;
      .timeline-header .range-label {
        .range-label-badge {
          background-color: ${i};
        }
        .range-label-context {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .timeline-content {
        margin: 1rem 0.5rem;
        .timeline-whole {
          .timeline-ticks {
            padding-top: 0.75rem;
            .timeline-tick-container {
              .timeline-tick {
                &.long-tick {
                  height: 12px;
                  &.no-label {
                    margin-top: 19px;
                  }
                  &.has-label {
                    margin-top: 0;
                  }
                }
                &.medium-tick {
                  height: 8px;
                  &.no-label {
                    margin-top: 23px;
                  }
                  &.has-label {
                    margin-top: 8px;
                  }
                }
                &.short-tick {
                  height: 4px;
                  &.no-label {
                    margin-top: 27px;
                  }
                  &.has-label {
                    margin-top: 12px;
                  }
                }
              }
              .timeline-tick_label {
                margin-bottom: 4px;
              }
            }
          }
          .timeline-arrow {
            top: 78px;
            &.left-arrow{
              left: ${r?"unset":"20px"};
              right: ${r?"20px":"unset"};
            }
            &.right-arrow{
              left: ${r?"20px":"unset"};
              right: ${r?"unset":"20px"};
            }
          }
        }
        .timeline-range-container .resize-handlers .resize-handler {
          min-width: 8px;
          &:focus {
            background: ${a};
            outline-offset: 0;
          }
        }
      }
      .timeline-footer {
        flex-direction: ${r?"row-reverse":"row"};
        .play-container {
          min-width: 65px;
        }
      }
    }

    // Modern style
    &.timeline-modern {
      padding: 1rem 0.5rem;
      height: 156px;

      .timeline-header{
        padding-top: 0;
        padding-bottom: 0;
        padding: 0 36px;
        &.no-play-container {
          padding-left: ${r?"12px":"36px"};
          padding-right: ${r?"36px":"12px"};
        }
        .range-label {
          margin: 0 0.25rem;
          .range-label-badge {
            background-color: ${Ce.colorUtils.colorMixOpacity(i,.7)};
          }
        }
      }

      .timeline-content {
        display: flex;
        margin-top: 0.5rem;
          .timeline-left, .timeline-right {
            display: flex;
            height: 80px;
            .play-container {
              min-width: 17px; /* when play btn is hidden */
              display: flex;
              flex-direction: column;
              justify-content: center;
              .jimu-btn {
                margin: 0 0.5rem;
                &.next-btn {
                  margin-bottom: 0.5rem;
                }
                &.play-btn {
                  margin-top: 0.5rem;
                }
              }
            }
          }
        .timeline-middle {
          height: 115px;
          overflow-x: hidden;
          flex-grow: 1;
          .timeline-content-inside {
            border: 1px solid ${Ce.colorUtils.colorMixOpacity(n,.5)};
            border-radius: 8px;
            .timeline-whole {
              display: flex;
              flex-direction: column;
              .timeline-ticks {
                .timeline-tick-container {
                  display: flex;
                  flex-direction: column-reverse;
                  .timeline-tick {
                    &.long-tick {
                      height: 32px;
                    }
                    &.medium-tick {
                      height: 16px;
                      margin-top: 16px;
                    }
                    &.short-tick {
                      height: 8px;
                      margin-top: 24px;
                    }
                  }
                  .timeline-tick_label {
                    margin-top: 0.5rem;
                  }
                }
              }
              .timeline-range-container {
                z-index: 1;
                width: 100%;
                background: transparent;
                .resize-handlers {
                  background-color: ${Ce.colorUtils.colorMixOpacity(i,.7)};
                  .resize-handler {
                    min-width: 4px;
                    width: 4px;
                    height: calc(100% - 10px);
                    margin: 5px 0;
                    background: transparent;
                    border: none;
                    &.show-bg { /** When handlers.w = 0 */
                      background-color: ${Ce.colorUtils.colorMixOpacity(i,.7)};
                      height: 100%;
                      margin: 0;
                      &:hover {
                        background-color: ${Ce.colorUtils.colorMixOpacity(i,.9)};
                      }
                    }
                  }
                  &:hover {
                    .resize-handler {
                      background: ${Ce.colorUtils.colorMixOpacity(i,.7)};

                    }
                  }
                }
              }
            }
          }
          .timeline-arrow {
            z-index: 2;
            top: 68px;
            &.left-arrow{
              left: 50px;
              left: ${r?"unset":"50px"};
              right: ${r?"50px":"unset"};
            }
            &.right-arrow{
              right: 50px;
              left: ${r?"50px":"unset"};
              right: ${r?"unset":"50px"};
              &.no-play-container {
                left: ${r?"25px":"unset"};
                right: ${r?"unset":"25px"};
              }
            }
          }
        }
      }
    }
  `}(f,7,d,m,g),[f,7,d,m,g]),ut=o.React.useMemo(()=>{const e=(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",disabled:0===$,onClick:()=>{nt(!1),B(Math.max(0,$-1))},children:(0,i.jsx)(re,{})}),t=(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",disabled:$===(null==J?void 0:J.zoomLevel),onClick:()=>{nt(!0),B(Math.min(null==J?void 0:J.zoomLevel,$+1))},children:(0,i.jsx)(ne,{})});return(0,i.jsxs)("div",{className:"zoom-container",children:[0===$?e:(0,i.jsx)(l.Tooltip,{title:ee("zoomOut"),placement:"bottom",children:e}),$===(null==J?void 0:J.zoomLevel)?t:(0,i.jsx)(l.Tooltip,{title:ee("zoomIn"),placement:"bottom",children:t})]})},[$,ee,J,nt]),dt=o.React.useMemo(()=>M?(0,i.jsx)(l.Tooltip,{title:ee(oe?"pause":"play"),placement:"bottom",children:(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",className:"play-btn",onClick:()=>{le(!oe)},children:oe?(0,i.jsx)(ye,{}):(0,i.jsx)(he,{})})}):null,[M,oe,ee]),mt=o.React.useMemo(()=>(0,i.jsx)(l.Tooltip,{title:ee("previous"),placement:"bottom",children:(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",onClick:e=>{at(!1)},children:(0,i.jsx)(Se,{})})}),[ee,at]),pt=o.React.useMemo(()=>(0,i.jsx)(l.Tooltip,{title:ee("next"),placement:"bottom",children:(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",className:"next-btn",onClick:e=>{at(!0)},children:(0,i.jsx)(De,{})})}),[ee,at]),ht=o.React.useMemo(()=>{const e=o.dateUtils.formatDateValueByIntlFormat(v,Z,E),t=o.dateUtils.formatDateValueByIntlFormat(y,Z,E);return(0,i.jsxs)(o.React.Fragment,{children:[(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",ref:e=>{$e.current=e},"aria-label":ee("moreInfo"),"aria-haspopup":"true","aria-expanded":Be,onClick:e=>{He(!Be)},children:(0,i.jsx)(ue,{})}),(0,i.jsx)(l.Popper,{open:Be,keepMount:!0,arrowOptions:!0,reference:$e,toggle:e=>{He(!1),"Escape"===(null==e?void 0:e.key)&&o.lodash.defer(()=>{(0,o.focusElementInKeyboardMode)($e.current)})},children:(0,i.jsxs)("div",{className:"p-4",children:[(0,i.jsx)(l.Typography,{className:"mb-2",variant:"title2",children:ee("overallTimeExtent")}),(0,i.jsx)("div",{className:"mb-4",children:`${e} - ${t}`}),(0,i.jsxs)(l.Label,{check:!0,className:"d-flex align-items-center",children:[(0,i.jsx)(l.Typography,{className:"flex-grow-1 mb-0 mr-1",variant:"title3",children:ee("filteringApplied")}),(0,i.jsx)(l.Switch,{checked:c,onChange:(e,t)=>{V(t)}})]})]})})]})},[ee,v,y,Z,Be,c,E,V]),gt=o.React.useMemo(()=>(0,i.jsxs)(l.Dropdown,{menuRole:"listbox",activeIcon:!0,className:u===e.Classic?"":"justify-content-center","aria-label":ee("speed"),children:[(0,i.jsx)(l.Tooltip,{placement:"bottom",title:ee("speed"),"a11y-description":te.filter(e=>e.value===ae)[0].label,children:(0,i.jsx)(l.DropdownButton,{icon:!0,type:"tertiary",arrow:!1,children:(0,i.jsx)(Ee,{})})}),(0,i.jsx)(l.DropdownMenu,{children:te.map(e=>(0,i.jsx)(l.DropdownItem,{active:e.value===ae,onClick:()=>{ie(e.value)},children:e.label},e.value))})]}),[te,ae,u,ee]),ft=o.hooks.useEventCallback(e=>{const t=y-v,n=X(U,$,J);let a=(v+pe/100*t+(e?1:-1)*(t/n)-v)/(y-v)*100;a=Math.max(0,a),a=Math.min(a,(n-1)/n*100),ge(a)}),vt=X(U,$,J),yt=(0,o.getAppStore)().getState().appContext.isRTL,xt=Me||fe,wt=ke||be||xe,{startPositionForStep:bt,widthForStep:St}=((t,n)=>{let a=(t-v)/(y-v),i=(n-v)/(y-v)-a;return t===y?(a=u===e.Classic?"calc(100% - 16px)":"calc(100% - 8px)",i=0):a=100*a+"%",{startPositionForStep:a,widthForStep:i}})(xt,wt),jt=o.dateUtils.formatDateValueByIntlFormat(xt,Z,E),Mt=o.dateUtils.formatDateValueByIntlFormat(wt,Z,E),Tt=0!==pe,Dt=100-pe-1/vt*100>1e-11,kt=j===n.instant,Ot=jt+(kt?"":" - "+Mt);return(0,i.jsx)("div",{css:ct,dir:"ltr",className:(0,o.classNames)("timeline w-100",{"timeline-classic":u===e.Classic,"timeline-modern":u===e.Modern}),children:u===e.Classic?(0,i.jsxs)(o.React.Fragment,{children:[(0,i.jsxs)("div",{className:"timeline-header",children:[(0,i.jsxs)("div",{className:"range-label",dir:yt?"rtl":"ltr",children:[(0,i.jsx)("div",{className:"range-label-badge"}),(0,i.jsx)("div",{className:"range-label-context",children:Ot})]}),ut]}),(0,i.jsx)("div",{className:"timeline-content",children:(0,i.jsxs)("div",{className:"timeline-content-inside",children:[(0,i.jsxs)("div",{className:"timeline-whole",ref:e=>{se.current=e},style:{width:100*vt+"%",height:W+"px",marginLeft:-pe*vt+"%"},children:[st,Tt&&(0,i.jsx)(l.Tooltip,{title:ee("slideBackward"),placement:"bottom",children:(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",className:"timeline-arrow left-arrow",onClick:e=>ft(!1),children:(0,i.jsx)(l.Icon,{width:4,height:16,icon:Ne})})}),Dt&&(0,i.jsx)(l.Tooltip,{title:ee("slideForward"),placement:"bottom",children:(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",className:"timeline-arrow right-arrow",onClick:e=>ft(!0),children:(0,i.jsx)(l.Icon,{width:4,height:16,icon:Ne})})})]}),(0,i.jsx)("div",{className:"timeline-range-container",style:{width:100*vt+"%",marginLeft:-pe*vt+"%"},children:(0,i.jsx)("div",{className:"resize-handlers",ref:e=>{Ve.current=e},style:{marginLeft:bt,width:kt?"fit-content":100*St+"%"},children:kt?(0,i.jsx)("button",{className:"resize-handler resize-instant",ref:e=>{Ue.current=e},title:jt,"aria-label":jt}):(0,i.jsxs)(o.React.Fragment,{children:[(0,i.jsx)("button",{className:"resize-handler resize-left",ref:e=>{Fe.current=e},title:jt,"aria-label":jt}),(0,i.jsx)("button",{className:"resize-handler resize-right",ref:e=>{We.current=e},title:Mt,"aria-label":Mt})]})})})]})}),(0,i.jsxs)("div",{className:"timeline-footer",children:[ht,(0,i.jsxs)("div",{className:"play-container",children:[mt,dt,pt]}),M?gt:(0,i.jsx)("div",{})]})]}):(0,i.jsxs)(o.React.Fragment,{children:[(0,i.jsxs)("div",{className:(0,o.classNames)("timeline-header",{"no-play-container":!M}),children:[ht,(0,i.jsxs)("div",{className:"range-label",dir:yt?"rtl":"ltr",children:[(0,i.jsx)("div",{className:"range-label-badge"}),Ot]}),ut]}),(0,i.jsxs)("div",{className:"timeline-content",children:[(0,i.jsx)("div",{className:"timeline-left",children:(0,i.jsxs)("div",{className:"play-container",children:[pt,mt]})}),(0,i.jsxs)("div",{className:"timeline-middle",children:[Tt&&(0,i.jsx)(l.Tooltip,{title:ee("slideBackward"),placement:"bottom",children:(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",className:(0,o.classNames)("timeline-arrow left-arrow",{"no-play-container":!M}),onClick:e=>ft(!1),children:(0,i.jsx)(l.Icon,{width:4,height:16,icon:Ne})})}),(0,i.jsx)("div",{className:"timeline-content-inside",children:(0,i.jsxs)("div",{className:"timeline-whole",ref:e=>{se.current=e},style:{width:100*vt+"%",height:W+"px",marginLeft:-pe*vt+"%"},children:[(0,i.jsx)("div",{style:{height:W-32+"px"}}),st,(0,i.jsx)("div",{className:"timeline-range-container",style:{height:W+"px",marginTop:-(W-32)+"px"},children:(0,i.jsx)("div",{className:"resize-handlers",ref:e=>{Ve.current=e},style:{marginLeft:bt,width:kt?"fit-content":100*St+"%"},children:kt?(0,i.jsx)("button",{className:"resize-handler resize-instant",ref:e=>{Ue.current=e},title:jt,"aria-label":jt}):(0,i.jsxs)(o.React.Fragment,{children:[(0,i.jsx)("button",{className:"resize-handler resize-left "+(xt===wt?"show-bg":""),ref:e=>{Fe.current=e},title:jt,"aria-label":jt}),(0,i.jsx)("button",{className:"resize-handler resize-right "+(xt===wt?"show-bg":""),ref:e=>{We.current=e},title:Mt,"aria-label":Mt})]})})})]})}),Dt&&(0,i.jsx)(l.Tooltip,{title:ee("slideForward"),placement:"bottom",children:(0,i.jsx)(l.Button,{icon:!0,type:"tertiary",size:"sm",className:(0,o.classNames)("timeline-arrow right-arrow",{"no-play-container":!M}),onClick:e=>ft(!0),children:(0,i.jsx)(l.Icon,{width:4,height:16,icon:Ne})})})]}),(0,i.jsx)("div",{className:"timeline-right",children:(0,i.jsxs)("div",{className:"play-container",children:[M&&gt,dt]})})]})]})})};class ze extends o.BaseVersionManager{constructor(){super(...arguments),this.versions=[{version:"1.11.0",description:"",upgrader:e=>{let t=e;if(!t.honorTimeSettings)if(t.timeSettings){const{stepLength:e,dividedCount:n}=t.timeSettings;t=e?t.setIn(["timeSettings","stepLength","val"],Math.round(e.val)):t.setIn(["timeSettings","dividedCount"],Math.round(n))}else t=t.set("honorTimeSettings",!0);return t}},{version:"1.12.0",description:"",upgrader:e=>{let n=e;return n=n.without("speed"),!n.honorTimeSettings&&n.timeSettings&&(n=n.setIn(["timeSettings","speed"],t.Medium)),n}}]}}const Ve=new ze;class Ue extends o.React.PureComponent{constructor(){super(...arguments),this.onDataSourceCreated=e=>{this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,e)},this.onCreateDataSourceFailed=()=>{this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,null)},this.onDataSourceInfoChange=e=>{this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId,null==e?void 0:e.status)}}componentWillUnmount(){this.props.onCreateDataSourceCreatedOrFailed(this.props.useDataSource.dataSourceId,null,!0),this.props.onIsDataSourceNotReady(this.props.useDataSource.dataSourceId,o.DataSourceStatus.NotReady)}render(){const{useDataSource:e}=this.props;return(0,i.jsx)(o.DataSourceComponent,{useDataSource:e,onDataSourceCreated:this.onDataSourceCreated,onCreateDataSourceFailed:this.onCreateDataSourceFailed,onDataSourceInfoChange:this.onDataSourceInfoChange})}}var Fe=function(e,t,n,a){return new(n||(n=Promise))(function(i,o){function r(e){try{s(a.next(e))}catch(e){o(e)}}function l(e){try{s(a.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(r,l)}s((a=a.apply(e,t||[])).next())})};const We=Object.assign({},Q,o.defaultMessages,l.defaultMessages),Ae=s(66008),$e="156px",Be=e=>{var t,n,s,c,u,d,h;const{useMapWidgetIds:y,useDataSources:x,theme:T,id:D,config:k,intl:O,autoWidth:R,autoHeight:E,controllerWidgetId:C,inControllerUx:N}=e,{addSourceByData:I=!0,enablePlayControl:L,applyFilteringByDefault:P=!0,autoPlay:z,enableDisplayAccuracy:V=!1,displayAccuracy:U,timeSettings:F,honorTimeSettings:W,dataSourceType:A,timeStyle:$,foregroundColor:B,backgroundColor:H,sliderColor:Y}=k,_=I?null:y,G=C&&"offPanel"===N,{speed:J}=F||{},[X,K]=o.React.useState(null),[q,Q]=o.React.useState(P),[Z,ee]=o.React.useState(J),[te,ne]=o.React.useState(null),ae=o.React.useRef(null),[ie,oe]=o.React.useState(!1),[re,le]=o.React.useState(null),[se,ce]=o.React.useState(null),[ue,de]=o.React.useState(null),[me,pe]=o.React.useState([]),[he,ge]=o.React.useState(!0),[fe,ve]=o.React.useState(null),[ye,xe]=o.React.useState(null),we=o.React.useRef(null),be=o.ReactRedux.useSelector(e=>{var t,n;return(null===(n=null===(t=e.appConfig.attributes)||void 0===t?void 0:t.timezone)||void 0===n?void 0:n.type)===o.TimezoneConfig.Data}),Se=o.React.useMemo(()=>r.MapViewManager.getInstance(),[]),je=o.React.useMemo(()=>o.DataSourceManager.getInstance(),[]),Me=o.React.useMemo(()=>!!ue&&Object.keys(ue).some(e=>{var t;return w(null===(t=ue[e])||void 0===t?void 0:t.type)}),[ue]),Te=o.React.useMemo(()=>{var e;let t=null;if(M(A))t=x;else if((null==_?void 0:_.length)>0&&te)t=Object.keys(te).map(e=>({dataSourceId:te[e].layerDataSourceId}));else if(w(A)&&Me){const n=b(ue,null===(e=k.timeSettings)||void 0===e?void 0:e.layerList);t=Object.keys(n).map(e=>({dataSourceId:e}))}return t?(0,o.Immutable)(t):null},[A,x,_,te,Me,ue,null===(t=k.timeSettings)||void 0===t?void 0:t.layerList]),{resetToken:De,clearFilterDataSourceIds:ke}=o.dataSourceUtils.useClearDataSourceFilters(D,Te);o.React.useEffect(()=>{De&&ke.length>0&&Q(!1)},[De,ke]);const Oe=o.React.useMemo(()=>{if(me.length)return!1;const e=Object.keys(ue||{}).sort();let t;if(null==_?void 0:_.length)t=!0;else{const n=(x||(0,o.Immutable)([])).map(e=>e.dataSourceId).asMutable({deep:!0});t=o.utils.diffArrays(!0,e,n).isEqual}return t},[_,ue,x,me]);o.React.useEffect(()=>{var e;return ve(G?480:null===(e=we.current)||void 0===e?void 0:e.clientWidth),(0,r.loadArcGISJSAPIModules)(["esri/core/reactiveUtils"]).then(e=>{ce(e[0])}),()=>{Ee(null,null,!0)}},[]),o.React.useEffect(()=>{de(null),le(null),xe(null)},[A]),o.React.useEffect(()=>{Q(P)},[P]),o.React.useEffect(()=>{if(M(A))oe(!1),le(x);else if((null==_?void 0:_.length)>0)if(ae.current){const e={},t={dataSourceId:ae.current,mainDataSourceId:ae.current};je.createDataSourceByUseDataSource((0,o.Immutable)(t)).then(t=>Fe(void 0,void 0,void 0,function*(){if(ae.current&&te){const n=[];Object.keys(te).forEach(e=>{n.push(te[e].createLayerDataSource())}),yield Promise.all(n),e[t.id]=t,de(e),oe(0===Object.keys(te).length)}}))}else""===ae.current?(oe(!0),de(null)):(oe(!1),de(null));else if((null==x?void 0:x.length)>0){oe(!1);const e=[];x.forEach(t=>{e.push(je.createDataSourceByUseDataSource((0,o.Immutable)(t)).then(e=>e.isDataSourceSet()&&!e.areChildDataSourcesCreated()?e.childDataSourcesReady().then(()=>e):e))}),Promise.all(e).then(e=>{const t={};e.forEach(e=>{t[e.id]=e}),de(t)})}},[_,ae,te,x,je,A,le,de]),o.React.useEffect(()=>{if(ue&&se&&Oe)if(W){const e=function(e,t=!1){var n,i,r;let l=null;const s=e[Object.keys(e).filter(t=>w(e[t].type))[0]],c=null===(r=null===(i=null===(n=null==s?void 0:s.getItemData())||void 0===n?void 0:n.widgets)||void 0===i?void 0:i.timeSlider)||void 0===r?void 0:r.properties;if(c){const{startTime:e,endTime:n,timeStopInterval:i,numberOfStops:r,thumbMovingRate:u,thumbCount:d}=c;let m=e,h=n,v=c.currentTimeExtent;s.type===o.DataSourceTypes.WebScene&&(v=null);const y=v?a.Saved:a.Start;let x=null;if(t){const t=S(e,n,!0);if(m=t.startTime,h=t.endTime,v){const e=S(v[0],v[1],!0);x=[e.startTime,e.endTime]}}if(l={speed:g(u),layerList:null,startTime:{value:m},endTime:{value:h},playPosition:y,currentTimeExtent:x,timeDisplayStrategy:f(d,c.currentTimeExtent)},i){const e=function(e){switch(e){case"esriTimeUnitsMonths":return"month";case"esriTimeUnitsDays":return"day";case"esriTimeUnitsHours":return"hour";case"esriTimeUnitsMinutes":return"minute";case"esriTimeUnitsSeconds":return"second";default:return"year"}}(i.units);l.accuracy=e,l.stepLength={val:i.interval,unit:e}}else if(r){l.dividedCount=r;const e=j(m,h);l.accuracy=e[0];const t=(h-m)/r;e.some(e=>t>=1e3*p[e]&&(l.accuracy=e,!0))}}return l}(ue,!0);ee(null==e?void 0:e.speed),xe(e)}else{const e=v(F,ue,!0);ee(J),xe(e)}},[ue,se,W,J,F,Oe]);const Re=(e,t)=>{let n=null;return Object.keys(e.jimuLayerViews).forEach(a=>{e.jimuLayerViews[a].layerDataSourceId===t&&(n=e.jimuLayerViews[a])}),n},Ee=o.hooks.useEventCallback((e,t,n=!1)=>{var a;if(!ue)return;const i={time:n?null:[e,t]};if(!n){const n=S(e,t);i.time=[n.startTime,n.endTime]}if(n||(()=>{let e,t=null;const n=[];if(null==_?void 0:_.length)te&&Object.keys(te).forEach(e=>{var t;(null===(t=te[e])||void 0===t?void 0:t.view)&&n.push(se.whenOnce(()=>!te[e].view.updating))});else{const a=Se.getAllJimuMapViewIds();w(A)?(t=ue[Object.keys(ue)[0]],e=t.getAllChildDataSources().map(e=>e.id)):e=Object.keys(ue),e.forEach(e=>{var i;const o=t||(null===(i=ue[e])||void 0===i?void 0:i.getRootDataSource());w(null==o?void 0:o.type)&&a.filter(e=>Se.getJimuMapViewById(e).dataSourceId===o.id).forEach(t=>{const a=Se.getJimuMapViewById(t),i=Re(a,e);(null==i?void 0:i.view)&&n.push(se.whenOnce(()=>!i.view.updating))})})}Promise.all(n).then(e=>{ge(!1)})})(),w(A))if(null==_?void 0:_.length)Object.keys(te).forEach(e=>{const t=te[e].getLayerDataSource();t&&Ce(t,i,D)});else{const e=b(ue,null===(a=k.timeSettings)||void 0===a?void 0:a.layerList);Object.keys(e).forEach(t=>{Ce(e[t],i,D)})}else Object.keys(ue).forEach(e=>{ue[e]&&Ce(ue[e],i,D)})});o.React.useEffect(()=>{X&&Ee(X[0],X[1],!q)},[X,q,Ee]);const Ce=(e,t,n)=>{var a,i,r,l;e.type===o.DataSourceTypes.MapService?(null===(a=e.supportTime)||void 0===a?void 0:a.call(e))&&(t=Ne(e,t),null===(i=e.changeTimeExtent)||void 0===i||i.call(e,t.time,n)):M(e.type)&&(null===(r=e.supportTime)||void 0===r?void 0:r.call(e))&&(t=Ne(e,t),null===(l=e.updateQueryParams)||void 0===l||l.call(e,t,n))},Ne=(e,t)=>{var n;const a=(null===(n=e.getTimeInfo())||void 0===n?void 0:n.exportOptions)||{},{TimeOffset:i=0,timeOffsetUnits:o}=a;if((null==t?void 0:t.time)&&0!==i){let e=t.time[0],n=t.time[1];const a=new Date(e),r=new Date(n);switch(o){case"esriTimeUnitsCenturies":case"esriTimeUnitsDecades":case"esriTimeUnitsYears":const t="esriTimeUnitsCenturies"===o?100:"esriTimeUnitsDecades"===o?10:1;e=a.setFullYear(a.getFullYear()-i*t),n=r.setFullYear(r.getFullYear()-i*t);break;case"esriTimeUnitsMonths":e=a.setMonth(a.getMonth()-i),n=r.setMonth(r.getMonth()-i);break;case"esriTimeUnitsWeeks":case"esriTimeUnitsDays":const l="esriTimeUnitsWeeks"===o?7:1;e=a.setDate(a.getDate()-i*l),n=r.setDate(r.getDate()-i*l);break;case"esriTimeUnitsHours":e=a.setHours(a.getHours()-i),n=r.setHours(r.getHours()-i);break;case"esriTimeUnitsMinutes":e=a.setMinutes(a.getMinutes()-i),n=r.setMinutes(r.getMinutes()-i);break;case"esriTimeUnitsSeconds":e=a.setSeconds(a.getSeconds()-i),n=r.setSeconds(r.getSeconds()-i);break;case"esriTimeUnitsMilliseconds":e=a.setMilliseconds(a.getMilliseconds()-i),n=r.setMilliseconds(r.getMilliseconds()-i)}t.time=[e,n]}return t},Ie=({width:t,height:n})=>{var a,i,r,l;if(R){const{layoutId:n,layoutItemId:s}=e,c=(0,o.getAppStore)().getState(),u=null===(l=null===(r=null===(i=null===(a=null==c?void 0:c.appConfig)||void 0===a?void 0:a.layouts)||void 0===i?void 0:i[n])||void 0===r?void 0:r.content)||void 0===l?void 0:l[s];if(!u)return;const d=u.bbox.width;if(d.includes("px"))t=d;else{const e=`div.layout[data-layoutid=${n}]`,a=document.querySelector(e),{clientWidth:i=480}=a||{};t=i*parseInt(d.split("%")[0])/100}}ve(t)},Le=o.React.useMemo(()=>null!==ue&&Object.keys(ue).filter(e=>null===ue[e]).length===Object.keys(ue).length,[ue]),ze=me.length>0,Ve=(e,t)=>{M(A)&&ue&&ue[e]&&ue[e].getDataSourceJson().isOutputFromWidget&&He(e,t)},Be=(e,t,n=!1)=>{M(A)&&(de(a=>{const i=t||(null==a?void 0:a[e]);if((null==i?void 0:i.getDataSourceJson().isOutputFromWidget)&&He(e,t?i.getInfo().status:o.DataSourceStatus.Unloaded),!a&&!t&&n)return a;const r=Object.assign({},a);return t||!(null==a?void 0:a[e])&&null!==(null==a?void 0:a[e])?r[e]=t:(r[e]&&Ce(r[e],{time:null},D),delete r[e]),t&&t.getDataSourceJson().arcadeScript&&!t.supportTime()&&(r[e]=null),r}),Q(P))},He=(e,t)=>{pe(n=>{let a;return a=t===o.DataSourceStatus.NotReady?n.includes(e)?n:n.concat(e):n.includes(e)?n.filter(t=>t!==e):n,a})},Ye=e=>{(null==e?void 0:e.view)&&e.dataSourceId?(ae.current=e.dataSourceId,_e(e.id).then(e=>{ne(e)})):(ae.current="",ne(null))},_e=e=>Fe(void 0,void 0,void 0,function*(){const t=r.MapViewManager.getInstance().getJimuMapViewById(e),n=yield t.whenAllJimuLayerViewLoaded(),a={};return Object.keys(n).forEach(e=>{"sublayer"!==n[e].layer.type&&n[e].supportTime()&&(a[e]=n[e])}),a}),Ge=()=>{let e;return e=Le?"dataSourceCreateError":ze?"outputDatasAreNotGenerated":ie?"noSupportedLayersInMapWidget":qe?"noTlFromHonoredMapWarning":be?"timezoneWarning":"invalidTimeSpanWarning",(0,i.jsxs)("div",{className:"placeholder-container w-100 h-100 position-relative",children:[Xe(),(0,i.jsx)(l.Alert,{form:"tooltip",size:"small",type:"warning",withIcon:!0,className:"position-absolute",style:{bottom:10,right:10},text:Je(e)})]})},Je=e=>O.formatMessage({id:e,defaultMessage:We[e]}),Xe=()=>(0,i.jsx)(l.WidgetPlaceholder,{className:"timeline-placeholder",icon:Ae,widgetId:D,css:o.css`
          width: ${G?"480px":"inherit"};
          height: ${E||G?$e:"100%"};
        `,name:Je("_widgetLabel")}),Ke=o.React.useMemo(()=>function(e){const t={second:"2-digit",minute:"2-digit",hour:"2-digit",day:"numeric",month:"numeric",year:"numeric"},n={};return m.some(a=>(n[a]=t[a],a===e)),n}(V?U:"second"),[V,U]),qe=ue&&w(A)&&se&&null===ye,Qe=(null===(n=null==ye?void 0:ye.startTime)||void 0===n?void 0:n.value)>(null===(s=null==ye?void 0:ye.endTime)||void 0===s?void 0:s.value),Ze=Le||ze||ie||qe||Qe||be;return!I&&0===(_||[]).length||I&&(!x||0===x.length)||!ze&&ye&&(null===(c=null==ye?void 0:ye.startTime)||void 0===c?void 0:c.value)===(null===(u=null==ye?void 0:ye.endTime)||void 0===u?void 0:u.value)?Xe():(0,i.jsxs)(o.React.Fragment,{children:[(null==_?void 0:_.length)>0&&(0,i.jsx)(r.JimuMapViewComponent,{useMapWidgetId:_[0],onActiveViewChange:Ye}),(null==re?void 0:re.length)>0&&(null==re?void 0:re.map(e=>(0,i.jsx)(Ue,{useDataSource:e,onIsDataSourceNotReady:Ve,onCreateDataSourceCreatedOrFailed:Be},e.dataSourceId))),Ze?Ge():I||null!==ue?(0,i.jsxs)(l.Paper,{shape:"none",className:"timeline-widget",css:o.css`
                    width: ${G||R?fe+"px":"unset"};
                    height: ${G||E&&!ue?$e:"unset"};
                    background: ${H||T.sys.color.surface.paper};
                  `,ref:e=>{we.current=e},children:[!G&&(0,i.jsx)(o.ReactResizeDetector,{targetRef:we,handleWidth:!0,onResize:Ie}),null!==ue&&Oe?ye&&fe>=0&&(0,i.jsx)(Pe,{theme:T,width:fe,updating:!!ue&&Object.keys(ue).filter(e=>{var t;return(null===(t=ue[e])||void 0===t?void 0:t.getInfo().status)===o.DataSourceStatus.Loading}).length>0||he,startTime:null===(d=ye.startTime)||void 0===d?void 0:d.value,endTime:null===(h=ye.endTime)||void 0===h?void 0:h.value,currentTimeExtent:ye.currentTimeExtent,accuracy:ye.accuracy,stepLength:ye.stepLength,dividedCount:ye.dividedCount,displayStrategy:ye.timeDisplayStrategy,timeStyle:$,foregroundColor:B,backgroundColor:H,sliderColor:Y,enablePlayControl:L,speed:Z,autoPlay:z,dateTimePattern:Ke,applied:q,onTimeChanged:(e,t)=>{K([e,t])},onApplyStateChanged:e=>{Q(e)}}):(0,i.jsx)("div",{className:"jimu-secondary-loading",css:o.css`position: 'absolute';left: '50%';top: '50%';`})]}):Xe()]})};Be.versionManager=Ve;const He=Be;function Ye(e){s.p=e}})(),c})())}}});