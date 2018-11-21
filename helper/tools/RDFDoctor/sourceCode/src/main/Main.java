package main;

import java.io.IOException;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.File;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import core.CollectionErrorListener;
import core.ShortToUnicodeString;
import core.TurtleLexer;
import core.TurtleParser;
import errorCorrection.Correction;
import errorDetection.DescriptiveErrorListener;

import java.io.PrintWriter;
import java.io.PrintStream;
import java.io.FileOutputStream;
import java.io.FileWriter;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.ANTLRErrorListener;
import org.antlr.v4.runtime.BaseErrorListener;
import org.antlr.v4.runtime.RecognitionException;
import org.antlr.v4.runtime.tree.ParseTreeWalker;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.ParseTreeListener;
import org.antlr.v4.gui.TreeViewer;
import org.antlr.v4.runtime.CommonTokenStream;
public class Main {

	// needed for large files 
	static DescriptiveErrorListener errorListener = new DescriptiveErrorListener();
	static ArrayList<String> errorCorrectionsReport = new ArrayList<String>();
	static boolean showParsingTree = false; 
	static boolean autoErrorCorrection = false; 

	public static void main (String[] args) {
		String InputFIlename = "file.ttl" ; 
		String outputFilename = InputFIlename.split("ttl")[0]+"output" ;
		String errorFilename = InputFIlename.split("ttl")[0]+"error" ;
		long startTime = 0, endTime = 0;
		InputStream input;
		boolean isJSONOutputSeleted = false; 

		// check if there are inputs for the names of output or input files
		if(args.length != 0) {
			String[] inputParameters = args;
			//System.out.println(Arrays.toString(inputParameters));

			if ( Arrays.asList(inputParameters).contains("-i")) {
				File f;
				InputFIlename = Arrays.asList(inputParameters).get(Arrays.asList(inputParameters).indexOf("-i")+1);
				errorFilename = FilenameUtils.getName(InputFIlename).split("ttl")[0]+"error" ;
				outputFilename = FilenameUtils.getName(InputFIlename).split("ttl")[0]+"output" ;
				System.out.println(errorFilename);
				System.out.println(outputFilename);

			}
			if ( Arrays.asList(inputParameters).contains("-o")) {
				outputFilename = Arrays.asList(inputParameters).get(Arrays.asList(inputParameters).indexOf("-o")+1);
			}
			if ( Arrays.asList(inputParameters).contains("-r")) {
				errorFilename = Arrays.asList(inputParameters).get(Arrays.asList(inputParameters).indexOf("-r")+1);
			}
			if ( Arrays.asList(inputParameters).contains("-j")) {
				isJSONOutputSeleted = true;
			}
			if ( Arrays.asList(inputParameters).contains("-v")) {
				showParsingTree = true;
			}
			if ( Arrays.asList(inputParameters).contains("-c")) {
				autoErrorCorrection = true;
				// make a function for correction
			}

		}

		try {
			// needed for large file
			input = new FileInputStream(InputFIlename);
			// start time counter
			startTime = System.nanoTime();
			// clear output file at the start of the program
			FileWriter fw =new FileWriter(outputFilename, false);
			fw.write("");
			fw.close();


			BufferedReader reader = new BufferedReader(new InputStreamReader(input,"UTF8"));

			String line;
			int counter = 1;
			String [] currentData = new String[1000000];
			Arrays.fill( currentData, "" );


			// SETUP
			System.out.print("Processing is going on ");
			Runnable notifier = new Runnable() {
				public void run() {
					System.out.print("!");
				}
			};

			ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

			// IN YOUR WORK THREAD
			scheduler.scheduleAtFixedRate(notifier, 1, 1, TimeUnit.SECONDS);

			while ((line = reader.readLine()) != null) {
				currentData[counter - 1]=line+"\n";
				counter++;
				if (counter%999999 == 0) {
					break;
				}
			}

			//for smaller than 1000000 lines
			errorListener.setInput(currentData);
			parse( currentData, outputFilename );
			Arrays.fill( currentData, "" );


			//Middle part of multiple 999999 lines 
			int higherCounter = 0;
			boolean dataBelowMilion = true;
			//for greater that 1000000 lines
			while ((line = reader.readLine()) != null) {
				currentData[higherCounter]=line+"\n";
				counter++;
				higherCounter++;
				dataBelowMilion = true;

				if (counter%999999 == 0 ) {
					errorListener.setInput(currentData);
					errorListener.setOffest(counter -1);
					parse(currentData,outputFilename);
					Arrays.fill( currentData, "" );
					higherCounter = 0;
					dataBelowMilion = false;
				} 
			}
			if(dataBelowMilion && counter > 999999) {
				errorListener.setInput(currentData);
				errorListener.setOffest(counter -1);
				parse(currentData,outputFilename);
				Arrays.fill( currentData, "" );
			}

			scheduler.shutdownNow();
			// write error list to an error file 
					
			if(isJSONOutputSeleted)
				writeErrorsToFile(errorFilename, "JSON");
			else 
				writeErrorsToFile(errorFilename, "Plain");
			
			// show corrections list report if there any in the corrections list
			//			if(!errorCorrectionsReport.isEmpty())
			//				showCorrectionReport();
			endTime = System.nanoTime();
			long elapsedTimeInMillis = TimeUnit.MILLISECONDS.convert((endTime - startTime), TimeUnit.NANOSECONDS);
			System.out.println("\n\nTotal elapsed time: " + elapsedTimeInMillis + " ms");
			System.out.println("\nNumber of processed lines: "+ counter);
			System.gc();//gc, won't run for such tiny object so forced clean-up



		}catch(RecognitionException e ) {
			System.out.print("\n\n\n from inside catch "+e.getMessage());
		}catch(IOException ioe) {
			System.out.print("\n"+ioe.getMessage());
		}
	}

