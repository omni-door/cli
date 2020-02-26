#! /bin/bash

iterate=$1
name="🐸  [OMNI-DOOR]"
dot="."

updateVersion () {
  versionLine=$(grep \"version\" package.json)
  version=$(echo ${versionLine} | tr -cd "[0-9].")
  prevSubVersion=$(echo ${version#*.})
  subVersion=$(echo ${prevSubVersion%.*})
  subSubVersion=$(echo ${version##*.})
  manualVersion=$(echo "$iterate" | grep [0-9]\.[0-9]\.[0-9])
  if [ "$iterate" = "i" -o "$iterate" = "ignore" ]
  then
    echo -e "\033[33m${name}: 忽略版本号迭代 (Ignoring version iteration)\033[0m"
  elif [ -z "$iterate" ]
  then
    echo -e "\033[36m${name}: 版本号自动迭代 (Auto version iteration)\033[0m"
    newSubSubVersion=`expr $subSubVersion + 1`
    newVersion=$(echo ${version/${dot}${subVersion}${dot}${subSubVersion}/${dot}${subVersion}${dot}${newSubSubVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    sed -i "" "s/${versionLine}/${newVersionLine}/g" "package.json"
  elif [ -n "$manualVersion" ]
    then
    echo -e "\033[35m${name}: 版本号手动迭代至 ${manualVersion} (Manual version iteration to ${manualVersion})\033[0m"
    newVersion=$(echo ${version/${version}/${manualVersion}})
    newVersionLine=$(echo "${versionLine/${version}/${newVersion}}")
    sed -i "" "s/${versionLine}/${newVersionLine}/g" "package.json"
  else
    echo -e "\033[31m${name}: 请输入正确的版本号 (Please input correct version number)\033[0m"
    exit 1
  fi
}

updateVersion