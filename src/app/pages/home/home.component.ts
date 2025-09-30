import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SimulationService } from '../../services/simulation.service';

interface DefaultPrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  prompt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  defaultPrompts: DefaultPrompt[] = [
    {
      id: '1',
      title: 'Highway Overtaking',
      description: 'A vehicle overtaking another on a two-lane highway',
      category: 'Highway',
      tags: ['overtaking', 'highway', 'multi-vehicle'],
      prompt: 'Create a scenario where a blue sedan overtakes a red SUV on a straight two-lane highway. The ego vehicle (blue sedan) starts 50 meters behind the red SUV, changes to the left lane, overtakes at 80 km/h, and returns to the right lane safely.'
    },
    {
      id: '2',
      title: 'Urban Intersection',
      description: 'Complex intersection with traffic lights and pedestrians',
      category: 'Urban',
      tags: ['intersection', 'traffic-lights', 'pedestrians'],
      prompt: 'Generate a scenario at a four-way intersection with traffic lights. The ego vehicle approaches from the south, stops at a red light, then proceeds straight when the light turns green. Include pedestrians crossing and other vehicles turning left and right.'
    },
    {
      id: '3',
      title: 'Emergency Braking',
      description: 'Sudden obstacle requiring emergency braking',
      category: 'Safety',
      tags: ['emergency', 'braking', 'obstacle'],
      prompt: 'Create an emergency braking scenario where the ego vehicle is traveling at 60 km/h on a city road when a pedestrian suddenly steps into the roadway 30 meters ahead. The vehicle must perform emergency braking to avoid collision.'
    },
    {
      id: '4',
      title: 'Lane Change Assist',
      description: 'Safe lane change with blind spot monitoring',
      category: 'ADAS',
      tags: ['lane-change', 'blind-spot', 'assist'],
      prompt: 'Design a scenario where the ego vehicle needs to change lanes on a three-lane highway. There is a slower vehicle ahead and faster traffic in the target lane. Include blind spot monitoring and safe gap detection.'
    },
    {
      id: '5',
      title: 'Parking Scenario',
      description: 'Automated parking in a crowded parking lot',
      category: 'Parking',
      tags: ['parking', 'automated', 'tight-space'],
      prompt: 'Create a parking scenario where the ego vehicle must find and park in a tight parallel parking space on a busy street with other parked cars and moving traffic.'
    },
    {
      id: '6',
      title: 'Roundabout Navigation',
      description: 'Multi-vehicle roundabout with yield rules',
      category: 'Urban',
      tags: ['roundabout', 'yield', 'multi-vehicle'],
      prompt: 'Generate a roundabout scenario with the ego vehicle approaching from the east, yielding to traffic already in the roundabout, then taking the second exit (south). Include other vehicles entering and exiting at different points.'
    }
  ];

  constructor(
    private router: Router,
    private simulationService: SimulationService
  ) {}

  navigateToVideoSim(): void {
    this.router.navigate(['/video-simulation']);
  }

  navigateToNlSim(): void {
    this.router.navigate(['/nl-simulation']);
  }

  usePrompt(prompt: DefaultPrompt): void {
    this.simulationService.setSelectedPrompt(prompt);
    this.router.navigate(['/nl-simulation']);
  }
}