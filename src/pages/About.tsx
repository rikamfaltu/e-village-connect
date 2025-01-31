import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About E-Gram Panchayat</h1>
          
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700">
                E-Gram Panchayat is dedicated to bringing digital transformation to rural governance. 
                Our platform connects villagers with their local administration, making government 
                services more accessible and transparent.
              </p>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Facilitate digital documentation and record-keeping</li>
                <li>Enable online complaint registration and tracking</li>
                <li>Provide updates on village development projects</li>
                <li>Share important announcements and notifications</li>
                <li>Promote transparency in local governance</li>
              </ul>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-700">
                We envision a future where every village in India is digitally empowered, 
                where governance is transparent, and where every citizen has easy access to 
                government services right from their homes.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;