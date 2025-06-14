import { DocumentChartBarIcon } from '@heroicons/react/24/outline';

export const DashboardHeader = () => {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <DocumentChartBarIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
      </div>
      <p className="text-gray-600">Overview of sales and advertising data</p>
    </header>
  );
};
