import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./email.templates.js";

export const sendVerificationEmail = async(email, verificationToken) =>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject: "Verify your email!",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification",
        });

        console.log("Email send succefully", response);
    } catch (error) {
        console.log("Error sending verification email", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async(email, name) =>{
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "8f978fca-91bd-4b19-8933-ce3f70e838c7",
            template_variables: {
                company_info_name: "REC",
                name: name
            }
        });

        console.log("Welcome email sent succefully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
		throw new Error(`Error sending welcome email: ${error}`);
    }
}

export const sendPasswordResetEmail = async(email, resetURL) =>{
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset"
        });
    } catch (error) {
        console.error(`Error sending password reset email`, error);
		throw new Error(`Error sending password reset email: ${error}`);
    }
}

export const sendEmailResetSucces = async(email) =>{
    const recipient =[{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });
        
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error(`Error sending password reset success email`, error);
		throw new Error(`Error sending password reset success email: ${error}`);
    }
}