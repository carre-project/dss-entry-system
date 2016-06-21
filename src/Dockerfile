FROM nginx

COPY . /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf && rm /etc/nginx/conf.d/examplessl.conf && mv /usr/share/nginx/html/nginx.conf.default /etc/nginx/nginx.conf.default

ENV PORT 80
ENV LANGUAGE en
ENV API_URL https://carre.kmi.open.ac.uk/ws/
ENV CACHE_URL https://cache.carre-project.eu/
ENV AUTH_URL https://devices.carre-project.eu/devices/accounts/
ENV GRAPH_URL http://carre.kmi.open.ac.uk/

RUN ./env && rm ./env

EXPOSE 80
CMD ['nginx']