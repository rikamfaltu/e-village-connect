
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

// Mock data for problems - in a real app, this would come from an API
const mockProblems = [
  {
    id: 1,
    title: "Water Supply Issue in Sector 4",
    category: "water",
    description: "There has been no water supply in our area for the last 3 days.",
    status: "pending",
    createdAt: new Date(2023, 10, 15).toISOString(),
  },
  {
    id: 2,
    title: "Street Light Not Working",
    category: "electricity",
    description: "The street light near the main temple has not been working for a week.",
    status: "in_progress",
    createdAt: new Date(2023, 10, 12).toISOString(),
  },
  {
    id: 3,
    title: "Garbage Collection",
    category: "sanitation",
    description: "Garbage has not been collected from our area for the past week.",
    status: "resolved",
    createdAt: new Date(2023, 10, 5).toISOString(),
  }
];

interface Problem {
  id: number;
  title: string;
  category: string;
  description: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  createdAt: string;
}

const MyProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    // Simulate API fetch
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from an API with the user's ID
        // const response = await fetch(`/api/problems?userId=${user?.id}`);
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setProblems(mockProblems);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.error("Failed to load your problems");
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProblems();
    }
  }, [user]);

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <SignedIn>
          <h1 className="text-3xl font-bold mb-6">My Submitted Problems</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : problems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No problems submitted yet</h3>
              <p className="text-gray-500 mb-4">Once you submit problems, they will appear here.</p>
              <a 
                href="/add-problem" 
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Submit a Problem
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {problems.map((problem) => (
                <div 
                  key={problem.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
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
              ))}
            </div>
          )}
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
      <Footer />
    </div>
  );
};

export default MyProblems;
