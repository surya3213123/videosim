import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SimulationService } from '../../services/simulation.service';
import { SimulationState } from '../../models/simulation.model';
import { SimulationGenerationComponent } from '../../components/simulation-generation/simulation-generation.component';

@Component({
  selector: 'app-nl-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule, SimulationGenerationComponent],
  templateUrl: './nl-simulation.component.html',
  styleUrls: ['./nl-simulation.component.css']
})
export class NlSimulationComponent implements OnInit, OnDestroy {
  scenarioText = '';
  hasSelectedPrompt = false;
  private subscription: Subscription = new Subscription();

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.simulationService.state$.subscribe((state: SimulationState) => {
        this.hasSelectedPrompt = !!state.selectedPrompt;
      })
    );

    // Check if there's a pre-selected prompt
    const selectedPrompt = this.simulationService.getSelectedPrompt();
    if (selectedPrompt) {
      this.scenarioText = selectedPrompt.prompt;
      this.generateFromText();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearText(): void {
    this.scenarioText = '';
  }

  generateFromText(): void {
    if (this.scenarioText.trim()) {
      this.simulationService.selectPrompt({
        id: 'custom',
        title: 'Custom Scenario',
        description: this.scenarioText.substring(0, 100) + '...',
        category: 'Custom',
        tags: ['custom'],
        prompt: this.scenarioText
      });
    }
  }
}