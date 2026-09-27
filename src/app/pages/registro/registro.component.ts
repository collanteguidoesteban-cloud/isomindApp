import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  negocio: string = '';
  contacto: string = '';
  telefono: string = '';
  email: string = '';
  password: string = '';
  urlLocal: string = '';
  direccion: string = '';
  correo: string = '';

  mostrarPassword: boolean = false;

  aceptaTerminos: boolean = false;

  seguridadPassword: number = 0;
  textoSeguridad: string = 'Muy débil';


  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }


  verificarPassword(): void {

    var passwordLength = this.password.length;

    if (passwordLength === 0) {

      this.seguridadPassword = 0;
      this.textoSeguridad = 'Muy débil';

    } else if (passwordLength < 6) {

      this.seguridadPassword = 25;
      this.textoSeguridad = 'Muy débil';

    } else if (passwordLength < 8) {

      this.seguridadPassword = 50;
      this.textoSeguridad = 'Débil';

    } else if (passwordLength < 10) {

      this.seguridadPassword = 75;
      this.textoSeguridad = 'Buena';

    } else {

      this.seguridadPassword = 100;
      this.textoSeguridad = 'Muy buena';
    }
  }


  registrar(): void {

    if (!this.aceptaTerminos) {
      return;
    }

    console.log('Negocio:', this.negocio);
    console.log('Contacto:', this.contacto);
    console.log('Teléfono:', this.telefono);
    console.log('Email:', this.email);


    var datos = {
      nombre: this.contacto,
      email: this.email,
      password: this.password,
      nombreLocal: this.negocio,
      urlLocal: this.urlLocal,
      direccion: this.direccion,
      correo: this.correo,
      telefono: this.telefono
    };


    this.authService.registrar(datos).subscribe(
      (respuesta: any) => {

        console.log('Registro correcto');
        console.log('Respuesta:', respuesta);

        alert('Usuario registrado correctamente.');

        this.router.navigate(['/login']);
      },
      (error: any) => {

        console.log('Error de registro:', error);

        if (error.status === 400) {
          alert('El email ya está registrado.');
        } else {
          alert('Ocurrió un error al registrar el usuario.');
        }
      }
    );
  }

}
