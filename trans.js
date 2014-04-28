if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "번역할꺼면 버튼을 눌러봐";
  };

  Template.hello.events({
    'click input': function (e,tmpl) {

        $(e.target).attr('value','작업중이니까 기다리기...');

        Meteor.call('transFiles',function(err,data){
            alert(data.msg);
            $(e.target).attr('value','여기를 누르면 번역이됨');
        })
    }
  });
}

