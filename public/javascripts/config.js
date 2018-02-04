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
        },
        repository: {
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

  var text = '<h3>Supporting human mobility by data mobility</h3>' +
    '<p>New mobility concepts and better data networking are both crucial factors for global economic development. To invent innovative and sustainable mobility concepts, new data-based value-added services are required.</p>' +
    '<p>For example:</p>' +
    '<ul>' +
    '<li>' +
    '<h4>Route Planning</h4>' +
    '<p>Route planning taking into account places of interest, energy saving aspects (e.g. for electric vehicles) or complex travel arrangements</p>' +
    '</li>' +
    '<li>' +
    '<h4>Multimodal Mobility</h4>' +
    '<p>Linking various multimodal mobility services with regard to complex environment conditions and current or forecast events like weather or traffic volume</p>' +
    '</li>' +
    '<li>' +
    '<h4>Alternative Scenarios</h4>' +
    '<p>Dynamic and interactive planning of alternative mobility services in the event of unforeseen circumstances (e.g. breakdown in public transport, congestions)</p>' +
    '</li>' +
    '</ul>' +
    '<p>To implement such innovative data-based services for mobility support it is necessary to link and integrate data coming from a vast number of different sources. Some examples are map data, vehicle data, weather data, mobility' +
    'service descriptions or events information. These data sets come from various stakeholders and organisations and they often have proprietary data structures.</p>' +
    '<p>Our goal is to significantly improve the data mobility between all stakeholders by providing a standardized vocabulary using Semantic Web technologies and ontologies. For the open vocabulary covering various mobility aspects we' +
    'use RDF (Resource Description Framework) - a recommended specification of the World Wide Web Consortium (W3C) and the so-called lingua franca for the integration of data and web. We invite everyone who is interested to join our' +
    'MobiVoc initiative and to participate in the development of the Open Mobility Vocabulary.</p>' +
    '<p><img alt="Logo: ITA" src="http://www.ita-int.org/wp-content/uploads/2015/07/ita_logo_left_small-110x59.png" style="height:22px; width:40px" /></p>' +
    '<p>MobiVoc is a project of <a href="http://www.ita-int.org">ITA</a> in cooperation with our <a href="partners.html">partners</a>.</p>' +
    '<p>Click <a target="_blank" href="https://github.com/lavhal/testProj">here</a> for more about GitHub repository.</p>'

  $('textarea').html(text);
  CKEDITOR.replace('editor1');
  //CKEDITOR.instances['#editor1'].updateElement();
  //alert($('.ckeditor').val());
  $('#text').val(text);
  CKEDITOR.instances['editor1'].on('change', function() {
    $('#text').val(CKEDITOR.instances.editor1.getData());
  });
