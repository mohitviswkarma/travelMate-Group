package com.travelmate.utility;

import java.security.SecureRandom;

public class otputil {
    public static String generateOtp() {
        return String.valueOf(100000 + new SecureRandom().nextInt(900000));
    }
}
 