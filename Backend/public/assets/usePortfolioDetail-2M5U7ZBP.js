import{q as a,r as e,A as t}from"./index-Cb2wQmLB.js";import{f as n}from"./react-vendor-DQUATC2k.js";
/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=a("folder-open",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);function o(a,s){const[o,l]=n.useState(null),[r,u]=n.useState(!0);return n.useEffect(()=>{if(!a)return l(null),void u(!1);let n=!1;return u(!0),fetch(`${e(t.PORTFOLIO_DETAIL)}/${encodeURIComponent(a)}?lang=${s}`).then(a=>a.json()).then(a=>{!n&&a.success?l(a.data):n||l(null)}).catch(()=>{n||l(null)}).finally(()=>{n||u(!1)}),()=>{n=!0}},[a,s]),{data:o,isLoading:r}}export{s as F,o as u};
