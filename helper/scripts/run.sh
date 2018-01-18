#!/bin/bash

<<<<<<< HEAD
numofFiles=$(find ../../../../repoFolder/ -type f -name "*.ttl"| wc -l )
filePath=$(find ../../../../repoFolder/ -type f -name "*.ttl")
cd ../apache-jena-fuseki
if [ "$numofFiles" = "1" ]
then
./fuseki-server --file=$filePath /dataset &
else
./fuseki-server --file=../serializations/SingleVoc.ttl /dataset &
fi

=======

pwd
cd ../apache-jena-fuseki
./fuseki-server --file=../serializations/SingleVoc.ttl /dataset &
pwd
>>>>>>> 605efe411cacf5f9bb425972e5d2842e34597d46

