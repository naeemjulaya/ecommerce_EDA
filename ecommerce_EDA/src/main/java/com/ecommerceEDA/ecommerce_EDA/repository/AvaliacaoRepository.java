package com.ecommerceEDA.ecommerce_EDA.repository;

import com.ecommerceEDA.ecommerce_EDA.model.Avaliacao;
import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    // Método personalizado para encontrar avaliações por produto
    List<Avaliacao> findByProduto(Produto produto);

    // Outros métodos personalizados podem ser adicionados aqui, ex:
    // List<Avaliacao> findByUsuario(Usuario usuario);
}