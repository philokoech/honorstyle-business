
import React, { useState } from 'react';
import { PROFESSIONALS } from '../constants';

type TabType = 'earnings' | 'growth' | 'inspos' | 'reports';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('earnings'); // Defaulting to earnings to show changes
  const [dateRange, setDateRange] = useState('This Week');
  const [selectedProf, setSelectedProf] = useState('All Professionals');
  const [selectedService, setSelectedService] = useState('All Services');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedReportPeriod, setSelectedReportPeriod] = useState('month');

  // --- MOCK DATA & CALCULATIONS ---

  // Staff Performance & Commissions Data - Source of Truth for Earnings
  const staffPerformance = [
    { id: '1', name: 'Carrie Hawkins', role: 'Hair Stylist', appointments: 12, revenue: 54000, commissionRate: 0.40, image: 'https://i.pravatar.cc/150?u=prof_1' },
    { id: '2', name: 'Samantha Burke', role: 'Masseuse', appointments: 8, revenue: 32500, commissionRate: 0.35, image: 'https://i.pravatar.cc/150?u=prof_2' },
    { id: '3', name: 'Harold Long', role: 'Nail Tech', appointments: 15, revenue: 22500, commissionRate: 0.30, image: 'https://i.pravatar.cc/150?u=prof_3' },
    { id: '4', name: 'Isaiah Lopez', role: 'Hair Stylist', appointments: 10, revenue: 41000, commissionRate: 0.40, image: 'https://i.pravatar.cc/150?u=prof_4' },
    { id: '5', name: 'Sarah Stephens', role: 'Esthetician', appointments: 6, revenue: 18000, commissionRate: 0.35, image: 'https://i.pravatar.cc/150?u=prof_5' },
  ];

  const totalRevenue = staffPerformance.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalCommission = staffPerformance.reduce((acc, curr) => acc + (curr.revenue * curr.commissionRate), 0);
  const netEarnings = totalRevenue - totalCommission;
  const totalAppointments = staffPerformance.reduce((acc, curr) => acc + curr.appointments, 0);

  const appointmentStats = {
    total: totalAppointments + 6, // Adding some non-completed for realism
    details: [
        { label: 'Completed', value: totalAppointments, color: 'bg-emerald-500', percent: 88 },
        { label: 'Upcoming', value: 4, color: 'bg-blue-500', percent: 8 },
        { label: 'Cancelled', value: 1, color: 'bg-rose-500', percent: 2 },
        { label: 'Missed', value: 1, color: 'bg-orange-500', percent: 2 },
    ]
  };

  const clientStats = {
    unique: 42,
    new: 12,
    returning: 30
  };

  const topServices = [
    { rank: 1, name: 'Full Hair Colouring', count: 18, revenue: 45000 },
    { rank: 2, name: 'Deep Tissue Massage', count: 12, revenue: 36000 },
    { rank: 3, name: 'Gel Manicure', count: 24, revenue: 24000 },
    { rank: 4, name: 'Hydrating Facial', count: 8, revenue: 16000 },
  ];

  // Derived from staffPerformance for the card view
  const topProfessionals = [...staffPerformance]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3) // Top 3
    .map(p => ({
        id: p.id,
        name: p.name,
        appointments: p.appointments,
        revenue: p.revenue,
        commission: p.revenue * p.commissionRate,
        initial: p.name.charAt(0),
        color: `bg-${['rose', 'teal', 'violet', 'sky', 'amber'][parseInt(p.id) % 5]}-100 text-${['rose', 'teal', 'violet', 'sky', 'amber'][parseInt(p.id) % 5]}-600`
    }));


  // Inspos Data
  const inspoMetrics = {
    totalPosts: 24,
    profileViews: 1420,
    bookings: 85,
    promoted: 3,
    engagement: 245
  };

  const inspoPosts = [
    {
      id: 1,
      title: "Flawless French Nail Tips",
      description: "Get the flawless French tips and custom nail art...",
      category: "Tip gel",
      image: "https://images.unsplash.com/photo-1632345031635-7b80005a04b0?q=80&w=300&auto=format&fit=crop", 
      stats: { likes: 124, comments: 22, bookmarks: 54, views: 1240, clicks: 88 }
    },
    {
      id: 2,
      title: "Summer Hair Transformation",
      description: "From brunette to blonde, see the amazing process...",
      category: "Hair",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=300&auto=format&fit=crop", 
      stats: { likes: 210, comments: 45, bookmarks: 89, views: 3500, clicks: 150 }
    }
  ];

  // Reports Data
  const reportPeriods = [
    { id: 'month', label: 'Past Month', sub: 'Last 30 days' },
    { id: '3months', label: 'Past 3 Months', sub: 'Last 90 days' },
    { id: '6months', label: 'Past 6 Months', sub: 'Last 180 days' },
    { id: 'year', label: 'Past Year', sub: 'Last 12 months' },
    { id: 'all', label: 'All Time', sub: 'Since you started' },
  ];


  // --- HELPERS & SVG COMPONENTS ---
  
  const DonutChart = () => (
    <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
      <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
      <path className="text-emerald-500" strokeDasharray="88, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
      <path className="text-blue-500" strokeDasharray="8, 100" strokeDashoffset="-88" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );

  const SmoothAreaChart = ({ color, id, height = 60 }: { color: string, id: string, height?: number }) => {
    const colors: Record<string, { stroke: string, fill: string }> = {
        orange: { stroke: 'text-orange-400', fill: 'text-orange-400' },
        purple: { stroke: 'text-purple-400', fill: 'text-purple-400' },
    };
    const theme = colors[color] || colors.orange;

    return (
        <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" className={theme.fill.replace('text-', 'stop-')} stopOpacity={0.2} />
                    <stop offset="100%" className={theme.fill.replace('text-', 'stop-')} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d="M0,45 C40,40 60,55 90,35 C120,15 150,25 200,10 V60 H0 Z" className={`fill-current ${theme.fill}`} style={{ fill: `url(#grad-${id})` }} />
            <path d="M0,45 C40,40 60,55 90,35 C120,15 150,25 200,10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={theme.stroke} />
        </svg>
    );
  };

   const SmallAreaChart = ({ color, id }: { color: string, id: string }) => {
    const colors: Record<string, { stroke: string, fill: string }> = {
        orange: { stroke: 'text-orange-400', fill: 'text-orange-400' },
        purple: { stroke: 'text-purple-400', fill: 'text-purple-400' },
    };
    const theme = colors[color] || colors.orange;

    return (
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-small-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" className={theme.fill.replace('text-', 'stop-')} stopOpacity={0.2} />
                    <stop offset="100%" className={theme.fill.replace('text-', 'stop-')} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d="M0,30 C20,25 40,35 60,15 C80,5 90,10 100,5 V40 H0 Z" className={`fill-current ${theme.fill}`} style={{ fill: `url(#grad-small-${id})` }} />
            <path d="M0,30 C20,25 40,35 60,15 C80,5 90,10 100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={theme.stroke} />
        </svg>
    );
  };


  const TabButton = ({ id, label }: { id: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
        activeTab === id
          ? 'bg-[#b30549] text-white shadow-md shadow-pink-200'
          : 'bg-white text-slate-600 hover:bg-gray-50 border border-transparent hover:border-slate-200'
      }`}
    >
      {label}
    </button>
  );

  const FilterSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) => (
    <div className="flex-1 px-4 relative group">
      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 text-[10px]">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent text-slate-700 text-sm font-semibold py-1 pr-8 focus:outline-none cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  // --- TAB CONTENT RENDERERS ---

  const renderEarnings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Row 1: Financial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total Revenue Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                    <div>
                         <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wide">Total Revenue</h3>
                         <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-extrabold text-slate-900">
                                KES {totalRevenue.toLocaleString()}
                            </span>
                         </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
                 <div className="mt-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <svg className="-ml-0.5 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                        +12.5%
                    </span>
                 </div>
            </div>

            {/* Commissions Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                    <div>
                         <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wide">Commissions</h3>
                         <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-extrabold text-blue-600">
                                KES {totalCommission.toLocaleString()}
                            </span>
                         </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                    </div>
                </div>
                <div className="mt-auto">
                    <p className="text-xs font-medium text-slate-500">Total Payout to professionals</p>
                </div>
            </div>

            {/* Net Earnings Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                    <div>
                         <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wide">Net Earnings</h3>
                         <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-extrabold text-emerald-600">
                                KES {netEarnings.toLocaleString()}
                            </span>
                         </div>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
                 <div className="mt-auto">
                    <p className="text-xs font-medium text-slate-500">Business profit after commissions</p>
                 </div>
            </div>
        </div>

        {/* Row 2: Appointments & Client Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-6 z-10">
                    <div>
                        <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wide">Appointments</h3>
                         <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-4xl font-extrabold text-blue-600">
                                {appointmentStats.total}
                            </span>
                         </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 mt-4 z-10">
                     <div className="flex-shrink-0">
                         <DonutChart />
                     </div>
                     <div className="flex-grow space-y-3">
                        {appointmentStats.details.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-3 h-3 rounded-full shadow-sm ${item.color}`}></span>
                                    <span className="text-slate-600 font-medium">{item.label}</span>
                                </div>
                                <span className="font-bold text-slate-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Client Metrics */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col justify-center">
                <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
                    Client Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="px-4 text-center sm:text-left">
                        <p className="text-sm font-medium text-slate-500 mb-1">Unique Clients</p>
                        <p className="text-4xl font-extrabold text-slate-900">{clientStats.unique}</p>
                    </div>
                    <div className="px-4 text-center sm:text-left pt-6 sm:pt-0">
                        <p className="text-sm font-medium text-slate-500 mb-1">New Clients</p>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <p className="text-4xl font-extrabold text-emerald-500">{clientStats.new}</p>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">+28%</span>
                        </div>
                    </div>
                    <div className="px-4 text-center sm:text-left pt-6 sm:pt-0">
                        <p className="text-sm font-medium text-slate-500 mb-1">Returning Clients</p>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                             <p className="text-4xl font-extrabold text-blue-500">{clientStats.returning}</p>
                             <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">71%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Row 3: Top Services & Professionals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Services */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>
                    Top Services
                </h3>
                <div className="space-y-6">
                    {topServices.map((service) => (
                    <div key={service.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-700 font-bold text-sm shadow-sm">
                                #{service.rank}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{service.name}</p>
                                <p className="text-xs font-medium text-slate-500">{service.count} appointments</p>
                            </div>
                        </div>
                        <div className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                            KES {service.revenue.toLocaleString()}
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Top Professionals - Simplified View */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#b30549]" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
                    Top Professionals
                </h3>
                <div className="space-y-6">
                    {topProfessionals.map((prof) => (
                    <div key={prof.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${prof.color}`}>
                                {prof.initial}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{prof.name}</p>
                                <p className="text-xs font-medium text-slate-500">{prof.appointments} appointments</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-emerald-600">
                                KES {prof.revenue.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Row 4: Staff Commission Breakdown (New Section) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567.267C8.07 9.223 8 9.13 8 9c0-.13.07-.223.433-.582zM11 12.849v-1.699c.22.071.412.164.567.267.364.359.433.452.433.582 0 .13-.07.223-.433.582a2.305 2.305 0 01-.567.268z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.312-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.312.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Staff Commission Breakdown
                </h3>
                <button className="text-sm text-[#b30549] font-semibold hover:underline">Download Report</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="py-3 pl-2">Professional</th>
                            <th className="py-3 text-center">Appts</th>
                            <th className="py-3 text-right">Total Revenue</th>
                            <th className="py-3 text-center">Comm. Rate</th>
                            <th className="py-3 text-right pr-2">Commission Payout</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {staffPerformance.map((staff) => (
                            <tr key={staff.id} className="group hover:bg-slate-50 transition-colors">
                                <td className="py-3 pl-2 flex items-center gap-3">
                                    <img src={staff.image} alt={staff.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                                        <p className="text-xs text-slate-500">{staff.role}</p>
                                    </div>
                                </td>
                                <td className="py-3 text-center text-sm font-medium text-slate-600">{staff.appointments}</td>
                                <td className="py-3 text-right text-sm font-bold text-slate-800">KES {staff.revenue.toLocaleString()}</td>
                                <td className="py-3 text-center">
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{(staff.commissionRate * 100)}%</span>
                                </td>
                                <td className="py-3 text-right pr-2">
                                    <span className="text-sm font-bold text-blue-600">KES {(staff.revenue * staff.commissionRate).toLocaleString()}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                         <tr className="border-t-2 border-slate-100 bg-slate-50/50">
                            <td className="py-4 pl-2 text-sm font-extrabold text-slate-900">Totals</td>
                            <td className="py-4 text-center text-sm font-bold text-slate-800">{staffPerformance.reduce((a,b) => a + b.appointments, 0)}</td>
                            <td className="py-4 text-right text-sm font-bold text-slate-800">KES {staffPerformance.reduce((a,b) => a + b.revenue, 0).toLocaleString()}</td>
                            <td className="py-4"></td>
                            <td className="py-4 text-right pr-2 text-sm font-extrabold text-blue-600">KES {staffPerformance.reduce((a,b) => a + (b.revenue * b.commissionRate), 0).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
       </div>
    </div>
  );

  const renderGrowth = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* This Week Section */}
        <div>
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-bold text-slate-800">This Week</h3>
                 <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">Nov 10 - Nov 16</span>
             </div>
             
             {/* Large Cards Row */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Profile Clicks */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 mb-4">Profile Clicks</p>
                        <p className="text-5xl font-extrabold text-orange-400 mb-2">24</p>
                        <p className="text-xs text-orange-400/80 font-semibold tracking-wide">↑ 12% vs last week</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 opacity-60">
                        <SmoothAreaChart color="orange" id="week-clicks" />
                    </div>
                </div>
                
                {/* Profile Views */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="relative z-10">
                         <p className="text-sm font-medium text-slate-500 mb-4">Profile Views</p>
                         <p className="text-5xl font-extrabold text-purple-400 mb-2">142</p>
                         <p className="text-xs text-purple-400/80 font-semibold tracking-wide">↑ 8% vs last week</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 opacity-60">
                         <SmoothAreaChart color="purple" id="week-views" />
                    </div>
                </div>
             </div>

             {/* Engagement Placeholder */}
             <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Engagement Over Time</h3>
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="flex items-end gap-3 mb-4 opacity-30">
                        <div className="w-8 h-20 bg-slate-300 rounded-t-sm"></div>
                        <div className="w-8 h-32 bg-slate-300 rounded-t-sm"></div>
                        <div className="w-8 h-24 bg-slate-300 rounded-t-sm"></div>
                        <div className="w-8 h-40 bg-slate-300 rounded-t-sm"></div>
                        <div className="w-8 h-28 bg-slate-300 rounded-t-sm"></div>
                        <div className="w-8 h-44 bg-slate-300 rounded-t-sm"></div>
                        <div className="w-8 h-36 bg-slate-300 rounded-t-sm"></div>
                    </div>
                    <span className="text-slate-400 text-xs font-semibold z-10">Daily breakdown available on Pro plan</span>
                </div>
             </div>
        </div>

        {/* This Month Section */}
        <div>
             <h3 className="text-lg font-bold text-slate-800 mb-4">This Month</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Card 1 */}
                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-slate-500 mb-2">Profile Clicks</p>
                        <p className="text-4xl font-bold text-orange-400">86</p>
                     </div>
                     <div className="w-32 h-16">
                        <SmallAreaChart color="orange" id="month-clicks" />
                     </div>
                 </div>
                 {/* Card 2 */}
                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-slate-500 mb-2">Profile Views</p>
                        <p className="text-4xl font-bold text-purple-400">420</p>
                     </div>
                     <div className="w-32 h-16">
                        <SmallAreaChart color="purple" id="month-views" />
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );

  const renderInspos = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        {/* Key Metrics Overview */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
             <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 00-1-1H3zm6 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg>
                Inspo Performance
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Total Posts</p>
                    <p className="text-3xl font-extrabold text-blue-600">{inspoMetrics.totalPosts}</p>
                </div>
                 <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Profile Views</p>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-extrabold text-emerald-600">{inspoMetrics.profileViews}</p>
                        <span className="text-xs text-emerald-600 font-bold mb-1">↑ 12%</span>
                    </div>
                </div>
                 <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Bookings</p>
                    <p className="text-3xl font-extrabold text-orange-500">{inspoMetrics.bookings}</p>
                </div>
                 <div className="p-6 rounded-2xl border border-slate-100 bg-pink-50 relative border-pink-100">
                     <div className="absolute top-4 right-4 bg-white text-pink-600 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-pink-100">ADS</div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-pink-800/60 mb-2">Promoted</p>
                    <p className="text-3xl font-extrabold text-pink-600">{inspoMetrics.promoted}</p>
                </div>
             </div>
             
             {/* Total Engagement */}
             <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-purple-900">Total Engagement</p>
                    <p className="text-xs text-purple-700/70 mt-1">Likes, Comments, Shares across all posts</p>
                </div>
                <p className="text-4xl font-extrabold text-purple-600">{inspoMetrics.engagement}</p>
             </div>
        </div>

        {/* Posted Content */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h3 className="font-bold text-slate-800 mb-2">Posted Content</h3>
            <p className="text-sm text-slate-500 mb-6">Recent Inspo posts and their performance metrics.</p>
            
            <div className="space-y-4">
                {inspoPosts.map(post => (
                    <div key={post.id} className="group flex flex-col sm:flex-row gap-6 p-5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all bg-white">
                        <div className="relative overflow-hidden rounded-xl w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-[#b30549] transition-colors">{post.title}</h4>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded">{post.category}</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.description}</p>
                            
                            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v7.333l-2 2.333A1.998 1.998 0 006 10.333z" /></svg> <span className="font-bold text-slate-700">{post.stats.likes}</span></span>
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg> <span className="font-bold text-slate-700">{post.stats.comments}</span></span>
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg> <span className="font-bold text-slate-700">{post.stats.bookmarks}</span></span>
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> <span className="font-bold text-slate-700">{post.stats.views}</span></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h3 className="font-extrabold text-2xl text-slate-900">Generate Reports</h3>
                    <p className="text-slate-500 mt-2">Download appointment statements and financial summaries.</p>
                </div>
                
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Select Period</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
                    {reportPeriods.map(period => (
                        <button
                            key={period.id}
                            onClick={() => setSelectedReportPeriod(period.id)}
                            className={`text-left p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                                selectedReportPeriod === period.id
                                ? 'border-[#b30549] bg-pink-50/50 shadow-sm'
                                : 'border-slate-100 hover:border-pink-200 bg-white'
                            }`}
                        >
                            {selectedReportPeriod === period.id && (
                                <div className="absolute top-0 right-0 p-1">
                                    <div className="w-2 h-2 rounded-full bg-[#b30549]"></div>
                                </div>
                            )}
                            <div className={`text-sm font-bold mb-1 ${selectedReportPeriod === period.id ? 'text-[#b30549]' : 'text-slate-800'}`}>
                                {period.label}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">{period.sub}</div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-slate-100 pt-8">
                    <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all font-semibold">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                        Download PDF
                    </button>
                    <button className="flex items-center justify-center gap-3 px-8 py-4 bg-[#b30549] text-white rounded-xl hover:bg-[#a10442] hover:shadow-lg hover:shadow-pink-200 transition-all font-semibold">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Download CSV
                    </button>
                </div>
            </div>
         </div>
    </div>
  );

  return (
    <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
                <p className="mt-2 text-slate-500 font-medium">Track your business performance and growth metrics.</p>
            </div>
            {/* Tabs */}
            <div className="flex p-1 bg-white rounded-full border border-slate-200 shadow-sm overflow-x-auto self-start md:self-auto">
                <TabButton id="earnings" label="Earnings" />
                <TabButton id="growth" label="Growth" />
                <TabButton id="inspos" label="Inspos" />
                <TabButton id="reports" label="Reports" />
            </div>
        </div>

        {/* Filters - Shared across all tabs - REDESIGNED */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 md:divide-x divide-slate-100">
          <FilterSelect 
            label="Date Range" 
            value={dateRange} 
            onChange={setDateRange} 
            options={['This Week', 'Last Week', 'This Month', 'Last Month', 'This Year']} 
          />
          <FilterSelect 
            label="Professional" 
            value={selectedProf} 
            onChange={setSelectedProf} 
            options={['All Professionals', ...PROFESSIONALS.map(p => p.staff_name)]} 
          />
          <FilterSelect 
            label="Service" 
            value={selectedService} 
            onChange={setSelectedService} 
            options={['All Services', 'Hair Cut', 'Massage', 'Manicure']} 
          />
          <FilterSelect 
            label="Source" 
            value={selectedSource} 
            onChange={setSelectedSource} 
            options={['All Sources', 'Walk-in', 'Online', 'Referral']} 
          />
        </div>

        {/* Content Area */}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'growth' && renderGrowth()}
        {activeTab === 'inspos' && renderInspos()}
        {activeTab === 'reports' && renderReports()}

      </div>
    </main>
  );
};

export default AnalyticsPage;
