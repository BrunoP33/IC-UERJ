"use strict";(self.webpackChunkmeu_site=self.webpackChunkmeu_site||[]).push([["8036"],{1328(t,e,a){a.r(e),a.d(e,{metadata:()=>o,default:()=>h,frontMatter:()=>c,contentTitle:()=>l,toc:()=>m,assets:()=>p});var o=JSON.parse('{"id":"interativa/python-detector-muons","title":"O gr\xe1fico dos hits do m\xfaon em nosso detector","description":"O estudo sobre a detec\xe7\xe3o dos m\xfaons nas esta\xe7\xf5es de medida ajuda-nos a entender melhor como essas part\xedculas chegam at\xe9 n\xf3s diretamente de grandes altitudes e como o hardware transforma a presen\xe7a delas em sinais el\xe9tricos. Na guia A rela\xe7\xe3o das part\xedculas com o mundo entendemos mais a fundo como ocorre esse processo e visualizamos como, em determinada configura\xe7\xe3o, a detec\xe7\xe3o funciona. Lembra-se do gr\xe1fico que vimos l\xe1? Vamos agora aprender como fazer um igual!","source":"@site/docs/interativa/python-detector-muons.mdx","sourceDirName":"interativa","slug":"/interativa/python-detector-muons","permalink":"/IC-UERJ/docs/interativa/python-detector-muons","draft":false,"unlisted":false,"editUrl":"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/interativa/python-detector-muons.mdx","tags":[],"version":"current","frontMatter":{"title":"O gr\xe1fico dos hits do m\xfaon em nosso detector"},"sidebar":"tutorialSidebar","previous":{"title":"Dasboard","permalink":"/IC-UERJ/docs/interativa/dash"},"next":{"title":"O gr\xe1fico da velocidade do m\xfaon em rela\xe7\xe3o ao fator de lorentz","permalink":"/IC-UERJ/docs/interativa/python-fator-lorentz-muon"}}'),r=a(4848),i=a(8453),s=a(4726);let n=["numpy","matplotlib"],d=String.raw`import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# -----------------------------
# Sistema de estatísticas
# -----------------------------

stats = {
    'total_generated': 0,                    # Contador de todos os múons gerados
    'detected': 0,                           # Contador de múons detectados pelo mnenos 1 vez
    'hits_per_event': [],                    # Lista de número de hits de cada múon detectado
    'efficiency_per_layer': [0, 0, 0, 0],    # Array de hits em cada camada do detector [L1, L2, L3, L4]
    'current_frame': 0                       # Número do frame atual da animação
}

def update_statistics(muon, hits_detected):

    # Atualiza estatísticas de detecção

    stats['total_generated'] += 1
    if hits_detected > 0:
        stats['detected'] += 1
        stats['hits_per_event'].append(hits_detected)  # Hits_detected está sendo atualizada na função update! Ela recebe o valor de hits_this_muon
    
    # Contabiliza hits por camada

    for z_layer in layer_z:
        t_hit = (z_layer - muon["pos"][2]) / muon["dir"][2]  # Cálculo do parâmetro t para interseção com esta camada na altura z_layer a partir da posição inicial "pos"
        if t_hit > 0:
            x_hit = muon["pos"][0] + t_hit * muon["dir"][0]  # Coord. x
            y_hit = muon["pos"][1] + t_hit * muon["dir"][1]  # Coord. y

            if x_hit**2 + y_hit**2 <= detector_radius**2:         # Verifica se hit está dentro do detector cilíndrico
                layer_idx = np.argmin(np.abs(layer_z - z_layer))  # Identifica qual camada foi atingida; dá a posição (índice) na lista onde o menor valor está localizado (distância mais próxima)
                stats['efficiency_per_layer'][layer_idx] += 1     # Incrementa contador de hits dessa camada

def print_stats():

    if stats['total_generated'] > 0:
        efficiency = (stats['detected'] / stats['total_generated']) * 100
        if stats['hits_per_event']:
            avg_hits = np.mean(stats['hits_per_event'])
        else:
            avg_hits = 0
        
        print(f"\n--- Estatísticas Frame {stats['current_frame']} ---")
        print(f"Múons gerados: {stats['total_generated']}")
        print(f"Múons detectados: {stats['detected']}")
        print(f"Eficiência: {efficiency:.1f}%")
        print(f"Hit médio por evento: {avg_hits:.1f}")
        print("Eficiência por camada:", [f"{x/stats['detected']*100:.1f}%" if stats['detected'] > 0 else "0%" for x in stats['efficiency_per_layer']])

# -----------------------------
# Detector parameters
# -----------------------------

detector_radius = 2.0
detector_length = 10.0
num_layers = 4
layer_z = np.linspace(detector_length/2, -detector_length/2, num_layers)  # z positions

# -----------------------------
# Cosmic muon generator
# -----------------------------

def generate_cosmic_muon():

    # Zenith angle θ, distributed as cos²θ

    theta = np.arccos(np.sqrt(np.random.rand())) # Ângulo zenital medido a partir do eixo z vertical
    phi = np.random.uniform(0, 2*np.pi)          # Ângulo azimutal medido no plano xy a partir do eixo x

    # Direction vector - coord. esféricas para cartesianas

    direction = np.array([
        np.sin(theta)*np.cos(phi),
        np.sin(theta)*np.sin(phi),
        -np.cos(theta)  # downward
    ])

    # Starting point above detector

    z_start = detector_length/2 + 5.0
    x_start = np.random.uniform(-2*detector_radius, 2*detector_radius)
    y_start = np.random.uniform(-2*detector_radius, 2*detector_radius)
    start_pos = np.array([x_start, y_start, z_start])

    # Check if muon intersects detector at z=0 plane

    ''' TEORIA POR TRÁS: #Equação paramétrica da reta '''
    ''' P(t) = P_start + t * direction                '''
    ''' P_start = [x_start, y_start, z_start]         '''
    ''' direction = [dx, dy, dz]                      '''
    ''' t = parâmetro (tempo/distança)                '''
    ''' z(t) = z_start + t * direction[2] = 0         '''

    t = (0 - z_start) / direction[2]
    x_at_0 = x_start + t*direction[0]
    y_at_0 = y_start + t*direction[1]

    if x_at_0**2 + y_at_0**2 > detector_radius**2:
        return None  # misses detector

    return {"pos": start_pos, "dir": direction, "path": [start_pos.copy()]}    # "path": [start_pos.copy()] = histórico de posições → atualiza e registra todos os pontos do muon

# -----------------------------
# Simulation parameters
# -----------------------------

muons = []
track_artists = []
hit_artists = []
muon_rate = 3  # avg number of muons per frame (Poisson)

# -----------------------------
# Configuração de plot com estatísticas
# -----------------------------

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))

# Plot principal (esquerda)

ax1.set_xlim(-detector_radius*2, detector_radius*2)
ax1.set_ylim(-detector_length/2-1, detector_length/2+6)
ax1.set_xlabel("x")
ax1.set_ylabel("z (downwards)")
ax1.set_title("Cosmic muons in 4-layer scintillator detector (x–z projection)")

# Draw scintillator layers as rectangles

for z in layer_z:
    rect = plt.Rectangle((-detector_radius, z-0.1),                                   # (x, y) do canto inferior esquerdo
                         2*detector_radius,                                           # Largura
                         0.2,                                                         # Altura
                         linewidth=1, edgecolor='black', facecolor='cyan', alpha=0.3)
    ax1.add_patch(rect)

    ax1.text(detector_radius + 0.3, z, f'L{np.argmin(np.abs(layer_z - z)) + 1}', 
             va='center', fontsize=10, color='darkblue')                              # Adiciona label para cada camada (L1, L2, L3, L4)

# Plot de estatísticas (direita)

ax2.set_xlim(0, 5)
ax2.set_ylim(0, 100)
ax2.set_xlabel("Número de Hits")
ax2.set_ylabel("Porcentagem")
ax2.set_title("Estatísticas de Detecção")
ax2.grid(True, alpha=0.3)

# -----------------------------
# Animation update
# -----------------------------

def update(frame):
    global muons, track_artists, hit_artists    # Listas globias: listas vazias criadas anteriormente
    
    stats['current_frame'] = frame  # Atualiza contador de frames
    
    if frame >= 200:
        print(f"🎯 Frame {frame} atingido - Finalizando simulação...")
        ani.event_source.stop()           # Para parar a animação 
        print_final_stats()               # Chama estatísticas finais
        return []

    # Remove previous tracks and hits

    for artist in track_artists + hit_artists:
        artist.remove() 
    track_artists.clear()
    hit_artists.clear()

    # Generate new muons

    n_new = np.random.poisson(muon_rate)   # Quantos novos múons neste frame
    for _ in range(n_new):
        muon = generate_cosmic_muon()      # Tenta criar um muon
        if muon:                           # Se muon ≠ 0, adiciona à lista de muons
            muons.append(muon)

    # Draw each muon

    total_hits_this_frame = 0
    
    for muon in muons:                     # Extrai os dados: posição inicial e direção de cada muon
        start = muon["pos"]
        direction = muon["dir"]

        # Extend trajectory downward

        t_vals = np.linspace(0, 1, 100)                                        # Criou 100 pontos t ao longo de 0 a 1
        traj = np.array([start + t*direction*20 for t in t_vals])              # Direction * 20 → vetor 20x mais longo (melhor visualização), logo, se t vai de 0 a 1 → trajetória de comprimento 20
        line, = ax1.plot(traj[:,0], traj[:,2], color="blue", alpha=0.6, lw=1)  # ax.plot sempre retorna uma lista; ao colocarmos ',' estamos chamando diretamente um objeto da lista de ax.plot
        track_artists.append(line)

        # Hits: intersections with scintillator layers

        hits_this_muon = 0
        for z_layer in layer_z:
            t_hit = (z_layer - start[2]) / direction[2]
            if t_hit > 0:
                x_hit = start[0] + t_hit*direction[0]
                y_hit = start[1] + t_hit*direction[1]
                if x_hit**2 + y_hit**2 <= detector_radius**2:
                    hit, = ax1.plot(x_hit, z_layer, "ro", markersize=4)  # Desenhar ponto vermelho no hit; "ro" = red circles (pontos vermelhos)
                    hit_artists.append(hit)
                    hits_this_muon += 1
        
        # Atualiza estatísticas para este múon

        total_hits_this_frame += hits_this_muon
        update_statistics(muon, hits_this_muon)

    # Atualiza plot de estatísticas

    ax2.clear() # Limpa o plot anterior
    ax2.set_xlim(0, 5)
    ax2.set_ylim(0, 100)
    ax2.set_xlabel("Número de Hits")
    ax2.set_ylabel("Porcentagem")
    ax2.set_title(f"Estatísticas (Frame {frame})")
    ax2.grid(True, alpha=0.3)
    
    # Plot histograma de hits por evento

    if stats['hits_per_event']:
        hits_counts = [stats['hits_per_event'].count(i) for i in range(1, 5)]
        total_events = len(stats['hits_per_event'])
        percentages = [count/total_events * 100 for count in hits_counts]
        
        # Cria barras do histograma
        bars = ax2.bar(range(1, 5),           # Posições X: 1, 2, 3, 4
                       percentages,           # Alturas Y: porcentagens
                       color='lightgreen', 
                       edgecolor='darkgreen', 
                       alpha=0.7)

        for bar, percentage in zip(bars, percentages):
            ax2.text(bar.get_x() + bar.get_width()/2,  # Centro X da barra
                    bar.get_height() + 2,              # Pouco acima do topo
                     f'{percentage:.1f}%',             # Texto: "28.6%"
                    ha='center',                       # Alinhamento horizontal: centro
                    va='bottom',                       # Alinhamento vertical: base
                    fontsize=10)
    
    # Adiciona texto com estatísticas gerais

    if stats['total_generated'] > 0:
        efficiency = (stats['detected'] / stats['total_generated']) * 100
        info_text = f"Total: {stats['total_generated']} múons\n"
        info_text += f"Detectados: {stats['detected']}\n"
        info_text += f"Eficiência: {efficiency:.1f}%"
        ax2.text(1, 80, info_text, fontsize=12, ha='center', bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue", alpha=0.7)) 
        # Posição X relativa (0-1), Posição Y fixa, Alinhamento horizontal: centro, Caixa com bordas arredondadas, Cor de fundo, Transparência

    # Imprime estatísticas no console a cada 10 frames

    if frame % 10 == 0:
        print_stats()

    return track_artists + hit_artists

# -----------------------------
# Run animation
# -----------------------------

print("Iniciando simulação de detecção de múons cósmicos...")
print("Estatísticas serão impressas a cada 10 frames")
print("=" * 50)

# [Adaptado para o navegador] se estiver demorando, diminua frames (por exemplo, para 100)
ani = animation.FuncAnimation(fig, update, frames=200, interval=200, blit=False, repeat=False)
# [Adaptado para o navegador] dpi=60 deixa o GIF mais leve e rápido de gerar
ani.save('Cosmic Muons Crossing Scintillator.gif', writer='pillow', fps=10, dpi=60)
plt.tight_layout()

# [Adaptado para o navegador] no site não existe janela do matplotlib: o GIF é exibido abaixo do código,
# então no lugar de plt.show() fechamos a figura.
plt.close(fig)

# Estatísticas finais

print("\n" + "=" * 50)
print("ESTATÍSTICAS FINAIS DA SIMULAÇÃO")
print("=" * 50)
print_stats()

if stats['hits_per_event']:
    print(f"\nDistribuição de Hits:")
    for i in range(1, 5):
        count = stats['hits_per_event'].count(i)                   # Conta quantos eventos tiveram exatamente 'i' hits
        percentage = (count / len(stats['hits_per_event'])) * 100
        print(f"  {i} hits: {count} eventos ({percentage:.1f}%)")
`,c={title:"O gr\xe1fico dos hits do m\xfaon em nosso detector"},l="O gr\xe1fico dos hits do m\xfaon em nosso detector",p={},m=[{value:"Fa\xe7a voc\xea mesmo",id:"fa\xe7a-voc\xea-mesmo",level:2}];function u(t){let e={code:"code",h1:"h1",h2:"h2",header:"header",p:"p",strong:"strong",...(0,i.R)(),...t.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(e.header,{children:(0,r.jsx)(e.h1,{id:"o-gr\xe1fico-dos-hits-do-m\xfaon-em-nosso-detector",children:"O gr\xe1fico dos hits do m\xfaon em nosso detector"})}),"\n",(0,r.jsx)(e.p,{children:"O estudo sobre a detec\xe7\xe3o dos m\xfaons nas esta\xe7\xf5es de medida ajuda-nos a entender melhor como essas part\xedculas chegam at\xe9 n\xf3s diretamente de grandes altitudes e como o hardware transforma a presen\xe7a delas em sinais el\xe9tricos. Na guia A rela\xe7\xe3o das part\xedculas com o mundo entendemos mais a fundo como ocorre esse processo e visualizamos como, em determinada configura\xe7\xe3o, a detec\xe7\xe3o funciona. Lembra-se do gr\xe1fico que vimos l\xe1? Vamos agora aprender como fazer um igual!"}),"\n","\n",(0,r.jsx)(e.h2,{id:"fa\xe7a-voc\xea-mesmo",children:"Fa\xe7a voc\xea mesmo"}),"\n",(0,r.jsxs)(e.p,{children:["Clique em ",(0,r.jsx)(e.strong,{children:"Executar"})," e aguarde: gerar a anima\xe7\xe3o leva de meio minuto a um minuto, dependendo do computador. Depois, experimente mudar valores como ",(0,r.jsx)(e.code,{children:"muon_rate"})," (m\xe9dia de m\xfaons por passo), ",(0,r.jsx)(e.code,{children:"detector_radius"})," (raio do detector) ou ",(0,r.jsx)(e.code,{children:"detector_length"})," (comprimento do detector) e execute de novo."]}),"\n",(0,r.jsx)(s.A,{packages:n,initialCode:d})]})}function h(t={}){let{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,r.jsx)(e,{...t,children:(0,r.jsx)(u,{...t})}):u(t)}},4726(t,e,a){a.d(e,{A:()=>_});var o=a(4848),r=a(6540),i=a(6069),s=a.n(i),n=a(1765),d=a(3941);let c="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",l=null,p=`
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
`,m=`
import glob, os
for _f in glob.glob('*.gif'):
    os.remove(_f)
`,u=`
import glob, json
json.dumps(glob.glob('*.gif'))
`,h=`
import json
json.dumps(_ipy_displays)
`,f=`
import io, base64
import matplotlib.pyplot as plt
_img = None
if plt.get_fignums():
    _buf = io.BytesIO()
    plt.savefig(_buf, format='png', dpi=110, bbox_inches='tight')
    plt.close('all')
    _img = base64.b64encode(_buf.getvalue()).decode()
_img
`;function _({initialCode:t="",packages:e=["numpy","matplotlib"]}){let a=t.trim(),[i,g]=(0,r.useState)(a),[x,y]=(0,r.useState)(""),[b,v]=(0,r.useState)(null),[j,z]=(0,r.useState)([]),[w,k]=(0,r.useState)([]),[A,C]=(0,r.useState)("Executar"),[P,N]=(0,r.useState)(!1),{colorMode:S}=(0,d.G)(),L="dark"===S?n.Zj.vsDark:n.Zj.vsLight;function E(){y(""),v(null),z([]),k([])}async function I(){N(!0),E();try{C("Carregando Python...");let t=await (!l&&(l=new Promise((t,e)=>{let a=document.createElement("script");a.src=c+"pyodide.js",a.onload=()=>window.loadPyodide({indexURL:c}).then(t,e),a.onerror=e,document.head.appendChild(a)})),l);C("Carregando pacotes..."),await t.loadPackage(e),await t.runPythonAsync("import matplotlib; matplotlib.use('Agg')"),await t.runPythonAsync(p),await t.runPythonAsync(m),C("Executando... (pode demorar)");let a="";t.setStdout({batched:t=>a+=t+"\n"}),t.setStderr({batched:t=>a+=t+"\n"}),await t.runPythonAsync(i);let o=JSON.parse(await t.runPythonAsync(h));z(o);let r=await t.runPythonAsync(f);if(r&&v("data:image/png;base64,"+r),0===o.length){let e=JSON.parse(await t.runPythonAsync(u));k(e.map(e=>URL.createObjectURL(new Blob([t.FS.readFile(e)],{type:"image/gif"}))))}y(a)}catch(t){y(String(t))}C("Executar"),N(!1)}return(0,o.jsxs)("div",{className:"pr",children:[(0,o.jsx)("style",{children:`
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
      `}),(0,o.jsxs)("aside",{className:"pr-sidebar",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("h3",{children:"A\xe7\xf5es"}),(0,o.jsxs)("div",{className:"pr-btns",children:[(0,o.jsx)("button",{type:"button",className:"pr-btn pr-btn-primary",onClick:I,disabled:P,children:A}),(0,o.jsx)("button",{type:"button",className:"pr-btn pr-btn-secondary",onClick:()=>{g(a),E()},disabled:P,children:"Restaurar original"}),(0,o.jsx)("button",{type:"button",className:"pr-btn pr-btn-secondary",onClick:()=>{g(""),E()},disabled:P,children:"Limpar"})]})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("h4",{children:"Ambiente"}),(0,o.jsxs)("div",{className:"pr-line",children:[(0,o.jsx)("span",{children:"Linguagem"}),(0,o.jsx)("strong",{children:"Python"})]}),(0,o.jsxs)("div",{className:"pr-line",children:[(0,o.jsx)("span",{children:"Execu\xe7\xe3o"}),(0,o.jsx)("strong",{children:"No navegador"})]}),(0,o.jsxs)("div",{className:"pr-line",children:[(0,o.jsx)("span",{children:"Estado"}),(0,o.jsx)("strong",{children:P?"Executando":"Pronto"})]})]})]}),(0,o.jsxs)("div",{className:"pr-main",children:[(0,o.jsx)("h2",{children:"C\xf3digo Python"}),(0,o.jsx)("div",{className:"pr-editor",children:(0,o.jsx)(s(),{value:i,onValueChange:g,highlight:t=>(0,o.jsx)(n.f4,{theme:L,code:t,language:"python",children:({tokens:t,getTokenProps:e})=>(0,o.jsx)(o.Fragment,{children:t.map((a,i)=>(0,o.jsxs)(r.Fragment,{children:[a.map((t,a)=>(0,o.jsx)("span",{...e({token:t})},a)),i<t.length-1?"\n":""]},i))})}),padding:16,tabSize:4,insertSpaces:!0,style:{fontFamily:"var(--ifm-font-family-monospace)",fontSize:14,color:L.plain.color,minHeight:160}})}),x&&(0,o.jsx)("div",{className:"pr-card",children:(0,o.jsx)("pre",{className:"pr-output",children:x})}),j.map((t,e)=>(0,o.jsx)("div",{className:"pr-card pr-html",dangerouslySetInnerHTML:{__html:t}},e)),b&&(0,o.jsx)("div",{className:"pr-card",children:(0,o.jsx)("img",{className:"pr-img",src:b,alt:"Gr\xe1fico gerado"})}),w.map(t=>(0,o.jsx)("div",{className:"pr-card",children:(0,o.jsx)("img",{className:"pr-img",src:t,alt:"GIF gerado"})},t))]})]})}}}]);