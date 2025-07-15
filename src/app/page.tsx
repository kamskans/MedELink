'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CaseManagers from '@/components/CaseManagers'
import CTASection from '@/components/CTASection'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CaseManagers />
      <CTASection />
      <AboutSection />
      <Footer />
    </main>
  )
}