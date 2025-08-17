import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const promptPath = path.join(process.cwd(), "prompt.txt");
const prompt = fs.readFileSync(promptPath, "utf-8");

/**
 * Generate AI insights from training data
 * @param req - The request object with JSON training data in body
 * @param res - The response object
 * @returns AI-generated insights
 */
export const getAiInsights = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: "Missing data in request body" });
    }
    const jsonData = typeof data === "string" ? data : JSON.stringify(data);

    // form prompt with instructions + data
    const fullPrompt = `${prompt}\n\n${jsonData}`;

    // create gemini AI client (gemini for now for free api calls)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 1024,
        },
      },
    });

    const output = response.candidates?.[0].content?.parts?.[0].text;

    if (!output) {
      throw new Error("No response from AI model");
    }

    // Clean the response by removing markdown code blocks
    const cleanedOutput = output
      .replace(/```json\n/g, "")
      .replace(/\n```/g, "")
      .trim();

    // Parse the JSON response
    const parsedInsights = JSON.parse(cleanedOutput);

    return res.json(parsedInsights);
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate AI insights: " + error });
  }
};
