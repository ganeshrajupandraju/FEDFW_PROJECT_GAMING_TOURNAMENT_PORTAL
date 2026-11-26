import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { KEYS, read, write, seedData, uid } from "../services/storage";

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => read("session", null));
  const [users, setUsers] = useState(() => read(KEYS.users));
  const [teams, setTeams] = useState(() => read(KEYS.teams));
  const [tournaments, setTournaments] = useState(() => read(KEYS.tournaments));
  const [registrations, setRegistrations] = useState(() => read(KEYS.registrations));
  const [results, setResults] = useState(() => read(KEYS.results));
  const [announcements, setAnnouncements] = useState(() => read(KEYS.announcements));
  const [toast, setToast] = useState("");

  useEffect(() => {
    seedData();
    const existingUsers = read(KEYS.users).map(u => u.playerUid ? u : {...u, playerUid: `GG${Math.random().toString(36).slice(2,8).toUpperCase()}`});
    write(KEYS.users, existingUsers);
    const savedSession = read("session", null);
    if (savedSession?.role === "user") {
      const refreshed = existingUsers.find(u => u.id === savedSession.id) || savedSession;
      write("session", refreshed); setUser(refreshed);
    }
    setUsers(existingUsers); setTeams(read(KEYS.teams));
    setTournaments(read(KEYS.tournaments)); setRegistrations(read(KEYS.registrations));
    setResults(read(KEYS.results)); setAnnouncements(read(KEYS.announcements));
  }, []);
  useEffect(() => { if (toast) { const id = setTimeout(() => setToast(""), 2800); return () => clearTimeout(id); } }, [toast]);

  const save = (key, value, setter) => { write(key, value); setter(value); };
  const notify = (message) => setToast(message);

  function registerUser(data) {
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) throw Error("An account with this email already exists.");
    const next = [...users, {...data, id:uid(), playerUid:`GG${Math.random().toString(36).slice(2,8).toUpperCase()}`, role:"user"}];
    save(KEYS.users, next, setUsers);
    setUser(next[next.length - 1]); write("session", next[next.length - 1]);
  }
  function login(email, password, role) {
    if (role === "admin") {
      if (email === "admin" && password === "admin123") {
        const admin = {id:"admin",name:"Administrator",role:"admin"};
        setUser(admin); write("session", admin); return;
      }
      throw Error("Invalid admin username or password.");
    }
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw Error("Invalid email or password.");
    setUser(found); write("session", found);
  }
  function logout() { setUser(null); localStorage.removeItem("session"); }
  function updateList(key, setter, list) { save(key, list, setter); }
  function upsert(key, setter, list, item) {
    const next = list.some(x => x.id === item.id) ? list.map(x => x.id === item.id ? item : x) : [...list, {...item,id:item.id || uid()}];
    updateList(key, setter, next);
  }
  function remove(key, setter, list, id) { updateList(key, setter, list.filter(x => x.id !== id)); }

  const value = useMemo(() => ({
    user, users, teams, tournaments, registrations, results, announcements, toast, notify,
    registerUser, login, logout,
    saveTeam: item => upsert(KEYS.teams,setTeams,teams,{...item,ownerId:user?.id}),
    deleteTeam: id => remove(KEYS.teams,setTeams,teams,id),
    saveTournament: item => upsert(KEYS.tournaments,setTournaments,tournaments,item),
    deleteTournament: id => { remove(KEYS.tournaments,setTournaments,tournaments,id); updateList(KEYS.registrations,setRegistrations,registrations.filter(r=>r.tournamentId!==id)); updateList(KEYS.results,setResults,results.filter(r=>r.tournamentId!==id)); },
    updateTournament: item => save(KEYS.tournaments,tournaments.map(t=>t.id===item.id?item:t),setTournaments),
    registerTeam: (tournamentId, teamId) => {
      const tournament = tournaments.find(t => t.id === tournamentId);
      if (!tournament) throw Error("Tournament not found.");
      if (tournament.status !== "Upcoming") throw Error("Registration is closed.");
      if (registrations.some(r=>r.tournamentId===tournamentId && r.teamId===teamId)) throw Error("This team is already registered.");
      const capacity = Number(tournament.totalTeamSlots) || 0;
      const currentCount = registrations.filter(r=>r.tournamentId===tournamentId).length;
      if (capacity > 0 && currentCount >= capacity) throw Error("All team slots are full.");
      updateList(KEYS.registrations,setRegistrations,[...registrations,{id:uid(),tournamentId,teamId,userId:user.id,date:new Date().toISOString()}]);
    },
    deleteRegistration: id => remove(KEYS.registrations,setRegistrations,registrations,id),
    saveResult: item => upsert(KEYS.results,setResults,results,item),
    deleteResult: id => remove(KEYS.results,setResults,results,id),
    saveAnnouncement: item => upsert(KEYS.announcements,setAnnouncements,announcements,item),
    deleteAnnouncement: id => remove(KEYS.announcements,setAnnouncements,announcements,id)
  }), [user,users,teams,tournaments,registrations,results,announcements,toast]);
  return <AppContext.Provider value={value}>{children}{toast && <div className="toast">{toast}</div>}</AppContext.Provider>;
}
