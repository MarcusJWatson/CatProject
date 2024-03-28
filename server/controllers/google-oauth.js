const client_id = process.env.GOOGLE_CLIENT_ID;
const jwtDecode = require("jwt-decode");
const sessionAuth = require('./session-auth');

const User = require('../models/user-model');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();
async function verify(jwt) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: jwt,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        return userid && true;
    }
    catch (e) {
        return false;
    }
}

async function googleOAuthAlreadyExists(credential) {
    return await User.findOne({
        'OAuthConfig.credential': credential,
        'OAuthConfig.provider': 'google',
    });
}

module.exports = {
    verifyJwt: async (jwt) => {
        return await verify(jwt);
    },

    loginOAuth: async (req, res) => {
        const decoded = jwtDecode.jwtDecode(req.body.jwt);
        if (await verify(req.body.jwt)) {
            let alreadyExists = await googleOAuthAlreadyExists(decoded.email);
            if (alreadyExists) {
                delete alreadyExists.password;
                const t = await sessionAuth.beginSession(alreadyExists);
                res.send({
                    status: 'success',
                    token: t,
                    user: alreadyExists,
                    needsSignup: false,
                });
                return true;
            }
            else {
                return false;
            }
        }
        else {
            res.status(403).send({
                status: 'failed',
                reason: 'invalid Google token'
            });
            return false;
        }
    },

    signUpOAuth: async (req, res) => {
        const decoded = jwtDecode.jwtDecode(req.body.oauth.jwt);
        const ableToAdd = !(await alreadyExists(decoded.email));

        return (ableToAdd ? 
                {
                    provider: 'google',
                    credential: decoded.email
                }
            :
                null
            );
    }
}
