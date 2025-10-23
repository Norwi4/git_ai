# === Stage 1: Build stage ===
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходники
COPY . .

# Собираем Next.js приложение
RUN npm run build

# === Stage 2: Production stage ===
FROM node:20-alpine AS runner

WORKDIR /app

# Устанавливаем только продакшн-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем билд из builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Указываем порт
EXPOSE 3000

# Команда запуска
CMD ["npm", "start"]
