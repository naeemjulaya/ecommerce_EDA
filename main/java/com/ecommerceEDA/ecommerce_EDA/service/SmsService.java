// src/main/java/com/ecommerceEDA/ecommerce_EDA/service/SmsService.java
package com.ecommerceEDA.ecommerce_EDA.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class SmsService {

    private static final String TWILIO_SANDBOX_WHATSAPP = "whatsapp:+14155238886";

    private static final Set<String> AUTHORIZED_WHATSAPP_NUMBERS = Set.of(
        "whatsapp:+258833340610",
        "whatsapp:+258868480987",
        "whatsapp:+258867483701"
    );

    public boolean sendMpesaSimulationSms(String phone, String customerName, List<Map<String, Object>> items, Double total) {
        if (phone == null || !phone.matches("8[0-9]{8}")) {
            return false;
        }

        String fullNumber = "whatsapp:+258" + phone;
        if (!AUTHORIZED_WHATSAPP_NUMBERS.contains(fullNumber)) {
            return false;
        }

        // Monta os detalhes dos produtos
        StringBuilder itemsText = new StringBuilder();
        for (Map<String, Object> item : items) {
            String name = (String) item.get("name");
            Integer qty = ((Number) item.get("quantity")).intValue();
            Double price = ((Number) item.get("price")).doubleValue();
            itemsText.append("- ").append(name).append(" (x").append(qty).append(") | MT ").append(String.format("%.2f", price)).append("\n");
        }

        // Formata data
        String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm"));

        // Mensagem detalhada
        String message = "🔔 *SMARTCOMMERCE - SOLICITAÇÃO DE PAGAMENTO*\n\n" +
            "Olá, *%s*!\n\n" +
            "Você solicitou um pagamento para o seguinte pedido:\n\n" +
            "*Itens:*\n%s" +
            "*Total:* MT %s\n" +
            "*Data:* %s\n\n" +
            "Aguarde a confirmação no seu M-Pesa.\n" +
            "Obrigado pela sua compra!";

        String formattedMessage = String.format(
            message,
            customerName != null ? customerName : "Cliente",
            itemsText.toString(),
            String.format("%.2f", total).replace('.', ','),
            formattedDate
        );

        try {
            Message.creator(
                new PhoneNumber(fullNumber),
                new PhoneNumber(TWILIO_SANDBOX_WHATSAPP),
                formattedMessage
            ).create();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}