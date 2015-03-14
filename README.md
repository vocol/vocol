VoCol - Vocabulary collaboration and build environment.
=====

Vocabularies typically reflect a consensus among experts in a certain application domain. They are thus implemented in collaboration of domain experts and knowledge engineers. Particularly the presence of domain experts with little technical background requires a low-threshold vocabulary engineering methodology. This methodology should be implementable without dependencies on complex software components, it should provide collaborators with comprehensible feedback on syntax
and semantics errors in a tight loop, and it should give access to a human-readable presentation of the vocabulary. 

Inspired by agile software and content development methodologies, the VoCol methodology and tool environment addresses these requirements. The VoCol environment is employing loose coupling of validation and documentation generation components
on top of a standard Git repository. All of these components, even the repository engine, can be exchanged with little effort. 

More information about VoCol can be found in the paper: 
*VoCol: An Agile Methodology and Environment for Collaborative Vocabulary Development*
by Petersen, Niklas ; Halilaj, Lavdim ; Lange, Christoph ; Auer, Sören
https://zenodo.org/record/15023

##Required libraries
	- Python 2.7
	- Java 1.7+
	- Raptor RDF Syntax Library [1]
	- Schemaorg engine [2]
	- Some Webserver for running VoCol

##Installation on a web server
	1. Configuring vocolJob.sh
		* GITHUB_TOKEN=<client_token>
		* GITHUB_REPOSITORY=<git_repository_path> (e.g.: "Mobivoc/Mobivoc")
		* INTERVAL= <intervall_in_minutes> (e.g.: 5)
	2. Setting up a cron job on the web server which executes vocolJob.sh in the defined interval. 

## Installation using a Virtual Machine Image (Vagrant)
Within the /vargrant folder, you will find the required BoxFiles for setting up the whole environment. 

##How it works

By running vocolJob.sh in a predefined interval (e.g. 5min) as a cron job on some Webserver, it checks for new commits in the defined github repository and collectes all touched vocabulary files. These files are validated and in case of syntax errors, they are automatically reported as GitHub issues (with a notification to the commiter). In case the new vocabulary version is valid, it is automaticially published in a human-friend and machine-comprehensible way. 


##Example
You may want to check out our vocabulary development repository, where VoCol is employed: [mobivoc](http://github.com/mobivoc/mobivoc/).

[1] http://librdf.org/raptor/
[2] https://github.com/schemaorg/schemaorg
