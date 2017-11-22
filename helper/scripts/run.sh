#!/bin/bash


pwd
cd ../apache-jena-fuseki
./fuseki-server --file=../serializations/SingleVoc.ttl /dataset &
pwd

