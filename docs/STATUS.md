# Status do MVP

## Etapa piloto concluída no código
- Supabase dedicado `app-catolico` em `sa-east-1`
- Banco real com RLS e dados de demonstração
- Autenticação passwordless com sessão no cliente
- Perfil criado automaticamente no primeiro acesso
- Onboarding persistente com cidade, estado, preferências e paróquia principal
- Home personalizada pela paróquia da conta autenticada
- Momento Diário com Evangelho separado de reflexão editorial, conclusão, histórico, favoritos e compartilhamento
- Minha Igreja personalizada por usuário com horários, confissões/serviços, avisos, eventos, contatos, participação e intenção de Missa via secretaria
- Explorar ampliado para Palavra, igrejas, eventos, peregrinações, campanhas e produtos
- Eventos redesenhados como experiência de descoberta, com filtros e inscrição
- Marketplace/Loja redesenhado com curadoria editorial, vitrines por momento e catálogo real
- Carrinho local funcional, sem cobrança
- Peregrinações com filtros, destinos editoriais, parceiros verificados e fluxo até detalhe/interesse
- Campanhas redesenhadas em torno de confiança, meta, verificação, atualizações e compartilhamento; contribuição financeira bloqueada no piloto
- Perfil real com indicadores de caminhada, favoritos, pedidos e reservas
- Painéis `/admin`, `/vendedor` e `/organizador` alinhados ao mesmo sistema visual e condicionados à permissão/vínculo real
- Estados globais de loading e erro
- Política de Privacidade e Termos em versão funcional de piloto
- Vercel mantida em stand by sem bloquear desenvolvimento

## Revisão de produto/UX concluída
- Navegação principal consolidada em `Hoje · Explorar · Igreja · Loja · Eu`
- Momento Diário permanece protagonista da Home sem ocupar aba principal
- Design system central em `product-system.css` com tokens de cor, espaçamento, cartões, filtros, hero, grids, estados vazios e padrões editoriais
- Linguagem de retenção revisada de “streak” para “caminhada/presença”, evitando competição espiritual
- Marca de trabalho consolidada como `Vinde` nas interfaces revisadas
- Resíduos de `@ts-nocheck` removidos das telas principais revisadas
- Home deixou de depender apenas da paróquia demo e passa a buscar a paróquia real do perfil autenticado no cliente
- Comércio posicionado abaixo de fé/comunidade na hierarquia das telas

## Segurança desta etapa
- Security Advisor do Supabase: sem alertas na última revisão
- RLS permanece habilitado
- Escritas de conclusão/favoritos vinculadas ao `auth.uid()`
- Interesse em peregrinação só pode ser gravado pelo próprio usuário, com valor zero e status `interest`
- Vendedor e organizador possuem vínculo de responsável (`owner_user_id`)
- Usuário comum não pode se promover a administrador paroquial pelas políticas de autoatendimento
- Checkout real não aceita escrita financeira pelo cliente nesta fase

## Validação técnica disponível
O banco foi revalidado após as migrations: Security Advisor sem alertas. O GitHub Actions continua indisponível por bloqueio conhecido da conta. O ambiente desta sessão também não possui resolução DNS para clonar o repositório e executar `npm run build` contra a árvore remota; por isso a validação final de build fica para o próximo ambiente de execução/deploy disponível.

## Ainda bloqueado de propósito antes de produção comercial
- Checkout/gateway real, antifraude, webhook e split
- Revisão jurídica/fiscal das operações financeiras e campanhas
- Validação de operadores de turismo religioso
- Direitos/licenças de conteúdo editorial e livros digitais
- Revisão jurídica final de Termos, Política de Privacidade e canal formal LGPD
- Push notifications
- Vercel, domínio e redirects finais do Supabase Auth
- Geolocalização completa para “igreja perto de mim”, “missa hoje” e “confissão agora”

## Próximo gate
Publicar beta, executar smoke test no ambiente real e medir: retorno ao Momento Diário, adesão às paróquias e intenção/transação em pelo menos um motor de receita.
