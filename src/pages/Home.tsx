/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Code, 
  Layout, 
  Compass, 
  Layers, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { projectsService, cmsService } from '../services';
import { Project, HomeSettings, Skill, parseHomeInfoItem, BiographyLeftSettings, BiographyCard } from '../types';

// Animation configurations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bioLeft, setBioLeft] = useState<BiographyLeftSettings | null>(null);
  const [bioCards, setBioCards] = useState<BiographyCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [projs, settings, loadedSkills, bioSettingsData, bioCardsData] = await Promise.all([
          projectsService.getProjects(),
          cmsService.getHomeSettings(),
          cmsService.getSkills(),
          cmsService.getBioLeftSettings(),
          cmsService.getBioCards()
        ]);
        setFeaturedProjects(projs.filter(p => p.featured));
        setHomeSettings(settings);
        setSkills(loadedSkills);
        setBioLeft(bioSettingsData);
        setBioCards(bioCardsData);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);
  
  // Categorized skills for structured skills section
  const designSkills = skills.filter(s => s.category === 'design');
  const devSkills = skills.filter(s => s.category === 'development');
  const toolSkills = skills.filter(s => s.category === 'tools');

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col justify-between px-6 py-12 lg:px-12 border-b border-white/10">
        {/* Subtle dynamic focal lights */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.2, 0.15],
            x: [0, 10, 0],
            y: [0, -15, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#f27d26]/10 rounded-full blur-[120px] -z-10 pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.06, 0.1, 0.06],
            x: [0, -20, 0],
            y: [0, 10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-white/5 rounded-full blur-[140px] -z-10 pointer-events-none" 
        />

        {/* Decorative Top Line */}
        <div className="hidden lg:block w-full border-t border-white/5 pt-4">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500">
            <span>SYSTEM INITIALIZED • SECURE DESIGN CORE</span>
            <span className="text-[#f27d26]">SEOUL, KR // ONLINE</span>
          </div>
        </div>

        {/* Hero Content Area */}
        <div className="max-w-6xl mx-auto w-full my-auto py-12 relative font-sans">
          {/* Vertical Rail for Extra Editorial Polish */}
          <div className="hidden xl:block absolute -right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right whitespace-nowrap text-[9px] font-mono tracking-[0.5em] uppercase text-white/15 select-none">
            PRINCIPAL FRONTEND ARCHITECT & UX SYSTEMS
          </div>

          <div className="space-y-8 max-w-5xl">
            {/* Version Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-3 py-1 bg-zinc-900 border border-white/10 rounded-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f27d26] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-300">
                PORTFOLIO CORE ENGINE V2.6
              </span>
            </motion.div>

            {/* Display Typography */}
            <div className="space-y-4 font-sans">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="font-display text-[48px] sm:text-[85px] md:text-[115px] lg:text-[145px] font-black leading-[0.8] tracking-[-0.04em] uppercase"
              >
                <motion.span variants={fadeInUp} className="block font-sans">
                  {homeSettings?.line1 || 'FIFTEEN'}
                </motion.span>
                <motion.span variants={fadeInUp} className="block text-zinc-450 font-sans">
                  {homeSettings?.line2 || 'YEARS OF'}
                </motion.span>
                <motion.span variants={fadeInUp} className="block text-[#f27d26] font-sans">
                  {homeSettings?.line3 || 'CRAFT'}
                </motion.span>
              </motion.h1>
            </div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-sans text-base sm:text-xl text-zinc-400 max-w-2xl leading-relaxed font-light"
            >
              {homeSettings?.subHeadline || 'Specializing in premium high-fidelity React architectures, robust system scale blueprints, and micro-hover states designed carefully with surgical discipline.'}
            </motion.p>

            {/* Actions CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 font-mono"
            >
              <Link
                to="/projects"
                id="hero-cta-projects"
                className="px-8 py-4 text-xs font-mono tracking-[0.2em] uppercase font-bold bg-[#f27d26] text-black hover:bg-white transition-all flex items-center justify-center gap-2 group rounded-sm cursor-pointer"
              >
                EXPLORE WORK <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                to="/contact"
                id="hero-cta-contact"
                className="px-8 py-4 text-xs font-mono tracking-[0.2em] uppercase font-bold border border-white/10 hover:border-[#f27d26] text-white hover:bg-zinc-950 transition-all text-center rounded-sm cursor-pointer"
              >
                CONNECT INQUIRY
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Info Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10 font-sans"
        >
          {(homeSettings ? [
            parseHomeInfoItem('experience', homeSettings.experience, 'EXPERIENCE', 0),
            parseHomeInfoItem('location', homeSettings.location, 'LOCATION', 1),
            parseHomeInfoItem('primaryStack', homeSettings.primaryStack, 'PRIMARY STACK', 2),
            parseHomeInfoItem('infrastructure', homeSettings.infrastructure, 'INFRASTRUCTURE', 3)
          ].sort((a, b) => a.sortOrder - b.sortOrder) : [
            { key: 'experience', label: 'EXPERIENCE', value: '15+ Years Professional' },
            { key: 'location', label: 'LOCATION', value: 'Seoul, KR / Remote' },
            { key: 'primaryStack', label: 'PRIMARY STACK', value: 'React / TS / Tailwind' },
            { key: 'infrastructure', label: 'INFRASTRUCTURE', value: 'Supabase / PG / Firebase' }
          ]).map((item) => (
            <div key={item.key} className="flex flex-col gap-1">
              <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${item.key === 'primaryStack' ? 'text-[#f27d26] font-semibold' : 'text-zinc-500'}`}>
                {item.label}
              </span>
              <span className="font-sans text-sm font-semibold text-white">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 2. FEATURED WORKS SECTION */}
      <section className="py-24 px-6 lg:px-12 border-b border-white/10 bg-[#070707] font-sans">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">SELECTED REVELATIONS</span>
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white leading-none">
                FEATURED WORK
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-[#f27d26] transition-colors border-b border-white/10 pb-1"
            >
              VIEW FULL INDEX <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 font-mono text-xs text-zinc-500 uppercase tracking-widest">
              CATALOGING RESOURCE NODES...
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {featuredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group cursor-pointer space-y-6"
                >
                  <Link to={`/projects/${project.id}`}>
                    <div className="aspect-[16/10] rounded-sm overflow-hidden bg-zinc-950 border border-white/10 relative">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-2.5 py-1 text-[9px] font-mono tracking-[0.15em] uppercase bg-[#f27d26] text-black rounded-sm font-semibold">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase">
                      {project.client && <span>{project.client}</span>}
                      {project.client && <span>•</span>}
                      <span>{project.year}</span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-black tracking-wide text-white group-hover:text-[#f27d26] transition-colors uppercase">
                      <Link to={`/projects/${project.id}`}>{project.title}</Link>
                    </h3>
                    <p className="font-sans text-sm text-zinc-400 line-clamp-2 leading-relaxed font-light">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-sm font-sans text-zinc-500 text-xs uppercase tracking-widest">
              등록된 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* 3. ABOUT PREVIEW SECTION */}
      <section className="py-24 px-6 lg:px-12 bg-[#050505] border-b border-white/10 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">
                {bioLeft?.sectionLabel || 'BIOGRAPHY OVERVIEW'}
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[0.95] text-white whitespace-pre-line">
                {bioLeft?.mainHeading || 'DETAIL PAGES &\nVISUAL DESIGN.'}
              </h2>
            </div>
            
            <div className="space-y-4 font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              {bioLeft?.p1 ? (
                <>
                  {bioLeft.p1 && <p>{bioLeft.p1}</p>}
                  {bioLeft.p2 && <p>{bioLeft.p2}</p>}
                  {bioLeft.p3 && <p>{bioLeft.p3}</p>}
                </>
              ) : (
                <p>
                  브랜드의 메시지를 효과적으로 전달하는 웹 & 비주얼 디자이너입니다.
                </p>
              )}
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-mono font-bold tracking-[0.15em] uppercase border border-white/10 hover:border-[#f27d26] hover:bg-zinc-950 text-white transition-all rounded-sm cursor-pointer"
              >
                {bioLeft?.buttonText || 'VIEW PROFILE'} <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bioCards && bioCards.length > 0 ? (
              bioCards.map((card, idx) => {
                const cardIcons = [Layout, Code, Compass, Smartphone];
                const IconComp = cardIcons[idx % cardIcons.length];
                return (
                  <motion.div 
                    key={card.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (idx % 2) * 0.1 }}
                    className="p-8 rounded-sm bg-[#090909] border border-white/5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-sm bg-[#f27d26]/10 flex items-center justify-center text-[#f27d26]">
                        <IconComp size={18} />
                      </div>
                      <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
                        {card.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12 border border-dashed border-white/5 rounded-sm font-mono text-zinc-500 text-xs uppercase tracking-widest">
                No cards created. Create cards in the admin panel to display.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL SKILLS SECTION */}
      <section className="py-24 px-6 lg:px-12 bg-[#070707] border-b border-white/10 font-sans">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">ENGINEERING STACK</span>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              TECHNICAL EXPERTISE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Design Column */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f27d26] flex items-center gap-2">
                <Layout size={14} /> UI / VISUAL DESIGN
              </h3>
              <div className="space-y-5 bg-[#090909] border border-white/5 p-6 rounded-sm">
                {designSkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span className="font-semibold uppercase text-[11px] tracking-wider">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-[#f27d26]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Column */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f27d26] flex items-center gap-2">
                <Code size={14} /> ARCHITECTURE & DEV
              </h3>
              <div className="space-y-5 bg-[#090909] border border-white/5 p-6 rounded-sm">
                {devSkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span className="font-semibold uppercase text-[11px] tracking-wider">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-[#f27d26]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack & Tools Column */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f27d26] flex items-center gap-2">
                <Layers size={14} /> STACK & DEPLOYMENT
              </h3>
              <div className="space-y-5 bg-[#090909] border border-white/5 p-6 rounded-sm">
                {toolSkills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span className="font-semibold uppercase text-[11px] tracking-wider">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-[#f27d26]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT CTA BANNER */}
      <section className="py-24 px-6 lg:px-12 bg-[#050505] font-sans">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-12 sm:p-20 rounded-sm bg-[#090909] border border-white/10 text-center relative overflow-hidden group hover:border-[#f27d26] transition-all duration-500"
          >
            {/* Subtle light leak in banner */}
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#f27d26]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative space-y-8 z-10">
              <span className="text-xs font-mono tracking-[0.35em] uppercase text-[#f27d26]">SECURED CONNECTION OPEN</span>
              
              <h2 className="font-display text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-[0.9]">
                LET'S CREATE <br className="hidden sm:inline" />
                SOMETHING TIMELESS.
              </h2>
              
              <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed font-light">
                Have an interactive layout concept, frontend system requirement, or comprehensive design system in mind? Let's connect the system nodes.
              </p>

              <div className="pt-4 flex justify-center font-mono">
                <Link
                  to="/contact"
                  id="home-contact-banner-cta"
                  className="px-10 py-5 text-xs font-mono font-black tracking-[0.2em] uppercase bg-[#f27d26] text-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group rounded-sm shadow-lg shadow-[#f27d26]/10 hover:shadow-white/5 cursor-pointer"
                >
                  TRANSMIT DIRECT INQUIRY <ArrowUpRight size={15} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
