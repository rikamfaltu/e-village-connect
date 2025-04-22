
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { UrgencySelect } from './UrgencySelect';

interface ProblemFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isSubmitting: boolean;
  onSubmit: (data: any) => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSelectedImage: () => void;
  previewUrl: string | null;
}

export const ProblemForm: React.FC<ProblemFormProps> = ({
  register,
  errors,
  isSubmitting,
  onSubmit,
  handleFileChange,
  removeSelectedImage,
  previewUrl,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Problem Title
        </label>
        <input
          {...register("title", { required: "Problem title is required" })}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="e.g., Water Supply Issue, Road Damage, etc."
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message?.toString()}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register("category", { required: "Category is required" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Select a category</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="water">Water Supply</option>
          <option value="electricity">Electricity</option>
          <option value="sanitation">Sanitation</option>
          <option value="education">Education</option>
          <option value="healthcare">Healthcare</option>
          <option value="other">Other</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message?.toString()}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location in Village
        </label>
        <input
          {...register("location", { required: "Location is required" })}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Specific area or landmark"
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message?.toString()}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Description
        </label>
        <textarea
          {...register("description", { 
            required: "Description is required",
            minLength: { value: 30, message: "Description should be at least 30 characters" }
          })}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Please provide a detailed explanation of the problem..."
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message?.toString()}</p>}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image (optional)
        </label>
        <ImageUpload 
          previewUrl={previewUrl}
          onFileChange={handleFileChange}
          onRemoveImage={removeSelectedImage}
        />
      </div>

      <UrgencySelect register={register} errors={errors} />

      <div>
        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number (for SMS notifications)
        </label>
        <input
          {...register("contactNumber", {
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number"
            }
          })}
          type="tel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Your 10-digit phone number"
        />
        <p className="text-xs text-gray-500 mt-1">We'll send you updates about your complaint status via SMS</p>
        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message?.toString()}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Problem"
        )}
      </button>
    </form>
  );
};

