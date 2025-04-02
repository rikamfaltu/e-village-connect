
import React from "react";
import { useTranslation } from "react-i18next";
import { useProblems, ProblemStatus } from "../context/ProblemContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { format } from "date-fns";

const StatusBadge = ({ status }: { status: ProblemStatus }) => {
  let className = "px-2 py-1 text-xs font-medium rounded-full ";
  
  switch (status) {
    case "pending":
      className += "bg-yellow-100 text-yellow-800";
      break;
    case "in-progress":
      className += "bg-blue-100 text-blue-800";
      break;
    case "resolved":
      className += "bg-green-100 text-green-800";
      break;
    case "rejected":
      className += "bg-red-100 text-red-800";
      break;
    default:
      className += "bg-gray-100 text-gray-800";
  }

  return <span className={className}>{status}</span>;
};

const MyProblems = () => {
  const { t } = useTranslation();
  const { problems } = useProblems();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <SignedIn>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6">{t('problems.title')}</h1>
            
            {problems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('problems.noProblem')}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>List of problems you have submitted</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('problems.status')}</TableHead>
                      <TableHead>{t('problems.date')}</TableHead>
                      <TableHead>{t('problems.category')}</TableHead>
                      <TableHead>{t('problems.location')}</TableHead>
                      <TableHead className="w-[300px]">{t('problems.description')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problems.map((problem) => (
                      <TableRow key={problem.id}>
                        <TableCell>
                          <StatusBadge status={problem.status} />
                        </TableCell>
                        <TableCell>{format(problem.createdAt, 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="capitalize">{problem.category}</TableCell>
                        <TableCell>{problem.location}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {problem.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
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
