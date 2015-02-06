#!/bin/bash

GITHUB_CLIENT_ID="2210b5af0648f5d4b157"
GITHUB_CLIENT_SECRET="b108e6adcb7ccde3940a0d14c4c8fcd0fa46a1e8"
GITHUB_REPOSITORY="Mobivoc/Mobivoc"
INTERVAL=5  # (minutes) in which the repository is checked


# generate Issues, if new errors exist
python validator/issueGenerator.py -c $GITHUB_CLIENT_ID -r $GITHUB_REPOSITORY -s $GITHUB_CLIENT_SECRET -i $INTERVAL

# generate a new vocabulary version, if it is valid & necessary (=new changes)
python validator/vocabularyGenerator.py -c $GITHUB_CLIENT_ID -s $GITHUB_CLIENT_SECRET -r $GITHUB_REPOSITORY -i $INTERVAL


LAST_VOCAB_MODIFICATION_DATE=`date -r deploy/Mobivoc.ttl +%s`
DATE_NOW=`date +%s`
DIFF_IN_MINUTES=$((($DATE_NOW-$LAST_VOCAB_MODIFICATION_DATE)/60))


# is there a new version? 
if [ $DIFF_IN_MINUTES -lt $INTERVAL ]
then
    # publish new version
    java -cp  .:jena-arq-2.12.1.jar:jena-core-2.12.1.jar:jena-iri-1.1.1.jar:log4j-1.2.17.jar:slf4j-api-1.7.6.jar:xercesImpl-2.11.0.jar:xml-apis-1.4.01.jar HtmlGenerator deploy/Mobivoc.ttl deploy/Mobivoc.rdfa HtmlGenerator/Templates/template.html deploy/Mobivoc.html HtmlGenerator/Templates/schemasTemplate.html 
fi





