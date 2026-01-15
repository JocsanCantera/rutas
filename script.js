// ===== VARIABLES DEL AGENTE =====
const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');

let respuestas = {};
let paso = 0;

// CONFIGURACION DE PREGUNTAS
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
function agregarMensaje(texto, clase){
  const div = document.createElement('div');
  div.classList.add('message', clase);
  div.textContent = texto;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function mostrarInput(){
  chatForm.innerHTML = ''; // limpiar inputs
  if(paso >= preguntas.length){
    generarPropuesta();
    return;
  }
  const pregunta = preguntas[paso];
  agregarMensaje(pregunta.texto,'agent');

  if(pregunta.tipo === 'select'){
    const select = document.createElement('select');
    select.id = 'userInput';
    pregunta.opciones.forEach(op => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op;
      select.appendChild(option);
    });
    chatForm.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.type = pregunta.tipo;
    input.id = 'userInput';
    input.placeholder = 'Tu respuesta...';
    chatForm.appendChild(input);
  }

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Enviar';
  chatForm.appendChild(button);
}

chatForm.addEventListener('submit', function(e){
  e.preventDefault();
  const input = document.getElementById('userInput');
  const valor = input.value.trim();
  if(!valor && preguntas[paso].tipo !== 'text') return;

  agregarMensaje(valor,'user');
  respuestas[preguntas[paso].id] = valor;
  paso++;
  setTimeout(mostrarInput, 300);
});

// ===== GENERAR PROPUESTA FINAL =====
function generarPropuesta(){
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
  agregarMensaje(resultado,'agent');
}

// ===== INICIAR CHAT =====
mostrarInput();
