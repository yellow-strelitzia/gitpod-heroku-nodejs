FROM node:12.13
WORKDIR /app
COPY . /app
RUN npm install express node-fetch moment netlify-lambda now
CMD npm start
