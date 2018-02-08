$('.ui.checkbox').checkbox();
$('.ui.accordion').accordion();

// form validation
$('.ui.form')
  .form({
    fields: {
      vocabularyName: {
        identifier: 'vocabularyName',
        rules: [{
          type: 'empty',
          prompt: 'You must give the vocabulary name'

        }]
      },repository: {
        identifier: 'repository',
        rules: [{
          type: 'empty',
          prompt: 'You must fill the repository name'
        }]
      },
      server: {
        identifier: 'server',
        rules: [{
          type: 'empty',
          prompt: 'The server URL is missing'
        }]
      },
      adminUsername: {
        identifier: 'adminUsername',
        rules: [{
          type: 'empty',
          prompt: 'You must give an admin username'
        }]
      },
      adminPass: {
        identifier: 'adminPass',
        rules: [{
          type: 'empty',
          prompt: 'You must give an admin password'
        }]
      },
      branchName: {
        identifier: 'branchName',
        rules: [{
          type: 'empty',
          prompt: 'You must give the github branch name'
        }]
      },
      username: {
        identifier: 'username',
        rules: [{
          type: 'empty',
          prompt: 'The user name is missing'
        }]
      },
      password: {
        identifier: 'password',
        rules: [{
            type: 'empty',
            prompt: 'password cannot be empty'
          },
          {
            type: 'minLength[6]',
            prompt: 'Your password must be at least {ruleValue} characters'
          }
        ]
      }
    }
  });

// reset button is clicked to reset the form
$('#restBtn').on('click', function(event) {
  event.preventDefault();
  location.reload("./config");
});

CKEDITOR.replace( 'editor', {
    extraPlugins : 'confighelper'
 });
CKEDITOR.instances['editor'].on('change', function() {
  $('#text').val(CKEDITOR.instances.editor.getData());
});
