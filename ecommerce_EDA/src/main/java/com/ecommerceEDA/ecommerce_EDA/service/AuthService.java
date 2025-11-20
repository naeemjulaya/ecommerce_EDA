package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Usuario;
import com.ecommerceEDA.ecommerce_EDA.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.ecommerceEDA.ecommerce_EDA.model.UsuarioTipo;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Simula uma Hash Table para cache de usuários logados (email -> Usuario)
    private final Map<String, Usuario> usuarioCache = new HashMap<>();
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<Usuario> login(String email, String senha) {
        // 1. Tenta encontrar no cache (Hash Table - O(1))
        Usuario cachedUser = usuarioCache.get(email);
        if (cachedUser != null && passwordEncoder.matches(senha, cachedUser.getSenha())) {
            return Optional.of(cachedUser);
        }

        // 2. Se não estiver no cache, busca no banco de dados
        Optional<Usuario> dbUser = usuarioRepository.findByEmail(email);
        if (dbUser.isPresent() && passwordEncoder.matches(senha, dbUser.get().getSenha())) {
            usuarioCache.put(email, dbUser.get());
            return dbUser;
        }

        return Optional.empty(); // Credenciais inválidas
    }

    //Registro de usuário
    public Usuario criarUsuario(String email, String senha, String nome, UsuarioTipo tipoUsuario) {
        String hashedSenha = passwordEncoder.encode(senha); // hash da senha
        Usuario novoUsuario = new Usuario(email, hashedSenha, nome, tipoUsuario);
        Usuario salvo = usuarioRepository.save(novoUsuario);
        usuarioCache.put(salvo.getEmail(), salvo);
        return salvo;
    }

    public void logout(String email) {
        usuarioCache.remove(email); // Remove do cache (Hash Table)
    }

    // Outros métodos de autenticação/autorização podem ser adicionados aqui
}