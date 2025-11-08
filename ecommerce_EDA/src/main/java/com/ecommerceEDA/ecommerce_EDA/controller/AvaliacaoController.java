package com.ecommerceEDA.ecommerce_EDA.controller;

import com.ecommerceEDA.ecommerce_EDA.model.Avaliacao;
import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import com.ecommerceEDA.ecommerce_EDA.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<Avaliacao> criarAvaliacao(@RequestBody Avaliacao avaliacao) {
        // Chamar avaliacaoService.salvarAvaliacao()
        Avaliacao avaliacaoSalva = avaliacaoService.salvarAvaliacao(avaliacao);
        return ResponseEntity.ok(avaliacaoSalva);
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<Avaliacao>> getAvaliacoesPorProduto(@PathVariable Long produtoId) {
        // Chamar avaliacaoService.listarAvaliacoesOrdenadasPorNota()
        List<Avaliacao> avaliacoes = avaliacaoService.listarAvaliacoesOrdenadasPorNota(produtoId);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/produto/{produtoId}/recomendados")
    public ResponseEntity<List<Produto>> getRecomendados(@PathVariable Long produtoId) {
        // Chamar avaliacaoService.produtosRecomendados()
        List<Produto> recomendados = avaliacaoService.produtosRecomendados(produtoId);
        if (recomendados != null) {
            return ResponseEntity.ok(recomendados);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    // Outros endpoints para avaliações
}