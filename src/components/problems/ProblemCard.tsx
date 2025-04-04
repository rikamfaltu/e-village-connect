
import React from "react";
import { Badge } from "@/components/ui/badge";

// Define the Problem type to match our structure
export interface Problem {
  id: number;
  title: string;
  category: string;
  description: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  createdAt: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  contactNumber?: string;
  location?: string;
  urgency?: string;
  statusUpdateTime?: string;
}

interface ProblemCardProps {
  problem: Problem;
}

const ProblemCard = ({ problem }: ProblemCardProps) => {
  const getStatusBadge = (status: Problem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{problem.title}</h2>
          {getStatusBadge(problem.status)}
        </div>
        
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
            {problem.category.replace('_', ' ')}
          </span>
          <span className="text-sm text-gray-500 ml-4">
            Submitted on {formatDate(problem.createdAt)}
          </span>
        </div>
        
        <p className="text-gray-700 mb-4">{problem.description}</p>
        
        <div className="mt-4 text-sm text-gray-600">
          {problem.status === "resolved" ? (
            <p className="text-green-600">
              ✓ This issue has been resolved. Thank you for your patience.
            </p>
          ) : problem.status === "in_progress" ? (
            <p className="text-blue-600">
              → This issue is currently being addressed by our team.
            </p>
          ) : problem.status === "rejected" ? (
            <p className="text-red-600">
              ✗ This issue could not be processed. Please contact support for more information.
            </p>
          ) : (
            <p>
              Your submission is pending review by our team.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;
