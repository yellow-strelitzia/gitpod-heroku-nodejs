FROM node:12.13
WORKDIR /app
COPY . /app
RUN npm install express
CMD npm start
