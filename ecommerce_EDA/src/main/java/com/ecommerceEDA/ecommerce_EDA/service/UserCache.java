package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Usuario;
import java.util.concurrent.ConcurrentHashMap;

public class UserCache {

    // Simula uma Hash Table em memória para usuários logados
    private final ConcurrentHashMap<String, Usuario> cache = new ConcurrentHashMap<>();

    public void addUser(Usuario usuario) {
        cache.put(usuario.getEmail(), usuario);
    }

    public Usuario getUser(String email) {
        return cache.get(email);
    }

    public void removeUser(String email) {
        cache.remove(email);
    }

    public boolean contains(String email) {
        return cache.containsKey(email);
    }
}
