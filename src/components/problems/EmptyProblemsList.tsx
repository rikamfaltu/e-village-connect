
import React from "react";
import { Link } from "react-router-dom";

const EmptyProblemsList = () => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-medium text-gray-600 mb-2">No problems submitted yet</h3>
      <p className="text-gray-500 mb-4">Once you submit problems, they will appear here.</p>
      <Link 
        to="/add-problem" 
        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Submit a Problem
      </Link>
    </div>
  );
};

export default EmptyProblemsList;
