/* ===== Lógica del agente simple ===== */
document.getElementById('btnGenerar').addEventListener('click', generarPropuesta);

function generarPropuesta() {
  const tipo = document.getElementById('tipoServicio').value;
  const origen = document.getElementById('origen').value;
  const destino = document.getElementById('destino').value;
  const horarios = document.getElementById('horarios').value;
  const pasajeros = parseInt(document.getElementById('pasajeros').value);
  const frecuencia = parseInt(document.getElementById('frecuencia').value);
  const restricciones = document.getElementById('restricciones').value;

  // Validación básica
  if (!tipo || !origen || !destino || !horarios || !pasajeros || !frecuencia) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  // Reglas básicas de planeación
  let unidadRecomendada = 'Van 15 pasajeros';
  if (pasajeros > 15 && pasajeros <= 30) unidadRecomendada = 'Camioneta 30 pasajeros';
  if (pasajeros > 30) unidadRecomendada = 'Autobús 50 pasajeros';

  let alertas = '';
  if (pasajeros > 50) alertas += '- Pasajeros exceden la capacidad estándar.\n';
  if (tipo === 'educativo' && horarios.includes('18:00')) alertas += '- Posible conflicto con horarios escolares.\n';
  if (restricciones.toLowerCase().includes('rígidos')) alertas += '- Horarios rígidos, cuidado en mezcla de servicios.\n';

  // Supuestos y reglas aplicadas
  const supuestos = `
- No se mezclan servicios con ventanas de tiempo incompatibles
- No exceder capacidad de la unidad
- Separar rutas por sentido y horario pico
- Limitar desvíos excesivos
`;

  // Generar texto de salida
  const salida = `
Tipo de servicio: ${tipo}
Origen: ${origen}
Destino: ${destino}
Horarios: ${horarios}
Número estimado de pasajeros: ${pasajeros}
Frecuencia semanal: ${frecuencia} días
Restricciones: ${restricciones || 'Ninguna'}

Número de rutas sugeridas: 1
Tipo de unidad recomendada: ${unidadRecomendada}

Supuestos utilizados:
${supuestos}

Alertas / riesgos operativos:
${alertas || 'Ninguna detectada'}
`;

  document.getElementById('resultados').textContent = salida;
}