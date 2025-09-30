import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VideoSimulationComponent } from './pages/video-simulation/video-simulation.component';
import { NlSimulationComponent } from './pages/nl-simulation/nl-simulation.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'video-simulation', component: VideoSimulationComponent },
  { path: 'nl-simulation', component: NlSimulationComponent },
  { path: '**', redirectTo: '' }
];