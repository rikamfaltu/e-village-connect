
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface UrgencySelectProps {
  register: UseFormRegister<any>;
  errors: any;
}

export const UrgencySelect: React.FC<UrgencySelectProps> = ({ register, errors }) => {
  return (
    <div>
      <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
        Urgency Level
      </label>
      <div className="mt-1 space-y-2">
        <div className="flex items-center">
          <input
            {...register("urgency", { required: "Urgency level is required" })}
            id="low"
            value="low"
            type="radio"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <label htmlFor="low" className="ml-3 block text-sm text-gray-700">
            Low - Can be addressed in the coming weeks
          </label>
        </div>
        <div className="flex items-center">
          <input
            {...register("urgency")}
            id="medium"
            value="medium"
            type="radio"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <label htmlFor="medium" className="ml-3 block text-sm text-gray-700">
            Medium - Needs attention within a week
          </label>
        </div>
        <div className="flex items-center">
          <input
            {...register("urgency")}
            id="high"
            value="high"
            type="radio"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <label htmlFor="high" className="ml-3 block text-sm text-gray-700">
            High - Requires immediate attention
          </label>
        </div>
      </div>
      {errors.urgency && <p className="text-red-500 text-sm mt-1">{errors.urgency.message?.toString()}</p>}
    </div>
  );
};

