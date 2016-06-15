FROM node:4-slim
RUN mkdir -p /home/carre-entry-system/
ADD . /home/carre-entry-system/

ENV PORT 8000
ENV NODE_ENV production

RUN cd /home/carre-entry-system && npm install
EXPOSE 8000:8000

# Run  server
CMD ["npm", "start"]