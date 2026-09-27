import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaService } from '../../services/pregunta.service';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-preguntas-encuesta',
  templateUrl: './preguntas-encuesta.component.html',
  styleUrls: ['./preguntas-encuesta.component.css']
})
export class PreguntasEncuestaComponent implements OnInit {

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

  mostrarFormulario: boolean = false;

  textoPregunta: string = '';
  tipoPregunta: string = 'CALIFICACION';
  ordenPregunta: number = 1;
  obligatoria: boolean = true;
  activa: boolean = true;

  guardandoPregunta: boolean = false;
  errorPregunta: string = '';

  mostrarFormularioEmpleado: boolean = false;

  nombreEmpleado: string = '';
  apellidoEmpleado: string = '';

  guardandoEmpleado: boolean = false;
  errorEmpleado: string = '';

  modoEdicion: boolean = false;
  idPreguntaEditando: number = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private preguntaService: PreguntaService,
    private empleadoService: EmpleadoService
  ) {
  }


  ngOnInit(): void {

    var localGuardado =
      localStorage.getItem('localSeleccionado');

    if (localGuardado) {
      this.idLocal = Number(localGuardado);
    }

    this.route.params.subscribe(params => {

      this.idEncuesta =
        Number(params['idEncuesta']);

      console.log(
        'ID ENCUESTA:',
        this.idEncuesta
      );

      console.log(
        'ID LOCAL:',
        this.idLocal
      );

      if (!this.idEncuesta) {

        this.error =
          'No se encontró la encuesta.';

        this.cargando = false;

        return;
      }

      this.cargarPreguntas();
    });
  }


  cargarPreguntas(): void {

    this.cargando = true;

    this.preguntaService
      .obtenerPorEncuesta(this.idEncuesta)
      .subscribe(
        (respuesta: any[]) => {

          console.log(
            'PREGUNTAS:',
            respuesta
          );

          this.preguntas = respuesta;

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


  agregarPregunta(): void {

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
  }


  editarPregunta(pregunta: any): void {

    this.errorPregunta = '';

    this.modoEdicion = true;

    this.idPreguntaEditando = pregunta.id;

    this.textoPregunta = pregunta.texto;

    this.tipoPregunta = pregunta.tipo;

    this.ordenPregunta = pregunta.orden;

    this.obligatoria = pregunta.obligatoria;

    this.activa = pregunta.activa;

    this.empleadosSeleccionados =
      this.empleadosSeleccionadosPorPregunta[
      pregunta.id
      ] || [];

    this.opcionesPregunta = [];
    this.nuevaOpcion = '';

    this.mostrarFormulario = true;


    if (this.tipoPregunta === 'EMPLEADO') {

      this.cargarEmpleados();

    }


    if (this.tipoPregunta === 'OPCION') {

      this.cargarOpciones(
        pregunta.id
      );

    }
  }


  cancelarPregunta(): void {

    this.mostrarFormulario = false;

    this.errorPregunta = '';

    this.modoEdicion = false;

    this.idPreguntaEditando = 0;

    this.empleadosSeleccionados = [];

    this.opcionesPregunta = [];

    this.nuevaOpcion = '';
  }


  cambiarTipoPregunta(): void {

    console.log(
      'TIPO PREGUNTA:',
      this.tipoPregunta
    );

    this.empleadosSeleccionados = [];


    if (this.tipoPregunta === 'EMPLEADO') {

      this.cargarEmpleados();

    }


    if (this.tipoPregunta === 'OPCION') {

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


    if (this.tipoPregunta !== 'OPCION') {

      this.opcionesPregunta = [];

      this.nuevaOpcion = '';

    }
  }


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
      ] = this.empleadosSeleccionados;

    }


    console.log(
      'EMPLEADOS SELECCIONADOS:',
      this.empleadosSeleccionados
    );

    console.log(
      'SELECCION POR PREGUNTA:',
      this.empleadosSeleccionadosPorPregunta
    );
  }


  cargarEmpleados(): void {

    if (!this.idLocal) {

      this.errorPregunta =
        'No se encontró el local seleccionado.';

      return;
    }

    this.cargandoEmpleados = true;

    this.empleadoService
      .obtenerPorLocal(this.idLocal)
      .subscribe(
        (respuesta: any[]) => {

          console.log(
            'EMPLEADOS:',
            respuesta
          );

          this.empleados = respuesta;

          this.cargandoEmpleados = false;
        },
        (error: any) => {

          console.log(
            'ERROR EMPLEADOS:',
            error
          );

          this.empleados = [];

          this.cargandoEmpleados = false;

          this.errorPregunta =
            'No se pudieron cargar los empleados.';
        }
      );
  }


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


    // Validamos las opciones si es tipo OPCION

    if (
      this.tipoPregunta === 'OPCION' &&
      this.opcionesPregunta.length === 0
    ) {

      this.errorPregunta =
        'Debés agregar al menos una opción.';

      return;
    }


    this.guardandoPregunta = true;


    // =====================================================
    // EDITAR
    // =====================================================

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


      console.log(
        'DATOS EDITAR:',
        datosEdicion
      );


      this.preguntaService
        .editar(datosEdicion)
        .subscribe(
          (respuesta: any) => {

            console.log(
              'PREGUNTA EDITADA:',
              respuesta
            );


            // Guardar empleados
            this.guardarEmpleadosPregunta(
              this.idPreguntaEditando
            );


            // Guardar opciones
            this.guardarOpcionesPregunta(
              this.idPreguntaEditando
            );


            this.guardandoPregunta = false;

            this.mostrarFormulario = false;

            this.modoEdicion = false;

            this.idPreguntaEditando = 0;

            this.opcionesPregunta = [];

            this.nuevaOpcion = '';

            this.cargarPreguntas();
          },
          (error: any) => {

            console.log(
              'ERROR EDITANDO PREGUNTA:',
              error
            );

            this.guardandoPregunta = false;

            this.errorPregunta =
              'No se pudo editar la pregunta.';
          }
        );


    } else {

      // =====================================================
      // CREAR
      // =====================================================

      var datos = {

        texto: this.textoPregunta,

        tipo: this.tipoPregunta,

        orden: this.ordenPregunta,

        obligatoria: this.obligatoria,

        activa: this.activa
      };


      console.log(
        'DATOS CREAR:',
        datos
      );


      this.preguntaService
        .crear(
          this.idEncuesta,
          datos
        )
        .subscribe(
          (respuesta: any) => {

            console.log(
              'PREGUNTA CREADA:',
              respuesta
            );


            // Guardar empleados
            this.guardarEmpleadosPregunta(
              respuesta.id
            );


            // Guardar opciones
            this.guardarOpcionesPregunta(
              respuesta.id
            );


            this.guardandoPregunta = false;

            this.mostrarFormulario = false;

            this.opcionesPregunta = [];

            this.nuevaOpcion = '';

            this.cargarPreguntas();
          },
          (error: any) => {

            console.log(
              'ERROR CREANDO PREGUNTA:',
              error
            );

            this.guardandoPregunta = false;

            this.errorPregunta =
              'No se pudo guardar la pregunta.';
          }
        );
    }
  }


  // =====================================================
  // GUARDAR EMPLEADOS
  // =====================================================

  guardarEmpleadosPregunta(
    idPregunta: number
  ): void {

    // Solo guardamos empleados
    // si la pregunta es de tipo EMPLEADO.

    if (this.tipoPregunta !== 'EMPLEADO') {
      return;
    }


    var idsEmpleados =
      this.empleadosSeleccionados.map(
        x => x.id
      );


    console.log(
      'ID PREGUNTA:',
      idPregunta
    );

    console.log(
      'IDS EMPLEADOS:',
      idsEmpleados
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
  // GUARDAR OPCIONES
  // =====================================================

  guardarOpcionesPregunta(
    idPregunta: number
  ): void {

    // Solo guardamos opciones
    // si la pregunta es de tipo OPCION.

    if (this.tipoPregunta !== 'OPCION') {
      return;
    }


    if (
      !this.opcionesPregunta ||
      this.opcionesPregunta.length === 0
    ) {

      return;
    }


    console.log(
      'ID PREGUNTA OPCIONES:',
      idPregunta
    );

    console.log(
      'OPCIONES A GUARDAR:',
      this.opcionesPregunta
    );


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
  // ELIMINAR PREGUNTA
  // =====================================================

  eliminarPregunta(
    pregunta: any
  ): void {

    var confirmar = confirm(
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

          console.log(
            'PREGUNTA ELIMINADA:',
            respuesta
          );


          delete this.empleadosSeleccionadosPorPregunta[
            pregunta.id
          ];


          this.cargarPreguntas();
        },
        (error: any) => {

          console.log(
            'ERROR ELIMINANDO PREGUNTA:',
            error
          );


          this.error =
            'No se pudo eliminar la pregunta.';
        }
      );
  }


  // =====================================================
  // EMPLEADOS
  // =====================================================

  agregarEmpleado(): void {

    this.nombreEmpleado = '';

    this.apellidoEmpleado = '';

    this.errorEmpleado = '';

    this.mostrarFormularioEmpleado = true;
  }


  cancelarEmpleado(): void {

    this.mostrarFormularioEmpleado = false;

    this.errorEmpleado = '';
  }


  guardarEmpleado(): void {

    this.errorEmpleado = '';


    if (!this.nombreEmpleado.trim()) {

      this.errorEmpleado =
        'El nombre del empleado es obligatorio.';

      return;
    }


    if (!this.apellidoEmpleado.trim()) {

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

      nombre: this.nombreEmpleado,

      apellido: this.apellidoEmpleado,

      activo: true
    };


    console.log(
      'DATOS EMPLEADO:',
      datos
    );

    console.log(
      'ID LOCAL:',
      this.idLocal
    );


    this.guardandoEmpleado = true;


    this.empleadoService
      .crear(
        this.idLocal,
        datos
      )
      .subscribe(
        (respuesta: any) => {

          console.log(
            'EMPLEADO CREADO:',
            respuesta
          );


          this.guardandoEmpleado = false;

          this.mostrarFormularioEmpleado = false;

          this.nombreEmpleado = '';

          this.apellidoEmpleado = '';

          this.cargarEmpleados();

        },
        (error: any) => {

          console.log(
            'ERROR CREANDO EMPLEADO:',
            error
          );


          this.guardandoEmpleado = false;

          this.errorEmpleado =
            'No se pudo guardar el empleado.';
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

      texto: this.nuevaOpcion.trim(),

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

    console.log(
      'CARGANDO OPCIONES DE PREGUNTA:',
      idPregunta
    );


    this.preguntaService
      .obtenerOpciones(idPregunta)
      .subscribe(
        (respuesta: any[]) => {

          console.log(
            'OPCIONES RECIBIDAS:',
            respuesta
          );

          this.opcionesPregunta =
            respuesta || [];

        },
        (error: any) => {

          console.log(
            'ERROR AL CARGAR OPCIONES:',
            error
          );

          this.opcionesPregunta = [];
        }
      );
  }


  // =====================================================
  // VISTA PREVIA
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
