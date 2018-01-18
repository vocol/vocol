
VoCol - Vocabulary collaboration and build environment.
=====

Linked Data vocabularies are a crucial building block of the Semantic Data Web and semantic-aware data-value chains.
Vocabularies  reflect a consensus among experts in a certain application domain. 
They are thus implemented in collaboration of domain experts and knowledge engineers. Particularly the presence of domain experts with little technical background requires a low-threshold vocabulary engineering environment.

Inspired by agile software and content development methodologies, the VoCol methodology and tool environment addresses this requirement. 
VoCol is implemented without dependencies on complex software components, it provides collaborators with comprehensible feedback on syntax and semantics errors in a tight loop, and gives access to a human-readable presentation of the vocabulary. 
The VoCol environment is employing loose coupling of validation and documentation generation components on top of a standard Git repository. 
All VoCol components, even the repository engine, can be exchanged with little effort. 


<<<<<<< HEAD
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
- A docker image of VoCol is also provided on: https://hub.docker.com/r/lavdim/vocol/.

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

   1.9. If you want to reset VoCol in initial state, run script resetVocol, i.e.: **bash resetVoCol.sh**
  
### Configuration of the VoCol Environment

2.1. Open Web Page: *http://192.168.33.10/docs/configuration_page.html* (this is default IP address of the Guest machine when Vagrant is used for installing VoCol)

2.2. In the section **General info** provide the following information:
 
 2.2.1. Provide a Vocabulary Name to be shown in header of VoCol Web Application.

 2.2.2. Copy the URL generated from command in step 1.8. and put in the field **Domain Name**.
      
     In our case was: http://vocol.vagrantshare.com (be sure to provide server url without */* in the end, a Web Hook that will be created to your repository will be is this format: http://<your server url>/push , in our case http://vocol.vagrantshare.com/push)

 2.2.3. Check **Web Hook** to put a web hook in client repository. 
       
     Note: After each push on the repository a payload event which contains information about the latest commit in JSON format will be generated by API of the repository service and sent to the URL of server specified in step 2.2.2. This will cause a pulling operation to get the latest changes from remote repository.
		
     Imporant Note: this option should be unchecked only if the URL is the same from the previous configuration.
		
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
     2. Create a Web Hook to your repository in this format: http://<your server url>/push
     
2.3. Select the tool for **Syntax Validation**.

2.4. Select the tool for **Documentation Generation**.

2.5. In the **Additional Services** section, select the services the you want to be performed by VoCol and to be shown in VoCol Web Application.
		 
2.6. In the section **Serialization Formats**, select the formats that you wish to be provided by VoCol through **Content Negotiation** mechanism.

2.7. Provide a description for the Vocabulary Project that will be shown on the HomePage.
	
2.3. Click **Save Configuration**
		  
     Wait few moments until new configuration will be applied. You may verify this by checking if the web hook is created and a *VoColClient* is attached to the repository (if you already checked the respective services).

Process of installing and configuration of VoCol is finished here.

This process needs to be done only once.

The following screen cast shows in details all steps listed above.
=======
## Installation on a local machine or on a Web Server
>>>>>>> 605efe411cacf5f9bb425972e5d2842e34597d46

The following steps are needed to setup the VoCol Environment either on on a local machine or a web server.

1. First, we assumed that you are using linux-based operating system.
1. Next, to prepare the VoCol environment, you should have the following libraries installed: Java JDK, NodeJS, NPM, Rapper ,Git ,and Turtle-validator packages with their respective versions or higher. They are listed in section **[Required libraries and tools](https://github.com/vocol/vocol/wiki/Required-libraries-and-tools)**. 
2. Make a new directory, in the following command-line "newFolder" is given but you are free to choose your own, then inside the new directory, clone VoCol repository as follows:
```
mkdir newFolder
cd newFolder
git clone https://github.com/vocol/vocol.git
```
3. Give the required command-line permission on the new directory, again it is the "newFolder" directory here.
```
chmod u+x  .
```
4. Now, we are almost done, go "VoCol" folder and clear old data with the command-line:
```
sh helper/scripts/resetApp.sh
```
5. The last step is to start VoCol with NPM command-line:
```
npm start
```
6. Normally, You can access VoCol start page with http://localhost:3000 URL if the port number was not changed. If you clear old data as step 5 describes, then the configuration page will be displayed. otherwise, you can use http://localhost:3000/config URL for configuring VoCol.

For more details about VoCol repository, please have a look on our VoColWiki

**VoColWiki's Table of Contents**
  - [Home](https://github.com/vocol/vocol/wiki) 
  - [VoCol Features](https://github.com/vocol/vocol/wiki/VoCol-Features)
  - [Required libraries and tools](https://github.com/vocol/vocol/wiki/Required-libraries-and-tools)
  - [Installation and Configuration](https://github.com/vocol/vocol/wiki/Installation-and-Configuration/)
      - [Installation on a local machine or on a Web Server](https://github.com/vocol/vocol/wiki/Installation-and-Configuration#installation-on-a-web-server)
      - [Installation using a Virtual Machine Image (Vagrant Box)](https://github.com/vocol/vocol/wiki/Installation-and-Configuration#installation-using-a-virtual-machine-image-vagrant-box)
      - [Installation of the VoCol Environment](https://github.com/vocol/vocol/wiki/Installation-and-Configuration#installation-and-configuration-of-vocol-environment)
      - [Configuration of the VoCol Environment](https://github.com/vocol/vocol/wiki/Installation-and-Configuration#configuration-of-the-vocol-environment)
  - [Working with VoCol](https://github.com/vocol/vocol/wiki/Working-with-VoCol)
      - [VoCol on local machine](https://github.com/vocol/vocol/wiki/Working-with-VoCol#vocol-on-local-machine)
      - [VoCol on the GitHub](https://github.com/vocol/vocol/wiki/Working-with-VoCol#vocol-on-the-github)

  - [How it works](https://github.com/vocol/vocol/wiki/How-it-works)
    - [Client Side](https://github.com/vocol/vocol/wiki/How-it-works#client-side)
    - [Server Side](https://github.com/vocol/vocol/wiki/How-it-works#server-side) 
 
- [Developing Vocabularies with VoCol Environment](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment)
    - [Vocabulary Language and Representation](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#vocabulary-language-and-representation)
    - [Branching and Merging](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#branching-and-merging)
    - [Vocabulary Organization Structure](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#vocabulary-organization-structure)
    - [Labeling of Release Versions](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#labeling-of-release-versions)
  - [Best Practices for Vocabulary Development](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#best-practices-for-vocabulary-development)
    - [Reuse](#reuse)
    - [Naming Conventions](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#naming-conventions)
    - [Dereferenceability](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#dereferenceability)
    - [Multilinguality](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#multilinguality)
    - [Documentation](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#documentation)
    - [Validation](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#validation)
    - [Authoring](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#authoring)
    - [Utilization of SKOS Vocabulary](https://github.com/vocol/vocol/wiki/Developing-Vocabularies-with-VoCol-Environment#utilization-of-skos-vocabulary)
    
Also, Check out a list of projects that are currently using [VoCol](http://vocol.iais.fraunhofer.de/).


