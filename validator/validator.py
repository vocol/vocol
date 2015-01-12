from github import Github
from github import Repository
import time
import datetime
from datetime import date
import base64
import os
from subprocess import Popen, PIPE, call
import re


g = Github("np00", "B1smarck")
repo = g.get_repo("mobivoc/mobivoc")
fileType = ".ttl"
#startTime = datetime.datetime(2013, 1, 1, 0, 0, 0)
#endTime = datetime.datetime(2014, 12, 31, 0, 0, 0)



def printDetails(commit):
	print "-------------------------"
	print "Process Commit: " + commit.sha
	print "Name: " + commit.commit.message
	print "Commit Date: " + commit.commit.committer.date.ctime()


def processErrors(url, rawErrorDesc, assignee):
	print rawErrorDesc.stderr
	for line in rawErrorDesc.stderr:
   		if ".ttl:" in line:
      			print 'full line: %s' % line
      			lineNumber = re.search('.ttl:(.+?) ', line).group(1)
      			print lineNumber
      			searchDef = lineNumber + ' - '
      			regex = re.escape(searchDef) + '(.+)'
      			errorText = re.search(regex, line, re.IGNORECASE).group(1)
			
			# create issue
			bodytext = "File " + url + " contains at line number " + lineNumber + " the following error: " + errorText 
			
			print bodytext
			print "author: " + assignee.login
			repo.create_issue(title=errorText, body=bodytext, assignee=assignee.login)
      			


def checkForCommits():
	#commitList = repo.get_commits(since=startTime, until=endTime)
	commitList = repo.get_commits()
	counter = 0
	
	for commit in commitList:
		counter = counter + 1
		print counter

		printDetails(commit)

		dir_name = str(counter) # + '_' + commit.sha
		os.makedirs(dir_name)
		dir_path = os.path.join(os.getcwd(), dir_name)
		print commit.commit.committer.name
		print dir_path

		for file in commit.files:
			if file.filename.endswith(fileType):
				file_content = repo.get_contents(file.filename, ref=commit.sha)
				file_data = base64.b64decode(file_content.content)		
				full_path = os.path.join(dir_path, file.filename)
				file_out = open(full_path, "w")
				file_out.write(file_data)
				file_out.close()

				#os.chdir(commit.sha)

				# run Validator
				#cmd = 'rapper -i turtle -o turtle ' + file.filename +  ' > /dev/null'
				#rawErrorDesc = Popen(cmd, stderr=PIPE, shell=True) 

				#processErrors(url=file.blob_url, rawErrorDesc=rawErrorDesc, assignee='np00')
				#os.chdir('..')	
						

checkForCommits()
		




	#commitCmd = ' curl -u \"np00\" -d \'{ \"title\": \"' + errorText +   '\", \"body\": \"Line number ' + lineNumber  + ' consists of the following Error: ' + errorText +  '\", \"assignee\": \"np00\"}\' https://api.github.com/repos/mobivoc/vocol/issues'
