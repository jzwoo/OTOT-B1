import {
    allowIfLoggedin,
    grantAccess,
    signUp,
    login,
    getUsers,
    getUserByUserName,
    updateUser,
    deleteUser
} from '../controller/userController.js'
import express from 'express';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/username', allowIfLoggedin, grantAccess('readOwn', 'profile'), getUserByUserName);
router.get('/all', allowIfLoggedin, grantAccess('readAny', 'profile'), getUsers);
router.put('/:userId', allowIfLoggedin, grantAccess('updateAny', 'profile'), updateUser);
router.delete('/:userId', allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteUser);

// Export API routes
export default router;