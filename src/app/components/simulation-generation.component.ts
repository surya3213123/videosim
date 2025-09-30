import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimulationService } from '../services/simulation.service';
import { SimulationState, ProcessingStep } from '../models/simulation.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-simulation-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="simulation-page" *ngIf="state">
      <div class="container">
        <!-- Processing Steps -->
        <div class="processing-section" *ngIf="state.isProcessing">
          <div class="card-glass processing-card fade-in">
            <h2 class="processing-title">
              <div class="processing-icon spin">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              </div>
              Generating Simulation
            </h2>
            
            <div class="steps-container">
              <div *ngFor="let step of state.processingSteps; let i = index" 
                   class="processing-step"
                   [class.active]="step.status === 'processing'"
                   [class.completed]="step.status === 'completed'">
                <div class="step-indicator">
                  <div class="step-number" *ngIf="step.status === 'pending'">{{ i + 1 }}</div>
                  <div class="step-spinner spin" *ngIf="step.status === 'processing'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                  </div>
                  <div class="step-check" *ngIf="step.status === 'completed'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                </div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                  <div class="progress-bar" *ngIf="step.status === 'processing'">
                    <div class="progress-fill" [style.width.%]="step.progress"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="results-section" *ngIf="!state.isProcessing && state.generatedContent">
          <div class="results-grid">
            <!-- Left Panel -->
            <div class="left-panel">
              <!-- Selected Video -->
              <div class="card video-section fade-in">
                <h3 class="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="23,7 16,12 23,17 23,7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                  Input Video
                </h3>
                <div class="video-info">
                  <div class="video-thumbnail">
                    <div class="video-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polygon points="5,3 19,12 5,21 5,3"/>
                      </svg>
                    </div>
                  </div>
                  <div class="video-details">
                    <h4>{{ getVideoTitle() }}</h4>
                    <p>{{ getVideoDescription() }}</p>
                  </div>
                </div>
              </div>

              <!-- Natural Language Description -->
              <div class="card nl-section fade-in">
                <h3 class="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  AI Generated Description
                </h3>
                <div class="nl-content">
                  <p>{{ state.generatedContent.naturalLanguage }}</p>
                </div>
              </div>

              <!-- Scenario Editor -->
              <div class="card editor-section fade-in">
                <h3 class="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Scenario Editor
                </h3>
                <div class="editor-container">
                  <textarea 
                    class="code-editor"
                    [(ngModel)]="jsonContent"
                    (blur)="updateJsonContent()"
                    placeholder="JSON scenario content..."
                    rows="15">
                  </textarea>
                </div>
              </div>
            </div>

            <!-- Right Panel -->
            <div class="right-panel">
              <!-- Preview Section -->
              <div class="card preview-section fade-in">
                <h3 class="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Simulation Preview
                </h3>
                
                <div class="preview-container">
                  <div class="simulation-viewer">
                    <div class="simulation-placeholder">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      <p>Simulation will appear here</p>
                    </div>
                  </div>
                  
                  <button class="btn btn-success generate-btn" (click)="generatePreview()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="5,3 19,12 5,21 5,3"/>
                    </svg>
                    Generate Preview
                  </button>
                </div>
              </div>

              <!-- Download Section -->
              <div class="card download-section fade-in">
                <h3 class="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Files
                </h3>
                
                <div class="download-options">
                  <button class="btn btn-outline download-btn" (click)="downloadOpenScenario()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    OpenSCENARIO
                  </button>
                  
                  <button class="btn btn-outline download-btn" (click)="downloadOpenDrive()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    OpenDRIVE
                  </button>
                  
                  <button class="btn btn-primary download-btn" (click)="downloadAll()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <path d="M9 9h6v6H9z"/>
                    </svg>
                    Download All
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="card actions-section fade-in">
                <h3 class="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Actions
                </h3>
                
                <div class="action-buttons">
                  <button class="btn btn-secondary" (click)="startOver()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="1,4 1,10 7,10"/>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                    Start Over
                  </button>
                  
                  <button class="btn btn-primary" (click)="regenerate()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .simulation-page {
      min-height: 100vh;
      padding: 120px 0 80px;
    }

    .processing-section {
      margin-bottom: 40px;
    }

    .processing-card {
      padding: 40px;
      text-align: center;
    }

    .processing-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 40px;
    }

    .processing-icon {
      color: #3b82f6;
    }

    .steps-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .processing-step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .processing-step.active,
    .processing-step.completed {
      opacity: 1;
    }

    .processing-step:last-child {
      border-bottom: none;
    }

    .step-indicator {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(148, 163, 184, 0.2);
      color: #94a3b8;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .processing-step.active .step-indicator {
      background: #3b82f6;
      color: white;
    }

    .processing-step.completed .step-indicator {
      background: #10b981;
      color: white;
    }

    .step-content {
      flex: 1;
      text-align: left;
    }

    .step-content h4 {
      color: #f8fafc;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .step-content p {
      color: #94a3b8;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .progress-bar {
      height: 4px;
      background: rgba(148, 163, 184, 0.2);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transition: width 0.3s ease;
    }

    .results-section {
      
    }

    .results-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 32px;
    }

    .left-panel,
    .right-panel {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #f8fafc;
      margin-bottom: 16px;
    }

    .video-section {
      padding: 24px;
    }

    .video-info {
      display: flex;
      gap: 16px;
    }

    .video-thumbnail {
      width: 120px;
      height: 80px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .video-placeholder {
      color: #3b82f6;
    }

    .video-details h4 {
      color: #f8fafc;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .video-details p {
      color: #94a3b8;
      font-size: 14px;
    }

    .nl-section {
      padding: 24px;
    }

    .nl-content {
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.1);
      border-radius: 8px;
      padding: 20px;
    }

    .nl-content p {
      color: #e2e8f0;
      line-height: 1.6;
      margin: 0;
    }

    .editor-section {
      padding: 24px;
    }

    .editor-container {
      
    }

    .code-editor {
      width: 100%;
      background: #0f172a;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 8px;
      padding: 16px;
      color: #e2e8f0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: 1.5;
      resize: vertical;
    }

    .code-editor:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .preview-section {
      padding: 24px;
    }

    .preview-container {
      
    }

    .simulation-viewer {
      height: 200px;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .simulation-placeholder {
      text-align: center;
      color: #64748b;
    }

    .simulation-placeholder p {
      margin-top: 12px;
      font-size: 14px;
    }

    .generate-btn {
      width: 100%;
    }

    .download-section {
      padding: 24px;
    }

    .download-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .download-btn {
      width: 100%;
      justify-content: flex-start;
    }

    .actions-section {
      padding: 24px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-buttons .btn {
      width: 100%;
    }

    @media (max-width: 1200px) {
      .results-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .right-panel {
        order: -1;
      }
    }

    @media (max-width: 768px) {
      .processing-card {
        padding: 24px;
      }
      
      .processing-title {
        font-size: 1.25rem;
      }
      
      .video-info {
        flex-direction: column;
      }
      
      .video-thumbnail {
        width: 100%;
        height: 120px;
      }
    }
  `]
})
export class SimulationGenerationComponent implements OnInit, OnDestroy {
  state: SimulationState | null = null;
  jsonContent: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.simulationService.state$.subscribe(state => {
        this.state = state;
        if (state.generatedContent) {
          this.jsonContent = JSON.stringify(state.generatedContent.jsonScenario, null, 2);
        }
        
        // Auto-start generation if video is selected and not processing
        if (state.selectedVideo && !state.isProcessing && !state.generatedContent) {
          this.simulationService.generateSimulation();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getVideoTitle(): string {
    if (!this.state?.selectedVideo) return 'Unknown Video';
    
    if (this.state.selectedVideo instanceof File) {
      return this.state.selectedVideo.name;
    }
    
    return this.state.selectedVideo.title;
  }

  getVideoDescription(): string {
    if (!this.state?.selectedVideo) return 'No description available';
    
    if (this.state.selectedVideo instanceof File) {
      return `Uploaded video file (${this.formatFileSize(this.state.selectedVideo.size)})`;
    }
    
    return this.state.selectedVideo.description;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  updateJsonContent(): void {
    this.simulationService.updateJsonScenario(this.jsonContent);
  }

  generatePreview(): void {
    console.log('Generating simulation preview...');
    // This would integrate with esmini or other simulation engine
  }

  downloadOpenScenario(): void {
    if (this.state?.generatedContent) {
      this.simulationService.downloadFile(
        this.state.generatedContent.openScenarioXml,
        'scenario.xosc',
        'application/xml'
      );
    }
  }

  downloadOpenDrive(): void {
    if (this.state?.generatedContent) {
      this.simulationService.downloadFile(
        this.state.generatedContent.openDriveXml,
        'road.xodr',
        'application/xml'
      );
    }
  }

  downloadAll(): void {
    this.downloadOpenScenario();
    this.downloadOpenDrive();
    
    if (this.state?.generatedContent) {
      // Download JSON scenario
      this.simulationService.downloadFile(
        JSON.stringify(this.state.generatedContent.jsonScenario, null, 2),
        'scenario.json',
        'application/json'
      );
    }
  }

  startOver(): void {
    window.location.reload();
  }

  regenerate(): void {
    if (this.state?.selectedVideo) {
      this.simulationService.generateSimulation();
    }
  }
}