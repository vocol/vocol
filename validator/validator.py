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

g = Github("np00", "EcuYr1m")
repo = g.get_repo("mobivoc/mobivoc")
fileType = ".ttl"
startTime = datetime.datetime(2014, 12, 1, 0, 0, 0)
endTime = datetime.datetime(2014, 12, 5, 0, 0, 0)

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

	def addError(self, errorDesc, errorLine, lineText):
		newError = ErrorDetails(errorDesc, errorLine, lineText)		
		self.errors.append(newError)

	def getErrors(self):
		return self.errors

	def getEditors(self):
		return self.editors

	def getFileName(self):
		return self.fileName

	def getSha(self):
		return self.sha

class ErrorDetails:
	def __init__(self, errorText, errorLine, lineText):
		self.errorText = errorText
		self.errorLine = errorLine
		self.lineText = lineText

	def setErrorText(self, errorText):
		self.errorText = errorText

	def setLineNumber(self, lineNumber):
		self.errorLine = lineNumber

	def getTitle(self):
		return self.errorText

	def errorLine(self):
		return self.errorLine

	def getLineNumber(self):
		return self.lineText

def printDetails(counter, commit):
	print "-------------------------"
	print counter
	print "Process Commit: " + commit.sha
	print "Message: " + commit.commit.message
	print "Committer: " + commit.commit.author.name
	print "Date: " + commit.commit.committer.date.ctime()

# not the optimal way, but paginatedList can't be so easily counted
def getTotalCommitCount(commitList):
	totalCommits = 0
	for commit in commitList:
		totalCommits = totalCommits + 1

	global numberOfCommits
	numberOfCommits = totalCommits

	return totalCommits

fileReportDict = {}

# collect necessary commit data for later processing
def collectCommitData():
	commitList = repo.get_commits(since=startTime, until=endTime)
	commitCounter = getTotalCommitCount(commitList)
	counter_turtle_files_found = 0	
	
	# iterate through all commits
	for commit in commitList:
		printDetails(commitCounter, commit)

		# check for commits in which vocabulary files were changed
		for file in commit.files:
			if file.filename.endswith(fileType):
				global fileReportDict

				# save details about these files (editor, sha)
				if file.filename in fileReportDict:
					if not fileReportDict[file.filename].editorExists(commit.commit.author.name):
						fileReportDict[file.filename].addEditor(commit.commit.author.name)
				else:
					fileReport = FileReport(file.filename, commit.sha)
					fileReport.addEditor(commit.commit.author.name)
					fileReportDict[file.filename] = fileReport
	
		commitCounter = commitCounter - 1

# Get a specific line from a file
def getLineText(fileName, lineNr):
	print "getlineText _________________"
	print "file: " + fileName
	print "line number: " + lineNr

	with open(fileName) as f:
   		i = 1
    		for line in f:
        		if i == (int(lineNr)):
            			break
        		i += 1
	print (line)

# validate details
def validate():
	# create folder structure
	os.makedirs("tmp")
	os.chdir("tmp")

	global fileReportDict

	# download files
	for key in fileReportDict.keys():
		filename = fileReportDict[key].getFileName()
		sha = fileReportDict[key].getSha()
		file_content = repo.get_contents(filename, ref=sha)
		file_data = base64.b64decode(file_content.content)		
		file_out = open(filename, "w")
		file_out.write(file_data)
		file_out.close()
		
		# validate each file
		cmd = 'rapper -i turtle -o turtle ' + filename + '> /dev/null' 
		output = Popen(cmd, stderr=PIPE, shell=True) 		

		for line in output.stderr:
			if ".ttl:" in line:
				# error found -> processing
                	        lineNumber = re.search('.ttl:(.+?) ', line).group(1)
                	        searchDef = lineNumber + ' - '
                	        regex = re.escape(searchDef) + '(.+)'
                	        errorText = re.search(regex, line, re.IGNORECASE).group(1)
				lineText = getLineText(filename, lineNumber)
				fileReportDict[filename].addError(errorText, lineNumber, lineText)
		


	
def cleanUp():
	cmd = "rm -r tmp/"
	call(cmd, shell=True)


def printReport():
	print "start printReport() ________________-"

	for key in fileReportDict.keys():
		print "new report: _________________"
		print fileReportDict[key].getFileName()	
		print fileReportDict[key].getSha()
		print fileReportDict[key].getEditors()
		print fileReportDict[key].getErrors()
		for error in fileReportDict[key].getErrors():
			print error.getTitle()


#	fileReport = FileReport()
#	editor = 'niklas'
#	fileReport.addEditor(editor)
#	print fileReport.editorExists('junior')
#	fileReport.addError('testError', '17')
#	print fileReport.errors[0].getTitle()
#	print fileReport.errors[0].getLineNumber()
#

collectCommitData()
validate()
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



