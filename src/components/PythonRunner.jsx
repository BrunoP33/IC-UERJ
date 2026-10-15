import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import { useColorMode } from '@docusaurus/theme-common';

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
let pyodidePromise = null;

function loadPyodideOnce() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = PYODIDE_URL + 'pyodide.js';
      s.onload = () =>
        window.loadPyodide({ indexURL: PYODIDE_URL }).then(resolve, reject);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return pyodidePromise;
}

// Altura máxima do editor (px). Acima disso aparece a barra de rolagem.
const EDITOR_MAX_HEIGHT = 700;

const PACKAGES = ['numpy', 'matplotlib', 'imageio'];

const DEFAULT_CODE = String.raw`import numpy as np
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

// Simula IPython.display (HTML, display) dentro do Pyodide
const IPYTHON_SHIM = `
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
`;

const CLEAN_GIFS = `
import glob, os
for _f in glob.glob('*.gif'):
    os.remove(_f)
`;

const LIST_GIFS = `
import glob, json
json.dumps(glob.glob('*.gif'))
`;

const GET_DISPLAYS = `
import json
json.dumps(_ipy_displays)
`;

const GET_FIGURE = `
import io, base64
import matplotlib.pyplot as plt
_img = None
if plt.get_fignums():
    _buf = io.BytesIO()
    plt.savefig(_buf, format='png', dpi=110, bbox_inches='tight')
    plt.close('all')
    _img = base64.b64encode(_buf.getvalue()).decode()
_img
`;

// Sem props de propósito: o código padrão é sempre o do GIF do múon.
export default function PythonRunner() {
  const original = DEFAULT_CODE.trim();

  const [code, setCode] = useState(original);
  const [output, setOutput] = useState('');
  const [img, setImg] = useState(null);
  const [htmlOutputs, setHtmlOutputs] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [status, setStatus] = useState('Executar');
  const [busy, setBusy] = useState(false);

  const { colorMode } = useColorMode();
  const theme = colorMode === 'dark' ? themes.vsDark : themes.vsLight;

  const highlight = (texto) => (
    <Highlight theme={theme} code={texto} language="python">
      {({ tokens, getTokenProps }) => (
        <>
          {tokens.map((linha, i) => (
            <React.Fragment key={i}>
              {linha.map((token, k) => (
                <span key={k} {...getTokenProps({ token })} />
              ))}
              {i < tokens.length - 1 ? '\n' : ''}
            </React.Fragment>
          ))}
        </>
      )}
    </Highlight>
  );

  function resetResults() {
    setOutput('');
    setImg(null);
    setHtmlOutputs([]);
    setGifs([]);
  }

  async function run() {
    setBusy(true);
    resetResults();
    try {
      setStatus('Carregando Python...');
      const py = await loadPyodideOnce();

      setStatus('Carregando pacotes...');
      await py.loadPackage(PACKAGES);
      await py.runPythonAsync("import matplotlib; matplotlib.use('Agg')");

      await py.runPythonAsync(IPYTHON_SHIM);
      await py.runPythonAsync(CLEAN_GIFS);

      setStatus('Executando... (pode demorar)');
      let out = '';
      py.setStdout({ batched: (t) => (out += t + '\n') });
      py.setStderr({ batched: (t) => (out += t + '\n') });
      await py.runPythonAsync(code);

      // Saídas de display(HTML(...))
      const displays = JSON.parse(await py.runPythonAsync(GET_DISPLAYS));
      setHtmlOutputs(displays);

      // Figura do matplotlib que ficou aberta
      const b64 = await py.runPythonAsync(GET_FIGURE);
      if (b64) setImg('data:image/png;base64,' + b64);

      // GIFs gerados, só se o código não os exibiu via display()
      if (displays.length === 0) {
        const nomes = JSON.parse(await py.runPythonAsync(LIST_GIFS));
        setGifs(
          nomes.map((n) =>
            URL.createObjectURL(
              new Blob([py.FS.readFile(n)], { type: 'image/gif' })
            )
          )
        );
      }

      setOutput(out);
    } catch (e) {
      setOutput(String(e));
    }
    setStatus('Executar');
    setBusy(false);
  }

  return (
    <div className="pr">
      <style>{`
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
        .pr-editor { max-height: ${EDITOR_MAX_HEIGHT}px; overflow: auto; border-radius: 8px; border: 1px solid var(--ifm-color-emphasis-300); background: var(--pr-code-bg); transition: border-color 0.2s; }
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
      `}</style>

      {/* --- BARRA LATERAL --- */}
      <aside className="pr-sidebar">
        <div>
          <h3>Ações</h3>
          <div className="pr-btns">
            <button
              type="button"
              className="pr-btn pr-btn-primary"
              onClick={run}
              disabled={busy}
            >
              {status}
            </button>
            <button
              type="button"
              className="pr-btn pr-btn-secondary"
              onClick={() => { setCode(original); resetResults(); }}
              disabled={busy}
            >
              Restaurar original
            </button>
            <button
              type="button"
              className="pr-btn pr-btn-secondary"
              onClick={() => { setCode(''); resetResults(); }}
              disabled={busy}
            >
              Limpar
            </button>
          </div>
        </div>

        <div>
          <h4>Ambiente</h4>
          <div className="pr-line"><span>Linguagem</span><strong>Python</strong></div>
          <div className="pr-line"><span>Execução</span><strong>No navegador</strong></div>
          <div className="pr-line"><span>Estado</span><strong>{busy ? 'Executando' : 'Pronto'}</strong></div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="pr-main">
        <h2>Código Python</h2>

        <div className="pr-editor">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlight}
            padding={16}
            tabSize={4}
            insertSpaces
            style={{
              fontFamily: 'var(--ifm-font-family-monospace)',
              fontSize: 14,
              color: theme.plain.color,
              minHeight: 160,
            }}
          />
        </div>

        {output && (
          <div className="pr-card">
            <pre className="pr-output">{output}</pre>
          </div>
        )}

        {htmlOutputs.map((h, i) => (
          <div
            key={i}
            className="pr-card pr-html"
            dangerouslySetInnerHTML={{ __html: h }}
          />
        ))}

        {img && (
          <div className="pr-card">
            <img className="pr-img" src={img} alt="Gráfico gerado" />
          </div>
        )}

        {gifs.map((src) => (
          <div key={src} className="pr-card">
            <img className="pr-img" src={src} alt="GIF gerado" />
          </div>
        ))}
      </div>
    </div>
  );
}