/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GalaxySettings, PlanetId } from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { BlenderLabSection } from './components/BlenderLabSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [settings, setSettings] = useState<GalaxySettings>({
    focusedBody: 'all',
    orbitSpeed: 1.0,
    showOrbits: true,
    showAsteroids: true,
    nebulaGlow: true,
    warpSpeed: false,
    starFieldSpeed: 1.0,
    sunGlowColor: '#ffaa00',
  });

  const [fps, setFps] = useState(60);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track page scroll to drive camera path in ThreeCanvas
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateSettings = (newPartial: Partial<GalaxySettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  const handleFocusPlanet = (planet: PlanetId) => {
    setSettings((prev) => ({ ...prev, focusedBody: planet }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#04060b] text-[#f0f3f8] overflow-x-hidden">
      {/* 3D WebGL Galaxy & Solar System Background Engine */}
      <ThreeCanvas
        settings={settings}
        onFpsUpdate={setFps}
        onSelectPlanet={handleFocusPlanet}
        scrollProgress={scrollProgress}
      />

      {/* Foreground Interactive Content Layers */}
      <div className="relative z-10">
        {/* Navigation Bar with Galaxy Telemetry */}
        <Navbar
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          fps={fps}
        />

        {/* Hero Section with Quick Fly-to Planets */}
        <Hero
          onExploreClick={() => scrollToSection('projects')}
          onOpenLab={() => scrollToSection('blender-lab')}
          onFocusPlanet={handleFocusPlanet}
          warpSpeed={settings.warpSpeed}
          onToggleWarp={() => handleUpdateSettings({ warpSpeed: !settings.warpSpeed })}
        />

        {/* Selected 3D Projects Showcase */}
        <ProjectsSection onFocusPlanet={handleFocusPlanet} />

        {/* Interactive Solar System & Galaxy Lab */}
        <BlenderLabSection
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />

        {/* Specialized Skills Matrix */}
        <SkillsSection />

        {/* Career Milestones */}
        <ExperienceSection />

        {/* Contact & Transmission */}
        <ContactSection />

        {/* Studio Footer */}
        <Footer />
      </div>
    </div>
  );
}
