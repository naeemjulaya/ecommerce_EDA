package com.ecommerceEDA.ecommerce_EDA.controller;

import com.ecommerceEDA.ecommerce_EDA.model.Produto; // Importe a entidade Produto
import com.ecommerceEDA.ecommerce_EDA.service.RecomendacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recomendacoes")
public class RecomendacaoController {

    @Autowired
    private RecomendacaoService recomendacaoService;

    // Atualize este endpoint para retornar List<Produto>
    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<Produto>> getRecomendados(@PathVariable Long produtoId,
                                                      @RequestParam(defaultValue = "2") int profundidade) {
        // O serviço agora retorna List<Produto>
        List<Produto> produtosRecomendados = recomendacaoService.getRecomendados(produtoId, profundidade);
        return ResponseEntity.ok(produtosRecomendados); // Retorna a lista de produtos
    }
}