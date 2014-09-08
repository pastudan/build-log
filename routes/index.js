var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    _ = require('lodash'),
    router = express.Router();


/* GET home page. */
router.get('/:projectName', function (req, res) {


    // projectName is set by the request's URL
    var projectName = req.params.projectName;

    // set up projectPathname vars
    var projectPath = process.cwd() + "/public/projects/" + projectName + "/";
    var jsonProjectPath = projectPath + "project.json";


    // check if the JSON file exists.
    if (fs.existsSync(jsonProjectPath)) {
        var projectData = require(jsonProjectPath);
        var finishedGlobbing = _.after(projectData.steps.length, doRender);
        for (i=0; i<projectData.steps.length; i++){
            //creating a closure to get the value of i after the glob finishes
            (function (i) {
                imgIndex = i+1;
                glob(projectPath + "img/" + imgIndex + ".*.jpg", function (err, files){
                    projectData.steps[i].thumbs = [];
                    if (files.length > 1){
                        for (j=0; j<files.length; j++){
                            projectData.steps[i].thumbs.push(path.basename(files[j]));
                        }
                    }
                    finishedGlobbing();
                })
            })(i);
        }
    } else {
        res.send("404 - project does not exist");
    }

    function doRender(){
        res.render('project', {
            name: projectName,
            data: projectData
        });
    }
});


router.post('/api', function (req, res) {

});

module.exports = router;
