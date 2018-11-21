package core;
import org.antlr.v4.runtime.RecognitionException;
import org.antlr.v4.runtime.ParserRuleContext;


public class SyntaxError extends RecognitionException {

    public SyntaxError(String message, RecognitionException e) {
        super(message, e.getRecognizer(), e.getInputStream(), (ParserRuleContext) e.getCtx());
        this.setOffendingToken(e.getOffendingToken());
        this.initCause(e);
    }
}