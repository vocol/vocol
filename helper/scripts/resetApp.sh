###########################################################################
###This script to delete any previous data was loaded before in the app ###
###########################################################################

echo -n > helper/tools/serializations/SingleVoc.ttl
echo -n > jsonDataFiles/syntaxErrors.json
echo -n > helper/tools/evolution/evolutionReport.txt
echo -n > jsonDataFiles/userConfigurations.json
rm -f jsonDataFiles/RDFSConcepts.json
rm -f jsonDataFiles/SKOSConcepts.json
rm -f jsonDataFiles/SKOSObjects.json 
rm -f jsonDataFiles/RDFSObjects.json 
rm -f helper/tools/serializations/SingleVoc.nt 
rm -f helper/tools/serializations/SingleVoc.ttl
rm -f helper/tools/evolution/SingleVoc.ttl
rm -f views/webvowl/js/data/SingleVoc.json

