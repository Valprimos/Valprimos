// Configuración de conexión a Supabase — Valprimos
// Este archivo se incluye en todas las páginas que necesitan leer datos dinámicos.
const SUPABASE_URL = 'https://irizjulswygrelggibhf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tfxD5nycuZAL-fQ_g0O-xA_V8bYmvO4';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
