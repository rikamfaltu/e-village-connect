import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Problem } from "@/components/problems/ProblemCard";

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);

  // Load or initialize the last checked time from localStorage
  const storedLastCheckedTime = localStorage.getItem('lastProblemStatusCheck');
  if (storedLastCheckedTime) {
    setLastCheckedTime(storedLastCheckedTime);
  } else {
    const currentTime = new Date().toISOString();
    localStorage.setItem('lastProblemStatusCheck', currentTime);
    setLastCheckedTime(currentTime);
  }

  useEffect(() => {
    if (!user) {
      console.log("User not available, skipping problem fetch");
      setIsLoading(false);
      return;
    }
    
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        // Mock data with unique IDs starting from 1000 to avoid conflicts
        const mockProblems = [
          {
            id: 1001,
            title: "Water Supply Issue in Sector 4",
            category: "water",
            description: "There has been no water supply in our area for the last 3 days.",
            status: "pending" as const,
            createdAt: new Date(2023, 10, 15).toISOString(),
            statusUpdateTime: new Date(2023, 10, 15).toISOString(),
            image: null,
            location: "Sector 4",
          },
          {
            id: 1002,
            title: "Street Light Not Working",
            category: "electricity",
            description: "The street light near the main temple has not been working for a week.",
            status: "in_progress" as const,
            createdAt: new Date(2023, 10, 12).toISOString(),
            statusUpdateTime: new Date(2023, 10, 12).toISOString(),
            image: null,
            location: "Main Temple Road",
          },
          {
            id: 1003,
            title: "Garbage Collection",
            category: "sanitation",
            description: "Garbage has not been collected from our area for the past week.",
            status: "resolved" as const,
            createdAt: new Date(2023, 10, 5).toISOString(),
            statusUpdateTime: new Date(2023, 10, 5).toISOString(),
            image: null,
            location: "Market Area",
          }
        ];
        
        setTimeout(() => {
          const storedProblems = localStorage.getItem('submittedProblems');
          let allProblems: Problem[] = [];
          
          if (storedProblems) {
            try {
              const parsedProblems = JSON.parse(storedProblems);
              console.log("Parsing stored problems:", parsedProblems);
              
              // Enhanced filtering with unique IDs
              const userProblems = parsedProblems.filter((p: Problem) => {
                console.log("Checking problem:", p);
                return (!p.userId && !p.userEmail) ||
                       (p.userId && user?.id && p.userId === user.id) ||
                       (p.userEmail && user?.primaryEmailAddress?.emailAddress && 
                        p.userEmail.toLowerCase() === user.primaryEmailAddress.emailAddress.toLowerCase());
              }).map((p: Problem, index: number) => ({
                ...p,
                id: 2000 + index // Ensure unique IDs for user problems starting from 2000
              }));
              
              console.log("Found user problems:", userProblems.length);
              allProblems = [...mockProblems, ...userProblems];
              
              // Check for status updates since last check
              if (lastCheckedTime) {
                const updatedProblems = allProblems.filter(
                  (p) => p.statusUpdateTime && new Date(p.statusUpdateTime) > new Date(lastCheckedTime)
                );
                
                // Notify user of any status updates
                updatedProblems.forEach(problem => {
                  let statusMessage = "";
                  switch(problem.status) {
                    case "resolved":
                      statusMessage = "has been resolved";
                      break;
                    case "in_progress":
                      statusMessage = "is now being addressed";
                      break;
                    case "rejected":
                      statusMessage = "has been rejected";
                      break;
                    default:
                      statusMessage = "has been updated to " + problem.status;
                  }
                  
                  toast.info(
                    `Your problem "${problem.title}" ${statusMessage}`,
                    { duration: 5000, closeButton: true }
                  );
                });
              }
              
            } catch (error) {
              console.error("Error parsing stored problems:", error);
              toast.error("There was an error loading your problems");
              allProblems = [...mockProblems];
            }
          } else {
            console.log("No stored problems found, using mock data");
            allProblems = [...mockProblems];
          }
          
          // Update the last checked time
          const currentTime = new Date().toISOString();
          localStorage.setItem('lastProblemStatusCheck', currentTime);
          setLastCheckedTime(currentTime);
          
          console.log("Setting final problems:", allProblems);
          setProblems(allProblems);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.error("Failed to load your problems");
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [user, lastCheckedTime]);

  return { problems, isLoading };
};
