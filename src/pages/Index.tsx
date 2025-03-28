
import React from 'react'
import { Layout } from '@/components/layout/Layout'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { CTASection } from '@/components/home/CTASection'
import { Button } from '@/components/ui/button'

const Index: React.FC = () => {
  const handleClick = async () => {
    try {
      await fetch('http://localhost:3000/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'message from simulator' }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Layout>
      <Button onClick={handleClick}>Send Message to Frontend</Button>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </Layout>
  )
}

export default Index
