

const express = require('express');
const Code = require('../models/Code');
const codeRouter = express.Router();

codeRouter.post('/save-code', async (req, res) => {
    const { roomId, jsCode,cssCode,htmlCode } = req.body;
   


    if (!roomId ) {
        return res.status(400).json({ message: 'Invalid roomId or code' });
    }

    try {
     
        let room = await Code.findOne({ roomId });
        if (!room) {
            
            room = new Code({
                roomId,
                jsCode,
                cssCode,
                htmlCode
            });
            await room.save();
            // console.log(`New room created with ID: ${roomId}`);
            return res.status(201).json({ message: 'Code saved successfully' });
        } else {
           
            room.jsCode = jsCode;
            room.cssCode = cssCode;
            room.htmlCode = htmlCode;
            await room.save();
            // console.log(`Code updated for room ID: ${roomId}`);
            return res.status(200).json({ message: 'Code updated successfully' });
        }
    } catch (err) {
        // console.error('Error saving code:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

codeRouter.post("/get-code", async (req, res) => {

    
     const {roomId}= req.body;
        // console.log(`Room ID: ${roomId}`);
        try{
            const response= await Code.findOne({roomId});
            if(response)
            {
                return res.status(200).json({data:response});
            }
            else{
                return res.status(404).json({message:'Code not found'});
            }
        }
        catch(err)
        {
            // console.error('Error fetching code:', err);
            return res.status(500).json({message:'Internal Server Error'});
        }

})

codeRouter.post("/create-room", async (req, res) => {
    const { roomId } = req.body;
    try{
             const room= new Code({
                roomId
             })

                const response=await room.save();
                console.log(response);
                res.send(response)
    }
    catch(err)
    {
        // console.error('Error creating room:', err);
        return res.status(500).json({message:'Internal Server Error'});
    }


})

        

module.exports = codeRouter;