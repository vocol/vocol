# This script to delete any previous data was loaded in the app.
rm -f views/webvowl/js/data/SingleVoc.json
echo -n > jsonDataFiles/userConfigurations.json
echo -n > jsonDataFiles/syntaxErrors.json
echo -n > helper/tools/evolution/evolutionReport.txt
rm -f jsonDataFiles/RDFSConcepts.json
rm -f jsonDataFiles/SKOSConcepts.json
rm -f jsonDataFiles/SKOSObjects.json 
rm -f jsonDataFiles/RDFSObjects.json 
rm -f helper/tools/serializations/SingleVoc.nt 
rm -f helper/tools/serializations/SingleVoc.ttl
rm -f helper/tools/evolution/SingleVoc.ttl

