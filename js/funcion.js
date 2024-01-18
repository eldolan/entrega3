class Nota {
    constructor(valor, porcentaje) {
        this.valor = valor;
        this.porcentaje = porcentaje;
    }
}

class RegistroDeNotas {
    constructor(minima, maxima, aprobacion) {
        this.minima = minima;
        this.maxima = maxima;
        this.aprobacion = aprobacion;
        this.notas = [];
    }

    agregarNota(valor, porcentaje) {
        if (valor < this.minima || valor > this.maxima) {
            return false;
        }
        this.notas.push(new Nota(valor, porcentaje));
        return true;
    }

    calcularTotalPorcentajes() {
        let totalPorcentajes = 0;
        this.notas.forEach(nota => {
            totalPorcentajes += nota.porcentaje;
        });
        return totalPorcentajes;
    }

    calcularNotaPresentacion() {
        let promedioPonderado = 0;
        let totalPorcentajes = this.calcularTotalPorcentajes();

        this.notas.forEach(nota => {
            promedioPonderado += nota.valor * nota.porcentaje;
        });

        return promedioPonderado / totalPorcentajes;
    }

    determinarAprobacion() {
        let notaPresentacion = this.calcularNotaPresentacion();
        let totalPorcentajes = this.calcularTotalPorcentajes();
        let porcentajeExamen = 100 - totalPorcentajes;

        let notaMaximaPosible = notaPresentacion + (this.maxima * porcentajeExamen / 100);

        return notaMaximaPosible >= this.aprobacion;
    }

    calcularNotaExamen() {
        let notaPresentacion = this.calcularNotaPresentacion();
        let totalPorcentajes = this.calcularTotalPorcentajes();
        let porcentajeExamen = 100 - totalPorcentajes;

        let faltanteParaAprobacion = this.aprobacion - notaPresentacion * (totalPorcentajes / 100);

        return faltanteParaAprobacion * 100 / porcentajeExamen;
    }

    determinarPosibilidad() {
        let notaNecesariaExamen = this.calcularNotaExamen();
        return notaNecesariaExamen <= this.maxima;
    }
}


let registro;
let cantidadNotas = 0;

document.getElementById('configuracion').addEventListener('submit', function (event) {
    event.preventDefault();
    const minima = parseFloat(document.getElementById('minima').value);
    const maxima = parseFloat(document.getElementById('maxima').value);
    const aprobacion = parseFloat(document.getElementById('aprobacion').value);
    cantidadNotas = parseInt(document.getElementById('cantidadNotas').value);

    registro = new RegistroDeNotas(minima, maxima, aprobacion);
    cantidadNotas = parseInt(document.getElementById('cantidadNotas').value);
    mostrarFormulariosNotas(cantidadNotas);
});

function mostrarFormulariosNotas(cantidad) {
    let notasContainer = document.getElementById('notasContainer');
    notasContainer.innerHTML = '';
    for (let i = 0; i < cantidad; i++) {
        notasContainer.innerHTML += `
            <div class="row g-3 mb-2">
                <div class="col-md-6">
                    <label for="valorNota${i}" class="form-label">Valor de la nota ${i + 1}</label>
                    <input type="number" class="form-control valorNota" id="valorNota${i}" required>
                </div>
                <div class="col-md-6">
                    <label for="porcentajeNota${i}" class="form-label">Porcentaje de la nota ${i + 1}</label>
                    <input type="number" class="form-control porcentajeNota" id="porcentajeNota${i}" required>
                </div>
            </div>`;
    }
    notasContainer.innerHTML += `<div class="text-center"><button type="button" class="btn btn-primary" onclick="agregarNotas()">Agregar Notas</button></div>`;
    notasContainer.style.display = 'block';
}

function agregarNotas() {
    let valoresNotas = document.querySelectorAll('.valorNota');
    let porcentajesNotas = document.querySelectorAll('.porcentajeNota');

    for (let i = 0; i < valoresNotas.length; i++) {
        let valor = parseFloat(valoresNotas[i].value);
        let porcentaje = parseFloat(porcentajesNotas[i].value);

        if (!registro.agregarNota(valor, porcentaje)) {
            alert("Una o más notas ingresadas no son válidas.");
            return;
        }
    }

    mostrarResultados();
    document.getElementById('notasContainer').style.display = 'none';
}

function mostrarResultados() {
    let notaPresentacion = registro.calcularNotaPresentacion();
    let notaNecesariaExamen = registro.calcularNotaExamen();
    let esPosibleAprobar = registro.determinarPosibilidad();
    let puedeAprobarConMaximaEnExamen = registro.determinarAprobacion();

    let mensaje = "Tu nota de presentación es " + notaPresentacion.toFixed(2) + ". ";
    if (puedeAprobarConMaximaEnExamen) {
        mensaje += "Con un " + notaNecesariaExamen.toFixed(2) + " en el examen, puedes aprobar el curso. ¡Sigue así!";
    } else if (esPosibleAprobar) {
        mensaje += "Necesitas un " + notaNecesariaExamen.toFixed(2) + " en el examen para tener la oportunidad de aprobar. ¡Es posible!";
    } else {
        mensaje += "Incluso con un " + notaNecesariaExamen.toFixed(2) + " en el examen, no es posible aprobar. Suerte para la próxima.";
    }

    document.getElementById('resultado').innerText = mensaje;
}
