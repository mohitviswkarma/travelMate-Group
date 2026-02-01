package com.travelmate.service.email;

import java.util.Properties;

import org.springframework.stereotype.Service;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final String FROM_EMAIL = "visheshtechie15@gmail.com";
    private static final String APP_PASSWORD = "flnofldhtlevsdme";

    public void sendOtp(String toEmail, String otp) {

        try {
            Properties props = new Properties();
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");

            Session session = Session.getInstance(
                props,
                new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(
                            FROM_EMAIL,
                            APP_PASSWORD
                        );
                    }
                }
            );

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(FROM_EMAIL));
            message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(toEmail)
            );
            message.setSubject("Your TravelMate OTP");
            message.setText(
                "Your OTP is: " + otp + "\n\nValid for 5 minutes."
            );

            Transport.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email OTP", e);
        }
    }
}
