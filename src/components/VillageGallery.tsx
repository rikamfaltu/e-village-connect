import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Share2 } from "lucide-react";

const images = [
  {
    url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    alt: "Village scenery with mountains",
    caption: "Scenic Mountain View"
  },
  {
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    alt: "Aerial view of village",
    caption: "Bird's Eye View"
  },
  {
    url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    alt: "Village life",
    caption: "Rural Life"
  },
  {
    url: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    alt: "Village agriculture",
    caption: "Agricultural Heritage"
  },
  {
    url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    alt: "Village traditions",
    caption: "Cultural Heritage"
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    alt: "Village landscape",
    caption: "Natural Beauty"
  },
  {
    url: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    alt: "Village wildlife",
    caption: "Local Wildlife"
  },
  {
    url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    alt: "Village community",
    caption: "Community Life"
  }
];

const VillageGallery = () => {
  const shareOnWhatsApp = (image: typeof images[0]) => {
    const text = `Check out this beautiful image from our village: ${image.caption}`;
    const url = image.url;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareWebsiteOnWhatsApp = () => {
    const text = "Check out our beautiful village website!";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Village Gallery</h2>
        <button
          onClick={shareWebsiteOnWhatsApp}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors animate-fade-in"
        >
          <Share2 className="w-5 h-5" />
          <span>Share on WhatsApp</span>
        </button>
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div 
                className="relative group overflow-hidden rounded-lg animate-fade-in" 
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                  <div className="p-4 space-y-2">
                    <p className="text-white text-lg font-medium">{image.caption}</p>
                    <button
                      onClick={() => shareOnWhatsApp(image)}
                      className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="animate-fade-in" />
        <CarouselNext className="animate-fade-in" />
      </Carousel>
    </div>
  );
};

export default VillageGallery;