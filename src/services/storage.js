// Local Storage helpers: all application data stays in this browser.
export const KEYS = {
  users: "users", teams: "teams", tournaments: "tournaments",
  registrations: "registrations", results: "results", announcements: "announcements"
};

export function read(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}
export function uid() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export function seedData() {
  if (!localStorage.getItem(KEYS.tournaments)) {
    write(KEYS.tournaments, [
      {id:"t1",name:"Neon Showdown",game:"BGMI",date:"2026-12-12",prize:"₹50,000",fee:"₹100",description:"A high-intensity squad battle for the next champions.",rules:"1. Use registered players only. 2. No hacks or exploits. 3. Admin decisions are final.",status:"Upcoming",totalTeamSlots:25,roomId:"",roomPassword:""},
      {id:"t2",name:"Nightfall Clash",game:"Valorant",date:"2026-11-25",prize:"₹35,000",fee:"₹200",description:"Tactical 5v5 competition. Bring your best strategy.",rules:"1. Standard competitive rules. 2. No cheating. 3. Be respectful.",status:"Live",totalTeamSlots:20,roomId:"ARENA-4821",roomPassword:"NIGHT25"},
      {id:"t3",name:"Firestorm Cup",game:"Free Fire MAX",date:"2026-11-10",prize:"₹20,000",fee:"₹50",description:"A fast-paced battle royale tournament.",rules:"1. No teaming. 2. No exploits. 3. Results are final.",status:"Completed",totalTeamSlots:30,roomId:"",roomPassword:""}
    ]);
  }
  if (!localStorage.getItem(KEYS.results)) {
    write(KEYS.results, [{id:"r1",tournamentId:"t3",winner:"Team Phoenix",runnerUp:"Shadow Squad",summary:"Team Phoenix dominated the final rounds and secured the championship.",kills:28,prize:"₹12,000"}]);
  }
  if (!localStorage.getItem(KEYS.announcements)) {
    write(KEYS.announcements, [{id:"a1",title:"Welcome to GG Arena!",description:"Create your squad and register for upcoming tournaments. Good luck, players!",date:new Date().toISOString()}]);
  }
  for (const key of Object.values(KEYS)) if (!localStorage.getItem(key)) write(key, []);
}
