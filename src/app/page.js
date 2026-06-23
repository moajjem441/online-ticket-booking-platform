import AdvertisementSection from "@/components/AdvertisementSection";
import Banner from "@/components/Banner";
import LatestTicketsSection from "@/components/LatestTicketsSection";
import PopularRoutes from "@/components/PopularRoutes";
import WhyChooseUs from "@/components/WhyChooseUs";


export default function Home() {
  return (
 <div>
    <Banner></Banner>
    <AdvertisementSection></AdvertisementSection>
    <LatestTicketsSection></LatestTicketsSection>
    <PopularRoutes></PopularRoutes>
    <WhyChooseUs></WhyChooseUs>
  </div>
  );
}
