
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Info, CheckCircle, Clock, XCircle } from "lucide-react";

// Define the Problem type
interface Problem {
  id: number;
  title: string;
  category: string;
  description: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  createdAt: string;
  contactNumber?: string;
  location?: string;
  urgency?: string;
}

const AdminPanel = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const { user } = useUser();
  
  // Admin emails - in a real app, this would come from a database or authentication system
  const adminEmails = ["admin@example.com"];
  
  const isAdmin = user && adminEmails.includes(user.primaryEmailAddress?.emailAddress || "");

  useEffect(() => {
    // Fetch all problems
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from an API with admin authentication
        // Using mock data and localStorage for this demo
        setTimeout(() => {
          const storedProblems = localStorage.getItem('submittedProblems');
          
          // Mock data for demonstration
          const mockProblems = [
            {
              id: 1,
              title: "Water Supply Issue in Sector 4",
              category: "water",
              description: "There has been no water supply in our area for the last 3 days.",
              status: "pending" as const,
              createdAt: new Date(2023, 10, 15).toISOString(),
              contactNumber: "9876543210",
              location: "Sector 4, Block B",
              urgency: "high"
            },
            {
              id: 2,
              title: "Street Light Not Working",
              category: "electricity",
              description: "The street light near the main temple has not been working for a week.",
              status: "in_progress" as const,
              createdAt: new Date(2023, 10, 12).toISOString(),
              contactNumber: "8765432109",
              location: "Main Temple Road",
              urgency: "medium"
            },
            {
              id: 3,
              title: "Garbage Collection",
              category: "sanitation",
              description: "Garbage has not been collected from our area for the past week.",
              status: "resolved" as const,
              createdAt: new Date(2023, 10, 5).toISOString(),
              contactNumber: "7654321098",
              location: "Park View Society",
              urgency: "low"
            }
          ];
          
          let allProblems = [...mockProblems];
          
          if (storedProblems) {
            const parsedProblems = JSON.parse(storedProblems).map((problem: any) => ({
              ...problem,
              status: problem.status || "pending" as const,
              createdAt: problem.createdAt || new Date().toISOString()
            }));
            allProblems = [...parsedProblems, ...mockProblems];
          }
          
          setProblems(allProblems);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.error("Failed to load problems");
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleStatusChange = (id: number, newStatus: Problem["status"]) => {
    const updatedProblems = problems.map(problem => 
      problem.id === id ? { ...problem, status: newStatus } : problem
    );
    
    setProblems(updatedProblems);
    
    // Update localStorage (only for user-submitted problems)
    const storedProblems = localStorage.getItem('submittedProblems');
    if (storedProblems) {
      const parsedProblems = JSON.parse(storedProblems);
      const updatedStoredProblems = parsedProblems.map((problem: any) => 
        problem.id === id ? { ...problem, status: newStatus } : problem
      );
      localStorage.setItem('submittedProblems', JSON.stringify(updatedStoredProblems));
    }
    
    toast.success(`Problem status updated to ${newStatus}`);
  };

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

  const getStatusIcon = (status: Problem["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in_progress":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin panel.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <SignedIn>
          <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
          <p className="text-gray-600 mb-6">Manage and track all citizen problems</p>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>List of all reported problems</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map((problem) => (
                      <TableRow key={problem.id}>
                        <TableCell className="font-medium">{problem.id}</TableCell>
                        <TableCell>{problem.title}</TableCell>
                        <TableCell className="capitalize">{problem.category.replace('_', ' ')}</TableCell>
                        <TableCell>{formatDate(problem.createdAt)}</TableCell>
                        <TableCell>{getStatusBadge(problem.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Sheet>
                              <SheetTrigger className="p-2 rounded-full hover:bg-gray-100">
                                <Info className="h-4 w-4" />
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>{problem.title}</SheetTitle>
                                  <SheetDescription>
                                    Problem ID: {problem.id}
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                                    <p className="mt-1 capitalize">{problem.category.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                    <p className="mt-1">{problem.description}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                    <p className="mt-1">{problem.location || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                                    <p className="mt-1">{problem.contactNumber || "Not provided"}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Urgency</h3>
                                    <p className="mt-1 capitalize">{problem.urgency || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Submitted on</h3>
                                    <p className="mt-1">{formatDate(problem.createdAt)}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                    <div className="mt-1 flex items-center space-x-2">
                                      {getStatusIcon(problem.status)}
                                      <span className="capitalize">{problem.status.replace('_', ' ')}</span>
                                    </div>
                                  </div>
                                  <div className="pt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        onClick={() => handleStatusChange(problem.id, "pending")}
                                        className={`px-3 py-1 text-xs rounded-full ${
                                          problem.status === "pending" 
                                            ? "bg-yellow-200 text-yellow-800" 
                                            : "bg-gray-100 hover:bg-yellow-100"
                                        }`}
                                      >
                                        Pending
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(problem.id, "in_progress")}
                                        className={`px-3 py-1 text-xs rounded-full ${
                                          problem.status === "in_progress" 
                                            ? "bg-blue-200 text-blue-800" 
                                            : "bg-gray-100 hover:bg-blue-100"
                                        }`}
                                      >
                                        In Progress
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(problem.id, "resolved")}
                                        className={`px-3 py-1 text-xs rounded-full ${
                                          problem.status === "resolved" 
                                            ? "bg-green-200 text-green-800" 
                                            : "bg-gray-100 hover:bg-green-100"
                                        }`}
                                      >
                                        Resolved
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(problem.id, "rejected")}
                                        className={`px-3 py-1 text-xs rounded-full ${
                                          problem.status === "rejected" 
                                            ? "bg-red-200 text-red-800" 
                                            : "bg-gray-100 hover:bg-red-100"
                                        }`}
                                      >
                                        Rejected
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                            
                            <button
                              onClick={() => handleStatusChange(problem.id, "in_progress")}
                              className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                              title="Mark as In Progress"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleStatusChange(problem.id, "resolved")}
                              className="p-2 rounded-full hover:bg-green-100 text-green-600"
                              title="Mark as Resolved"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleStatusChange(problem.id, "rejected")}
                              className="p-2 rounded-full hover:bg-red-100 text-red-600"
                              title="Mark as Rejected"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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

export default AdminPanel;
