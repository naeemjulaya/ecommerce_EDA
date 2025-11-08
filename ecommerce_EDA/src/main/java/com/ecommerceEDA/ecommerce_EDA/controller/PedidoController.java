package com.ecommerceEDA.ecommerce_EDA.controller;

import com.ecommerceEDA.ecommerce_EDA.model.Pedido;
import com.ecommerceEDA.ecommerce_EDA.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody Pedido pedido) {
        // Chamar pedidoService.criarPedido()
        Pedido pedidoSalvo = pedidoService.criarPedido(pedido);
        return ResponseEntity.ok(pedidoSalvo);
    }

    @GetMapping("/fila/proximo") // Endpoint exemplo para fila
    public ResponseEntity<Pedido> processarProximo() {
        // Chamar pedidoService.processarProximoPedido()
        Pedido proximoPedido = pedidoService.processarProximoPedido();
        if (proximoPedido != null) {
            return ResponseEntity.ok(proximoPedido);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> getPedidos() {
        // Chamar pedidoService.listarPedidos()
        List<Pedido> pedidos = pedidoService.listarPedidos();
        return ResponseEntity.ok(pedidos);
    }

    // Outros endpoints para pedidos
}