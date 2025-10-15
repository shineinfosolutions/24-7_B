import express from 'express';
import { universalSearch, voiceSearch, searchSuggestions } from '../controller/searchController.js';

const searchRouter = express.Router();

// Universal search endpoint
searchRouter.get('/universal', universalSearch);

// Voice search endpoint
searchRouter.post('/voice', voiceSearch);

// Search suggestions endpoint
searchRouter.get('/suggestions', searchSuggestions);

export default searchRouter;