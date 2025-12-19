import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Loader2, AlertCircle, Smartphone, Key
} from 'lucide-react';
import { AuthContext } from '../App';
import { Logo } from './Logo';

interface LoginProps {
  onLoginSuccess: () => void;
  alertMessage?: string;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, alertMessage }) => {
  const { verifyNumber, verifyOTP, verifyPassword, loginStep, resetAuthFlow } = useContext(AuthContext);
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
    <div className="w-full">
      
      {/* Step 0: Mobile Input */}
      {loginStep === 0 && (
        <motion.div
          key="step0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
             <div className="w-20 h-20 mx-auto bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-apple flex items-center justify-center mb-4">
                <Logo className="w-12 h-12" />
             </div>
             <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Sign in to access your dashboard</p>
             </div>
          </div>

          <AnimatePresence>
            {alertMessage && (
               <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 p-4 rounded-2xl flex items-center gap-3 text-orange-600 dark:text-orange-400"
               >
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-xs font-bold leading-tight">{alertMessage}</p>
               </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleMobileSubmit} className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
                <div className="relative group">
                   <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">+91</span>
                   <input 
                      type="tel" 
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="00000 00000"
                      className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[1.25rem] py-4 pl-14 pr-4 text-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-white/10 transition-all placeholder:text-slate-300"
                      autoFocus
                   />
                </div>
             </div>
             
             {error && (
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center">
                 {error}
               </motion.p>
             )}

             <button 
                disabled={isLoading || mobile.length < 10}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-[1.25rem] font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
             >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
             </button>
          </form>
        </motion.div>
      )}

      {/* Step 1: OTP */}
      <AnimatePresence>
        {loginStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600">
               <Smartphone size={32} />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verify OTP</h2>
               <p className="text-slate-500 text-sm mt-1">Code sent to +91 {mobile}</p>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-6">
               <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                  placeholder="0000"
                  className="w-full text-center bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[1.5rem] py-5 text-4xl font-mono font-bold tracking-[0.5em] text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all placeholder:text-slate-200"
                  autoFocus
               />

               {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

               <button 
                  disabled={isLoading || otp.length < 4}
                  className="w-full bg-green-500 text-white py-4 rounded-[1.25rem] font-bold text-lg shadow-lg shadow-green-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Verify'}
               </button>

               <button type="button" onClick={resetAuthFlow} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                  Change Mobile Number
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Password */}
      <AnimatePresence>
        {loginStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center">
             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-600">
               <Key size={32} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access</h2>
             
             <form onSubmit={handlePasswordSubmit} className="space-y-6">
               <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[1.25rem] py-4 px-6 text-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                  autoFocus
               />
               {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
               <button disabled={isLoading} className="w-full bg-ios-blue text-white py-4 rounded-[1.25rem] font-bold text-lg shadow-lg active:scale-95 transition-all">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Unlock Dashboard'}
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};