# ecommerce_EDA

Projeto backend e frontend estático de exemplo para uma aplicação de e-commerce, construído em Java (Spring Boot) com recursos básicos de autenticação, gerenciamento de produtos, pedidos e avaliações. Este README detalha estrutura, instalação, execução, endpoints, convenções e orientações para desenvolvimento e contribuição.

## Sumário
- Visão geral
- Tecnologias
- Requisitos
- Estrutura do projeto
- Configuração e variáveis
- Como rodar (desenvolvimento e produção)
- Endpoints principais
- Fluxos e comportamentos importantes
- Execução de testes
- Boas práticas e convenções
- Contribuição
- Licença e contatos

## Visão geral
Este repositório contém:
- Uma API REST construída com Spring Boot, organizada em camadas (controller, service, repository, model).
- Recursos essenciais: autenticação, CRUD de produtos, criação e consulta de pedidos, avaliações de produtos.
- Conteúdo estático para front-end (HTML/CSS/JS) consumindo a API.

O objetivo é fornecer um esqueleto funcional para estudos, prototipagem e extensões.

## Tecnologias
- Java 11+ (configurável via pom.xml)
- Spring Boot (Web, Data JPA, Security — conforme implementação)
- Banco de dados relacional (H2, PostgreSQL ou MySQL — configurável)
- Maven
- Frontend estático (HTML, CSS, JavaScript)

## Requisitos
- JDK 11 ou superior
- Maven 3.6+
- Banco de dados (opcional para H2 em memória)
- Node/NPM apenas se for necessário para tarefas de front-end (não obrigatório para o conteúdo estático presente)

## Estrutura do projeto (resumida)
Organização por pacotes:
- controller — camadas que expõem a API REST.
- service — regras de negócio, validações e orquestrações.
- repository — interfaces JPA para persistência.
- model — entidades do domínio (Produto, Pedido, ItemPedido, Usuario, Avaliacao).
- resources/static — arquivos estáticos do front-end (HTML, CSS, JS).
- application.properties — configuração da aplicação.

Cada camada deve ser seguida para facilitar manutenção e testes.

## Configuração e variáveis
Edite o arquivo de propriedades (src/main/resources/application.properties) para ajustar:
- Datasource (url, username, password, driver)
- Propriedades do JPA (hibernate ddl-auto, dialect)
- Configurações de segurança (segredo JWT, expiracão — se aplicável)
- Portas e CORS (caso necessário)

Exemplo (H2 em memória para desenvolvimento):
```
spring.datasource.url=jdbc:h2:mem:ecommercedb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
server.port=8080
```

Se estiver usando um banco externo, ajuste URL, usuário, senha e driver.

## Como rodar (desenvolvimento)
1. Build:
    ```
    mvn clean package
    ```
2. Executar local (com Maven):
    ```
    mvn spring-boot:run
    ```
    ou executar o JAR gerado:
    ```
    java -jar target/ecommerce_EDA-0.0.1-SNAPSHOT.jar
    ```

3. Acesse:
    - API: http://localhost:8080 (ou porta configurada)
    - Front-end estático: http://localhost:8080/static/index.html (ou conforme mapeamento)

## Endpoints principais (exemplos e convenções)
Observação: rotas exatas dependem do mapeamento nos controllers. Abaixo estão exemplos típicos esperados.

Autenticação
- POST /auth/login — autenticar usuário, retorna token/session.
- POST /auth/register — criar novo usuário.

Produtos
- GET /produtos — listar produtos (com paginação/filtros).
- GET /produtos/{id} — detalhes de um produto.
- POST /produtos — criar produto (admin).
- PUT /produtos/{id} — atualizar produto (admin).
- DELETE /produtos/{id} — excluir produto (admin).

Pedidos
- POST /pedidos — criar pedido (usuário logado). Body inclui itens e endereço.
- GET /pedidos — listar pedidos do usuário autenticado (ou todos para admin).
- GET /pedidos/{id} — detalhes de um pedido.

Avaliações
- POST /avaliacoes — adicionar avaliação a um produto (usuário autenticado).
- GET /avaliacoes/produto/{produtoId} — listar avaliações por produto.

Observações:
- Use códigos HTTP adequados: 200, 201, 400, 401, 403, 404, 500.
- Validações de entrada e tratamento de exceções devem retornar mensagens claras.

## Fluxos e comportamentos importantes
- Autorização: rotas sensíveis (criação/alteração/exclusão) protegidas para perfis administrativos.
- Consistência de pedidos: ao criar um pedido, validar estoque, calcular subtotal, impostos e total.
- Relacionamentos: ItemPedido referencia Produto e Pedido; persistência deve considerar cascades e fetch adequado.
- Paginação e filtros: endpoints de listagem devem suportar page/size e filtros por categoria/nome/preço.

