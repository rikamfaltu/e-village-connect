
import React, { useEffect } from "react";
import ProblemCard, { Problem } from "./ProblemCard";

interface ProblemsListProps {
  problems: Problem[];
}

const ProblemsList = ({ problems }: ProblemsListProps) => {
  useEffect(() => {
    // Debug log to check if problems are being passed correctly
    console.log("ProblemsList received problems:", problems);
  }, [problems]);

  // If no problems are passed, show a message
  if (!problems || problems.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">No problems available to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
};

export default ProblemsList;
