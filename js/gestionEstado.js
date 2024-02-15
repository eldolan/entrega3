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