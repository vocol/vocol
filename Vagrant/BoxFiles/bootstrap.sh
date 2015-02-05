#!/usr/bin/env bash
# update system and install tools like below :
sudo apt-get update
sudo apt-get --yes install apache2
sudo apt-get -y install wget
sudo apt-get -y install curl
sudo apt-get -y install unzip
# TODO on SUSE: zypper install java-1_7_0-openjdk-devel
# TODO on SLES: first run zypper addrepo http://download.opensuse.org/repositories/Java:/Factory/SLE_11_SP3/Java:Factory.repo
sudo apt-get -y install openjdk-7-jdk
# TODO on SLES: first run zypper addrepo  http://download.opensuse.org/repositories/devel:/tools:/scm/SLE_11_SP3/devel:tools:scm.repo
sudo apt-get -y install git
sudo apt-get -y install python
sudo apt-get -y install python-pip
sudo apt-get -y install make
# TODO on SUSE: zypper install python-PyGithub
# TODO on SLES: first run zypper addrepo http://download.opensuse.org/repositories/devel:/languages:/python/SLE_11_SP3/devel:languages:python.repo
sudo pip install PyGithub

# TODO at some point, when no root permission is necessary any more, execute the further commands as user "vagrant"

# setup the system variables
export LC_ALL=en_US.UTF-8
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/
echo "export LC_ALL=en_US.UTF-8" >> .bashrc
echo "export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/" >> .bashrc
echo "export JENAROOT=/usr/local/bin/apache-jena-2.12.0" >> .bashrc
echo "export PATH=$PATH:/usr/local/bin/provToolbox/bin:/usr/local/bin/apache-jena-2.12.0/bin" >> .bashrc
echo "update-alternatives --set java /usr/lib/jvm/java-7-openjdk-amd64/jre/bin/java" >> .bashrc

#download and unzip appache-jena
curl -O http://apache.websitebeheerjd.nl//jena/binaries/apache-jena-2.12.1.zip  
unzip apache-jena-2.12.1.zip

#install latest version of rapper
curl -O http://download.librdf.org/source/raptor2-2.0.15.tar.gz
tar -zxvf raptor2-2.0.15.tar.gz
cd raptor2-2.0.15
# TODO on SLES: first run zypper addrepo http://download.opensuse.org/repositories/home:/tanty:/openSUSEBackports/SLE_11_SP3/home:tanty:openSUSEBackports.repo
sudo apt-get install libxml2-dev libxslt1-dev python-dev
sudo ./configure
sudo make
sudo make install
sudo apt-get -y install raptor2-utils
cd ..

#download and unzip google_appengine
curl -O https://storage.googleapis.com/appengine-sdks/featured/google_appengine_1.9.17.zip
unzip google_appengine_1.9.17.zip

#clone repositories like below
git clone https://github.com/rvguha/schemaorg.git
#(cd schemaorg; git checkout 1a0ba4ddf551a66ab51462b07b0400dbfcd2b60d)
git clone https://github.com/mobivoc/mobivoc.git
git clone https://github.com/mobivoc/vocol.git

#download and unzip Jena Fuseki
curl -O http://mirror.dkd.de/apache//jena/binaries/jena-fuseki-1.1.1-distribution.tar.gz
tar xf jena-fuseki-1.1.1-distribution.tar.gz

#move libraries of appache-jena to src folder of HTML Documentation Generator
sudo mv apache-jena-2.12.1/lib/* vocol/HtmlGenerator/src/

#go to java source file of HTML Documentation Generator
cd vocol/HtmlGenerator/src/

#Compile HTML Documentation Generator
sudo javac -cp .:jena-arq-2.12.1.jar:jena-core-2.12.1.jar:jena-iri-1.1.1.jar:log4j-1.2.17.jar:slf4j-api-1.7.6.jar:xercesImpl-2.11.0.jar:xml-apis-1.4.01.jar HtmlGenerator.java

#run HTML Documentation Generator
sudo java -cp .:jena-arq-2.12.1.jar:jena-core-2.12.1.jar:jena-iri-1.1.1.jar:log4j-1.2.17.jar:slf4j-api-1.7.6.jar:xercesImpl-2.11.0.jar:xml-apis-1.4.01.jar HtmlGenerator ~/mobivoc/ChargingPoints.ttl ~/schemaorg/data/schema.rdfa ~/vocol/HtmlGenerator/Templates/template.html ~/schemaorg/docs/schemas.html ~/vocol/HtmlGenerator/Templates/schemasTemplate.html

#Configuring Apache
sudo rm /etc/apache2/sites-enabled/000-default
sudo cp ~/vocol/Vagrant/Apache/000-default.conf /etc/apache2/sites-enabled/000-default.conf

sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite

sudo /etc/init.d/apache2 restart

#add a cronjob to excecute every 5 min
cat <(crontab -l) <(echo "*/5 * * * * bash $HOME/vocol/HtmlGenerator/HowTo/RepeatedJobs.sh") | crontab -

#run Schema.org through Google_AppEngine 
/home/vagrant/google_appengine/dev_appserver.py /home/vagrant/schemaorg/app.yaml --skip_sdk_update_check &

#go to java source file of HTML Documentation Generator
cd /home/vagrant/jena-fuseki-1.1.1/
#sudo chmod -R 777 .
chmod +x fuseki-server s-*

#run fuseki
./fuseki-server --update --file=/home/vagrant/mobivoc/ChargingPoints.ttl /myDataset
