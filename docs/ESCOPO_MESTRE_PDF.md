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
- [x] Busca Global + Explorar
- [x] Painel paroquial — CRUD de dados, horários, avisos, eventos e campanhas com RLS por admin/editor
- [x] Analytics essenciais — ativação, atividade D1/D7/D30, conclusão do Momento, ativos por paróquia e CTR

## Pendências do MVP detalhado
### Conta e personalização
- [ ] telefone como opção de autenticação (depende de provedor SMS no Supabase)
- [x] telefone opcional no perfil
- [x] recuperação de acesso explícita por magic link
- [x] exportação LGPD e solicitação de exclusão
- [x] seguir outras igrejas/santuários
- [x] interesses e preferências de notificação

### Home
- [x] saudação/data personalizada
- [x] agenda da paróquia
- [x] próxima missa e confissão do dia
- [x] avisos oficiais na Home
- [ ] recomendações litúrgicas/contextuais avançadas

### Busca global
- [x] paróquias/igrejas, eventos, livros, produtos, peregrinações e conteúdos
- [x] santuários entram na descoberta quando cadastrados como comunidade/paróquia
- [x] filtros por tipo, cidade e data
- [x] busca textual por nome, descrição, categoria e local
- [x] filtro de proximidade mediante permissão do usuário e coordenadas cadastradas
- [x] estados de loading, erro, vazio e limpar filtros
- [x] páginas públicas de igrejas acessíveis pelos resultados

### Momento Diário / fé
- [x] suporte a fonte editorial explícita
- [x] pergunta para reflexão
- [x] player de áudio quando houver audio_url
- [x] histórico de momentos concluídos

### Minha Igreja
- [x] dados institucionais, diocese, contatos e links oficiais
- [x] mapa/como chegar
- [x] missas, confissões, adoração, celebrações e secretaria
- [x] avisos, eventos e campanhas na página da igreja

### Eventos
- [x] filtros por data/local/tipo
- [x] cadastro/inscrição básica do participante sem pagamento real

### Campanhas
- [x] suporte a foto/vídeo, instituição, selo, meta, progresso, prazo e atualizações
- [x] compartilhar

### Peregrinações
- [x] busca por cidade de saída
- [x] roteiro, vagas, foto/galeria e organizador verificado
- [x] favoritar/compartilhar

### Loja/livros
- [x] busca e filtros funcionais próprios da Loja
- [x] favoritos de produto/livro
- [x] página individual de produto
- [x] categorias básicas dinâmicas do catálogo
- [x] Livraria conectada ao catálogo real por título/autor/categoria

### Painel paroquial
- [x] editar dados da paróquia
- [x] CRUD horários de missa
- [x] CRUD confissão/adoração/celebrações/secretaria
- [x] CRUD avisos
- [x] CRUD eventos
- [x] CRUD campanhas
- [x] admin/editor protegidos por AuthGuard + RLS

### Analytics essenciais
- [x] instrumentação persistente em analytics_events
- [x] ativação por onboarding concluído
- [x] atividade D1/D7/D30
- [x] abertura e conclusão do Momento Diário
- [x] usuários ativos por paróquia
- [x] CTR inicial de Explorar/Eventos, Campanhas e Loja
- [x] dashboard paroquial protegido em /admin/analytics

## Pendências externas antes de declarar MVP 100% fechado
- [ ] autenticação por telefone: configurar provedor SMS no Supabase
- [ ] recomendações litúrgicas/contextuais avançadas: definir fonte editorial/dados e regras de recomendação
- [ ] auditoria final ponta a ponta em produção e conteúdo real de piloto

## Fase 2 — somente após MVP
Checkout real; split/repasses; painel vendedor; ingressos QR; reserva de peregrinações; carteira/extrato; Premium; push notifications; biblioteca digital licenciada.

## Fase 3
Dioceses/santuários; clube de leitura; momentos da vida; intenções digitais completas; recomendações inteligentes; turismo ampliado; apps nativos se os dados justificarem.

## Guardrails
Pagamentos, repasses, doações, turismo e conteúdo editorial/licenciado exigem validação jurídica, fiscal e contratual antes do lançamento comercial. Não ativar dinheiro real apenas para completar interface.
