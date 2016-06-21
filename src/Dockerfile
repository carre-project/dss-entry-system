FROM nginx

COPY . /usr/share/nginx/html

ENV PORT 80

RUN rm /etc/nginx/conf.d/default.conf && mv /usr/share/nginx/html/nginx.conf.default /etc/nginx/nginx.conf.default && cd /usr/share/nginx/html && ./env && rm env


EXPOSE 80
CMD ['nginx']