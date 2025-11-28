package com.ecommerceEDA.ecommerce_EDA.controller;

import com.ecommerceEDA.ecommerce_EDA.model.Avaliacao;
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
        Avaliacao avaliacaoSalva = avaliacaoService.salvarAvaliacao(avaliacao);
        return ResponseEntity.ok(avaliacaoSalva);
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<Avaliacao>> getAvaliacoesPorProduto(@PathVariable Long produtoId) {
        List<Avaliacao> avaliacoes = avaliacaoService.getAvaliacoesOrdenadasPorNota(produtoId);
        return ResponseEntity.ok(avaliacoes);
    }
}