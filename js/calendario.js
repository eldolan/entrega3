class Evaluacion {
    constructor(fecha) {
        this.fecha = fecha;
    }
}

class CalendarioEvaluaciones {
    constructor(nombreRamo, fechaExamenFinal) {
        this.nombreRamo = nombreRamo;
        this.fechaExamenFinal = fechaExamenFinal;
        this.evaluaciones = [];
    }

    agregarEvaluacion(fecha) {
        this.evaluaciones.push(new Evaluacion(fecha));
    }
}

function configurarCalendario() {
    const nombreRamo = document.getElementById('nombreRamo').value;
    const calendarios = cargarCalendarios();


    const ramoExiste = calendarios.some(calendario => calendario.nombreRamo.toLowerCase() === nombreRamo.toLowerCase());
    if (ramoExiste) {
        alert("Ya existe un ramo con ese nombre. Por favor elige un nombre diferente.");
        return;
    }
    const cantidadEvaluaciones = parseInt(document.getElementById('cantidadEvaluaciones').value, 10);
    const fechasEvaluacionesContainer = document.getElementById('fechasEvaluacionesContainer');
    fechasEvaluacionesContainer.innerHTML = '';

    for (let i = 0; i < cantidadEvaluaciones; i++) {
        const fechaFormGroup = document.createElement('div');
        fechaFormGroup.className = 'row g-3 mb-2';

        const fechaInputCol = document.createElement('div');
        fechaInputCol.className = 'col-md-6';

        const fechaInputLabel = document.createElement('label');
        fechaInputLabel.innerText = `Fecha de la evaluación ${i + 1}`;
        fechaInputLabel.htmlFor = `fechaEvaluacion${i}`;
        fechaInputLabel.className = 'form-label';

        const fechaInput = document.createElement('input');
        fechaInput.type = 'date';
        fechaInput.className = 'form-control';
        fechaInput.id = `fechaEvaluacion${i}`;
        fechaInput.required = true;

        fechaInputCol.appendChild(fechaInputLabel);
        fechaInputCol.appendChild(fechaInput);
        fechaFormGroup.appendChild(fechaInputCol);
        fechasEvaluacionesContainer.appendChild(fechaFormGroup);
    }

    fechasEvaluacionesContainer.appendChild(crearBotonAgregarFechas());
    fechasEvaluacionesContainer.style.display = 'block';
}

function agregarFechasAlCalendario() {
    const nombreRamo = document.getElementById('nombreRamo').value;
    const cantidadEvaluaciones = parseInt(document.getElementById('cantidadEvaluaciones').value, 10);
    const fechaExamenFinal = document.getElementById('fechaExamenFinal').value;

    const calendario = new CalendarioEvaluaciones(nombreRamo, fechaExamenFinal);

    for (let i = 0; i < cantidadEvaluaciones; i++) {
        const fecha = document.getElementById(`fechaEvaluacion${i}`).value;
        if (fecha) {
            calendario.agregarEvaluacion(fecha);
        }
    }

    guardarCalendario(calendario);
    actualizarMenuCalendarios();
    mostrarCalendario(calendario);
}

function guardarCalendario(calendarioActualizado, ramoIndex) {
    let calendarios = cargarCalendarios();
    if (ramoIndex !== undefined && ramoIndex !== null) {
        calendarios[ramoIndex] = calendarioActualizado;
    } else {
        calendarios.push(calendarioActualizado);
    }
    localStorage.setItem('calendarios', JSON.stringify(calendarios));
}


function cargarCalendarios() {
    const calendariosEnJSON = localStorage.getItem('calendarios');
    return calendariosEnJSON ? JSON.parse(calendariosEnJSON) : [];
}

function actualizarMenuCalendarios() {
    const calendarios = cargarCalendarios();
    const menuRamo = document.getElementById('seleccionRamo');
    menuRamo.innerHTML = '<option value="">Selecciona un ramo...</option>';

    calendarios.forEach((calendario, index) => {
        const opcion = document.createElement('option');
        opcion.value = index;
        opcion.textContent = calendario.nombreRamo;
        menuRamo.appendChild(opcion);
    });
}

function mostrarCalendarioSeleccionado() {
    const index = document.getElementById('seleccionRamo').value;
    const calendarios = cargarCalendarios();


    if (index !== '') {
        const calendarioSeleccionado = calendarios[index];
        mostrarCalendario(calendarioSeleccionado);
    } else {
        document.getElementById('fechasEvaluacionesContainer').innerHTML = '';
    }

    const botonEliminar = document.getElementById('eliminarRamo');

    if (index !== '') {
        const calendarioSeleccionado = calendarios[index];
        mostrarCalendario(calendarioSeleccionado);
        botonEliminar.style.display = 'block';
    } else {
        document.getElementById('fechasEvaluacionesContainer').innerHTML = '';
        botonEliminar.style.display = 'none';
    }
}


