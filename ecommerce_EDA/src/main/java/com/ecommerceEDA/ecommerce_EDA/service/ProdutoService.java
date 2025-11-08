package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import com.ecommerceEDA.ecommerce_EDA.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Paulo: Implementar usando Árvore AVL
    public List<Produto> listarTodosOrdenados() {
        // Por enquanto, apenas retorna todos do banco
        return produtoRepository.findAll();
    }

    // Paulo: Implementar usando Árvore AVL
    public Produto buscarPorNome(String nome) {
        // Por enquanto, apenas busca no banco
        return produtoRepository.findByNome(nome); // Adicione este método no Repository se necessário
    }

    public List<Produto> listarPorCategoria(String categoria) {
        return produtoRepository.findByCategoria(categoria);
    }

    // Outros métodos de negócio para produtos
}