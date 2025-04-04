
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProblemTable from '../components/admin/ProblemTable';
import { useAdminProblems } from '../hooks/useAdminProblems';
import { Mail } from 'lucide-react';

const AdminPanel = () => {
  const { problems, handleStatusChange } = useAdminProblems();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Problems</h2>
          <ProblemTable 
            problems={problems}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
