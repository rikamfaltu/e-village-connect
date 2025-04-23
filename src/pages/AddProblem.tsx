import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { X, Image, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const AddProblem = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log("Form data:", data);
    console.log("Current user:", user?.id, user?.primaryEmailAddress?.emailAddress);
    
    try {
      let imagePath = null;
      
      // Upload image to Supabase Storage if one was selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user?.id || 'anonymous'}/${fileName}`;
        
        console.log("Attempting to upload file to path:", filePath);
        console.log("File size:", selectedFile.size);
        console.log("File type:", selectedFile.type);
        
        // Check if bucket exists first and log it
        const { data: buckets, error: bucketsError } = await supabase
          .storage
          .listBuckets();
          
        if (bucketsError) {
          console.error("Error checking buckets:", bucketsError);
          toast.error("Error checking storage buckets");
        } else {
          console.log("Available buckets:", buckets.map(b => b.name));
        }
        
        // Upload with progress monitoring
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('problem_images')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              console.log(`Upload progress: ${progress.percent}%`);
              setUploadProgress(Math.round(progress.percent));
            }
          });
        
        if (uploadError) {
          console.error("Image upload error:", uploadError);
          toast.error(`Failed to upload image: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
        
        imagePath = filePath;
        console.log("Image uploaded successfully at path:", imagePath);
        
        // Verify the uploaded file exists
        const { data: fileData } = await supabase
          .storage
          .from('problem_images')
          .getPublicUrl(filePath);
          
        console.log("Public URL for uploaded image:", fileData.publicUrl);
      }
      
      // Create problem record in Supabase
      const { data: newProblem, error } = await supabase
        .from('problems')
        .insert([{
          title: data.title,
          category: data.category,
          description: data.description,
          location: data.location,
          status: "pending",
          user_id: user?.id || null,
          user_email: user?.primaryEmailAddress?.emailAddress || null,
          user_name: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous User',
          contact_number: data.contactNumber || null,
          urgency: data.urgency || 'medium',
          image_path: imagePath
        }])
        .select();
      
      if (error) {
        console.error("Problem submission error:", error);
        toast.error(`Failed to submit your problem: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log("Problem submitted successfully:", newProblem);
      
      // Show success toast with dismiss button
      toast.success("Your problem has been submitted successfully!", {
        duration: 5000,
        closeButton: true
      });
      
      // Reset form and image preview
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      
    } catch (error: any) {
      console.error("Unexpected error submitting problem:", error);
      toast.error(`An unexpected error occurred: ${error.message || "Please try again later"}`);
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
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
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{width: `${uploadProgress}%`}}
                          ></div>
                        </div>
                      )}
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
