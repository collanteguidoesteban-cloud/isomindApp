import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../../services/local.service';

@Component({
  selector: 'app-crear-local',
  templateUrl: './crear-local.component.html',
  styleUrls: ['./crear-local.component.css']
})
export class CrearLocalComponent {

  nombre: string = '';
  direccion: string = '';
  telefono: string = '';
  correo: string = '';
  url: string = '';
  logoUrl: string = '';

  guardando: boolean = false;
  error: string = '';

  constructor(
    private localService: LocalService,
    private router: Router
  ) {
  }

  crearLocal(): void {

    this.error = '';

    if (!this.nombre.trim()) {
      this.error = 'El nombre del local es obligatorio.';
      return;
    }

    const datos = {
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      correo: this.correo,
      url: this.url,
      logoUrl: this.logoUrl
    };

    this.guardando = true;

    this.localService.crear(datos).subscribe(
      (respuesta: any) => {

        console.log('LOCAL CREADO:', respuesta);

        this.guardando = false;

        this.router.navigate(['/dashboard']);

      },
      (error: any) => {

        console.log('ERROR CREANDO LOCAL:', error);

        this.guardando = false;

        this.error = 'No se pudo crear el local.';

      }
    );
  }
}
