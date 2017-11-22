package HtmlGenerator.SimpleHtmlGenerator;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.io.OutputStreamWriter;
import java.io.Writer;

import javax.swing.filechooser.FileNameExtensionFilter;

import java.awt.List;
import java.io.*;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.json.*;

import org.apache.commons.cli.ParseException;
import org.apache.commons.io.filefilter.FileFileFilter;
//import org.apache.jena.atlas.json.JSON;
//import org.apache.jena.atlas.json.JsonArray;
//import org.apache.jena.atlas.json.JsonObject;
//import org.apache.jena.atlas.json.io.parser.JSONParser;
//import org.apache.jena.atlas.json.io.parserjavacc.javacc.JSON_Parser;
import org.apache.jena.iri.impl.Main;
import org.apache.jena.ontology.DatatypeProperty;
import org.apache.jena.ontology.Individual;
import org.apache.jena.ontology.ObjectProperty;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RiotException;
import org.apache.jena.riot.RiotNotFoundException;
import org.apache.jena.util.FileManager;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.apache.log4j.varia.NullAppender;
import org.apache.jena.query.ResultSetFormatter;

public class App {
	static String concept = "", prevProp = "", property = "", value = "", table = "", body = "", individualsHTML = "",
			mainQuery = "", Query = "", closedTag = "", splitSymbol = "", range = "", isDefinedBy = "", json = "";
	static // static int ttlFilesCount = 0;
	String filesPath = "../../../../repoFolder/";

	public static void main(String[] args) throws IOException {
		JSONArray mergingArrayClasses = new JSONArray();
		JSONObject mergedJsonObjectClasses = new JSONObject();
		JSONArray mergingArraySKOS = new JSONArray();
		JSONObject mergedJsonObjectSKOS = new JSONObject();
		JSONArray mergingAllRDFObjecs = new JSONArray();
		JSONObject mergedJsonObjectallRDFObjecs = new JSONObject();
		JSONArray mergingAllSKOSObjecs = new JSONArray();
		JSONObject mergedJsonObjectallSKOSObjecs = new JSONObject();

		try {

			File dir = new File(filesPath);
			//clearTheFile("./out/results.JSON");

			String[] files = dir.list(FileFileFilter.FILE);
			for (int i = 0; i < files.length; i++) {
				if (files[i].contains("ttl")) {

					JSONObject objClasses = generateClassesJSON(filesPath + files[i]);
					JSONObject objSKOS = generateSKOSJSON(filesPath + files[i]);
					JSONObject objExternalClassesRDF = allRDFObjectsJSON(filesPath + files[i]);
					JSONObject objExternalClassesSKOS = allSKOSObjectsJSON(filesPath+ files[i]);

					// check for empty JSONobjects
					if (objClasses.length() != 0) {
						// System.out.println(obj);
						mergingArrayClasses.put(objClasses);
					}
					if (objSKOS.length() != 0) {
						// System.out.println(obj);
						mergingArraySKOS.put(objSKOS);
					}
					if (objExternalClassesRDF.length() != 0) {
						// System.out.println(obj);
						mergingAllRDFObjecs.put(objExternalClassesRDF);
					}
					if (objExternalClassesSKOS.length() != 0) {
						// System.out.println(obj);
						mergingAllSKOSObjecs.put(objExternalClassesSKOS);
					}
				}
			}
			mergedJsonObjectClasses.put("files", mergingArrayClasses);
			mergedJsonObjectSKOS.put("files", mergingArraySKOS);
			mergedJsonObjectallRDFObjecs.put("files", mergingAllRDFObjecs);
			mergedJsonObjectallSKOSObjecs.put("files", mergingAllSKOSObjecs);

			// call to organize
			SKOSFileDecode(mergedJsonObjectSKOS);
			RDFSFileDecode(mergedJsonObjectClasses);
			objectsFileDecode(mergedJsonObjectallRDFObjecs, "RDF");
			objectsFileDecode(mergedJsonObjectallSKOSObjecs, "SKOS");

		} catch (ArrayIndexOutOfBoundsException e) {
			System.out.println("ArrayIndexOutOfBoundsException caught");
		} finally {

		}

	}

