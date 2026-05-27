import { useState, useRef, useEffect } from "react";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── EMAILJS CONFIG ────────────────────────────────────────────────────────────
// Sustituye estos valores con los de tu cuenta en https://www.emailjs.com (gratuita)
const EMAILJS_SERVICE_ID  = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "TU_PUBLIC_KEY";
const EMAILS = {
  admin:  "almagro46@labser.es",
  junta:  "pilarmatji@email.com",
  junta2: "ulpianogonzalez@email.com",
};

async function sendEmail(params) {
  if (EMAILJS_SERVICE_ID === "TU_SERVICE_ID") {
    console.log("📧 [DEMO] Email:", params); return { demo: true };
  }
  if (!window.emailjs) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
  return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
}

// ── DATOS ─────────────────────────────────────────────────────────────────────
const VECINOS = [
  { id:"admin",  nombre:"Administración Labser",             piso:"Admin",   rol:"admin",  pin:"0000", garaje:[], trastero:[], email:EMAILS.admin },
  { id:"junta",  nombre:"Pilar Matji (Presidenta)",          piso:"2ºA",     rol:"junta",  pin:"2001", garaje:["G-7","G-8"], trastero:["T-7"], email:EMAILS.junta },
  { id:"junta2", nombre:"Ulpiano González Ortigosa (Vicepresidente)", piso:"3ºB", rol:"junta",  pin:"9999", garaje:["G-13","G-14"], trastero:["T-10"], email:EMAILS.junta2 },
  { id:"la",  nombre:"Lovelus Príncipe SL",           piso:"Local A", rol:"vecino", pin:"0001", garaje:[], trastero:[], local:true },
  { id:"lb",  nombre:"Lovelus Príncipe SL",           piso:"Local B", rol:"vecino", pin:"0002", garaje:[], trastero:[], local:true },
  { id:"lc",  nombre:"Mª Luisa Aparicio (Farmacia)",  piso:"Local C", rol:"vecino", pin:"0003", garaje:[], trastero:[], local:true },
  { id:"ld",  nombre:"Lovelus Príncipe SL",           piso:"Local D", rol:"vecino", pin:"0004", garaje:[], trastero:[], local:true },
  { id:"v1a", nombre:"Ibercaja",                      piso:"1ºA",     rol:"vecino", pin:"1001", garaje:["G-1","G-2"], trastero:["T-1"] },
  { id:"v1b", nombre:"Ibercaja",                      piso:"1ºB",     rol:"vecino", pin:"1002", garaje:["G-3","G-4"], trastero:["T-2"] },
  { id:"v2b", nombre:"Pilar Perote Mendizábal",       piso:"2ºB",     rol:"vecino", pin:"2002", garaje:["G-9","G-10"], trastero:["T-8"] },
  { id:"v3a", nombre:"Ricardo Iglesias Baciana",      piso:"3ºA",     rol:"vecino", pin:"3001", garaje:["G-11","G-12"], trastero:["T-9"] },
  { id:"v3b", nombre:"Rentur SLU",                    piso:"3ºB",     rol:"vecino", pin:"3002", garaje:["G-13","G-14"], trastero:["T-10"] },
  { id:"v4a", nombre:"Feral Iberia SA",               piso:"4ºA",     rol:"vecino", pin:"4001", garaje:["G-15","G-16"], trastero:["T-11"] },
  { id:"v4b", nombre:"Propietario",                   piso:"4ºB",     rol:"vecino", pin:"4002", garaje:["G-17","G-18"], trastero:["T-12"] },
  { id:"v5a", nombre:"José Mª Pérez de Guzmán",      piso:"5ºA",     rol:"vecino", pin:"5001", garaje:["G-19","G-20"], trastero:["T-13"] },
  { id:"v5b", nombre:"Juan Aznar de la Haza",         piso:"5ºB",     rol:"vecino", pin:"5002", garaje:["G-21","G-22"], trastero:["T-14"] },
  { id:"v6a", nombre:"Imo Luis Garrido / Túplet SL",  piso:"6ºA",    rol:"vecino", pin:"6001", garaje:["G-23","G-24"], trastero:["T-15"] },
  { id:"v6b", nombre:"Agropecuaria Aldealgordo SL",   piso:"6ºB",    rol:"vecino", pin:"6002", garaje:["G-25","G-26"], trastero:["T-16"] },
  { id:"v7a", nombre:"Ignacio de la Colina",          piso:"7ºA",     rol:"vecino", pin:"7001", garaje:["G-27","G-28"], trastero:["T-17"] },
  { id:"v7b", nombre:"Olga Corpas",                   piso:"7ºB",     rol:"vecino", pin:"7002", garaje:["G-29","G-30"], trastero:["T-18"] },
];

// ── INQUILINOS ────────────────────────────────────────────────────────────────
// Registrados manualmente por la administración
const INQUILINOS_INIT = [
  // Ejemplo: { id:"i1", nombre:"Inquilino Ejemplo", piso:"3ºA", propietarioId:"v3a", pin:"3101", email:"inquilino@email.com", garaje:[], trastero:[], activo:true },
];


const CATEGORIAS = [
  { id:"averia",        label:"Avería",        icon:"⚡", color:"#c0392b" },
  { id:"mantenimiento", label:"Mantenimiento", icon:"🔧", color:"#e67e22" },
  { id:"limpieza",      label:"Limpieza",      icon:"🧹", color:"#27ae60" },
  { id:"seguridad",     label:"Seguridad",     icon:"🔒", color:"#8e44ad" },
  { id:"obras",         label:"Obras/Ruidos",  icon:"🏗️", color:"#2980b9" },
  { id:"sugerencia",    label:"Sugerencia",    icon:"💡", color:"#f39c12" },
  { id:"comunicado",    label:"Comunicado",    icon:"📢", color:"#1a5c3a" },
  { id:"otro",          label:"Otro",          icon:"💬", color:"#7f8c8d" },
];

const ZONAS_GRUPOS = [
  { grupo:"🚪 Accesos", zonas:["Hall de entrada principal","Puerta principal de entrada","Puerta garaje","Portero automático / videoportero"] },
  { grupo:"🪜 Escaleras — tramos", zonas:["Escalera — tramo Baja/1ª","Escalera — tramo 1ª/2ª","Escalera — tramo 2ª/3ª","Escalera — tramo 3ª/4ª","Escalera — tramo 4ª/5ª","Escalera — tramo 5ª/6ª","Escalera — tramo 6ª/7ª","Escalera — tramo 7ª/Azotea"] },
  { grupo:"🪜 Rellanos", zonas:["Rellano planta baja","Rellano 1ª planta","Rellano 2ª planta","Rellano 3ª planta","Rellano 4ª planta","Rellano 5ª planta","Rellano 6ª planta","Rellano 7ª planta"] },
  { grupo:"🛗 Ascensores", zonas:["Ascensor principal derecho","Ascensor principal izquierdo","Ascensor de servicio / montacargas","Cuarto de ascensores"] },
  { grupo:"🅿️ Garaje", zonas:["Garaje — planta -1 (acceso / rampa)","Garaje — planta -1 (aparcamiento)","Garaje — planta -2 (aparcamiento)","Garaje — puerta basculante","Garaje — techo / falso techo rampa","Garaje — iluminación general","Garaje — cuarto técnico"] },
  { grupo:"📦 Trasteros", zonas:["Trasteros — planta -1","Trasteros — planta -2","Pasillo trasteros","Puerta acceso trasteros"] },
  { grupo:"⚙️ Instalaciones", zonas:["Cuarto de caldera","Cuarto de grupos de presión / bombas","Cuarto de contadores (luz)","Cuarto de contadores (agua)","Cuarto basuras","Cuarto conserjes (sótano -1)","Almacén comunidad (sótano -2)","Sistema contra incendios"] },
  { grupo:"🏢 Fachada y exterior", zonas:["Fachada principal (calle Almagro)","Fachada lateral","Patio interior","Patio trasero","Azotea / cubierta","Terrazas comunitarias"] },
  { grupo:"🏠 Otros", zonas:["Vivienda del portero (cubierta)","Zona común general","Mi vivienda / local"] },
];
const ZONAS = ZONAS_GRUPOS.flatMap(g => g.zonas);

const ESTADOS = {
  pendiente:  { label:"Pendiente",  color:"#c0392b", bg:"#fdecea" },
  "en-curso": { label:"En curso",   color:"#e67e22", bg:"#fef5e7" },
  resuelto:   { label:"Resuelto",   color:"#27ae60", bg:"#e9f7ef" },
};

const AVISOS_INIT = [
  { id:1, titulo:"Goteras rellano 6ª planta", categoria:"averia", zona:"Rellano 6ª planta", descripcion:"Agua filtrando por el techo del rellano de la 6ª planta.", estado:"en-curso", autorId:"v6a", autorNombre:"Imo Luis Garrido", autorPiso:"6ºA", fecha:"2026-05-20T10:30:00", comentarios:[{autor:"Administración Labser",texto:"Revisado. Empresa de impermeabilización esta semana.",fecha:"2026-05-21T09:00:00"}], seguro:false, nParte:"", resueltoBy:"", foto:null },
  { id:2, titulo:"Luz fundida escalera tramo 3ª/4ª", categoria:"mantenimiento", zona:"Escalera — tramo 3ª/4ª", descripcion:"Tres focos del tramo entre la 3ª y 4ª planta llevan apagados desde el jueves.", estado:"pendiente", autorId:"v3a", autorNombre:"Ricardo Iglesias", autorPiso:"3ºA", fecha:"2026-05-22T18:15:00", comentarios:[], seguro:false, nParte:"", resueltoBy:"", foto:null },
  { id:3, titulo:"Planta fachada — riesgo desprendimiento", categoria:"seguridad", zona:"Fachada principal (calle Almagro)", descripcion:"La planta ha crecido desplazando placas de granito. Riesgo real de caída a la calle.", estado:"pendiente", autorId:"junta", autorNombre:"Pilar Matji", autorPiso:"2ºA", fecha:"2026-05-24T12:00:00", comentarios:[], seguro:false, nParte:"", resueltoBy:"", foto:null },
  { id:4, titulo:"Pladur rampa garaje deteriorado", categoria:"averia", zona:"Garaje — techo / falso techo rampa", descripcion:"El falso techo de pladur sobre la rampa está podrido. Requiere sustitución urgente.", estado:"pendiente", autorId:"junta", autorNombre:"Pilar Matji", autorPiso:"2ºA", fecha:"2026-05-23T10:00:00", comentarios:[], seguro:false, nParte:"", resueltoBy:"", foto:null },
  { id:5, titulo:"Tubería letra A — siniestro AXA", categoria:"averia", zona:"Garaje — planta -1 (acceso / rampa)", descripcion:"Rotura tubería letra A. Cubierta por seguro. Abono AXA: 1.122€.", estado:"resuelto", autorId:"admin", autorNombre:"Administración Labser", autorPiso:"Admin", fecha:"2026-03-10T09:00:00", comentarios:[{autor:"Administración Labser",texto:"Parte AXA tramitado. Reparación completada por Instalaciones Auxiliares.",fecha:"2026-03-15T11:00:00"}], seguro:true, nParte:"AXA-2026-00341", resueltoBy:"Instalaciones Auxiliares SL", foto:null },
];

const ENCARGOS_INIT = [
  { id:1, tipo:"compra", titulo:"Bombillas LED escaleras", descripcion:"40 bombillas LED 9W para sustitución tramos 2º-7º. Marca: INFRILUX.", estado:"completado", prioridad:"media", proveedor:"Infrilux", importe:"198,44 €", fechaCreacion:"2026-04-10T10:00:00", fechaCierre:"2026-04-18T12:00:00", creadoPor:"Administración Labser" },
  { id:2, tipo:"presupuesto", titulo:"Proyecto ventilación forzada garaje", descripcion:"Anteproyecto desclasificación garaje. Sistema extracción forzada sótanos -1 y -2.", estado:"pendiente", prioridad:"alta", proveedor:"Lasser", importe:"37.117,15 €", fechaCreacion:"2026-05-01T09:00:00", fechaCierre:"", creadoPor:"Pilar Matji (Presidenta)" },
  { id:3, tipo:"orden", titulo:"Reparación sala caldera y bombas", descripcion:"Arreglo bombas, independización circuito grupo presión, cambio desconector.", estado:"completado", prioridad:"alta", proveedor:"Aquapress / Intersat / Ullastres", importe:"3.798,47 €", fechaCreacion:"2026-03-20T08:00:00", fechaCierre:"2026-04-02T16:00:00", creadoPor:"Administración Labser" },
  { id:4, tipo:"compra", titulo:"Material limpieza conserjes", descripcion:"Stock trimestral productos limpieza para Bluetietar.", estado:"pendiente", prioridad:"baja", proveedor:"Por definir", importe:"~150 €", fechaCreacion:"2026-05-20T10:00:00", fechaCierre:"", creadoPor:"Administración Labser" },
];

