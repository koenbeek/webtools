#!/usr/bin/env bash
# NO checks !!! - should really check if local and remote are synched first !

# Accepts a version string and prints it incremented by one.
# Usage: increment_version <version> [<position>] [<leftmost>]
increment_version() {
   local usage=" USAGE: $FUNCNAME [-l] [-t] <version> [<position>] [<leftmost>]
           -l : remove leading zeros
           -t : drop trailing zeros
    <version> : The version string.
   <position> : Optional. The position (starting with one) of the number 
                within <version> to increment.  If the position does not 
                exist, it will be created.  Defaults to last position.
   <leftmost> : The leftmost position that can be incremented.  If does not
                exist, position will be created.  This right-padding will
                occur even to right of <position>, unless passed the -t flag."

   # Get flags.
   local flag_remove_leading_zeros=0
   local flag_drop_trailing_zeros=0
   while [ "${1:0:1}" == "-" ]; do
      if [ "$1" == "--" ]; then shift; break
      elif [ "$1" == "-l" ]; then flag_remove_leading_zeros=1
      elif [ "$1" == "-t" ]; then flag_drop_trailing_zeros=1
      else echo -e "Invalid flag: ${1}\n$usage"; return 1; fi
      shift; done

   # Get arguments.
   if [ ${#@} -lt 1 ]; then echo "$usage"; return 1; fi
   local v="${1}"             # version string
   local targetPos=${2-last}  # target position
   local minPos=${3-${2-0}}   # minimum position

   # Split version string into array using its periods. 
   local IFSbak; IFSbak=IFS; IFS='.' # IFS restored at end of func to                     
   read -ra v <<< "$v"               #  avoid breaking other scripts.

   # Determine target position.
   if [ "${targetPos}" == "last" ]; then 
      if [ "${minPos}" == "last" ]; then minPos=0; fi
      targetPos=$((${#v[@]}>${minPos}?${#v[@]}:$minPos)); fi
   if [[ ! ${targetPos} -gt 0 ]]; then
      echo -e "Invalid position: '$targetPos'\n$usage"; return 1; fi
   (( targetPos--  )) || true # offset to match array index

   # Make sure minPosition exists.
   while [ ${#v[@]} -lt ${minPos} ]; do v+=("0"); done;

   # Increment target position.
   v[$targetPos]=`printf %0${#v[$targetPos]}d $((10#${v[$targetPos]}+1))`;

   # Remove leading zeros, if -l flag passed.
   if [ $flag_remove_leading_zeros == 1 ]; then
      for (( pos=0; $pos<${#v[@]}; pos++ )); do
         v[$pos]=$((${v[$pos]}*1)); done; fi

   # If targetPosition was not at end of array, reset following positions to
   #   zero (or remove them if -t flag was passed).
   if [[ ${flag_drop_trailing_zeros} -eq "1" ]]; then
        for (( p=$((${#v[@]}-1)); $p>$targetPos; p-- )); do unset v[$p]; done
   else for (( p=$((${#v[@]}-1)); $p>$targetPos; p-- )); do v[$p]=0; done; fi

   echo "${v[*]}"
   IFS=IFSbak
   return 0
}


# EXAMPLE     ------------->      # RESULT
# increment_version 1             # 2
# increment_version 1 2           # 1.1
# increment_version 1 3           # 1.0.1
# increment_version 1.0.0         # 1.0.1
# increment_version 1.2.3.9       # 1.2.3.10
# increment_version 00.00.001     # 00.00.002
# increment_version -l 00.001     # 0.2
# increment_version 1.1.1.1 2     # 1.2.0.0
# increment_version -t 1.1.1 2    # 1.2
# increment_version v1.1.3        # v1.1.4
# increment_version 1.2.9 2 4     # 1.3.0.0
# increment_version -t 1.2.9 2 4  # 1.3
# increment_version 1.2.9 last 4  # 1.2.9.1


prlist=$(gh pr list --json number,body)
if [ "$prlist" != "[]" ]; then
  printf "ERROR - there are open pull requests - close them first\n\n"
  gh pr list
  exit 1
fi

preprodv=$(git tag -l --points-at preprod | grep -E '^([^.]*\.[^.]*){2}$') 
printf "current preprodv: $preprodv\n"
prodv=$(git tag -l --points-at preprod | grep -E '^([^.]*\.[^.]*){1}$') 
# if preprod also has a prod version - use that one to calculate next preprod version 
# as preprod and prod are aligned at that moment and we need bump the second v number 
if [ "$prodv" != "" ]; then
  printf "preprod and prod are aligned - $preprodv = $prodv -> bumping version number for preprod\n"
  preprodv="$prodv"
fi
version="v$(increment_version -t ${preprodv:1} 3)"
message="release $(date +"%Y-%m-%d %T")"
printf "will tag this commit with $version and $message\n\n"

# ask user if all OK 
while true
do
  read -p "OK (y/n)? " answer
  case $answer in
   [yY]* ) printf "deploying in preprod ! ...\n"
           break;;

   [nN]* ) printf "Cancelling\n"
           exit;;
   
   * )     printf "enter Y or N\n\n";;
  esac
done

stash=$(git stash) || { printf "can't git stash\n"; exit 2; }
git fetch || { printf "can't git fetch\n"; exit 3; }
git checkout main || { printf "can't checkout main\n"; exit 4; }
git pull origin main --ff-only || { printf "can't git pull main\n"; exit 5; }
git branch -f preprod main || { printf "can't align preprod with main\n"; exit 6; }
git push -f origin preprod || { printf "can't force push preprod to main repo\n"; exit 7; }
git tag -a "$version" -m "$message" || { printf "can't tag this commit with $version\n"; exit 8; }
git push origin "$version" || { printf "can't push tag $version to remote origin\n"; exit 9; }
if [ "$stash" != "No local changes to save" ]; then 
  echo "do a 'git stash pop' to get source back"
fi