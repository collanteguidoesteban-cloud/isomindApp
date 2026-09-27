import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalService } from '../../services/local.service';
import { EncuestaService } from '../../services/encuesta.service';
import { RespuestaService } from '../../services/respuesta.service';
import { PreguntaService } from '../../services/pregunta.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario: any = null;
  local: any = null;
  locales: any[] = [];
  encuestas: any[] = [];
  menuAbierto: boolean = false;

  respuestas: any[] = [];
  mostrarRespuestas: boolean = false;
  cargandoRespuestas: boolean = false;
  encuestaSeleccionada: any = null;
  preguntasRespuesta: any[] = [];

  constructor(
    private authService: AuthService,
    private localService: LocalService,
    private encuestaService: EncuestaService,
    private respuestaService: RespuestaService,
    private preguntaService: PreguntaService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.cargarPerfil();
    this.cargarLocal();
  }

  cargarPerfil(): void {

    this.authService.perfil().subscribe(
      (respuesta: any) => {

        console.log('PERFIL CORRECTO:', respuesta);

        this.usuario = respuesta;

      },
      (error: any) => {

        console.log('ERROR PERFIL:', error);

        if (error.status === 401) {

          localStorage.removeItem('token');
          localStorage.removeItem('email');
          localStorage.removeItem('nombre');

          this.router.navigate(['/login']);
        }
      }
    );
  }


  obtenerUrlEncuesta(encuesta: any): string {

    if (!this.local || !encuesta) {
      return '';
    }

    return window.location.origin +
      '/opinar/' +
      this.local.slug +
      '/' +
      encuesta.slug;
  }




  cargarLocal(): void {

    this.localService.obtener().subscribe(
      (respuesta: any[]) => {

        console.log('LOCALES:', respuesta);

        this.locales = respuesta;

        if (this.locales.length > 0) {

          this.local = this.locales[0];

          localStorage.setItem(
            'localSeleccionado',
            this.local.id.toString()
          );

          console.log('LOCAL SELECCIONADO:', this.local);

          this.cargarEncuestas();

        }

      },
      (error: any) => {

        console.log('ERROR LOCAL:', error);

      }
    );
  }






  cambiarLocal(event: any): void {

    var indice = event.target.selectedIndex;

    this.local = this.locales[indice];

    if (!this.local) {
      return;
    }

    localStorage.setItem(
      'localSeleccionado',
      this.local.id.toString()
    );

    console.log(
      'LOCAL CAMBIADO:',
      this.local
    );

    this.cargarEncuestas();
  }






  abrirEncuesta(encuesta: any): void
  {
    var url = this.obtenerUrlEncuesta(encuesta);
    if (!url) { return; } window.open(url, '_blank');
  }




  crearEncuesta(): void {

    if (!this.local) {

      console.log('NO HAY LOCAL SELECCIONADO');

      return;
    }

    localStorage.setItem(
      'localSeleccionado',
      this.local.id.toString()
    );

    console.log(
      'CREANDO ENCUESTA PARA LOCAL:',
      this.local
    );

    this.router.navigate(['/dashboard/crear-encuesta']);
  }






  cargarEncuestas(): void {

    if (!this.local) {

      this.encuestas = [];

      return;
    }

    console.log(
      'CARGANDO ENCUESTAS DEL LOCAL:',
      this.local.id
    );

    this.encuestaService
      .obtenerPorLocal(this.local.id)
      .subscribe(
        (respuesta: any[]) => {

          console.log(
            'ENCUESTAS:',
            respuesta
          );

          this.encuestas = respuesta;

        },
        (error: any) => {

          console.log(
            'ERROR ENCUESTAS:',
            error
          );

          this.encuestas = [];
        }
      );
  }










  obtenerPregunta(
    idPregunta: number
  ): any {

    var pregunta =
      this.preguntasRespuesta.find(
        (x: any) => x.id === idPregunta
      );

    return pregunta;
  }




  cerrarRespuestas(): void {

    this.mostrarRespuestas = false;

    this.respuestas = [];

    this.encuestaSeleccionada = null;

  }


  obtenerTextoPregunta(
    idPregunta: number
  ): string {

    if (!this.encuestaSeleccionada) {
      return '';
    }

    var pregunta = this.encuestaSeleccionada.preguntas
      ? this.encuestaSeleccionada.preguntas.find(
        (x: any) => x.id === idPregunta
      )
      : null;

    if (!pregunta) {
      return 'Pregunta';
    }

    return pregunta.texto;
  }

  obtenerEstrellas(
    valor: string
  ): number[] {

    var cantidad = Number(valor);

    if (isNaN(cantidad)) {
      cantidad = 0;
    }

    return [1, 2, 3, 4, 5];
  }



  esEstrellaSeleccionada(
    valor: string,
    estrella: number
  ): boolean {

    return Number(valor) >= estrella;
  }






  abrirMenu(): void {
    this.menuAbierto = true;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  cerrarSesion(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('nombre');

    this.router.navigate(['/login']);
  }












}
