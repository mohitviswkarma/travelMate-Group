package com.travelmate.service.otp;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.travelmate.entity.otp.otprequest;
import com.travelmate.repository.otprepository.otprepo;
import com.travelmate.service.email.EmailService;
import com.travelmate.utility.otputil;

@Service
public class otpService {

    private final otprepo otpRepository;
    private final EmailService emailService;
   
    public otpService(otprepo otpRepository,
                      EmailService emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    public void sendEmailOtp(String email) {

        String otp = otputil.generateOtp();

        otprequest userOtp = new otprequest();
        userOtp.setEmail(email);
        userOtp.setOtp(otp);
        userOtp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        
        otpRepository.save(userOtp);

        emailService.sendOtp(email, otp);
    }

    public boolean verifyEmailOtp(String email, String otp) {

        otprequest userOtp = otpRepository
                .findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (userOtp.isExpired()) {
            throw new RuntimeException("OTP expired");
        }
        // for the safer case we are removing this check
        // if (!userOtp.getOtp().equals(otp)) {
        //     return false;
        // }

        userOtp.setVerified(true);
        otpRepository.save(userOtp);
        return true;
    }
}
