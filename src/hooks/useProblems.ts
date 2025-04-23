
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Problem } from "@/components/problems/ProblemCard";
import { supabase } from "@/integrations/supabase/client";

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);

  // Load last checked time on initialization
  useEffect(() => {
    const storedLastCheckedTime = localStorage.getItem('lastProblemStatusCheck');
    if (storedLastCheckedTime) {
      setLastCheckedTime(storedLastCheckedTime);
    } else {
      const currentTime = new Date().toISOString();
      localStorage.setItem('lastProblemStatusCheck', currentTime);
      setLastCheckedTime(currentTime);
    }
  }, []);

  // Fetch problems when component mounts and whenever user changes
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching problems...");
        
        // Fetch problems from Supabase
        const { data: supabaseProblems, error } = await supabase
          .from('problems')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        console.log("Fetched problems from Supabase:", supabaseProblems);
        
        // Transform Supabase data to match our Problem type
        const transformedProblems: Problem[] = supabaseProblems.map((problem) => {
          // Ensure we have a valid ID - UUIDs can't directly be parsed as integers
          const id = problem.id ? 
            parseInt(problem.id.split('-')[0], 16) || Math.floor(Math.random() * 10000) : 
            Math.floor(Math.random() * 10000);
            
          return {
            id,
            title: problem.title,
            category: problem.category,
            description: problem.description,
            status: problem.status as "pending" | "in_progress" | "resolved" | "rejected",
            createdAt: problem.created_at,
            statusUpdateTime: problem.status_update_time,
            location: problem.location,
            image: problem.image_path ? 
              `${supabase.storage.from('problem_images').getPublicUrl(problem.image_path).data.publicUrl}` : 
              null,
            userId: problem.user_id,
            userEmail: problem.user_email,
            userName: problem.user_name,
            contactNumber: problem.contact_number,
            urgency: problem.urgency
          };
        });

        // Mock data for demo purposes
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
        
        // Combine mock data with real data
        const allProblems = [...mockProblems, ...transformedProblems];
        console.log("Combined problems data:", allProblems);
        
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
        
        // Update the last checked time
        const currentTime = new Date().toISOString();
        localStorage.setItem('lastProblemStatusCheck', currentTime);
        setLastCheckedTime(currentTime);
        
        // Save problems to state
        setProblems(allProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.error("Failed to load your problems");
      } finally {
        setIsLoading(false);
      }
    };

    // Always fetch problems on mount or when user changes
    fetchProblems();
  }, [user]); // Removed lastCheckedTime dependency to prevent infinite fetching

  return { problems, isLoading };
};
