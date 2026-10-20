import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import DesenhoModeloAtomico from './DesenhoModeloAtomico';

function BotaoLink({ link, primario }) {
  const classe = `lt-btn ${primario ? 'lt-btn-primary' : 'lt-btn-secondary'}`;

  if (link.tipo === 'interno') {
    return (
      <Link className={classe} to={link.href}>
        {link.rotulo}
      </Link>
    );
  }
  return (
    <a className={classe} href={link.href} target="_blank" rel="noopener noreferrer">
      {link.rotulo}
    </a>
  );
}

export default function LinhaDoTempo({
  eventos = [],
  rotulo = 'Linha do tempo',
}) {
  // Índice do evento aberto no painel (null = nenhum aberto)
  const [ativo, setAtivo] = useState(null);
  const itensRef = useRef([]);

  const total = eventos.length;
  const evento = ativo === null ? null : eventos[ativo];

  // Mantém a bolinha escolhida visível (a linha rola para o lado no celular)
  useEffect(() => {
    if (ativo === null) return;
    const el = itensRef.current[ativo];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [ativo]);

  // Clicar na bolinha que já está aberta fecha o painel
  const alternar = (i) => setAtivo((atual) => (atual === i ? null : i));

  return (
    <div className="lt">
      <style>{`
        .lt {
          background: var(--ifm-card-background-color, var(--ifm-background-surface-color));
          color: var(--ifm-color-content);
          border: 1px solid var(--ifm-color-emphasis-200);
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          padding: 30px;
          margin: 2rem auto;
          font-family: var(--ifm-font-family-base);
        }
        .lt button { font-family: inherit; }
        .lt button:focus-visible,
        .lt a:focus-visible { outline: 2px solid var(--ifm-color-primary); outline-offset: 2px; }

        /* ---------- Linha do tempo ---------- */
        .lt-trilho {
          display: flex;
          margin: 0 0 20px 0;
          padding: 0 0 8px 0;
          list-style: none;
          overflow-x: auto;
          scroll-snap-type: x proximity;
        }
        .lt-item {
          flex: 1 0 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0;
          scroll-snap-align: center;
        }
        .lt-data {
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 700;
          opacity: 0.75;
        }
        .lt-data-ativa { color: var(--ifm-color-primary); opacity: 1; }

        .lt-linha {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 28px;
        }
        .lt-linha::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--ifm-color-emphasis-300);
          transform: translateY(-50%);
        }
        .lt-primeiro::before { left: 50%; }
        .lt-ultimo::before { right: 50%; }

        .lt-ponto {
          position: relative;
          z-index: 1;
          width: 18px;
          height: 18px;
          padding: 0;
          border: 2px solid var(--ifm-color-emphasis-500);
          border-radius: 50%;
          background: var(--ifm-background-color);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .lt-ponto:hover { border-color: var(--ifm-color-primary); transform: scale(1.2); }
        .lt-ponto-ativo {
          background: var(--ifm-color-primary);
          border-color: var(--ifm-color-primary);
          transform: scale(1.2);
        }

        /* Título: aparece ao passar o mouse, ao focar com o teclado ou quando selecionado.
           Precisa ficar logo depois de .lt-linha por causa do seletor "+". */
        .lt-titulo {
          min-height: 2.6em;
          margin-top: 6px;
          padding: 0 6px;
          font-size: 13px;
          line-height: 1.3;
          text-align: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .lt-linha:hover + .lt-titulo,
        .lt-linha:focus-within + .lt-titulo,
        .lt-titulo-ativo { opacity: 1; }
        .lt-titulo-ativo { font-weight: 600; color: var(--ifm-color-primary); }

        /* Telas de toque (celular/tablet) não têm "passar o mouse":
           os títulos ficam sempre visíveis */
        @media (hover: none) {
          .lt-titulo { opacity: 1; }
        }

        /* ---------- Painel ---------- */
        .lt-painel {
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 8px;
          padding: 20px;
          background: var(--ifm-background-color);
        }
        .lt-dica { margin: 0; text-align: center; opacity: 0.7; }
        .lt-conteudo { animation: lt-aparecer 0.2s ease; }
        @keyframes lt-aparecer {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lt-conteudo { animation: none; }
        }

        .lt-cabecalho {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .lt-chip {
          padding: 2px 12px;
          font-size: 14px;
          font-weight: 700;
          color: var(--ifm-color-primary);
          border: 1px solid var(--ifm-color-primary);
          border-radius: 999px;
        }
        .lt-painel h3 { margin: 0; color: var(--ifm-color-primary); }

        .lt-resumo {
          margin: 16px 0;
          padding: 12px 16px;
          background: var(--ifm-color-emphasis-100);
          border-left: 4px solid var(--cor-ensino-amarelo, var(--ifm-color-primary));
          border-radius: 0 8px 8px 0;
        }

        /* Botões: mesmo estilo do PythonRunner e do Quiz (empilhados, largura total) */
        .lt-btns { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
        .lt-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 46px;
          padding: 0 16px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .lt-btn:hover { text-decoration: none; }
        .lt-btn-primary { background: var(--ifm-color-primary); color: #ffffff; border: none; }
        .lt-btn-primary:hover { background: var(--ifm-color-primary-dark); color: #ffffff; }
        .lt-btn-secondary {
          background: transparent;
          color: var(--ifm-color-content);
          border: 1px solid var(--ifm-color-emphasis-300);
        }
        .lt-btn-secondary:hover { border-color: var(--ifm-color-primary); color: var(--ifm-color-content); }

        .lt-nav {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--ifm-color-emphasis-200);
        }
        .lt-nav-btn {
          height: 36px;
          padding: 0 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          background: transparent;
          color: var(--ifm-color-content);
          border: 1px solid var(--ifm-color-emphasis-300);
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .lt-nav-btn:hover:not(:disabled) { border-color: var(--ifm-color-primary); }
        .lt-nav-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Desenho do modelo ao lado do texto + caixas "explica / não explica" */
        .lt-corpo-com-desenho {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 20px;
          align-items: start;
        }
        .lt-textos p:first-child { margin-top: 0; }
        .lt-duplo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 4px;
        }
        .lt-caixa {
          padding: 12px 14px;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 8px;
        }
        .lt-caixa strong { display: block; margin-bottom: 4px; }
        .lt-caixa p { margin: 0; font-size: 14.5px; }

        @media (max-width: 780px) {
          .lt { padding: 16px; }
          .lt-painel { padding: 16px; }
          .lt-corpo-com-desenho { grid-template-columns: 1fr; }
          .lt-desenho { justify-self: center; }
          .lt-duplo { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* --- LINHA DO TEMPO --- */}
      <ol className="lt-trilho" aria-label={rotulo}>
        {eventos.map((e, i) => (
          <li
            key={e.id}
            className="lt-item"
            ref={(el) => (itensRef.current[i] = el)}
          >
            <span className={`lt-data ${i === ativo ? 'lt-data-ativa' : ''}`}>{e.data}</span>

            <div
              className={`lt-linha ${i === 0 ? 'lt-primeiro' : ''} ${
                i === total - 1 ? 'lt-ultimo' : ''
              }`}
            >
              <button
                type="button"
                className={`lt-ponto ${i === ativo ? 'lt-ponto-ativo' : ''}`}
                onClick={() => alternar(i)}
                aria-expanded={i === ativo}
                aria-controls="lt-painel"
                aria-label={`${e.data}: ${e.titulo}`}
              />
            </div>

            <span className={`lt-titulo ${i === ativo ? 'lt-titulo-ativo' : ''}`}>
              {e.titulo}
            </span>
          </li>
        ))}
      </ol>

      {/* --- PAINEL COM A EXPLICAÇÃO --- */}
      <section id="lt-painel" className="lt-painel" aria-live="polite">
        {evento ? (
          <div key={evento.id} className="lt-conteudo">
            <div className="lt-cabecalho">
              <span className="lt-chip">{evento.data}</span>
              <h3>{evento.titulo}</h3>
            </div>

            <div className={`lt-corpo ${evento.desenho ? 'lt-corpo-com-desenho' : ''}`}>
              {evento.desenho && (
                <div className="lt-desenho">
                  <DesenhoModeloAtomico tipo={evento.desenho} legenda={evento.desenhoLegenda} />
                </div>
              )}
              <div className="lt-textos">
                {evento.paragrafos.map((p, k) => (
                  <p key={k}>{p}</p>
                ))}
              </div>
            </div>

            {(evento.explica || evento.naoExplica) && (
              <div className="lt-duplo">
                {evento.explica && (
                  <div className="lt-caixa">
                    <strong>{evento.tituloExplica || 'O que explicava'}</strong>
                    <p>{evento.explica}</p>
                  </div>
                )}
                {evento.naoExplica && (
                  <div className="lt-caixa">
                    <strong>{evento.tituloNaoExplica || 'O que não explicava'}</strong>
                    <p>{evento.naoExplica}</p>
                  </div>
                )}
              </div>
            )}

            <p className="lt-resumo">
              {evento.resumo}
            </p>

            {evento.links && evento.links.length > 0 && (
              <div className="lt-btns">
                {evento.links.map((l, k) => (
                  <BotaoLink key={l.href} link={l} primario={k === 0} />
                ))}
              </div>
            )}

            <div className="lt-nav">
              <button
                type="button"
                className="lt-nav-btn"
                onClick={() => setAtivo(ativo - 1)}
                disabled={ativo === 0}
              >
                ← Anterior
              </button>
              <button
                type="button"
                className="lt-nav-btn"
                onClick={() => setAtivo(ativo + 1)}
                disabled={ativo === total - 1}
              >
                Próxima →
              </button>
            </div>
          </div>
        ) : (
          <p className="lt-dica">Clique em uma data para ver o que aconteceu.</p>
        )}
      </section>
    </div>
  );
}
