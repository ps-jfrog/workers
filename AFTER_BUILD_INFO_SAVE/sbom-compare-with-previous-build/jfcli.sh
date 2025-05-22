# TOKEN SETUP
# jf c add --user=krishnam --interactive=true --url=https://psazuse.jfrog.io --overwrite=true 

# Config - Artifactory info
export JF_HOST="psazuse.jfrog.io"   # JF_ACCESS_TOKEN="<GET_YOUR_OWN_KEY>"
export JFROG_CLI_LOG_LEVEL="DEBUG" RT_REPO_NPM_VIRTUAL="krishnam-worker-virtual" 
export JF_RT_URL="https://${JF_HOST}" BUILD_NAME="sbom-compare-with-previous-build" BUILD_ID="cmd.$(date '+%Y-%m-%d-%H-%M')" 

echo " JF_RT_URL: $JF_RT_URL \n JFROG_CLI_LOG_LEVEL: $JFROG_CLI_LOG_LEVEL \n "
echo " BUILD_NAME: $BUILD_NAME \n BUILD_ID: $BUILD_ID \n RT_REPO_NPM_VIRTUAL: $RT_REPO_NPM_VIRTUAL"

jf npmc --global --repo-resolve ${RT_REPO_NPM_VIRTUAL} --repo-deploy ${RT_REPO_NPM_VIRTUAL}
jf npm cache clean --force

jf worker deploy 