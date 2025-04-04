
import React, { useState, useEffect } from 'react';
import { Mail, User, CalendarClock, MapPin, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define Problem type
interface Problem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  userEmail?: string;
  userName?: string;
  submittedAt: string;
  statusUpdateTime?: string;
}

const AdminPanel = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Admin emails - for authorization check
  const adminEmails = ["admin@example.com", "2023bit045@sggs.ac.in"];
  
  // Check if current user is admin
  useEffect(() => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    if (!userEmail || !adminEmails.includes(userEmail)) {
      toast.error("You don't have permission to access this page");
      navigate('/');
    } else {
      loadProblems();
    }
  }, [user, navigate]);
  
  // Load problems from localStorage
  const loadProblems = () => {
    const storedProblems = localStorage.getItem('submittedProblems');
    if (storedProblems) {
      setProblems(JSON.parse(storedProblems));
    }
  };
  
  const handleStatusChange = (id: number, newStatus: Problem["status"]) => {
    // Find the problem to update
    const problemToUpdate = problems.find(problem => problem.id === id);
    if (!problemToUpdate) return;
    
    const statusUpdateTime = new Date().toISOString();
    
    const updatedProblems = problems.map(problem => 
      problem.id === id ? { 
        ...problem, 
        status: newStatus,
        statusUpdateTime 
      } : problem
    );
    
    setProblems(updatedProblems);
    
    // Update localStorage (only for user-submitted problems)
    const storedProblems = localStorage.getItem('submittedProblems');
    if (storedProblems) {
      const parsedProblems = JSON.parse(storedProblems);
      const updatedStoredProblems = parsedProblems.map((problem: any) => 
        problem.id === id ? { 
          ...problem, 
          status: newStatus,
          statusUpdateTime 
        } : problem
      );
      localStorage.setItem('submittedProblems', JSON.stringify(updatedStoredProblems));
    }
    
    // Show notification to admin based on status change
    if (newStatus === 'resolved') {
      toast.success("Problem has been marked as resolved");
    } else if (newStatus === 'in-progress') {
      toast.info("Problem has been marked as in progress");
    } else if (newStatus === 'rejected') {
      toast.error("Problem has been rejected");
    } else {
      toast.warning("Problem status updated to pending");
    }
    
    // In a real app, this would trigger an email notification
    // For this demo, we'll simulate it with a console log and toast
    if (problemToUpdate.userEmail) {
      console.log(`Email notification sent to ${problemToUpdate.userEmail} about problem status update to ${newStatus}`);
      
      let messageTitle = "";
      let messageBody = "";
      
      switch(newStatus) {
        case 'resolved':
          messageTitle = "Your reported problem has been resolved";
          messageBody = `We're pleased to inform you that your reported issue "${problemToUpdate.title}" has been successfully resolved.`;
          break;
        case 'in-progress':
          messageTitle = "Your reported problem is being addressed";
          messageBody = `We wanted to let you know that we're currently working on your reported issue "${problemToUpdate.title}".`;
          break;
        case 'rejected':
          messageTitle = "Update on your reported problem";
          messageBody = `We regret to inform you that we cannot proceed with your reported issue "${problemToUpdate.title}" at this time.`;
          break;
        default:
          messageTitle = "Your reported problem status has been updated";
          messageBody = `We're reviewing your reported issue "${problemToUpdate.title}" and will update you soon.`;
      }
      
      // Show a toast to simulate email being sent
      toast.info(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Notification sent to user</div>
          <div className="text-sm text-gray-500">
            <p>To: {problemToUpdate.userEmail}</p>
            <p>Subject: {messageTitle}</p>
            <p>Message: {messageBody}</p>
          </div>
        </div>,
        {
          icon: <Mail className="h-5 w-5 text-blue-500" />,
          duration: 6000
        }
      );
    }
  };

  const getStatusBadgeClass = (status: Problem["status"]) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Problems</h2>
          
          {problems.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No problems submitted yet.</div>
          ) : (
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
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-500" />
                            <span>{problem.category}</span>
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
                            <div className="font-medium">{problem.userEmail || 'Anonymous'}</div>
                            {problem.userName && <div className="text-sm text-gray-500">{problem.userName}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{new Date(problem.submittedAt).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(problem.status)}`}>
                              {problem.status}
                            </span>
                          </div>
                          {problem.statusUpdateTime && (
                            <div className="text-xs text-gray-500">
                              Last updated: {new Date(problem.statusUpdateTime).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <select 
                            className="border rounded px-2 py-1 text-sm w-full mb-2"
                            value={problem.status}
                            onChange={(e) => handleStatusChange(problem.id, e.target.value as Problem["status"])}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          
                          {problem.userEmail && (
                            <div className="flex items-center text-xs text-blue-600">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>Email notifications enabled</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
