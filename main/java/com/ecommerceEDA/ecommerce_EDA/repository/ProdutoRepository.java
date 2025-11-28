package com.ecommerceEDA.ecommerce_EDA.repository;

import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Método personalizado para encontrar produtos por categoria
    List<Produto> findByCategoria(String categoria);

    // Método necessário para o RecomendacaoService
    List<Produto> findByIdIn(List<Long> ids);

    // Outros métodos personalizados podem ser adicionados aqui, ex:
    // List<Produto> findByNomeContainingIgnoreCase(String nome);
}