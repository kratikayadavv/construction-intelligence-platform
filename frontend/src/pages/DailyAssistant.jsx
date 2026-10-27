import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CloudSun, Send } from 'lucide-react';
import Loader from '../components/Loader';
import RiskBadge from '../components/RiskBadge';
import ResultCard from '../components/ResultCard';
import { assistantAPI } from '../api/client';

export default function DailyAssistant() {
  const [location, setLocation] = useState('Indore, Madhya Pradesh');
  const [activities, setActivities] = useState('Concrete pouring, Scaffolding erection, Electrical work');
  const [workforce, setWorkforce] = useState(30);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const activityList = activities.split(',').map(s => s.trim()).filter(Boolean);
    if (!location.trim() || !activityList.length) { toast.error('Enter a location and at least one activity'); return; }
    setLoading(true); setResult(null);
    try {
      const res = await assistantAPI.daily({ location, activities: activityList, workforce_count: Number(workforce), notes });
      setResult(res.data); toast.success('Daily advisory generated');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return <div className="page-container fade-in">
    <div className="page-header"><h1 className="page-title">🌤️ Daily Site Assistant</h1>
      <p className="page-subtitle">Weather-informed construction activity advisories. Verify conditions at the job site before acting.</p></div>
    <div className="card"><div className="card-header"><div className="card-icon"><CloudSun size={20} /></div>
      <div><div className="card-title">Daily Site Briefing</div><div className="card-subtitle">Enter the location and planned work for today</div></div></div>
      <form onSubmit={submit}>
        <div className="form-group"><label className="form-label" htmlFor="daily-location">Location</label>
          <input id="daily-location" className="form-input" value={location} onChange={e => setLocation(e.target.value)} required /></div>
        <div className="form-group"><label className="form-label" htmlFor="daily-activities">Activities (comma-separated)</label>
          <textarea id="daily-activities" className="form-textarea" value={activities} onChange={e => setActivities(e.target.value)} rows={3} required /></div>
        <div className="form-group"><label className="form-label" htmlFor="daily-workforce">Workforce count</label>
          <input id="daily-workforce" className="form-input" type="number" min="0" value={workforce} onChange={e => setWorkforce(e.target.value)} /></div>
        <div className="form-group"><label className="form-label" htmlFor="daily-notes">Additional notes (optional)</label>
          <textarea id="daily-notes" className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
        <button className="btn btn-primary btn-full btn-lg" disabled={loading} type="submit"><Send size={16} />{loading ? 'Generating advisory…' : 'Get Daily Advisory'}</button>
      </form>
    </div>
    {loading && <Loader message="Checking weather and preparing site advisory…" />}
    {result && <div className="result-section">
      <div className="card"><div className="card-header"><div className="card-title">Overall Site Status</div><RiskBadge level={result.overall_site_status} size="lg" /></div>
        <p className="result-summary">{result.summary}</p>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{result.weather.temperature_c}°C</div><div className="stat-label">Temperature</div></div>
          <div className="stat-card"><div className="stat-value">{result.weather.wind_speed_kmh}</div><div className="stat-label">Wind km/h</div></div>
          <div className="stat-card"><div className="stat-value">{result.weather.precipitation_mm} mm</div><div className="stat-label">Precipitation</div></div>
          <div className="stat-card"><div className="stat-value">{result.weather.humidity_percent}%</div><div className="stat-label">Humidity</div></div>
        </div>
        <p>{result.weather.condition}</p>
      </div>
      <div className="result-grid"><ResultCard title="Activity Advice" icon="🛠️">
        <ul className="info-list">{result.activity_advice.map((a,i)=><li key={i}><RiskBadge level={a.recommendation}/><div><strong>{a.activity}</strong><div>{a.reason}</div></div></li>)}</ul>
      </ResultCard><ResultCard title="Safety Briefing" icon="🦺"><ul className="info-list">{result.safety_briefing.map((x,i)=><li key={i}>{x}</li>)}</ul></ResultCard>
      <ResultCard title="Daily Precautions" icon="✅"><ul className="info-list">{result.daily_precautions.map((x,i)=><li key={i}>{x}</li>)}</ul></ResultCard></div>
      <p style={{fontSize:'.8rem',color:'var(--text-muted)',marginTop:'1rem'}}>Advisory output is not a substitute for live site inspection, approved safety plans, or professional judgment.</p>
    </div>}
  </div>;
}
