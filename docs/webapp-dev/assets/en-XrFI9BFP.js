import{g as _}from"./main-DW5s0Aex.js";function p(n,a){for(var t=0;t<a.length;t++){const e=a[t];if(typeof e!="string"&&!Array.isArray(e)){for(const r in e)if(r!=="default"&&!(r in n)){const u=Object.getOwnPropertyDescriptor(e,r);u&&Object.defineProperty(n,r,u.get?u:{enumerable:!0,get:()=>e[r]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}var o={exports:{}},c=o.exports,s;function f(){return s||(s=1,function(n,a){(function(t,e){n.exports=e()})(c,function(){return{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],r=t%100;return"["+t+(e[(r-20)%10]||e[r]||e[0])+"]"}}})}(o)),o.exports}var i=f();const d=_(i),l=p({__proto__:null,default:d},[i]);export{l as e};
