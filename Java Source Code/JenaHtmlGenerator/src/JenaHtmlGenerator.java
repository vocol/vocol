import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import org.apache.jena.iri.impl.Main;
import org.apache.jena.ontology.DatatypeProperty;
import org.apache.jena.ontology.Individual;
import org.apache.jena.ontology.ObjectProperty;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.riot.RiotException;
import org.apache.jena.riot.RiotNotFoundException;
import org.apache.jena.util.FileManager;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.apache.log4j.varia.NullAppender;

public class JenaHtmlGenerator {

	static String htmlString = "", bodyResources = "", bodyDetails = "", additionalPath = "";

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		try {
			
			if (args.length > 5)
				additionalPath = args[5] + "/";

			ReadOntology(args[0]);

			GenerateSchema(args[1], args[2], "$li", bodyResources);

			GenerateSchema(args[3], args[4], "$divs", bodyDetails);


		} catch (ArrayIndexOutOfBoundsException e) {
			System.out.println("Missing argument! 1st:SourceFile; 2nd: DestinationFile;"
					+ "3rd: Template; 4th: Resousce Details Template Path; 5th: Resource List Template Path!");
		} catch (RiotNotFoundException e) {
			System.out.println("File not found.Please verify file location!");
		} catch (FileNotFoundException e) {
			System.out.println("File not found.Please verify file location!");
		} catch (RiotException e) {
			System.out.println(e.getMessage() + " \n on file: " + args[0] + "!");
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public static void ReadOntology(String _sourceFile) {

		org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel();
		FileManager.get().readModel(ontModel, _sourceFile);

		// Generate Classes
		boolean resourceTypeAdded = false;
		ExtendedIterator<OntClass> iter = ontModel.listClasses();
		while (iter.hasNext()) {

			OntClass resource = iter.next();

			if (!resourceTypeAdded) {
				bodyResources += "<br><b>Classes</b>\n";
				resourceTypeAdded = true;
			}
			bodyResources += "<li><a href=\"/" + additionalPath + resource.getLocalName() + "\">"
					+ resource.getLocalName() + "</a></li>\n";
			bodyDetails += "<div typeof=\"rdfs:Class\" resource=\"http://schema.org/" + additionalPath
					+ resource.getLocalName() + "\">\n";

			ExtendedIterator<Statement> properties = resource.listProperties();
			while (properties.hasNext()) {
				try {
					Statement prop = properties.next();

					Generate_Details(resource.getLocalName(), prop.getPredicate().getLocalName(), prop.getString(),
							prop.getLanguage());

				} catch (Exception e) {
				}

			}

			ExtendedIterator<OntClass> superCl = resource.listSuperClasses();
			while (superCl.hasNext()) {
				try {
					OntClass prop = superCl.next();

					if (!prop.getLocalName().equals("Resource"))
						// System.out.println(prop.getNameSpace() + "--" +
						// prop.getLocalName());
						Generate_Details(resource.getLocalName(), "subClassOf", prop.getLocalName(), "");

				} catch (Exception e) {
				}

			}

			bodyDetails += "</div>";
			bodyDetails += "\n\n";
		}

		// Generate ObjectProperties
		resourceTypeAdded = false;
		ExtendedIterator<ObjectProperty> objectProperties = ontModel.listObjectProperties();
		while (objectProperties.hasNext()) {

			ObjectProperty resource = objectProperties.next();

			if (!resourceTypeAdded) {
				bodyResources += "<br><b>Object Properties</b>\n";
				resourceTypeAdded = true;
			}
			bodyResources += "<li><a href=\"/" + resource.getLocalName() + additionalPath + "\">"
					+ resource.getLocalName() + "</a></li>\n";
			bodyDetails += "<div typeof=\"rdf:Property\" resource=\"http://schema.org/" + additionalPath
					+ resource.getLocalName() + "\">\n";

			if (resource.hasDomain(null)) {
				Generate_Details(resource.getLocalName(), "domain", resource.getDomain().getLocalName(), "");
			}

			if (resource.hasRange(null)) {
				Generate_Details(resource.getLocalName(), "range", resource.getRange().getLocalName(), "");
			}

			ExtendedIterator<Statement> properties = resource.listProperties();
			while (properties.hasNext()) {
				try {
					Statement prop = properties.next();
					Generate_Details(resource.getLocalName(), prop.getPredicate().getLocalName(), prop.getString(),
							prop.getLanguage());

				} catch (Exception e) {
				}
			}
			bodyDetails += "</div>";
			bodyDetails += "\n\n";
		}

		// Generate DataTypeProperties
		resourceTypeAdded = false;
		ExtendedIterator<DatatypeProperty> dataTypeProperties = ontModel.listDatatypeProperties();
		while (dataTypeProperties.hasNext()) {

			DatatypeProperty resource = dataTypeProperties.next();

			if (!resourceTypeAdded) {
				bodyResources += "<br><b>DataType Properties</b>\n";
				resourceTypeAdded = true;
			}
			bodyResources += "<li><a href=\"/" + additionalPath + resource.getLocalName() + "\">"
					+ resource.getLocalName() + "</a></li>\n";
			bodyDetails += "<div typeof=\"rdf:Property\" resource=\"http://schema.org/" + additionalPath
					+ resource.getLocalName() + "\">\n";

			if (resource.hasDomain(null)) {
				Generate_Details(resource.getLocalName(), "domain", resource.getDomain().getLocalName(), "");
			}

			if (resource.hasRange(null)) {
				Generate_Details(resource.getLocalName(), "range", resource.getRange().getLocalName(), "");
			}

			// if (resource.hasSuperProperty(null, false)) {
			// Generate_Details(resource.getLocalName(), "subPropertyOf",
			// resource.getSuperProperty().getLocalName(),
			// "");
			// }

			ExtendedIterator<Statement> properties = resource.listProperties();
			while (properties.hasNext()) {
				try {
					Statement prop = properties.next();
					Generate_Details(resource.getLocalName(), prop.getPredicate().getLocalName(), prop.getString(),
							prop.getLanguage());

				} catch (Exception e) {
				}
			}
			bodyDetails += "</div>";
			bodyDetails += "\n\n";
		}

		// Generate Individuals
		resourceTypeAdded = false;
		ExtendedIterator<Individual> individuals = ontModel.listIndividuals();
		while (individuals.hasNext()) {

			Individual resource = individuals.next();

			if (!resourceTypeAdded) {
				bodyResources += "<br><b>Individuals</b>\n";
				resourceTypeAdded = true;
			}
			bodyResources += "<li><a href=\"/" + additionalPath + resource.getLocalName() + "\">"
					+ resource.getLocalName() + "</a></li>\n";
			bodyDetails += "<div typeof=\"rdf:Property\" resource=\"http://schema.org/" + additionalPath
					+ resource.getLocalName() + "\">\n";

			ExtendedIterator<Statement> properties = resource.listProperties();
			while (properties.hasNext()) {
				try {
					Statement prop = properties.next();
					Generate_Details(resource.getLocalName(), prop.getPredicate().getLocalName(), prop.getString(),
							prop.getLanguage());

				} catch (Exception e) {
				}
			}
			bodyDetails += "</div>";
			bodyDetails += "\n\n";
		}

	}

	@SuppressWarnings("resource")
	public static void GenerateSchema(String _template, String _destination, String _valueWhat, String _valueWith)
			throws IOException {

		BufferedReader in;
		String htmlString = "", strLine = "";

		in = new BufferedReader(new FileReader(_template));
		while ((strLine = in.readLine()) != null) {
			htmlString += strLine + "\n";
		}

		htmlString = htmlString.replace(_valueWhat, _valueWith);

		PrintWriter outputStream = new PrintWriter(new FileOutputStream(_destination));

		int count;
		for (count = 1; count <= 1; count++) {
			outputStream.println(htmlString);
		}
		outputStream.close();
		System.out.println("File " + _destination + " has been generated successfully.");

	}

	public static void Generate_Details(String _resurce, String _resourceType, String _resourceValue,
			String _resourceLang) {

		if (_resourceType.contains("label")) {
			bodyDetails += "<span class=\"h\" property=\"rdfs:label\" lang=\"" + _resourceLang + "\">";
			bodyDetails += _resourceValue + "</span>\n";
		} else if (_resourceType.contains("comment")) {
			bodyDetails += "<span property=\"rdfs:comment\">";
			bodyDetails += _resourceValue + "</span>\n";
		} else if (_resourceLang.contains("domain")) {
			bodyDetails += "<span> Domain: <a property=\"http://schema.org/domainIncludes\"";
			_resourceType = " href=\"http://schema.org/" + _resurce + "\">" + _resourceValue + "</a>";
			bodyDetails += _resourceType + "</span>\n";
		} else if (_resourceType.contains("range")) {
			bodyDetails += "<span> Range: <a property=\"http://schema.org/rangeIncludes\"";
			_resourceType = " href=\"http://schema.org/" + _resurce + "\">" + _resourceValue + "</a>";
			bodyDetails += _resourceType + "</span>\n";
		} else if (_resourceType.contains("subClassOf")) {
			bodyDetails += "<span> Subclass of: <a property=\"rdfs:subClassOf\"";
			_resourceType = " href=\"http://schema.org/" + _resourceValue + "\">" + _resourceValue + "</a>";
			bodyDetails += _resourceType + "</span>\n";
		} else if (_resourceType.contains("subPropertyOf")) {
			bodyDetails += "<link property=\"rdfs:subPropertyOf\"";
			_resourceType = " href=\"http://schema.org/" + _resourceValue + "\" />";
			bodyDetails += _resourceType;
		}

	}

}
