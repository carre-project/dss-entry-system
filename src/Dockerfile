FROM mhart/alpine-node:4

WORKDIR /src
ADD . .
EXPOSE 80
ENV PORT 80

ENV CARRE_ENTRY_SYSTEM_LANGUAGE en
ENV CARRE_ENTRY_SYSTEM_API_URL https://carre.kmi.open.ac.uk/ws/
ENV CARRE_ENTRY_SYSTEM_AUTH_URL https://devices.carre-project.eu/devices/accounts/
ENV CARRE_ENTRY_SYSTEM_GRAPH_URL http://carre.kmi.open.ac.uk/

CMD ["node", "server.js"]