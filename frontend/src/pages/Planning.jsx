import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarDays, Send } from 'lucide-react';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import { planningAPI } from '../api/client';

export default function Planning() {
  const [form, setForm] = useState({ project_type: 'residential', size_sqft: 3000, budget_inr: 7500000, deadline_months: 18, workforce_count: 30, location: 'Indore, Madhya Pradesh', special_requirements: [], notes: '' });
  const [requirements, setRequirements] = useState('Earthquake code compliance, Vastu-compliant design');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setResult(null);
    try {
      const payload = { ...form, size_sqft: Number(form.size_sqft), budget_inr: Number(form.budget_inr), deadline_months: Number(form.deadline_months),
        workforce_count: Number(form.workforce_count), special_requirements: requirements.split(',').map(s=>s.trim()).filter(Boolean) };
      const res = await planningAPI.generate(payload); setResult(res.data); toast.success('Project plan generated');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return <div className="page-container fade-in">
    <div className="page-header"><h1 className="page-title">📅 Construction Project Planning</h1>
      <p className="page-subtitle">Generate an illustrative schedule, material estimates, labor allocation and risk register.</p></div>
    <div className="card"><div className="card-header"><div className="card-icon"><CalendarDays size={20}/></div>
      <div><div className="card-title">Project Inputs</div><div className="card-subtitle">Adjust the sample values for your project</div></div></div>
      <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={()=>{setForm(p=>({...p,project_type:'residential',size_sqft:3000,budget_inr:7500000,deadline_months:18,workforce_count:30,location:'Pune, Maharashtra'}));setRequirements('Earthquake zone III compliance, Vastu-compliant design')}}>Residential villa</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={()=>{setForm(p=>({...p,project_type:'commercial',size_sqft:12000,budget_inr:35000000,deadline_months:24,workforce_count:60,location:'Indore, Madhya Pradesh'}));setRequirements('Energy efficient design, Fire safety compliance')}}>Commercial building</button>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Project type</label><select className="form-input" value={form.project_type} onChange={e=>update('project_type',e.target.value)}><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="industrial">Industrial</option><option value="infrastructure">Infrastructure</option></select></div>
          <div className="form-group"><label className="form-label">Area (sq ft)</label><input className="form-input" type="number" min="1" value={form.size_sqft} onChange={e=>update('size_sqft',e.target.value)} required/></div>
          <div className="form-group"><label className="form-label">Budget (INR)</label><input className="form-input" type="number" min="1" value={form.budget_inr} onChange={e=>update('budget_inr',e.target.value)} required/></div>
          <div className="form-group"><label className="form-label">Deadline (months)</label><input className="form-input" type="number" min="1" value={form.deadline_months} onChange={e=>update('deadline_months',e.target.value)} required/></div>
          <div className="form-group"><label className="form-label">Workforce count</label><input className="form-input" type="number" min="1" value={form.workforce_count} onChange={e=>update('workforce_count',e.target.value)} required/></div>
          <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e=>update('location',e.target.value)}/></div>
        </div>
        <div className="form-group"><label className="form-label">Special requirements (comma-separated)</label><textarea className="form-textarea" value={requirements} onChange={e=>setRequirements(e.target.value)} rows={2}/></div>
        <div className="form-group"><label className="form-label">Additional notes</label><textarea className="form-textarea" value={form.notes} onChange={e=>update('notes',e.target.value)} rows={2}/></div>
        <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}><Send size={16}/>{loading?'Generating plan…':'Generate Project Plan'}</button>
      </form>
    </div>
    {loading && <Loader message="Generating schedule, costs and risk register…"/>}
    {result && <div className="result-section">
      <div className="card"><h2 className="card-title">Project Plan Summary</h2><p className="result-summary">{result.summary}</p>
        <div className="stats-grid"><div className="stat-card"><div className="stat-value">{result.total_duration_weeks}</div><div className="stat-label">Duration (weeks)</div></div>
          <div className="stat-card"><div className="stat-value">{result.phases.length}</div><div className="stat-label">Phases</div></div></div></div>
      <ResultCard title="Execution Phases" icon="🧱"><div style={{overflowX:'auto'}}><table className="data-table"><thead><tr><th>Phase</th><th>Start</th><th>End</th><th>Duration</th><th>Activities</th></tr></thead><tbody>{result.phases.map((p,i)=><tr key={i}><td>{p.phase_name}</td><td>{p.start_week}</td><td>{p.end_week}</td><td>{p.duration_weeks}</td><td>{p.key_activities?.join(', ')}</td></tr>)}</tbody></table></div></ResultCard>
      <div className="result-grid">
        <ResultCard title="Material Estimates" icon="🧰"><ul className="info-list">{result.material_estimates.map((m,i)=><li key={i}>{m.material}: {m.quantity} — ₹{Number(m.estimated_cost_inr||0).toLocaleString('en-IN')}</li>)}</ul></ResultCard>
        <ResultCard title="Labor Breakdown" icon="👷"><ul className="info-list">{result.labor_breakdown.map((m,i)=><li key={i}>{m.trade}: {m.count} workers, {m.duration_weeks} weeks — ₹{Number(m.cost_inr||0).toLocaleString('en-IN')}</li>)}</ul></ResultCard>
        <ResultCard title="Risk Register" icon="⚠️"><ul className="info-list">{result.risk_register.map((m,i)=><li key={i}><strong>{m.risk}</strong> ({m.probability}/{m.impact}) — {m.mitigation}</li>)}</ul></ResultCard>
        <ResultCard title="Budget Breakdown" icon="💰"><ul className="info-list">{result.budget_breakdown.map((m,i)=><li key={i}>{m.category}: ₹{Number(m.amount_inr||0).toLocaleString('en-IN')} ({m.percentage}%)</li>)}</ul></ResultCard>
      </div>
      <ResultCard title="Critical Path & Recommendations" icon="✅"><ul className="info-list">{result.critical_path.map((p,i)=><li key={i}>{p}</li>)}{result.recommendations.map((p,i)=><li key={'r'+i}>{p}</li>)}</ul></ResultCard>
      <p style={{fontSize:'.8rem',color:'var(--text-muted)',marginTop:'1rem'}}>Planning output is an initial estimate; a qualified project team must verify quantities, schedule and costs.</p>
    </div>}
  </div>;
}
