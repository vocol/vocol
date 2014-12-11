import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import org.apache.jena.iri.impl.Main;
import org.apache.jena.riot.RiotNotFoundException;

import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.RDFNode;
import com.hp.hpl.jena.util.FileManager;

public class FirstEx {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		SparqlTest(args[0], args[1]);
	}

	public static void SparqlTest(String _source, String _destination) {

		try {
			FileManager.get()
					.addLocatorClassLoader(Main.class.getClassLoader());

			// Model model =
			// FileManager.get().loadModel("/home/lavdim/Downloads/JavaExample/DataFiles/ChargingPoints.ttl");

			Model model = FileManager.get().loadModel(_source);

			String queryString = "PREFIX mv: <http://purl.org/net/mobivoc/> "
					+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
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
					+ "SELECT ?subject ?o WHERE { ?subject rdf:type ?o }";

			// Query query = QueryFactory.create(queryString);

			QueryExecution qexec = QueryExecutionFactory.create(queryString,
					model);

			BufferedReader in = new BufferedReader(
					new FileReader(
							"/home/lavdim/Downloads/JavaExample/DataFiles/template.html"));

			String strLine, htmlString = "", body = "";
			while ((strLine = in.readLine()) != null) {
				htmlString += strLine + "\n";
			}

			ResultSet result = qexec.execSelect(), resultProperties;

			String resourceName = "";

			while (result.hasNext()) {

				QuerySolution soln = result.nextSolution();

				RDFNode node;

				String resourceType = soln.get("o").asResource().toString();

				if (resourceType.contains("Class")) {
					node = soln.get("subject");
					body += "<div typeof=\"rdfs:Class\" resource=\""
							+ node.asResource().getURI() + "\">\n";

				} else {
					node = soln.get("subject");
					body += "<div typeof=\"rdfs:Property\" resource=\""
							+ node.asResource().getURI() + "\">\n";

				}

				queryString = "PREFIX mv: <http://purl.org/net/mobivoc/> "
						+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
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
						+ "SELECT ?s ?pr ?o ?language ?pureText WHERE { mv:"
						+ node.asResource().getLocalName()
						+ " ?pr ?o .  FILTER(?pr in(rdfs:label,rdfs:comment,rdfs:domain,rdfs:range,rdfs:subPropertyOf,rdfs:subClassOf)) "
						+ "   BIND (lang(?o) AS ?language)  BIND (str(?o) AS ?pureText) }";

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
						resourceName = " href=\"" + soln.get("o").toString()
								+ "\">" + node.asResource().getLocalName()
								+ "</a>";
						body += resourceName + "</span>\n";
					} else if (resourceName.contains("range")) {
						node = soln.get("o");
						body += "<span> Range: <a property=\"http://schema.org/rangeIncludes\"";
						resourceName = " href=\"" + soln.get("o").toString()
								+ "\">" + node.asResource().getLocalName()
								+ "</a>";
						body += resourceName + "</span>\n";
					} else if (resourceName.contains("subClassOf")) {
						node = soln.get("o");
						body += "<span> Subclass of: <a property=\"rdfs:subClassOf\"";
						resourceName = " href=\"" + soln.get("o").toString()
								+ "\">" + node.asResource().getLocalName()
								+ "</a>";
						body += resourceName + "</span>\n";
					} else if (resourceName.contains("subPropertyOf")) {
						node = soln.get("o");
						body += "<link property=\"rdfs:subPropertyOf\"";
						resourceName = " href=\"" + soln.get("o").toString()
								+ "\" />";
						body += resourceName;
					}

					// resourceName = soln.get("o").toString();
					// body += resourceName + "</span>\n";

				}

				body += "</div>";
				body += "\n\n";
			}

			htmlString = htmlString.replace("$divs", body);

			PrintWriter outputStream = null;

			// outputStream = new PrintWriter(new
			// FileOutputStream("/home/lavdim/Downloads/schema-org/schemaorg/data/schema.rdfa"));
			outputStream = new PrintWriter(new FileOutputStream(_destination));

			int count;
			for (count = 1; count <= 1; count++) {
				outputStream.println(htmlString);
			}
			outputStream.close();

		} catch (FileNotFoundException e) {
			System.out.println("File not found.Please verify location!");
		} 
	 catch (RiotNotFoundException e) {
		System.out.println("File not found.Please verify location!");
	} catch (IOException e) {

			System.out.println("Other Exception!");
		}
		
		
	}

}