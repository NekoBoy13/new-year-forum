// Конфигурация Supabase
const SUPABASE_URL = 'https://fiaiqaulexfqgchjaklu.supabase.co'; // Замените на ваш URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYWlxYXVsZXhmcWdjaGpha2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjAzNDMsImV4cCI6MjA3ODczNjM0M30.2Vq_wBPrtu2A_2uyPfhhDhW4MdnDvljw3KAHTn6cxec'; // Замените на ваш ключ

// Инициализация Supabase клиента
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);