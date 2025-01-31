import { ChartBar } from "lucide-react";

interface StatisticsCardProps {
  title: string;
  count: number;
  icon?: React.ReactNode;
}

const StatisticsCard = ({ title, count, icon = <ChartBar /> }: StatisticsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-primary">{count}</p>
    </div>
  );
};

export default StatisticsCard;