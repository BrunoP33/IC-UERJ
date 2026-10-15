import React, { useState, useEffect } from 'react';
import { quizDataCompleto } from '../data/quizData';

// ---------------- CONFIGURAÇÕES ----------------

const QTD_SORTEIO = 10;
const pesosDificuldade = { facil: 1, medio: 2, dificil: 3 };
const coresDificuldade = { facil: '#48bb78', medio: '#ecc94b', dificil: '#f56565' };
const rotuloDificuldade = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };

// Chave usada para guardar o desempenho no navegador
const CHAVE_STORAGE = 'quiz-fisica-particulas';

const lerSalvo = () => {
  try {
    const bruto = window.localStorage.getItem(CHAVE_STORAGE);
    return bruto ? JSON.parse(bruto) : {};
  } catch (e) {
    return {};
  }
};

const gravarSalvo = (dados) => {
  try {
    window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
  } catch (e) {
    // sem armazenamento: o quiz continua funcionando normalmente
  }
};

// Embaralha o array (Fisher-Yates)
const embaralharArray = (array) => {
  const misturado = [...array];
  for (let i = misturado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [misturado[i], misturado[j]] = [misturado[j], misturado[i]];
  }
  return misturado;
};

// Nota ponderada do modo Estudo (0 a 10)
const calcularResultado = (perguntas, respostas) => {
  let pontosObtidos = 0;
  let pontosPossiveis = 0;
  let acertos = 0;

  perguntas.forEach((q, i) => {
    const peso = pesosDificuldade[q.dificuldade] || 1;
    pontosPossiveis += peso;
    if (respostas[i] === q.correta) {
      pontosObtidos += peso;
      acertos++;
    }
  });

  const nota =
    pontosPossiveis > 0
      ? Number(((pontosObtidos / pontosPossiveis) * 10).toFixed(1))
      : 0;

  return { acertos, nota };
};

const formatarNota = (n) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function Linha({ rotulo, children }) {
  return (
    <div className="qz-line">
      <span>{rotulo}</span>
      <strong>{children}</strong>
    </div>
  );
}

// ---------------- COMPONENTE ----------------

