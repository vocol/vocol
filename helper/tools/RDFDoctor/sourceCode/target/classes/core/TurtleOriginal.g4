grammar TurtleOriginal;


start 		    :  (directive)*  (triples)* (errors)*;  // leading CODE
directive       : baseDecl
				| prefixDecl 
				| unkonwnDecl
				;
baseDecl 		: baseSparql | base  ;	
unkonwnDecl 	: '@keywords' (CHAR)* '.' {notifyErrorListeners("@keywords is unkown directive in Turtle");}
				;		
baseSparql 		: KW_BASE  IRIREF 
//				| '@BASE'   IRIREF '.'  {notifyErrorListeners("Uncorrect form of Base directive");}
//				| '@BASE'  IRIREF   {notifyErrorListeners("Uncorrect form of Base  directive");}
//				| KW_BASE   IRIREF  '.' {notifyErrorListeners("SPARQL BASE directive should not followed by '.'");}
				;
base 		    : BASE  IRIREF '.' 
//				| BASE  IRIREF {notifyErrorListeners("Missing '.' at the end of Base directive");}
//				| BASE {notifyErrorListeners("Missing IRI after '@base'");}
				;
prefixDecl		: prefixSparql | prefix ;
prefix		    : PREFIX PNAME_NS IRIREF '.' 
//				| PREFIX '.' PNAME_NS  IRIREF '.' {notifyErrorListeners("Namespace cannot start with '.' ");}
//				| PREFIX PN_PREFIX?  '.' ':' IRIREF '.' {notifyErrorListeners("Namespace cannot end with '.' ");}
//				| PREFIX PNAME_NS IRIREF {notifyErrorListeners("Missing '.' at the end of Prefix directive");}
//				| PREFIX PNAME_NS  '.' {notifyErrorListeners("Missing IRI in Prefix directive");}
//				| PREFIX PNAME_NS  {notifyErrorListeners("Missing IRI  and dot at Prefix directive");}
//				| PREFIX   IRIREF '.' {notifyErrorListeners("Missing NameSpace in Prefix directive");}
				;
prefixSparql	: KW_PREFIX PNAME_NS IRIREF {System.out.println("\nNS "+$PNAME_NS.text+"IRI "+$IRIREF.text);}
//				| KW_PREFIX '.'	PNAME_NS IRIREF  {notifyErrorListeners("Namespace cannot start with '.' ");}
//				| KW_PREFIX PN_PREFIX?  '.' ':' IRIREF  {notifyErrorListeners("Namespace cannot end with '.' ");}
//				| KW_PREFIX PNAME_NS IRIREF '.' {notifyErrorListeners(" extraneous input'.' at the end of Prefix directive");}
//				| KW_PREFIX PNAME_NS  '.' {notifyErrorListeners("Missing IRI in Prefix directive");}
//				| KW_PREFIX   IRIREF  {notifyErrorListeners("Missing NameSpace in Prefix directive");}
				;
errors			: iri '=' iri '.' {notifyErrorListeners("'=' sign cannot be used in Turtle");}
				//TODO:remove for debugging
		 		//| subject predicateObjectList ';'  {notifyErrorListeners("Uncorrect end of a triple, a triple ends with '.'");}
				//| subject predicateObjectList ','  {notifyErrorListeners("Uncorrect end of a triple, a triple ends with '.'");}
//todo
//				| '{' subject predicateObjectList '}' {notifyErrorListeners("{ } pattern is not in Turtle");}
//				| '{' triples '}' {notifyErrorListeners("{ } pattern is not in Turtle");}
//				|  (subject '.')  {notifyErrorListeners("N3 paths cannot be used in Turtle");}
//Todo
//				| subject predicate object graphLabel '.' {notifyErrorListeners("Turtle is not NQuads");}
//				|  '@forAll' iri '.' {notifyErrorListeners(" '@forAll' cannot be used in Turtle ");}
//				|  '@forSome' iri '.' {notifyErrorListeners(" '@forSome' cannot be used in Turtle ");}
				|  	subject wrongPredicateObjectList '.' {notifyErrorListeners("N3 Pattern 'is...of' cannot be used in Turtle");}
				;
triples 		:  	subject predicateObjectList '.'
//todo
//		 		|  	subject predicateObjectList ('.')+ ('.')+ {notifyErrorListeners("Too many DOT ");}
//		 		|  	subject predicateObjectList  {notifyErrorListeners("Missing '.' at the end of the triple");}
//		 		|  	subject predicateObjectList (';') {notifyErrorListeners("Missing '.' at the end of the triple");}	
		 			
		 		;
