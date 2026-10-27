import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { History as HistoryIcon, RefreshCw, Trash2 } from 'lucide-react';
import { historyAPI } from '../api/client';

export default function HistoryPage() {
 const [items,setItems]=useState([]); const [loading,setLoading]=useState(false); const [filter,setFilter]=useState('');
 const load=async()=>{setLoading(true);try{const r=await historyAPI.get(null,200);setItems(r.data)}catch(e){toast.error(e.message)}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 const clear=async()=>{if(!window.confirm('Delete all analysis history?'))return;try{await historyAPI.clearAll();toast.success('History cleared');load()}catch(e){toast.error(e.message)}};
 const remove=async id=>{try{await historyAPI.delete(id);setItems(p=>p.filter(x=>x.id!==id));toast.success('Record deleted')}catch(e){toast.error(e.message)}};
 const filtered=items.filter(x=>(x.module+' '+x.input_summary).toLowerCase().includes(filter.toLowerCase()));
 return <div className="page-container fade-in"><div className="page-header"><h1 className="page-title">🗂️ Analysis History</h1><p className="page-subtitle">Review prior analyses recorded in this backend database.</p></div>
  <div className="card"><div className="card-header"><div className="card-icon"><HistoryIcon size={20}/></div><div className="card-title">Saved analyses ({filtered.length})</div><div style={{marginLeft:'auto',display:'flex',gap:'.5rem'}}><button className="btn btn-secondary btn-sm" onClick={load} disabled={loading}><RefreshCw size={14}/>Refresh</button><button className="btn btn-secondary btn-sm" onClick={clear}><Trash2 size={14}/>Clear all</button></div></div>
  <div className="form-group"><input className="form-input" placeholder="Search module or context…" value={filter} onChange={e=>setFilter(e.target.value)}/></div>
  {loading?<p>Loading history…</p>:filtered.length===0?<p style={{color:'var(--text-muted)'}}>No analyses found.</p>:<div style={{overflowX:'auto'}}><table className="data-table"><thead><tr><th>Module</th><th>Input</th><th>Created</th><th/></tr></thead><tbody>{filtered.map(x=><tr key={x.id}><td>{x.module.replaceAll('_',' ')}</td><td>{x.input_summary}</td><td>{x.created_at?new Date(x.created_at).toLocaleString():''}</td><td><button className="btn btn-secondary btn-sm" onClick={()=>remove(x.id)} title="Delete"><Trash2 size={13}/></button></td></tr>)}</tbody></table></div>}</div>
 </div>;
}
