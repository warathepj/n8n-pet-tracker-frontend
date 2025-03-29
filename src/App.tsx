import { useEffect, useState } from "react";
import { PetNavbar } from "./components/PetNavbar";
import { PetMap } from "./components/PetMap";
import { PetInfoCard } from "./components/PetInfoCard";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";
import { AlertToastProvider } from "@/components/ui/alert-toast";

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function App() {
  const [homePosition] = useState({ lat: 14.524905435350691, lng: 101.38315173213998 });
  const [petPosition, setPetPosition] = useState(homePosition);
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Location Updated",
      description: "Pet's location has been updated",
      className: "bg-secondary border-primary",
    });
  }, [petPosition]);

  const distance = calculateDistance(
    homePosition.lat,
    homePosition.lng,
    petPosition.lat,
    petPosition.lng
  );

  return (
    <div className="min-h-screen">
      <AlertToastProvider>
        <PetNavbar />
        <main className="container mx-auto p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <PetMap position={petPosition} setPosition={setPetPosition} />
            <PetInfoCard distance={distance} />
          </div>
        </main>
        <Toaster />
      </AlertToastProvider>
    </div>
  );
}