graphLabel		: IRIREF | BLANK_NODE_LABEL
				;
subject         :  	iri | blank 
				| booleanLiteral  {notifyErrorListeners("Subject cannot be a boolean value");}
// todo
//				| rdfLiteral   {notifyErrorListeners("Subject cannot be a string");}
				| numericLiteral  {notifyErrorListeners("Subject cannot be a number");}
				| RDF_TYPE {notifyErrorListeners("'a' cannot be used as a subject");}
				;

blankNodePropertyList	   :   	'[' (predicateObjectList)* ']' ;
predicateObjectList	   :   	predicate objectList (';' predicate objectList)* 
				// TODO: remove the last ';' above
				//predicate objectList (';' predicate objectList)* (';')? 
//				| predicate {notifyErrorListeners("Object is missing in the triple");}
//				|	'<=' objectList (';' predicate objectList)* (';')?  {notifyErrorListeners("'<=' is not in Turtle");}
//				|	'=>' objectList (';' predicate objectList)* (';')?  {notifyErrorListeners("'=>' is not in Turtle");}
				;
wrongPredicateObjectList	: 'is' predicate 'of' objectList ( ';' predicate objectList )* (';')? 
				;
objectList	   :   	object ( ',' object )* ;
object	   :   	literal 
				 iri 
				//| blank  
//todo
//				| RDF_TYPE {notifyErrorListeners("'a' cannot be used as an object");}
				;
blank	        : 	blankNode | blankNodePropertyList | collection 
//				| blankNode '.' {notifyErrorListeners("Blank Node cannot be followed by '.'");}
				;
collection	   :   	'(' object* ')' ;

literal         : rdfLiteral
				| numericLiteral
				| booleanLiteral
				;
// BNF: predicate ::= iri | RDF_TYPE
predicate       : iri
//todo
				| 'a'
//				| rdfType
//				| 'A' {notifyErrorListeners("'A' cannot be used as predicate, it should be repalce with 'a'");}
//todo
//				| literal {notifyErrorListeners("Predicate cannot be a literal");}
//				| blank {notifyErrorListeners("Predicate cannot be a blank node");}
				;
rdfType			: RDF_TYPE ;
datatype        : iri ;

numericLiteral  : INTEGER
				| DECIMAL
				| DOUBLE
//				| ('0x'|'0X')  INTEGER  {notifyErrorListeners("Bad format of a numberic literal");}
//				|   INTEGER (CHAR)+ {notifyErrorListeners("Numeric literal cannot have string characters");}
//				|   INTEGER '.' (CHAR)+ {notifyErrorListeners("Uncorrect form of a literal");}
				;
rdfLiteral      : String (LANGTAG | '^^' datatype)?
//todo
//				| String (LANGTAG | '^' datatype)? {notifyErrorListeners("Missing '^' Character");}
//				| String (LANGTAG '^^' datatype)? {notifyErrorListeners("Uncorrect form of a Literal");}
//				| String ( '^^' datatype LANGTAG)? {notifyErrorListeners("Uncorrect form of a Literal");}
//				| String ( '@' (INTEGER|DECIMAL|DOUBLE)? )? {notifyErrorListeners("Language tag cannot be a numeric value");}
			   ;
booleanLiteral  : KW_TRUE
				| KW_FALSE
				;
String          : 
				STRING_LITERAL1
				| STRING_LITERAL2
				| STRING_LITERAL_LONG1
                | STRING_LITERAL_LONG2
//todo
//                | STRING_LITERAL_LONG2 '"' {notifyErrorListeners("Uncorrect form of long literal with 4 qoutes");}
//                | '"' STRING_LITERAL_LONG2  {notifyErrorListeners("Uncorrect form of long literal with 4 qoutes");}
//todo
//                | WRONG_STRING_LITERAL_LONG2 {notifyErrorListeners("Missing qoutes of long literal");}
//                | WRONG_STRING_LITERAL2_MIX_QUOTES  {notifyErrorListeners("Literal cannot be used with a mix of single and double quotes, either one of them can be used");}

 //               | (WRONG_STRING_LITERAL1 | WRONG_STRING_LITERAL2)   {notifyErrorListeners("Uncorrect quotes form of a literal");}
                //TODO:check another way to form string with escape
                //| WRONG_STRING_LITERAL2_WITH_ESCAPE  {notifyErrorListeners("Uncorrect literal form with escape");}

				;
