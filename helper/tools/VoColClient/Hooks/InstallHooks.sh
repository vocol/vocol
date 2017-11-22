#Copy implemented hooks 
for file in `ls -1 .`
do
 if [ $file != "InstallHooks.sh" ]; then
   cp ./$file ../.git/hooks/$file

   if [ "$OSTYPE" != "msys" ]; then
     echo "Please write your admin password to allow execute permission for git hook: "$file
     sudo chmod +x ../.git/hooks/$file
   fi

 fi
done

echo "Hooks are successfully installed."
