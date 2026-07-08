/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Calendar, 
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { projectsService } from '../services';
import { Project } from '../types';

type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // default page size

  // Load projects from database service
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectsService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load portfolio list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 1. Gather Unique Categories from loaded projects
  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  // 2. Filter, Search and Sort Logic
  const processedProjects = useMemo(() => {
    // A. Filter & Search
    let results = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.client || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // B. Sorting
    results.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.year.localeCompare(a.year) || b.id.localeCompare(a.id);
      }
      if (sortBy === 'oldest') {
        return a.year.localeCompare(b.year) || a.id.localeCompare(b.id);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return results;
  }, [projects, searchQuery, selectedCategory, sortBy]);

  // 3. Pagination Logic
  const totalItems = processedProjects.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Safe page constraint on query adjustments
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProjects = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return processedProjects.slice(startIndex, startIndex + pageSize);
  }, [processedProjects, safeCurrentPage, pageSize]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="pt-28 pb-24 px-6 bg-[#050505] text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f27d26] animate-pulse" />
            <span className="text-xs font-mono tracking-[0.25em] text-zinc-400 uppercase">EXPERIENTIAL SHOWCASE</span>
          </div>
          <h1 className="font-display text-4xl sm:text-7xl font-black uppercase tracking-tight leading-[0.85]">
            SELECTED WORKS
          </h1>
          <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
            A curated index of premium high-fidelity React architectures, visual design systems, and beautiful micro-hover states crafted with rigorous discipline.
          </p>
        </div>

        {/* ================= CONTROLS & FILTER GRID ================= */}
        <div className="space-y-6 pb-8 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Category Select Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer ${
                      isActive
                        ? 'bg-[#f27d26] text-black font-bold border border-[#f27d26]'
                        : 'bg-[#090909] border border-white/5 hover:border-white/20 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Sort & Settings Block */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2 bg-[#090909] border border-white/5 px-3 py-2 rounded-sm">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">SHOW:</span>
                {[2, 4, 8].map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer ${
                      pageSize === size 
                        ? 'text-[#f27d26] font-bold' 
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Sorting Dropdown */}
              <div className="relative inline-flex items-center bg-[#090909] border border-white/5 px-3 py-2 rounded-sm group hover:border-white/20 transition-all">
                <ArrowUpDown size={11} className="text-[#f27d26] mr-2" />
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-transparent border-none text-[10px] font-mono tracking-widest text-zinc-300 focus:outline-none uppercase pr-4 cursor-pointer"
                >
                  <option value="newest" className="bg-[#090909]">NEWEST FIRST</option>
                  <option value="oldest" className="bg-[#090909]">OLDEST FIRST</option>
                  <option value="title-asc" className="bg-[#090909]">TITLE A-Z</option>
                  <option value="title-desc" className="bg-[#090909]">TITLE Z-A</option>
                </select>
              </div>

            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f27d26]" size={15} />
            <input
              type="text"
              placeholder="QUERY PLATFORMS, CLIENT NAMES, TECH OR TAGS..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3.5 bg-[#090909] border border-white/5 hover:border-white/15 focus:border-[#f27d26] text-white font-mono text-xs uppercase tracking-widest transition-all rounded-sm focus:outline-none focus:ring-1 focus:ring-[#f27d26]/30"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest cursor-pointer"
              >
                [CLEAR]
              </button>
            )}
          </div>
        </div>

        {/* ================= WORKS LAYOUT GRID ================= */}
        <div>
          {loading ? (
            <div className="text-center py-24 font-mono text-xs text-zinc-500 uppercase tracking-widest">
              CATALOGING RESOURCE NODES...
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {projects.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 border border-dashed border-white/10 bg-[#070707] rounded-sm"
                >
                  <p className="font-sans text-xs uppercase tracking-[0.25em] text-zinc-500">
                    등록된 프로젝트가 없습니다.
                  </p>
                </motion.div>
              ) : paginatedProjects.length > 0 ? (
                <motion.div 
                  layout
                  key={`${selectedCategory}-${sortBy}-${safeCurrentPage}-${searchQuery}-${projects.length}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16"
                >
                  {paginatedProjects.map((project) => (
                    <motion.div
                      layout
                      key={project.id}
                      className="group space-y-5"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link to={`/projects/${project.id}`} id={`project-card-${project.id}`} className="block">
                        <div className="aspect-[16/10] rounded-sm overflow-hidden bg-zinc-950 border border-white/10 relative group">
                          
                          {/* Interactive Cover Image */}
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.03] opacity-75 group-hover:opacity-100"
                          />
                          
                          {/* Hover Overlay Light Leak */}
                          <div className="absolute inset-0 bg-[#f27d26]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                          
                          {/* Category Tag */}
                          <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 text-[9px] font-mono tracking-[0.2em] uppercase bg-[#f27d26] text-black font-black rounded-sm shadow-md">
                              {project.category}
                            </span>
                          </div>

                          {/* Creative Indicator */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-7 h-7 bg-black/80 border border-white/25 rounded-full flex items-center justify-center text-[#f27d26]">
                              <Sparkles size={12} />
                            </div>
                          </div>

                        </div>
                      </Link>

                      {/* Meta Specifications */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                          {project.client && <span className="flex items-center gap-1"><Briefcase size={10} /> {project.client}</span>}
                          {project.client && <span>•</span>}
                          <span className="flex items-center gap-1"><Calendar size={10} /> {project.year}</span>
                          {project.role && <span>•</span>}
                          {project.role && <span className="flex items-center gap-1 text-[#f27d26]/80 font-bold"><Layers size={10} /> {project.role}</span>}
                        </div>

                        <h2 className="font-display text-xl sm:text-2xl font-black tracking-wide text-white group-hover:text-[#f27d26] transition-colors uppercase leading-snug">
                          <Link to={`/projects/${project.id}`}>{project.title}</Link>
                        </h2>

                        <p className="font-sans text-sm text-zinc-400 line-clamp-2 leading-relaxed font-light">
                          {project.description}
                        </p>

                        {/* Associated Skill Nodes */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase border border-white/5 bg-zinc-900/40 text-zinc-400 group-hover:border-[#f27d26]/10 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 border border-dashed border-white/10 bg-[#070707] rounded-sm"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                    NO HARDWARE NODE MATCHED THE ENTERED PARAMETERS
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* ================= PAGINATION MODULE ================= */}
        {!loading && totalPages > 1 && (
          <div className="pt-12 flex items-center justify-between border-t border-white/5 text-zinc-400 font-mono text-xs">
            <span className="text-[10px] tracking-wider uppercase text-zinc-500">
              PAGING {safeCurrentPage} OF {totalPages} ({totalItems} ITEMS)
            </span>

            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage === 1}
                className="p-2 border border-white/5 hover:border-white/20 bg-[#090909] hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-[#090909] disabled:hover:border-white/5 transition-all text-white rounded-sm cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Individual Page Indicators */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center font-bold transition-all text-[10px] rounded-sm border cursor-pointer ${
                      isCurrent
                        ? 'bg-[#f27d26] text-black border-[#f27d26]'
                        : 'border-white/5 bg-[#090909] text-zinc-400 hover:text-white hover:border-white/15'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={safeCurrentPage === totalPages}
                className="p-2 border border-white/5 hover:border-white/20 bg-[#090909] hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-[#090909] disabled:hover:border-white/5 transition-all text-white rounded-sm cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
