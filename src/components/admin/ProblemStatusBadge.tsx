import React from 'react';
import { Problem } from '../../hooks/useAdminProblems';

interface ProblemStatusBadgeProps {
  status: Problem['status'];
}

const ProblemStatusBadge = ({ status }: ProblemStatusBadgeProps) => {
  const getStatusBadgeClass = (status: Problem["status"]) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
      {status}
    </span>
  );
};

export default ProblemStatusBadge;
