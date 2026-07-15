import { getAllAppointments, updateAppointment, getAllCustomers } from "./admin.sevice";
import { Router } from 'express'
import { authenticateUser as authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from "../../middleware/role.middleware";


const router = Router();

router.get('/admin/appointments', authMiddleware, requireRole('admin'), async (req, res) =>{
    try {
        const appointments = await getAllAppointments();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }     
});

router.patch('/admin/appointments/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    const appointment_id = parseInt(String(req.params.id), 10);
    
    if (isNaN(appointment_id)) {
        return res.status(400).json({ message: 'Ungültige Termin-ID' });
    }
    const { status, admin_notes, scheduled_at } = req.body;
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
    if (scheduled_at !== undefined) updateData.scheduled_at = new Date(scheduled_at);

    try {
        const updated = await updateAppointment(appointment_id, updateData);
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});

router.get('/admin/costumers', authMiddleware, requireRole('admin'), async (req, res) =>{
    try {
        const customers = await getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;