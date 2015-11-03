#!/bin/bash
echo "Deploy to Docker server..."
cd dist
cp ../.env .
cp ../.static .
git init
git remote add deploy dokku@athina.med.duth.gr:carre-entry-system
git add .
git commit -am"deploy"
git push -f deploy master