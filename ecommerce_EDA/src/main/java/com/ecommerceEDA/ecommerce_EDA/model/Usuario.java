package com.ecommerceEDA.ecommerce_EDA.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.ecommerceEDA.ecommerce_EDA.model.Avaliacao;
import com.ecommerceEDA.ecommerce_EDA.model.Pedido;

@Entity // Adicionado
@Table(name = "usuarios") // Adicionado
public class Usuario { // Adicionado 'public'

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha; // Deve ser armazenada de forma criptografada

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING) // Opcional: usar enum para tipo_usuario
    private String tipoUsuario; // CLIENTE ou ADMIN

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    // Relacionamento com Pedidos
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidos;

    // Relacionamento com Avaliacoes
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Avaliacao> avaliacoes;

    // Construtores
    public Usuario() {}

    public Usuario(String email, String senha, String nome, String tipoUsuario) {
        this.email = email;
        this.senha = senha;
        this.nome = nome;
        this.tipoUsuario = tipoUsuario;
        this.dataCriacao = LocalDateTime.now();
    }

    public Usuario(List<Avaliacao> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }

    public List<Avaliacao> getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(List<Avaliacao> avaliacoes) { this.avaliacoes = avaliacoes; }
}