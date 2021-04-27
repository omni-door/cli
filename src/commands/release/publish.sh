#! /bin/bash
name=$1

if [ "$name" == "" ]
then
  name="🐸  [OMNI-DOOR]"
fi

npm publish --registry='https://registry.npmjs.org/'

echo -e "\033[35m${name} The npm-package publish success!\033[0m"
echo -e "\033[35m${name} npm包发布成功！\033[0m"