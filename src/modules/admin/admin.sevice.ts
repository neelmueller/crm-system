import prisma from "../../config/prisma";

export async function getAllAppointments(customer_id: number){
    const allUserAppointments = await prisma.appointments.findMany({
        include: {
            users: true,
            
        }
    })
}