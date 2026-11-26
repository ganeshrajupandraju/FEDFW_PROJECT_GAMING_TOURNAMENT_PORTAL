import React from "react";
import { Link } from "react-router-dom";
import { Gamepad2, Search, Plus, Trash2, Pencil, Trophy, Users, CalendarDays, X } from "lucide-react";

export function Brand() { return <Link className="brand" to="/"><span className="brand-mark"><Gamepad2 size={21}/></span> GG<span>ARENA</span></Link>; }
export function Status({status}) { return <span className={`status ${status?.toLowerCase()}`}>{status}</span>; }
export function PageTitle({eyebrow,title,description,action}) { return <div className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="muted">{description}</p>}</div>{action}</div>; }
export function StatCard({label,value,icon:Icon,accent="blue"}) { return <div className={`stat-card ${accent}`}><div className="stat-icon"><Icon size={20}/></div><p>{label}</p><strong>{value}</strong></div>; }
export function Empty({title="Nothing here yet",description="New items will appear here when available."}) { return <div className="empty"><Trophy size={30}/><h3>{title}</h3><p>{description}</p></div>; }
export function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label>; }
export function Modal({title,onClose,children}) { return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>{children}</div></div>; }
export function Actions({onEdit,onDelete}) { return <div className="actions">{onEdit && <button className="icon-btn" onClick={onEdit} aria-label="Edit"><Pencil size={16}/></button>}{onDelete && <button className="icon-btn danger-text" onClick={onDelete} aria-label="Delete"><Trash2 size={16}/></button>}</div>; }
export { Search, Plus, Trophy, Users, CalendarDays };
