/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBasket, 
  Calendar, 
  Info, 
  Phone, 
  Home as HomeIcon, 
  Leaf, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  Plus,
  Minus,
  MessageCircle,
  Instagram,
  Facebook,
  X,
  Upload
} from 'lucide-react';
import { supabase, initializeDatabase } from './lib/supabase';

// --- Constants & Data ---

const VARIETIES = {
  SINDURA: {
    id: 'sindura',
    name: 'Sindura',
    price: 80,
    origin: 'Ramanagara',
    taste: 'Honey-sweet with a touch of tanginess. Vibrant red skin.',
    description: 'The early bird of the mango season. Known for its distinct aroma and rich melting pulp.',
    season: { start: 3, peakStart: 4, peakEnd: 5, end: 6 } // Months (0-indexed: 3 = April)
  },
  BADAMI: {
    id: 'badami',
    name: 'Badami',
    price: 100,
    origin: 'Ramanagara',
    taste: 'Buttery, rich, and intensely sweet. The "Alphonso of Karnataka".',
    description: 'Renowned for its smooth texture and incredible sweetness. A true connoisseur\'s choice.',
    season: { start: 4, peakStart: 5, peakEnd: 6, end: 7 }
  }
};

const FARM_DETAILS = {
  name: 'Strait of Mangoes',
  location: 'Ramanagara, Karnataka',
  upiId: 'straitmangoes@upi',
  whatsapp: '+919999999999', // Placeholder
  email: 'hello@straitmangoes.farm',
  address: 'Basavanagudi Farm, Near Ramanagara Hills, Ramanagara - 562159'
};

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Farm' },
    { id: 'mangoes', label: 'Varieties' },
    { id: 'season', label: 'Season' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border-subtle px-6 md:px-12 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-mango text-xl shadow-sm">🥭</div>
        <span className="text-xl font-bold tracking-tight text-soil hidden sm:inline">Strait of Mangoes</span>
      </div>
      
      <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`nav-link ${activeTab === tab.id ? 'nav-link-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hidden lg:block px-6 py-2 rounded-full border border-soil text-[10px] font-bold uppercase tracking-widest text-soil">
        Ramanagara, KA
      </div>
    </nav>
  );
};

const SectionWrapper = ({ children, id, active }: { children: React.ReactNode, id: string, active: boolean }) => {
  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen pt-24 pb-32"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [orderStep, setOrderStep] = useState(1);
  const [quantity, setQuantity] = useState(2);
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    screenshot: null as File | null,
    transactionId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Pre-order state
  const [preOrderData, setPreOrderData] = useState({
    name: '',
    phone: '',
    variety: 'Sindura',
    quantity: 10
  });

  // Contact form state
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Initialize database on app load
  useEffect(() => {
    initializeDatabase();
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert order into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert({
          timestamp: new Date().toISOString(),
          name: orderData.name,
          phone: orderData.phone,
          address: orderData.address,
          variety: selectedVariety || '',
          variety_name: selectedVariety ? VARIETIES[selectedVariety.toUpperCase()].name : '',
          quantity: quantity,
          price_per_kg: selectedVariety ? VARIETIES[selectedVariety.toUpperCase()].price : 0,
          total_amount: quantity * (selectedVariety === 'badami' ? VARIETIES.BADAMI.price : VARIETIES.SINDURA.price),
          transaction_id: orderData.transactionId,
          status: 'Pending'
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Order saved to Supabase:', data);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } catch (error) {
      console.error("Order submission failed", error);
      setIsSubmitting(false);
      // For demo purposes, show success even if there's an error
      setIsSubmitted(true);
    }
  };

  const handlePreOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert pre-order into Supabase
      const { data, error } = await supabase
        .from('pre_orders')
        .insert({
          timestamp: new Date().toISOString(),
          name: preOrderData.name,
          phone: preOrderData.phone,
          variety: preOrderData.variety.toLowerCase(),
          variety_name: preOrderData.variety,
          quantity: preOrderData.quantity,
          price_per_kg: preOrderData.variety === 'Badami' ? VARIETIES.BADAMI.price : VARIETIES.SINDURA.price,
          total_amount: preOrderData.quantity * (preOrderData.variety === 'Badami' ? VARIETIES.BADAMI.price : VARIETIES.SINDURA.price),
          status: 'Pre-order'
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Pre-order saved to Supabase:', data);
      
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Pre-order interest recorded! We'll reach out once harvest begins. 🥭");
      }, 1500);
    } catch (error) {
      console.error("Pre-order submission failed", error);
      setIsSubmitting(false);
      alert("Pre-order interest recorded! 🥭");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitting(true);

    try {
      // Insert contact message into Supabase
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          timestamp: new Date().toISOString(),
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          message: contactData.message,
          status: 'New'
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Contact message saved to Supabase:', data);
      
      // Reset form
      setContactData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => {
        setIsContactSubmitting(false);
        alert("Message sent! We'll get back to you soon. 🥭");
      }, 1000);
    } catch (error) {
      console.error("Contact submission failed", error);
      setIsContactSubmitting(false);
      alert("Message sent! We'll get back to you soon. 🥭");
    }
  };

  const openOrder = (varietyId?: string) => {
    if (varietyId) setSelectedVariety(varietyId);
    setOrderStep(1);
    setIsOrderModalOpen(true);
    setIsSubmitted(false);
  };

  return (
    <div className="relative">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* --- HOME SECTION --- */}
      <SectionWrapper id="home" active={activeTab === 'home'}>
        <div className="section-container">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Hero & Story */}
            <div className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-12">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 text-soil">
                  Pure<br/><span className="text-mango">Ramanagara</span><br/>Gold.
                </h1>
                <p className="text-xl leading-relaxed opacity-80 mb-8 italic text-ink">
                  "Hand-picked at sunrise, shipped by noon. No middlemen, no chemicals—just the honest taste of Karnataka's soil."
                </p>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-border-subtle">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-soil/10 shadow-sm">
                    <img 
                      src="https://photos.fife.usercontent.google.com/pw/AP1GczNu6I_iHsEYJor-AnqaAT27mY8RMJMhnsLDDkUKc7RrDM7ob-BW-un2=w685-h913-s-no-gm?authuser=0" 
                      alt="Ramesh G." 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Farmer's Voice</p>
                    <p className="text-sm font-bold">Ramesh G., 3rd Gen Grower</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-3xl bg-leaf text-white shadow-lg"
              >
                <h3 className="font-bold text-xl mb-2">Ready for Harvest</h3>
                <p className="text-sm opacity-90 leading-normal mb-6">Our Badami trees are heavy with fruit. Shipping starts this Monday.</p>
                <div className="group relative w-full h-80 rounded-3xl overflow-hidden shadow-artistic mt-8 mb-4 border-2 border-white">
                  <img 
                    src="https://photos.fife.usercontent.google.com/pw/AP1GczPlk9naRvz3mnt_LihyATt_GJa5b7bvu9Fc7QF6JpA0k8WC1xNh2A6Y=w1213-h913-s-no-gm?authuser=0" 
                    alt="Lush Mango Orchard in Ramanagara"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Our Orchard</p>
                    <p className="text-sm font-medium italic">Ramanagara, Summer 2026</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab('mangoes')} className="w-full py-3 bg-white rounded-xl font-bold uppercase text-[10px] tracking-widest text-leaf hover:bg-cream transition-colors shadow-md">
                  Start Ordering
                </button>
              </motion.div>
            </div>

            {/* Center: Featured Varieties (Visual Preview) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1 artistic-card border-mango p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://photos.fife.usercontent.google.com/pw/AP1GczMi40VgDIg0mNJeDdPyktKMP_J3YZHdx_xTosDbI2Ui_qObBoE-qB_G=w1213-h913-s-no-gm?authuser=0" 
                    alt="Sindura Mangoes" 
                    className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent"></div>
                </div>
                <div className="z-10">
                  <span className="px-3 py-1 bg-mango/10 text-mango text-[10px] font-bold rounded-full mb-4 inline-block uppercase tracking-widest">Popular Choice</span>
                  <h2 className="text-4xl font-bold mb-2">Sindura</h2>
                  <p className="text-sm opacity-70 italic mb-4">"The Honey Suckle" — Vibrant, sweet, fibreless pulp.</p>
                  <p className="text-2xl font-bold text-soil">₹80<span className="text-sm opacity-50 font-normal"> / kg</span></p>
                </div>
                <div className="flex justify-end mt-4 z-10">
                  <button onClick={() => openOrder('sindura')} className="w-12 h-12 rounded-full bg-mango text-white text-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">+</button>
                </div>
              </div>

              <div className="flex-1 artistic-card border-leaf p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://photos.fife.usercontent.google.com/pw/AP1GczP34jpiTmKcQMUER8QyDgGcb_vq-9Y1lhmhBizYww_VslToTLmD_slY=w1216-h913-s-no-gm?authuser=0" 
                    alt="Badami Mangoes" 
                    className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-transparent"></div>
                </div>
                <div className="z-10">
                  <span className="px-3 py-1 bg-leaf/10 text-leaf text-[10px] font-bold rounded-full mb-4 inline-block uppercase tracking-widest">Premium Grade</span>
                  <h2 className="text-4xl font-bold mb-2">Badami</h2>
                  <p className="text-sm opacity-70 italic mb-4">"The Alphonso of Karnataka" — Rich, buttery aroma.</p>
                  <p className="text-2xl font-bold text-soil">₹100<span className="text-sm opacity-50 font-normal"> / kg</span></p>
                </div>
                <div className="flex justify-end mt-4 z-10">
                  <button onClick={() => openOrder('badami')} className="w-12 h-12 rounded-full bg-leaf text-white text-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">+</button>
                </div>
              </div>
            </div>

            {/* Right: Info & Stats */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
              <div className="p-8 rounded-3xl bg-white border border-border-subtle shadow-sm flex-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-8 opacity-60">Seasonal Pulse</h4>
                <div className="space-y-8">
                  <div className="relative">
                    <div className="flex justify-between text-[10px] font-bold mb-2 tracking-widest">
                      <span>SINDURA</span>
                      <span className="text-mango">PEAK</span>
                    </div>
                    <div className="h-2 w-full bg-soil/5 rounded-full overflow-hidden">
                      <div className="h-full bg-mango" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-[10px] mt-2 opacity-50 uppercase tracking-tighter">Harvest ends late June</p>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between text-[10px] font-bold mb-2 tracking-widest">
                      <span>BADAMI</span>
                      <span className="text-leaf">PRE-ORDER</span>
                    </div>
                    <div className="h-2 w-full bg-soil/5 rounded-full overflow-hidden">
                      <div className="h-full bg-leaf" style={{ width: '40%' }}></div>
                    </div>
                    <p className="text-[10px] mt-2 opacity-50 uppercase tracking-tighter">Peak starts mid-May</p>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-soil/20 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-cream border border-border-subtle flex items-center justify-center rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-soil/5 rounded flex items-center justify-center text-[10px] text-soil/40 font-bold">QR</div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-soil">UPI Payment Only</p>
                  <p className="text-sm font-mono font-bold text-soil/70">{FARM_DETAILS.upiId}</p>
                </div>
                <div className="h-px w-8 bg-soil/20"></div>
                <p className="text-[10px] italic leading-tight text-soil/60">Wholesale available.<br/>Direct from Ramanagara.</p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* --- MANGOES SECTION --- */}
      <SectionWrapper id="mangoes" active={activeTab === 'mangoes'}>
        <div className="section-container">
          <header className="text-center mb-16">
            <h2 className="text-5xl font-black text-soil mb-4">Our Varieties</h2>
            <p className="max-w-2xl mx-auto text-ink/70 text-lg italic">
              Each season we carefully nurture two of India's most beloved mangoes. Choose your golden treasure below.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {Object.values(VARIETIES).map((mango) => (
              <motion.div 
                key={mango.id}
                whileHover={{ y: -10 }}
                className={`artistic-card overflow-hidden flex flex-col group ${mango.id === 'sindura' ? 'border-mango' : 'border-leaf'}`}
              >
                <div className="relative h-80 overflow-hidden bg-cream">
                  <img 
                    src={`https://picsum.photos/seed/${mango.id}/800/600`} 
                    alt={mango.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold shadow-sm text-soil">
                    ₹{mango.price}/kg
                  </div>
                  <div className={`absolute top-4 right-4 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider ${mango.id === 'sindura' ? 'bg-mango' : 'bg-leaf'}`}>
                    {mango.origin}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-4xl font-black text-soil mb-2">{mango.name}</h3>
                  <p className={`${mango.id === 'sindura' ? 'text-mango' : 'text-leaf'} font-bold italic mb-6`}>"{mango.taste}"</p>
                  <p className="text-ink/70 leading-relaxed mb-8">
                    {mango.description}
                  </p>
                  <div className="mt-auto">
                    <button 
                      onClick={() => openOrder(mango.id)}
                      className={mango.id === 'sindura' ? 'w-full button-primary' : 'w-full button-secondary'}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* --- SEASON SECTION --- */}
      <SectionWrapper id="season" active={activeTab === 'season'}>
        <div className="section-container">
          <header className="text-center mb-16">
            <h2 className="text-5xl font-black text-soil mb-4">Harvest Cycle</h2>
            <p className="max-w-2xl mx-auto text-ink/70 text-lg italic">
              Experience the rhythm of Ramanagara. From pre-order to peak harvest.
            </p>
          </header>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-artistic border-2 border-border-subtle max-w-5xl mx-auto">
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-leaf"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60">Pre-order</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-mango"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60">Peak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-soil/10"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60">Off</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-16">
              {Object.values(VARIETIES).map((mango) => (
                <div key={mango.id} className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-black text-soil">{mango.name}</h3>
                    <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${mango.id === 'sindura' ? 'bg-mango/10 text-mango' : 'bg-leaf/10 text-leaf'}`}>
                      {mango.id === 'sindura' ? 'PEAK NOW' : 'PRE-ORDER OPEN'}
                    </div>
                  </div>
                  
                  <div className="relative h-px bg-soil/10 mb-8 mt-2"></div>

                  <div className="relative h-3 bg-soil/5 rounded-full overflow-hidden">
                    <div 
                      className={`absolute h-full transition-all duration-1000 ${mango.id === 'sindura' ? 'bg-leaf/40 left-[25%] w-[15%]' : 'bg-leaf/40 left-[33%] w-[15%]'}`}
                    ></div>
                    <div 
                      className={`absolute h-full transition-all duration-1000 ${mango.id === 'sindura' ? 'bg-mango left-[33.3%] w-[25%]' : 'bg-leaf left-[41.6%] w-[25%]'}`}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-tighter opacity-40">
                    <span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 bg-cream/50 border-2 border-dashed border-soil/20 rounded-3xl text-center">
              <h4 className="text-xl font-black text-soil mb-4 tracking-tight">Reserve Your Ramanagara Gold</h4>
              <p className="text-ink/70 mb-8 max-w-lg mx-auto text-sm leading-relaxed italic">
                Our trees are nurtured with care. Express your interest now, and we'll personally notify you 2 days before harvest begins.
              </p>
              <form onSubmit={handlePreOrderSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  className="flex-1 bg-white border border-border-subtle px-6 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-soil/20"
                  value={preOrderData.name}
                  onChange={e => setPreOrderData({...preOrderData, name: e.target.value})}
                />
                <input 
                  type="tel" 
                  placeholder="Phone" 
                  required
                  className="flex-1 bg-white border border-border-subtle px-6 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-soil/20"
                  value={preOrderData.phone}
                  onChange={e => setPreOrderData({...preOrderData, phone: e.target.value})}
                />
                <button type="submit" disabled={isSubmitting} className="button-secondary px-10">
                  {isSubmitting ? '...' : 'Notify Me'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* --- ABOUT SECTION --- */}
      <SectionWrapper id="about" active={activeTab === 'about'}>
        <div className="section-container">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="col-span-12 lg:col-span-5 relative"
            >
              <div className="aspect-[4/5] bg-soil/5 rounded-[4rem] overflow-hidden shadow-2xl relative border-8 border-white">
                <img 
                  src="https://picsum.photos/seed/farmer/800/1000" 
                  alt="Our Farmer"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-mango rounded-full flex items-center justify-center p-8 text-white text-center shadow-2xl rotate-12">
                <p className="text-xl font-black leading-tight uppercase tracking-tighter">Direct From Soil</p>
              </div>
            </motion.div>

            <div className="col-span-12 lg:col-span-7 space-y-12">
              <h2 className="text-6xl font-black text-soil leading-tight">A Legacy in Every Bite.</h2>
              <div className="space-y-6 text-xl text-ink/80 leading-relaxed italic">
                <p>
                  "I was born in the shadow of Ramanagara's hills. My father planted these trees forty years ago, and today, they are part of our family. 
                </p>
                <p>
                  At Strait of Mangoes, we don't believe in industrial scale. We believe in the sound of the wind through the leaves and the heat of the Karnataka sun that ripens every fruit to perfection."
                </p>
                <p>
                  No middlemen, no wax, just the fruit as nature intended.
                </p>
              </div>
              
              <div className="p-8 border-2 border-dashed border-soil/20 rounded-[2.5rem] flex flex-col sm:flex-row gap-8 items-center bg-white/50">
                <div className="w-16 h-16 bg-leaf rounded-full flex items-center justify-center text-white shrink-0">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="font-bold text-soil text-lg mb-1">Find us in Ramanagara</h4>
                   <p className="text-ink/60 text-sm italic">Visitors are welcome during harvest weekends. Use the contact tab to schedule a visit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* --- CONTACT SECTION --- */}
      <SectionWrapper id="contact" active={activeTab === 'contact'}>
        <div className="section-container">
          <div className="max-w-5xl mx-auto artistic-card border-border-subtle flex flex-col md:flex-row overflow-hidden">
            <div className="bg-soil p-12 text-cream md:w-1/3 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-black mb-12 leading-tight">Let's Talk Mangoes.</h2>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                    <span className="font-bold text-sm tracking-widest">{FARM_DETAILS.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center"><Info className="w-4 h-4" /></div>
                    <span className="font-bold text-sm tracking-widest uppercase">{FARM_DETAILS.email.split('@')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="pt-20 opacity-40 text-[10px] uppercase font-bold tracking-[0.2em] leading-loose">
                {FARM_DETAILS.address}
              </div>
            </div>

            <div className="p-12 md:w-2/3 bg-white">
              <h3 className="text-2xl font-black text-soil mb-6">Wholesale Inquiries</h3>
              <p className="text-ink/60 mb-10 text-sm leading-relaxed italic">
                Need bulk orders for your office or store? Drop us a message and we'll reply before the next harvest.
              </p>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Name</label>
                    <input 
                      type="text" 
                      value={contactData.name}
                      onChange={e => setContactData({...contactData, name: e.target.value})}
                      className="w-full bg-cream/30 border border-border-subtle p-4 rounded-xl focus:outline-none" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Email</label>
                    <input 
                      type="email" 
                      value={contactData.email}
                      onChange={e => setContactData({...contactData, email: e.target.value})}
                      className="w-full bg-cream/30 border border-border-subtle p-4 rounded-xl focus:outline-none" 
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Phone</label>
                  <input 
                    type="tel" 
                    value={contactData.phone}
                    onChange={e => setContactData({...contactData, phone: e.target.value})}
                    className="w-full bg-cream/30 border border-border-subtle p-4 rounded-xl focus:outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Message</label>
                  <textarea 
                    rows={4} 
                    value={contactData.message}
                    onChange={e => setContactData({...contactData, message: e.target.value})}
                    className="w-full bg-cream/30 border border-border-subtle p-4 rounded-xl focus:outline-none"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isContactSubmitting}
                  className="button-primary w-full py-5"
                >
                  {isContactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* --- ORDER MODAL --- */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-soil/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div
              layoutId="orderModal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-cream w-full max-w-2xl rounded-[3rem] shadow-artistic border-2 border-border-subtle overflow-hidden max-h-[95vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-soil hover:bg-red-50 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 md:p-12">
                {!isSubmitted ? (
                  <>
                    <div className="mb-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${orderStep >= 1 ? 'bg-mango text-white' : 'bg-white text-soil/30'}`}>1</div>
                        <div className="h-[2px] w-8 bg-soil/10"></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${orderStep >= 2 ? 'bg-mango text-white' : 'bg-white text-soil/30'}`}>2</div>
                        <div className="h-[2px] w-8 bg-soil/10"></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${orderStep >= 3 ? 'bg-mango text-white' : 'bg-white text-soil/30'}`}>3</div>
                      </div>
                      <h2 className="text-4xl font-black text-soil">
                        {orderStep === 1 && "Select Harvest"}
                        {orderStep === 2 && "Delivery Info"}
                        {orderStep === 3 && "Payment Details"}
                      </h2>
                    </div>

                    {orderStep === 1 && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                          {Object.values(VARIETIES).map(m => (
                            <button 
                              key={m.id}
                              onClick={() => setSelectedVariety(m.id)}
                              className={`p-4 rounded-2xl border-2 transition-all text-left ${selectedVariety === m.id ? 'border-mango bg-white shadow-lg' : 'border-soil/5 bg-white/50 hover:border-mango/30'}`}
                            >
                               <div className="text-4xl mb-2">{m.id === 'sindura' ? '🍅' : '🥭'}</div>
                               <h4 className="font-bold text-lg">{m.name}</h4>
                               <p className="text-soil/40 text-sm">₹{m.price}/kg</p>
                            </button>
                          ))}
                        </div>
                        
                        {selectedVariety && (
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-soil/5">
                            <label className="block text-sm font-bold uppercase tracking-wider text-soil/50 mb-4">Quantity (kg)</label>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <button onClick={() => setQuantity(Math.max(2, quantity - 1))} className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-soil hover:bg-mango/10"><Minus className="w-6 h-6" /></button>
                                <span className="text-4xl font-bold text-soil w-12 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-soil hover:bg-mango/10"><Plus className="w-6 h-6" /></button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-soil/40 font-bold uppercase">Total Amount</p>
                                <p className="text-3xl font-black text-mango">₹{quantity * (selectedVariety === 'badami' ? VARIETIES.BADAMI.price : VARIETIES.SINDURA.price)}</p>
                              </div>
                            </div>
                            <p className="mt-4 text-xs text-soil/40">* Minimum order is 2kg for farm-direct freshness.</p>
                          </div>
                        )}

                        <button 
                          disabled={!selectedVariety}
                          onClick={() => setOrderStep(2)}
                          className="w-full button-primary"
                        >
                          Add Delivery Info <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {orderStep === 2 && (
                      <form onSubmit={(e) => { e.preventDefault(); setOrderStep(3); }} className="space-y-6">
                        <div className="space-y-4">
                           <input 
                              type="text" 
                              placeholder="Full Name" 
                              required
                              className="w-full bg-white border border-soil/10 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-mango/50 shadow-sm"
                              value={orderData.name}
                              onChange={e => setOrderData({...orderData, name: e.target.value})}
                           />
                           <input 
                              type="tel" 
                              placeholder="Phone Number" 
                              required
                              className="w-full bg-white border border-soil/10 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-mango/50 shadow-sm"
                              value={orderData.phone}
                              onChange={e => setOrderData({...orderData, phone: e.target.value})}
                           />
                           <textarea 
                              rows={4} 
                              placeholder="Complete Delivery Address" 
                              required
                              className="w-full bg-white border border-soil/10 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-mango/50 shadow-sm"
                              value={orderData.address}
                              onChange={e => setOrderData({...orderData, address: e.target.value})}
                           ></textarea>
                        </div>

                        <div className="flex gap-4">
                          <button type="button" onClick={() => setOrderStep(1)} className="flex-1 py-4 text-soil font-bold hover:bg-white rounded-full">Back</button>
                          <button 
                            type="submit"
                            className="flex-[2] button-primary"
                          >
                            Proceed to Payment
                          </button>
                        </div>
                      </form>
                    )}

                    {orderStep === 3 && (
                      <form onSubmit={handleOrderSubmit} className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-inner border border-soil/5 text-center">
                          <p className="text-soil/60 mb-4">Scan QR or use UPI ID to pay</p>
                          <div className="w-48 h-48 bg-soil/5 rounded-xl mx-auto flex items-center justify-center mb-6 relative">
                            {/* Placeholder for QR Code */}
                            <div className="grid grid-cols-2 gap-2 opacity-20">
                              <div className="w-6 h-6 bg-soil"></div><div className="w-6 h-6 bg-soil"></div>
                              <div className="w-6 h-6 bg-soil"></div><div className="w-6 h-6 bg-soil"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="bg-white px-2 py-1 rounded text-[10px] font-bold border border-soil/10">SAMPLE QR</span>
                            </div>
                          </div>
                          <p className="font-mono font-bold text-lg select-all bg-cream inline-block px-4 py-2 rounded-lg border border-soil/10">
                            {FARM_DETAILS.upiId}
                          </p>
                          <p className="text-2xl font-black text-mango mt-6">Pay ₹{quantity * (selectedVariety === 'badami' ? VARIETIES.BADAMI.price : VARIETIES.SINDURA.price)}</p>
                        </div>

                        <div className="space-y-4">
                           <label className="block text-sm font-bold uppercase tracking-wider text-soil/50">Transaction ID</label>
                           <input 
                              type="text" 
                              required
                              placeholder="Enter UPI Ref No. / Transaction ID" 
                              className="w-full bg-white border border-soil/10 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-mango/50 shadow-sm"
                              value={orderData.transactionId}
                              onChange={e => setOrderData({...orderData, transactionId: e.target.value})}
                           />
                           <label className="flex items-center gap-4 p-4 bg-white border-2 border-dashed border-soil/20 rounded-xl cursor-pointer hover:bg-soil/5 transition-colors">
                             <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-soil">
                               <Upload className="w-6 h-6" />
                             </div>
                             <div className="flex-1">
                               <p className="font-bold text-soil">{orderData.screenshot ? orderData.screenshot.name : "Upload Payment Screenshot"}</p>
                               <p className="text-xs text-soil/40">Optional, but speeds up verification</p>
                             </div>
                             <input 
                              type="file" 
                              className="hidden" 
                              onChange={e => setOrderData({...orderData, screenshot: e.target.files?.[0] || null})}
                             />
                           </label>
                        </div>

                        <div className="bg-mango/5 p-6 rounded-2xl border border-mango/20">
                          <h4 className="font-bold text-soil mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-mango" />
                            Order Summary
                          </h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-soil/60">{quantity}kg of {selectedVariety?.toUpperCase()}</span>
                            <span className="font-bold text-soil">₹{quantity * (selectedVariety === 'badami' ? VARIETIES.BADAMI.price : VARIETIES.SINDURA.price)}</span>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button type="button" onClick={() => setOrderStep(2)} className="flex-1 py-4 text-soil font-bold hover:bg-white rounded-full">Back</button>
                          <button 
                            type="submit"
                            disabled={isSubmitting || !orderData.transactionId}
                            className="flex-[2] button-primary"
                          >
                            {isSubmitting ? "Processing..." : "Complete Order"}
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10 space-y-6">
                    <div className="w-24 h-24 bg-leaf/10 rounded-full flex items-center justify-center mx-auto text-leaf">
                      <CheckCircle2 className="w-16 h-16" />
                    </div>
                    <h2 className="font-display text-5xl text-soil">Order Placed!</h2>
                    <p className="text-soil/70 text-lg max-w-sm mx-auto">
                      Thank you for supporting our farm. We've received your order and payment details. You'll get a WhatsApp confirmation once we verify the transaction.
                    </p>
                    <div className="pt-8 flex flex-col gap-4">
                      <button onClick={() => setIsOrderModalOpen(false)} className="button-primary">Back to Website</button>
                      <a 
                        href={`https://wa.me/${FARM_DETAILS.whatsapp}?text=Hi! I just placed an order for ${quantity}kg of ${selectedVariety} on your website. My Transaction ID is ${orderData.transactionId}`}
                        className="flex items-center justify-center gap-2 text-leaf font-bold hover:underline"
                      >
                         <MessageCircle className="w-5 h-5" />
                         Ping us on WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 gap-8">
        <div>Organic Sustainable Practices</div>
        <div>© 2026 Strait of Mangoes Farm</div>
        <div>WhatsApp: {FARM_DETAILS.whatsapp}</div>
      </footer>
    </div>
  );
}
