class Evento {
    constructor(nombre, fecha, color, esExamenFinal = false) {
        this.nombre = nombre;
        this.fecha = fecha; // Formato: 'YYYY-MM-DD'
        this.color = color;
        this.esExamenFinal = esExamenFinal;
        this.registroNotas = new RegistroDeNotas(0, 10, 5);
    }
}


let eventos = [];

document.getElementById('formularioEvento').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombreEvento').value;
    const fecha = document.getElementById('fechaEvento').value;
    const color = document.getElementById('colorEvento').value;
    const esExamenFinal = document.getElementById('checkExamenFinal').checked;

    const evento = new Evento(nombre, fecha, color, esExamenFinal);
    eventos.push(evento);

    actualizarCalendarioConEvento(evento);
    guardarEventos();
});

function actualizarMenuPruebas() {
    let menuPruebas = document.getElementById('pruebaSeleccionada');
    menuPruebas.innerHTML = '';

    eventos.forEach(evento => {
        let option = document.createElement('option');
        option.value = evento.nombre + " - " + evento.fecha;
        option.textContent = `${evento.nombre} (${formatoFechaBonito(evento.fecha)})`;
        menuPruebas.appendChild(option);
    });
}

function formatoFechaBonito(fecha) {
    let fechaObj = new Date(fecha);
    let dia = fechaObj.getDate().toString().padStart(2, '0');
    let mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    let anio = fechaObj.getFullYear();
    return `${dia}-${mes}-${anio}`;
}

function actualizarCalendarioConEvento(evento) {
    const fechaEvento = new Date(evento.fecha + 'T00:00:00');

    const mesEvento = fechaEvento.getMonth();
    const contenedorMes = document.getElementsByClassName('mes')[mesEvento];

    const elementoEvento = document.createElement('div');
    elementoEvento.textContent = evento.nombre + ' - ' + fechaEvento.getDate();
    elementoEvento.style.backgroundColor = evento.color;
    elementoEvento.classList.add('clase');

    contenedorMes.appendChild(elementoEvento);
    actualizarMenuPruebas();
}


// Función para agregar un evento al calendario
function agregarEvento(nombre, fecha, color) {
    const nuevoEvento = new Evento(nombre, fecha, color);
    eventos.push(nuevoEvento);
    actualizarCalendarioConEvento(nuevoEvento);
    guardarEventos();
    actualizarMenuPruebas();
}

function guardarEventos() {
    localStorage.setItem('eventos', JSON.stringify(eventos, function(key, value) {
        if (key === 'registroNotas') {
            return {
                minima: value.minima,
                maxima: value.maxima,
                aprobacion: value.aprobacion,
                notas: value.notas
            };
        }
        return value;
    }));
}


// Función para guardar eventos en localStorage
function cargarEventos() {
    const eventosAlmacenados = localStorage.getItem('eventos');
    if (eventosAlmacenados) {
        let eventosData = JSON.parse(eventosAlmacenados);
        eventos = eventosData.map(eventoData => {
            let evento = new Evento(eventoData.nombre, eventoData.fecha, eventoData.color, eventoData.esExamenFinal);
            evento.registroNotas = new RegistroDeNotas(eventoData.registroNotas.minima, eventoData.registroNotas.maxima, eventoData.registroNotas.aprobacion);
            eventoData.registroNotas.notas.forEach(nota => {
                evento.registroNotas.agregarNota(nota.valor, nota.porcentaje);
            });
            return evento;
        });
        eventos.forEach(evento => actualizarCalendarioConEvento(evento));
    }
}


document.addEventListener('DOMContentLoaded', cargarEventos);



function main() {
}

main();
