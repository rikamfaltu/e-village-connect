
import React from "react";
import ProblemCard, { Problem } from "./ProblemCard";

interface ProblemsListProps {
  problems: Problem[];
}

const ProblemsList = ({ problems }: ProblemsListProps) => {
  return (
    <div className="space-y-6">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
};

export default ProblemsList;
