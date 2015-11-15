import org.apache.jena.iri.impl.Main;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RiotException;
import org.apache.jena.sparql.function.library.evenInteger;
import org.apache.jena.util.FileManager;
import org.apache.log4j.varia.NullAppender;

public class SyntaxValidation {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		try {
			org.apache.log4j.BasicConfigurator.configure(new NullAppender());
			FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

			OntModel ontModel = ModelFactory.createOntologyModel();
			FileManager.get().readModel(ontModel, args[0]);
			System.out.println("File:" + args[0] + " parsed successfully.");
		} catch (RiotException ex) {
			System.out.println("Riot Error. File: " + args[0] + ex.getMessage());
		}
	}

}
