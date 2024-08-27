import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your Email Address",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Verification Email",
    });

    console.log("Verification email sent", response);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "4396bb15-8467-4193-828a-12867306d7bd",
      template_variables: {
        name: name,
      },
    });

    console.log("Welcome email sent", response);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Verification Email",
    });

    console.log("Password Reset email sent", response);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send verification email");
  }
};

export const sendSuccessPasswordResetEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password Reset email sent", response);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send verification email");
  }
};
