"use strict";(self.webpackChunkmeu_site=self.webpackChunkmeu_site||[]).push([["1958"],{8728(e,a,r){r.r(a),r.d(a,{metadata:()=>o,default:()=>z,frontMatter:()=>_,contentTitle:()=>j,toc:()=>k,assets:()=>w});var o=JSON.parse('{"id":"interativa/python","title":"Meia Vida","description":"O estudo sobre o tempo de meia-vida dos m\xfaons ajuda-nos a comprovar a teoria relativ\xedstica de Einstein com c\xe1lculos precisos e concretos. Na guia Part\xedculas uma part\xedcula especial entendemos mais a fundo como ocorre esse fen\xf4meno em rela\xe7\xe3o ao tempo e ao fator de lorentz e sua import\xe2ncia para a relatividade. Lembra-se do gr\xe1fico que vimos l\xe1? Vamos agora aprender como fazer um igual!","source":"@site/docs/interativa/python.mdx","sourceDirName":"interativa","slug":"/interativa/python","permalink":"/IC-UERJ/docs/interativa/python","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/interativa/python.mdx","tags":[],"version":"current","frontMatter":{"title":"Meia Vida"},"sidebar":"tutorialSidebar","previous":{"title":"Dasboard","permalink":"/IC-UERJ/docs/interativa/dash"},"next":{"title":"Desafie Seus Conhecimentos","permalink":"/IC-UERJ/docs/interativa/quiz"}}'),i=r(4848),t=r(8453),s=r(6540),n=r(6069),d=r.n(n),l=r(1765),p=r(3941);let m="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",c=null,f=["numpy","matplotlib","imageio"],u=String.raw`import numpy as np
import matplotlib.pyplot as plt
import imageio.v2 as imageio
import os
import shutil
import base64
from IPython.display import HTML, display


"""
Tempo de vida médio dilatado do múon

O tempo de vida próprio médio do múon é:

    tau_0 = 2,2 microsegundos

A dilatação temporal é:

    tau = gamma * tau_0
"""


# ============================================================
#       Função para calcular o tempo de vida dilatado
# ============================================================

def muon_lifetime(lorentz_factors, tau_0=2.2e-6):
    return lorentz_factors * tau_0


# ============================================================
#               Valores do fator de Lorentz
# ============================================================

gamma_values = np.linspace(1, 1000, 100)

# Tempo de vida dilatado em segundos
dilated_lifetimes = muon_lifetime(gamma_values)


# ============================================================
#                 Criar pasta para os frames
# ============================================================

frames_dir = "frames"

if os.path.exists(frames_dir):
    shutil.rmtree(frames_dir)

os.makedirs(frames_dir)


# ============================================================
#                      Gerar os frames
# ============================================================

frames = []

for i in range(1, len(gamma_values) + 1):

    # Criar figura
    fig, ax = plt.subplots(figsize=(8, 5))

    # Plotar a parte da curva correspondente ao frame
    ax.plot(
        gamma_values[:i],
        dilated_lifetimes[:i] * 1e6,
        linewidth=2,
        label="Tempo de vida dilatado"
    )

    # Configurações do gráfico
    ax.set_xlabel("Fator de Lorentz ($\\gamma$)", fontsize=12)
    ax.set_ylabel("Tempo de vida médio ($\\mu$s)", fontsize=12)
    ax.set_title(
        "Tempo de vida do múon vs. fator de Lorentz",
        fontsize=14
    )

    # Manter os mesmos limites em todos os frames
    ax.set_xlim(1, 1000)
    ax.set_ylim(0, 2200)

    ax.grid(True)
    ax.legend()

    # Salvar o frame
    filename = f"{frames_dir}/frame_{i:03d}.png"

    plt.savefig(
        filename,
        dpi=100
    )

    plt.close(fig)

    # Ler o frame
    frames.append(imageio.imread(filename))


# ============================================================
#                       Criar o GIF
# ============================================================

gif_filename = "muon_lifetime.gif"

imageio.mimsave(
    gif_filename,
    frames,
    duration=0.1,
    loop=0
)


print("GIF criado com sucesso!")


# ============================================================
#                      EXIBIR O GIF 
# ============================================================

with open(gif_filename, "rb") as file:
    gif_data = base64.b64encode(file.read()).decode()

html = f'''
<div style="text-align: center;">
    <img src="data:image/gif;base64,{gif_data}" 
         style="width: 800px;">
</div>
'''

display(HTML(html))
`,g=`
import sys, types

_ipy_displays = []

class HTML:
    def __init__(self, data=""):
        self.data = data

def display(*objs, **kwargs):
    for o in objs:
        if isinstance(o, HTML):
            _ipy_displays.append(o.data)
        else:
            print(o)

def get_ipython():
    return None

_m_display = types.ModuleType("IPython.display")
_m_display.HTML = HTML
_m_display.display = display
_m_ipython = types.ModuleType("IPython")
_m_ipython.display = _m_display
_m_ipython.get_ipython = get_ipython
sys.modules["IPython"] = _m_ipython
sys.modules["IPython.display"] = _m_display
`,h=`
import glob, os
for _f in glob.glob('*.gif'):
    os.remove(_f)
`,x=`
import glob, json
json.dumps(glob.glob('*.gif'))
`,b=`
import json
json.dumps(_ipy_displays)
`,y=`
import io, base64
import matplotlib.pyplot as plt
_img = None
if plt.get_fignums():
    _buf = io.BytesIO()
    plt.savefig(_buf, format='png', dpi=110, bbox_inches='tight')
    plt.close('all')
    _img = base64.b64encode(_buf.getvalue()).decode()
_img
`;function v(){let e=u.trim(),[a,r]=(0,s.useState)(e),[o,t]=(0,s.useState)(""),[n,v]=(0,s.useState)(null),[_,j]=(0,s.useState)([]),[w,k]=(0,s.useState)([]),[N,z]=(0,s.useState)("Executar"),[P,S]=(0,s.useState)(!1),{colorMode:L}=(0,p.G)(),C="dark"===L?l.Zj.vsDark:l.Zj.vsLight;function T(){t(""),v(null),j([]),k([])}async function I(){S(!0),T();try{z("Carregando Python...");let e=await (!c&&(c=new Promise((e,a)=>{let r=document.createElement("script");r.src=m+"pyodide.js",r.onload=()=>window.loadPyodide({indexURL:m}).then(e,a),r.onerror=a,document.head.appendChild(r)})),c);z("Carregando pacotes..."),await e.loadPackage(f),await e.runPythonAsync("import matplotlib; matplotlib.use('Agg')"),await e.runPythonAsync(g),await e.runPythonAsync(h),z("Executando... (pode demorar)");let r="";e.setStdout({batched:e=>r+=e+"\n"}),e.setStderr({batched:e=>r+=e+"\n"}),await e.runPythonAsync(a);let o=JSON.parse(await e.runPythonAsync(b));j(o);let i=await e.runPythonAsync(y);if(i&&v("data:image/png;base64,"+i),0===o.length){let a=JSON.parse(await e.runPythonAsync(x));k(a.map(a=>URL.createObjectURL(new Blob([e.FS.readFile(a)],{type:"image/gif"}))))}t(r)}catch(e){t(String(e))}z("Executar"),S(!1)}return(0,i.jsxs)("div",{className:"pr",children:[(0,i.jsx)("style",{children:`
        .pr { --pr-code-bg: #f0f0f4; background: var(--ifm-card-background-color, var(--ifm-background-surface-color)); color: var(--ifm-color-content); border: 1px solid var(--ifm-color-emphasis-200); border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); padding: 30px; margin: 2rem auto; font-family: var(--ifm-font-family-base); display: flex; gap: 30px; flex-wrap: wrap; }
        [data-theme='dark'] .pr { --pr-code-bg: rgb(43, 43, 47); }
        .pr button { font-family: inherit; }
        .pr button:focus-visible { outline: 2px solid var(--ifm-color-primary); outline-offset: 2px; }

        .pr-sidebar { flex: 0 0 210px; display: flex; flex-direction: column; gap: 26px; align-self: flex-start; position: sticky; top: 90px; }
        .pr-sidebar h3 { margin: 0 0 14px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.65; border-bottom: 1px solid var(--ifm-color-emphasis-300); padding-bottom: 8px; }
        .pr-sidebar h4 { margin: 0 0 8px 0; font-size: 14px; opacity: 0.85; }
        .pr-btns { display: flex; flex-direction: column; gap: 8px; }
        .pr-line { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 6px 0; font-size: 14px; }
        .pr-line span { opacity: 0.85; }
        .pr-line strong { color: var(--ifm-color-primary); font-size: 15px; }

        .pr-btn { width: 100%; height: 46px; padding: 0 16px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
        .pr-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .pr-btn-primary { background: var(--ifm-color-primary); color: #ffffff; border: none; }
        .pr-btn-primary:hover:not(:disabled) { background: var(--ifm-color-primary-dark); }
        .pr-btn-secondary { background: transparent; color: var(--ifm-color-content); border: 1px solid var(--ifm-color-emphasis-300); }
        .pr-btn-secondary:hover:not(:disabled) { border-color: var(--ifm-color-primary); }

        .pr-main { flex: 1 1 480px; min-width: 0; }
        .pr-main h2 { margin-top: 0; color: var(--ifm-color-primary); }
        .pr-editor { max-height: 700px; overflow: auto; border-radius: 8px; border: 1px solid var(--ifm-color-emphasis-300); background: var(--pr-code-bg); transition: border-color 0.2s; }
        .pr-editor:focus-within { border-color: var(--ifm-color-primary); }
        .pr-editor textarea { outline: none !important; }

        .pr-card { margin-top: 20px; border: 1px solid var(--ifm-color-emphasis-300); border-radius: 8px; padding: 14px 16px; background: var(--ifm-background-color); }
        .pr-output { margin: 0; font-family: var(--ifm-font-family-monospace); font-size: 13px; line-height: 1.55; white-space: pre-wrap; color: var(--ifm-color-content); background: transparent; border: none; padding: 0; }
        .pr-html img { max-width: 100%; height: auto; }
        .pr-img { max-width: 100%; height: auto; border-radius: 8px; }

        @media (max-width: 780px) {
          .pr-sidebar { flex: 1 1 100%; position: static; flex-direction: row; flex-wrap: wrap; gap: 30px; }
          .pr-sidebar > div { flex: 1 1 200px; }
        }
      `}),(0,i.jsxs)("aside",{className:"pr-sidebar",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("h3",{children:"A\xe7\xf5es"}),(0,i.jsxs)("div",{className:"pr-btns",children:[(0,i.jsx)("button",{type:"button",className:"pr-btn pr-btn-primary",onClick:I,disabled:P,children:N}),(0,i.jsx)("button",{type:"button",className:"pr-btn pr-btn-secondary",onClick:()=>{r(e),T()},disabled:P,children:"Restaurar original"}),(0,i.jsx)("button",{type:"button",className:"pr-btn pr-btn-secondary",onClick:()=>{r(""),T()},disabled:P,children:"Limpar"})]})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h4",{children:"Ambiente"}),(0,i.jsxs)("div",{className:"pr-line",children:[(0,i.jsx)("span",{children:"Linguagem"}),(0,i.jsx)("strong",{children:"Python"})]}),(0,i.jsxs)("div",{className:"pr-line",children:[(0,i.jsx)("span",{children:"Execu\xe7\xe3o"}),(0,i.jsx)("strong",{children:"No navegador"})]}),(0,i.jsxs)("div",{className:"pr-line",children:[(0,i.jsx)("span",{children:"Estado"}),(0,i.jsx)("strong",{children:P?"Executando":"Pronto"})]})]})]}),(0,i.jsxs)("div",{className:"pr-main",children:[(0,i.jsx)("h2",{children:"C\xf3digo Python"}),(0,i.jsx)("div",{className:"pr-editor",children:(0,i.jsx)(d(),{value:a,onValueChange:r,highlight:e=>(0,i.jsx)(l.f4,{theme:C,code:e,language:"python",children:({tokens:e,getTokenProps:a})=>(0,i.jsx)(i.Fragment,{children:e.map((r,o)=>(0,i.jsxs)(s.Fragment,{children:[r.map((e,r)=>(0,i.jsx)("span",{...a({token:e})},r)),o<e.length-1?"\n":""]},o))})}),padding:16,tabSize:4,insertSpaces:!0,style:{fontFamily:"var(--ifm-font-family-monospace)",fontSize:14,color:C.plain.color,minHeight:160}})}),o&&(0,i.jsx)("div",{className:"pr-card",children:(0,i.jsx)("pre",{className:"pr-output",children:o})}),_.map((e,a)=>(0,i.jsx)("div",{className:"pr-card pr-html",dangerouslySetInnerHTML:{__html:e}},a)),n&&(0,i.jsx)("div",{className:"pr-card",children:(0,i.jsx)("img",{className:"pr-img",src:n,alt:"Gr\xe1fico gerado"})}),w.map(e=>(0,i.jsx)("div",{className:"pr-card",children:(0,i.jsx)("img",{className:"pr-img",src:e,alt:"GIF gerado"})},e))]})]})}let _={title:"Meia Vida"},j="O gr\xe1fico da meia vida do m\xfaon em rela\xe7\xe3o ao fator de lorentz",w={},k=[{value:"Fa\xe7a voc\xea mesmo",id:"fa\xe7a-voc\xea-mesmo",level:2}];function N(e){let a={h1:"h1",h2:"h2",header:"header",p:"p",strong:"strong",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(a.header,{children:(0,i.jsx)(a.h1,{id:"o-gr\xe1fico-da-meia-vida-do-m\xfaon-em-rela\xe7\xe3o-ao-fator-de-lorentz",children:"O gr\xe1fico da meia vida do m\xfaon em rela\xe7\xe3o ao fator de lorentz"})}),"\n",(0,i.jsx)(a.p,{children:"O estudo sobre o tempo de meia-vida dos m\xfaons ajuda-nos a comprovar a teoria relativ\xedstica de Einstein com c\xe1lculos precisos e concretos. Na guia Part\xedculas: invis\xedveis, por\xe9m reais / M\xfaon: uma part\xedcula especial entendemos mais a fundo como ocorre esse fen\xf4meno em rela\xe7\xe3o ao tempo e ao fator de lorentz e sua import\xe2ncia para a relatividade. Lembra-se do gr\xe1fico que vimos l\xe1? Vamos agora aprender como fazer um igual!"}),"\n","\n",(0,i.jsx)(a.h2,{id:"fa\xe7a-voc\xea-mesmo",children:"Fa\xe7a voc\xea mesmo"}),"\n",(0,i.jsxs)(a.p,{children:["Altere os valores e clique em ",(0,i.jsx)(a.strong,{children:"Executar"}),":"]}),"\n",(0,i.jsx)(v,{packages:["numpy","matplotlib"],initialCode:`
import numpy as np
import matplotlib.pyplot as plt

tau0 = 2.197  # meia-vida pr\xf3pria do m\xfaon (\xb5s)
v = np.linspace(0.01, 0.999, 300)  # v/c
gamma = 1 / np.sqrt(1 - v**2)

plt.plot(gamma, gamma * tau0)
plt.xlabel('Fator de Lorentz (\u{3B3})')
plt.ylabel('Tempo de vida no laborat\xf3rio (\xb5s)')
plt.grid(True)
plt.show()
`})]})}function z(e={}){let{wrapper:a}={...(0,t.R)(),...e.components};return a?(0,i.jsx)(a,{...e,children:(0,i.jsx)(N,{...e})}):N(e)}}}]);