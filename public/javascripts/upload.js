$(document).ready(function(){

  $('#submit_pic').on('click', function (){
    var radioValue = $('input:radio[name=album_name]:checked').val();
    $("#selected-album").append(radioValue);
    $('#postalbum').hide();
  });


  $('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
  });


  $('#upload-input').on('change', function(){
    var files = $(this).get(0).files;
    if (files.length > 0){
      // One or more files selected, process the file upload

      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();

      // loop through all the selected files
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          // add the files to formData object for the data payload
          // for some reason uploads[] is the "name" of the file input
         formData.append('uploads[]', file, file.name);
        }

      $.ajax({
        url: '/upload',
        type: 'POST',
        // The data sent is the formData object we constructed
        data: formData,
        // processData to false : stops jQuery from attempting to convert the formData object to a string
        processData: false,
        // contentType false : jQuery not to add a Content-Type header for us
        contentType: false,
        success: function(data){
            console.log('upload successful!');
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('Done');
              }

            }

          }, false);

          return xhr;
        }
      });
    }
  });





});
