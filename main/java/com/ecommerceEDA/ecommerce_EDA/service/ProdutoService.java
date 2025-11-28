package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import com.ecommerceEDA.ecommerce_EDA.repository.ProdutoRepository;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoService {



    @Autowired
    private ProdutoRepository produtoRepository;

    private NoAVL raiz = null;

    // Nó da Árvore AVL
    private static class NoAVL {
        Produto produto;
        NoAVL esquerda, direita;
        int altura;

        NoAVL(Produto produto) {
            this.produto = produto;
            this.altura = 1;
        }
    }


    public void onApplicationEvent(ContextRefreshedEvent event) {
        carregarArvore();
    }

    public void carregarArvore() {
        List<Produto> produtosDoBanco = produtoRepository.findAll();
        System.out.println("Produtos carregados do banco: " + produtosDoBanco.size()); // <- para debug
        this.raiz = null;
        for (Produto p : produtosDoBanco) {
            this.raiz = inserir(this.raiz, p);
        }
    }

    // --- Métodos auxiliares da Árvore AVL ---
    private int altura(NoAVL N) {
        return (N == null) ? 0 : N.altura;
    }

    private int getBalanceamento(NoAVL N) {
        return (N == null) ? 0 : altura(N.esquerda) - altura(N.direita);
    }

    private NoAVL rotacaoDireita(NoAVL y) {
        NoAVL x = y.esquerda;
        NoAVL T2 = x.direita;
        x.direita = y;
        y.esquerda = T2;
        y.altura = Math.max(altura(y.esquerda), altura(y.direita)) + 1;
        x.altura = Math.max(altura(x.esquerda), altura(x.direita)) + 1;
        return x;
    }

    private NoAVL rotacaoEsquerda(NoAVL x) {
        NoAVL y = x.direita;
        NoAVL T2 = y.esquerda;
        y.esquerda = x;
        x.direita = T2;
        x.altura = Math.max(altura(x.esquerda), altura(x.direita)) + 1;
        y.altura = Math.max(altura(y.esquerda), altura(y.direita)) + 1;
        return y;
    }

    private NoAVL inserir(NoAVL no, Produto produto) {
        if (no == null) return new NoAVL(produto);

        int cmp = produto.getNome().compareToIgnoreCase(no.produto.getNome());
        if (cmp < 0) no.esquerda = inserir(no.esquerda, produto);
        else if (cmp > 0) no.direita = inserir(no.direita, produto);
        else return no; // Produto já existe

        no.altura = 1 + Math.max(altura(no.esquerda), altura(no.direita));
        int bal = getBalanceamento(no);

        // Rotações para balanceamento
        if (bal > 1 && produto.getNome().compareToIgnoreCase(no.esquerda.produto.getNome()) < 0)
            return rotacaoDireita(no);
        if (bal < -1 && produto.getNome().compareToIgnoreCase(no.direita.produto.getNome()) > 0)
            return rotacaoEsquerda(no);
        if (bal > 1 && produto.getNome().compareToIgnoreCase(no.esquerda.produto.getNome()) > 0) {
            no.esquerda = rotacaoEsquerda(no.esquerda);
            return rotacaoDireita(no);
        }
        if (bal < -1 && produto.getNome().compareToIgnoreCase(no.direita.produto.getNome()) < 0) {
            no.direita = rotacaoDireita(no.direita);
            return rotacaoEsquerda(no);
        }

        return no;
    }

    private void travessiaInOrder(NoAVL no, List<Produto> lista) {
        if (no != null) {
            travessiaInOrder(no.esquerda, lista);
            lista.add(no.produto);
            travessiaInOrder(no.direita, lista);
        }
    }

    private NoAVL buscar(NoAVL no, String nome) {
        if (no == null) return null;
        int cmp = nome.compareToIgnoreCase(no.produto.getNome());
        if (cmp == 0) return no;
        if (cmp < 0) return buscar(no.esquerda, nome);
        return buscar(no.direita, nome);
    }

    // --- Fim dos métodos auxiliares ---

    // Carrega a árvore com todos os produtos do banco (pode ser usado no startup)
    /*public void carregarArvore() {
        List<Produto> produtosDoBanco = produtoRepository.findAll();
        this.raiz = null;
        for (Produto p : produtosDoBanco) {
            this.raiz = inserir(this.raiz, p);
        }
    }*/

    // Retorna produtos ordenados alfabeticamente
    public List<Produto> getProdutosOrdenados() {
    if (raiz == null) {  // Se a árvore estiver vazia, carrega do banco
        carregarArvore();
    }
    List<Produto> ordenados = new ArrayList<>();
    travessiaInOrder(raiz, ordenados);
    return ordenados;
}


    public Produto buscarPorNome(String nome) {
        NoAVL encontrado = buscar(raiz, nome);
        return (encontrado != null) ? encontrado.produto : null;
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    // --- NOVOS MÉTODOS PARA SINCRONIZAR COM O BANCO ---

    // Adiciona um produto: salva no banco e insere na árvore
    public Produto adicionarProduto(Produto produto) {
        Produto salvo = produtoRepository.save(produto);
        raiz = inserir(raiz, salvo);
        return salvo;
    }

    // Atualiza um produto existente
    public Produto atualizarProduto(Long id, Produto produtoAtualizado) {
        return produtoRepository.findById(id).map(produto -> {
            produto.setNome(produtoAtualizado.getNome());
            produto.setDescricao(produtoAtualizado.getDescricao());
            produto.setPreco(produtoAtualizado.getPreco());
            produto.setCategoria(produtoAtualizado.getCategoria());
            produto.setImagemUrl(produtoAtualizado.getImagemUrl());
            produto.setEstoque(produtoAtualizado.getEstoque());
            Produto salvo = produtoRepository.save(produto);

            // Atualiza a árvore: remove e insere novamente
            carregarArvore(); // Simples para manter a árvore atualizada
            return salvo;
        }).orElse(null);
    }

        // Remove um produto
    public boolean removerProduto(Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            carregarArvore(); // Atualiza a árvore após remoção
            return true;
        }
        return false;
    }

    // --- MÉTODO ADICIONAL PARA RECOMENDAÇÕES E OUTRAS FUNCIONALIDADES ---
    // Busca uma lista de produtos por seus IDs
    public List<Produto> buscarPorIds(List<Long> ids) {
        // Chama o método findByIdIn do repository
        return produtoRepository.findByIdIn(ids);
    }
    // --- FIM do MÉTODO ADICIONAL ---
}
