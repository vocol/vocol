from subprocess import Popen, PIPE, call
import re
import os

def iterator():
	for x in range(1, 62):
		dir = str(x)
		os.chdir(dir)
		#print os.getcwd()

		files = os.listdir('.')
		for file in files:
			#run_rdfcat(x, file)
			run_rapper(x, file)
		os.chdir('..')


# -------- RDFCAT
def run_rdfcat(x, file):
	cmd = 'rdfcat -n ' + file + ' -out N3 >> /dev/null' 
	output = Popen(cmd, stderr=PIPE, shell=True) 
	errorCounter = 0
	for line in output.stderr:
   		if "Exception in thread" in line:
			errorCounter = errorCounter + 1
      			lineNumber = re.search('line: (.+?)', line).group(1)
			print 'commit: ' + str(x) + ' ,file:' + file +  ' ,errors found: ' + str(errorCounter)


# -------- RAPPER 
def run_rapper(x, file):
	cmd = 'rapper -i turtle -o turtle ' + file + '> /dev/null'  #   '> report_' + f 
	output = Popen(cmd, stderr=PIPE, shell=True) 
			
	errorCounter = 0
	for line in output.stderr:
   		if ".ttl:" in line:
			errorCounter = errorCounter + 1
      			lineNumber = re.search('.ttl:(.+?) ', line).group(1)
			print 'commit: ' + str(x) + ' ,file:' + file +  ' ,errors found: ' + str(errorCounter)


iterator()
