package com.ecommerceEDA.ecommerce_EDA.controller;

import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import com.ecommerceEDA.ecommerce_EDA.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<List<Produto>> getProdutos() {
        // Paulo: Chamar produtoService.listarTodosOrdenados()
        List<Produto> produtos = produtoService.listarTodosOrdenados();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> getProdutoPorId(@PathVariable Long id) {
        // Buscar produto pelo ID no banco
        Produto produto = produtoService.findById(id); // Implementar este método
        if (produto != null) {
            return ResponseEntity.ok(produto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Outros endpoints para produtos (criar, atualizar, deletar)
}