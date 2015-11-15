#!/bin/bash

cd ~/repoFolder

git checkout ${2}
git reset --hard
git pull

rm -f SingleVoc.ttl
pass=true

errors=""

for fileName in `find . -name '*.ttl'`; do

     res=$(rapper -i turtle "${fileName}" -c 2>&1)
  
    #JenaRiot res=$(java -jar ~/VoCol/tools/JenaSyntaxValidator.jar "${fileName}" -c 2>&1)

    if echo $res | grep -q "Error"; then
	#echo "\t\033[31mValidation Failed! ${file}\033[0m"
	#echo $res
	 errors="${errors}<li>${res}</li>"
	pass=false
    else
       #echo "\t\033[32mValidation Passed! ${file}\033[0m"
       rapper -i turtle -o ntriples $fileName > $fileName.nt
    fi
done

 fileContent=`cat ~/VoCol/templates/syntaxErrorsTemplate.html`

 result_Content="${fileContent/errors_to_replace/$errors}"

 echo "${result_Content}" > ~/schemaorg/docs/syntax_validation.html


 errorFilePath="URI file:///home/vagrant/repoFolder/"

 errorFilePath="${errorFilePath//\//\\/}"

 sed -i "s/${errorFilePath}//g" ~/schemaorg/docs/syntax_validation.html

