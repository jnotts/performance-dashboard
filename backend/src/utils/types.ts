// Define interfaces for the training session data
export interface TrainingSession {
  sessionId: string;
  userId: string;
  userName: string;
  department: string;
  date: string;
  overallScore: number;
  skills: {
    communication: number;
    problemSolving: number;
    productKnowledge: number;
    customerService: number;
  };
  completionTime: number;
  passed: boolean;
}

export interface TrainingData {
  metadata: {
    generatedAt: string;
    version: string;
  };
  sessions: TrainingSession[];
}
