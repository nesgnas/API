const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token!= null) {
        token = token.split(' ')[1];
        //console.log(token);
        try {

            let user = jwt.verify(token, process.env.JWT_SECRET);

            // res.json({
            //     "status": "success",
            //     "userId": user.uid,
            // });
            next()

        } catch (err) {
            return res.status(401).json({
                "error": "Unauthorized--1",
            });
        }

    } else {
        return res.status(401).json({
            "error": "Unauthorized--2",
        });
    }

};

module.exports = auth;