	// @SuppressWarnings({ "null", "resource" })
	public static JSONObject generateClassesJSON(String _sourceFile) throws IOException {

		org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" + "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
				+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
				+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " + "SELECT  ?concept ?rdfType ?label  WHERE {"
				+ "?concept a ?rdfType ." + "OPTIONAL {?concept rdfs:label ?label .}"
				+ "FILTER regex(str(?concept), \"^((?!skos).)*$\" ) }" + "ORDER BY ?concept";
		QueryExecution qexec2 = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result2 = qexec2.execSelect();
		// display output on console
		// ResultSetFormatter.out(System.out, result2);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();

		while (result2.hasNext()) {
			QuerySolution binding = result2.nextSolution();
			if (binding.get("concept").toString() != null  && isNotInstances(binding.get("rdfType").toString())) {
				JSONObject obj = new JSONObject();

				Resource concept = (Resource) binding.get("concept");
				// System.out.println("\concept: " + concept.getURI());
				Resource rdfType = (Resource) binding.get("rdfType");

				if (binding.get("label") != null) {
					obj.put("label", binding.get("label").toString());
				} else
					obj.put("label", "");
				// trimming of the concept from URI
				String conceptToTrim =concept.getURI().toString() ;
				if (conceptToTrim.substring(conceptToTrim.length() - 1) == "/")
					obj.put("concept", "mobivoc");
				else
					obj.put("concept", replaceWithRDFType(concept.getURI().toString()));
				

				obj.put("URI", concept.getURI());

				// trimming of the concept from URI
				if(rdfType.getURI().toString() != null )
				obj.put("rdfType", replaceWithRDFType(rdfType.getURI().toString()));
				// if (rdfType.getURI().toString().contains("Class")) {
				// obj.put("parent", "");
				Query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
						+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
						+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" + "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
						+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
						+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "
						+ "SELECT  ?classChild ?classParent WHERE {" + //
						"?classChild rdfs:subClassOf  ?classParent ." + "}";
				QueryExecution qexec3 = QueryExecutionFactory.create(Query, ontModel);
				ResultSet result3 = qexec3.execSelect();
				while (result3.hasNext()) {
					QuerySolution binding3 = result3.nextSolution();
					Resource classChild = (Resource) binding3.get("classChild");
					Resource classParent = (Resource) binding3.get("classParent");

					if (classChild.getURI() == concept.getURI()) {

						if (classParent.getURI() != null) {
							obj.put("parent", classParent.getURI().toString());
							// System.out.println("parent: " + classParent.getURI().toString());
						}
					}
				}
				File file = new File(_sourceFile);
				obj.put("fileName", file.getName());

				// if you are using JSON.simple do this
				array.put(obj);

				// array.put(obj);
				jsonObject.put("concepts", array);
			}
		}
		return jsonObject;
	}

	public static JSONObject generateSKOSJSON(String _sourceFile) throws IOException {

		org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " + "SELECT  ?sNarrower ?oNarrower  WHERE {"
				+ "?sNarrower skos:narrower ?oNarrower .}";
		QueryExecution qexec1 = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result1 = qexec1.execSelect();
		// ResultSetFormatter.outputAsJSON(System.out, result1);

		// ResultSetFormatter.out(System.out, result2);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();
		while (result1.hasNext()) {
			QuerySolution binding = result1.nextSolution();
			if (binding.get("sNarrower").toString() != null) {
				Resource sNarrower = (Resource) binding.get("sNarrower");

				Resource oNarrower = (Resource) binding.get("oNarrower");

				JSONObject obj = new JSONObject();

				// URI for child
				obj.put("childURI", sNarrower.getURI());
				obj.put("parentURI", oNarrower.getURI());
				
				obj.put("child", trim(sNarrower.getURI().toString()));
				
				obj.put("parent", trim(oNarrower.getURI().toString()));

				obj.put("RDFType", "skos:narrower");

				File file = new File(_sourceFile);
				obj.put("fileName", file.getName());
				array.put(obj);
			}

		}

		mainQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " + "SELECT  ?sBroader ?oBroader   WHERE {"
				+ "?sBroader skos:broader ?oBroader .}";

		QueryExecution qexec2 = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result2 = qexec2.execSelect();
		// ResultSetFormatter.outputAsJSON(System.out, result2);
		while (result2.hasNext()) {
			boolean isDuplicateData = false;
			QuerySolution binding = result2.nextSolution();
			if (binding.get("sBroader").toString() != null) {
				Resource sBroader = (Resource) binding.get("sBroader");
				// System.out.println("\concept: " + concept.getURI());
				Resource oBroader = (Resource) binding.get("oBroader");

				
				////////////////////////////////////////////////
				if (array.length() > 0) {
					for (Object issueObj : array) {
						JSONObject issue = (JSONObject) issueObj;
						String str1= issue.getString("parent");
						String str2= trim(sBroader.getURI().toString());
						String str3= issue.getString("child");
						String str4= trim(oBroader.getURI().toString()) ;

						if(str1.equalsIgnoreCase(str2) || str3.equalsIgnoreCase(str4) )
						{
							isDuplicateData = true;
							break;
							
						}
						
					}
					}
				if(!isDuplicateData) {
					JSONObject obj = new JSONObject();

					// URI for parent
					obj.put("parentURI", sBroader.getURI());
					obj.put("childURI", oBroader.getURI());

					obj.put("parent", trim(sBroader.getURI().toString()));

					obj.put("child", trim(oBroader.getURI().toString()));

					obj.put("RDFType", "skos:broader");

					File file = new File(_sourceFile);
					obj.put("fileName", file.getName());
					array.put(obj);
					
				}
				//////////////////////////////////////////


			}
		}

		// check location
		jsonObject.put("SKOSconcepts", array);

		return jsonObject;

	}

	public static JSONObject allRDFObjectsJSON(String _sourceFile) throws IOException {

		org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" + "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
				+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
				+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "
				+ "SELECT Distinct ?o  WHERE { ?s ?p ?o. FILTER (!isLiteral(?o))   FILTER(!isBlank(?o))" + "MINUS "
				+ "  { ?s ?p ?o. FILTER (!isLiteral(?o))   FILTER(!isBlank(?o)) FILTER(regex(str(?p), \"skos/core#\" )) }}";
		QueryExecution qexec = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result = qexec.execSelect();
		// ResultSetFormatter.outputAsJSON(System.out, result);

		// ResultSetFormatter.out(System.out, result2);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();

		while (result.hasNext()) {
			QuerySolution binding = result.nextSolution();
			if (binding.get("o").toString() != null) {
				Resource externalClass = (Resource) binding.get("o");

				JSONObject obj = new JSONObject();
				obj.put("object", replaceWithRDFType(externalClass.getURI().toString()));

				obj.put("URI", externalClass.getURI());

				// File file = new File(_sourceFile);
				// obj.put("fileName", file.getName());
				array.put(obj);
			}
		}
		// check location
		jsonObject.put("externalClasses", array);

		return jsonObject;

	}

	public static JSONObject allSKOSObjectsJSON(String _sourceFile) throws IOException {

		org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" + "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
				+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
				+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "
				+ "SELECT Distinct ?o  WHERE { ?s ?p ?o. FILTER (!isLiteral(?o))   FILTER(!isBlank(?o)) FILTER(regex(str(?p), \"skos/core#\" )) }";
		QueryExecution qexec = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result = qexec.execSelect();
		// ResultSetFormatter.outputAsJSON(System.out, result);

		// ResultSetFormatter.out(System.out, result2);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();

		while (result.hasNext()) {
			QuerySolution binding = result.nextSolution();
			if (binding.get("o").toString() != null) {
				Resource externalClass = (Resource) binding.get("o");

				JSONObject obj = new JSONObject();
				obj.put("object", replaceWithRDFType(externalClass.getURI().toString()));

				obj.put("URI", externalClass.getURI());

				// File file = new File(_sourceFile);
				// obj.put("fileName", file.getName());
				array.put(obj);
			}
		}
		// check location
		jsonObject.put("externalClasses", array);

		return jsonObject;

	}

	public static Boolean isNotInstances(String RDFType) {
		if (RDFType.contains("owl#NamedIndividual"))
			return false;
		else if (RDFType.contains("owl#"))
			return true;
		else if (trim(RDFType).contains("Class"))
			return true;
		else if (trim(RDFType).contains("Property"))
			return true;
		else
			return false;

	}

	public static String replaceWithRDFType(String RDFType) {
		String conceptArray[];
		String RDFTypeTrimmed = "";
		if (RDFType.contains("/")) {
			conceptArray = RDFType.split("/");
			if (conceptArray != null && conceptArray.length > 0) {
				RDFTypeTrimmed = conceptArray[conceptArray.length - 1];
			}
		}
		if (RDFTypeTrimmed.indexOf("Class") >= 0 && RDFTypeTrimmed.indexOf("owl") >= 0)
			return "owl:Class";
		else if (RDFTypeTrimmed.indexOf("Class") >= 0 && RDFTypeTrimmed.indexOf("rdf-schema") >= 0)
			return "rdfs:Class";
		else if (RDFTypeTrimmed.indexOf("owl") >= 0)
			return "owl:" + RDFTypeTrimmed.substring(RDFTypeTrimmed.lastIndexOf('#') + 1);
		else if (RDFTypeTrimmed.indexOf("rdf-schema") >= 0)
			return "rdfs:" + RDFTypeTrimmed.substring(RDFTypeTrimmed.lastIndexOf('#') + 1);
		else if (RDFTypeTrimmed.indexOf("22-rdf-syntax-ns") >= 0)
			return "rdf:" + RDFTypeTrimmed.substring(RDFTypeTrimmed.lastIndexOf('#') + 1);
		else
			return trim(RDFType);

	}

	public static void clearTheFile(String fileName) throws IOException {
		FileWriter fwOb = new FileWriter(fileName, false);
		PrintWriter pwOb = new PrintWriter(fwOb, false);
		pwOb.flush();
		pwOb.close();
		fwOb.close();
	}

	public static String trim(String URI) {
		String conceptArray[];
		String conceptTrimmed = "";
		if (URI.contains("/")) {
			conceptArray = URI.split("/");
			if (conceptArray != null && conceptArray.length > 0) {
				conceptTrimmed = conceptArray[conceptArray.length - 1];
				// System.out.println(fileType);
			}
		}
		if (conceptTrimmed.contains("#")) {
			conceptArray = URI.split("#");
			if (conceptArray != null && conceptArray.length > 0) {
				conceptTrimmed = conceptArray[conceptArray.length - 1];

			}

		}
		// System.out.println("Parent"+conceptTrimmed);

		return conceptTrimmed;
	}

	public static String trim(String URI, Boolean isParent) {
		String conceptTrimmed = "";
		String conceptArray[];
		if (isParent) {
			if (URI.contains("/")) {
				conceptArray = URI.split("/");
				if (conceptArray != null && conceptArray.length > 0) {
					conceptTrimmed = conceptArray[conceptArray.length - 1];
					// System.out.println("test " + conceptTrimmed);
				}
			}
			if (conceptTrimmed.contains("#") || URI.contains("#")) {
				if (conceptTrimmed.equals("")) {
					conceptArray = URI.split("#");
					if (conceptArray != null && conceptArray.length > 0) {
						conceptTrimmed = conceptArray[conceptArray.length - 1];
						// System.out.println(fileType);
					}
				} else {
					conceptArray = conceptTrimmed.split("#");
					if (conceptArray != null && conceptArray.length > 0) {
						conceptTrimmed = conceptArray[conceptArray.length - 1];
						// System.out.println(fileType);
					}

				}

			} /*
				 * else return URI;
				 */

		}

		return conceptTrimmed;
	}

	public static void objectsFileDecode(JSONObject obj, String type) {

		try {
			String filePath;
			String outFileMessage;
			if (type == "SKOS") {
				filePath = "../../../jsonDataFiles/SKOSObjects.json";
				outFileMessage = "Successfully Copied allSKOSObjectJSON Object to File...";
			}

			else {
				filePath = "../../../jsonDataFiles/RDFSObjects.json";
				outFileMessage = "Successfully Copied allRDFObjectJSON Object to File...";

			}
			JSONObject rootJSON = obj;
			JSONArray orginzedArray = new JSONArray();
			JSONArray dataList = (JSONArray) rootJSON.get("files");
			for (Object projectObj : dataList) {
				JSONObject project = (JSONObject) projectObj;
				JSONArray issueList = (JSONArray) project.get("externalClasses");
				if (issueList.length() > 0) {
					// System.out.println("\nParent ::" + issueList);
					for (Object issueObj : issueList) {
						JSONObject issue = (JSONObject) issueObj;
						orginzedArray.put(issue);
					}
				}
			}
			try (FileWriter file = new FileWriter(filePath)) {
				file.write(orginzedArray.toString());

				System.out.println(outFileMessage);
				// System.out.println("\nJSON Object: " + mergedJsonObject);
				// trim();
			} catch (Exception e) {
				e.printStackTrace();
			}
		} catch (JSONException e) {
			// do smth
			e.printStackTrace();
		}

	}

	public static void SKOSFileDecode(JSONObject obj) {

		try {
			JSONObject rootJSON = obj;
			JSONArray orginzedArray = new JSONArray();
			JSONArray dataList = (JSONArray) rootJSON.get("files");
			if (dataList.length() > 0) {
				for (Object projectObj : dataList) {
					JSONObject project = (JSONObject) projectObj;
					JSONArray issueList = (JSONArray) project.get("SKOSconcepts");
					if (issueList.length() > 0) {
						for (Object issueObj : issueList) {
							JSONObject issue = (JSONObject) issueObj;
							orginzedArray.put(issue);
						}
					}
				}
			}
			try (FileWriter file = new FileWriter("../../../jsonDataFiles/SKOSConcepts.json")) {
				file.write(orginzedArray.toString());

				System.out.println("Successfully Copied SKOSJSON Object to File...");
				// trim();
			} catch (Exception e) {
				e.printStackTrace();
			}
		} catch (JSONException e) {
			// do smth
			e.printStackTrace();
		}

	}

	public static void RDFSFileDecode(JSONObject obj) {

		try {
			JSONObject rootJSON = obj;
			JSONArray orginzedArray = new JSONArray();
			// String conceptTrimmed = "";
			JSONArray dataList = (JSONArray) rootJSON.get("files");
			if (dataList.length() > 0) {
				for (Object projectObj : dataList) {
					JSONObject project = (JSONObject) projectObj;
					JSONArray issueList = (JSONArray) project.get("concepts");
					if (issueList.length() > 0) {
						for (Object issueObj : issueList) {
							JSONObject issue = (JSONObject) issueObj;
							JSONObject orginzedOject = new JSONObject();
							orginzedOject.put("concept", issue.getString("concept"));
							orginzedOject.put("fileName", issue.getString("fileName"));
							orginzedOject.put("label", issue.getString("label"));
							orginzedOject.put("URI", issue.getString("URI"));
							orginzedOject.put("RDFType", issue.getString("rdfType"));
							// System.out.println("\nRDFType: " + issue.getString("rdfType"));

							// if (issue.has("parent")) {
							if (issue.has("parent") && !issue.isNull("parent")) {
								String parentTrimmed = trim(issue.getString("parent"), true);
								orginzedOject.put("parent", parentTrimmed);
								// System.out.println("\nParent ::" + parentTrimmed);

							} else {

								orginzedOject.put("parent", "");

							}

							orginzedArray.put(orginzedOject);
						}
					}

				}
			}
			try (FileWriter file = new FileWriter("../../../jsonDataFiles/RDFSConcepts.json")) {
				file.write(orginzedArray.toString());
				// file.flush();
				// file.close();
				System.out.println("Successfully Copied RDFJSON Object to File...");
				// System.out.println("\nJSON Object: " + mergedJsonObject);
				// trim();
			} catch (Exception e) {
				e.printStackTrace();

			}
		} catch (JSONException e) {
			// do smth
			e.printStackTrace();
		}

	}

}
