# Turtle source modules of the vocabulary
MODULES = *.ttl
DEPLOY_FORMATS = rdf ttl

# homepage directory (where gh-pages branch is checked out)
HOMEPAGE = homepage

# converting Turtle to N-Triples
TTL2NT_DEF = ttl2nt() { \
		rapper -i turtle -o ntriples $$1 > $$2 ; \
	}
TTL2NT = @$(TTL2NT_DEF); ttl2nt

# converting N-Triples to Turtle
NT2RDF_DEF = nt2rdf() { \
		rapper -i ntriples -o rdfxml-abbrev $$1 > $$2 ; \
	}
NT2RDF = @$(NT2RDF_DEF); nt2rdf

# converting N-Triples to Turtle
NT2TTL_DEF = nt2ttl() { \
		rapper -i ntriples -o turtle $$1 > $$2 ; \
	}
NT2TTL = @$(NT2TTL_DEF); nt2ttl

# the whole vocabulary
all: $(addprefix mobivoc.,$(DEPLOY_FORMATS))

mobivoc.nt: $(filter-out mobivoc.nt,$(subst .ttl,.nt,$(wildcard $(MODULES))))
	cat $^ > $@

mobivoc.ttl: mobivoc.nt
	$(NT2TTL) $< $@

mobivoc.rdf: mobivoc.nt
	$(NT2RDF) $< $@

# test query for extracting some per-class information from the vocabulary
# ChargingPoints_classes.csv: ChargingPoints.ttl
# 	roqet -e 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT DISTINCT ?class ?label ?comment WHERE { ?class a rdfs:Class . OPTIONAL { ?class rdfs:label ?label; rdfs:comment ?comment; rdfs:subClassOf ?superClass } }' -D $< -r csv > $@

# publish changes to homepage
.sync: $(HOMEPAGE)/mobivoc.parrot.html
	(cd $(HOMEPAGE) ; \
		git commit -m "regenerated" $(notdir $<) ; \
		git push) ; \
	touch $@

# generate HTML with Parrot; http://idi.fundacionctic.org/parrot/parrot
# generate from Turtle, as Turtle is smallets
$(HOMEPAGE)/mobivoc.parrot.html: mobivoc.ttl $(HOMEPAGE)/index.html
	curl -s -o - -F "file=@$<" -F "mimetypeFile=text/turtle" 'http://idi.fundacionctic.org/parrot/parrot?' \
	| perl -ne 'print; print "<base href=\"http://idi.fundacionctic.org/parrot/parrot?\" />\n" if /<head/' \
	> $@

# Initialise the homepage
$(HOMEPAGE)/index.html:
	git clone https://github.com/mobivoc/mobivoc $(HOMEPAGE) ; \
	cd $(HOMEPAGE) ; \
	git checkout gh-pages

# general file conversion
%.nt: %.ttl
	$(TTL2NT) $< $@

# cleaning
.PHONY: clean
clean:
	rm -v *.nt *~ $(addprefix mobivoc.,$(DEPLOY_FORMATS)) .sync

# for testing some rules etc.
.PHONY: test
test: $(subst .ttl,.nt,$(wildcard $(MODULES)))
	echo $^
