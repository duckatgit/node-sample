const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointment,
  updateAppointment,
  getAppointmentById,
  updateAppointmentDate,
  cancelAppointment,
  getAllAppointments,
  getInstantMeeting,
  updateInstantMeeting,
  updateAppointmentStatus,
} = require("../controllers/scheduleController");

router.get("/get-appointment", getAppointment);
router.get("/get-appointment-by-id/:appointmentId", getAppointmentById);
router.post("/create-appointment", createAppointment);
router.put("/update-appointment", updateAppointment);
router.put("/update-appointment-date", updateAppointmentDate);
router.delete("/cancel-appointment/:appointmentId", cancelAppointment);
router.get("/get-all-appointments", getAllAppointments);
router.get("/get-instant-meeting", getInstantMeeting);
router.put("/update-instant-meeting", updateInstantMeeting);
router.put("/update-appointment-status", updateAppointmentStatus);

module.exports = router;
