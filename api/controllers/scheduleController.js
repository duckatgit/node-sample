const { failAction, successAction } = require("../utils/response");
const {
  getAppointmentUser,
  createAppointmentUser,
  updateAppointmentUser,
  getAppointmentByIdUser,
  updateAppointmentDateUser,
  cancelAppointmentUser,
  getAllAppointmentsUser,
  getInstantMeetingUser,
  updateInstantMeetingUser,
  updateAppointmentStatusUser,
} = require("../services/scheduleService");
const { verifyAuthToken } = require("../services/commonService");

// Function to get appointment
exports.getAppointment = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getAppointmentUser(
      authData.userId,
      authData.practiceLink
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Function to get specific appointment
exports.getAppointmentById = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getAppointmentByIdUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to create appointment
exports.createAppointment = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await createAppointmentUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update appointment
exports.updateAppointment = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateAppointmentUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update appointment date
exports.updateAppointmentDate = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateAppointmentDateUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to cancel appointment
exports.cancelAppointment = async function (req, res) {
  const payload = req.params;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await cancelAppointmentUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to cancel appointment
exports.getAllAppointments = async function (req, res) {
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getAllAppointmentsUser(
      authData.userId,
      authData.practiceLink
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to get Instant Meeting
exports.getInstantMeeting = async function (req, res) {
  const userType = req.query.userType;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await getInstantMeetingUser(
      authData.userId,
      authData.loginUserId,
      userType,
      authData.practiceLink
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Function to Update Instant Meeting
exports.updateInstantMeeting = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateInstantMeetingUser(
      authData.userId,
      authData.loginUserId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update appointment status
exports.updateAppointmentStatus = async function (req, res) {
  const payload = req.body;
  try {
    const authData = await verifyAuthToken(req.headers?.authorization);
    const data = await updateAppointmentStatusUser(
      authData.userId,
      authData.practiceLink,
      payload
    );
    res.status(200).json(successAction(data, "Success!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
