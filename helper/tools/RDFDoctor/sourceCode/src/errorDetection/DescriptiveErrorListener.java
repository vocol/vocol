package errorDetection;

import org.antlr.v4.runtime.*;
import java.util.ArrayList;

public class DescriptiveErrorListener extends BaseErrorListener {
	public 	ArrayList<String> errorsList = new ArrayList<String>();
	private int offest = 0;
	private static String [] inputLines;
	public DescriptiveErrorListener() {	}

	@Override
	public void finalize() {}
	@Override
	public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol,
			int line, int charPositionInLine,
			String msg, RecognitionException e)
	{

		int currentLine = line + offest; 
		errorsList.add("line "+ currentLine +":"+charPositionInLine+" "+msg +getErrorLineStringUnderlined(line,charPositionInLine) );
	}
	public void setOffest(int count) {
		offest = count;
	}

	public void setInput(String [] arr) {
		inputLines = arr;
	}

	public void resetErrorList () {
		errorsList.clear();
	}
	public static String getErrorLineString(int lineNumber) {
		return inputLines[lineNumber - 1];
	}

	public static String getErrorLineStringUnderlined(int lineNumber ,int colNumber) {
		String errorLine = getErrorLineString(lineNumber);
		if (errorLine.isEmpty()) {
			return errorLine;
		}
		// replace tabs with single space so that charPositionInLine gives us the
		// column to start underlining.
		errorLine = errorLine.replaceAll("\t", " ");
		StringBuilder underLine = new StringBuilder(String.format("%" + errorLine.length() + "s", ""));
		// put '^' after the error in the current line
		underLine.setCharAt(colNumber, '^');
		return String.format("%s%n%s","\n"+ errorLine, underLine);
	}
}
