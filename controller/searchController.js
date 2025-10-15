import Itemmodel from "../models/itemmodel.js";
import categoryModel from "../models/categorymodel.js";
import Addonmodel from "../models/addonmodel.js";

// Universal Search Controller
const universalSearch = async (req, res) => {
    try {
        const { query, type = 'all' } = req.query;
        
        if (!query) {
            return res.json({ success: false, message: "Search query is required" });
        }

        console.log(`Search query: ${query}, type: ${type}`);
        const searchRegex = new RegExp(query, 'i');
        let results = {};

        // Search Items
        if (type === 'all' || type === 'items') {
            const items = await Itemmodel.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex },
                    { longDescription: searchRegex }
                ]
            }).populate('category').limit(20);
            results.items = items;
        }

        // Search Categories
        if (type === 'all' || type === 'categories') {
            const categories = await categoryModel.find({
                category: searchRegex
            }).limit(10);
            results.categories = categories;
        }

        // Search Addons
        if (type === 'all' || type === 'addons') {
            const addons = await Addonmodel.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex }
                ]
            }).limit(10);
            results.addons = addons;
        }

        res.json({
            success: true,
            query,
            results,
            totalResults: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Voice Search Endpoint
const voiceSearch = async (req, res) => {
    try {
        const { transcript } = req.body;
        
        if (!transcript) {
            return res.json({ success: false, message: "Voice transcript is required" });
        }

        // Process voice transcript for search
        const searchQuery = transcript.toLowerCase().trim();
        
        // Extract search intent and query
        let actualQuery = searchQuery;
        let searchType = 'all';

        // Simple intent recognition
        if (searchQuery.includes('category') || searchQuery.includes('categories')) {
            searchType = 'categories';
            actualQuery = searchQuery.replace(/category|categories/g, '').trim();
        } else if (searchQuery.includes('addon') || searchQuery.includes('addons')) {
            searchType = 'addons';
            actualQuery = searchQuery.replace(/addon|addons/g, '').trim();
        } else if (searchQuery.includes('item') || searchQuery.includes('food')) {
            searchType = 'items';
            actualQuery = searchQuery.replace(/item|food/g, '').trim();
        }

        // Remove common voice search phrases
        actualQuery = actualQuery
            .replace(/search for|find|show me|get me|i want|looking for/g, '')
            .trim();

        if (!actualQuery) {
            return res.json({ success: false, message: "Could not extract search query from voice input" });
        }

        // Perform search with extracted query
        const searchRegex = new RegExp(actualQuery, 'i');
        let results = {};

        if (searchType === 'all' || searchType === 'items') {
            const items = await Itemmodel.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex },
                    { longDescription: searchRegex }
                ]
            }).populate('category').limit(20);
            results.items = items;
        }

        if (searchType === 'all' || searchType === 'categories') {
            const categories = await categoryModel.find({
                category: searchRegex
            }).limit(10);
            results.categories = categories;
        }

        if (searchType === 'all' || searchType === 'addons') {
            const addons = await Addonmodel.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex }
                ]
            }).limit(10);
            results.addons = addons;
        }

        res.json({
            success: true,
            originalTranscript: transcript,
            processedQuery: actualQuery,
            searchType,
            results,
            totalResults: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Search Suggestions
const searchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.length < 2) {
            return res.json({ success: true, suggestions: [] });
        }

        const searchRegex = new RegExp(query, 'i');
        
        const [itemNames, categoryNames] = await Promise.all([
            Itemmodel.find({ name: searchRegex }).select('name').limit(5),
            categoryModel.find({ category: searchRegex }).select('category').limit(3)
        ]);

        const suggestions = [
            ...itemNames.map(item => ({ text: item.name, type: 'item' })),
            ...categoryNames.map(cat => ({ text: cat.category, type: 'category' }))
        ];

        res.json({ success: true, suggestions });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { universalSearch, voiceSearch, searchSuggestions };