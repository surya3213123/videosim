export interface VideoScenario {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export interface GeneratedContent {
  naturalLanguage: string;
  jsonScenario: any;
  openScenarioXml: string;
  openDriveXml: string;
  simulationVideoUrl?: string;
}

export interface SimulationState {
  selectedVideo: VideoScenario | File | null;
  processingSteps: ProcessingStep[];
  generatedContent: GeneratedContent | null;
  isProcessing: boolean;
  currentStep: number;
}