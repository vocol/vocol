#!/bin/bash
portNumber=3030
fuser -k $portNumber/tcp
rm -f run/system/tdb.lock
numofFiles=$(find ../../../../repoFolder/ -type f -name "*.ttl"| wc -l )
filePath=$(find ../../../../repoFolder/ -type f -name "*.ttl")
cd ../apache-jena-fuseki
if [ "$numofFiles" = "1" ]
then
./fuseki-server --file=$filePath --port=$portNumber /dataset &
else
./fuseki-server --file=../serializations/SingleVoc.nt --port=$portNumber /dataset &
fi
