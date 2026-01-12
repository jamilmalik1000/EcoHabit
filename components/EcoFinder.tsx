import React, { useState } from 'react';
import { findNearbyEcoPlaces, analyzeLocalReport } from '../services/geminiService';
import { MapPin, Search, Navigation, AlertTriangle, Plus, CheckCircle } from 'lucide-react';
import { EcoReport } from '../types';
import ReactMarkdown from 'react-markdown';

const MOCK_REPORTS: EcoReport[] = [
  {
    id: 'r1',
    category: 'Litter',
    severity: 'Medium',
    locationName: 'Central Park Entrance',
    description: 'Overflowing recycling bin near the main gate.',
    timestamp: new Date(Date.now() - 10000000),
    aiAnalysis: 'Sanitation services needed.'
  },
  {
    id: 'r2',
    category: 'Maintenance',
    severity: 'High',
    locationName: 'Riverside Walk',
    description: 'Broken water pipe leaking clean water onto the path.',
    timestamp: new Date(Date.now() - 50000000),
    aiAnalysis: 'Urgent water conservation issue.'
  }
];

const EcoFinder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'find' | 'report'>('find');
  
  // Find State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [category, setCategory] = useState("Recycling Centers");
  const categories = ["Recycling Centers", "Vegan Restaurants", "Parks", "Thrift Stores"];

  // Report State
  const [reports, setReports] = useState<EcoReport[]>(MOCK_REPORTS);
  const [reportDesc, setReportDesc] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const handleLocate = () => {
    if (!process.env.API_KEY) {
        setResult("## API Key Missing\nPlease add your Gemini API Key to env to use Maps features.");
        return;
    }
    setLoading(true);
    setResult(null);

    if (!navigator.geolocation) {
      setResult("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const text = await findNearbyEcoPlaces(latitude, longitude, category);
        setResult(text);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setResult("Unable to retrieve your location. Please enable location permissions.");
        setLoading(false);
      }
    );
  };

  const handleSubmitReport = async () => {
    if (!reportDesc.trim()) return;
    setReportLoading(true);
    
    // Simulate location (in a real app, use Geolocation API)
    const mockLocation = "Nearby Location"; 
    
    let analysis: { category: string; severity: 'Low' | 'Medium' | 'High'; summary: string } = { category: 'General', severity: 'Low', summary: 'Report logged' };
    
    if (process.env.API_KEY) {
        analysis = await analyzeLocalReport(reportDesc);
    }

    const newReport: EcoReport = {
        id: Date.now().toString(),
        category: analysis.category,
        severity: analysis.severity,
        locationName: mockLocation,
        description: reportDesc,
        timestamp: new Date(),
        aiAnalysis: analysis.summary
    };

    setReports([newReport, ...reports]);
    setReportDesc('');
    setIsReporting(false);
    setReportLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <MapPin className="text-emerald-600" /> Eco Locator
        </h2>
        
        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-lg">
            <button 
              onClick={() => setActiveTab('find')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'find' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Find Places
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'report' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Community Reports
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {activeTab === 'find' ? (
          <>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                I'm looking for...
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {categories.map(c => (
                        <button 
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${category === c ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                
                <button
                onClick={handleLocate}
                disabled={loading}
                className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-70"
                >
                {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <Search size={18} />
                )}
                {loading ? "Searching..." : `Find ${category}`}
                </button>
            </div>

            {result ? (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 prose prose-sm prose-slate max-w-none">
                    <ReactMarkdown 
                        components={{
                            a: ({node, ...props}) => <a {...props} className="text-emerald-600 underline font-medium" target="_blank" rel="noopener noreferrer" />
                        }}
                    >
                        {result}
                    </ReactMarkdown>
                </div>
            ) : (
                !loading && (
                    <div className="flex flex-col items-center justify-center text-slate-400 opacity-50 py-12">
                        <Navigation size={48} className="mb-4" />
                        <p className="text-sm">Select a category and tap search</p>
                    </div>
                )
            )}
          </>
        ) : (
          <div className="space-y-4">
             {/* Create Report Box */}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                {!isReporting ? (
                   <button 
                     onClick={() => setIsReporting(true)}
                     className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                   >
                     <AlertTriangle size={18} /> Report Issue
                   </button>
                ) : (
                   <div className="animate-in fade-in slide-in-from-top-2">
                      <h3 className="font-bold text-slate-800 mb-2">Details</h3>
                      <textarea
                        value={reportDesc}
                        onChange={(e) => setReportDesc(e.target.value)}
                        placeholder="Describe the issue (e.g. overflowing bin, litter, damaged tree)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none mb-3"
                        rows={3}
                      />
                      <div className="flex gap-2">
                         <button 
                           onClick={handleSubmitReport}
                           disabled={reportLoading || !reportDesc.trim()}
                           className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                         >
                           {reportLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Submit Report'}
                         </button>
                         <button 
                           onClick={() => setIsReporting(false)}
                           className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
                         >
                           Cancel
                         </button>
                      </div>
                   </div>
                )}
             </div>

             {/* Reports List */}
             {reports.map((report) => (
               <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-1 h-full ${
                    report.severity === 'High' ? 'bg-red-500' : report.severity === 'Medium' ? 'bg-orange-500' : 'bg-yellow-400'
                 }`} />
                 <div className="pl-3">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                          report.severity === 'High' ? 'bg-red-100 text-red-700' : report.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                       }`}>
                          {report.category}
                       </span>
                       <span className="text-xs text-slate-400">{report.timestamp.toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{report.locationName}</h4>
                    <p className="text-slate-600 text-sm mb-3">{report.description}</p>
                    {report.aiAnalysis && (
                        <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2 text-xs text-slate-500">
                           <CheckCircle size={12} className="text-emerald-500"/>
                           <span>AI Summary: {report.aiAnalysis}</span>
                        </div>
                    )}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoFinder;