package com.ecommerceEDA.ecommerce_EDA.service;

import com.ecommerceEDA.ecommerce_EDA.model.Pedido;
import com.ecommerceEDA.ecommerce_EDA.model.StatusPedido;
import com.ecommerceEDA.ecommerce_EDA.repository.PedidoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Simula uma Fila (Queue) para pedidos pendentes (usando LinkedList)
    private final Queue<Long> filaDePedidos = new LinkedList<>();

    public Pedido criarPedido(Pedido pedido) {
        Pedido salvo = pedidoRepository.save(pedido);
        // Adiciona o ID do pedido à fila para processamento
        filaDePedidos.add(salvo.getId());
        return salvo;
    }

    public Pedido processarProximoPedido() {
        Long idDoProximo = filaDePedidos.poll(); // Remove o ID do início da fila (FIFO)
        if (idDoProximo != null) {
            Pedido pedido = pedidoRepository.findById(idDoProximo).orElse(null);
            if (pedido != null) {
                // Atualiza o status corretamente usando ENUM
                pedido.setStatus(StatusPedido.ENVIADO);
                return pedidoRepository.save(pedido); // Salva a atualização no banco
            }
        }
        return null; // Fila vazia ou pedido não encontrado
    }

    public Queue<Long> getFilaDePedidos() {
        return new LinkedList<>(filaDePedidos);
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }
}
