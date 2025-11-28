package com.ecommerceEDA.ecommerce_EDA.model; // ou o pacote correto

import java.util.*;

public class GrafoProdutos {

    // Estrutura do grafo: ID do produto -> Conjunto de IDs dos produtos relacionados
    private final Map<Long, Set<Long>> adjacencias = new HashMap<>();

    // Método para adicionar um produto (nó) ao grafo
    public void adicionarProduto(Long id) {
        adjacencias.putIfAbsent(id, new HashSet<>());
        // System.out.println("Nó adicionado ao grafo: " + id); // Log opcional
    }

    // Método para adicionar uma relação (aresta não direcionada) entre dois produtos
    public void adicionarRelacionamento(Long idA, Long idB) {
        // Garante que os nós existem
        adicionarProduto(idA);
        adicionarProduto(idB);

        // Adiciona a aresta em ambos os sentidos (grafo não-direcionado)
        adjacencias.get(idA).add(idB);
        adjacencias.get(idB).add(idA);

        System.out.println("Conexão criada entre: " + idA + " e " + idB); // <-- Novo log
    }

    // Método para obter os IDs dos produtos relacionados a um produto específico
    public Set<Long> getRelacionados(Long idProduto) {
        Set<Long> vizinhos = adjacencias.getOrDefault(idProduto, new HashSet<>());
        // System.out.println("Vizinhos de " + idProduto + ": " + vizinhos); // Log opcional
        return vizinhos;
    }

    // Método para verificar se um nó existe
    public boolean existeNo(Long id) {
        return adjacencias.containsKey(id);
    }

    // Método para obter todos os nós
    public Set<Long> getTodosOsNos() {
        return adjacencias.keySet();
    }

    // --- NOVO: Método para encontrar produtos recomendados usando BFS ---
    public Set<Long> encontrarRelacionadosBFS(Long idOrigem, int profundidadeMaxima) {
        System.out.println(
                "Iniciando BFS a partir do nó: " + idOrigem + " com profundidade máxima: " + profundidadeMaxima);

        if (!existeNo(idOrigem)) {
            System.out.println("Nó de origem " + idOrigem + " NÃO EXISTE no grafo.");
            return new HashSet<>();
        } else {
            System.out.println("Nó de origem " + idOrigem + " EXISTE no grafo. Vizinhos: " + getRelacionados(idOrigem));
        }

        Set<Long> visitados = new HashSet<>();
        Queue<Long> fila = new LinkedList<>();
        Set<Long> relacionados = new HashSet<>();

        fila.add(idOrigem);
        visitados.add(idOrigem);

        int nivelAtual = 0;
        while (!fila.isEmpty() && nivelAtual <= profundidadeMaxima) {
            System.out.println("Nível atual do BFS: " + nivelAtual);
            int tamanhoNivel = fila.size();
            for (int i = 0; i < tamanhoNivel; i++) {
                Long idAtual = fila.poll();
                System.out.println("Processando nó: " + idAtual);

                for (Long vizinhoId : adjacencias.getOrDefault(idAtual, new HashSet<>())) {
                    System.out.println("  Verificando vizinho: " + vizinhoId);
                    if (!visitados.contains(vizinhoId)) {
                        visitados.add(vizinhoId);
                        fila.add(vizinhoId);
                        // Correção: Adiciona se NÃO for o nó de origem
                        if (!vizinhoId.equals(idOrigem)) {
                            relacionados.add(vizinhoId);
                        }
                    } else {
                        System.out.println("    Vizinho " + vizinhoId + " já foi visitado, ignorando.");
                    }
                }
            }
            nivelAtual++;
        }

        System.out.println("BFS finalizado. Nós relacionados encontrados: " + relacionados);
        return relacionados;
    }
    // --- FIM do NOVO método ---
}