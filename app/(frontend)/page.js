
import Offers from "@/components/Offers";       
import ContectUs from "@/components/ContactUs";   
      
import Slider from "@/components/Slider"; 

// This is a Next.js Server Component for the Home page
export default async function Home() {
  
  
  return (
    <>
      <Slider />
    
      <Offers />

      <ContectUs/>
  
    </>
  );
}
