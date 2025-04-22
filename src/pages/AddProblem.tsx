
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ProblemForm } from "@/components/problems/ProblemForm";

const AddProblem = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      
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
    
    try {
      let imagePath = null;
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user?.id || 'anonymous'}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('problem_images')
          .upload(filePath, selectedFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        imagePath = filePath;
      }
      
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
        throw error;
      }
      
      toast.success("Your problem has been submitted successfully!", {
        duration: 5000,
        closeButton: true
      });
      
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      
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
            
            <ProblemForm
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              handleFileChange={handleFileChange}
              removeSelectedImage={removeSelectedImage}
              previewUrl={previewUrl}
            />
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

