FROM mhart/alpine-node:12

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN yarn install

CMD [ "yarn", "start" ]
