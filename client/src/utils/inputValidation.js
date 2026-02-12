// client/src/utils/inputValidation.js

/**
 * Sanitize user input by removing potentially harmful characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove HTML tags
    let sanitized = input.replace(/<[^>]*>/g, '');

    // Remove script tags and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Trim whitespace
    return sanitized.trim();
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate string length
 * @param {string} str - The string to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidLength = (str, min, max) => {
    const length = str.trim().length;
    return length >= min && length <= max;
};

/**
 * Validate name field
 * @param {string} name - The name to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, error: 'Name is required' };
    }

    if (!isValidLength(name, 2, 100)) {
        return { isValid: false, error: 'Name must be between 2 and 100 characters' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate email field
 * @param {string} email - The email to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
        return { isValid: true, error: '' };
    }

    // Allow "anonymous" to pass validation for non-logged in users
    if (email === "anonymous") {
        return { isValid: true, error: '' };
    }

    if (!isValidEmail(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    if (email.length > 255) {
        return { isValid: false, error: 'Email is too long' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate message field
 * @param {string} message - The message to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateMessage = (message) => {
    if (!message || message.trim().length === 0) {
        return { isValid: false, error: 'Message is required' };
    }

    if (!isValidLength(message, 10, 5000)) {
        return { isValid: false, error: 'Message must be between 10 and 5000 characters' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate comment text
 * @param {string} text - The comment text to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateComment = (text) => {
    if (!text || text.trim().length === 0) {
        return { isValid: false, error: 'Comment cannot be empty' };
    }

    if (!isValidLength(text, 1, 1000)) {
        return { isValid: false, error: 'Comment must be between 1 and 1000 characters' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate all contact form fields
 * @param {object} formData - The form data with name, email, and message
 * @returns {object} - Validation result with isValid and errors object
 */
export const validateContactForm = (formData) => {
    const errors = {};

    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
    }

    const messageValidation = validateMessage(formData.message);
    if (!messageValidation.isValid) {
        errors.message = messageValidation.error;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
