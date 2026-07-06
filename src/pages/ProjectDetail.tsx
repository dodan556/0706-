/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Briefcase, 
  Layers, 
  Maximize2,
  X,
  Sparkles,
  Laptop,
  CheckCircle,
  Eye,
  Bookmark
} from 'lucide-react';
import { projectsService } from '../services';
import { Project } from '../types';

// Program / Software Info interface
interface ProgramInfo {
  name: string;
  role: string;
  category: 'Design' | 'Development' | 'Creative' | 'Graphics' | 'Animation' | 'DevOps';
}

// Dedicated tools mapper based on project ID for premium experience
const PROJECT_PROGRAMS: Record<string, ProgramInfo[]> = {
  '1': [
    { name: 'Figma', role: 'UI/UX 디자인 및 고해상도 프로토타이핑', category: 'Design' },
    { name: 'Visual Studio Code', role: '컴포넌트 개발 및 상태 관리 구현', category: 'Development' },
    { name: 'Adobe Photoshop', role: '제품 이미지 가공 및 비주얼 리터칭', category: 'Creative' },
    { name: 'Framer Motion', role: '정밀 인터랙션 및 프레임워크 트랜지션', category: 'Animation' }
  ],
  '2': [
    { name: 'Figma', role: '비정형 레이아웃 오가닉 설계', category: 'Design' },
    { name: 'Visual Studio Code', role: 'WebGL 연동 프론트엔드 최적화', category: 'Development' },
    { name: 'Three.js / WebGL', role: '실시간 3D 그래픽 렌더링 파이프라인', category: 'Graphics' },
    { name: 'Blender', role: '가상 미술관 3D 오브젝트 에셋 모델링', category: 'Creative' }
  ],
  '3': [
    { name: 'Figma', role: '디자인 시스템 아토믹 컴포넌트 토큰 설계', category: 'Design' },
    { name: 'Storybook', role: '독립형 컴포넌트 샌드박스 테스팅', category: 'Development' },
    { name: 'Visual Studio Code', role: 'Tailwind 기반 유틸리티 CSS 컴포넌팅', category: 'Development' },
    { name: 'GitHub Workspace', role: '버전 관리 및 배포 자동화 파이프라인', category: 'DevOps' }
  ],
  '4': [
    { name: 'Figma', role: '뉴모피즘 오디오 데크 GUI 설계', category: 'Design' },
    { name: 'Visual Studio Code', role: 'Web Audio API 핵심 제어 로직 설계', category: 'Development' },
    { name: 'Adobe Audition', role: '공간 음향 입체 오디오 음원 엔지니어링', category: 'Creative' },
    { name: 'Blender', role: '다이얼 노브 질감 메탈릭 매핑 렌더링', category: 'Creative' }
  ]
};

