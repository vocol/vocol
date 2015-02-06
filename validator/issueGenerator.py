from github import Github
from github import Repository
import time, datetime, base64, os, re, sys, getopt
from datetime import date
from subprocess import Popen, PIPE, call

repo = None
fileType = ".ttl"
numberOfCommits = 0   # needed global variable
interval = 1 #default 1min

class FileReport:
	def __init__(self, fileName, sha, url):
        	self.fileName = fileName
		self.sha = sha
		self.editors = []
		self.errors = []
		self.link = url

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

	def getLink(self):
		return self.link

class ErrorDetails:
	def __init__(self, errorText, errorLine, lineText):
		self.errorText = errorText
		self.errorLine = errorLine
		self.lineText = lineText

	def setErrorText(self, errorText):
		self.errorText = errorText

	def setLineNumber(self, lineNumber):
		self.errorLine = lineNumber

	def getErrorText(self):
		return self.errorText

	def getErrorLine(self):
		return self.lineText

	def getLineNumber(self):
		return self.errorLine

def printDetails(commit):
	print "-------------------------"
	print "Process Commit: " + commit.sha
	print "Message: " + commit.commit.message
	print "Committer: " + commit.commit.author.name
	print "Date: " + commit.commit.committer.date.ctime()

fileReportDict = {}

# collect necessary commit data for later processing
def collectCommitData():
 	# GitHub uses utc time
 	endTime = datetime.datetime.utcnow()
        startTime = endTime - datetime.timedelta(seconds=60*int(interval))

        commitList = repo.get_commits(since=startTime, until=endTime)
        page = commitList.get_page(0)

        if len(page) == 0:
                print "No new commits found" 
		return 
	
	# iterate through all commits
	for commit in commitList:
		printDetails(commit)

		# check for commits in which vocabulary files were changed
		for file in commit.files:
			if file.filename.endswith(fileType):
				global fileReportDict

				# print "commit.committer.login = " + commit.committer.login
				# print "commit.committer.name = " + commit.committer.name
				# print "commit.author.login = " + commit.author.login
				# print "commit.author.name = " + commit.author.name

				# save details about these files (editor, sha)
				if file.filename in fileReportDict:
					if not fileReportDict[file.filename].editorExists(commit.author.login):
						fileReportDict[file.filename].addEditor(commit.author.login)
				else:
					fileReport = FileReport(file.filename, commit.sha, file.blob_url)
					fileReport.addEditor(commit.author.login)
					fileReportDict[file.filename] = fileReport

# Get a specific line from a file
def getLineText(fileName, lineNr):
	with open(fileName) as f:
   		i = 1
    		for line in f:
                        if i == (int(lineNr)):
            			break
        		i += 1
	return (line)


def validate():
        #prepare structure
        if os.path.exists("tmp"):
            cmd = "rm -r tmp"
	    call(cmd, shell=True)

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
				# save error data
                	        lineNumber = re.search('.ttl:(.+?) ', line).group(1)
                	        searchDef = lineNumber + ' - '
                	        regex = re.escape(searchDef) + '(.+)'
                	        errorText = re.search(regex, line, re.IGNORECASE).group(1)
				lineText = getLineText(filename, lineNumber)
				fileReportDict[filename].addError(errorText, lineNumber, lineText)
		
	


def generateIssues():
        print "------------------------------------------"
	print "start generating Issues"	
	
	labels = [repo.get_label("syntax error")]

	issueList = repo.get_issues(state='open', labels=labels)
        
	for fileReport in fileReportDict.keys():
		for error in fileReportDict[fileReport].getErrors():
			
			issueTitle = "[" + fileReportDict[fileReport].getFileName() + "] " + error.getErrorText() 
			# check if issue List contains errors 	
			issueExist = False
			
			for issue in issueList:
				if issueTitle == issue.title:
					
					print "Issuereport already found for error: " + error.getErrorText()
					issueExist = True

					# TODO Improve "existing issue detection" with better REGEX
					#body = issue.body;
					#print body
					#lineText = re.search('` \\n(.+?) \\n', body)
					#print lineText
					#print "title is equal"	

			# no issue found: generate new issue
			if not issueExist:
				print "Issuereport generated for: " + error.getErrorText() 
				issueBody = "**Original Line:** \n ``` \n" + error.getErrorLine() + " \n ``` \n **File:** " + fileReportDict[fileReport].getLink() + "#L" + error.getLineNumber() + "; \n"
			
				editorString = "**Person(s) who edited the file:** "
				for editor in fileReportDict[fileReport].getEditors():
					editorString += "@" + editor + " "

				issueBody += editorString 
				
				print fileReportDict[fileReport].getEditors()[0]
				# repo.create_issue(title=issueTitle, body=issueBody, labels=labels, assignee=fileReportDict[fileReport].getEditors()[0])
				repo.create_issue(title=issueTitle, body=issueBody, labels=labels)



def cleanUp():
	os.chdir('..')
	cmd = "rm -r tmp"
	call(cmd, shell=True)


def init(client_token, repository, intervalInMin):
     print "Checking if client_token exists: " + client_token
     g = Github(login_or_token=client_token)
     print "Getting repository..."
     global repo
     repo =  g.get_repo(repository)
     print "Repository: " + repository + " exists."
     global interval
     interval = intervalInMin

     
def main(argv):
   try:
      opts, args = getopt.getopt(argv,"ht:r:i:",["client_token", "repository", "interval"])
   except getopt.GetoptError:
      print 'issueGenerator.py -t <client_token> -r <repository>'
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print 'issueGenerator.py -t <client_token> -r <repository>'
         sys.exit()
      elif opt in ("-t", "--client_token"):
         client_token = arg
      elif opt in ("-r", "--repository"):
         repository = arg
      elif opt in ("-i", "--interval"):
         intervalInMin = arg

   init(client_token, repository, intervalInMin)

if __name__ == "__main__":
   main(sys.argv[1:])

collectCommitData()
validate()

if not (len(fileReportDict) == 0):
    generateIssues()

cleanUp()
