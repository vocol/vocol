#!/bin/bash
#

if lsof -i:8080
then
    fuser -k 8080/tcp
fi

if lsof -i:3030
then
    fuser -k 3030/tcp
fi

if lsof -i:3000
then
    fuser -k 3000/tcp
fi

if lsof -i:3001
then
    fuser -k 3001/tcp
fi

if lsof -i:3002
then
    fuser -k 3002/tcp
fi

cd ~/
google_appengine/dev_appserver.py schemaorg/app.yaml &

cd ~/VoCol
node configurationApp.js &

node webHookListener.js &

cd ~/VoCol/tools

 java -jar WSRapperSyntaxValidation.jar &
#JenaRiot java -jar WSJenaRiotSyntaxValidation.jar &

cd ~/fuseki/apache-jena-fuseki-2.3.0/
./fuseki-server --mem /myDataset &
