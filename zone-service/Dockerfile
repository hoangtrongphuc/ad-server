FROM node:10.14.0-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
ADD package*.json /opt/app/
RUN npm set progress false && npm install

COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh
VOLUME [ "/opt/app" ]

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]