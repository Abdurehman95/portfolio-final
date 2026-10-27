const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://pbowfuwmeziybftgzdfy.supabase.co',
  'sb_publishable_yBbUdGwLtg0dHwqUMLq3aA_9LLUn_sl'
);

async function checkProjects() {
  const { data, error } = await client.from('projects').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Supabase query error:', error);
  } else {
    console.log(`Found ${data.length} projects in Supabase:`);
    data.forEach((p) => {
      console.log(`- ID: ${p.id} | Title: "${p.title}" | Status: "${p.status}" | Category: "${p.category}"`);
    });
  }
}

checkProjects();