if [ "$pass" = false ]; then
	    echo "\033[41mValidation Failed:\033[0m Please fix syntax errors and try again.\n"
	    exit 1
	else 
    
     	    for fileName in `find . -name '*.nt'`; do

	     cat ${fileName} >> SingleVoc.nt
	     
	     rm -f ${fileName}
	    done

	    rapper -i ntriples -o turtle SingleVoc.nt > SingleVoc.ttl

	     cp SingleVoc.nt ~/VoCol/serializations/

             rapper -i ntriples -o rdfxml SingleVoc.nt > ~/VoCol/serializations/SingleVoc.rdf

            cp SingleVoc.ttl ~/VoCol/serializations/

	    rm -f SingleVoc.nt
  
	    sed -i "s/&/And/g" SingleVoc.ttl

            cd ~/VoCol
	
	    java -jar tools/JenaHtmlGenerator.jar ~/repoFolder/SingleVoc.ttl templates/schemasTemplate.html ~/schemaorg/docs/schemas.html templates/template.html ~/schemaorg/data/schema.rdfa 

	    cd ~/schemaorg/data

	    iconv -f iso-8859-1 -t utf-8 schema.rdfa > schemab.rdfa
	    rm -f schema.rdfa

             cd ~/VoCol/tools

             java -jar owl2vowl.jar -file ~/repoFolder/SingleVoc.ttl 

             mv SingleVoc.json ~/schemaorg/docs/webvowl/js/data/

	     java -jar widoco-0.0.1-jar-with-dependencies.jar -ontFile /home/vagrant/repoFolder/SingleVoc.ttl -outFolder /home/vagrant/schemaorg/docs/Widoco/widocoGen -confFile /home/vagrant/schemaorg/docs/Widoco/JAR/config/config.properties -rewriteAll

	     cp ~/VoCol/templates/widocoTemplate.html /home/vagrant/schemaorg/docs/Widoco/widocoGen/index.html

             cd ~/VoCol/evolution

             if [ -f SingleVoc.ttl ]; then

             evolutionReport=$(owl2diff SingleVoc.ttl ~/repoFolder/SingleVoc.ttl  -c 2>&1)

             if echo $evolutionReport | grep -q -v "identical"; then

             fileContent=`cat ~/schemaorg/docs/evolution.html`

             constant_string="diff SingleVoc.ttl /home/vagrant/repoFolder/SingleVoc.ttl"
             generationDate="$(date +%d-%m-%Y)"
             openTag="<"
             closeTag=">"
             openTagHtml="&lt;"
             closeTagHtml="&gt;"
             reportDiv="<div> </div>"
	     add="+"
	     del="-"
	     reportBreakInAddition="</br>+"
 	     reportBreakInDeletion="</br>-"
             evolutionReport="${evolutionReport//$openTag/$openTagHtml}"
             evolutionReport="${evolutionReport//$closeTag/$closeTagHtml}"
             evolutionReport="${evolutionReport/$constant_string/}"
	     evolutionReport="${evolutionReport//$del/$reportBreakInDeletion}"
             evolutionReport="${evolutionReport//$add/$reportBreakInAddition}"

	     uniqueID=$(cat /proc/sys/kernel/random/uuid)

	     result_Content="${fileContent/$reportDiv/$reportDiv</hr></br><div id=\"$uniqueID\">$generationDate$evolutionReport</div></br>}"

             echo "${result_Content}" > ~/schemaorg/docs/evolution.html
             rm SingleVoc.ttl

	     cd ..

             node helper.js $uniqueID "\"${1}\""

             fi
             fi

             cp ~/repoFolder/SingleVoc.ttl ~/VoCol/evolution/SingleVoc.ttl

	    	errors=""
	    	queries=""
	    	cd ~/repoFolder/
	    	for fileName in `find . -name '*.rq'`; do

	    #-PredefinedQueries	error=$(roqet "${fileName}" -c 2>&1)

	    #-PredefinedQueries   if echo $res | grep -q "Error"; then
	    #-PredefinedQueries      errors="${errors}<li>${error}</li>"
	    #-PredefinedQueries	  else
	    	     query=`cat "${fileName}"`
	    	     queryName=(${fileName//.rq/ })
	           queries="${queries}{\"name\":\"${queryName[0]:2}\", \"query\":\`${query}\`},"
	    #-PredefinedQueries	   fi
	    	done

	     if [ "$queries" != "" ]; then
               queries=${queries:offset:length-1}
	       cp templates/templateQonsole-config.js ~/fuseki/apache-jena-fuseki-2.3.0/webapp/js/app/qonsole-config.js
               sed -i "s//${queries}/g" ~/fuseki/apache-jena-fuseki-2.3.0/webapp/js/app/qonsole-config.js

	    			 echo "
		 /** Standalone configuration for qonsole on index page */

		 define( [], function() {
		   return {
		     prefixes: {
		       \"rdf\":      \"http://www.w3.org/1999/02/22-rdf-syntax-ns#\",
		       \"rdfs\":     \"http://www.w3.org/2000/01/rdf-schema#\",
		       \"owl\":     \"http://www.w3.org/2002/07/owl#\",
		       \"xsd\":      \"http://www.w3.org/2001/XMLSchema#\"
		     },
		     queries: [
		      ${queries}
		     ]
		   };
		 } );
		 " > ~/fuseki/apache-jena-fuseki-2.3.0/webapp/js/app/qonsole-config.js

	     fi

	    #-PredefinedQueries if [ "$errors" != "" ]; then
	    #-PredefinedQueries    errorFilePath="URI file:///home/vagrant/repoFolder/"
	    #-PredefinedQueries    errorFilePath="${errorFilePath//\//\\/}"
	    #-PredefinedQueries    sed -i "s/${errorFilePath}//g" ~/schemaorg/docs/syntax_validation.html
	    #-PredefinedQueries    sed -i "s/<!--QueryValidation//g" ~/schemaorg/docs/syntax_validation.html
            #-PredefinedQueries    sed -i "s/QueryValidation-->//g" ~/schemaorg/docs/syntax_validation.html
            #-PredefinedQueries    sed -i "s/sparql_query_errors/${errors}/g" ~/schemaorg/docs/syntax_validation.html
	    #-PredefinedQueries fi
	    
	    fuser -k 3030/tcp

	     cd ~/fuseki/apache-jena-fuseki-2.3.0/

	     ./fuseki-server --file=/home/vagrant/repoFolder/SingleVoc.ttl /myDataset &


	fi



