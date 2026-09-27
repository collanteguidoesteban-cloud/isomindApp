import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { CrearLocalComponent } from './pages/crear-local/crear-local.component';
import { CrearEncuestaComponent } from './pages/crear-encuesta/crear-encuesta.component';
import { PreguntasEncuestaComponent } from './pages/preguntas-encuesta/preguntas-encuesta.component';
import { OpinarComponent } from './pages/opinar/opinar.component';
import { RespuestasEncuestaComponent } from './pages/respuestas-encuesta/respuestas-encuesta.component';
import { VistaPreviaEncuestaComponent } from './pages/vista-previa-encuesta/vista-previa-encuesta.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'registro',
    component: RegistroComponent
  },

  {
    path: 'dashboard/crear-local',
    component: CrearLocalComponent

  },

  {
    path: 'dashboard/crear-encuesta',
    component: CrearEncuestaComponent
  },

  {
    path: 'dashboard/encuesta/:idEncuesta/preguntas',
    component: PreguntasEncuestaComponent
  },

  {
    path: 'opinar/:slugLocal/:slugEncuesta',
    component: OpinarComponent
  },

  {
    path: 'dashboard/encuesta/:idEncuesta/respuestas',
    component: RespuestasEncuestaComponent
  },

  {
    path: 'dashboard/encuesta/:idEncuesta/vista-previa',
    component: VistaPreviaEncuestaComponent
  },



  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
