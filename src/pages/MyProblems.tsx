
import React, { useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useProblems } from "@/hooks/useProblems";
import ProblemsList from "@/components/problems/ProblemsList";
import EmptyProblemsList from "@/components/problems/EmptyProblemsList";
import LoadingProblems from "@/components/problems/LoadingProblems";
import StatisticsCard from "@/components/StatisticsCard";
import { CheckCircle2, Clock, AlertTriangle, FileCheck } from "lucide-react";

const MyProblems = () => {
  const { problems, isLoading } = useProblems();

  // Calculate statistics for user's problems
  const statistics = useMemo(() => {
    const pending = problems.filter(p => p.status === "pending").length;
    const inProgress = problems.filter(p => p.status === "in_progress").length;
    const resolved = problems.filter(p => p.status === "resolved").length;
    const total = problems.length;
    
    return { pending, inProgress, resolved, total };
  }, [problems]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <SignedIn>
          <h1 className="text-3xl font-bold mb-6">My Submitted Problems</h1>
          
          {isLoading ? (
            <LoadingProblems />
          ) : (
            <>
              {/* Problem Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatisticsCard 
                  title="Total Problems" 
                  count={statistics.total} 
                  icon={<FileCheck className="text-primary" />}
                />
                <StatisticsCard 
                  title="Pending" 
                  count={statistics.pending} 
                  icon={<Clock className="text-yellow-500" />}
                />
                <StatisticsCard 
                  title="In Progress" 
                  count={statistics.inProgress} 
                  icon={<AlertTriangle className="text-blue-500" />}
                />
                <StatisticsCard 
                  title="Resolved" 
                  count={statistics.resolved} 
                  icon={<CheckCircle2 className="text-green-500" />}
                />
              </div>
              
              {/* Problems List */}
              {problems.length === 0 ? (
                <EmptyProblemsList />
              ) : (
                <ProblemsList problems={problems} />
              )}
            </>
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
