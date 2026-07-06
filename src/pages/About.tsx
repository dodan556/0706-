/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Users, 
  Compass, 
  Award, 
  Terminal, 
  Cpu, 
  Layers, 
  Zap, 
  Sparkles, 
  CheckCircle,
  ShieldAlert,
  Framer,
  Layout,
  FileCode,
  Github
} from 'lucide-react';
import { cmsService } from '../services';
import { AboutSettings, Skill, Certification } from '../types';

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
      staggerChildren: 0.1
    }
  }
};

export default function About() {
  const [aboutSettings, setAboutSettings] = useState<AboutSettings | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [settings, loadedSkills, loadedCerts] = await Promise.all([
          cmsService.getAboutSettings(),
          cmsService.getSkills(),
          cmsService.getCertifications()
        ]);
        setAboutSettings(settings);
        setSkills(loadedSkills);
        setCerts(loadedCerts);
      } catch (err) {
        console.error('Failed to load about page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const designSkills = skills.filter((s) => s.category === 'design');
  const developmentSkills = skills.filter((s) => s.category === 'development');
  const toolsSkills = skills.filter((s) => s.category === 'tools');

  const history = [
    { year: '2020 - PRESENT', role: 'PRINCIPAL FRONTEND & UX ARCHITECT', company: 'Paris Design Lab', desc: 'Directing next-generation React architectures, motion design patterns, and accessible design system frameworks. Spearheaded high-fidelity conversions for multiple international brands.' },
    { year: '2015 - 2020', role: 'LEAD INTERACTIVE DESIGNER', company: 'Studio Aurora', desc: 'Engineered award-winning responsive layouts, creative storytelling environments, and fully interactive data visualization dashboards using D3 and customized Canvas routines.' },
    { year: '2011 - 2015', role: 'SENIOR PRODUCT ENGINEER', company: 'Vortex Technologies', desc: 'Established cross-platform layout guidelines, custom design tool applications, and unified visual interface guidelines with absolute code performance guarantees.' },
  ];

  // 사용 프로그램 (Software/Programs Used)
  const softwareStack = [
    { name: 'Figma', category: 'UI/UX Design & Prototyping', desc: 'Design system curation, high-fidelity layouts, vector paths, and micro-flow prototyping.', icon: Layout, level: 'Expert' },
    { name: 'VS Code & WebStorm', category: 'React & TS IDE', desc: 'Type-safe assembly, bundler optimizations, fast compilation setups, and system programming.', icon: FileCode, level: 'Expert' },
    { name: 'Framer Motion', category: 'Micro-Interactions', desc: 'Physics-backed layout transition curves, kinetic loops, and seamless route animations.', icon: Framer, level: 'Advanced' },
    { name: 'Git & GitHub Workspace', category: 'Version Control & CI/CD', desc: 'Advanced git flow structures, secure environmental configuration, and automatic deployment pipeline logs.', icon: Github, level: 'Advanced' },
    { name: 'Adobe Creative Suite', category: 'Asset Curation & Editing', desc: 'Photoshop, Illustrator, and Premiere Pro for customized branding, icon mapping, and multimedia.', icon: Sparkles, level: 'Advanced' },
    { name: 'Supabase / Firebase', category: 'Backend Synchronization', desc: 'Database security rules setup, client-side queries, persistent node syncing, and authentication integrations.', icon: Layers, level: 'Intermediate' },
  ];

  // 자격증 (Certifications)
  const certifications = [
    { name: '정보처리기사 (Engineer Information Processing)', authority: 'Human Resources Development Service of Korea', date: '2015.06', code: 'License No. 15401050218U' },
    { name: 'AWS Certified Cloud Practitioner', authority: 'Amazon Web Services', date: '2022.11', code: 'Validation ID: QG6Z7BL2N2E1QGCS' },
    { name: 'Google UX Design Professional Certificate', authority: 'Google / Coursera', date: '2021.04', code: 'Credential ID: GUXD-984210' },
    { name: 'Certified ScrumMaster® (CSM)', authority: 'Scrum Alliance', date: '2019.08', code: 'Credential ID: 001004529' },
  ];

  // 작업 스타일 (Work Style)
  const workStyles = [
    {
      step: '01',
      title: 'Aesthetic Honesty & Discipline',
      subtitle: '아름다운 절제와 미니멀리즘',
      desc: '불필요한 장식과 불완전한 픽셀을 철저히 배제합니다. 타이포그래피의 엄격한 그리드 구조, 여백의 변주, 그리고 인지 편향을 유도하지 않는 직관적인 레이아웃 구조를 통해 최상의 시각적 조화를 이뤄냅니다.'
    },
    {
      step: '02',
      title: 'Performance & Architecture First',
      subtitle: '성능 최우선 및 타입 안정성',
      desc: '리렌더링을 유발하는 비효율적인 컴포넌트 구조를 기피하고 가벼우면서도 견고한 TypeScript 코드를 작성합니다. 번들러 최적화를 통해 로딩 시간을 극소화하고, 어떠한 환경에서도 완벽한 프레임을 보장합니다.'
    },
    {
      step: '03',
      title: 'Atomic & Highly Scalable Design System',
      subtitle: '아토믹 디자인 시스템 기반',
      desc: '공통 컴포넌트는 재사용성과 범용성을 보장하는 독립적인 아토믹 패턴으로 정교하게 세분화합니다. 이를 통해 신속하고 안정적인 UI 확장이 가능한 지속 가능한 디자인 가이드라인을 수립합니다.'
    },
    {
      step: '04',
      title: 'Natural Micro-Hover States',
      subtitle: '물리 기반의 미세 상호작용',
      desc: '사용자의 마우스 흐름이나 화면 전환 등 모든 모션 상호작용에 자연스러운 물리 역학 기반의 지연 효과를 조율합니다. 사용자 행동에 민감하고 즉각적이면서도 과장되지 않은 부드러운 움직임을 제공합니다.'
    }
  ];

  return (
    <div className="pt-28 pb-24 px-6 bg-[#050505] text-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* ================= 소개 (INTRODUCTION) SECTION ================= */}
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">
              {aboutSettings?.subtitle || 'BIOGRAPHY PROFILE'}
            </span>
            <h1 className="font-display text-4xl sm:text-7xl font-black uppercase tracking-tight leading-[0.85]">
              {aboutSettings?.title || 'ABOUT ME'}
            </h1>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
            <div className="lg:col-span-8 space-y-6 text-zinc-300 font-sans text-base sm:text-lg leading-relaxed font-light">
              <p>
                {aboutSettings?.p1 || '안녕하세요. 시각적 절제와 절대적인 코드 품질을 지향하는 시니어 UI/UX 디자이너 겸 프론트엔드 아키텍트 PARK SEONGMI 입니다. 웹 인터페이스는 단순한 그래픽의 나열이 아닌, 사용자와 서비스 간의 원활한 상호작용이 일어나는 유기적인 환경이어야 한다고 믿습니다.'}
              </p>
              <p>
                {aboutSettings?.p2 || '지난 15년간 다양한 글로벌 브랜드의 대규모 디자인 시스템을 수립하고 고성능 React 프레임워크 기반의 웹 환경을 구현해 왔습니다. 타이포그래피의 세심한 디테일부터 물리 법칙에 충실한 모션 지연 효과까지, 모든 시각적 요소에 설득력 있는 논리를 부여합니다.'}
              </p>
              <p>
                {aboutSettings?.p3 || '단순한 "동작"을 넘어선, 사용자의 무의식이 반응하는 가장 완벽하고 이상적인 인터페이스 경험을 만들기 위해 오늘도 설계와 개발의 유기적 융합을 탐구하고 있습니다.'}
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#090909] border border-white/10 p-6 space-y-6 rounded-sm">
              <h3 className="font-display font-bold uppercase tracking-wider text-sm text-white border-b border-white/5 pb-2">CORE PRINCIPLES</h3>
              <ul className="space-y-4 font-mono text-[11px] text-zinc-400">
                <li className="flex gap-3">
                  <Heart size={14} className="text-[#f27d26] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-sans font-bold text-xs">TYPOGRAPHY & ACCURATE SCALE</span>
                    <span className="font-sans text-[11px] text-zinc-500 font-light block mt-0.5">완벽하게 정렬된 타이포그래피 그리드 및 유기적인 레이아웃 배율 설계</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Users size={14} className="text-[#f27d26] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-sans font-bold text-xs">ACCESSIBILITY-FIRST DESIGN</span>
                    <span className="font-sans text-[11px] text-zinc-500 font-light block mt-0.5">웹 접근성을 철저히 보장하는 컬러 대비 및 마크업 규칙 준수</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Compass size={14} className="text-[#f27d26] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-sans font-bold text-xs">FLUID PHYSICS-BASED TIMINGS</span>
                    <span className="font-sans text-[11px] text-zinc-500 font-light block mt-0.5">마치 현실 세계의 물리 역학을 따르는 듯한 자연스럽고 탄력적인 애니메이션</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= 작업 스타일 (WORK STYLE) SECTION ================= */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">METHODOLOGY</span>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight uppercase text-white">
              WORK STYLE
            </h2>
            <p className="font-sans text-sm text-zinc-400 font-light">
              비주얼 기획 단계부터 완성형 컴포넌트 빌드까지 적용되는 엄격한 디자인 및 엔지니어링 프로세스입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {workStyles.map((style, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-sm bg-[#090909] border border-white/5 hover:border-[#f27d26] transition-all duration-300 group space-y-4"
              >
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="font-mono text-xs tracking-widest text-[#f27d26] font-bold">{style.step}</span>
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">{style.subtitle}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#f27d26] transition-colors uppercase tracking-wide">
                    {style.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                    {style.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= 사용 프로그램 (SOFTWARE & TOOLS) SECTION ================= */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">ENGINEERING SYSTEM</span>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight uppercase text-white">
              SOFTWARE & TOOLCHAIN
            </h2>
            <p className="font-sans text-sm text-zinc-400 font-light">
              아이디어를 완벽한 실체로 정교하게 직조하기 위해 주력으로 활용하는 업계 규격 도구와 최신 기술 스택입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {softwareStack.map((soft, idx) => {
              const IconComp = soft.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 bg-[#090909] border border-white/5 rounded-sm hover:border-white/15 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded bg-zinc-950 border border-white/10 flex items-center justify-center text-[#f27d26]">
                        <IconComp size={18} />
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-mono tracking-wider bg-zinc-900 border border-white/10 text-zinc-400 rounded-sm uppercase">
                        {soft.level}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-base text-white tracking-wide uppercase">
                        {soft.name}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        {soft.category}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light">
                      {soft.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ================= 자격증 (CERTIFICATIONS) SECTION ================= */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">PROFESSIONAL CREDENTIALS</span>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight uppercase text-white">
              CERTIFICATIONS
            </h2>
            <p className="font-sans text-sm text-zinc-400 font-light">
              공인된 엔지니어링 수행 역량과 최신 설계 및 프레임워크 이해도를 인증하는 전문 자격 명세입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {(certs.length > 0 ? certs : certifications).map((cert, idx) => (
              <motion.div
                key={cert.id || idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-[#090909] border border-white/5 hover:border-[#f27d26] transition-all rounded-sm flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded bg-[#f27d26]/10 shrink-0 flex items-center justify-center text-[#f27d26]">
                  <Award size={18} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide group-hover:text-[#f27d26] transition-colors">
                      {cert.name}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-zinc-400 font-light">
                    {cert.authority}
                  </p>
                  <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-zinc-550 uppercase">
                    <span>{cert.date}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{cert.code}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= 기술 자산 (TECHNICAL EXPERTISE) SECTION ================= */}
        <section className="space-y-12 border-t border-white/10 pt-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">ENGINEERING DEPTH</span>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight uppercase text-white">
              TECHNICAL EXPERTISE
            </h2>
            <p className="font-sans text-sm text-zinc-400 font-light">
              각 기술 노드별 축적된 아키텍처 구현 성숙도입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Design */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f27d26] flex items-center gap-2">
                <Layout size={12} /> UI / VISUAL DESIGN
              </h3>
              <div className="space-y-4 bg-[#090909] border border-white/5 p-6 rounded-sm">
                {designSkills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span className="font-semibold uppercase text-[10px] tracking-wider">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-zinc-950 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-[#f27d26]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Development */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f27d26] flex items-center gap-2">
                <Terminal size={12} /> ARCHITECTURE
              </h3>
              <div className="space-y-4 bg-[#090909] border border-white/5 p-6 rounded-sm">
                {developmentSkills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span className="font-semibold uppercase text-[10px] tracking-wider">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-zinc-950 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-[#f27d26]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f27d26] flex items-center gap-2">
                <Cpu size={12} /> STACK & TOOLS
              </h3>
              <div className="space-y-4 bg-[#090909] border border-white/5 p-6 rounded-sm">
                {toolsSkills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-zinc-300">
                      <span className="font-semibold uppercase text-[10px] tracking-wider">{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1 bg-zinc-950 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-[#f27d26]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 이력 연혁 (TIMELINE) SECTION ================= */}
        <section className="space-y-10 border-t border-white/10 pt-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#f27d26]">PROFESSIONAL EXP</span>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight uppercase text-white">
              TIMELINE
            </h2>
          </div>
          <div className="space-y-8">
            {history.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-white/5 pb-8 last:border-b-0">
                <div className="md:col-span-3">
                  <span className="font-mono text-[11px] tracking-wider text-[#f27d26] font-semibold">{item.year}</span>
                </div>
                <div className="md:col-span-9 space-y-2">
                  <h3 className="font-display font-bold text-lg text-white uppercase tracking-wide">
                    {item.role} <span className="text-zinc-500 font-normal">AT</span> {item.company}
                  </h3>
                  <p className="font-sans text-sm text-zinc-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
