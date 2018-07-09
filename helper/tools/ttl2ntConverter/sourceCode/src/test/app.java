package test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import java.util.Iterator;

import org.apache.jena.graph.Graph;
import org.apache.jena.rdf.model.Model ;
import org.apache.jena.riot.Lang ;
import org.apache.jena.riot.RDFDataMgr ;
import org.apache.jena.riot.RDFParser ;
import org.apache.jena.riot.lang.CollectorStreamTriples;
import org.apache.jena.shared.JenaException;
import org.apache.jena.sparql.core.DatasetGraph;
import org.apache.jena.sparql.graph.GraphFactory;
import org.mindswap.pellet.jena.PelletReasonerFactory;

import com.hp.hpl.jena.ontology.OntModel;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.reasoner.ValidityReport;

public class app {

	public static void printIterator(Iterator<?> i, String header) {
		System.out.println(header);
		for(int c = 0; c < header.length(); c++)
			System.out.print("=");
		System.out.println();

		if(i.hasNext()) {
			while (i.hasNext()) 
				System.out.println( i.next() );
		}       
		else
			System.out.println("<EMPTY>");

		System.out.println();
	}

	static public void main(String[] args) {

		FileOutputStream fop = null;
		File file;

		try {

			file = new File(args[1]);
			fop = new FileOutputStream(file);
			//			fop = new FileOutputStream("/home/ahmed/Desktop/tmp.nt");

			Model model = RDFDataMgr.loadModel(args[0]) ;
			//			Model model = RDFDataMgr.loadModel("/home/ahmed/Desktop/test2.ttl");

			//			System.out.println() ;

			OntModel onModel = ModelFactory.createOntologyModel(PelletReasonerFactory.THE_SPEC);
			FileInputStream input = new FileInputStream(args[0]);
			//			FileInputStream input = new FileInputStream("/home/ahmed/Desktop/test2.ttl");

			// load the input file in the RDF model 
			InputStream in = new FileInputStream(new File(args[0]));
			//			InputStream in = new FileInputStream(new File("/home/ahmed/Desktop/test2.ttl"));
			// read the input stream of the input file
			onModel.read(in, null, "TTL");
			// check consistency using Pellet and generate a validation report
			ValidityReport report = onModel.validate();
			// print the validation report
			printIterator(report.getReports(), "Validation Results::");          

			// write the default graph of dataModel to the output file
			if(!onModel.validate().getReports().hasNext()) {
				System.out.println() ;
				System.out.println("#### ---- Write as NTriple to file "+args[1]) ;
				RDFDataMgr.write(fop, model, Lang.NT) ;
				// if file does not exists, then create it
				if (!file.exists()) {
					file.createNewFile();
				}
			}
			// close fileOutputStream
			fop.flush();
			fop.close();
		}
		catch(JenaException rXE) {
			System.out.print("\nResult of syntax validtion is: an error is found \n");
			System.out.print(rXE.getMessage());

		}
		catch (IOException e) {
			e.printStackTrace();
		} 
		finally {
			try {
				if (fop != null) {
					fop.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
