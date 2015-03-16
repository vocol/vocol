# Turtle Editing in the Browser with Syntax Checking and Highlighting

## It's working!

[Click and try out the little demo.](https://rawgit.com/mobivoc/vocol/master/TurtleEditor/github-ttl-editor.html)
Currently the first syntax error is found and the cursor jumps to the
line where the error is. So the workflow would be to correct the error
and click the button *Check syntax* again.

The source code is in the directory
[TurtleEditor](https://github.com/mobivoc/vocol/tree/master/TurtleEditor)
in the `vocol` repository.

Some open source libraries are included. Licenses can be found in the
source files. Tested with Chromium 39 and Firefox 35.

## Further ideas

This demo provides syntax checking. How can we deal with semantic checking?

Just implement all kinds of semantic checks as web services running on
some server. Extend the demo webapp with additional button(s) to send
the current file to one or more of these web services for checking.

This will provide immediate feedback in the browser,
allowing the user to edit the file accordingly.