	static void parse(String [] inputChunck, String outFilename) {

		ANTLRErrorListener listener = new BaseErrorListener();
		CollectionErrorListener collector = new CollectionErrorListener();
		Correction corrector = new Correction();
		TurtleLexer lexer = new  TurtleLexer(new ANTLRInputStream(String.join("",inputChunck)));
		lexer.removeErrorListeners();
		lexer.addErrorListener(errorListener);

		// create a buffer of tokens pulled from the lexer
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		// create a parser that feeds off the tokens buffer
		TurtleParser parser = new TurtleParser(tokens);

		parser.removeErrorListeners();
		parser.addErrorListener(errorListener);
		ParseTree tree = parser.start(); // begin parsing at init rule
		//System.out.print("\n\n"+parser.getCurrentToken());
		
		//show AST in GUI
		if(showParsingTree) {
			JFrame frame = new JFrame("Parsing Tree");
			TreeViewer viewer = new TreeViewer(Arrays.asList(
					parser.getRuleNames()),tree);
			viewer.setScale(1.5);//scale a little
			JScrollPane panel = new JScrollPane(viewer);
			panel.setAutoscrolls(true);
			frame.add(panel);
			frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
			frame.setSize(3000,500);
			//frame.pack();

			frame.setVisible(true);
			try
			{
				// This is not the actual-sized frame. get the actual size
				Dimension actualSize = frame.getContentPane().getSize();
				BufferedImage image = new BufferedImage(actualSize.width, actualSize.height+100, BufferedImage.TYPE_INT_RGB);
				Graphics2D graphics2D = image.createGraphics();
				frame.paint(graphics2D);
				ImageIO.write(image,"jpeg", new File("parseTree.jpeg"));
			}
			catch(Exception exception)
			{
				//code
			}
		}

		if(autoErrorCorrection) {
			//System.out.println(); // print a \n after translation
			corrector.process(inputChunck,errorListener.errorsList );

			//show arrayOfErrors
			//System.out.print(errorListener.errorsList);

			//corrector.showInputAfterEditing();
			//corrector.writeToFileAfterEditing(outFilename);
			if(!corrector.errorCorrectionsList.isEmpty()) {
				for(String line : corrector.errorCorrectionsList) {
					errorCorrectionsReport.add(line);

				}
			}
			//errorListener.resetErrorList();
		}


	}

	// write the errors to a file 
	static public void writeErrorsToFile (String errorFilename, String type) {
		long count = 1;
		JSONArray errorJSONArray = new JSONArray();

		File file = new File(errorFilename);
		FileWriter fr = null;
		try {
			if(!errorListener.errorsList.isEmpty()) {
				fr = new FileWriter(file);
				for(String line : errorListener.errorsList) {
//					// check if input is empty
//					if(line == "") {
//						break;
//					}
					if(type == "JSON") {
						// create a JSONObject to hold the error number and the message
						JSONObject errorJSONObject = new JSONObject();
						errorJSONObject.put("errorMessage", line);
						errorJSONObject.put("errorNumber", count++);
						errorJSONArray.put(errorJSONObject);
					}
					else {
						// can be used to show error with a plain text
						fr.write("\nError"+count++ + ": "+line);
					}

				}
			}else {
				System.out.println("no errors were found in" + errorFilename);
			}


		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				if(type == "JSON" && !errorListener.errorsList.isEmpty()) {
					fr.write(errorJSONArray.toString());
					fr.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	// display report about the corrections list
	static public void showCorrectionReport () {
		// counter for number of corrections
		int count = 1;
		// check if there are some corrections done
		if(!errorCorrectionsReport.isEmpty()) {
			System.out.println(":::::::::::::::::::::::");
			System.out.println(":: Correction Reprot ::");
			System.out.println(":::::::::::::::::::::::");
			for(String line : errorCorrectionsReport) {
				System.out.println("Correction "+ count++ +": " + line);
			}
		}
	}

}
