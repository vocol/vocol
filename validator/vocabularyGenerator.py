from github import Github
from github import Repository
import base64, os, sys, getopt, datetime
from subprocess import Popen, PIPE, call

repo = None
interval = 1 #default 1 minute

def getTurtleFiles():
	### Have there been any changes?  

	# GitHub uses utc time
 	endTime = datetime.datetime.utcnow()
        startTime = endTime - datetime.timedelta(seconds=60*int(interval))

        commitList = repo.get_commits(since=startTime, until=endTime)
        page = commitList.get_page(0)

        if len(page) == 0:
                print "No new commits found" 
		return 

        ######################################################
        #prepare structure
        if os.path.exists("tmp"):
                cmd = "rm -r tmp"
                call(cmd, shell=True)

        os.makedirs("tmp")
        os.chdir("tmp")
        
        ref = repo.get_git_ref('heads/master')
        tree = repo.get_git_tree(sha=ref.object.sha)

        #######################################################
        print "get files..."
        fileList = []
        
        for element in tree.tree:
                if element.path.endswith('.ttl'):
                        fileList.append(element.path)
                        blob = repo.get_git_blob(element.sha)
                        file_data = base64.b64decode(blob.content)		
                        file_out = open(element.path, "w")
                        file_out.write(file_data)
                        file_out.close()

        ######################################################                        
        #validate each file
        print "validate files..."

        ntFileList = []
        hasSyntaxError = False

        for fileName in fileList:
                 cmd = 'rapper -i turtle -o ntriples ' + fileName + ' >> ' + fileName + '.nt'
                 ntFileList.append(fileName + '.nt')
                 output = Popen(cmd, stderr=PIPE, shell=True)

                 for line in output.stderr:
                         if ".ttl:" in line:
                                 hasSyntaxError = True


        if not hasSyntaxError:
                # clean up
                cmd = "rm -r *.ttl"
                call(cmd, shell=True)

                # create a single file
                cmd = "cat * > Mobivoc.nt"
                call(cmd, shell=True)

                print "No errors found" 
                # convert to Turtle
                cmd = "rapper -i ntriples -o ntriples Mobivoc.nt >> ../deploy/Mobivoc.ttl" 
                call(cmd, shell=True)

                print "Creation of a new vocabulary version was successful"
        else:
                print "The vocabulary contains errors: No new version was created"

     
def init(client_id, client_secret, repository, intervalInMin):
     print "Checking if client_id exist: " + client_id
     g = Github(client_id=client_id, client_secret=client_secret)
     print "Getting repository..."
     global repo
     repo =  g.get_repo(repository)
     print "Repository: " + repository + " exists."
     global interval
     interval = intervalInMin

     
def main(argv):
   try:
      opts, args = getopt.getopt(argv,"hc:s:r:i:",["client_id", "client_secret", "repository", "interval"])
   except getopt.GetoptError:
      print 'vocabularyGenerator.py -c <client_id> -s <client_secret> -r <repository>'
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print 'vocabularyGenerator.py -c <client_id> -s <client_secret> -r <repository>'
         sys.exit()
      elif opt in ("-c", "--client_id"):
         client_id = arg
      elif opt in ("-r", "--repository"):
         repository = arg
      elif opt in ("-i", "--interval"):
         intervalInMin = arg
      elif opt in ("-s", "--client_secret"):
         client_secret = arg

   init(client_id, client_secret, repository, intervalInMin)

if __name__ == "__main__":
   main(sys.argv[1:])

getTurtleFiles()


