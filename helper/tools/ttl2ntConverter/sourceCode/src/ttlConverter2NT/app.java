package ttlConverter2NT;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.Reader;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.logging.SimpleFormatter;
import java.util.logging.StreamHandler;
import java.util.ArrayList;

import org.apache.commons.io.FileUtils;
import org.apache.jena.graph.Graph;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Model ;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.riot.Lang ;
import org.apache.jena.riot.RDFDataMgr ;
import org.apache.jena.riot.RDFParser ;
import org.apache.jena.riot.lang.CollectorStreamTriples;
import org.apache.jena.shared.JenaException;
import org.apache.jena.shared.PrefixMapping;
import org.apache.jena.sparql.core.DatasetGraph;
import org.apache.jena.sparql.graph.GraphFactory;
import org.apache.jena.update.UpdateExecutionFactory;
import org.apache.jena.update.UpdateFactory;
import org.apache.jena.update.UpdateProcessor;
import org.apache.jena.update.UpdateRequest;
import org.apache.log4j.PropertyConfigurator;
import org.json.JSONArray;
import org.json.JSONObject;
import org.mindswap.pellet.jena.PelletReasonerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import com.hp.hpl.jena.ontology.OntModel;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.reasoner.ValidityReport;

public class app {

	public static String getMessages(Iterator<?> i) {
		String report = ""; 
		while (i.hasNext()) {
			report += i.next() + "\n";
		}
		return report; 
	}

//    private static final Logger log = Logger.getLogger(FileUtils.class.getName()); 
	protected static final Logger log = LoggerFactory.getLogger(app.class);


	static public void main(String[] args) {
		FileOutputStream fop = null;
		JSONArray errorJSONArray = new JSONArray();
		boolean disableConsistency = false ; 
        PropertyConfigurator.configure("log4j.properties");

		//PrintStream prStr = new PrintStream(( log); 
		//StreamHandler streamHandler = new StreamHandler(prStr, new SimpleFormatter());

		OntModel onModel4AllFiles = ModelFactory.createOntologyModel(PelletReasonerFactory.THE_SPEC);
		// location of a folder where ttl files are stored
		String turtleFolderPath = args[0];
		System.out.println(args.length);
		// check arg[1] which true or false for disable consistency checking
		if(args.length > 2) {
			if(args[2].contains("true"))
				disableConsistency = true ; 
			System.out.println(args[0] + "  " + args[1]+ "  "+ disableConsistency);
		}
		File dir = new File(turtleFolderPath);
		// search files with ttl extension
		String[] extensions = new String[] { "ttl" };
		List<File> files = (List<File>) FileUtils.listFiles(dir, extensions, true);
		for (File filee : files) {
			try {
				OntModel onModel = ModelFactory.createOntologyModel(PelletReasonerFactory.THE_SPEC);
				System.out.println(filee.getName());
				// read the input stream of the input file
				onModel.read(new FileInputStream(filee), null, "TTL");
				// read a single input file to a global model to be globally checked against consistency 
				onModel4AllFiles.read(new FileInputStream(filee), null, "TTL");
				//fop = new FileOutputStream(new File("SingleVoc.nt"),true);	

				// write the default graph of dataModel to the output file
				if(!disableConsistency) {
					// check for consistency for each file
					ValidityReport report = onModel.validate();
					if( getMessages(report.getReports()) != "") {
						JSONObject JSONObject = new JSONObject();
						JSONObject.put("fileName", filee.getName());
						JSONObject.put("ٍsource", "Pellet");
						// print the validation report
						JSONObject.put("Message", getMessages(report.getReports()) );
						errorJSONArray.put(JSONObject);
					}
				}	
			}
			catch(JenaException jXE) {
				System.out.print("\nResult of syntax validtion is: an error is found \n");
				System.out.print(jXE.getMessage());
				JSONObject JSONObject = new JSONObject();
				JSONObject.put("fileName", filee.getName());
				JSONObject.put("source", "JenaRiot");
				// print the validation report
				JSONObject.put("Message", jXE.getMessage() );
				errorJSONArray.put(JSONObject);
			}
			catch(Exception XE) {
				System.out.print("\nResult of syntax validtion is: an error is found \n");
				System.out.print(XE.getMessage());
				JSONObject JSONObject = new JSONObject();
				JSONObject.put("fileName", filee.getName());
				JSONObject.put("source", "JenaRiot");
				// print the validation report
				JSONObject.put("Message", XE.getMessage());
				errorJSONArray.put(JSONObject);

			}

		}
		// check consistency using Pellet and generate a validation report
		try {
			String outFilename = "SingleVoc.nt";
			if(args.length > 1)
				outFilename = args[1];
			File outFile = new File(outFilename);
			outFile.createNewFile();
			fop = new FileOutputStream(outFile);
			onModel4AllFiles.write(fop, "N-TRIPLES");
		} catch(IOException ioe ) {
			System.out.print("\nInput or Output Exception... \n");
			System.out.println(ioe.getMessage());
		}

		if(!disableConsistency){
			// check for consistency for each file
			ValidityReport reportAll = onModel4AllFiles.validate();
			if(getMessages(reportAll.getReports()) != "") {
				JSONObject JSONObj = new JSONObject();
				// print the validation report
				JSONObj.put("Message", getMessages(reportAll.getReports()) );
				JSONObj.put("fileName", "Ontology range");
				JSONObj.put("ٍsource", "Pellet");
				errorJSONArray.put(JSONObj);
			}
			System.out.println(errorJSONArray.toString());
		}

		try {
			
		    // pass the path to the file as a parameter 
		    File file = 
		      new File("logging.log"); 
		    Scanner sc = new Scanner(file); 
		    List<String> errorMessages = new ArrayList<>();

		    while (sc.hasNextLine()) {
		    	if (sc.nextLine().startsWith("ERROR -$$$-") )
		    		//errorMessages.add(sc.nextLine());
			          System.out.println("----"+sc.nextLine()); 		

		    }
		
	          System.out.println(errorMessages); 		
//
//		     for (int counter = 0; counter < errorMessages.size(); counter++) { 		      
//		          System.out.println(errorMessages); 		
//		      }  
//		     
		     
			FileWriter fr = new FileWriter("Output.report");
			fr.write(errorJSONArray.toString());
			fr.close();

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block

			e.printStackTrace();
		} catch(IOException ioe ) {
			ioe.printStackTrace();

		}

	}
}
