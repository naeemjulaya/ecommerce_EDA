package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Avaliacao;
import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import com.ecommerceEDA.ecommerce_EDA.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    // Retorna as avaliações de um produto ordenadas por nota (do maior para o menor) usando um Heap Máximo
    public List<Avaliacao> getAvaliacoesOrdenadasPorNota(Long produtoId) {
        // Obter todas as avaliações do produto do banco
        Produto produto = new Produto();
        produto.setId(produtoId);
        List<Avaliacao> avaliacoesDoBanco = avaliacaoRepository.findByProduto(produto);

        // Cria uma Priority Queue (Heap Máximo) com um comparador decrescente por nota
        PriorityQueue<Avaliacao> heap = new PriorityQueue<>(
            Comparator.comparingInt(Avaliacao::getNota).reversed()
        );

        heap.addAll(avaliacoesDoBanco); // Adiciona todas as avaliações ao heap

        List<Avaliacao> ordenadas = new ArrayList<>();
        while (!heap.isEmpty()) {
            ordenadas.add(heap.poll()); // Remove e adiciona a de maior nota
        }

        return ordenadas;
    }

    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        return avaliacaoRepository.save(avaliacao);
    }

    // Outros métodos relacionados a avaliações podem ser adicionados aqui
}