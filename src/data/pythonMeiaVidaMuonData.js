export const pacotesMeiaVidaMuon = ['numpy', 'matplotlib', 'imageio'];

export const codigoMeiaVidaMuon = String.raw`import numpy as np
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
`;
