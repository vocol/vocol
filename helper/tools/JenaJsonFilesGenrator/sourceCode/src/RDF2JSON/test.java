package RDF2JSON;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;


import java.io.*;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.*;

import org.apache.commons.io.FileUtils;
import org.apache.jena.iri.impl.Main;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.util.FileManager;

public class test {
	static String  	mainQuery = "", Query = "";
	static String turtleFolderPath = "../../../../repoFolder/";
	static String outputFolderPath = "../../../jsonDataFiles/";
	//static String turtleFolderPath = "input/";
	//static String outputFolderPath = "output/";
    

	public static void main(String[] args) throws IOException {
		org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.OFF);
		JSONArray mergingArrayClasses = new JSONArray();
		JSONObject mergedJsonObjectClasses = new JSONObject();
		JSONArray mergingArraySKOS = new JSONArray();
		JSONObject mergedJsonObjectSKOS = new JSONObject();
		JSONArray mergingAllRDFObjecs = new JSONArray();
		JSONObject mergedJsonObjectallRDFObjecs = new JSONObject();
		JSONArray mergingAllSKOSObjecs = new JSONArray();
		JSONObject mergedJsonObjectallSKOSObjecs = new JSONObject();
		JSONObject mergedJsonOWLNamedIndividuals = new JSONObject();
		JSONArray mergingJsonOWLNamedIndividuals = new JSONArray();
		try {

			File dir = new File(turtleFolderPath);
			String[] extensions = new String[] { "ttl" };
			List<File> files = (List<File>) FileUtils.listFiles(dir, extensions, true);
			for (File file : files) {
				// System.out.println("file: " + file.getCanonicalPath());
				JSONObject objClasses = generateRDFSJSON(file.getCanonicalPath());
				JSONObject objSKOS = generateSKOSJSON(file.getCanonicalPath());
				JSONObject objExternalClassesRDF = allRDFObjectsJSON(file.getCanonicalPath());
				JSONObject objExternalClassesSKOS = allSKOSObjectsJSON(file.getCanonicalPath());
				JSONObject objOWLNamedIndividuals = RDFSIndividualsJSON(file.getCanonicalPath());

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
				if (objOWLNamedIndividuals.length() != 0) {
					// System.out.println(obj);
					mergingJsonOWLNamedIndividuals.put(objOWLNamedIndividuals);
				}

			}
			mergedJsonObjectClasses.put("files", mergingArrayClasses);
			mergedJsonObjectSKOS.put("files", mergingArraySKOS);
			mergedJsonObjectallRDFObjecs.put("files", mergingAllRDFObjecs);
			mergedJsonObjectallSKOSObjecs.put("files", mergingAllSKOSObjecs);
			mergedJsonOWLNamedIndividuals.put("files", mergingJsonOWLNamedIndividuals);

			// call to organize
			SKOSFileDecode(mergedJsonObjectSKOS);
			RDFSFileDecode(mergedJsonObjectClasses);
			objectsFileDecode(mergedJsonObjectallRDFObjecs, "RDFS");
			objectsFileDecode(mergedJsonObjectallSKOSObjecs, "SKOS");
			objectsFileDecode(mergedJsonOWLNamedIndividuals, "OWLIndividiual");
		} catch (IOException e) {
			System.out.println(e.getMessage());
		} finally {

		}


	}

	// @SuppressWarnings({ "null", "resource" })
	public static JSONObject generateRDFSJSON(String _sourceFile) throws IOException {

		//org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		// System.out.println("_sourceFile: " +_sourceFile);

		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" 
				+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
				+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
				+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " 
				+ "SELECT DISTINCT ?concept ?RDFType "
				+ "WHERE {{"
				+ "  ?concept rdfs:subClassOf ?p"
				+ "  OPTIONAL {?concept a ?RDFType.} "
				+ "  Filter(!bound(?RDFType))"
				+ "}"
				+ "UNION{"
				+ "?concept a ?RDFType . "
				+ "           OPTIONAL {?concept ?p ?o.}"
				+ "FILTER (!contains(str(?RDFType), \"skos/core#\"))"
				+ "FILTER (contains(str(?RDFType), \"owl#\")||contains(str(?RDFType), \"22-rdf-syntax-ns#\")||contains(str(?RDFType),\"rdf-schema#\" ))"

				+ "MINUS{?concept a owl:NamedIndividual  ."+
				"}"+
				"MINUS{?concept a owl:Thing ."+
				"}}"
				+ "}";
		QueryExecution qexec2 = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result2 = qexec2.execSelect();



		// display output on console
		//ResultSetFormatter.out(System.out, result2);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();
		while (result2.hasNext()) {
			QuerySolution binding = result2.nextSolution();
			//if (binding.get("concept") != null && isNotInstances(binding.get("RDFType").toString())) {

			if (binding.get("concept") != null) {
				JSONObject obj = new JSONObject();

				Resource concept = (Resource) binding.get("concept");

				if (binding.get("RDFType") != null) {

					Resource RDFType = (Resource) binding.get("RDFType");

					// trimming of the concept from URI
					if (RDFType.getURI() != null) {
						obj.put("RDFType", replaceWithRDFType(RDFType.getURI().toString()));

					}
				}
				else {
					obj.put("RDFType", "Class");

				}

				// trimming of the concept from URI
				if(concept.getURI()!= null)
					obj.put("concept", replaceWithRDFType(concept.getURI().toString()));
				else 
					continue;
				obj.put("URI", concept.getURI());


				// if (RDFType.getURI().toString().contains("Class")) {
				// obj.put("parent", "");
				Query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
						+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
						+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" + "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
						+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
						+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "
						+ "SELECT  ?classChild ?classParent WHERE {" 
						+ "?classChild rdfs:subClassOf  ?classParent ."
						+ "FILTER(!isBlank(?classParent))\n"
						+ "FILTER(!isBlank(?classChild))"
						+ "}";
				QueryExecution qexec3 = QueryExecutionFactory.create(Query, ontModel);
				ResultSet result3 = qexec3.execSelect();
				while (result3.hasNext()) {
					QuerySolution binding3 = result3.nextSolution();
					Resource classChild = (Resource) binding3.get("classChild");
					Resource classParent = (Resource) binding3.get("classParent");

					if (classChild.getURI() == concept.getURI() && classParent.getURI()!= null) {
						String nodeParnet = classParent.getURI().toString();
						if (classParent.getURI() != null) {
							if(classParent.getURI().toString().contains("owl#Thing"))
							{
								nodeParnet = "";
							}

							obj.put("parent", nodeParnet);
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

		//org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " 
				+ "SELECT  distinct ?subject ?oBroader ?RDFType  WHERE {"
				+ "?subject a ?RDFType ."
				+ "OPTIONAL{?subject skos:broader ?oBroader .}"
				+ " FILTER (contains(str(?RDFType), \"skos/core#\"))}";
		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();

		QueryExecution qexec2 = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result2 = qexec2.execSelect();
		//ResultSetFormatter.out(System.out, result2);
		while (result2.hasNext()) {
			QuerySolution binding = result2.nextSolution();
			if (binding.get("subject") != null) {
				Resource subject = (Resource) binding.get("subject");
				// System.out.println("\concept: " + concept.getURI());
				Resource oBroader = (Resource) binding.get("oBroader");

				JSONObject obj = new JSONObject();
				// URI for parent
				obj.put("concept", trim(subject.getURI().toString()));
				obj.put("URI", subject.getURI());
				if (binding.get("oBroader") != null) {
					obj.put("childURI", subject.getURI());
					obj.put("parentURI", oBroader.getURI());
					obj.put("child", trim(subject.getURI().toString()));
					obj.put("parent", trim(oBroader.getURI().toString()));
				}
				else {
					obj.put("child", "");
					obj.put("parent", "");
				} 

				if (binding.get("RDFType") != null) {
					Resource RDFType = (Resource) binding.get("RDFType");
					obj.put("RDFType", replaceWithRDFType(RDFType.getURI().toString()));
				}
				File file = new File(_sourceFile);
				obj.put("fileName", file.getName());
				array.put(obj);

			}
		}

		mainQuery = "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>"
				+ "SELECT  distinct ?subject  ?RDFType ?oNarrower  WHERE {" 
				+ "?subject skos:narrower ?oNarrower ."
				+ "OPTIONAL{?subject a ?RDFType .}}"; 
		QueryExecution qexec1 = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result1 = qexec1.execSelect();
		// ResultSetFormatter.outputAsJSON(System.out, result1);

		// ResultSetFormatter.out(System.out, result1);

		while (result1.hasNext()) {
			boolean isDuplicateData = false;
			QuerySolution binding = result1.nextSolution();
			if (binding.get("subject") != null) {
				JSONObject obj = new JSONObject();
				Resource subject = (Resource) binding.get("subject");
				Resource oNarrower = (Resource) binding.get("oNarrower");

				// remove duplicate record of pair parentandchild
				if (array.length() > 0 && binding.get("oNarrower") != null) {
					for (Object issueObj : array) {
						JSONObject issue = (JSONObject) issueObj;
						String str1 = issue.getString("parent");
						String str2 = trim(subject.getURI().toString());
						String str3 = issue.getString("child");
						String str4 = trim(oNarrower.getURI().toString());

						if (str1.equalsIgnoreCase(str2) || str3.equalsIgnoreCase(str4)) {
							isDuplicateData = true;
							break;
						}
					}
				}
				if (!isDuplicateData) {

					// URI for child
					if (binding.get("oNarrower") != null) {
						obj.put("parentURI", subject.getURI());
						obj.put("childURI", oNarrower.getURI());
						obj.put("parent", trim(subject.getURI().toString()));
						obj.put("child", trim(oNarrower.getURI().toString()));
					} else {
						obj.put("child", "");
						obj.put("parent", "");
					}

					obj.put("concept", trim(subject.getURI().toString()));
					obj.put("URI", subject.getURI());

					if (binding.get("RDFType") != null) {
						Resource RDFType = (Resource) binding.get("RDFType");
						obj.put("RDFType", replaceWithRDFType(RDFType.getURI().toString()));
					}

					File file = new File(_sourceFile);
					obj.put("fileName", file.getName());
					array.put(obj);
				}
			}

		}

		// add to JSONObject
		jsonObject.put("SKOSconcepts", array);
		return jsonObject;
	}

	public static JSONObject RDFSIndividualsJSON(String _sourceFile) throws IOException {

		//org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
				"PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+
				"PREFIX owl:  <http://www.w3.org/2002/07/owl#>"+
				"PREFIX skos: <http://www.w3.org/2004/02/skos/core#>"+  
				"SELECT DISTINCT ?s ?RDFType "+
				"WHERE {{"+
				"?s a ?RDFType ; ?p ?o."+
				"FILTER (!contains(str(?RDFType), \"owl#\"))"+
				"FILTER (!contains(str(?RDFType), \"rdf-schema#\"))"+
				"FILTER (!contains(str(?RDFType), \"22-rdf-syntax-ns#\"))"+
				"FILTER (!contains(str(?RDFType), \"skos/core#\"))"+
				"FILTER (!contains(str(?p), \"subClassOf\"))"+
				"FILTER (!contains(str(?p), \"subPropertyOf\"))"+
				"}"+
				"UNION{?s a ?RDFType ."+
				"  FILTER (contains(str(?RDFType), \"owl#NamedIndividual\"))"+
				"}"+
				"UNION{?s a ?RDFType ."+
				"     FILTER (contains(str(?RDFType), \"owl#Thing\"))"+
				"}}";
		QueryExecution qexec = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result = qexec.execSelect();
		//ResultSetFormatter.outputAsJSON(System.out, result);

		//ResultSetFormatter.out(System.out, result);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();

		while (result.hasNext()) {
			QuerySolution binding = result.nextSolution();
			if (binding.get("s") != null) {
				Resource subject = (Resource) binding.get("s");
				JSONObject obj = new JSONObject();
				if(subject.getURI() != null)
					obj.put("subject", trimInstance(subject.getURI()));
				else 
					continue;

				obj.put("subjectURI", subject.getURI());

				if (binding.get("RDFType") != null) {
					Resource RDFType = (Resource) binding.get("RDFType");
					obj.put("RDFType", replaceWithRDFType(RDFType.getURI().toString()));
				}
				File file = new File(_sourceFile);
				obj.put("fileName", file.getName());
				array.put(obj);
			}
		}
		// check location
		jsonObject.put("array", array);

		return jsonObject;

	}

	public static JSONObject allRDFObjectsJSON(String _sourceFile) throws IOException {

		//org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" + "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
				+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
				+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "
				+ "SELECT Distinct ?o  WHERE { ?s ?p ?o. FILTER (!isLiteral(?o))   FILTER(!isBlank(?o))" + "MINUS "
				+ "  { ?s ?p ?o. FILTER (!isLiteral(?o))   FILTER(!isBlank(?o)) FILTER(regex(str(?p), \"skos/core#\" )) }"
				+ "}";
		QueryExecution qexec = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result = qexec.execSelect();
		// ResultSetFormatter.outputAsJSON(System.out, result);

		// ResultSetFormatter.out(System.out, result2);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();

		while (result.hasNext()) {
			QuerySolution binding = result.nextSolution();
			if (binding.get("o") != null) {
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
		jsonObject.put("array", array);

		return jsonObject;

	}

	public static JSONObject allSKOSObjectsJSON(String _sourceFile) throws IOException {

		//org.apache.log4j.BasicConfigurator.configure(new NullAppender());

		FileManager.get().addLocatorClassLoader(Main.class.getClassLoader());

		OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		FileManager.get().readModel(ontModel, _sourceFile);

		mainQuery = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX owl:  <http://www.w3.org/2002/07/owl#>" + "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
				+ "PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>"
				+ "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> "
				+ "SELECT Distinct ?o  WHERE { ?s1 ?p ?o1. ?s1 ?p1 ?o  FILTER (!isLiteral(?o))   FILTER(!isBlank(?o)) FILTER(regex(str(?p), \"skos/core#\" )) "
				+ "MINUS {?o a owl:NamedIndividual }}";
		QueryExecution qexec = QueryExecutionFactory.create(mainQuery, ontModel);
		ResultSet result = qexec.execSelect();
		// ResultSetFormatter.outputAsJSON(System.out, result);

		// ResultSetFormatter.out(System.out, result2);

		JSONObject jsonObject = new JSONObject();
		JSONArray array = new JSONArray();

		while (result.hasNext()) {
			QuerySolution binding = result.nextSolution();
			if (binding.get("o") != null) {
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
		jsonObject.put("array", array);

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
		if (RDFType.contains("skos/core#")) {
			conceptArray = RDFType.split("#");
			if (conceptArray != null && conceptArray.length > 0) {
				RDFTypeTrimmed = conceptArray[conceptArray.length - 1];
				return "skos:" + RDFTypeTrimmed.substring(RDFTypeTrimmed.lastIndexOf('#') + 1);
			}
		} else if (RDFType.contains("/")) {
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

		else if (RDFType.contains("foaf"))
			return "foaf:" + trim(RDFType);

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

	public static String trimInstance(String URI) {
		String conceptArray[];
		String conceptTrimmed = "";
		if(URI.endsWith("/"))
			URI = URI.substring(0, URI.length() - 1);
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
			String filePath = null;
			String outFileMessage = null;
			if (type == "SKOS") {
				filePath = outputFolderPath + "SKOSObjects.json";
				outFileMessage = "Successfully Copied allSKOSObjectJSON Object to File...";
			}

			else if (type == "OWLIndividiual") {
				filePath = outputFolderPath + "OWLIndividiuals.json";
				outFileMessage = "Successfully Copied OWLIndividiualsJSON Object to File...";

			} else if (type == "RDFS") {
				filePath = outputFolderPath + "RDFSObjects.json";
				outFileMessage = "Successfully Copied allRDFObjectJSON Object to File...";
			}
			JSONObject rootJSON = obj;
			JSONArray orginzedArray = new JSONArray();
			JSONArray dataList = (JSONArray) rootJSON.get("files");
			for (Object projectObj : dataList) {
				JSONObject project = (JSONObject) projectObj;
				JSONArray issueList = (JSONArray) project.get("array");
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
			String filePath = outputFolderPath + "SKOSConcepts.json";
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
			try (FileWriter file = new FileWriter(filePath)) {
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
			String filePath = outputFolderPath + "RDFSConcepts.json";
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
							orginzedOject.put("URI", issue.getString("URI"));
							orginzedOject.put("RDFType", issue.getString("RDFType"));
							// System.out.println("\nRDFType: " + issue.getString("RDFType"));

							// if (issue.has("parent")) {
							if (issue.has("parent") && !issue.isNull("parent")) {
								String parentTrimmed = replaceWithRDFType(issue.getString("parent"));
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
			try (FileWriter file = new FileWriter(filePath)) {
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