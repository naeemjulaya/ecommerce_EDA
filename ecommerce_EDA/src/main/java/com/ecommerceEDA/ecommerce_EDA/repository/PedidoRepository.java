package com.ecommerceEDA.ecommerce_EDA.repository;

import com.ecommerceEDA.ecommerce_EDA.model.Pedido;
import com.ecommerceEDA.ecommerce_EDA.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Método personalizado para encontrar pedidos por usuário
    List<Pedido> findByUsuario(Usuario usuario);

    // Outros métodos personalizados podem ser adicionados aqui, ex:
    // List<Pedido> findByStatus(String status);
}