function mostrarCalendario(calendario) {
    const calendarioContainer = document.getElementById('fechasEvaluacionesContainer');
    calendarioContainer.innerHTML = '';

    const titulo = document.createElement('h3');
    titulo.innerText = `Calendario de Evaluaciones para ${calendario.nombreRamo}`;
    calendarioContainer.appendChild(titulo);

    const listaEvaluaciones = document.createElement('ul');
    listaEvaluaciones.className = 'list-group';

    calendario.evaluaciones.forEach((evaluacion, index) => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerText = `Evaluación ${index + 1}: ${evaluacion.fecha}`;


        const editButton = document.createElement('button');
        editButton.className = 'btn btn-sm btn-outline-primary';
        editButton.innerText = 'Editar';
        editButton.onclick = function() { mostrarFormularioEdicion(evaluacion.fecha, index); };
        item.appendChild(editButton);


        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-outline-danger';
        deleteButton.innerText = 'Eliminar';
        deleteButton.onclick = function() { eliminarEvaluacion(index); };


        item.appendChild(editButton);
        item.appendChild(deleteButton);

        listaEvaluaciones.appendChild(item);
    });

    calendarioContainer.appendChild(listaEvaluaciones);

    if (calendario.fechaExamenFinal) {
        const examenFinalItem = document.createElement('li');
        examenFinalItem.className = 'list-group-item list-group-item-warning';
        examenFinalItem.innerHTML = `Examen Final: ${calendario.fechaExamenFinal}`;

        const editButtonExamenFinal = document.createElement('button');
        editButtonExamenFinal.className = 'btn btn-sm btn-outline-primary';
        editButtonExamenFinal.innerText = 'Editar';
        editButtonExamenFinal.onclick = function() { mostrarFormularioEdicion(calendario.fechaExamenFinal, 'examenFinal'); };

        examenFinalItem.appendChild(editButtonExamenFinal);
        listaEvaluaciones.appendChild(examenFinalItem);
    }

    calendarioContainer.style.display = 'block';
}

function mostrarFormularioEdicion(fecha, index) {
    document.getElementById('fechaEdicion').value = fecha;
    document.getElementById('formularioEdicion').style.display = 'block';


    document.getElementById('formularioEdicion').dataset.evaluacionIndex = index;
}


function guardarFechaEditada() {
    const calendarios = cargarCalendarios();
    const ramoIndex = document.getElementById('seleccionRamo').value;
    const calendario = calendarios[ramoIndex];
    const index = document.getElementById('formularioEdicion').dataset.evaluacionIndex;
    const nuevaFecha = document.getElementById('fechaEdicion').value;


    if (index === 'examenFinal') {
        calendario.fechaExamenFinal = nuevaFecha;
    } else {
        calendario.evaluaciones[index].fecha = nuevaFecha;
    }

    guardarCalendario(calendario, ramoIndex);
    mostrarCalendario(calendario);
    document.getElementById('formularioEdicion').style.display = 'none';
}

function eliminarEvaluacion(index) {
    console.log('Eliminar evaluación con índice:', index);
    let calendarios = cargarCalendarios();
    let ramoIndex = document.getElementById('seleccionRamo').value;
    if (ramoIndex !== '') {
        let calendario = calendarios[ramoIndex];
        calendario.evaluaciones.splice(index, 1);
        guardarCalendario(calendario);
        mostrarCalendario(calendario);
    }
}


function eliminarRamoSeleccionado() {
    const index = document.getElementById('seleccionRamo').value;
    let calendarios = cargarCalendarios();

    if (index !== '') {
        calendarios.splice(index, 1);

        localStorage.setItem('calendarios', JSON.stringify(calendarios));

        actualizarMenuCalendarios();
        document.getElementById('fechasEvaluacionesContainer').innerHTML = '';
        document.getElementById('eliminarRamo').style.display = 'none';
    }
}


function crearBotonAgregarFechas() {
    const botonAgregarFechas = document.createElement('button');
    botonAgregarFechas.type = 'button';
    botonAgregarFechas.className = 'btn btn-success';
    botonAgregarFechas.innerText = 'Agregar Fechas al Calendario';
    botonAgregarFechas.onclick = agregarFechasAlCalendario;
    return botonAgregarFechas;
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarMenuCalendarios();
    const seleccionRamo = document.getElementById('seleccionRamo');
    seleccionRamo.addEventListener('change', mostrarCalendarioSeleccionado);
    document.getElementById('eliminarRamo').addEventListener('click', eliminarRamoSeleccionado);
});


document.getElementById('configuracionCalendario').addEventListener('submit', function(event) {
    event.preventDefault();
    configurarCalendario();
});