import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const MqttMessages: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8085');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      toast({
        title: `MQTT Message - ${data.topic}`,
        description: data.message,
        duration: 10000,
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to MQTT service",
        variant: "destructive",
      });
    };

    return () => {
      ws.close();
    };
  }, [toast]);

  return null;
};