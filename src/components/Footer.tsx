
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{t('app.title')}</h3>
            <p className="text-sm">{t('footer.empowering')}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-secondary transition-colors">{t('nav.about')}</a></li>
              <li><a href="/services" className="hover:text-secondary transition-colors">Services</a></li>
              <li><a href="/contact" className="hover:text-secondary transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contactInfo')}</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 XXXXX XXXXX</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@egrampanchayat.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Your Village, District, State</span>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} {t('app.title')}. {t('footer.allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
