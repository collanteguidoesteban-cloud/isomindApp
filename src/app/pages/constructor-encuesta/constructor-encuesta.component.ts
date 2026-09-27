
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { PreguntaService } from '../../services/pregunta.service';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-constructor-encuesta',
  templateUrl: './constructor-encuesta.component.html',
  styleUrls: ['./constructor-encuesta.component.css']
})
export class ConstructorEncuestaComponent implements OnInit {

  idEncuesta: number = 0;
  idLocal: number = 0;

  encuesta: any = null;

  preguntas: any[] = [];
  empleados: any[] = [];

  opcionesPregunta: any[] = [];
  nuevaOpcion: string = '';

  empleadosSeleccionados: any[] = [];

  empleadosSeleccionadosPorPregunta: {
    [idPregunta: number]: any[]
  } = {};

  cargando: boolean = true;
  cargandoEmpleados: boolean = false;

  error: string = '';

  // =====================================================
  // MODAL PREGUNTA
  // =====================================================

  mostrarFormulario: boolean = false;

  textoPregunta: string = '';
  tipoPregunta: string = 'CALIFICACION';
  ordenPregunta: number = 1;
  obligatoria: boolean = true;
  activa: boolean = true;

  guardandoPregunta: boolean = false;
  errorPregunta: string = '';

  modoEdicion: boolean = false;
  idPreguntaEditando: number = 0;

  // =====================================================
  // EMPLEADO
  // =====================================================

  mostrarFormularioEmpleado: boolean = false;

  nombreEmpleado: string = '';
  apellidoEmpleado: string = '';

  guardandoEmpleado: boolean = false;
  errorEmpleado: string = '';

  // =====================================================
  // UI
  // =====================================================

  menuPreguntaAbierto: number = 0;

