
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PublicaService } from '../../services/publica.service';
import { RespuestaService } from '../../services/respuesta.service';


@Component({
  selector: 'app-opinar',
  templateUrl: './opinar.component.html',
  styleUrls: ['./opinar.component.css']
})
export class OpinarComponent implements OnInit {

  slugLocal: string = '';
  slugEncuesta: string = '';

  encuesta: any = null;

  cargando: boolean = true;
  enviando: boolean = false;

  error: string = '';
  mensajeExito: string = '';

  respuestas: any = {};


  // =====================================================
  // EMOJIS DE CALIFICACION
  // =====================================================

  calificaciones: any[] = [
    {
      valor: 1,
      emoji: '😡',
      texto: 'Muy malo'
    },
    {
      valor: 2,
      emoji: '😕',
      texto: 'Malo'
    },
    {
      valor: 3,
      emoji: '😐',
      texto: 'Regular'
    },
    {
      valor: 4,
      emoji: '🙂',
      texto: 'Bueno'
    },
    {
      valor: 5,
      emoji: '😍',
      texto: 'Excelente'
    }
  ];


  constructor(
    private route: ActivatedRoute,
    private publicaService: PublicaService,
    private respuestaService: RespuestaService
  ) {
  }


  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.slugLocal = params['slugLocal'];
      this.slugEncuesta = params['slugEncuesta'];

      console.log(
        'SLUG LOCAL:',
        this.slugLocal
      );

      console.log(
        'SLUG ENCUESTA:',
        this.slugEncuesta
      );

