import {
    createContact,
    getContacts,
    getContactByName,
    getContactById,
    deleteContactById,
    updateContactById
} from '../controller/contactController.js'
import express from 'express';

const router = express.Router();

router.get('/', getContacts);
router.get('/name', getContactByName);
router.get('/:id', getContactById);
router.post('/', createContact);
router.put('/:id', updateContactById);
router.delete('/:id', deleteContactById);

// Export API routes
export default router;