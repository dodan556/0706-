/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { authService } from '../services';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if session exists
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authService.getSession();
        if (user) {
          navigate('/admin');
        }
      } catch (err) {
        console.error('Error checking active session:', err);
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.signIn(email, password);
      await new Promise((resolve) => setTimeout(resolve, 600)); // Fluid delay
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-6 min-h-[90vh] flex items-center justify-center bg-[#050505] text-white">
      <div className="w-full max-w-md space-y-8">
        {/* Title area */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-sm bg-zinc-900 border border-white/10 flex items-center justify-center text-[#f27d26] mx-auto">
            <Shield size={22} />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            ADMIN GATEWAY
          </h1>
          <p className="font-sans text-xs text-zinc-400 max-w-xs mx-auto font-light">
            Secure administrative control center for managing client inquiries, system logs, and content state.
          </p>
        </div>

        {/* Card Frame */}
        <div className="p-8 rounded-sm bg-[#090909] border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-sm bg-rose-950/20 border border-rose-900/55 flex items-start gap-2 text-[#f27d26] text-xs font-mono">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-550" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="admin@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 focus:outline-none focus:border-[#f27d26] text-xs font-mono text-white placeholder:text-zinc-650 rounded-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                SECRET ACCESS KEY
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-550" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 focus:outline-none focus:border-[#f27d26] text-xs font-mono text-white placeholder:text-zinc-650 rounded-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="admin-login-button"
              className="w-full py-4 text-xs font-mono font-black tracking-widest uppercase bg-[#f27d26] hover:bg-white text-black hover:text-black transition-all disabled:opacity-50 rounded-sm"
            >
              {loading ? 'AUTHENTICATING GATEWAY...' : (
                <span className="flex items-center justify-center gap-2">
                  ESTABLISH CONNECTION <ArrowRight size={12} />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
