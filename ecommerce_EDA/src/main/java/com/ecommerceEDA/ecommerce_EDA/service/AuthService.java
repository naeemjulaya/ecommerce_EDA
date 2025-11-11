package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Usuario;
import com.ecommerceEDA.ecommerce_EDA.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final UserCache userCache = new UserCache();

    @Autowired
    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Cadastro de usuário
    public String register(Usuario usuario) {
        Optional<Usuario> existingUser = usuarioRepository.findByEmail(usuario.getEmail());
        if (existingUser.isPresent()) {
            return "Erro: Usuário com este e-mail já existe.";
        }

        usuarioRepository.save(usuario);
        return "Usuário cadastrado com sucesso!";
    }

    // Login
    public String login(String email, String senha) {
        // Primeiro tenta buscar na Hash Table
        Usuario usuarioCache = userCache.getUser(email);
        if (usuarioCache != null && usuarioCache.getSenha().equals(senha)) {
            return "Login realizado com sucesso (cache).";
        }

        // Caso contrário, busca no banco
        Optional<Usuario> usuarioDB = usuarioRepository.findByEmail(email);
        if (usuarioDB.isPresent() && usuarioDB.get().getSenha().equals(senha)) {
            userCache.addUser(usuarioDB.get()); // adiciona à cache
            return "Login realizado com sucesso!";
        }

        return "Credenciais inválidas.";
    }

    // Logout
    public String logout(String email) {
        if (userCache.contains(email)) {
            userCache.removeUser(email);
            return "Logout realizado com sucesso!";
        }
        return "Usuário não estava logado.";
    }
}
