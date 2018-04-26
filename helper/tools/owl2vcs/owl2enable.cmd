@echo off
setlocal enabledelayedexpansion
if exist .git (
	echo Enabling owl2vcs for this Git repository
	findstr "owl2diff" .git\info\attributes > nul 2> nul
	if errorlevel 1 (
		echo *.rdf	diff=owl2diff>>.git/info/attributes
		echo *.ttl	diff=owl2diff>>.git/info/attributes
		echo *.owl	diff=owl2diff>>.git/info/attributes
		git config diff.owl2diff.command "owl2diff.git.sh"
		echo owl2vcs is now enabled for *.owl, *.rdf and *.ttl files in this Git repository.
		echo Edit .git/info/attributes to enable it for other file types.
	) else (
		echo owl2vcs is already enabled for this Git repository.
	)
) else if exist .hg (
	echo Enabling owl2vcs for this Mercurial repository
	findstr "owl2diff" .hg\hgrc >nul 2>nul
	if errorlevel 1 (
		for /f "usebackq delims=" %%i in ("%~dp0hgrc.sample") do (
			set line=%%i
			echo !line: owl2diff= "%~dp0owl2diff.cmd"!>>.hg/hgrc
		)
		echo owl2vcs is now enabled for *.owl, *.rdf and *.ttl files in this Mercurial repository.
		echo Edit .hg/hgrc to enable it for other file types.
	) else (
		echo owl2vcs is already enabled for this Mercurial repository.
	)
) else (
	echo Current directory is neither git nor mercurial repository.
)
