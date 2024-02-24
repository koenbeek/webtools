# GIT

## Branches

- main - main/central branch
  - github currently uses this branch to publish the docs folder on https://webtools.t00ls.eu
- feat-issuenbr-title - feature branches
- cont-issuenbr-title - content branches
- bf-issuenbr-title - bugfix branches
- preprod and prod branches will be used in the future

## GIT flow
### feature, bugfix and content branches

The main git flow used is based on [Github's flow](https://docs.github.com/en/get-started/quickstart/github-flow)

1. For any new changes (features, content, bugfix) a new branch is created from the main branch.
1. Any changes to this new branch can be commited/pushed to the github repo.
1. Once the changes are ready, a pull request into main is created after merging the main branch into the new branch. The pr mentions it closes the issue nbr : "closes #nbr" -> github will close the issue automatically once the pr is accepted
1. The pull request is accepted and squashed (ff only) into main
1. The original branch is deleted.  

Following scripts are used for this process [git_newdev.sh](/bin/git_newdev.sh) and [git_closedev.sh](/bin/git_closedev.sh)

### preprod and prod branches

The git flow for deployment is still under review - currently only main branch is used for deployment

## Tags - future use

releases to preprod and prod will be tagged with version numbers

each release to preprod gets a version number of type vm.n.o with o increased at each release in preprod - f.ex. v1.2.3, v1.2.4, v1.2.5 ...

each release to prod gets a version number of type vm.n with n increased at each release in prod - f.ex. v1.2, v1.3, v1.4 ...

once a release is done to prod (always from preprod) - the preprod version gets aligned with the prod version - f.ex. v1.2.3 -> v1.2.4 (preprod release) -> v1.3 (prod release) -> v1.3.1 (preprod release) -- v1.2.4 and v1.3 are the same version

increases in major release number will be handled manually by tagging the specific commit

## Deployment process

github automatically publishes the [docs folder from the main branch](https://github.com/koenbeek/webtools/tree/main/docs)