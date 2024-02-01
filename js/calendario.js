class Evaluacion {
    constructor(fecha, numero, nota = null) {
        this.fecha = fecha;
        this.numero = numero;
        this.nota = nota;
    }
    agregarNota(valor, porcentaje) {
        this.nota = new Nota(valor, porcentaje);
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

    let calendariosActualizados = cargarCalendarios();
    document.getElementById('seleccionRamo').value = calendariosActualizados.length - 1;
    mostrarCalendarioSeleccionado();
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
    if (!calendariosEnJSON) return [];

    const calendarios = JSON.parse(calendariosEnJSON);
    calendarios.forEach(calendario => {
        calendario.evaluaciones = calendario.evaluaciones.map(evaluacionData =>
            new Evaluacion(evaluacionData.fecha, evaluacionData.numero, evaluacionData.nota)
        );
    });
    return calendarios;
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
        document.getElementById('notasContainer').innerHTML = '';
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


    let botonAgregarEvaluacion = document.getElementById('btnAgregarNuevaEvaluacion');
    if (!botonAgregarEvaluacion) {
        botonAgregarEvaluacion = document.createElement('button');
        botonAgregarEvaluacion.id = 'btnAgregarNuevaEvaluacion';
        botonAgregarEvaluacion.className = 'btn btn-primary my-3';
        botonAgregarEvaluacion.innerText = 'Añadir Nueva Fecha de Evaluación';
        botonAgregarEvaluacion.setAttribute('style', 'display: block; margin-left: auto; margin-right: auto;');
        botonAgregarEvaluacion.onclick = mostrarFormularioNuevaEvaluacion;
        calendarioContainer.appendChild(botonAgregarEvaluacion);
    }

    let formularioContainer = document.getElementById('formularioNuevaEvaluacionContainer');
    if (!formularioContainer) {
        formularioContainer = document.createElement('div');
        formularioContainer.id = 'formularioNuevaEvaluacionContainer';
        formularioContainer.setAttribute('style', 'display: none;');
        calendarioContainer.appendChild(formularioContainer);
    }

    const listaEvaluaciones = document.createElement('ul');
    listaEvaluaciones.className = 'list-group';

    calendario.evaluaciones.forEach((evaluacion, index) => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerText = `Evaluación ${index + 1}: ${evaluacion.fecha}`;

        if (evaluacion.nota) {
            item.innerText += ` - Nota: ${evaluacion.nota.valor}, Porcentaje: ${evaluacion.nota.porcentaje}%`;
        }

        const notaButton = document.createElement('button');
        notaButton.className = 'btn btn-sm btn-outline-secondary';
        notaButton.innerText = evaluacion.nota ? 'Editar Nota' : 'Agregar Nota';
        notaButton.onclick = function() {
            mostrarFormularioAgregarNota(index);
        };
        item.appendChild(notaButton);

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-sm btn-outline-primary';
        editButton.innerText = 'Editar';
        editButton.onclick = function() { mostrarFormularioEdicion(evaluacion.fecha, index); };
        item.appendChild(editButton);


        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-sm btn-outline-danger';
        deleteButton.innerText = 'Eliminar';
        deleteButton.onclick = function() {
            eliminarEvaluacion(calendario.nombreRamo, index);
        };


        item.appendChild(editButton);
        item.appendChild(deleteButton);

        listaEvaluaciones.appendChild(item);
    });

    calendarioContainer.appendChild(listaEvaluaciones);

    if (calendario.fechaExamenFinal) {
        const examenFinalItem = document.createElement('li');
        examenFinalItem.className = 'list-group-item list-group-item-warning';

        const contentDivExamenFinal = document.createElement('div');
        contentDivExamenFinal.className = 'd-flex justify-content-between align-items-center';

        const textSpanExamenFinal = document.createElement('span');
        textSpanExamenFinal.innerText = `Examen Final: ${calendario.fechaExamenFinal}`;

        const editButtonExamenFinal = document.createElement('button');
        editButtonExamenFinal.className = 'btn btn-sm btn-outline-primary';
        editButtonExamenFinal.innerText = 'Editar';
        editButtonExamenFinal.onclick = function() { mostrarFormularioEdicion(calendario.fechaExamenFinal, 'examenFinal'); };


        contentDivExamenFinal.appendChild(textSpanExamenFinal);
        contentDivExamenFinal.appendChild(editButtonExamenFinal);

        examenFinalItem.appendChild(contentDivExamenFinal);


        listaEvaluaciones.appendChild(examenFinalItem);
    }


    calendarioContainer.style.display = 'block';
}

