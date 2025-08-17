// Types for the API responses - duplicated from backend for now
export interface TrainingSession {
  sessionId: string
  userId: string
  userName: string
  department: string
  date: string
  overallScore: number
  skills: {
    communication: number
    problemSolving: number
    productKnowledge: number
    customerService: number
  }
  completionTime: number
  passed: boolean
}

export interface TrainingData {
  metadata: {
    generatedAt: string
    version: string
  }
  sessions: TrainingSession[]
}

export interface DepartmentStats {
  department: string
  averageScore: number
  scores: number[]
  skillAverages: {
    communication: number
    problemSolving: number
    productKnowledge: number
    customerService: number
  }
}

export interface SkillStats {
  skill: string
  averageScore: number
}

export interface TrendData {
  date: string
  averageScore: number
  sessionCount: number
  skillAverages: {
    communication: number
    problemSolving: number
    productKnowledge: number
    customerService: number
  }
}

export interface Insights {
  totalSessions: number
  overallPassRate: number
  averageScore: number
  averageScoresByDepartment: DepartmentStats[]
  topPerformingSkills: SkillStats[]
  recentTrends: TrendData[]
}

export interface FilterParams {
  department?: string
  startDate?: string
  endDate?: string
}

export interface AppliedFilters {
  department: string | null
  startDate: string | null
  endDate: string | null
}

export interface ApiResponse {
  insights: Insights
  rawTrainingData: TrainingData
  appliedFilters: AppliedFilters
}