  guardandoOrden: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private preguntaService: PreguntaService,
    private empleadoService: EmpleadoService
  ) {
  }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    var localGuardado =
      localStorage.getItem('localSeleccionado');

    if (localGuardado) {
      this.idLocal = Number(localGuardado);
    }

    this.route.params.subscribe(params => {

      this.idEncuesta =
        Number(params['idEncuesta']);

      if (!this.idEncuesta) {

        this.error =
          'No se encontró la encuesta.';

        this.cargando = false;

        return;
      }

      this.cargarPreguntas();
    });
  }

  // =====================================================
  // PREGUNTAS
  // =====================================================

  cargarPreguntas(): void {

    this.cargando = true;

    this.preguntaService
      .obtenerPorEncuesta(this.idEncuesta)
      .subscribe(
        (respuesta: any[]) => {

          this.preguntas =
            respuesta || [];

          this.preguntas.sort(
            (a, b) => {
              return Number(a.orden || 0) -
                Number(b.orden || 0);
            }
          );

          this.recalcularOrdenes();

          this.cargando = false;
        },
        (error: any) => {

          console.log(
            'ERROR PREGUNTAS:',
            error
          );

          this.error =
            'No se pudieron cargar las preguntas.';

          this.cargando = false;
        }
      );
  }

  // =====================================================
  // DRAG & DROP
  // =====================================================

  moverPregunta(event: CdkDragDrop<any[]>): void {

    if (event.previousIndex === event.currentIndex) {
      return;
    }

    moveItemInArray(
      this.preguntas,
      event.previousIndex,
      event.currentIndex
    );

    this.recalcularOrdenes();

    /*
     * IMPORTANTE:
     *
     * Acá actualizamos el orden visualmente.
     *
     * Tu PreguntaService actual no tiene un método
     * para guardar el orden de todas las preguntas.
     *
     * Cuando agreguemos ese endpoint podemos llamar
     * al backend desde acá.
     */

    this.menuPreguntaAbierto = 0;
  }

  recalcularOrdenes(): void {

    for (
      var i = 0;
      i < this.preguntas.length;
      i++
    ) {

      this.preguntas[i].orden =
        i + 1;
    }
  }

  // =====================================================
  // NUEVA PREGUNTA
  // =====================================================

  abrirNuevaPregunta(): void {

    this.errorPregunta = '';

    this.modoEdicion = false;

    this.idPreguntaEditando = 0;

    this.textoPregunta = '';

    this.tipoPregunta = 'CALIFICACION';

    this.ordenPregunta =
      this.preguntas.length + 1;

    this.obligatoria = true;

    this.activa = true;

    this.empleadosSeleccionados = [];

    this.opcionesPregunta = [];

    this.nuevaOpcion = '';

    this.mostrarFormulario = true;

    this.menuPreguntaAbierto = 0;
  }

  // =====================================================
  // EDITAR
  // =====================================================

  editarPregunta(pregunta: any): void {

    this.errorPregunta = '';

    this.modoEdicion = true;

    this.idPreguntaEditando =
      pregunta.id;

    this.textoPregunta =
      pregunta.texto;

    this.tipoPregunta =
      pregunta.tipo;

    this.ordenPregunta =
      pregunta.orden;

    this.obligatoria =
      pregunta.obligatoria;

    this.activa =
      pregunta.activa;

    this.empleadosSeleccionados =
      this.empleadosSeleccionadosPorPregunta[
        pregunta.id
      ] || [];

    this.opcionesPregunta = [];

    this.nuevaOpcion = '';

    this.mostrarFormulario = true;

    this.menuPreguntaAbierto = 0;

    if (this.tipoPregunta === 'EMPLEADO') {
      this.cargarEmpleados();
    }

    if (this.tipoPregunta === 'OPCION') {

      this.cargarOpciones(
        pregunta.id
      );
    }
  }

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  cancelarPregunta(): void {

    this.mostrarFormulario = false;

    this.errorPregunta = '';

    this.modoEdicion = false;

    this.idPreguntaEditando = 0;

    this.empleadosSeleccionados = [];

    this.opcionesPregunta = [];

    this.nuevaOpcion = '';
  }

  cerrarModalDesdeFondo(event: MouseEvent): void {

    if (
      event.target ===
      event.currentTarget
    ) {

      this.cancelarPregunta();
    }
  }

  // =====================================================
  // TIPO
  // =====================================================

  cambiarTipoPregunta(): void {

    this.empleadosSeleccionados = [];

    if (
      this.tipoPregunta ===
      'EMPLEADO'
    ) {

      this.cargarEmpleados();
    }

    if (
      this.tipoPregunta ===
      'OPCION'
    ) {

      if (
        this.modoEdicion &&
        this.idPreguntaEditando
      ) {

        this.cargarOpciones(
          this.idPreguntaEditando
        );

      } else {

        this.opcionesPregunta = [];

        this.nuevaOpcion = '';
      }
    }

    if (
      this.tipoPregunta !==
      'OPCION'
    ) {

      this.opcionesPregunta = [];

      this.nuevaOpcion = '';
    }
  }

  // =====================================================
  // GUARDAR PREGUNTA
  // =====================================================

  guardarPregunta(): void {

    this.errorPregunta = '';

    if (!this.textoPregunta.trim()) {

      this.errorPregunta =
        'El texto de la pregunta es obligatorio.';

      return;
    }

    if (!this.idEncuesta) {

      this.errorPregunta =
        'No se encontró la encuesta.';

      return;
    }

    if (
      this.tipoPregunta === 'OPCION' &&
      this.opcionesPregunta.length === 0
    ) {

      this.errorPregunta =
        'Debés agregar al menos una opción.';

      return;
    }

    if (
      this.tipoPregunta === 'EMPLEADO' &&
      this.empleadosSeleccionados.length === 0
    ) {

      this.errorPregunta =
        'Seleccioná al menos un empleado.';

      return;
    }

    this.guardandoPregunta = true;

    // =================================================
    // EDITAR
    // =================================================

    if (this.modoEdicion) {

      var datosEdicion = {

        id: this.idPreguntaEditando,

        idEncuesta: this.idEncuesta,

        texto: this.textoPregunta,

        tipo: this.tipoPregunta,

        orden: this.ordenPregunta,

        obligatoria: this.obligatoria,

        activa: this.activa
      };

      this.preguntaService
        .editar(datosEdicion)
        .subscribe(
          (respuesta: any) => {

            this.guardarEmpleadosPregunta(
              this.idPreguntaEditando
            );

            this.guardarOpcionesPregunta(
              this.idPreguntaEditando
            );

            this.guardandoPregunta =
              false;

            this.mostrarFormulario =
              false;

            this.modoEdicion =
              false;

            this.idPreguntaEditando =
              0;

            this.opcionesPregunta =
              [];

            this.nuevaOpcion =
              '';

            this.cargarPreguntas();
          },
          (error: any) => {

            console.log(
              'ERROR EDITANDO PREGUNTA:',
              error
            );

            this.guardandoPregunta =
              false;

            this.errorPregunta =
              'No se pudo editar la pregunta.';
          }
        );

      return;
    }

    // =================================================
    // CREAR
    // =================================================

    var datos = {

      texto: this.textoPregunta,

      tipo: this.tipoPregunta,

      orden: this.ordenPregunta,

      obligatoria: this.obligatoria,

      activa: this.activa
    };

    this.preguntaService
      .crear(
        this.idEncuesta,
        datos
      )
      .subscribe(
        (respuesta: any) => {

          if (!respuesta || !respuesta.id) {

            this.guardandoPregunta =
              false;

            this.errorPregunta =
              'La pregunta se creó pero no se recibió su ID.';

            return;
          }

          this.guardarEmpleadosPregunta(
            respuesta.id
          );

          this.guardarOpcionesPregunta(
            respuesta.id
          );

          this.guardandoPregunta =
            false;

          this.mostrarFormulario =
            false;

          this.opcionesPregunta =
            [];

          this.nuevaOpcion =
            '';

          this.cargarPreguntas();
        },
        (error: any) => {

          console.log(
            'ERROR CREANDO PREGUNTA:',
            error
          );

          this.guardandoPregunta =
            false;

          this.errorPregunta =
            'No se pudo guardar la pregunta.';
        }
      );
  }

  // =====================================================
  // EMPLEADOS DE PREGUNTA
  // =====================================================

  empleadoSeleccionado(
    empleado: any
  ): boolean {

    return this.empleadosSeleccionados.some(
      x => x.id === empleado.id
    );
  }

  cambiarEmpleadoSeleccionado(
    empleado: any
  ): void {

    var indice =
      this.empleadosSeleccionados.findIndex(
        x => x.id === empleado.id
      );

    if (indice >= 0) {

      this.empleadosSeleccionados.splice(
        indice,
        1
      );

    } else {

      this.empleadosSeleccionados.push(
        empleado
      );
    }

    if (this.idPreguntaEditando) {

      this.empleadosSeleccionadosPorPregunta[
        this.idPreguntaEditando
      ] =
        this.empleadosSeleccionados;
    }
  }

  cargarEmpleados(): void {

    if (!this.idLocal) {

      this.errorPregunta =
        'No se encontró el local seleccionado.';

      return;
    }

    this.cargandoEmpleados =
      true;

    this.empleadoService
      .obtenerPorLocal(this.idLocal)
      .subscribe(
        (respuesta: any[]) => {

          this.empleados =
            respuesta || [];

          this.cargandoEmpleados =
            false;
        },
        (error: any) => {

          console.log(
            'ERROR EMPLEADOS:',
            error
          );

          this.empleados = [];

          this.cargandoEmpleados =
            false;

          this.errorPregunta =
            'No se pudieron cargar los empleados.';
        }
      );
  }

  // =====================================================
  // GUARDAR EMPLEADOS
  // =====================================================

  guardarEmpleadosPregunta(
    idPregunta: number
  ): void {

    if (
      this.tipoPregunta !==
      'EMPLEADO'
    ) {

      return;
    }

    var idsEmpleados =
      this.empleadosSeleccionados.map(
        x => x.id
      );

    this.preguntaService
      .guardarEmpleados(
        idPregunta,
        idsEmpleados
      )
      .subscribe(
        (respuesta: any) => {

          console.log(
            'EMPLEADOS GUARDADOS:',
            respuesta
          );
        },
        (error: any) => {

          console.log(
            'ERROR GUARDANDO EMPLEADOS:',
            error
          );
        }
      );
  }

  // =====================================================
  // OPCIONES
  // =====================================================

  agregarOpcion(): void {

    if (
      !this.nuevaOpcion ||
      this.nuevaOpcion.trim() === ''
    ) {

      return;
    }

    this.opcionesPregunta.push({

      id: 0,

      texto:
        this.nuevaOpcion.trim(),

      orden:
        this.opcionesPregunta.length + 1,

      activa: true

    });

    this.nuevaOpcion = '';
  }

  eliminarOpcion(
    indice: number
  ): void {

    this.opcionesPregunta.splice(
      indice,
      1
    );

    for (
      var i = 0;
      i < this.opcionesPregunta.length;
      i++
    ) {

      this.opcionesPregunta[i].orden =
        i + 1;
    }
  }

  cargarOpciones(
    idPregunta: number
  ): void {

    this.preguntaService
      .obtenerOpciones(
        idPregunta
      )
      .subscribe(
        (respuesta: any[]) => {

          this.opcionesPregunta =
            respuesta || [];
        },
        (error: any) => {

          console.log(
            'ERROR OPCIONES:',
            error
          );

          this.opcionesPregunta = [];
        }
      );
  }

  guardarOpcionesPregunta(
    idPregunta: number
  ): void {

    if (
      this.tipoPregunta !==
      'OPCION'
    ) {

      return;
    }

    if (
      !this.opcionesPregunta ||
      this.opcionesPregunta.length === 0
    ) {

      return;
    }

    this.preguntaService
      .guardarOpciones(
        idPregunta,
        this.opcionesPregunta
      )
      .subscribe(
        (respuesta: any) => {

          console.log(
            'OPCIONES GUARDADAS:',
            respuesta
          );
        },
        (error: any) => {

          console.log(
            'ERROR GUARDANDO OPCIONES:',
            error
          );
        }
      );
  }

  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminarPregunta(
    pregunta: any
  ): void {

    var confirmar =
      confirm(
        '¿Estás seguro de eliminar esta pregunta?'
      );

    if (!confirmar) {
      return;
    }

    this.error = '';

    this.preguntaService
      .eliminar(
        this.idEncuesta,
        pregunta.id
      )
      .subscribe(
        (respuesta: any) => {

          delete this
            .empleadosSeleccionadosPorPregunta[
              pregunta.id
            ];

          this.cargarPreguntas();
        },
        (error: any) => {

          console.log(
            'ERROR ELIMINANDO:',
            error
          );

          this.error =
            'No se pudo eliminar la pregunta.';
        }
      );
  }

  // =====================================================
  // DUPLICAR
  // =====================================================

  duplicarPregunta(
    pregunta: any
  ): void {

    this.error = '';

    this.preguntaService
      .crear(
        this.idEncuesta,
        {
          texto:
            pregunta.texto + ' (copia)',

          tipo:
            pregunta.tipo,

          orden:
            this.preguntas.length + 1,

          obligatoria:
            pregunta.obligatoria,

          activa:
            pregunta.activa
        }
      )
      .subscribe(
        (respuesta: any) => {

          if (
            !respuesta ||
            !respuesta.id
          ) {

            this.error =
              'No se pudo obtener la pregunta duplicada.';

            return;
          }

          var empleados =
            this.empleadosSeleccionadosPorPregunta[
              pregunta.id
            ] || [];

          if (
            pregunta.tipo ===
            'EMPLEADO' &&
            empleados.length > 0
          ) {

            this.preguntaService
              .guardarEmpleados(
                respuesta.id,
                empleados.map(
                  x => x.id
                )
              )
              .subscribe();
          }

          if (
            pregunta.tipo ===
            'OPCION'
          ) {

            this.cargarOpcionesParaDuplicar(
              pregunta.id,
              respuesta.id
            );

          } else {

            this.cargarPreguntas();
          }
        },
        (error: any) => {

          console.log(
            'ERROR DUPLICANDO:',
            error
          );

          this.error =
            'No se pudo duplicar la pregunta.';
        }
      );
  }

  cargarOpcionesParaDuplicar(
    idPreguntaOrigen: number,
    idPreguntaNueva: number
  ): void {

    this.preguntaService
      .obtenerOpciones(
        idPreguntaOrigen
      )
      .subscribe(
        (opciones: any[]) => {

          if (
            opciones &&
            opciones.length > 0
          ) {

            var opcionesNuevas =
              opciones.map(
                (opcion, index) => {

                  return {

                    id: 0,

                    texto:
                      opcion.texto,

                    orden:
                      index + 1,

                    activa:
                      opcion.activa !== false
                  };
                }
              );

            this.preguntaService
              .guardarOpciones(
                idPreguntaNueva,
                opcionesNuevas
              )
              .subscribe(
                () => {
                  this.cargarPreguntas();
                },
                () => {
                  this.cargarPreguntas();
                }
              );

          } else {

            this.cargarPreguntas();
          }
        },
        () => {

          this.cargarPreguntas();
        }
      );
  }

  // =====================================================
  // EMPLEADO NUEVO
  // =====================================================

  abrirNuevoEmpleado(): void {

    this.nombreEmpleado = '';

    this.apellidoEmpleado = '';

    this.errorEmpleado = '';

    this.mostrarFormularioEmpleado =
      true;
  }

  agregarEmpleado(): void {
    this.abrirNuevoEmpleado();
  }

  cancelarEmpleado(): void {

    this.mostrarFormularioEmpleado =
      false;

    this.errorEmpleado = '';
  }

  guardarEmpleado(): void {

    this.errorEmpleado = '';

    if (
      !this.nombreEmpleado.trim()
    ) {

      this.errorEmpleado =
        'El nombre del empleado es obligatorio.';

      return;
    }

    if (
      !this.apellidoEmpleado.trim()
    ) {

      this.errorEmpleado =
        'El apellido del empleado es obligatorio.';

      return;
    }

    if (!this.idLocal) {

      this.errorEmpleado =
        'No se encontró el local seleccionado.';

      return;
    }

    var datos = {

      nombre:
        this.nombreEmpleado,

      apellido:
        this.apellidoEmpleado,

      activo:
        true
    };

    this.guardandoEmpleado =
      true;

    this.empleadoService
      .crear(
        this.idLocal,
        datos
      )
      .subscribe(
        (respuesta: any) => {

          this.guardandoEmpleado =
            false;

          this.mostrarFormularioEmpleado =
            false;

          this.nombreEmpleado = '';

          this.apellidoEmpleado = '';

          this.cargarEmpleados();
        },
        (error: any) => {

          console.log(
            'ERROR CREANDO EMPLEADO:',
            error
          );

          this.guardandoEmpleado =
            false;

          this.errorEmpleado =
            'No se pudo guardar el empleado.';
        }
      );
  }

  // =====================================================
  // MENU PREGUNTA
  // =====================================================

  toggleMenuPregunta(
    idPregunta: number
  ): void {

    if (
      this.menuPreguntaAbierto ===
      idPregunta
    ) {

      this.menuPreguntaAbierto = 0;

    } else {

      this.menuPreguntaAbierto =
        idPregunta;
    }
  }

  cerrarMenus(): void {

    this.menuPreguntaAbierto = 0;
  }

  // =====================================================
  // NOMBRE TIPO
  // =====================================================

  obtenerNombreTipo(
    tipo: string
  ): string {

    switch (tipo) {

      case 'CALIFICACION':
        return 'Calificación';

      case 'EMPLEADO':
        return 'Empleado';

      case 'OPCION':
        return 'Opciones';

      case 'TEXTO':
        return 'Texto';

      default:
        return tipo || 'Pregunta';
    }
  }

  obtenerIconoTipo(
    tipo: string
  ): string {

    switch (tipo) {

      case 'CALIFICACION':
        return '⭐';

      case 'EMPLEADO':
        return '👤';

      case 'OPCION':
        return '🔘';

      case 'TEXTO':
        return '✍️';

      default:
        return '❓';
    }
  }

  // =====================================================
  // DATOS DEL PREVIEW
  // =====================================================

  obtenerOpcionesPreview(
    pregunta: any
  ): any[] {

    if (
      !pregunta ||
      pregunta.tipo !==
      'OPCION'
    ) {

      return [];
    }

    return this.opcionesPregunta;
  }

  // =====================================================
  // VISTA PREVIA COMPLETA
  // =====================================================

  verVistaPrevia(): void {

    sessionStorage.setItem(
      'empleadosSeleccionadosPorPregunta',
      JSON.stringify(
        this.empleadosSeleccionadosPorPregunta
      )
    );

    this.router.navigate([
      '/dashboard/encuesta',
      this.idEncuesta,
      'vista-previa'
    ]);
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
