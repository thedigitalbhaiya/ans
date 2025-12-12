
import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, ArrowRight, ShieldCheck, Lock, Loader2, ChevronLeft, AlertCircle
} from 'lucide-react';
import { Logo } from './Logo';
import { AuthContext } from '../App';

interface LoginProps {
  onLoginSuccess: () => void;
  alertMessage?: string;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, alertMessage }) => {
  const { verifyNumber, verifyOTP, verifyPassword, loginStep, resetAuthFlow, loginRole } = useContext(AuthContext);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loginStep === 0) {
      setOtp('');
      setPassword('');
      setError(null);
    }
  }, [loginStep]);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) return setError("Enter a valid 10-digit number");
    setIsLoading(true);
    setError(null);
    try {
      const exists = await verifyNumber(mobile);
      if (!exists) setError("Number not found in school records.");
    } catch (err: any) { setError(err.message || "Failed."); }
    finally { setIsLoading(false); }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return setError("Enter 4-digit OTP");
    setIsLoading(true);
    try {
      const result = await verifyOTP(otp);
      if (result === 'invalid') setError("Incorrect OTP.");
      else if (result === 'success') onLoginSuccess();
    } catch (err) { setError("Verification failed."); }
    finally { setIsLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isValid = await verifyPassword(password);
      if (isValid) onLoginSuccess();
      else setError("Incorrect Password.");
    } catch (err) { setError("Error."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      
      {/* Icon */}
      <motion.div layout className="flex justify-center mb-8">
         <div className="w-24 h-24 bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-apple flex items-center justify-center">
            <Logo className="w-12 h-12" />
         </div>
      </motion.div>

      {/* Alert Banner for Redirects */}
      {alertMessage && loginStep === 0 && (
         <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 flex items-start gap-3"
         >
            <AlertCircle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-orange-700 dark:text-orange-400 leading-tight">{alertMessage}</p>
         </motion.div>
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 0: MOBILE */}
        {loginStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sign In</h2>
               <p className="text-slate-500 text-sm mt-2">Use your registered mobile number to access the student portal.</p>
            </div>

            <form onSubmit={handleMobileSubmit} className="space-y-4">
               <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ios-blue transition-colors">
                     <span className="font-bold text-sm">+91</span>
                  </div>
                  <input 
                     type="tel" 
                     value={mobile}
                     onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                     placeholder="Mobile Number"
                     className="w-full bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-2xl py-4 pl-14 pr-4 text-lg font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50 transition-all placeholder:font-medium"
                     autoFocus
                  />
               </div>
               
               {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-500/10 py-2 rounded-lg">{error}</p>}

               <button 
                  disabled={isLoading || mobile.length < 10}
                  className="w-full bg-ios-blue text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-ios-blue/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
               >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
               </button>
            </form>
          </motion.div>
        )}

        {/* STEP 1: OTP */}
        {loginStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Verify Identity</h2>
               <p className="text-slate-500 text-sm mt-2">Enter the code sent to +91 {mobile}</p>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-6">
               <div className="flex justify-center">
                  <input 
                     type="text" 
                     value={otp}
                     onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                     placeholder="••••"
                     className="w-full text-center bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-2xl py-4 text-3xl font-mono font-bold tracking-[0.5em] text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-green/50 transition-all"
                     autoFocus
                  />
               </div>

               {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

               <button 
                  disabled={isLoading || otp.length < 4}
                  className="w-full bg-ios-green text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-ios-green/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
               >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Verify'}
               </button>

               <button type="button" onClick={resetAuthFlow} className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Change Number
               </button>
            </form>
          </motion.div>
        )}

        {/* STEP 2: PASSWORD (ADMIN) */}
        {loginStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
             <div className="text-center">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Access</h2>
               <p className="text-slate-500 text-sm mt-2">Enter your secure password</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
               <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-2xl py-4 px-6 text-lg font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-ios-blue/50 transition-all"
                  autoFocus
               />
               {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
               <button disabled={isLoading} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Unlock'}
               </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
