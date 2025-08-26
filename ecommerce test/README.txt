
# Lojica - E-commerce (Monorepo)

## Requisitos
- Docker & Docker Compose
- Node 20+ (para rodar sem Docker)
- pnpm (recomendado) ou npm

## Como rodar com Docker
1. Copie `.env.example` para `.env` e ajuste valores.
2. `docker compose up --build`
3. Entre no container backend e rode migrations:
   - `docker compose exec backend pnpm prisma migrate dev --name init`
   - `docker compose exec backend pnpm prisma:seed`
4. Frontend: http://localhost:3000, Backend: http://localhost:4000

## Scripts úteis
- `pnpm dev` (backend / frontend)
- `pnpm prisma:migrate`
- `pnpm prisma:seed`

## Contas de teste
- admin@example.com / (defina senha via seed manual ou console)

## Notas de segurança
- JWT_SECRET e SMTP devem ser configurados em produção.
- Para categorias sensíveis, use `RESTRICTED_CATEGORIES_ENABLED=false` para desativar.

## Próximos passos
- Implementar OAuth Google/Facebook (placeholders já prontos).
- Substituir pagamento mock por gateways reais (Gerencianet, Pagar.me, etc).
- Completar testes E2E (Playwright) e coverage.

