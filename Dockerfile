FROM node:20.13.1-alpine
WORKDIR /app
COPY package.json .
EXPOSE 8080
ENV PORT="8080"
RUN npm install
COPY . .
CMD npm run dev