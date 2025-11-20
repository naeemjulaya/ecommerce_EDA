package com.ecommerceEDA.ecommerce_EDA.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Importe necessário para @JsonProperty
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mapeia o atributo 'nome' para o campo 'name' no JSON
    @JsonProperty("name")
    @Column(nullable = false)
    private String nome;

    @Column(length = 1000) // Ajuste o tamanho conforme necessário
    private String descricao;

    // Mapeia o atributo 'preco' para o campo 'price' no JSON
    @JsonProperty("price")
    @Column(nullable = false, precision = 10, scale = 2) // Ex: 99999999.99
    private BigDecimal preco;

    // Mapeia o atributo 'categoria' para o campo 'category' no JSON
    @JsonProperty("category")
    @Column(nullable = false)
    private String categoria;

    // Mapeia o atributo 'imagemUrl' para o campo 'image' no JSON
    @JsonProperty("image")
    @Column(name = "imagem_url", nullable = false) // Corresponde à coluna imagem_url no banco
    private String imagemUrl;

    @Column(nullable = false)
    private Integer estoque;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    // Construtores
    public Produto() {}

    public Produto(String nome, String descricao, BigDecimal preco, String categoria, String imagemUrl, Integer estoque) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.imagemUrl = imagemUrl;
        this.estoque = estoque;
        this.dataCriacao = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // O getter getName() serializa para 'name' devido ao @JsonProperty
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    // O getter getPreco() serializa para 'price' devido ao @JsonProperty
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    // O getter getCategoria() serializa para 'category' devido ao @JsonProperty
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    // O getter getImagemUrl() serializa para 'image' devido ao @JsonProperty
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public Integer getEstoque() { return estoque; }
    public void setEstoque(Integer estoque) { this.estoque = estoque; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}