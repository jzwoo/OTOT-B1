const {
    createContact,
    getContacts,
    getContactByName,
    getContactById,
    deleteContactById,
    updateContactById
} = require('./contactController');
const router = require('express').Router();

router.get('/', getContacts);
router.get('/name', getContactByName);
router.get('/:id', getContactById);
router.post('/', createContact);
router.put('/:id', updateContactById);
router.delete('/:id', deleteContactById);

// Export API routes
module.exports = router;