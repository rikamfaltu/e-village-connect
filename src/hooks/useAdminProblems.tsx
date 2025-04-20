
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertTriangle, Phone } from 'lucide-react';

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
  image?: string | null;
}

// Admin emails for authorization
const adminEmails = ["admin@example.com", "2023bit045@sggs.ac.in"];

export const useAdminProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    }
  }, [user, navigate]);
  
  // Load problems from localStorage
  const loadProblems = () => {
    const storedProblems = localStorage.getItem('submittedProblems');
    if (storedProblems) {
      try {
        const parsedProblems = JSON.parse(storedProblems);
        console.log("Admin: Raw problems from localStorage:", parsedProblems);
        
        // Normalize fields between different problem formats
        const normalizedProblems = parsedProblems.map((problem: any) => ({
          ...problem,
          submittedAt: problem.submittedAt || problem.createdAt || new Date().toISOString(),
          status: problem.status || 'pending',
        }));
        
        setProblems(normalizedProblems);
        console.log("Admin: Loaded problems:", normalizedProblems.length);
      } catch (error) {
        console.error("Error parsing stored problems:", error);
        toast.error("Failed to load problems data");
      }
    } else {
      console.log("No stored problems found");
    }
  };
  
  // Send email notification
  const sendEmailNotification = (email: string, subject: string, message: string) => {
    console.log(`Sending email to ${email}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // In a real app, this would call an email API
    // For this demo, we'll simulate with a toast notification
    toast.success(
      <div className="flex flex-col gap-1">
        <div className="font-medium">Email notification sent</div>
        <div className="text-sm text-gray-500">
          <p>To: {email}</p>
          <p>Subject: {subject}</p>
          <p>Message: {message}</p>
        </div>
      </div>,
      {
        icon: <Mail className="h-5 w-5 text-blue-500" />,
        duration: 6000
      }
    );
    
    return true;
  };
  
  // Send SMS notification
  const sendSMSNotification = (phoneNumber: string, message: string) => {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    
    // In a real app, this would call an SMS API
    // For this demo, we'll simulate with a toast notification
    toast.success(
      <div className="flex flex-col gap-1">
        <div className="font-medium">SMS notification sent</div>
        <div className="text-sm text-gray-500">
          <p>To: {phoneNumber}</p>
          <p>Message: {message}</p>
        </div>
      </div>,
      {
        icon: <Phone className="h-5 w-5 text-blue-500" />,
        duration: 6000
      }
    );
    
    return true;
  };
  
  const handleStatusChange = (id: number, newStatus: Problem["status"]) => {
    // Find the problem to update
    const problemToUpdate = problems.find(problem => problem.id === id);
    if (!problemToUpdate) {
      console.error("Problem not found:", id);
      toast.error("Problem not found");
      return;
    }
    
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
    
    // Prepare notification messages
    let messageTitle = "";
    let messageBody = "";
    let smsMessage = "";
    
    switch(newStatus) {
      case 'resolved':
        messageTitle = "Your reported problem has been resolved";
        messageBody = `We're pleased to inform you that your reported issue "${problemToUpdate.title}" has been successfully resolved. Thank you for your patience!`;
        smsMessage = `Your reported issue "${problemToUpdate.title}" has been resolved. Thank you for your patience!`;
        break;
      case 'in_progress':
        messageTitle = "Your reported problem is being addressed";
        messageBody = `We wanted to let you know that we're currently working on your reported issue "${problemToUpdate.title}". We'll update you once it's resolved.`;
        smsMessage = `We are currently addressing your issue "${problemToUpdate.title}". We'll update you once it's resolved.`;
        break;
      case 'rejected':
        messageTitle = "Update on your reported problem";
        messageBody = `We regret to inform you that we cannot proceed with your reported issue "${problemToUpdate.title}" at this time. Please contact the village office for more details.`;
        smsMessage = `Regarding your issue "${problemToUpdate.title}": We cannot proceed with this at this time. Please contact the village office for more details.`;
        break;
      default:
        messageTitle = "Your reported problem status has been updated";
        messageBody = `We're reviewing your reported issue "${problemToUpdate.title}" and will update you soon.`;
        smsMessage = `Your issue "${problemToUpdate.title}" has been received and is under review.`;
    }
    
    let notificationsSent = false;
    
    // Send email notification if email is available
    if (problemToUpdate.userEmail) {
      const emailSent = sendEmailNotification(problemToUpdate.userEmail, messageTitle, messageBody);
      if (emailSent) {
        notificationsSent = true;
      }
    } else {
      // No email available, show warning
      toast.warning(
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Cannot send email notification - no email provided for this problem</span>
        </div>,
        { duration: 3000 }
      );
    }
    
    // Send SMS notification if phone number is available
    if (problemToUpdate.contactNumber) {
      const smsSent = sendSMSNotification(problemToUpdate.contactNumber, smsMessage);
      if (smsSent) {
        notificationsSent = true;
      }
    } else {
      // No phone number available
      toast.warning(
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Cannot send SMS notification - no phone number provided</span>
        </div>,
        { duration: 3000 }
      );
    }

    if (notificationsSent) {
      toast.success("Notifications sent to user about status update", {
        duration: 4000
      });
    }
  };

  return { problems, handleStatusChange, isLoading };
};
