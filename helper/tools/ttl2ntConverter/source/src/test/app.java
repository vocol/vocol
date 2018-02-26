package test;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


import org.apache.jena.query.Dataset ;
import org.apache.jena.rdf.model.Model ;
import org.apache.jena.riot.Lang ;
import org.apache.jena.riot.RDFDataMgr ;
import org.apache.jena.graph.Triple ;
import org.apache.jena.riot.RDFParser ;
import org.apache.jena.riot.lang.CollectorStreamBase;
import org.apache.jena.riot.lang.CollectorStreamTriples;

public class app {
	static public void main(String[] args) {
System.out.print("0   "+args[0]);
System.out.print("1   "+args[1]);


        //Model m = ModelFactory.createDefaultModel() ;
        // read into the model.
        //m.read("Battery.ttl") ;
        
        //m.write("Battery.nt") ;

//	       Model model = RDFDataMgr.loadModel("Battery.ttl") ;
//	        System.out.println() ;
//	        System.out.println("#### ---- Write as NTriple") ;
//	        System.out.println() ;
//	        // This wil be the default graph of the dataset written.
//	        RDFDataMgr.write(System.out, model, Lang.NT) ;
//	        
//	        // Loading Turtle as Trig reads into the default graph.
//	        Dataset dataset = RDFDataMgr.loadDataset("Battery.ttl") ;
//	        System.out.println() ;
//	        System.out.println("#### ---- Write as NQuads") ;
//	        System.out.println() ;
//	        RDFDataMgr.write(System.out, dataset, Lang.NQUADS) ;
	        
	        FileOutputStream fop = null;
			File file;

	        CollectorStreamTriples inputStream = new CollectorStreamTriples();
	        RDFParser.source(args[0]).parse(inputStream);

			try {

				file = new File(args[1]);
				fop = new FileOutputStream(file);
				
				

			       Model model = RDFDataMgr.loadModel(args[0]) ;
			        System.out.println() ;
			        System.out.println("#### ---- Write as NTriple to file "+args[1]) ;
			        System.out.println() ;
			        // This wil be the default graph of the dataset written.
			        RDFDataMgr.write(fop, model, Lang.NT) ;

				// if file doesnt exists, then create it
				if (!file.exists()) {
					file.createNewFile();
				}

				fop.flush();
				fop.close();

				System.out.println("Done");

			} catch (IOException e) {
				e.printStackTrace();
			} finally {
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
