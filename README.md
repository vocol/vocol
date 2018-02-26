
VoCol - Vocabulary collaboration and build environment.
=====

Linked Data vocabularies are a crucial building block of the Semantic Data Web and semantic-aware data-value chains.
Vocabularies  reflect a consensus among experts in a certain application domain. 
They are thus implemented in collaboration of domain experts and knowledge engineers. Particularly the presence of domain experts with little technical background requires a low-threshold vocabulary engineering environment.

Inspired by agile software and content development methodologies, the VoCol methodology and tool environment addresses this requirement. 
VoCol is implemented without dependencies on complex software components, it provides collaborators with comprehensible feedback on syntax and semantics errors in a tight loop, and gives access to a human-readable presentation of the vocabulary. 
The VoCol environment is employing loose coupling of validation and documentation generation components on top of a standard Git repository. 
All VoCol components, even the repository engine, can be exchanged with little effort. 


## Installation on a local machine or on a Web Server

The following steps are needed to setup the VoCol Environment either on a local machine or a web server.

1. First, we assumed that you are using a Linux-based operating system.
1. Next, to prepare the VoCol environment, you should have the following libraries installed: Java JDK, NodeJS, NPM, Git, and Turtle-validator packages with their respective versions or higher. They are listed in section **[Required libraries and tools](https://github.com/vocol/vocol/wiki/Required-libraries-and-tools)**. 
2. Make a new directory, in the following command-line "newFolder" is given but you are free to choose your own, then inside the new directory, clone VoCol repository as follows:
```
mkdir newFolder
cd newFolder
git clone https://github.com/vocol/vocol.git
```
3. Give the required execution permissions cmd on the new directory, again, the "newFolder" is assumed here.
```
chmod u+x  .
```
4. Enter inside "VoCol" folder and clear old saved data if any is exsit:
```
cd vocol
./helper/scripts/resetApp.sh
```
5. To install the dependent packages, first, let's start with [Turtle validator](https://github.com/IDLabResearch/TurtleValidator): this package is also needed to run the VoCol app. If you have the [NPM](https://www.npmjs.com/get-npm) package manager installed, then the following cmd should be given for installing this package:
```
sudo npm install -g turtle-validator
````
6. Then, install other packages listed in "package.json" 
```
sudo npm install
```
Semantic-Ui framework is used in VoCol development, a couple of selections need to be given while installing it. 
Select "Skip install" as follows: 
```
? It looks like you have a semantic.json file already.
  Yes, extend my current settings.
> Skip install
```
Then "Yes" for that Vocol is using "NPM Nice".
```
? We detected you are using NPM Nice! Is this your project folder? D:\vocolrepo\vocol
> Yes
  No, let me specify
```
Finally, give "public/semantic" as the location of Sematic-Ui in VoCol Project.
```
? Where should we put Semantic UI inside your project? (semantic/) public/semantic/
```
7. The last step is to start VoCol with:
```
npm start
```
8. Normally, you can access VoCol start page with http://localhost:3000 URL if the port number was not changed. If you clear old data as step 4 describes, then the configuration page will be displayed. Otherwise, you can use http://localhost:3000/config URL for configuring VoCol. Sometimes, the port number is also changed during our project's development, for that, you have a possibility to look-up the vocol access's port number and as well change it, by opening **bin/www** file if you are on the root path of VoCol.

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

Moreover, you can use the **updated docker image** of VoCol [here](https://hub.docker.com/r/ahemid/newvocol/)

