import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../services/simulation.service';
import { VideoScenario } from '../models/simulation.model';

@Component({
  selector: 'app-video-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-input-page">
      <div class="container">
        <!-- Hero Section -->
        <div class="hero-section fade-in">
          <h1 class="hero-title">
            Transform Your <span class="gradient-text">ADAS Videos</span> 
            <br>Into Simulation Scenarios
          </h1>
          <p class="hero-subtitle">
            Upload your driving videos or choose from our curated scenarios to generate 
            OpenSCENARIO and OpenDRIVE files for ADAS development and testing.
          </p>
        </div>

        <!-- Upload Section -->
        <div class="upload-section card-glass fade-in">
          <h2 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Upload Your Video
          </h2>
          
          <div class="upload-area" 
               (dragover)="onDragOver($event)" 
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)"
               [class.drag-over]="isDragOver">
            <input type="file" 
                   #fileInput 
                   (change)="onFileSelected($event)" 
                   accept="video/*" 
                   style="display: none;">
            
            <div class="upload-content">
              <div class="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
              </div>
              <h3>Drop your video here or click to browse</h3>
              <p>Supports MP4, AVI, MOV files up to 100MB</p>
              <button class="btn btn-outline" (click)="fileInput.click()">
                Choose File
              </button>
            </div>
          </div>

          <div *ngIf="selectedFile" class="selected-file">
            <div class="file-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span>{{ selectedFile.name }}</span>
              <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
            </div>
            <button class="btn btn-primary" (click)="processUploadedVideo()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5,3 19,12 5,21 5,3"/>
              </svg>
              Generate Simulation
            </button>
          </div>
        </div>

        <!-- Default Scenarios -->
        <div class="scenarios-section fade-in">
          <h2 class="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Example Scenarios
          </h2>
          <p class="section-subtitle">
            Choose from our pre-built scenarios to quickly explore the simulation generation pipeline
          </p>

          <div class="scenarios-grid">
            <div *ngFor="let scenario of defaultScenarios; let i = index" 
                 class="scenario-card card slide-in"
                 [style.animation-delay]="(i * 0.1) + 's'">
              <div class="scenario-thumbnail">
                <img [src]="scenario.thumbnailUrl" [alt]="scenario.title">
                <div class="scenario-overlay">
                  <div class="scenario-duration">{{ scenario.duration }}</div>
                  <div class="scenario-complexity" [class]="'complexity-' + scenario.complexity.toLowerCase()">
                    {{ scenario.complexity }}
                  </div>
                </div>
              </div>
              
              <div class="scenario-content">
                <h3 class="scenario-title">{{ scenario.title }}</h3>
                <p class="scenario-description">{{ scenario.description }}</p>
                
                <div class="scenario-tags">
                  <span *ngFor="let tag of scenario.tags" class="tag">{{ tag }}</span>
                </div>
                
                <button class="btn btn-primary scenario-btn" (click)="selectScenario(scenario)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5,3 19,12 5,21 5,3"/>
                  </svg>
                  Use This Scenario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-input-page {
      min-height: 100vh;
      padding: 120px 0 80px;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 80px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 24px;
      color: #f8fafc;
    }

    .gradient-text {
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #94a3b8;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .upload-section {
      margin-bottom: 80px;
      padding: 40px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 24px;
    }

    .section-subtitle {
      color: #94a3b8;
      margin-bottom: 40px;
      font-size: 1.1rem;
    }

    .upload-area {
      padding: 60px 40px;
      text-align: center;
      cursor: pointer;
      margin-bottom: 24px;
    }

    .upload-content h3 {
      color: #e2e8f0;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 20px 0 8px;
    }

    .upload-content p {
      color: #94a3b8;
      margin-bottom: 24px;
    }

    .upload-icon {
      color: #3b82f6;
      margin-bottom: 16px;
    }

    .selected-file {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #e2e8f0;
    }

    .file-size {
      color: #94a3b8;
      font-size: 14px;
    }

    .scenarios-section {
      margin-bottom: 80px;
    }

    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }

    .scenario-card {
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .scenario-card:hover {
      transform: translateY(-4px);
    }

    .scenario-thumbnail {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .scenario-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .scenario-overlay {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      gap: 8px;
    }

    .scenario-duration {
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .scenario-complexity {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .complexity-basic {
      background: #10b981;
      color: white;
    }

    .complexity-intermediate {
      background: #f59e0b;
      color: white;
    }

    .complexity-advanced {
      background: #ef4444;
      color: white;
    }

    .scenario-content {
      padding: 24px;
    }

    .scenario-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 12px;
    }

    .scenario-description {
      color: #94a3b8;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .scenario-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .tag {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .scenario-btn {
      width: 100%;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .upload-section {
        padding: 24px;
      }
      
      .upload-area {
        padding: 40px 20px;
      }
      
      .scenarios-grid {
        grid-template-columns: 1fr;
      }
      
      .selected-file {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
    }
  `]
})
export class VideoInputComponent implements OnInit {
  defaultScenarios: VideoScenario[] = [];
  selectedFile: File | null = null;
  isDragOver = false;

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.defaultScenarios = this.simulationService.getDefaultScenarios();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    if (file.type.startsWith('video/')) {
      this.selectedFile = file;
    } else {
      alert('Please select a valid video file.');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  selectScenario(scenario: VideoScenario): void {
    this.simulationService.selectVideo(scenario);
  }

  processUploadedVideo(): void {
    if (this.selectedFile) {
      this.simulationService.selectVideo(this.selectedFile);
    }
  }
}