const CONTRATOS = [
  { id:1, tipo:"Seguro",         nombre:"Seguro Comunidad AXA",             proveedor:"AXA Seguros",         contacto:"900 123 456",  email:"siniestros@axa.es",      importe:"4.305,40 €/año",    vencimiento:"2026-10-09", estado:"vigente",  doc:"https://onedrive.live.com", notas:"Incluye vivienda portería. Revisable en octubre." },
  { id:2, tipo:"Ascensores",     nombre:"Mantenimiento Ascensores FAIN",    proveedor:"FAIN Ascensores SA",  contacto:"91 234 56 78", email:"mto@fain.es",             importe:"3.845,80 €/año",    vencimiento:"2028-11-01", estado:"vigente",  doc:"https://onedrive.live.com", notas:"Próxima ITA noviembre 2028." },
  { id:3, tipo:"Puerta garaje",  nombre:"Mantenimiento Puerta Garaje",      proveedor:"FAIN Puertas",        contacto:"91 345 67 89", email:"garaje@fain.es",          importe:"435,60 €/año",      vencimiento:"2027-03-01", estado:"vigente",  doc:"https://onedrive.live.com", notas:"Aluna adquirida por FAIN en 2026." },
  { id:4, tipo:"Caldera",        nombre:"Gasconfort Transformación Naturgy",proveedor:"Naturgy / GNS",       contacto:"900 402 020",  email:"gasconfort@naturgy.com",  importe:"974,61 €/mes",      vencimiento:"2027-06-16", estado:"vigente",  doc:"https://onedrive.live.com", notas:"120 cuotas. Quedan 19 en abril 2026." },
  { id:5, tipo:"Conserjería",    nombre:"Conserjería y Limpieza Bluetietar",proveedor:"Bluetietar SL",       contacto:"91 456 78 90", email:"info@bluetietar.es",      importe:"7.151,10 €/mes",    vencimiento:"2026-04-14", estado:"revisar",  doc:"https://onedrive.live.com", notas:"Renovación pendiente de negociar." },
  { id:6, tipo:"Incendios",      nombre:"Mant. Sistema Incendios Chubb",    proveedor:"Chubb Iberia SA",     contacto:"91 567 89 01", email:"chubb@chubb.es",          importe:"741,14 €/año",      vencimiento:"2026-12-31", estado:"vigente",  doc:"https://onedrive.live.com", notas:"Ahorro 55% vs ejercicio anterior." },
  { id:7, tipo:"Administración", nombre:"Administración Fincas Labser",     proveedor:"Labser",              contacto:"91 890 12 34", email:"almagro46@labser.es",     importe:"5.560,51 €/año",    vencimiento:"2027-01-01", estado:"vigente",  doc:"https://onedrive.live.com", notas:"Renovación anual." },
];

const PROVEEDORES = [
  { nombre:"Rominter",             tipo:"Cerrajería",          tel:"91 111 22 33", email:"rominter@rominter.es" },
  { nombre:"Aulus Construcciones", tipo:"Obras y pintura",     tel:"91 222 33 44", email:"aulus@aulus.es" },
  { nombre:"Manjón Carpinteros",   tipo:"Carpintería",         tel:"91 333 44 55", email:"manjon@manjon.es" },
  { nombre:"Aquapress",            tipo:"Grupos de presión",   tel:"91 444 55 66", email:"aquapress@aquapress.es" },
  { nombre:"Giménez Guzmán",       tipo:"Pintura",             tel:"91 555 66 77", email:"gguzman@pintura.es" },
  { nombre:"Pocería Alonso",       tipo:"Fontanería",          tel:"91 666 77 88", email:"alonso@poceria.es" },
  { nombre:"Lasser",               tipo:"Ventilación",         tel:"902 327 111",  email:"lasser@lasser.es" },
  { nombre:"Melius Architects",    tipo:"Arquitectura",        tel:"91 777 88 99", email:"info@melius.es" },
  { nombre:"Pedro Zabalo",         tipo:"Abogado laboralista", tel:"91 888 99 00", email:"zabalo@abogado.es" },
  { nombre:"Coral Pomar Palomino", tipo:"Abogada PH",          tel:"91 999 00 11", email:"coral@pomar.es" },
  { nombre:"Edmundo Lindemann",    tipo:"Arquitecto comunidad",tel:"91 000 11 22", email:"elindemann@coam.es" },
];

const CUOTAS = [
  { piso:"Local A", nombre:"Lovelus Príncipe SL",      coef:2.29, cuotaMes:216.85, estado:"al_dia",  deuda:0 },
  { piso:"Local B", nombre:"Lovelus Príncipe SL",      coef:2.46, cuotaMes:232.95, estado:"al_dia",  deuda:0 },
  { piso:"Local C", nombre:"Farmacia Aparicio",         coef:1.16, cuotaMes:188.04, estado:"revisar", deuda:0, nota:"Verificar acuerdo doble cuota" },
  { piso:"Local D", nombre:"Lovelus Príncipe SL",      coef:8.43, cuotaMes:798.28, estado:"al_dia",  deuda:0 },
  { piso:"1ºA",    nombre:"Ibercaja",                  coef:6.43, cuotaMes:931.34, estado:"al_dia",  deuda:0 },
  { piso:"1ºB",    nombre:"Ibercaja",                  coef:6.05, cuotaMes:876.30, estado:"al_dia",  deuda:0 },
  { piso:"2ºA",    nombre:"Pilar Matji de Arroquia",   coef:6.43, cuotaMes:931.34, estado:"al_dia",  deuda:0 },
  { piso:"2ºB",    nombre:"Pilar Perote Mendizábal",   coef:6.05, cuotaMes:876.30, estado:"al_dia",  deuda:0 },
  { piso:"3ºA",    nombre:"Ricardo Iglesias Baciana",  coef:6.43, cuotaMes:931.34, estado:"al_dia",  deuda:0 },
  { piso:"3ºB",    nombre:"Rentur SLU",                coef:6.05, cuotaMes:876.30, estado:"al_dia",  deuda:0 },
  { piso:"4ºA",    nombre:"Feral Iberia SA",           coef:5.90, cuotaMes:854.58, estado:"al_dia",  deuda:0 },
  { piso:"4ºB",    nombre:"Propietario",               coef:6.57, cuotaMes:951.62, estado:"al_dia",  deuda:0 },
  { piso:"5ºA",    nombre:"José Mª Pérez de Guzmán",  coef:5.85, cuotaMes:847.33, estado:"al_dia",  deuda:0 },
  { piso:"5ºB",    nombre:"Juan Aznar de la Haza",     coef:6.62, cuotaMes:958.86, estado:"al_dia",  deuda:0 },
  { piso:"6ºA",    nombre:"Imo Luis Garrido/Túplet",   coef:6.43, cuotaMes:465.67, estado:"al_dia",  deuda:0, nota:"2 pagadores a 50%" },
  { piso:"6ºB",    nombre:"Agropecuaria Aldealgordo",  coef:6.05, cuotaMes:876.30, estado:"al_dia",  deuda:0 },
  { piso:"7ºA",    nombre:"Ignacio de la Colina",      coef:5.47, cuotaMes:792.29, estado:"al_dia",  deuda:0 },
  { piso:"7ºB",    nombre:"Olga Corpas",               coef:5.33, cuotaMes:772.02, estado:"deudor",  deuda:149.13, nota:"Recibo pendiente 28/02/2026" },
];

