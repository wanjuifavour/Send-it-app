import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  label?: string;
  icon: ReactNode;
}

export function StatsCard({ title, value, change, label, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-[#2E8B57]">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
            {change && (
              <span className="ml-2 text-sm font-medium text-green-600">
                {change}
              </span>
            )}
            {label && (
              <span className="ml-2 text-sm text-gray-500">
                {label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}