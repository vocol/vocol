package errorCorrection;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Scanner;


public class Correction {

	private String [] inputBeforeEditing;
    public 	ArrayList<String> errorCorrectionsList = new ArrayList<String>();
	public void process (String [] input, ArrayList<String> errors ) {

		if(inputBeforeEditing == null) {
			inputBeforeEditing = input;
		}

		// make unique values of the error array list 
		HashSet<String> uniqueValues = new HashSet<>(errors);
		Iterator<String> iterator = uniqueValues.iterator();

		while (iterator.hasNext()) {
			String line = iterator.next();
			int lineNum = Integer.parseInt(line.split("line ")[1].split(":")[0]);
			int columnNum = Integer.parseInt(line.split("line ")[1].split(":")[1].split(" ")[0]);
			
			// select the action based on the error message
			if(line.contains("extraneous input'.' at the end of Prefix directive"))
				deleteDot(lineNum, columnNum);
			else if (line.contains("Missing '.' at the end of Prefix directive") || line.contains("Missing '.' at the end of a triple"))
				addDot(lineNum, columnNum);
			else if (line.contains("Missing IRI in Prefix directive"))
				addIRI(lineNum, columnNum);
			else if (line.contains("Missing IRI  and dot at Prefix directive"))
				addIRIandDot(lineNum, columnNum);
			else if (line.contains("'=' sign cannot be used in Turtle"))
				commentLine(lineNum, columnNum);
			else if (line.contains("'A' cannot be used as predicate, it should be repalced with 'a'"))
				changeA2a(lineNum, columnNum);
			else if (line.contains("Bad end of a triple with ';'"))
				change2Dot(lineNum,columnNum, ";");
			else if (line.contains("Bad end of a triple with ','"))
				change2Dot(lineNum,columnNum, ",");
						
		}
	}
	
	// delete an extra dot 
	public void change2Dot(long lineNum, long colNum, String badChar ) {
		long lineNumber = -1 ; 
		if (colNum == 0 && lineNum >= 2)
			lineNumber = lineNum - 2 ;
		else if (colNum == 0 && lineNum == 1)
			lineNumber = lineNum - 1 ;
		// store line inside stringBuilder to delete a period
		StringBuilder sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
		int charLocation = -1;
		while(charLocation == -1) {
			 sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
			charLocation = sb.lastIndexOf(badChar);
			if(charLocation != -1) {
				sb.deleteCharAt(charLocation);
				inputBeforeEditing[(int) lineNumber] = 	sb.insert(charLocation, '.').toString();
				// correction done to the correctionList
		    	errorCorrectionsList.add("error in [line "+ lineNum +",Column "+colNum+"] "+ "was corrected by replaced '" + badChar + "' with '.' as a correct end of a triple") ;
				break;
			}
			// if lineNumber is equal to 0, then the line
			if(lineNumber != 0)
				lineNumber--;
			else
				// exit loop if lineNumber is 0 
				break;
		}
	}

	// delete an extra dot 
	public void deleteDot(long lineNum, long colNum ) {
		long lineNumber = -1 ; 
		if (colNum == 0 && lineNum >= 2)
			lineNumber = lineNum - 2 ;
		else if (colNum == 0 && lineNum == 1)
			lineNumber = lineNum - 1 ;
		// store line inside stringBuilder to delete a period
		StringBuilder sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
		int charLocation = -1;
		while(charLocation == -1) {
			 sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
			charLocation = sb.lastIndexOf(".");
			if(charLocation != -1) {
				inputBeforeEditing[(int) lineNumber] = sb.deleteCharAt(charLocation).toString();
				// correction done to the correctionList
		    	errorCorrectionsList.add("error in [line "+ lineNum +",Column "+colNum+"] "+ "was corrected by deleting extra Dots") ;
				break;
			}
			// if lineNumber is equal to 0, then the line
			if(lineNumber != 0)
				lineNumber--;
			else
				// exit loop if lineNumber is 0 
				break;
		}
	}
	
	// Replace 'A' with 'a' in case it is used as a predicate
	public void changeA2a(long lineNum, long colNum ) {
		// store line inside stringBuilder to replace 'A' with 'a'
		StringBuilder sb = new StringBuilder(inputBeforeEditing[(int) lineNum]);
		int charLocation = -1;
		while(charLocation == -1) {
			 sb = new StringBuilder(inputBeforeEditing[(int) lineNum]);
			charLocation = sb.lastIndexOf(" A");
			if(charLocation != -1) {
				// delete where 'A' is found
				sb.deleteCharAt(charLocation +1).toString();
				sb.insert(charLocation, ' ');
				sb.insert(charLocation + 1, 'a');
				inputBeforeEditing[(int) lineNum] = sb.toString();
				// correction done to the correctionList
		    	errorCorrectionsList.add("error in [line "+ lineNum +",Column "+colNum+"] "+ "was corrected by replaced 'A' with 'a'") ;
				break;
			}
			// if lineNumber is equal to 0, then the line
			if(lineNum != 0)
				lineNum--;
			else
				// exit loop if lineNumber is 0 
				break;
	
		}
	}
	
