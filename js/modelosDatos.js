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
    constructor(nombreRamo, fechaExamenFinal, notaMinima, notaMaxima, notaAprobacion) {
        this.nombreRamo = nombreRamo;
        this.fechaExamenFinal = fechaExamenFinal;
        this.notaMinima = notaMinima;
        this.notaMaxima = notaMaxima;
        this.notaAprobacion = notaAprobacion;
        this.evaluaciones = [];
    }

    agregarEvaluacion(fecha) {
        this.evaluaciones.push(new Evaluacion(fecha));
    }

    get cantidadNotas() {
        return this.evaluaciones.length;
    }
}

class Nota {
    constructor(valor, porcentaje) {
        this.valor = valor;
        this.porcentaje = porcentaje;
    }
}