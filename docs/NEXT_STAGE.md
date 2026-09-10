# Próxima etapa — piloto e monetização

## Objetivo
Transformar o MVP já conectado ao Supabase em um piloto operacional, sem depender do deploy Vercel para continuar o desenvolvimento.

## Prioridade P0 — antes do piloto público
- Fechar autenticação e sessão do usuário.
- Persistir vínculo do fiel com sua paróquia.
- Criar estados de loading, vazio e erro nas telas com dados reais.
- Restringir `/admin`, `/vendedor` e `/organizador` por papel/permissão.
- Implementar política de privacidade, termos e fluxo de consentimento LGPD.
- Preparar observabilidade e tratamento de erros.

## Prioridade P1 — validar retenção
### Momento Diário
- leitura do dia;
- reflexão curta;
- oração;
- marcar como concluído;
- sequência diária (streak);
- compartilhamento;
- favoritos.

### Minha Igreja
- horários de missa;
- eventos;
- avisos paroquiais;
- campanhas;
- contato/localização;
- seguir paróquia.

## Prioridade P1 — validar receita
Ordem de implantação recomendada:
1. Marketplace católico;
2. Peregrinações/excursões;
3. Campanhas e contribuições;
4. Livros/e-books e conteúdo editorial premium;
5. Plano institucional para paróquias.

O gateway de pagamentos e os percentuais definitivos de comissão/split permanecem desacoplados até validação jurídica, fiscal e comercial.

## Marketplace
Entidades já previstas devem evoluir para:
- catálogo;
- vendedor;
- estoque;
- carrinho;
- pedido;
- status do pedido;
- comissão da plataforma;
- repasse do vendedor;
- participação paroquial opcional e rastreável.

Categorias iniciais: terços, imagens, medalhas, escapulários, camisetas, presentes, papelaria, decoração e livros.

## Peregrinações
Fluxo do piloto:
- vitrine de destinos;
- página da viagem;
- organizador identificado;
- datas e vagas;
- preço e condições;
- manifestação de interesse/reserva;
- painel do organizador;
- operação financeira somente após integração do gateway e validação do operador turístico.

## Campanhas
- campanha vinculada à instituição responsável;
- meta e progresso;
- descrição e prestação de contas;
- status de verificação;
- contribuições financeiras somente quando o fluxo jurídico e o gateway estiverem definidos.

## B2B paroquial
O painel `/admin` deve concentrar:
- perfil da paróquia;
- horários;
- avisos;
- eventos;
- campanhas;
- métricas de seguidores e engajamento;
- transações atribuídas à comunidade quando aplicável.

## Métricas do piloto
### Retenção
- usuários que concluem o Momento Diário;
- D1/D7;
- streak médio;
- usuários vinculados a uma paróquia.

### Comunidade
- seguidores por paróquia;
- visualizações de avisos/eventos;
- cliques em contato e localização.

### Receita
- GMV;
- pedidos pagos;
- ticket médio;
- take rate da plataforma;
- reservas de peregrinação;
- receita por usuário ativo.

## Critério de avanço
Só ampliar o produto depois de validar no piloto pelo menos estes três comportamentos:
1. o fiel retorna pelo Momento Diário;
2. uma paróquia consegue manter sua comunidade ativa;
3. um dos motores comerciais gera transações reais.

## Dependência em stand by
Vercel: manter em stand by até a conexão da conta/projeto estar acessível. O desenvolvimento continua em GitHub + Supabase. Antes do lançamento, configurar variáveis de ambiente, redirects do Supabase Auth, domínio e executar smoke test de produção.
