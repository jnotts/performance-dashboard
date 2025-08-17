import { TrainingSession } from "./types.js";

/**
 * Get average scores by department from the training sessions
 * @param sessions - The array of training sessions
 * @returns An array of objects containing department names and their average scores
 */
export function getAverageScoresByDepartment(sessions: TrainingSession[]) {
  const departmentScores: {
    [key: string]: {
      scores: number[];
      totalScore: number;
      skillTotals: {
        communication: number;
        problemSolving: number;
        productKnowledge: number;
        customerService: number;
      };
    };
  } = {};

  // Group scores by department
  sessions.forEach((session) => {
    if (!departmentScores[session.department]) {
      departmentScores[session.department] = {
        scores: [],
        totalScore: 0,
        skillTotals: {
          communication: 0,
          problemSolving: 0,
          productKnowledge: 0,
          customerService: 0,
        },
      };
    }

    // upd dept scores
    departmentScores[session.department].scores.push(session.overallScore);
    departmentScores[session.department].totalScore += session.overallScore;
    // now upd skill totals
    departmentScores[session.department].skillTotals.communication +=
      session.skills.communication;
    departmentScores[session.department].skillTotals.problemSolving +=
      session.skills.problemSolving;
    departmentScores[session.department].skillTotals.productKnowledge +=
      session.skills.productKnowledge;
    departmentScores[session.department].skillTotals.customerService +=
      session.skills.customerService;
  });

  // return department name with array of scores and average score
  const averageScoresByDepartment = Object.entries(departmentScores).map(
    ([department, { scores, totalScore, skillTotals }]) => ({
      department,
      averageScore: totalScore / scores.length,
      scores,
      skillAverages: {
        communication: skillTotals.communication / scores.length,
        problemSolving: skillTotals.problemSolving / scores.length,
        productKnowledge: skillTotals.productKnowledge / scores.length,
        customerService: skillTotals.customerService / scores.length,
      },
    })
  );

  return averageScoresByDepartment;
}

/**
 * Get the top performing skills from the training sessions
 * @param sessions - The array of training sessions
 * @returns An array of objects containing skill names and their average scores
 */
export function getTopPerformingSkills(sessions: TrainingSession[]) {
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
 * Get recent trends from the training sessions - stats by date
 * @param sessions - The array of training sessions
 * @returns An array of objects containing date, average score, session count, and daily skill averages
 */
export function getRecentTrends(sessions: TrainingSession[]) {
  const dailyData: { [date: string]: TrainingSession[] } = {};

  sessions.forEach((session) => {
    dailyData[session.date] = dailyData[session.date] || [];
    dailyData[session.date].push(session);
  });

  // helper function to get average from array
  const getAvg = (arr: number[]) =>
    arr.reduce((sum, val) => sum + val, 0) / arr.length;

  // convert to array and sort by date -> [date, sessions[]] []
  const sortedDates = Object.entries(dailyData).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()
  );

  // calculate daily trends
  return sortedDates.map(([date, daySessions]) => {
    // calculate skill averages for this day
    const skillAverages: { [skill: string]: number } = {};
    const skillNames = Object.keys(daySessions[0].skills);

    skillNames.forEach((skillName) => {
      const skillScores = daySessions.map(
        (session) => session.skills[skillName as keyof typeof session.skills]
      );
      skillAverages[skillName] = getAvg(skillScores);
    });

    return {
      date,
      averageScore: getAvg(daySessions.map((session) => session.overallScore)),
      sessionCount: daySessions.length,
      skillAverages,
    };
  });
}
