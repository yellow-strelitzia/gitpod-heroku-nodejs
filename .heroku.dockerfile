FROM node:12.13
WORKDIR /app
COPY . /app
RUN npm i
CMD npm start
