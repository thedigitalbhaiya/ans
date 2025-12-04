
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, ShieldCheck, Lock, User } from 'lucide-react';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) { 
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
      }, 1000);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 800);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className={`
        bg-gradient-to-br p-8 text-center relative overflow-hidden rounded-[2rem] m-2 transition-colors duration-500
        from-ios-blue to-indigo-900
      `}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-4 p-3">
               <Logo className="w-full h-full" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Azim National School</h1>
            <p className="text-blue-100 text-[10px] mt-1 font-bold tracking-widest uppercase">
              Bahadurganj
            </p>
          </div>
      </div>

      <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 'mobile' ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Login
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Enter your mobile number to continue.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                       Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="tel" 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-ios-blue/50 outline-none transition-all"
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:scale-100"
                  >
                    {isLoading ? 'Processing...' : 'Get OTP'} {!isLoading && <ArrowRight size={20} />}
                  </button>
                </form>

              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verify OTP</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Enter code sent to +91 {mobile}
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                      One Time Password
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="password" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-ios-blue/50 outline-none transition-all tracking-[0.5em] text-center"
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:scale-100"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Login'} {!isLoading && <ArrowRight size={20} />}
                  </button>
                  
                  <div className="text-center mt-4">
                     <button 
                       type="button" 
                       onClick={() => setStep('mobile')} 
                       className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold"
                     >
                       Change Number
                     </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
};
