#!/usr/bin/env bash
#
# Regular VoCol validation/publishing job; assumes that
# * it's called as a cronjob every 5 minutes (see INTERVAL below)
# * it's run in the vocol directory

GITHUB_TOKEN=<client_token>
GITHUB_REPOSITORY="Mobivoc/Mobivoc"
INTERVAL=5  # (minutes) in which the repository is checked

DEPLOY_PATH="./deploy"
SCHEMAORG_PATH="$HOME/schemaorg"
VOCOL_PATH="."

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
    java \
        -cp  .:jena-arq-2.12.1.jar:jena-core-2.12.1.jar:jena-iri-1.1.1.jar:log4j-1.2.17.jar:slf4j-api-1.7.6.jar:xercesImpl-2.11.0.jar:xml-apis-1.4.01.jar \
        HtmlGenerator \
        "${DEPLOY_PATH}/Mobivoc.ttl" \
        "${SCHEMAORG_PATH}/data/schema.rdfa" \
        "${VOCOL_PATH}/HtmlGenerator/Templates/template.html" \
        "${SCHEMAORG_PATH}/docs/schemas.html" \
        "${VOCOL_PATH}/HtmlGenerator/Templates/schemasTemplate.html"
fi
