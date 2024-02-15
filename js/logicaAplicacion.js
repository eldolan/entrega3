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
    const notaMinima = parseFloat(document.getElementById('notaMinima').value); // Asumiendo que estos campos existen
    const notaMaxima = parseFloat(document.getElementById('notaMaxima').value);
    const notaAprobacion = parseFloat(document.getElementById('notaAprobacion').value);

    const calendario = new CalendarioEvaluaciones(nombreRamo, fechaExamenFinal, notaMinima, notaMaxima, notaAprobacion);


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
function procesarNota(indexEvaluacion, valor, porcentaje) {
    const calendarios = cargarCalendarios();
    const ramoIndex = document.getElementById('seleccionRamo').value;
    const calendario = calendarios[ramoIndex];

    calendario.evaluaciones[indexEvaluacion].nota = new Nota(valor, porcentaje);


    guardarCalendario(calendario, ramoIndex);

    mostrarCalendario(calendario);

    document.getElementById('formularioNota').style.display = 'none';
}