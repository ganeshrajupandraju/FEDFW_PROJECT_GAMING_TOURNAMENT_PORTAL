import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, ShieldCheck, Zap, Trophy } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Field } from "../components/UI";

export default function Landing(){
  return <div className="landing"><div className="landing-nav"><Link className="brand" to="/"><span className="brand-mark"><Gamepad2/></span> GG<span>ARENA</span></Link><span className="pill">THE NEXT LEVEL STARTS HERE</span></div>
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="online-dot"/> YOUR ARENA. YOUR LEGACY.</p><h1>PLAY HARD.<br/><em>WIN BIG.</em></h1><p className="hero-desc">Compete in epic esports tournaments, build your squad, and claim your place among the legends.</p><div className="hero-points"><span><Trophy size={16}/> Competitive tournaments</span><span><ShieldCheck size={16}/> Fair play community</span><span><Zap size={16}/> Real-time updates</span></div></div>
    <div className="auth-choice"><div className="choice-glow"/><p className="eyebrow">ENTER THE ARENA</p><h2>Choose your portal</h2><p className="muted">Select how you want to continue.</p><Link className="choice-card" to="/login"><span className="choice-icon blue"><Gamepad2/></span><span><strong>Player Login</strong><small>Join tournaments and manage your squad</small></span><b>→</b></Link><Link className="choice-card" to="/admin-login"><span className="choice-icon purple"><ShieldCheck/></span><span><strong>Admin Login</strong><small>Manage events and tournament operations</small></span><b>→</b></Link><div className="choice-foot">New to GG Arena? <Link to="/register">Create an account</Link></div></div></section>
    <div className="landing-bottom"><span>© 2026 GG ARENA</span><span>BUILT FOR THE COMPETITIVE</span></div></div>;
}
function AuthCard({admin=false,register=false}){
  const {login,registerUser,notify}=useApp(); const nav=useNavigate();
  const [form,setForm]=useState({name:"",email:"",mobile:"",password:"",confirm:""});
  const [error,setError]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  function submit(e){e.preventDefault();setError("");
    try{
      if(register){
        if(Object.values(form).some(v=>!v.trim())) throw Error("Please complete all fields.");
        if(!/^\S+@\S+\.\S+$/.test(form.email)) throw Error("Enter a valid email address.");
        if(!/^\d{10}$/.test(form.mobile)) throw Error("Mobile number must contain 10 digits.");
        if(form.password.length<6) throw Error("Password must contain at least 6 characters.");
        if(form.password!==form.confirm) throw Error("Passwords do not match.");
        registerUser({name:form.name,email:form.email,mobile:form.mobile,password:form.password});notify("Account created successfully!");nav("/user");
      }else{
        if(!form.email.trim()||!form.password) throw Error("Enter your login details.");
        login(form.email,form.password,admin?"admin":"user");notify("Welcome to GG Arena!");nav(admin?"/admin":"/user");
      }
    }catch(err){setError(err.message);}
  }
  return <div className="auth-page"><Link className="brand auth-brand" to="/"><span className="brand-mark"><Gamepad2/></span> GG<span>ARENA</span></Link><div className="auth-panel"><p className="eyebrow">{admin?"CONTROL CENTER":register?"PLAYER REGISTRATION":"PLAYER PORTAL"}</p><h1>{admin?"Admin access":register?"Create your account":"Welcome back"}</h1><p className="muted">{admin?"Sign in to manage the arena.":register?"Build your profile and get tournament-ready.":"Sign in and get back in the game."}</p>
    <form onSubmit={submit} className="form-stack">
      {register&&<Field label="Full name"><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your full name"/></Field>}
      <Field label={admin?"Username":"Email address"}><input value={form.email} onChange={e=>set("email",e.target.value)} placeholder={admin?"admin":"you@example.com"}/></Field>
      {register&&<Field label="Mobile number"><input value={form.mobile} onChange={e=>set("mobile",e.target.value)} inputMode="numeric" placeholder="10-digit mobile number"/></Field>}
      <Field label="Password"><input type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Enter password"/></Field>
      {register&&<Field label="Confirm password"><input type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="Re-enter password"/></Field>}
      {error&&<p className="form-error">{error}</p>}<button className="btn btn-primary full">{register?"Create account": "Sign in"} <span>→</span></button>
    </form>
    {admin&&<div className="demo-note">Demo credentials: <b>admin</b> / <b>admin123</b></div>}
    <p className="auth-switch">{register?"Already have an account?": "Don't have an account?"} <Link to={register?"/login":"/register"}>{register?"Sign in":"Register"}</Link></p>
    <Link className="back-link" to="/">← Back to home</Link></div></div>;
}
export const Login=()=> <AuthCard/>;
export const AdminLogin=()=> <AuthCard admin/>;
export const Register=()=> <AuthCard register/>;
