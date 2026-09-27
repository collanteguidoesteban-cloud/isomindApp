import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  private apiUrl = environment.apiUrl + '/Respuesta';

  constructor(
    private http: HttpClient
  ) {
  }


  // =========================
  // CREAR RESPUESTA
  // =========================

  crear(
    datos: any
  ): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      datos
    );

  }


  // =========================
  // RESPUESTAS POR ENCUESTA
  // =========================

  // =========================
  // RESPUESTAS POR ENCUESTA
  // =========================

  obtenerPorEncuesta(
    idEncuesta: number,
    pagina: number,
    cantidadPorPagina: number,
    fechaDesde: string,
    fechaHasta: string,
    idEmpleado: number,
    calificacion: number,
    filtrosOpciones: any
  ): Observable<any> {

    var url =
      this.apiUrl +
      '/encuesta/' +
      idEncuesta +
      '?pagina=' +
      pagina +
      '&cantidadPorPagina=' +
      cantidadPorPagina;


    // =========================
    // FECHA DESDE
    // =========================

    if (fechaDesde) {

      url +=
        '&fechaDesde=' +
        fechaDesde;

    }


    // =========================
    // FECHA HASTA
    // =========================

    if (fechaHasta) {

      url +=
        '&fechaHasta=' +
        fechaHasta;

    }


    // =========================
    // EMPLEADO
    // =========================

    if (idEmpleado > 0) {

      url +=
        '&idEmpleado=' +
        idEmpleado;

    }


    // =========================
    // CALIFICACION
    // =========================

    if (calificacion > 0) {

      url +=
        '&calificacion=' +
        calificacion;

    }


    // =========================
    // OPCIONES
    // =========================

    if (filtrosOpciones) {

      Object.keys(filtrosOpciones).forEach(
        (idPregunta: string) => {

          var idOpcion =
            filtrosOpciones[idPregunta];


          // Ignoramos "Todas"
          if (
            idOpcion !== null &&
            idOpcion !== undefined &&
            Number(idOpcion) > 0
          ) {

            url +=
              '&filtrosOpciones=' +
              idPregunta +
              ':' +
              idOpcion;

          }

        }
      );

    }


    console.log(
      'URL RESPUESTAS:',
      url
    );


    return this.http.get<any>(url);
  }






  obtenerEstadisticas(
    idEncuesta: number,
    fechaDesde: string,
    fechaHasta: string,
    idEmpleado: number,
    calificacion: number,
    filtrosOpciones: any
  ): Observable<any> {

    var url =
      this.apiUrl +
      '/encuesta/' +
      idEncuesta +
      '/estadisticas';

    var parametros: string[] = [];

    if (fechaDesde) {
      parametros.push(
        'fechaDesde=' + fechaDesde
      );
    }

    if (fechaHasta) {
      parametros.push(
        'fechaHasta=' + fechaHasta
      );
    }

    if (idEmpleado > 0) {
      parametros.push(
        'idEmpleado=' + idEmpleado
      );
    }

    if (calificacion > 0) {
      parametros.push(
        'calificacion=' + calificacion
      );
    }

    if (filtrosOpciones) {

      Object.keys(filtrosOpciones).forEach(
        (idPregunta: string) => {

          var idOpcion =
            filtrosOpciones[idPregunta];

          if (
            idOpcion !== null &&
            idOpcion !== undefined &&
            Number(idOpcion) > 0
          ) {

            parametros.push(
              'filtrosOpciones=' +
              idPregunta +
              ':' +
              idOpcion
            );
          }
        }
      );
    }

    if (parametros.length > 0) {

      url += '?' +
        parametros.join('&');
    }

    console.log(
      'URL ESTADISTICAS:',
      url
    );

    return this.http.get<any>(url);
  }


















}