iri             : 
 //todo
//                 WRONGIRIREF {notifyErrorListeners("Uncorrect form of URI, URI cannot contain newline or space");} 
//				| WRONGIRIREF_WITH_ESCAPE {notifyErrorListeners("Uncorrect form of URI with escape");} 
				 IRIREF
				| prefixedName
				;
prefixedName    : 
//todo				
//				WRONG_PNAME_LN_STARTS_WITH_DOT  {notifyErrorListeners("Uncorrect form of prefixed name, it cannot start with '.'");} 
//				| WRONG_PNAME_LN_ENDS_WITH_DOT  {notifyErrorListeners("Uncorrect form of prefixed name, it cannot end with '.'");} 
				 PNAME_LN
				| PNAME_NS
				;
blankNode       : BLANK_NODE_LABEL 
				;

// Reserved for future use


// Keywords
KW_BASE 			: B A S E ;
KW_PREFIX       	: P R E F I X  ;
KW_TRUE         	: 'true' ;
KW_FALSE        	: 'false' ;

// terminals
PASS				  : [ \t\r\n]+ -> skip;
COMMENT				  : '#' ~[\r\n]* -> skip;

BASE				  : '@base' ;
PREFIX				  : '@prefix' ;
CODE                  : '{' (~[%\\] | '\\' [%\\] | UCHAR)* '%' '}' ;
RDF_TYPE              : 'a' ;
IRIREF                : '<' (~[\u0000-\u0020=<>"{}|^`\\] | UCHAR)* '>' /* #x00=NULL #01-#x1F=control codes #x20=space */
					 
					  ;
WRONGIRIREF 		  : '<' (~[\u0000-\u0020=<>"{}|^`\\] | UCHAR)* '\\n>'
					  | '<' (~[\u0000-\u0020=<>"{}|^`\\] | UCHAR)* [ \t\r\n]+  (~[\u0000-\u0020=<>"{}|^`\\] | UCHAR)* '>'
					  ;
			  
//WRONGIRIREF_WITH_ESCAPE	: '<' (~[\u0000-\u0020=<>"{}|^`\\] | UCHAR)* ('\\'~[bfrnt\\"]|~[\n\\"])+ '>' 
//				        ;
PNAME_NS			  : PN_PREFIX? ':' ;

PNAME_LN			  : PNAME_NS PN_LOCAL;
WRONG_PNAME_LN_STARTS_WITH_DOT	  : '.' PNAME_NS PN_LOCAL ;
WRONG_PNAME_LN_ENDS_WITH_DOT	  : PN_PREFIX?  '.:' PN_LOCAL ;
					  
// this is not working since it is related to Lexer not to the parser 
//					  | PNAME_NS PN_LOCAL '^' PN_LOCAL {notifyErrorListeners("Wrong form of a local name");}
					  
REGEXP                : '/' (~[/\n\r\\] | '\\' [/nrt\\|.?*+(){}[\]$^-] | UCHAR)+ '/' ;
REGEXP_FLAGS		  : [smix]+ ;
BLANK_NODE_LABEL      : '_:' (PN_CHARS_U | [0-9]) ((PN_CHARS | '.')* PN_CHARS)? ;
LANGTAG               : '@' [a-zA-Z]+ ('-' [a-zA-Z0-9]+)* ;
INTEGER               : [+-]? [0-9]+ ;
DECIMAL               : [+-]? [0-9]* '.' [0-9]+ ;
DOUBLE                : [+-]? ([0-9]+ '.' [0-9]* EXPONENT | '.'? [0-9]+ EXPONENT) ;
CHAR 				  : [a-zA-Z];



fragment EXPONENT     : [eE] [+-]? [0-9]+ ;

STRING_LITERAL1       : '\'' (~[\u0027\u005C\u000A\u000D] | ECHAR | UCHAR)* '\'' ; /* #x27=' #x5C=\ #xA=new line #xD=carriage return */
STRING_LITERAL2       : //TODO: change here 
						//'"' (~[\u0022\u005C\u000A\u000D] | ECHAR | UCHAR)* '"' ;   /* #x22=" #x5C=\ #xA=new line #xD=carriage return */
					   '"' (~ ["\\\r\n] | '\'' | '\\"')* '"';
					   //'"' (~ ["\\\r\n] | '\'' | '\\"')* '"';
					   //'"'  ( ~["\\\r\n] | ECHAR )* '"';
					   // ('"' ~'"'* '"') ;
					   // '"' (~ ["\\\r\n] | '\'' | '\\"')* '"';
					  // '"' (('"' | '""')? (~ ["\\] | ECHAR | UCHAR | '\''))* '"';
STRING_LITERAL_LONG1  : '\'\'\'' (('\'' | '\'\'')? (~['\\] | ECHAR | UCHAR))* '\'\'\'' ;
STRING_LITERAL_LONG2  : '"""' (('"' | '""')? (~["\\] | ECHAR | UCHAR))* '"""' ;
WRONG_STRING_LITERAL_LONG2 : '"""' (('"' | '""')? (~["\\] | ECHAR | UCHAR))*  ;
WRONG_STRING_LITERAL2_MIX_QUOTES       : '\'' (~[\u0022\u005C\u000A\u000D] | ECHAR | UCHAR)* '"' 
							           | '"' (~[\u0022\u005C\u000A\u000D] | ECHAR | UCHAR)*  '\''
							           ;
WRONG_STRING_LITERAL2_WITH_ESCAPE   : '"' ('\\' ~[btnfr"'\\] | ~'\\')+ (ECHAR | UCHAR)* '"' 
						;
WRONG_STRING_LITERAL1       : '\'\'\'' (~[\u0027\u005C\u000A\u000D] | ECHAR | UCHAR)* '\'' 
							| '\'' (~[\u0027\u005C\u000A\u000D] | ECHAR | UCHAR)* '\'\'\'' 
							;
WRONG_STRING_LITERAL2       : '"""' (~[\u0022\u005C\u000A\u000D] | ECHAR | UCHAR)* '"' 
							| '"' (~[\u0022\u005C\u000A\u000D] | ECHAR | UCHAR)* '"""' 
							;   /* #x22=" #x5C=\ #xA=new line #xD=carriage return */

   

fragment UCHAR                 : '\\u' HEX HEX HEX HEX | '\\U' HEX HEX HEX HEX HEX HEX HEX HEX ;
fragment ECHAR                 : '\\' [tbnrf\\"'] ;

fragment PN_CHARS_BASE 		   : [A-Z] | [a-z] | [\u00C0-\u00D6] | [\u00D8-\u00F6] | [\u00F8-\u02FF] | [\u0370-\u037D]
					   		   | [\u037F-\u1FFF] | [\u200C-\u200D] | [\u2070-\u218F] | [\u2C00-\u2FEF] | [\u3001-\uD7FF]
					           | [\uF900-\uFDCF] | [\uFDF0-\uFFFD]
					   		   ;
fragment PN_CHARS_U            : PN_CHARS_BASE | '_' ;
fragment PN_CHARS              : PN_CHARS_U | '-' | [0-9] | [\u00B7] | [\u0300-\u036F] | [\u203F-\u2040] ;
PN_PREFIX             : PN_CHARS_BASE ((PN_CHARS | '.')* PN_CHARS)? ;
fragment PN_LOCAL              : (PN_CHARS_U | ':' | [0-9] | PLX) ((PN_CHARS | '.' | ':' | PLX)* (PN_CHARS | ':' | PLX))? ;
fragment PLX                   : PERCENT | PN_LOCAL_ESC ;
fragment PERCENT               : '%' HEX HEX ;
fragment HEX                   : [0-9] | [A-F] | [a-f] ;
fragment PN_LOCAL_ESC          : '\\' ('_' | '~' | '.' | '-' | '!' | '$' | '&' | '\'' | '(' | ')' | '*' | '+' | ','
					  		   | ';' | '=' | '/' | '?' | '#' | '@' | '%') ;

fragment A:('a'|'A');
fragment B:('b'|'B');
fragment C:('c'|'C');
fragment D:('d'|'D');
fragment E:('e'|'E');
fragment F:('f'|'F');
fragment G:('g'|'G');
fragment H:('h'|'H');
fragment I:('i'|'I');
fragment J:('j'|'J');
fragment K:('k'|'K');
fragment L:('l'|'L');
fragment M:('m'|'M');
fragment N:('n'|'N');
fragment O:('o'|'O');
fragment P:('p'|'P');
fragment Q:('q'|'Q');
fragment R:('r'|'R');
fragment S:('s'|'S');
fragment T:('t'|'T');
fragment U:('u'|'U');
fragment V:('v'|'V');
fragment W:('w'|'W');
fragment X:('x'|'X');
fragment Y:('y'|'Y');
fragment Z:('z'|'Z');
