import React, { useState } from 'react';

const configAltitudes = {
  subsolo: {
    nome: 'Subsolo',
    qtd: 6,
    velocidade: 6,
    texto:
      'No subsolo, a maior parte dos raios cósmicos é absorvida pelo solo e pelas estruturas acima.'
  },
  cidade: {
    nome: 'Nível do solo',
    qtd: 18,
    velocidade: 4.5,
    texto:
      'Ao nível do solo, ainda somos atravessados por múons produzidos na atmosfera.'
  },
  montanha: {
    nome: 'Montanha',
    qtd: 38,
    velocidade: 3,
    texto:
      'Em grandes altitudes, há menos atmosfera para bloquear as partículas cósmicas.'
  },
  balao: {
    nome: 'Balão de Victor Hess',
    qtd: 65,
    velocidade: 2,
    texto:
      'No balão de Victor Hess, o aumento da radiação foi decisivo para provar a origem cósmica dessas partículas.'
  }
};

export default function CosmicVisualizer() {
  const [altitude, setAltitude] = useState('cidade');
  const atual = configAltitudes[altitude];

  return (
    <div className="cv">
      <style>{`
        .cv { background: var(--ifm-card-background-color, var(--ifm-background-surface-color)); color: var(--ifm-color-content); border: 1px solid var(--ifm-color-emphasis-200); border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); padding: 30px; margin: 20px auto; font-family: var(--ifm-font-family-base); display: flex; gap: 30px; flex-wrap: wrap; }
        .cv button { font-family: inherit; }
        .cv button:focus-visible { outline: 2px solid var(--ifm-color-primary); outline-offset: 2px; }

        .cv-sidebar { flex: 0 0 210px; display: flex; flex-direction: column; gap: 26px; }
        .cv-sidebar h3 { margin: 0 0 14px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.65; border-bottom: 1px solid var(--ifm-color-emphasis-300); padding-bottom: 8px; }

        .cv-opts { display: flex; flex-direction: column; gap: 8px; }
        .cv-opt { width: 100%; min-height: 46px; padding: 8px 16px; border-radius: 8px; font-size: 15px; font-weight: 600; line-height: 1.3; cursor: pointer; background: transparent; color: var(--ifm-color-content); border: 1px solid var(--ifm-color-emphasis-300); transition: background 0.2s, border-color 0.2s, box-shadow 0.2s; }
        .cv-opt:hover { border-color: var(--ifm-color-primary); }
        .cv-opt[aria-pressed='true'] { background: var(--ifm-color-primary); color: #ffffff; border-color: var(--ifm-color-primary); box-shadow: 0 0 0 2px var(--ifm-card-background-color, var(--ifm-background-surface-color)), 0 0 0 4px var(--ifm-color-primary); }
        .cv-opt[aria-pressed='true']:hover { background: var(--ifm-color-primary-dark); border-color: var(--ifm-color-primary-dark); }
        .cv-opt[aria-pressed='true']::before { content: '✓'; margin-right: 8px; }

        .cv-main { flex: 1 1 480px; min-width: 0; }
        .cv-main h2 { margin-top: 0; color: var(--ifm-color-primary); }
        .cv-intro { margin: 0 0 20px; font-size: 15px; line-height: 1.55; opacity: 0.85; }

        .cv-scene { position: relative; height: 250px; border-radius: 10px; overflow: hidden; background: #000; box-shadow: 0 4px 14px rgba(0,0,0,0.18); margin-bottom: 20px; }
        .cv-particle { position: absolute; width: 3px; height: 22px; border-radius: 2px; background: rgba(214, 214, 230, 0.8); animation: cv-fall linear infinite; }
        @keyframes cv-fall {
          0% { transform: translateY(-30px); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(270px); opacity: 0; }
        }

        .cv-card { border: 1px solid var(--ifm-color-emphasis-300); border-radius: 8px; padding: 18px; background: var(--ifm-background-color); }
        .cv-desc { margin: 0 0 12px; font-size: 15px; line-height: 1.55; opacity: 0.85; }
        .cv-key { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.55; }
        .cv-foot { margin: 16px 0 0; font-size: 13px; opacity: 0.6; }

        @media (max-width: 780px) {
          .cv-sidebar { flex: 1 1 100%; }
          .cv-opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>

      {/* --- BARRA LATERAL --- */}
      <aside className="cv-sidebar">
        <div>
          <h3>Altitude</h3>
          <div className="cv-opts" role="group" aria-label="Altitude">
            {Object.entries(configAltitudes).map(([chave, cfg]) => (
              <button
                key={chave}
                type="button"
                className="cv-opt"
                aria-pressed={altitude === chave}
                onClick={() => setAltitude(chave)}
              >
                {cfg.nome}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="cv-main">
        <h2>Raios Cósmicos e Altitude</h2>
        <p className="cv-intro">
          Em 1912, Victor Hess subiu em um balão e descobriu que a radiação
          aumenta com a altitude. Explore visualmente esse efeito.
        </p>

        {/* Cena com as partículas animadas */}
        <div
          className="cv-scene"
          role="img"
          aria-label={`Animação de partículas caindo. Altitude: ${atual.nome}.`}
        >
          {Array.from({ length: atual.qtd }).map((_, i) => {
            const duracao = atual.velocidade + (i % 4) * 0.3;
            // O atraso negativo faz a animação começar já no meio do percurso
            const delayNegativo = -((i * 0.4) % duracao);

            return (
              <div
                key={i}
                className="cv-particle"
                style={{
                  left: `${(i * 13 + 7) % 95}%`,
                  animationDuration: `${duracao}s`,
                  animationDelay: `${delayNegativo}s`
                }}
              />
            );
          })}
        </div>

        {/* Explicação */}
        <div className="cv-card">
          <p className="cv-desc">{atual.texto}</p>
          <p className="cv-key">
            Quanto maior a altitude, maior a intensidade observada de raios
            cósmicos.
          </p>
        </div>

        <p className="cv-foot">
          Visualização conceitual inspirada no experimento histórico de Victor
          Hess.
        </p>
      </div>
    </div>
  );
}