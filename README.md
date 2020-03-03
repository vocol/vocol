
VoCol - Vocabulary collaboration and build environment.
=====

Inspired by agile software and content development methodologies, the VoCol methodology and tool environment allows building leight-weight ontologies using version control systems such as Git and repository hosting platforms such as Github. 
VoCol is implemented without dependencies on complex software components, it provides collaborators with comprehensible feedback on syntax and semantics errors in a tight loop, and gives access to a human-readable presentation of the vocabulary. 
The VoCol environment is employing loose coupling of validation and documentation generation components on top of a standard Git repository. 
All VoCol components, even the repository engine, can be exchanged with little effort. 


## Installation on a local machine or on a Web Server

The following steps are needed to setup the VoCol Environment either on a local machine or a web server. These steps are valid in the Linux-based operating systems and with slight modifications can be used in Windows-based as well.

1. You should have the following libraries installed: Java JDK, NodeJS, NPM, and Git packages with their respective versions or higher. For more info see in **[Required libraries and tools](https://github.com/vocol/vocol/wiki/Required-libraries-and-tools)**. 

2. Create a new directory e.g. "newFolder", clone the VoCol repository, and give the execution permissions as follows:
```
mkdir newFolder
cd newFolder
git clone https://github.com/vocol/vocol.git
chmod u+x  .
```
4. Enter inside the "VoCol" folder and run the following script to clean up any not necessary file:
```
cd vocol
./helper/scripts/resetApp.sh
```
5. Install the dependent packages (assuming that node package manager is installed already):
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
6. The last step is to start VoCol with **npm start [VocolPortNumber] [SparqlEndPointPortNumber]**. In the following command, we are going to start Vocol on port 3000 where Fuseki Server is runing at port 3030

```
npm start 3000 3030
```
8. You can access VoCol start page with http://localhost:3000 , if the port number was not changed. If you clear old data as step 4 describes, then the configuration page will be displayed. Otherwise, you can use http://localhost:3000/config URL for configuring of the VoCol. Sometimes, the port number is also changed during our project's development, for that, you have a possibility to look-up the vocol access's port number and as well change it, by opening **bin/www** file if you are on the root path of VoCol.

9. To keep your repository synchronized with VoCol instance (for example when you push something), you should configure **a webhook path** on the repository hosting platform such as Github, GitLab and BitBucket to point with the VoCol API: **http(s)://hostname(:port or /vocolInstancePath)/listener**. The connection between both hosting server and VoCol instance should be available in such a way that hosting platform can send the notification to the VoCol instance. Please the fundamental explanations of WebHooks in the following link: [https://developer.github.com/webhooks/](https://developer.github.com/webhooks/).

For more details about VoCol repository, please have a look on our [VoColWiki](https://github.com/vocol/vocol/wiki).
    
Check out a list of projects that are currently using [VoCol](https://vocol.iais.fraunhofer.de/).

Moreover, you can use the **docker image** of VoCol [here](https://hub.docker.com/r/ahemid/newvocol/) or use the included Dockerfile to build the docker image.

## License

VoCol is licensed under the MIT License. See LICENSE.txt for more details. For respective licenses of individual components and libraries please refer to the **[Required libraries and tools](https://github.com/vocol/vocol/wiki/Required-libraries-and-tools)** section. 

## Current Work 
We have extened this VoCol version to work As A Service in VoCoREG. Please, visit us on the following link: https://www.vocoreg.org or https://www.vocoreg.com

