
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CreditCard, CheckCircle2, Clock, X, Loader2, ShieldCheck, LogIn, Smartphone } from 'lucide-react';
import { AuthContext, SchoolContext } from '../App';
import { Link } from 'react-router-dom';

const ACADEMIC_MONTHS = [
  "April", "May", "June", "July", "August", "September", 
  "October", "November", "December", "January", "February", "March"
];

export const Fees: React.FC = () => {
  const { currentStudent } = useContext(AuthContext);
  const { feeStructure } = useContext(SchoolContext);

  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('upi');
  
  // Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // --- DYNAMIC CALCULATION ---
  const monthlyFee = feeStructure[currentStudent.class] || 1000;
  
  // Calculate Outstanding
  const paidMonthsCount = currentStudent.feeHistory.length;
  // Determine how many months should have been paid by now (assuming academic year starts April)
  // For demo simplicity, let's assume we are in October (Month index 6 in ACADEMIC_MONTHS)
  // April=0, Oct=6. Total 7 months due.
  const currentMonthIndex = 6; // October fixed for demo visual consistency
  const monthsDue = currentMonthIndex + 1;
  const pendingMonths = Math.max(0, monthsDue - paidMonthsCount);
  const totalOutstanding = pendingMonths * monthlyFee;
  const amountToPay = totalOutstanding > 0 ? totalOutstanding : monthlyFee; // Default to paying 1 month if all clear

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowModal(false);
        // Reset form
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setUpiId('');
      }, 2500);
    }, 2000);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Fee Status</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your tuition payments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <CreditCard size={18} />
          Pay Online
        </button>
      </div>

      {/* Outstanding Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden ${totalOutstanding > 0 ? 'bg-gradient-to-br from-ios-red to-rose-600 shadow-red-500/20' : 'bg-gradient-to-br from-ios-green to-emerald-600 shadow-green-500/20'}`}
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <p className="text-white/80 font-bold mb-1 uppercase tracking-wider text-xs">Total Outstanding</p>
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">₹ {totalOutstanding.toLocaleString()}</h2>
          {totalOutstanding > 0 ? (
             <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1.5 rounded-lg backdrop-blur-md font-medium">
               <Clock size={16} />
               <span>{pendingMonths} Months Pending</span>
             </div>
          ) : (
             <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1.5 rounded-lg backdrop-blur-md font-medium">
               <CheckCircle2 size={16} />
               <span>All Dues Cleared</span>
             </div>
          )}
        </div>
      </motion.div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white px-1">Payment History</h3>
        {currentStudent.feeHistory.length > 0 ? (
          currentStudent.feeHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#1C1C1E] p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between group hover:border-ios-blue/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.status === 'Paid' ? 'bg-green-100 text-green-600 dark:bg-green-500/20' : 'bg-red-100 text-red-600 dark:bg-red-500/20'
              }`}>
                {item.status === 'Paid' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{item.month}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{item.date} • {item.invoice}</p>
              </div>
            </div>
            
            <div className="text-right">
               <p className="font-bold text-slate-900 dark:text-white text-lg">{item.amount === "₹ 0" ? `₹ ${monthlyFee}` : item.amount}</p>
               <button className="text-ios-blue text-xs font-bold mt-1 flex items-center justify-end gap-1 hover:underline">
                 <Download size={12} /> Invoice
               </button>
            </div>
          </motion.div>
        ))) : (
           <div className="text-center py-10 text-slate-400">No payment history found.</div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-2xl overflow-hidden"
            >
              {paymentSuccess ? (
                <div className="p-10 flex flex-col items-center justify-center text-center h-[400px]">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6"
                  >
                    <CheckCircle2 size={48} strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h3>
                  <p className="text-slate-500 dark:text-slate-400">Transaction ID: #TXN-{Math.floor(Math.random()*100000)}</p>
                  <p className="text-slate-900 dark:text-white font-bold text-xl mt-4">₹ {amountToPay}</p>
                </div>
              ) : (
                <>
                  <div className="bg-ios-blue p-6 pb-20 text-white relative">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <h3 className="text-lg font-bold mb-1">Fee Payment</h3>
                    <p className="text-blue-200 text-sm">Secure Gateway</p>
                  </div>
                  
                  <div className="px-6 -mt-12">
                     <div className="bg-white dark:bg-[#2C2C2E] p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-white/5 mb-6 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold">Paying For</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Tuition Fee - Outstanding</p>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹ {amountToPay}</h2>
                     </div>
                  </div>
                  
                  <form onSubmit={handlePayment} className="px-6 pb-6 space-y-5">
                    
                    {/* Payment Method Tabs */}
                    <div className="flex bg-slate-100 dark:bg-black/40 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white dark:bg-[#1C1C1E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                      >
                        <Smartphone size={16} /> UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentMethod === 'card' ? 'bg-white dark:bg-[#1C1C1E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`}
                      >
                        <CreditCard size={16} /> Card
                      </button>
                    </div>

                    <div className="min-h-[140px]">
                      {paymentMethod === 'upi' ? (
                         <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">UPI ID</label>
                              <input 
                                type="text" 
                                required 
                                placeholder="username@upi" 
                                className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-medium"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                           </div>
                           <p className="text-xs text-slate-400 text-center">Google Pay, PhonePe, Paytm supported</p>
                         </div>
                      ) : (
                         <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                              <input 
                                type="text" 
                                required 
                                placeholder="0000 0000 0000 0000" 
                                className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-mono"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Expiry</label>
                                <input 
                                  type="text" 
                                  required 
                                  placeholder="MM/YY" 
                                  className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-mono"
                                  value={expiry}
                                  onChange={(e) => setExpiry(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">CVV</label>
                                <input 
                                  type="password" 
                                  required 
                                  placeholder="123" 
                                  maxLength={3}
                                  className="w-full p-3 bg-slate-50 dark:bg-black/20 rounded-xl border-none outline-none focus:ring-2 focus:ring-ios-blue/50 text-slate-900 dark:text-white font-mono"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value)}
                                />
                              </div>
                           </div>
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-ios-blue text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 mt-2"
                    >
                      {isProcessing ? (
                        <>Processing <Loader2 className="animate-spin" size={20} /></>
                      ) : (
                        <>Pay ₹ {amountToPay}</>
                      )}
                    </button>
                    
                    <div className="flex justify-center items-center gap-2 text-xs text-slate-400">
                       <ShieldCheck size={14} />
                       Secured by Razorpay
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
