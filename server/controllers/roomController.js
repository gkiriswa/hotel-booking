import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";
import fs from "fs";
// Configure Cloudinary - ADD THIS!
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// API to create a new room for a hotel
export const createRoom = async (req, res) => { 
  try {
    console.log("=== CREATE ROOM REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Number of files:", req.files ? req.files.length : 0);
    
    if (req.files) {
      req.files.forEach((file, index) => {
        console.log(`File ${index}:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path, // Will be undefined if using memoryStorage
          buffer: file.buffer ? `Buffer (${file.buffer.length} bytes)` : 'No buffer'
        });
      });
    }
    
    const { roomType, pricePerNight, amenities, name, description, capacity } = req.body;
    
    // Find hotel
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: "No Hotel found for this owner" 
      });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image"
      });
    }

    console.log("Uploading images to Cloudinary...");
    
    // Upload images to Cloudinary
    const imageUrls = [];
    
    for (const file of req.files) {
      try {
        // Check if file has buffer (memory storage) or path (disk storage)
        let uploadResult;
        
        if (file.buffer) {
          // File is in memory buffer (memoryStorage)
          console.log(`Uploading from buffer: ${file.originalname}`);
          
          // Convert buffer to base64
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype};base64,${b64}`;
          
          uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: 'hotel-rooms',
            resource_type: 'auto'
          });
          
        } else if (file.path) {
          // File is on disk (diskStorage)
          console.log(`Uploading from path: ${file.path}`);
          uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: 'hotel-rooms',
            resource_type: 'auto'
          });       
      // Clean up temp file
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Failed to delete temp file: ${file.path}`);
        });
        } else {
          throw new Error('File has neither buffer nor path');
        }
        
        console.log(`✓ Uploaded: ${uploadResult.secure_url}`);
        imageUrls.push(uploadResult.secure_url);
        
      } catch (uploadError) {
        console.error(`Failed to upload ${file.originalname}:`, uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    }

    console.log("Creating room in database...");
    
    // Parse amenities safely
    let amenitiesArray = [];
    if (amenities) {
      try {
        amenitiesArray = typeof amenities === 'string' 
          ? JSON.parse(amenities) 
          : amenities;
      } catch (parseError) {
        console.warn("Could not parse amenities:", parseError.message);
        amenitiesArray = [];
      }
    }
    
    // Create the room
    const newRoom = await Room.create({
      hotel: hotel._id,
      name: name || `${roomType} Room`, // Add name field
      description: description || "", // Add description
      roomType,
      pricePerNight: Number(pricePerNight),
      capacity: capacity ? Number(capacity) : 2, // Add capacity
      amenities: amenitiesArray,
      images: imageUrls,
      isAvailable: true
    });

    console.log("✅ Room created successfully:", newRoom._id);
    
    res.status(201).json({ 
      success: true, 
      message: "Room created successfully",
      room: newRoom
    });
    
  } catch (error) {
    console.error("❌ ERROR creating room:", error.message);
    console.error("Stack trace:", error.stack);
    
    // More specific error messages
    let errorMessage = error.message;
    
    if (error.message.includes('Cloudinary')) {
      errorMessage = "Image upload failed. Please check Cloudinary configuration.";
    } else if (error.message.includes('JSON')) {
      errorMessage = "Invalid amenities format. Please provide valid JSON.";
    } else if (error.message.includes('validation failed')) {
      errorMessage = "Room validation failed. Please check all required fields.";
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// API to get all rooms
export const getRooms = async (req, res) => {
try {
    const rooms = await Room.find({isAvailable: true}).populate({
    path: 'hotel',
    populate:{
    path: 'owner',
    select: 'image'
    }
    }).sort({createdAt: -1 })
    res.json({success: true, rooms});
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
}

// API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotelData) {
       return res.status(404).json({ success: false, message: "No Hotel found" });
        }
    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");
    res.json({success: true, rooms});
} catch (error) {
    res.json({success: false, message: error.message});
}

}
// API to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
        if (!roomData) {
        return res.status(404).json({ success: false, message: "Room not found" });
    }
    await roomData.save();
    res.json({ success: true, message: "Room availability Updated" });
} catch (error) {
    res.json({success: false, message: error.message});
}

}