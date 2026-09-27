import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {


  private apiUrl = environment.apiUrl + '/Encuesta';

  constructor(private http: HttpClient) {
  }

  obtenerPorLocal(idLocal: number): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl + '/local/' + idLocal
    );
  }

  obtenerPorId(id: number): Observable<any> {

    return this.http.get<any>(
      this.apiUrl + '/' + id
    );
  }

  crear(idLocal: number, datos: any): Observable<any> {

    return this.http.post<any>(
      this.apiUrl + '/local/' + idLocal,
      datos
    );
  }

  editar(idLocal: number, datos: any): Observable<any> {

    return this.http.put<any>(
      this.apiUrl + '/local/' + idLocal,
      datos
    );
  }

  eliminar(idLocal: number, id: number): Observable<any> {

    return this.http.delete<any>(
      this.apiUrl + '/local/' + idLocal + '/' + id
    );
  }
}
