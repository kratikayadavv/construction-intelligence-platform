import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Home, Send } from 'lucide-react';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import { valuationAPI } from '../api/client';

export default function Valuation() {
  const [form,setForm]=useState({location:'Indore, Madhya Pradesh',area_sqft:1200,property_type:'apartment',age_years:5,bedrooms:2,bathrooms:2,amenities:['Parking','Gym'],condition:'GOOD',floor_number:3,total_floors:8,notes:''});
  const [loading,setLoading]=useState(false); const [result,setResult]=useState(null);
  const update=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async e=>{e.preventDefault();setLoading(true);setResult(null);try{const r=await valuationAPI.estimate({...form,area_sqft:Number(form.area_sqft),age_years:Number(form.age_years),bedrooms:Number(form.bedrooms),bathrooms:Number(form.bathrooms),floor_number:form.floor_number?Number(form.floor_number):null,total_floors:form.total_floors?Number(form.total_floors):null});setResult(r.data);toast.success('Valuation estimate generated');}catch(err){toast.error(err.message)}finally{setLoading(false)}};
  return <div className="page-container fade-in"><div className="page-header"><h1 className="page-title">🏠 Real Estate Valuation</h1><p className="page-subtitle">Illustrative market-value estimates in INR. Not a professional or legal appraisal.</p></div>
    <div className="card"><div className="card-header"><div className="card-icon"><Home size={20}/></div><div><div className="card-title">Property Details</div><div className="card-subtitle">Provide details to create an estimate</div></div></div>
    <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginBottom:'1rem'}}><button className="btn btn-secondary btn-sm" type="button" onClick={()=>setForm(p=>({...p,location:'Bandra West, Mumbai',area_sqft:1200,property_type:'apartment',age_years:8,bedrooms:2,bathrooms:2,condition:'GOOD'}))}>Bandra 2BHK</button><button className="btn btn-secondary btn-sm" type="button" onClick={()=>setForm(p=>({...p,location:'Whitefield, Bengaluru',area_sqft:2400,property_type:'villa',age_years:3,bedrooms:3,bathrooms:3,condition:'EXCELLENT'}))}>Whitefield Villa</button></div>
    <form onSubmit={submit}><div className="form-grid">
    <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e=>update('location',e.target.value)} required/></div>
    <div className="form-group"><label className="form-label">Property type</label><select className="form-input" value={form.property_type} onChange={e=>update('property_type',e.target.value)}><option value="apartment">Apartment</option><option value="villa">Villa</option><option value="plot">Plot</option><option value="commercial">Commercial</option><option value="warehouse">Warehouse</option></select></div>
    <div className="form-group"><label className="form-label">Area (sq ft)</label><input className="form-input" type="number" min="1" value={form.area_sqft} onChange={e=>update('area_sqft',e.target.value)} required/></div>
    <div className="form-group"><label className="form-label">Age (years)</label><input className="form-input" type="number" min="0" value={form.age_years} onChange={e=>update('age_years',e.target.value)} required/></div>
    <div className="form-group"><label className="form-label">Bedrooms</label><input className="form-input" type="number" min="0" value={form.bedrooms} onChange={e=>update('bedrooms',e.target.value)}/></div>
    <div className="form-group"><label className="form-label">Bathrooms</label><input className="form-input" type="number" min="0" value={form.bathrooms} onChange={e=>update('bathrooms',e.target.value)}/></div>
    <div className="form-group"><label className="form-label">Condition</label><select className="form-input" value={form.condition} onChange={e=>update('condition',e.target.value)}><option>POOR</option><option>FAIR</option><option>GOOD</option><option>EXCELLENT</option></select></div>
    <div className="form-group"><label className="form-label">Amenities (comma-separated)</label><input className="form-input" value={form.amenities.join(', ')} onChange={e=>update('amenities',e.target.value.split(',').map(x=>x.trim()).filter(Boolean))}/></div>
    </div><div className="form-group"><label className="form-label">Additional notes</label><textarea className="form-textarea" value={form.notes} onChange={e=>update('notes',e.target.value)} rows={2}/></div>
    <button className="btn btn-primary btn-full btn-lg" disabled={loading}><Send size={16}/>{loading?'Estimating…':'Estimate Market Valuation'}</button></form></div>
    {loading&&<Loader message="Preparing an illustrative valuation…"/>}
    {result&&<div className="result-section"><div className="card"><div className="card-title">Estimated Market Value Range</div><div style={{fontSize:'2rem',fontWeight:800,color:'var(--primary)',margin:'1rem 0'}}>₹{Number(result.min_price_inr).toLocaleString('en-IN')} – ₹{Number(result.max_price_inr).toLocaleString('en-IN')}</div><p>{result.summary}</p><p>Rate: ₹{Number(result.per_sqft_rate_inr).toLocaleString('en-IN')} / sq ft · Confidence: {result.confidence}</p></div><div className="result-grid">
    <ResultCard title="Positive Value Drivers" icon="📈"><ul className="info-list">{result.key_value_drivers.map((x,i)=><li key={i}>{x}</li>)}</ul></ResultCard>
    <ResultCard title="Negative Factors" icon="⚠️"><ul className="info-list">{result.negative_factors.map((x,i)=><li key={i}>{x}</li>)}</ul></ResultCard>
    <ResultCard title="Comparable Properties" icon="🏘️"><ul className="info-list">{result.comparable_properties.map((x,i)=><li key={i}>{x}</li>)}</ul></ResultCard>
    <ResultCard title="Assumptions" icon="📝"><ul className="info-list">{result.assumptions.map((x,i)=><li key={i}>{x}</li>)}</ul></ResultCard></div><p style={{fontSize:'.8rem',color:'var(--text-muted)',marginTop:'1rem'}}>Verify against current transactions, legal records and a qualified valuer before making financial decisions.</p></div>}
  </div>;
}
