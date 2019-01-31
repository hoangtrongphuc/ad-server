FROM node:10.14.0-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package*.json ./
RUN npm set progress false && npm install

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
VOLUME [ "/opt/app", "/opt/app/node_modules" ]

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]