// Default program list fallback
const DEFAULT_PROGRAMS: ProgramInfo[] = [
  { name: 'Figma', role: '제품 인터페이스 & 컴포넌트 기획', category: 'Design' },
  { name: 'Visual Studio Code', role: '프로토타입 애플리케이션 프론트엔드 빌드', category: 'Development' },
  { name: 'GitHub', role: '오픈소스 형상 관리 및 빌드 파이프라인', category: 'DevOps' }
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // State to track the active display image in the gallery
  const [activeImage, setActiveImage] = useState<string>('');
  
  // State for image lightbox/modal zoom
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Load project details dynamically
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const pList = await projectsService.getProjects();
        setProjectsList(pList);
        
        const currentProject = await projectsService.getProjectById(id);
        setProject(currentProject);
        if (currentProject) {
          setActiveImage(currentProject.coverImage);
        }
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  // Auto-manage SEO metadata when the project loads
  useEffect(() => {
    if (project) {
      // --- SEO Metadata Integration ---
      // 1. Dynamic document title
      document.title = `${project.title} | Portfolio Case Study`;
      
      // 2. Dynamic Meta Description update
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', project.description);

      // 3. Structured Data injection (JSON-LD) for SEO Crawlers
      let schemaScript = document.getElementById('seo-schema-script');
      if (schemaScript) {
        schemaScript.remove();
      }
      schemaScript = document.createElement('script');
      schemaScript.id = 'seo-schema-script';
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.innerHTML = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        'name': project.title,
        'headline': project.title,
        'description': project.description,
        'image': project.coverImage,
        'creator': {
          '@type': 'Person',
          'name': 'Portfolio Architect'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Digital Showcase Portfolio'
        },
        'datePublished': project.year,
        'genre': project.category,
        'keywords': project.tags.join(', ')
      });
      document.head.appendChild(schemaScript);
    }

    // Cleanup schema script on navigate or unmount
    return () => {
      const schemaScript = document.getElementById('seo-schema-script');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [project]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 text-center bg-[#050505] min-h-screen text-white flex flex-col items-center justify-center font-mono text-xs">
        RETRIEVING SPECIFICATION FILE FROM THE SECURE STORE...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-32 pb-24 px-6 text-center bg-[#050505] min-h-screen text-white flex flex-col items-center justify-center font-sans">
        <h2 className="font-display text-2xl font-black mb-4 uppercase text-[#f27d26]">PROJECT NOT FOUND</h2>
        <p className="text-zinc-500 text-sm mb-6 uppercase tracking-wider">요청하신 데이터 노드가 활성화되어 있지 않습니다.</p>
        <Link to="/projects" className="font-mono text-xs uppercase tracking-widest text-white hover:text-[#f27d26] underline">
          [BACK TO SHOWCASE INDEX]
        </Link>
      </div>
    );
  }

  // Calculate looping indexes for Previous and Next Projects
  const totalProjects = projectsList.length;
  const projectIndex = projectsList.findIndex((p) => p.id === project.id);
  const prevProjectIndex = totalProjects > 0 ? (projectIndex - 1 + totalProjects) % totalProjects : 0;
  const nextProjectIndex = totalProjects > 0 ? (projectIndex + 1) % totalProjects : 0;

  const prevProject = projectsList[prevProjectIndex];
  const nextProject = projectsList[nextProjectIndex];

  // Combine cover image and images array safely
  const projectImages = Array.from(new Set([project.coverImage, ...(project.images || [])]));

  // Get mapped programs from database or fallback
  const softwarePrograms = project.softwarePrograms && project.softwarePrograms.length > 0 
    ? project.softwarePrograms 
    : DEFAULT_PROGRAMS;

  return (
    <article className="pt-28 pb-24 px-6 bg-[#050505] text-white min-h-screen font-sans overflow-hidden">
      
      {/* Visual SEO Schema micro-data (BreadcrumbList structure for crawlers) */}
      <nav aria-label="Breadcrumb" className="hidden">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link itemProp="item" to="/"><span itemProp="name">Home</span></Link>
            <meta itemProp="position" content="1" />
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link itemProp="item" to="/projects"><span itemProp="name">Projects</span></Link>
            <meta itemProp="position" content="2" />
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">{project.title}</span>
            <meta itemProp="position" content="3" />
          </li>
        </ol>
      </nav>

      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* ================= BACK TO INDEX ================= */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <Link
            to="/projects"
            id="back-to-projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-[#f27d26] transition-colors group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform text-[#f27d26]" /> 
            [BACK TO SHOWCASE INDEX]
          </Link>
          <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase hidden sm:inline">
            SYSTEM NODE: {project.id.padStart(3, '0')} // STATUS: COMPLETE
          </span>
        </motion.div>

        {/* ================= PROJECT TITLE HEADER ================= */}
        <header className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400"
          >
            <span className="px-3 py-1 bg-[#f27d26]/10 border border-[#f27d26]/20 text-[#f27d26] uppercase text-[9px] tracking-widest font-black rounded-sm">
              {project.category}
            </span>
            <span>•</span>
            <span className="uppercase tracking-widest text-[10px] text-zinc-500">{project.year} // DESIGN DISCIPLINE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-none"
          >
            {project.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed font-light"
          >
            {project.description}
          </motion.p>
        </header>

        {/* ================= REPRESENTING COVER IMAGE (대표 이미지) ================= */}
        <section aria-label="Project Main Banner" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f27d26] animate-pulse" />
              REPRESENTING COVER IMAGE // 대표 이미지
            </span>
            <span className="text-[9px] font-mono text-zinc-600 uppercase">
              Click photo to enlarge
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="aspect-[16/9] rounded-sm overflow-hidden bg-zinc-950 border border-white/10 relative group cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
            id="lightbox-trigger"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={`${project.title} - Representative Display`}
                referrerPolicy="no-referrer"
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            
            {/* Hover visual highlight */}
            <div className="absolute inset-0 bg-[#f27d26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Scale/Maximize action Indicator */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/90 border border-white/10 text-[9px] font-mono tracking-widest text-zinc-300 rounded-sm">
              <Maximize2 size={10} className="text-[#f27d26] animate-pulse" /> 
              EXPAND VIEW SHIELD
            </div>

            {/* SEO Structured Caption */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-zinc-400 uppercase tracking-wider hidden sm:block bg-black/70 px-2 py-1 rounded-sm border border-white/5">
              IMAGE VIEWPORT NODE : {activeImage.substring(activeImage.lastIndexOf('/') + 1, activeImage.lastIndexOf('/') + 15) || 'node_img'}
            </div>
          </motion.div>

          {/* ================= IMAGE GALLERY (이미지 갤러리) ================= */}
          {projectImages.length > 1 && (
            <div className="space-y-3 pt-2">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                IMAGE GALLERY // 탐색 슬라이더
              </span>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-zinc-800"
              >
                {projectImages.map((imgUrl, idx) => {
                  const isActive = activeImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative aspect-[16/10] w-28 shrink-0 rounded-sm overflow-hidden bg-zinc-950 border transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'border-[#f27d26] ring-1 ring-[#f27d26]/40 scale-95 shadow-lg shadow-[#f27d26]/10' 
                          : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`${project.title} gallery thumbnail ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} gallery thumbnail preview ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </motion.div>
            </div>
          )}
        </section>

        {/* ================= SPECIFICATIONS & BODY CONTENT ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-6 items-start">
          
          {/* Metadata Specifications Sidebar */}
          <aside className="md:col-span-4 space-y-8 md:sticky md:top-28">
            
            {/* Client Context Meta Box */}
            <div className="space-y-6 bg-[#090909] border border-white/5 p-6 rounded-sm">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Sparkles size={12} className="text-[#f27d26]" />
                <h3 className="font-mono text-[10px] tracking-widest font-black uppercase text-zinc-400">PROJECT CORE METRICS</h3>
              </div>

              <div className="space-y-5 font-sans">
                {project.client && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">CLIENT CONTEXT</span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center gap-2">
                      <Briefcase size={12} className="text-[#f27d26]/80" /> {project.client}
                    </span>
                  </div>
                )}

                {project.role && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">ROLE & DIRECTION</span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center gap-2">
                      <Layers size={12} className="text-[#f27d26]/80" /> {project.role}
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">RELEASE CYCLE</span>
                  <span className="text-xs sm:text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <Calendar size={12} className="text-[#f27d26]/80" /> {project.year} // SYSTEM LIVE
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">CORE SPECIFICATIONS</span>
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[8px] font-mono uppercase tracking-wider border border-white/5 bg-zinc-950 text-zinc-400 rounded-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= 사용 프로그램 (SOFTWARE & TOOLS) ================= */}
            <div className="space-y-4 bg-[#090909] border border-white/5 p-6 rounded-sm">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Laptop size={12} className="text-[#f27d26]" />
                <h3 className="font-mono text-[10px] tracking-widest font-black uppercase text-zinc-400">SOFTWARE & TOOLS // 사용 프로그램</h3>
              </div>

              <div className="space-y-4">
                {softwarePrograms.map((program, idx) => (
                  <div key={idx} className="space-y-1 group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-[#f27d26] transition-colors flex items-center gap-1.5">
                        <CheckCircle size={10} className="text-[#f27d26]" />
                        {program.name}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-500 px-1.5 py-0.2 bg-zinc-950 border border-white/5 uppercase rounded-sm">
                        {program.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-light pl-4 leading-tight">
                      {program.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* ================= Detailed Narrative (프로젝트 설명) ================= */}
          <section className="md:col-span-8 space-y-10">
            
            {/* Narrative Section */}
            <div className="space-y-6">
              <h2 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
                <span>{project.detailTitle || 'PROJECT DISCLOSURE // 상세 소개'}</span>
                <span className="text-xs font-mono text-[#f27d26] font-normal tracking-widest uppercase hidden sm:inline">
                  NARRATIVE SHEETS
                </span>
              </h2>
              
              <div className="space-y-4 font-sans text-zinc-300 leading-relaxed text-sm sm:text-base font-light font-sans">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {project.longDescription || project.description}
                </p>
                
                {/* Visual Accent/Quote box */}
                {project.detailQuote && (
                  <blockquote className="border-l-2 border-[#f27d26] pl-4 py-1 my-6 bg-[#0c0c0c] border-y border-r border-white/5 rounded-r-sm">
                    <p className="text-xs font-mono text-zinc-400 uppercase tracking-wide leading-relaxed">
                      "{project.detailQuote}"
                    </p>
                  </blockquote>
                )}
              </div>
            </div>

            {/* Additional Project Details Exploration Cards */}
            {projectImages.length > 1 && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">
                  EXPLORATION GALLERY DETAILS // 갤러리 상세보기
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectImages.slice(1).map((imgUrl, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setActiveImage(imgUrl);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="aspect-video rounded-sm overflow-hidden bg-zinc-950 border border-white/5 relative group cursor-pointer hover:border-[#f27d26]/40 transition-all duration-300"
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} Narrative Detail Illustration ${index + 1}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase text-white">
                        <Eye size={10} className="text-[#f27d26]" />
                        <span>[SET AS REPRESENTATION]</span>
                      </div>
                      
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-[#f27d26] text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
                          NODE #{index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Highlights (formerly Engineering Spec) */}
            {project.projectHighlights && project.projectHighlights.length > 0 && (
              <div className="bg-[#090909] border border-white/5 p-5 rounded-sm space-y-3" id="project-highlights">
                <div className="flex items-center gap-1.5">
                  <Bookmark size={11} className="text-[#f27d26]" />
                  <h4 className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">PROJECT HIGHLIGHTS // 프로젝트 하이라이트</h4>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500 uppercase list-disc list-inside">
                  {project.projectHighlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}

          </section>

        </div>

        {/* ================= DUAL NAVIGATION: 이전 프로젝트 & 다음 프로젝트 ================= */}
        {totalProjects > 0 && prevProject && nextProject && (
          <section aria-label="Project Navigation Footer" className="pt-16 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              <span>PROJECT SEQUENCE // 이전 & 다음 탐색</span>
              <span>TOTAL METRICS: {totalProjects} ITEMS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 이전 프로젝트 (PREVIOUS PROJECT CTA) */}
              <Link
                to={`/projects/${prevProject.id}`}
                id="prev-project-link"
                className="group p-6 rounded-sm bg-[#090909] hover:bg-zinc-900 border border-white/5 hover:border-[#f27d26]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[120px]"
                aria-label="Go to previous project"
              >
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#f27d26]/2 rounded-full blur-[60px] pointer-events-none transition-colors" />
                
                <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.25em] text-[#f27d26]/80 font-bold relative z-10">
                  <ArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
                  PREVIOUS PROJECT // 이전 프로젝트
                </div>
                
                <div className="space-y-1 mt-4 relative z-10">
                  <h3 className="font-display text-lg font-black tracking-tight text-white group-hover:text-[#f27d26] transition-colors uppercase line-clamp-1">
                    {prevProject.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                    {prevProject.category} • {prevProject.year}
                  </p>
                </div>
              </Link>

              {/* 다음 프로젝트 (NEXT PROJECT CTA) */}
              <Link
                to={`/projects/${nextProject.id}`}
                id="next-project-link"
                className="group p-6 rounded-sm bg-[#090909] hover:bg-zinc-900 border border-white/5 hover:border-[#f27d26]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between text-right min-h-[120px]"
                aria-label="Go to next project"
              >
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-32 h-32 bg-[#f27d26]/2 rounded-full blur-[60px] pointer-events-none transition-colors" />
                
                <div className="flex items-center gap-2 justify-end text-[9px] font-mono uppercase tracking-[0.25em] text-[#f27d26]/80 font-bold relative z-10">
                  NEXT PROJECT // 다음 프로젝트
                  <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
                
                <div className="space-y-1 mt-4 relative z-10">
                  <h3 className="font-display text-lg font-black tracking-tight text-white group-hover:text-[#f27d26] transition-colors uppercase line-clamp-1">
                    {nextProject.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                    {nextProject.category} • {nextProject.year}
                  </p>
                </div>
              </Link>

            </div>
          </section>
        )}

      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            {/* Close trigger button */}
            <button 
              className="absolute top-6 right-6 p-2 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-white/10 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close image viewer"
            >
              <X size={20} />
            </button>

            {/* Captions and image preview */}
            <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center gap-3">
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                src={activeImage}
                alt={`${project.title} - Maximize Screen Spec`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="max-w-full max-h-[80vh] object-contain rounded-sm border border-white/10 shadow-2xl"
              />
              <div className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase text-center flex items-center gap-2">
                <Sparkles size={11} className="text-[#f27d26]" />
                <span>{project.title} — {project.category} ({project.year})</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </article>
  );
}
