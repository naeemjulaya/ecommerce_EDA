package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Usuario;
import com.ecommerceEDA.ecommerce_EDA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método de login (exemplo)
    public Optional<Usuario> login(String email, String senha) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        // Aqui você deve comparar a senha criptografada
        if (usuario.isPresent() && /* senha correta */) {
            return usuario;
        }
        return Optional.empty();
    }

    // Outros métodos de autenticação e autorização
}