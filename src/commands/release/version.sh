#! /bin/bash

name=$1
if [ "$name" == "" ]
then
  name="🐸  [OMNI-DOOR]"
fi
iterate=$2
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
  manualVersion=$(echo "$iterate" | grep "[0-9].[0-9]*.[0-9]")
  if [ "$iterate" = "i" -o "$iterate" = "ignore" ]
  then
    echo -e "\033[33m${name} 忽略版本号迭代 (Ignoring the version of iteration)\033[0m\n"
  elif [ -z "$iterate" ]
  then
    newSubSubVersion=`expr $subSubVersion + 1`
    newVersion=$(echo ${version/${dot}${subVersion}${dot}${subSubVersion}/${dot}${subVersion}${dot}${newSubSubVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    echo -e "\033[36m${name} 版本号自动迭代至 ${newVersion} (Auto-increase the version of iteration to ${newVersion})\033[0m\n"
    replaceVersion "$versionLine" "$newVersionLine"
  elif [ -n "$manualVersion" ]
    then
    newVersion=$(echo ${version/${version}/${manualVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    echo -e "\033[35m${name} 版本号手动迭代至 ${manualVersion} (Manual specify the version of iteration to ${manualVersion})\033[0m\n"
    replaceVersion "$versionLine" "$newVersionLine"
  else
    echo -e "\033[31m${name} 请输入正确的版本号 (Please input correct version number)\033[0m\n"
    exit 1
  fi
}

updateVersion