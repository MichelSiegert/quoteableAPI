FROM node:18
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
ENV PORT=3001
ENV APIKEY=YOURKEY
COPY server.js ./

EXPOSE 3001
CMD ["node", "server.js"]
