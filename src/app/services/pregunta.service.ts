import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {


  private apiUrl = environment.apiUrl + '/Pregunta';

  constructor(private http: HttpClient) {
  }

  // Obtener todas las preguntas de una encuesta
  obtenerPorEncuesta(
    idEncuesta: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl +
      '/encuesta/' +
      idEncuesta
    );
  }

  // Obtener una pregunta por ID
  obtenerPorId(
    id: number
  ): Observable<any> {

    return this.http.get<any>(
      this.apiUrl +
      '/' +
      id
    );
  }

  // Crear pregunta
  crear(
    idEncuesta: number,
    datos: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl +
      '/encuesta/' +
      idEncuesta,
      datos
    );
  }

  // Editar pregunta
  editar(
    datos: any
  ): Observable<any> {

    return this.http.put<any>(
      this.apiUrl,
      datos
    );
  }

  // Eliminar pregunta
  eliminar(
    idEncuesta: number,
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      this.apiUrl +
      '/' +
      id
    );
  }

  // =====================================================
  // EMPLEADOS
  // =====================================================

  // Guardar empleados asociados a una pregunta
  guardarEmpleados(
    idPregunta: number,
    idsEmpleados: number[]
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl +
      '/' +
      idPregunta +
      '/empleados',
      idsEmpleados
    );
  }

  // Obtener empleados asociados a una pregunta
  obtenerEmpleados(
    idPregunta: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl +
      '/' +
      idPregunta +
      '/empleados'
    );
  }

  // =====================================================
  // OPCIONES
  // =====================================================

  // Obtener opciones de una pregunta
  obtenerOpciones(
    idPregunta: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl.replace(
        '/Pregunta',
        '/OpcionPregunta'
      ) +
      '/pregunta/' +
      idPregunta
    );
  }

  // Guardar opciones de una pregunta
  guardarOpciones(
    idPregunta: number,
    opciones: any[]
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl.replace(
        '/Pregunta',
        '/OpcionPregunta'
      ) +
      '/pregunta/' +
      idPregunta,
      opciones
    );
  }

}
