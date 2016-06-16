FROM mhart/alpine-node:4

WORKDIR /src
COPY . ./

ENV PORT 80
ENV CARRE_ENTRY_SYSTEM_LANGUAGE en
ENV CARRE_ENTRY_SYSTEM_API_URL https://carre.kmi.open.ac.uk/ws/
ENV CARRE_ENTRY_SYSTEM_AUTH_URL https://devices.carre-project.eu/devices/accounts/
ENV CARRE_ENTRY_SYSTEM_GRAPH_URL http://carre.kmi.open.ac.uk/

EXPOSE 80
CMD ["node", "server.js"]