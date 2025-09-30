import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimulationService } from '../../services/simulation.service';
import { SimulationState } from '../../models/simulation.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-simulation-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulation-generation.component.html',
  styleUrls: ['./simulation-generation.component.css']
})
export class SimulationGenerationComponent implements OnInit, OnDestroy {
  state: SimulationState | null = null;
  jsonContent: string = '';
  assistantInput: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.simulationService.state$.subscribe(state => {
        this.state = state;
        if (state.generatedContent) {
          this.jsonContent = JSON.stringify(state.generatedContent.jsonScenario, null, 2);
        }
        
        // Auto-start generation if input is selected and not processing
        if ((state.selectedVideo || state.selectedPrompt) && !state.isProcessing && !state.generatedContent) {
          this.simulationService.generateSimulation();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getInputTitle(): string {
    if (!this.state) return 'Unknown Input';
    
    if (this.state.selectedVideo) {
      if (this.state.selectedVideo instanceof File) {
        return this.state.selectedVideo.name;
      }
      return this.state.selectedVideo.title;
    }
    
    if (this.state.selectedPrompt) {
      return this.state.selectedPrompt.title;
    }
    
    return 'Unknown Input';
  }

  getInputDescription(): string {
    if (!this.state) return 'No description available';
    
    if (this.state.selectedVideo) {
      if (this.state.selectedVideo instanceof File) {
        return `Uploaded video file (${this.formatFileSize(this.state.selectedVideo.size)})`;
      }
      return this.state.selectedVideo.description;
    }
    
    if (this.state.selectedPrompt) {
      return this.state.selectedPrompt.description;
    }
    
    return 'No description available';
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

  processAssistantInput(): void {
    if (this.assistantInput.trim()) {
      console.log('Processing assistant input:', this.assistantInput);
      // Here you would process the natural language input and update the scenario
      // For now, just clear the input
      this.assistantInput = '';
    }
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

  regenerate(): void {
    if (this.state?.selectedVideo || this.state?.selectedPrompt) {
      this.simulationService.generateSimulation();
    }
  }
}