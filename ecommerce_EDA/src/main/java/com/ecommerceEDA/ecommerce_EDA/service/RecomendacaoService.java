package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.GrafoProdutos;
import com.ecommerceEDA.ecommerce_EDA.model.Produto;
// Remover a injeção direta do repository
// import com.ecommerceEDA.ecommerce_EDA.repository.ProdutoRepository;
//import com.ecommerceEDA.ecommerce_EDA.service.HeapGrafo.GrafoProdutos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.*;

@Service
public class RecomendacaoService {

    // Injetar o ProdutoService em vez do repository
    @Autowired
    private ProdutoService produtoService;

    private final GrafoProdutos grafo = new GrafoProdutos();

    @PostConstruct
public void inicializarGrafo() {
    System.out.println("Iniciando inicialização do Grafo de Recomendações...");
    // Usar o produtoService para obter produtos
    List<Produto> produtos = produtoService.getProdutosOrdenados(); // ou produtoRepository.findAll();

    System.out.println("Total de produtos para grafo: " + produtos.size());

    // Agrupa produtos por categoria para criar relacionamentos
    Map<String, List<Long>> produtosPorCategoria = new HashMap<>();
    for (Produto p : produtos) {
        System.out.println("Produto: " + p.getNome() + ", Categoria: " + p.getCategoria()); // Log adicional
        produtosPorCategoria.computeIfAbsent(p.getCategoria(), k -> new ArrayList<>()).add(p.getId());
    }

    // Cria relacionamentos entre produtos da mesma categoria
    int conexoesCriadas = 0;
    for (List<Long> ids : produtosPorCategoria.values()) {
        System.out.println("Conectando " + ids.size() + " produtos da categoria: " + ids.get(0) + " (exemplo de ID)");
        if (ids.size() > 1) {
            for (int i = 0; i < ids.size(); i++) {
                for (int j = i + 1; j < ids.size(); j++) {
                    grafo.adicionarRelacionamento(ids.get(i), ids.get(j));
                    conexoesCriadas++;
                }
            }
        }
    }
    System.out.println("Grafo de Recomendações inicializado com " + conexoesCriadas + " conexões.");
    // Correção: Log para mostrar o tamanho do grafo (número de nós)
    System.out.println("Número total de nós no grafo: " + grafo.getTodosOsNos().size()); // Novo método
    System.out.println("Exemplo de vizinhos do nó 8 (Notebook Dell): " + grafo.getRelacionados(8L)); // Exemplo
}


    public List<Produto> getRecomendados(Long produtoOrigemId, int profundidadeMaxima) {
    System.out.println("Buscando recomendações para produto ID: " + produtoOrigemId);

    // Verifica se o produto existe no grafo antes de buscar
    if (!grafo.existeNo(produtoOrigemId)) {
        System.out.println("Produto ID " + produtoOrigemId + " não encontrado no grafo.");
        return new ArrayList<>();
    }

    Set<Long> idsRecomendados = grafo.encontrarRelacionadosBFS(produtoOrigemId, profundidadeMaxima);
    System.out.println("Encontrados " + idsRecomendados.size() + " IDs recomendados para o produto " + produtoOrigemId);

    if (idsRecomendados.isEmpty()) {
        System.out.println("Nenhum ID encontrado para recomendação.");
        return new ArrayList<>();
    }

    List<Produto> produtosRecomendados = produtoService.buscarPorIds(new ArrayList<>(idsRecomendados));
    System.out.println("Retornando " + produtosRecomendados.size() + " produtos recomendados.");
    return produtosRecomendados;
}
}