## Front-end estático
Arquivos em resources/static fornecem páginas básicas:
- index.html — catálogo/listagem pública.
- produto.html — detalhe do produto.
- carrinho.html — fluxo de carrinho.
- checkout.html — finalização do pedido.
- login.html/admin.html — autenticação e painel.
- js/*.js — chamadas à API (fetch/axios), manipulação do DOM e autenticação localStorage.
- css/*.css — estilos globais e componentes.

Para adaptar o front-end:
- Ajuste as URLs de API nos scripts (api.js).
- Implemente tratamento de tokens (incluir Authorization no header).

## Execução de testes
Testes unitários/integrados podem ser executados via Maven:
```
mvn test
```
Adicionar testes para:
- Serviços (regras de negócio).
- Controllers (mock MVC para validar endpoints).
- Repositories (com banco em memória).

## Boas práticas e convenções
- Separe responsabilidades entre camadas.
- Valide entradas e evite expor entidades diretamente (use DTOs).
- Trate exceções globais com @ControllerAdvice.
- Logue informações relevantes (não sensíveis).
- Versione a API se planejar breaking changes (/api/v1/...).

## Contribuição
- Abra issues para bugs ou propostas.
- Para PRs:
  - Fork → branch feature/descricao → commit pequeno e descritivo → PR para main.
  - Inclua testes e documentação das alterações.
  - Siga convenções de código do projeto (format, naming, estilos).

## Checklist antes de um commit/PR
- Código compilando sem warnings.
- Testes relevantes passando.
- Mensagens de commit claras.
- Documentação de novas APIs ou alterações no README.

## Exemplo rápido de uso (fluxo)
1. Registrar usuário (POST /auth/register).
2. Login (POST /auth/login) — obter token.
3. Listar produtos (GET /produtos).
4. Adicionar ao carrinho via front-end.
5. Criar pedido (POST /pedidos) — incluir token na autorização.
6. Avaliar produto (POST /avaliacoes).

## Possíveis melhorias futuras
- Implementar refresh tokens.
- Integração com gateway de pagamento.
- Upload de imagens e CDN.
- Search avançada (ElasticSearch).
- Painel administrativo com CRUD completo e analytics.
- Internacionalização (i18n).

## Licença
Adicionar licença desejada (MIT, Apache 2.0, etc.) no arquivo LICENSE e mencionar neste README.

## Contato
Inclua informações de contato ou responsáveis pelo projeto no repositório para dúvidas ou manutenção.

Observação final: este README foi escrito para servir como guia abrangente de uso, desenvolvimento e extensão do projeto de e-commerce. Ajuste seções conforme necessidades específicas e mudanças de implementação.
```
ecommerce_EDA
├─ .idea
│  ├─ compiler.xml
│  ├─ ecommerce_EDA.iml
│  ├─ encodings.xml
│  ├─ jarRepositories.xml
│  ├─ material_theme_project_new.xml
│  ├─ misc.xml
│  ├─ modules.xml
│  └─ vcs.xml
├─ ecommerce_EDA
│  ├─ .mvn
│  │  └─ wrapper
│  │     └─ maven-wrapper.properties
│  ├─ mvnw
│  ├─ mvnw.cmd
│  ├─ pom.xml
│  └─ src
│     ├─ main
│     │  ├─ java
│     │  │  └─ com
│     │  │     └─ ecommerceEDA
│     │  │        └─ ecommerce_EDA
│     │  │           ├─ controller
│     │  │           │  ├─ AuthController.java
│     │  │           │  ├─ AvaliacaoController.java
│     │  │           │  ├─ PedidoController.java
│     │  │           │  └─ ProdutoController.java
│     │  │           ├─ EcommerceEdaApplication.java
│     │  │           ├─ model
│     │  │           │  ├─ Avaliacao.java
│     │  │           │  ├─ ItemPedido.java
│     │  │           │  ├─ Pedido.java
│     │  │           │  ├─ Produto.java
│     │  │           │  └─ Usuario.java
│     │  │           ├─ repository
│     │  │           │  ├─ AvaliacaoRepository.java
│     │  │           │  ├─ PedidoRepository.java
│     │  │           │  ├─ ProdutoRepository.java
│     │  │           │  └─ UsuarioRepository.java
│     │  │           └─ service
│     │  │              ├─ AuthService.java
│     │  │              ├─ AvaliacaoService.java
│     │  │              ├─ PedidoService.java
│     │  │              └─ ProdutoService.java
│     │  └─ resources
│     │     ├─ application.properties
│     │     └─ static
│     │        ├─ admin.html
│     │        ├─ carrinho.html
│     │        ├─ checkout.html
│     │        ├─ css
│     │        │  ├─ global.css
│     │        │  └─ header.css
│     │        ├─ index.html
│     │        ├─ js
│     │        │  ├─ admin.js
│     │        │  ├─ api.js
│     │        │  ├─ carrinho.js
│     │        │  ├─ catalogo.js
│     │        │  ├─ checkout.js
│     │        │  ├─ main.js
│     │        │  └─ produto.js
│     │        ├─ login.html
│     │        └─ producto.html
│     └─ test
│        └─ java
│           └─ com
│              └─ ecommerceEDA
│                 └─ ecommerce_EDA
│                    └─ EcommerceEdaApplicationTests.java
├─ ecommerce_EDA-main.rar
└─ README.md

```