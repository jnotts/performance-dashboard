import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// Define interfaces for the training session data
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

/**
 * get insights from the raw training data
 * @param req - The request object
 * @param res - The response object
 * @returns object containing calculated `insights` and `rawTrainingData`
 */
export const getInsights = (req: Request, res: Response) => {
  const { sessions } = trainingData;
  const insights = {
    totalSessions: sessions.length,
    overallPassRate: sessions.filter((s) => s.passed).length / sessions.length,
    averageScoresByDepartment: getAverageScoresByDepartment(sessions),
    topPerformingSkills: getTopPerformingSkills(sessions),
    recentTrends: getRecentTrends(sessions),
  };

  return res.json({ insights, rawTrainingData: trainingData });
};

/**
 * Get average scores by department from the training sessions
 * @param sessions - The array of training sessions
 * @returns An array of objects containing department names and their average scores
 */
function getAverageScoresByDepartment(sessions: TrainingSession[]) {
  const departmentScores: {
    [key: string]: {
      scores: number[];
      totalScore: number;
    };
  } = {};

  // Group scores by department
  sessions.forEach((session) => {
    if (!departmentScores[session.department]) {
      departmentScores[session.department] = {
        scores: [],
        totalScore: 0,
      };
    }
    departmentScores[session.department].scores.push(session.overallScore);
    departmentScores[session.department].totalScore += session.overallScore;
  });

  // return department name with array of scores and average score
  const averageScoresByDepartment = Object.entries(departmentScores).map(
    ([department, { scores, totalScore }]) => ({
      department,
      averageScore: totalScore / scores.length,
      scores,
    })
  );

  return averageScoresByDepartment;
}

/**
 * Get the top performing skills from the training sessions
 * @param sessions - The array of training sessions
 * @returns An array of objects containing skill names and their average scores
 */
function getTopPerformingSkills(sessions: TrainingSession[]) {
  // assume fixed skill set for now based on training data
  const skillTotals = {
    communication: 0,
    problemSolving: 0,
    productKnowledge: 0,
    customerService: 0,
  };

  // sum up skill scores for each session
  sessions.forEach((session) => {
    skillTotals.communication += session.skills.communication;
    skillTotals.problemSolving += session.skills.problemSolving;
    skillTotals.productKnowledge += session.skills.productKnowledge;
    skillTotals.customerService += session.skills.customerService;
  });

  const sessionCount = sessions.length;
  if (sessionCount === 0) return [];

  // calculate average scores for each skill, sorted high to low
  return Object.entries(skillTotals)
    .map(([skill, total]) => ({
      skill,
      averageScore: total / sessionCount,
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
}

/**
 * Get recent trends from the training sessions
 * @param sessions - The array of training sessions
 * @returns An array of objects containing date, average score, and session count
 */
function getRecentTrends(sessions: TrainingSession[]) {
  // Sort sessions by date
  const sortedSessions = sessions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group by date and calculate daily averages
  const dailyScores: { [key: string]: number[] } = {};

  sortedSessions.forEach((session) => {
    if (!dailyScores[session.date]) {
      dailyScores[session.date] = [];
    }
    dailyScores[session.date].push(session.overallScore);
  });

  return Object.entries(dailyScores).map(([date, scores]) => ({
    date,
    averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    sessionCount: scores.length,
  }));
}
