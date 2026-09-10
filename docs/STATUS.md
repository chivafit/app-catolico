# Status do MVP

## Integrado e funcionando
- Projeto Supabase dedicado `app-catolico` em `sa-east-1`
- Banco real com 19 tabelas públicas
- RLS habilitado nas 19 tabelas públicas
- Auditoria de segurança Supabase sem alertas
- Índices de chaves estrangeiras adicionados
- Seed de demonstração real: paróquia, horários, Momento Diário, eventos, campanha, produtos e peregrinação
- Home conectada ao Supabase
- Momento Diário conectado ao Supabase
- Minha Igreja e horários conectados ao Supabase
- Explorar conectado ao Supabase
- Loja / marketplace conectado ao Supabase
- Peregrinações conectadas ao Supabase
- Autenticação passwordless preparada em `/entrar`

## Pronto no código
- Home responsiva
- Onboarding
- Momento Diário
- Minha Igreja
- Explorar
- Campanhas
- Peregrinações
- Loja / marketplace
- Livraria e biblioteca
- Perfil
- Painel paroquial
- Painel do vendedor
- Painel do organizador
- Manifesto PWA
- Endpoint `/api/health`
- Estrutura de transações, comissões e participação paroquial

## Ainda depende de integração externa antes de produção comercial
- Deploy efetivo na Vercel e domínio
- Configuração do Site URL/redirects de Auth após existir o domínio final
- Gateway de pagamentos, split e webhook
- Definição jurídica/fiscal para doações, marketplace e repasses
- Validação de operadores/agências para turismo religioso
- Conteúdo editorial e livros/e-books com direitos/licenças
- Política de privacidade, termos e LGPD
- Notificações push

## Princípio de lançamento
O piloto deve validar três comportamentos antes de ampliar escopo:
1. o fiel volta pelo Momento Diário;
2. a paróquia consegue ativar sua comunidade;
3. existem transações reais em pelo menos um motor de receita.
