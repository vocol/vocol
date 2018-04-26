#!/bin/sh

# Subversion provides the paths we need as the sixth and seventh 
# parameters.

owl2diff ${6} ${7}

# Return an errorcode of 0 if no differences were detected, 1 if some were.
# Any other errorcode will be treated as fatal.
