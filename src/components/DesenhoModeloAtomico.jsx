import React from 'react';
const COR = {
  positivo: 'var(--cor-ensino-amarelo, #E7A93B)',
  eletron: 'var(--ifm-color-primary, #3157A4)',
  luz: 'var(--cor-ensino-verde, #238A83)',
  neutro: 'var(--ifm-color-emphasis-500, #8a8a8a)',
  traco: 'var(--ifm-color-emphasis-400, #b5b5b5)',
};

function pontosDaNuvem(qtd) {
  const pontos = [];
  let seed = 7;
  const proximo = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < qtd; i++) {
    const r = 44 * Math.pow(proximo(), 1.6);
    const ang = 2 * Math.PI * proximo();
    pontos.push([
      Math.round((60 + r * Math.cos(ang)) * 10) / 10,
      Math.round((60 + r * Math.sin(ang)) * 10) / 10,
    ]);
  }
  return pontos;
}
const NUVEM = pontosDaNuvem(70);

const desenhos = {
  // Esfera maciça, sem estrutura interna
  dalton: (
    <>
      <circle cx="60" cy="60" r="44" style={{ fill: COR.neutro }} />
      <circle cx="46" cy="45" r="11" style={{ fill: '#ffffff', opacity: 0.25 }} />
    </>
  ),

  // Esfera positiva com elétrons espalhados dentro
  thomson: (
    <>
      <circle
        cx="60"
        cy="60"
        r="46"
        style={{ fill: COR.positivo, fillOpacity: 0.35, stroke: COR.positivo, strokeWidth: 2 }}
      />
      {[
        [45, 42],
        [72, 40],
        [84, 60],
        [66, 64],
        [40, 66],
        [56, 84],
        [78, 80],
        [56, 54],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" style={{ fill: COR.eletron }} />
      ))}
    </>
  ),

  // Núcleo pequeno e elétrons em órbita
  rutherford: (
    <>
      <circle cx="60" cy="60" r="42" style={{ fill: 'none', stroke: COR.traco, strokeDasharray: '2 3' }} />
      <circle cx="60" cy="60" r="26" style={{ fill: 'none', stroke: COR.traco, strokeDasharray: '2 3' }} />
      <circle cx="60" cy="60" r="5" style={{ fill: COR.positivo }} />
      <circle cx="96.4" cy="39" r="4.5" style={{ fill: COR.eletron }} />
      <circle cx="37.5" cy="73" r="4.5" style={{ fill: COR.eletron }} />
    </>
  ),

  // Órbitas permitidas e um salto do elétron, com emissão de luz
  bohr: (
    <>
      <circle cx="60" cy="60" r="14" style={{ fill: 'none', stroke: COR.traco, strokeWidth: 1.5 }} />
      <circle cx="60" cy="60" r="26" style={{ fill: 'none', stroke: COR.traco, strokeWidth: 1.5 }} />
      <circle cx="60" cy="60" r="38" style={{ fill: 'none', stroke: COR.traco, strokeWidth: 1.5 }} />
      <circle cx="60" cy="60" r="6" style={{ fill: COR.positivo }} />
      {/* posição de onde o elétron saltou (contorno) */}
      <circle
        cx="86.9"
        cy="33.1"
        r="3.5"
        style={{ fill: 'none', stroke: COR.eletron, strokeDasharray: '2 2' }}
      />
      {/* seta do salto */}
      <line x1="85" y1="35" x2="80.6" y2="39.4" style={{ stroke: COR.eletron, strokeWidth: 1.5 }} />
      <polygon points="78,42 84,40 80,36" style={{ fill: COR.eletron }} />
      {/* elétron na órbita menor */}
      <circle cx="78.4" cy="41.6" r="4.5" style={{ fill: COR.eletron }} />
      {/* luz emitida */}
      <polyline
        points="90,30 94,23 96,29 101,21 103,27 108,18"
        style={{ fill: 'none', stroke: COR.luz, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' }}
      />
    </>
  ),

  // Nuvem de probabilidade
  quantico: (
    <>
      <defs>
        <radialGradient id="ma-nuvem" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: COR.eletron, stopOpacity: 0.7 }} />
          <stop offset="55%" style={{ stopColor: COR.eletron, stopOpacity: 0.28 }} />
          <stop offset="100%" style={{ stopColor: COR.eletron, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#ma-nuvem)" />
      {NUVEM.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" style={{ fill: COR.eletron, opacity: 0.7 }} />
      ))}
      <circle cx="60" cy="60" r="4" style={{ fill: COR.positivo }} />
    </>
  ),
};

export default function DesenhoModeloAtomico({ tipo, legenda }) {
  const desenho = desenhos[tipo];
  if (!desenho) return null;

  return (
    <figure style={{ margin: 0, textAlign: 'center' }}>
      <svg
        viewBox="0 0 120 120"
        width="150"
        height="150"
        role="img"
        aria-label={legenda || `Modelo atômico: ${tipo}`}
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        {desenho}
      </svg>
      {legenda && (
        <figcaption style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{legenda}</figcaption>
      )}
    </figure>
  );
}
