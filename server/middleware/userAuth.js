import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    // Support both cookie (local dev) and Authorization header (cross-domain production)
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' })
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id };
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' })
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default userAuth;