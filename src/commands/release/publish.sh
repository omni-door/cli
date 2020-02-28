#! /bin/bash
name=$1

if [ "$name" == "" ]
then
  name="🐸  [OMNI-DOOR]"
fi

npm publish

echo -e "\033[35m${name}: npm包发布成功！(npm-package publish success!)\033[0m"