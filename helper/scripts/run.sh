#!/bin/bash
fuser -k 3030/tcp
rm -f run/system/tdb.lock
numofFiles=$(find ../../../../repoFolder/ -type f -name "*.ttl"| wc -l )
filePath=$(find ../../../../repoFolder/ -type f -name "*.ttl")
cd ../apache-jena-fuseki
if [ "$numofFiles" = "1" ]
then
./fuseki-server --file=$filePath /dataset &
else
./fuseki-server --file=../serializations/SingleVoc.nt /dataset &
fi
