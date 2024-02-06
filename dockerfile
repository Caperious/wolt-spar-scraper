FROM node:14.8.0

COPY src /app/src
COPY package.json /app
COPY package-lock.json /app

COPY tsconfig.build.json /app
COPY tsconfig.json /app
COPY nest-cli.json /app
COPY .env /app

ENV REQUESTS_PER_MINUTE=60

WORKDIR /app

RUN npm install
RUN npm run build

CMD npm run start

