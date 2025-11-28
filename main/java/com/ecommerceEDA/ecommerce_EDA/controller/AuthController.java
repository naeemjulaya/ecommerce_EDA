package com.ecommerceEDA.ecommerce_EDA.controller;

import java.util.Map;

import com.ecommerceEDA.ecommerce_EDA.model.Usuario;
import com.ecommerceEDA.ecommerce_EDA.model.UsuarioTipo;
import com.ecommerceEDA.ecommerce_EDA.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    var result = authService.login(request.getEmail(), request.getSenha());
    if (result.isPresent()) {
        Usuario user = result.get();
        return ResponseEntity.ok(Map.of(
            "email", user.getEmail(),
            "nome", user.getNome(),
            "tipo", user.getTipoUsuario()
        ));
    } else {
        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}
    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody RegisterRequest request) {
        UsuarioTipo tipo = UsuarioTipo.valueOf(request.getTipoUsuario());
        Usuario novoUsuario = authService.criarUsuario(request.getEmail(), request.getSenha(), request.getNome(), tipo);
        return ResponseEntity.ok(novoUsuario);
    }
    }

    // --- Classes Internas para Requisições ---
    class LoginRequest {
        private String email;
        private String senha;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    class RegisterRequest {
        private String email;
        private String senha;
        private String nome;
        private String tipoUsuario;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getTipoUsuario() { return tipoUsuario; }
        public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    }
    // --- Fim das Classes Internas ---
