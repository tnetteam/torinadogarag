// Test script for AI content generation
const fs = require('fs');
const path = require('path');

// Read Gemini settings
function readGeminiSettings() {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'gemini-settings.json');
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading Gemini settings:', error);
  }
  return null;
}

// Test API endpoint
async function testAIContentGeneration() {
  const settings = readGeminiSettings();
  
  if (!settings?.apiKey) {
    console.error('❌ Gemini API key not configured');
    return;
  }

  console.log('🚀 Testing AI content generation...');
  console.log('📝 API Key:', settings.apiKey.substring(0, 10) + '...');

  try {
    // Test single blog post generation
    console.log('\n📖 Generating single blog post...');
    const response = await fetch('http://localhost:3000/api/ai-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate-blog'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Blog post generated successfully!');
      console.log('📄 Title:', result.data.title);
      console.log('📝 Category:', result.data.category);
      console.log('🏷️ Tags:', result.data.tags.slice(0, 3).join(', '));
      console.log('📊 Content length:', result.data.content.length, 'characters');
    } else {
      console.error('❌ Error generating blog post:', result.message);
    }

    // Test custom content generation
    console.log('\n🎯 Testing custom content generation...');
    const customResponse = await fetch('http://localhost:3000/api/ai-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate-custom',
        customRequest: {
          keyword: 'تعمیر موتور BMW',
          specificTopic: 'تشخیص و تعمیر مشکلات موتور BMW X5',
          length: 'long',
          targetAudience: 'expert'
        }
      })
    });

    const customResult = await customResponse.json();
    
    if (customResult.success) {
      console.log('✅ Custom blog post generated successfully!');
      console.log('📄 Title:', customResult.data.title);
      console.log('📝 Category:', customResult.data.category);
      console.log('📊 Content length:', customResult.data.content.length, 'characters');
    } else {
      console.error('❌ Error generating custom blog post:', customResult.message);
    }

    // Test batch generation
    console.log('\n📚 Testing batch generation...');
    const batchResponse = await fetch('http://localhost:3000/api/ai-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate-batch',
        count: 2
      })
    });

    const batchResult = await batchResponse.json();
    
    if (batchResult.success) {
      console.log('✅ Batch generation completed!');
      console.log('📄 Generated posts:', batchResult.data.length);
      batchResult.data.forEach((post, index) => {
        console.log(`  ${index + 1}. ${post.title}`);
      });
    } else {
      console.error('❌ Error in batch generation:', batchResult.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test cron job
async function testCronJob() {
  console.log('\n⏰ Testing cron job...');
  
  try {
    const response = await fetch('http://localhost:3000/api/cron', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'run-cron',
        force: true
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Cron job executed successfully!');
      console.log('📄 Generated posts:', result.data.generatedPosts.length);
      console.log('⏭️ Next run:', result.data.nextRun);
    } else {
      console.error('❌ Cron job failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Cron test failed:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🧪 AI Content Generation Test Suite');
  console.log('=====================================');
  
  await testAIContentGeneration();
  await testCronJob();
  
  console.log('\n✨ Tests completed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAIContentGeneration, testCronJob };
