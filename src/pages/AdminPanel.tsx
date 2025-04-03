
const handleStatusChange = (id: number, newStatus: Problem["status"]) => {
  // Find the problem to update
  const problemToUpdate = problems.find(problem => problem.id === id);
  if (!problemToUpdate) return;
  
  const statusUpdateTime = new Date().toISOString();
  
  const updatedProblems = problems.map(problem => 
    problem.id === id ? { 
      ...problem, 
      status: newStatus,
      statusUpdateTime 
    } : problem
  );
  
  setProblems(updatedProblems);
  
  // Update localStorage (only for user-submitted problems)
  const storedProblems = localStorage.getItem('submittedProblems');
  if (storedProblems) {
    const parsedProblems = JSON.parse(storedProblems);
    const updatedStoredProblems = parsedProblems.map((problem: any) => 
      problem.id === id ? { 
        ...problem, 
        status: newStatus,
        statusUpdateTime 
      } : problem
    );
    localStorage.setItem('submittedProblems', JSON.stringify(updatedStoredProblems));
  }
  
  // Show notification to admin
  toast.success(`Problem status updated to ${newStatus}`);
  
  // In a real app, this would trigger an email notification
  // For this demo, we'll simulate it with a console log
  if (problemToUpdate.userEmail) {
    console.log(`Email notification sent to ${problemToUpdate.userEmail} about problem status update to ${newStatus}`);
    
    // Show a toast to simulate email being sent
    toast.info(
      <div className="flex flex-col gap-1">
        <div className="font-medium">Notification sent to user</div>
        <div className="text-sm text-gray-500">An email has been sent to {problemToUpdate.userEmail} about this update</div>
      </div>,
      {
        icon: <Mail className="h-5 w-5 text-blue-500" />,
        duration: 4000
      }
    );
  }
};
