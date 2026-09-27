import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { RespuestaService } from '../../services/respuesta.service';
import { PreguntaService } from '../../services/pregunta.service';

import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  PieController
} from 'chart.js';

Chart.register(
  PieController,
  ArcElement,
  Tooltip,
  Legend
);


@Component({
  selector: 'app-respuestas-encuesta',
  templateUrl: './respuestas-encuesta.component.html',
  styleUrls: ['./respuestas-encuesta.component.css']
})
export class RespuestasEncuestaComponent
  implements OnInit, OnDestroy {


  idEncuesta: number = 0;

  respuestas: any[] = [];

  preguntas: any[] = [];

  empleados: any[] = [];

  cargando: boolean = false;

  respuestaSeleccionada: any = null;

  opcionesPorPregunta: any[] = [];

  filtrosOpciones: any = {};

  coloresGraficos: string[] = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#8BC34A',
    '#E91E63',
    '#795548',
    '#607D8B'
  ];



  // =====================================================
  // ESTADISTICAS
  // =====================================================

  estadisticas: any = null;

  chartCalificaciones: Chart | null = null;

  chartEmpleados: Chart | null = null;

  chartsOpciones: Chart[] = [];


  // =====================================================
  // PAGINACION
  // =====================================================

  paginaActual: number = 1;

  cantidadPorPagina: number = 2;

  totalRespuestas: number = 0;

  totalPaginas: number = 0;


  // =====================================================
  // FILTROS
  // =====================================================

  fechaDesde: string = '';

  fechaHasta: string = '';

  idEmpleadoFiltro: number = 0;

  calificacionFiltro: number = 0;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private route: ActivatedRoute,
    private respuestaService: RespuestaService,
    private router: Router,
    private preguntaService: PreguntaService
  ) {
  }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.idEncuesta =
      Number(
        this.route.snapshot.paramMap.get('idEncuesta')
      );

    console.log(
      'ID ENCUESTA:',
      this.idEncuesta
    );

    this.cargarPreguntas();
  }


  // =====================================================
  // CARGAR PREGUNTAS
  // =====================================================

  cargarPreguntas(): void {

    this.preguntaService
      .obtenerPorEncuesta(this.idEncuesta)
      .subscribe(
        (respuesta: any[]) => {

          console.log('================================');
          console.log('PREGUNTAS DE LA ENCUESTA:');
          console.log(respuesta);
          console.log('================================');

          this.preguntas = respuesta;

          this.cargarEmpleados();

          this.cargarOpciones();

          this.cargarRespuestas();

          this.cargarEstadisticas();
        },
        (error: any) => {

          console.log(
            'ERROR PREGUNTAS:',
            error
          );

        }
      );
  }


  // =====================================================
  // CARGAR EMPLEADOS
  // =====================================================

  cargarEmpleados(): void {

    var preguntaEmpleado =
      this.preguntas.find(
        (x: any) =>
          x.tipo === 'EMPLEADO'
      );

    if (!preguntaEmpleado) {

      console.log(
        'NO EXISTE PREGUNTA DE TIPO EMPLEADO'
      );

      this.empleados = [];

      return;
    }

    console.log(
      'PREGUNTA EMPLEADO:',
      preguntaEmpleado
    );

    this.preguntaService
      .obtenerEmpleados(
        preguntaEmpleado.id
      )
      .subscribe(
        (respuesta: any[]) => {

          console.log(
            'EMPLEADOS:',
            respuesta
          );

          this.empleados =
            respuesta;

        },
        (error: any) => {

          console.log(
            'ERROR EMPLEADOS:',
            error
          );

          this.empleados = [];

        }
      );

  }


  // =====================================================
  // CARGAR RESPUESTAS
  // =====================================================

  cargarRespuestas(): void {

    this.cargando = true;

    this.respuestaService
      .obtenerPorEncuesta(
        this.idEncuesta,
        this.paginaActual,
        this.cantidadPorPagina,
        this.fechaDesde,
        this.fechaHasta,
        this.idEmpleadoFiltro,
        this.calificacionFiltro,
        this.filtrosOpciones
      )
      .subscribe(
        (respuesta: any) => {

          console.log(
            'RESPUESTAS PAGINADAS:',
            respuesta
          );

          this.respuestas =
            respuesta.items;

          this.totalRespuestas =
            respuesta.total;

          this.paginaActual =
            respuesta.pagina;

          this.cantidadPorPagina =
            respuesta.cantidadPorPagina;

          this.totalPaginas =
            Math.ceil(
              this.totalRespuestas /
              this.cantidadPorPagina
            );

          this.cargando = false;

        },
        (error: any) => {

          console.log(
            'ERROR RESPUESTAS:',
            error
          );

          this.respuestas = [];

          this.totalRespuestas = 0;

          this.totalPaginas = 0;

          this.cargando = false;

        }
      );
  }


  // =====================================================
  // PAGINACION
  // =====================================================

  irPagina(
    pagina: number
  ): void {

    if (pagina < 1) {
      return;
    }

    if (pagina > this.totalPaginas) {
      return;
    }

    this.paginaActual =
      pagina;

    this.cargarRespuestas();
  }


  paginaAnterior(): void {

    if (this.paginaActual <= 1) {
      return;
    }

    this.paginaActual--;

    this.cargarRespuestas();
  }


  paginaSiguiente(): void {

    if (
      this.paginaActual >=
      this.totalPaginas
    ) {
      return;
    }

    this.paginaActual++;

    this.cargarRespuestas();
  }


  obtenerPaginas(): number[] {

    var paginas: number[] = [];

    var inicio =
      this.paginaActual - 2;

    var fin =
      this.paginaActual + 2;

    if (inicio < 1) {
      inicio = 1;
    }

    if (fin > this.totalPaginas) {
      fin = this.totalPaginas;
    }

    for (
      var i = inicio;
      i <= fin;
      i++
    ) {

      paginas.push(i);

    }

    return paginas;
  }


  // =====================================================
  // FILTROS
  // =====================================================

  aplicarFiltros(): void {

    console.log(
      'FECHA DESDE:',
      this.fechaDesde
    );

    console.log(
      'FECHA HASTA:',
      this.fechaHasta
    );

    console.log(
      'EMPLEADO:',
      this.idEmpleadoFiltro
    );

    console.log(
      'CALIFICACION:',
      this.calificacionFiltro
    );

    console.log(
      'FILTROS OPCIONES:',
      this.filtrosOpciones
    );

    this.paginaActual = 1;

    this.cargarRespuestas();

    this.cargarEstadisticas();
  }


  limpiarFiltros(): void {

    this.fechaDesde = '';

    this.fechaHasta = '';

    this.idEmpleadoFiltro = 0;

    this.calificacionFiltro = 0;

    this.filtrosOpciones = {};

    this.paginaActual = 1;

    this.cargarRespuestas();

    this.cargarEstadisticas();
  }


  // =====================================================
  // PREGUNTAS
  // =====================================================

  obtenerTextoPregunta(
    idPregunta: number
  ): string {

    var pregunta =
      this.preguntas.find(
        (x: any) =>
          x.id === idPregunta
      );

    if (!pregunta) {

      return 'Pregunta';
    }

    return pregunta.texto;
  }


  obtenerPregunta(
    idPregunta: number
  ): any {

    return this.preguntas.find(
      (x: any) =>
        x.id === idPregunta
    );
  }


  // =====================================================
  // EMPLEADO
  // =====================================================

  obtenerNombreEmpleado(
    idEmpleado: any
  ): string {

    var id =
      Number(idEmpleado);

    var empleado =
      this.empleados.find(
        (x: any) =>
          x.id === id
      );

    if (!empleado) {

      return 'Empleado no encontrado';
    }

    return (
      empleado.nombre +
      ' ' +
      empleado.apellido
    );
  }


  // =====================================================
  // ESTRELLAS
  // =====================================================

  esEstrellaSeleccionada(
    valor: string,
    estrella: number
  ): boolean {

    return Number(valor) >= estrella;
  }


  // =====================================================
  // MODAL
  // =====================================================

  abrirDetalle(
    respuesta: any
  ): void {

    this.respuestaSeleccionada =
      respuesta;
  }


  cerrarDetalle(): void {

    this.respuestaSeleccionada =
      null;
  }


  // =====================================================
  // OPCIONES
  // =====================================================

  cargarOpciones(): void {

    this.opcionesPorPregunta = [];

    console.log('================================');
    console.log('BUSCANDO PREGUNTAS OPCION');
    console.log('================================');

    var preguntasOpcion =
      this.preguntas.filter(
        (x: any) => {

          console.log(
            'Pregunta:',
            x.id,
            'Tipo:',
            x.tipo,
            'Texto:',
            x.texto
          );

          return x.tipo === 'OPCION';
        }
      );

    console.log(
      'PREGUNTAS TIPO OPCION ENCONTRADAS:',
      preguntasOpcion
    );

    if (preguntasOpcion.length === 0) {

      console.log(
        'NO SE ENCONTRARON PREGUNTAS TIPO OPCION'
      );

      return;
    }

    preguntasOpcion.forEach(
      (pregunta: any) => {

        console.log(
          'OBTENIENDO OPCIONES DE:',
          pregunta.id
        );

        this.preguntaService
          .obtenerOpciones(pregunta.id)
          .subscribe(
            (opciones: any[]) => {

              console.log(
                'OPCIONES DE PREGUNTA ' +
                pregunta.id + ':',
                opciones
              );

              this.opcionesPorPregunta.push({

                idPregunta:
                  pregunta.id,

                textoPregunta:
                  pregunta.texto,

                opciones:
                  opciones

              });

              console.log(
                'opcionesPorPregunta:',
                this.opcionesPorPregunta
              );

            },
            (error: any) => {

              console.log(
                'ERROR OPCIONES PREGUNTA ' +
                pregunta.id,
                error
              );

            }
          );
      }
    );
  }


  obtenerTextoOpcion(
    idPregunta: number,
    idOpcion: any
  ): string {

    var pregunta =
      this.opcionesPorPregunta.find(
        (x: any) =>
          x.idPregunta === idPregunta
      );

    if (!pregunta) {

      return 'Opción no encontrada';
    }

    var opcion =
      pregunta.opciones.find(
        (x: any) =>
          x.id === Number(idOpcion)
      );

    if (!opcion) {

      return 'Opción no encontrada';
    }

    return opcion.texto;
  }


  // =====================================================
  // ESTADISTICAS
  // =====================================================

  cargarEstadisticas(): void {

    this.respuestaService
      .obtenerEstadisticas(
        this.idEncuesta,
        this.fechaDesde,
        this.fechaHasta,
        this.idEmpleadoFiltro,
        this.calificacionFiltro,
        this.filtrosOpciones
      )
      .subscribe(
        (respuesta: any) => {

          console.log(
            'ESTADISTICAS:',
            respuesta
          );

          this.estadisticas =
            respuesta;

          this.crearGraficos();

        },
        (error: any) => {

          console.log(
            'ERROR ESTADISTICAS:',
            error
          );

          this.estadisticas = null;
        }
      );
  }


  // =====================================================
  // CREAR GRAFICOS
  // =====================================================

  crearGraficos(): void {

    if (!this.estadisticas) {
      return;
    }

    setTimeout(() => {

      this.crearGraficoCalificaciones();

      this.crearGraficoEmpleados();

      this.crearGraficosOpciones();

    }, 100);
  }


  // =====================================================
  // GRAFICO CALIFICACIONES
  // =====================================================

  crearGraficoCalificaciones(): void {

    var canvas =
      document.getElementById(
        'chartCalificaciones'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    if (this.chartCalificaciones) {
      this.chartCalificaciones.destroy();
      this.chartCalificaciones = null;
    }

    var labels: string[] = [];
    var datos: number[] = [];
    var colores: string[] = [];

    if (
      !this.estadisticas.calificaciones ||
      this.estadisticas.calificaciones.length === 0
    ) {
      return;
    }

    this.estadisticas.calificaciones.forEach(
      (item: any) => {

        labels.push(
          item.valor + ' estrellas'
        );

        datos.push(
          item.cantidad
        );

        // Color según cantidad de estrellas
        if (item.valor === 1) {
          colores.push('#E74C3C');
        }
        else if (item.valor === 2) {
          colores.push('#E67E22');
        }
        else if (item.valor === 3) {
          colores.push('#F1C40F');
        }
        else if (item.valor === 4) {
          colores.push('#2ECC71');
        }
        else if (item.valor === 5) {
          colores.push('#27AE60');
        }
        else {
          colores.push('#95A5A6');
        }
      }
    );

    this.chartCalificaciones =
      new Chart(
        canvas,
        {
          type: 'pie',

          data: {
            labels: labels,

            datasets: [
              {
                data: datos,
                backgroundColor: colores,
                borderColor: '#ffffff',
                borderWidth: 2
              }
            ]
          },

          options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        }
      );
  }


  // =====================================================
  // GRAFICO EMPLEADOS
  // =====================================================

  crearGraficoEmpleados(): void {

    var canvas =
      document.getElementById(
        'chartEmpleados'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    if (this.chartEmpleados) {
      this.chartEmpleados.destroy();
      this.chartEmpleados = null;
    }

    var labels: string[] = [];
    var datos: number[] = [];

    if (
      !this.estadisticas.empleados ||
      this.estadisticas.empleados.length === 0
    ) {
      return;
    }

    this.estadisticas.empleados.forEach(
      (item: any) => {

        labels.push(
          item.nombre
        );

        datos.push(
          item.cantidad
        );
      }
    );

    var colores =
      this.obtenerColores(datos.length);

    this.chartEmpleados =
      new Chart(
        canvas,
        {
          type: 'pie',

          data: {
            labels: labels,

            datasets: [
              {
                data: datos,

                backgroundColor: colores,

                borderColor: '#ffffff',

                borderWidth: 2
              }
            ]
          },

          options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        }
      );
  }


  // =====================================================
  // GRAFICOS DE OPCIONES
  // =====================================================


  crearGraficosOpciones(): void {

    if (
      this.chartsOpciones.length > 0
    ) {
      this.chartsOpciones.forEach(
        (chart: Chart) => {
          chart.destroy();
        }
      );
    }

    this.chartsOpciones = [];

    if (
      !this.estadisticas.opciones ||
      this.estadisticas.opciones.length === 0
    ) {
      return;
    }

    this.estadisticas.opciones.forEach(
      (pregunta: any) => {

        var canvas =
          document.getElementById(
            'chartOpcion' +
            pregunta.idPregunta
          ) as HTMLCanvasElement;

        if (!canvas) {
          return;
        }

        var labels: string[] = [];
        var datos: number[] = [];

        if (
          !pregunta.opciones ||
          pregunta.opciones.length === 0
        ) {
          return;
        }

        pregunta.opciones.forEach(
          (opcion: any) => {

            labels.push(
              opcion.texto
            );

            datos.push(
              opcion.cantidad
            );
          }
        );

        var colores =
          this.obtenerColores(
            datos.length
          );

        var chart =
          new Chart(
            canvas,
            {
              type: 'pie',

              data: {
                labels: labels,

                datasets: [
                  {
                    data: datos,

                    backgroundColor:
                      colores,

                    borderColor:
                      '#ffffff',

                    borderWidth: 2
                  }
                ]
              },

              options: {
                responsive: true,

                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }
            }
          );

        this.chartsOpciones.push(
          chart
        );
      }
    );
  }



  // =====================================================
  // DESTRUIR GRAFICOS
  // =====================================================

  ngOnDestroy(): void {

    if (this.chartCalificaciones) {

      this.chartCalificaciones.destroy();

      this.chartCalificaciones = null;
    }


    if (this.chartEmpleados) {

      this.chartEmpleados.destroy();

      this.chartEmpleados = null;
    }


    if (
      this.chartsOpciones.length > 0
    ) {

      this.chartsOpciones.forEach(
        (chart: Chart) => {

          chart.destroy();

        }
      );

      this.chartsOpciones = [];
    }

  }



  obtenerColores(cantidad: number): string[] {

    var coloresBase: string[] = [
      '#36A2EB',
      '#FF6384',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#8BC34A',
      '#E91E63',
      '#795548',
      '#607D8B',
      '#F1C40F'
    ];

    var colores: string[] = [];

    for (
      var i = 0;
      i < cantidad;
      i++
    ) {
      colores.push(
        coloresBase[
        i % coloresBase.length
        ]
      );
    }

    return colores;
  }








  // =====================================================
  // VOLVER
  // =====================================================

  volverDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);
  }

}
