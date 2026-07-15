import {cancelAppointment, createAppointment, getCostumerAppointments} from '../appointments/appointments.service';
import { Router } from 'express'
import { authenticateUser as authMiddleware } from '../../middleware/auth.middleware';
const router = Router();

export default router;


router.post('/createAppointment', authMiddleware, async (req, res) => {
    const costumer_id = req.user?.userId;
    const {title, description, scheduled_at, duration_minutes} = req.body;
    if(!costumer_id || !title || !description ||!scheduled_at ||!duration_minutes){
        console.log('Input is missing');
        res.status(400);
        throw new Error('Input is missing');
    }
    try{
        const createAppointmentUser = await createAppointment( costumer_id, {title, description, scheduled_at, duration_minutes});
        res.status(200).json('Appointment created successfull');
    }catch(error){
        res.status(400).json({message: (error as Error).message});
    }
});

router.patch('/cancelAppointment', authMiddleware ,async (req, res) => {
    const costumer_id = req.user?.userId;
    const {appointment_id} = req.body;
    if(!appointment_id || !costumer_id){
        console.log('AppointmentId and CostumerID is not equal');
        res.status(400);
        throw new Error('AppointmentId and CostumerID is not equal');
    }
    try{
        const cancelAppointmentUser = await cancelAppointment(appointment_id, costumer_id);
        res.status(200).json('Appointment canceled successfull');
    }catch(error){
        res.status(400).json({message: (error as Error).message});
    }
})

router.get('/getCostumerAppointments',authMiddleware, async (req, res) => {
    const costumer_id = req.user?.userId;
    if (!costumer_id) {
        console.log('Failed Inquiry');
        return res.status(400).json({ message: 'Failed Inquiry' });
    }
    try{
        const getCostumerAppointmentsUser = await getCostumerAppointments(costumer_id);
        return res.status(200).json(getCostumerAppointmentsUser);
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
});