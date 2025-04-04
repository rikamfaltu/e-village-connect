
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Problem } from "@/components/problems/ProblemCard";

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);

  useEffect(() => {
    // Load or initialize the last checked time from localStorage
    const storedLastCheckedTime = localStorage.getItem('lastProblemStatusCheck');
    if (storedLastCheckedTime) {
      setLastCheckedTime(storedLastCheckedTime);
    } else {
      const currentTime = new Date().toISOString();
      localStorage.setItem('lastProblemStatusCheck', currentTime);
      setLastCheckedTime(currentTime);
    }
  }, []);

  useEffect(() => {
    // Fetch problems
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        // Mock data for problems
        const mockProblems = [
          {
            id: 1,
            title: "Water Supply Issue in Sector 4",
            category: "water",
            description: "There has been no water supply in our area for the last 3 days.",
            status: "pending" as const,
            createdAt: new Date(2023, 10, 15).toISOString(),
            statusUpdateTime: new Date(2023, 10, 15).toISOString(),
          },
          {
            id: 2,
            title: "Street Light Not Working",
            category: "electricity",
            description: "The street light near the main temple has not been working for a week.",
            status: "in_progress" as const,
            createdAt: new Date(2023, 10, 12).toISOString(),
            statusUpdateTime: new Date(2023, 10, 12).toISOString(),
          },
          {
            id: 3,
            title: "Garbage Collection",
            category: "sanitation",
            description: "Garbage has not been collected from our area for the past week.",
            status: "resolved" as const,
            createdAt: new Date(2023, 10, 5).toISOString(),
            statusUpdateTime: new Date(2023, 10, 5).toISOString(),
          }
        ];
        
        setTimeout(() => {
          // Get problems from localStorage if any exist
          const storedProblems = localStorage.getItem('submittedProblems');
          let allProblems: Problem[] = [...mockProblems];
          
          if (storedProblems) {
            const parsedProblems = JSON.parse(storedProblems);
            
            // Filter to only include problems where userId matches or if no userId is present (for mock data)
            // The key fix: ensure we're properly filtering by both userId and userEmail
            const userProblems = parsedProblems.filter((p: Problem) => 
              !p.userId || 
              p.userId === user?.id || 
              p.userEmail === user?.primaryEmailAddress?.emailAddress
            );
            
            // Only use user-specific problems
            allProblems = [...userProblems];
            
            console.log("Current user email:", user?.primaryEmailAddress?.emailAddress);
            console.log("Found problems:", allProblems.length);
            console.log("All stored problems:", parsedProblems.length);
            
            // Check for status updates since last check
            if (lastCheckedTime) {
              const updatedProblems = allProblems.filter(
                (p) => p.statusUpdateTime && new Date(p.statusUpdateTime) > new Date(lastCheckedTime)
              );
              
              // Notify user of any status updates
              updatedProblems.forEach(problem => {
                toast.info(
                  `The status of your problem "${problem.title}" has been updated to ${problem.status.replace('_', ' ')}`,
                  { duration: 5000, closeButton: true }
                );
              });
            }
            
            // Update the last checked time
            const currentTime = new Date().toISOString();
            localStorage.setItem('lastProblemStatusCheck', currentTime);
            setLastCheckedTime(currentTime);
          }
          
          setProblems(allProblems);
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
  }, [user, lastCheckedTime]);

  return { problems, isLoading };
};
