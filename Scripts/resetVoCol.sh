#!/bin/bash
#

fuser -k 8080/tcp
fuser -k 3000/tcp
fuser -k 3001/tcp
fuser -k 3002/tcp
fuser -k 3030/tcp

rm -rf ~/schemaorg/docs/otherBranches/*
echo -n "[]" > ~/schemaorg/docs/otherBranches.json

rm -rf ~/schemaorg/docs/Widoco/widocoGen/*
cp ~/VoCol/templates/widocoTemplate.html /home/vagrant/schemaorg/docs/Widoco/widocoGen/index.html

rm -rf ~/schemaorg/data/*
cp ~/VoCol/templates/init.rdfa ~/schemaorg/data/init.rdfa

cp ~/VoCol/templates/schemasTemplate.html ~/schemaorg/docs/schemas.html
sed -i "s/\$li//g" ~/schemaorg/docs/schemas.html

cp ~/VoCol/templates/syntaxErrorsTemplate.html ~/schemaorg/docs/syntax_validation.html
sed -i "s/errors_to_replace//g" ~/schemaorg/docs/syntax_validation.html

rm -f ~/schemaorg/docs/webvowl/js/data/SingleVoc.json

rm -rf ~/VoCol/serializations/*

cp ~/VoCol/templates/evolutionTemplate.html ~/schemaorg/docs/evolution.html 
rm ~/VoCol/evolution/SingleVoc.ttl
echo -n "[]" > ~/schemaorg/docs/data.json

rm -r -f ~/repoFolder

cp ~/VoCol/templates/blankConfiguration_Page.html ~/schemaorg/docs/configuration_page.html 
cp ~/VoCol/templates/blankHomepage.tpl ~/schemaorg/templates/homepage.tpl
cp ~/VoCol/templates/basicPageHeaderTemplate.tpl ~/schemaorg/templates/basicPageHeader.tpl

~/google_appengine/dev_appserver.py ~/schemaorg/app.yaml &

cd ~/VoCol
node configurationApp.js &

echo -e "\e[93mVoCol has been reset successfully!"
echo -e "\e[93mPlease open http://192.168.33.10/docs/configuration_page.html and configure VoCol before start using it!"
echo -e "\e[39m "
