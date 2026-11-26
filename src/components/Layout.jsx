import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Users, Trophy, KeyRound, Medal, Megaphone, PlusCircle, ClipboardList } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Brand } from "./UI";

const userLinks = [
  ["/user","Dashboard",LayoutDashboard],["/user/teams","Create Team",Users],["/user/tournaments","Tournaments",Trophy],
  ["/user/credentials","Tournament Credentials",KeyRound],["/user/results","Results",Medal],["/user/announcements","Announcements",Megaphone]
];
const adminLinks = [
  ["/admin","Dashboard",LayoutDashboard],["/admin/tournaments/new","Create Tournament",PlusCircle],
  ["/admin/tournaments","Manage Tournaments",Trophy],["/admin/registrations","Manage Registrations",ClipboardList],
  ["/admin/credentials","Tournament Credentials",KeyRound],["/admin/results","Results Management",Medal],["/admin/announcements","Announcements",Megaphone]
];
export default function Layout({admin=false}) {
  const {user,logout} = useApp(); const [open,setOpen] = useState(false); const nav=useNavigate();
  const links=admin?adminLinks:userLinks;
  function signOut(){logout();nav("/");}
  return <div className="app-shell">
    <aside className={`sidebar ${open?"show":""}`}>
      <div className="side-brand"><Brand/><button className="icon-btn mobile-close" onClick={()=>setOpen(false)}><X/></button></div>
      <div className="profile"><div className="avatar">{(user?.name||"G").slice(0,1).toUpperCase()}</div><div><strong>{user?.name}</strong><small>{admin?"Administrator":"Player account"}</small></div></div>
      <p className="nav-label">MENU</p>
      <nav>{links.map(([to,label,Icon])=><NavLink end={to==="/user"||to==="/admin"} onClick={()=>setOpen(false)} className={({isActive})=>isActive?"nav-link active":"nav-link"} to={to} key={to}><Icon size={18}/>{label}</NavLink>)}</nav>
      <button className="nav-link logout" onClick={signOut}><LogOut size={18}/>Logout</button>
      <div className="sidebar-foot">GG ARENA <span>•</span> PLAY TO WIN</div>
    </aside>
    {open && <div className="scrim" onClick={()=>setOpen(false)}/>}
    <main className="main-area"><header className="topbar"><button className="icon-btn menu-toggle" onClick={()=>setOpen(true)}><Menu/></button><div className="topbar-right"><span className="online-dot"/> Arena is online <span className="topbar-avatar">{(user?.name||"G").slice(0,1).toUpperCase()}</span></div></header><div className="content"><Outlet/></div></main>
  </div>;
}