	// add a missing dot 
	public void addDot(long lineNum, long colNum ) {
		long lineNumber = -1 ; 
		if (colNum == 0 && lineNum >= 2)
			lineNumber = lineNum - 2 ;
		else if (colNum == 0 && lineNum == 1)
			lineNumber = lineNum - 1 ;
		System.out.println(lineNumber);
		// store line inside stringBuilder to delete a period
		StringBuilder sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
		int charLocation = -1;
		while(sb.toString() != "\n") {
			 sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
			charLocation = sb.lastIndexOf(" ");
			if(charLocation != -1) {
				inputBeforeEditing[(int) lineNumber] = sb.insert(charLocation, ".").toString();
		    	errorCorrectionsList.add("error in [line "+ lineNum +",Column "+colNum+"] "+ "was corrected by adding '.' at the end of a triple/prefix ") ;
				break;
			}
			// if lineNumber is equal to 0, then the line
			if(lineNumber != 0)
				lineNumber--;
			else
				// exit loop if lineNumber is 0 
				break;
		}
	}

	// add a dummy IRI for a missing IRI 
	public void addIRI(long lineNum, long colNum ) {
		long lineNumber = -1 ; 
		// adjust the lineNumber where a dummy IRI will be added
		if ( inputBeforeEditing[(int) lineNum] == "" && lineNum >= 1)
			lineNumber = lineNum - 1 ;
		else if(lineNum >= 2)
			lineNumber = lineNum -2;
		else 
			lineNumber = lineNum ;

		// store line inside stringBuilder to delete a period
		StringBuilder sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
		int charLocation = -1;
		while(charLocation == -1) {
			 sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
			charLocation = sb.lastIndexOf(".");
			if(charLocation != -1) {
				inputBeforeEditing[(int) lineNumber] = sb.insert(charLocation, "<http://REPLACE_THIS_WITH_THE_CORRECT_URI/>").toString();
				break;
			}
			// if lineNumber is equal to 0, then the line
			if(lineNumber != 0)
				lineNumber--;
			else
				// exit loop if lineNumber is 0 
				break;
		}
	}
	

	// add a dummy IRI for a missing IRI and a dot as well
	public void addIRIandDot(long lineNum, long colNum ) {
		long lineNumber = -1 ; 
		// adjust the lineNumber where a dummy IRI will be added
		if ( inputBeforeEditing[(int) lineNum] == "" && lineNum >= 1)
			lineNumber = lineNum - 1 ;
		else if(lineNum >= 2)
			lineNumber = lineNum -2;
		else 
			lineNumber = lineNum ;

		// store line inside stringBuilder to delete a period
		StringBuilder sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
		int charLocation = -1;
		while(charLocation == -1) {
			 sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
			charLocation = sb.lastIndexOf(" ");
			if(charLocation != -1) {
				inputBeforeEditing[(int) lineNumber] = sb.insert(charLocation, "<http://REPLACE_THIS_WITH_THE_CORRECT_URI/> . ").toString();
				break;
			}
			// if lineNumber is equal to 0, then the line
			if(lineNumber != 0)
				lineNumber--;
			else
				// exit loop if lineNumber is 0 
				break;
		}
	}
	
	// comment line contains an equal sign
	public void commentLine(long lineNum, long colNum ) {
		long lineNumber = -1 ; 
		// adjust the lineNumber where a dummy IRI will be added
		if ( inputBeforeEditing[(int) lineNum] == "" && lineNum >= 1)
			lineNumber = lineNum - 1 ;
		else if(lineNum >= 2)
			lineNumber = lineNum -2;
		else 
			lineNumber = lineNum ;

		// store line inside stringBuilder to delete a period
		// now just we comment the line contains the rule
		StringBuilder sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);

		int charLocation = -1;
		boolean foundEqualSign = false;
		
		while(charLocation == -1) {
			 sb = new StringBuilder(inputBeforeEditing[(int) lineNumber]);
			 if(sb.indexOf("=") != -1)
				 foundEqualSign = true;
			 if(foundEqualSign) {
			charLocation = sb.lastIndexOf("<");

			if(charLocation != -1) {
				inputBeforeEditing[(int) lineNumber] = sb.insert(0, "#").toString();
				break;
			}
			}
			// if lineNumber is equal to 0, then the line
			if(lineNumber != 0)
				lineNumber--;
			else
				// exit loop if lineNumber is 0 
				break;
		}
	}
	
	public void showInputAfterEditing () {
		long count = 1;
		System.out.print("\nInput after correction:\n");

		for(String line : inputBeforeEditing) {
			// check if input is empty
			if(line == "")
				break;
			// show input after fixing errors
			System.out.print("line "+ count++ + " " + line);
		}
	}
	
	public void writeToFileAfterEditing (String filename) {
		long count = 1;
		String data = "";
		
	        File file = new File(filename);
	        FileWriter fr = null;
	        try {
	        	
	            fr = new FileWriter(file,true);
	    		for(String line : inputBeforeEditing) {
	    			// check if input is empty
	    			if(line == "")
	    				break;
		            fr.write(line);	    			
	    		}
	        } catch (IOException e) {
	            e.printStackTrace();
	        }finally{
	            //close resources
	            try {
	                fr.close();
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	        }
	}
}
