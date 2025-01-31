import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ComplaintForm {
  title: string;
  description: string;
  category: string;
}

const Complaints = () => {
  const { register, handleSubmit, reset } = useForm<ComplaintForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ComplaintForm) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      console.log(data);
      toast.success("Complaint submitted successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Submit a Complaint</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full p-2 border rounded-md"
            placeholder="Brief title of your complaint"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a category</option>
            <option value="water">Water Supply</option>
            <option value="electricity">Electricity</option>
            <option value="roads">Roads</option>
            <option value="sanitation">Sanitation</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full p-2 border rounded-md h-32"
            placeholder="Detailed description of your complaint"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default Complaints;