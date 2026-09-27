import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class AuthService {

  private apiUrl = environment.apiUrl + '/Auth';

  constructor(private http: HttpClient) {
  }


  login(email: string, password: string): Observable<any> {

    var datos = {
      email: email,
      password: password
    };

    return this.http.post<any>(
      this.apiUrl + '/login',
      datos
    );
  }


  registrar(datos: any): Observable<any> {

    return this.http.post<any>(
      this.apiUrl + '/registro',
      datos
    );
  }

  perfil() {

    return this.http.get<any>(
      this.apiUrl + '/perfil'
    );
  }

}
