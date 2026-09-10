# Status do MVP

## Etapa piloto concluída no código
- Supabase dedicado `app-catolico` em `sa-east-1`
- Banco real com RLS e dados de demonstração
- Autenticação passwordless com sessão no cliente
- Perfil criado automaticamente no primeiro acesso
- Onboarding persistente com cidade, estado, preferências e paróquia principal
- Momento Diário com conclusão, sequência (streak), favoritos e compartilhamento
- Minha Igreja personalizada por usuário com horários, avisos, eventos, campanhas e contatos
- Perfil real com indicadores de caminhada, favoritos, pedidos e reservas
- Explorar com dados reais
- Marketplace com catálogo e carrinho local funcional, sem cobrança
- Peregrinações com registro autenticado de interesse, sem cobrança
- Campanhas carregadas do banco com contribuição financeira bloqueada no piloto
- Painéis `/admin`, `/vendedor` e `/organizador` condicionados à permissão/vínculo real
- Estados globais de loading e erro
- Política de Privacidade e Termos em versão funcional de piloto
- Vercel mantida em stand by sem bloquear desenvolvimento

## Segurança desta etapa
- Security Advisor do Supabase: sem alertas
- RLS permanece habilitado
- Escritas de conclusão/favoritos vinculadas ao `auth.uid()`
- Interesse em peregrinação só pode ser gravado pelo próprio usuário, com valor zero e status `interest`
- Vendedor e organizador possuem vínculo de responsável (`owner_user_id`)
- Usuário comum não pode se promover a administrador paroquial pelas políticas de autoatendimento
- Checkout real não aceita escrita financeira pelo cliente nesta fase

## Ainda bloqueado de propósito antes de produção comercial
- Checkout/gateway real, antifraude, webhook e split
- Revisão jurídica/fiscal das operações financeiras e campanhas
- Validação de operadores de turismo religioso
- Direitos/licenças de conteúdo editorial e livros digitais
- Revisão jurídica final de Termos, Política de Privacidade e canal formal LGPD
- Push notifications
- Vercel, domínio e redirects finais do Supabase Auth

## Próximo gate
Publicar beta, executar smoke test no ambiente real e medir: retorno ao Momento Diário, adesão às paróquias e intenção/transação em pelo menos um motor de receita.
