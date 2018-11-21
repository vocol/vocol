package core;
// Generated from Turtle.g4 by ANTLR 4.7.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class TurtleParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.7.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		T__9=10, T__10=11, T__11=12, T__12=13, T__13=14, T__14=15, T__15=16, T__16=17, 
		T__17=18, T__18=19, T__19=20, T__20=21, T__21=22, T__22=23, T__23=24, 
		T__24=25, T__25=26, KW_BASE=27, KW_PREFIX=28, NumericLiteral=29, BooleanLiteral=30, 
		BadLiteral=31, String=32, BlankNode=33, CHARS=34, WS=35, COMMENT=36, PN_PREFIX=37, 
		IRIREF=38, PNAME_NS=39, PrefixedName=40, PNAME_LN=41, BAD_PNAME_LN_STARTS_WITH_DOT=42, 
		BAD_PNAME_LN_ENDS_WITH_DOT=43, BLANK_NODE_LABEL=44, LANGTAG=45, BAD_LANGTAG_AS_NUMBER=46, 
		INTEGER=47, DECIMAL=48, DOUBLE=49, EXPONENT=50, STRING_LITERAL_LONG_SINGLE_QUOTE=51, 
		STRING_LITERAL_LONG_QUOTE=52, STRING_LITERAL_QUOTE=53, STRING_LITERAL_SINGLE_QUOTE=54, 
		BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR=55, BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR=56, 
		BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR=57, BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR=58, 
		BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE=59, BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE=60, 
		BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE=61, BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE=62, 
		BAD_UCHAR=63, ECHAR=64, ANON_WS=65, ANON=66, PN_CHARS_BASE=67, PN_CHARS_U=68, 
		PN_CHARS=69, PN_LOCAL=70, BAD_PN_LOCAL_STARTS_WITH_PERCENT=71, PLX=72, 
		PERCENT=73, HEX=74, NONHEX=75, PN_LOCAL_ESC=76, BAD_IRIREF_WITH_SPACE=77, 
		BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS=78, BAD_IRIREF_WITH_PARENTHESES=79, 
		BAD_STRING_LITERAL_SINGLE_QUOTE=80, BAD_STRING_LITERAL_QUOTE=81, BAD_STRING_LITERAL_LONG_SINGLE_QUOTE=82, 
		BAD_STRING_LITERAL_LONG_QUOTE=83, BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY=84, 
		BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY=85, ILLEGAL_ESCAPE=86;
	public static final int
		RULE_start = 0, RULE_statement = 1, RULE_directive = 2, RULE_errors = 3, 
		RULE_graphLabel = 4, RULE_unkonwnDecl = 5, RULE_prefixID = 6, RULE_base = 7, 
		RULE_sparqlBase = 8, RULE_sparqlPrefix = 9, RULE_triples = 10, RULE_predicateObjectList = 11, 
		RULE_objectList = 12, RULE_verb = 13, RULE_subject = 14, RULE_predicate = 15, 
		RULE_object = 16, RULE_literal = 17, RULE_blankNodePropertyList = 18, 
		RULE_badBlankNodePropertyList = 19, RULE_collection = 20, RULE_rdfLiteral = 21, 
		RULE_iri = 22;
	public static final String[] ruleNames = {
		"start", "statement", "directive", "errors", "graphLabel", "unkonwnDecl", 
		"prefixID", "base", "sparqlBase", "sparqlPrefix", "triples", "predicateObjectList", 
		"objectList", "verb", "subject", "predicate", "object", "literal", "blankNodePropertyList", 
		"badBlankNodePropertyList", "collection", "rdfLiteral", "iri"
	};

	private static final String[] _LITERAL_NAMES = {
		null, "'.'", "','", "';'", "'='", "'<='", "'=>'", "'@forAll'", "'@forSome'", 
		"'a'", "'@a'", "'@keywords'", "'@prefix'", "':'", "'@base'", "'@BASE'", 
		"'is'", "'of'", "'A'", "'{'", "'}'", "'['", "']'", "'('", "')'", "'^^'", 
		"'^'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, null, null, null, null, null, null, null, null, null, null, null, 
		null, null, null, null, null, null, null, null, null, null, null, null, 
		null, null, null, "KW_BASE", "KW_PREFIX", "NumericLiteral", "BooleanLiteral", 
		"BadLiteral", "String", "BlankNode", "CHARS", "WS", "COMMENT", "PN_PREFIX", 
		"IRIREF", "PNAME_NS", "PrefixedName", "PNAME_LN", "BAD_PNAME_LN_STARTS_WITH_DOT", 
		"BAD_PNAME_LN_ENDS_WITH_DOT", "BLANK_NODE_LABEL", "LANGTAG", "BAD_LANGTAG_AS_NUMBER", 
		"INTEGER", "DECIMAL", "DOUBLE", "EXPONENT", "STRING_LITERAL_LONG_SINGLE_QUOTE", 
		"STRING_LITERAL_LONG_QUOTE", "STRING_LITERAL_QUOTE", "STRING_LITERAL_SINGLE_QUOTE", 
		"BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR", "BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR", 
		"BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR", "BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR", 
		"BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE", "BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE", 
		"BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE", "BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE", 
		"BAD_UCHAR", "ECHAR", "ANON_WS", "ANON", "PN_CHARS_BASE", "PN_CHARS_U", 
		"PN_CHARS", "PN_LOCAL", "BAD_PN_LOCAL_STARTS_WITH_PERCENT", "PLX", "PERCENT", 
		"HEX", "NONHEX", "PN_LOCAL_ESC", "BAD_IRIREF_WITH_SPACE", "BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS", 
		"BAD_IRIREF_WITH_PARENTHESES", "BAD_STRING_LITERAL_SINGLE_QUOTE", "BAD_STRING_LITERAL_QUOTE", 
		"BAD_STRING_LITERAL_LONG_SINGLE_QUOTE", "BAD_STRING_LITERAL_LONG_QUOTE", 
		"BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY", "BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY", 
		"ILLEGAL_ESCAPE"
	};
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "Turtle.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	 // add members to check Namespace declaration
	public List<String> symbols = new ArrayList<String>();
	boolean isExistNS(String in ) { // custom constructor
		boolean foundNS = false ; 
		for(String s : symbols ){
			if(s.contains(in.split(":")[0])){
				foundNS = true; 
				break;
			}
		}
		return foundNS;
	}

	public TurtleParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}
	public static class StartContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(TurtleParser.EOF, 0); }
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public StartContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_start; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterStart(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitStart(this);
		}
	}

	public final StartContext start() throws RecognitionException {
		StartContext _localctx = new StartContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_start);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(49);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__6) | (1L << T__7) | (1L << T__8) | (1L << T__9) | (1L << T__10) | (1L << T__11) | (1L << T__13) | (1L << T__14) | (1L << T__18) | (1L << T__20) | (1L << T__22) | (1L << KW_BASE) | (1L << KW_PREFIX) | (1L << NumericLiteral) | (1L << BooleanLiteral) | (1L << String) | (1L << BlankNode) | (1L << CHARS) | (1L << IRIREF) | (1L << PNAME_NS) | (1L << PrefixedName) | (1L << BAD_PNAME_LN_STARTS_WITH_DOT) | (1L << BAD_PNAME_LN_ENDS_WITH_DOT) | (1L << BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE))) != 0) || ((((_la - 77)) & ~0x3f) == 0 && ((1L << (_la - 77)) & ((1L << (BAD_IRIREF_WITH_SPACE - 77)) | (1L << (BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS - 77)) | (1L << (BAD_IRIREF_WITH_PARENTHESES - 77)) | (1L << (BAD_STRING_LITERAL_SINGLE_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_LONG_SINGLE_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_LONG_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY - 77)) | (1L << (BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY - 77)))) != 0)) {
				{
				{
				setState(46);
				statement();
				}
				}
				setState(51);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(52);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class StatementContext extends ParserRuleContext {
		public DirectiveContext directive() {
			return getRuleContext(DirectiveContext.class,0);
		}
		public TriplesContext triples() {
			return getRuleContext(TriplesContext.class,0);
		}
		public ErrorsContext errors() {
			return getRuleContext(ErrorsContext.class,0);
		}
		public StatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_statement; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterStatement(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitStatement(this);
		}
	}

	public final StatementContext statement() throws RecognitionException {
		StatementContext _localctx = new StatementContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_statement);
		int _la;
		try {
			int _alt;
			setState(83);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(54);
				directive();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(55);
				triples();
				setState(56);
				match(T__0);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(58);
				triples();
				setState(59);
				match(T__1);
				notifyErrorListeners("Bad end of a triple with ','");
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(62);
				triples();
				setState(63);
				match(T__2);
				notifyErrorListeners("Bad end of a triple with ';'");
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(66);
				triples();
				notifyErrorListeners("Missing '.' at the end of a triple");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(69);
				triples();
				setState(71); 
				_errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						setState(70);
						match(T__0);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(73); 
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,1,_ctx);
				} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
				setState(76); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(75);
					match(T__0);
					}
					}
					setState(78); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==T__0 );
				notifyErrorListeners("Too many DOT");
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(82);
				errors();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DirectiveContext extends ParserRuleContext {
		public SparqlPrefixContext sparqlPrefix() {
			return getRuleContext(SparqlPrefixContext.class,0);
		}
		public SparqlBaseContext sparqlBase() {
			return getRuleContext(SparqlBaseContext.class,0);
		}
		public PrefixIDContext prefixID() {
			return getRuleContext(PrefixIDContext.class,0);
		}
		public BaseContext base() {
			return getRuleContext(BaseContext.class,0);
		}
		public UnkonwnDeclContext unkonwnDecl() {
			return getRuleContext(UnkonwnDeclContext.class,0);
		}
		public DirectiveContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_directive; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterDirective(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitDirective(this);
		}
	}

	public final DirectiveContext directive() throws RecognitionException {
		DirectiveContext _localctx = new DirectiveContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_directive);
		try {
			setState(98);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(85);
				sparqlPrefix();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(86);
				sparqlBase();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(87);
				prefixID();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(88);
				base();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(89);
				unkonwnDecl();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(90);
				sparqlPrefix();
				setState(91);
				match(T__0);
				notifyErrorListeners("Extraneous '.' at the end of SPARQL prefix directive");
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(94);
				sparqlBase();
				setState(95);
				match(T__0);
				notifyErrorListeners("Extraneous '.' at the end of SPARQL base directive");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ErrorsContext extends ParserRuleContext {
		public List<IriContext> iri() {
			return getRuleContexts(IriContext.class);
		}
		public IriContext iri(int i) {
			return getRuleContext(IriContext.class,i);
		}
		public TriplesContext triples() {
			return getRuleContext(TriplesContext.class,0);
		}
		public List<TerminalNode> CHARS() { return getTokens(TurtleParser.CHARS); }
		public TerminalNode CHARS(int i) {
			return getToken(TurtleParser.CHARS, i);
		}
		public ErrorsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_errors; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterErrors(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitErrors(this);
		}
	}

	public final ErrorsContext errors() throws RecognitionException {
		ErrorsContext _localctx = new ErrorsContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_errors);
		int _la;
		try {
			int _alt;
			setState(178);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,11,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(100);
				iri();
				setState(101);
				match(T__3);
				setState(102);
				iri();
				setState(103);
				match(T__0);
				notifyErrorListeners("'=' sign cannot be used in Turtle");
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(106);
				iri();
				setState(107);
				match(T__4);
				setState(108);
				iri();
				setState(109);
				match(T__0);
				notifyErrorListeners("'<=' symbol cannot be used in Turtle");
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(112);
				iri();
				setState(113);
				match(T__5);
				setState(114);
				iri();
				setState(115);
				match(T__0);
				notifyErrorListeners("'=>' symbol cannot be used in Turtle");
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(121); 
				_errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						setState(118);
						iri();
						setState(119);
						match(T__0);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(123); 
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,5,_ctx);
				} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
				setState(128); 
				_errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						setState(125);
						iri();
						setState(126);
						match(T__0);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(130); 
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,6,_ctx);
				} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
				setState(132);
				triples();
				setState(133);
				match(T__0);
				notifyErrorListeners("N3 paths cannot be used in Turtle");
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(139); 
				_errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						setState(136);
						iri();
						setState(137);
						match(T__0);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(141); 
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,7,_ctx);
				} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
				setState(146); 
				_errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						setState(143);
						iri();
						setState(144);
						match(T__0);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(148); 
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
				} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
				setState(150);
				triples();
				notifyErrorListeners("N3 paths cannot be used in Turtle");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(153);
				match(T__6);
				setState(154);
				iri();
				setState(155);
				match(T__0);
				notifyErrorListeners(" '@forAll' cannot be used in Turtle ");
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(158);
				match(T__7);
				setState(159);
				iri();
				setState(160);
				match(T__0);
				notifyErrorListeners(" '@forSome' cannot be used in Turtle ");
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(166);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__8 || _la==CHARS) {
					{
					{
					setState(163);
					_la = _input.LA(1);
					if ( !(_la==T__8 || _la==CHARS) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					}
					setState(168);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(169);
				match(T__9);
				setState(173);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__8 || _la==CHARS) {
					{
					{
					setState(170);
					_la = _input.LA(1);
					if ( !(_la==T__8 || _la==CHARS) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					}
					setState(175);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(176);
				match(T__0);
				notifyErrorListeners(" '@a' cannot be used in Turtle ");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class GraphLabelContext extends ParserRuleContext {
		public TerminalNode IRIREF() { return getToken(TurtleParser.IRIREF, 0); }
		public TerminalNode BLANK_NODE_LABEL() { return getToken(TurtleParser.BLANK_NODE_LABEL, 0); }
		public GraphLabelContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_graphLabel; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterGraphLabel(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitGraphLabel(this);
		}
	}

	public final GraphLabelContext graphLabel() throws RecognitionException {
		GraphLabelContext _localctx = new GraphLabelContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_graphLabel);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(180);
			_la = _input.LA(1);
			if ( !(_la==IRIREF || _la==BLANK_NODE_LABEL) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class UnkonwnDeclContext extends ParserRuleContext {
		public List<TerminalNode> CHARS() { return getTokens(TurtleParser.CHARS); }
		public TerminalNode CHARS(int i) {
			return getToken(TurtleParser.CHARS, i);
		}
		public UnkonwnDeclContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_unkonwnDecl; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterUnkonwnDecl(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitUnkonwnDecl(this);
		}
	}

	public final UnkonwnDeclContext unkonwnDecl() throws RecognitionException {
		UnkonwnDeclContext _localctx = new UnkonwnDeclContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_unkonwnDecl);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(182);
			match(T__10);
			setState(186);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__8 || _la==CHARS) {
				{
				{
				setState(183);
				_la = _input.LA(1);
				if ( !(_la==T__8 || _la==CHARS) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(188);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(189);
			match(T__0);
			notifyErrorListeners("@keywords is unkown directive in Turtle");
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PrefixIDContext extends ParserRuleContext {
		public Token PNAME_NS;
		public List<TerminalNode> CHARS() { return getTokens(TurtleParser.CHARS); }
		public TerminalNode CHARS(int i) {
			return getToken(TurtleParser.CHARS, i);
		}
		public TerminalNode IRIREF() { return getToken(TurtleParser.IRIREF, 0); }
		public TerminalNode PNAME_NS() { return getToken(TurtleParser.PNAME_NS, 0); }
		public PrefixIDContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_prefixID; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterPrefixID(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitPrefixID(this);
		}
	}

	public final PrefixIDContext prefixID() throws RecognitionException {
		PrefixIDContext _localctx = new PrefixIDContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_prefixID);
		int _la;
		try {
			int _alt;
			setState(247);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,16,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(192);
				match(T__11);
				setState(193);
				match(CHARS);
				setState(194);
				match(T__0);
				setState(195);
				match(T__12);
				setState(196);
				match(IRIREF);
				setState(197);
				match(T__0);
				notifyErrorListeners("Prefix Namespace cannot end with '.' ");
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(199);
				match(T__11);
				setState(200);
				match(T__0);
				setState(201);
				match(CHARS);
				setState(202);
				match(T__12);
				setState(203);
				match(IRIREF);
				setState(204);
				match(T__0);
				notifyErrorListeners("Prefix Namespace cannot start with '.' ");
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(206);
				match(T__11);
				setState(207);
				match(T__12);
				setState(208);
				match(IRIREF);
				setState(209);
				match(T__0);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(210);
				match(T__11);
				setState(211);
				((PrefixIDContext)_localctx).PNAME_NS = match(PNAME_NS);
				setState(212);
				match(IRIREF);
				setState(213);
				match(T__0);
				symbols.add((((PrefixIDContext)_localctx).PNAME_NS!=null?((PrefixIDContext)_localctx).PNAME_NS.getText():null));
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(215);
				match(T__11);
				setState(216);
				match(PNAME_NS);
				setState(217);
				match(IRIREF);
				setState(219); 
				_errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						setState(218);
						match(T__0);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(221); 
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,13,_ctx);
				} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
				setState(224); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(223);
					match(T__0);
					}
					}
					setState(226); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==T__0 );
				notifyErrorListeners("Too many DOT ");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(229);
				match(PNAME_NS);
				setState(230);
				match(IRIREF);
				setState(231);
				match(T__0);
				notifyErrorListeners("Missing Prefix keyword, use '@prefix'");
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(233);
				match(T__11);
				setState(234);
				match(IRIREF);
				setState(235);
				match(T__0);
				notifyErrorListeners("Missing NameSpace in Prefix directive");
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(237);
				match(T__11);
				setState(241);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==CHARS) {
					{
					{
					setState(238);
					match(CHARS);
					}
					}
					setState(243);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(244);
				match(IRIREF);
				setState(245);
				match(T__0);
				notifyErrorListeners("Missing ':' in Prefix directive");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BaseContext extends ParserRuleContext {
		public TerminalNode IRIREF() { return getToken(TurtleParser.IRIREF, 0); }
		public BaseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_base; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterBase(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitBase(this);
		}
	}

	public final BaseContext base() throws RecognitionException {
		BaseContext _localctx = new BaseContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_base);
		int _la;
		try {
			int _alt;
			setState(265);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,19,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(249);
				match(T__13);
				setState(250);
				match(IRIREF);
				setState(251);
				match(T__0);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(252);
				match(T__13);
				setState(253);
				match(IRIREF);
				setState(255); 
				_errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						setState(254);
						match(T__0);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(257); 
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,17,_ctx);
				} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
				setState(260); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(259);
					match(T__0);
					}
					}
					setState(262); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==T__0 );
				notifyErrorListeners("Too many DOT ");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SparqlBaseContext extends ParserRuleContext {
		public TerminalNode KW_BASE() { return getToken(TurtleParser.KW_BASE, 0); }
		public TerminalNode IRIREF() { return getToken(TurtleParser.IRIREF, 0); }
		public SparqlBaseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sparqlBase; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterSparqlBase(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitSparqlBase(this);
		}
	}

	public final SparqlBaseContext sparqlBase() throws RecognitionException {
		SparqlBaseContext _localctx = new SparqlBaseContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_sparqlBase);
		try {
			setState(273);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case KW_BASE:
				enterOuterAlt(_localctx, 1);
				{
				setState(267);
				match(KW_BASE);
				setState(268);
				match(IRIREF);
				}
				break;
			case T__14:
				enterOuterAlt(_localctx, 2);
				{
				setState(269);
				match(T__14);
				setState(270);
				match(IRIREF);
				setState(271);
				match(T__0);
				notifyErrorListeners("incorrect syntax form of base directive");
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SparqlPrefixContext extends ParserRuleContext {
		public TerminalNode KW_PREFIX() { return getToken(TurtleParser.KW_PREFIX, 0); }
		public TerminalNode CHARS() { return getToken(TurtleParser.CHARS, 0); }
		public TerminalNode IRIREF() { return getToken(TurtleParser.IRIREF, 0); }
		public TerminalNode PNAME_NS() { return getToken(TurtleParser.PNAME_NS, 0); }
		public SparqlPrefixContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sparqlPrefix; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterSparqlPrefix(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitSparqlPrefix(this);
		}
	}

	public final SparqlPrefixContext sparqlPrefix() throws RecognitionException {
		SparqlPrefixContext _localctx = new SparqlPrefixContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_sparqlPrefix);
		try {
			setState(299);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,21,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(275);
				match(KW_PREFIX);
				setState(276);
				match(CHARS);
				setState(277);
				match(T__0);
				setState(278);
				match(T__12);
				setState(279);
				match(IRIREF);
				notifyErrorListeners("Prefix Namespace cannot end with '.' ");
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(281);
				match(KW_PREFIX);
				setState(282);
				match(T__0);
				setState(283);
				match(CHARS);
				setState(284);
				match(T__12);
				setState(285);
				match(IRIREF);
				notifyErrorListeners("Prefix Namespace cannot start with '.' ");
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(287);
				match(KW_PREFIX);
				setState(288);
				match(PNAME_NS);
				setState(289);
				match(IRIREF);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(290);
				match(KW_PREFIX);
				setState(291);
				match(T__12);
				setState(292);
				match(IRIREF);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(293);
				match(PNAME_NS);
				setState(294);
				match(IRIREF);
				notifyErrorListeners("Missing Prefix keyword, use 'PREFIX'");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(296);
				match(KW_PREFIX);
				setState(297);
				match(IRIREF);
				notifyErrorListeners("Missing NameSpace in Prefix directive");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TriplesContext extends ParserRuleContext {
		public SubjectContext subject() {
			return getRuleContext(SubjectContext.class,0);
		}
		public PredicateObjectListContext predicateObjectList() {
			return getRuleContext(PredicateObjectListContext.class,0);
		}
		public BlankNodePropertyListContext blankNodePropertyList() {
			return getRuleContext(BlankNodePropertyListContext.class,0);
		}
		public ObjectContext object() {
			return getRuleContext(ObjectContext.class,0);
		}
		public VerbContext verb() {
			return getRuleContext(VerbContext.class,0);
		}
		public TriplesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_triples; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterTriples(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitTriples(this);
		}
	}

	public final TriplesContext triples() throws RecognitionException {
		TriplesContext _localctx = new TriplesContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_triples);
		try {
			setState(316);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,23,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(301);
				subject();
				setState(302);
				predicateObjectList();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(304);
				blankNodePropertyList();
				setState(306);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,22,_ctx) ) {
				case 1:
					{
					setState(305);
					predicateObjectList();
					}
					break;
				}
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(308);
				subject();
				setState(309);
				match(T__12);
				setState(310);
				object();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(312);
				subject();
				setState(313);
				verb();
				notifyErrorListeners("Object of a triple is missing");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PredicateObjectListContext extends ParserRuleContext {
		public List<VerbContext> verb() {
			return getRuleContexts(VerbContext.class);
		}
		public VerbContext verb(int i) {
			return getRuleContext(VerbContext.class,i);
		}
		public List<ObjectListContext> objectList() {
			return getRuleContexts(ObjectListContext.class);
		}
		public ObjectListContext objectList(int i) {
			return getRuleContext(ObjectListContext.class,i);
		}
		public PredicateObjectListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_predicateObjectList; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterPredicateObjectList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitPredicateObjectList(this);
		}
	}

	public final PredicateObjectListContext predicateObjectList() throws RecognitionException {
		PredicateObjectListContext _localctx = new PredicateObjectListContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_predicateObjectList);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(318);
			verb();
			setState(319);
			objectList();
			setState(328);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,25,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(320);
					match(T__2);
					setState(324);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,24,_ctx) ) {
					case 1:
						{
						setState(321);
						verb();
						setState(322);
						objectList();
						}
						break;
					}
					}
					} 
				}
				setState(330);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,25,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ObjectListContext extends ParserRuleContext {
		public List<ObjectContext> object() {
			return getRuleContexts(ObjectContext.class);
		}
		public ObjectContext object(int i) {
			return getRuleContext(ObjectContext.class,i);
		}
		public ObjectListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectList; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterObjectList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitObjectList(this);
		}
	}

	public final ObjectListContext objectList() throws RecognitionException {
		ObjectListContext _localctx = new ObjectListContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_objectList);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(331);
			object();
			setState(336);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,26,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(332);
					match(T__1);
					setState(333);
					object();
					}
					} 
				}
				setState(338);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,26,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class VerbContext extends ParserRuleContext {
		public PredicateContext predicate() {
			return getRuleContext(PredicateContext.class,0);
		}
		public TerminalNode BooleanLiteral() { return getToken(TurtleParser.BooleanLiteral, 0); }
		public TerminalNode NumericLiteral() { return getToken(TurtleParser.NumericLiteral, 0); }
		public LiteralContext literal() {
			return getRuleContext(LiteralContext.class,0);
		}
		public TerminalNode BlankNode() { return getToken(TurtleParser.BlankNode, 0); }
		public VerbContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_verb; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterVerb(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitVerb(this);
		}
	}

	public final VerbContext verb() throws RecognitionException {
		VerbContext _localctx = new VerbContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_verb);
		try {
			setState(357);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,27,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(339);
				predicate();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(340);
				match(T__15);
				setState(341);
				predicate();
				setState(342);
				match(T__16);
				notifyErrorListeners("'is .. of' pattern is not used in Turtle");
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(345);
				match(T__8);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(346);
				match(T__17);
				notifyErrorListeners("'A' cannot be used as predicate, it should be repalced with 'a'");
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(348);
				match(BooleanLiteral);
				notifyErrorListeners("Predicate cannot be a boolean value");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(350);
				match(NumericLiteral);
				notifyErrorListeners("Predicate cannot be a number");
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(352);
				literal();
				notifyErrorListeners("Predicate cannot be a literal");
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(355);
				match(BlankNode);
				notifyErrorListeners("Predicate cannot be a blank node");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SubjectContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public TerminalNode BlankNode() { return getToken(TurtleParser.BlankNode, 0); }
		public TerminalNode BooleanLiteral() { return getToken(TurtleParser.BooleanLiteral, 0); }
		public TerminalNode NumericLiteral() { return getToken(TurtleParser.NumericLiteral, 0); }
		public RdfLiteralContext rdfLiteral() {
			return getRuleContext(RdfLiteralContext.class,0);
		}
		public CollectionContext collection() {
			return getRuleContext(CollectionContext.class,0);
		}
		public TriplesContext triples() {
			return getRuleContext(TriplesContext.class,0);
		}
		public SubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subject; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterSubject(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitSubject(this);
		}
	}

	public final SubjectContext subject() throws RecognitionException {
		SubjectContext _localctx = new SubjectContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_subject);
		try {
			setState(385);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,28,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(359);
				iri();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(360);
				match(BlankNode);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(361);
				match(BlankNode);
				setState(362);
				match(T__0);
				notifyErrorListeners("Blank Node cannot be followed by '.'");
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(364);
				match(T__8);
				notifyErrorListeners("'a' cannot be used as a subject");
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(366);
				match(BooleanLiteral);
				notifyErrorListeners("Subject cannot be a boolean value");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(368);
				match(NumericLiteral);
				notifyErrorListeners("Subject cannot be a number");
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(370);
				rdfLiteral();
				notifyErrorListeners("Subject cannot be a string");
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(373);
				collection();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(374);
				match(T__18);
				setState(375);
				triples();
				setState(376);
				match(T__0);
				setState(377);
				match(T__19);
				notifyErrorListeners("{ } pattern cannot be used in Turtle");
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(380);
				match(T__18);
				setState(381);
				triples();
				setState(382);
				match(T__19);
				notifyErrorListeners("{ } pattern cannot be used in Turtle");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PredicateContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public PredicateContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_predicate; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterPredicate(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitPredicate(this);
		}
	}

	public final PredicateContext predicate() throws RecognitionException {
		PredicateContext _localctx = new PredicateContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_predicate);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(387);
			iri();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ObjectContext extends ParserRuleContext {
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public TerminalNode BlankNode() { return getToken(TurtleParser.BlankNode, 0); }
		public CollectionContext collection() {
			return getRuleContext(CollectionContext.class,0);
		}
		public BlankNodePropertyListContext blankNodePropertyList() {
			return getRuleContext(BlankNodePropertyListContext.class,0);
		}
		public BadBlankNodePropertyListContext badBlankNodePropertyList() {
			return getRuleContext(BadBlankNodePropertyListContext.class,0);
		}
		public LiteralContext literal() {
			return getRuleContext(LiteralContext.class,0);
		}
		public ObjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_object; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterObject(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitObject(this);
		}
	}

	public final ObjectContext object() throws RecognitionException {
		ObjectContext _localctx = new ObjectContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_object);
		try {
			setState(399);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,29,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(389);
				iri();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(390);
				match(BlankNode);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(391);
				collection();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(392);
				blankNodePropertyList();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(393);
				badBlankNodePropertyList();
				notifyErrorListeners("incorrect form of a blank node list");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(396);
				literal();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(397);
				match(T__8);
				notifyErrorListeners("'a' cannot be used as an object");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LiteralContext extends ParserRuleContext {
		public RdfLiteralContext rdfLiteral() {
			return getRuleContext(RdfLiteralContext.class,0);
		}
		public TerminalNode NumericLiteral() { return getToken(TurtleParser.NumericLiteral, 0); }
		public TerminalNode BooleanLiteral() { return getToken(TurtleParser.BooleanLiteral, 0); }
		public TerminalNode BadLiteral() { return getToken(TurtleParser.BadLiteral, 0); }
		public LiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_literal; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterLiteral(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitLiteral(this);
		}
	}

	public final LiteralContext literal() throws RecognitionException {
		LiteralContext _localctx = new LiteralContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_literal);
		try {
			setState(406);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case String:
			case BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR:
			case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR:
			case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR:
			case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR:
			case BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE:
			case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE:
			case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE:
			case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE:
			case BAD_STRING_LITERAL_SINGLE_QUOTE:
			case BAD_STRING_LITERAL_QUOTE:
			case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE:
			case BAD_STRING_LITERAL_LONG_QUOTE:
			case BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY:
			case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY:
				enterOuterAlt(_localctx, 1);
				{
				setState(401);
				rdfLiteral();
				}
				break;
			case NumericLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(402);
				match(NumericLiteral);
				}
				break;
			case BooleanLiteral:
				enterOuterAlt(_localctx, 3);
				{
				setState(403);
				match(BooleanLiteral);
				}
				break;
			case BadLiteral:
				enterOuterAlt(_localctx, 4);
				{
				setState(404);
				match(BadLiteral);
				notifyErrorListeners("incorrect form of a Literal");
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BlankNodePropertyListContext extends ParserRuleContext {
		public PredicateObjectListContext predicateObjectList() {
			return getRuleContext(PredicateObjectListContext.class,0);
		}
		public BlankNodePropertyListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_blankNodePropertyList; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterBlankNodePropertyList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitBlankNodePropertyList(this);
		}
	}

	public final BlankNodePropertyListContext blankNodePropertyList() throws RecognitionException {
		BlankNodePropertyListContext _localctx = new BlankNodePropertyListContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_blankNodePropertyList);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(408);
			match(T__20);
			setState(409);
			predicateObjectList();
			setState(410);
			match(T__21);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BadBlankNodePropertyListContext extends ParserRuleContext {
		public PredicateObjectListContext predicateObjectList() {
			return getRuleContext(PredicateObjectListContext.class,0);
		}
		public BadBlankNodePropertyListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_badBlankNodePropertyList; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterBadBlankNodePropertyList(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitBadBlankNodePropertyList(this);
		}
	}

	public final BadBlankNodePropertyListContext badBlankNodePropertyList() throws RecognitionException {
		BadBlankNodePropertyListContext _localctx = new BadBlankNodePropertyListContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_badBlankNodePropertyList);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(412);
			match(T__20);
			setState(413);
			predicateObjectList();
			setState(414);
			match(T__0);
			setState(415);
			match(T__21);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CollectionContext extends ParserRuleContext {
		public List<ObjectContext> object() {
			return getRuleContexts(ObjectContext.class);
		}
		public ObjectContext object(int i) {
			return getRuleContext(ObjectContext.class,i);
		}
		public CollectionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_collection; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterCollection(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitCollection(this);
		}
	}

	public final CollectionContext collection() throws RecognitionException {
		CollectionContext _localctx = new CollectionContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_collection);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(417);
			match(T__22);
			setState(421);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__8) | (1L << T__20) | (1L << T__22) | (1L << NumericLiteral) | (1L << BooleanLiteral) | (1L << BadLiteral) | (1L << String) | (1L << BlankNode) | (1L << IRIREF) | (1L << PNAME_NS) | (1L << PrefixedName) | (1L << BAD_PNAME_LN_STARTS_WITH_DOT) | (1L << BAD_PNAME_LN_ENDS_WITH_DOT) | (1L << BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE))) != 0) || ((((_la - 77)) & ~0x3f) == 0 && ((1L << (_la - 77)) & ((1L << (BAD_IRIREF_WITH_SPACE - 77)) | (1L << (BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS - 77)) | (1L << (BAD_IRIREF_WITH_PARENTHESES - 77)) | (1L << (BAD_STRING_LITERAL_SINGLE_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_LONG_SINGLE_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_LONG_QUOTE - 77)) | (1L << (BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY - 77)) | (1L << (BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY - 77)))) != 0)) {
				{
				{
				setState(418);
				object();
				}
				}
				setState(423);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(424);
			match(T__23);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RdfLiteralContext extends ParserRuleContext {
		public TerminalNode BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY, 0); }
		public TerminalNode LANGTAG() { return getToken(TurtleParser.LANGTAG, 0); }
		public IriContext iri() {
			return getRuleContext(IriContext.class,0);
		}
		public TerminalNode BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY, 0); }
		public TerminalNode String() { return getToken(TurtleParser.String, 0); }
		public TerminalNode BAD_LANGTAG_AS_NUMBER() { return getToken(TurtleParser.BAD_LANGTAG_AS_NUMBER, 0); }
		public TerminalNode BAD_STRING_LITERAL_LONG_SINGLE_QUOTE() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_SINGLE_QUOTE, 0); }
		public TerminalNode BAD_STRING_LITERAL_LONG_QUOTE() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_QUOTE, 0); }
		public TerminalNode BAD_STRING_LITERAL_SINGLE_QUOTE() { return getToken(TurtleParser.BAD_STRING_LITERAL_SINGLE_QUOTE, 0); }
		public TerminalNode BAD_STRING_LITERAL_QUOTE() { return getToken(TurtleParser.BAD_STRING_LITERAL_QUOTE, 0); }
		public TerminalNode BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR() { return getToken(TurtleParser.BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR, 0); }
		public TerminalNode BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR() { return getToken(TurtleParser.BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR, 0); }
		public TerminalNode BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR, 0); }
		public TerminalNode BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR, 0); }
		public TerminalNode BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE() { return getToken(TurtleParser.BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE, 0); }
		public TerminalNode BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE() { return getToken(TurtleParser.BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE, 0); }
		public TerminalNode BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE, 0); }
		public TerminalNode BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE() { return getToken(TurtleParser.BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE, 0); }
		public RdfLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_rdfLiteral; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterRdfLiteral(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitRdfLiteral(this);
		}
	}

	public final RdfLiteralContext rdfLiteral() throws RecognitionException {
		RdfLiteralContext _localctx = new RdfLiteralContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_rdfLiteral);
		int _la;
		try {
			setState(491);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,38,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(426);
				match(BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY);
				setState(430);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case LANGTAG:
					{
					setState(427);
					match(LANGTAG);
					}
					break;
				case T__24:
					{
					setState(428);
					match(T__24);
					setState(429);
					iri();
					}
					break;
				case EOF:
				case T__0:
				case T__1:
				case T__2:
				case T__6:
				case T__7:
				case T__8:
				case T__9:
				case T__10:
				case T__11:
				case T__12:
				case T__13:
				case T__14:
				case T__15:
				case T__17:
				case T__18:
				case T__19:
				case T__20:
				case T__21:
				case T__22:
				case T__23:
				case KW_BASE:
				case KW_PREFIX:
				case NumericLiteral:
				case BooleanLiteral:
				case BadLiteral:
				case String:
				case BlankNode:
				case CHARS:
				case IRIREF:
				case PNAME_NS:
				case PrefixedName:
				case BAD_PNAME_LN_STARTS_WITH_DOT:
				case BAD_PNAME_LN_ENDS_WITH_DOT:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE:
				case BAD_IRIREF_WITH_SPACE:
				case BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS:
				case BAD_IRIREF_WITH_PARENTHESES:
				case BAD_STRING_LITERAL_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_QUOTE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY:
					break;
				default:
					break;
				}
				notifyErrorListeners("incorrect form of long literal with 4 qoutes");
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(433);
				match(BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY);
				setState(437);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case LANGTAG:
					{
					setState(434);
					match(LANGTAG);
					}
					break;
				case T__24:
					{
					setState(435);
					match(T__24);
					setState(436);
					iri();
					}
					break;
				case EOF:
				case T__0:
				case T__1:
				case T__2:
				case T__6:
				case T__7:
				case T__8:
				case T__9:
				case T__10:
				case T__11:
				case T__12:
				case T__13:
				case T__14:
				case T__15:
				case T__17:
				case T__18:
				case T__19:
				case T__20:
				case T__21:
				case T__22:
				case T__23:
				case KW_BASE:
				case KW_PREFIX:
				case NumericLiteral:
				case BooleanLiteral:
				case BadLiteral:
				case String:
				case BlankNode:
				case CHARS:
				case IRIREF:
				case PNAME_NS:
				case PrefixedName:
				case BAD_PNAME_LN_STARTS_WITH_DOT:
				case BAD_PNAME_LN_ENDS_WITH_DOT:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE:
				case BAD_IRIREF_WITH_SPACE:
				case BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS:
				case BAD_IRIREF_WITH_PARENTHESES:
				case BAD_STRING_LITERAL_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_QUOTE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY:
					break;
				default:
					break;
				}
				notifyErrorListeners("incorrect form of long literal with 4 qoutes");
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(440);
				match(String);
				setState(444);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case LANGTAG:
					{
					setState(441);
					match(LANGTAG);
					}
					break;
				case T__24:
					{
					setState(442);
					match(T__24);
					setState(443);
					iri();
					}
					break;
				case EOF:
				case T__0:
				case T__1:
				case T__2:
				case T__6:
				case T__7:
				case T__8:
				case T__9:
				case T__10:
				case T__11:
				case T__12:
				case T__13:
				case T__14:
				case T__15:
				case T__17:
				case T__18:
				case T__19:
				case T__20:
				case T__21:
				case T__22:
				case T__23:
				case KW_BASE:
				case KW_PREFIX:
				case NumericLiteral:
				case BooleanLiteral:
				case BadLiteral:
				case String:
				case BlankNode:
				case CHARS:
				case IRIREF:
				case PNAME_NS:
				case PrefixedName:
				case BAD_PNAME_LN_STARTS_WITH_DOT:
				case BAD_PNAME_LN_ENDS_WITH_DOT:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE:
				case BAD_IRIREF_WITH_SPACE:
				case BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS:
				case BAD_IRIREF_WITH_PARENTHESES:
				case BAD_STRING_LITERAL_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_QUOTE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY:
					break;
				default:
					break;
				}
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(446);
				match(String);
				setState(447);
				match(BAD_LANGTAG_AS_NUMBER);
				notifyErrorListeners("Language tag cannot be a numeric value");
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(449);
				match(String);
				setState(450);
				match(T__25);
				setState(451);
				iri();
				notifyErrorListeners("Missing '^' Character");
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(454);
				match(String);
				setState(455);
				match(LANGTAG);
				setState(456);
				match(T__24);
				setState(457);
				iri();
				notifyErrorListeners("incorrect form of a Literal");
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(460);
				match(String);
				setState(461);
				match(T__24);
				setState(462);
				iri();
				setState(463);
				match(LANGTAG);
				notifyErrorListeners("incorrect form of a Literal");
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(466);
				_la = _input.LA(1);
				if ( !(_la==BAD_STRING_LITERAL_LONG_SINGLE_QUOTE || _la==BAD_STRING_LITERAL_LONG_QUOTE) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				setState(470);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case LANGTAG:
					{
					setState(467);
					match(LANGTAG);
					}
					break;
				case T__24:
					{
					setState(468);
					match(T__24);
					setState(469);
					iri();
					}
					break;
				case EOF:
				case T__0:
				case T__1:
				case T__2:
				case T__6:
				case T__7:
				case T__8:
				case T__9:
				case T__10:
				case T__11:
				case T__12:
				case T__13:
				case T__14:
				case T__15:
				case T__17:
				case T__18:
				case T__19:
				case T__20:
				case T__21:
				case T__22:
				case T__23:
				case KW_BASE:
				case KW_PREFIX:
				case NumericLiteral:
				case BooleanLiteral:
				case BadLiteral:
				case String:
				case BlankNode:
				case CHARS:
				case IRIREF:
				case PNAME_NS:
				case PrefixedName:
				case BAD_PNAME_LN_STARTS_WITH_DOT:
				case BAD_PNAME_LN_ENDS_WITH_DOT:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE:
				case BAD_IRIREF_WITH_SPACE:
				case BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS:
				case BAD_IRIREF_WITH_PARENTHESES:
				case BAD_STRING_LITERAL_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_QUOTE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY:
					break;
				default:
					break;
				}
				notifyErrorListeners("incorrect quotes of a literal");
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(473);
				match(BAD_STRING_LITERAL_SINGLE_QUOTE);
				setState(477);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case LANGTAG:
					{
					setState(474);
					match(LANGTAG);
					}
					break;
				case T__24:
					{
					setState(475);
					match(T__24);
					setState(476);
					iri();
					}
					break;
				case EOF:
				case T__0:
				case T__1:
				case T__2:
				case T__6:
				case T__7:
				case T__8:
				case T__9:
				case T__10:
				case T__11:
				case T__12:
				case T__13:
				case T__14:
				case T__15:
				case T__17:
				case T__18:
				case T__19:
				case T__20:
				case T__21:
				case T__22:
				case T__23:
				case KW_BASE:
				case KW_PREFIX:
				case NumericLiteral:
				case BooleanLiteral:
				case BadLiteral:
				case String:
				case BlankNode:
				case CHARS:
				case IRIREF:
				case PNAME_NS:
				case PrefixedName:
				case BAD_PNAME_LN_STARTS_WITH_DOT:
				case BAD_PNAME_LN_ENDS_WITH_DOT:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE:
				case BAD_IRIREF_WITH_SPACE:
				case BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS:
				case BAD_IRIREF_WITH_PARENTHESES:
				case BAD_STRING_LITERAL_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_QUOTE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY:
					break;
				default:
					break;
				}
				notifyErrorListeners("incorrect quotes of a literal");
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(480);
				match(BAD_STRING_LITERAL_QUOTE);
				setState(484);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case LANGTAG:
					{
					setState(481);
					match(LANGTAG);
					}
					break;
				case T__24:
					{
					setState(482);
					match(T__24);
					setState(483);
					iri();
					}
					break;
				case EOF:
				case T__0:
				case T__1:
				case T__2:
				case T__6:
				case T__7:
				case T__8:
				case T__9:
				case T__10:
				case T__11:
				case T__12:
				case T__13:
				case T__14:
				case T__15:
				case T__17:
				case T__18:
				case T__19:
				case T__20:
				case T__21:
				case T__22:
				case T__23:
				case KW_BASE:
				case KW_PREFIX:
				case NumericLiteral:
				case BooleanLiteral:
				case BadLiteral:
				case String:
				case BlankNode:
				case CHARS:
				case IRIREF:
				case PNAME_NS:
				case PrefixedName:
				case BAD_PNAME_LN_STARTS_WITH_DOT:
				case BAD_PNAME_LN_ENDS_WITH_DOT:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR:
				case BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE:
				case BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE:
				case BAD_IRIREF_WITH_SPACE:
				case BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS:
				case BAD_IRIREF_WITH_PARENTHESES:
				case BAD_STRING_LITERAL_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_QUOTE:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE:
				case BAD_STRING_LITERAL_LONG_QUOTE_TOO_MANY:
				case BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_TOO_MANY:
					break;
				default:
					break;
				}
				notifyErrorListeners("incorrect quotes of a literal");
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(487);
				_la = _input.LA(1);
				if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << BAD_STRING_LITERAL_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_UCHAR) | (1L << BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_UCHAR))) != 0)) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				notifyErrorListeners("Bad Unicode Characters, Only HEX Characters are allowed");
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(489);
				_la = _input.LA(1);
				if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << BAD_STRING_LITERAL_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_SINGLE_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_LONG_SINGLE_QUOTE_WITH_BAD_ESCAPE) | (1L << BAD_STRING_LITERAL_LONG_QUOTE_WITH_BAD_ESCAPE))) != 0)) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				notifyErrorListeners("Bad Literal Escape");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IriContext extends ParserRuleContext {
		public Token PrefixedName;
		public TerminalNode IRIREF() { return getToken(TurtleParser.IRIREF, 0); }
		public TerminalNode PrefixedName() { return getToken(TurtleParser.PrefixedName, 0); }
		public TerminalNode PNAME_NS() { return getToken(TurtleParser.PNAME_NS, 0); }
		public TerminalNode BAD_PN_LOCAL_STARTS_WITH_PERCENT() { return getToken(TurtleParser.BAD_PN_LOCAL_STARTS_WITH_PERCENT, 0); }
		public TerminalNode BAD_PNAME_LN_STARTS_WITH_DOT() { return getToken(TurtleParser.BAD_PNAME_LN_STARTS_WITH_DOT, 0); }
		public TerminalNode BAD_PNAME_LN_ENDS_WITH_DOT() { return getToken(TurtleParser.BAD_PNAME_LN_ENDS_WITH_DOT, 0); }
		public TerminalNode BAD_IRIREF_WITH_SPACE() { return getToken(TurtleParser.BAD_IRIREF_WITH_SPACE, 0); }
		public TerminalNode BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS() { return getToken(TurtleParser.BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS, 0); }
		public TerminalNode BAD_IRIREF_WITH_PARENTHESES() { return getToken(TurtleParser.BAD_IRIREF_WITH_PARENTHESES, 0); }
		public IriContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_iri; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).enterIri(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof TurtleListener ) ((TurtleListener)listener).exitIri(this);
		}
	}

	public final IriContext iri() throws RecognitionException {
		IriContext _localctx = new IriContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_iri);
		try {
			setState(509);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case IRIREF:
				enterOuterAlt(_localctx, 1);
				{
				setState(493);
				match(IRIREF);
				}
				break;
			case PrefixedName:
				enterOuterAlt(_localctx, 2);
				{
				setState(494);
				((IriContext)_localctx).PrefixedName = match(PrefixedName);
				 if(!isExistNS((((IriContext)_localctx).PrefixedName!=null?((IriContext)_localctx).PrefixedName.getText():null)))notifyErrorListeners((((IriContext)_localctx).PrefixedName!=null?((IriContext)_localctx).PrefixedName.getText():null).split(":")[0] +" prefix is undefined ");
				}
				break;
			case PNAME_NS:
				enterOuterAlt(_localctx, 3);
				{
				setState(496);
				match(PNAME_NS);
				setState(497);
				match(BAD_PN_LOCAL_STARTS_WITH_PERCENT);
				notifyErrorListeners("Bad syntax of Prefixed IRI, the local prefix namespace cannot contain '%'");
				}
				break;
			case BAD_PNAME_LN_STARTS_WITH_DOT:
				enterOuterAlt(_localctx, 4);
				{
				setState(499);
				match(BAD_PNAME_LN_STARTS_WITH_DOT);
				notifyErrorListeners("incorrect form of Prefixed Namespace, it cannot start with '.'");
				}
				break;
			case BAD_PNAME_LN_ENDS_WITH_DOT:
				enterOuterAlt(_localctx, 5);
				{
				setState(501);
				match(BAD_PNAME_LN_ENDS_WITH_DOT);
				notifyErrorListeners("incorrect form of Prefixed Namespace, it cannot end with '.'");
				}
				break;
			case BAD_IRIREF_WITH_SPACE:
				enterOuterAlt(_localctx, 6);
				{
				setState(503);
				match(BAD_IRIREF_WITH_SPACE);
				notifyErrorListeners("Bad syntax of IRI, IRI cannot contain space or newline");
				}
				break;
			case BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS:
				enterOuterAlt(_localctx, 7);
				{
				setState(505);
				match(BAD_IRIREF_WITH_MULTIPLE_ANGLE_BRACKETS);
				notifyErrorListeners("Bad syntax of IRI, Too many angle brackets in IRI");
				}
				break;
			case BAD_IRIREF_WITH_PARENTHESES:
				enterOuterAlt(_localctx, 8);
				{
				setState(507);
				match(BAD_IRIREF_WITH_PARENTHESES);
				notifyErrorListeners("Bad syntax of IRI, IRI cannot contain parentheses");
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3X\u0202\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\3\2\7\2\62"+
		"\n\2\f\2\16\2\65\13\2\3\2\3\2\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3\3"+
		"\3\3\3\3\3\3\3\3\3\3\3\3\3\3\6\3J\n\3\r\3\16\3K\3\3\6\3O\n\3\r\3\16\3"+
		"P\3\3\3\3\3\3\5\3V\n\3\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4"+
		"\3\4\5\4e\n\4\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5"+
		"\3\5\3\5\3\5\3\5\3\5\3\5\3\5\6\5|\n\5\r\5\16\5}\3\5\3\5\3\5\6\5\u0083"+
		"\n\5\r\5\16\5\u0084\3\5\3\5\3\5\3\5\3\5\3\5\3\5\6\5\u008e\n\5\r\5\16\5"+
		"\u008f\3\5\3\5\3\5\6\5\u0095\n\5\r\5\16\5\u0096\3\5\3\5\3\5\3\5\3\5\3"+
		"\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\3\5\7\5\u00a7\n\5\f\5\16\5\u00aa\13\5\3"+
		"\5\3\5\7\5\u00ae\n\5\f\5\16\5\u00b1\13\5\3\5\3\5\5\5\u00b5\n\5\3\6\3\6"+
		"\3\7\3\7\7\7\u00bb\n\7\f\7\16\7\u00be\13\7\3\7\3\7\3\7\3\b\3\b\3\b\3\b"+
		"\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3"+
		"\b\3\b\3\b\3\b\3\b\3\b\6\b\u00de\n\b\r\b\16\b\u00df\3\b\6\b\u00e3\n\b"+
		"\r\b\16\b\u00e4\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\3\b\7\b\u00f2"+
		"\n\b\f\b\16\b\u00f5\13\b\3\b\3\b\3\b\5\b\u00fa\n\b\3\t\3\t\3\t\3\t\3\t"+
		"\3\t\6\t\u0102\n\t\r\t\16\t\u0103\3\t\6\t\u0107\n\t\r\t\16\t\u0108\3\t"+
		"\5\t\u010c\n\t\3\n\3\n\3\n\3\n\3\n\3\n\5\n\u0114\n\n\3\13\3\13\3\13\3"+
		"\13\3\13\3\13\3\13\3\13\3\13\3\13\3\13\3\13\3\13\3\13\3\13\3\13\3\13\3"+
		"\13\3\13\3\13\3\13\3\13\3\13\3\13\5\13\u012e\n\13\3\f\3\f\3\f\3\f\3\f"+
		"\5\f\u0135\n\f\3\f\3\f\3\f\3\f\3\f\3\f\3\f\3\f\5\f\u013f\n\f\3\r\3\r\3"+
		"\r\3\r\3\r\3\r\5\r\u0147\n\r\7\r\u0149\n\r\f\r\16\r\u014c\13\r\3\16\3"+
		"\16\3\16\7\16\u0151\n\16\f\16\16\16\u0154\13\16\3\17\3\17\3\17\3\17\3"+
		"\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\3\17\5"+
		"\17\u0168\n\17\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20"+
		"\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20\3\20"+
		"\3\20\5\20\u0184\n\20\3\21\3\21\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22"+
		"\3\22\3\22\5\22\u0192\n\22\3\23\3\23\3\23\3\23\3\23\5\23\u0199\n\23\3"+
		"\24\3\24\3\24\3\24\3\25\3\25\3\25\3\25\3\25\3\26\3\26\7\26\u01a6\n\26"+
		"\f\26\16\26\u01a9\13\26\3\26\3\26\3\27\3\27\3\27\3\27\5\27\u01b1\n\27"+
		"\3\27\3\27\3\27\3\27\3\27\5\27\u01b8\n\27\3\27\3\27\3\27\3\27\3\27\5\27"+
		"\u01bf\n\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27"+
		"\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\5\27\u01d9"+
		"\n\27\3\27\3\27\3\27\3\27\3\27\5\27\u01e0\n\27\3\27\3\27\3\27\3\27\3\27"+
		"\5\27\u01e7\n\27\3\27\3\27\3\27\3\27\3\27\5\27\u01ee\n\27\3\30\3\30\3"+
		"\30\3\30\3\30\3\30\3\30\3\30\3\30\3\30\3\30\3\30\3\30\3\30\3\30\3\30\5"+
		"\30\u0200\n\30\3\30\2\2\31\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36 \"$"+
		"&(*,.\2\7\4\2\13\13$$\4\2((..\3\2TU\3\29<\3\2=@\2\u0259\2\63\3\2\2\2\4"+
		"U\3\2\2\2\6d\3\2\2\2\b\u00b4\3\2\2\2\n\u00b6\3\2\2\2\f\u00b8\3\2\2\2\16"+
		"\u00f9\3\2\2\2\20\u010b\3\2\2\2\22\u0113\3\2\2\2\24\u012d\3\2\2\2\26\u013e"+
		"\3\2\2\2\30\u0140\3\2\2\2\32\u014d\3\2\2\2\34\u0167\3\2\2\2\36\u0183\3"+
		"\2\2\2 \u0185\3\2\2\2\"\u0191\3\2\2\2$\u0198\3\2\2\2&\u019a\3\2\2\2(\u019e"+
		"\3\2\2\2*\u01a3\3\2\2\2,\u01ed\3\2\2\2.\u01ff\3\2\2\2\60\62\5\4\3\2\61"+
		"\60\3\2\2\2\62\65\3\2\2\2\63\61\3\2\2\2\63\64\3\2\2\2\64\66\3\2\2\2\65"+
		"\63\3\2\2\2\66\67\7\2\2\3\67\3\3\2\2\28V\5\6\4\29:\5\26\f\2:;\7\3\2\2"+
		";V\3\2\2\2<=\5\26\f\2=>\7\4\2\2>?\b\3\1\2?V\3\2\2\2@A\5\26\f\2AB\7\5\2"+
		"\2BC\b\3\1\2CV\3\2\2\2DE\5\26\f\2EF\b\3\1\2FV\3\2\2\2GI\5\26\f\2HJ\7\3"+
		"\2\2IH\3\2\2\2JK\3\2\2\2KI\3\2\2\2KL\3\2\2\2LN\3\2\2\2MO\7\3\2\2NM\3\2"+
		"\2\2OP\3\2\2\2PN\3\2\2\2PQ\3\2\2\2QR\3\2\2\2RS\b\3\1\2SV\3\2\2\2TV\5\b"+
		"\5\2U8\3\2\2\2U9\3\2\2\2U<\3\2\2\2U@\3\2\2\2UD\3\2\2\2UG\3\2\2\2UT\3\2"+
		"\2\2V\5\3\2\2\2We\5\24\13\2Xe\5\22\n\2Ye\5\16\b\2Ze\5\20\t\2[e\5\f\7\2"+
		"\\]\5\24\13\2]^\7\3\2\2^_\b\4\1\2_e\3\2\2\2`a\5\22\n\2ab\7\3\2\2bc\b\4"+
		"\1\2ce\3\2\2\2dW\3\2\2\2dX\3\2\2\2dY\3\2\2\2dZ\3\2\2\2d[\3\2\2\2d\\\3"+
		"\2\2\2d`\3\2\2\2e\7\3\2\2\2fg\5.\30\2gh\7\6\2\2hi\5.\30\2ij\7\3\2\2jk"+
		"\b\5\1\2k\u00b5\3\2\2\2lm\5.\30\2mn\7\7\2\2no\5.\30\2op\7\3\2\2pq\b\5"+
		"\1\2q\u00b5\3\2\2\2rs\5.\30\2st\7\b\2\2tu\5.\30\2uv\7\3\2\2vw\b\5\1\2"+
		"w\u00b5\3\2\2\2xy\5.\30\2yz\7\3\2\2z|\3\2\2\2{x\3\2\2\2|}\3\2\2\2}{\3"+
		"\2\2\2}~\3\2\2\2~\u0082\3\2\2\2\177\u0080\5.\30\2\u0080\u0081\7\3\2\2"+
		"\u0081\u0083\3\2\2\2\u0082\177\3\2\2\2\u0083\u0084\3\2\2\2\u0084\u0082"+
		"\3\2\2\2\u0084\u0085\3\2\2\2\u0085\u0086\3\2\2\2\u0086\u0087\5\26\f\2"+
		"\u0087\u0088\7\3\2\2\u0088\u0089\b\5\1\2\u0089\u00b5\3\2\2\2\u008a\u008b"+
		"\5.\30\2\u008b\u008c\7\3\2\2\u008c\u008e\3\2\2\2\u008d\u008a\3\2\2\2\u008e"+
		"\u008f\3\2\2\2\u008f\u008d\3\2\2\2\u008f\u0090\3\2\2\2\u0090\u0094\3\2"+
		"\2\2\u0091\u0092\5.\30\2\u0092\u0093\7\3\2\2\u0093\u0095\3\2\2\2\u0094"+
		"\u0091\3\2\2\2\u0095\u0096\3\2\2\2\u0096\u0094\3\2\2\2\u0096\u0097\3\2"+
		"\2\2\u0097\u0098\3\2\2\2\u0098\u0099\5\26\f\2\u0099\u009a\b\5\1\2\u009a"+
		"\u00b5\3\2\2\2\u009b\u009c\7\t\2\2\u009c\u009d\5.\30\2\u009d\u009e\7\3"+
		"\2\2\u009e\u009f\b\5\1\2\u009f\u00b5\3\2\2\2\u00a0\u00a1\7\n\2\2\u00a1"+
		"\u00a2\5.\30\2\u00a2\u00a3\7\3\2\2\u00a3\u00a4\b\5\1\2\u00a4\u00b5\3\2"+
		"\2\2\u00a5\u00a7\t\2\2\2\u00a6\u00a5\3\2\2\2\u00a7\u00aa\3\2\2\2\u00a8"+
		"\u00a6\3\2\2\2\u00a8\u00a9\3\2\2\2\u00a9\u00ab\3\2\2\2\u00aa\u00a8\3\2"+
		"\2\2\u00ab\u00af\7\f\2\2\u00ac\u00ae\t\2\2\2\u00ad\u00ac\3\2\2\2\u00ae"+
		"\u00b1\3\2\2\2\u00af\u00ad\3\2\2\2\u00af\u00b0\3\2\2\2\u00b0\u00b2\3\2"+
		"\2\2\u00b1\u00af\3\2\2\2\u00b2\u00b3\7\3\2\2\u00b3\u00b5\b\5\1\2\u00b4"+
		"f\3\2\2\2\u00b4l\3\2\2\2\u00b4r\3\2\2\2\u00b4{\3\2\2\2\u00b4\u008d\3\2"+
		"\2\2\u00b4\u009b\3\2\2\2\u00b4\u00a0\3\2\2\2\u00b4\u00a8\3\2\2\2\u00b5"+
		"\t\3\2\2\2\u00b6\u00b7\t\3\2\2\u00b7\13\3\2\2\2\u00b8\u00bc\7\r\2\2\u00b9"+
		"\u00bb\t\2\2\2\u00ba\u00b9\3\2\2\2\u00bb\u00be\3\2\2\2\u00bc\u00ba\3\2"+
		"\2\2\u00bc\u00bd\3\2\2\2\u00bd\u00bf\3\2\2\2\u00be\u00bc\3\2\2\2\u00bf"+
		"\u00c0\7\3\2\2\u00c0\u00c1\b\7\1\2\u00c1\r\3\2\2\2\u00c2\u00c3\7\16\2"+
		"\2\u00c3\u00c4\7$\2\2\u00c4\u00c5\7\3\2\2\u00c5\u00c6\7\17\2\2\u00c6\u00c7"+
		"\7(\2\2\u00c7\u00c8\7\3\2\2\u00c8\u00fa\b\b\1\2\u00c9\u00ca\7\16\2\2\u00ca"+
		"\u00cb\7\3\2\2\u00cb\u00cc\7$\2\2\u00cc\u00cd\7\17\2\2\u00cd\u00ce\7("+
		"\2\2\u00ce\u00cf\7\3\2\2\u00cf\u00fa\b\b\1\2\u00d0\u00d1\7\16\2\2\u00d1"+
		"\u00d2\7\17\2\2\u00d2\u00d3\7(\2\2\u00d3\u00fa\7\3\2\2\u00d4\u00d5\7\16"+
		"\2\2\u00d5\u00d6\7)\2\2\u00d6\u00d7\7(\2\2\u00d7\u00d8\7\3\2\2\u00d8\u00fa"+
		"\b\b\1\2\u00d9\u00da\7\16\2\2\u00da\u00db\7)\2\2\u00db\u00dd\7(\2\2\u00dc"+
		"\u00de\7\3\2\2\u00dd\u00dc\3\2\2\2\u00de\u00df\3\2\2\2\u00df\u00dd\3\2"+
		"\2\2\u00df\u00e0\3\2\2\2\u00e0\u00e2\3\2\2\2\u00e1\u00e3\7\3\2\2\u00e2"+
		"\u00e1\3\2\2\2\u00e3\u00e4\3\2\2\2\u00e4\u00e2\3\2\2\2\u00e4\u00e5\3\2"+
		"\2\2\u00e5\u00e6\3\2\2\2\u00e6\u00fa\b\b\1\2\u00e7\u00e8\7)\2\2\u00e8"+
		"\u00e9\7(\2\2\u00e9\u00ea\7\3\2\2\u00ea\u00fa\b\b\1\2\u00eb\u00ec\7\16"+
		"\2\2\u00ec\u00ed\7(\2\2\u00ed\u00ee\7\3\2\2\u00ee\u00fa\b\b\1\2\u00ef"+
		"\u00f3\7\16\2\2\u00f0\u00f2\7$\2\2\u00f1\u00f0\3\2\2\2\u00f2\u00f5\3\2"+
		"\2\2\u00f3\u00f1\3\2\2\2\u00f3\u00f4\3\2\2\2\u00f4\u00f6\3\2\2\2\u00f5"+
		"\u00f3\3\2\2\2\u00f6\u00f7\7(\2\2\u00f7\u00f8\7\3\2\2\u00f8\u00fa\b\b"+
		"\1\2\u00f9\u00c2\3\2\2\2\u00f9\u00c9\3\2\2\2\u00f9\u00d0\3\2\2\2\u00f9"+
		"\u00d4\3\2\2\2\u00f9\u00d9\3\2\2\2\u00f9\u00e7\3\2\2\2\u00f9\u00eb\3\2"+
		"\2\2\u00f9\u00ef\3\2\2\2\u00fa\17\3\2\2\2\u00fb\u00fc\7\20\2\2\u00fc\u00fd"+
		"\7(\2\2\u00fd\u010c\7\3\2\2\u00fe\u00ff\7\20\2\2\u00ff\u0101\7(\2\2\u0100"+
		"\u0102\7\3\2\2\u0101\u0100\3\2\2\2\u0102\u0103\3\2\2\2\u0103\u0101\3\2"+
		"\2\2\u0103\u0104\3\2\2\2\u0104\u0106\3\2\2\2\u0105\u0107\7\3\2\2\u0106"+
		"\u0105\3\2\2\2\u0107\u0108\3\2\2\2\u0108\u0106\3\2\2\2\u0108\u0109\3\2"+
		"\2\2\u0109\u010a\3\2\2\2\u010a\u010c\b\t\1\2\u010b\u00fb\3\2\2\2\u010b"+
		"\u00fe\3\2\2\2\u010c\21\3\2\2\2\u010d\u010e\7\35\2\2\u010e\u0114\7(\2"+
		"\2\u010f\u0110\7\21\2\2\u0110\u0111\7(\2\2\u0111\u0112\7\3\2\2\u0112\u0114"+
		"\b\n\1\2\u0113\u010d\3\2\2\2\u0113\u010f\3\2\2\2\u0114\23\3\2\2\2\u0115"+
		"\u0116\7\36\2\2\u0116\u0117\7$\2\2\u0117\u0118\7\3\2\2\u0118\u0119\7\17"+
		"\2\2\u0119\u011a\7(\2\2\u011a\u012e\b\13\1\2\u011b\u011c\7\36\2\2\u011c"+
		"\u011d\7\3\2\2\u011d\u011e\7$\2\2\u011e\u011f\7\17\2\2\u011f\u0120\7("+
		"\2\2\u0120\u012e\b\13\1\2\u0121\u0122\7\36\2\2\u0122\u0123\7)\2\2\u0123"+
		"\u012e\7(\2\2\u0124\u0125\7\36\2\2\u0125\u0126\7\17\2\2\u0126\u012e\7"+
		"(\2\2\u0127\u0128\7)\2\2\u0128\u0129\7(\2\2\u0129\u012e\b\13\1\2\u012a"+
		"\u012b\7\36\2\2\u012b\u012c\7(\2\2\u012c\u012e\b\13\1\2\u012d\u0115\3"+
		"\2\2\2\u012d\u011b\3\2\2\2\u012d\u0121\3\2\2\2\u012d\u0124\3\2\2\2\u012d"+
		"\u0127\3\2\2\2\u012d\u012a\3\2\2\2\u012e\25\3\2\2\2\u012f\u0130\5\36\20"+
		"\2\u0130\u0131\5\30\r\2\u0131\u013f\3\2\2\2\u0132\u0134\5&\24\2\u0133"+
		"\u0135\5\30\r\2\u0134\u0133\3\2\2\2\u0134\u0135\3\2\2\2\u0135\u013f\3"+
		"\2\2\2\u0136\u0137\5\36\20\2\u0137\u0138\7\17\2\2\u0138\u0139\5\"\22\2"+
		"\u0139\u013f\3\2\2\2\u013a\u013b\5\36\20\2\u013b\u013c\5\34\17\2\u013c"+
		"\u013d\b\f\1\2\u013d\u013f\3\2\2\2\u013e\u012f\3\2\2\2\u013e\u0132\3\2"+
		"\2\2\u013e\u0136\3\2\2\2\u013e\u013a\3\2\2\2\u013f\27\3\2\2\2\u0140\u0141"+
		"\5\34\17\2\u0141\u014a\5\32\16\2\u0142\u0146\7\5\2\2\u0143\u0144\5\34"+
		"\17\2\u0144\u0145\5\32\16\2\u0145\u0147\3\2\2\2\u0146\u0143\3\2\2\2\u0146"+
		"\u0147\3\2\2\2\u0147\u0149\3\2\2\2\u0148\u0142\3\2\2\2\u0149\u014c\3\2"+
		"\2\2\u014a\u0148\3\2\2\2\u014a\u014b\3\2\2\2\u014b\31\3\2\2\2\u014c\u014a"+
		"\3\2\2\2\u014d\u0152\5\"\22\2\u014e\u014f\7\4\2\2\u014f\u0151\5\"\22\2"+
		"\u0150\u014e\3\2\2\2\u0151\u0154\3\2\2\2\u0152\u0150\3\2\2\2\u0152\u0153"+
		"\3\2\2\2\u0153\33\3\2\2\2\u0154\u0152\3\2\2\2\u0155\u0168\5 \21\2\u0156"+
		"\u0157\7\22\2\2\u0157\u0158\5 \21\2\u0158\u0159\7\23\2\2\u0159\u015a\b"+
		"\17\1\2\u015a\u0168\3\2\2\2\u015b\u0168\7\13\2\2\u015c\u015d\7\24\2\2"+
		"\u015d\u0168\b\17\1\2\u015e\u015f\7 \2\2\u015f\u0168\b\17\1\2\u0160\u0161"+
		"\7\37\2\2\u0161\u0168\b\17\1\2\u0162\u0163\5$\23\2\u0163\u0164\b\17\1"+
		"\2\u0164\u0168\3\2\2\2\u0165\u0166\7#\2\2\u0166\u0168\b\17\1\2\u0167\u0155"+
		"\3\2\2\2\u0167\u0156\3\2\2\2\u0167\u015b\3\2\2\2\u0167\u015c\3\2\2\2\u0167"+
		"\u015e\3\2\2\2\u0167\u0160\3\2\2\2\u0167\u0162\3\2\2\2\u0167\u0165\3\2"+
		"\2\2\u0168\35\3\2\2\2\u0169\u0184\5.\30\2\u016a\u0184\7#\2\2\u016b\u016c"+
		"\7#\2\2\u016c\u016d\7\3\2\2\u016d\u0184\b\20\1\2\u016e\u016f\7\13\2\2"+
		"\u016f\u0184\b\20\1\2\u0170\u0171\7 \2\2\u0171\u0184\b\20\1\2\u0172\u0173"+
		"\7\37\2\2\u0173\u0184\b\20\1\2\u0174\u0175\5,\27\2\u0175\u0176\b\20\1"+
		"\2\u0176\u0184\3\2\2\2\u0177\u0184\5*\26\2\u0178\u0179\7\25\2\2\u0179"+
		"\u017a\5\26\f\2\u017a\u017b\7\3\2\2\u017b\u017c\7\26\2\2\u017c\u017d\b"+
		"\20\1\2\u017d\u0184\3\2\2\2\u017e\u017f\7\25\2\2\u017f\u0180\5\26\f\2"+
		"\u0180\u0181\7\26\2\2\u0181\u0182\b\20\1\2\u0182\u0184\3\2\2\2\u0183\u0169"+
		"\3\2\2\2\u0183\u016a\3\2\2\2\u0183\u016b\3\2\2\2\u0183\u016e\3\2\2\2\u0183"+
		"\u0170\3\2\2\2\u0183\u0172\3\2\2\2\u0183\u0174\3\2\2\2\u0183\u0177\3\2"+
		"\2\2\u0183\u0178\3\2\2\2\u0183\u017e\3\2\2\2\u0184\37\3\2\2\2\u0185\u0186"+
		"\5.\30\2\u0186!\3\2\2\2\u0187\u0192\5.\30\2\u0188\u0192\7#\2\2\u0189\u0192"+
		"\5*\26\2\u018a\u0192\5&\24\2\u018b\u018c\5(\25\2\u018c\u018d\b\22\1\2"+
		"\u018d\u0192\3\2\2\2\u018e\u0192\5$\23\2\u018f\u0190\7\13\2\2\u0190\u0192"+
		"\b\22\1\2\u0191\u0187\3\2\2\2\u0191\u0188\3\2\2\2\u0191\u0189\3\2\2\2"+
		"\u0191\u018a\3\2\2\2\u0191\u018b\3\2\2\2\u0191\u018e\3\2\2\2\u0191\u018f"+
		"\3\2\2\2\u0192#\3\2\2\2\u0193\u0199\5,\27\2\u0194\u0199\7\37\2\2\u0195"+
		"\u0199\7 \2\2\u0196\u0197\7!\2\2\u0197\u0199\b\23\1\2\u0198\u0193\3\2"+
		"\2\2\u0198\u0194\3\2\2\2\u0198\u0195\3\2\2\2\u0198\u0196\3\2\2\2\u0199"+
		"%\3\2\2\2\u019a\u019b\7\27\2\2\u019b\u019c\5\30\r\2\u019c\u019d\7\30\2"+
		"\2\u019d\'\3\2\2\2\u019e\u019f\7\27\2\2\u019f\u01a0\5\30\r\2\u01a0\u01a1"+
		"\7\3\2\2\u01a1\u01a2\7\30\2\2\u01a2)\3\2\2\2\u01a3\u01a7\7\31\2\2\u01a4"+
		"\u01a6\5\"\22\2\u01a5\u01a4\3\2\2\2\u01a6\u01a9\3\2\2\2\u01a7\u01a5\3"+
		"\2\2\2\u01a7\u01a8\3\2\2\2\u01a8\u01aa\3\2\2\2\u01a9\u01a7\3\2\2\2\u01aa"+
		"\u01ab\7\32\2\2\u01ab+\3\2\2\2\u01ac\u01b0\7V\2\2\u01ad\u01b1\7/\2\2\u01ae"+
		"\u01af\7\33\2\2\u01af\u01b1\5.\30\2\u01b0\u01ad\3\2\2\2\u01b0\u01ae\3"+
		"\2\2\2\u01b0\u01b1\3\2\2\2\u01b1\u01b2\3\2\2\2\u01b2\u01ee\b\27\1\2\u01b3"+
		"\u01b7\7W\2\2\u01b4\u01b8\7/\2\2\u01b5\u01b6\7\33\2\2\u01b6\u01b8\5.\30"+
		"\2\u01b7\u01b4\3\2\2\2\u01b7\u01b5\3\2\2\2\u01b7\u01b8\3\2\2\2\u01b8\u01b9"+
		"\3\2\2\2\u01b9\u01ee\b\27\1\2\u01ba\u01be\7\"\2\2\u01bb\u01bf\7/\2\2\u01bc"+
		"\u01bd\7\33\2\2\u01bd\u01bf\5.\30\2\u01be\u01bb\3\2\2\2\u01be\u01bc\3"+
		"\2\2\2\u01be\u01bf\3\2\2\2\u01bf\u01ee\3\2\2\2\u01c0\u01c1\7\"\2\2\u01c1"+
		"\u01c2\7\60\2\2\u01c2\u01ee\b\27\1\2\u01c3\u01c4\7\"\2\2\u01c4\u01c5\7"+
		"\34\2\2\u01c5\u01c6\5.\30\2\u01c6\u01c7\b\27\1\2\u01c7\u01ee\3\2\2\2\u01c8"+
		"\u01c9\7\"\2\2\u01c9\u01ca\7/\2\2\u01ca\u01cb\7\33\2\2\u01cb\u01cc\5."+
		"\30\2\u01cc\u01cd\b\27\1\2\u01cd\u01ee\3\2\2\2\u01ce\u01cf\7\"\2\2\u01cf"+
		"\u01d0\7\33\2\2\u01d0\u01d1\5.\30\2\u01d1\u01d2\7/\2\2\u01d2\u01d3\b\27"+
		"\1\2\u01d3\u01ee\3\2\2\2\u01d4\u01d8\t\4\2\2\u01d5\u01d9\7/\2\2\u01d6"+
		"\u01d7\7\33\2\2\u01d7\u01d9\5.\30\2\u01d8\u01d5\3\2\2\2\u01d8\u01d6\3"+
		"\2\2\2\u01d8\u01d9\3\2\2\2\u01d9\u01da\3\2\2\2\u01da\u01ee\b\27\1\2\u01db"+
		"\u01df\7R\2\2\u01dc\u01e0\7/\2\2\u01dd\u01de\7\33\2\2\u01de\u01e0\5.\30"+
		"\2\u01df\u01dc\3\2\2\2\u01df\u01dd\3\2\2\2\u01df\u01e0\3\2\2\2\u01e0\u01e1"+
		"\3\2\2\2\u01e1\u01ee\b\27\1\2\u01e2\u01e6\7S\2\2\u01e3\u01e7\7/\2\2\u01e4"+
		"\u01e5\7\33\2\2\u01e5\u01e7\5.\30\2\u01e6\u01e3\3\2\2\2\u01e6\u01e4\3"+
		"\2\2\2\u01e6\u01e7\3\2\2\2\u01e7\u01e8\3\2\2\2\u01e8\u01ee\b\27\1\2\u01e9"+
		"\u01ea\t\5\2\2\u01ea\u01ee\b\27\1\2\u01eb\u01ec\t\6\2\2\u01ec\u01ee\b"+
		"\27\1\2\u01ed\u01ac\3\2\2\2\u01ed\u01b3\3\2\2\2\u01ed\u01ba\3\2\2\2\u01ed"+
		"\u01c0\3\2\2\2\u01ed\u01c3\3\2\2\2\u01ed\u01c8\3\2\2\2\u01ed\u01ce\3\2"+
		"\2\2\u01ed\u01d4\3\2\2\2\u01ed\u01db\3\2\2\2\u01ed\u01e2\3\2\2\2\u01ed"+
		"\u01e9\3\2\2\2\u01ed\u01eb\3\2\2\2\u01ee-\3\2\2\2\u01ef\u0200\7(\2\2\u01f0"+
		"\u01f1\7*\2\2\u01f1\u0200\b\30\1\2\u01f2\u01f3\7)\2\2\u01f3\u01f4\7I\2"+
		"\2\u01f4\u0200\b\30\1\2\u01f5\u01f6\7,\2\2\u01f6\u0200\b\30\1\2\u01f7"+
		"\u01f8\7-\2\2\u01f8\u0200\b\30\1\2\u01f9\u01fa\7O\2\2\u01fa\u0200\b\30"+
		"\1\2\u01fb\u01fc\7P\2\2\u01fc\u0200\b\30\1\2\u01fd\u01fe\7Q\2\2\u01fe"+
		"\u0200\b\30\1\2\u01ff\u01ef\3\2\2\2\u01ff\u01f0\3\2\2\2\u01ff\u01f2\3"+
		"\2\2\2\u01ff\u01f5\3\2\2\2\u01ff\u01f7\3\2\2\2\u01ff\u01f9\3\2\2\2\u01ff"+
		"\u01fb\3\2\2\2\u01ff\u01fd\3\2\2\2\u0200/\3\2\2\2*\63KPUd}\u0084\u008f"+
		"\u0096\u00a8\u00af\u00b4\u00bc\u00df\u00e4\u00f3\u00f9\u0103\u0108\u010b"+
		"\u0113\u012d\u0134\u013e\u0146\u014a\u0152\u0167\u0183\u0191\u0198\u01a7"+
		"\u01b0\u01b7\u01be\u01d8\u01df\u01e6\u01ed\u01ff";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}
