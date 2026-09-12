# Vinde — MVP

Plataforma católica digital orientada a hábito, comunidade e transações.

**Tese:** a paróquia distribui, o conteúdo retém e a economia monetiza.

## Experiência do fiel
- Home
- Onboarding e vínculo com paróquia
- Momento Diário
- Minha Igreja
- Eventos e campanhas
- Peregrinações
- Livraria / marketplace
- Perfil e biblioteca

## Lado B2B
- `/admin` painel paroquial
- `/vendedor` painel do marketplace
- `/organizador` painel de peregrinações

## Monetização preparada
Marketplace, livros/e-books, eventos, campanhas, peregrinações, assinatura editorial e recursos premium para instituições. Valores e splits definitivos dependem de gateway, estrutura jurídica e tributação.

## Stack
Next.js 16 + React 19 + TypeScript + Supabase + Vercel.

## Rodar
```bash
npm install
cp .env.example .env.local
npm run dev
```

O front abre em modo demonstração sem Supabase. Para dados reais, crie um projeto Supabase e execute `supabase/schema.sql`.

## Rotas
`/`, `/onboarding`, `/momento`, `/igreja`, `/explorar`, `/campanhas`, `/peregrinacoes`, `/livros`, `/loja`, `/perfil`, `/admin`, `/vendedor`, `/organizador`.

## Fora do MVP de produção
Checkout real, split financeiro, antifraude, emissão fiscal, operação turística, conteúdo editorial licenciado e autenticação completa exigem provedores/credenciais e validação jurídica antes do lançamento.
