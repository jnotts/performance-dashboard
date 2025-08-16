import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  getAverageScoresByDepartment,
  getTopPerformingSkills,
  getRecentTrends,
} from "../utils/utils.js";
import type { TrainingData } from "../utils/types.js";

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
  const { department, startDate, endDate } = req.query;

  let filteredSessions = trainingData.sessions;

  // filter by department
  if (department && typeof department === "string") {
    filteredSessions = filteredSessions.filter(
      (session) => session.department.toLowerCase() === department.toLowerCase()
    );
  }

  // filter by date range
  if (startDate && typeof startDate === "string") {
    const start = new Date(startDate);
    filteredSessions = filteredSessions.filter(
      (session) => new Date(session.date) >= start
    );
  }

  if (endDate && typeof endDate === "string") {
    const end = new Date(endDate);
    filteredSessions = filteredSessions.filter(
      (session) => new Date(session.date) <= end
    );
  }

  const insights = {
    totalSessions: filteredSessions.length,
    overallPassRate:
      filteredSessions.length > 0
        ? filteredSessions.filter((s) => s.passed).length /
          filteredSessions.length
        : 0,
    averageScore:
      filteredSessions.length > 0
        ? filteredSessions.reduce((sum, s) => sum + s.overallScore, 0) /
          filteredSessions.length
        : 0,
    averageScoresByDepartment: getAverageScoresByDepartment(filteredSessions),
    topPerformingSkills: getTopPerformingSkills(filteredSessions),
    recentTrends: getRecentTrends(filteredSessions),
  };

  return res.json({
    insights,
    rawTrainingData: {
      ...trainingData,
      sessions: filteredSessions,
    },
    appliedFilters: {
      department: department || null,
      startDate: startDate || null,
      endDate: endDate || null,
    },
  });
};
