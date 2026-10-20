// Dados do Dashboard de Eventos de Partículas

// Metadados de cada evento simulado
export const metadadosEventos = {
  proton_250gev: {
    titulo: 'Próton 250 GeV',
    videoSrc: '/videos/proton_250GeV_axis_2.mp4',
    contagemBase: { 'μ±': 2503, 'π±': 1004, 'e±': 82195, 'ν': 3281, 'γ': 170422 }
  },
  proton_38tev: {
    titulo: 'Próton 38 TeV',
    videoSrc: '/videos/proton_750GeV_clip1_4.mp4',
    contagemBase: { 'μ±': 75000, 'π±': 45000, 'e±': 18000000, 'ν': 250000, 'γ': 35000000 }
  }
};

export const listaEventos = Object.keys(metadadosEventos);

export const todasParticulas = ['μ±', 'π±', 'e±', 'ν', 'γ'];

// Densidade atmosférica x Altitude (dados fixos, mesmos do fig_altitude_densidade)
export const dadosAltitudeDensidade = {
  altitude: [
    0, 3618.090452, 7638.190955, 11658.291457, 15678.391960, 19698.492462, 23718.592965,
    27738.693467, 35778.894472, 39798.994975, 43819.095477, 47839.195980, 51859.296482,
    55879.396985, 59899.497487, 63919.597990, 67939.698492, 71959.798995, 75979.899497,
    80000.000000
  ],
  densidade: [
    1.225000, 0.800341, 0.498740, 0.310795, 0.193675, 0.120690, 0.075209, 0.046867,
    0.018200, 0.011341, 0.007068, 0.004404, 0.002745, 0.001710, 0.001066, 0.000664,
    0.000414, 0.000258, 0.000161, 0.000100
  ]
};

// Fator de Lorentz x Tempo de vida dilatado (dados fixos, mesmos do fig_lorentz_vida)
export const dadosLorentzVida = {
  gamma: [1, 91.8, 192.7, 293.6, 394.5, 495.4, 596.3, 697.2, 899.0, 1000],
  tempoVida: [2, 202, 424, 646, 868, 1090, 1312, 1534, 1978, 2200]
};
