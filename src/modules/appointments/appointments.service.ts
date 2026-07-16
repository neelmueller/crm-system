import prisma from '../../config/prisma';
import { CreateAppointmentInput } from '../appointments/appointment.types';

export async function createAppointment(customer_id: number, data: CreateAppointmentInput){
    const checkBlockedDate = new Date(data.scheduled_at).toISOString().split('T')[0];
    const isBlocked = await prisma.blocked_dates.findMany({
      where: {
        blocked_date: checkBlockedDate
      }  
    });
    if(isBlocked){throw new Error('The Day is Blocked')}
    const hour = new Date(data.scheduled_at).getHours();
    if(hour >= 22 || hour < 10) {
        throw new Error('Appointments can only be booked between 10:00 a.m. and 10:00 p.m.');
    }

    const existingAppointment = await prisma.appointments.findFirst({
        where: {
            customer_id,
            OR: [
                { status: 'pending' },
                { status: 'confirmed' }
            ]
        }
    });

    if (existingAppointment) {
        throw new Error('You already have a pending appointment');
    }

    const { title, description, scheduled_at, duration_minutes } = data;
    const newAppointment = await prisma.appointments.create({
        data: {
            customer_id,
            title,
            description,
            scheduled_at: new Date(scheduled_at),
            duration_minutes,
            status: 'pending'
        }
    });

    return newAppointment;
};

export async function getCostumerAppointments(customer_id: number){
    const findCostumerAppointments = await prisma.appointments.findMany({
        where: { customer_id },
        orderBy: { scheduled_at: 'desc' }
    })
    return findCostumerAppointments
};

export async function cancelAppointment(appointment_id: number, customer_id: number){
    const findUniqueAppointmentId = await prisma.appointments.findUnique({
        where: { id: appointment_id }
    })
    if(findUniqueAppointmentId === null){
        throw new Error('Appointment not found');
    }
    if(findUniqueAppointmentId?.customer_id == customer_id){
        const appointmentStatusCheck = await prisma.appointments.findFirst({
            where: {
                    id: appointment_id,
                OR:
                [
                    {status: 'pending'},
                    {status: 'confirmed'}
                ]
            }
        })
        if(!appointmentStatusCheck){
            throw new Error('Appointment can not be deleted');
        }
        const deleteAppointment = await prisma.appointments.update({
            where: { id: appointment_id },
            data: { status: 'cancelled' }
        })
         return deleteAppointment;
    }else{
        throw new Error('AppointmentCostumerId does not match with CostumerId');
    }
};