from subprocess import Popen, PIPE

cmd = 'rapper -i turtle -o turtle test_file_with_errors.ttl > new_parking.ttl'
output = Popen(cmd, stderr=PIPE, shell=True) 

for line in output.stderr:
   if ".ttl:" in line:
	print line  




#try:
    #prints results
  #  result = subprocess.check_output("echo %USERNAME%", stderr=subprocess.STDOUT, shell=True)
  #  print result
    #causes error
#    cmd = 'rapper -i turtle -o turtle  error_parking.ttl > new_parking.ttl'
 #   result = subprocess.check_output(cmd, shell=True)
#except subprocess.CalledProcessError, ex:
 #   print "--------error------"
  #  print ex.cmd
   # print ex.message
    #print ex.returncode
   # print ex.output
