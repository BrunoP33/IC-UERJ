"use strict";(self.webpackChunkmeu_site=self.webpackChunkmeu_site||[]).push([["8948"],{4416(e,t,a){a.r(t),a.d(t,{metadata:()=>s,default:()=>z,frontMatter:()=>f,contentTitle:()=>y,toc:()=>w,assets:()=>j});var s=JSON.parse('{"id":"interativa/dash","title":"Dasboard","description":"Responda as quest\xf5es abaixo e acompanhe seu desempenho!","source":"@site/docs/interativa/dash.mdx","sourceDirName":"interativa","slug":"/interativa/dash","permalink":"/IC-UERJ/docs/interativa/dash","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/interativa/dash.mdx","tags":[],"version":"current","frontMatter":{"title":"Dasboard"},"sidebar":"tutorialSidebar","previous":{"title":"Visualiza\xe7\xe3o dos Raios C\xf3smicos","permalink":"/IC-UERJ/docs/interativa/visualizacao"},"next":{"title":"Meia Vida","permalink":"/IC-UERJ/docs/interativa/python"}}'),r=a(4848),o=a(8453),i=a(6540),n=a(9526),d=a(6497);let l={proton_250gev:{titulo:"Pr\xf3ton 250 GeV",videoSrc:"/videos/proton_250GeV_axis_2.mp4",contagemBase:{"\u03BC\xb1":2503,"\u03C0\xb1":1004,"e\xb1":82195,\u03BD:3281,\u03B3:170422}},proton_38tev:{titulo:"Pr\xf3ton 38 TeV",videoSrc:"/videos/proton_750GeV_clip1_4.mp4",contagemBase:{"\u03BC\xb1":75e3,"\u03C0\xb1":45e3,"e\xb1":18e6,\u03BD:25e4,\u03B3:35e6}}},c=Object.keys(l),p=["\u03BC\xb1","\u03C0\xb1","e\xb1","\u03BD","\u03B3"],x=[0,3618.090452,7638.190955,11658.291457,15678.39196,19698.492462,23718.592965,27738.693467,35778.894472,39798.994975,43819.095477,47839.19598,51859.296482,55879.396985,59899.497487,63919.59799,67939.698492,71959.798995,75979.899497,8e4],u=[1.225,.800341,.49874,.310795,.193675,.12069,.075209,.046867,.0182,.011341,.007068,.004404,.002745,.00171,.001066,664e-6,414e-6,258e-6,161e-6,1e-4],h=[1,91.8,192.7,293.6,394.5,495.4,596.3,697.2,899,1e3],m=[2,202,424,646,868,1090,1312,1534,1978,2200],v=Array.from({length:99},(e,t)=>(t+1)/100),g=v.map(e=>1/Math.sqrt(1-e*e));function b(){let[e,t]=(0,i.useState)(0),[s,o]=(0,i.useState)(p),[b,f]=(0,i.useState)(0),y=c[e],j=l[y],w=(0,d.Ay)(j.videoSrc),k=s.filter(e=>e in j.contagemBase).map(e=>j.contagemBase[e]),z=b<=1?0:Math.sqrt(1-1/(b*b));return(0,r.jsxs)("div",{className:"eventos-dashboard-container",children:[(0,r.jsx)("style",{children:`
        .eventos-dashboard-container {
          background: var(--ifm-card-background-color, var(--ifm-background-surface-color));
          color: var(--ifm-color-content);
          border: 1px solid var(--ifm-color-emphasis-200);
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          padding: 30px;
          margin: 20px auto;
          font-family: var(--ifm-font-family-base);
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }
        .eventos-sidebar {
          flex: 0 0 210px;
          display: flex;
          flex-direction: column;
          gap: 26px;
        }
        .eventos-sidebar h3 {
          margin: 0 0 14px 0;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.65;
          border-bottom: 1px solid var(--ifm-color-emphasis-300);
          padding-bottom: 8px;
        }
        .eventos-sidebar h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          opacity: 0.85;
        }
        .eventos-conteudo {
          flex: 1 1 480px;
          min-width: 0;
        }
        .eventos-conteudo h2 {
          margin-top: 0;
          color: var(--ifm-color-primary);
        }
        .eventos-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 0;
          font-size: 15px;
          cursor: pointer;
        }
        .eventos-checkbox-row input {
          cursor: pointer;
        }
        .eventos-slider-rotulo {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          opacity: 0.6;
          margin-top: 2px;
        }
        .eventos-slider-valor {
          text-align: center;
          margin-top: 8px;
          font-size: 14px;
        }
        .eventos-slider-valor strong {
          color: var(--ifm-color-primary);
          font-size: 17px;
        }
        .eventos-video-wrapper {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .eventos-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.55);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          z-index: 2;
          transition: background 0.2s;
        }
        .eventos-carousel-arrow:hover {
          background: rgba(0,0,0,0.8);
        }
        .eventos-carousel-arrow.prev { left: 12px; }
        .eventos-carousel-arrow.next { right: 12px; }
        .eventos-nav-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin: 12px 0 6px 0;
        }
        .eventos-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ifm-color-emphasis-300);
          transition: background 0.2s;
        }
        .eventos-dot-active {
          background: var(--ifm-color-primary);
        }
        .eventos-graphs-grid {
          display: flex;
          flex-direction:column;
          gap: 20px;
          margin-top: 20px;
        }
        .eventos-graph-card {
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 8px;
          padding: 6px;
          background: var(--ifm-background-color);
        }
        @media (max-width: 780px) {
          .eventos-graphs-grid {
            grid-template-columns: 1fr;
          }
          .eventos-sidebar {
            flex: 1 1 100%;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 30px;
          }
        }
      `}),(0,r.jsxs)("div",{className:"eventos-sidebar",children:[(0,r.jsx)("h3",{children:"Par\xe2metros"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h4",{children:"Part\xedculas Vis\xedveis"}),p.map(e=>(0,r.jsxs)("label",{className:"eventos-checkbox-row",children:[(0,r.jsx)("input",{type:"checkbox",checked:s.includes(e),onChange:()=>{o(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])}}),e]},e))]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h4",{children:"Fator de Lorentz (\u03B3)"}),(0,r.jsx)("input",{type:"range",min:0,max:7,step:1,value:b,onChange:e=>f(Number(e.target.value)),style:{width:"100%"}}),(0,r.jsxs)("div",{className:"eventos-slider-rotulo",children:[(0,r.jsx)("span",{children:"0"}),(0,r.jsx)("span",{children:"7"})]}),(0,r.jsxs)("div",{className:"eventos-slider-valor",children:["\u03B3 = ",(0,r.jsx)("strong",{children:b})]})]})]}),(0,r.jsxs)("div",{className:"eventos-conteudo",children:[(0,r.jsxs)("h2",{children:["Simula\xe7\xe3o do Evento: ",j.titulo]}),(0,r.jsxs)("div",{className:"eventos-video-wrapper",children:[(0,r.jsx)("button",{className:"eventos-carousel-arrow prev",onClick:()=>{t(e=>(e-1+c.length)%c.length)},"aria-label":"Evento anterior",children:"\u276E"}),(0,r.jsx)("button",{className:"eventos-carousel-arrow next",onClick:()=>{t(e=>(e+1)%c.length)},"aria-label":"Pr\xf3ximo evento",children:"\u276F"}),(0,r.jsx)("video",{src:w,controls:!0,autoPlay:!0,loop:!0,muted:!0,playsInline:!0,style:{width:"100%",display:"block"}},w)]}),(0,r.jsx)("div",{className:"eventos-nav-dots",children:c.map(e=>(0,r.jsx)("span",{className:`eventos-dot ${e===y?"eventos-dot-active":""}`},e))}),(0,r.jsx)(n.A,{fallback:(0,r.jsx)("div",{style:{padding:"60px",textAlign:"center",opacity:.7},children:"Carregando gr\xe1ficos\u2026"}),children:()=>{let e=a(5851).default;return(0,r.jsxs)("div",{className:"eventos-graphs-grid",children:[(0,r.jsx)("div",{className:"eventos-graph-card",children:(0,r.jsx)(e,{data:[{type:"bar",x:s,y:k,text:k,textposition:"auto"}],layout:{title:"Quantidade de part\xedculas no evento",xaxis:{title:"Part\xedcula"},yaxis:{title:"N\xba de part\xedculas (escala log)",type:"log"},autosize:!0,margin:{t:40,b:40,l:55,r:15}},style:{width:"100%"},useResizeHandler:!0})}),(0,r.jsx)("div",{className:"eventos-graph-card",children:(0,r.jsx)(e,{data:[{type:"scatter",mode:"lines",x:x,y:u,line:{shape:"spline"}}],layout:{title:"Densidade X Altitude",xaxis:{title:"Altitude"},yaxis:{title:"Densidade"},autosize:!0,margin:{t:40,b:40,l:55,r:15}},style:{width:"100%"},useResizeHandler:!0})}),(0,r.jsx)("div",{className:"eventos-graph-card",children:(0,r.jsx)(e,{data:[{type:"scatter",mode:"lines",name:"Curva \u03B3(v)",x:v,y:g,line:{color:"#3578e5"}},{type:"scatter",mode:"markers+text",name:"Ponto Atual",x:[z],y:[b],marker:{color:"#e53535",size:10},text:[`\u{3B3} = ${b}, v = ${z.toFixed(3)}`],textposition:"top center"}],layout:{title:"Velocidade X Fator de Lorentz",xaxis:{title:"Velocidade (c)",range:[0,1]},yaxis:{title:"Fator de Lorentz",range:[0,Math.max(b,7.5)]},autosize:!0,showlegend:!1,margin:{t:40,b:40,l:55,r:15}},style:{width:"100%"},useResizeHandler:!0})}),(0,r.jsx)("div",{className:"eventos-graph-card",children:(0,r.jsx)(e,{data:[{type:"scatter",mode:"lines",x:h,y:m,line:{shape:"spline"}}],layout:{title:"Fator de Lorentz X Tempo de vida dilatado",xaxis:{title:"Fator de Lorentz"},yaxis:{title:"Tempo de Vida (\u03BCs)"},autosize:!0,margin:{t:40,b:40,l:55,r:15}},style:{width:"100%"},useResizeHandler:!0})})]})}})]})]})}let f={title:"Dasboard"},y="Teste seus conhecimentos",j={},w=[];function k(e){let t={h1:"h1",header:"header",p:"p",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"teste-seus-conhecimentos",children:"Teste seus conhecimentos"})}),"\n",(0,r.jsx)(t.p,{children:"Responda as quest\xf5es abaixo e acompanhe seu desempenho!"}),"\n","\n",(0,r.jsx)(b,{})]})}function z(e={}){let{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(k,{...e})}):k(e)}}}]);