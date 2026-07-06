/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-[85vh] flex items-center justify-center bg-[#050505] text-white">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Visual Indicator */}
          <div className="w-16 h-16 bg-[#f27d26]/10 text-[#f27d26] flex items-center justify-center mx-auto rounded-full border border-[#f27d26]/20">
            <AlertTriangle size={28} />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#f27d26]">ERROR 404</span>
            <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none">
              ROUTE NOT FOUND
            </h1>
            <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed max-w-xs mx-auto">
              The requested address does not exist or has been relocated to another node.
            </p>
          </div>

          {/* Action Link */}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest bg-[#f27d26] hover:bg-white text-black transition-all rounded-sm"
            >
              <ArrowLeft size={12} /> BACK TO BASE DIRECTORY
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
