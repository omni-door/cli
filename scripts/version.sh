#! /bin/bash

iterate=$1
name="🐸  [OMNI-DOOR/CLI]"
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
  version=$(echo ${versionLine} | tr -cd "[0-9].")
  prevSubVersion=$(echo ${version#*.})
  subVersion=$(echo ${prevSubVersion%.*})
  subSubVersion=$(echo ${version##*.})
  manualVersion=$(echo "$iterate" | grep [0-9]\.[0-9]\.[0-9])
  if [ "$iterate" = "i" -o "$iterate" = "ignore" ]
  then
    echo -e "\033[33m${name}: Ignoring the version of iteration\033[0m"
  elif [ -z "$iterate" ]
  then
    newSubSubVersion=`expr $subSubVersion + 1`
    newVersion=$(echo ${version/${dot}${subVersion}${dot}${subSubVersion}/${dot}${subVersion}${dot}${newSubSubVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    echo -e "\033[36m${name}: Auto-increase the version of iteration to ${newVersion}\033[0m"
    replaceVersion "$versionLine" "$newVersionLine"
  elif [ -n "$manualVersion" ]
    then
    newVersion=$(echo ${version/${version}/${manualVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    echo -e "\033[35m${name}: Manual specify the version of iteration to ${manualVersion}\033[0m"
    replaceVersion "$versionLine" "$newVersionLine"
  else
    echo -e "\033[41;37m${name}: Please input correct version number\033[0m"
    exit 1
  fi
}

updateVersion

exec "./scripts/publish.sh"