#Copy implemented hooks 
for file in `ls -1 VoColClient/Hooks`
do
 if [ $file != "InstallHooks.sh" ]; then
   cp VoColClient/Hooks/$file .git/hooks/$file

   if [ "$OSTYPE" != "msys" ]; then
     echo "Please write your admin password to allow execute permission for git hook: "$file
     sudo chmod +x .git/hooks/$file
   fi

 fi
done

#Ignore tools folder using .gitignore
if [ ! -e ".gitignore" ]; then
  touch .gitignore
  echo "VoColClient/" >> .gitignore
else
  if ! grep -q "VoColClient" ".gitignore"; then
   echo "VoColClient/" >> .gitignore
  fi
fi

echo "Hooks are successfully installed."
