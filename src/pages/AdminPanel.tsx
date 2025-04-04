
import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    
    // Show notification to admin
    toast.success(`Problem status updated to ${newStatus}`);
    
    // In a real app, this would trigger an email notification
    // For this demo, we'll simulate it with a console log
    if (problemToUpdate.userEmail) {
      console.log(`Email notification sent to ${problemToUpdate.userEmail} about problem status update to ${newStatus}`);
      
      // Show a toast to simulate email being sent
      toast.info(
        <div className="flex flex-col gap-1">
          <div className="font-medium">Notification sent to user</div>
          <div className="text-sm text-gray-500">An email has been sent to {problemToUpdate.userEmail} about this update</div>
        </div>,
        {
          icon: <Mail className="h-5 w-5 text-blue-500" />,
          duration: 4000
        }
      );
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
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">ID</th>
                    <th className="border px-4 py-2 text-left">Title</th>
                    <th className="border px-4 py-2 text-left">Category</th>
                    <th className="border px-4 py-2 text-left">Location</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                    <th className="border px-4 py-2 text-left">Submitted By</th>
                    <th className="border px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{problem.id}</td>
                      <td className="border px-4 py-2">
                        <div className="font-medium">{problem.title}</div>
                        <div className="text-sm text-gray-500">{problem.description.substring(0, 50)}...</div>
                      </td>
                      <td className="border px-4 py-2">{problem.category}</td>
                      <td className="border px-4 py-2">{problem.location}</td>
                      <td className="border px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          problem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          problem.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          problem.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2">{problem.userEmail || 'Anonymous'}</td>
                      <td className="border px-4 py-2">
                        <div className="flex flex-col gap-1">
                          <select 
                            className="border rounded px-2 py-1 text-sm"
                            value={problem.status}
                            onChange={(e) => handleStatusChange(problem.id, e.target.value as Problem["status"])}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          
                          {problem.statusUpdateTime && (
                            <div className="text-xs text-gray-500">
                              Last updated: {new Date(problem.statusUpdateTime).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
