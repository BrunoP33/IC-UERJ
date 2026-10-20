export const pacotesDetectorMuons = ['numpy', 'matplotlib'];

export const codigoDetectorMuons = String.raw`import numpy as np
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
`;
