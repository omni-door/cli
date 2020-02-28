#! /bin/bash

branch=$1
name=$2

if [ "$name" == "" ]
then
  name="🐸  [OMNI-DOOR]"
fi

checkBranch () {
  if [ -z "$branch" ]; then
    echo -e "\033[31m \n ${name} 分支不能为空 (The branch cannot be empty)\n \033[0m"
    exit 1
  fi

  currentBranch=$(git branch | grep \* | cut -d " " -f2)

  if [ "$currentBranch" != "$branch" ]
  then
    if [ "$currentBranch" == "" ]
    then
      echo -e "\033[31m \n ${name} 请先初始化 git 仓库并手动完成第一次推送 (Please initialize git repository and finishing the first push operation by yourself)\n \033[0m"
    else
      echo -e "\033[31m \n ${name} 请切换到 \033[43;30m ${branch} \033[0m \033[31m分支进行发布 (Please switch to \033[43;30m ${branch} \033[0m \033[31mbranch first)\n \033[0m"
    fi
    exit 1
  fi

  echo -e "\033[36m \n ${name} 当前分支为 ${branch} (The current branch is ${branch})\n \033[0m"
}

checkBranch