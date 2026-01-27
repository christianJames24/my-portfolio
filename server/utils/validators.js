// server/utils/validators.js
const { body, param, query, validationResult } = require('express-validator');
const validator = require('validator');
const xss = require('xss');

/**
 * Custom XSS sanitizer that strips HTML tags and prevents script injection
 */
const sanitizeInput = (value) => {
    if (typeof value !== 'string') return value;
    
    // Strip all HTML tags and sanitize
    const sanitized = xss(value, {
        whiteList: {}, // No HTML tags allowed
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script', 'style']
    });
    
    return sanitized.trim();
};

/**
 * Custom validator for checking allowed page names
 */
const isValidPage = (value) => {
    const validPages = ['about', 'resume', 'home', 'contact_info'];
    return validPages.includes(value);
};

/**
 * Custom validator for language codes
 */
const isValidLanguage = (value) => {
    const validLanguages = ['en', 'fr'];
    return validLanguages.includes(value);
};

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Validation rules for different routes
 */

// Message submission validation
const validateMessage = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .customSanitizer(sanitizeInput)
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .isLength({ max: 255 }).withMessage('Email is too long'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters')
        .customSanitizer(sanitizeInput),
    handleValidationErrors
];

// Comment submission validation
const validateComment = [
    body('text')
        .trim()
        .notEmpty().withMessage('Comment text is required')
        .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
        .customSanitizer(sanitizeInput),
    body('user_name')
        .trim()
        .notEmpty().withMessage('User name is required')
        .isLength({ max: 100 }).withMessage('User name is too long')
        .customSanitizer(sanitizeInput)
        .escape(),
    body('user_picture')
        .optional()
        .trim()
        .isURL().withMessage('Invalid user picture URL'),
    handleValidationErrors
];

// Page content validation
const validatePageContent = [
    param('page')
        .trim()
        .notEmpty().withMessage('Page name is required')
        .custom(isValidPage).withMessage('Invalid page name'),
    query('lang')
        .optional()
        .trim()
        .custom(isValidLanguage).withMessage('Invalid language code'),
    handleValidationErrors
];

// Content update validation
const validateContentUpdate = [
    param('page')
        .trim()
        .notEmpty().withMessage('Page name is required')
        .custom(isValidPage).withMessage('Invalid page name'),
    body('language')
        .optional()
        .trim()
        .custom(isValidLanguage).withMessage('Invalid language code'),
    body('content')
        .notEmpty().withMessage('Content is required')
        .custom((value) => {
            // Validate that content is a valid object
            if (typeof value !== 'object' || value === null) {
                throw new Error('Content must be a valid object');
            }
            return true;
        }),
    handleValidationErrors
];

// Field update validation
const validateFieldUpdate = [
    param('page')
        .trim()
        .notEmpty().withMessage('Page name is required')
        .custom(isValidPage).withMessage('Invalid page name'),
    body('field')
        .trim()
        .notEmpty().withMessage('Field name is required')
        .isLength({ max: 100 }).withMessage('Field name is too long'),
    body('value')
        .notEmpty().withMessage('Value is required'),
    body('language')
        .optional()
        .trim()
        .custom(isValidLanguage).withMessage('Invalid language code'),
    handleValidationErrors
];

// Project validation
const validateProject = [
    body('name_en')
        .trim()
        .notEmpty().withMessage('English name is required')
        .isLength({ max: 200 }).withMessage('English name is too long')
        .customSanitizer(sanitizeInput),
    body('name_fr')
        .trim()
        .notEmpty().withMessage('French name is required')
        .isLength({ max: 200 }).withMessage('French name is too long')
        .customSanitizer(sanitizeInput),
    body('description_en')
        .trim()
        .notEmpty().withMessage('English description is required')
        .isLength({ max: 2000 }).withMessage('English description is too long')
        .customSanitizer(sanitizeInput),
    body('description_fr')
        .trim()
        .notEmpty().withMessage('French description is required')
        .isLength({ max: 2000 }).withMessage('French description is too long')
        .customSanitizer(sanitizeInput),
    body('tech')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Tech is too long')
        .customSanitizer(sanitizeInput),
    body('year')
        .optional()
        .isInt({ min: 1900, max: 2100 }).withMessage('Invalid year'),
    body('image')
        .optional()
        .trim(),
    body('image_id')
        .optional()
        .trim(),
    body('sort_order')
        .optional()
        .isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer'),
    handleValidationErrors
];

// Project reorder validation
const validateProjectReorder = [
    body('projectId')
        .notEmpty().withMessage('Project ID is required')
        .isInt({ min: 1 }).withMessage('Invalid project ID'),
    body('direction')
        .trim()
        .notEmpty().withMessage('Direction is required')
        .isIn(['up', 'down']).withMessage('Direction must be "up" or "down"'),
    handleValidationErrors
];

// ID parameter validation
const validateId = [
    param('id')
        .notEmpty().withMessage('ID is required')
        .isInt({ min: 1 }).withMessage('Invalid ID'),
    handleValidationErrors
];

module.exports = {
    sanitizeInput,
    handleValidationErrors,
    validateMessage,
    validateComment,
    validatePageContent,
    validateContentUpdate,
    validateFieldUpdate,
    validateProject,
    validateProjectReorder,
    validateId,
    isValidPage,
    isValidLanguage
};
