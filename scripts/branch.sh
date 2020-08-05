#! /bin/bash

branch=$1
name="🐸  [OMNI-DOOR/CLI]"

checkBranch () {
  if [ -z "$branch" ]; then
    echo -e "\033[31m \n ${name}: The branch parameter cannot be empty\n \033[0m"
    exit 1
  fi

  currentBranch=$(git branch | grep \* | cut -d " " -f2)

  if [ "$currentBranch" != "$branch" ]
  then
    echo -e "\033[31m \n ${name}: Please switch to \033[43;30m ${branch} \033[0m \033[31mbranch first\n \033[0m"
    exit 1
  fi

  echo -e "\033[36m \n ${name}: The current branch is ${branch}\n \033[0m"
}

checkBranch