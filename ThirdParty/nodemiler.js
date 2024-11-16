const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user:  process.env.nodemilerPsaa ,
    pass: process.env.nodemilerUser ,
  },
});



 module.exports.AccountVerification = async (token, userid, email, name) => {
 


  try {
    const info = await transporter.sendMail({
      to: `${email}`,
      subject: 'Cybersecurity Community at Horizon Campus',
      text: 'Hello, please activate your account by clicking the button below.',
      html: ` <div style="text-align: center;">
<div>
    <h2><strong>Welcome ${name} !</strong>   Activate Your Account</h2>
    <p>Thank you for signing up! Please click the button below to activate your account.</p>

    <!-- Image section -->
    <div style=" text-align: center;">
        <img src="https://www.shutterstock.com/image-vector/3d-user-account-blue-mark-600nw-2447443531.jpg"
            alt="Activate Your Account"
            style="width: 100%; max-width: 300px; display: block; margin: 0 auto; border-radius: 10px;">

    </div>
    <br>
    <!-- Activation Button -->
    <a href="http://localhost:6969/verifid?userid=${userid}&token=${token}&email=${email}"
        style="display: inline-block; padding: 10px 20px; background-color: #264bb3; color: white; text-decoration: none; border-radius: 10px; ">Activate
        Now</a>


    <p style="max-width: 30rem;"><strong style="color: red;">Important:</strong> If you do not confirm your account
        within 7 days, it will be 
        deleted. Please make
        sure to
        activate it before the deadline.</p>

    <p style="color: rgb(255, 44, 44);">If you did not sign up, please ignore this email.</p>
    </div>

</div>`,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (e) {
    console.log(e);
  }
}

// AccountVerification("dfsafasdf", "dfasfdsaf", "itbin-22110127@horizoncampus.edu.lk", "name").catch(console.error);