
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertTriangle } from 'lucide-react';

// Define Problem type
export interface Problem {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  userEmail?: string;
  userName?: string;
  contactNumber?: string;
  urgency?: string;
  submittedAt: string;
  statusUpdateTime?: string;
  userId?: string;
  createdAt?: string;
}

// Admin emails for authorization
const adminEmails = ["admin@example.com", "2023bit045@sggs.ac.in"];

export const useAdminProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();
  
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
      const parsedProblems = JSON.parse(storedProblems);
      // Normalize fields between different problem formats
      const normalizedProblems = parsedProblems.map((problem: any) => ({
        ...problem,
        submittedAt: problem.submittedAt || problem.createdAt || new Date().toISOString(),
        status: problem.status || 'pending',
      }));
      
      setProblems(normalizedProblems);
      console.log("Loaded problems:", normalizedProblems.length);
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
    
    // Update localStorage
    localStorage.setItem('submittedProblems', JSON.stringify(updatedProblems));
    
    // Show notification to admin based on status change
    if (newStatus === 'resolved') {
      toast.success("Problem has been marked as resolved");
    } else if (newStatus === 'in_progress') {
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
        case 'in_progress':
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
    } else {
      // No email available, show warning
      toast.warning(
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Cannot send notification - no email provided for this problem</span>
        </div>,
        { duration: 3000 }
      );
    }
  };

  return { problems, handleStatusChange };
};
