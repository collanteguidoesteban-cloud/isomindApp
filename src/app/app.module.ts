import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { FormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { CrearLocalComponent } from './pages/crear-local/crear-local.component';
import { CrearEncuestaComponent } from './pages/crear-encuesta/crear-encuesta.component';
import { PreguntasEncuestaComponent } from './pages/preguntas-encuesta/preguntas-encuesta.component';
import { OpinarComponent } from './pages/opinar/opinar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { RespuestasEncuestaComponent } from './pages/respuestas-encuesta/respuestas-encuesta.component';
import { VistaPreviaEncuestaComponent } from './pages/vista-previa-encuesta/vista-previa-encuesta.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    RegistroComponent,
    CrearLocalComponent,
    CrearEncuestaComponent,
    PreguntasEncuestaComponent,
    OpinarComponent,
    RespuestasEncuestaComponent,
    VistaPreviaEncuestaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
