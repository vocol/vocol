###########################################################################
###This script to delete any previous data was loaded before in the app ###
###########################################################################

echo -n > helper/tools/serializations/SingleVoc.nt
echo -n > jsonDataFiles/syntaxErrors.json
echo -n > helper/tools/evolution/evolutionReport.txt
echo -n > jsonDataFiles/userConfigurations.json
rm -f jsonDataFiles/RDFSConcepts.json
rm -f jsonDataFiles/SKOSConcepts.json
rm -f jsonDataFiles/SKOSObjects.json
rm -f jsonDataFiles/RDFSObjects.json
rm -f jsonDataFiles/OWLIndividiuals.json
rm -f helper/tools/serializations/SingleVoc.nt
rm -f helper/tools/serializations/SingleVoc.nt
rm -f helper/tools/evolution/SingleVoc.nt
rm -f helper/tools/rdf2rdf/temp.nt
rm -f views/webvowl/data/SingleVoc.json
