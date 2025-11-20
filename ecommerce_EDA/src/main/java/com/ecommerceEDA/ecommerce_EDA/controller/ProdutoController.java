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

    //  LISTAR TODOS OS PRODUTOS
    @GetMapping
    public ResponseEntity<List<Produto>> getProdutos() {
        List<Produto> produtos = produtoService.getProdutosOrdenados();
        System.out.println("Produtos retornados para o frontend: " + produtos.size());
        for (Produto p : produtos) {
            System.out.println(" -> " + p.getNome());
        }
        return ResponseEntity.ok(produtos);
    }



    // BUSCAR PRODUTO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> getProdutoPorId(@PathVariable Long id) {
        Produto produto = produtoService.buscarPorId(id);
        if (produto != null) {
            return ResponseEntity.ok(produto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // BUSCAR PRODUTO POR NOME 
    @GetMapping("/search")
    public ResponseEntity<Produto> getProdutoPorNome(@RequestParam String nome) {
        Produto produto = produtoService.buscarPorNome(nome);
        if (produto != null) {
            return ResponseEntity.ok(produto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //  ADICIONAR PRODUTO
    @PostMapping
    public ResponseEntity<Produto> adicionarProduto(@RequestBody Produto produto) {
        Produto salvo = produtoService.adicionarProduto(produto);
        return ResponseEntity.ok(salvo);
    }

    // ] ATUALIZAR PRODUTO\
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        Produto atualizado = produtoService.atualizarProduto(id, produtoAtualizado);
        if (atualizado != null) {
            return ResponseEntity.ok(atualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // REMOVER PRODUTO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerProduto(@PathVariable Long id) {
        boolean removido = produtoService.removerProduto(id);
        if (removido) {
            return ResponseEntity.noContent().build(); // HTTP 204
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
