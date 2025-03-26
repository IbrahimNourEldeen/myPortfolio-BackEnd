const Message = require('../models/contact.model')


const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({}, { __v: 0 });

        res.status(200).json({
            status: 'success',
            data: {
                messages
            }
        })
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Server error" });
    }
}


const getMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId, { __v: 0 })

        if (!message) {
            return res.status(404).json({
                status: 'fail',
                data: {
                    message: "message not found"
                }
            })
        }
        return res.status(200).json({
            status: 'success',
            data: {
                message
            }
        })
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "error in Server" });
    }
}

const addMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body);

        await newMessage.save();

        return res.status(201).json({
            status: 'success',
            data: {
                message: 'added successfully'
            }
        });

    } catch (err) {

        if (err.name === "ValidationError") {
            return res.status(400).json({
                status: "fail",
                data: {
                    message: "Invalid input data",
                    errors: err.errors
                }
            });
        }

        return res.status(500).json({ status: "error", message: "Server error" });
    }
}

const deleteMessage = async (req, res) => {

    const { messageId } = req.params;
    await Message.findByIdAndDelete(messageId)
        .then(() => {
            res.status(200).json({
                status: "success",
                data: {
                    message:"Deleted Successfully"
                }
            })
        }).catch(()=>{
            res.status(500).json({ status: "error", message: "Server error" });
        })

}

const deleteAllMessages = async (req, res) => {

    await Message.deleteMany({})
        .then(() => {
            res.status(200).json({
                status: "success",
                data: {
                    message:"Deleted Successfully"
                }
            })
        }).catch(()=>{
            res.status(500).json({ status: "error", message: "Server error" });
        })

}

module.exports = {
    getAllMessages,
    getMessage,
    addMessage,
    deleteMessage,
    deleteAllMessages
}