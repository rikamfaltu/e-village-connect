
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProblemTable from '../components/admin/ProblemTable';
import { useAdminProblems } from '../hooks/useAdminProblems';
import { Mail, Loader2 } from 'lucide-react';

const AdminPanel = () => {
  const { problems, handleStatusChange, isLoading } = useAdminProblems();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Problems</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center my-8 gap-3">
              <Loader2 className="animate-spin h-12 w-12 text-primary" />
              <p className="text-gray-500">Loading problems...</p>
            </div>
          ) : (
            problems.length > 0 ? (
              <ProblemTable 
                problems={problems}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">No problems found in the system.</p>
                <p className="text-sm">Add some problems from the user interface to see them here.</p>
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