      this.cargarEncuesta();

    });

  }


  // =====================================================
  // CARGAR ENCUESTA
  // =====================================================

  cargarEncuesta(): void {

    this.cargando = true;

    this.error = '';
    this.mensajeExito = '';

    this.publicaService
      .obtenerEncuesta(
        this.slugLocal,
        this.slugEncuesta
      )
      .subscribe(

        (respuesta: any) => {

          console.log(
            'ENCUESTA PUBLICA:',
            respuesta
          );

          this.encuesta = respuesta;

          this.cargando = false;

        },

        (error: any) => {

          console.log(
            'ERROR ENCUESTA PUBLICA:',
            error
          );

          this.cargando = false;

          if (error.status === 404) {

            this.error =
              'La encuesta no existe o ya no está disponible.';

          } else {

            this.error =
              'No se pudo cargar la encuesta.';

          }

        }

      );

  }


  // =====================================================
  // CALIFICACION
  // =====================================================

  seleccionarCalificacion(
    idPregunta: number,
    valor: number
  ): void {

    this.respuestas[idPregunta] = valor;

    console.log(
      'RESPUESTA CALIFICACION:',
      idPregunta,
      valor
    );

  }


  esCalificacionSeleccionada(
    idPregunta: number,
    valor: number
  ): boolean {

    var respuesta =
      this.respuestas[idPregunta];

    if (
      respuesta === undefined ||
      respuesta === null
    ) {

      return false;

    }

    return Number(respuesta) === valor;

  }


  obtenerEmojiCalificacion(
    valor: number
  ): string {

    var calificacion =
      this.calificaciones.find(
        x => x.valor === Number(valor)
      );

    if (calificacion) {

      return calificacion.emoji;

    }

    return '';

  }


  tieneRespuesta(
    idPregunta: number
  ): boolean {

    var respuesta =
      this.respuestas[idPregunta];

    return respuesta !== undefined &&
           respuesta !== null &&
           respuesta !== '';

  }


  // =====================================================
  // TEXTO
  // =====================================================

  guardarTexto(
    idPregunta: number,
    valor: string
  ): void {

    this.respuestas[idPregunta] = valor;

    console.log(
      'RESPUESTA TEXTO:',
      idPregunta,
      valor
    );

  }


  obtenerRespuestaTexto(
    idPregunta: number
  ): string {

    var respuesta =
      this.respuestas[idPregunta];

    if (
      respuesta === undefined ||
      respuesta === null
    ) {

      return '';

    }

    return respuesta.toString();

  }


  obtenerValorInput(
    event: Event
  ): string {

    var elemento =
      event.target as HTMLTextAreaElement;

    return elemento.value;

  }


  // =====================================================
  // OPCIONES
  // =====================================================

  seleccionarOpcion(
    idPregunta: number,
    valor: any
  ): void {

    this.respuestas[idPregunta] = valor;

    console.log(
      'RESPUESTA OPCION:',
      idPregunta,
      valor
    );

  }


  esOpcionSeleccionada(
    idPregunta: number,
    opcion: any
  ): boolean {

    return String(
      this.respuestas[idPregunta]
    ) === String(opcion);

  }


  obtenerOpciones(
    pregunta: any
  ): any[] {

    if (
      !pregunta ||
      !pregunta.opciones
    ) {

      return [];

    }

    return pregunta.opciones;

  }


  obtenerValorOpcion(
    opcion: any
  ): any {

    if (
      opcion === undefined ||
      opcion === null
    ) {

      return '';

    }


    /*
     * Si desde la API viene directamente:
     *
     * "Excelente"
     *
     * usamos ese valor.
     */

    if (
      typeof opcion === 'string' ||
      typeof opcion === 'number'
    ) {

      return opcion;

    }


    /*
     * Si viene como:
     *
     * {
     *   id: 1,
     *   valor: "Excelente"
     * }
     *
     * guardamos el ID.
     */

    if (
      opcion.id !== undefined &&
      opcion.id !== null
    ) {

      return opcion.id;

    }


    /*
     * Si no tiene ID pero tiene valor.
     */

    if (
      opcion.valor !== undefined &&
      opcion.valor !== null
    ) {

      return opcion.valor;

    }


    if (
      opcion.value !== undefined &&
      opcion.value !== null
    ) {

      return opcion.value;

    }


    return opcion;

  }


  obtenerTextoOpcion(
    opcion: any
  ): string {

    if (
      opcion === undefined ||
      opcion === null
    ) {

      return '';

    }


    if (
      typeof opcion === 'string' ||
      typeof opcion === 'number'
    ) {

      return opcion.toString();

    }


    if (
      opcion.valor !== undefined &&
      opcion.valor !== null
    ) {

      return opcion.valor.toString();

    }


    if (
      opcion.texto !== undefined &&
      opcion.texto !== null
    ) {

      return opcion.texto.toString();

    }


    if (
      opcion.nombre !== undefined &&
      opcion.nombre !== null
    ) {

      return opcion.nombre.toString();

    }


    if (
      opcion.value !== undefined &&
      opcion.value !== null
    ) {

      return opcion.value.toString();

    }


    return opcion.toString();

  }


  // =====================================================
  // EMPLEADO
  // =====================================================

  seleccionarEmpleado(
    idPregunta: number,
    idEmpleado: number
  ): void {

    this.respuestas[idPregunta] =
      idEmpleado;

    console.log(
      'EMPLEADO SELECCIONADO:',
      idPregunta,
      idEmpleado
    );

  }


  obtenerValorSelect(
    event: Event
  ): number {

    var elemento =
      event.target as HTMLSelectElement;

    return Number(elemento.value);

  }


  obtenerEmpleados(
    pregunta: any
  ): any[] {

    if (!pregunta.empleados) {

      return [];

    }

    return pregunta.empleados;

  }


  // =====================================================
  // ENVIAR
  // =====================================================

  enviar(): void {

    this.error = '';
    this.mensajeExito = '';

    if (!this.encuesta) {

      return;

    }


    // VALIDAR OBLIGATORIAS

    for (
      let pregunta of this.encuesta.preguntas
    ) {

      if (!pregunta.obligatoria) {

        continue;

      }


      const respuesta =
        this.respuestas[pregunta.id];


      if (
        respuesta === undefined ||
        respuesta === null ||
        respuesta === ''
      ) {

        this.error =
          'Por favor completá todas las preguntas obligatorias.';

        return;

      }

    }


    // ARMAR DETALLES

    const respuestasDetalle: any[] = [];


    for (
      let pregunta of this.encuesta.preguntas
    ) {

      const respuesta =
        this.respuestas[pregunta.id];


      if (
        respuesta === undefined ||
        respuesta === null ||
        respuesta === ''
      ) {

        continue;

      }


      respuestasDetalle.push({

        idPregunta: pregunta.id,

        valor: respuesta.toString()

      });

    }


    // DTO

    const datos = {

      idEncuesta: this.encuesta.id,

      anonima: true,

      detalles: respuestasDetalle

    };


    console.log(
      'DATOS A ENVIAR:',
      datos
    );


    this.enviando = true;


    this.respuestaService
      .crear(datos)
      .subscribe(

        (respuesta: any) => {

          console.log(
            'RESPUESTA GUARDADA:',
            respuesta
          );

          this.enviando = false;

          this.mensajeExito =
            '¡Gracias por compartir tu opinión!';

        },

        (error: any) => {

          console.log(
            'ERROR GUARDANDO RESPUESTA:',
            error
          );

          this.enviando = false;

          this.error =
            'No se pudo registrar tu opinión. Intentá nuevamente.';

        }

      );

  }

}

