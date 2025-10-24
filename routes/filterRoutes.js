import express from 'express';
import { filterItems, getFilterOptions } from '../controller/filterController.js';

const filterRouter = express.Router();

// Filter items endpoint
filterRouter.get('/items', filterItems);

// Get filter options endpoint
filterRouter.get('/options', getFilterOptions);

export default filterRouter;