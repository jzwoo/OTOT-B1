const Contact = require('./contactModel')
const mongoose = require('mongoose')

const createContact = async (req, res) => {
    const {name, contact} = req.body

    try {
        const newContact = await Contact.create({name, contact})
        res.status(200).json(newContact)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({})
        res.status(200).json(contacts)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

const getContactById = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: `No contact with id: ${id}`})
    }

    try {
        const contact = await Contact.findById(id)
        if (!contact) return res.status(404).json({error: `No contact with id: ${id}`})

        res.status(200).json(contact)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

const getContactByName = async (req, res) => {
    const {name} = req.query

    try {
        const contact = await Contact.findOne({name: name})
        if (!contact) return res.status(404).json({error: `No contact with name: ${name}`})

        res.status(200).json(contact)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

const deleteContactById = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: `No contact with id: ${id}`})
    }

    try {
        const contact = await Contact.findOneAndDelete({_id: id})
        if (!contact) return res.status(400).json({error: `No contact with id: ${id}`})

        res.status(200).json({ message: 'successful delete' })
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

const updateContactById = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: `No contact with id: ${id}`})
    }

    try {
        const contact = await Contact.findOneAndUpdate({_id: id}, {...req.body})
        if (!contact) return res.status(400).json({error: `No contact with id: ${id}`})

        res.status(200).json({ message: 'successful update' })
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}


module.exports = {
    createContact,
    getContacts,
    getContactById,
    getContactByName,
    deleteContactById,
    updateContactById
}
