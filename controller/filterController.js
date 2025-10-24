import Itemmodel from "../models/itemmodel.js";
import categoryModel from "../models/categorymodel.js";

// Advanced Filter Controller
const filterItems = async (req, res) => {
    try {
        const {
            category,
            veg,
            minPrice,
            maxPrice,
            rating,
            available,
            sortBy = 'name',
            sortOrder = 'asc',
            page = 1,
            limit = 20
        } = req.query;

        let filter = {};
        let sort = {};

        // Category filter
        if (category) {
            filter.category = category;
        }

        // Veg/Non-veg filter
        if (veg !== undefined) {
            filter.veg = veg === 'true';
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Rating filter
        if (rating) {
            filter.rating = { $gte: parseFloat(rating) };
        }

        // Availability filter
        if (available !== undefined) {
            filter.available = available === 'true';
        }

        // Sorting
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const items = await Itemmodel.find(filter)
            .populate('category')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const totalItems = await Itemmodel.countDocuments(filter);

        res.json({
            success: true,
            items,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalItems / parseInt(limit)),
                totalItems,
                hasNext: skip + items.length < totalItems,
                hasPrev: parseInt(page) > 1
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get filter options
const getFilterOptions = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).select('_id category');
        
        const priceRange = await Itemmodel.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: { $toDouble: "$price" } },
                    maxPrice: { $max: { $toDouble: "$price" } }
                }
            }
        ]);

        const ratingRange = await Itemmodel.aggregate([
            {
                $group: {
                    _id: null,
                    minRating: { $min: "$rating" },
                    maxRating: { $max: "$rating" }
                }
            }
        ]);

        res.json({
            success: true,
            filterOptions: {
                categories,
                priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 },
                ratingRange: ratingRange[0] || { minRating: 0, maxRating: 5 },
                vegOptions: [
                    { value: true, label: 'Vegetarian' },
                    { value: false, label: 'Non-Vegetarian' }
                ],
                sortOptions: [
                    { value: 'name', label: 'Name' },
                    { value: 'price', label: 'Price' },
                    { value: 'rating', label: 'Rating' },
                    { value: 'deliveryTime', label: 'Delivery Time' }
                ]
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { filterItems, getFilterOptions };