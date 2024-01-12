class Nota {
    constructor(valor, porcentaje) {
        this.valor = valor;
        this.porcentaje = porcentaje;
    }


}

class RegistroDeNotas{
    constructor(minima,maxima,aprobacion) {
        this.minima = minima;
        this.maxima = maxima;
        this.aprobacion = aprobacion;
        this.notas = [];
    }
    agregarNota(valor, porcentaje) {
        if (valor < this.minima || valor > this.maxima) {
            return false
        }
        this.notas.push(new Nota(valor, porcentaje));
        return true
    }
    calcularTotalPorcentajes(){
        let totalPorcentajes = 0;
        this.notas.forEach(nota =>{
            totalPorcentajes += nota.porcentaje;
        });
        return totalPorcentajes
    }
    calcularNotaPresentacion(){
        let promedioPonderado = 0;
        let totalPorcentajes = this.calcularTotalPorcentajes()

        this.notas.forEach(nota =>{
            promedioPonderado += nota.valor * nota.porcentaje;
        });

        return promedioPonderado / totalPorcentajes
    }

    determinarAprobacion(){
        let notaPresentacion = this.calcularNotaPresentacion()
        let totalPorcentajes = this.calcularTotalPorcentajes()
        let porcentajeExamen = 100 - totalPorcentajes

        let notaMaximaPosible = notaPresentacion + (this.maxima * porcentajeExamen / 100)

        return notaMaximaPosible >= this.aprobacion;
    }
    calcularNotaExamen(){
        let notaPresentacion = this.calcularNotaPresentacion()
        let totalPorcentajes = this.calcularTotalPorcentajes()
        let porcentajeExamen = 100 - totalPorcentajes

        let faltanteParaAprobacion = this.aprobacion - notaPresentacion * (totalPorcentajes / 100)

        return faltanteParaAprobacion * 100 / porcentajeExamen
    }
    determinarPosibilidad(){
        let notaNecesariaExamen = this.calcularNotaExamen()

        return notaNecesariaExamen <= this.maxima;
    }
}

document.getElementById('formularioNotas').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores de los campos del formulario
    let notaMinima = Number(document.getElementById('notaMinima').value);
    let notaMaxima = Number(document.getElementById('notaMaxima').value);
    let notaAprobacion = Number(document.getElementById('notaAprobacion').value);
    let valorNota = Number(document.getElementById('valorNota').value);
    let porcentajeNota = Number(document.getElementById('porcentajeNota').value);
    let pruebaSeleccionada = document.getElementById('pruebaSeleccionada').value;

    // Encuentra el evento correspondiente y actualiza con la nota
    let eventoCorrespondiente = eventos.find(evento => evento.nombre === pruebaSeleccionada);
    if (eventoCorrespondiente) {
        eventoCorrespondiente.registroNotas = new RegistroDeNotas(notaMinima, notaMaxima, notaAprobacion);
        if (eventoCorrespondiente.registroNotas.agregarNota(valorNota, porcentajeNota)) {
            actualizarRepresentacionEvento(eventoCorrespondiente);
        } else {
            console.error("Error al agregar la nota");
        }
    }
});

function actualizarCalendarioConNota(nombrePrueba, valorNota, porcentajeNota) {
    let eventoCorrespondiente = eventos.find(evento => evento.nombre === nombrePrueba);
    if (eventoCorrespondiente) {
        eventoCorrespondiente.registroNotas.agregarNota(valorNota, porcentajeNota);
        actualizarRepresentacionEvento(eventoCorrespondiente);
    }
}

function actualizarRepresentacionEvento(evento) {
    let elementosEvento = document.querySelectorAll('.clase');
    elementosEvento.forEach(elemento => {
        if (elemento.textContent.includes(evento.nombre)) {
            let notaPresentacion = evento.registroNotas.calcularNotaPresentacion();
            let porcentajeTexto = evento.registroNotas.calcularTotalPorcentajes().toFixed(2) + "%";
            elemento.innerHTML += `<div>Nota de Presentación: ${notaPresentacion.toFixed(2)}, Porcentaje Acumulado: ${porcentajeTexto}</div>`;

            if (evento.esExamenFinal) {
                let puedeAprobarConMaximaEnExamen = evento.registroNotas.determinarAprobacion();
                let notaNecesariaExamen = evento.registroNotas.calcularNotaExamen();
                let mensajeExtra = puedeAprobarConMaximaEnExamen ?
                    `Con un ${notaNecesariaExamen.toFixed(2)} en el examen, puedes aprobar el curso.` :
                    `Necesitas un ${notaNecesariaExamen.toFixed(2)} en el examen para tener la oportunidad de aprobar.`;
                elemento.innerHTML += `<div>${mensajeExtra}</div>`;
            }
        }
    });
}

function solicitarNumero(mensaje, min = null, max = null) {
    let valor;
    do {
        valor = Number(prompt(mensaje));
        if (isNaN(valor) || (min !== null && valor < min) || (max !== null && valor > max)) {
            alert("Entrada inválida. Por favor, intenta de nuevo.");
        }
    } while (isNaN(valor) || (min !== null && valor < min) || (max !== null && valor > max));
    return valor;
}


function main() {
}

main();
