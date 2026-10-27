import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, Search, Home, Activity, Database, Zap, Key, RefreshCw, X, ArrowRight } from 'lucide-react';
import { historyAPI, healthAPI, settingsAPI } from '../api/client';

const MODULES = [
  { to: '/safety', icon: '🦺', title: 'Safety Monitoring', desc: 'Detect PPE violations, scaffolding hazards and unsafe conditions.', color: '#ef4444' },
  { to: '/cracks', icon: '🔍', title: 'Crack Detection', desc: 'Classify visible cracks, assess severity and review repair options.', color: '#f97316' },
  { to: '/valuation', icon: '🏠', title: 'Real Estate Valuation', desc: 'Illustrative property market estimates in INR.', color: '#22c55e' },
  { to: '/planning', icon: '📅', title: 'Project Planning', desc: 'Project phases, BOQ estimates, labor and risk registers.', color: '#0ea5e9' },
  { to: '/daily', icon: '🌤️', title: 'Daily Site Assistant', desc: 'Weather context and site activity advisories.', color: '#a855f7' },
  { to: '/chat', icon: '💬', title: 'Knowledge Assistant', desc: 'Ask questions about construction standards and practices.', color: '#f59e0b' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, safety: 0, cracks: 0, valuations: 0 });
  const [recentItems, setRecentItems] = useState([]);
  const [health, setHealth] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const loadData = () => {
    historyAPI.get(null, 200).then(r => {
      const data = r.data;
      setStats({ total: data.length, safety: data.filter(d => d.module === 'safety').length,
        cracks: data.filter(d => d.module === 'crack_detection').length,
        valuations: data.filter(d => d.module === 'valuation').length });
      setRecentItems(data.slice(0, 4));
    }).catch(() => {});
    healthAPI.check().then(r => setHealth(r.data)).catch(() => {});
    settingsAPI.get().then(r => setSettings(r.data)).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setSavingKey(true);
    try {
      await settingsAPI.setKey(newKey.trim());
      toast.success('Gemini API key updated!');
      setNewKey(''); setShowKeyModal(false); loadData();
    } catch (err) { toast.error(err.message); }
    finally { setSavingKey(false); }
  };

  const handleTestKey = async () => {
    setTestingKey(true); setTestResult(null);
    try {
      const res = await settingsAPI.testKey();
      setTestResult(res.data);
      if (res.data.connected) toast.success(res.data.message);
      else toast(res.data.message, { icon: 'ℹ️' });
    } catch (err) { toast.error('Test connection failed: ' + err.message); }
    finally { setTestingKey(false); }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div><h1 className="page-title">🏗️ Construction Intelligence Platform</h1>
            <p className="page-subtitle">Multimodal AI decision support for construction engineers, inspectors, and developers</p></div>
          <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowKeyModal(true)} id="config-api-key-btn">
              <Key size={13} />{settings?.ai_key_configured ? 'API Key Configured' : 'Configure Gemini Key'}
            </button>
            {health && <span className="badge" style={{ color: health.mode === 'live' ? '#4ade80' : 'var(--primary)' }}>
              {health.mode === 'live' ? `Live AI · ${health.gemini_model}` : 'Demo Simulation Engine Active'}
            </span>}
          </div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}>
        <div><Activity size={18} color="var(--primary)" style={{ display: 'inline', marginRight: '.5rem' }} />
          <strong>System Status:</strong> Backend status and weather integration available; AI calls use the configured key or demo mode.</div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleTestKey} disabled={testingKey}>
          <RefreshCw size={12} className={testingKey ? 'spin' : ''} />{testingKey ? 'Testing...' : 'Test AI Link'}
        </button>
      </div>
      {testResult && <div className="card" style={{ marginBottom: '1rem' }}>{testResult.message}</div>}
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Analyses</div><Database className="stat-icon" /></div>
        <div className="stat-card"><div className="stat-value">{stats.safety}</div><div className="stat-label">Safety Inspections</div><Shield className="stat-icon" /></div>
        <div className="stat-card"><div className="stat-value">{stats.cracks}</div><div className="stat-label">Crack Analyses</div><Search className="stat-icon" /></div>
        <div className="stat-card"><div className="stat-value">{stats.valuations}</div><div className="stat-label">Valuations</div><Home className="stat-icon" /></div>
      </div>
      <h2 style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '1rem' }}>Decision Support Modules</h2>
      <div className="module-grid">{MODULES.map(({ to, icon, title, desc, color }) => (
        <Link key={to} to={to} className="module-card">
          <span className="module-icon" style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}>{icon}</span>
          <div className="module-title">{title}</div><div className="module-desc">{desc}</div>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.75rem', color: 'var(--primary)', fontWeight: 600 }}><Zap size={12} />Launch module →</div>
        </Link>
      ))}</div>
      {recentItems.length > 0 && <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
          <h2 style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Recent Inspections & Analyses</h2>
          <Link to="/history" style={{ fontSize: '.75rem', color: 'var(--primary)', textDecoration: 'none' }}>View history <ArrowRight size={12} /></Link>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}><table className="data-table" style={{ width: '100%' }}>
          <thead><tr><th>Module</th><th>Input Context</th><th>Timestamp</th><th>Action</th></tr></thead>
          <tbody>{recentItems.map(item => <tr key={item.id}>
            <td>{item.module.replace('_', ' ')}</td><td>{item.input_summary}</td>
            <td>{new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
            <td><Link to="/history" className="btn btn-secondary btn-sm">Details</Link></td>
          </tr>)}</tbody>
        </table></div>
      </div>}
      {showKeyModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
        <div className="card" style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3><Key size={18} /> Google Gemini API Key</h3>
            <button onClick={() => setShowKeyModal(false)} className="btn btn-secondary btn-sm"><X size={18} /></button></div>
          <p style={{ fontSize: '.8rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>Enter your Google AI Studio Gemini API key to activate live multimodal processing. Without a key, the app uses its demo engine.</p>
          <div className="card" style={{ marginBottom: '1rem' }}>Current status: {settings?.masked_key || 'Not configured'}</div>
          <form onSubmit={handleSaveKey}><div className="form-group"><label className="form-label" htmlFor="gemini-key-input">Gemini API Key</label>
            <input id="gemini-key-input" className="form-input" type="password" value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="Paste your key" required /></div>
            <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowKeyModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={savingKey || !newKey.trim()}>{savingKey ? 'Saving...' : 'Save & Activate'}</button>
            </div>
          </form>
        </div>
      </div>}
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(245,158,11,.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,.1)', fontSize: '.8rem', color: 'var(--text-muted)' }}>
        <Activity size={14} style={{ display: 'inline', marginRight: '.4rem', color: 'var(--primary)' }} />
        Powered by Gemini multimodal AI. Outputs are advisory; consult qualified engineering and safety professionals.
      </div>
    </div>
  );
}
