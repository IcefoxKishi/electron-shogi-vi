var u=Object.defineProperty;var n=(i,t,e)=>t in i?u(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var s=(i,t,e)=>n(i,typeof t!="symbol"?t+"":t,e);class a{constructor(){s(this,"func");s(this,"timeout")}after(t,e){this.func=t,!this.timeout&&(this.timeout=setTimeout(this.invoke.bind(this),e))}invoke(){var t;(t=this.func)==null||t.call(this),this.clear()}clear(){this.timeout&&(clearTimeout(this.timeout),this.timeout=void 0),this.func=void 0}}var h=(i=>(i.CSA="csa",i.USI="usi",i))(h||{});export{a as L,h as P};
