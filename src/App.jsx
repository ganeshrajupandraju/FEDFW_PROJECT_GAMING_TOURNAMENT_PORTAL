import React from "react";
import {Routes,Route,Navigate} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Landing,{Login,AdminLogin,Register} from "./pages/Auth";
import {UserDashboard,Teams,Tournaments,TournamentDetails,Credentials,Results,Announcements} from "./pages/User";
import {AdminDashboard,TournamentForm,ManageTournaments,ManageRegistrations,ManageCredentials,ManageResults,ManageAnnouncements} from "./pages/Admin";
import {useApp} from "./context/AppContext";

function HomeRedirect(){const {user}=useApp();return <Navigate to={user?(user.role==="admin"?"/admin":"/user"):"/"} replace/>;}
function NotFound(){return <div className="not-found"><h1>404</h1><h2>Looks like you left the arena.</h2><a className="btn btn-primary" href="/">Return home</a></div>;}
export default function App(){return <Routes>
 <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/admin-login" element={<AdminLogin/>}/><Route path="/register" element={<Register/>}/>
 <Route element={<ProtectedRoute role="user"/>}><Route path="/user" element={<Layout/>}><Route index element={<UserDashboard/>}/><Route path="teams" element={<Teams/>}/><Route path="tournaments" element={<Tournaments/>}/><Route path="tournaments/:id" element={<TournamentDetails/>}/><Route path="credentials" element={<Credentials/>}/><Route path="results" element={<Results/>}/><Route path="announcements" element={<Announcements/>}/></Route></Route>
 <Route element={<ProtectedRoute role="admin"/>}><Route path="/admin" element={<Layout admin/>}><Route index element={<AdminDashboard/>}/><Route path="tournaments/new" element={<TournamentForm/>}/><Route path="tournaments" element={<ManageTournaments/>}/><Route path="registrations" element={<ManageRegistrations/>}/><Route path="credentials" element={<ManageCredentials/>}/><Route path="results" element={<ManageResults/>}/><Route path="announcements" element={<ManageAnnouncements/>}/></Route></Route>
 <Route path="/redirect" element={<HomeRedirect/>}/><Route path="*" element={<NotFound/>}/>
 </Routes>}
