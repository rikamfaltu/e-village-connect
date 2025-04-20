import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { X, Image } from "lucide-react";

const AddProblem = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    console.log("Form data:", data);
    console.log("Current user:", user?.id, user?.primaryEmailAddress?.emailAddress);
    
    try {
      // Get existing problems from localStorage
      const existingProblems = localStorage.getItem('submittedProblems');
      const problems = existingProblems ? JSON.parse(existingProblems) : [];
      
      // Generate a unique ID that won't conflict with existing problems
      const highestId = problems.length > 0 
        ? Math.max(...problems.map((p: any) => p.id)) 
        : 0;
      const newId = highestId + 1;
      
      // Create a new problem object with user information
      const newProblem = {
        id: newId,
        title: data.title,
        category: data.category,
        description: data.description,
        location: data.location,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        contactNumber: data.contactNumber || '',
        urgency: data.urgency || 'medium',
        // Add image if present
        image: previewUrl,
        // Add user information
        userId: user?.id,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous User',
        submittedAt: new Date().toISOString(),
      };
      
      console.log("Creating new problem:", newProblem);
      
      // Add new problem and save back to localStorage
      problems.push(newProblem);
      localStorage.setItem('submittedProblems', JSON.stringify(problems));
      
      // Show success toast with dismiss button
      toast.success("Your problem has been submitted successfully!", {
        duration: 5000,
        closeButton: true
      });
      
      // Reset form and image preview
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Navigate to my problems page (optional)
      // navigate('/my-problems');
    } catch (error) {
      console.error("Error submitting problem:", error);
      toast.error("Failed to submit your problem. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image (optional)
                </label>
                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  {!previewUrl ? (
                    <div className="space-y-1 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary">
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                      <button 
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
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
