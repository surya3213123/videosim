import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';
import { HeaderComponent } from './app/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app">
      <app-header></app-header>
      <router-outlet></router-outlet>
      
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
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(1deg); }
      66% { transform: translate(-20px, 20px) rotate(-1deg); }
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));