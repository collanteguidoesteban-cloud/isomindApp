import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicaService {


  private apiUrl = environment.apiUrl + '/Publica';

  constructor(private http: HttpClient) {
  }

  obtenerEncuesta(
    slugLocal: string,
    slugEncuesta: string
  ): Observable<any> {

    return this.http.get<any>(
      this.apiUrl +
      '/encuesta/' +
      slugLocal +
      '/' +
      slugEncuesta
    );
  }
}
