/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, MessageSquare, Compass } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Dribbble', href: 'https://dribbble.com', icon: Compass },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-[#050505] border-t border-white/10 transition-colors duration-300 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Creative Pitch */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#f27d26]" />
              <span className="font-display font-black tracking-widest text-sm uppercase">
                PARK SEONGMI
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-light">
              Designing refined, immersive digital experiences where visual storytelling meets high-fidelity performance. Let's make something remarkable.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#f27d26] transition-all"
                  aria-label={social.name}
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#f27d26]">
              NAVIGATION
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Prompt */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#f27d26]">
              COLLABORATION INQUIRY
            </h4>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Always open to discussing premium React architectures, complex animations, design systems, and bespoke projects.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white hover:text-[#f27d26] transition-all border-b border-white/10 pb-1"
            >
              START DISCOURSE <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Legal bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-wider uppercase text-zinc-500">
          <p>© {currentYear} PARK SEONGMI • SENIOR UX ENGINEER. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
