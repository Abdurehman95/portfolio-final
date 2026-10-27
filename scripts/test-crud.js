const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pbowfuwmeziybftgzdfy.supabase.co';
const supabaseAnonKey = 'sb_publishable_yBbUdGwLtg0dHwqUMLq3aA_9LLUn_sl';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runComprehensiveCrudTests() {
  console.log('--- STARTING COMPREHENSIVE SUPABASE CRUD TESTS ---');
  let allPassed = true;

  // 1. SERVICES CRUD
  console.log('\n[1] Testing Services CRUD:');
  try {
    const { data: initialSvcs, error: rErr } = await supabase.from('services').select('*').order('id', { ascending: true });
    if (rErr) throw rErr;
    console.log(`  ✓ READ: Successfully fetched ${initialSvcs.length} services.`);

    const testSvc = {
      icon: 'code',
      title: '__TEST_SVC__',
      description: 'Temporary service for testing',
      tags: ['TestTag'],
      color: 'primary',
      active: true
    };
    const { data: insData, error: cErr } = await supabase.from('services').insert([testSvc]).select();
    if (cErr) throw cErr;
    const testSvcId = insData[0].id;
    console.log(`  ✓ CREATE: Created test service with ID ${testSvcId}.`);

    const { error: uErr } = await supabase.from('services').update({ title: '__TEST_SVC_UPDATED__' }).eq('id', testSvcId);
    if (uErr) throw uErr;
    console.log(`  ✓ UPDATE: Updated test service ID ${testSvcId}.`);

    const { error: dErr } = await supabase.from('services').delete().eq('id', testSvcId);
    if (dErr) throw dErr;
    console.log(`  ✓ DELETE: Deleted test service ID ${testSvcId}.`);
  } catch (err) {
    allPassed = false;
    console.error('  ✗ Services CRUD test failed:', err.message);
  }

  // 2. PROJECTS CRUD
  console.log('\n[2] Testing Projects CRUD:');
  try {
    const { data: projs, error: rErr } = await supabase.from('projects').select('*');
    if (rErr) throw rErr;
    console.log(`  ✓ READ: Successfully fetched ${projs.length} projects.`);

    const testProj = {
      title: '__TEST_PROJ__',
      subtitle: 'Test Subtitle',
      description: 'Test description',
      category: 'Web',
      status: 'Draft',
      featured: false,
      technologies: 'React, Node',
      image: '/tms.png'
    };
    const { data: insData, error: cErr } = await supabase.from('projects').insert([testProj]).select();
    if (cErr) throw cErr;
    const testProjId = insData[0].id;
    console.log(`  ✓ CREATE: Created test project with ID ${testProjId}.`);

    const { error: uErr } = await supabase.from('projects').update({ title: '__TEST_PROJ_UPDATED__' }).eq('id', testProjId);
    if (uErr) throw uErr;
    console.log(`  ✓ UPDATE: Updated test project ID ${testProjId}.`);

    const { error: dErr } = await supabase.from('projects').delete().eq('id', testProjId);
    if (dErr) throw dErr;
    console.log(`  ✓ DELETE: Deleted test project ID ${testProjId}.`);
  } catch (err) {
    allPassed = false;
    console.error('  ✗ Projects CRUD test failed:', err.message);
  }

  // 3. SKILLS CRUD
  console.log('\n[3] Testing Skills CRUD:');
  try {
    const { data: skills, error: rErr } = await supabase.from('skills').select('*');
    if (rErr) throw rErr;
    console.log(`  ✓ READ: Successfully fetched ${skills.length} skills.`);

    const testSkill = { name: '__TEST_SKILL__', category: 'Frontend', proficiency: 90, icon: 'code', color: 'primary', active: true };
    const { data: insData, error: cErr } = await supabase.from('skills').insert([testSkill]).select();
    if (cErr) throw cErr;
    const testSkillId = insData[0].id;
    console.log(`  ✓ CREATE: Created test skill with ID ${testSkillId}.`);

    const { error: uErr } = await supabase.from('skills').update({ proficiency: 95 }).eq('id', testSkillId);
    if (uErr) throw uErr;
    console.log(`  ✓ UPDATE: Updated test skill ID ${testSkillId}.`);

    const { error: dErr } = await supabase.from('skills').delete().eq('id', testSkillId);
    if (dErr) throw dErr;
    console.log(`  ✓ DELETE: Deleted test skill ID ${testSkillId}.`);
  } catch (err) {
    allPassed = false;
    console.error('  ✗ Skills CRUD test failed:', err.message);
  }

  // 4. TECHNOLOGIES CRUD
  console.log('\n[4] Testing Technologies CRUD:');
  try {
    const { data: techs, error: rErr } = await supabase.from('technologies').select('*');
    if (rErr) throw rErr;
    console.log(`  ✓ READ: Successfully fetched ${techs.length} technologies.`);

    const testTech = { name: '__TEST_TECH__', proficiency: 85, category: 'Database' };
    const { data: insData, error: cErr } = await supabase.from('technologies').insert([testTech]).select();
    if (cErr) throw cErr;
    const testTechId = insData[0].id;
    console.log(`  ✓ CREATE: Created test technology with ID ${testTechId}.`);

    const { error: uErr } = await supabase.from('technologies').update({ proficiency: 90 }).eq('id', testTechId);
    if (uErr) throw uErr;
    console.log(`  ✓ UPDATE: Updated test technology ID ${testTechId}.`);

    const { error: dErr } = await supabase.from('technologies').delete().eq('id', testTechId);
    if (dErr) throw dErr;
    console.log(`  ✓ DELETE: Deleted test technology ID ${testTechId}.`);
  } catch (err) {
    allPassed = false;
    console.error('  ✗ Technologies CRUD test failed:', err.message);
  }

  // 5. HERO CONTENT
  console.log('\n[5] Testing Hero Content (Read & Update):');
  try {
    const { data: hero, error: rErr } = await supabase.from('hero_content').select('*').single();
    if (rErr) throw rErr;
    console.log(`  ✓ READ: Fetched hero title: "${hero.title}".`);

    const { error: uErr } = await supabase.from('hero_content').update({ cta_text: 'Hire Me' }).eq('id', 1);
    if (uErr) throw uErr;
    console.log(`  ✓ UPDATE: Hero content updated successfully.`);
  } catch (err) {
    allPassed = false;
    console.error('  ✗ Hero Content test failed:', err.message);
  }

  // 6. ABOUT CONTENT
  console.log('\n[6] Testing About Content (Read & Update):');
  try {
    const { data: about, error: rErr } = await supabase.from('about_content').select('*').single();
    if (rErr) throw rErr;
    console.log(`  ✓ READ: Fetched about heading: "${about.heading}".`);

    const { error: uErr } = await supabase.from('about_content').update({ years_experience: 3 }).eq('id', 1);
    if (uErr) throw uErr;
    console.log(`  ✓ UPDATE: About content updated successfully.`);
  } catch (err) {
    allPassed = false;
    console.error('  ✗ About Content test failed:', err.message);
  }

  // 7. MESSAGES CRUD
  console.log('\n[7] Testing Messages CRUD:');
  try {
    const { data: msgs, error: rErr } = await supabase.from('messages').select('*');
    if (rErr) throw rErr;
    console.log(`  ✓ READ: Fetched ${msgs.length} messages.`);

    const testMsg = {
      name: '__TEST_SENDER__',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message body',
      is_read: false
    };
    const { data: insData, error: cErr } = await supabase.from('messages').insert([testMsg]).select();
    if (cErr) throw cErr;
    const testMsgId = insData[0].id;
    console.log(`  ✓ CREATE: Created test message with ID ${testMsgId}.`);

    const { error: uErr } = await supabase.from('messages').update({ is_read: true }).eq('id', testMsgId);
    if (uErr) throw uErr;
    console.log(`  ✓ UPDATE: Marked test message ID ${testMsgId} as read.`);

    const { error: dErr } = await supabase.from('messages').delete().eq('id', testMsgId);
    if (dErr) throw dErr;
    console.log(`  ✓ DELETE: Deleted test message ID ${testMsgId}.`);
  } catch (err) {
    allPassed = false;
    console.error('  ✗ Messages CRUD test failed:', err.message);
  }

  console.log('\n=============================================');
  if (allPassed) {
    console.log('🎉 ALL SUPABASE CRUD OPERATIONS PASSED WITH 100% SUCCESS!');
  } else {
    console.log('⚠️ Some CRUD tests failed. Please review the errors above.');
  }
  console.log('=============================================\n');
}

runComprehensiveCrudTests();
