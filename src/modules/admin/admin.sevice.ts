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
}

export async function updateAppointment(appointment_id: number, data: Partial<appointments>) {
   const updateAppointmentAdmin = prisma.appointments.update({
    where: {
        id: appointment_id
    },
    data: data
   })
}

export async function getAllCustomers() {
    return await prisma.user.findMany({
      where: {
        role: 'customer'
      },
      include: { 
        _count: {
          select: { appointments: true } 
        }
      }
    });
  }
