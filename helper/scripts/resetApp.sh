###########################################################################
###This script to delete any previous data was loaded before in the app ###
###########################################################################

echo -n > helper/tools/serializations/SingleVoc.nt
echo "[]" > jsonDataFiles/syntaxErrors.json
echo "" > helper/tools/evolution/evolutionReport.txt
echo "{}" > jsonDataFiles/userConfigurations.json
echo "[]" > jsonDataFiles/RDFSConcepts.json
echo "[]" > jsonDataFiles/SKOSConcepts.json
echo "[]" > jsonDataFiles/SKOSObjects.json
echo "[]" > jsonDataFiles/RDFSObjects.json
echo "[]" > jsonDataFiles/OWLIndividiuals.json
rm -f helper/tools/serializations/SingleVoc.nt
rm -f helper/tools/evolution/SingleVoc.nt
rm -f helper/tools/ttl2ntConverter/Output.report
rm -f views/webvowl/data/SingleVoc.json
rm -f helper/tools/RDF-Doctor/*.error
rm -f helper/tools/RDF-Doctor/*.output
