package com.seikyuuressha.aptfeemanagement.controller;

import com.seikyuuressha.aptfeemanagement.dto.request.EmailRequest;
import com.seikyuuressha.aptfeemanagement.service.EmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailController {
    EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        emailService.sendSimpleEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getText());
        return "Email was sent successfully";
    }

    @PostMapping("/send-html")
    public String sendHtmlEmail(@RequestBody EmailRequest emailRequest) {
        emailService.sendHtmlEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getText());
        return "Email HTML was sent successfully!";
    }
}