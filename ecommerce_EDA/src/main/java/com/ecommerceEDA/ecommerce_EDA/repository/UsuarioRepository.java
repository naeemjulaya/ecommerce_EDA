package com.ecommerceEDA.ecommerce_EDA.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findByEmail(String email);
    //Outros metodos de consulta podem ser adicionados aqui
}