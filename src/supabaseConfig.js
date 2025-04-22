import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lytjtbtvuhnpnhtjgbzu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dGp0YnR2dWhucG5odGpnYnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyODc0MDIsImV4cCI6MjA2MDg2MzQwMn0.609twHK4qWk_q1dUNC3KY2QPZOKuqGHvPm4GEgSV-yQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);