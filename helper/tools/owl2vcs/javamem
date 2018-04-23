#!/bin/sh
mem=5000
while [ 1 ]
do
    java "-Xmx"$mem"m" -version > /dev/null 2>&1
    if [ $? -eq 0 ]
    then
        break
    fi
    mem=`expr $mem - 100`
    if [ $mem -lt 100 ]
    then
        # something went wrong with our test
        mem=700
        break
    fi
done

echo $mem
