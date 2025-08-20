FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy everything except node_modules
COPY . .

# Expose backend port
EXPOSE 5001

# CMD: apply migrations, generate Prisma client, then start dev server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run dev"]