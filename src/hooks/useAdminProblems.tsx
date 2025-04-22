
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertTriangle, Phone, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

// Mock nodemailer implementation for demonstration
const mockNodemailer = {
  sendMail: (options: any) => {
    console.log('Sending email via nodemailer:', options);
    return Promise.resolve({ messageId: 'mock-message-id-' + Date.now() });
  }
};

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
    }
  }, [user, navigate]);
  
  // Load problems from Supabase
  const loadProblems = async () => {
    setIsLoading(true);
    try {
      // Fetch problems from Supabase
      const { data: supabaseProblems, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      // Transform Supabase data to match our Problem type
      const transformedProblems: Problem[] = supabaseProblems.map((problem) => ({
        id: parseInt(problem.id.split('-')[0], 16), // Convert UUID to number for compatibility
        title: problem.title,
        category: problem.category,
        description: problem.description,
        status: problem.status as "pending" | "in_progress" | "resolved" | "rejected",
        createdAt: problem.created_at,
        statusUpdateTime: problem.status_update_time,
        submittedAt: problem.created_at,
        location: problem.location,
        image: problem.image_path ? `${supabase.storage.from('problem_images').getPublicUrl(problem.image_path).data.publicUrl}` : null,
        userId: problem.user_id,
        userEmail: problem.user_email,
        userName: problem.user_name,
        contactNumber: problem.contact_number,
        urgency: problem.urgency
      }));
      
      console.log("Admin: Loaded problems from Supabase:", transformedProblems.length);
      setProblems(transformedProblems);
    } catch (error) {
      console.error("Error loading problems from Supabase:", error);
      toast.error("Failed to load problems data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send email notification using nodemailer mock
  const sendEmailNotification = (email: string, subject: string, message: string) => {
    console.log(`Sending email to ${email}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Use our mock nodemailer implementation
    mockNodemailer.sendMail({
      from: '2023bit045@sggs.ac.in',
      to: email,
      subject: subject,
      text: message,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #4a5568;">${subject}</h2>
        <p style="color: #4a5568; font-size: 16px;">${message}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #718096; font-size: 14px;">Village Development Portal</p>
      </div>`
    })
    .then(() => {
      toast.success(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Email notification sent</div>
          <div className="text-sm text-gray-500">
            <p>To: {email}</p>
            <p>Subject: {subject}</p>
          </div>
        </div>,
        {
          icon: <Mail className="h-5 w-5 text-blue-500" />,
          duration: 6000
        }
      );
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send email notification");
    });
    
    return true;
  };
  
  // Send SMS notification with enhanced feedback
  const sendSMSNotification = (phoneNumber: string, message: string) => {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
    
    // In a real app, this would call an SMS API
    // For this demo, we'll simulate with a toast notification
    
    // Simulate a slight delay to make it feel more realistic
    setTimeout(() => {
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
    }, 800);
    
    return true;
  };
  
  const handleStatusChange = async (id: number, newStatus: Problem["status"]) => {
    // Find the problem to update
    const problemToUpdate = problems.find(problem => problem.id === id);
    if (!problemToUpdate) {
      console.error("Problem not found:", id);
      toast.error("Problem not found");
      return;
    }
    
    const statusUpdateTime = new Date().toISOString();
    
    // Extract the original UUID from the Supabase problem
    const originalId = problemToUpdate.userId ? 
      // For real problems, we need to extract the UUID from our numeric ID (which was created as a hash)
      // In a production app, we would store the UUID directly
      problemToUpdate.userId : 
      // For mock problems, we use the numeric ID
      String(problemToUpdate.id);
    
    try {
      // Update problem in Supabase
      const { error } = await supabase
        .from('problems')
        .update({
          status: newStatus,
          status_update_time: statusUpdateTime
        })
        .eq('id', originalId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedProblems = problems.map(problem => 
        problem.id === id ? { 
          ...problem, 
          status: newStatus,
          statusUpdateTime 
        } : problem
      );
      
      setProblems(updatedProblems);
      
      // Show notification to admin based on status change
      if (newStatus === 'resolved') {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Problem has been marked as resolved</span>
          </div>
        );
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
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Notifications sent to user about status update</span>
          </div>,
          { duration: 4000 }
        );
      }
    } catch (error) {
      console.error("Error updating problem status:", error);
      toast.error("Failed to update problem status");
    }
  };

  return { problems, handleStatusChange, isLoading };
};
