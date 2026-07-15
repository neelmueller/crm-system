import prisma from "../../config/prisma";
import { appointments } from "../../generated/prisma/client";

export async function getAllAppointments(){
    const allUserAppointmentsAdmin = await prisma.appointments.findMany({
        include: {
            users: true,
        },
        orderBy: {
            created_at: 'desc'
        }
    })
    return allUserAppointmentsAdmin;
};

export async function updateAppointment(appointment_id: number, data: Partial<appointments>) {
   const updateAppointmentAdmin = prisma.appointments.update({
    where: {
        id: appointment_id
    },
    data: data
   })
};

export async function getAllCustomers(){
    return await prisma.user.findMany({
      where: {
        role: 'customer'
      },
      include: { 
        _count: {
          select: { appointments: true } 
        }
      }
    })
};

export async function blockDate(blocked_date: string, reason: string){
    const checkBlockDate = await prisma.blocked_dates.findFirst({
        where: {
            blocked_date
        }
    })
    if(!checkBlockDate){
        throw new Error ('No blocked Date found');
    }
    const blockDate = await prisma.blocked_dates.create({
        data: {
            blocked_date,
            reason
        }
    })
    return blockDate;
};

export async function unblockDate(blocked_date: string){
    const unblockDate = await prisma.blocked_dates.delete({
        where: {
            blocked_date
        }
    })
    return unblockDate;
}

export async function getBlockedDates(){
    const getAllBlockedDates = await prisma.blocked_dates.findMany({
        orderBy: {
            blocked_date: 'desc'
        }
    })
};