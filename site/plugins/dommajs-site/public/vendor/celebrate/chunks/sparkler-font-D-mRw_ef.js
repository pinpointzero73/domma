/*! domma-celebrate v1.3.0 | MPL-2.0 | https://github.com/pinpointzero73/domma-celebrate */
let t=null,n=null;async function r(r){"string"==typeof r&&r.trim()&&(n||(n=import("./sparkler-font-data-DueHZEHj.js").then(n=>{t=n})),await n)}function l(n){return t?.["cursive"===n?"CURSIVE_FONT":"STROKE_FONT"]||null}export{r as prepareSparklerFont,l as sparklerFont};
