// ===== VARIABLES =====
const wizardCards = document.getElementById('wizardCards');
const resumenFinal = document.getElementById('resumenFinal');
const progress = document.getElementById('progress');

let respuestas = {};
let paso = 0;

// ===== CONFIGURACIÓN DE PREGUNTAS =====
const preguntas = [
  {id:'tipoServicio', texto:'Selecciona el tipo de servicio:', tipo:'select', opciones:['corporativo','industrial','educativo','turístico']},
  {id:'origen', texto:'Indica el origen de la ruta:', tipo:'text'},
  {id:'destino', texto:'Indica el destino de la ruta:', tipo:'text'},
  {id:'horarioEntrada', texto:'Horario de entrada (HH:MM):', tipo:'time'},
  {id:'horarioSalida', texto:'Horario de salida (HH:MM):', tipo:'time'},
  {id:'pasajeros', texto:'Número estimado de pasajeros:', tipo:'number'},
  {id:'frecuencia', texto:'Frecuencia del servicio:', tipo:'select', opciones:['diaria','semanal','mensual']},
  {id:'restricciones', texto:'Especifica restricciones relevantes (opcional):', tipo:'text'}
];

// ===== FUNCIONES =====

// Crear tarjeta del wizard
function crearCard(pregunta){
  const card = document.createElement('div');
  card.classList.add('card');

  const agentText = document.createElement('div');
  agentText.classList.add('agent-text');
  agentText.textContent = pregunta.texto;
  card.appendChild(agentText);

  let inputElement;
  if(pregunta.tipo === 'select'){
    inputElement = document.createElement('select');
    pregunta.opciones.forEach(op => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op;
      inputElement.appendChild(option);
    });
  } else {
    inputElement = document.createElement('input');
    inputElement.type = pregunta.tipo;
    inputElement.placeholder = 'Tu respuesta...';
  }
  inputElement.id = 'input-' + pregunta.id;
  card.appendChild(inputElement);

  const button = document.createElement('button');
  button.textContent = 'Siguiente';
  button.addEventListener('click', ()=>procesarRespuesta(pregunta.id, inputElement.value, card));
  card.appendChild(button);

  wizardCards.appendChild(card);

  setTimeout(()=>card.classList.add('active'),100);
}

// Procesa respuesta y avanza
function procesarRespuesta(id, valor, card){
  if(!valor && preguntas.find(p=>p.id===id).tipo!=='text') return alert('Selecciona una opción válida');
  respuestas[id] = valor;
  card.classList.remove('active');
  paso++;
  progress.style.width = ((paso/preguntas.length)*100)+'%';
  if(paso < preguntas.length){
    crearCard(preguntas[paso]);
  } else {
    mostrarResumen();
  }
}

// Mostrar resumen editable
function mostrarResumen(){
  wizardCards.style.display = 'none';
  resumenFinal.style.display = 'block';
  progress.style.width = '100%';

  let html = '<h2>Resumen de tus respuestas</h2>';
  preguntas.forEach(p=>{
    html += `<div style="margin-bottom:12px;"><label>${p.texto}</label><input type="text" value="${respuestas[p.id]}" id="res-${p.id}" style="width:100%;padding:8px;border-radius:6px;margin-top:3px;"/></div>`;
  });
  html += '<button id="btnGenerar">Generar Propuesta de Rutas</button>';
  resumenFinal.innerHTML = html;

  document.getElementById('btnGenerar').addEventListener('click', generarPropuesta);
}

// Genera propuesta final con alertas
function generarPropuesta(){
  preguntas.forEach(p=>{
    respuestas[p.id] = document.getElementById('res-'+p.id).value;
  });

  let alertas = [];
  let rutasSugeridas = 1;
  let tipoUnidad = "Van 15 pasajeros";
  const pasajeros = parseInt(respuestas.pasajeros);

  if(pasajeros > 15){ rutasSugeridas = Math.ceil(pasajeros/15); tipoUnidad="Autobús 40 pasajeros"; }
  if(respuestas.tipoServicio==="educativo" && respuestas.horarioEntrada>"10:00"){ alertas.push("Horario educativo fuera de ventana típica."); }
  if(respuestas.restricciones && respuestas.restricciones.toLowerCase().includes("horarios rígidos")){ alertas.push("Revisar restricciones de horarios rígidos."); }

  let resultado = `
--- Propuesta Inicial ---
Número de rutas sugeridas: ${rutasSugeridas}
Tipo de unidad recomendada: ${tipoUnidad}

--- Supuestos utilizados ---
- Ruta directa sin desviaciones significativas
- No se mezclan servicios con ventanas incompatibles
- Capacidad de unidades limitada

--- Alertas / Riesgos ---
${alertas.length>0?alertas.join("\n"):"Ninguna alerta detectada"}
  `;

  // Mostrar alertas como notificación si existen
  resumenFinal.innerHTML = `<h2>Resultado Final</h2>`;
  if(alertas.length>0){
    alertas.forEach(a=>{
      const div = document.createElement('div');
      div.className = 'alert';
      div.textContent = a;
      resumenFinal.appendChild(div);
    });
  }
  const pre = document.createElement('pre');
  pre.textContent = resultado;
  resumenFinal.appendChild(pre);
}

// ===== INICIAR WIZARD =====
crearCard(preguntas[paso]);
