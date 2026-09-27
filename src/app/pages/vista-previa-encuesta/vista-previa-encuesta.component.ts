import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreguntaService } from '../../services/pregunta.service';

@Component({
  selector: 'app-vista-previa-encuesta',
  templateUrl: './vista-previa-encuesta.component.html',
  styleUrls: ['./vista-previa-encuesta.component.css']
})
export class VistaPreviaEncuestaComponent implements OnInit {

  idEncuesta: number = 0;

  preguntas: any[] = [];

  cargando: boolean = true;

  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private preguntaService: PreguntaService
  ) {
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {

      this.idEncuesta =
        Number(params['idEncuesta']);

      console.log(
        'ID ENCUESTA VISTA PREVIA:',
        this.idEncuesta
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
            'PREGUNTAS VISTA PREVIA:',
            respuesta
          );

          this.preguntas = respuesta;

          this.cargando = false;
        },
        (error: any) => {

          console.log(
            'ERROR VISTA PREVIA:',
            error
          );

          this.error =
            'No se pudieron cargar las preguntas.';

          this.cargando = false;
        }
      );
  }

  volverEditar(): void {

    this.router.navigate([
      '/dashboard/encuesta',
      this.idEncuesta,
      'preguntas'
    ]);
  }

}
