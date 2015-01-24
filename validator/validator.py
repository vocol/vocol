from github import Github
from github import Repository
import time
import datetime
from datetime import date
import base64
import os
from subprocess import Popen, PIPE, call
import re
import sys, getopt

g = Github("np00", "VRGGF4zf")
repo = g.get_repo("mobivoc/mobivoc")
fileType = ".ttl"
startTime = datetime.datetime(2014, 12, 1, 0, 0, 0)
endTime = datetime.datetime(2014, 12, 31, 0, 0, 0)

numberOfCommits = 0   # needed global variable

class FileReport:
	def __init__(self, fileName, sha):
        	self.fileName = fileName
		self.sha = sha
		self.editors = []
		self.errors = []

	def editorExists(self, editor):
		return editor in self.editors
	
	def addEditor(self, editor):
		self.editors.append(editor)

	def addError(self, title, lineNumber):
		self.errorDetail = ErrorDetails(title, lineNumber)		
		self.errors.append(errorDetail)

	def getErrors(self):
		return self.errors

	def getEditors(self):
		return self.editors

	def getFileName(self):
		return self.fileName

	def getSha(self):
		return self.sha

class ErrorDetails:
	def __init__(self, title, lineNumber):
		self.title = title
		self.lineNumber = lineNumber

	def setTitle(self, title):
		self.title = title

	def setLineNumber(self, lineNumber):
		self.lineNumber = lineNumber

	def getTitle(self):
		return self.title

	def getLineNumber(self):
		return self.lineNumber

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

fileReportDict = {}

def getCommits():
	commitList = repo.get_commits(since=startTime, until=endTime)
	commitCounter = getTotalCommitCount(commitList)
	counter_turtle_files_found = 0	

	for commit in commitList:
	#reverse traversel, since the list is returned with the newest first
		printDetails(commitCounter, commit)
		#create directory
		dir_name = 'c_'  + str(commitCounter)
		os.makedirs(dir_name)
		dir_path = os.path.join(os.getcwd(), dir_name)

		for file in commit.files:
			if file.filename.endswith(fileType):

				## HIER WEITERMACHEN
				global fileReportDict

				if file.filename in fileReportDict:
					print "file exists"
					if not fileReportDict[file.filename].editorExists(commit.commit.author.name):
						fileReportDict[file.filename].addEditor(commit.commit.author.name)
				else:
					fileReport = FileReport(file.filename, commit.sha)
					fileReport.addEditor(commit.commit.author.name)
					fileReportDict[file.filename] = fileReport

				print file.filename
				file_content = repo.get_contents(file.filename, ref=commit.sha)
				file_data = base64.b64decode(file_content.content)		
				full_path = os.path.join(dir_path, file.filename)
				file_out = open(full_path, "w")
				file_out.write(file_data)
				file_out.close()
	
		commitCounter = commitCounter - 1



def validate():
	max = numberOfCommits+1
	for counter in range(1, max):
		dir = 'c_' + str(counter)
		os.chdir(dir)

		files = os.listdir('.')
		for file in files:
			run_rapper(counter, file)
		os.chdir('..')


def run_rapper(counter, file):
	cmd = 'rapper -i turtle -o turtle ' + file + '> /dev/null' 
	output = Popen(cmd, stderr=PIPE, shell=True) 
	
	for line in output.stderr:
		if ".ttl:" in line:
			print file
			print os.getcwd()
                        lineNumber = re.search('.ttl:(.+?) ', line).group(1)
                        searchDef = lineNumber + ' - '
                        regex = re.escape(searchDef) + '(.+)'
                        errorText = re.search(regex, line, re.IGNORECASE).group(1)

			print errorText
			print lineNumber


			with open(file) as f:
   				 i = 1
   				 for line in f:
       				 	if i == (int(lineNumber)):
        		         		break
       				 	i += 1
			print (line)

	
			#number = int(lineNumber)
			#print "Number: " + str(number)
			#print "line: " + lines[23]
			#print lines[23]
			#print "line: " + lines[number]	
	
			#number = int(lineNumber)
			#print number
					
			#print lines[number]
			#f.close()


                        
                        # create issue
                      #  bodytext = "File " + url + " contains at line number " + lineNumber + " the following error: " + errorText 
                        
                       # print bodytext
                       # print "author: " + assignee.login
                        #repo.create_issue(title=errorText, body=bodytext, assignee=assignee.login)
                       
	
	#print 'rapper: commit: ' + str(counter) + ', file:' + file +  ', errors found: ' + str(errorCounter)


				#os.chdir(commit.sha)

				# run Validator
				#cmd = 'rapper -i turtle -o turtle ' + file.filename +  ' > /dev/null'
				#rawErrorDesc = Popen(cmd, stderr=PIPE, shell=True) 

				#processErrors(url=file.blob_url, rawErrorDesc=rawErrorDesc, assignee='np00')
				#os.chdir('..')	
		


#if new vocabulary revision exists then
#	if new vocabulary revision validates then
#		publish new human-friendly documentation ;
#		publish new machine-comprehensible LOD ;
#	else
#		if errors have not been reported already then
#			report errors to the revision author ;
#		end
#	end
#end



	
def cleanUp():
	cmd = "rm -r c_*"
	call(cmd, shell=True)


def printReport():
	print "start printReport() ________________-"

	for key in fileReportDict.keys():
		print "new report: _________________"
		print fileReportDict[key].getFileName()	
		print fileReportDict[key].getSha()
		print fileReportDict[key].getEditors()
		print fileReportDict[key].getErrors()


#	fileReport = FileReport()
#	editor = 'niklas'
#	fileReport.addEditor(editor)
#	print fileReport.editorExists('junior')
#	fileReport.addError('testError', '17')
#	print fileReport.errors[0].getTitle()
#	print fileReport.errors[0].getLineNumber()
#

getCommits()
#validate()
printReport()
cleanUp()

#test()

#def main(argv):
#   user = ''
#   password = ''
#   repository = ''
#   try:
#      opts, args = getopt.getopt(argv,"hu:p:r:",["user=","password=","repository"])
#   except getopt.GetoptError:
#      print 'test.py -u <user> -p <password> -r <repository>'
#      sys.exit(2)
#   for opt, arg in opts:
#      if opt == '-h':
#         print 'test.py -u <user> -p <password> -r <repository>'
#         sys.exit()
#      elif opt in ("-u", "--user"):
#         user = arg
#      elif opt in ("-p", "--password"):
#         password = arg
#      elif opt in ("-r", "--repository"):
#         repository = arg
#   print 'User:', user
#   print 'Repository:', repository
#
#if __name__ == "__main__":
#   main(sys.argv[1:])



