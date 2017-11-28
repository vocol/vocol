
VoCol - Vocabulary collaboration and build environment.
=====

Linked Data vocabularies are a crucial building block of the Semantic Data Web and semantic-aware data-value chains.
Vocabularies  reflect a consensus among experts in a certain application domain. 
They are thus implemented in collaboration of domain experts and knowledge engineers. Particularly the presence of domain experts with little technical background requires a low-threshold vocabulary engineering environment.

Inspired by agile software and content development methodologies, the VoCol methodology and tool environment addresses this requirement. 
VoCol is implemented without dependencies on complex software components, it provides collaborators with comprehensible feedback on syntax and semantics errors in a tight loop, and gives access to a human-readable presentation of the vocabulary. 
The VoCol environment is employing loose coupling of validation and documentation generation components on top of a standard Git repository. 
All VoCol components, even the repository engine, can be exchanged with little effort. 

Check out a list of projects that are currently using [VoCol](http://vocol.iais.fraunhofer.de/).

**Table of Contents**
  - [VoCol Features](#vocol-features)
  - [Required libraries and tools](#required-libraries-and-tools)
  - [Installation using a Virtual Machine Image (Vagrant Box)](#installation-using-a-virtual-machine-image-vagrant-box)
    - [Installation of the VoCol Environment](#installation-and-configuration-of-vocol-environment)
    - [Configuration of the VoCol Environment](#configuration-of-the-vocol-environment)
  - [Installation on a Web Server](#installation-on-a-web-server)
    - [Working with VoCol](#working-with-vocol)
      - [VoCol on local machine](#vocol-on-local-machine)
      - [VoCol on the GitHub](#vocol-on-the-github)
  - [How it works](#how-it-works)
    - [Client Side](#client-side)
    - [Server Side](#server-side) 
 
- [Developing Vocabularies with VoCol Environment](#developing-vocabularies-with-vocol-environment)
    - [Vocabulary Language and Representation](#vocabulary-language-and-representation)
    - [Branching and Merging](#branching-and-merging)
    - [Vocabulary Organization Structure](#vocabulary-organization-structure)
    - [Labeling of Release Versions](#labeling-of-release-versions)
  - [Best Practices for Vocabulary Development](#best-practices-for-vocabulary-development)
    - [Reuse](#reuse)
    - [Naming Conventions](#naming-conventions)
    - [Dereferenceability](#dereferenceability)
    - [Multilinguality](#multilinguality)
    - [Documentation](#documentation)
    - [Validation](#validation)
    - [Authoring](#authoring)
    - [Utilization of SKOS Vocabulary](#utilization-of-skos-vocabulary)

## VoCol Features

New features:
- Automatic formatting Ontology/Vocabulary files with unified serialization during the pre-commit event. This allows users to work with different Ontology/Vocabulary editors on their local working copies and prevent Git from the indication of false-positive conflicts. This functionality is implemented using [RDF-Toolkit](https://github.com/edmcouncil/rdf-toolkit),
- Displaying SPARQL query results with different visualization graphs using [D3sparql](http://biohackathon.org/d3sparql/),
- A docker image of VoCol is also provided on: https://hub.docker.com/r/ahemid/newvocol/.

Below are tasks that are performed automatically by VoCol on push event:
- Syntax Validation: Rapper or JenaRiot (in pre-commit event as well by sending the modified files to a listening service for syntax validation in VoCol Server),
- Documentation Generation: Schema.Org or Widoco,
- Visualization: WebVOWL,
- Provide latest version of vocabulary through SPARQL Endpoint: Jena Fuseki,
- Evolution Report: OWL2VCS,
- Content Negotiation,
- Dereferenceable URI's using Schema.Org,
- Generates Syntax Validation Report and Documentation for all branches,
- Upload and list SPARQL into Jena Fuseki interface all queries defined in .rq files, where the file name will be used as the query name and the file content as the query.

## Required libraries and tools
- Java v9.0+
- NodeJS v8.0+
- NPM v5.2.0+
- Raptor RDF Syntax Library: http://librdf.org/raptor/
- OWL2VCS: https://github.com/utapyngo/owl2vcs
- WebVOWL: http://vowl.visualdataweb.org/webvowl.html
- CKEditor4: https://ckeditor.com/ckeditor-4/
- Jena FUSEKI: https://jena.apache.org/documentation/serving_data/
- TurtleEditor: https://github.com/vocol/vocol/tree/master/TurtleEditor
- Turtle validator: https://github.com/IDLabResearch/TurtleValidator

## Installation using a Virtual Machine Image (Vagrant Box)

Installation of VoCol Environment using Vagrant technology is very straightforward and you will receive a number of benefits.

1. Vagrant allows running several VoCol boxes in single machine, which can be configured to monitor different repositories.

2. Using Vagrant Share mechanism, the content of the VoCol Envorinment can be accessed publicly.

3. You can customize the VoCol Environment by installing new tools to perform other Vocabulary Development related tasks, and share it with others as Vagrant Box.

4. Since it works as an isolated operating system, you can easily manage a Vagrant Box, by stopping, starting, replacing or moving to different machine it without affecting the other running systems.

5. It is easy to have always the latest version of VoCol, since we will provide regular updates of VoCol Box in Vagrant Cloud.

6. You have to install only VirtualBox and Vagrant, and all other necessary libraries and tools are within VoCol Box. 

7. This solution is compatible with all Operating Systems that are supported by Vagrant and VirtualBox.

The required time for complete installation and configuration of VoCol environment (after you install VirtualBox and Vagrant and download the VoCol Box) is less than 10 minutes.

### Installation of the VoCol Environment

Prerequisite: Install VirtualBox and Vagrant, these are standard procedures and can be found on their respective Web Sites.

   1.1. Create a new folder.

   1.2. Open terminal to the location of the created folder.

   1.3. Run command: **vagrant init eis/vocol**
   
   1.3.1. Open the file Vagrantfile, which is created from the above command and uncomment the line that has the following content: 
	*config.vm.network "private_network", ip: "192.168.33.10"*
		 
   1.4. Run command: **vagrant up --provider virtualbox**
		 
   1.5. Run command: **vagrant ssh** (to enter in the vagrant box)

   1.6. Run command: **bash startup.sh** (installation is finished here, for making public accesible, follow steps 1.7 and 1.8)

   1.7. Open new terminal and navigate to the folder

   1.8. Create a public accessible URL, by running the command: **vagrant share --http 80 --name (desired name)**, 
	  e.g. **vagrant share --http 80 --name vocol** . 
        This will generate url: *vocol.vagrantshare.com*

   1.9. If you want to reset VoCol in initial state, run script resetVocol, i.e.: **sh helper/tools/resetApp.sh**
  
### Configuration of the VoCol Environment

2.1. Open Web Page: *http://192.168.33.10/config* (this is default IP address of the Guest machine when Vagrant is used for installing VoCol)

2.2. In the section **General info** provide the following information:
 
 2.2.1. Provide a Vocabulary Name to be shown in header of VoCol Web Application.

 2.2.2. Copy the URL generated from command in step 1.8. and put in the field **Hosting Server**.
      
     In our case was: http://vocol.vagrantshare.com (be sure to provide server url without */* in the end, a Web Hook that will be created to your repository will be is this format: http://<your server url>/listener , in our case http://vocol.vagrantshare.com/listener)

 2.2.3. Check **Web Hook** to put a web hook in client repository. 
       
     Note: After each push on the repository a payload event which contains information about the latest commit in JSON format will be generated by API of the repository service and sent to the URL of server specified in step 2.2.2. This will cause a pulling operation to get the latest changes from remote repository.
		
    // Imporant Note: this option should be unchecked only if the URL is the same from the previous configuration.
		
2.3. In section **Repository Info**, provide the following information:
        
     Important Note: Because of the complexity of integration of multiple tools and operations and asynchronous executing of processes, no message about wrong information will be appeared. You can verify whether the provided information is accurate by navigating to the Web Hook settings in the repository services. 
		
 2.3.1. Provide repository URL in the field **Repository**. 
		
     Note: Make sure to select HTTPS URL (not ssh) of repository. 
     Suppose the repository is: https://github.com/lavhal/testProj.git
		
 2.3.2. In **Branch Name**: enter the branch to be monitored by VoCol (after each push on this branch, VoCol will perform all actions, selected in section **Additional Services**). 
		
 2.3.3. In the fields **User** and **Password**, provide repository credentials.
        
     Important Note: Since these information will be used create a Web Hook in the repository service, the user has be the owner of the repository. In addition, the TurtleEditor and Client Side Hooks will be attached to the repository if they are selected in the "Additional Services" section.
		
     Note: Credentials will be removed immediately after the configuration process is finished.
     Note: If you do not prefer to write the repository credentials, then:
     1. Uncheck the following options: "Web Hook", "Turtle Editor", "Client Side Hooks" and put arbitrary data on the respective textboxes.
     2. Create a Web Hook to your repository in this format: http://<your server url>/listener
     

2.4. In the **Additional Services** section, select the services the you want to be performed by VoCol and to be shown in VoCol Web Application.
		 
2.5. In the section **Serialization Formats**, select the formats that you wish to be provided by VoCol through **Content Negotiation** mechanism.

2.7. Provide a description for the Vocabulary Project that will be shown on the HomePage.
	
2.3. Click **Save Configuration**
		  
     Wait few moments until new configuration will be applied. You may verify this by checking if the web hook is created and a *VoColClient* is attached to the repository (if you already checked the respective services).

Process of installing and configuration of VoCol is finished here.

This process needs to be done only once and as well configuration changes are required.

The following screen cast shows in details all steps listed above.

<a href="https://drive.google.com/file/d/0By1pR7FDcH8obUV6OEpxeDZ3MFk/view?usp=sharing" target="_blank"><img src="https://raw.githubusercontent.com/vocol/vocol/master/Images/VoColInstallingAndConfiguring.png" 
alt="VoCol Installation and Configuration"  width="440" height="280" border="10" /></a>

## Installation on a Web Server

The following steps are needed to setup the VoCol Environment on your server.

1. Install libraries: Java, NodeJS, NPM , rapper, and turtle-validator with respective versions as listed in section **Required libraries and tools**. 
2. Clone vocol repository in a new directory.
3. Give permissions on the included files in the directory.
5. Install Rapper for syntax validation. 
6. Apply configuration files that are found in *config files* folder of this repository.

After the above mentioned steps are finished, continue with VoCol configuration by running the command: **bash startup.sh** and then follow steps defined in the section **Configuration of the VoCol Environment**.

This solution is tested in OS Ubuntu 14.04 LTS.

### Working with VoCol

#### VoCol on local machine

The only step that vocabulary contributors need to perform after cloning the repository, is to install pre-commit hook by running the following command (Windows): **VoColClient\Hooks\InstallHooks.sh** 

For linux based systems use: **sh VoColClient/Hooks/InstallHooks.sh** . 
It will ask for admin password for giving execute permission to the pre-commit hook.

The pre-commit hook will perform a syntax validation for each modified turtle file by posting them to a running web service in VoCol Server through **curl**.

This will prevent users from pushing turtle files which contain syntactic errors to the remote repository.

Yet, this step is optional. In any case the syntax validation will be performed in VoCol server.

#### VoCol on the GitHub

By using Turtle Editor which is attached to the repository, contributors can directly edit turtle files on GitHub Web Front-End. They will benefit from just-in-time syntax validation.

The following screen cast shows using of VoCol for vocabulary development.

<a href="https://drive.google.com/file/d/0By1pR7FDcH8oTFpIRWxfUHdNS1k/view?usp=sharing" target="_blank"><img src="https://raw.githubusercontent.com/vocol/vocol/master/Images/WorkingwithVoCol.png" 
alt="VoCol Usage" width="440" height="280" border="10" /></a>


## How it works

### Client Side 

VoCol in client-side deals with commit event by enforcing users to realize specific requirements before pushing changes to the remote repository. Pre-commit hook get the modified files and sent to a listening service on VoCol server where these files are checked for syntax errors. Users do not have to install any tool on their machines. They just have to apply a pre-commit hook as described in [VoCol on local machine](#vocol-on-local-machine). User is allowed to push the modified vocabulary files to the remote repository only if syntax validation succeeded. 

### Server Side

In server-side, VoCol performs several tasks related to validation and publication in human and machine comprehensible formats. These tasks facilitates collaboration between team members and ensure delivering high quality vocabularies. 

**Triggering the Changes on Repository** Repository services like: *GitHub*, *GitLab* and *BitBucket* are places where vocabulary is hosted. Users contribute directly to vocabulary development by using web frontends. Web hooks mechanism fires when certain events, such as push, occurs to the repository. Repository services send a payload event with information about last commit to an external server using *PubSubHubbub* protocol. VoCol on server-side receives the payload event which triggers every push and run specific actions as a result. 

**Validation and Error Reporting** After a payload event is received, a pulling process of vocabulary is started. Once it is done, VoCol starts validation of each turtle file for syntactic errors by using tools like: *Rapper* or *Jena Riot*. In case the validation fails, the information about filename, line number and the error type are provided and an HTML document is created that lists detailed errors found recently.

**Publishing Artefacts for Humans and Machines** After syntax validation process has been passed successfully, different artefacts are published and can be accessed publicly from interested parts. First, a human-readable HTML representation of vocabulary is generated using tools like: *Schema.org* or *Widoco*. In addition, *Turtle*, *RDF/XML* and *NTriple* are generated as machine comprehensible formats. VoCol serve these through a web server configured to perform content negotiation according to the best practices for publishing vocabularies. For visualization purposes, the *WebVOWL* is used,to create graphical depictions for vocabulary elements by implementing the Visual Notation for OWL Ontologies (VOWL). Furthermore, a *SPARQL* endpoint service using *Jena Fuseki* is provided. Users will be able to perform *SPARQL* queries and export results in different formats. In case of existing *semantic diffs* between previous and current version of vocabulary, an evolution report is generated using tool *Owl2VCS*. All of the above mentioned actions will be performed for main branch, whereas, for all other branches Syntax Validation Report and Documentation Generation will be generated.


## Developing Vocabularies with VoCol Environment

### Vocabulary Language and Representation

As a vocabulary representation language format, we propose *Turtle*, the most widely used plain text serialization of RDF (and RDF Schema), which has been designed for easy readability and writability by human users.  We recommend editing *Turtle* with a text editor rather than a visual IDE, because visual editors tend to change the structure of the source document on saving or exporting it. Such changes increase the risk of editing conflicts and make it harder for other collaborators to retrace the evolution of a vocabulary file over its history of revisions.

In addition, organization of facts should be one line per triple, like in example below:

```
scor:Enable rdfs:subClassOf scor:Process ;
rdfs:comment "Enable describes the ...";
rdfs:label "Enable".
```
For more about turtle format in http://www.w3.org/TR/turtle/.

### Branching and Merging

It is considered that the branching strategy affects the quality of the vocabularies. In order to design a branching model, it is important to understand the possible activities that a team can perform. Table below presents common activities of collaborative vocabulary development. These activities are classified into three categories: (1) *basic activities* (ACT1, ACT7, ACT9), (2) *semantic issues* (ACT2, ACT3, ACT4, ACT5, ACT6, ACT8) and (3) *structural issues* (ACT10, ACT11). The following figure depicts different branches to handle the mentioned categories. Basic activities have to be performed in the *Develop Branch*. Branch called *Semantic Issues* is proposed for the second category. In case of the third category a branch named *Structural Issues* has to be applied. This not restricts the flexibility of Git regarding branches. On the contrary, other branches can be used as well to complement this model. 

![Table of Common Activities](https://raw.githubusercontent.com/vocol/vocol/master/Images/CommonActivitiesTable.png "Table of Common Activities")

![Branching Model](https://raw.githubusercontent.com/vocol/vocol/master/Images/BranchingModel.png "Branching Model")

### Vocabulary Organization Structure

In order to enable easy collaboration between different contributors, we propose some guidelines for organizing the vocabulary in files where each file represents a module. Considering the fact that each line should represent a triple and based on the insights from software development, we propose that files should not contain more than 300 triples. We highlight three possible forms of organizing the files.

* **The complete vocabulary is contained in one single file** When the vocabulary is small (e.g. contains less than 300 lines of code) and represents a domain which cannot be divided in sub domains, it should be saved within one single file. If the number of contributors is relatively small and the domain of the vocabulary is very focused, organizing it into one single file might be possible, even if it exceeds 300 lines of code. However, if the comprehensibility is exacerbated, splitting it into different files should be considered.

* **The vocabulary is split in multiple files** If the vocabulary contains more than 300 lines of code or covers a complex domain, it should be organized into different sub domains or modules. In this regard, we mapped sub domains with modules. When the sub domains themselves are small enough they should be represented by different files within the parent folder. Figure below presents this type of file organization applied in MobiVoc vocabulary. 

  ![MobiVoc Structure](https://raw.githubusercontent.com/vocol/vocol/master/Images/MobiVocStructure.png "MobiVoc Structure")

* **Vocabulary modules are stored in files and folders** For huge vocabularies that comprises complex domains, splitting it into files is not sufficient. This would lead to a large amount of files within a single folder. Therefore, if the sub domains are large enough to be split into files they should be represented by folders. Each folder contains files which represents modules. In this case, the folder and file structure should reflect the complex hierarchy of the overall domain. 


### Labeling of Release Versions

Proper labeling of release versions is vital, as it facilitates re-usability. Based on the above mentioned categories of activities, different versions should be tagged according to the following pattern: *v[StI.SeI.BA]*, where *StI* stands for *Structural Issues*, *SeI* for *Semantic Issues* and *BaA* for *Basic Activities*. Each category is related with a number, in the respective position. Changes in the vocabulary regarding to the categories are commonly reflected by increasing the numbers. For instance, the difference between releases *v[1.0.0]* and *v[2.0.0]* shows structural issue changes (*StI*).


## Best Practices for Vocabulary Development

### Reuse

Reuse of existing terms is considered to be a best-practice in vocabulary construction. Therefore, in the following important practices regarding reuse are presented.

* **P-R1 Reuse of authoritative vocabularies** Authoritative vocabularies as vocabularies are: (1) published by renowned standardization organizations; (2) used widely in a large number of other vocabularies; and (3) defined in a more domain independent way addressing more general concerns.
Reusing authoritative vocabularies will increase the probability that data can be consumed by applications. Hence, these most widely used vocabularies should be considered as a first option for reuse.
A comprised list with these vocabularies can be found on http://eis-bonn.github.io/vdbc/.  

* **P-R2 Reuse of non-authoritative vocabularies** Search online resources, such as vocabulary registries like [LOV](http://lov.okfn.org/dataset/lov/) and [LODStats](http://stats.lod2.eu/) or ontology search engines like [Swoogle](http://swoogle.umbc.edu/) and [Watson](http://watson.kmi.open.ac.uk/WatsonWUI/) to find terms to reuse. The output of this process is a set of terms. For instance, by searching in LOV for a specific term the following information can be derived: (1) the number of datasets that uses it; (2) the number of occurrences of the term in all datasets; and (3) the reuse frequency of the vocabulary to which the term belongs. Also, the semantic description and definition of the term should be checked in order to verify whether it fits the intended use. The above information supports the decision process regarding to which terms are better candidates for reusing.

* **P-R3 Avoid semantic clashes** If the term has a strong semantic meaning for the domain, different from the existing ones, then a new element should be created. 

* **P-R4 Individual resource reuse** Elements from authoritative vocabularies should be reused as individual vocabulary elements. For non-authoritative vocabularies a reuse of individual identifiers is less recommendable and the creation of own vocabulary elements with a possible alignment (cf. P-R6) or the reuse of larger modules (cf. P-R5) should be considered.

* **P-R5 Vocabulary module reuse** (Opposite of PR-4) Often vocabularies require certain basic structures such as addresses, persons, organizations, which are already defined in non-authoritative vocabularies. Such structures comprise usually the definition of one or several classes and a number of properties. If the conceptualizations match the complete reuse of a whole module should be considered.

* **P-R6 Establishing alignments with existing vocabularies** Instead of the strong semantic commitment of reusing identifiers from non-authoritative vocabularies, alignments using *owl:sameAs*, *owl:equivalentClass*, *owl:equivalentProperty*, *rdfs:subClassOf*, *rdfs:subPropertyOf* can be established.


### Naming Conventions

Naming conventions help to avoid lexical inaccuracies and increase the robustness and exportability, specifically in cases when vocabularies should be interlinked and aligned with each other. In the following, some of the practices to be considered in the process of naming elements in vocabularies:

* **P-N1 Concepts as single nouns** Name all concepts as single nouns using *CamelCase* notation (i.e. *PlanReturn*).

* **P-N2 Properties as verb senses** Name all properties as verb senses also following *CamelCase* approach. The name of an property should not normally be a plain noun phrase, in order to clearly distinct from class names (i.e. *hasProperty* or *isPropertyOf*).

* **P-N3 Short names** Provide short and concise names for elements. When natural names contain more than three nouns, use the rdfs:label property with the long name and a short name for the element. For instance, for *ManageSupplyChainBusinessRules* use *BusinessRules* and set the full name in the label. In order to explain the context (i.e. Supply Chain), complement this label with the *skos:altLabel*.

* **P-N4 Logical and short prefixes for namespaces** Assign logical and short prefixes to namespaces, preferable, with no more than five letters (i.e. *foaf:XXX*, *skos:XXX*).

* **P-N5 Regular space as word delimiters for labeling elements** For example, *rdfs:label* "A Process that contains..".

* **P-N6 Avoid the use of conjunctions and words with ambiguous meanings** Avoid names with *And*, *Or*, *Other*, *Part*, *Type*, *Category*, *Entity* and those related to datatypes like *Date* or *String*.

* **P-N7 Use positive names** Avoid the use of negations. For instance, instead of *NoParkingAllowed* use *ParkingForbidden*.

* **P-N8 Respect the names for registered products and company names** In those cases is not recommended the use of *CamelNotation*. Instead, the name of the company or product should be used as is (i.e.
*SAP*, *Daimler AG*, etc).


### Dereferenceability

Adopting HTTP URIs for identifying things is appropriate due to the following reasons: (1) it is simple to create global unique keys in a decentralized fashion and (2) the generated key is not used just as a name but also as an identifier. This will help the server to provide adequate content for a resource based on the type of request through *Content Negotiation* mechanism. There are three different strategies to make URIs of resources dereferenceable: (1) slash URIs; (2) hash URIs and (3) a combination between them.

* **P-D1 Use slash URIs** When the client request a resource from server by providing its URIs, the server response will be 303 see other. Slash URI should be used when dealing with large datasets. This makes the server to response only with requested resource. For example, the *ChargingPoint* resource is identified as follows *http://purl.org/net/mobivoc/ChargingPoint*. The URI of turtle representation of above resource  is *http://purl.org/net/mobivoc/ChargingPoint.ttl* and the URI of html representation is *http://purl.org/net/mobivoc/ChargingPoint.html*.

* **P-D2 Use hash URIs** This solution is formed by including a fragment to the URIs as in the following format URI#resource. Use hash URIs when dealing with small datasets. This will reduce number of HTTP round trips. For instance, the URI of the ScorVoc vocabulary is *http://purl.org/eis/vocab/scor*. The URI of the Process resource is *http://purl.org/eis/vocab/scor#Process*.

* **P-D3 Use combination between slash and hash URIs** This allows a large dataset to be split into multiple fractions. Use this solution when datasets may grow to some point where it is not practical to serve all resources in single document(e.g. *http://purl.org/eis/vocab/scor/Process#this*).


### Multilinguality

Providing multilingual vocabularies is desirable but not an straightforward issue. Below are presented best-practices that allows multilingual vocabularies.

* **P-M1 Use English as the main language** Use English for every element and explicitly set with the @en notation.

* **P-M2 Multilinguality for other languages** In order to add another language, use another line adding the same format for every element. The following example illustrates this practice with translations for the class SupplyChain.

```
scor:SupplyChain rdf:type owl:Class ;
rdfs:label "SupplyChain"@en;
rdfs:comment "A Supply Chain is a ..."@en ;
rdfs:label "Lieferkette"@de;
rdfs:comment "Eine Lieferkette ist ..."@de.
```

This approach should be followed with all the elements starting from the basics ones like *rdfs:label* and *rdfs:comment* but also for the external annotation properties (i.e. *skos:prefLabel*).


### Documentation

Providing user friendly view of vocabularies for non-experts is crucial for integrating Semantic Web with everyday Web. Tools for documentation generation requires that following information should be present for each resource to enable generation process.

* **P-Do1 Use of rdfs:label and rdfs:comment** Add a *rdfs:label* to every element setting the main name of the concept that is being represented and *rdfs:comment* to describe the context for which the element is created.

* **P-Do2 Generate human-readable documentation** If during vocabulary creation slash URIs are used for identifying resources then tools like Schema.org documentation generation should be used for documentation generation. Tools like Widoco are appropriate if hash URIs or combination between slash and hash URIs are used for identifying resources.


### Validation

Validation is an important aspect in the vocabulary development process. Criteria used for validation activity are: (1) correctness; (2) completeness and (3) consistency. Address the above mentioned criteria, with the following practices. 

* **P-V1 Syntax validation** When collaborating directly on the vocabulary source code, syntax checking is of paramount importance. In VoCol, syntax checking is directly integrated with tools like Rapper or Jena Riot.

* **P-V2 Code-Smell checking** Code smells are symptoms in the software source code that possibly indicate deeper problems. Use [OOPS](http://oops.linkeddata.es/) as a Web-based tool for detecting common ontology pitfalls such as: (1) missing relationships; (2) using incorrectly ontology elements and (3) missing domain and range properties. 

* **P-V3 Consistency checking** Use reasoners to handle inconsistencies. Tools like [Pellet](https://github.com/complexible/pellet), [Fact++](http://owl.man.ac.uk/factplusplus/), [Racer](https://github.com/ha-mo-we/Racer), [HermiT](http://hermit-reasoner.com/) or the Web based tool [ConsVISor](http://vistology.com/OLD/www/consvisor.shtml) can be used for consistency checking. 

* **P-V4 Linked Data validation** Use [Vapour](http://validator.linkeddata.org/vapour) to verify whether data are correctly published according Linked Data principles.


### Authoring

General guidelines to be followed in the process of designing vocabularies.

* **P-A1 Domain and range definitions for properties** When creating a property, consider to provide the associated domain and range definitions. This also means that in case of object properties the corresponding classes should be defined. In case of *datatype* properties, the range should be a suitable *datatype*.

* **P-A2 Avoid inverse properties** Create inverse properties only if it is strictly necessary to have bidirectional relations (i.e. *invalidated* and *wasInvalidatedBy*). Inverse properties affect the size as well as the complexity of the vocabulary.

* **P-A3 Use of class disjointness** Use class disjointness to logically avoid overlapping classes. Even though disjointness has been used in authoritative vocabularies, it should be carefully examined because it can easily lead to semantic inconsistencies.

### Utilization of SKOS Vocabulary

The Simple Knowledge Organization System SKOS is a W3C recommendation for modeling vocabularies in the Web. Use following practices to utilize your vocabulary with *SKOS* concepts. 

* **P-A4 Provide skos:prefLabel to complement the labeling of concepts** Use *skos:prefLabel* in combination with *rdfs:label* to complement the semantic label of the element. For instance, *skos:prefLabel* might describe a shorter definition for a concept than *rdfs:label*.

* **P-A5 Use skos:altLabel to describe variations of the elements** Add complementary descriptions for the elements such as acronyms, abbreviations, spelling variants, and irregular plural/singular forms by using *skos:altLabel*.



