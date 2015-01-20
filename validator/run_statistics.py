from github import Github, Repository
from subprocess import Popen, PIPE, call
import time, datetime, base64, os, re


######## please specify the repository and set a github user account (needed for api calls) ###########
g = Github("<user>", "<password>")
repo = g.get_repo("mobivoc/mobivoc")
fileType = ".ttl"

numberOfCommits = 0  #global variable needed

# print the details of a commit
def printDetails(counter, commit):
	print "-------------------------"
	print counter
	print "Process Commit: " + commit.sha
	print "Name: " + commit.commit.message
	print "Commit Date: " + commit.commit.committer.date.ctime()

# not the optimal way, but paginatedList can't be so easily counted
def getTotalCommitCount(commitList):
	totalCommits = 0
	for commit in commitList:
		totalCommits = totalCommits + 1

	global numberOfCommits
	numberOfCommits = totalCommits

	return totalCommits

# api call for commits & preperation of the folder structure
def getAllCommits():
	commitList = repo.get_commits()
	commitCounter = getTotalCommitCount(commitList)
	
	#reverse traversel, since the list is returned with the newest first
	for commit in commitList:
		printDetails(commitCounter, commit)
		#create directory
		dir_name = 'c_'  + str(commitCounter)
		os.makedirs(dir_name)
		dir_path = os.path.join(os.getcwd(), dir_name)

		#save all .ttl files
		for file in commit.files:
			if file.filename.endswith(fileType):
				print file.filename
				file_content = repo.get_contents(file.filename, ref=commit.sha)
				file_data = base64.b64decode(file_content.content)		
				full_path = os.path.join(dir_path, file.filename)
				file_out = open(full_path, "w")
				file_out.write(file_data)
				file_out.close()

		commitCounter = commitCounter - 1
		
# validation of turtle files using rdfcat & rapper
def validate():
	print "----rdfcat statistics----"
	max = numberOfCommits+1
	for counter in range(1, max):
		dir = 'c_' + str(counter) 
		os.chdir(dir)

		files = os.listdir('.')
		for file in files:
			run_rdfcat(counter, file)
	
		os.chdir('..')

	print "----rapper statistics----"
	for counter in range(1, max):
		dir = 'c_' + str(counter)
		os.chdir(dir)

		files = os.listdir('.')
		for file in files:
			run_rapper(counter, file)
	
		os.chdir('..')

# rdfcat validation
def run_rdfcat(x, file):
	cmd = 'rdfcat -n ' + file  + ' -out N3 >> /dev/null' 
	output = Popen(cmd, stderr=PIPE, shell=True) 
	errorCounter = 0

	for line in output.stderr:
  		if "RiotException" in line:
			errorCounter = errorCounter + 1
     	#		lineNumber = re.search('line: (.+?)', line).group(1)
	print 'rdfcat: commit: ' + str(x) + ', file:' + file +  ', errors found: ' + str(errorCounter)
		

# rapper validation
def run_rapper(x, file):
	cmd = 'rapper -i turtle -o turtle ' + file + '> /dev/null' 
	output = Popen(cmd, stderr=PIPE, shell=True) 
			
	errorCounter = 0
	for line in output.stderr:
   		if ".ttl:" in line:
			errorCounter = errorCounter + 1
      			lineNumber = re.search('.ttl:(.+?) ', line).group(1)
	
	print 'rapper: commit: ' + str(x) + ', file:' + file +  ', errors found: ' + str(errorCounter)


def cleanUp():
	cmd = "rm -r c_*"
	call(cmd, shell=True)

# prepare structure
getAllCommits()
# validate all found .ttl files
validate()
# remove all folders
cleanUp()		



