import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import org.apache.jena.iri.impl.Main;
import org.apache.jena.riot.RiotException;
import org.apache.jena.riot.RiotNotFoundException;

import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.util.FileManager;

public class HtmlGenerator {

	public static void main(String[] args) {

		try {
	
			GenerateResourceList(args[0], args[3], args[4],args[5] );

			GenerateResourceDetails(args[0], args[1], args[2],args[5]);

		} catch (ArrayIndexOutOfBoundsException e) {
			System.out
					.println("Missing argument! 1st:SourceFile; 2nd: DestinationFile;"
							+ "3rd: Template; 4th: Resousce Details Template Path; 5th: Resource List Template Path; 6th: Vocabulary Prefix!");
		} catch (RiotNotFoundException e) {
			System.out.println("File not found.Please verify file location!");
		} catch (FileNotFoundException e) {
			System.out.println("File not found.Please verify file location!");
		} catch (RiotException e) {
			System.out
					.println(e.getMessage() + " \n on file: " + args[0] + "!");
		} catch (IOException e) {
			e.printStackTrace(); 
		}
	}

	@SuppressWarnings("resource")
	public static void GenerateResourceDetails(String _source, String _destination,
			String _template,String _prefix) throws IOException {
		
			FileManager.get()
					.addLocatorClassLoader(Main.class.getClassLoader());

			Model model = FileManager.get().loadModel(_source);
			
			String mainQuery = _prefix
					+ " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
					+ "PREFIX owl: <http://www.w3.org/2002/07/owl#> "
					+ "PREFIX rdf:    		<http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
					+ "PREFIX xsd:     		<http://www.w3.org/2001/XMLSchema#> "
					+ "PREFIX voaf:    		<http://purl.org/vocommons/voaf#> "
					+ "PREFIX dct:     		<http://purl.org/dc/terms/> "
					+ "PREFIX foaf:    		<http://xmlns.com/foaf/0.1/> "
					+ "PREFIX s:    			<http://schema.org/> "
					+ "PREFIX gr:    			<http://purl.org/goodrelations/v1#> "
					+ "PREFIX vcard:		        <http://www.w3.org/2001/vcard-rdf/3.0#> "
					+ "PREFIX skos: 			<http://www.w3.org/2004/02/skos/core#> "
					+ "PREFIX dbr: 			<http://dbpedia.org/resource/> "
					+ "	SELECT distinct ?subject ?o "
					+ "	    WHERE { ?subject a ?obj. "
                    + "	            BIND(REPLACE(REPLACE(str(?obj), '^.*(#|/)', \"\"),\"[^/]*Property[^/]*\",\"Property\") AS ?o)"                           
                    + "	} order by ?o"
					+ "";

			QueryExecution qexec = QueryExecutionFactory.create(mainQuery,
					model);

			BufferedReader in;
			String strLine, htmlString = "", body = "";
			


			in = new BufferedReader(new FileReader(_template));
			while ((strLine = in.readLine()) != null) {
				htmlString += strLine + "\n";
			}
				ResultSet result = qexec.execSelect(), resultProperties;

				String resourceName = "";

				while (result.hasNext()) {

					QuerySolution soln = result.nextSolution();

					RDFNode node;

					String resourceType = soln.get("o").toString();
					node = soln.get("subject");

					if (resourceType.contains("Class")) {
						body += "<div typeof=\"rdfs:Class\" resource=\"http://schema.org/"
								+ node.asResource().getLocalName() + "\">\n";
					} else if (resourceType.contains("Property")){
						body += "<div typeof=\"rdf:Property\" resource=\"http://schema.org/"
								+ node.asResource().getLocalName() + "\">\n";
					}
					else {
						body += "<div typeof=\"rdfs:Class\" resource=\"http://schema.org/"
								+ node.asResource().getLocalName() + "\">\n";
					}

					String queryString = _prefix
							+ " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
							+ "PREFIX owl: <http://www.w3.org/2002/07/owl#> "
							+ "PREFIX rdf:    		<http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
							+ "PREFIX xsd:     		<http://www.w3.org/2001/XMLSchema#> "
							+ "PREFIX voaf:    		<http://purl.org/vocommons/voaf#> "
							+ "PREFIX dct:     		<http://purl.org/dc/terms/> "
							+ "PREFIX foaf:    		<http://xmlns.com/foaf/0.1/> "
							+ "PREFIX s:    			<http://schema.org/> "
							+ "PREFIX gr:    			<http://purl.org/goodrelations/v1#> "
							+ "PREFIX vcard:		        <http://www.w3.org/2001/vcard-rdf/3.0#> "
							+ "PREFIX skos: 			<http://www.w3.org/2004/02/skos/core#> "
							+ "PREFIX dbr: 			<http://dbpedia.org/resource/> "
							+ "SELECT ?s ?pr ?o ?language ?pureText WHERE { "+_prefix.split(" ")[1]
							+ node.asResource().getLocalName()
							+ " ?pr ?o . "
							+ " "
							+ " FILTER(?pr in(rdfs:label,rdfs:comment,rdfs:domain,rdfs:range,rdfs:subPropertyOf,rdfs:subClassOf)) "
							+ "   BIND (lang(?o) AS ?language)  BIND (str(?o) AS ?pureText) "
							+ " }";

					qexec = QueryExecutionFactory.create(queryString, model);
					resultProperties = qexec.execSelect();

					while (resultProperties.hasNext()) {

						soln = resultProperties.nextSolution();

						resourceName = soln.get("pr").toString();

						if (resourceName.contains("label")) {
							body += "<span class=\"h\" property=\"rdfs:label\" lang=\""
									+ soln.get("language").toString() + "\">";
							resourceName = soln.get("pureText").toString();
							body += resourceName + "</span>\n";
						} else if (resourceName.contains("comment")) {
							body += "<span property=\"rdfs:comment\">";
							resourceName = soln.get("o").toString();
							body += resourceName + "</span>\n";
						} else if (resourceName.contains("domain")) {
							node = soln.get("o");
							body += "<span> Domain: <a property=\"http://schema.org/domainIncludes\"";
							resourceName = " href=\"http://schema.org/"
									+ soln.get("o").asResource().getLocalName()
									+ "\">" + node.asResource().getLocalName()
									+ "</a>";
							body += resourceName + "</span>\n";
						} else if (resourceName.contains("range")) {
							node = soln.get("o");
							body += "<span> Range: <a property=\"http://schema.org/rangeIncludes\"";
							resourceName = " href=\"http://schema.org/"
									+ soln.get("o").asResource().getLocalName()
									+ "\">" + node.asResource().getLocalName()
									+ "</a>";
							body += resourceName + "</span>\n";
						} else if (resourceName.contains("subClassOf")) {
							node = soln.get("o");
							body += "<span> Subclass of: <a property=\"rdfs:subClassOf\"";
							resourceName = " href=\"http://schema.org/"
									+ soln.get("o").asResource().getLocalName()
									+ "\">" + node.asResource().getLocalName()
									+ "</a>";
							body += resourceName + "</span>\n";
						} else if (resourceName.contains("subPropertyOf")) {
							node = soln.get("o");
							body += "<link property=\"rdfs:subPropertyOf\"";
							resourceName = " href=\"http://schema.org/"
									+ soln.get("o").asResource().getLocalName()
									+ "\" />";
							body += resourceName;
						}
					}

					body += "</div>";
					body += "\n\n";
				}

				htmlString = htmlString.replace("$divs", body);

				PrintWriter outputStream = null;

				outputStream = new PrintWriter(new FileOutputStream(
						_destination));

				int count;
				for (count = 1; count <= 1; count++) {
					outputStream.println(htmlString);
				}
				outputStream.close();
				System.out.println("File with resource details has been generated successfully.");
	}

