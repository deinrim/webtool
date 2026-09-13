import React, { useState } from 'react';
import { DollarSign, TrendingUp, Percent, Target, MousePointer, BarChart3 } from 'lucide-react';

export const GoogleAdsBudgetCalculator: React.FC = () => {
  const [revenueTarget, setRevenueTarget] = useState<number>(10000);
  const [avgOrderVal, setAvgOrderVal] = useState<number>(150);
  const [convRate, setConvRate] = useState<number>(2.5); // %
  const [avgCpc, setAvgCpc] = useState<number>(1.8);

  const neededOrders = Math.ceil(revenueTarget / (avgOrderVal || 1));
  const neededClicks = Math.ceil(neededOrders / ((convRate || 1) / 100));
  const recommendedBudget = Math.round(neededClicks * avgCpc);
  const projectedRoas = recommendedBudget > 0 ? ((revenueTarget / recommendedBudget) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Target Monthly Revenue ($)</label>
          <input
            type="number"
            value={revenueTarget}
            onChange={e => setRevenueTarget(Number(e.target.value))}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Average Order Value ($)</label>
          <input
            type="number"
            value={avgOrderVal}
            onChange={e => setAvgOrderVal(Number(e.target.value))}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Website Conversion Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={convRate}
            onChange={e => setConvRate(Number(e.target.value))}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Estimated Average CPC ($)</label>
          <input
            type="number"
            step="0.1"
            value={avgCpc}
            onChange={e => setAvgCpc(Number(e.target.value))}
            className="w-full p-2.5 text-xs rounded-xl border"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center">
          <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold block">Recommended Ad Budget</span>
          <p className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mt-2">${recommendedBudget.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">per month</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">Traffic Needed</span>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mt-2">{neededClicks.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">clicks to generate {neededOrders} sales</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center">
          <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">Projected ROAS</span>
          <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-2">{projectedRoas}%</p>
          <span className="text-[11px] text-emerald-600 mt-1 block">{((revenueTarget / recommendedBudget) || 0).toFixed(1)}x Return on Ad Spend</span>
        </div>
      </div>
    </div>
  );
};

export const RoasCalculator: React.FC = () => {
  const [adSpend, setAdSpend] = useState<number>(2500);
  const [revenue, setRevenue] = useState<number>(11250);

  const roasRatio = adSpend > 0 ? (revenue / adSpend).toFixed(2) : '0';
  const roasPercent = adSpend > 0 ? Math.round((revenue / adSpend) * 100) : 0;
  const netProfit = revenue - adSpend;
  const roiPercent = adSpend > 0 ? Math.round(((revenue - adSpend) / adSpend) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Total Advertising Spend ($)</label>
          <input
            type="number"
            value={adSpend}
            onChange={e => setAdSpend(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Total Attributed Revenue ($)</label>
          <input
            type="number"
            value={revenue}
            onChange={e => setRevenue(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-center">
          <span className="text-[10px] uppercase font-bold text-blue-600">ROAS Ratio</span>
          <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">{roasRatio}x</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-600">ROAS %</span>
          <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{roasPercent}%</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500">Gross Margin</span>
          <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">${netProfit.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-center">
          <span className="text-[10px] uppercase font-bold text-purple-600">Pure ROI %</span>
          <p className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">{roiPercent}%</p>
        </div>
      </div>
    </div>
  );
};

export const CtrCalculator: React.FC = () => {
  const [clicks, setClicks] = useState<number>(340);
  const [impressions, setImpressions] = useState<number>(10000);

  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Total Ad Clicks</label>
          <input
            type="number"
            value={clicks}
            onChange={e => setClicks(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Total Ad Impressions</label>
          <input
            type="number"
            value={impressions}
            onChange={e => setImpressions(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-center">
        <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Calculated Click-Through Rate (CTR)</span>
        <p className="text-4xl font-extrabold text-blue-700 dark:text-blue-300 mt-2">{ctr}%</p>
        <span className="text-xs text-slate-500 mt-2 block">
          {Number(ctr) > 3.0 ? '🌟 Above average performance for search campaigns!' : 'Standard industry benchmark range'}
        </span>
      </div>
    </div>
  );
};

export const CpaCalculator: React.FC = () => {
  const [spend, setSpend] = useState<number>(1500);
  const [conversions, setConversions] = useState<number>(45);

  const cpa = conversions > 0 ? (spend / conversions).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Total Campaign Spend ($)</label>
          <input
            type="number"
            value={spend}
            onChange={e => setSpend(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Total Conversions / Acquisitions</label>
          <input
            type="number"
            value={conversions}
            onChange={e => setConversions(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center">
        <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Cost Per Acquisition (CPA)</span>
        <p className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-2">${cpa}</p>
        <span className="text-xs text-slate-500 mt-2 block">Cost incurred to acquire each customer / lead</span>
      </div>
    </div>
  );
};

export const CpmCalculator: React.FC = () => {
  const [cost, setCost] = useState<number>(200);
  const [impressions, setImpressions] = useState<number>(50000);

  const cpm = impressions > 0 ? ((cost / impressions) * 1000).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Total Campaign Cost ($)</label>
          <input
            type="number"
            value={cost}
            onChange={e => setCost(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Total Ad Impressions</label>
          <input
            type="number"
            value={impressions}
            onChange={e => setImpressions(Number(e.target.value))}
            className="w-full p-3 rounded-xl border text-sm"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-center">
        <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">Cost Per Thousand Impressions (CPM)</span>
        <p className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-2">${cpm}</p>
        <span className="text-xs text-slate-500 mt-2 block">Standard metric for display, video & social ads</span>
      </div>
    </div>
  );
};
