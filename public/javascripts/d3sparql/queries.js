var data = [{
  "name": "Statistics",
  "endpoint": `domain/fuseki/dataset/query`,
  "query": `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl:  <http://www.w3.org/2002/07/owl#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?conceptType ?value WHERE {
  SELECT ?conceptType (count(?s) as ?value) WHERE {
     ?s a ?type.
    BIND(REPLACE(str(?type), '^.*(#|/)', "") AS ?conceptType)
  }
  GROUP BY ?conceptType
}
ORDER BY DESC(?value)
`
},

  {
    "name": "Relationships of the Concepts",
    "endpoint": `domain/fuseki/dataset/query`,
    "query": `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl:  <http://www.w3.org/2002/07/owl#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?subject ?predicate ?object
WHERE
{
?sub ?predicate ?obj .
?sub rdfs:label ?sub_label.
?obj rdfs:label ?obj_label.
bind( str(?sub_label) as ?subject )
bind( str(?obj_label) as ?object )
}LIMIT 100`
  },

  {
    "name": "SankeyGraph",
    "endpoint": `domain/fuseki/dataset/query`,
    "query": `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl:  <http://www.w3.org/2002/07/owl#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT  ?parent ?parent_name ?child ?child_name
WHERE
{

  ?root rdfs:label ?root_name1 .
  ?child rdfs:subClassOf+ ?root .
  ?child rdfs:subClassOf ?parent .
  ?child rdfs:label ?child_name1.
  ?parent rdfs:label ?parent_name1.
  Filter (Lang(?root_name1)='en')
  Filter (Lang(?child_name1)='en')
  Filter (Lang(?parent_name1)='en')
  bind( str(?root_name1) as ?root_name )
  bind( str(?child_name1) as ?child_name )
  bind( str(?parent_name1) as ?parent_name )

}
      `
  }, {
    "name": "Hierachy of the Concepts",
    "endpoint": `domain/fuseki/dataset/query`,
    "query": `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl:  <http://www.w3.org/2002/07/owl#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?root_name ?parent_name ?child_name
WHERE
{
  ?root rdfs:label ?root_name1 .
  ?child rdfs:subClassOf+ ?root .
  ?child rdfs:subClassOf ?parent .
  ?child rdfs:label ?child_name1.
  ?parent rdfs:label ?parent_name1.
  Filter (Lang(?root_name1)='en')
  Filter (Lang(?child_name1)='en')
  Filter (Lang(?parent_name1)='en')
  bind( str(?root_name1) as ?root_name )
  bind( str(?child_name1) as ?child_name )
  bind( str(?parent_name1) as ?parent_name )

}LIMIT 500
`
  }, {
    "name": "GoeLocations in the Map",
    "endpoint": `domain/fuseki/dataset/query`,
    "query": `PREFIX rdf:      <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rami:  <http://iais.fraunhofer.de/vocabs/rami#>
PREFIX om:     <http://www.wurvoc.org/vocabularies/om-1.8/>
PREFIX geo:    <http://www.w3.org/2003/01/geo/wgs84_pos#>

SELECT Distinct ?description ?lat ?lng
WHERE {
  ?location
            geo:lat ?lat;
            geo:long ?lng.
  BIND(("SensorID: 1A32AA51576") as ?description)
}

Limit 1000
       `
  },

  {
    "name": "Hierachy of the Concepts",
    "endpoint": `domain/fuseki/dataset/query`,
    "query": `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl:  <http://www.w3.org/2002/07/owl#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?root_name ?parent_name ?child_name
WHERE
{
  ?root rdfs:label ?root_name1 .
  ?child skos:narrower+ ?root .
  ?child skos:narrower ?parent .
  ?child rdfs:label ?child_name1.
  ?parent rdfs:label ?parent_name1.
  bind( str(?root_name1) as ?root_name )
  bind( str(?child_name1) as ?child_name )
  bind( str(?parent_name1) as ?parent_name )

}LIMIT 500
  `
  }

]