	public static void GenerateResourceList(String _source, String _destination, String _template, String _prefix) throws IOException {

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		Model model = FileManager.get().loadModel(_source);
		
		String query = _prefix
				+ " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
				+ "PREFIX owl: <http://www.w3.org/2002/07/owl#> "
				+ "PREFIX rdf:    		<http://www.w3.org/1999/02/22-rdf-syntax-ns#> "
				+ "PREFIX xsd:     		<http://www.w3.org/2001/XMLSchema#> "
				+ "PREFIX voaf:    		<http://purl.org/vocommons/voaf#> "
				+ "PREFIX dct:     		<http://purl.org/dc/terms/> "
				+ "PREFIX foaf:    		<http://xmlns.com/foaf/0.1/> "
				+ "PREFIX s:    			<http://schema.org/> "
				+ "PREFIX gr:    			<http://purl.org/goodrelations/v1#> "
				+ "PREFIX vcard:		        <http://www.w3.org/2001/vcard-rdf/3.0#> "
				+ "PREFIX skos: 			<http://www.w3.org/2004/02/skos/core#> "
				+ "PREFIX dbr: 			<http://dbpedia.org/resource/> "
				+ "	SELECT distinct ?subject ?o "
				+ "	    WHERE { ?subject a ?obj. "
                + "	            BIND(REPLACE(REPLACE(str(?obj), '^.*(#|/)', \"\"),\"[^/]*Property[^/]*\",\"Property\") AS ?interVal)"
                + "	            BIND(REPLACE(?interVal,\"^((?!Class|Property).)*$\",\"Z\"+?interVal) AS ?o)"                             
                + "	} order by ?o"
				+ "";

		QueryExecution qexec = QueryExecutionFactory.create(query, model);

		BufferedReader in = new BufferedReader(new FileReader(_template));

		String strLine, htmlString = "", body = "";
		while ((strLine = in.readLine()) != null) {
			htmlString += strLine + "\n";
		}

		ResultSet result = qexec.execSelect();

		String entityType="";

		while (result.hasNext()) {

			QuerySolution soln = result.nextSolution();

			RDFNode node = soln.get("subject");
			
			String resourceType = soln.get("o").toString();
			
			if (resourceType.contains("Class")) {

				if(entityType.equals("") || !entityType.equals("Class"))
				{
					entityType="Class";
					body += "<br><b>Classes</b>"; 
				}

			} else if (resourceType.contains("Property"))  {
		
				if(entityType.equals("") || !entityType.equals("Property"))
				{
					entityType="Property";
					body += "<br><b>Properties</b>"; 
				}

			} else {
				
				if(entityType.equals("") || !entityType.equals("Intance"))
				{
					entityType="Intance";
					body += "<br><b>Instances</b>"; 
				}
			}

			if(!node.asResource().getLocalName().equals(""))
			   body += "<li><a href=\"../" + node.asResource().getLocalName() + "\">" + node.asResource().getLocalName() + "</a></li>\n";
		}

		htmlString = htmlString.replace("$li", body);

		PrintWriter outputStream = null;

		outputStream = new PrintWriter(new FileOutputStream(_destination));

		int count;
		for (count = 1; count <= 1; count++) {
			outputStream.println(htmlString);
		}
		outputStream.close();
		System.out.println("File with list of resources has been generated successfully.");

	}

}