function mostrarFormularioEdicion(fecha, index) {
    document.getElementById('fechaEdicion').value = fecha;
    document.getElementById('formularioEdicion').style.display = 'block';


    document.getElementById('formularioEdicion').dataset.evaluacionIndex = index;
}

function mostrarFormularioNuevaEvaluacion() {
    let formularioContainer = document.getElementById('formularioNuevaEvaluacionContainer');

    if (!formularioContainer) {
        formularioContainer = document.createElement('div');
        formularioContainer.id = 'formularioNuevaEvaluacionContainer';
        const btnAgregar = document.getElementById('btnAgregarNuevaEvaluacion');
        btnAgregar.parentNode.insertBefore(formularioContainer, btnAgregar.nextSibling);
    }

    if (formularioContainer.style.display === 'none' || formularioContainer.style.display === '') {
        formularioContainer.style.display = 'block';
        if (!formularioContainer.hasChildNodes()) {
            formularioContainer.innerHTML = `
                <div class="mb-3">
                    <label for="nuevaFechaEvaluacion" class="form-label">Fecha de la nueva evaluación</label>
                    <input type="date" class="form-control" id="nuevaFechaEvaluacion" required>
                </div>
                <div class="mb-3">
                    <label for="numeroEvaluacion" class="form-label">Número de la evaluación</label>
                    <input type="number" class="form-control" id="numeroEvaluacion" min="1" required>
                </div>
                <button class="btn btn-success mb-3" onclick="agregarNuevaEvaluacion()">Agregar Fecha al Calendario</button>
            `;
        }
    } else {
        formularioContainer.style.display = 'none';
    }
}

