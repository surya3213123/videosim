import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="logo">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <rect x="7" y="7" width="10" height="10" rx="1"/>
              </svg>
            </div>
            <div class="logo-text">
              <h2>ADAS SimGen</h2>
              <span class="logo-subtitle">Video to Simulation</span>
            </div>
          </div>
          <div class="nav-info">
            <div class="pipeline-indicator">
              <div class="pipeline-step">
                <span class="step-number">1</span>
                <span class="step-label">Video Input</span>
              </div>
              <div class="pipeline-arrow">→</div>
              <div class="pipeline-step">
                <span class="step-number">2</span>
                <span class="step-label">AI Analysis</span>
              </div>
              <div class="pipeline-arrow">→</div>
              <div class="pipeline-step">
                <span class="step-number">3</span>
                <span class="step-label">Simulation</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      width: 100%;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      z-index: 1000;
      padding: 16px 0;
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .logo-text h2 {
      color: #f8fafc;
      font-weight: 800;
      font-size: 24px;
      margin: 0;
      line-height: 1;
    }

    .logo-subtitle {
      color: #94a3b8;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pipeline-indicator {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(30, 41, 59, 0.6);
      padding: 12px 20px;
      border-radius: 12px;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .pipeline-step {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .step-number {
      width: 24px;
      height: 24px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .step-label {
      color: #e2e8f0;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .pipeline-arrow {
      color: #64748b;
      font-weight: bold;
    }

    @media (max-width: 968px) {
      .pipeline-indicator {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .logo-text h2 {
        font-size: 20px;
      }
      
      .logo-subtitle {
        font-size: 11px;
      }
    }
  `]
})
export class HeaderComponent {}