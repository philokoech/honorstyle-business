
import React, { useState } from 'react';
import { PROFESSIONALS } from '../constants';

type TabType = 'earnings' | 'growth' | 'inspos' | 'reports';

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('earnings');
  const [dateRange, setDateRange] = useState('This Week');
  const [selectedProf, setSelectedProf] = useState('All Professionals');
  const [selectedReportPeriod, setSelectedReportPeriod] = useState('month');

  // --- MOCK DATA ---

  // Earnings Data
  const totalRevenue = 2000;
  const completedApptsRevenue = 2000;
  const avgTicket = 2000;
  
  const appointmentStats = {
    total: 2,
    completed: 1,
    upcoming: 0,
    cancelled: 0,
    missed: 1
  };

  const clientStats = {
    unique: 1,
    new: 0,
    returning: 1
  };

  const topServices = [
    { rank: 1, name: 'Mindfulness', count: 1, revenue: 2000 },
    { rank: 2, name: 'Hair Colouring', count: 0, revenue: 0 },
    { rank: 3, name: 'Deep Tissue', count: 0, revenue: 0 },
  ];

  const topProfessionals = PROFESSIONALS.slice(0, 3).map((prof, index) => ({
    ...prof,
    revenue: index === 0 ? 2000 : 0, 
    appointments: index === 0 ? 1 : 0
  }));

  // Inspos Data
  const inspoMetrics = {
    totalPosts: 1,
    profileViews: 0,
    bookings: 0,
    promoted: 0,
    engagement: 0
  };

  const inspoPosts = [
    {
      id: 1,
      title: "Flawless French Nail Tips",
      description: "Get the flawless French tips and custom nail art...",
      category: "Tip gel",
      image: "https://images.unsplash.com/photo-1632345031635-7b80005a04b0?q=80&w=300&auto=format&fit=crop", 
      stats: { likes: 0, comments: 0, bookmarks: 0, views: 0, clicks: 0 }
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


  // --- COMPONENTS ---

  const TabButton = ({ id, label }: { id: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
        activeTab === id
          ? 'bg-[#b30549] text-white shadow-md'
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
      }`}
    >
      {label}
    </button>
  );

  const FilterSelect = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) => (
    <div className="flex-1 min-w-[180px]">
      <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#b30549]/20 focus:border-[#b30549] transition-shadow cursor-pointer shadow-sm"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  // --- TAB CONTENT RENDERERS ---

  const renderEarnings = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Row 1: Revenue & Appointments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Revenue Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-700 mb-6">Total Revenue</h3>
            <div className="text-4xl font-bold text-emerald-500 mb-8">
                ${totalRevenue.toLocaleString()}
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Completed Appointments</span>
                <span className="font-medium text-slate-700">${completedApptsRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Avg Ticket Size</span>
                <span className="font-medium text-slate-700">${avgTicket.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Cancellations</span>
                <span className="font-medium text-slate-700">0</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">No Shows</span>
                <span className="font-medium text-slate-700">1</span>
                </div>
            </div>
            </div>

            {/* Appointments Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-700 mb-6">Appointments</h3>
            <div className="text-4xl font-bold text-blue-500 mb-8">
                {appointmentStats.total}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-500">Completed</span>
                </div>
                <span className="font-medium text-slate-700">{appointmentStats.completed}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    <span className="text-slate-500">Upcoming</span>
                </div>
                <span className="font-medium text-slate-700">{appointmentStats.upcoming}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="text-slate-500">Cancelled</span>
                </div>
                <span className="font-medium text-slate-700">{appointmentStats.cancelled}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                    <span className="text-slate-500">Missed</span>
                </div>
                <span className="font-medium text-slate-700">{appointmentStats.missed}</span>
                </div>
            </div>
            </div>
        </div>

        {/* Row 2: Client Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-700 mb-6">Client Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <p className="text-sm text-slate-500 mb-1">Unique Clients</p>
                <p className="text-3xl font-bold text-slate-800">{clientStats.unique}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500 mb-1">New Clients</p>
                <p className="text-3xl font-bold text-emerald-500">{clientStats.new}</p>
            </div>
            <div>
                <p className="text-sm text-slate-500 mb-1">Returning Clients</p>
                <p className="text-3xl font-bold text-blue-500">{clientStats.returning}</p>
            </div>
            </div>
        </div>

        {/* Row 3: Top Services & Professionals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Services */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-700 mb-6">Top Services</h3>
            <div className="space-y-4">
                {topServices.map((service) => (
                <div key={service.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-600 font-bold text-sm">
                        #{service.rank}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{service.name}</p>
                        <p className="text-xs text-slate-500">{service.count} appointments</p>
                    </div>
                    </div>
                    <div className="font-semibold text-emerald-600">
                    ${service.revenue.toLocaleString()}
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* Top Professionals */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-700 mb-6">Top Professionals</h3>
            <div className="space-y-4">
                {topProfessionals.map((prof) => (
                <div key={prof.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${prof.color}`}>
                        {prof.image ? (
                            <img src={prof.image} alt={prof.staff_name} className="w-full h-full rounded-full object-cover" />
                        ) : prof.staff_name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{prof.staff_name}</p>
                        <p className="text-xs text-slate-500">{prof.appointments} appointments</p>
                    </div>
                    </div>
                    <div className="font-semibold text-emerald-600">
                    ${prof.revenue.toLocaleString()}
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    </div>
  );

  const renderGrowth = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {['This Week', 'This Month'].map((period) => (
            <div key={period} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">{period}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-sm text-slate-500">Profile Clicks</span>
                        <div className="text-3xl font-bold text-orange-500 mt-1">0</div>
                     </div>
                     <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-sm text-slate-500">Profile Views</span>
                        <div className="text-3xl font-bold text-purple-500 mt-1">0</div>
                     </div>
                </div>
                {/* Chart Placeholder Area */}
                <div className="h-48 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-dashed border-slate-200">
                    <span className="text-slate-400 text-sm">No staff data available</span>
                </div>
            </div>
        ))}
    </div>
  );

  const renderInspos = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        {/* Key Metrics Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h3 className="font-semibold text-slate-800 mb-4">Key Metrics Overview</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Total Posts</p>
                    <p className="text-2xl font-bold text-blue-500">{inspoMetrics.totalPosts}</p>
                </div>
                 <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Profile Views</p>
                    <p className="text-2xl font-bold text-emerald-500">{inspoMetrics.profileViews}</p>
                </div>
                 <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <p className="text-xs text-slate-500 mb-1">Bookings</p>
                    <p className="text-2xl font-bold text-orange-500">{inspoMetrics.bookings}</p>
                </div>
                 <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col">
                    <div className="flex justify-between items-start">
                         <p className="text-xs text-slate-500 mb-1">Promoted</p>
                         <span className="bg-pink-100 text-[#b30549] text-[10px] font-bold px-1.5 py-0.5 rounded">ADS</span>
                    </div>
                    <p className="text-2xl font-bold text-[#b30549]">{inspoMetrics.promoted}</p>
                </div>
             </div>
             {/* Total Engagement separate row */}
             <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Total Engagement</p>
                <p className="text-2xl font-bold text-purple-600">{inspoMetrics.engagement}</p>
             </div>
        </div>

        {/* Posted Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Posted Content</h3>
            <p className="text-xs text-slate-500 mb-6">Recent Inspo posts and their performance</p>
            
            <div className="space-y-4">
                {inspoPosts.map(post => (
                    <div key={post.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                        <img src={post.image} alt={post.title} className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg bg-slate-200" />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-slate-800">{post.title}</h4>
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{post.description}</p>
                                <p className="text-xs text-slate-400 mt-1">{post.category}</p>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500 font-medium">
                                <span>Likes: {post.stats.likes}</span>
                                <span>Comments: {post.stats.comments}</span>
                                <span>Bookmarks: {post.stats.bookmarks}</span>
                                <span>Views: {post.stats.views}</span>
                                <span>Clicks: {post.stats.clicks}</span>
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
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800">Reports</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">Generate appointment statements for a predefined period.</p>
            
            <p className="text-xs font-semibold text-slate-700 mb-3">Select Report Period</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                {reportPeriods.map(period => (
                    <button
                        key={period.id}
                        onClick={() => setSelectedReportPeriod(period.id)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                            selectedReportPeriod === period.id
                            ? 'border-[#b30549] bg-[#fceef4] ring-1 ring-[#b30549]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                        <div className={`text-sm font-semibold ${selectedReportPeriod === period.id ? 'text-[#b30549]' : 'text-slate-800'}`}>
                            {period.label}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{period.sub}</div>
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                 <button className="flex items-center gap-2 text-slate-700 hover:text-[#b30549] text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Download PDF
                 </button>
                 <button className="flex items-center gap-2 text-slate-700 hover:text-[#b30549] text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Download CSV
                 </button>
            </div>
         </div>
    </div>
  );

  return (
    <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className=" mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="mt-1 text-slate-500">Track your business performance and growth</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          <TabButton id="earnings" label="Earnings" />
          <TabButton id="growth" label="Growth" />
          <TabButton id="inspos" label="Inspos" />
          <TabButton id="reports" label="Reports" />
        </div>

        {/* Filters - Shared across all tabs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4">
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
            value="All Services" 
            onChange={() => {}} 
            options={['All Services', 'Hair Cut', 'Massage', 'Manicure']} 
          />
          <FilterSelect 
            label="Source" 
            value="All Sources" 
            onChange={() => {}} 
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