function agregarNuevaEvaluacion() {
    const fecha = document.getElementById('nuevaFechaEvaluacion').value;
    const numeroEvaluacion = parseInt(document.getElementById('numeroEvaluacion').value, 10);
    const calendarios = cargarCalendarios();
    const ramoIndex = parseInt(document.getElementById('seleccionRamo').value, 10);
    const calendario = calendarios[ramoIndex];

    const evaluacionExiste = calendario.evaluaciones.some(evaluacion => evaluacion.numero === numeroEvaluacion);
    if (evaluacionExiste) {
        alert("Ya existe una evaluación con ese número. Por favor elige un número diferente.");
        return;
    }

    const nuevaEvaluacion = new Evaluacion(fecha, numeroEvaluacion);
    calendario.evaluaciones.push(nuevaEvaluacion);

    calendario.evaluaciones.sort((a, b) => a.numero - b.numero);

    guardarCalendario(calendario, ramoIndex);
    mostrarCalendario(calendario);
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

function eliminarEvaluacion(nombreRamo, index) {
    let calendarios = cargarCalendarios();
    let calendarioIndex = calendarios.findIndex(calendario => calendario.nombreRamo === nombreRamo);
    if (calendarioIndex !== -1) {
        calendarios[calendarioIndex].evaluaciones.splice(index, 1);
        guardarCalendario(calendarios[calendarioIndex], calendarioIndex);
        mostrarCalendario(calendarios[calendarioIndex]);
    } else {
        console.error('Calendario no encontrado');
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

function procesarNota() {
    const formularioNota = document.getElementById('formularioNota');
    const indexEvaluacion = parseInt(formularioNota.dataset.indexEvaluacion, 10);
    const valor = parseFloat(document.getElementById('valorNota').value);
    const porcentaje = parseFloat(document.getElementById('porcentajeNota').value);

    const calendarios = cargarCalendarios();
    const ramoIndex = document.getElementById('seleccionRamo').value;
    const calendario = calendarios[ramoIndex];

    calendario.evaluaciones[indexEvaluacion].nota = new Nota(valor, porcentaje);


    guardarCalendario(calendario, ramoIndex);

    mostrarCalendario(calendario);

    document.getElementById('formularioNota').style.display = 'none';
}

function mostrarFormularioAgregarNota(indexEvaluacion) {
    let formularioNota = document.getElementById('formularioNota');
    if (!formularioNota) {
        formularioNota = document.createElement('form');
        formularioNota.id = 'formularioNota';
        formularioNota.innerHTML = `
            <div class="container">
                <div class="form-group">
                    <label>Valor de la Nota:</label>
                    <input type="number" id="valorNota" required>
                </div>
                <div class="form-group">
                    <label>Porcentaje de la Nota:</label>
                    <input type="number" id="porcentajeNota" required>
                </div>
                <button type="submit" class="btn btn-default">Guardar Nota</button>
            </div>
        `;



        document.body.appendChild(formularioNota);

        formularioNota.addEventListener('submit', function(event) {
            event.preventDefault();
            procesarNota(indexEvaluacion);
        });
    }
    formularioNota.dataset.indexEvaluacion = indexEvaluacion;

    const calendarios = cargarCalendarios();
    const ramoIndex = parseInt(document.getElementById('seleccionRamo').value, 10);
    console.log('ramoIndex:', ramoIndex);
    console.log('calendarios:', calendarios);

    if (typeof ramoIndex !== "number" || ramoIndex < 0 || ramoIndex >= calendarios.length) {
        console.error("Índice de ramo no válido:", ramoIndex);
        return;
    }

    const evaluacionSeleccionada = calendarios[ramoIndex].evaluaciones[indexEvaluacion];
    if (evaluacionSeleccionada && evaluacionSeleccionada.nota) {
        document.getElementById('valorNota').value = evaluacionSeleccionada.nota.valor;
        document.getElementById('porcentajeNota').value = evaluacionSeleccionada.nota.porcentaje;
    }

    formularioNota.style.display = 'block';
}

/*function calcularNotaParaExamenFinal(ramoIndex) {
    const calendarios = cargarCalendarios();
    const calendario = calendarios[ramoIndex];

    // Asegúrate de que las notas mínima, máxima y de aprobación estén disponibles aquí.
    // Pueden estar almacenadas en el localStorage o podrías pedir al usuario que las ingrese.

    const notas = calendario.evaluaciones
        .filter(evaluacion => evaluacion.nota !== null)
        .map(evaluacion => evaluacion.nota.valor);
    const porcentajes = calendario.evaluaciones
        .filter(evaluacion => evaluacion.nota !== null)
        .map(evaluacion => evaluacion.nota.porcentaje);

    // Estos valores deben ser obtenidos de la interfaz de usuario o configuración.
    const notaMinima = ...; // Obtén este valor
    const notaMaxima = ...; // Obtén este valor
    const notaAprobacion = ...; // Obtén este valor

    // Instancia de RegistroDeNotas.
    const registro = new RegistroDeNotas(notaMinima, notaMaxima, notaAprobacion);

    // Agregar las notas al registro.
    notas.forEach((nota, index) => {
        registro.agregarNota(nota, porcentajes[index]);
    });

    // Realizar cálculos.
    const notaNecesariaExamenFinal = registro.calcularNotaExamen();
    const esPosibleAprobar = registro.determinarPosibilidad();

    // Mostrar el resultado.
    mostrarResultadoExamenFinal(notaNecesariaExamenFinal, esPosibleAprobar);
}

function mostrarResultadoExamenFinal(notaNecesariaExamenFinal, esPosibleAprobar) {
    let mensaje;
    if (esPosibleAprobar) {
        mensaje = `Necesitas al menos ${notaNecesariaExamenFinal.toFixed(2)} en el examen final para aprobar.`;
    } else {
        mensaje = `Incluso con una nota perfecta en el examen final, no puedes alcanzar la nota de aprobación.`;
    }
    // Asegúrate de tener un elemento en tu HTML para mostrar este mensaje.
    document.getElementById('resultadoExamenFinal').textContent = mensaje;
}*/

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