export const pacotesFatorLorentzMuon = ['numpy', 'matplotlib', 'imageio'];

export const codigoFatorLorentzMuon = String.raw`import numpy as np
import matplotlib.pyplot as plt
import imageio.v2 as imageio  
import os


"""Este script calcula e faz o plot do fator de Lorentz (\gamma) para diferentes
velocidades de um múon em decaimento, variando de 0 a 0,99c.
"""
def lorentz_factor(velocity, c=3e8):
   """Calculando o fator de Lorentz para uma dada velocidade."""
   return 1 / np.sqrt(1 - (velocity / c) ** 2)


# Gerando valores de velocidade de 0 a 0.99c
velocities = np.linspace(0, 0.99 * 3e8, 100)


# Calculando os fatores de Lorentz
gamma_values = lorentz_factor(velocities)


# Create a directory to store the frames
if not os.path.exists("frames"):
   os.makedirs("frames")


# Generate frames for the GIF
for i in range(1, len(velocities) + 1):
   plt.figure(figsize=(8, 5))
   plt.plot(velocities[:i] / 3e8, gamma_values[:i], label='Fator de Lorentz', color='r')
   plt.xlabel('Velocidade (fração de c)')
   plt.ylabel('Fator de Lorentz (γ)')
   plt.title('Fator de Lorentz vs. Velocidade')
   plt.legend()
   plt.grid()


   # Save the frame
   filename = f"frames/frame_{i:03d}.png"  # Pad with leading zeros for proper sorting
   plt.savefig(filename)
   plt.close()


# Create the GIF using imageio
frames = []
for i in range(1, len(velocities) + 1):
   filename = f"frames/frame_{i:03d}.png"
   frames.append(imageio.imread(filename))
imageio.mimsave("lorentz_factor.gif", frames, fps=10)  # Adjust fps as needed


print("GIF created successfully!")
`;
