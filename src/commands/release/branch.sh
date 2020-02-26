#! /bin/bash

name="🐸  [OMNI-DOOR]"
branch=$1

checkBranch () {
  if [ -z "$branch" ]; then
    echo -e "\033[31m \n ${name}: 分支不能为空 (The branch cannot be empty)\n \033[0m"
    exit 1
  fi

  currentBranch=$(git branch | grep \* | cut -d " " -f2)

  if [ "$currentBranch" != "$branch" ]
  then
    echo -e "\033[31m \n ${name}: 请切换到\033[43;30m ${branch} \033[0m \033[31m分支进行发布 (Please switch to \033[43;30m ${branch} \033[0m \033[31mbranch first)\n \033[0m"
    exit 1
  fi

  echo -e "\033[36m \n ${name}: 当前分支为 ${branch} (The current branch is ${branch})\n \033[0m"
}

checkBranch