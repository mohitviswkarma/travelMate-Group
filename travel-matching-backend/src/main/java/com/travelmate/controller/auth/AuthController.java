package com.travelmate.controller.auth;

import java.io.IOException;
import java.util.Map;

import com.google.gson.Gson;
import com.travelmate.config.GsonConfig;
import com.travelmate.config.JwtUtil;
import com.travelmate.entity.User;
import com.travelmate.service.auth.AuthService;
import com.travelmate.service.otp.otpService;
import com.travelmate.service.user.UserService;
import com.travelmate.utility.SendOtpRequest;
import com.travelmate.utility.VerifyOtpRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class AuthController {

    private final AuthService authService;
    private final otpService otpService;
    private final UserService userService;
    private final Gson gson;

    public AuthController(
            AuthService authService,
            otpService otpService,
            UserService userService) {

        this.authService = authService;
        this.otpService = otpService;
        this.userService = userService;
        this.gson = GsonConfig.getGson();
    }

    /* =========================
       REGISTER (PASSWORD)
       ========================= */
    public void RegisterUser(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            RegisterRequest data =
                    gson.fromJson(req.getReader(), RegisterRequest.class);

            User user = authService.register(
                    data.name,
                    data.email,
                    data.password
            );

            

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(
                    Map.of(
                        "message", "Registered successfully. OTP sent for verification",
                        "email", user.getEmail()
                    )
            ));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write(gson.toJson(
                    Map.of("error", e.getMessage())));
        }
    }

    /* =========================
       LOGIN (PASSWORD)
       ========================= */
    public void LoginUser(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            LoginRequest data =
                    gson.fromJson(req.getReader(), LoginRequest.class);

            User user = authService.Login(data.email, data.password);

            // 🚫 Block login if email not verified
            if (!user.isEmailVerified()) {
                otpService.sendEmailOtp(user.getEmail());

                resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                resp.getWriter().write(gson.toJson(
                        Map.of(
                            "message", "Email not verified. OTP sent",
                            "verificationRequired", true
                        )
                ));
                return;
            }

            String token =
                    JwtUtil.generateToken(user.getEmail(), user.getId());

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(gson.toJson(
                    Map.of(
                        "message", "Login successful",
                        "token", token,
                        "userId", user.getId().toString(),
                        "email", user.getEmail()
                    )
            ));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(
                    Map.of("error", e.getMessage())));
        }
    }

    /* =========================
       SEND OTP (MANUAL / RESEND)
       ========================= */
    public void SendOtp(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        SendOtpRequest data =
                gson.fromJson(req.getReader(), SendOtpRequest.class);

        otpService.sendEmailOtp(data.email);

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write(gson.toJson(
                Map.of("message", "OTP sent")));
    }

    /* =========================
       VERIFY OTP
       ========================= */
    public void VerifyOtp(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try {
            VerifyOtpRequest data =
                    gson.fromJson(req.getReader(), VerifyOtpRequest.class);

            boolean verified =
                    otpService.verifyEmailOtp(data.email, data.otp);

            if (!verified) {
                throw new RuntimeException("Invalid or expired OTP");
            }

            User user =
                    userService.markEmailVerified(data.email);

            String token =
                    JwtUtil.generateToken(user.getEmail(), user.getId());

            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write(gson.toJson(
                    Map.of(
                        "message", "Email verified successfully",
                        "token", token,
                        "userId", user.getId().toString()
                    )
            ));

        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write(gson.toJson(
                    Map.of("error", e.getMessage())));
        }
    }
}
