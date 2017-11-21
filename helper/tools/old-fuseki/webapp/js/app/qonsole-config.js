/** Standalone configuration for qonsole on index page */

define( [], function() {
  return {
    prefixes: {
      "rdf":      "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs":     "http://www.w3.org/2000/01/rdf-schema#",
      "owl":      "http://www.w3.org/2002/07/owl#",
      "xsd":      "http://www.w3.org/2001/XMLSchema#"
    },
    queries: [
       {
	"name":"example_query", 
	"query":`SELECT DISTINCT ?concept
		WHERE {
		    ?s a ?concept .
		} LIMIT 5`
      }
    ]
  };
} );
