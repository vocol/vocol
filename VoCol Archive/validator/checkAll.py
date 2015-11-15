from github import Github
from github import Repository
import base64, os, sys, getopt
from subprocess import Popen, PIPE, call

repo = None

def getTurtleFiles():

        #prepare structure
        if os.path.exists("tmp/"):
                cmd = "rm -r tmp"
                call(cmd, shell=True)

        os.makedirs("tmp")
        os.chdir("tmp")
        
        ref = repo.get_git_ref('heads/master')
        
        tree = repo.get_git_tree(sha=ref.object.sha)
        
        fileList = []
        
        print "get files..."
        
        for element in tree.tree:
                if element.path.endswith('.ttl'):
                        
                        fileList.append(element.path)
                        
                        blob = repo.get_git_blob(element.sha)
                        
                        file_data = base64.b64decode(blob.content)		
                        file_out = open(element.path, "w")
                        file_out.write(file_data)
                        file_out.close()
                        
        #validate each file
        print "validate files..."

        hasSyntaxError = False
        for fileName in fileList:
                 cmd = 'rapper -i turtle -o turtle ' + fileName + '>> /dev/null' 
                 output = Popen(cmd, stderr=PIPE, shell=True)

                 for line in output.stderr:
                         if ".ttl:" in line:
                                 print "error found!"
                                 hasSyntaxError = True
        
        #if not hasSyntaxError:
             #   allFilesString = ' '.join(fileList)
             #   cmd = 'rapper -i turtle -o turtle ' + allFilesString + ' >> ../Mobivoc.ttl' 
             #   call(cmd, shell=True)

        if hasSyntaxError:
                os.chdir("..")
                cmd = "rm -r tmp"
                call(cmd, shell=True)
        

def init(user, password, repository):
     print "Checking if user exist: " + user
     g = Github(user, password)
     g.get_user(user) # some random request to check if the user can make requests
     print "User: " + user + " exists."
     print "Getting repository..."
     global repo
     repo =  g.get_repo(repository)
     print "Repository: " + repository + " exists."

     
def main(argv):
   user = ''
   password = ''
   repository = ''
   try:
      opts, args = getopt.getopt(argv,"hu:p:r:",["user","password","repository"])
   except getopt.GetoptError:
      print 'test.py -u <user> -p <password> -r <repository>'
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print 'test.py -u <user> -p <password> -r <repository>'
         sys.exit()
      elif opt in ("-u", "--user"):
         user = arg
      elif opt in ("-p", "--password"):
         password = arg
      elif opt in ("-r", "--repository"):
         repository = arg
      
   init(user, password, repository)

if __name__ == "__main__":
   main(sys.argv[1:])


getTurtleFiles()
