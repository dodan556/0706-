/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Code, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/login' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#050505]/85 backdrop-blur-md border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          id="nav-logo-link"
          className="flex items-center gap-3 group font-sans font-bold tracking-wider text-base uppercase text-white"
        >
          <div className="w-6 h-6 rounded bg-[#f27d26] flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <span className="text-white text-xs font-mono font-bold">P</span>
          </div>
          <span className="hover:text-[#f27d26] transition-colors font-mono tracking-widest text-sm">
            PARK SEONGMI
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    id={`desktop-nav-${item.name.toLowerCase()}`}
                    className={`font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-200 py-2 block ${
                      isActive 
                        ? 'text-[#f27d26]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f27d26]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          id="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 rounded text-zinc-400 hover:text-white focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#050505] border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <ul className="space-y-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        id={`mobile-nav-${item.name.toLowerCase()}`}
                        className={`font-mono text-sm uppercase tracking-widest transition-colors block py-1 ${
                          isActive 
                            ? 'text-[#f27d26] border-l-2 border-[#f27d26] pl-3' 
                            : 'text-zinc-400 hover:text-white pl-3'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
