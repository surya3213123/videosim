import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './app/components/header.component';
import { VideoInputComponent } from './app/components/video-input.component';
import { SimulationGenerationComponent } from './app/components/simulation-generation.component';
import { SimulationService } from './app/services/simulation.service';
import { SimulationState } from './app/models/simulation.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    VideoInputComponent,
    SimulationGenerationComponent
  ],
  template: `
    <div class="app">
      <app-header></app-header>
      
      <main class="main-content">
        <app-video-input *ngIf="!hasSelectedVideo"></app-video-input>
        <app-simulation-generation *ngIf="hasSelectedVideo"></app-simulation-generation>
      </main>
      
      <!-- Background Elements -->
      <div class="bg-elements">
        <div class="bg-grid"></div>
        <div class="bg-gradient-1"></div>
        <div class="bg-gradient-2"></div>
      </div>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
    }

    .main-content {
      position: relative;
      z-index: 1;
    }

    .bg-elements {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .bg-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 20s linear infinite;
    }

    .bg-gradient-1 {
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 200%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
      animation: float 15s ease-in-out infinite;
    }

    .bg-gradient-2 {
      position: absolute;
      bottom: -50%;
      left: -50%;
      width: 100%;
      height: 200%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%);
      animation: float 20s ease-in-out infinite reverse;
    }

    @keyframes gridMove {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(50px, 50px);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      33% {
        transform: translate(30px, -30px) rotate(1deg);
      }
      66% {
        transform: translate(-20px, 20px) rotate(-1deg);
      }
    }
  `]
})
export class App implements OnInit {
  hasSelectedVideo = false;

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.simulationService.state$.subscribe((state: SimulationState) => {
      this.hasSelectedVideo = !!state.selectedVideo;
    });
  }
}

bootstrapApplication(App).catch(err => console.error(err));