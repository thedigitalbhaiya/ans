
import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { Logo } from './Logo';
import { AuthContext } from '../App';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { verifyNumber, verifyOTP, verifyPassword, loginStep, resetAuthFlow, loginRole } = useContext(AuthContext);
  
  // Local form state
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset local state when flow resets
  useEffect(() => {
    if (loginStep === 0) {
      setOtp('');
      setPassword('');
      setError(null);
    }
  }, [loginStep]);

  // --- HANDLERS ---

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const exists = await verifyNumber(mobile);
      if (!exists) {
        setError("Number not found. Contact administration.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Enter the 4-digit OTP.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOTP(otp);
      if (result === 'invalid') {
        setError("Incorrect OTP. Try again.");
      } else if (result === 'success') {
        onLoginSuccess();
      }
      // 'next_step' is handled by Context state change automatically
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        onLoginSuccess();
      } else {
        setError("Access Denied: Incorrect Password.");
      }
    } catch (err) {
      setError("Authentication error.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DYNAMIC STYLES BASED ON STEP/ROLE ---
  const getThemeColor = () => {
    if (loginStep === 2) return 'from-slate-900 to-black'; // Admin Password
    if (loginStep === 1) return 'from-indigo-600 to-blue-800'; // Verification
    return 'from-ios-blue to-indigo-900'; // Initial
  };

  const getCardIcon = () => {
    if (loginStep === 2) return <Lock size={24} className="text-red-500" />;
    if (loginStep === 1) return <ShieldCheck size={24} className="text-indigo-500" />;
    return <Logo className="w-12 h-12" />;
  };

  return (
    <div className="w-full overflow-hidden relative">
      {/* Dynamic Header Card */}
      <motion.div 
        layout
        className={`
          bg-gradient-to-br p-8 text-center relative overflow-hidden rounded-[2rem] m-2 transition-colors duration-500
          ${getThemeColor()}
        `}
      >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              key={loginStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-4 p-3"
            >
               {getCardIcon()}
            </motion.div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Azim National School</h1>
            <p className="text-blue-100 text-[10px] mt-1 font-bold tracking-widest uppercase">
              {loginStep === 0 ? 'Bahadurganj' : loginRole === 'admin' ? 'Administrative Access' : 'Student Portal'}
            </p>
          </div>
      </motion.div>

      {/* Form Content */}
      <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            {/* STEP 0: MOBILE INPUT */}
            {loginStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Login</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter registered mobile number.</p>
                </div>
                
                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleMobileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="tel" 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} // Digits only
                        placeholder="9876543210"
                        className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-ios-blue/50 outline-none transition-all tracking-wider font-mono"
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
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Get OTP <ArrowRight size={20} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 1: OTP VERIFICATION */}
            {loginStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verification</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Enter code sent to <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">+91 {mobile}</span>
                  </p>
                </div>
                
                {error && <ErrorMessage message={error} />}

                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">One Time Password</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="password" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                        placeholder="••••"
                        className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all tracking-[0.5em] text-center font-mono text-xl"
                        required
                        maxLength={4}
                        autoFocus
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:scale-100"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Proceed'}
                  </button>
                  
                  <div className="text-center mt-4">
                     <button 
                       type="button" 
                       onClick={resetAuthFlow} 
                       className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center justify-center gap-1 mx-auto"
                     >
                       <ChevronLeft size={14} /> Change Number
                     </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: PASSWORD (ADMIN ONLY) */}
            {loginStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
                    Restricted Area
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">2-Factor Auth</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter Administrator Password</p>
                </div>
                
                {error && <ErrorMessage message={error} isError />}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-black/20 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white font-medium placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:scale-100"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Secure Login'}
                  </button>
                  
                  <div className="text-center mt-4">
                     <button 
                       type="button" 
                       onClick={resetAuthFlow} 
                       className="text-xs text-slate-500 hover:text-red-600 font-semibold"
                     >
                       Cancel Access
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

// Helper Component for Errors
const ErrorMessage = ({ message, isError = true }: { message: string, isError?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      ${isError ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-50 text-orange-600'} 
      text-sm font-semibold p-3 rounded-xl flex items-center gap-2 mb-4
    `}
  >
    <AlertCircle size={16} />
    {message}
  </motion.div>
);
