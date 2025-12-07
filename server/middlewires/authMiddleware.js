import { verifyToken, getUserById } from '../models/authModel.js';

// Protect routes - Check if user is authenticated
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Get token from header: "Bearer TOKEN"
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = verifyToken(token);

            // Get user from token
            const user = await getUserById(decoded.id);

            // Add user to request object
            req.user = user;

            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};
