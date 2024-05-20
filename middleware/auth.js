const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token!= null) {
        token = token.split(' ')[1];
        console.log(token);
        try {

            let user = jwt.verify(token, process.env.JWT_SECRET);

            res.json({
                "status": "success",
                "userId": user.uid,
            });

        } catch (err) {
            return res.status(401).json({
                "error": "Unauthorized",
            });
        }

    } else {
        return res.status(401).json({
            "error": "Unauthorized",
        });
    }

};

module.exports = auth;
