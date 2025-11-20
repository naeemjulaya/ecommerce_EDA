package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.GrafoProdutos;
import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.*;

@Service
public class RecomendacaoService {

    @Autowired
    private ProdutoService produtoService;

    private final GrafoProdutos grafo = new GrafoProdutos();

    @PostConstruct
    public void inicializarGrafo() {
        System.out.println("Iniciando inicialização do Grafo de Recomendações...");

        List<Produto> produtos = produtoService.getProdutosOrdenados();
        System.out.println("Total de produtos para grafo: " + produtos.size());

        Map<String, List<Long>> produtosPorCategoria = new HashMap<>();

        for (Produto p : produtos) {
            System.out.println("Produto: " + p.getNome() + ", Categoria: " + p.getCategoria());
            produtosPorCategoria
                    .computeIfAbsent(p.getCategoria(), k -> new ArrayList<>())
                    .add(p.getId());
        }

        int conexoesCriadas = 0;

        for (List<Long> ids : produtosPorCategoria.values()) {
            System.out.println("Conectando " + ids.size() + " produtos da categoria. ID exemplo: " + ids.get(0));

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
        System.out.println("Número total de nós no grafo: " + grafo.getTodosOsNos().size());
        System.out.println("Exemplo de vizinhos do nó 8: " + grafo.getRelacionados(8L));
    }

    public List<Produto> getRecomendados(Long produtoOrigemId, int profundidadeMaxima) {
        System.out.println("🔍 Buscando recomendações para produto ID: " + produtoOrigemId);

        if (!grafo.existeNo(produtoOrigemId)) {
            System.out.println("❌ Produto ID " + produtoOrigemId + " NÃO EXISTE no grafo.");
            return new ArrayList<>();
        }

        System.out.println("✅ Produto ID " + produtoOrigemId + " EXISTE no grafo.");

        Set<Long> idsRecomendados = grafo.encontrarRelacionadosBFS(produtoOrigemId, profundidadeMaxima);
        System.out.println(
                "🔍 Encontrados " + idsRecomendados.size() + " IDs recomendados para o produto " + produtoOrigemId);
        System.out.println("🔍 IDs encontrados: " + idsRecomendados);

        if (idsRecomendados.isEmpty()) {
            System.out.println("❌ Nenhum ID encontrado para recomendação.");
            return new ArrayList<>();
        }

        List<Produto> produtosRecomendados = produtoService.buscarPorIds(new ArrayList<>(idsRecomendados));
        System.out.println("✅ Retornando " + produtosRecomendados.size() + " produtos recomendados.");

        return produtosRecomendados;
    }
}
