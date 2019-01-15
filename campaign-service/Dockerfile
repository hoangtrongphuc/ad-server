FROM node:10.14.0-alpine
ADD package*.json /tmp/
RUN cd /tmp && npm set progress false && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
COPY src .
ENV PORT 3000

EXPOSE 3000

CMD ["node","index.js"]