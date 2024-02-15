// Este archivo maneja todas las interacciones directas con el DOM para el sistema de gestión de calendario de evaluaciones.

// Actualiza el menú desplegable con los ramos disponibles.
function actualizarMenuCalendarios() {
    const calendarios = cargarCalendarios(); // Asume que esta función devuelve los calendarios almacenados.
    const menuRamo = document.getElementById('seleccionRamo');
    menuRamo.innerHTML = '<option value="">Selecciona un ramo...</option>';

    calendarios.forEach((calendario, index) => {
        const opcion = document.createElement('option');
        opcion.value = index;
        opcion.textContent = calendario.nombreRamo;
        menuRamo.appendChild(opcion);
    });
}

// Muestra el calendario de evaluaciones seleccionado.
function mostrarCalendarioSeleccionado() {
    const index = document.getElementById('seleccionRamo').value;
    const calendarios = cargarCalendarios();
    const botonEliminar = document.getElementById('eliminarRamo');
    const infoRamoAlert = document.getElementById('infoRamoAlert');

    document.getElementById('fechasEvaluacionesContainer').innerHTML = '';
    botonEliminar.style.display = 'none';
    infoRamoAlert.style.display = 'none';

    if (index !== '') {
        const calendarioSeleccionado = calendarios[index];
        mostrarCalendario(calendarioSeleccionado);
        botonEliminar.style.display = 'block';
        infoRamoAlert.style.display = 'block';
    }
}

// Muestra las evaluaciones de un calendario específico, incluyendo botones para editar, agregar notas, y eliminar.
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

    const infoRamoAlert = document.getElementById('infoRamoAlert');
    infoRamoAlert.innerHTML = `
        <div class="alert alert-success" role="alert">
            <strong>Nota Mínima: ${calendario.notaMinima}</strong>, 
            <strong>Nota Máxima: ${calendario.notaMaxima}</strong>, 
            <strong>Nota de Aprobación: ${calendario.notaAprobacion}</strong>
            <div class="text-end">
                <button class="btn btn-outline-success btn-sm" id="editarNotasRamo">Editar Notas</button>
            </div>
        </div>
    `;
    infoRamoAlert.style.display = 'block';

    function mostrarFormularioEditarNotas(calendario) {
        document.getElementById('editarNotaMinima').value = calendario.notaMinima;
        document.getElementById('editarNotaMaxima').value = calendario.notaMaxima;
        document.getElementById('editarNotaAprobacion').value = calendario.notaAprobacion;

        var modal = new bootstrap.Modal(document.getElementById('modalEditarNotas'));
        modal.show();
    }

    setTimeout(() => {
        const botonEditar = document.getElementById('editarNotasRamo');
        botonEditar.onclick = function() {
            mostrarFormularioEditarNotas(calendario);
        };
    }, 0);


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

function crearBotonAgregarFechas() {
    const botonAgregarFechas = document.createElement('button');
    botonAgregarFechas.type = 'button';
    botonAgregarFechas.className = 'btn btn-success';
    botonAgregarFechas.innerText = 'Agregar Fechas al Calendario';
    botonAgregarFechas.onclick = agregarFechasAlCalendario;
    return botonAgregarFechas;
}

function mostrarFormularioAgregarNota(indexEvaluacion) {
    const modalElement = document.getElementById('modalAgregarNota');
    const valorNotaInput = document.getElementById('valorNota');
    const porcentajeNotaInput = document.getElementById('porcentajeNota');

    // Lógica para cargar y establecer los valores de la evaluación seleccionada, si existen
    const calendarios = cargarCalendarios();
    const ramoIndex = parseInt(document.getElementById('seleccionRamo').value, 10);

    if (typeof ramoIndex === "number" && ramoIndex >= 0 && ramoIndex < calendarios.length) {
        const evaluacionSeleccionada = calendarios[ramoIndex].evaluaciones[indexEvaluacion];
        if (evaluacionSeleccionada && evaluacionSeleccionada.nota) {
            valorNotaInput.value = evaluacionSeleccionada.nota.valor;
            porcentajeNotaInput.value = evaluacionSeleccionada.nota.porcentaje;
        }
    } else {
        console.error("Índice de ramo no válido:", ramoIndex);
        return;
    }

    // Guardar el indexEvaluacion actual en el botón de guardar para usarlo más tarde
    const botonGuardar = document.getElementById('botonGuardarNota');
    botonGuardar.dataset.indexEvaluacion = indexEvaluacion;

    // Mostrar el modal usando Bootstrap
    var modal = new bootstrap.Modal(modalElement);
    modal.show();
}


