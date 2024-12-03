const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized token'
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - invalid token'
            })
        }

        req.user = {
            id: decodedToken.userId,
            role: decodedToken.role,
            username: decodedToken.username,
        };

        next();
    } catch (error) {
        console.log('Verification error', error);
        return res.status(401).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = authenticateToken;