// ── ESTILOS BASE ──────────────────────────────────────────────────────────────
const S = {
  inp: { display:"block", width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #ddd", fontSize:14, boxSizing:"border-box", outline:"none", background:"#fafaf8", fontFamily:"Georgia,serif" },
  lbl: { display:"block", fontSize:11, fontWeight:700, color:"#666", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 },
  card: { background:"#fff", borderRadius:14, padding:"16px 20px", marginBottom:12, border:"1.5px solid #eee" },
  green: { background:"#1a2e1a", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontWeight:800, fontSize:14, cursor:"pointer" },
  tab: (a) => ({ padding:"8px 14px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:700, color:a?"#1a2e1a":"#999", borderBottom:a?"3px solid #1a2e1a":"3px solid transparent", whiteSpace:"nowrap" }),
};
const fmt = (iso) => new Date(iso).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
const fmtD = (iso) => new Date(iso).toLocaleDateString("es-ES",{day:"2-digit",month:"short",year:"numeric"});
const diasVence = (f) => Math.round((new Date(f)-new Date())/(864e5));
const getCat = (id) => CATEGORIAS.find(c=>c.id===id)||CATEGORIAS[7];

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────────
const Badge = ({estado}) => { const e=ESTADOS[estado]||ESTADOS.pendiente; return <span style={{background:e.bg,color:e.color,border:`1px solid ${e.color}40`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,textTransform:"uppercase"}}>{e.label}</span>; };
const CatChip = ({catId}) => { const c=getCat(catId); return <span style={{background:c.color+"18",color:c.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600,gap:4,display:"inline-flex",alignItems:"center"}}>{c.icon} {c.label}</span>; };
const Pill = ({label,color="#888",bg="#f0f0f0"}) => <span style={{background:bg,color,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>{label}</span>;

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({onLogin}) {
  const [sel,setSel]=useState(""); const [pin,setPin]=useState(""); const [err,setErr]=useState("");
  const [inquilinos]=useState(INQUILINOS_INIT);

  // Label descriptivo único para cada vecino en el selector
  const label=(v)=>{
    if(v.rol==="admin") return "🔐 Administración";
    if(v.id==="junta")  return "⭐ 2ºA — Presidenta (Junta)";
    if(v.id==="junta2") return "⭐ 3ºB — Vicepresidente (Junta)";
    if(v.id==="v2a")    return "2ºA — Propietario/a";
    if(v.id==="v3b_p")  return "3ºB — Propietario/a";
    if(v.local)         return `${v.piso} — Local comercial`;
    return v.piso;
  };

  const grupos=[
    {label:"🔐 Administración y Junta", ids:["admin","junta","junta2"]},
    {label:"🏪 Locales planta baja",    ids:["la","lb","lc","ld"]},
    {label:"🏢 Planta 1ª",             ids:["v1a","v1b"]},
    {label:"🏠 Planta 2ª",             ids:["v2a","v2b"]},
    {label:"🏠 Planta 3ª",             ids:["v3a","v3b","v3b_p"]},
    {label:"🏠 Planta 4ª",             ids:["v4a","v4b"]},
    {label:"🏠 Planta 5ª",             ids:["v5a","v5b"]},
    {label:"🏠 Planta 6ª",             ids:["v6a","v6b"]},
    {label:"🏠 Planta 7ª",             ids:["v7a","v7b"]},
  ];

  const entrar=()=>{
    if(sel.startsWith("inq_")){
      const i=inquilinos.find(x=>x.id===sel.replace("inq_","")&&x.activo);
      if(i&&i.pin===pin){
        const propietario=VECINOS.find(v=>v.id===i.propietarioId);
        setErr("");onLogin({...i,rol:"inquilino",esInquilino:true,propietario,email:i.email||""});return;
      }
      setErr("PIN incorrecto.");return;
    }
    const u=VECINOS.find(v=>v.id===sel);
    if(u&&u.pin===pin){setErr("");onLogin({...u,esInquilino:false});return;}
    setErr("PIN incorrecto.");
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0f2118,#1a4a2a,#2d6b43)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Georgia,serif"}}>
      <div style={{background:"#fff",borderRadius:24,padding:40,maxWidth:420,width:"100%",boxShadow:"0 30px 80px rgba(0,0,0,0.35)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:52,marginBottom:8}}>🏛️</div>
          <div style={{fontWeight:800,fontSize:24,color:"#0f2118"}}>Almagro 46</div>
          <div style={{color:"#888",fontSize:13,marginTop:4}}>Portal de la Comunidad de Propietarios</div>
        </div>
        <label style={S.lbl}>Tu acceso</label>
        <select value={sel} onChange={e=>{setSel(e.target.value);setErr("");}} style={{...S.inp,marginBottom:14,fontSize:14}}>
          <option value="">Selecciona tu piso o rol…</option>
          {grupos.map(g=>(
            <optgroup key={g.label} label={g.label}>
              {VECINOS.filter(v=>g.ids.includes(v.id)).map(v=>(
                <option key={v.id} value={v.id}>{label(v)}</option>
              ))}
            </optgroup>
          ))}
          {inquilinos.filter(i=>i.activo).length>0&&(
            <optgroup label="🔑 Inquilinos">
              {inquilinos.filter(i=>i.activo).map(i=><option key={i.id} value={`inq_${i.id}`}>{i.piso} (inquilino)</option>)}
            </optgroup>
          )}
        </select>
        <label style={S.lbl}>PIN de acceso</label>
        <input type="password" value={pin} onChange={e=>{setPin(e.target.value);setErr("");}}
          onKeyDown={e=>e.key==="Enter"&&entrar()} placeholder="••••" maxLength={6}
          style={{...S.inp,fontSize:22,letterSpacing:8,textAlign:"center",marginBottom:14}}/>
        {err&&<div style={{background:"#fdecea",color:"#c0392b",borderRadius:8,padding:"8px 12px",fontSize:13,marginBottom:12,textAlign:"center"}}>{err}</div>}
        <button onClick={entrar} disabled={!sel||!pin}
          style={{...S.green,width:"100%",padding:14,fontSize:15,opacity:sel&&pin?1:0.4}}>
          Entrar
        </button>
        <div style={{marginTop:18,padding:14,background:"#f7f5f0",borderRadius:10,fontSize:11,color:"#999",lineHeight:1.9}}>
          <b>Accesos demo:</b><br/>
          🔐 Admin → 0000<br/>
          ⭐ Presidenta (Junta) → 2001<br/>
          ⭐ Vicepresidente (Junta) → 9999<br/>
          🏠 2ºA propietario/a → 2011 &nbsp;|&nbsp; 3ºB propietario/a → 3022<br/>
          🏪 Local C (farmacia) → 0003 &nbsp;|&nbsp; 1ºA → 1001
        </div>
      </div>
    </div>
  );
}

// ── MODAL DETALLE AVISO ───────────────────────────────────────────────────────
function AvisoModal({aviso,onClose,usuario,onUpdate}) {
  const [estado,setEstado]=useState(aviso.estado);
  const [comentario,setComentario]=useState("");
  const [seguro,setSeguro]=useState(aviso.seguro||false);
  const [nParte,setNParte]=useState(aviso.nParte||"");
  const [resueltoBy,setResueltoBy]=useState(aviso.resueltoBy||"");
  const [guardando,setGuardando]=useState(false);
  const esPriv=usuario.rol==="admin"||usuario.rol==="junta";
  const cat=getCat(aviso.categoria);

  const guardar=(cambios)=>{
    const actualizado={...aviso,...cambios,estado,seguro,nParte,resueltoBy};
    onUpdate(actualizado);
  };

  const enviarComentario=async()=>{
    if(!comentario.trim())return;
    setGuardando(true);
    const c={autor:usuario.nombre,texto:comentario.trim(),fecha:new Date().toISOString()};
    const actualizado={...aviso,estado,seguro,nParte,resueltoBy,comentarios:[...aviso.comentarios,c]};
    onUpdate(actualizado);
    setComentario("");
    setGuardando(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:20,padding:28,maxWidth:580,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
        {/* CABECERA */}
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{display:"flex",gap:8,marginBottom:6,flexWrap:"wrap"}}><CatChip catId={aviso.categoria}/><Badge estado={estado}/>{aviso.esInquilino&&<Pill label="🔑 Inquilino" color="#b7770d" bg="#fffbea"/>}{seguro&&<Pill label="🛡️ Seguro" color="#8e44ad" bg="#f4eafb"/>}</div>
            <div style={{fontWeight:800,fontSize:17,color:"#111"}}>{aviso.titulo}</div>
            <div style={{fontSize:12,color:"#999",marginTop:3}}>📍 {aviso.zona} · 👤 {aviso.autorNombre} ({aviso.autorPiso}) · 🕐 {fmt(aviso.fecha)}</div>
          </div>
          <button onClick={onClose} style={{background:"#f0f0f0",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",flexShrink:0}}>✕</button>
        </div>

        {/* DESCRIPCIÓN */}
        <div style={{background:"#f9f7f4",borderRadius:10,padding:"12px 16px",marginBottom:14,fontSize:14,color:"#333",lineHeight:1.6}}>{aviso.descripcion}</div>
        {aviso.foto&&<img src={aviso.foto} alt="Foto" style={{width:"100%",borderRadius:12,marginBottom:14,maxHeight:240,objectFit:"cover"}}/>}

        {/* SEGURO — cualquier usuario puede marcar */}
        <div style={{background:seguro?"#f4eafb":"#f9f7f4",borderRadius:10,padding:"12px 16px",marginBottom:14,border:seguro?"1.5px solid #c39bd3":"1.5px solid #eee"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:"#8e44ad",marginBottom:2}}>🛡️ Parte de seguro</div>
              <div style={{fontSize:12,color:"#888"}}>¿Esta incidencia debe notificarse al seguro?</div>
            </div>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
              <div onClick={()=>{setSeguro(!seguro);guardar({seguro:!seguro});}} style={{width:42,height:24,borderRadius:12,background:seguro?"#8e44ad":"#ddd",position:"relative",transition:"background 0.2s",cursor:"pointer"}}>
                <div style={{position:"absolute",top:3,left:seguro?20:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
              </div>
              <span style={{fontSize:13,fontWeight:600,color:seguro?"#8e44ad":"#888"}}>{seguro?"Sí":"No"}</span>
            </label>
          </div>
          {seguro&&(
            <div style={{marginTop:12}}>
              <label style={S.lbl}>Nº de parte / referencia del siniestro</label>
              <div style={{display:"flex",gap:8}}>
                <input value={nParte} onChange={e=>setNParte(e.target.value)} placeholder="Ej: AXA-2026-00412" style={{...S.inp,marginBottom:0,flex:1}}/>
                <button onClick={()=>guardar({nParte})} style={{...S.green,padding:"10px 14px",fontSize:13}}>Guardar</button>
              </div>
              {nParte&&<div style={{marginTop:8,fontSize:12,color:"#8e44ad",fontWeight:600}}>✓ Parte registrado: {nParte}</div>}
            </div>
          )}
        </div>

        {/* ESTADO — solo admin/junta */}
        {esPriv&&(
          <div style={{marginBottom:14}}>
            <label style={S.lbl}>Estado de la incidencia</label>
            <div style={{display:"flex",gap:6,marginBottom:estado==="resuelto"?10:0}}>
              {Object.entries(ESTADOS).map(([k,v])=>(
                <button key={k} onClick={()=>{setEstado(k);guardar({estado:k});}} style={{flex:1,padding:"8px 0",borderRadius:8,border:estado===k?`2px solid ${v.color}`:"2px solid #eee",background:estado===k?v.bg:"#fff",color:estado===k?v.color:"#888",fontWeight:700,fontSize:12,cursor:"pointer"}}>{v.label}</button>
              ))}
            </div>
            {estado==="resuelto"&&(
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <input value={resueltoBy} onChange={e=>setResueltoBy(e.target.value)} placeholder="¿Quién lo resolvió? Ej: Rominter" style={{...S.inp,marginBottom:0,flex:1}}/>
                <button onClick={()=>guardar({resueltoBy})} style={{...S.green,padding:"10px 14px",fontSize:13}}>OK</button>
              </div>
            )}
            {resueltoBy&&estado==="resuelto"&&<div style={{fontSize:12,color:"#27ae60",fontWeight:600,marginTop:6}}>✓ Resuelto por: {resueltoBy}</div>}
          </div>
        )}

        {/* COMENTARIOS */}
        <div style={{borderTop:"1px solid #eee",paddingTop:14}}>
          <label style={S.lbl}>Comentarios ({aviso.comentarios.length})</label>
          {aviso.comentarios.length===0&&<div style={{color:"#bbb",fontSize:13,marginBottom:10}}>Sin comentarios.</div>}
          {aviso.comentarios.map((c,i)=>(
            <div key={i} style={{background:"#f0f7f3",borderRadius:10,padding:"10px 14px",marginBottom:8}}>
              <div style={{fontWeight:700,fontSize:12,color:"#1a5c3a",marginBottom:2}}>{c.autor}</div>
              <div style={{fontSize:13,color:"#333"}}>{c.texto}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:3}}>{fmt(c.fecha)}</div>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <textarea value={comentario} onChange={e=>setComentario(e.target.value)} placeholder="Añadir comentario…" rows={2} style={{flex:1,borderRadius:10,border:"1.5px solid #ddd",padding:"8px 12px",fontSize:13,resize:"none",fontFamily:"Georgia,serif",outline:"none"}}/>
            <button onClick={enviarComentario} disabled={!comentario.trim()||guardando} style={{...S.green,padding:"0 16px",opacity:comentario.trim()&&!guardando?1:0.4}}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MODAL NUEVO AVISO ─────────────────────────────────────────────────────────
function NuevoAvisoModal({onClose,onCrear,usuario}) {
  const [f,setF]=useState({titulo:"",categoria:"averia",zonas:[],descripcion:""});
  const [foto,setFoto]=useState(null); const [fotoPreview,setFotoPreview]=useState(null);
  const [emailConf,setEmailConf]=useState(usuario.email||"");
  const [seguro,setSeguro]=useState(false);
  const [enviando,setEnviando]=useState(false); const [enviado,setEnviado]=useState(false);
  const fileRef=useRef();
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const esSug=f.categoria==="sugerencia";
  const valido=f.titulo.trim()&&f.descripcion.trim()&&(esSug||f.zonas.length>0);

  const onFoto=(e)=>{ const file=e.target.files[0]; if(!file)return; setFoto(file); const r=new FileReader(); r.onload=ev=>setFotoPreview(ev.target.result); r.readAsDataURL(file); };

  const toggleZona=(z)=>setF(p=>({...p,zonas:p.zonas.includes(z)?p.zonas.filter(x=>x!==z):[...p.zonas,z]}));
  const toggleGrupo=(zonas)=>{
    const todasMarcadas=zonas.every(z=>f.zonas.includes(z));
    setF(p=>({...p,zonas:todasMarcadas?p.zonas.filter(z=>!zonas.includes(z)):[...new Set([...p.zonas,...zonas])]}));
  };

  // Zonas privativas del usuario
  const zonasPriv=[
    ...(usuario.garaje?.map(g=>`Garaje — plaza ${g}`)||[]),
    ...(usuario.trastero?.map(t=>`Trastero ${t}`)||[]),
  ];

  const crear=async()=>{
    setEnviando(true);
    const zonasTexto=f.zonas.join(", ");
    const nuevo={id:Date.now(),...f,titulo:f.titulo.trim(),descripcion:f.descripcion.trim(),
      zona:zonasTexto, zonas:f.zonas,
      estado:"pendiente",foto:fotoPreview||null,seguro,nParte:"",resueltoBy:"",
      autorId:usuario.id,autorNombre:usuario.esInquilino?`Inquilino ${usuario.piso}`:usuario.nombre,
      autorPiso:usuario.piso,
      esInquilino:usuario.esInquilino||false,
      propietarioEmail:usuario.esInquilino?usuario.propietario?.email||null:null,
      fecha:new Date().toISOString(),comentarios:[]};
    onCrear(nuevo);
    const cat=getCat(nuevo.categoria);
    const urgente=["averia","seguridad"].includes(nuevo.categoria);
    const asunto=`${urgente?"🔴 URGENTE":"📋"} [Almagro 46] ${cat.icon} ${nuevo.titulo} — ${nuevo.autorPiso}`;
    const cuerpo=`Nuevo aviso en el portal Almagro 46\n\nCategoría: ${cat.icon} ${cat.label}\nTítulo: ${nuevo.titulo}\nZona(s): ${zonasTexto}\nEnviado por: ${nuevo.autorNombre} (${nuevo.autorPiso})\n\n${nuevo.descripcion}${seguro?"\n\n⚠️ Puede requerir parte de seguro.":""}`;
    try{
      await sendEmail({to_email:EMAILS.admin,to_name:"Administración",subject:asunto,message:cuerpo,from_name:"Portal Almagro 46"});
      if(usuario.esInquilino&&usuario.propietario?.email)
        await sendEmail({to_email:usuario.propietario.email,to_name:usuario.propietario.nombre,subject:`🔑 [Inquilino ${usuario.piso}] ${cat.icon} ${nuevo.titulo}`,message:`Tu inquilino del ${usuario.piso} ha enviado un aviso.\n\n${cuerpo}`,from_name:"Portal Almagro 46"});
      if(emailConf.trim())
        await sendEmail({to_email:emailConf.trim(),to_name:nuevo.autorPiso,subject:`✅ Tu aviso ha sido enviado — Almagro 46`,message:`Tu aviso ha sido enviado y notificado a la administración.\n\n${cat.icon} ${nuevo.titulo}\n📍 ${zonasTexto}\n\nPortal Almagro 46`,from_name:"Portal Almagro 46"});
    }catch(e){console.error(e);}
    setEnviando(false); setEnviado(true);
    setTimeout(()=>onClose(),1800);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:20,padding:28,maxWidth:520,width:"100%",maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontWeight:800,fontSize:18}}>{esSug?"💡 Nueva sugerencia":"📋 Nuevo aviso"}</div>
          <button onClick={onClose} style={{background:"#f0f0f0",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer"}}>✕</button>
        </div>

        {/* CATEGORÍA */}
        <label style={S.lbl}>Categoría</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
          {CATEGORIAS.map(c=><button key={c.id} onClick={()=>set("categoria",c.id)} style={{padding:"8px 10px",borderRadius:8,border:f.categoria===c.id?`2px solid ${c.color}`:"2px solid #eee",background:f.categoria===c.id?c.color+"15":"#fff",color:f.categoria===c.id?c.color:"#555",fontWeight:600,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>{c.icon} {c.label}</button>)}
        </div>

        {esSug&&<div style={{background:"#fffbea",border:"1px solid #f39c1240",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#7d5a00"}}>💡 Las sugerencias van directamente a la Junta de Gobierno y la Administración.</div>}

        {/* TÍTULO */}
        <label style={S.lbl}>{esSug?"Título de la sugerencia *":"Título del aviso *"}</label>
        <input value={f.titulo} onChange={e=>set("titulo",e.target.value)}
          placeholder={esSug?"Ej: Instalar más iluminación en garaje":"Ej: Limpieza garaje, luz fundida escalera…"}
          style={{...S.inp,marginBottom:14}}/>

        {/* ZONAS — selección múltiple por checkboxes */}
        {!esSug&&(<>
          <label style={S.lbl}>
            Zona(s) afectada(s) *
            {f.zonas.length>0&&<span style={{fontWeight:400,color:"#1a5c3a",marginLeft:6}}>({f.zonas.length} seleccionada{f.zonas.length>1?"s":""})</span>}
          </label>

          {/* Mis espacios privados */}
          {zonasPriv.length>0&&(
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:"#1a5c3a",marginBottom:5,textTransform:"uppercase",letterSpacing:0.4}}>🏠 Mis espacios</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button type="button" onClick={()=>toggleZona(`Mi vivienda (${usuario.piso})`)}
                  style={{padding:"5px 10px",borderRadius:8,border:f.zonas.includes(`Mi vivienda (${usuario.piso})`)?"2px solid #1a2e1a":"2px solid #ddd",background:f.zonas.includes(`Mi vivienda (${usuario.piso})`)?"#1a2e1a":"#fff",color:f.zonas.includes(`Mi vivienda (${usuario.piso})`)?"#fff":"#555",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  🏠 {usuario.piso}
                </button>
                {zonasPriv.map(z=><button key={z} type="button" onClick={()=>toggleZona(z)}
                  style={{padding:"5px 10px",borderRadius:8,border:f.zonas.includes(z)?"2px solid #1a2e1a":"2px solid #ddd",background:f.zonas.includes(z)?"#1a2e1a":"#fff",color:f.zonas.includes(z)?"#fff":"#555",fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  {z.startsWith("Garaje")?"🚗":"📦"} {z.replace("Garaje — plaza ","").replace("Trastero ","")}
                </button>)}
              </div>
            </div>
          )}

          {/* Zonas comunes con checkboxes por grupo */}
          <div style={{border:"1.5px solid #eee",borderRadius:12,overflow:"hidden",marginBottom:14,maxHeight:260,overflowY:"auto"}}>
            {ZONAS_GRUPOS.map((g,gi)=>{
              const todasMarcadas=g.zonas.every(z=>f.zonas.includes(z));
              const algunaMarcada=g.zonas.some(z=>f.zonas.includes(z))&&!todasMarcadas;
              return <div key={g.grupo} style={{borderBottom:gi<ZONAS_GRUPOS.length-1?"1px solid #f5f5f5":"none"}}>
                {/* Cabecera grupo — seleccionar todo el grupo */}
                <div onClick={()=>toggleGrupo(g.zonas)}
                  style={{padding:"8px 12px",background:todasMarcadas?"#f0f7f3":algunaMarcada?"#f9f5f0":"#fafaf8",cursor:"pointer",display:"flex",alignItems:"center",gap:8,userSelect:"none"}}>
                  <div style={{width:16,height:16,borderRadius:4,border:todasMarcadas?"none":algunaMarcada?"2px solid #e67e22":"2px solid #ddd",background:todasMarcadas?"#1a2e1a":algunaMarcada?"#fef5e7":"#fff",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {todasMarcadas&&<span style={{color:"#fff",fontSize:11,fontWeight:800}}>✓</span>}
                    {algunaMarcada&&<span style={{color:"#e67e22",fontSize:11,fontWeight:800}}>—</span>}
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:"#555"}}>{g.grupo}</span>
                </div>
                {/* Zonas del grupo */}
                <div style={{padding:"4px 8px 8px 36px",display:"flex",flexDirection:"column",gap:2}}>
                  {g.zonas.map(z=>{
                    const marcada=f.zonas.includes(z);
                    return <div key={z} onClick={()=>toggleZona(z)}
                      style={{display:"flex",alignItems:"center",gap:8,padding:"4px 6px",borderRadius:6,cursor:"pointer",background:marcada?"#f0f7f3":"transparent"}}>
                      <div style={{width:14,height:14,borderRadius:3,border:marcada?"none":"1.5px solid #ddd",background:marcada?"#1a2e1a":"#fff",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {marcada&&<span style={{color:"#fff",fontSize:10,fontWeight:800}}>✓</span>}
                      </div>
                      <span style={{fontSize:12,color:marcada?"#1a2e1a":"#555",fontWeight:marcada?600:400}}>{z}</span>
                    </div>;
                  })}
                </div>
              </div>;
            })}
          </div>

          {/* Resumen zonas seleccionadas */}
          {f.zonas.length>0&&(
            <div style={{background:"#f0f7f3",borderRadius:8,padding:"8px 12px",marginBottom:14,fontSize:12,color:"#1a5c3a",display:"flex",flexWrap:"wrap",gap:5}}>
              {f.zonas.map(z=><span key={z} style={{background:"#1a2e1a",color:"#fff",borderRadius:6,padding:"2px 8px",display:"inline-flex",alignItems:"center",gap:4}}>
                {z}
                <span onClick={()=>toggleZona(z)} style={{cursor:"pointer",opacity:0.7,marginLeft:2}}>✕</span>
              </span>)}
            </div>
          )}
        </>)}

        {/* DESCRIPCIÓN */}
        <label style={S.lbl}>Descripción *</label>
        <textarea value={f.descripcion} onChange={e=>set("descripcion",e.target.value)}
          placeholder={esSug?"Explica tu idea con detalle…":"Describe el problema con el máximo detalle…"}
          rows={3} style={{...S.inp,resize:"vertical",marginBottom:14}}/>

        {/* FOTO */}
        <label style={S.lbl}>Foto (opcional)</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFoto} style={{display:"none"}}/>
        {!fotoPreview
          ?<button onClick={()=>fileRef.current.click()} style={{width:"100%",padding:"14px",border:"2px dashed #ddd",borderRadius:12,background:"#fafaf8",cursor:"pointer",color:"#888",fontSize:13,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>📷 Adjuntar foto</button>
          :<div style={{position:"relative",marginBottom:14}}><img src={fotoPreview} alt="preview" style={{width:"100%",borderRadius:12,maxHeight:180,objectFit:"cover"}}/><button onClick={()=>{setFoto(null);setFotoPreview(null);}} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",borderRadius:20,width:26,height:26,cursor:"pointer"}}>✕</button></div>
        }

        {/* SEGURO */}
        {!esSug&&<div style={{background:"#f9f4fb",borderRadius:10,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontWeight:700,fontSize:13,color:"#8e44ad"}}>🛡️ ¿Puede afectar al seguro?</div><div style={{fontSize:12,color:"#888"}}>La administración registrará el parte</div></div>
          <div onClick={()=>setSeguro(!seguro)} style={{width:42,height:24,borderRadius:12,background:seguro?"#8e44ad":"#ddd",position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
            <div style={{position:"absolute",top:3,left:seguro?20:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
          </div>
        </div>}

        {/* EMAIL */}
        <label style={S.lbl}>Tu email para recibir confirmación (opcional)</label>
        <input value={emailConf} onChange={e=>setEmailConf(e.target.value)} type="email"
          placeholder="tu@email.com" style={{...S.inp,marginBottom:14}}/>
        <div style={{background:"#f0f7f3",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1a5c3a"}}>
          📧 La <b>Administración</b> recibirá este aviso automáticamente.
          {emailConf.trim()&&<span> Recibirás confirmación en {emailConf}.</span>}
        </div>

        {enviado
          ?<div style={{background:"#e9f7ef",borderRadius:12,padding:14,textAlign:"center",fontSize:15,fontWeight:700,color:"#27ae60"}}>✅ Aviso enviado correctamente</div>
          :<button onClick={crear} disabled={!valido||enviando}
            style={{...S.green,width:"100%",padding:14,opacity:valido&&!enviando?1:0.4,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {enviando?<>⏳ Enviando…</>:esSug?"💡 Enviar sugerencia":"📋 Enviar aviso"}
          </button>
        }
      </div>
    </div>
  );
}



// ── TABLÓN DE AVISOS (vecinos) ────────────────────────────────────────────────
function Tablon({usuario,avisos,setAvisos}) {
  const [activo,setActivo]=useState(null);
  const [nuevo,setNuevo]=useState(false);
  const [filtCat,setFiltCat]=useState("todos");
  const [filtEst,setFiltEst]=useState("todos");
  const [busq,setBusq]=useState("");

  const update=(a)=>{setAvisos(p=>p.map(x=>x.id===a.id?a:x));setActivo(a);};
  const lista=avisos.filter(a=>{
    if(filtCat!=="todos"&&a.categoria!==filtCat)return false;
    if(filtEst!=="todos"&&a.estado!==filtEst)return false;
    if(busq&&!a.titulo.toLowerCase().includes(busq.toLowerCase()))return false;
    return true;
  });
  const stats={total:avisos.length,p:avisos.filter(a=>a.estado==="pendiente").length,e:avisos.filter(a=>a.estado==="en-curso").length,r:avisos.filter(a=>a.estado==="resuelto").length};

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
      {[["Total",stats.total,"#555","#fff"],["Pendientes",stats.p,"#c0392b","#fdecea"],["En curso",stats.e,"#e67e22","#fef5e7"],["Resueltos",stats.r,"#27ae60","#e9f7ef"]].map(([l,v,c,bg])=>(
        <div key={l} style={{background:bg,borderRadius:12,padding:"12px 10px",textAlign:"center",border:`1px solid ${c}20`}}>
          <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
          <div style={{fontSize:10,color:"#888",fontWeight:700,textTransform:"uppercase",letterSpacing:0.4}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:8,marginBottom:12}}>
      <input value={busq} onChange={e=>setBusq(e.target.value)} placeholder="🔍  Buscar…" style={{flex:1,...S.inp}}/>
      <button onClick={()=>setNuevo(true)} style={{...S.green,whiteSpace:"nowrap",padding:"10px 16px"}}>+ Nuevo</button>
    </div>
    <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:8,paddingBottom:4}}>
      <button onClick={()=>setFiltCat("todos")} style={{padding:"5px 12px",borderRadius:20,border:filtCat==="todos"?"2px solid #1a2e1a":"2px solid #eee",background:filtCat==="todos"?"#1a2e1a":"#fff",color:filtCat==="todos"?"#fff":"#555",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>Todos</button>
      {CATEGORIAS.map(c=><button key={c.id} onClick={()=>setFiltCat(c.id)} style={{padding:"5px 12px",borderRadius:20,border:filtCat===c.id?`2px solid ${c.color}`:"2px solid #eee",background:filtCat===c.id?c.color:"#fff",color:filtCat===c.id?"#fff":"#555",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{c.icon} {c.label}</button>)}
    </div>
    <div style={{display:"flex",gap:5,marginBottom:16}}>
      {[["todos","Todos","#555"],["pendiente","Pendientes","#c0392b"],["en-curso","En curso","#e67e22"],["resuelto","Resueltos","#27ae60"]].map(([k,l,c])=>(
        <button key={k} onClick={()=>setFiltEst(k)} style={{padding:"4px 10px",borderRadius:20,border:filtEst===k?`2px solid ${c}`:"2px solid #eee",background:filtEst===k?c+"15":"#fff",color:filtEst===k?c:"#888",fontWeight:600,fontSize:11,cursor:"pointer"}}>{l}</button>
      ))}
    </div>
    {lista.length===0?<div style={{textAlign:"center",padding:"40px",color:"#bbb"}}><div style={{fontSize:40,marginBottom:8}}>📭</div>Sin avisos</div>
    :lista.map(a=>{
      const cat=getCat(a.categoria);
      return <div key={a.id} onClick={()=>setActivo(a)} style={{...S.card,cursor:"pointer",borderLeft:`4px solid ${cat.color}`,transition:"box-shadow 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.1)"}
        onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
        <div style={{display:"flex",gap:8,marginBottom:5,flexWrap:"wrap"}}>
          <CatChip catId={a.categoria}/><Badge estado={a.estado}/>
          {a.esInquilino&&<Pill label="🔑 Inquilino" color="#b7770d" bg="#fffbea"/>}
          {a.seguro&&<Pill label="🛡️ Seguro" color="#8e44ad" bg="#f4eafb"/>}
          {a.nParte&&<Pill label={`Parte: ${a.nParte}`} color="#8e44ad" bg="#f4eafb"/>}
          {a.foto&&<Pill label="📷 Foto"/>}
        </div>
        <div style={{fontWeight:700,fontSize:15,color:"#111",marginBottom:4}}>{a.titulo}</div>
        <div style={{fontSize:12,color:"#999",display:"flex",gap:10,flexWrap:"wrap"}}>
          <span>📍 {a.zona}</span><span>👤 {a.autorPiso}</span><span>🕐 {fmt(a.fecha)}</span>
          {a.comentarios.length>0&&<span>💬 {a.comentarios.length}</span>}
          {a.resueltoBy&&<span>✓ {a.resueltoBy}</span>}
        </div>
      </div>;
    })}
    {activo&&<AvisoModal aviso={activo} onClose={()=>setActivo(null)} usuario={usuario} onUpdate={update}/>}
    {nuevo&&<NuevoAvisoModal onClose={()=>setNuevo(false)} onCrear={a=>setAvisos(p=>[a,...p])} usuario={usuario}/>}
  </div>;
}

// ── PANEL JUNTA ───────────────────────────────────────────────────────────────
function PanelJunta({avisos,setAvisos}) {
  const [activo,setActivo]=useState(null);
  const update=(a)=>{setAvisos(p=>p.map(x=>x.id===a.id?a:x));setActivo(a);};
  const urgentes=avisos.filter(a=>["averia","seguridad"].includes(a.categoria)&&a.estado!=="resuelto");
  const conSeguro=avisos.filter(a=>a.seguro);
  const pendientes=avisos.filter(a=>a.estado==="pendiente");
  const enCurso=avisos.filter(a=>a.estado==="en-curso");
  const resueltos=avisos.filter(a=>a.estado==="resuelto");
  const usuario=VECINOS.find(v=>v.rol==="junta");

  const SeccionAvisos=({titulo,lista,color})=>(
    <div style={{marginBottom:20}}>
      <div style={{fontWeight:700,fontSize:13,color,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
        <span>{titulo}</span><span style={{background:color+"20",color,borderRadius:20,padding:"1px 8px",fontSize:12}}>{lista.length}</span>
      </div>
      {lista.length===0&&<div style={{color:"#bbb",fontSize:13,padding:"8px 0"}}>Ninguno</div>}
      {lista.map(a=>{
        const cat=getCat(a.categoria);
        return <div key={a.id} onClick={()=>setActivo(a)} style={{...S.card,padding:"12px 16px",cursor:"pointer",borderLeft:`4px solid ${cat.color}`}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.08)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}><CatChip catId={a.categoria}/>{a.seguro&&<Pill label="🛡️ Seguro" color="#8e44ad" bg="#f4eafb"/>}</div>
              <div style={{fontWeight:700,fontSize:14}}>{a.titulo}</div>
              <div style={{fontSize:12,color:"#888",marginTop:3}}>📍 {a.zona} · 👤 {a.autorNombre} ({a.autorPiso}) · {fmt(a.fecha)}</div>
              {a.resueltoBy&&<div style={{fontSize:12,color:"#27ae60",marginTop:3,fontWeight:600}}>✓ Resuelto por: {a.resueltoBy}</div>}
              {a.nParte&&<div style={{fontSize:12,color:"#8e44ad",marginTop:2,fontWeight:600}}>🛡️ Parte nº: {a.nParte}</div>}
            </div>
            <Badge estado={a.estado}/>
          </div>
        </div>;
      })}
    </div>
  );

  return <div>
    {/* ALERTAS URGENTES */}
    {urgentes.length>0&&<div style={{background:"#fdecea",border:"1.5px solid #e74c3c40",borderRadius:14,padding:"14px 18px",marginBottom:20}}>
      <div style={{fontWeight:800,fontSize:14,color:"#c0392b",marginBottom:10}}>🔴 Incidencias urgentes sin resolver ({urgentes.length})</div>
      {urgentes.map(a=><div key={a.id} onClick={()=>setActivo(a)} style={{cursor:"pointer",padding:"8px 0",borderBottom:"1px solid #f1948a40",fontSize:13}}>
        <span style={{fontWeight:700}}>{a.titulo}</span> · <span style={{color:"#888"}}>{a.autorNombre} ({a.autorPiso}) · {a.zona}</span>
      </div>)}
    </div>}

    {/* SEGUROS */}
    {conSeguro.length>0&&<div style={{background:"#f4eafb",border:"1.5px solid #c39bd340",borderRadius:14,padding:"14px 18px",marginBottom:20}}>
      <div style={{fontWeight:800,fontSize:14,color:"#8e44ad",marginBottom:10}}>🛡️ Incidencias con parte de seguro ({conSeguro.length})</div>
      {conSeguro.map(a=><div key={a.id} onClick={()=>setActivo(a)} style={{cursor:"pointer",padding:"8px 0",borderBottom:"1px solid #c39bd330",fontSize:13}}>
        <div style={{fontWeight:700}}>{a.titulo}</div>
        <div style={{color:"#888",fontSize:12}}>
          {a.nParte?<span style={{color:"#8e44ad",fontWeight:600}}>Parte: {a.nParte}</span>:<span style={{color:"#e67e22"}}>⚠️ Sin nº de parte registrado</span>}
          {" · "}{a.estado==="resuelto"?"Resuelta":"Pendiente"}
        </div>
      </div>)}
    </div>}

    {/* CUADRO POR ESTADOS */}
    <SeccionAvisos titulo="🔴 Pendientes" lista={pendientes} color="#c0392b"/>
    <SeccionAvisos titulo="🟡 En curso" lista={enCurso} color="#e67e22"/>
    <SeccionAvisos titulo="✅ Resueltos" lista={resueltos} color="#27ae60"/>

    {activo&&<AvisoModal aviso={activo} onClose={()=>setActivo(null)} usuario={usuario||VECINOS[0]} onUpdate={update}/>}
  </div>;
}

// ── ENCARGOS (compras, presupuestos, órdenes) ─────────────────────────────────
function Encargos({usuario}) {
  const [encargos,setEncargos]=useState(ENCARGOS_INIT);
  const [tab,setTab]=useState("todos");
  const [nuevo,setNuevo]=useState(false);
  const [activo,setActivo]=useState(null);
  const [form,setForm]=useState({tipo:"compra",titulo:"",descripcion:"",prioridad:"media",proveedor:"",importe:""});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const esPriv=usuario.rol==="admin"||usuario.rol==="junta";

  const tipoInfo={
    compra:      {label:"Compra de material",          icon:"🛒", color:"#2980b9"},
    presupuesto: {label:"Presupuesto a proveedor",     icon:"📋", color:"#8e44ad"},
    orden:       {label:"Orden de trabajo",            icon:"🔧", color:"#e67e22"},
  };
  const prioColor={alta:"#c0392b",media:"#e67e22",baja:"#27ae60"};
  const estadoE={pendiente:{label:"Pendiente",color:"#e67e22"},completado:{label:"Completado",color:"#27ae60"},cancelado:{label:"Cancelado",color:"#888"}};

  const lista=tab==="todos"?encargos:encargos.filter(e=>e.tipo===tab);

  const crearEncargo=()=>{
    if(!form.titulo.trim())return;
    setEncargos(p=>[{id:Date.now(),...form,titulo:form.titulo.trim(),descripcion:form.descripcion.trim(),
      estado:"pendiente",fechaCreacion:new Date().toISOString(),fechaCierre:"",
      creadoPor:(usuario.rol==="admin"||usuario.rol==="junta")?usuario.nombre:usuario.piso},...p]);
    setNuevo(false);
    setForm({tipo:"compra",titulo:"",descripcion:"",prioridad:"media",proveedor:"",importe:""});
  };

  const marcarCompletado=(id)=>setEncargos(p=>p.map(e=>e.id===id?{...e,estado:"completado",fechaCierre:new Date().toISOString()}:e));

  return <div>
    {/* TABS TIPO */}
    <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
      {[["todos","Todos","#555"],...Object.entries(tipoInfo).map(([k,v])=>[k,v.icon+" "+v.label,v.color])].map(([k,l,c])=>(
        <button key={k} onClick={()=>setTab(k)} style={{padding:"7px 14px",borderRadius:20,border:tab===k?`2px solid ${c}`:"2px solid #eee",background:tab===k?c+"15":"#fff",color:tab===k?c:"#888",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{l}</button>
      ))}
    </div>

    {esPriv&&<button onClick={()=>setNuevo(true)} style={{...S.green,marginBottom:16,display:"flex",alignItems:"center",gap:6}}>+ Nuevo encargo</button>}

    {/* FORM NUEVO */}
    {nuevo&&<div style={{...S.card,background:"#f9f7f4",marginBottom:20}}>
      <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>Nuevo encargo</div>
      <label style={S.lbl}>Tipo</label>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {Object.entries(tipoInfo).map(([k,v])=><button key={k} onClick={()=>sf("tipo",k)} style={{flex:1,padding:"8px 0",borderRadius:8,border:form.tipo===k?`2px solid ${v.color}`:"2px solid #eee",background:form.tipo===k?v.color+"15":"#fff",color:form.tipo===k?v.color:"#555",fontWeight:600,fontSize:12,cursor:"pointer"}}>{v.icon} {v.label.split(" ")[0]}</button>)}
      </div>
      <label style={S.lbl}>Título *</label>
      <input value={form.titulo} onChange={e=>sf("titulo",e.target.value)} placeholder="Ej: Presupuesto pintura escaleras" style={{...S.inp,marginBottom:10}}/>
      <label style={S.lbl}>Descripción</label>
      <textarea value={form.descripcion} onChange={e=>sf("descripcion",e.target.value)} rows={2} placeholder="Detalle del encargo…" style={{...S.inp,resize:"vertical",marginBottom:10}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        <div>
          <label style={S.lbl}>Prioridad</label>
          <select value={form.prioridad} onChange={e=>sf("prioridad",e.target.value)} style={S.inp}><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select>
        </div>
        <div>
          <label style={S.lbl}>Proveedor</label>
          <input value={form.proveedor} onChange={e=>sf("proveedor",e.target.value)} placeholder="Empresa…" style={S.inp}/>
        </div>
        <div>
          <label style={S.lbl}>Importe est.</label>
          <input value={form.importe} onChange={e=>sf("importe",e.target.value)} placeholder="0,00 €" style={S.inp}/>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={crearEncargo} disabled={!form.titulo.trim()} style={{...S.green,opacity:form.titulo.trim()?1:0.4}}>Crear</button>
        <button onClick={()=>setNuevo(false)} style={{padding:"10px 16px",borderRadius:10,border:"1.5px solid #ddd",background:"#fff",cursor:"pointer",fontSize:14}}>Cancelar</button>
      </div>
    </div>}

    {/* LISTA */}
    {lista.map(e=>{
      const ti=tipoInfo[e.tipo]||tipoInfo.compra;
      const se=estadoE[e.estado]||estadoE.pendiente;
      return <div key={e.id} style={{...S.card,borderLeft:`4px solid ${ti.color}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,marginBottom:5,flexWrap:"wrap"}}>
              <span style={{background:ti.color+"18",color:ti.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600}}>{ti.icon} {ti.label}</span>
              <Pill label={e.prioridad.toUpperCase()} color={prioColor[e.prioridad]} bg={prioColor[e.prioridad]+"15"}/>
              <Pill label={se.label} color={se.color} bg={se.color+"15"}/>
            </div>
            <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{e.titulo}</div>
            {e.descripcion&&<div style={{fontSize:13,color:"#666",marginBottom:6}}>{e.descripcion}</div>}
            <div style={{fontSize:12,color:"#888",display:"flex",gap:12,flexWrap:"wrap"}}>
              {e.proveedor&&<span>🏢 {e.proveedor}</span>}
              {e.importe&&<span>💶 {e.importe}</span>}
              <span>📅 {fmtD(e.fechaCreacion)}</span>
              {e.fechaCierre&&<span>✅ Cerrado: {fmtD(e.fechaCierre)}</span>}
              <span>👤 {e.creadoPor}</span>
            </div>
          </div>
          {esPriv&&e.estado==="pendiente"&&<button onClick={()=>marcarCompletado(e.id)} style={{background:"#e9f7ef",color:"#27ae60",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>✓ Hecho</button>}
        </div>
      </div>;
    })}
    {lista.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#bbb"}}><div style={{fontSize:36,marginBottom:8}}>📋</div>Sin encargos</div>}
  </div>;
}

// ── CONTRATOS ─────────────────────────────────────────────────────────────────
function Contratos() {
  const [activo,setActivo]=useState(null);
  const [filtro,setFiltro]=useState("todos");
  const tipos=[...new Set(CONTRATOS.map(c=>c.tipo))];
  const lista=filtro==="todos"?CONTRATOS:CONTRATOS.filter(c=>c.tipo===filtro);
  const eColor={vigente:"#27ae60",revisar:"#e67e22",vencido:"#c0392b"};
  return <div>
    <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
      <button onClick={()=>setFiltro("todos")} style={{padding:"6px 12px",borderRadius:20,border:filtro==="todos"?"2px solid #1a2e1a":"2px solid #eee",background:filtro==="todos"?"#1a2e1a":"#fff",color:filtro==="todos"?"#fff":"#555",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>Todos</button>
      {tipos.map(t=><button key={t} onClick={()=>setFiltro(t)} style={{padding:"6px 12px",borderRadius:20,border:filtro===t?"2px solid #1a2e1a":"2px solid #eee",background:filtro===t?"#1a2e1a":"#fff",color:filtro===t?"#fff":"#555",fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>{t}</button>)}
    </div>
    {lista.map(c=>{
      const dias=diasVence(c.vencimiento);
      return <div key={c.id} onClick={()=>setActivo(activo?.id===c.id?null:c)} style={{...S.card,cursor:"pointer",borderLeft:`4px solid ${eColor[c.estado]||"#ccc"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,marginBottom:5,flexWrap:"wrap"}}>
              <Pill label={c.tipo} color="#555" bg="#f0f0f0"/>
              <Pill label={c.estado==="vigente"?"✓ Vigente":c.estado==="revisar"?"⚠ Revisar":"✗ Vencido"} color={eColor[c.estado]} bg={eColor[c.estado]+"15"}/>
              {dias<90&&<Pill label={`⏱ ${dias}d`} color="#e67e22" bg="#fef5e7"/>}
            </div>
            <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{c.nombre}</div>
            <div style={{fontSize:12,color:"#888",display:"flex",gap:12,flexWrap:"wrap"}}>
              <span>🏢 {c.proveedor}</span><span>💶 {c.importe}</span><span>📅 Vence: {fmtD(c.vencimiento)}</span>
            </div>
          </div>
          <span style={{color:"#ccc"}}>{activo?.id===c.id?"▲":"▼"}</span>
        </div>
        {activo?.id===c.id&&<div style={{marginTop:14,borderTop:"1px solid #eee",paddingTop:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13,marginBottom:10}}>
            <div><b>📞</b> {c.contacto}</div><div><b>✉️</b> {c.email}</div>
          </div>
          {c.notas&&<div style={{background:"#f7f5f0",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#444",marginBottom:12}}>{c.notas}</div>}
          <a href={c.doc} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:"#1a2e1a",color:"#fff",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:700,textDecoration:"none"}}>📄 Ver en OneDrive</a>
        </div>}
      </div>;
    })}
  </div>;
}

// ── PROVEEDORES ───────────────────────────────────────────────────────────────
function Proveedores() {
  const [busq,setBusq]=useState("");
  const lista=PROVEEDORES.filter(p=>!busq||p.nombre.toLowerCase().includes(busq.toLowerCase())||p.tipo.toLowerCase().includes(busq.toLowerCase()));
  return <div>
    <input value={busq} onChange={e=>setBusq(e.target.value)} placeholder="🔍  Buscar…" style={{...S.inp,marginBottom:16}}/>
    {lista.map((p,i)=><div key={i} style={S.card}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
        <div style={{flex:1}}>
          <Pill label={p.tipo} color="#1a5c3a" bg="#e8f4ec"/>
          <div style={{fontWeight:700,fontSize:15,color:"#111",margin:"5px 0 3px"}}>{p.nombre}</div>
          <div style={{fontSize:12,color:"#888"}}>📞 {p.tel} · ✉️ {p.email}</div>
        </div>
        <a href={`tel:${p.tel.replace(/\s/g,"")}`} style={{background:"#e8f4ec",color:"#1a5c3a",borderRadius:8,padding:"8px 12px",fontSize:18,textDecoration:"none",flexShrink:0}}>📞</a>
      </div>
    </div>)}
  </div>;
}

// ── CONTABILIDAD ──────────────────────────────────────────────────────────────
function Contabilidad() {
  const [tab,setTab]=useState("resumen");
  const gastosMes=[
    {mes:"Mar",ord:10200,ext:8500},{mes:"Abr",ord:9800,ext:12300},{mes:"May",ord:15900,ext:5600},
    {mes:"Jun",ord:15900,ext:7200},{mes:"Jul",ord:15900,ext:3100},{mes:"Ago",ord:15900,ext:2400},
    {mes:"Sep",ord:15900,ext:9800},{mes:"Oct",ord:15900,ext:14200},{mes:"Nov",ord:15900,ext:6700},
    {mes:"Dic",ord:15900,ext:11300},{mes:"Ene",ord:15900,ext:8900},{mes:"Feb",ord:15900,ext:4800},
  ];
  const pyg=[
    {categoria:"Conserjería",presupuesto:88472,real:76824,pct:87},
    {categoria:"Gas/Caldera",presupuesto:51156,real:52379,pct:102},
    {categoria:"Seguros",presupuesto:4305,real:6270,pct:146},
    {categoria:"Administración",presupuesto:5560,real:5727,pct:103},
    {categoria:"Ascensores",presupuesto:3845,real:7099,pct:185},
    {categoria:"Obras/Averías",presupuesto:15000,real:55000,pct:367},
    {categoria:"Empleados",presupuesto:0,real:16030,pct:100},
    {categoria:"Agua/Suminstr.",presupuesto:7500,real:8056,pct:107},
  ];
  return <div>
    <div style={{display:"flex",gap:2,marginBottom:18,overflowX:"auto",background:"#fff",borderRadius:12,padding:4,border:"1px solid #eee"}}>
      {[["resumen","📊 Resumen"],["pyg","📈 P&G"],["cuotas","🏘️ Cuotas"],["deudas","⚠️ Deudas"]].map(([k,l])=>(
        <button key={k} onClick={()=>setTab(k)} style={{...S.tab(tab===k),flex:1,borderRadius:8,padding:"9px 8px",fontSize:12}}>{l}</button>
      ))}
    </div>
    {tab==="resumen"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[{l:"Saldo banco",v:"14.607,61 €",c:"#27ae60",bg:"#e9f7ef",s:"28/02/2026"},{l:"Reservas LPH",v:"18.877,31 €",c:"#2980b9",bg:"#eaf4fb",s:"Acumulado"},{l:"Deuda proveedores",v:"52.659,15 €",c:"#c0392b",bg:"#fdecea",s:"Facturas pend."},{l:"Adelantos Junta",v:"14.035,56 €",c:"#e67e22",bg:"#fef5e7",s:"Pte. devolución"}].map(s=>(
          <div key={s.l} style={{background:s.bg,borderRadius:12,padding:"14px 16px",border:`1px solid ${s.c}20`}}>
            <div style={{fontSize:10,color:s.c,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{s.l}</div>
            <div style={{fontSize:18,fontWeight:800,color:s.c,marginBottom:2}}>{s.v}</div>
            <div style={{fontSize:11,color:"#888"}}>{s.s}</div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Gastos mensuales 2025-2026</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={gastosMes} margin={{top:0,right:0,bottom:0,left:-20}}>
            <XAxis dataKey="mes" tick={{fontSize:10}}/><YAxis tick={{fontSize:9}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
            <Tooltip formatter={v=>`${v.toLocaleString("es-ES")} €`}/>
            <Bar dataKey="ord" name="Ordinarios" fill="#1a5c3a" stackId="a"/><Bar dataKey="ext" name="Extraordinarios" fill="#a8d5b8" stackId="a" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{...S.card,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,textAlign:"center"}}>
        {[{l:"Gasto total",v:"264.609,06 €"},{l:"Ingresos totales",v:"209.341,84 €"},{l:"Déficit",v:"−55.267,22 €"}].map(x=>(
          <div key={x.l}><div style={{fontSize:13,fontWeight:800,color:"#1a2e1a"}}>{x.v}</div><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:0.3}}>{x.l}</div></div>
        ))}
      </div>
    </div>}
    {tab==="pyg"&&<div>
      {pyg.map(r=><div key={r.categoria} style={{...S.card,padding:"12px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <div style={{fontWeight:600,fontSize:13}}>{r.categoria}</div>
          <span style={{fontSize:12,fontWeight:800,color:r.pct>120?"#c0392b":r.pct>100?"#e67e22":"#27ae60"}}>{r.pct}%</span>
        </div>
        <div style={{background:"#eee",borderRadius:6,height:8,overflow:"hidden",marginBottom:4}}>
          <div style={{width:`${Math.min(r.pct,200)/2}%`,background:r.pct>120?"#c0392b":r.pct>100?"#e67e22":"#27ae60",height:"100%"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#888"}}>
          <span>Pres: {r.presupuesto.toLocaleString("es-ES")} €</span><span>Real: {r.real.toLocaleString("es-ES")} €</span>
        </div>
      </div>)}
    </div>}
    {tab==="cuotas"&&<div>
      <div style={{background:"#f7f5f0",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,color:"#666"}}>
        Total cuotas/mes: <b style={{color:"#1a2e1a"}}>15.902,88 €</b> · Deudores: <b style={{color:"#c0392b"}}>1</b>
      </div>
      {CUOTAS.map((v,i)=><div key={i} style={{...S.card,padding:"11px 16px",borderLeft:`4px solid ${v.estado==="deudor"?"#c0392b":v.estado==="revisar"?"#e67e22":"#27ae60"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{display:"flex",gap:8,alignItems:"center"}}><b style={{fontSize:13}}>{v.piso}</b><span style={{fontSize:12,color:"#888"}}>{v.nombre}</span></div>
            <div style={{fontSize:12,color:"#888"}}>Coef. {v.coef}% · {v.cuotaMes.toFixed(2).replace(".",",")} €/mes{v.nota?` · ${v.nota}`:""}</div>
            {v.estado==="deudor"&&<div style={{fontSize:12,color:"#c0392b",fontWeight:700}}>⚠ Deuda: {v.deuda.toFixed(2)} €</div>}
          </div>
          <span>{v.estado==="deudor"?"🔴":v.estado==="revisar"?"🟡":"🟢"}</span>
        </div>
      </div>)}
    </div>}
    {tab==="deudas"&&<div>
      <div style={{background:"#fdecea",borderRadius:12,padding:"14px 16px",marginBottom:14,border:"1px solid #f1948a40"}}>
        <div style={{fontWeight:800,fontSize:14,color:"#c0392b",marginBottom:2}}>Deudas totales a 28/02/2026</div>
        <div style={{fontSize:20,fontWeight:800,color:"#c0392b"}}>66.694,71 €</div>
        <div style={{fontSize:12,color:"#888"}}>Proveedores 52.659,15 € + Adelantos Junta 14.035,56 €</div>
      </div>
      {[{n:"Bluetietar",c:"2 mensualidades",i:"14.302,20 €",u:"alta"},{n:"Aulus Construcciones",c:"Obras ejecutadas",i:"17.068,63 €",u:"alta"},{n:"Manjón Carpinteros",c:"Carpintería fachada",i:"7.112,10 €",u:"media"},{n:"Naturgy",c:"Gas + caldera",i:"11.784,97 €",u:"alta"},{n:"Canal Isabel II + Ista",c:"Agua + contadores",i:"898,95 €",u:"baja"},{n:"Vera Pintos + Aluna",c:"Trabajos + cuota",i:"1.492,30 €",u:"media"}].map((d,i)=>(
        <div key={i} style={{...S.card,padding:"11px 16px",borderLeft:`4px solid ${d.u==="alta"?"#c0392b":d.u==="media"?"#e67e22":"#bbb"}`}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
            <div><div style={{fontWeight:700,fontSize:13}}>{d.n}</div><div style={{fontSize:12,color:"#888"}}>{d.c}</div></div>
            <div style={{fontWeight:800,fontSize:14,color:"#c0392b",whiteSpace:"nowrap"}}>{d.i}</div>
          </div>
        </div>
      ))}
      <div style={{fontWeight:700,fontSize:13,color:"#e67e22",margin:"16px 0 8px",textTransform:"uppercase",letterSpacing:0.4}}>Adelantos Junta</div>
      {[{n:"Pilar Matji (Presidenta)",i:"8.590,56 €"},{n:"Ulpiano González (Vicepresidente)",i:"5.445,00 €"}].map((d,i)=>(
        <div key={i} style={{...S.card,padding:"11px 16px",borderLeft:"4px solid #e67e22"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:700,fontSize:13}}>{d.n}</div><div style={{fontWeight:800,color:"#e67e22"}}>{d.i}</div></div>
        </div>
      ))}
    </div>}
  </div>;
}


// ── GESTIÓN INQUILINOS (solo admin/junta) ─────────────────────────────────────
function GestionInquilinos() {
  const [inquilinos,setInquilinos]=useState(INQUILINOS_INIT);
  const [nuevo,setNuevo]=useState(false);
  const [form,setForm]=useState({nombre:"",piso:"2ºA",propietarioId:"v2b",pin:"",email:""});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const pisos=VECINOS.filter(v=>v.rol==="vecino").map(v=>({piso:v.piso,id:v.id}));

  const crear=()=>{
    if(!form.nombre.trim()||!form.pin.trim())return;
    setInquilinos(p=>[...p,{id:`i${Date.now()}`,activo:true,...form,
      nombre:form.nombre.trim(),pin:form.pin.trim(),email:form.email.trim(),garaje:[],trastero:[]}]);
    setNuevo(false);
    setForm({nombre:"",piso:"2ºA",propietarioId:"v2b",pin:"",email:""});
  };
  const desactivar=(id)=>setInquilinos(p=>p.map(i=>i.id===id?{...i,activo:false}:i));
  const reactivar=(id)=>setInquilinos(p=>p.map(i=>i.id===id?{...i,activo:true}:i));

  return <div>
    <div style={{background:"#fffbea",border:"1px solid #f39c1240",borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#7d5a00"}}>
      🔑 Los inquilinos pueden enviar avisos a la comunidad. Sus avisos llegan automáticamente a la <b>Administración</b> y al <b>propietario</b> del piso.
    </div>
    <button onClick={()=>setNuevo(true)} style={{...S.green,marginBottom:16}}>+ Registrar inquilino</button>
    {nuevo&&<div style={{...S.card,background:"#f9f7f4",marginBottom:16}}>
      <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>Nuevo inquilino</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <div><label style={S.lbl}>Nombre completo</label><input value={form.nombre} onChange={e=>sf("nombre",e.target.value)} placeholder="Nombre del inquilino" style={S.inp}/></div>
        <div><label style={S.lbl}>Piso / Local</label>
          <select value={form.piso} onChange={e=>{
            const v=pisos.find(p=>p.piso===e.target.value);
            sf("piso",e.target.value);
            if(v)sf("propietarioId",v.id);
          }} style={S.inp}>
            {pisos.map(p=><option key={p.id} value={p.piso}>{p.piso}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        <div><label style={S.lbl}>PIN de acceso</label><input value={form.pin} onChange={e=>sf("pin",e.target.value)} placeholder="Ej: 2051" maxLength={6} style={S.inp}/></div>
        <div><label style={S.lbl}>Email (para notificaciones)</label><input value={form.email} onChange={e=>sf("email",e.target.value)} type="email" placeholder="inquilino@email.com" style={S.inp}/></div>
      </div>
      <div style={{background:"#f0f7f3",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#1a5c3a",marginBottom:12}}>
        El propietario de <b>{form.piso}</b> recibirá copia de todos los avisos que envíe este inquilino.
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={crear} disabled={!form.nombre.trim()||!form.pin.trim()} style={{...S.green,opacity:form.nombre.trim()&&form.pin.trim()?1:0.4}}>Registrar</button>
        <button onClick={()=>setNuevo(false)} style={{padding:"10px 16px",borderRadius:10,border:"1.5px solid #ddd",background:"#fff",cursor:"pointer"}}>Cancelar</button>
      </div>
    </div>}
    {inquilinos.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#bbb"}}><div style={{fontSize:36,marginBottom:8}}>🔑</div><div>No hay inquilinos registrados</div></div>}
    {inquilinos.map(i=>{
      const prop=VECINOS.find(v=>v.id===i.propietarioId);
      return <div key={i.id} style={{...S.card,borderLeft:`4px solid ${i.activo?"#27ae60":"#bbb"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
              <span style={{fontWeight:800,fontSize:14}}>🔑 {i.nombre}</span>
              <span style={{background:i.activo?"#e9f7ef":"#f5f5f5",color:i.activo?"#27ae60":"#888",borderRadius:20,padding:"1px 8px",fontSize:11,fontWeight:700}}>{i.activo?"Activo":"Inactivo"}</span>
            </div>
            <div style={{fontSize:12,color:"#888",display:"flex",gap:12,flexWrap:"wrap"}}>
              <span>🏠 {i.piso}</span>
              <span>👤 Propietario: {prop?.piso||"—"}</span>
              {i.email&&<span>✉️ {i.email}</span>}
              <span>PIN: {i.pin}</span>
            </div>
          </div>
          {i.activo
            ?<button onClick={()=>desactivar(i.id)} style={{background:"#fdecea",color:"#c0392b",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>Desactivar</button>
            :<button onClick={()=>reactivar(i.id)} style={{background:"#e9f7ef",color:"#27ae60",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>Reactivar</button>
          }
        </div>
      </div>;
    })}
  </div>;
}

// ── DOCUMENTOS DATA ───────────────────────────────────────────────────────────
const DOCUMENTOS_INIT = [
  { id:1,  categoria:"Contratos vigentes", nombre:"Seguro Comunidad AXA — Póliza 86332531", fecha:"2025-10-09", url:"https://onedrive.live.com", acceso:"junta", nota:"Vence 09/10/2026. Capital edificio 8.500.000€. Mediador: Del Cura y Miranda 983344646. Coberturas: incendio, RC, goteras, cristales, robo, daños eléctricos." },
  { id:2,  categoria:"Contratos vigentes", nombre:"Contrato FAIN Ascensores nº 6239157", fecha:"2021-06-05", url:"https://onedrive.live.com", acceso:"junta", nota:"Mantenimiento 3 ascensores. Próxima ITA nov 2028. Urgencias 24h: FAIN Ascensores SA." },
  { id:3,  categoria:"Contratos vigentes", nombre:"Contrato Bluetietar Conserjería y Limpieza", fecha:"2025-04-16", url:"https://onedrive.live.com", acceso:"junta", nota:"Desde 16/04/2025. 1 año prorrogable. 7.151,10€/mes. Contacto: Sergio Martín Benito." },
  { id:4,  categoria:"Contratos vigentes", nombre:"Contrato Gasconfort Naturgy — Caldera", fecha:"2017-06-16", url:"https://onedrive.live.com", acceso:"junta", nota:"10 años. 974,61€/mes. ~19 cuotas restantes en abril 2026. Vence jun 2027. Urgencias: 900 402 020." },
  { id:5,  categoria:"Contratos vigentes", nombre:"Contrato Mantenimiento Ullastres — Caldera (1999)", fecha:"1999-01-01", url:"https://onedrive.live.com", acceso:"junta", nota:"Contrato histórico mantenimiento instalaciones. Revisión anual." },
  { id:6,  categoria:"Contratos vigentes", nombre:"Contrato FAIN — Puerta Garaje (ex-Aluna)", fecha:"2026-03-01", url:"https://onedrive.live.com", acceso:"junta", nota:"435,60€/año. Vence mar 2027." },
  { id:7,  categoria:"Contratos vigentes", nombre:"Contrato Endesa — Suministro Eléctrico 2025", fecha:"2025-01-01", url:"https://onedrive.live.com", acceso:"junta", nota:"Suministro zonas comunes y garaje." },
  { id:8,  categoria:"Contratos vigentes", nombre:"Contrato Labser — Administración de Fincas", fecha:"2024-01-01", url:"https://onedrive.live.com", acceso:"junta", nota:"5.560,51€/año. C/Cristóbal Bordiú 35, Of.209. Tel: 911.690.693." },
  { id:9,  categoria:"Contabilidad", nombre:"Cuentas Anuales 2025-2026", fecha:"2026-03-01", url:"https://onedrive.live.com", acceso:"junta", nota:"Gasto total 264.609,06€. Déficit -55.267,22€. Saldo banco 14.607,61€. Reservas 18.877,31€." },
  { id:10, categoria:"Contabilidad", nombre:"Mayor 2025-2026", fecha:"2026-03-01", url:"https://onedrive.live.com", acceso:"junta", nota:"Libro mayor completo ejercicio 01/03/2025-28/02/2026." },
  { id:11, categoria:"Contabilidad", nombre:"Cuadro cuotas y coeficientes (Cuadro Laura)", fecha:"2025-06-01", url:"https://onedrive.live.com", acceso:"junta", nota:"Reparto según coeficientes catastro. 3 opciones de cuota." },
  { id:12, categoria:"Contabilidad", nombre:"Cuentas y Presupuesto 2023-2024", fecha:"2024-04-15", url:"https://onedrive.live.com", acceso:"junta", nota:"Cuentas ejercicio anterior y presupuesto 2024-2025." },
  { id:13, categoria:"Asuntos legales", nombre:"Demanda laboral — Accidente D. Nicolás Pérez (nº 28426)", fecha:"2025-03-18", url:"https://onedrive.live.com", acceso:"junta", nota:"Fallecimiento 18/03/2025. Juicio previsto 06/05/2027. Abogado: Pedro Zabalo." },
  { id:14, categoria:"Asuntos legales", nombre:"Coral Pomar — Asesoría Propiedad Horizontal", fecha:"2025-01-01", url:"https://onedrive.live.com", acceso:"junta", nota:"Reglamento Régimen Interior y asesoría PH. Honorarios: 2.500€." },
  { id:15, categoria:"Proyectos (junta)", nombre:"Presupuesto Lasser — Ventilación Garaje", fecha:"2025-03-28", url:"https://onedrive.live.com", acceso:"junta", nota:"37.117,15€ + Dirección obra Melius 57.052,23€. Pendiente aprobación junta." },
  { id:16, categoria:"Proyectos (junta)", nombre:"Proyecto Forjados Garaje — Diego Moreno / Melius", fecha:"2025-01-01", url:"https://onedrive.live.com", acceso:"junta", nota:"Estudio estructural forjados garaje sótanos -1 y -2." },
  { id:17, categoria:"Escrituras y estatutos", nombre:"Declaración de Obra y Constitución de Finca", fecha:"1970-01-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Documento fundacional. Arquitecto original: Alberto Martín-Artajo. Año: 1970." },
  { id:18, categoria:"Escrituras y estatutos", nombre:"Certificado División Horizontal y Estatutos", fecha:"1970-01-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Estatutos vigentes. Coeficientes de participación. CIF: E78559812." },
  { id:19, categoria:"Escrituras y estatutos", nombre:"Datos Catastro — Parcela 1561301VK4716B", fecha:"2025-03-25", url:"https://onedrive.live.com", acceso:"todos", nota:"952m² parcela. 9.075m² construida. 18 fincas registrales." },
  { id:20, categoria:"Escrituras y estatutos", nombre:"Licencia de Garaje (1979)", fecha:"1979-01-02", url:"https://onedrive.live.com", acceso:"todos", nota:"Licencia municipal actividad garaje privado e instalación calefacción." },
  { id:21, categoria:"Actas de juntas", nombre:"Acta Junta General Ordinaria — 07/04/2025 (firmada)", fecha:"2025-04-07", url:"https://onedrive.live.com", acceso:"todos", nota:"Última junta ordinaria. Aprobación cuentas 2024-2025." },
  { id:22, categoria:"Actas de juntas", nombre:"Acta Junta General Extraordinaria — 21/10/2024", fecha:"2024-10-21", url:"https://onedrive.live.com", acceso:"todos", nota:"Retroceso cuotas. Acuerdo doble cuota farmacia. Nueva junta de gobierno." },
  { id:23, categoria:"Actas de juntas", nombre:"Acta Junta General Ordinaria — 15/04/2024", fecha:"2024-04-15", url:"https://onedrive.live.com", acceso:"todos", nota:"Cuentas 2023-2024. Derrama 40.000€. Empleados. Obras pendientes." },
  { id:24, categoria:"Actas de juntas", nombre:"Libro de Actas desde 1999", fecha:"2024-01-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Historial completo de acuerdos desde la constitución de la comunidad." },
  { id:25, categoria:"Informes técnicos", nombre:"Informe Avance Trabajos 01/2026 — Edmundo Lindemann", fecha:"2026-04-15", url:"https://onedrive.live.com", acceso:"todos", nota:"Arquitecto COAM 14.314. Estado edificio, reforma 7ºA/4ºB, garaje, filtraciones 7ºB." },
  { id:26, categoria:"Informes técnicos", nombre:"ITE y Manual de Mantenimiento 2022 — César González", fecha:"2022-04-08", url:"https://onedrive.live.com", acceso:"todos", nota:"Arquitecto COAM 7.156. ITE favorable condicionada. Protocolo emergencias." },
  { id:27, categoria:"Informes técnicos", nombre:"Informe Accesibilidad Ascensores — FAIN (mayo 2026)", fecha:"2026-05-08", url:"https://onedrive.live.com", acceso:"todos", nota:"Ninguno de los 3 ascensores cumple CTE DB-SUA. No viable sin obra estructural. Protección legal comunidad." },
  { id:28, categoria:"Informes técnicos", nombre:"Registro IEE Ayuntamiento Almagro 46", fecha:"2022-01-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Informe Evaluación Edificio registrado ante el Ayuntamiento de Madrid." },
  { id:29, categoria:"Proyectos (todos)", nombre:"Anteproyecto Desclasificación Garaje — Lasser", fecha:"2025-04-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Ventilación forzada sótanos -1 y -2. Obligatorio desde 2018." },
  { id:30, categoria:"Proyectos (todos)", nombre:"Reglamento de Régimen Interior (borrador)", fecha:"2026-05-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Para aprobación en junta. Normas uso zonas comunes, obras privativas, garaje." },
  { id:31, categoria:"Proyectos (todos)", nombre:"Memoria de Gestión y Cuentas 2025-2026", fecha:"2026-05-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Documento completo para junta ordinaria 2026. Incluye derramas propuestas." },
  { id:32, categoria:"Convocatorias", nombre:"Convocatoria Junta Extraordinaria — 21/10/2024", fecha:"2024-10-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Orden del día: cuotas, acuerdo farmacia, nueva junta gobierno." },
  { id:33, categoria:"Convocatorias", nombre:"Convocatoria Junta Ordinaria — 15/04/2024", fecha:"2024-03-15", url:"https://onedrive.live.com", acceso:"todos", nota:"Cuentas, presupuesto 2024-2025, obras, empleados." },
  { id:34, categoria:"Comunicaciones", nombre:"Carta informativa obras a vecinos (v2)", fecha:"2026-01-01", url:"https://onedrive.live.com", acceso:"todos", nota:"Comunicación a vecinos sobre actuaciones en curso." },
];

function Repositorio({usuario}) {
  const esPriv=usuario.rol==="admin"||usuario.rol==="junta";
  const [busq,setBusq]=useState("");
  const docs=DOCUMENTOS_INIT.filter(d=>(esPriv||d.acceso==="todos")&&(!busq||d.nombre.toLowerCase().includes(busq.toLowerCase())||d.nota?.toLowerCase().includes(busq.toLowerCase())||d.categoria.toLowerCase().includes(busq.toLowerCase())));
  const categorias=[...new Set(DOCUMENTOS_INIT.filter(d=>esPriv||d.acceso==="todos").map(d=>d.categoria))];
  const catIcons={"Escrituras y estatutos":"📜","Actas de juntas":"📋","Informes técnicos":"🔍","Convocatorias":"📩","Contratos vigentes":"📄","Contabilidad":"💰","Asuntos legales":"⚖️","Proyectos (junta)":"🏗️","Proyectos (todos)":"🏗️","Comunicaciones":"✉️"};
  return <div>
    <input value={busq} onChange={e=>setBusq(e.target.value)} placeholder="🔍  Buscar documento…" style={{...S.inp,marginBottom:16}}/>
    {!esPriv&&<div style={{background:"#fef5e7",border:"1px solid #f39c1240",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#7d5a00"}}>🔒 Algunos documentos son de acceso restringido a la Junta y Administración.</div>}
    {categorias.map(cat=>{
      const lista=docs.filter(d=>d.categoria===cat);
      if(!lista.length)return null;
      return <div key={cat} style={{marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:13,color:"#555",marginBottom:10}}>{catIcons[cat]||"📄"} {cat} <span style={{background:"#eee",color:"#888",borderRadius:20,padding:"1px 8px",fontSize:11,fontWeight:600,marginLeft:4}}>{lista.length}</span></div>
        {lista.map(d=><div key={d.id} style={{...S.card,padding:"12px 16px",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1}}>
              {d.acceso==="junta"&&<span style={{background:"#fef5e7",color:"#e67e22",borderRadius:6,padding:"1px 7px",fontSize:10,fontWeight:700,marginBottom:4,display:"inline-block"}}>🔒 Solo Junta/Admin</span>}
              <div style={{fontWeight:700,fontSize:13,marginBottom:d.nota?4:0}}>{d.nombre}</div>
              {d.nota&&<div style={{fontSize:12,color:"#666",lineHeight:1.5,marginBottom:3}}>{d.nota}</div>}
              <div style={{fontSize:11,color:"#aaa"}}>{d.fecha!=="1970-01-01"&&d.fecha!=="1979-01-02"&&d.fecha!=="1999-01-01"?`📅 ${fmtD(d.fecha)}`:""}</div>
            </div>
            <a href={d.url} target="_blank" rel="noreferrer" style={{background:"#f0f7f3",color:"#1a5c3a",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>📄 Abrir</a>
          </div>
        </div>)}
      </div>;
    })}
  </div>;
}

const FICHA_EDIFICIO={nombre:"Comunidad de Propietarios Almagro 46",direccion:"Calle de Almagro, nº 46, 28010 Madrid",anoConstruccion:1970,arquitectoOriginal:"D. Alberto Martín-Artajo",refCatastral:"1561301VK4716B",superficieParcela:"952 m²",superficieConstruida:"9.075 m² (7.185 sobre rasante + 1.890 bajo rasante)",plantas:"Sótano -2, Sótano -1, Planta Baja, Entresuelo, 1ª a 7ª + Cubierta/Azotea",viviendas:14,locales:4,plazasGaraje:"20 delimitadas (hasta 45 según normativa CTE)",trasteros:18,ascensores:"3 (principal derecho, principal izquierdo, servicio/montacargas)",cif:"E78559812",iban:"ES27 2085 8370 8203 3001 0458",banco:"Ibercaja",ite2022:"César González López-Plaza COAM 7.156 — Favorable condicionada",arquitectoComunidad:"Edmundo Lindemann Quintana COAM 14.314",administrador:"Por confirmar",seguro:"AXA póliza 86332531 — Vence 09/10/2026"};

function FichaEdificio() {
  const f=FICHA_EDIFICIO;
  const campos=[["🏛️ Nombre",f.nombre],["📍 Dirección",f.direccion],["🗓️ Año construcción",f.anoConstruccion],["✏️ Arquitecto original",f.arquitectoOriginal],["🗺️ Ref. Catastral",f.refCatastral],["📐 Superficie parcela",f.superficieParcela],["📐 Superficie construida",f.superficieConstruida],["🏢 Plantas",f.plantas],["🏠 Viviendas",f.viviendas],["🛍️ Locales",f.locales],["🚗 Plazas garaje",f.plazasGaraje],["📦 Trasteros",f.trasteros],["🛗 Ascensores",f.ascensores],["🔢 CIF",f.cif],["🏦 IBAN",f.iban],["🏦 Banco",f.banco],["📋 ITE 2022",f.ite2022],["👷 Arquitecto comunidad",f.arquitectoComunidad],["🛡️ Seguro",f.seguro],["👤 Administrador",f.administrador]];
  return <div>
    <div style={{background:"linear-gradient(135deg,#0f2118,#1a4a2a)",borderRadius:16,padding:"20px 22px",marginBottom:16,color:"#fff"}}>
      <div style={{fontSize:36,marginBottom:8}}>🏛️</div>
      <div style={{fontWeight:800,fontSize:20,marginBottom:4}}>{f.nombre}</div>
      <div style={{fontSize:14,color:"#a8d5b8"}}>{f.direccion}</div>
    </div>
    {campos.map(([l,v],i)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 16px",background:i%2===0?"#fff":"#f9f7f4",borderRadius:8,marginBottom:2,gap:16}}>
      <div style={{fontSize:13,color:"#888",flexShrink:0}}>{l}</div>
      <div style={{fontSize:13,fontWeight:600,color:"#1a2e1a",textAlign:"right"}}>{v}</div>
    </div>)}
  </div>;
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [usuario,setUsuario]=useState(null);
  const [seccion,setSeccion]=useState("tablon");
  const [avisos,setAvisos]=useState(AVISOS_INIT);
  const esPriv=usuario?.rol==="admin"||usuario?.rol==="junta";

  if(!usuario)return <Login onLogin={u=>{setUsuario(u);setSeccion("tablon");}}/>;

  const navVecino=[
    {id:"tablon",     label:"Avisos",        icon:"📋"},
    {id:"circulares", label:"Circulares",    icon:"📢"},
    {id:"votaciones", label:"Votaciones",    icon:"🗳️"},
    {id:"chat",       label:"Consultas",     icon:"💬"},
    {id:"calendario", label:"Calendario",    icon:"📅"},
    {id:"gimnasio",   label:"Gimnasio",      icon:"🏋️"},
    {id:"encargos",   label:"Encargos",      icon:"🛒"},
    {id:"documentos", label:"Documentos",    icon:"📁"},
    {id:"ficha",      label:"El edificio",   icon:"🏛️"},
    {id:"obras",      label:"Mis obras",     icon:"🏗️"},
    {id:"cuotas",     label:"Mis cuotas",    icon:"💳"},
    {id:"derrama",    label:"Simulador",     icon:"🧮"},
    {id:"inquilinos",  label:"Inquilinos",    icon:"🔑"},
  ];
  // Inquilino: igual que vecino pero sin cuotas ni simulador derrama
  const navInquilino=[
    {id:"tablon",     label:"Avisos",        icon:"📋"},
    {id:"circulares", label:"Circulares",    icon:"📢"},
    {id:"votaciones", label:"Votaciones",    icon:"🗳️"},
    {id:"chat",       label:"Consultas",     icon:"💬"},
    {id:"calendario", label:"Calendario",    icon:"📅"},
    {id:"gimnasio",   label:"Gimnasio",      icon:"🏋️"},
    {id:"encargos",   label:"Encargos",      icon:"🛒"},
    {id:"documentos", label:"Documentos",    icon:"📁"},
    {id:"ficha",      label:"El edificio",   icon:"🏛️"},
    {id:"obras",      label:"Mis obras",     icon:"🏗️"},
  ];
  const navPriv=[
    {id:"tablon",     label:"Avisos",        icon:"📋"},
    {id:"junta",      label:"Panel Junta",   icon:"⭐"},
    {id:"circulares", label:"Circulares",    icon:"📢"},
    {id:"votaciones", label:"Votaciones",    icon:"🗳️"},
    {id:"chat",       label:"Chat",          icon:"💬"},
    {id:"calendario", label:"Calendario",    icon:"📅"},
    {id:"gimnasio",   label:"Gimnasio",      icon:"🏋️"},
    {id:"encargos",   label:"Encargos",      icon:"🛒"},
    {id:"contratos",  label:"Contratos",     icon:"📄"},
    {id:"proveedores",label:"Proveedores",   icon:"🏢"},
    {id:"contabilidad",label:"Contabilidad", icon:"📊"},
    {id:"documentos", label:"Documentos",    icon:"📁"},
    {id:"ficha",      label:"El edificio",   icon:"🏛️"},
    {id:"obras",      label:"Obras",         icon:"🏗️"},
    {id:"visitas",    label:"Visitas",       icon:"👷"},
    {id:"cuotas",     label:"Cuotas",        icon:"💳"},
    {id:"derrama",    label:"Simulador",     icon:"🧮"},
  ];
  const nav=esPriv?navPriv:usuario.esInquilino?navInquilino:navVecino;
  const urgentesCount=avisos.filter(a=>["averia","seguridad"].includes(a.categoria)&&a.estado!=="resuelto").length;
  // Contratos próximos a vencer
  const contratosAlerta=CONTRATOS.filter(c=>diasVence(c.vencimiento)<90&&diasVence(c.vencimiento)>0).length;

  return (
    <div style={{minHeight:"100vh",background:"#f4f1ec",fontFamily:"Georgia,serif"}}>
      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,#0f2118,#1a4a2a)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 4px 20px rgba(0,0,0,0.2)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>🏛️</span>
          <div><div style={{color:"#fff",fontWeight:800,fontSize:15}}>Almagro 46</div><div style={{color:"#a8d5b8",fontSize:10}}>Portal Comunidad de Propietarios</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {esPriv&&<span style={{background:"rgba(255,255,255,0.15)",color:"#a8d5b8",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700}}>{usuario.rol==="admin"?"🔐 Admin":"⭐ Junta"}</span>}
          {usuario.esInquilino&&<span style={{background:"rgba(255,255,255,0.15)",color:"#ffd580",borderRadius:10,padding:"2px 8px",fontSize:10,fontWeight:700}}>🔑 Inquilino</span>}
          <span style={{color:"#a8d5b8",fontSize:11}}>{usuario.piso}</span>
          <button onClick={()=>setUsuario(null)} style={{background:"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:11}}>Salir</button>
        </div>
      </div>

      {/* NAV — scroll horizontal */}
      <div style={{background:"#fff",borderBottom:"1px solid #eee",overflowX:"auto",display:"flex",whiteSpace:"nowrap"}}>
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setSeccion(n.id)} style={{...S.tab(seccion===n.id),position:"relative",padding:"11px 12px",fontSize:12,display:"inline-flex",alignItems:"center",gap:4,flexShrink:0}}>
            {n.icon} {n.label}
            {n.id==="junta"&&urgentesCount>0&&<span style={{position:"absolute",top:5,right:2,background:"#c0392b",color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{urgentesCount}</span>}
            {n.id==="contratos"&&contratosAlerta>0&&<span style={{position:"absolute",top:5,right:2,background:"#e67e22",color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{contratosAlerta}</span>}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px"}}>
        {seccion==="tablon"&&(usuario.garaje?.length>0||usuario.local)&&(
          <div style={{background:"#fff",borderRadius:14,padding:"12px 16px",marginBottom:14,border:"1.5px solid #e8f4ec",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{flex:1}}><div style={{fontSize:10,color:"#888",marginBottom:1}}>Tu propiedad</div><div style={{fontWeight:800,fontSize:14,color:"#1a2e1a"}}>{usuario.piso}</div></div>
            {usuario.local&&<div style={{textAlign:"center",background:"#f0f7f3",borderRadius:10,padding:"6px 12px"}}><div style={{fontSize:14}}>🏪</div><div style={{fontSize:10,fontWeight:700,color:"#1a5c3a"}}>Local comercial</div><div style={{fontSize:12,fontWeight:800}}>{usuario.piso}</div></div>}
            {usuario.garaje?.length>0&&<div style={{textAlign:"center",background:"#f0f7f3",borderRadius:10,padding:"6px 12px"}}><div style={{fontSize:14}}>🚗</div><div style={{fontSize:10,fontWeight:700,color:"#1a5c3a"}}>Plaza{usuario.garaje.length>1?"s":""}</div><div style={{fontSize:12,fontWeight:800}}>{usuario.garaje.join("·")}</div></div>}
            {usuario.trastero?.length>0&&<div style={{textAlign:"center",background:"#f0f7f3",borderRadius:10,padding:"6px 12px"}}><div style={{fontSize:14}}>📦</div><div style={{fontSize:10,fontWeight:700,color:"#1a5c3a"}}>Trastero{usuario.trastero.length>1?"s":""}</div><div style={{fontSize:12,fontWeight:800}}>{usuario.trastero.join("·")}</div></div>}
          </div>
        )}

        {seccion==="tablon"&&<Tablon usuario={usuario} avisos={avisos} setAvisos={setAvisos}/>}
        {seccion==="junta"&&esPriv&&<div><div style={{fontWeight:800,fontSize:18,color:"#1a2e1a",marginBottom:14}}>⭐ Panel de Incidencias — Junta</div><PanelJunta avisos={avisos} setAvisos={setAvisos}/></div>}
        {seccion==="circulares"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>📢 Circulares</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>{esPriv?"Envía comunicados a todos los vecinos":"Comunicados de la Junta y la Administración"}</div><Circulares usuario={usuario}/></div>}
        {seccion==="votaciones"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>🗳️ Votaciones exprés</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Decisiones menores sin necesidad de convocar junta</div><Votaciones usuario={usuario}/></div>}
        {seccion==="chat"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>💬 {esPriv?"Chat con vecinos":"Consultas privadas"}</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>{esPriv?"Conversaciones privadas con cada propietario":"Canal privado con la Administración"}</div><ChatPrivado usuario={usuario}/></div>}
        {seccion==="calendario"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>📅 Calendario comunitario</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Obras, visitas, vencimientos y eventos del edificio</div><Calendario usuario={usuario}/></div>}
        {seccion==="gimnasio"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:14}}>🏋️ Reserva de Gimnasio</div><ReservaGimnasio usuario={usuario}/></div>}
        {seccion==="encargos"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>🛒 Encargos</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Compras, presupuestos y órdenes de trabajo{!esPriv?" · Solo lectura":""}</div><Encargos usuario={usuario}/></div>}
        {seccion==="contratos"&&esPriv&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>📄 Contratos</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Solo visible para Junta y Administración</div><Contratos/></div>}
        {seccion==="proveedores"&&esPriv&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:14}}>🏢 Directorio de Proveedores</div><Proveedores/></div>}
        {seccion==="contabilidad"&&esPriv&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>📊 Contabilidad</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Ejercicio 2025-2026 — Solo Junta y Admin</div><Contabilidad/></div>}
        {seccion==="documentos"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>📁 Repositorio de Documentos</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Estatutos, actas, licencias e informes técnicos</div><Repositorio usuario={usuario}/></div>}
        {seccion==="ficha"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:14}}>🏛️ El Edificio</div><FichaEdificio/></div>}
        {seccion==="obras"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>🏗️ Obras Privativas</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Solicitud y seguimiento de autorizaciones</div><ObrasPrivativas usuario={usuario}/></div>}
        {seccion==="visitas"&&esPriv&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>👷 Registro de Visitas</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Entrada y salida de proveedores y técnicos</div><RegistroVisitas usuario={usuario}/></div>}
        {seccion==="cuotas"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>💳 {esPriv?"Historial de Cuotas":"Mis cuotas"}</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>{esPriv?"Consulta el historial de cualquier propietario":"Tu historial de pagos"}</div><HistorialCuotas usuario={usuario}/></div>}
        {seccion==="derrama"&&<div><div style={{fontWeight:800,fontSize:17,marginBottom:4}}>🧮 Simulador de Derramas</div><div style={{fontSize:13,color:"#888",marginBottom:14}}>Calcula cuánto correspondería a cada propietario</div><SimuladorDerramas/></div>}
        {seccion==="inquilinos"&&esPriv&&<GestionInquilinos/>}
      </div>
    </div>
  );
}