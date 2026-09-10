# Ágora Fide — Escopo Mestre

Este arquivo fixa no repositório o escopo do documento mestre de funcionalidades aprovado em 10/09/2026. O PDF é a fonte de verdade para o que o produto deve fazer; o design mobile-first aprovado é a referência de interface.

## Princípio
FÉ faz o usuário voltar. COMUNIDADE faz o usuário participar. ECONOMIA faz a plataforma monetizar.

> A paróquia distribui, o conteúdo retém e a economia monetiza.

## Regra de aceite
Uma funcionalidade só pode ser marcada como pronta quando houver: interface mobile-first, lógica funcional, persistência quando aplicável, permissões/RLS, estados vazio/loading/erro e navegação integrada. Tela ou card isolado não significa funcionalidade concluída.

## MVP — fechar antes da Fase 2
- [x] Conta/login base
- [x] Onboarding base e paróquia principal
- [x] Home mobile-first
- [x] Momento Diário base (conteúdo, conclusão, streak, favorito, compartilhar)
- [x] Minha Igreja base (dados, missas, avisos, eventos)
- [x] Eventos básicos
- [x] Campanhas básicas
- [x] Loja/livros básicos e carrinho
- [x] Peregrinações básicas
- [x] Painel paroquial — CRUD de dados, horários, avisos, eventos e campanhas com RLS por admin/editor
- [ ] Analytics essenciais — ativação, retenção, conclusão do Momento, ativos por paróquia e CTR

## Pendências do MVP detalhado
### Conta e personalização
- [ ] telefone como opção de cadastro
- [ ] recuperação de acesso explícita
- [ ] exclusão de conta e exportação LGPD
- [ ] seguir outras igrejas/santuários
- [ ] interesses e preferências de notificação

### Home
- [ ] saudação/data personalizada
- [ ] agenda da paróquia no dia
- [ ] próxima missa e confissão
- [ ] avisos oficiais na Home
- [ ] recomendações litúrgicas/contextuais

### Busca global
- [ ] paróquias, igrejas, santuários, eventos, livros, produtos, peregrinações e conteúdos
- [ ] filtros por cidade, data, categoria, devoção e proximidade

### Momento Diário / fé
- [ ] fonte editorial explícita
- [ ] pergunta para reflexão
- [ ] áudio
- [ ] histórico de momentos

### Minha Igreja
- [x] dados institucionais, diocese, contatos e links oficiais
- [x] mapa/como chegar
- [x] missas, confissões, adoração, celebrações e secretaria
- [x] avisos, eventos e campanhas na página da igreja

### Eventos
- [ ] filtros por data/local/tipo
- [ ] cadastro/inscrição básica do participante (sem pagamento real nesta fase)

### Campanhas
- [ ] fotos/vídeo, instituição, selo, meta, progresso, prazo e atualizações
- [ ] compartilhar

### Peregrinações
- [ ] busca por cidade de saída
- [ ] roteiro, vagas, fotos e organizador verificado
- [ ] favoritar/compartilhar

### Loja/livros
- [ ] busca e filtros funcionais
- [ ] favoritos de produto/livro
- [ ] página individual de produto
- [ ] categorias completas básicas

### Painel paroquial
- [x] editar dados da paróquia
- [x] CRUD horários de missa
- [x] CRUD confissão/adoração/celebrações/secretaria
- [x] CRUD avisos
- [x] CRUD eventos
- [x] CRUD campanhas
- [x] admin/editor protegidos por AuthGuard + RLS

### Analytics essenciais
- [ ] ativação
- [ ] D1/D7/D30
- [ ] conclusão do Momento Diário
- [ ] usuários ativos por paróquia
- [ ] CTR eventos/campanhas/loja

## Fase 2 — somente após MVP
Checkout real; split/repasses; painel vendedor; ingressos QR; reserva de peregrinações; carteira/extrato; Premium; push notifications; biblioteca digital licenciada.

## Fase 3
Dioceses/santuários; clube de leitura; momentos da vida; intenções digitais completas; recomendações inteligentes; turismo ampliado; apps nativos se os dados justificarem.

## Guardrails
Pagamentos, repasses, doações, turismo e conteúdo editorial/licenciado exigem validação jurídica, fiscal e contratual antes do lançamento comercial. Não ativar dinheiro real apenas para completar interface.
