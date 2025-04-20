
import React from 'react';
import { Mail, User, CalendarClock, MapPin, Tag, AlertTriangle, Phone, Image } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Problem } from '../../hooks/useAdminProblems';
import ProblemStatusBadge from './ProblemStatusBadge';

interface ProblemTableProps {
  problems: Problem[];
  onStatusChange: (id: number, status: Problem['status']) => void;
}

const ProblemTable = ({ problems, onStatusChange }: ProblemTableProps) => {
  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (problems.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">No problems submitted yet.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problem Details</TableHead>
            <TableHead>Category & Location</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date & Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <TableRow key={problem.id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <h3 className="font-medium text-lg">{problem.title}</h3>
                  <p className="text-gray-600 mt-1">{problem.description}</p>
                  {problem.image && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <Image className="w-4 h-4" />
                        <span>Attached Image:</span>
                      </div>
                      <img 
                        src={problem.image} 
                        alt="Problem evidence" 
                        className="max-h-40 rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                  {problem.urgency && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full
                        ${problem.urgency === 'high' ? 'bg-red-100 text-red-800' : 
                          problem.urgency === 'medium' ? 'bg-orange-100 text-orange-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {problem.urgency.charAt(0).toUpperCase() + problem.urgency.slice(1)} Priority
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="capitalize">{problem.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{problem.location}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{problem.userName || 'Anonymous'}</div>
                    {problem.userEmail && (
                      <div className="text-sm text-gray-500">{problem.userEmail}</div>
                    )}
                    {problem.contactNumber && (
                      <div className="text-sm text-gray-500">Phone: {problem.contactNumber}</div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{formatDate(problem.submittedAt)}</span>
                  </div>
                  <div>
                    <ProblemStatusBadge status={problem.status} />
                  </div>
                  {problem.statusUpdateTime && (
                    <div className="text-xs text-gray-500">
                      Last updated: {formatDate(problem.statusUpdateTime)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <select 
                    className="border rounded px-2 py-1 text-sm w-full mb-2"
                    value={problem.status}
                    onChange={(e) => onStatusChange(problem.id, e.target.value as Problem["status"])}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  {problem.userEmail ? (
                    <div className="flex items-center text-xs text-blue-600">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>Email notifications enabled</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-gray-500">
                      <Mail className="h-3 w-3 mr-1" />
                      <span>No email available</span>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProblemTable;
