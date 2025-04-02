
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const AddProblem = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    toast.success("Your problem has been submitted successfully!");
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <SignedIn>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Submit Your Problem</h1>
            <p className="text-gray-600 mb-6 text-center">
              Please provide details about the issue you're facing in our village.
              Our team will review your submission and take appropriate action.
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number (optional)
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
                {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message?.toString()}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Submit Problem
              </button>
            </form>
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

export default AddProblem;
