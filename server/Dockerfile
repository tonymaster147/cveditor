FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application code
COPY index.js db.js mailer.js ./
COPY routes ./routes
COPY backfill-customer-details.js ./

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "index.js"]
