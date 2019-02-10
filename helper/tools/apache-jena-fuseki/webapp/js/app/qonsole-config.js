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
]
};
});