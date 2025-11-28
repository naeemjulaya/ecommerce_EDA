
package com.ecommerceEDA.ecommerce_EDA;

import com.ecommerceEDA.ecommerce_EDA.model.Produto;
import com.ecommerceEDA.ecommerce_EDA.repository.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class BenchmarkTest {

    @Autowired
    private ProdutoRepository produtoRepository;

    private final List<String> resultados = new ArrayList<>();

    @PostConstruct
    public  void runBenchmark() {

        // Limpa o BD antes do teste
        produtoRepository.deleteAll();

        int[] sizes = { 1000, 5000, 10000 };

        for (int size : sizes) {
            resultados.add("\n------ TESTE PARA " + size + " PRODUTOS ------");

            // AVL
            resultados.add("Tempo Inserção AVL: " + testarAVL(size) + " ms");

            // Heap
            resultados.add("Tempo Heap: " + testarHeap(size) + " ms");

            // HashMap
            resultados.add("Tempo HashMap: " + testarHash(size) + " ms");

            // BFS
            resultados.add("Tempo BFS: " + testarBFS(size) + " ms");

            // Banco de dados
            resultados.add("Tempo Banco de Dados: " + testarBD(size) + " ms");
        }

        System.out.println("\n============================== RESULTADOS FINAIS ==============================");
        resultados.forEach(System.out::println);
        System.out.println("===============================================================================\n");
    }

    // ---------------------- AVL -------------------------
    private long testarAVL(int n) {
        class NoAVL {
            Produto produto;
            NoAVL esquerda, direita;
            int altura;

            NoAVL(Produto p) {
                produto = p;
                altura = 1;
            }
        }

        class AVL {
            NoAVL raiz;

            int altura(NoAVL n) {
                return n == null ? 0 : n.altura;
            }

            int balance(NoAVL n) {
                return n == null ? 0 : altura(n.esquerda) - altura(n.direita);
            }

            NoAVL rotacaoDireita(NoAVL y) {
                NoAVL x = y.esquerda;
                NoAVL T = x.direita;
                x.direita = y;
                y.esquerda = T;
                y.altura = 1 + Math.max(altura(y.esquerda), altura(y.direita));
                x.altura = 1 + Math.max(altura(x.esquerda), altura(x.direita));
                return x;
            }

            NoAVL rotacaoEsquerda(NoAVL x) {
                NoAVL y = x.direita;
                NoAVL T = y.esquerda;
                y.esquerda = x;
                x.direita = T;
                x.altura = 1 + Math.max(altura(x.esquerda), altura(x.direita));
                y.altura = 1 + Math.max(altura(y.esquerda), altura(y.direita));
                return y;
            }

            NoAVL inserir(NoAVL no, Produto p) {
                if (no == null)
                    return new NoAVL(p);

                if (p.getId() < no.produto.getId())
                    no.esquerda = inserir(no.esquerda, p);
                else if (p.getId() > no.produto.getId())
                    no.direita = inserir(no.direita, p);
                else
                    return no;

                no.altura = 1 + Math.max(altura(no.esquerda), altura(no.direita));
                int bal = balance(no);

                if (bal > 1 && p.getId() < no.esquerda.produto.getId())
                    return rotacaoDireita(no);
                if (bal < -1 && p.getId() > no.direita.produto.getId())
                    return rotacaoEsquerda(no);
                if (bal > 1 && p.getId() > no.esquerda.produto.getId()) {
                    no.esquerda = rotacaoEsquerda(no.esquerda);
                    return rotacaoDireita(no);
                }
                if (bal < -1 && p.getId() < no.direita.produto.getId()) {
                    no.direita = rotacaoDireita(no.direita);
                    return rotacaoEsquerda(no);
                }
                return no;
            }

            void travessiaInOrder(NoAVL no, List<Produto> lista) {
                if (no != null) {
                    travessiaInOrder(no.esquerda, lista);
                    lista.add(no.produto);
                    travessiaInOrder(no.direita, lista);
                }
            }

            List<Produto> getProdutosOrdenados() {
                List<Produto> ordenados = new ArrayList<>();
                travessiaInOrder(raiz, ordenados);
                return ordenados;
            }
        }

        AVL avl = new AVL();
        List<Produto> produtos = gerarProdutos(n);

        long start = System.currentTimeMillis();
        for (Produto p : produtos)
            avl.raiz = avl.inserir(avl.raiz, p);
        long insercaoTime = System.currentTimeMillis() - start;

        start = System.currentTimeMillis();
        List<Produto> ordenados = avl.getProdutosOrdenados();
        long travessiaTime = System.currentTimeMillis() - start;

        resultados.add("Tempo Travessia AVL: " + travessiaTime + " ms");

        return insercaoTime;
    }

    // ---------------------- HEAP -------------------------
    private long testarHeap(int n) {
        PriorityQueue<Produto> heap = new PriorityQueue<>(Comparator.comparing(Produto::getId));
        List<Produto> produtos = gerarProdutos(n);

        long start = System.currentTimeMillis();
        for (Produto p : produtos)
            heap.add(p);
        long insercaoTime = System.currentTimeMillis() - start;

        start = System.currentTimeMillis();
        List<Produto> todos = new ArrayList<>();
        while (!heap.isEmpty())
            todos.add(heap.poll());
        long percorrerTime = System.currentTimeMillis() - start;

        resultados.add("Tempo Percorrer Heap: " + percorrerTime + " ms");
        return insercaoTime;
    }

    // ---------------------- HASHMAP -------------------------
    private long testarHash(int n) {
        HashMap<Long, Produto> map = new HashMap<>();
        List<Produto> produtos = gerarProdutos(n);

        long start = System.currentTimeMillis();
        for (Produto p : produtos)
            map.put(p.getId(), p);
        long insercaoTime = System.currentTimeMillis() - start;

        start = System.currentTimeMillis();
        for (Produto p : map.values()) {
        } // apenas percorrer
        long percorrerTime = System.currentTimeMillis() - start;

        resultados.add("Tempo Percorrer HashMap: " + percorrerTime + " ms");
        return insercaoTime;
    }

        private long testarBFS(int n) {
        // Criar grafo simples: cada nó se conecta ao próximo
        Map<Long, List<Long>> grafo = new HashMap<>();
        for (long i = 0; i < n; i++) {
            grafo.put(i, new ArrayList<>());
            if (i > 0)
                grafo.get(i - 1).add(i);
        }

        long start = System.currentTimeMillis();
        // BFS simples a partir do nó 0
        Set<Long> visitados = new HashSet<>();
        Queue<Long> fila = new LinkedList<>();
        fila.add(0L);
        visitados.add(0L);

        while (!fila.isEmpty()) {
            Long atual = fila.poll();
            for (Long vizinho : grafo.getOrDefault(atual, new ArrayList<>())) {
                if (!visitados.contains(vizinho)) {
                    visitados.add(vizinho);
                    fila.add(vizinho);
                }
            }
        }
        return System.currentTimeMillis() - start;
    }

    // ---------------------- BANCO DE DADOS -------------------------
    private long testarBD(int n) {
        long start = System.currentTimeMillis();

        for (int i = 0; i < n; i++) {
            Produto p = new Produto();
            p.setNome("Produto" + i);
            p.setDescricao("Descrição do produto " + i);
            p.setPreco(BigDecimal.valueOf(10.0 + i)); // preço fictício
            p.setCategoria("CategoriaTeste"); // campo obrigatório
            p.setEstoque(100); // valor fictício
            p.setImagemUrl("https://via.placeholder.com/150");

            produtoRepository.save(p);
        }

        return System.currentTimeMillis() - start;
    }

    // ---------------------- Helper -------------------------
    private List<Produto> gerarProdutos(int n) {
        List<Produto> produtos = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            Produto p = new Produto();
            p.setNome("Produto " + i);
            p.setDescricao("Descrição do produto " + i);
            p.setPreco(BigDecimal.valueOf(10.0 + i));
            p.setCategoria("Eletrônicos"); // ou categoria existente
            p.setImagemUrl("https://exemplo.com/imagem" + i + ".jpg");
            p.setEstoque(100); // valor inicial
            p.setDataCriacao(LocalDateTime.now()); // obrigatório

            produtoRepository.save(p); // persiste no banco
            produtos.add(p); // adiciona à lista
        }
        return produtos;
    }



}