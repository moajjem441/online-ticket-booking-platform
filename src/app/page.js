import AdvertisementSection from "@/components/AdvertisementSection";
import Banner from "@/components/Banner";
import LatestTicketsSection from "@/components/LatestTicketsSection";
import Image from "next/image";

export default function Home() {
  return (
 <div>
    <Banner></Banner>
    <AdvertisementSection></AdvertisementSection>
    <LatestTicketsSection></LatestTicketsSection>
  </div>
  );
}
