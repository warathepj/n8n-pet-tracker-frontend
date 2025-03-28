import { Card } from "./ui/card";

export function PetInfoCard({ distance }: { distance: number }) {
  return (
    <Card className="p-4 bg-secondary rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-primary mb-2">
        Current Status
      </h2>
      <p className="text-gray-700">
        Distance from home: {distance.toFixed(2)} km
      </p>
    </Card>
  );
}