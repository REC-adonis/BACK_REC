import prisma from "../prisma.js";

export const addOrUpdateShippingInfo = async (req, res) => {
    const { address, city, state, postal_code, phone_number } = req.body;
    const userId = req.user_id;

    try {
        if (!address || !city || !state || !postal_code || !phone_number) {
            throw new Error("All fields are required");
        }

        const existingShipping = await prisma.shipping_info.findFirst({
            where: {
                user_id: userId,
            },
        });

        if (existingShipping) {
            const updatedShipping = await prisma.shipping_info.update({
                where: { shipping_id: existingShipping.shipping_id },  // Actualiza basado en el ID de shipping
                data: {
                    address: address,
                    city: city,
                    state: state,
                    postal_code: postal_code,
                    phone_number: phone_number,
                },
            });

            return res.status(200).json({ success: true, message: "Shipping info updated successfully", updatedShipping });
        } else {
            const newShipping = await prisma.shipping_info.create({
                data: {
                    address: address,
                    city: city,
                    state: state,
                    postal_code: postal_code,
                    phone_number: phone_number,
                    user: {
                        connect: { user_id: userId },
                    },
                },
            });

            return res.status(201).json({ success: true, message: "Shipping info created successfully", newShipping });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const removeShippingInfo = async(req, res) =>{
    const userId = req.user_id;
    try {
        const shipping = await prisma.shipping_info.findFirst({
            where: {
                user_id:userId
            }
        });
        if(!shipping){ return res.status(404).json({ success: false, message: "Shipping info not found" }); }

        await prisma.shipping_info.delete({
            where: {
                user_id:userId
            }
        })
        return res.status(200).json({ success: true, message: "Shipping info deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}