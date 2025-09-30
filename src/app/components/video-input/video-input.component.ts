import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationService } from '../../services/simulation.service';
import { VideoScenario } from '../../models/simulation.model';

@Component({
  selector: 'app-video-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-input.component.html',
  styleUrls: ['./video-input.component.css']
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