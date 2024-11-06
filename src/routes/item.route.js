
import express from "express"; 
import prisma from "../prisma.js";

const router = express.Router();

router.get("/", async (req, res) =>{
    try {
        const items = await prisma.item.findMany({
            include:{
                category: true
            }
        });
        res.status(200).json({ success: true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to retrieve items", error: error.message });
    }
});

router.get("/:item_id", async (req, res) =>{
    const {id} = req.params;
    try {
        const item = await prisma.item.findUnique({
            where:{
                item_id: id
            },
            include:{
                category: true
            }
        })

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to retrieve item", error: error.message });
    }
})

export default router;
