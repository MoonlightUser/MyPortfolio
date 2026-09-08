FROM node:24-bookworm-slim
WORKDIR /app
RUN npm install --global pnpm@11.19.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --chown=node:node server ./server
COPY --chown=node:node blog ./blog
RUN mkdir -p data && chown node:node data
USER node
EXPOSE 3000
CMD ["node", "server/index.js"]
