import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { VideoScenario, ProcessingStep, GeneratedContent, SimulationState } from '../models/simulation.model';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private simulationState = new BehaviorSubject<SimulationState>({
    selectedVideo: null,
    processingSteps: this.getInitialSteps(),
    generatedContent: null,
    isProcessing: false,
    currentStep: 0
  });

  public state$ = this.simulationState.asObservable();

  private defaultScenarios: VideoScenario[] = [
    {
      id: '1',
      title: 'Straight Road Driving',
      description: 'Vehicle moving straight on a 100m road with consistent speed',
      videoUrl: 'https://example.com/straight-road.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '15s',
      complexity: 'Basic',
      tags: ['straight-road', 'basic-driving', 'constant-speed']
    },
    {
      id: '2',
      title: 'Vehicle Overtaking',
      description: 'One vehicle overtaking another on a two-lane road',
      videoUrl: 'https://example.com/overtaking.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '25s',
      complexity: 'Intermediate',
      tags: ['overtaking', 'multi-vehicle', 'lane-change']
    },
    {
      id: '3',
      title: 'Lane Change Maneuver',
      description: 'Vehicle performing a safe lane change with proper signaling',
      videoUrl: 'https://example.com/lane-change.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '20s',
      complexity: 'Intermediate',
      tags: ['lane-change', 'signaling', 'safety']
    },
    {
      id: '4',
      title: 'Complex Intersection',
      description: 'Multiple vehicles navigating through a busy intersection',
      videoUrl: 'https://example.com/intersection.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '35s',
      complexity: 'Advanced',
      tags: ['intersection', 'traffic-lights', 'multi-vehicle', 'complex']
    }
  ];

  getDefaultScenarios(): VideoScenario[] {
    return this.defaultScenarios;
  }

  selectVideo(video: VideoScenario | File): void {
    const currentState = this.simulationState.value;
    this.simulationState.next({
      ...currentState,
      selectedVideo: video,
      processingSteps: this.getInitialSteps(),
      generatedContent: null,
      currentStep: 0
    });
  }

  async generateSimulation(): Promise<void> {
    const currentState = this.simulationState.value;
    
    this.simulationState.next({
      ...currentState,
      isProcessing: true,
      currentStep: 0
    });

    // Simulate processing steps
    for (let i = 0; i < currentState.processingSteps.length; i++) {
      await this.processStep(i);
    }

    // Generate mock content
    const generatedContent: GeneratedContent = {
      naturalLanguage: this.generateMockNL(),
      jsonScenario: this.generateMockJSON(),
      openScenarioXml: this.generateMockOpenScenario(),
      openDriveXml: this.generateMockOpenDrive(),
      simulationVideoUrl: 'https://example.com/generated-simulation.mp4'
    };

    const finalState = this.simulationState.value;
    this.simulationState.next({
      ...finalState,
      isProcessing: false,
      generatedContent,
      currentStep: finalState.processingSteps.length
    });
  }

  private async processStep(stepIndex: number): Promise<void> {
    const currentState = this.simulationState.value;
    const steps = [...currentState.processingSteps];
    
    // Set current step to processing
    steps[stepIndex] = { ...steps[stepIndex], status: 'processing', progress: 0 };
    this.simulationState.next({ ...currentState, processingSteps: steps, currentStep: stepIndex });

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 200));
      steps[stepIndex] = { ...steps[stepIndex], progress };
      this.simulationState.next({ ...this.simulationState.value, processingSteps: steps });
    }

    // Complete step
    steps[stepIndex] = { ...steps[stepIndex], status: 'completed', progress: 100 };
    this.simulationState.next({ ...this.simulationState.value, processingSteps: steps });
  }

  private getInitialSteps(): ProcessingStep[] {
    return [
      {
        id: '1',
        title: 'Video Analysis',
        description: 'Analyzing uploaded video using AI model',
        status: 'pending',
        progress: 0
      },
      {
        id: '2',
        title: 'Natural Language Generation',
        description: 'Converting video analysis to natural language description',
        status: 'pending',
        progress: 0
      },
      {
        id: '3',
        title: 'JSON Scenario Creation',
        description: 'Generating structured scenario data',
        status: 'pending',
        progress: 0
      },
      {
        id: '4',
        title: 'OpenSCENARIO Generation',
        description: 'Creating OpenSCENARIO XML file',
        status: 'pending',
        progress: 0
      },
      {
        id: '5',
        title: 'OpenDRIVE Generation',
        description: 'Generating OpenDRIVE road network file',
        status: 'pending',
        progress: 0
      }
    ];
  }

  private generateMockNL(): string {
    return `The video shows a vehicle traveling on a straight two-lane road. The ego vehicle maintains a constant speed of approximately 50 km/h in the right lane. At timestamp 5.2 seconds, a second vehicle appears in the left lane, traveling at a higher speed of approximately 65 km/h. The second vehicle successfully overtakes the ego vehicle, maintaining safe lateral distance of 2.5 meters throughout the maneuver. Weather conditions appear clear with good visibility. Road surface is dry asphalt with standard lane markings visible.`;
  }

  private generateMockJSON(): any {
    return {
      scenario: {
        name: "Highway Overtaking Scenario",
        description: "Basic overtaking maneuver on highway",
        road: {
          type: "highway",
          lanes: 2,
          length: 1000,
          width: 3.5
        },
        vehicles: [
          {
            id: "ego_vehicle",
            type: "car",
            initial_position: { x: 0, y: 0, z: 0 },
            initial_speed: 50,
            lane: 1
          },
          {
            id: "overtaking_vehicle",
            type: "car",
            initial_position: { x: -50, y: 3.5, z: 0 },
            initial_speed: 65,
            lane: 2
          }
        ],
        actions: [
          {
            vehicle: "overtaking_vehicle",
            action: "lane_change",
            start_time: 2.0,
            duration: 3.0,
            target_lane: 1
          }
        ]
      }
    };
  }

  private generateMockOpenScenario(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<OpenSCENARIO>
  <FileHeader revMajor="1" revMinor="0" date="2024-01-15" description="Highway Overtaking Scenario" name="OvertakingScenario"/>
  <Entities>
    <ScenarioObject name="Ego">
      <CatalogReference catalogName="VehicleCatalog" entryName="car_white"/>
    </ScenarioObject>
    <ScenarioObject name="TargetVehicle">
      <CatalogReference catalogName="VehicleCatalog" entryName="car_red"/>
    </ScenarioObject>
  </Entities>
  <Storyboard>
    <Init>
      <Actions>
        <Private entityRef="Ego">
          <PrivateAction>
            <TeleportAction>
              <Position>
                <WorldPosition x="0" y="0" z="0" h="0" p="0" r="0"/>
              </Position>
            </TeleportAction>
          </PrivateAction>
        </Private>
      </Actions>
    </Init>
  </Storyboard>
</OpenSCENARIO>`;
  }

  private generateMockOpenDrive(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<OpenDRIVE>
  <header revMajor="1" revMinor="4" name="Highway" version="1.00" date="2024-01-15"/>
  <road name="Highway_Road" length="1000.0" id="1" junction="-1">
    <planView>
      <geometry s="0.0" x="0.0" y="0.0" hdg="0.0" length="1000.0">
        <line/>
      </geometry>
    </planView>
    <lanes>
      <laneSection s="0.0">
        <center>
          <lane id="0" type="none" level="true">
            <roadMark sOffset="0.0" type="solid" weight="standard" color="yellow"/>
          </lane>
        </center>
        <right>
          <lane id="-1" type="driving" level="true">
            <width sOffset="0.0" a="3.5" b="0.0" c="0.0" d="0.0"/>
            <roadMark sOffset="0.0" type="broken" weight="standard" color="white"/>
          </lane>
          <lane id="-2" type="driving" level="true">
            <width sOffset="0.0" a="3.5" b="0.0" c="0.0" d="0.0"/>
            <roadMark sOffset="0.0" type="solid" weight="standard" color="white"/>
          </lane>
        </right>
      </laneSection>
    </lanes>
  </road>
</OpenDRIVE>`;
  }

  updateJsonScenario(jsonContent: string): void {
    const currentState = this.simulationState.value;
    if (currentState.generatedContent) {
      try {
        const parsedJson = JSON.parse(jsonContent);
        this.simulationState.next({
          ...currentState,
          generatedContent: {
            ...currentState.generatedContent,
            jsonScenario: parsedJson
          }
        });
      } catch (error) {
        console.error('Invalid JSON format:', error);
      }
    }
  }

  downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}