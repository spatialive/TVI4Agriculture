FROM registry.lapig.iesa.ufg.br/lapig-images-homol/tvi4agriculture:base

LABEL maintainer="Renato Gomes <renatogomessilverio@gmail.com>"

# Clone app and npm install on server
ENV URL_TO_APPLICATION_GITHUB="https://github.com/spatialive/TVI4Agriculture.git"
ENV BRANCH="main"

RUN apk add curl wget && cd /APP && git clone -b ${BRANCH} ${URL_TO_APPLICATION_GITHUB} \
    && mkdir -p /APP/TVI4Agriculture/server/logs

ADD ./server/node_modules /APP/TVI4Agriculture/server/node_modules  
ADD ./client/dist /APP/agrotoxicos/client/dist

WORKDIR /APP/TVI4Agriculture/server 

CMD [ "/bin/bash", "-c", "npx prisma generate && tsc && node dist/index.js 2>&1"]

ENTRYPOINT [ "/APP/Monitora.sh"]
