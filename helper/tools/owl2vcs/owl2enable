#!/bin/sh
if [ -d .git ]
then
	echo Enabling owl2vcs for this Git repository
	if grep -q "owl2diff" .git/info/attributes 2>/dev/null
	then
		echo "owl2vcs is already enabled for this Git repository"
	else
		echo "*.rdf	diff=owl2diff">>.git/info/attributes
		echo "*.ttl	diff=owl2diff">>.git/info/attributes
		echo "*.owl	diff=owl2diff">>.git/info/attributes
		git config diff.owl2diff.command "owl2diff.git.sh"
		echo "owl2vcs is now enabled for *.owl, *.rdf and *.ttl files in this Git repository."
		echo "Edit .git/info/attributes to enable it for other file types."
	fi
elif [ -d .hg ]
then
	echo "Enabling owl2vcs for this Mercurial repository"
	if grep -q "owl2diff" .hg/hgrc 2>/dev/null
	then
		echo "owl2vcs is already enabled for this Mercurial repository."
	else
		cat "$( cd "$( dirname "$0" )" && pwd )/hgrc.sample">>.hg/hgrc
		echo "owl2vcs is now enabled for *.owl, *.rdf and *.ttl files in this Mercurial repository."
		echo "Edit .hg/hgrc to enable it for other file types."
	fi
else
	echo "Current directory is neither git nor mercurial repository."
fi
