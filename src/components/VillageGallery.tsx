import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    alt: "Village life",
    caption: "Rural Life"
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    alt: "Natural resources",
    caption: "Natural Beauty"
  }
];

const VillageGallery = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="relative group overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4 text-lg font-medium">{image.caption}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default VillageGallery;