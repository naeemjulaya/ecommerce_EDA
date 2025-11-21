// src/main/java/com/ecommerceEDA/ecommerce_EDA/controller/MpesaController.java
package com.ecommerceEDA.ecommerce_EDA.controller;

import com.ecommerceEDA.ecommerce_EDA.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mpesa")
public class MpesaController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/simulate")
    public ResponseEntity<?> simulateMpesaPayment(@RequestBody Map<String, Object> request) {
        String phone = (String) request.get("phone");
        String customerName = (String) request.get("customerName");
        List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
        Double total = ((Number) request.get("total")).doubleValue();

        if (phone == null || !phone.matches("8[0-9]{8}")) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "error", "Número inválido. Use 9 dígitos começando com 8."));
        }

        boolean sent = smsService.sendMpesaSimulationSms(phone, customerName, items, total);

        if (sent) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Notificação WhatsApp enviada com sucesso",
                "phone", phone
            ));
        } else {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "error", "Falha ao enviar notificação."));
        }
    }
}