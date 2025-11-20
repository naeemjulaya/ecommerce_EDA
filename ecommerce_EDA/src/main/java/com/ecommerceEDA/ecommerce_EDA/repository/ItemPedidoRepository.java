package com.ecommerceEDA.ecommerce_EDA.repository;

import com.ecommerceEDA.ecommerce_EDA.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    // Métodos CRUD básicos são herdados de JpaRepository
    // Pode adicionar métodos personalizados se necessário
}