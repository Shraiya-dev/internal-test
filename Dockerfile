FROM node:lts-alpine as build-stage

ARG VITE_PUBLIC_APP_ENV

ENV VITE_PUBLIC_APP_ENV ${VITE_PUBLIC_APP_ENV}
RUN npm i -g npm@8.5.5

ENV APP_HOME=/usr/src/app
RUN mkdir -p $APP_HOME
COPY . $APP_HOME
RUN cd $APP_HOME && npm ci
WORKDIR $APP_HOME
RUN npm run build
EXPOSE 5000

CMD ["npm", "run", "serve"]