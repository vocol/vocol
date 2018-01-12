
VoCol - Vocabulary collaboration and build environment.
=====

Linked Data vocabularies are a crucial building block of the Semantic Data Web and semantic-aware data-value chains.
Vocabularies  reflect a consensus among experts in a certain application domain. 
They are thus implemented in collaboration of domain experts and knowledge engineers. Particularly the presence of domain experts with little technical background requires a low-threshold vocabulary engineering environment.

Inspired by agile software and content development methodologies, the VoCol methodology and tool environment addresses this requirement. 
VoCol is implemented without dependencies on complex software components, it provides collaborators with comprehensible feedback on syntax and semantics errors in a tight loop, and gives access to a human-readable presentation of the vocabulary. 
The VoCol environment is employing loose coupling of validation and documentation generation components on top of a standard Git repository. 
All VoCol components, even the repository engine, can be exchanged with little effort. 
For more details about VoCol repository, please have a look on our VoColWiki

**VoColWiki's Table of Contents **
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


