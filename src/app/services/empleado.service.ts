import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {


  private apiUrl = environment.apiUrl + '/Empleado';

  constructor(private http: HttpClient) {
  }

  obtenerPorLocal(idLocal: number): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl + '/local/' + idLocal
    );
  }

  crear(idLocal: number, datos: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + '/local/' + idLocal,
      datos
    );
  }

  editar(datos: any): Observable<any> {
    return this.http.put<any>(
      this.apiUrl,
      datos
    );
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(
      this.apiUrl + '/' + id
    );
  }
}
