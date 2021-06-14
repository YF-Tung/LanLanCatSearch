#!/bin/bash
# for auto versioning index.html
cat index.html | sed "s/.*VERSIONING.*/<!--TS=$(date +%s) VERSIONING-->/g" > index2.html
