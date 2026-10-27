const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://pbowfuwmeziybftgzdfy.supabase.co',
  'sb_publishable_yBbUdGwLtg0dHwqUMLq3aA_9LLUn_sl'
);

const tables = [
  'projects',
  'services',
  'skills',
  'technologies',
  'messages',
  'hero_content',
  'about_content',
  'experience'
];

async function checkAllTables() {
  for (const t of tables) {
    const { data, error } = await client.from(t).select('*').limit(3);
    if (error) {
      console.log(`Table "${t}": ERROR -> ${error.message}`);
    } else {
      console.log(`Table "${t}": SUCCESS (${data.length} sample rows)`);
    }
  }
}

checkAllTables();
