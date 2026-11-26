import React,{useMemo,useState} from "react";
import {Link,useParams} from "react-router-dom";
import {Trophy,Users,CalendarDays,Radio,Search,Plus,KeyRound,Medal,Megaphone} from "lucide-react";
import {useApp} from "../context/AppContext";
import {PageTitle,StatCard,Status,Empty,Field,Modal,Actions} from "../components/UI";

export function UserDashboard(){
 const {user,tournaments,teams,announcements,registrations}=useApp();
 const mine=teams.filter(t=>t.ownerId===user.id);
 const latest=[...announcements].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
 return <><PageTitle eyebrow="PLAYER OVERVIEW" title={`Welcome, ${user.name.split(" ")[0]} 👋`} description="Here's what's happening in your arena today."/>
 <div className="stats-grid"><StatCard label="Available tournaments" value={tournaments.length} icon={Trophy}/><StatCard label="Upcoming" value={tournaments.filter(t=>t.status==="Upcoming").length} icon={CalendarDays} accent="purple"/><StatCard label="Live now" value={tournaments.filter(t=>t.status==="Live").length} icon={Radio} accent="green"/><StatCard label="Completed" value={tournaments.filter(t=>t.status==="Completed").length} icon={Medal} accent="red"/></div>
 <div className="dashboard-grid"><section className="panel"><div className="section-head"><div><p className="eyebrow">COMPETE NOW</p><h2>Featured tournaments</h2></div><Link to="/user/tournaments" className="text-link">View all →</Link></div>
 {tournaments.slice(0,3).map(t=><Link to={`/user/tournaments/${t.id}`} className="mini-row" key={t.id}><div className="game-icon"><Trophy/></div><div className="grow"><strong>{t.name}</strong><small>{t.game} · {t.date}</small></div><Status status={t.status}/></Link>)}
 {tournaments.length===0&&<Empty/>}</section>
 <section className="panel"><div className="section-head"><div><p className="eyebrow">ARENA BULLETIN</p><h2>Latest announcements</h2></div><Link to="/user/announcements" className="text-link">All posts →</Link></div>
 {latest.map(a=><div className="announcement-mini" key={a.id}><span className="announce-dot"/><div><strong>{a.title}</strong><p>{a.description}</p><small>{new Date(a.date).toLocaleDateString()}</small></div></div>)}{latest.length===0&&<Empty title="No announcements"/>}</section></div>
 <div className="quick-row"><div><Users/><span><b>{user.playerUid||"Assigning UID"}</b><small>Your Player UID</small></span></div><div><Users/><span><b>{mine.length}</b><small>Your teams</small></span></div><div><Trophy/><span><b>{registrations.filter(r=>r.userId===user.id).length}</b><small>Registrations</small></span></div><Link to="/user/teams" className="btn btn-secondary">Manage your squad →</Link></div></>;
}
export function Teams(){
 const {user,users,teams,saveTeam,deleteTeam,notify}=useApp(); const [editing,setEditing]=useState(null); const [open,setOpen]=useState(false);
 const mine=teams.filter(t=>t.ownerId===user.id);
 const blank={name:"",captain:user.name, captainUid:user.playerUid, players:["","","",""], playerUids:["","","",""]};
 const [form,setForm]=useState(blank);
 function start(team){setForm(team?{...team,players:[...team.players],playerUids:team.playerUids||["","","",""]}:{...blank,captain:user.name,captainUid:user.playerUid});setEditing(team?.id||null);setOpen(true);}
 function submit(e){e.preventDefault();
   if(!form.name.trim()||form.playerUids.some(x=>!x.trim()))return notify("Enter a team name and all four teammate UIDs.");
   const ids=[user.playerUid,...form.playerUids.map(x=>x.trim().toUpperCase())];
   if(new Set(ids).size!==ids.length)return notify("Each team member must have a different UID.");
   const members=form.playerUids.map(x=>users.find(u=>(u.playerUid||"").toUpperCase()===x.trim().toUpperCase()));
   if(members.some(x=>!x))return notify("One or more teammate UIDs are invalid. Ask them to share their Player UID.");
   const playerNames=members.map(x=>x.name);
   saveTeam({...form,captain:user.name,captainUid:user.playerUid,players:playerNames,playerUids:form.playerUids.map(x=>x.trim().toUpperCase()),id:editing||undefined});
   setOpen(false);notify(editing?"Team updated.":"Team created.");}
 return <><PageTitle eyebrow="YOUR SQUAD" title="Team management" description="Build your lineup, manage your roster and get tournament-ready." action={<button className="btn btn-primary" onClick={()=>start(null)}><Plus size={17}/> Create team</button>}/>
 <div className="team-grid">{mine.map(t=><div className="team-card" key={t.id}><div className="team-card-top"><div className="team-emblem"><Users/></div><Actions onEdit={()=>start(t)} onDelete={()=>{deleteTeam(t.id);notify("Team deleted.");}}/></div><h2>{t.name}</h2><p className="muted">Captain: {t.captain} · UID: {t.captainUid||"—"}</p><div className="player-list">{t.players.map((p,i)=><span key={i}><i>{i+1}</i>{p}</span>)}</div></div>)}</div>
 {mine.length===0&&<Empty title="Your squad starts here" description="Create a team to register for tournaments."/>}
 {open&&<Modal title={editing?"Edit team":"Create your team"} onClose={()=>setOpen(false)}><form className="form-stack" onSubmit={submit}><Field label="Team name"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field><Field label="Captain name"><input value={user.name} readOnly/></Field><Field label="Your Player UID"><input value={user.playerUid||""} readOnly/></Field>{form.playerUids.map((uid,i)=><Field label={`Teammate ${i+1} UID`} key={i}><input required placeholder="e.g. GG12ABCD" value={uid} onChange={e=>setForm({...form,playerUids:form.playerUids.map((x,j)=>j===i?e.target.value:x)})}/></Field>)}<p className="muted tiny">Ask each teammate to share their Player UID from their dashboard. Only registered users can be added.</p><button className="btn btn-primary full">Save team</button></form></Modal>}</>;
}
export function Tournaments(){
 const {tournaments}=useApp(); const [q,setQ]=useState(""); const [filter,setFilter]=useState("All");
 const list=useMemo(()=>tournaments.filter(t=>(filter==="All"||t.status===filter)&&`${t.name} ${t.game}`.toLowerCase().includes(q.toLowerCase())),[tournaments,q,filter]);
 return <><PageTitle eyebrow="FIND YOUR NEXT MATCH" title="Tournaments" description="Discover competitions and register your squad."/>
 <div className="toolbar"><div className="searchbox"><Search size={17}/><input placeholder="Search tournaments or games..." value={q} onChange={e=>setQ(e.target.value)}/></div><div className="filter-tabs">{["All","Upcoming","Live","Completed"].map(s=><button key={s} className={filter===s?"selected":""} onClick={()=>setFilter(s)}>{s}</button>)}</div></div>
 <div className="tournament-grid">{list.map(t=><TournamentCard key={t.id} t={t}/>)}</div>{list.length===0&&<Empty title="No tournaments found" description="Try changing your search or filter."/>}</>;
}
function TournamentCard({t}){
 return <Link to={`/user/tournaments/${t.id}`} className="tournament-card"><div className={`tournament-art ${t.game.toLowerCase().replaceAll(" ","-")}`}><span className="art-tag">{t.game}</span><Trophy size={42}/><Status status={t.status}/></div><div className="tournament-info"><h3>{t.name}</h3><div className="tournament-meta"><span><CalendarDays size={14}/>{t.date}</span><span>🏆 {t.prize}</span><span>👥 {t.totalTeamSlots||25} slots</span></div><div className="card-bottom"><span className="muted">Entry: {t.fee||"Free"}</span><b>View details →</b></div></div></Link>;
}
export function TournamentDetails(){
 const {id}=useParams();const {user,tournaments,teams,registrations,registerTeam,notify}=useApp();const t=tournaments.find(x=>x.id===id);const [teamId,setTeamId]=useState("");
 if(!t)return <Empty title="Tournament not found"/>;
 const mine=teams.filter(x=>x.ownerId===user.id);const registered=registrations.filter(r=>r.tournamentId===id);
 const already=registrations.some(r=>r.tournamentId===id&&mine.some(m=>m.id===r.teamId));
 function submit(){if(!teamId)return notify("Select a team first.");try{registerTeam(id,teamId);notify("Team registered successfully!");}catch(e){notify(e.message);}}
 return <><Link to="/user/tournaments" className="back-link">← Back to tournaments</Link><div className="detail-hero"><div><p className="eyebrow">{t.game} TOURNAMENT</p><h1>{t.name}</h1><p>{t.description}</p><Status status={t.status}/></div><div className="prize-box"><small>PRIZE POOL</small><strong>{t.prize}</strong><span>Entry fee: {t.fee||"Free"}</span></div></div>
 <div className="detail-grid"><section className="panel"><h2>Tournament information</h2><div className="detail-facts"><div><small>DATE</small><b>{t.date}</b></div><div><small>GAME</small><b>{t.game}</b></div><div><small>STATUS</small><Status status={t.status}/></div><div><small>TEAM SLOTS</small><b>{registered.length} / {t.totalTeamSlots||25}</b></div></div><h3>Rules & regulations</h3><p className="preline muted">{t.rules||"Follow fair-play guidelines."}</p></section>
 <section className="panel register-panel"><h2>Register your team</h2><p className="muted tiny">{Math.max(0,(Number(t.totalTeamSlots)||25)-registered.length)} slots remaining</p>{t.status!=="Upcoming"?<p className="muted">Registration is closed for this tournament.</p>:already?<p className="success-text">✓ Your team is already registered.</p>:registered.length >= (Number(t.totalTeamSlots)||25)?<p className="muted">All team slots are full.</p>:mine.length===0?<p className="muted">Create a team before registering.</p>:<><Field label="Select team"><select value={teamId} onChange={e=>setTeamId(e.target.value)}><option value="">Choose your team</option>{mine.map(m=><option value={m.id} key={m.id}>{m.name}</option>)}</select></Field><button className="btn btn-primary full" onClick={submit}>Register team →</button></>}</section></div></>;
}
export function Credentials(){
 const {tournaments}=useApp();return <><PageTitle eyebrow="MATCH ACCESS" title="Tournament credentials" description="Room details are shown only for live tournaments."/><div className="stack-list">{tournaments.map(t=><div className="panel credential-row" key={t.id}><div><Status status={t.status}/><h3>{t.name}</h3><p className="muted">{t.game}</p></div>{t.status==="Live"?<div className="credential-values"><div><small>ROOM ID</small><b>{t.roomId||"Not provided"}</b></div><div><small>ROOM PASSWORD</small><b>{t.roomPassword||"Not provided"}</b></div></div>:<p className="muted">{t.status==="Upcoming"?"Room details will be available when the tournament starts.":"This tournament has ended."}</p>}</div>)}</div></>;
}
export function Results(){
 const {results,tournaments}=useApp();const done=results.filter(r=>tournaments.find(t=>t.id===r.tournamentId)?.status==="Completed");
 return <><PageTitle eyebrow="HALL OF FAME" title="Tournament results" description="Celebrating the squads that made history."/><div className="results-grid">{done.map(r=><div className="panel result-card" key={r.id}><div className="result-trophy"><Trophy/></div><p className="eyebrow">CHAMPIONSHIP RESULT</p><h2>{tournaments.find(t=>t.id===r.tournamentId)?.name||"Tournament"}</h2><div className="winner"><small>🥇 WINNER</small><strong>{r.winner}</strong></div><div className="runner"><small>🥈 RUNNER-UP</small><strong>{r.runnerUp}</strong></div><p className="muted">{r.summary}</p><div className="result-foot"><span>{r.kills} total kills</span><b>{r.prize}</b></div></div>)}</div>{done.length===0&&<Empty title="Results coming soon" description="Completed tournament results will appear here."/>}</>;
}
export function Announcements(){
 const {announcements}=useApp();return <><PageTitle eyebrow="ARENA BULLETIN" title="Announcements" description="The latest updates from tournament administrators."/><div className="announcement-list">{[...announcements].sort((a,b)=>new Date(b.date)-new Date(a.date)).map(a=><article className="panel announcement-card" key={a.id}><div className="announcement-icon"><Megaphone/></div><div><small>{new Date(a.date).toLocaleDateString()}</small><h2>{a.title}</h2><p>{a.description}</p></div></article>)}</div>{announcements.length===0&&<Empty title="No announcements yet"/>}</>;
}
