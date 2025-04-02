
import { createContext, useContext, useState, ReactNode } from "react";

export type ProblemStatus = "pending" | "in-progress" | "resolved" | "rejected";

export interface Problem {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  urgency: string;
  status: ProblemStatus;
  createdAt: Date;
}

interface ProblemContextType {
  problems: Problem[];
  addProblem: (problem: Omit<Problem, "id" | "status" | "createdAt">) => void;
}

const ProblemContext = createContext<ProblemContextType | undefined>(undefined);

export const ProblemProvider = ({ children }: { children: ReactNode }) => {
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: "1",
      title: "Water Supply Issue",
      category: "water",
      location: "North Village Road",
      description: "No water supply for the past 3 days in our area.",
      urgency: "high",
      status: "in-progress",
      createdAt: new Date(2023, 5, 15)
    },
    {
      id: "2",
      title: "Street Light Not Working",
      category: "electricity",
      location: "Main Market Area",
      description: "Street lights are not working in the main market area making it unsafe at night.",
      urgency: "medium",
      status: "pending",
      createdAt: new Date(2023, 6, 20)
    },
    {
      id: "3",
      title: "Garbage Collection Issue",
      category: "sanitation",
      location: "East Colony",
      description: "Garbage is not being collected regularly causing health issues.",
      urgency: "high",
      status: "resolved",
      createdAt: new Date(2023, 7, 5)
    }
  ]);

  const addProblem = (problem: Omit<Problem, "id" | "status" | "createdAt">) => {
    const newProblem: Problem = {
      ...problem,
      id: Math.random().toString(36).substring(2, 9),
      status: "pending",
      createdAt: new Date()
    };
    setProblems([...problems, newProblem]);
  };

  return (
    <ProblemContext.Provider value={{ problems, addProblem }}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblems = () => {
  const context = useContext(ProblemContext);
  if (context === undefined) {
    throw new Error("useProblems must be used within a ProblemProvider");
  }
  return context;
};
