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
    var projectPath = path.join(process.cwd(), "/public/projects/", projectName);
    var jsonProjectPath = path.join(projectPath, "project.json");


    // check if the JSON file exists.
    if (fs.existsSync(jsonProjectPath)) {
        var projectData = require(jsonProjectPath);
        var finishedGlobbing = _.after(projectData.steps.length, render);
        for (i=0; i<projectData.steps.length; i++){
            //creating a closure to get the value of i after the glob finishes
            (function (i) {
                imgIndex = ''+i+1;
                glob(path.join(projectPath, "img/", imgIndex, ".*.jpg"), function (err, files){
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

    function render(){
        res.render('project', {
            name: projectName,
            data: projectData
        });
    }
});


router.post('/:projectName/step', function (req, res) {
    //todo: check the user's auth
    var projectName = req.params.projectName;
    var date = new Date();
    console.log(projectName, date.toISOString(), req.body);

    var response = {
        error: 'none'
    }
    res.send(response);
});

//router.post('/:projectName/upload', function (req, res) {
//    //todo: check the user's auth
//    var projectName = req.params.projectName;
//    console.log(projectName, req.files)
//    res.send('success?');
//});

router.post('/:projectName/upload', function(req, res) {
    //todo: auth user
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        projectName="projector";
        filepath = path.join(process.cwd(), "/public/projects/", projectName, '/files/' + filename);
        fstream = fs.createWriteStream(filepath);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});

module.exports = router;
