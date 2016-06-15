FROM node:4-slim
ENV PORT 2001 

ENV NODE_ENV production
ENV CARRE_ENTRY_SYSTEM_LANGUAGE el
ENV CARRE_ENTRY_SYSTEM_API_URL https://carre.kmi.open.ac.uk/ws/
ENV CARRE_ENTRY_SYSTEM_AUTH_URL https://devices.carre-project.eu/devices/accounts/
ENV CARRE_ENTRY_SYSTEM_GRAPH_URL http://carre.kmi.open.ac.uk/

RUN npm install -g gulp bower pm2 && echo $PWD && ls -l && bower install --allow-root && gulp build && pm2 start server/index.js --name "entry-system"

EXPOSE $PORT