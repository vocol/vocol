package core;


import java.util.List;
import java.util.ArrayList;

import org.antlr.v4.runtime.ANTLRErrorListener;
import org.antlr.v4.runtime.BaseErrorListener;
import org.antlr.v4.runtime.RecognitionException;
import org.antlr.v4.runtime.Parser;
import org.antlr.v4.runtime.Recognizer;
import org.antlr.v4.runtime.IntStream;
import org.antlr.v4.runtime.tree.ParseTreeWalker;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.Token;

public class CollectionErrorListener extends BaseErrorListener {

    private final List<SyntaxError> errors = new ArrayList<SyntaxError>();

    public List<SyntaxError> getErrors() {
        return errors;
    }

    @Override
    public void syntaxError(Recognizer<?, ?> recognizer, Object offendingSymbol, int line, int charPositionInLine, String msg, RecognitionException e) {
        if (e == null) {
            // e is null when the parser was able to recover in line without exiting the surrounding rule.
            e = new InlineRecognitionException(msg, recognizer, ((Parser)recognizer).getInputStream(), ((Parser)recognizer).getContext(), (Token) offendingSymbol);
        }
        this.errors.add(new SyntaxError(msg, e));
    }  
}
