#!/bin/bash
# for auto versioning index.html
sed -I ''  "s/.*VERSIONING.*/<!--TS=$(date +%s) VERSIONING-->/g" index.html
