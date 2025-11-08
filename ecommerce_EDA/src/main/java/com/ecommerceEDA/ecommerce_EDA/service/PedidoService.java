package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Pedido;
import com.ecommerceEDA.ecommerce_EDA.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Peter: Implementar usando Fila
    public Pedido criarPedido(Pedido pedido) {
        // Lógica para criar e adicionar à fila
        return pedidoRepository.save(pedido);
    }

    // Peter: Implementar usando Fila
    public Pedido processarProximoPedido() {
        // Lógica para pegar o próximo da fila e processar
        return null; // Placeholder
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    // Outros métodos de negócio para pedidos
}