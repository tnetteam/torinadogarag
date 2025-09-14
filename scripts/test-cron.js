// Test script for Cron Job system
const fs = require('fs');
const path = require('path');

// Test cron job execution
async function testCronJob() {
  console.log('🧪 Testing Cron Job System');
  console.log('==========================');
  
  try {
    // Test 1: Check cron status
    console.log('\n📊 1. Checking cron status...');
    const statusResponse = await fetch('http://localhost:3000/api/cron-control', {
      method: 'GET'
    });
    
    const statusResult = await statusResponse.json();
    if (statusResult.success) {
      console.log('✅ Cron status:', statusResult.data);
    } else {
      console.log('❌ Failed to get cron status:', statusResult.message);
    }
    
    // Test 2: Start cron scheduler
    console.log('\n🚀 2. Starting cron scheduler...');
    const startResponse = await fetch('http://localhost:3000/api/cron-control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'start'
      })
    });
    
    const startResult = await startResponse.json();
    if (startResult.success) {
      console.log('✅ Cron scheduler started:', startResult.message);
    } else {
      console.log('❌ Failed to start cron scheduler:', startResult.message);
    }
    
    // Test 3: Force run cron job
    console.log('\n⚡ 3. Force running cron job...');
    const runResponse = await fetch('http://localhost:3000/api/cron', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'run-cron',
        force: true
      })
    });
    
    const runResult = await runResponse.json();
    if (runResult.success) {
      console.log('✅ Cron job executed:', runResult.message);
      console.log('📄 Generated posts:', runResult.data.generatedPosts.length);
      runResult.data.generatedPosts.forEach((post, index) => {
        console.log(`  ${index + 1}. ${post.title}`);
      });
    } else {
      console.log('❌ Cron job failed:', runResult.message);
    }
    
    // Test 4: Check final status
    console.log('\n📊 4. Final cron status...');
    const finalStatusResponse = await fetch('http://localhost:3000/api/cron-control', {
      method: 'GET'
    });
    
    const finalStatusResult = await finalStatusResponse.json();
    if (finalStatusResult.success) {
      console.log('✅ Final cron status:', finalStatusResult.data);
    }
    
    // Test 5: Check blog posts
    console.log('\n📚 5. Checking blog posts...');
    const blogPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    if (fs.existsSync(blogPath)) {
      const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
      console.log(`✅ Total blog posts: ${blogData.length}`);
      if (blogData.length > 0) {
        console.log('📄 Latest posts:');
        blogData.slice(0, 3).forEach((post, index) => {
          console.log(`  ${index + 1}. ${post.title} (${post.createdAt})`);
        });
      }
    } else {
      console.log('❌ Blog posts file not found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test cron settings
function testCronSettings() {
  console.log('\n⚙️ Testing Cron Settings');
  console.log('========================');
  
  const cronPath = path.join(process.cwd(), 'data', 'cron-settings.json');
  
  if (fs.existsSync(cronPath)) {
    const settings = JSON.parse(fs.readFileSync(cronPath, 'utf8'));
    console.log('✅ Cron settings found:');
    console.log('  - Enabled:', settings.enabled);
    console.log('  - Interval:', settings.interval);
    console.log('  - Posts per run:', settings.postsPerRun);
    console.log('  - Last run:', settings.lastRun);
    console.log('  - Topics count:', settings.topics?.length || 0);
  } else {
    console.log('❌ Cron settings file not found');
  }
}

// Test gemini settings
function testGeminiSettings() {
  console.log('\n🤖 Testing Gemini Settings');
  console.log('===========================');
  
  const geminiPath = path.join(process.cwd(), 'data', 'gemini-settings.json');
  
  if (fs.existsSync(geminiPath)) {
    const settings = JSON.parse(fs.readFileSync(geminiPath, 'utf8'));
    console.log('✅ Gemini settings found:');
    console.log('  - API Key:', settings.apiKey ? 'Configured' : 'Not configured');
    console.log('  - Model:', settings.model);
    console.log('  - Enabled:', settings.enabled);
  } else {
    console.log('❌ Gemini settings file not found');
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Cron Job System Test Suite');
  console.log('==============================');
  
  testCronSettings();
  testGeminiSettings();
  await testCronJob();
  
  console.log('\n✨ Tests completed!');
  console.log('\n📝 Notes:');
  console.log('- Cron scheduler runs every hour to check for scheduled jobs');
  console.log('- Articles are generated based on the interval setting (daily/weekly/monthly)');
  console.log('- Use /api/cron-control to start/stop the scheduler');
  console.log('- Use /api/cron with force=true to run immediately');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCronJob, testCronSettings, testGeminiSettings };
