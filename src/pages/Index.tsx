
import { MessageSquare, Lightbulb, FileText } from "lucide-react";
import StatisticsCard from "../components/StatisticsCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VillageGallery from "../components/VillageGallery";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">{t('home.welcome')}</h1>
          <p className="text-xl mb-8 animate-fade-in">{t('app.description')}</p>
          <a href="/register" className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-md transition-colors animate-fade-in">
            {t('home.getStarted')}
          </a>
        </div>
      </section>

      {/* Village Information Section */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in">{t('home.ourVillage')}</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 animate-fade-in">
              <p className="text-lg">
                {t('home.villageDescription')}
              </p>
              <p className="text-lg">
                {t('home.villageDescription2')}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1472396961693-142e6e269027"
                alt="Village scenery"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.villageStats')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatisticsCard
              title={t('home.complaintsRegistered')}
              count={150}
              icon={<MessageSquare className="w-6 h-6" />}
            />
            <StatisticsCard
              title={t('home.suggestionsReceived')}
              count={75}
              icon={<FileText className="w-6 h-6" />}
            />
            <StatisticsCard
              title={t('home.ideasAndPlans')}
              count={45}
              icon={<Lightbulb className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step1')}</h3>
              <p className="text-gray-600">{t('home.step1Description')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step2')}</h3>
              <p className="text-gray-600">{t('home.step2Description')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step3')}</h3>
              <p className="text-gray-600">{t('home.step3Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">{t('home.villageGallery')}</h2>
          <VillageGallery />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
