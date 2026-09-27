
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  mostrarPassword: boolean = false;
  recordarme: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ingresar(): void {

   

    this.authService.login(this.email, this.password).subscribe(
      respuesta => {

        console.log('Login correcto');
        console.log('Respuesta:', respuesta);

        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('email', respuesta.email);
        localStorage.setItem('nombre', respuesta.nombre);

        this.router.navigate(['/dashboard']);
      },
      error => {

        console.log('Error de login:', error);

        alert('Email o contraseña incorrectos.');
      }
    );
  }
}

