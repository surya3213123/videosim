import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SimulationService } from '../../services/simulation.service';
import { SimulationState } from '../../models/simulation.model';
import { VideoInputComponent } from '../../components/video-input/video-input.component';
import { SimulationGenerationComponent } from '../../components/simulation-generation/simulation-generation.component';

@Component({
  selector: 'app-video-simulation',
  standalone: true,
  imports: [CommonModule, VideoInputComponent, SimulationGenerationComponent],
  templateUrl: './video-simulation.component.html',
  styleUrls: ['./video-simulation.component.css']
})
export class VideoSimulationComponent implements OnInit, OnDestroy {
  hasSelectedVideo = false;
  private subscription: Subscription = new Subscription();

  constructor(private simulationService: SimulationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.simulationService.state$.subscribe((state: SimulationState) => {
        this.hasSelectedVideo = !!state.selectedVideo;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}