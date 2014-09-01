var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/:projectname', function (req, res) {
    // projectname is set by the request's URL
    var projectname = req.params.projectname;

    // set up pathname vars
    var path = process.cwd() + "/public/projects/" + projectname;
    var jsonpath = path + "/project.json";

    // check if the JSON file exists.
    if (fs.existsSync(jsonpath)) {
        var projectdata = require(jsonpath);
        console.log(projectdata);
        res.render('project', {
            name: projectname,
            data: projectdata
        });
    } else {
        res.send("404 - project does not exist");
    }
});

module.exports = router;
