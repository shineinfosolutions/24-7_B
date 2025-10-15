import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api/search';

async function testSearch() {
    try {
        console.log('Testing Universal Search...');
        
        // Test universal search
        const response = await fetch(`${API_BASE}/universal?query=pizza`);
        const data = await response.json();
        
        console.log('Search Results:', JSON.stringify(data, null, 2));
        
        // Test suggestions
        const sugResponse = await fetch(`${API_BASE}/suggestions?query=pi`);
        const sugData = await sugResponse.json();
        
        console.log('Suggestions:', JSON.stringify(sugData, null, 2));
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testSearch();