import User from '../model/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import roles from '../server/roles.js'

export const grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: 'You don\'t have enough permission to perform this action'
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

export const allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: 'You need to be logged in to access this route'
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export const signUp = async (req, res) => {
    try {
        const {username, password, role} = req.body
        const hashedPassword = await hashPassword(password)
        const newUser = new User({username, password: hashedPassword, role: role || 'basic'});
        newUser.accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })
        await newUser.save();
        res.status(200).json(newUser)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) return res.status(404).json({error: `No user with username: ${username}`})

        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return res.status(404).json({error: `Incorrect password`})

        const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        await User.findByIdAndUpdate(user._id, {accessToken})
        res.status(200).json({
            data: {username: user.username, role: user.role},
            accessToken
        })
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const getUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
}

export const getUserByUserName = async (req, res) => {
    try {
        if (req.headers["x-access-token"]) {
            const accessToken = req.headers["x-access-token"];
            const {userId} = await jwt.verify(accessToken, process.env.JWT_SECRET);

            const {username} = req.query
            const user = await User.findOne({username})
            if (!user) return res.status(404).json({error: `No user with username: ${username}`})
            if (user._id.toString() !== userId) return res.status(403).json({error: `Cannot read other users`})

            res.status(200).json(user)
        } else {
            return res.status(401).json({error: `Unauthorized access`})
        }
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const updateUser = async (req, res) => {
    try {
        const update = req.body
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, update);
        res.status(200).json({message: 'User has been updated'});
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({message: 'User has been deleted'});
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

