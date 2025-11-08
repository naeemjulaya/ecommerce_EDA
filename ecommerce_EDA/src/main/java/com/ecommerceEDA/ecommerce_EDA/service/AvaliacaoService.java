package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Avaliacao;
import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import com.ecommerceEDA.ecommerce_EDA.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    // Whitney: Implementar usando Heap/Árvore para ordenação
    public List<Avaliacao> listarAvaliacoesOrdenadasPorNota(Long produtoId) {
        // Por enquanto, apenas busca no banco
        Produto produto = new Produto(); // Você precisa obter o produto real pelo ID
        produto.setId(produtoId);
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByProduto(produto);
        // Ordenar usando Heap ou Árvore (a ser implementado por Whitney)
        return avaliacoes;
    }

    // Whitney: Implementar usando Grafo para recomendações
    public List<Produto> produtosRecomendados(Long produtoId) {
        // Lógica para encontrar produtos relacionados via Grafo
        return null; // Placeholder
    }

    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        return avaliacaoRepository.save(avaliacao);
    }

    // Outros métodos de negócio para avaliações
}