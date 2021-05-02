import jwt from 'jsonwebtoken';


export const generateToken = (user) => {
    return jwt.sign(
        {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || 'somethingsecret',
        {
        expiresIn: '30d',
        }
    );
};

// as in orderRouter.js we do not have any information which
// user created the order, we need to define middleware to
// authenticate user
export const isAuth = (req, res, next) => {
    // get the authorization field of headers of this request
    const authorization = req.headers.authorization;
    if(authorization){
        const token = authorization.slice(7, authorization.length);
                    //   Bearrer XXXXXXX
                    // i 01234567->token part 
        // decrypt the token
        jwt.verify(
            token,
            process.env.JWT_SECRET || 'somethingsecret',
            (err, decode) => {
            if(err) {
                res.status(401).send({ message: 'Invalid Token'});
                } else {
                    // decode = information about this user
                    req.user = decode;
                    // by calling next we pass user as a property of request to the middleware
                    next();
                        } 
                    }
                );
            } else {
                res.status(401).send({ message: 'No Token'});
            }
};

// function to authenticate onli admin users --> to protect the API
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Admin Token'});
    }
} 