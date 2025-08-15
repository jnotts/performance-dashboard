import { Request, Response } from "express";
import fs from "fs";
import path from "path";

interface TrainingSession {
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

interface TrainingData {
  metadata: {
    generatedAt: string;
    version: string;
  };
  sessions: TrainingSession[];
}

// read data at startup for now - avoid reading in each request
const dataPath = path.join(process.cwd(), "training-data.json");
const rawData = fs.readFileSync(dataPath, "utf-8");
const trainingData: TrainingData = JSON.parse(rawData);


export const getInsights = (req: Request, res: Response) => {
  res.json(trainingData);
};
