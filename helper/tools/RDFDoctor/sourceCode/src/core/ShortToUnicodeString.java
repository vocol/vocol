package core;

/***
 * Excerpted from "The Definitive ANTLR 4 Reference",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/tpantlr2 for more book information.
***/
/** Convert short array inits like {1,2,3} to "\u0001\u0002\u0003" */
public class ShortToUnicodeString extends TurtleBaseListener {
    /** Translate { to " */
    @Override
    public void enterStart(TurtleParser.StartContext ctx) {
        System.out.print(ctx.getText());
    }

    /** Translate } to " */
    @Override
    public void exitStart(TurtleParser.StartContext ctx) {
        System.out.print('"');
    }
}
