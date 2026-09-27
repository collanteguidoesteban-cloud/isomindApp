import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncuestaService } from '../../services/encuesta.service';

@Component({
  selector: 'app-crear-encuesta',
  templateUrl: './crear-encuesta.component.html',
  styleUrls: ['./crear-encuesta.component.css']
})
export class CrearEncuestaComponent implements OnInit {

  idLocal: number = 0;

  titulo: string = '';
  descripcion: string = '';
  activa: boolean = true;

  guardando: boolean = false;
  error: string = '';

  constructor(
    private encuestaService: EncuestaService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    const localGuardado = localStorage.getItem('localSeleccionado');

    if (localGuardado) {

      this.idLocal = Number(localGuardado);

    } else {

      this.error = 'No hay un local seleccionado.';

    }
  }

  crearEncuesta(): void {

    this.error = '';

    if (!this.titulo.trim()) {

      this.error = 'El título de la encuesta es obligatorio.';

      return;
    }

    if (!this.idLocal) {

      this.error = 'No hay un local seleccionado.';

      return;
    }

    const datos = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      activa: this.activa
    };

    console.log('DATOS ENCUESTA:', datos);
    console.log('ID LOCAL:', this.idLocal);

    this.guardando = true;

    this.encuestaService.crear(this.idLocal, datos).subscribe(
      (respuesta: any) => {

        console.log('ENCUESTA CREADA:', respuesta);

        this.guardando = false;

        this.router.navigate([
          '/dashboard/encuesta',
          respuesta.id,
          'preguntas'
        ]);

      },
      (error: any) => {

        console.log('ERROR CREANDO ENCUESTA:', error);

        this.guardando = false;

        this.error = 'No se pudo crear la encuesta.';
      }
    );
  }
}