export default function QuizDashboard() {
  const [tela, setTela] = useState('inicio');
  const [modo, setModo] = useState(null);
  const [selecao, setSelecao] = useState('estudo');

  const [perguntasSorteadas, setPerguntasSorteadas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState([]);

  // Desempenho (guardado no navegador)
  const [tentativasDesafio, setTentativasDesafio] = useState(0);
  const [melhorProgresso, setMelhorProgresso] = useState(0);
  const [ultimaNota, setUltimaNota] = useState(null);
  const [melhorNota, setMelhorNota] = useState(null);
  const [carregado, setCarregado] = useState(false);

  const [mensagemDesafio, setMensagemDesafio] = useState('');

  // Lê o desempenho salvo (só no navegador, depois da montagem)
  useEffect(() => {
    const salvo = lerSalvo();
    setTentativasDesafio(salvo.desafioTentativas || 0);
    setMelhorProgresso(salvo.desafioRecorde || 0);
    setUltimaNota(typeof salvo.estudoUltima === 'number' ? salvo.estudoUltima : null);
    setMelhorNota(typeof salvo.estudoMelhor === 'number' ? salvo.estudoMelhor : null);
    setCarregado(true);
  }, []);

  // Grava sempre que o desempenho mudar
  useEffect(() => {
    if (!carregado) return;
    gravarSalvo({
      desafioTentativas: tentativasDesafio,
      desafioRecorde: melhorProgresso,
      estudoUltima: ultimaNota,
      estudoMelhor: melhorNota
    });
  }, [carregado, tentativasDesafio, melhorProgresso, ultimaNota, melhorNota]);

  // ---------------- NAVEGAÇÃO ----------------

  // Sai do quiz em andamento e volta para a escolha de modo.
  // Recorde, tentativas e notas continuam salvos.
  const voltarAosModos = () => {
    setMensagemDesafio('');
    setIndice(0);
    setRespostasUsuario([]);
    setTela('inicio');
  };

  // ---------------- MODO ESTUDO ----------------

  const iniciarEstudo = () => {
    const bancoMisturado = embaralharArray(quizDataCompleto);
    const selecionadas = bancoMisturado.slice(0, Math.min(QTD_SORTEIO, bancoMisturado.length));

    setModo('estudo');
    setSelecao('estudo');
    setPerguntasSorteadas(selecionadas);
    setRespostasUsuario(Array(selecionadas.length).fill(null));
    setIndice(0);
    setMensagemDesafio('');
    setTela('quiz');
  };

  const selecionarResposta = (respostaEscolhida) => {
    const novasRespostas = [...respostasUsuario];
    novasRespostas[indice] = respostaEscolhida;
    setRespostasUsuario(novasRespostas);
  };

  const proximaPergunta = () => {
    if (indice < perguntasSorteadas.length - 1) {
      setIndice(indice + 1);
    } else {
      const { nota } = calcularResultado(perguntasSorteadas, respostasUsuario);
      setUltimaNota(nota);
      setMelhorNota((atual) => (atual === null ? nota : Math.max(atual, nota)));
      setTela('resultado');
    }
  };

  const voltarPergunta = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  // ---------------- MODO DESAFIO ----------------

  const iniciarDesafio = () => {
    // No desafio, a ordem original do arquivo é preservada.
    setModo('desafio');
    setSelecao('desafio');
    setPerguntasSorteadas([...quizDataCompleto]);
    setRespostasUsuario([null]);
    setIndice(0);
    setMensagemDesafio('');
    setTela('quiz');
  };

  const responderDesafio = () => {
    const qAtual = quizDataCompleto[indice];
    const resposta = respostasUsuario[0];

    if (!resposta) return;

    // Acertou: avança exatamente uma posição na ordem original.
    if (resposta === qAtual.correta) {
      const progressoAtual = indice + 1;

      if (progressoAtual > melhorProgresso) setMelhorProgresso(progressoAtual);

      // Última questão acertada: desafio concluído.
      if (indice === quizDataCompleto.length - 1) {
        setTentativasDesafio(tentativasDesafio + 1);
        setMensagemDesafio('');
        setTela('desafioConcluido');
        return;
      }

      setIndice(indice + 1);
      setRespostasUsuario([null]);
      setMensagemDesafio('');
      return;
    }

    // Errou: registra a tentativa e volta imediatamente para a questão 1.
    setTentativasDesafio(tentativasDesafio + 1);

    const novoMelhor = Math.max(melhorProgresso, indice);
    setMelhorProgresso(novoMelhor);

    setIndice(0);
    setRespostasUsuario([null]);
    setMensagemDesafio(
      `Resposta incorreta. Você voltou para a questão 1. Sua maior sequência foi de ${novoMelhor} ${
        novoMelhor === 1 ? 'questão' : 'questões'
      }.`
    );
  };

  // ---------------- DADOS DERIVADOS ----------------

  const totalBanco = quizDataCompleto.length;
  const qtdEstudo = Math.min(QTD_SORTEIO, totalBanco);
  const ehEstudo = selecao === 'estudo';
  const traco = '—';

  const descricao = ehEstudo
    ? 'Questões sorteadas, com peso pela dificuldade. No fim, você recebe uma nota de 0 a 10.'
    : 'Acerte todas em ordem. Errou, volta à primeira. As tentativas são ilimitadas.';

  const stat1 = ehEstudo
    ? { rotulo: 'Última nota', valor: ultimaNota !== null ? formatarNota(ultimaNota) : traco }
    : { rotulo: 'Recorde', valor: melhorProgresso > 0 ? melhorProgresso : traco };
  const stat2 = ehEstudo
    ? { rotulo: 'Melhor nota', valor: melhorNota !== null ? formatarNota(melhorNota) : traco }
    : { rotulo: 'Tentativas', valor: tentativasDesafio };

  const qAtual = tela === 'quiz' ? perguntasSorteadas[indice] : null;
  const respostaAtual = modo === 'desafio' ? respostasUsuario[0] : respostasUsuario[indice];
  const progresso = qAtual ? ((indice + 1) / perguntasSorteadas.length) * 100 : 0;
  const resultado =
    tela === 'resultado' && modo === 'estudo'
      ? calcularResultado(perguntasSorteadas, respostasUsuario)
      : null;

  // ---------------- RENDERIZAÇÃO ----------------

  return (
    <div className="qz">
      <style>{`
        .qz { background: var(--ifm-card-background-color, var(--ifm-background-surface-color)); color: var(--ifm-color-content); border: 1px solid var(--ifm-color-emphasis-200); border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); padding: 30px; margin: 20px auto; font-family: var(--ifm-font-family-base); display: grid; grid-template-columns: 210px minmax(0, 1fr); grid-template-rows: auto 1fr; grid-template-areas: "side main" "acts main"; column-gap: 30px; row-gap: 26px; }
        .qz button { font-family: inherit; }
        .qz button:focus-visible, .qz input:focus-visible { outline: 2px solid var(--ifm-color-primary); outline-offset: 2px; }

        .qz-sidebar { grid-area: side; display: flex; flex-direction: column; gap: 26px; }
        .qz-acoes { grid-area: acts; align-self: start; }
        .qz-main { grid-area: main; min-width: 0; }

        .qz-sidebar h3, .qz-acoes h3 { margin: 0 0 14px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.65; border-bottom: 1px solid var(--ifm-color-emphasis-300); padding-bottom: 8px; }
        .qz-line { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 6px 0; font-size: 14px; }
        .qz-line span { opacity: 0.85; }
        .qz-line strong { color: var(--ifm-color-primary); font-size: 17px; font-variant-numeric: tabular-nums; }
        .qz-diff-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }

        .qz-modes { display: flex; flex-direction: column; gap: 8px; }
        .qz-mode { width: 100%; height: 46px; padding: 0 16px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; background: transparent; color: var(--ifm-color-content); border: 1px solid var(--ifm-color-emphasis-300); transition: background 0.2s, border-color 0.2s, box-shadow 0.2s; }
        .qz-mode:hover { border-color: var(--ifm-color-primary); }
        .qz-mode[aria-pressed='true'] { background: var(--ifm-color-primary); color: #ffffff; border-color: var(--ifm-color-primary); box-shadow: 0 0 0 2px var(--ifm-card-background-color, var(--ifm-background-surface-color)), 0 0 0 4px var(--ifm-color-primary); }
        .qz-mode[aria-pressed='true']:hover { background: var(--ifm-color-primary-dark); border-color: var(--ifm-color-primary-dark); }
        .qz-mode[aria-pressed='true']::before { content: '✓'; margin-right: 8px; }

        .qz-main h2 { margin-top: 0; color: var(--ifm-color-primary); }
        .qz-card { border: 1px solid var(--ifm-color-emphasis-300); border-radius: 8px; padding: 18px; background: var(--ifm-background-color); }
        .qz-big { display: flex; align-items: baseline; gap: 8px; margin: 0; font-size: 56px; font-weight: 600; line-height: 1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
        .qz-big span { font-size: 14px; font-weight: 400; letter-spacing: 0; opacity: 0.65; }
        .qz-desc { margin: 14px 0 0; font-size: 15px; line-height: 1.55; opacity: 0.85; }
        .qz-score-l { margin: 0 0 8px; font-size: 13px; opacity: 0.7; }
        .qz-section { margin: 22px 0 10px; font-size: 14px; font-weight: 600; opacity: 0.85; }

        .qz-btns { display: flex; flex-direction: column; gap: 8px; }
        .qz-btn { width: 100%; height: 46px; padding: 0 16px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
        .qz-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .qz-btn-primary { background: var(--ifm-color-primary); color: #ffffff; border: none; }
        .qz-btn-primary:hover:not(:disabled) { background: var(--ifm-color-primary-dark); }
        .qz-btn-secondary { background: transparent; color: var(--ifm-color-content); border: 1px solid var(--ifm-color-emphasis-300); }
        .qz-btn-secondary:hover:not(:disabled) { border-color: var(--ifm-color-primary); }

        .qz-progress { height: 6px; border-radius: 3px; background: var(--ifm-color-emphasis-200); overflow: hidden; margin-bottom: 22px; }
        .qz-progress > div { height: 100%; background: var(--ifm-color-primary); transition: width 0.4s ease-in-out; }
        .qz-question { margin: 0 0 18px; font-size: 18px; line-height: 1.4; }
        .qz-options { display: flex; flex-direction: column; gap: 10px; }
        .qz-option { padding: 14px 16px; border: 1px solid var(--ifm-color-emphasis-300); border-radius: 8px; text-align: left; font-size: 15px; line-height: 1.45; cursor: pointer; background: var(--ifm-background-color); color: var(--ifm-color-content); transition: border-color 0.2s, background 0.2s; }
        .qz-option:hover { border-color: var(--ifm-color-primary); }
        .qz-option.selected { border-color: var(--ifm-color-primary); box-shadow: 0 0 0 1px var(--ifm-color-primary); background: var(--ifm-color-emphasis-100); background: color-mix(in srgb, var(--ifm-color-primary) 14%, transparent); }
        .qz-alert { border: 1px solid #f56565; background: rgba(245,101,101,0.12); border-radius: 8px; padding: 12px 14px; margin-bottom: 18px; font-size: 14px; line-height: 1.5; }

        .qz-gab-list { max-height: 350px; overflow-y: auto; padding-right: 6px; }
        .qz-gab-item { border: 1px solid var(--ifm-color-emphasis-300); border-left-width: 4px; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; background: var(--ifm-background-color); }
        .qz-gab-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .qz-gab-q { font-size: 14px; font-weight: 600; line-height: 1.45; }
        .qz-gab-peso { font-size: 12px; opacity: 0.65; white-space: nowrap; }
        .qz-gab-resp { margin-top: 6px; font-size: 13px; line-height: 1.5; }

        @media (max-width: 780px) {
          .qz { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto; grid-template-areas: "side" "main" "acts"; }
          .qz-sidebar { flex-direction: row; flex-wrap: wrap; gap: 30px; }
          .qz-sidebar > div { flex: 1 1 200px; }
        }
      `}</style>

      {/* --- BARRA LATERAL (informações) --- */}
      <aside className="qz-sidebar">
        {tela === 'inicio' && (
          <>
            <div>
              <h3>Modo</h3>
              <div className="qz-modes" role="group" aria-label="Modo do quiz">
                <button
                  type="button"
                  className="qz-mode"
                  aria-pressed={ehEstudo}
                  onClick={() => setSelecao('estudo')}
                >
                  Estudo
                </button>
                <button
                  type="button"
                  className="qz-mode"
                  aria-pressed={!ehEstudo}
                  onClick={() => setSelecao('desafio')}
                >
                  Desafio
                </button>
              </div>
            </div>
            <div>
              <h3>Desempenho</h3>
              <Linha rotulo={stat1.rotulo}>{stat1.valor}</Linha>
              <Linha rotulo={stat2.rotulo}>{stat2.valor}</Linha>
            </div>
          </>
        )}

        {tela === 'quiz' && qAtual && (
          <div>
            <h3>Sessão</h3>
            <Linha rotulo="Modo">{modo === 'desafio' ? 'Desafio' : 'Estudo'}</Linha>
            <Linha rotulo="Dificuldade">
              <span
                className="qz-diff-dot"
                style={{ background: coresDificuldade[qAtual.dificuldade] }}
              />
              {rotuloDificuldade[qAtual.dificuldade] || qAtual.dificuldade}
            </Linha>
            {modo === 'desafio' ? (
              <Linha rotulo="Melhor sequência">{melhorProgresso}</Linha>
            ) : (
              <Linha rotulo="Peso">{pesosDificuldade[qAtual.dificuldade]}</Linha>
            )}
          </div>
        )}

        {tela === 'resultado' && resultado && (
          <div>
            <h3>Resultado</h3>
            <Linha rotulo="Acertos">
              {resultado.acertos}/{perguntasSorteadas.length}
            </Linha>
            <Linha rotulo="Melhor nota">
              {melhorNota !== null ? formatarNota(melhorNota) : traco}
            </Linha>
          </div>
        )}

        {tela === 'desafioConcluido' && (
          <div>
            <h3>Resultado</h3>
            <Linha rotulo="Tentativas">{tentativasDesafio}</Linha>
            <Linha rotulo="Recorde">{melhorProgresso}</Linha>
          </div>
        )}
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="qz-main">
        {tela === 'inicio' && (
          <>
            <h2>Teste seus conhecimentos</h2>
            <div className="qz-card">
              <p className="qz-score-l">{ehEstudo ? 'Modo estudo' : 'Modo desafio'}</p>
              <p className="qz-big">
                {ehEstudo ? qtdEstudo : totalBanco}
                <span>questões</span>
              </p>
              <p className="qz-desc">{descricao}</p>
            </div>
          </>
        )}

        {tela === 'quiz' && qAtual && (
          <>
            <h2>
              Questão {indice + 1} de {perguntasSorteadas.length}
            </h2>

            <div className="qz-progress">
              <div style={{ width: `${progresso}%` }} />
            </div>

            {modo === 'desafio' && mensagemDesafio && (
              <div className="qz-alert">
                <strong>{mensagemDesafio}</strong>
              </div>
            )}

            <h3 className="qz-question">{qAtual.questao}</h3>

            <div className="qz-options">
              {qAtual.alternativas.map((alt, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    if (modo === 'desafio') {
                      setRespostasUsuario([alt]);
                    } else {
                      selecionarResposta(alt);
                    }
                  }}
                  className={`qz-option ${respostaAtual === alt ? 'selected' : ''}`}
                >
                  {alt}
                </button>
              ))}
            </div>
          </>
        )}

        {tela === 'resultado' && resultado && (
          <>
            <h2>Seu desempenho</h2>

            <div className="qz-card">
              <p className="qz-score-l">Nota final ponderada</p>
              <p className="qz-big">
                {formatarNota(resultado.nota)}
                <span>de 10,0</span>
              </p>
            </div>

            <p className="qz-section">Gabarito do sorteio</p>

            <div className="qz-gab-list">
              {perguntasSorteadas.map((q, i) => {
                const acertou = respostasUsuario[i] === q.correta;

                return (
                  <div
                    key={i}
                    className="qz-gab-item"
                    style={{ borderLeftColor: acertou ? '#48bb78' : '#f56565' }}
                  >
                    <div className="qz-gab-top">
                      <span className="qz-gab-q">
                        {i + 1}. {q.questao}
                      </span>
                      <span className="qz-gab-peso">
                        Peso {pesosDificuldade[q.dificuldade]}
                      </span>
                    </div>
                    <div className="qz-gab-resp">
                      <span style={{ color: '#48bb78', fontWeight: 600 }}>
                        Correta: {q.correta}
                      </span>
                      <br />
                      <span
                        style={{
                          color: acertou ? '#48bb78' : '#f56565',
                          fontWeight: 600
                        }}
                      >
                        Sua resposta: {respostasUsuario[i] || 'Não respondida'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tela === 'desafioConcluido' && (
          <>
            <h2>Desafio concluído</h2>
            <div className="qz-card">
              <p className="qz-desc" style={{ marginTop: 0 }}>
                Você acertou as {totalBanco} questões na sequência, sem errar.
              </p>
            </div>
          </>
        )}
      </div>

      {/* --- AÇÕES (botões empilhados, como no PythonRunner) --- */}
      <div className="qz-acoes">
        <h3>Ações</h3>
        <div className="qz-btns">
          {tela === 'inicio' && (
            <button
              type="button"
              className="qz-btn qz-btn-primary"
              onClick={ehEstudo ? iniciarEstudo : iniciarDesafio}
            >
              {ehEstudo ? 'Começar estudo' : 'Começar desafio'}
            </button>
          )}

          {tela === 'quiz' && qAtual && (
            <>
              {modo === 'desafio' ? (
                <button
                  type="button"
                  className="qz-btn qz-btn-primary"
                  onClick={responderDesafio}
                  disabled={!respostaAtual}
                >
                  Responder
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="qz-btn qz-btn-primary"
                    onClick={proximaPergunta}
                    disabled={!respostaAtual}
                  >
                    {indice === perguntasSorteadas.length - 1 ? 'Ver resultados' : 'Próxima'}
                  </button>
                  {indice > 0 && (
                    <button
                      type="button"
                      className="qz-btn qz-btn-secondary"
                      onClick={voltarPergunta}
                    >
                      Voltar
                    </button>
                  )}
                </>
              )}
              <button
                type="button"
                className="qz-btn qz-btn-secondary"
                onClick={voltarAosModos}
              >
                Voltar aos modos
              </button>
            </>
          )}

          {tela === 'resultado' && resultado && (
            <>
              <button
                type="button"
                className="qz-btn qz-btn-primary"
                onClick={iniciarEstudo}
              >
                Sortear novo quiz
              </button>
              <button
                type="button"
                className="qz-btn qz-btn-secondary"
                onClick={voltarAosModos}
              >
                Voltar aos modos
              </button>
            </>
          )}

          {tela === 'desafioConcluido' && (
            <>
              <button
                type="button"
                className="qz-btn qz-btn-primary"
                onClick={iniciarDesafio}
              >
                Tentar novamente
              </button>
              <button
                type="button"
                className="qz-btn qz-btn-secondary"
                onClick={voltarAosModos}
              >
                Voltar aos modos
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}