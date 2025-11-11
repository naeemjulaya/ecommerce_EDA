package com.ecommerceEDA.ecommerce_EDA.controller;

import com.ecommerceEDA.ecommerce_EDA.model.Usuario;
import com.ecommerceEDA.ecommerce_EDA.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody Usuario usuario) {
        return authService.register(usuario);
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String senha) {
        return authService.login(email, senha);
    }

    @PostMapping("/logout")
    public String logout(@RequestParam String email) {
        return authService.logout(email);
    }
}


// DTO auxiliar para login
class LoginRequest {
    private String email;
    private String senha;

    // Getters e Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}