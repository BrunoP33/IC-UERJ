import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
  metadadosEventos,
  listaEventos,
  todasParticulas,
  dadosAltitudeDensidade,
  dadosLorentzVida
} from '../data/eventosData';

// Curva teórica γ(v) — calculada uma única vez, não depende de nenhum estado
// (equivalente ao loop "v_values / gamma_values" do app.py)
const V_VALUES = Array.from({ length: 99 }, (_, i) => (i + 1) / 100); // 0.01 até 0.99
const GAMMA_VALUES = V_VALUES.map((v) => 1 / Math.sqrt(1 - v * v));

// Equivalente a velocity_from_gamma() do app.py
function velocidadeDoFatorGamma(gamma) {
  if (gamma <= 1) return 0;
  return Math.sqrt(1 - 1 / (gamma * gamma));
}

export default function EventosDashboard() {
  const [indiceEvento, setIndiceEvento] = useState(0);
  const [particulasSelecionadas, setParticulasSelecionadas] = useState(todasParticulas);
  const [gamma, setGamma] = useState(0);

  const idEventoAtual = listaEventos[indiceEvento];
  const infoEvento = metadadosEventos[idEventoAtual];
  const videoSrc = useBaseUrl(infoEvento.videoSrc);

  const valoresSelecionados = particulasSelecionadas
    .filter((p) => p in infoEvento.contagemBase)
    .map((p) => infoEvento.contagemBase[p]);

  const vPoint = velocidadeDoFatorGamma(gamma);

  // Equivalente ao Callback 1 (update_event_index) — em JS o "% " pode dar
  // resultado negativo, por isso o "+ listaEventos.length" antes do módulo
  const eventoAnterior = () => {
    setIndiceEvento((prev) => (prev - 1 + listaEventos.length) % listaEventos.length);
  };
  const proximoEvento = () => {
    setIndiceEvento((prev) => (prev + 1) % listaEventos.length);
  };

  const alternarParticula = (particula) => {
    setParticulasSelecionadas((prev) =>
      prev.includes(particula) ? prev.filter((p) => p !== particula) : [...prev, particula]
    );
  };

  return (
    <div className="eventos-dashboard-container">
      <style>{`
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
      `}</style>

      {/* --- BARRA LATERAL (equivalente ao "sidebar" do app.py) --- */}
      <div className="eventos-sidebar">
        <h3>Parâmetros</h3>
        <div>
          <h4>Partículas Visíveis</h4>
          {todasParticulas.map((particula) => (
            <label key={particula} className="eventos-checkbox-row">
              <input
                type="checkbox"
                checked={particulasSelecionadas.includes(particula)}
                onChange={() => alternarParticula(particula)}
              />
              {particula}
            </label>
          ))}
        </div>
        <div>
          <h4>Fator de Lorentz (γ)</h4>
          <input
            type="range"
            min={0}
            max={7}
            step={1}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div className="eventos-slider-rotulo">
            <span>0</span>
            <span>7</span>
          </div>
          <div className="eventos-slider-valor">
            γ = <strong>{gamma}</strong>
          </div>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL (equivalente ao "conteudo" do app.py) --- */}
      <div className="eventos-conteudo">
        <h2>Simulação do Evento: {infoEvento.titulo}</h2>

        <div className="eventos-video-wrapper">
          <button className="eventos-carousel-arrow prev" onClick={eventoAnterior} aria-label="Evento anterior">
            ❮
          </button>
          <button className="eventos-carousel-arrow next" onClick={proximoEvento} aria-label="Próximo evento">
            ❯
          </button>
          <video
            key={videoSrc}
            src={videoSrc}
            controls
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', display: 'block' }}
          />
        </div>
        <div className="eventos-nav-dots">
          {listaEventos.map((id) => (
            <span
              key={id}
              className={`eventos-dot ${id === idEventoAtual ? 'eventos-dot-active' : ''}`}
            />
          ))}
        </div>

        {/* Plotly só existe no navegador — BrowserOnly evita erro no build estático */}
        <BrowserOnly fallback={<div style={{ padding: '60px', textAlign: 'center', opacity: 0.7 }}>Carregando gráficos…</div>}>
          {() => {
            const Plot = require('react-plotly.js').default;
            return (
              <div className="eventos-graphs-grid">
                <div className="eventos-graph-card">
                  <Plot
                    data={[{
                      type: 'bar',
                      x: particulasSelecionadas,
                      y: valoresSelecionados,
                      text: valoresSelecionados,
                      textposition: 'auto'
                    }]}
                    layout={{
                      title: 'Quantidade de partículas no evento',
                      xaxis: { title: 'Partícula' },
                      yaxis: { title: 'Nº de partículas (escala log)', type: 'log' },
                      autosize: true,
                      margin: { t: 40, b: 40, l: 55, r: 15 }
                    }}
                    style={{ width: '100%' }}
                    useResizeHandler
                  />
                </div>

                <div className="eventos-graph-card">
                  <Plot
                    data={[{
                      type: 'scatter',
                      mode: 'lines',
                      x: dadosAltitudeDensidade.altitude,
                      y: dadosAltitudeDensidade.densidade,
                      line: { shape: 'spline' }
                    }]}
                    layout={{
                      title: 'Densidade X Altitude',
                      xaxis: { title: 'Altitude' },
                      yaxis: { title: 'Densidade' },
                      autosize: true,
                      margin: { t: 40, b: 40, l: 55, r: 15 }
                    }}
                    style={{ width: '100%' }}
                    useResizeHandler
                  />
                </div>

                <div className="eventos-graph-card">
                  <Plot
                    data={[
                      {
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Curva γ(v)',
                        x: V_VALUES,
                        y: GAMMA_VALUES,
                        line: { color: '#3578e5' }
                      },
                      {
                        type: 'scatter',
                        mode: 'markers+text',
                        name: 'Ponto Atual',
                        x: [vPoint],
                        y: [gamma],
                        marker: { color: '#e53535', size: 10 },
                        text: [`γ = ${gamma}, v = ${vPoint.toFixed(3)}`],
                        textposition: 'top center'
                      }
                    ]}
                    layout={{
                      title: 'Velocidade X Fator de Lorentz',
                      xaxis: { title: 'Velocidade (c)', range: [0, 1] },
                      yaxis: { title: 'Fator de Lorentz', range: [0, Math.max(gamma, 7.5)] },
                      autosize: true,
                      showlegend: false,
                      margin: { t: 40, b: 40, l: 55, r: 15 }
                    }}
                    style={{ width: '100%' }}
                    useResizeHandler
                  />
                </div>

                <div className="eventos-graph-card">
                  <Plot
                    data={[{
                      type: 'scatter',
                      mode: 'lines',
                      x: dadosLorentzVida.gamma,
                      y: dadosLorentzVida.tempoVida,
                      line: { shape: 'spline' }
                    }]}
                    layout={{
                      title: 'Fator de Lorentz X Tempo de vida dilatado',
                      xaxis: { title: 'Fator de Lorentz' },
                      yaxis: { title: 'Tempo de Vida (μs)' },
                      autosize: true,
                      margin: { t: 40, b: 40, l: 55, r: 15 }
                    }}
                    style={{ width: '100%' }}
                    useResizeHandler
                  />
                </div>
              </div>
            );
          }}
        </BrowserOnly>
      </div>
    </div>
  );
}
