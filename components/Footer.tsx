
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 mb-8 p-8 md:p-10 bg-slate-950 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-xl">💊</span>
            <p className="text-lg font-black text-white tracking-tight">
              Abdullah Pharmacy <span className="text-blue-500 text-sm font-bold ml-1">v2.4</span>
            </p>
          </div>
          <p className="text-sm font-medium text-slate-300">
            © {currentYear} Management System. All rights reserved.
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-xs text-slate-500 font-medium">
              📍 3 Marla Scheme Near Cricket Stadium Chakwal
            </p>
            <p className="text-xs text-slate-500 font-medium">
              📞 Support: +92 300 5471567
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-5">
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Server Live</span>
            </div>
            
            <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Enterprise Edition</span>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-1">
              Engineered By
            </p>
            <p className="text-sm font-black text-white">
              Abdullah <span className="text-blue-500">Systems</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
