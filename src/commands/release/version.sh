#! /bin/bash

name=$1
if [ "$name" == "" ]
then
  name="🐸  [OMNI-DOOR]"
fi
iterate=$2
inputVersion=$3
dot="."
OS=`uname`

replaceVersion () {
  if [ "$OS" = "Darwin" ]; then
    sed -i "" "s/$1/$2/g" "package.json"
  else
    sed -i"" "s/$1/$2/g" "package.json"
  fi
}

updateVersion () {
  versionLine=$(grep \"version\" package.json)
  version=$(echo ${versionLine} | tr -cd "[0-9-a-zA-Z]." | sed -ne "s/[^0-9]*\(\([0-9a-zA-Z]\.\)\)/\1/p")
  prevSubVersion=$(echo ${version#*.})
  subVersion=$(echo ${prevSubVersion%.*})
  subSubVersion=$(echo ${version##*.})
  if [ "$iterate" = "i" -o "$iterate" = "ignore" ]
  then
    echo -e "\n\033[33m${name} Ignoring the version of iteration \033[0m\n"
  elif [ "$iterate" = "m" -o "$iterate" = "manual" ]
  then
    newVersion=$(echo ${version/${version}/${inputVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    echo -e "\n\033[35m${name} Manual specify the version of iteration to ${manualVersion} \033[0m\n"
    replaceVersion "$versionLine" "$newVersionLine"
  elif [ "$iterate" = "a" -o "$iterate" = "auto" ]
  then
    newVersion=$(echo ${version/${version}/${inputVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    echo -e "\n\033[36m${name} Auto-increase the version of iteration to ${newVersion} \033[0m\n"
    replaceVersion "$versionLine" "$newVersionLine"
  elif [ -z "$iterate" ]
  then
    newSubSubVersion=`expr $subSubVersion + 1`
    newVersion=$(echo ${version/${dot}${subVersion}${dot}${subSubVersion}/${dot}${subVersion}${dot}${newSubSubVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    echo -e "\n\033[36m${name} Auto-increase the version of iteration to ${newVersion} \033[0m\n"
    replaceVersion "$versionLine" "$newVersionLine"
  else
    echo -e "\n\033[31m${name} Version iteration failed \033[0m\n"
    exit 1
  fi
}

updateVersion
