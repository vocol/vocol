define( [], function() {
return {
prefixes: {
"rdf":      "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
"rdfs":     "http://www.w3.org/2000/01/rdf-schema#",
"owl":      "http://www.w3.org/2002/07/owl#",
"xsd":      "http://www.w3.org/2001/XMLSchema#"
},
queries: [
      { "name": "Selection of triples",
        "query": "SELECT ?subject ?predicate ?object"+
"WHERE {"+
                 "  ?subject ?predicate ?object}"+
                  "LIMIT 25"
      },
      { "name": "Selection of classes",
        "query": "SELECT DISTINCT ?class ?label ?description"+
"WHERE {"+
                 "  ?class a owl:Class."+
                 "  OPTIONAL { ?class rdfs:label ?label}"+
                 "  OPTIONAL { ?class rdfs:comment ?description}}"+
                 "LIMIT 25",
        "prefixes": ["owl", "rdfs"]
      }
, { "name":"check_general",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX er: <https://w3id.org/i40/er#>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nCONSTRUCT\n{\n?s1 er:problem er:prob1 .\n   er:prob1 rdfs:label \"Publication Date must be a correct xsd:date.\" .\n   \n?s2 er:problem er:prob2 .\n   er:prob2 rdfs:label \"Publication URI must be a correct URI.\" .\n}\nWHERE \n{ \n  {\n\t  ?s1 a sto:Standard .\n\t  ?s1 sto:hasPublicationDate ?db\n\t\tFILTER ((datatype(?db)) != xsd:date)\n  }\n  \n  UNION \n  \n  {\n\t  ?s2 a sto:Standard .\n\t  ?s2 sto:hasOfficialResource ?or\n\t  FILTER (!(isURI(?or)))\n  }\n  \n} "
}
, { "name":"OPC_Foundation",
"query" :"@prefix sto: <https://w3id.org/i40/sto#> .\n@prefix dc:  <http://purl.org/dc/terms/> .\nsto:OPC_Foundation  rdf:type  sto:SDO ;\n sto:name                 \"OPC Foundation\"@en;\n dc:description \"Industry consortium that creates and maintains...\"@en;\n sto:abbreviation         \"OPC\";\n sto:formationDate        \"1994-01-01\"^^xsd:date;\n sto:hasDBpediaResource   <http://dbpedia.org/resource/Association_...>;\n sto:hasOfficialResource  <https://opcfoundation.org/>;\n sto:hasWikidataEntity    <https://www.wikidata.org/entity/Q7072814>;\n sto:hasWikipediaArticle  <https://en.wikipedia.org/wiki/OPC_Foundation>.\n"
}
, { "name":"OPC_UA",
"query" :"PREFIX rami: <https://w3id.org/i40/rami#>\nPREFIX sto: <https://w3id.org/i40/sto#>\n\nSELECT ?std ?classification  ?initiative\nWHERE {\n    ?classification sto:isDescribedin ?initiative .\n    ?std sto:hasClassification ?classification .\n    ?std  sto:hasTag \"OPC UA\"@en . \n}"
}
, { "name":"getSubPropertiesValues",
"query" :"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nSELECT ?sub ?pred ?obj\nWHERE {\n  ?sub ?pred ?obj.\n  ?pred rdfs:subPropertyOf* sto:relatedTo .\n  \n} "
}
, { "name":"counting_dbpedia_links",
"query" :"PREFIX rami: <https://w3id.org/i40/rami#>\nPREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX dct: <http://purl.org/dc/terms/>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\n\nSELECT (COUNT(*) as ?total) \nWHERE {\n    ?std sto:hasDBpediaResource ?resource .\n   #?std rdf:type sto:Standard .\n}"
}
, { "name":"std",
"query" :"PREFIX rami: <https://w3id.org/i40/rami#>\nPREFIX sto: <https://w3id.org/i40/sto#>\n\nSELECT ?std ?classification \nWHERE {\n    ?std sto:hasClassification ?classification .\n}"
}
, { "name":"standards",
"query" :"PREFIX rami: <https://w3id.org/i40/rami#>\nPREFIX sto: <https://w3id.org/i40/sto#>\nSELECT DISTINCT\n  ?name ?RAMIITLayer ?ISA95Level ?PLM ?AdminShellSubmodel ?license ?publisher\nWHERE {\n    ?std  a                            sto:Standard ;\n      sto:norm                         ?norm ;\n\t  (sto:publisher/sto:name)         ?publisher ;\n      (sto:publisher/sto:abbreviation) ?publisherAbbrv ;\n\t  rami:hasRAMIITLayer              ?RAMIITLayer .\n    FILTER(LANGMATCHES(LANG(?publisher), \"en\"))\n    OPTIONAL { ?std sto:hasTag                   ?tag .}\n    OPTIONAL { ?std sto:license                  ?license ;\n          \t\t    sto:hasOfficialResource      ?officialResource . }\n\tOPTIONAL { ?std rami:hasAdminShellSubmodel  ?AdminShellSubmodel . }\n\tOPTIONAL { ?std sto:hasISA95Level           ?ISA95Level . }\n    OPTIONAL { ?std sto:isUtilizedIn            ?PLM . }\n  \tBIND(CONCAT(?publisherAbbrv,\" \",?norm,\" - \",?tag) as ?name)\n}\n"
}
, { "name":"all_standards_transitivity",
"query" :"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX sto: <https://w3id.org/i40/sto#>\nSELECT ?fStdLabel ?p ?sStdLabel \nWHERE {\n\n{\n  ?firstStandard sto:relatedTo+|^sto:relatedTo ?secondStandard .\n  BIND (STR(sto:relatedTo) as ?p) .\n}\n\nUNION {\n   ?firstStandard ?p ?secondStandard .\n   ?p rdfs:subPropertyOf  sto:relatedTo .\n}\n    ?firstStandard  rdfs:label ?firstStandardLabel . \n    ?secondStandard rdfs:label ?secondStandardLabel .\n    BIND (STR(?firstStandardLabel)  AS ?fStdLabel) .\n    BIND (STR(?secondStandardLabel)  AS ?sStdLabel) .\n}"
}
, { "name":"named_graphs",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX dct: <http://purl.org/dc/terms/>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\nSELECT ?sto \nFROM <sto.ttl>\nFROM <sto_all.ttl>\nWHERE\n{ ?sto rdf:type sto:Standard . }\n"
}
, { "name":"all_standards",
"query" :"PREFIX rami: <https://w3id.org/i40/rami#>\nPREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX dct: <http://purl.org/dc/terms/>\n\n\nSELECT DISTINCT  ?name ?classification \n?stdFramework ?publisher ?license\nWHERE {\n    ?classification sto:isDescribedin ?stdFramework .\n    ?std sto:hasClassification ?classification .\n    ?std rdfs:label ?sto .\n    ?std sto:publisher ?publisher .\n  OPTIONAL { ?std  sto:hasTag ?tag .}\n  OPTIONAL { ?std  dct:license ?license .}\nBIND(CONCAT(str(?sto),\" - \",?tag) as ?name)\n}"
}
, { "name":"new_class_linkings_std",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\nSELECT DISTINCT ?obj\nWHERE {\n    ?std sto:hasDBpediaResource ?r . \n    ?std sto:hasClassification ?classification .\n    ?std ?pred ?obj .\n    FILTER ( ?obj!=sto:Standard && ?obj!= owl:NamedIndividual && ?pred = rdf:type && ?obj!= owl:Thing)\n} \n"
}
, { "name":"new_class_linkings_org",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\nSELECT DISTINCT ?obj\nWHERE {\n    ?std sto:hasDBpediaResource ?r . \n    ?std rdf:type sto:StandardOrganization.\n    ?std ?pred ?obj .\n    FILTER ( ?obj!=sto:StandardOrganization && ?obj!= owl:NamedIndividual && ?pred = rdf:type && ?obj!= owl:Thing)\n} "
}
, { "name":"sameAs_quantity_org",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nSELECT (COUNT(?std) as ?sameAsLinks)\nWHERE {\n    ?std sto:hasDBpediaResource ?r . \n    ?std rdf:type sto:StandardOrganization .\n    ?std ?pred ?obj .\n  FILTER (?pred = owl:sameAs && !strstarts(str(?obj), \"http://rdf.freebase.com\"))\n} "
}
, { "name":"new_properties_std",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX prov: <http://www.w3.org/ns/prov#>\nPREFIX db: <http://dbpedia.org/ontology:/>\nPREFIX st: <http://semweb.mmlab.be/ns/stoptimes#>\nPREFIX skos: <http://www.w3.org/2004/02/skos/core#>\nPREFIX dct: <http://purl.org/dc/terms/>\n\nSELECT DISTINCT ?pred \nWHERE {\n    ?std sto:hasDBpediaResource ?r . \n    ?std rdf:type sto:Standard .\n    ?std ?pred ?obj .\n  FILTER (\n    ?pred != rdf:type &&\n    ?pred != rdfs:label &&\n    ?pred != rdfs:comment &&\n    ?pred != sto:publisher && \n    ?pred != sto:hasOfficialResource &&\n    ?pred != sto:hasDBpediaResource &&\n    ?pred != sto:hasWikipediaArticle &&\n    ?pred != sto:hasClassification &&\n    ?pred != prov:wasDerivedFrom && \n    ?pred != sto:hasTag && \n    ?pred != sto:isImplementationOf &&\n    ?pred != sto:developer &&\n    ?pred != sto:relatedTo &&\n    ?pred != sto:motivation &&\n    ?pred != sto:hasDomain &&\n    ?pred != sto:isPartOf &&\n    ?pred != skos:altLabel &&\n    ?pred != skos:note &&\n    ?pred != rdfs:seeAlso &&\n    ?pred != owl:sameAs &&\n    ?pred != dct:license &&\n    ?pred != <http://dbpedia.org/ontology/wikiPageID> &&\n    ?pred != <http://dbpedia.org/ontology/wikiPageRevisionID> &&\n    ?pred != <http://dbpedia.org/ontology/thumbnail> &&\n    ?pred != <http://dbpedia.org/ontology/wikiPageRedirects> \n  )\n} \n\n"
}
, { "name":"new_properties_org",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX prov: <http://www.w3.org/ns/prov#>\nPREFIX db: <http://dbpedia.org/ontology:/>\nPREFIX st: <http://semweb.mmlab.be/ns/stoptimes#>\nPREFIX skos: <http://www.w3.org/2004/02/skos/core#>\nPREFIX dct: <http://purl.org/dc/terms/>\n\nSELECT DISTINCT ?org ?pred\nWHERE {\n    ?org sto:hasDBpediaResource ?r . \n    ?org rdf:type sto:StandardOrganization .\n    ?org ?pred ?obj .\n  FILTER (\n    ?pred != rdf:type &&\n    ?pred != rdfs:label &&\n    ?pred != rdfs:comment &&\n    ?pred != rdfs:isDefinedBy &&\n    ?pred != sto:publisher && \n    ?pred != sto:hasOfficialResource &&\n    ?pred != sto:hasDBpediaResource &&\n    ?pred != sto:hasWikipediaArticle &&\n    ?pred != sto:abbreviation && \n    ?pred != sto:belongsTo && \n    ?pred != sto:developer && \n    ?pred != sto:domainName &&\n    ?pred != sto:hasHeadquaterIn &&\n    ?pred != sto:formationDate &&\n    ?pred != sto:orgName &&\n    ?pred != skos:altLabel &&\n    ?pred != skos:note &&\n    ?pred != rdfs:seeAlso &&\n    ?pred != owl:sameAs &&\n    ?pred != dct:license &&\n    ?pred != prov:wasDerivedFrom &&\n    ?pred != <http://dbpedia.org/ontology/wikiPageID> &&\n    ?pred != <http://dbpedia.org/ontology/wikiPageRevisionID> && \n    ?pred != <http://dbpedia.org/ontology/thumbnail> \n  )\n} \n"
}
, { "name":"rdfs_multilingual_org",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nSELECT DISTINCT ?std ?pred ?obj\nWHERE {\n    ?std sto:hasDBpediaResource ?r . \n    ?std rdf:type sto:StandardOrganization .\n    ?std ?pred ?obj .\n  FILTER (\n    ((?pred = rdfs:label) || \n    (?pred = rdfs:comment) ||\n      (?pred = <http://dbpedia.org/ontology/abstract> ))\n    && \n    (!LANGMATCHES(LANG(?obj), \"en\"))\n  )\n} "
}
, { "name":"sameAs_quantity_std",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nSELECT (COUNT(?std) as ?sameAsLinks)\nWHERE {\n    ?std sto:hasDBpediaResource ?r . \n    ?std rdf:type sto:Standard .\n    ?std ?pred ?obj .\n  FILTER (?pred = owl:sameAs && !strstarts(str(?obj), \"http://rdf.freebase.com\") )\n} "
}
, { "name":"rdfs_multilingual_std",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nSELECT DISTINCT ?std ?pred ?obj\nWHERE {\n    ?std sto:hasDBpediaResource ?r . \n    ?std rdf:type sto:Standard .\n    ?std ?pred ?obj .\n  FILTER (\n    ((?pred = rdfs:label) || \n    (?pred = rdfs:comment) ||\n      (?pred = <http://dbpedia.org/ontology/abstract> ))\n    && \n    (!LANGMATCHES(LANG(?obj), \"en\"))\n  )\n} "
}
, { "name":"std1",
"query" :"PREFIX rami: <https://w3id.org/i40/rami#>\nPREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX muto: <http://purl.org/muto/core#>\nPREFIX st: <http://semweb.mmlab.be/ns/stoptimes#>\nPREFIX dc: <http://purl.org/dc/elements/1.1/>\nPREFIX dct: <http://purl.org/dc/terms/>\n\nSELECT DISTINCT ?std ?name ?classification ?standardFramework ?publisher ?license\nWHERE {\n    ?classification sto:isDescribedin ?standardFramework .\n    ?std sto:hasClassification ?classification .\n    ?std rdfs:label ?sto .\n    ?std sto:publisher ?publisher .\n  OPTIONAL { ?std  sto:hasTag ?tag .}\n  OPTIONAL { ?std  dct:license ?license .}\n  BIND(CONCAT(?sto,\" - \",?tag) as ?name)\n} \n#GROUP BY ?standardFramework ?name ?classification ?publisher ?license\nORDER BY ?name"
}
, { "name":"check_date",
"query" :"PREFIX sto: <https://w3id.org/i40/sto#>\nPREFIX er: <https://w3id.org/i40/er#>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nCONSTRUCT\n{\n?s er:problem er:prob29 .\n  er:prob29 rdfs:label \"Publication Date must be a correct xsd:date.\" .\n}\nWHERE {\n  ?s a sto:Standard .\n  ?s sto:hasPublicationDate ?db\n    FILTER ((datatype(?db)) != xsd:date)\n} "
}
, { "name":"IEC_62714",
"query" :"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX sto: <https://w3id.org/i40/sto#>\nSELECT DISTINCT ?std ?pred ?prop ?relNorm ?relsdoAbbr\nWHERE {\n    ?std  a                sto:Standard .\n    ?std  rdfs:label \"IEC 62714\"@en .\n    ?std  sto:publisher    ?sdo .\n    { {?std   ?pred  ?prop } UNION\n      {?prop  ?pred  ?std  } UNION {\n        ?std  (sto:relatedTo+|^sto:relatedTo+)*  ?mid .\n        ?mid  (sto:relatedTo|^sto:relatedTo)     ?prop .\n        {?mid   ?pred  ?prop } UNION\n        {?prop  ?pred  ?mid} \n      }\n    } FILTER (?std!=?prop)\n    OPTIONAL {\n      ?prop    sto:norm         ?relNorm .\n      ?prop    sto:publisher    ?relsdo .\n      ?relsdo  sto:abbreviation ?relsdoAbbr .\n    }\n}\n"
}
]
};
});