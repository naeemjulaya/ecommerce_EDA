package com.ecommerceEDA.ecommerce_EDA.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false) // A senha deve ser criptografada antes de salvar
    private String senha;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    private UsuarioTipo tipoUsuario;


     // Ex: "CLIENTE", "ADMIN"

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    // Relacionamento com Pedidos (Um usuário pode ter muitos pedidos)
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidos;

    // Relacionamento com Avaliacoes (Um usuário pode fazer muitas avaliações)
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Avaliacao> avaliacoes;

    // Construtores
    public Usuario() {}

    public Usuario(String email, String senha, String nome, UsuarioTipo tipoUsuario) {
        this.email = email;
        this.senha = senha; // Lembre-se de criptografar antes de atribuir
        this.nome = nome;
        this.tipoUsuario = tipoUsuario;
        this.dataCriacao = LocalDateTime.now();
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

    public UsuarioTipo getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(UsuarioTipo tipoUsuario) { this.tipoUsuario = tipoUsuario;}

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public List<Pedido> getPedidos() { return pedidos; }
    public void setPedidos(List<Pedido> pedidos) { this.pedidos = pedidos; }

    public List<Avaliacao> getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(List<Avaliacao> avaliacoes) { this.avaliacoes = avaliacoes; }
}