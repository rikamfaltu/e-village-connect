import { MessageSquare, Lightbulb, FileText } from "lucide-react";
import StatisticsCard from "../components/StatisticsCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to E-Gram Panchayat</h1>
          <p className="text-xl mb-8">Digital governance at your fingertips</p>
          <a href="/register" className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md transition-colors">
            Get Started
          </a>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Village Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatisticsCard
              title="Complaints Registered"
              count={150}
              icon={<MessageSquare className="w-6 h-6" />}
            />
            <StatisticsCard
              title="Suggestions Received"
              count={75}
              icon={<FileText className="w-6 h-6" />}
            />
            <StatisticsCard
              title="Ideas & Plans"
              count={45}
              icon={<Lightbulb className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-gray-600">Create your account using Aadhar and mobile number</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Login</h3>
              <p className="text-gray-600">Access your account with username and password</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">File Complaint</h3>
              <p className="text-gray-600">Submit your complaints and track their status</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Village Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={`/placeholder.svg`}
                  alt={`Gallery image ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;