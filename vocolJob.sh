#!/usr/bin/env bash

GITHUB_TOKEN=<client_token>
GITHUB_REPOSITORY="Mobivoc/Mobivoc"
INTERVAL=5  # (minutes) in which the repository is checked


# generate Issues, if new errors exist
python validator/issueGenerator.py -t "$GITHUB_TOKEN" -r "$GITHUB_REPOSITORY" -i "$INTERVAL"

# generate a new vocabulary version, if it is valid & necessary (=new changes)
python validator/vocabularyGenerator.py -t "$GITHUB_TOKEN" -r "$GITHUB_REPOSITORY" -i "$INTERVAL"

LAST_VOCAB_MODIFICATION_DATE=$(date -r deploy/Mobivoc.ttl +%s)
DATE_NOW=$(date +%s)
DIFF_IN_MINUTES=$((($DATE_NOW-$LAST_VOCAB_MODIFICATION_DATE)/60))


# is there a new version? 
if [[ $DIFF_IN_MINUTES -lt $INTERVAL ]]
then
    # publish new version
    java -cp  .:jena-arq-2.12.1.jar:jena-core-2.12.1.jar:jena-iri-1.1.1.jar:log4j-1.2.17.jar:slf4j-api-1.7.6.jar:xercesImpl-2.11.0.jar:xml-apis-1.4.01.jar HtmlGenerator deploy/Mobivoc.ttl deploy/Mobivoc.rdfa HtmlGenerator/Templates/template.html deploy/Mobivoc.html HtmlGenerator/Templates/schemasTemplate.html 
fi





