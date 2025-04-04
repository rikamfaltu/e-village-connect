
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useProblems } from "@/hooks/useProblems";
import ProblemsList from "@/components/problems/ProblemsList";
import EmptyProblemsList from "@/components/problems/EmptyProblemsList";
import LoadingProblems from "@/components/problems/LoadingProblems";

const MyProblems = () => {
  const { problems, isLoading } = useProblems();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <SignedIn>
          <h1 className="text-3xl font-bold mb-6">My Submitted Problems</h1>
          
          {isLoading ? (
            <LoadingProblems />
          ) : problems.length === 0 ? (
            <EmptyProblemsList />
          ) : (
            <ProblemsList problems={problems} />
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
