FROM node:4-slim
RUN mkdir -p /home/carre-entry-system/
ADD . /home/carre-entry-system/

ENV PORT 2001 
ENV NODE_ENV production
ENV CARRE_ENTRY_SYSTEM_LANGUAGE el
ENV CARRE_ENTRY_SYSTEM_API_URL https://carre.kmi.open.ac.uk/ws/
ENV CARRE_ENTRY_SYSTEM_AUTH_URL https://devices.carre-project.eu/devices/accounts/
ENV CARRE_ENTRY_SYSTEM_GRAPH_URL http://carre.kmi.open.ac.uk/

RUN cd /home/carre-entry-system && node server/index.js --name "entry-system"

EXPOSE 2001