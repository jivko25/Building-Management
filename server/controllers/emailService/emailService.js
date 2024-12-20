const { createEmail } = require("../../utils/email");


const sendMail = async (req, res, next) => {
  try {
    await createEmail(req.body.receiver, req.body.subject, req.body.text);
    res.status(200).json({
      success: true,
      message: "Email sent"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMail
};
