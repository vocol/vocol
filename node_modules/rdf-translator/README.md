# rdf-translator [![Build Status][travis-image]][travis-url]

> Convert between rdf formats

It is a javascript connector for the [rdf-translator](http://rdf-translator.appspot.com/) APIs.

## Install

```sh
npm install --save rdf-translator
```

## Usage

* From a string.

```javascript
var rdfTranslator = require('rdf-translator');
var str = `
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
           xmlns:foaf="http://xmlns.com/foaf/0.1/">
   <foaf:Person rdf:about="http://dbpedia.org/page/Spider-Man">
     <foaf:name>Peter Parker</foaf:name>
     <foaf:mbox rdf:resource="mailto:peter.parker@dailybugle.com"/>
   </foaf:Person>
  </rdf:RDF>
`

rdfTranslator(str, 'xml', 'n3', function(err, data) {
    if (err) return console.error(err);
    console.log(data);
    \\ <http://dbpedia.org/page/Spider-Man> <http://xmlns.com/foaf/0.1/name> "Peter Parker" .
    \\ <http://dbpedia.org/page/Spider-Man> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
    \\ <http://dbpedia.org/page/Spider-Man> <http://xmlns.com/foaf/0.1/mbox> <mailto:peter.parker@dailybugle.com> .


});

```


* From a URI

```javascript
var rdfTranslator = require('rdf-translator');

let uri = 'https://raw.githubusercontent.com/DOREMUS-ANR/doremus-ontology/master/doremus.ttl';
rdfTranslator(uri, 'n3', 'json-ld', function(err, data) {
  var json == JSON.parse(data);
  // your code here
});

```

## API

### rdfTranslator(str, source, target, [callback])

#### str

Type: `string`

Input string (i.e. in xml-rdf or turtle format) _-or-_ URI of the file to convert.

#### source

Type: `string`

Format of the input string.

#### target

Type: `string`

Format of the desired output string.

#### callback(err, data)

Type: `function`

Callback function.

## License

MIT

[travis-image]: https://travis-ci.org/pasqLisena/rdf-translator.svg?branch=master
[travis-url]: https://travis-ci.org/pasqLisena/rdf-translator
