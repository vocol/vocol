VoCol
=====

Vocabulary collaboration and build environment.

Required libraries:
	- Python 2.7
	- Java 1.7+
	- Raptor RDF Syntax Library (for validation) 
	- Schemaorg engine (for publication) 
	- Some Webserver for running VoCol

Installation:
	1.) Configuring vocolJob.sh
		* GITHUB_TOKEN=<client_token>
		* GITHUB_REPOSITORY=<git_repository_path> (e.g.: "Mobivoc/Mobivoc")
		* INTERVAL= <intervall_in_minutes> (e.g.: 5)
	2.) Setting up a cron job on the web server which executes vocolJob.sh in the defined interval. 

How VoCol works:
	 By running vocolJob.sh in a predefined interval (e.g. 5min) as a cron job on some Webserver, it checks for new commits of a predefined github repository and collected all touched vocabulary files. These files are validates and in case of syntax errors, they are automatically reports as GitHub issues. In case the new vocabulary version is valid, it is automaticially published in a human-friend and machine-comprehensible way. 


Please visit our project homage, where VoCol is employed: [mobivoc](http://github.com/mobivoc/mobivoc/). 
