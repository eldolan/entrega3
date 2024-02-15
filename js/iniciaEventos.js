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

document.getElementById('guardarCambiosNotas').onclick = function() {
    const index = document.getElementById('seleccionRamo').value;
    const calendarios = cargarCalendarios();
    const calendario = calendarios[index];

    calendario.notaMinima = parseFloat(document.getElementById('editarNotaMinima').value);
    calendario.notaMaxima = parseFloat(document.getElementById('editarNotaMaxima').value);
    calendario.notaAprobacion = parseFloat(document.getElementById('editarNotaAprobacion').value);

    guardarCalendario(calendario, index);
    mostrarCalendario(calendario);

    var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarNotas'));
    modal.hide();
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('botonGuardarNota').addEventListener('click', function() {
        const indexEvaluacion = parseInt(this.dataset.indexEvaluacion, 10);
        const valorNota = parseFloat(document.getElementById('valorNota').value);
        const porcentajeNota = parseFloat(document.getElementById('porcentajeNota').value);

        procesarNota(indexEvaluacion, valorNota, porcentajeNota);

        // Ocultar el modal después de guardar
        var modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarNota'));
        modal.hide();
    });
});