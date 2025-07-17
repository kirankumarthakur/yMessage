import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersSidebar = async(req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filtered = await User.find({_id: {$ne: loggedInUserId}}).select('-password')
    res.status(200).json(filtered)
  } catch (err) {
    console.log(`Error in getUsersSidebar ${err.message}`)
    res.status(500).json({error: 'Internal server error'})
  }
}

export const getMessages = async(req, res) => {
  try {
    const {id: paramId} = req.params
    const curId = req.user._id
    const messages = await Message.find({
      $or:[
        {senderId: curId, receiverId: paramId},
        {senderId: paramId, receiverId: curId}
      ]
    })
    req.status(200).json(messages)
  } catch(err) {
    console.log(`Error in getUsersSidebar ${err.message}`)
    res.status(500).json({error: 'Internal server error'})
  }
}

export const sendMessage = async(req, res) => {
  try {
    const {text, image} = req.body
    const {id: paramId} = req.params
    const curId = req.user._id;
    let imageUrl;
    if (image) {
      const response = await cloudinary.uploader.upload(image)
      imageUrl = response.secure_url
    }
    const msg = new Message({
      senderId: curId,
      receiverId: paramId,
      text,
      image: imageUrl
    })
    await msg.save();
    res.status(201).json(msg)
  } catch (err) {
    console.log(`Error in getUsersSidebar ${err.message}`)
    res.status(500).json({error: 'Internal server error'})
  }
}