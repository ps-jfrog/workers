import { PlatformContext } from 'jfrog-workers';
import { AfterCreateRequest, AfterCreateResponse } from './types';

export default async (context: PlatformContext, data: AfterBuildInfoSaveRequest): Promise<AfterBuildInfoSaveResponse> => {
    try {
        // The HTTP client facilitates calls to the JFrog Platform REST APIs
        //To call an external endpoint, use 'await context.clients.axios.get("https://foo.com")'
        // const buildName: String = data.build.name; // "spring-petclinic"; // context.secrets.get("buildName"); // "spring-petclinic"
        const buildName: String = data.build.name; // "spring-petclinic"; // context.secrets.get("buildName"); // "spring-petclinic"
        console.log("buildName: " + JSON.stringify(data));
        var dateDisplay = new Date(Date.now() - (new Date().getTimezoneOffset() * 1000 * 60)).toJSON().slice(0, 19).replace("T", " ");
        console.log("dateDisplay: " + dateDisplay);
        // console.log("buildName: "+ buildName );
        const buildsJson = await context.clients.platformHttp.get("/artifactory/api/build/" + buildName);
        console.log(buildsJson);

        // You should reach this part if the HTTP request status is successful (HTTP Status 399 or lower)
        if (buildsJson.status === 200) {
            // GET last 2 Builds. ref https://jfrog.com/help/r/jfrog-rest-apis/build-runs
            const buildsNumbers = buildsJson.data.buildsNumbers;
            let buildsNumbersLen = buildsNumbers.length;
            console.log("Build numbers lenght: " + buildsNumbersLen);
            let recentBuild: string | null = null;
            let lastBuild: string | null = null;
            console.log("Build numbers >2: " + (buildsNumbersLen >= 2));

            if (buildsNumbersLen > 2) {
                recentBuild = (buildsNumbers[0].uri).substring(1);
                lastBuild = (buildsNumbers[1].uri).substring(1);
            }  // if (buildsNumbers.length > 2)
            console.log("Recent Build: " + recentBuild + "   is empty: " + !isEmpty(recentBuild));
            console.log("lastBuild Build: " + lastBuild + "   is empty: " + !isEmpty(lastBuild));

            if (!isEmpty(recentBuild) && !isEmpty(lastBuild)) {
                // https://jfrog.com/help/r/jfrog-rest-apis/builds-diff
                let diffPathUrl: String = ("/artifactory/api/build/" + buildName + "/" + recentBuild + "?diff=" + lastBuild);
                console.log("Diff Path: " + diffPathUrl);
                const buildDiffJson = await context.clients.platformHttp.get(`${diffPathUrl}`);
                if (buildDiffJson.status === 200) {
                    console.log(buildDiffJson);

                } // if (buildDiffJson.status === 200)
            } // if (!isEmpty(recentBuild) && !isEmpty(lastBuild)) 

        } else {
            console.warn(`Request was successful and returned status code : ${buildsJson.status}`);
        } // if (buildsJson.status === 200)
    } catch (error) {
        // The platformHttp client throws PlatformHttpClientError if the HTTP request status is 400 or higher
        console.error(`Request failed with status code ${error.status || "<none>"} caused by : ${error.message}`);
    } // try - catch

    return {
        message: "proceed",
    };
};

function isEmpty(value) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
}
