$(function () {
    var $content = $('#content');
    var imgPath = $content.data('img-path');
    var projectName = $content.data('project-name');
    $('.thumbs').on('mouseenter mouseleave click', 'img.thumb', function(){
        var $this = $(this);
        var imgId = $this.data('img-id');
        $this.parents('li.step').children('img.main').attr('src', imgPath + imgId)
    });

    $('.add-step .button').on('click', function(){
        var $this = $(this);
        var position = $this.data('step-position');
        var newStepTemplate = $('#new-step-template').text()
            .replace('{{position}}', position)
            .replace('{{step-number}}', "8");
        if (position == 'beginning'){
            $(this).parent().after(newStepTemplate).find('input.name').focus()
        } else {
            $(this).parent().before(newStepTemplate)
        }
        $("div.main").fineUploader({
            request: {
                endpoint: projectName + '/upload'
            }
        });
    })
});