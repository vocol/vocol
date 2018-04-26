@echo off
for /f %%a in ('"%~dp$PATH:0javamem.cmd"') do @set mem=%%a
java -Xmx%mem%m -cp "%~dp$PATH:0owl2vcs.jar" owl2vcs.tools.Diff %*
